import { Entity, MolangVariableMap, system } from "@minecraft/server";
import { fishers } from "constant";
import { Fisher } from "fishing_system/entities/fisher";
import { LootTable } from "fishing_system/loot_tables/loot_tables";
import { Logger } from "utils/index";
import {overrideEverything} from "overrides/index";
overrideEverything();

export function onHookedItem(fisher: Fisher) {
  const player = fisher.source;
  const molang = new MolangVariableMap();
  molang.setFloat('min_splash', 20);
  molang.setFloat('max_splash', 40);
  molang.setFloat('splash_spread', 2);
  molang.setFloat('splash_radius', 3);
  system.run(() => {
    try {
      if(fisher.fishingRod.damageDurability(5)) return;
      const hookLandedVector = fisher.fishingHook.stablizedLocation;
      const isDeeplySubmerged = fisher.fishingHook.isDeeplySubmerged;
      const enchantmentLevel = fisher.fishingRod.getLuckOfSea()?.level ?? 0;
      const drops: Entity[] = player.dimension.spawnLoot(LootTable[fisher.currentBiomeLootTable[fisher.currentBiome]](enchantmentLevel, isDeeplySubmerged), hookLandedVector);
      player.dimension.spawnParticle("yn:water_splash_exit", hookLandedVector, molang);
      fisher.setEntityCaughtByHook(drops[0]);
      fisher.reelHook();
      fishers.set(player.id, fisher);
    } catch (e) { 
      Logger.error(e.stack);
    };
  });
}