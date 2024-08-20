import { Player } from "@minecraft/server";
import { FormCancelationReason, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
import { ConfigurationCollections_DB, ConfigurationTypes, getServerConfiguration, resetServerConfiguration, setServerConfiguration } from "./configuration_handler";
import {ADDON_NAME, db, localFishersCache, fetchFisher} from "constant";
import { cloneClientConfiguration, FormBuilder } from "./client_configuration";
import { FishingOutputBuilder } from "fishing_system/outputs/output_builder";
import { Fisher } from "fishing_system/entities/fisher";
import { SendMessageTo } from "utils/index";

export class __Configuration {
  private player: Player;
  private source: Fisher;
  private SERVER_CONFIGURATION_DB: string;
  private CLIENT_CONFIGURATION_DB: string;
  constructor(player: Player) {
    this.player = player;
    this.source = fetchFisher(player);
    this.CLIENT_CONFIGURATION_DB = ConfigurationCollections_DB(this.player, "CLIENT");
  }

  reset(configurationType: ConfigurationTypes) {
    if(db.isValid()) {
      if(configurationType === "SERVER") {
        resetServerConfiguration();
        db.set(this.SERVER_CONFIGURATION_DB, getServerConfiguration());
      } else {
        this.source.clientConfiguration = cloneClientConfiguration();
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
    else throw new Error("Database not found");
  }

  showMainScreen() {
    const parsedAddonTitle = ADDON_NAME.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

    const fisher = fetchFisher(this.player); 
    const form: ModalFormData = new ModalFormData().title(`${parsedAddonTitle} Configuration`);
    
    // Fetch client configuration from the database if valid, else set it.
    if (db.isValid()) {
      if (db.has(this.CLIENT_CONFIGURATION_DB)) {
        fisher.clientConfiguration = db.get(this.CLIENT_CONFIGURATION_DB);
      } else {
        db.set(this.CLIENT_CONFIGURATION_DB, fisher.clientConfiguration);
      }
    }

    const cachedConfigurationValues: Array<number | boolean> = [];
    
    Object.values(fisher.clientConfiguration).forEach((builder, index) => {
      if (typeof builder.defaultValue !== "boolean") {
        const currentValue = builder.values.indexOf(builder.defaultValue);
        cachedConfigurationValues[index] = currentValue !== -1 ? currentValue : parseInt(builder.defaultValue);
        form.dropdown(builder.name, builder.values, cachedConfigurationValues[index] as number);
      } else {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.toggle(builder.name, cachedConfigurationValues[index] as boolean);
      }
    });

    form.show(this.player).then((result: ModalFormResponse) => {
      if (!result.formValues) return;
      const hadChanges: boolean = !cachedConfigurationValues.every((element, index) => element === result.formValues[index]);
      if (result.canceled || result.cancelationReason === FormCancelationReason.UserClosed || result.cancelationReason === FormCancelationReason.UserBusy) {
        return;
      }
      if (hadChanges) {
        result.formValues.forEach((newValue, formIndex) => {
          const key = Object.keys(fisher.clientConfiguration)[formIndex];
          const builder = fisher.clientConfiguration[key] as FormBuilder<any>;
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
        if (db.isValid()) db.set(this.CLIENT_CONFIGURATION_DB, fisher.clientConfiguration);
      }
      localFishersCache.set(this.player.id, fisher);
    });
  }
}


