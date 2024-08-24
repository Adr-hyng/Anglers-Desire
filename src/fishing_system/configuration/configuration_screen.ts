import { ContainerSlot, EntityInventoryComponent, EquipmentSlot, ItemEnchantableComponent, ItemStack, Player } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, FormCancelationReason, MessageFormData, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
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
    try {
      if((equippedFishingRod = this.player.equippedToolSlot(EquipmentSlot.Mainhand))?.typeId !== MinecraftItemTypes.FishingRod || (equippedFishingRod = this.player.equippedToolSlot(EquipmentSlot.Offhand))?.typeId !== MinecraftItemTypes.FishingRod) {
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
    form.title("Choose enhancement to add");
    for(const customEnchantment of allCustomEnchantments){
      let isAvailable = false;
      const result = this.player.runCommand(`testfor @s[hasItem={item=${customEnchantment.id}}]`)
      if(result.successCount && !enchantments.hasCustomEnchantment(customEnchantment) && !enchantments.hasConflicts(customEnchantment.name)) {
        isAvailable = true;
      }
      availableEnchantments.set(customEnchantment.name, isAvailable);
      form.toggle(`${(!isAvailable ? "§c" : "§a")}${customEnchantment.name}`, false);
    }
    form.submitButton("Add ");

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
  showCreditsScreen() {
    const form = new MessageFormData();
    form.title(" Credits / Shoutout ")
    .button2("BACK")
    .button1("EXIT")
    .body(
      `
  Here are the people who really made this all possible:

   Dal4y - For the texture-related coolness. Follow this talented artist in Twitter: @DaL4ydobeballin.

   BAO - Minecraft Bedrock-Addons peps (scripts, and technical).

   Big Chungus - Splash Particle Template for VFX.

   Pots - For being a supportive girlfriend.

   Martin - For the support and letting me use his microsoft account to create this project.

           You reading this! 
      
              Enjoy fishing!
      `
    );
    form.show(this.player).then((response) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) {
        return;
      }
      console.warn(response.selection);
      switch(response.selection) {
        case 0: return;
        case 1:
          return this.showMainScreen();
        default:
          break;
      }
      return;
    });
  }
  showInspectScreen() {
    // Must be either offhand or mainhand to remove hook
    let fishingRod = this.player.equippedTool(EquipmentSlot.Mainhand);
    const enchantments = fishingRod.enchantment.override(fishingRod);
    if(fishingRod?.typeId !== MinecraftItemTypes.FishingRod 
    && (fishingRod = this.player.equippedTool(EquipmentSlot.Offhand))?.typeId !== MinecraftItemTypes.FishingRod
    || (!enchantments.hasCustomEnchantments())) {
      return SendMessageTo(this.player);
    }
    const form = new ModalFormData();
    const allCustomEnchantments = new Set([...CustomEnchantmentTypes.getAll(), ...enchantments.getCustomEnchantments()]);

    const availableEnchantments: Map<string, boolean> = new Map();
    form.title("Choose enhancement to remove");
    for(const customEnchantment of allCustomEnchantments) {
      const isAvailable = enchantments.hasCustomEnchantment(customEnchantment);
      availableEnchantments.set(customEnchantment.name, isAvailable);
      form.toggle(`${(!isAvailable ? "§c" : "§a")}${customEnchantment.name}${isAvailable ? (" [" + customEnchantment.usage + "/" + customEnchantment.maxUsage + "]") : ""} `, false);
    }
    form.submitButton("Remove ");
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
        const customEnchantmentToRemove = enchantments.getCustomEnchantment(CustomEnchantment.from({name: enchantmentToRemove.key, level: 1}));
        enchantments.removeCustomEnchantment(customEnchantmentToRemove);
        this.player.equippedToolSlot(EquipmentSlot.Mainhand).setItem(fishingRod);
      }
    });
  }
  showMainScreen() {
    const form = new ActionFormData()
    .title(" Fisher's Table ")
    .button("Add Enhancement")
    .button("Remove Enhancement")
    .button("Game Options")
    .button("Guide")
    .button("Others");
    form.show(this.player).then( (response: ActionFormResponse) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
      switch(response.selection) {
        case 0:
          this.showUpgradeScreen();
          break;
        case 1:
          this.showInspectScreen();
          break;
        case 2:
          this.showConfigurationScreen();
          break;
        case 3:
          this.showCreditsScreen()
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
    .title(parsedAddonTitle + " Options")
    .button(" Client Configuration")
    .button(" Server Configuration")
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
      } else if (typeof builder.defaultValue === "string" && !isArrayEmpty) {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.textField(builder.name, cachedConfigurationValues[index]);
      } else if (typeof builder.defaultValue === "boolean") {
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


