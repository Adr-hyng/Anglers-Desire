import { MinecraftItemTypes } from "vanilla-types/index";
export class DefaultCatch {
    static loot(overallModifier) {
        return {
            "pools": [
                {
                    "rolls": 1,
                    "weight": 85 * (1 - overallModifier),
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
                    "weight": 10 * (1 - overallModifier),
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
                    "weight": 5 * (1 + overallModifier),
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
        };
    }
}
