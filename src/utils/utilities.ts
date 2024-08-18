import { Player, system } from "@minecraft/server";
import { SERVER_CONFIGURATION } from "fishing_system/configuration/configuration_handler";

/**
 * sleep
 * @param {number} ticks Amount of time, in ticks, before the timeouts will be
 * called.
 * @returns {Promise<void>}
 */
export function sleep(ticks: number): Promise<void> {
  // Script example for ScriptAPI
  // Author: stackoverflow <https://stackoverflow.com/a/41957152>
  // Project: https://github.com/JaylyDev/ScriptAPI
  return new Promise((resolve) => {
    system.runTimeout(resolve, ticks);
  });
};

/**
 * Generates a random 16-character UUID.
 * @returns {string} - A 16-character UUID.
*/
export function generateUUID16(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uuid += characters[randomIndex];
  }
  return uuid;
}

/**
 * IDK What to call this, but returns boolean if for every X amount of ticks
 * @param tick Minecraft Ticks
 * @returns 
 */
export function ExecuteAtGivenTick(tick: number) {
  return (system.currentTick % tick) === 0;
}

export function SendMessageTo(target: Player, langMsg: string) {
  const formattedRawMessage = (`tellraw ${target.name} {"rawtext":[{"translate":"${langMsg}"}]}`);
  target.runCommandAsync(formattedRawMessage);
}