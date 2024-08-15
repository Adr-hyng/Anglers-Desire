import { TicksPerSecond, system, BlockTypes } from "@minecraft/server";
import { fishingCallingLogMap, fetchFisher } from "constant";
import { SERVER_CONFIGURATION } from "fishing_system/configuration/config_handler";
import { ExecuteAtGivenTick, Logger, StateController, Timer } from "utils/index";
import { onHookedItem } from "./on_hook_item";
import { overrideEverything } from "overrides/index";
import { MinecraftBlockTypes } from "vanilla-types/index";
overrideEverything();
const HOOK_SUBMERGE_OFFSET = 0.2;
export async function onHookLanded(player) {
    const fisher = fetchFisher(player);
    const oldLog = fishingCallingLogMap.get(player.id);
    fishingCallingLogMap.set(player.id, Date.now());
    if ((oldLog + 500) >= Date.now())
        return;
    const isInWater = await requestHookOnWater();
    async function requestHookOnWater() {
        return new Promise((resolve) => {
            const isHookStabilized = (velX, velY, velZ) => Math.round(velX * 100) / 100 === -0.00 &&
                Math.round(velY * 100) / 100 === -0.05 &&
                Math.round(velZ * 100) / 100 === -0.00;
            const isBobberPositionValid = (currentFishingHook) => !fisher.initialHookPosition &&
                currentFishingHook.dimension.getBlock(currentFishingHook.location).type !== BlockTypes.get(MinecraftBlockTypes.BubbleColumn);
            const isHookInGround = (velX, velY, velZ) => velX === 0 && velY === 0 && velZ === 0;
            const inWaterIndicator = system.runInterval(() => {
                Logger.info("IN WATER INDICATOR RUNNING. ID=", inWaterIndicator);
                let onHookStablized = false;
                try {
                    const currentFishingHook = fisher.fishingHook;
                    if (!currentFishingHook)
                        throw new Error("Fishing hook not found / undefined");
                    if (!fisher.fishingRod.isEquipped)
                        throw new Error("Fishing rod is not equipped while fishing");
                    if (fisher.isReeling())
                        throw new Error("The fishing rod was withdrawn from the mainhand");
                    if (fisher.fishCaught)
                        throw new Error("A Fish is already caught");
                    const { x, y, z } = currentFishingHook.getVelocity();
                    if (isHookStabilized(x, y, z) && isBobberPositionValid(currentFishingHook)) {
                        fisher.initialHookPosition = currentFishingHook.location;
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
    const expirationTimer = new Timer(SERVER_CONFIGURATION.expirationTimer * TicksPerSecond);
    let isDeeplySubmerged = false;
    let isHookSubmerged = false;
    const FishingStateIndicator = fisher.fishingOutputMap();
    const hookSubmergeState = new StateController(isHookSubmerged);
    const initialHookPosition = fisher.initialHookPosition;
    let luckOfTheSeaLevel = fisher.fishingRod.getLuckOfSea()?.level ?? 0;
    let lureLevel = fisher.fishingRod.getLure()?.level ?? 0;
    let tuggingEvent = system.runInterval(async () => {
        try {
            const hookEntity = fisher.fishingHook;
            const caughtFish = fisher.fishCaught;
            if (fisher.isReeling()) {
                if (hookSubmergeState.getCurrentValue())
                    onHookedItem(fisher, initialHookPosition, luckOfTheSeaLevel, isDeeplySubmerged);
                throw new Error("The fishing rod was withdrawn from the mainhand");
            }
            if (!fisher.fishingRod.isEquipped)
                throw new Error("Fishing rod is not equipped while fishing");
            if (!hookEntity)
                throw new Error("Fishing hook not found / undefined");
            if (!hookEntity.location)
                throw new Error("Fishing hook location is undefined");
            if (caughtFish)
                throw new Error("A Fish is already caught");
            luckOfTheSeaLevel = fisher.fishingRod.getLuckOfSea()?.level ?? 0;
            const { y } = hookEntity.location;
            isHookSubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - HOOK_SUBMERGE_OFFSET >= parseFloat(y.toFixed(2)));
            hookSubmergeState.setValue(isHookSubmerged);
            isDeeplySubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - 1.5 >= parseFloat(y.toFixed(2)));
            expirationTimer.update();
            Logger.info("FINDING INTERVAL RUNNING. ID=", tuggingEvent);
            if (ExecuteAtGivenTick(25) && !hookSubmergeState.getCurrentValue()) {
                FishingStateIndicator.Finding.run();
            }
            HookOnSubmergedForItemFishing();
            if (expirationTimer.isDone()) {
                FishingStateIndicator.NotFound.run();
                fisher.reset(true);
                throw new Error("AFK Fishing detected");
            }
        }
        catch (e) {
            Logger.error(e, e.stack);
            system.clearRun(tuggingEvent);
            return;
        }
    }, 1);
    function HookOnSubmergedForItemFishing() {
        if (hookSubmergeState.hasChanged()) {
            if (hookSubmergeState.getCurrentValue()) {
                FishingStateIndicator.Caught.run();
            }
            else { }
        }
    }
}
