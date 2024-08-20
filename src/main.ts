import { world, system, Player, ScriptEventCommandMessageAfterEvent, ScriptEventSource} from "@minecraft/server";
import { ADDON_IDENTIFIER, fetchFisher } from "./constant";
import { onFishingHookCreated } from "./fishing_system/events/on_hook_created";
import { Fisher } from "./fishing_system/entities/fisher";

import {overrideEverything} from "overrides/index";
import { onHookedItem } from "fishing_system/events/on_hook_item";
import { Logger, SendMessageTo } from "utils/index";
import { serverConfigurationCopy } from "fishing_system/configuration/server_configuration";
overrideEverything();

world.beforeEvents.worldInitialize.subscribe((e) => {
  e.blockComponentRegistry.registerCustomComponent('yn:on_interact_with_fisher_table', {
    async onPlayerInteract(arg){
      const player = <Player> arg.player;
      if(!player?.isValid()) return;
      if(arg.block.typeId !== 'yn:fishers_table') return;
      const {
        default: CommandObject
      } = await import(`./commands/config.js`);
      CommandObject.execute(player as Player, ['show']);
    }
  });
})

world.afterEvents.playerSpawn.subscribe((e) => {
  if(!e.initialSpawn) return;
  if(!serverConfigurationCopy.ShowMessageUponJoin.defaultValue) return; 
  SendMessageTo(e.player, {
    rawtext: [
      {
        translate: "yn.fishing_got_reel.on_load_message"
      }
    ]
  });
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
      } else {
        Logger.error(err, err.stack);
      }
    }
  });
});