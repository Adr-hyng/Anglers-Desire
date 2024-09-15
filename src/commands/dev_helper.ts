import { Block, BlockTypes, EnchantmentTypes, EntityComponentTypes, EntityInventoryComponent, EquipmentSlot, ItemComponentTypes, ItemEnchantableComponent, ItemStack, MolangVariableMap, system, world } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { ICommandBase} from "./ICommandBase";
import { SendMessageTo, sleep} from "utils/utilities";
import { overrideEverything } from "overrides/index";
import { MinecraftBlockTypes, MinecraftEnchantmentTypes, MinecraftItemTypes } from "vanilla-types/index";
import { AStarOptions } from "utils/NoxUtils/Pathfinder/AStarOptions";
import { BidirectionalAStar } from "utils/NoxUtils/Pathfinder/BidirectionalAStar";
import { AStar } from "utils/NoxUtils/Pathfinder/AStar";
import { FishingCustomEnchantmentType } from "custom_enchantment/available_custom_enchantments";
import { TacosFishEntityTypes } from "fishing_system/entities/compatibility/tacos_fish_mobs";
import { db, fetchFisher } from "constant";
overrideEverything();

// Automate this, the values should be the description.
enum REQUIRED_PARAMETER {
    GET = "get",
    LOAD_OLD = "load_old",
    RELOAD_INVENTORY = "reload",
    UPDATE_ADDON = "update",
    TEST = "test",
    PATHFIND_TEST = "pathfind",
    DAMAGE_TEST = "damage",
    PARTICLE_TEST = "particle",
    TACO_FISH_TEST = "test_tacofish"
}

