import { TicksPerSecond, system, BlockTypes } from "@minecraft/server";
import { fishingCallingLogMap, fetchFisher, fishers } from "constant";
import { SERVER_CONFIGURATION } from "fishing_system/configuration/configuration_handler";
import { Logger, StateController, Timer } from "utils/index";
import { overrideEverything } from "overrides/index";
import { MinecraftBlockTypes } from "vanilla-types/index";
overrideEverything();
const HOOK_SUBMERGE_OFFSET = 0.2;
const HOOK_TREASURE_OFFSET = 1.0;
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
    const expirationTimer = new Timer(SERVER_CONFIGURATION.expirationTimer * TicksPerSecond);
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
            fisher.fishingHook.isSubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - HOOK_SUBMERGE_OFFSET >= parseFloat(hookEntity.location.y.toFixed(2)));
            fisher.fishingHook.isDeeplySubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - HOOK_TREASURE_OFFSET >= parseFloat(hookEntity.location.y.toFixed(2)));
            hookSubmergeState.setValue(fisher.fishingHook.isSubmerged);
            hookTreasureFoundState.setValue(fisher.fishingHook.isDeeplySubmerged);
            expirationTimer.update();
            Logger.info("FINDING INTERVAL RUNNING. ID=", tuggingEvent);
            HookOnSubmergedForItemFishing();
            if (expirationTimer.isDone()) {
                fisher.reset(true);
                player.runCommandAsync(`tellraw ${player.name} {"rawtext":[{"translate":"yn.fishing_got_reel.on_afk_detected"}]}`);
                throw new Error("AFK Fishing detected");
            }
        }
        catch (e) {
            Logger.error(e, e.stack);
            system.clearRun(tuggingEvent);
            fishers.set(player.id, fisher);
            FishingStateIndicator.Escaped.reset().then((_) => { });
            return;
        }
    }, 1);
    function HookOnSubmergedForItemFishing() {
        if (hookSubmergeState.hasChanged()) {
            if (hookSubmergeState.getCurrentValue()) {
                FishingStateIndicator.Caught.run();
                player.playSound('note.chime');
            }
            else {
                FishingStateIndicator.Escaped.run();
            }
        }
        if (hookTreasureFoundState.hasChanged()) {
            if (hookTreasureFoundState.getCurrentValue()) {
                player.playSound('random.orb');
            }
        }
    }
}
