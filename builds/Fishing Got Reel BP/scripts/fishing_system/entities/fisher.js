import { EntityHealthComponent, system, EntityEquippableComponent, EntityItemComponent, } from "@minecraft/server";
import { MinecraftEntityTypes } from "vanilla-types/index";
import { Random } from "utils/Random/random";
import { Logger, StateController, VectorContainer, } from "utils/index";
import { LootTable, FishingOutputBuilder, ConfigurationCollections_DB, cloneConfiguration } from "fishing_system/index";
import { clientConfiguration } from "../configuration/client_configuration";
import { Vec3 } from "utils/Vector/VectorUtils";
import { FishingHook } from "./hook";
import { db } from "constant";
import { serverConfigurationCopy } from "fishing_system/configuration/server_configuration";
import { overrideEverything } from "overrides/index";
overrideEverything();
const CatchingLocalPosition = new Map([
    [serverConfigurationCopy.CatchingPlacement.values[0], 2],
    [serverConfigurationCopy.CatchingPlacement.values[1], 1],
    [serverConfigurationCopy.CatchingPlacement.values[2], 0],
]);
const ReelingCompleteProcess = 0.96;
const FishingTimeInterval = 0.03;
class Fisher {
    constructor(player) {
        this._source = null;
        this.particleSpawner = null;
        this.particleVectorLocations = null;
        this.fishingHook = null;
        this.caughtByHook = null;
        this.currentBiomeLootTable = Object.getOwnPropertyNames(LootTable).filter(prop => !['name', 'prototype', 'length', 'fishingModifier'].includes(prop));
        this.currentBiome = 0;
        this.canBeReeled = false;
        this._source = player;
        this.particleVectorLocations = new VectorContainer(2);
        this.clientConfiguration = cloneConfiguration(clientConfiguration);
        const configuration = db.get(ConfigurationCollections_DB(player, "CLIENT"));
        if (configuration) {
            Object.entries(configuration).forEach(([key, value]) => {
                this.clientConfiguration[key] = (value);
            });
        }
        this._fishingOutputManager = {
            "Caught": FishingOutputBuilder.create(this.clientConfiguration.Caught, this),
            "Escaped": FishingOutputBuilder.create(this.clientConfiguration.Escaped, this),
        };
    }
    get fishingRod() {
        return this.source.getComponent(EntityEquippableComponent.componentId);
    }
    get source() {
        if (!this._source?.isValid())
            throw new Error("No player found in fisher instance");
        return this._source;
    }
    get fishingOutputManager() {
        return this._fishingOutputManager;
    }
    async gainExperience() {
        const experience_gained = Random.randomInt(1, 6);
        return await new Promise((resolve) => {
            for (let i = 0; i < experience_gained; i++) {
                system.run(() => {
                    this.source.dimension.spawnEntity(MinecraftEntityTypes.XpOrb, this.source.location);
                });
            }
            resolve();
        });
    }
    reelHook() {
        if (!this.source || !this.source?.isValid())
            return this;
        if (!this.caughtByHook || !this.caughtByHook?.isValid())
            return this;
        this.gainExperience().then((_) => { });
        const currentEntityCaughtByHook = this.caughtByHook;
        const currentPlayer = this.source;
        if (currentEntityCaughtByHook.location.y >= currentPlayer.location.y)
            throw new Error("You cannot reel an entity at this angle. You need to be above it for the pulling force to be effective.");
        const fishHealth = currentEntityCaughtByHook.getComponent(EntityHealthComponent.componentId);
        let currentReelingProcess = 0;
        const startPoint = currentEntityCaughtByHook.location;
        const viewVector = currentPlayer.getViewDirection();
        const { x, y, z } = currentPlayer.location;
        const { x: viewX, z: viewZ } = new Vec3(viewVector.x, viewVector.y, viewVector.z).normalize();
        const CatchingPosition = CatchingLocalPosition.get(serverConfigurationCopy.CatchingPlacement.defaultValue) ?? 1;
        const endPoint = new Vec3(x - CatchingPosition * viewX, y, z - CatchingPosition * viewZ);
        const magnitude = endPoint.distance(startPoint);
        const controlPoint = new Vec3((startPoint.x + endPoint.x) / 2, startPoint.y + (magnitude * 1.65), (startPoint.z + endPoint.z) / 2);
        const reeledEntityOnAir = new StateController(false);
        let reelingEventInterval = system.runInterval(async () => {
            Logger.info("REELING INTERVAL RUNNING. ID=", reelingEventInterval);
            try {
                if (fishHealth?.currentValue <= 0)
                    throw new Error("Caught fish died while in mid air");
                if (currentReelingProcess >= ReelingCompleteProcess)
                    throw new Error("Fish successfully caught");
                if (!currentEntityCaughtByHook || !currentEntityCaughtByHook?.isValid())
                    throw new Error("Fish is not existing anymore");
                currentReelingProcess += FishingTimeInterval;
                const point = Vec3.quadracticBezier(startPoint, controlPoint, endPoint, currentReelingProcess);
                let isReeling = currentEntityCaughtByHook.tryTeleport({ x: point.x, y: point.y, z: point.z }, { facingLocation: endPoint, keepVelocity: false, checkForBlocks: true });
                reeledEntityOnAir.setValue(!currentEntityCaughtByHook.isInWater && !currentEntityCaughtByHook.isOnGround);
                if (reeledEntityOnAir.hasChanged() && reeledEntityOnAir.getCurrentValue()) {
                    if (currentEntityCaughtByHook.hasComponent(EntityItemComponent.componentId)) {
                        this.source.dimension.spawnParticle("yn:item_water_splash_exit", this.fishingHook.stablizedLocation);
                    }
                    else {
                        await system.waitTicks(3);
                        if (this.fishingRod.upgrade.has("Flamekissed"))
                            currentEntityCaughtByHook.setOnFire(5, false);
                        this.source.dimension.spawnParticle("yn:entity_water_splash_exit", this.fishingHook.stablizedLocation);
                    }
                    this.source.playSound('entity.generic.splash');
                }
                if (!isReeling)
                    throw new Error("Fish has collided to a block or was interrupted mid air");
            }
            catch (e) {
                Logger.error(e, e.stack);
                system.clearRun(reelingEventInterval);
                return this;
            }
        }, 1);
    }
    reset(killHook = false) {
        try {
            if (killHook)
                this.fishingHook?.kill();
        }
        catch (e) { }
        this.setFishingHook()
            .setEntityCaughtByHook();
        return this;
    }
    setFishingHook(hook = null) {
        this.fishingHook = new FishingHook(hook);
        return this;
    }
    setEntityCaughtByHook(fishCaught = null) {
        this.caughtByHook = fishCaught;
        return this;
    }
}
export { Fisher, FishingTimeInterval };
