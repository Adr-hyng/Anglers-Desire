import { MinecraftItemTypes } from "vanilla-types/index";
import { ParentCatchLoot } from "../biome_catch_helper";
import { MyCustomItemTypes } from "fishing_system/items/custom_items";
export class OceanCatch extends ParentCatchLoot {
    static Loot(modifier, fisher, entityLoots, RAIN_INCREASE = 150) {
        const upgrade = fisher.fishingRod.upgrade;
        this.initializeAttributes(fisher, RAIN_INCREASE, entityLoots);
        const fishWeight = ((85 - (modifier.LoTSModifier * 0.15)) - (modifier.deepnessModifier / 1.5)) * (upgrade.has("Nautilus") ? 0 : 1);
        const junkWeight = ((10 - (modifier.LoTSModifier * 1.95)) + (modifier.deepnessModifier / 2)) + (upgrade.has("Nautilus") ? 50 : 0);
        const treasureWeight = ((5 + (modifier.LoTSModifier * 2.1)) + modifier.deepnessModifier) + (upgrade.has("Nautilus") ? 15 : 0);
        return {
            "pools": [
                {
                    "rolls": 1,
                    "weight": fishWeight,
                    "entries": this.FilteredEntityEntry(),
                },
                {
                    "rolls": 1,
                    "weight": junkWeight,
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
                    "weight": treasureWeight,
                    "entries": [
                        {
                            "item": MyCustomItemTypes.MysteryBottle,
                            "weight": 5
                        },
                        {
                            "item": MinecraftItemTypes.AnglerPotterySherd,
                            "weight": 3
                        },
                        {
                            "item": MinecraftItemTypes.BladePotterySherd,
                            "weight": 3
                        },
                        {
                            "item": MinecraftItemTypes.ExplorerPotterySherd,
                            "weight": 3
                        },
                        {
                            "item": MinecraftItemTypes.MournerPotterySherd,
                            "weight": 3
                        },
                        {
                            "item": MinecraftItemTypes.PlentyPotterySherd,
                            "weight": 3
                        },
                        {
                            "item": MinecraftItemTypes.ShelterPotterySherd,
                            "weight": 3
                        },
                        {
                            "item": MinecraftItemTypes.SnortPotterySherd,
                            "weight": 3
                        },
                        {
                            "item": MinecraftItemTypes.NautilusShell,
                            "weight": 5
                        },
                        {
                            "item": MinecraftItemTypes.Seagrass,
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
        };
    }
}
