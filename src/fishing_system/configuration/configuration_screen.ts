import { ContainerSlot, EntityInventoryComponent, EquipmentSlot, ItemEnchantableComponent, ItemStack, Player } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, FormCancelationReason, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
import { cloneConfiguration, ConfigurationCollections_DB, ConfigurationTypes} from "./configuration_handler";
import {ADDON_NAME, db, localFishersCache, fetchFisher} from "constant";
import { clientConfiguration} from "./client_configuration";
import { FishingOutputBuilder } from "fishing_system/outputs/output_builder";
import { Fisher } from "fishing_system/entities/fisher";
import { SendMessageTo } from "utils/index";
import { FormBuilder } from "utils/form_builder";
import { resetServerConfiguration, serverConfigurationCopy, setServerConfiguration } from "./server_configuration";
import { CustomEnchantmentTypes } from "custom_enchantment/custom_enchantment_types";
import { CustomEnchantment } from "custom_enchantment/custom_enchantment";
import { MinecraftItemTypes } from "vanilla-types/index";

type DisassembleFormContent = {
  key: string,
  value: boolean;
};
export class __Configuration {
  private player: Player;
  private source: Fisher;
  private SERVER_CONFIGURATION_DB: string;
  private CLIENT_CONFIGURATION_DB: string
  constructor(player: Player) {
    this.player = player;
    this.source = fetchFisher(player);
    this.CLIENT_CONFIGURATION_DB = ConfigurationCollections_DB(this.player, "CLIENT");
    this.SERVER_CONFIGURATION_DB = ConfigurationCollections_DB(this.player, "SERVER");
  }
  reset(configurationType: ConfigurationTypes) {
    if(db.isValid()) {
      if(configurationType === "SERVER") {
        resetServerConfiguration();
        db.set(this.SERVER_CONFIGURATION_DB, serverConfigurationCopy);
      } else {
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
    else throw new Error("Database not found");
  }

  showUpgradeScreen() {
    const inventory = (this.player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container;
    let equippedFishingRod: ContainerSlot;
    equippedFishingRod = this.player.equippedToolSlot(EquipmentSlot.Offhand);
    try {
      if(equippedFishingRod?.typeId !== MinecraftItemTypes.FishingRod) {
        throw "Just throw this. This was used since container slot error is cannot be caught without try-catch, and idon't like nested";
      }
    } catch (e) {
      // Logic for when you cannot add anymore enchantments to this item, go next that you can add one.
      let enchantments: ItemEnchantableComponent;
      function isFull(item: ItemStack) {
        enchantments = item.enchantment.override(item);
        return enchantments.canAddCustomEnchantment();
      }
      // Currently when all is visited, it doesn't wanna visit that anymore even though you can still enchant stuffs.
      const getFishingRodFromInventory = () => {
        let itemSlot = 0
        for(itemSlot = 0; itemSlot < inventory.size; itemSlot++) {
          const item = inventory.getItem(itemSlot);
          if(!item) continue;
          if(item.typeId !== MinecraftItemTypes.FishingRod) continue;

          // Detect for conflicts or possible cannot be enchanted anymore, then go next
          // const temp = isFull(item);
          // console.warn(temp, item.typeId, itemSlot);
          // if(temp) continue;
          break;
        }
        if(itemSlot >= inventory.size) return;
        SendMessageTo(this.player);
        console.warn("succ", itemSlot);
        return inventory.getSlot(itemSlot);
      };
      equippedFishingRod = getFishingRodFromInventory() ?? null;
    }
    if(!equippedFishingRod) return SendMessageTo(this.player); 
    const allCustomEnchantments = CustomEnchantmentTypes.getAll();
    const fishingRod = equippedFishingRod.getItem();
    const enchantments = fishingRod.enchantment.override(fishingRod);
    const availableEnchantments: Map<string, boolean> = new Map();
    
    const form = new ModalFormData();
    form.title("Choose Available Hook to Embed");
    for(const customEnchantment of allCustomEnchantments){
      let isAvailable = false;
      const result = this.player.runCommand(`testfor @s[hasItem={item=${customEnchantment.id}}]`)
      if(result.successCount && !enchantments.hasCustomEnchantment(customEnchantment) && !enchantments.hasConflicts(customEnchantment.name)) {
        isAvailable = true;
      }
      availableEnchantments.set(customEnchantment.name, isAvailable);
      form.toggle(`${(!isAvailable ? "§c" : "§a")}${customEnchantment.name}`, false);
    }
    form.submitButton("Embbed Hook");

    form.show(this.player).then( (response) => {
      if (!response.formValues) return;
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) {
        return;
      }
      let hasChanges = false;
      let index = 0;
      const validEnchantmentsToAdd: DisassembleFormContent[] = [];
      for(const [key, availableValue] of availableEnchantments.entries()) {
        const newVal = <boolean>response.formValues[index];
        if(newVal === availableValue && newVal) { hasChanges = true; }
        validEnchantmentsToAdd.push({key: key, value: newVal && availableValue});
        index++;
      }
      if (!hasChanges) return;
      for(const enchantmentToAdd of validEnchantmentsToAdd) {
        if(!enchantmentToAdd.value) continue;
        const customEnchantment = CustomEnchantmentTypes.get(CustomEnchantment.from({ name: enchantmentToAdd.key, level: 1 }));
        enchantments.override(fishingRod).addCustomEnchantment(customEnchantment);
        inventory.override(this.player).clearItem(customEnchantment.id, 1);
      }
      equippedFishingRod.setItem(fishingRod);
    });
  }

  showInspectScreen(equippedFishingRod: ContainerSlot, enchantments: ItemEnchantableComponent) {
    const form = new ModalFormData();
    const fishingRod = equippedFishingRod.getItem();
    const allCustomEnchantments = new Set([...CustomEnchantmentTypes.getAll(), ...enchantments.getCustomEnchantments()]);

    const availableEnchantments: Map<string, boolean> = new Map();
    form.title("Fishing Rod Information");
    for(const customEnchantment of allCustomEnchantments) {
      const isAvailable = enchantments.hasCustomEnchantment(customEnchantment);
      availableEnchantments.set(customEnchantment.name, isAvailable);
      form.toggle(`${(!isAvailable ? "§c" : "§a")}${customEnchantment.name} ${isAvailable ? ("(" + customEnchantment.usage + "/" + customEnchantment.maxUsage + ")") : ""}`, false);
    }
    form.submitButton("Disassemble");
    form.show(this.player).then( (response) => {
      if (!response.formValues) return;
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) {
        return;
      }
      let hasChanges = false;
      let index = 0;
      const validEnchantmentsToRemove: DisassembleFormContent[] = [];
      for(const [key, availableValue] of availableEnchantments.entries()) {
        const newVal = <boolean>response.formValues[index];
        if(newVal === availableValue && newVal) { hasChanges = true; }
        validEnchantmentsToRemove.push({key: key, value: newVal && availableValue});
        index++;
      }
      if (!hasChanges) return;
      for(const enchantmentToRemove of validEnchantmentsToRemove) {
        if(!enchantmentToRemove.value) continue;
        enchantments.override(fishingRod).removeCustomEnchantment(CustomEnchantment.from({name: enchantmentToRemove.key, level: 1}));
        equippedFishingRod.setItem(fishingRod);
      }
    });
  }
  
  showMainScreen() {
    const form = new ActionFormData()
    .title("Fisher's Table")
    .button("Configuration")
    .button("Attach Hook")
    .button("Craft Hook");
    form.show(this.player).then( (response: ActionFormResponse) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
      switch(response.selection) {
        case 0:
          this.showConfigurationScreen();
          break;
        case 1:
          this.showUpgradeScreen();
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
    form.show(this.player).then( (response: ActionFormResponse) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
      switch(response.selection) {
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
    const form: ModalFormData = new ModalFormData().title("Server-side Configuration");
    
    // Fetch client configuration from the database if valid, else set it.
    if (db.isValid()) {
      if (db.has(this.SERVER_CONFIGURATION_DB)) {
        setServerConfiguration( db.get(this.SERVER_CONFIGURATION_DB) );
      } else {
        db.set(this.SERVER_CONFIGURATION_DB, serverConfigurationCopy);
      }
    }

    const cachedConfigurationValues: Array<number | boolean | string> = [];
    
    Object.values(serverConfigurationCopy).forEach((builder, index) => {
      const isArrayEmpty = builder.values.length > 0;
      if (typeof builder.defaultValue === "string" && isArrayEmpty) {
        const currentValue = builder.values.indexOf(builder.defaultValue);
        cachedConfigurationValues[index] = currentValue !== -1 ? currentValue : parseInt(builder.defaultValue as string);
        form.dropdown(builder.name, builder.values as string[], cachedConfigurationValues[index] as number);
      } 
      else if (typeof builder.defaultValue === "boolean") {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.toggle(builder.name, cachedConfigurationValues[index] as boolean);
      } 
      else if (typeof builder.defaultValue === "string" && !isArrayEmpty) {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.textField(builder.name, cachedConfigurationValues[index], builder.defaultValue);
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
          const key = Object.keys(serverConfigurationCopy)[formIndex];
          const builder = serverConfigurationCopy[key] as FormBuilder<any>;
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
        if (db.isValid()) db.set(this.SERVER_CONFIGURATION_DB, serverConfigurationCopy);
      }
      return this.showMainScreen();
    });
  }

  showClientScreen() {
    const form: ModalFormData = new ModalFormData().title("Client-side Configuration");
    
    // Fetch client configuration from the database if valid, else set it.
    if (db.isValid()) {
      if (db.has(this.CLIENT_CONFIGURATION_DB)) {
        this.source.clientConfiguration = db.get(this.CLIENT_CONFIGURATION_DB);
      } else {
        db.set(this.CLIENT_CONFIGURATION_DB, this.source.clientConfiguration);
      }
    }

    const cachedConfigurationValues: Array<number | boolean | string> = [];
    
    Object.values(this.source.clientConfiguration).forEach((builder, index) => {
      const isArrayEmpty = builder.values.length > 0;
      if (typeof builder.defaultValue === "string" && isArrayEmpty) {
        const currentValue = builder.values.indexOf(builder.defaultValue);
        cachedConfigurationValues[index] = currentValue !== -1 ? currentValue : parseInt(builder.defaultValue as string);
        form.dropdown(builder.name, builder.values as string[], cachedConfigurationValues[index] as number);
      } else if (typeof builder.defaultValue === "boolean") {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.toggle(builder.name, cachedConfigurationValues[index] as boolean);
      } else if (typeof builder.defaultValue === "string" && !isArrayEmpty) {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.textField(builder.name, cachedConfigurationValues[index]);
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
          const key = Object.keys(this.source.clientConfiguration)[formIndex];
          const builder = this.source.clientConfiguration[key] as FormBuilder<any>;
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
        if (db.isValid()) db.set(this.CLIENT_CONFIGURATION_DB, this.source.clientConfiguration);
      }
      return this.showMainScreen();
      localFishersCache.set(this.player.id, this.source);
    });
  }
}


