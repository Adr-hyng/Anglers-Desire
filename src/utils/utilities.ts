import { Player, RawMessage, system } from "@minecraft/server";

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
export function generateUUID16(characterLength: number = 16): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uuid = '';
  for (let i = 0; i < characterLength; i++) {
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

export function SendMessageTo(executor: Player, rawMessage: RawMessage = { rawtext: [ {text: "Not Implemented Yet"} ] }) {
  const formattedRawMessage = JSON.stringify(rawMessage);
  executor.runCommandAsync(`tellraw ${executor.name} ` + formattedRawMessage);
}