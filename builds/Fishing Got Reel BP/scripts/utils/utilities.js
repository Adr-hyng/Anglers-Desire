import { system } from "@minecraft/server";
export function sleep(ticks) {
    return new Promise((resolve) => {
        system.runTimeout(resolve, ticks);
    });
}
;
export function generateUUID16() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uuid = '';
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uuid += characters[randomIndex];
    }
    return uuid;
}
export class RomanNumericConverter {
    static toRoman(num) {
        if (num < 1 || num > 10)
            throw new Error('Input must be between 1 and 10');
        const romanNumerals = {
            1: 'I',
            2: 'II',
            3: 'III',
            4: 'IV',
            5: 'V',
        };
        return romanNumerals[num];
    }
    static toNumeric(roman) {
        const romanNumerals = {
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
export function ExecuteAtGivenTick(tick) {
    return (system.currentTick % tick) === 0;
}
export function SendMessageTo(executor, rawMessage) {
    const formattedRawMessage = JSON.stringify(rawMessage);
    executor.runCommandAsync(`tellraw ${executor.name} ` + formattedRawMessage);
}
