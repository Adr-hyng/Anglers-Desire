import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { ConfigurationCollections_DB, getServerConfiguration, resetServerConfiguration, setServerConfiguration } from "./configuration_handler";
import { ADDON_NAME, db, fishers, fetchFisher } from "constant";
import { cloneClientConfiguration } from "./client_configuration";
import { FishingOutputBuilder } from "fishing_system/outputs/output_builder";
export class __Configuration {
    constructor(player) {
        this.player = player;
        this.source = fetchFisher(player);
        this.CLIENT_CONFIGURATION_DB = ConfigurationCollections_DB(this.player, "CLIENT");
        this.SERVER_CONFIGURATION_DB = ConfigurationCollections_DB(this.player, "SERVER");
    }
    __load() {
        if (db.isValid()) {
            if (db.has(this.SERVER_CONFIGURATION_DB))
                setServerConfiguration(db.get(this.SERVER_CONFIGURATION_DB));
            else
                db.set(this.SERVER_CONFIGURATION_DB, getServerConfiguration());
        }
        else
            throw new Error("Database not found. Please check through !db_show, and !db_clear");
    }
    __save() {
        if (db.isValid())
            db.set(this.SERVER_CONFIGURATION_DB, getServerConfiguration());
        else
            throw new Error("Database not found. Please check through !db_show, and !db_clear");
    }
    reset(configurationType) {
        if (db.isValid()) {
            if (configurationType === "SERVER") {
                resetServerConfiguration();
                db.set(this.SERVER_CONFIGURATION_DB, getServerConfiguration());
            }
            else {
                fishers.delete(this.player.id);
                db.delete(this.CLIENT_CONFIGURATION_DB);
                this.source.clientConfiguration = cloneClientConfiguration();
                db.set(this.CLIENT_CONFIGURATION_DB, this.source.clientConfiguration);
                fishers.set(this.player.id, this.source);
                Object.keys(this.source.fishingOutputManager).forEach((key) => {
                    this.source.fishingOutputManager[key] = FishingOutputBuilder.create(this.source.clientConfiguration[key], this.source);
                });
            }
        }
        else
            throw new Error("Database not found");
    }
    showMainScreen() {
        const form = new ActionFormData()
            .title(ADDON_NAME.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))
            .button("CLIENT SIDE");
        form.button("MORE INFO");
        form.show(this.player).then((response) => {
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            if (response.selection === 0)
                this.showClientScreen();
            if (response.selection === 1)
                this.showMoreInfoScreen();
        });
    }
    showClientScreen() {
        const fisher = fetchFisher(this.player);
        const form = new ModalFormData().title("CLIENT SETTINGS");
        if (db.isValid()) {
            if (db.has(this.CLIENT_CONFIGURATION_DB)) {
                fisher.clientConfiguration = db.get(this.CLIENT_CONFIGURATION_DB);
            }
            else {
                db.set(this.CLIENT_CONFIGURATION_DB, fisher.clientConfiguration);
            }
        }
        const cachedConfigurationValues = [];
        Object.values(fisher.clientConfiguration).forEach((builder, index) => {
            if (typeof builder.defaultValue !== "boolean") {
                const currentValue = builder.values.indexOf(builder.defaultValue);
                cachedConfigurationValues[index] = currentValue !== -1 ? currentValue : parseInt(builder.defaultValue);
                form.dropdown(builder.name, builder.values, cachedConfigurationValues[index]);
            }
            else {
                cachedConfigurationValues[index] = builder.defaultValue;
                form.toggle(builder.name, cachedConfigurationValues[index]);
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
                    const key = Object.keys(fisher.clientConfiguration)[formIndex];
                    const builder = fisher.clientConfiguration[key];
                    switch (typeof newValue) {
                        case "boolean":
                            builder.defaultValue = newValue;
                            break;
                        case "number":
                            builder.defaultValue = builder.values[newValue];
                            fisher.fishingOutputManager[key] = FishingOutputBuilder.create(builder, fisher);
                            break;
                        default:
                            break;
                    }
                    fisher.clientConfiguration[key] = builder;
                });
                if (db.isValid())
                    db.set(this.CLIENT_CONFIGURATION_DB, fisher.clientConfiguration);
            }
            fishers.set(this.player.id, fisher);
            this.showMainScreen();
        });
    }
    showMoreInfoScreen() { }
}
