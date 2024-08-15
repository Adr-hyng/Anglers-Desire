import { EnchantmentType, EnchantmentTypes } from "@minecraft/server";
import {overrideEverything} from "overrides/index";
overrideEverything();

/**
 * All possible MinecraftEnchantmentTypes with Custom properties
 */
export class EnchantmentRangeHandler implements EnchantmentTypes {
    private constructor() {
        throw new TypeError("Illegal constructor");
    };
    static get(typeName: string): EnchantmentType | undefined {
        return EnchantmentTypes.get(typeName);
    };
    static getAll(): EnchantmentType[] {
        return Object.getOwnPropertyNames(this).filter((prop) => !(['length', 'name', 'prototype', 'get', 'getAll'].includes(prop))).map((p) => this[p]);
    }

    static get AquaAffinity() { 
        return EnchantmentTypes.get("aqua_affinity")
        .setProperty(2, [
            {min: 1, max: 41}
        ]); 
    }
    static get BaneOfArthropods() { 
        return EnchantmentTypes.get("bane_of_arthropods")
        .setProperty(5, [
            {min: 5, max: 25}, 
            {min: 13, max: 33}, 
            {min: 21, max: 41}, 
            {min: 29, max: 49}, 
            {min: 37, max: 57}
        ], ["sharpness", "smite", "breach", "density"]); 
    }
    static get Binding() { 
        return EnchantmentTypes.get("binding")
        .setProperty(1, [
            {min: 25, max: 50}
        ]); 
    }
    static get BlastProtection() { 
        return EnchantmentTypes.get("blast_protection")
        .setProperty(2, [
            {min: 5, max: 13}, 
            {min: 13, max: 21}, 
            {min: 21, max: 29}, 
            {min: 29, max: 37}
        ], ["protection", "fire_protection", "projectile_protection"]); 
    }
    static get Breach() { 
        return EnchantmentTypes.get("breach")
        .setProperty(2, [
            {min: 15, max: 65}, 
            {min: 24, max: 74}, 
            {min: 33, max: 83}, 
            {min: 42, max: 92}
        ], ["density", "sharpness", "smite", "bane_of_arthropods"]); 
    }
    static get Channeling() { 
        return EnchantmentTypes.get("channeling")
        .setProperty(1, [
            {min: 25, max: 50}
        ], ["Riptide"]); 
    }
    static get DepthStrider() { 
        return EnchantmentTypes.get("depth_strider")
        .setProperty(2, [
            {min: 10, max: 25}, 
            {min: 20, max: 35}, 
            {min: 30, max: 45}
        ], ["frost_walker"]); 
    }
    static get Density() { 
        return EnchantmentTypes.get("density")
        .setProperty(5, [
            {min: 5, max: 25}, 
            {min: 13, max: 33}, 
            {min: 21, max: 41},
            {min: 29, max: 49},
            {min: 37, max: 57}
        ], ["breach", "bane_of_arthropods", "smite", "sharpness"]); 
    }
    static get Efficiency() { 
        return EnchantmentTypes.get("efficiency")
        .setProperty(10, [
            {min: 1, max: 51}, 
            {min: 11, max: 61}, 
            {min: 21, max: 71}, 
            {min: 31, max: 81}, 
            {min: 41, max: 91}
        ]); 
    }
    static get FeatherFalling() { 
        return EnchantmentTypes.get("feather_falling")
        .setProperty(5, [
            {min: 5, max: 11}, 
            {min: 11, max: 17}, 
            {min: 17, max: 23}, 
            {min: 23, max: 29}
        ]); 
    }
    static get FireAspect() { 
        return EnchantmentTypes.get("fire_aspect")
        .setProperty(2, [
            {min: 10, max: 60}, 
            {min: 30, max: 80}
        ]); 
    }
    static get FireProtection() { 
        return EnchantmentTypes.get("fire_protection")
        .setProperty(5, [
            {min: 10, max: 18}, 
            {min: 18, max: 26}, 
            {min: 26, max: 34}, 
            {min: 34, max: 42}
        ], ["protection", "blast_protection", "projectile_protection"]); 
    }
    static get Flame() { 
        return EnchantmentTypes.get("flame")
        .setProperty(2, [
            {min: 20, max: 50}
        ]); 
    }
    static get Fortune() { 
        return EnchantmentTypes.get("fortune")
        .setProperty(2, [
            {min: 15, max: 65}, 
            {min: 24, max: 74}, 
            {min: 33, max: 83}
        ], ["SilkTouch"]); 
    }
    static get FrostWalker() { 
        return EnchantmentTypes.get("frost_walker")
        .setProperty(2, [
            {min: 10, max: 25}, 
            {min: 20, max: 35}
        ], ["depth_strider"]); 
    }
    static get Impaling() { 
        return EnchantmentTypes.get("impaling")
        .setProperty(2, [
            {min: 1, max: 21}, 
            {min: 9, max: 29}, 
            {min: 17, max: 37}, 
            {min: 25, max: 45}, 
            {min: 33, max: 53}
        ]); 
    }
    static get Infinity() { 
        return EnchantmentTypes.get("infinity")
        .setProperty(1, [
            {min: 20, max: 50}
        ], ["mending"]); 
    }
    static get Knockback() { 
        return EnchantmentTypes.get("knockback")
        .setProperty(5, [
            {min: 5, max: 55}, 
            {min: 25, max: 75}
        ]); 
    }
    static get Looting() { 
        return EnchantmentTypes.get("looting")
        .setProperty(2, [
            {min: 15, max: 65}, 
            {min: 24, max: 74}, 
            {min: 33, max: 83}
        ]); 
    }
    static get Loyalty() { 
        return EnchantmentTypes.get("loyalty")
        .setProperty(5, [
            {min: 12, max: 50}, 
            {min: 19, max: 50}, 
            {min: 26, max: 50}
        ], ["riptide"]); 
    }
    static get LuckOfTheSea() { 
        return EnchantmentTypes.get("luck_of_the_sea")
        .setProperty(2, [
            {min: 15, max: 65}, 
            {min: 24, max: 74}, 
            {min: 33, max: 83}
        ]); 
    }
    static get Lure() { 
        return EnchantmentTypes.get("lure")
        .setProperty(2, [
            {min: 15, max: 65}, 
            {min: 24, max: 74}, 
            {min: 33, max: 83}
        ]); 
    }
    static get Mending() { 
        return EnchantmentTypes.get("mending")
        .setProperty(2, [
            {min: 25, max: 75}
        ], ["infinity"]); 
    }
    static get Multishot() { 
        return EnchantmentTypes.get("multishot")
        .setProperty(2, [
            {min: 20, max: 50}
        ], ["piercing"]); 
    }
    static get Piercing() { 
        return EnchantmentTypes.get("piercing")
        .setProperty(10, [
            {min: 1, max: 50}, 
            {min: 11, max: 50}, 
            {min: 21, max: 50}, 
            {min: 31, max: 50}
        ], ["multishot"]); 
    }
    static get Power() { 
        return EnchantmentTypes.get("power")
        .setProperty(10, [
            {min: 1, max: 16}, 
            {min: 11, max: 26}, 
            {min: 21, max: 36}, 
            {min: 31, max: 46}, 
            {min: 41, max: 56}
        ]); 
    }
    static get ProjectileProtection() { 
        return EnchantmentTypes.get("projectile_protection")
        .setProperty(5, [
            {min: 3, max: 9}, 
            {min: 9, max: 15}, 
            {min: 15, max: 21}, 
            {min: 21, max: 27}
        ], ["protection", "fire_protection", "blast_protection"]); 
    }
    static get Protection() { 
        return EnchantmentTypes.get("protection")
        .setProperty(10, [
            {min: 1, max: 21}, 
            {min: 12, max: 23}, 
            {min: 23, max: 34}, 
            {min: 34, max: 45}
        ], ["fire_protection", "blast_protection", "projectile_protection"]); 
    }
    static get Punch() { 
        return EnchantmentTypes.get("punch")
        .setProperty(2, [
            {min: 12, max: 37}, 
            {min: 32, max: 57}
        ]); 
    }
    static get QuickCharge() { 
        return EnchantmentTypes.get("quick_charge")
        .setProperty(5, [
            {min: 12, max: 50}, 
            {min: 32, max: 50}, 
            {min: 52, max: 88}
        ]); 
    }
    static get Respiration() { 
        return EnchantmentTypes.get("respiration")
        .setProperty(2, [
            {min: 10, max: 40}, 
            {min: 20, max: 50}, 
            {min: 30, max: 60}
        ]); 
    }
    static get Riptide() { 
        return EnchantmentTypes.get("riptide")
        .setProperty(2, [
            {min: 17, max: 50}, 
            {min: 24, max: 50}, 
            {min: 31, max: 50}
        ], ["loyalty", "channeling"]); 
    }
    static get Sharpness() { 
        return EnchantmentTypes.get("sharpness")
        .setProperty(10, [
            {min: 1, max: 21}, 
            {min: 12, max: 32}, 
            {min: 23, max: 43}, 
            {min: 34, max: 54}, 
            {min: 45, max: 65}
        ], ["smite", "bane_of_arthropods", "breach", "density"]); 
    }
    static get SilkTouch() { 
        return EnchantmentTypes.get("silk_touch")
        .setProperty(1, [
            {min: 15, max: 65}
        ], ["fortune"]); 
    }
    static get Smite() { 
        return EnchantmentTypes.get("smite")
        .setProperty(5, [
            {min: 5, max: 25}, 
            {min: 13, max: 33}, 
            {min: 21, max: 41}, 
            {min: 29, max: 49}, 
            {min: 37, max: 57}
        ], ["sharpness", "bane_of_arthropods", "breach", "density"]); 
    }
    static get SoulSpeed() { 
        return EnchantmentTypes.get("soul_speed")
        .setProperty(1, [
            {min: 10, max: 25}, 
            {min: 20, max: 35}, 
            {min: 30, max: 45}
        ]); 
    }
    static get SwiftSneak() { 
        return EnchantmentTypes.get("swift_sneak")
        .setProperty(1, [
            {min: 25, max: 75}, 
            {min: 50, max: 100}, 
            {min: 75, max: 125}
        ]); 
    }
    static get Thorns() { 
        return EnchantmentTypes.get("thorns")
        .setProperty(1, [
            {min: 10, max: 60}, 
            {min: 30, max: 70}, 
            {min: 50, max: 80}
        ]); 
    }
    static get Unbreaking() { 
        return EnchantmentTypes.get("unbreaking")
        .setProperty(5, [
            {min: 5, max: 55}, 
            {min: 13, max: 63}, 
            {min: 21, max: 71}
        ]); 
    }
    static get Vanishing() { 
        return EnchantmentTypes.get("vanishing")
        .setProperty(1, [
            {min: 25, max: 50}
        ]); 
    }
    static get WindBurst() { 
        return EnchantmentTypes.get("wind_burst")
        .setProperty(2, [
            {min: 15, max: 65},
            {min: 24, max: 74},
            {min: 33, max: 83}
        ]); 
    }
}