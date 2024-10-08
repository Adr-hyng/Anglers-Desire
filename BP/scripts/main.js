import { world, system, Player, ScriptEventSource, EntityInventoryComponent, ItemTypes } from "@minecraft/server";
import { ADDON_IDENTIFIER, ADDON_NAME, db, fetchFisher, onCustomBlockInteractLogMap } from "./constant";
import { onFishingHookCreated } from "./fishing_system/events/on_hook_created";
import { overrideEverything } from "overrides/index";
import { onHookedItem } from "fishing_system/events/on_hook_item";
import { Logger, SendMessageTo } from "utils/index";
import { serverConfigurationCopy } from "fishing_system/configuration/server_configuration";
import { MyCustomBlockTypes } from "fishing_system/blocks/custom_blocks";
import { MyCustomItemTypes } from "fishing_system/items/custom_items";
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
            player.configuration.showFisherTableScreen();
        }
    });
});
world.afterEvents.playerSpawn.subscribe((e) => {
    if (!e.initialSpawn)
        return;
    if (!db.has(`playerFirstJoined-${e.player.id}`)) {
        db.set(`playerFirstJoined-${e.player.id}`, false);
    }
    if (!db.get(`playerFirstJoined-${e.player.id}`)) {
        db.set(`playerFirstJoined-${e.player.id}`, true);
        const addonConfigItemType = ItemTypes.get(MyCustomItemTypes.AddonConfiguration);
        e.player.runCommandAsync(`testfor @s[hasItem={item=${addonConfigItemType.id}}]`).then((result) => {
            if (!result.successCount) {
                const inventory = e.player.getComponent(EntityInventoryComponent.componentId).container.override(e.player);
                inventory.giveItem(addonConfigItemType, 1, {
                    lore: [
                        `§l${ADDON_NAME.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}`
                    ]
                });
            }
            else {
                SendMessageTo(e.player, { rawtext: [
                        {
                            translate: "yn:fishing_got_reel.already_has_item",
                            with: ["Angler's Desire Configuration"]
                        }
                    ] });
            }
        });
    }
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
    if (event.itemStack.typeId === MyCustomItemTypes.AddonConfiguration)
        return player.configuration.showConfigurationScreen();
    if (event.itemStack.typeId === MyCustomItemTypes.MysteryBottle) {
        const inventory = player.getComponent(EntityInventoryComponent.componentId).container.override(player);
        if (inventory.emptySlotsCount >= inventory.size)
            return;
        system.run(() => {
            inventory.setItem(player.selectedSlotIndex, undefined);
            player.runCommandAsync(`loot give ${player.name} loot "gameplay/mystery_bottle"`);
        });
    }
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
            if ((fisher.canBeReeled || fisher.fishingHook.isSubmerged) && !fisher.caughtByHook?.isValid())
                onHookedItem(fisher);
        });
    }, 0);
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
