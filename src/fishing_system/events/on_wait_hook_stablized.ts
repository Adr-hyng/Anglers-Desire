import { Player, TicksPerSecond, system, BlockTypes} from "@minecraft/server";
import { onHookLandedCallingLogMap, fetchFisher, localFishersCache, onCaughtParticleLogMap, onLostParticleLogMap } from "constant";
import { Fisher } from "fishing_system/entities/fisher";
import { Logger, StateController, Timer } from "utils/index";

import {overrideEverything} from "overrides/index";
import { MinecraftBlockTypes } from "vanilla-types/index";
import { FishingHook } from "fishing_system/entities/hook";
import { serverConfigurationCopy } from "fishing_system/configuration/server_configuration";
import { onHookedItem } from "./on_hook_item";
overrideEverything();

const HOOK_SUBMERGE_OFFSET: number = 0.2;
const HOOK_TREASURE_OFFSET: number = 1.0;

export async function onHookLanded(player: Player): Promise<void> {
  let fisher: Fisher = fetchFisher(player);

  const oldLog = onHookLandedCallingLogMap.get(player.id) as number;
  onHookLandedCallingLogMap.set(player.id, Date.now());
  if ((oldLog + 500) >= Date.now()) return;

  const isInWater = await requestHookOnWater();

  async function requestHookOnWater(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const isHookStabilized = (velX: number, velY: number, velZ: number): boolean =>
        Math.round(velX * 100) / 100 === -0.00 &&
        Math.round(velY * 100) / 100 === -0.05 &&
        Math.round(velZ * 100) / 100 === -0.00;
      const isBobberPositionValid = (currentFishingHook: FishingHook): boolean =>
        !fisher.fishingHook.stablizedLocation &&
        currentFishingHook.dimension.getBlock(currentFishingHook.location).type !== BlockTypes.get(MinecraftBlockTypes.BubbleColumn);
      const isHookInGround: (velX: number, velY: number, velZ: number) => boolean = (velX, velY, velZ) => velX === 0 && velY === 0 && velZ === 0;
      const inWaterIndicator = system.runInterval(() => {
        Logger.info("IN WATER INDICATOR RUNNING. ID=", inWaterIndicator);
        let onHookStablized: boolean = false;
        try {
          const currentFishingHook: FishingHook = fisher.fishingHook;
          if (!currentFishingHook || !currentFishingHook?.isValid()) throw new Error("Fishing hook not found / undefined");
          if(fisher.caughtByHook || fisher.caughtByHook?.isValid()) throw new Error("A Fish is already caught");
          const { x, y, z } = currentFishingHook.getVelocity();
          if (isHookStabilized(x, y, z) && isBobberPositionValid(currentFishingHook)) {
            fisher.fishingHook.stablizedLocation = currentFishingHook.location;
            onHookStablized = true;
            throw new Error("Fishing hook has stabled position in water");
          } else if (isHookInGround(x, y, z)) {
            onHookStablized = false;
            throw new Error("Fishing Hook is stuck on ground");
          }
        } catch (e) {
          Logger.error(e, e.stack);
          system.clearRun(inWaterIndicator);
          resolve(onHookStablized);
        }
      }, 0.5 * TicksPerSecond);
    });
  }
  if(!isInWater) return;
  const expirationTimer = new Timer(parseInt(serverConfigurationCopy.expirationTimer.defaultValue as string) * TicksPerSecond);
  const delayValue = (fisher.fishingRod.upgrade.has("Tempus") ? 0.5 : 0.1);
  const delayTimer = new Timer(delayValue * TicksPerSecond); 

  const FishingStateIndicator = fisher.fishingOutputManager;
  const hookSubmergeState = new StateController(fisher.fishingHook.isSubmerged);
  const hookTreasureFoundState = new StateController(fisher.fishingHook.isDeeplySubmerged);
  const initialHookPosition = fisher.fishingHook.stablizedLocation;

  let tuggingEvent: number = system.runInterval( () => {
    try { 
      // Optimized this to be maintainable
      if(fisher.canBeReeled) {
        if(!delayTimer.isDone()) {
          delayTimer.update();
        } else {
          const oldLog = onLostParticleLogMap.get(player.id) as number;
          onLostParticleLogMap.set(player.id, Date.now());
          if ((oldLog + 150) >= Date.now()) return;

          FishingStateIndicator.Escaped.run();
          fisher.canBeReeled = false;
          delayTimer.reset();
        }
      }
      const hookEntity = fisher.fishingHook;
      const caughtFish = fisher.caughtByHook;
      if(!hookEntity || !hookEntity?.isValid()) throw new Error("Fishing hook not found / undefined");
      if(caughtFish || caughtFish?.isValid()) throw new Error("A Fish is already caught");

      fisher.fishingHook.isSubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - HOOK_SUBMERGE_OFFSET >= parseFloat(hookEntity.location.y.toFixed(2)));
      fisher.fishingHook.isDeeplySubmerged = (parseFloat(initialHookPosition.y.toFixed(2)) - HOOK_TREASURE_OFFSET >= parseFloat(hookEntity.location.y.toFixed(2)));
      hookSubmergeState.setValue(fisher.fishingHook.isSubmerged);
      hookTreasureFoundState.setValue(fisher.fishingHook.isDeeplySubmerged);
      expirationTimer.update();

      Logger.info("FINDING INTERVAL RUNNING. ID=", tuggingEvent);

      HookOnSubmergedForItemFishing();

      if(expirationTimer.isDone()){
        fisher.reset(true);
        player.runCommandAsync(`tellraw ${player.name} {"rawtext":[{"translate":"yn.fishing_got_reel.on_afk_detected"}]}`);
        throw new Error("AFK Fishing detected");
      }
    } catch (e){
      if((fisher.canBeReeled || fisher.fishingHook.isSubmerged) && !fisher.caughtByHook?.isValid()) onHookedItem(fisher);
      Logger.error(e, e.stack);
      system.clearRun(tuggingEvent);
      fisher.fishingHook.isSubmerged = false;
      fisher.canBeReeled = false;
      localFishersCache.set(player.id, fisher);
      FishingStateIndicator.Escaped.reset();
      return;
    }
  }, 1);

  function HookOnSubmergedForItemFishing(): void {
    if(hookSubmergeState.hasChanged()) {
      if(hookSubmergeState.getCurrentValue()) {
        const oldLog = onCaughtParticleLogMap.get(player.id) as number;
        onCaughtParticleLogMap.set(player.id, Date.now());
        if ((oldLog + 150) >= Date.now()) return;
        
        FishingStateIndicator.Caught.run();
        if(fisher.clientConfiguration.OnSubmergeSE.defaultValue) player.playSound('note.chime');
      } else { 
        fisher.canBeReeled = true;
      }
    }

    if(hookTreasureFoundState.hasChanged()) {
      if(hookTreasureFoundState.getCurrentValue()) {
        if(fisher.clientConfiguration.OnTreasureSE.defaultValue) player.playSound('random.orb');
      }
    }
  }
}

