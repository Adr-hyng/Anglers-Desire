import { EntityHealthComponent, system, EntityEquippableComponent, } from "@minecraft/server";
import { MinecraftEntityTypes } from "vanilla-types/index";
import { FishingState, ParticleState } from "types/index";
import { Random } from "utils/Random/random";
import { Logger, VectorContainer, StateController, } from "utils/index";
import { SERVER_CONFIGURATION, LootTable, FishingResultBuilder } from "fishing_system/index";
import { clientConfiguration } from "../configuration/client_configuration";
import { Vec3 } from "utils/Vector/VectorUtils";
const ReelingCompleteProcess = 0.96;
const FishingTimeInterval = 0.03;
class Fisher {
    constructor(player) {
        this._source = null;
        this.currentState = FishingState.IDLE;
        this.fishingHook = null;
        this.fishCaught = null;
        this.initialHookPosition = null;
        this.clientConfiguration = clientConfiguration;
        this.currentBiomeLootTable = Object.getOwnPropertyNames(LootTable).filter(prop => prop !== 'name' && prop !== 'prototype' && prop !== 'length');
        this.currentBiome = 0;
        this.particleSpawner = null;
        this.particleBuilder = null;
        this._source = player;
        this.reelingState = new StateController(false);
        this.particleBuilder = new VectorContainer(2);
        this._fishingOutputMap = {
            Finding: FishingResultBuilder.createActionResult(this.clientConfiguration.Finding, "Reelz.events.finding.text", ParticleState.FINDING, this),
            Interest: FishingResultBuilder.createActionResult(this.clientConfiguration.Interested, "Reelz.events.interested.text", ParticleState.INTERESTED, this),
            Caught: FishingResultBuilder.createActionResult(this.clientConfiguration.Caught, "Reelz.events.caught.text", ParticleState.CAUGHT, this),
            Escaped: FishingResultBuilder.createActionResult(this.clientConfiguration.Escaped, "Reelz.events.escaped.text", ParticleState.ESCAPED, this),
            NotFound: FishingResultBuilder.createActionResult(this.clientConfiguration.NotFound, "Reelz.events.notFound.text", ParticleState.NOT_FOUND, this)
        };
    }
    get fishingRod() {
        return this.source.getComponent(EntityEquippableComponent.componentId);
    }
    get source() {
        return this._source;
    }
    fishingOutputMap() {
        return this._fishingOutputMap;
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
    reelFish() {
        if (!this.source)
            return this;
        if (!this.fishCaught)
            return this;
        this.gainExperience().then((_) => { });
        const currentFish = this.fishCaught;
        const currentPlayer = this.source;
        if (currentFish.location.y >= currentPlayer.location.y)
            throw new Error("You cannot reel an entity at this angle. You need to be above it for the pulling force to be effective.");
        const fishHealth = currentFish.getComponent(EntityHealthComponent.componentId);
        let currentReelingProcess = 0;
        const startPoint = currentFish.location;
        const viewVector = currentPlayer.getViewDirection();
        const { x, y, z } = currentPlayer.location;
        const { x: viewX, z: viewZ } = new Vec3(viewVector.x, viewVector.y, viewVector.z).normalize();
        const endPoint = new Vec3(x - SERVER_CONFIGURATION.backDestinationOffset * viewX, y, z - SERVER_CONFIGURATION.backDestinationOffset * viewZ);
        const magnitude = endPoint.distance(startPoint);
        const controlPoint = new Vec3((startPoint.x + endPoint.x) / 2, startPoint.y + (magnitude * 1.65), (startPoint.z + endPoint.z) / 2);
        let reelingEventInterval = system.runInterval(() => {
            Logger.info("REELING INTERVAL RUNNING. ID=", reelingEventInterval);
            try {
                if (fishHealth?.currentValue <= 0)
                    throw new Error("Caught fish died while in mid air");
                if (currentReelingProcess >= ReelingCompleteProcess)
                    throw new Error("Fish successfully caught");
                currentReelingProcess += FishingTimeInterval;
                const point = Vec3.quadracticBezier(startPoint, controlPoint, endPoint, currentReelingProcess);
                let isReeling = currentFish.tryTeleport({ x: point.x, y: point.y, z: point.z }, { facingLocation: endPoint, keepVelocity: false, checkForBlocks: true });
                if (!isReeling)
                    throw new Error("Fish has collided to a block or was interrupted mid air");
            }
            catch (e) {
                Logger.error(e, e.stack);
                system.clearRun(reelingEventInterval);
                this.setState();
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
        this.setState()
            .setFishingHook()
            .setHookPosition()
            .setFishCaught();
        return this;
    }
    setState(state = FishingState.IDLE) {
        this.currentState = state;
        return this;
    }
    setFishingHook(hook = null) {
        this.fishingHook = hook;
        return this;
    }
    setHookPosition(hookLocation = null) {
        this.initialHookPosition = hookLocation;
        return this;
    }
    setFishCaught(fishCaught = null) {
        this.fishCaught = fishCaught;
        return this;
    }
    isReeling() {
        this.reelingState.setValue(this.currentState === FishingState.REEL);
        return this.reelingState.getCurrentValue();
    }
}
export { Fisher, FishingTimeInterval };
