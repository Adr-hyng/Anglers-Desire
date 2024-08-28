import { TicksPerSecond, system, BlockTypes } from "@minecraft/server";
import { onHookLandedCallingLogMap, fetchFisher, localFishersCache, onCaughtParticleLogMap, onLostParticleLogMap } from "constant";
import { Logger, SendMessageTo, StateController, Timer } from "utils/index";
import { overrideEverything } from "overrides/index";
import { MinecraftBlockTypes } from "vanilla-types/index";
import { serverConfigurationCopy } from "fishing_system/configuration/server_configuration";
import { onHookedItem } from "./on_hook_item";
overrideEverything();
const HOOK_SUBMERGE_OFFSET = 0.2;
const HOOK_TREASURE_OFFSET = 1.0;
export async function onHookLanded(player) {
    let fisher = fetchFisher(player);
    const oldLog = onHookLandedCallingLogMap.get(player.id);
    onHookLandedCallingLogMap.set(player.id, Date.now());
    if ((oldLog + 500) >= Date.now())
        return;
    const isInWater = await requestHookOnWater();
    async function requestHookOnWater() {
        return new Promise((resolve) => {
            const isBobberPositionValid = (currentFishingHook) => !fisher.fishingHook.stablizedLocation &&
                currentFishingHook.dimension.getBlock(currentFishingHook.location).type !== BlockTypes.get(MinecraftBlockTypes.BubbleColumn);
            const isHookInGround = (velX, velY, velZ) => velX === 0 && velY === 0 && velZ === 0;
            const inWaterIndicator = system.runInterval(() => {
                Logger.info("IN WATER INDICATOR RUNNING. ID=", inWaterIndicator);
                let onHookStablized = false;
                try {
                    const currentFishingHook = fisher.fishingHook;
                    if (!currentFishingHook || !currentFishingHook?.isValid())
                        throw new Error("Fishing hook not found / undefined");
                    if (fisher.caughtByHook || fisher.caughtByHook?.isValid())
                        throw new Error("A Fish is already caught");
                    const { x, y, z } = currentFishingHook.getVelocity();
                    if (isHookStabilized(x, y, z) && isBobberPositionValid(currentFishingHook)) {
                        fisher.fishingHook.stablizedLocation = currentFishingHook.location;
                        onHookStablized = true;
                        throw new Error("Fishing hook has stabled position in water");
                    }
                    else if (isHookInGround(x, y, z)) {
                        onHookStablized = false;
                        throw new Error("Fishing Hook is stuck on ground");
                    }
                }
                catch (e) {
                    Logger.error(e, e.stack);
                    system.clearRun(inWaterIndicator);
                    resolve(onHookStablized);
                }
            }, 0.5 * TicksPerSecond);
        });
    }
    if (!isInWater)
        return;
    const expirationTimer = new Timer(parseInt(serverConfigurationCopy.expirationTimer.defaultValue) * TicksPerSecond);
    const delayValue = (fisher.fishingRod.upgrade.has("Tempus") ? 0.5 : 0.1);
    const delayTimer = new Timer(delayValue * TicksPerSecond);
    const FishingStateIndicator = fisher.fishingOutputManager;
    const hookSubmergeState = new StateController(fisher.fishingHook.isSubmerged);
    const hookTreasureFoundState = new StateController(fisher.fishingHook.isDeeplySubmerged);
    const initialHookPosition = fisher.fishingHook.stablizedLocation;
    let tuggingEvent = system.runInterval(() => {
        try {
            const hookEntity = fisher.fishingHook;
            const caughtFish = fisher.caughtByHook;
            if (!hookEntity || !hookEntity?.isValid())
                throw new Error("Fishing hook not found / undefined");
            if (caughtFish || caughtFish?.isValid())
                throw new Error("A Fish is already caught");
            if (fisher.canBeReeled) {
                if (!delayTimer.isDone()) {
                    delayTimer.update();
                }
                else if (delayTimer.isDone()) {
                    let oldLog = onCaughtParticleLogMap.get(player.id);
                    if ((oldLog + 20) >= system.currentTick)
                        return;
                    oldLog = onLostParticleLogMap.get(player.id);
                    onLostParticleLogMap.set(player.id, system.currentTick);
                    if ((oldLog + 20) >= system.currentTick)
                        return;
                    delayTimer.reset();
                    FishingStateIndicator.Escaped.run();
                    fisher.canBeReeled = false;
                }
            }
            fisher.fishingHook.isSubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - HOOK_SUBMERGE_OFFSET >= parseFloat(hookEntity.location.y.toFixed(2)));
            fisher.fishingHook.isDeeplySubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - HOOK_TREASURE_OFFSET >= parseFloat(hookEntity.location.y.toFixed(2)));
            hookSubmergeState.setValue(fisher.fishingHook.isSubmerged);
            hookTreasureFoundState.setValue(fisher.fishingHook.isDeeplySubmerged);
            expirationTimer.update();
            Logger.info("FINDING INTERVAL RUNNING. ID=", tuggingEvent);
            HookOnSubmergedForItemFishing();
            if (expirationTimer.isDone()) {
                fisher.reset(true);
                player;
                SendMessageTo(player, {
                    rawtext: [
                        {
                            translate: 'yn.fishing_got_reel.on_afk_detected',
                            with: [player.name]
                        }
                    ]
                });
                throw new Error("AFK Fishing detected");
            }
        }
        catch (e) {
            if ((fisher.canBeReeled || fisher.fishingHook.isSubmerged) && !fisher.caughtByHook?.isValid())
                onHookedItem(fisher);
            Logger.error(e, e.stack);
            system.clearRun(tuggingEvent);
            fisher.fishingHook.isSubmerged = false;
            fisher.canBeReeled = false;
            localFishersCache.set(player.id, fisher);
            FishingStateIndicator.Escaped.reset();
            return;
        }
    }, 1);
    function HookOnSubmergedForItemFishing() {
        const hookEntityVelocity = fisher.fishingHook?.getVelocity();
        if (hookSubmergeState.hasChanged()) {
            if (hookSubmergeState.getCurrentValue()) {
                const oldLog = onCaughtParticleLogMap.get(player.id);
                onCaughtParticleLogMap.set(player.id, system.currentTick);
                if ((oldLog + 20) >= system.currentTick)
                    return;
                FishingStateIndicator.Caught.run();
                if (fisher.clientConfiguration.OnSubmergeSE.defaultValue)
                    player.playSound('note.chime');
            }
            else if (!hookSubmergeState.getCurrentValue() && !isHookStabilized(hookEntityVelocity.x, hookEntityVelocity.y, hookEntityVelocity.z)) {
                fisher.canBeReeled = true;
            }
        }
        if (hookTreasureFoundState.hasChanged()) {
            if (hookTreasureFoundState.getCurrentValue()) {
                if (fisher.clientConfiguration.OnTreasureSE.defaultValue)
                    player.playSound('random.orb');
            }
        }
    }
}
const isHookStabilized = (velX, velY, velZ) => {
    const roundedY_Velocity = Math.round(velY * 100) / 100;
    return Math.round(velX * 100) / 100 === -0.00 &&
        (roundedY_Velocity >= -0.06 && roundedY_Velocity <= -0.04) &&
        Math.round(velZ * 100) / 100 === -0.00;
};
