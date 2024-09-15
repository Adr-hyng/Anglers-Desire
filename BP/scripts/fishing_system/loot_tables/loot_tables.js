import { JungleCatch, DefaultCatch } from "./index";
import { MinecraftEntityTypes, MinecraftItemTypes } from "vanilla-types/index";
import { OceanCatch } from "./biomes/OceanCatch";
import { CompatibleAddonHandler } from "./compatible_loot_manager";
import { TacosFishEntityTypes } from "fishing_system/entities/compatibility/tacos_fish_mobs";
export class LootTable {
    static fishingModifier(LoTSLevel, isDeeplySubmerged = false) {
        const deepTreasureModifier = (isDeeplySubmerged ? 34.5 : 0);
        return { LoTSModifier: LoTSLevel, deepnessModifier: deepTreasureModifier };
    }
    static Anywhere(level, isDeeplySubmerged = false, fisher) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Minnow
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Perch
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Bluegill
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Sunfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mooneye
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Bass
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Crappie
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Pumpkinseed
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Yellowbelly
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Sauger
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Walleye
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bowfin
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Papermouth
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Catfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Pickerel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Warmouth
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Muskie
                },
            ] : [
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
                    "item": MinecraftItemTypes.Pufferfish,
                    "weight": 15,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                }
            ]
        });
    }
    static Jungle(level, isDeeplySubmerged = false, fisher) {
        return JungleCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Tilapia
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Buffalo
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Yellowfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mojarra
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Moggel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Barramundi
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Piranha
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Guapote
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Gar
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Pavon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Blackfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Tambaqui
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Knifefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Arowana
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Mahseer
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Paddlefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.DollyVarden
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Arapaima
                }
            ] : [
                {
                    "item": MinecraftItemTypes.Cod,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Salmon,
                    "weight": 40,
                    "toEntity": MinecraftEntityTypes.Salmon
                }
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Axolotl
                }
            ]
        });
    }
    static Ocean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Anchovy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Sardine
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mackerel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Herring
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mullet
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Porgy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bonefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Drum
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Amberjack
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Oilfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Barracuda
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Ladyfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Roosterfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Opah
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Wahoo
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Anglerfish
                }
            ] : [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 25,
                    "toEntity": MinecraftEntityTypes.Salmon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 15,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                }
            ]
        });
    }
    static DeepOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Anchovy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Sardine
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mackerel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Herring
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mullet
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Porgy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bonefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Drum
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Amberjack
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Oilfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Barracuda
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Ladyfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Roosterfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Opah
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Wahoo
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Coelacanth
                }
            ] : [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 25,
                    "toEntity": MinecraftEntityTypes.Salmon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 15,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Guardian
                },
            ]
        });
    }
    static FrozenOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Anchovy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Sardine
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mackerel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Herring
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mullet
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Porgy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bonefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Drum
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Amberjack
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Oilfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Barracuda
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Ladyfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Roosterfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Opah
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Wahoo
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Coelacanth
                }
            ] : [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 25,
                    "toEntity": MinecraftEntityTypes.Salmon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 15,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                }
            ]
        });
    }
    static DeepFrozenOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Anchovy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Sardine
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mackerel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Herring
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mullet
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Porgy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bonefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Drum
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Amberjack
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Oilfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Barracuda
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Ladyfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Roosterfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Opah
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Wahoo
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Coelacanth
                }
            ] : [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 25,
                    "toEntity": MinecraftEntityTypes.Salmon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 15,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                }
            ]
        });
    }
    static ColdOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Anchovy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Sardine
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mackerel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Herring
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mullet
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Porgy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bonefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Drum
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Amberjack
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Oilfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Barracuda
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Ladyfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Roosterfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Opah
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Wahoo
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Anglerfish
                },
            ] : [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 25,
                    "toEntity": MinecraftEntityTypes.Salmon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 15,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                }
            ]
        });
    }
    static DeepColdOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Anchovy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Sardine
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mackerel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Herring
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mullet
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Porgy
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bonefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Drum
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Amberjack
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Oilfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Barracuda
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Ladyfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Roosterfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Opah
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Wahoo
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Anglerfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Coelacanth
                }
            ] : [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 25,
                    "toEntity": MinecraftEntityTypes.Salmon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 15,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Guardian
                }
            ]
        });
    }
    static Lukewarm(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Croaker
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Grunt
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Tarpon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Bluefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Crevalle
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Snook
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Flounder
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Pomfret
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Queenfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Grouper
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Tuna
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Needlefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Trevally
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Cobia
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Leerfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Pompano
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Marlin
                }
            ] : [
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
                    "item": MinecraftItemTypes.Pufferfish,
                    "weight": 13,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
                {
                    "item": MinecraftItemTypes.Pufferfish,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.Tropicalfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 5,
                    "toEntity": MinecraftEntityTypes.Tropicalfish
                }
            ]
        });
    }
    static DeepLukewarm(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Croaker
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Grunt
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Tarpon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Bluefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Crevalle
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Snook
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Flounder
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Pomfret
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Queenfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Grouper
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Tuna
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Needlefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Trevally
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Cobia
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Leerfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Pompano
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Marlin
                }
            ] : [
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
                    "item": MinecraftItemTypes.Pufferfish,
                    "weight": 13,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
                {
                    "item": MinecraftItemTypes.Pufferfish,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.Tropicalfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Guardian
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 5,
                    "toEntity": MinecraftEntityTypes.Tropicalfish
                }
            ]
        });
    }
    static WarmOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": MinecraftEntityTypes.Tropicalfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Bumper
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Lookdown
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Kahawai
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Yellowtail
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Permit
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Tripletail
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bonito
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.MahiMahi
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Snapper
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Threadfin
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Stonefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Hogfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Mola
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Lionfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Oarfish
                },
            ] : [
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
                    "item": MinecraftItemTypes.Pufferfish,
                    "weight": 13,
                    "toEntity": MinecraftEntityTypes.Pufferfish
                },
                {
                    "item": MinecraftItemTypes.Pufferfish,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.Tropicalfish
                },
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 2,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 5,
                    "toEntity": MinecraftEntityTypes.Tropicalfish
                }
            ]
        });
    }
    static MangroveSwamp(level, isDeeplySubmerged = false, fisher) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Tilapia
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Buffalo
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Yellowfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Mojarra
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Moggel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Barramundi
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Piranha
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Guapote
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Gar
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Pavon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Blackfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Tambaqui
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Knifefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Arowana
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Mahseer
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Paddlefish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.DollyVarden
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Arapaima
                }
            ] : [
                {
                    "item": MinecraftItemTypes.Cod,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Salmon,
                    "weight": 40,
                    "toEntity": MinecraftEntityTypes.Salmon
                }
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 15,
                    "toEntity": MinecraftEntityTypes.Tadpole
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": MinecraftEntityTypes.Frog
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Catfish
                },
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Axolotl
                }
            ]
        });
    }
    static LushCave(level, isDeeplySubmerged = false, fisher) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 40,
                    "toEntity": MinecraftEntityTypes.Salmon
                },
            ],
            SpecialRainLoots: [],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Axolotl
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 5,
                    "toEntity": MinecraftEntityTypes.Tropicalfish
                }
            ]
        });
    }
    static Taiga(level, isDeeplySubmerged = false, fisher) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: CompatibleAddonHandler.isInstalled("TacosFish") ? [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Smelt
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Carp
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Ide
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Shad
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": TacosFishEntityTypes.Asp
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 10,
                    "toEntity": MinecraftEntityTypes.Salmon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Bream
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Tench
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Grayling
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Trout
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Pike
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 6,
                    "toEntity": TacosFishEntityTypes.Nelma
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Barbel
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Sturgeon
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 3,
                    "toEntity": TacosFishEntityTypes.Stringfish
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Burbot
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": TacosFishEntityTypes.Mandarin
                }
            ] : [
                {
                    "item": MinecraftItemTypes.Cod,
                    "weight": 60,
                    "toEntity": MinecraftEntityTypes.Cod
                },
                {
                    "item": MinecraftItemTypes.Salmon,
                    "weight": 40,
                    "toEntity": MinecraftEntityTypes.Salmon
                }
            ],
            SpecialRainLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 11,
                    "toEntity": MinecraftEntityTypes.Squid
                }
            ],
            LuminousLoots: [
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.GlowSquid
                }
            ]
        });
    }
}