const command: ICommandBase = {
    name: 'dev_helper',
    description: 'Developer Utility Command',
    format: `[${Object.values(REQUIRED_PARAMETER).join('|')}]`,
    usage() {
        //? It should be Automatic
        return (`
        Format:
        > ${CommandHandler.prefix}${this.name} ${this.format}
        Usage:
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.GET} = GETS an enchanted fishing rod for development.
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.RELOAD_INVENTORY} = Reload the fishing rod's hook bug.
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.LOAD_OLD} = Loads the old custom dynamic property for fishing rod. For bug fixing purposes. It's chained with reload command after.
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.UPDATE_ADDON} = Updates the addon to the latest, after deleting the old addon, and installing the new one.
        `).replaceAll("        ", "");
    },
    execute(player, args) {
        if (!(args && args.length)) return;
        const requiredParams: string[] = (`[${Object.values(REQUIRED_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim()); 
        const selectedReqParam: string = args[0].toLowerCase();
        if(!requiredParams.includes(selectedReqParam)) return SendMessageTo(
            player, {
                rawtext: [
                    {
                        translate: "yn:fishing_got_reel.on_caught_invalid_command",
                        with: [command.usage()]   
                    },
                ]
            }
        );
        let fishingRod: ItemStack;
        let enchantment: ItemEnchantableComponent;
        switch(selectedReqParam) {
            case REQUIRED_PARAMETER.GET:
                fishingRod = new ItemStack(MinecraftItemTypes.FishingRod, 1);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 3});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea), level: 3});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.FermentedEye);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Luminous);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Nautilus);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Pyroclasm);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Tempus);
                (player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container.addItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.TEST:
                console.warn(fetchFisher(player).currentBiome);
                break;
            case REQUIRED_PARAMETER.UPDATE_ADDON:
                if(db.has("WorldIsRaining")) db.delete("WorldIsRaining"); // Delete world dynamic property from v1.0.1
                world.sendMessage("§a§lAngler's Desire Addon's Scripts§r §ahas been updated successfully.");
                break;
            // Unit Test if all Taco's Fish is successfully implemented.
            case REQUIRED_PARAMETER.TACO_FISH_TEST:
                let successCount = 0;
                system.run(async () => {
                    for(const tacoFishType of Object.values(TacosFishEntityTypes)) {
                        try {
                            const t = player.dimension.spawnEntity(tacoFishType, player.location);
                            await system.waitTicks(3);
                            t.kill();
                            successCount++;
                        } catch (e) {
                            continue;
                        } 
                    }
                    SendMessageTo(player, {
                        rawtext: [
                            {text: `Success: ${successCount}\nTotal: ${(Object.values(TacosFishEntityTypes).length)}`}
                        ]
                    });
                });
                break;
            case REQUIRED_PARAMETER.DAMAGE_TEST:
                if(!args[1].length) return;
                fishingRod = player.equippedTool(EquipmentSlot.Mainhand);
                fishingRod.enchantment.override(fishingRod).getCustomEnchantments().forEach((c) => {
                    c.init(fishingRod).damageUsage(parseInt(args[1]));
                })
                player.equippedToolSlot(EquipmentSlot.Mainhand).setItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.RELOAD_INVENTORY:
                const inventory = ((player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container).override(player);
                for(const {item, slot} of inventory.getInventoryItems()) {
                    if(!item.hasComponent(ItemEnchantableComponent.componentId)) continue;
                    fishingRod = item;
                    const enchantments = fishingRod.enchantment.override(fishingRod);
                    
                    for (const customEnchantment of enchantments.getCustomEnchantments()) {
                        const usage = fishingRod.getDynamicProperty(`Fishing${customEnchantment.id}Usage`) as number | undefined;
                        const maxUsage = fishingRod.getDynamicProperty(`Fishing${customEnchantment.id}MaxUsage`) as number | undefined;
                        if(usage) {
                            fishingRod.setDynamicProperty(`Fishing${customEnchantment.id}Usage`, undefined);
                            fishingRod.setDynamicProperty(`${customEnchantment.dynamicPropID}Usage`, usage);
                            
                        }
                        if(maxUsage) {
                            fishingRod.setDynamicProperty(`Fishing${customEnchantment.id}MaxUsage`, undefined);
                        }
                    }
                    inventory.setItem(slot, fishingRod);
                }
                SendMessageTo(player, {
                    rawtext: [
                        {
                            text: "§a§lAngler's Desire§r §afishing hook enhancement bug located in your current inventory has been fully reloaded."
                        }
                    ]
                });
                break;
            case REQUIRED_PARAMETER.LOAD_OLD:
                fishingRod = player.equippedTool(EquipmentSlot.Mainhand);
                console.warn(JSON.stringify(fishingRod.getDynamicPropertyIds()));
                fishingRod = player.equippedTool(EquipmentSlot.Mainhand);
                enchantment = fishingRod.enchantment.override(fishingRod);
                for (const customEnchantment of enchantment.getCustomEnchantments()) {
                    const usage = fishingRod.getDynamicProperty(`${customEnchantment.dynamicPropID}Usage`) as number | undefined;
                    if(usage) {
                        fishingRod.setDynamicProperty(`${customEnchantment.dynamicPropID}Usage`, undefined);
                        fishingRod.setDynamicProperty(`Fishing${customEnchantment.id}Usage`, usage);
                        
                    }
                    fishingRod.setDynamicProperty(`Fishing${customEnchantment.id}MaxUsage`, customEnchantment.maxUsage);
                }
                player.equippedToolSlot(EquipmentSlot.Mainhand).setItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.PATHFIND_TEST:
                system.run( async () => {
                    const options: AStarOptions = new AStarOptions(player.location, {x: Math.floor(parseInt(args[1])), y: Math.floor(parseInt(args[2])), z: Math.floor(parseInt(args[3]))}, player.dimension);
                    // options.TypeIdsToConsiderPassable = [
                    //     MinecraftBlockTypes.Water,
                    //     MinecraftBlockTypes.Seagrass,
                    //     MinecraftBlockTypes.Kelp,
                    //     MinecraftBlockTypes.StructureVoid
                    // ];
                    options.TypeIdsToConsiderPassable = [
                        MinecraftBlockTypes.Air,
                        MinecraftBlockTypes.StructureVoid
                    ];
                    options.AllowYAxisFlood = true;
                    options.MaximumNodesToConsider = 3000;
                    options.DebugMode = false;
    
                    let aStar: AStar | BidirectionalAStar;
                    try{
                        aStar = new BidirectionalAStar(options);
                        // aStar = new AStar(options);
                    }catch(e){
                        // Failed to construct - start/end blocks probably not loaded
                        console.warn("BROKE", e, e.stack);
                        return false;
                    }
    
                    const blockPath: Block[] = await aStar.Pathfind();
                    for(const b of blockPath) {
                        player.dimension.setBlockType(b.location, BlockTypes.get(MinecraftBlockTypes.DiamondBlock));
                        await sleep(10);
                    }
                    await sleep(20);
                    for(const b of blockPath) {
                        player.dimension.setBlockType(b.location, BlockTypes.get(MinecraftBlockTypes.Air));
                        await sleep(2);
                    }
                    console.warn("DONE");
                });
                break;
            case REQUIRED_PARAMETER.PARTICLE_TEST:
                const molang = new MolangVariableMap();
                molang.setFloat("max_height", 2.3);
                molang.setFloat("splash_spread", 3);
                molang.setFloat("splash_radius", 2.8);
                molang.setFloat("min_splashes", 60);
                molang.setFloat("max_splashes", 100);
                // molang.setFloat("max_height", parseFloat(args[1]) ?? 2);
                // molang.setFloat("splash_spread", parseFloat(args[2]) ?? 5);
                // molang.setFloat("splash_radius", parseFloat(args[3]) ?? 3);
                // molang.setFloat("min_splashes", parseFloat(args[4]) ?? 30);
                // molang.setFloat("max_splashes", parseFloat(args[5]) ?? 50);
                // molang.setFloat("max_splashes", parseFloat(args[5]) ?? 50);
                player.dimension.spawnParticle("yn:water_splash", {x: parseFloat(args[1]), y: parseFloat(args[2]), z: parseFloat(args[3])}, molang);
                break;
            default:
                break;
        }
    }
};
export default command