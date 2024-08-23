import { 
    Entity, 
    EntityHealthComponent, 
    Player, 
    Vector3, 
    system, 
    EntityEquippableComponent,
    EntityItemComponent,
    MolangVariableMap,
    EntityComponentTypes,
    EntityScaleComponent,
} from "@minecraft/server";

import {MinecraftEntityTypes} from "vanilla-types/index";

import {
    Random
} from "utils/Random/random";

import {
    Logger,
    SendMessageTo,
    StateController,
    VectorContainer,
} from "utils/index";
import { LootTable, FishingOutputBuilder, ConfigurationCollections_DB, cloneConfiguration } from "fishing_system/index";
import { clientConfiguration} from "../configuration/client_configuration";
import { Vec3 } from "utils/Vector/VectorUtils";
import { FishingHook } from "./hook";
import { IFishingOutput } from "fishing_system/outputs/IFishingOutput";
import { db } from "constant";
import { FormBuilder } from "utils/form_builder";
import { serverConfigurationCopy } from "fishing_system/configuration/server_configuration";
import { overrideEverything } from "overrides/index";

overrideEverything();

export type FishingStateTypes = {
    Caught: IFishingOutput;
    Escaped: IFishingOutput;
}

const CatchingLocalPosition = new Map([
    [serverConfigurationCopy.CatchingPlacement.values[0], 2], // Back
    [serverConfigurationCopy.CatchingPlacement.values[1], 1], // Default 
    [serverConfigurationCopy.CatchingPlacement.values[2], 0], // Front
]);

const ReelingCompleteProcess: number = 0.96;
const FishingTimeInterval: number = 0.03; 
class Fisher {
    private _source: Player = null;
    private _fishingOutputManager: FishingStateTypes;
    private _particleSplashMolang: MolangVariableMap;
    particleSpawner: Entity = null;
    particleVectorLocations: VectorContainer = null;
    clientConfiguration: typeof clientConfiguration;
    
    fishingHook: FishingHook = null;
    caughtByHook: Entity = null;

    currentBiomeLootTable: Array<string> = Object.getOwnPropertyNames(LootTable).filter(prop => !['name', 'prototype', 'length', 'fishingModifier'].includes(prop));
    currentBiome: number = 0;

    canBeReeled: boolean = false;
    
    constructor(player: Player) {
        this._source = player;
        this.particleVectorLocations = new VectorContainer(2);
        this._particleSplashMolang = new MolangVariableMap();
        this.clientConfiguration = cloneConfiguration(clientConfiguration);
        const configuration = db.get(ConfigurationCollections_DB(player, "CLIENT")); // unserialized data, need to be serialized
        // Copy only the values, if there's a configuration already.
        if(configuration) {
            Object.entries(configuration).forEach(([key, value]) => {
                this.clientConfiguration[key] = <FormBuilder<any>>(value);
            });
        } 
        this._fishingOutputManager = {
            "Caught": FishingOutputBuilder.create(this.clientConfiguration.Caught, this),
            "Escaped": FishingOutputBuilder.create(this.clientConfiguration.Escaped, this),
        };
    }

    get fishingRod(): EntityEquippableComponent {
        return this.source.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
    }
    
    public get source(): Player | null {
        if(!this._source?.isValid()) throw new Error("No player found in fisher instance");
        return this._source;
    }
    
    public get fishingOutputManager(): FishingStateTypes {
        return this._fishingOutputManager;
    }

    private async gainExperience(): Promise<void> {
        const experience_gained = Random.randomInt(1, 6);
        return await new Promise<void>((resolve) => {
            for(let i = 0; i < experience_gained; i++) {
                system.run(() => {
                    this.source.dimension.spawnEntity(MinecraftEntityTypes.XpOrb, this.source.location);
                });
            }
            resolve();
        });
    }

