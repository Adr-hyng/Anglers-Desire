import {RangeInternal, LootTableContent } from "types/index";
import { JungleCatch, DefaultCatch } from "./index";
import { HookUpgrades } from "fishing_system/upgrades/upgrades";
import { MinecraftEntityTypes, MinecraftItemTypes } from "vanilla-types/index";


export class LootTable {
  private static fishingModifier(LoTSLevel: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false) {
    const deepTreasureModifier = (isDeeplySubmerged ? 34.5 : 0);
    return {LoTSModifier: LoTSLevel, deepnessModifier: deepTreasureModifier};
  }
  // 0
  static Anywhere(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 1
  static Jungle(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return JungleCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 2
  static Ocean(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 3
  static DeepOcean(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 4
  static FrozenOcean(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 5
  static DeepFrozenOcean(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 6
  static ColdOcean(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 7
  static DeepColdOcean(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 8
  static Lukewarm(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 9
  static DeepLukewarm(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 10
  static WarmOcean(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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

  // 11
  static MangroveSwamp(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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
          "weight": 10,
          "toEntity": MinecraftEntityTypes.Tadpole
        },
        {
          "item": MinecraftItemTypes.Air,
          "weight": 5,
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

  // 12
  static LushCave(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade, {
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