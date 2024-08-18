import { world, system, Player, ScriptEventCommandMessageAfterEvent, ScriptEventSource} from "@minecraft/server";
import { ADDON_IDENTIFIER, fetchFisher } from "./constant";
import { onFishingHookCreated } from "./fishing_system/events/on_hook_created";
import { Fisher } from "./fishing_system/entities/fisher";

import {overrideEverything} from "overrides/index";
import { onHookedItem } from "fishing_system/events/on_hook_item";
import server_configuration from "fishing_system/configuration/server_configuration";
import { Logger, SendMessageTo } from "utils/index";
overrideEverything();

world.afterEvents.playerSpawn.subscribe((e) => {
  if(!e.initialSpawn) return;
  if(!server_configuration.ShowMessageUponJoin) return; 
  SendMessageTo(e.player, "yn.fishing_got_reel.on_load_message");
});

world.beforeEvents.itemUse.subscribe((event) => {
  const player: Player = event.source as Player;
  let fisher: Fisher = fetchFisher(player);
  if(!fisher.fishingRod.isEquipped) return;
  
  system.run(() => {
    system.run(() => world.afterEvents.entitySpawn.unsubscribe(tt));
    const tt = world.afterEvents.entitySpawn.subscribe( (spawnEvent) => {
      if(fisher && spawnEvent.entity) onFishingHookCreated(spawnEvent.entity, fisher);
    });
  });
  system.runTimeout(() => {
    system.run(() => world.afterEvents.entityRemove.unsubscribe(t));
    const t = world.afterEvents.entityRemove.subscribe((removedEvent) => {
      const removedEntity = removedEvent.typeId;
      if(removedEntity !== "minecraft:fishing_hook") return;
      if(fisher.particleVectorLocations.getVectors().length > 5) {
        fisher.fishingOutputManager.Caught.reset().then((_) => {
          fisher.particleVectorLocations.clear();
        });
      }
      if(!fisher.fishingHook.isSubmerged) return;
      onHookedItem(fisher);
    });
  }, 0);
});

system.afterEvents.scriptEventReceive.subscribe((event: ScriptEventCommandMessageAfterEvent) => {
  if(event.sourceType !== ScriptEventSource.Entity) return;
  if(!(event.sourceEntity instanceof Player)) return;
  if(event.id !== ADDON_IDENTIFIER) return;
  const player = event.sourceEntity as Player;
  const message = event.message;
  const args = message.trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  system.run(async () => {
    try {
        const {
          default: CommandObject
        } = await import(`./commands/${cmd}.js`);
        CommandObject.execute(player, args);
    } catch (err) {
      if (err instanceof ReferenceError) {
        SendMessageTo(player, `§cInvalid Command ${cmd}\nCheck If The Command Actually Exists. Use /scriptevent ${ADDON_IDENTIFIER} help`);
      } else {
        Logger.error(err, err.stack);
      }
    }
  });
});