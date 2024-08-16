import { system } from "@minecraft/server";
import { SERVER_CONFIGURATION } from "fishing_system/configuration/configuration_handler";
export function getValidFamily() {
    return [...SERVER_CONFIGURATION.includedFamily, "fish"].filter(fam => !SERVER_CONFIGURATION.excludedFamily.includes(fam));
}
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
export function ExecuteAtGivenTick(tick) {
    return (system.currentTick % tick) === 0;
}
