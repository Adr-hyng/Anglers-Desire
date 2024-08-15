import { Player, ScriptEventCommandMessageAfterEvent } from "@minecraft/server";
type ChatEventType = ScriptEventCommandMessageAfterEvent;
export interface ICommandBase {
  name: string,
  description: string,
  format: string,
  usage(): string,
  execute(player: Player, args: string[]): void | Promise<void>;
}