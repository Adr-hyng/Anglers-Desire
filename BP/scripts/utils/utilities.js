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
export function parseToRoman(num) {
    if (num < 1 || num > 10)
        throw new Error('Input must be between 1 and 10');
    const romanNumerals = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V',
        6: 'VI',
        7: 'VII',
        8: 'VIII',
        9: 'IX',
        10: 'X'
    };
    return romanNumerals[num];
}
export function ExecuteAtGivenTick(tick) {
    return (system.currentTick % tick) === 0;
}
export function SendMessageTo(executor, rawMessage) {
    const formattedRawMessage = JSON.stringify(rawMessage);
    executor.runCommandAsync(`tellraw ${executor.name} ` + formattedRawMessage);
}
