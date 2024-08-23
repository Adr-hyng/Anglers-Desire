import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { cloneConfiguration, ConfigurationCollections_DB } from "./configuration_handler";
import { ADDON_NAME, db, localFishersCache, fetchFisher } from "constant";
import { clientConfiguration } from "./client_configuration";
import { FishingOutputBuilder } from "fishing_system/outputs/output_builder";
import { SendMessageTo } from "utils/index";
import { resetServerConfiguration, serverConfigurationCopy, setServerConfiguration } from "./server_configuration";
import { CustomEnchantmentTypes } from "custom_enchantment/custom_enchantment_types";
export class __Configuration {
    constructor(player) {
        this.player = player;
        this.source = fetchFisher(player);
        this.CLIENT_CONFIGURATION_DB = ConfigurationCollections_DB(this.player, "CLIENT");
        this.SERVER_CONFIGURATION_DB = ConfigurationCollections_DB(this.player, "SERVER");
    }
    reset(configurationType) {
        if (db.isValid()) {
            if (configurationType === "SERVER") {
                resetServerConfiguration();
                db.set(this.SERVER_CONFIGURATION_DB, serverConfigurationCopy);
            }
            else {
                this.source.clientConfiguration = cloneConfiguration(clientConfiguration);
                db.set(this.CLIENT_CONFIGURATION_DB, this.source.clientConfiguration);
                localFishersCache.set(this.player.id, this.source);
                Object.keys(this.source.fishingOutputManager).forEach((key) => {
                    this.source.fishingOutputManager[key] = FishingOutputBuilder.create(this.source.clientConfiguration[key], this.source);
                });
                SendMessageTo(this.player, {
                    rawtext: [
                        {
                            translate: "yn:fishing_got_reel.on_client_reset"
                        }
                    ]
                });
            }
        }
        else
            throw new Error("Database not found");
    }
    showInspectScreen(equippedFishingRod) {
        const form = new ModalFormData();
        const fishingRod = equippedFishingRod.getItem();
        const enchantments = fishingRod.enchantment.override(fishingRod);
        const allCustomEnchantments = CustomEnchantmentTypes.getAll();
        const availableEnchantments = new Map();
        const IsEnchantmentAvailable = (customEnchantment) => Boolean(enchantments.getCustomEnchantment(customEnchantment));
        form.title("Fishing Rod Information");
        for (const customEnchantment of allCustomEnchantments) {
            const isAvailable = IsEnchantmentAvailable(customEnchantment);
            availableEnchantments.set(customEnchantment.name, isAvailable);
            form.toggle(`${(!isAvailable ? "§c" : "§a")}${customEnchantment.name} (${50}/${100})`, false);
        }
        form.submitButton("Disassemble");
        form.show(this.player).then((response) => {
            if (!response.formValues)
                return;
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) {
                return;
            }
            let hasChanges = false;
            let index = 0;
            const validEnchantmentsToRemove = [];
            for (const [key, availableValue] of availableEnchantments.entries()) {
                const newVal = response.formValues[index];
                if (newVal === availableValue && newVal) {
                    hasChanges = true;
                }
                validEnchantmentsToRemove.push({ key: key, value: newVal && availableValue });
                index++;
            }
            if (!hasChanges)
                for (const enchantmentToRemove of validEnchantmentsToRemove) {
                    if (!enchantmentToRemove.value)
                        continue;
                    enchantments.override(fishingRod).removeCustomEnchantment(CustomEnchantmentTypes.get({ name: enchantmentToRemove.key, level: 1 }));
                    equippedFishingRod.setItem(fishingRod);
                }
        });
    }
    showMainScreen() {
        const form = new ActionFormData()
            .title("Fisher's Table")
            .button("Configuration")
            .button("Upgrade")
            .button("Craft");
        form.show(this.player).then((response) => {
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            switch (response.selection) {
                case 0:
                    this.showConfigurationScreen();
                    break;
                case 1:
                    this.showServerScreen();
                    break;
                default:
                    break;
            }
            return;
        });
    }
    showConfigurationScreen() {
        const parsedAddonTitle = ADDON_NAME.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        const form = new ActionFormData()
            .title(parsedAddonTitle + " Configuration")
            .button("Client")
            .button("Server")
            .button("Help");
        form.show(this.player).then((response) => {
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            switch (response.selection) {
                case 0:
                    this.showClientScreen();
                    break;
                case 1:
                    this.showServerScreen();
                    break;
                default:
                    break;
            }
            return;
        });
    }
    showServerScreen() {
        const form = new ModalFormData().title("Server-side Configuration");
        if (db.isValid()) {
            if (db.has(this.SERVER_CONFIGURATION_DB)) {
                setServerConfiguration(db.get(this.SERVER_CONFIGURATION_DB));
            }
            else {
                db.set(this.SERVER_CONFIGURATION_DB, serverConfigurationCopy);
            }
        }
        const cachedConfigurationValues = [];
        Object.values(serverConfigurationCopy).forEach((builder, index) => {
            const isArrayEmpty = builder.values.length > 0;
            if (typeof builder.defaultValue === "string" && isArrayEmpty) {
                const currentValue = builder.values.indexOf(builder.defaultValue);
                cachedConfigurationValues[index] = currentValue !== -1 ? currentValue : parseInt(builder.defaultValue);
                form.dropdown(builder.name, builder.values, cachedConfigurationValues[index]);
            }
            else if (typeof builder.defaultValue === "boolean") {
                cachedConfigurationValues[index] = builder.defaultValue;
                form.toggle(builder.name, cachedConfigurationValues[index]);
            }
            else if (typeof builder.defaultValue === "string" && !isArrayEmpty) {
                cachedConfigurationValues[index] = builder.defaultValue;
                form.textField(builder.name, cachedConfigurationValues[index], builder.defaultValue);
            }
        });
        form.show(this.player).then((result) => {
            if (!result.formValues)
                return;
            const hadChanges = !cachedConfigurationValues.every((element, index) => element === result.formValues[index]);
            if (result.canceled || result.cancelationReason === FormCancelationReason.UserClosed || result.cancelationReason === FormCancelationReason.UserBusy) {
                return;
            }
            if (hadChanges) {
                result.formValues.forEach((newValue, formIndex) => {
                    const key = Object.keys(serverConfigurationCopy)[formIndex];
                    const builder = serverConfigurationCopy[key];
                    switch (typeof newValue) {
                        case "boolean":
                            builder.defaultValue = newValue;
                            break;
                        case "number":
                            builder.defaultValue = builder.values[newValue];
                            break;
                        case "string":
                            builder.defaultValue = newValue;
                            break;
                        default:
                            break;
                    }
                    serverConfigurationCopy[key] = builder;
                });
                setServerConfiguration(serverConfigurationCopy);
                if (db.isValid())
                    db.set(this.SERVER_CONFIGURATION_DB, serverConfigurationCopy);
            }
            return this.showMainScreen();
        });
    }
    showClientScreen() {
        const form = new ModalFormData().title("Client-side Configuration");
        if (db.isValid()) {
            if (db.has(this.CLIENT_CONFIGURATION_DB)) {
                this.source.clientConfiguration = db.get(this.CLIENT_CONFIGURATION_DB);
            }
            else {
                db.set(this.CLIENT_CONFIGURATION_DB, this.source.clientConfiguration);
            }
        }
        const cachedConfigurationValues = [];
        Object.values(this.source.clientConfiguration).forEach((builder, index) => {
            const isArrayEmpty = builder.values.length > 0;
            if (typeof builder.defaultValue === "string" && isArrayEmpty) {
                const currentValue = builder.values.indexOf(builder.defaultValue);
                cachedConfigurationValues[index] = currentValue !== -1 ? currentValue : parseInt(builder.defaultValue);
                form.dropdown(builder.name, builder.values, cachedConfigurationValues[index]);
            }
            else if (typeof builder.defaultValue === "boolean") {
                cachedConfigurationValues[index] = builder.defaultValue;
                form.toggle(builder.name, cachedConfigurationValues[index]);
            }
            else if (typeof builder.defaultValue === "string" && !isArrayEmpty) {
                cachedConfigurationValues[index] = builder.defaultValue;
                form.textField(builder.name, cachedConfigurationValues[index]);
            }
        });
        form.show(this.player).then((result) => {
            if (!result.formValues)
                return;
            const hadChanges = !cachedConfigurationValues.every((element, index) => element === result.formValues[index]);
            if (result.canceled || result.cancelationReason === FormCancelationReason.UserClosed || result.cancelationReason === FormCancelationReason.UserBusy) {
                return;
            }
            if (hadChanges) {
                result.formValues.forEach((newValue, formIndex) => {
                    const key = Object.keys(this.source.clientConfiguration)[formIndex];
                    const builder = this.source.clientConfiguration[key];
                    switch (typeof newValue) {
                        case "boolean":
                            builder.defaultValue = newValue;
                            break;
                        case "number":
                            builder.defaultValue = builder.values[newValue];
                            this.source.fishingOutputManager[key] = FishingOutputBuilder.create(builder, this.source);
                            break;
                        default:
                            break;
                    }
                    this.source.clientConfiguration[key] = builder;
                });
                if (db.isValid())
                    db.set(this.CLIENT_CONFIGURATION_DB, this.source.clientConfiguration);
            }
            return this.showMainScreen();
            localFishersCache.set(this.player.id, this.source);
        });
    }
}
