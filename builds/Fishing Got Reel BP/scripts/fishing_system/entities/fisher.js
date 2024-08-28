import { EntityHealthComponent, system, EntityEquippableComponent, EntityItemComponent, MolangVariableMap, TicksPerSecond, } from "@minecraft/server";
import { MinecraftEntityTypes } from "vanilla-types/index";
import { Random } from "utils/Random/random";
import { Logger, StateController, Timer } from "utils/index";
import { LootTable, FishingOutputBuilder, ConfigurationCollections_DB, cloneConfiguration } from "fishing_system/index";
import { clientConfiguration } from "../configuration/client_configuration";
import { Vec3 } from "utils/Vector/VectorUtils";
import { FishingHook } from "./hook";
import { db } from "constant";
import { serverConfigurationCopy } from "fishing_system/configuration/server_configuration";
import { overrideEverything } from "overrides/index";
overrideEverything();
const CatchingLocalPosition = new Map([
    [serverConfigurationCopy.CatchingPlacement.values[0], 1],
    [serverConfigurationCopy.CatchingPlacement.values[1], 2],
    [serverConfigurationCopy.CatchingPlacement.values[2], 0],
]);
const ReelingCompleteProcess = 0.96;
const FishingTimeInterval = 0.03;
class Fisher {
    constructor(player) {
        this._source = null;
        this.particleSpawner = null;
        this.fishingHook = null;
        this.caughtByHook = null;
        this.currentBiomeLootTable = Object.getOwnPropertyNames(LootTable).filter(prop => !['name', 'prototype', 'length', 'fishingModifier'].includes(prop));
        this.currentBiome = 0;
        this.canBeReeled = false;
        this._source = player;
        this._particleSplashMolang = new MolangVariableMap();
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
        return new Promise((resolve) => {
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
        const stablizedLocation = this.fishingHook.stablizedLocation;
        const fishHealth = currentEntityCaughtByHook.getComponent(EntityHealthComponent.componentId);
        let currentReelingProcess = 0;
        const startPoint = currentEntityCaughtByHook.location;
        const viewVector = currentPlayer.getViewDirection();
        const { x, y, z } = currentPlayer.location;
        const { x: viewX, z: viewZ } = new Vec3(viewVector.x, viewVector.y, viewVector.z).normalize();
        const CatchingPosition = CatchingLocalPosition.get(serverConfigurationCopy.CatchingPlacement.defaultValue) ?? 1;
        const endPoint = new Vec3(x - CatchingPosition * viewX, y, z - CatchingPosition * viewZ);
        const magnitude = endPoint.distance(startPoint);
        const controlPoint = new Vec3((startPoint.x + endPoint.x) / 2, startPoint.y + (magnitude * 1.35), (startPoint.z + endPoint.z) / 2);
        const reeledEntityOnAir = new StateController(false);
        let reelingEventInterval = system.runInterval(() => {
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
                        this._particleSplashMolang.setFloat("max_height", 1.3);
                        this._particleSplashMolang.setFloat("splash_spread", 100);
                        this._particleSplashMolang.setFloat("splash_radius", 2);
                        this._particleSplashMolang.setFloat("min_splashes", 10);
                        this._particleSplashMolang.setFloat("max_splashes", 17);
                        this.source.dimension.spawnParticle("yn:water_splash", stablizedLocation, this._particleSplashMolang);
                    }
                    else {
                        this._particleSplashMolang.setFloat("max_height", 1.9);
                        this._particleSplashMolang.setFloat("splash_spread", 100);
                        this._particleSplashMolang.setFloat("splash_radius", 2.8);
                        this._particleSplashMolang.setFloat("min_splashes", 20);
                        this._particleSplashMolang.setFloat("max_splashes", 35);
                        system.waitTicks(3).then(() => {
                            this.source.dimension.spawnParticle("yn:water_splash", stablizedLocation, this._particleSplashMolang);
                            if (this.fishingRod.upgrade.has("Pyroclasm"))
                                currentEntityCaughtByHook.setOnFire(5, true);
                            if (serverConfigurationCopy.caughtFishDespawns.defaultValue) {
                                const fishDespawnTimer = new Timer(parseInt(serverConfigurationCopy.caughtFishDespawnTimer.defaultValue + "") * TicksPerSecond);
                                const StartDespawnEventInterval = system.runInterval(() => {
                                    if (!currentEntityCaughtByHook || !currentEntityCaughtByHook?.isValid())
                                        system.clearRun(StartDespawnEventInterval);
                                    if (!serverConfigurationCopy.caughtFishDespawns.defaultValue)
                                        system.clearRun(StartDespawnEventInterval);
                                    if (fishDespawnTimer.isDone()) {
                                        currentEntityCaughtByHook.teleport({ x: 0, y: -70, z: 0 });
                                        system.clearRun(StartDespawnEventInterval);
                                    }
                                    fishDespawnTimer.update();
                                });
                            }
                        });
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
