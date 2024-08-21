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
export function generateUUID16(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uuid += characters[randomIndex];
  }
  return uuid;
}

export class RomanNumericConverter {
  static toRoman(num: number): string {
    if (num < 1 || num > 10) throw new Error('Input must be between 1 and 10');
    const romanNumerals: { [key: number]: string } = {
      1: 'I',
      2: 'II',
      3: 'III',
      4: 'IV',
      5: 'V',
    };
    return romanNumerals[num];
  }
  
  static toNumeric(roman: string): number {
    const romanNumerals: { [key: string]: number } = {
      'I': 1,
      'II': 2,
      'III': 3,
      'IV': 4,
      'V': 5,
    };
  
    const numericValue = romanNumerals[roman.toUpperCase()];
    if (numericValue === undefined) {
      throw new Error('Input must be a valid Roman numeral between I and X');
    }
  
    return numericValue;
  }
}

/**
 * IDK What to call this, but returns boolean if for every X amount of ticks
 * @param tick Minecraft Ticks
 * @returns 
 */
export function ExecuteAtGivenTick(tick: number) {
  return (system.currentTick % tick) === 0;
}

export function SendMessageTo(executor: Player, rawMessage: RawMessage) {
  const formattedRawMessage = JSON.stringify(rawMessage);
  executor.runCommandAsync(`tellraw ${executor.name} ` + formattedRawMessage);
}