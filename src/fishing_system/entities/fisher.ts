import { 
    Entity, 
    EntityHealthComponent, 
    Player, 
    Vector3, 
    system, 
    EntityEquippableComponent,
    EntityItemComponent,
    EasingType,
} from "@minecraft/server";

import {MinecraftEntityTypes} from "vanilla-types/index";
import {ParticleState} from "types/index";

import {
    Random
} from "utils/Random/random";

import {
    Logger,
    StateController,
    VectorContainer,
} from "utils/index";
import { SERVER_CONFIGURATION, LootTable, FishingResultBuilder } from "fishing_system/index";
import { clientConfiguration, FormBuilder } from "../configuration/client_configuration";
import { Vec3 } from "utils/Vector/VectorUtils";
import { FishingStateTypes } from "fishing_system/output/fishing_output_indicator";
import { FishingHook } from "./hook";

const ReelingCompleteProcess: number = 0.96;
const FishingTimeInterval: number = 0.03; // 0.03 - Make this dependent in distance. Like at uprise it is fast, at middle to end it is slow.
class Fisher {
    private _source: Player = null;
    private _fishingOutputManager: FishingStateTypes;
    clientConfiguration: typeof clientConfiguration = clientConfiguration;
    
    fishingHook: FishingHook = null;
    caughtByHook: Entity = null;

    currentBiomeLootTable: Array<string> = Object.getOwnPropertyNames(LootTable).filter(prop => !['name', 'prototype', 'length', 'fishingModifier'].includes(prop));
    currentBiome: number = 0;

    particleSpawner: Entity = null;
    particleVectorLocations: VectorContainer = null;
    
    constructor(player: Player) {
        this._source = player;
        this.particleVectorLocations = new VectorContainer(2);
        this._fishingOutputManager = {
            "Caught": FishingResultBuilder.create(this.clientConfiguration.Caught, this),
            "Escaped": FishingResultBuilder.create(this.clientConfiguration.Escaped, this),
        };
    }

    get fishingRod(): EntityEquippableComponent {
        return this.source.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent;
    }
    
    public get source(): Player | null {
        return this._source;
    }
    
    public fishingOutputManager(): FishingStateTypes {
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
        if(!this.source) return this;
        if(!this.caughtByHook) return this;
        
        this.gainExperience().then((_)=> {});
        const currentEntityCaughtByHook = this.caughtByHook;
        const currentPlayer = this.source;

        if(currentEntityCaughtByHook.location.y >= currentPlayer.location.y) throw new Error("You cannot reel an entity at this angle. You need to be above it for the pulling force to be effective.");
        const fishHealth = (currentEntityCaughtByHook.getComponent(EntityHealthComponent.componentId) as EntityHealthComponent);
        let currentReelingProcess: number = 0;
        const startPoint: Vector3 = currentEntityCaughtByHook.location; // 1st point
        const viewVector: Vector3 = currentPlayer.getViewDirection();
        const {x, y, z}: Vector3 = currentPlayer.location;
        const {x: viewX, z: viewZ}: Vec3 = new Vec3(viewVector.x, viewVector.y, viewVector.z).normalize();
        
        const endPoint: Vec3 = new Vec3(x - SERVER_CONFIGURATION.backDestinationOffset * viewX, y, z - SERVER_CONFIGURATION.backDestinationOffset * viewZ); // 2nd point
        const magnitude: number = endPoint.distance(startPoint);
        const controlPoint = new Vec3( 
            (startPoint.x + endPoint.x) / 2,
            startPoint.y + (magnitude * 1.65),
            (startPoint.z + endPoint.z) / 2
        ); // 3rd point

        const reeledEntityOnAir = new StateController(false); // state controller for when reeled entity goes into air after being in water then spawn particle

        let reelingEventInterval: number = system.runInterval( async () => {
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
                        this.source.dimension.spawnParticle("yn:water_splash_exit", this.fishingHook.stablizedLocation);
                    } else {
                        await system.waitTicks(3);
                        this.source.dimension.spawnParticle("yn:water_splash_exit", this.fishingHook.stablizedLocation);
                    }
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
