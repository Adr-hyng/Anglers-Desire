import { world, system, Player, ScriptEventSource, WeatherType, EquipmentSlot } from "@minecraft/server";
import { ADDON_IDENTIFIER, db, fetchFisher, onCustomBlockInteractLogMap } from "./constant";
import { onFishingHookCreated } from "./fishing_system/events/on_hook_created";
import { overrideEverything } from "overrides/index";
import { onHookedItem } from "fishing_system/events/on_hook_item";
import { Logger, SendMessageTo } from "utils/index";
import { serverConfigurationCopy } from "fishing_system/configuration/server_configuration";
import { MinecraftItemTypes } from "vanilla-types/index";
import { MyCustomBlockTypes } from "fishing_system/blocks/custom_blocks";
overrideEverything();
world.beforeEvents.worldInitialize.subscribe((e) => {
    e.blockComponentRegistry.registerCustomComponent('yn:on_interact_with_fisher_table', {
        async onPlayerInteract(arg) {
            const player = arg.player;
            if (!player?.isValid())
                return;
            if (arg.block.typeId !== MyCustomBlockTypes.FishersTable)
                return;
            const oldLog = onCustomBlockInteractLogMap.get(player.id);
            onCustomBlockInteractLogMap.set(player.id, Date.now());
            if ((oldLog + 500) >= Date.now())
                return;
            const equipment = player.equippedToolSlot(EquipmentSlot.Mainhand);
            const itemEquipment = equipment.getItem();
            try {
                const enchantment = itemEquipment.enchantment.override(itemEquipment);
                if (equipment.typeId !== MinecraftItemTypes.FishingRod || !enchantment.hasCustomEnchantments())
                    throw "Just throw this. This was used since container slot error is cannot be caught without try-catch, and idon't like nested";
                player.Configuration.showInspectScreen(equipment, enchantment);
            }
            catch (e) {
                const { default: CommandObject } = await import(`./commands/config.js`);
                CommandObject.execute(player, ['show']);
            }
        }
    });
});
world.afterEvents.playerSpawn.subscribe((e) => {
    if (!e.initialSpawn)
        return;
    if (!serverConfigurationCopy.ShowMessageUponJoin.defaultValue)
        return;
    SendMessageTo(e.player, {
        rawtext: [
            {
                translate: "yn.fishing_got_reel.on_load_message"
            }
        ]
    });
});
world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source;
    let fisher = fetchFisher(player);
    if (!fisher.fishingRod.isEquipped)
        return;
    system.run(() => {
        system.run(() => world.afterEvents.entitySpawn.unsubscribe(tt));
        const tt = world.afterEvents.entitySpawn.subscribe((spawnEvent) => {
            if (fisher && spawnEvent.entity)
                onFishingHookCreated(spawnEvent.entity, fisher);
        });
    });
    system.runTimeout(() => {
        system.run(() => world.afterEvents.entityRemove.unsubscribe(t));
        const t = world.afterEvents.entityRemove.subscribe((removedEvent) => {
            const removedEntity = removedEvent.typeId;
            if (removedEntity !== "minecraft:fishing_hook")
                return;
            if (fisher.particleVectorLocations.getVectors().length > 5) {
                fisher.fishingOutputManager.Caught.reset().then((_) => {
                    fisher.particleVectorLocations.clear();
                });
            }
            if ((fisher.canBeReeled || fisher.fishingHook.isSubmerged) && !fisher.caughtByHook?.isValid())
                onHookedItem(fisher);
        });
    }, 0);
});
world.afterEvents.weatherChange.subscribe((e) => {
    if ([WeatherType.Rain, WeatherType.Thunder].includes(e.newWeather))
        db.set("WorldIsRaining", true);
    else if (!([WeatherType.Rain, WeatherType.Thunder].includes(e.newWeather)))
        db.set("WorldIsRaining", false);
});
world.beforeEvents.weatherChange.subscribe((e) => {
    if ([WeatherType.Rain, WeatherType.Thunder].includes(e.newWeather))
        db.set("WorldIsRaining", true);
    else if (!([WeatherType.Rain, WeatherType.Thunder].includes(e.newWeather)))
        db.set("WorldIsRaining", false);
});
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.sourceType !== ScriptEventSource.Entity)
        return;
    if (!(event.sourceEntity instanceof Player))
        return;
    if (event.id !== ADDON_IDENTIFIER)
        return;
    const player = event.sourceEntity;
    const message = event.message;
    const args = message.trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    system.run(async () => {
        try {
            const { default: CommandObject } = await import(`./commands/${cmd}.js`);
            CommandObject.execute(player, args);
        }
        catch (err) {
            if (err instanceof ReferenceError) {
                SendMessageTo(player, {
                    rawtext: [
                        {
                            translate: "yn:fishing_got_reel.on_caught_main_command_not_found",
                            with: [
                                cmd,
                                "\n",
                                ADDON_IDENTIFIER
                            ]
                        }
                    ]
                });
            }
            else {
                Logger.error(err, err.stack);
            }
        }
    });
});
