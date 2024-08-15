import { TicksPerSecond, system, BlockTypes } from "@minecraft/server";
import { fishingCallingLogMap, fetchFisher } from "constant";
import { SERVER_CONFIGURATION } from "fishing_system/configuration/config_handler";
import { Logger, StateController, Timer } from "utils/index";
import { overrideEverything } from "overrides/index";
import { MinecraftBlockTypes } from "vanilla-types/index";
import server_configuration from "fishing_system/configuration/server_configuration";
overrideEverything();
const HOOK_SUBMERGE_OFFSET = 0.2;
export async function onHookLanded(player) {
    let fisher = fetchFisher(player);
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
            const isBobberPositionValid = (currentFishingHook) => !fisher.fishingHook.stablizedLocation &&
                currentFishingHook.dimension.getBlock(currentFishingHook.location).type !== BlockTypes.get(MinecraftBlockTypes.BubbleColumn);
            const isHookInGround = (velX, velY, velZ) => velX === 0 && velY === 0 && velZ === 0;
            const inWaterIndicator = system.runInterval(() => {
                Logger.info("IN WATER INDICATOR RUNNING. ID=", inWaterIndicator);
                let onHookStablized = false;
                try {
                    const currentFishingHook = fisher.fishingHook;
                    if (!currentFishingHook?.isValid())
                        throw new Error("Fishing hook not found / undefined");
                    if (!fisher.fishingRod.isEquipped)
                        throw new Error("Fishing rod is not equipped while fishing");
                    if (fisher.caughtByHook)
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
                    if (server_configuration.debug)
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
    const FishingStateIndicator = fisher.fishingOutputMap();
    const hookSubmergeState = new StateController(fisher.fishingHook.isSubmerged);
    const initialHookPosition = fisher.fishingHook.stablizedLocation;
    let luckOfTheSeaLevel = fisher.fishingRod.getLuckOfSea()?.level ?? 0;
    let lureLevel = fisher.fishingRod.getLure()?.level ?? 0;
    let tuggingEvent = system.runInterval(() => {
        try {
            const hookEntity = fisher.fishingHook;
            const caughtFish = fisher.caughtByHook;
            if (!fisher.fishingRod.isEquipped || !fisher.fishingRod?.isValid())
                throw new Error("Fishing rod is not equipped while fishing");
            if (!hookEntity || !hookEntity?.isValid())
                throw new Error("Fishing hook not found / undefined");
            if (caughtFish || caughtFish?.isValid())
                throw new Error("A Fish is already caught");
            fisher.fishingHook.isSubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - HOOK_SUBMERGE_OFFSET >= parseFloat(hookEntity.location.y.toFixed(2)));
            fisher.fishingHook.isDeeplySubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - 1.5 >= parseFloat(hookEntity.location.y.toFixed(2)));
            hookSubmergeState.setValue(fisher.fishingHook.isSubmerged);
            expirationTimer.update();
            Logger.info("FINDING INTERVAL RUNNING. ID=", tuggingEvent);
            HookOnSubmergedForItemFishing();
            if (expirationTimer.isDone()) {
                FishingStateIndicator.Escaped.run();
                fisher.reset(true);
                throw new Error("AFK Fishing detected");
            }
        }
        catch (e) {
            if (server_configuration.debug)
                Logger.error(e, e.stack);
            system.clearRun(tuggingEvent);
            FishingStateIndicator.Finding.reset().then((_) => { });
            return;
        }
    }, 1);
    function HookOnSubmergedForItemFishing() {
        if (hookSubmergeState.hasChanged()) {
            if (hookSubmergeState.getCurrentValue()) {
                FishingStateIndicator.Caught.run();
            }
            else {
                FishingStateIndicator.Escaped.run();
            }
        }
    }
}
