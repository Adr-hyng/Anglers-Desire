import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { getServerConfiguration, resetServerConfiguration, SERVER_CONFIGURATION, setServerConfiguration } from "./config_handler";
import { ADDON_NAME, db, fishers, fetchFisher } from "constant";
const ConfigurationCollections_DB = (player, configType = "CLIENT") => `${ADDON_NAME}|${player.id}|${configType}`;
export class __Configuration {
    constructor(player) {
        this.player = player;
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
            }
        }
        else
            throw new Error("Database not found. Please check through !db_show, and !db_clear");
    }
    showMainScreen() {
        const form = new ActionFormData()
            .title(ADDON_NAME.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))
            .button("CLIENT SIDE");
        if (this.player.StableIsOp())
            form.button("SERVER SIDE");
        form.button("MORE INFO");
        form.show(this.player).then((response) => {
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            if (response.selection === 0)
                this.showClientScreen();
            if (response.selection === 1)
                this.showServerScreen();
            if (response.selection === 2)
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
        try {
            Object.values(fisher.clientConfiguration).forEach((builder, index) => {
                console.warn(builder.name, JSON.stringify(builder.values));
                if (typeof builder.defaultValue !== "boolean") {
                    const currentValue = builder.values.indexOf(builder.defaultValue);
                    console.warn(builder.defaultValue, typeof builder.defaultValue);
                    cachedConfigurationValues[index] = currentValue !== -1 ? currentValue : parseInt(builder.defaultValue);
                    form.dropdown(builder.name, builder.values, cachedConfigurationValues[index]);
                }
                else {
                    cachedConfigurationValues[index] = builder.defaultValue;
                    form.toggle(builder.name, cachedConfigurationValues[index]);
                }
            });
        }
        catch (e) {
            console.warn(e, e.stack);
        }
        console.warn(fisher.clientConfiguration['Caught'].name);
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
                    builder.defaultValue = newValue;
                    fisher.clientConfiguration[key] = builder;
                });
                if (db.isValid())
                    db.set(this.CLIENT_CONFIGURATION_DB, fisher.clientConfiguration);
            }
            this.showMainScreen();
        });
    }
    showServerScreen() {
        const form = new ActionFormData()
            .title("SERVER SIDE")
            .button("General Options")
            .button("Additional Options")
            .button("Include Manager")
            .button("Exclude Manager")
            .button("Depth Controller")
            .button("BACK");
        form.show(this.player).then((response) => {
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            if (response.selection === 0)
                this.showGeneralSettings();
            if (response.selection === 1)
                this.showAdditionalSettings();
            if (response.selection === 2)
                this.showIncludeManager();
            if (response.selection === 3)
                this.showExcludeManager();
            if (response.selection === 4)
                this.showDepthController();
            if (response.selection === 5)
                this.showMainScreen();
        });
    }
    showMoreInfoScreen() { }
    showGeneralSettings() {
        this.__load();
        const preResultFlags = [];
        let index = 0;
        preResultFlags[index] = SERVER_CONFIGURATION.minInterestTimer;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.maxInterestTimer;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.minFindingTimer;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.maxFindingTimer;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.minReelTimer;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.maxReelTimer;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.expirationTimer;
        index++;
        const form = new ModalFormData()
            .title("General Options")
            .textField("Min Fish InterestedEvent Timer", SERVER_CONFIGURATION.minInterestTimer.toString(), SERVER_CONFIGURATION.minInterestTimer.toString())
            .textField("Max Fish InterestedEvent Timer", SERVER_CONFIGURATION.maxInterestTimer.toString(), SERVER_CONFIGURATION.maxInterestTimer.toString())
            .textField("Min Fish FindingEvent Timer", SERVER_CONFIGURATION.minFindingTimer.toString(), SERVER_CONFIGURATION.minFindingTimer.toString())
            .textField("Max Fish FindingEvent Timer", SERVER_CONFIGURATION.maxFindingTimer.toString(), SERVER_CONFIGURATION.maxFindingTimer.toString())
            .textField("Min Fish EscapingEvent Timer", SERVER_CONFIGURATION.minReelTimer.toString(), SERVER_CONFIGURATION.minReelTimer.toString())
            .textField("Max Fish EscapingEvent Timer", SERVER_CONFIGURATION.maxReelTimer.toString(), SERVER_CONFIGURATION.maxReelTimer.toString())
            .textField("Max Waiting Timer", SERVER_CONFIGURATION.expirationTimer.toString(), SERVER_CONFIGURATION.expirationTimer.toString());
        form.show(this.player).then((response) => {
            if (!response.formValues)
                return;
            const hadChanges = !preResultFlags.every((element, index) => element === response.formValues[index]);
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            if (hadChanges) {
                index = 0;
                SERVER_CONFIGURATION.minInterestTimer = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.maxInterestTimer = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.minFindingTimer = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.maxFindingTimer = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.minReelTimer = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.maxReelTimer = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.expirationTimer = response.formValues[index];
                index++;
                this.__save();
            }
            this.showServerScreen();
        });
    }
    showAdditionalSettings() {
        this.__load();
        const preResultFlags = [];
        let index = 0;
        preResultFlags[index] = SERVER_CONFIGURATION.backDestinationOffset;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.minRadius;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.maxRadius;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.successRate;
        index++;
        preResultFlags[index] = SERVER_CONFIGURATION.enableWatchDogTerminateLog;
        index++;
        const form = new ModalFormData()
            .title("Additional Options")
            .slider("Catching Position Offset", -5, 5, 1, SERVER_CONFIGURATION.backDestinationOffset)
            .slider("Min Fishing Radius", 2, 10, 1, SERVER_CONFIGURATION.minRadius)
            .slider("Max Fishing Radius", 2, 10, 1, SERVER_CONFIGURATION.maxRadius)
            .slider("Item Fishing Success Rate", 0, 100, 1, SERVER_CONFIGURATION.successRate)
            .toggle("Enable Watchdog Logger", SERVER_CONFIGURATION.enableWatchDogTerminateLog);
        form.show(this.player).then((response) => {
            if (!response.formValues)
                return;
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            const hadChanges = !preResultFlags.every((element, index) => element === response.formValues[index]);
            if (hadChanges) {
                index = 0;
                SERVER_CONFIGURATION.backDestinationOffset = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.minRadius = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.maxRadius = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.successRate = response.formValues[index];
                index++;
                SERVER_CONFIGURATION.enableWatchDogTerminateLog = response.formValues[index];
                index++;
                this.__save();
            }
            this.showServerScreen();
        });
    }
    showIncludeManager() {
        this.__load();
        const preResultFlags = [];
        let index = 0;
        preResultFlags[index] = 0;
        index++;
        preResultFlags[index] = "";
        index++;
        preResultFlags[index] = false;
        index++;
        const form = new ModalFormData()
            .title("Include Manager")
            .dropdown("Included Family", ["Empty", ...SERVER_CONFIGURATION.includedFamily], 0)
            .textField("Inserted Family", "squid", preResultFlags[1])
            .toggle("Insert / Update Family", preResultFlags[2]);
        form.show(this.player).then((response) => {
            if (!response.formValues)
                return;
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            const hadChanges = !preResultFlags.every((element, index) => element === response.formValues[index]);
            const selectedIndex = response.formValues[0];
            let canUpdate = response.formValues[2];
            const dropDownContent = response.formValues[1];
            const dropDownSelected = selectedIndex - 1;
            const isEmpty = !dropDownContent.length;
            if (!hadChanges)
                return this.showServerScreen();
            if (isEmpty)
                canUpdate = false;
            const tempConfig = getServerConfiguration();
            if (canUpdate) {
                if (selectedIndex === 0)
                    tempConfig.includedFamily.push(dropDownContent);
                else {
                    if (tempConfig.includedFamily.length)
                        tempConfig.includedFamily[dropDownSelected] = dropDownContent;
                }
            }
            else {
                if (tempConfig.includedFamily.length && selectedIndex !== 0)
                    tempConfig.includedFamily.splice(dropDownSelected, 1);
            }
            setServerConfiguration(tempConfig);
            this.__save();
            this.showServerScreen();
        });
    }
    showExcludeManager() {
        this.__load();
        const preResultFlags = [];
        let index = 0;
        preResultFlags[index] = 0;
        index++;
        preResultFlags[index] = "";
        index++;
        preResultFlags[index] = false;
        index++;
        const form = new ModalFormData()
            .title("Exclude Manager")
            .dropdown("Excluded Family", ["Empty", ...SERVER_CONFIGURATION.excludedFamily], 0)
            .textField("Inserted Family", "squid", preResultFlags[1])
            .toggle("Insert / Update Family", preResultFlags[2]);
        form.show(this.player).then((response) => {
            if (!response.formValues)
                return;
            if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy)
                return;
            const hadChanges = !preResultFlags.every((element, index) => element === response.formValues[index]);
            const selectedIndex = response.formValues[0];
            let canUpdate = response.formValues[2];
            const dropDownContent = response.formValues[1];
            const dropDownSelected = selectedIndex - 1;
            const isEmpty = !dropDownContent.length;
            if (!hadChanges)
                return this.showServerScreen();
            if (isEmpty)
                canUpdate = false;
            const tempConfig = getServerConfiguration();
            if (canUpdate) {
                if (selectedIndex === 0)
                    tempConfig.excludedFamily.push(dropDownContent);
                else {
                    if (tempConfig.excludedFamily.length)
                        tempConfig.excludedFamily[dropDownSelected] = dropDownContent;
                }
            }
            else {
                if (tempConfig.excludedFamily.length && selectedIndex !== 0)
                    tempConfig.excludedFamily.splice(dropDownSelected, 1);
            }
            setServerConfiguration(tempConfig);
            this.__save();
            this.showServerScreen();
        });
    }
    showDepthController() {
        this.__load();
        const parsedToDropdownFormat = Object.entries(SERVER_CONFIGURATION.depthMultiplierRoll).map(([key, value]) => `${key}: ${(value * 100).toFixed(0)}`);
        const preResultFlags = [];
        let index = 0;
        preResultFlags[index] = "";
        index++;
        preResultFlags[index] = "";
        index++;
        preResultFlags[index] = false;
        index++;
        const form = new ModalFormData()
            .title("Depth Controller")
            .dropdown("Entries (Read-Only)", ["Empty", ...parsedToDropdownFormat], 0)
            .textField("Depth (Integer)", "10", preResultFlags[0])
            .textField("Weight as percent (Integer)", "20", preResultFlags[1])
            .toggle("Insert / Update Entry", preResultFlags[2]);
        form.show(this.player).then((response) => {
            if (!response.formValues)
                return;
            if (response.canceled || [FormCancelationReason.UserClosed, FormCancelationReason.UserBusy].includes(response.cancelationReason))
                return;
            const hadChanges = !preResultFlags.every((element, index) => element === response.formValues[index]);
            const [selectedIndex, entryKey, entryValue, canInsert] = response.formValues;
            const isKeyInteger = /^[0-9]+$/.test(entryKey);
            const isValueInteger = /^[0-9]+$/.test(entryValue);
            const tempConfig = getServerConfiguration();
            const selectedKeyFromDropdown = ["Empty", ...Object.keys(tempConfig.depthMultiplierRoll)][selectedIndex];
            let defaultValue = entryValue;
            if (!hadChanges)
                return this.showServerScreen();
            if (canInsert) {
                if (selectedIndex) {
                    if (isKeyInteger) {
                        if (!entryValue.length) {
                            defaultValue = (SERVER_CONFIGURATION.depthMultiplierRoll[selectedKeyFromDropdown] * 100).toString();
                        }
                        delete tempConfig.depthMultiplierRoll[selectedKeyFromDropdown];
                        tempConfig.depthMultiplierRoll[entryKey] = (parseInt(defaultValue) / 100);
                    }
                }
                else {
                    if (entryValue.length && isValueInteger)
                        tempConfig.depthMultiplierRoll[entryKey] = (parseInt(defaultValue) / 100);
                }
            }
            else {
                if (selectedIndex) {
                    delete tempConfig.depthMultiplierRoll[selectedKeyFromDropdown];
                }
            }
            Object.keys(tempConfig.depthMultiplierRoll).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => tempConfig.depthMultiplierRoll[key]);
            setServerConfiguration(tempConfig);
            this.__save();
            this.showServerScreen();
        });
    }
}
