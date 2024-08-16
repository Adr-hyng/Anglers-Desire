import { LootTableType } from "types/loot_table_type";
import { MinecraftEntityTypes, MinecraftItemTypes } from "vanilla-types/index";
import { ModifierResult } from "./types";



export class DefaultCatch {
  static loot (modifier: ModifierResult): LootTableType {
    return {
      "pools": [
        {
          "rolls": 1,
          "weight": 100 + ((85 - (modifier.LoTSModifier * 0.15)) - (modifier.deepnessModifier / 1.5)),
          "entries": [
            {
              "item": MinecraftItemTypes.Cod,
              "weight": 60,
              "toEntity": MinecraftEntityTypes.Cod
            },
            {
              "item": MinecraftItemTypes.Salmon,
              "weight": 25,
              "toEntity": MinecraftEntityTypes.Salmon
            },
            {
              "item": MinecraftItemTypes.TropicalFish,
              "weight": 2,
              "toEntity": MinecraftEntityTypes.Tropicalfish
            },
            {
              "item": MinecraftItemTypes.Pufferfish,
              "weight": 13,
              "toEntity": MinecraftEntityTypes.Pufferfish
            }
          ]
        },
        {
          "rolls": 1,
          "weight": 0 * ((10 - (modifier.LoTSModifier * 1.95)) + (modifier.deepnessModifier / 2)),
          "entries": [
            {
              "item": MinecraftItemTypes.LeatherBoots,
              "weight": 10,
              "setDurability": {
                "min": 0,
                "max": 0.90
              },
            },
            {
              "item": MinecraftItemTypes.Leather,
              "weight": 10
            },
            {
              "item": MinecraftItemTypes.Bone,
              "weight": 10
            },
            {
              "item": MinecraftItemTypes.Potion,
              "weight": 10
            },
            {
              "item": MinecraftItemTypes.String,
              "weight": 5
            },
            {
              "item": MinecraftItemTypes.FishingRod,
              "weight": 2,
              "setDurability": {
                "min": 0,
                "max": 0.90
              },
            },
            {
              "item": MinecraftItemTypes.Bowl,
              "weight": 10
            },
            {
              "item": MinecraftItemTypes.Stick,
              "weight": 5
            },
            {
              "item": MinecraftItemTypes.InkSac,
              "count": 10,
              "weight": 1,
            },
            {
              "item": MinecraftItemTypes.TripwireHook,
              "weight": 10
            },
            {
              "item": MinecraftItemTypes.RottenFlesh,
              "weight": 10
            }
          ]
        },
        {
          "rolls": 1,
          "weight": 0 * ((5 + (modifier.LoTSModifier * 2.1)) + modifier.deepnessModifier),
          "entries": [
            {
              "item": MinecraftItemTypes.NautilusShell,
              "weight": 5
            },
            {
              "item": MinecraftItemTypes.Waterlily,
              "weight": 5
            },
            {
              "item": MinecraftItemTypes.NameTag,
              "weight": 5
            },
            {
              "item": MinecraftItemTypes.Saddle,
              "weight": 5
            },
            {
              "item": MinecraftItemTypes.Bow,
              "weight": 5,
              "setDurability": {
                "min": 0,
                "max": 0.25
              },
              "setEnchantWithLevels": {
                "level": 30,
              },
            },
            {
              "item": MinecraftItemTypes.FishingRod,
              "weight": 5,
              "setDurability": {
                "min": 0,
                "max": 0.25
              },
              "setEnchantWithLevels": {
                "level": 30,
              },
            },
            {
              "item": MinecraftItemTypes.EnchantedBook,
              "weight": 6,
              "setEnchantWithLevels": {
                "level": 30,
              },
            }
          ]
        }
      ]
    }
  }
}