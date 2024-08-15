import { world, system, Player, ScriptEventSource } from "@minecraft/server";
import { ADDON_IDENTIFIER, fetchFisher } from "./constant";
import { onFishingHookCreated } from "./fishing_system/events/on_hook_created";
import { overrideEverything } from "overrides/index";
import { onHookedItem } from "fishing_system/events/on_hook_item";
overrideEverything();
world.afterEvents.playerSpawn.subscribe((e) => {
    if (!e.initialSpawn)
        return;
    e.player.runCommandAsync(`tellraw ${e.player.name} {"rawtext":[{"translate":"yn.anvil_repair.on_load_message"}]}`);
});
world.beforeEvents.itemUse.subscribe((event) => {
    const player = event.source;
    let fisher = fetchFisher(player);
    fisher.particleVectorLocations.clear();
    if (!fisher.fishingRod.isEquipped)
        return;
    system.run(() => {
        system.run(() => world.afterEvents.entitySpawn.unsubscribe(tt));
        const tt = world.afterEvents.entitySpawn.subscribe((spawnEvent) => {
            if (fisher && spawnEvent.entity)
                onFishingHookCreated(player, spawnEvent.entity, fisher);
        });
    });
    system.runTimeout(() => {
        system.run(() => world.afterEvents.entityRemove.unsubscribe(t));
        const t = world.afterEvents.entityRemove.subscribe((removedEvent) => {
            const removedEntity = removedEvent.typeId;
            if (removedEntity !== "minecraft:fishing_hook")
                return;
            if (!fisher.fishingHook.isSubmerged)
                return;
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
                player.sendMessage(`§cInvalid Command ${cmd}\nCheck If The Command Actually Exists. Use /scriptevent yn:immersif help`);
            }
            else {
                console.error(err);
            }
        }
    });
});