    public reelHook(): Fisher {
        if(!this.source || !this.source?.isValid()) return this;
        if(!this.caughtByHook || !this.caughtByHook?.isValid()) return this;
        
        this.gainExperience().then((_)=> {});
        const currentEntityCaughtByHook = this.caughtByHook;
        const currentPlayer = this.source;
        const stablizedLocation = this.fishingHook.stablizedLocation;
        
        const fishHealth = (currentEntityCaughtByHook.getComponent(EntityHealthComponent.componentId) as EntityHealthComponent);
        let currentReelingProcess: number = 0;
        const startPoint: Vector3 = currentEntityCaughtByHook.location; // 1st point
        const viewVector: Vector3 = currentPlayer.getViewDirection();
        const {x, y, z}: Vector3 = currentPlayer.location;
        const {x: viewX, z: viewZ}: Vec3 = new Vec3(viewVector.x, viewVector.y, viewVector.z).normalize();

        const CatchingPosition = CatchingLocalPosition.get(<string> serverConfigurationCopy.CatchingPlacement.defaultValue) ?? 1;
        
        const endPoint: Vec3 = new Vec3(x - CatchingPosition * viewX, y, z - CatchingPosition * viewZ); // 2nd point
        const magnitude: number = endPoint.distance(startPoint);
        const controlPoint = new Vec3( 
            (startPoint.x + endPoint.x) / 2,
            startPoint.y + (magnitude * 1.35),
            (startPoint.z + endPoint.z) / 2
        );

        const reeledEntityOnAir = new StateController(false); // state controller for when reeled entity goes into air after being in water then spawn particle

        let reelingEventInterval: number = system.runInterval( () => {
            Logger.info("REELING INTERVAL RUNNING. ID=", reelingEventInterval);
            try {
                if(fishHealth?.currentValue <= 0) throw new Error("Caught fish died while in mid air");
                if (currentReelingProcess >= ReelingCompleteProcess) throw new Error("Fish successfully caught");
                if (!currentEntityCaughtByHook || !currentEntityCaughtByHook?.isValid()) throw new Error("Fish is not existing anymore");
                
                currentReelingProcess += FishingTimeInterval;
                const point: Vector3 = Vec3.quadracticBezier(startPoint, controlPoint, endPoint, currentReelingProcess);
                
                let isReeling: boolean = currentEntityCaughtByHook.tryTeleport( { x: point.x, y: point.y, z: point.z}, { facingLocation: endPoint, keepVelocity: false, checkForBlocks: true } );
                reeledEntityOnAir.setValue(!currentEntityCaughtByHook.isInWater && !currentEntityCaughtByHook.isOnGround);
                if(reeledEntityOnAir.hasChanged() && reeledEntityOnAir.getCurrentValue()) {
                    if(currentEntityCaughtByHook.hasComponent(EntityItemComponent.componentId)){
                        this._particleSplashMolang.setFloat("max_height", 1.3);
                        this._particleSplashMolang.setFloat("splash_spread", 100);
                        this._particleSplashMolang.setFloat("splash_radius", 2);
                        this._particleSplashMolang.setFloat("min_splashes", 10);
                        this._particleSplashMolang.setFloat("max_splashes", 17);
                        this.source.dimension.spawnParticle("yn:water_splash", stablizedLocation, this._particleSplashMolang);
                    } else {
                        this._particleSplashMolang.setFloat("max_height", 1.9);
                        this._particleSplashMolang.setFloat("splash_spread", 100);
                        this._particleSplashMolang.setFloat("splash_radius", 2.8);
                        this._particleSplashMolang.setFloat("min_splashes", 20);
                        this._particleSplashMolang.setFloat("max_splashes", 35);
                        system.waitTicks(3).then(() => {
                            // Upgrade Effect - Use State Controller next time with custom made event system listener
                            this.source.dimension.spawnParticle("yn:water_splash", stablizedLocation, this._particleSplashMolang);
                            if(this.fishingRod.upgrade.has("Pyroclasm")) currentEntityCaughtByHook.setOnFire(5, true);
                        });
                        
                    }
                    this.source.playSound('entity.generic.splash');
                }
                if (!isReeling) throw new Error("Fish has collided to a block or was interrupted mid air");
            } catch (e) {
                Logger.error(e, e.stack);
                system.clearRun(reelingEventInterval);
                return this;
            }
        }, 1);
    }

    public reset(killHook: boolean = false): Fisher {
        try { if(killHook) this.fishingHook?.kill(); } catch (e) {}
        this.setFishingHook()
            .setEntityCaughtByHook();
        return this;
    }

    public setFishingHook(hook: Entity | null = null): Fisher {
        this.fishingHook = new FishingHook(hook);
        return this;
    }

    public setEntityCaughtByHook(fishCaught: Entity | null = null): Fisher {
        this.caughtByHook = fishCaught;
        return this;
    }
}

export { Fisher, FishingTimeInterval};
