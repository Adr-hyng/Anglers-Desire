import { JungleCatch, DefaultCatch } from "./index";
import { MinecraftEntityTypes, MinecraftItemTypes } from "vanilla-types/index";
import { OceanCatch } from "./biomes/OceanCatch";
export class LootTable {
    static fishingModifier(LoTSLevel, isDeeplySubmerged = false) {
        const deepTreasureModifier = (isDeeplySubmerged ? 34.5 : 0);
        return { LoTSModifier: LoTSLevel, deepnessModifier: deepTreasureModifier };
    }
    static Anywhere(level, isDeeplySubmerged = false, fisher) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
            GeneralLoots: [
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
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Guardian
                }
            ]
        });
    }
    static DeepOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Guardian
                }
            ]
        });
    }
    static FrozenOcean(level, isDeeplySubmerged = false, fisher) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Guardian
                }
            ]
        });
    }
    static DeepFrozenOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Guardian
                }
            ]
        });
    }
    static ColdOcean(level, isDeeplySubmerged = false, fisher) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
                },
                {
                    "item": MinecraftItemTypes.Air,
                    "weight": 1,
                    "toEntity": MinecraftEntityTypes.Guardian
                }
            ]
        });
    }
    static DeepColdOcean(level, isDeeplySubmerged = false, fisher) {
        return OceanCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
    static Lukewarm(level, isDeeplySubmerged = false, fisher) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
            GeneralLoots: [
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
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), fisher, {
            GeneralLoots: [
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
}
