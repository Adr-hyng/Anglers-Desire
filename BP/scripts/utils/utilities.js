import { system } from "@minecraft/server";
export function sleep(ticks) {
    return new Promise((resolve) => {
        system.runTimeout(resolve, ticks);
    });
}
;
export function generateUUID16(characterLength = 16) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uuid = '';
    for (let i = 0; i < characterLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uuid += characters[randomIndex];
    }
    return uuid;
}
export function ExecuteAtGivenTick(tick) {
    return (system.currentTick % tick) === 0;
}
export function SendMessageTo(executor, rawMessage = { rawtext: [{ text: "Not Implemented Yet" }] }) {
    const formattedRawMessage = JSON.stringify(rawMessage);
    executor.runCommandAsync(`tellraw ${executor.name} ` + formattedRawMessage);
}
