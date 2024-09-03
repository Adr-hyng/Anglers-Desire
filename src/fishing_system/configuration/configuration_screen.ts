import { EntityInventoryComponent, EquipmentSlot, ItemTypes, Player, system } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, FormCancelationReason, MessageFormData, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
import { cloneConfiguration, ConfigurationCollections_DB, ConfigurationTypes} from "./configuration_handler";
import {ADDON_NAME, db, localFishersCache, fetchFisher} from "constant";
import { clientConfiguration} from "./client_configuration";
import { FishingOutputBuilder } from "fishing_system/outputs/output_builder";
import { Fisher } from "fishing_system/entities/fisher";
import { SendMessageTo } from "utils/index";
import { FormBuilder } from "utils/form_builder";
import { resetServerConfiguration, serverConfigurationCopy, setServerConfiguration } from "./server_configuration";
import { CustomEnchantmentTypes, FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
import { CustomEnchantment } from "custom_enchantment/custom_enchantment"
import { MinecraftItemTypes } from "vanilla-types/index";
import { MyCustomItemTypes } from "fishing_system/items/custom_items";
import { ItemStackOptions } from "overrides/container_override";

type DisassembleFormContent = {
  key: string,
  value: boolean;
};
export class Configuration {
  private player: Player;
  private source: Fisher;
  private SERVER_CONFIGURATION_DB: string;
  private CLIENT_CONFIGURATION_DB: string

  isConfigurationSettingsOpen: boolean;
  constructor(player: Player) {
    this.player = player;
    this.source = fetchFisher(player);
    this.isConfigurationSettingsOpen = false;
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
  showFisherTableScreen() {
    const form = new ActionFormData()
    .title({rawtext: [
      {text: " "},
      {translate: "yn:fishing_got_reel.configuration.fishers_table.title"},
      {text: " "},
    ]})
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.fishers_table.open_enchantment_option"}]}, "textures/gui/fishers_table/add_enhancement")
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.fishers_table.open_disenchant_option"}]}, "textures/gui/fishers_table/remove_enhancement")
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.fishers_table.view_enhancements_option"}]}, "textures/gui/fishers_table/view_enhancement")
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.fishers_table.view_fishing_book_option"}]}, "textures/gui/fishers_table/view_book")
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.fishers_table.get_settings_option"}]}, "textures/gui/fishers_table/give_configuration");
    form.show(this.player).then( (response: ActionFormResponse) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
      switch(response.selection) {
        case 0:
          this.showUpgradeScreen();
          break;
        case 1:
          this.showDisenchantingScreen();
          break;
        case 2:
          this.showEnhancementInfoScreen();
          break;
        case 3:
          this.showFishingBookScreen();
          break;
        case 4:
          const addonConfigItemType = ItemTypes.get(MyCustomItemTypes.AddonConfiguration);
          this.player.runCommandAsync(`testfor @s[hasItem={item=${addonConfigItemType.id}}]`).then((result) => {
            if(!result.successCount) {
              const inventory = (this.player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container.override(this.player);
              inventory.giveItem(addonConfigItemType, 1, {
                lore: [
                  `§l${ADDON_NAME.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}`
                ]
              } as ItemStackOptions);
            } else {
              SendMessageTo(this.player, {rawtext: [
                {
                  translate: "yn:fishing_got_reel.already_has_item",
                  with: ["Angler's Desire Configuration (Item)"]
                }
              ]});
            }
          });
          break;
        default:
          break;
      }
      return;
    });
  }
  showUpgradeScreen() {
    let equippedFishingRod = this.player.equippedTool(EquipmentSlot.Mainhand);
    if(!equippedFishingRod) return;
    if(equippedFishingRod?.typeId !== MinecraftItemTypes.FishingRod 
    && (equippedFishingRod = this.player.equippedTool(EquipmentSlot.Offhand))?.typeId !== MinecraftItemTypes.FishingRod) {
      return;
    }
    
    const enchantments = equippedFishingRod.enchantment.override(equippedFishingRod);
    const inventory = (this.player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container;
    const allCustomEnchantments = CustomEnchantmentTypes.getAll();
    const availableEnchantments: Map<string, boolean> = new Map();
    
    const form = new ModalFormData();
    form.title({rawtext: [{translate: "yn:fishing_got_reel.configuration.open_enchantment_screen.title"}]});
    for(const customEnchantment of allCustomEnchantments){
      let isAvailable = false;
      const result = this.player.runCommand(`testfor @s[hasItem={item=${customEnchantment.id}}]`);
      if(result.successCount && !enchantments.hasCustomEnchantment(customEnchantment) && !enchantments.hasConflicts(customEnchantment.name)) {
        isAvailable = true;
      }
      availableEnchantments.set(customEnchantment.name, isAvailable);
      form.toggle(`${(!isAvailable ? "§c" : "§a")}${customEnchantment.name}`, false);
    }
    form.submitButton({rawtext: [
      {translate: "yn:fishing_got_reel.configuration.general.add_enchantment"},
      {text: " "}
    ]});
    
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
        const customEnchantment = CustomEnchantmentTypes.get(new CustomEnchantment({ name: enchantmentToAdd.key, level: 1 }));
        if(!enchantments.override(equippedFishingRod).addCustomEnchantment(customEnchantment)) continue;
        inventory.override(this.player).clearItem(customEnchantment.id, 1);
      }
      this.player.equippedToolSlot(EquipmentSlot.Mainhand).setItem(equippedFishingRod);
    });
  }
  showDisenchantingScreen() {
    let equippedItem = this.player.equippedTool(EquipmentSlot.Mainhand);
    if(!equippedItem) return;
    if(equippedItem?.typeId !== MinecraftItemTypes.FishingRod 
    && (equippedItem = this.player.equippedTool(EquipmentSlot.Offhand))?.typeId !== MinecraftItemTypes.FishingRod) {
      return;
    }
    const enchantments = equippedItem.enchantment.override(equippedItem);
    if(!enchantments.hasCustomEnchantments()) return;
    const form = new ModalFormData();
    const allCustomEnchantments = new Set([...CustomEnchantmentTypes.getAll(), ...enchantments.getCustomEnchantments()]);

    const availableEnchantments: Map<string, boolean> = new Map();
    form.title({rawtext: [{translate: "yn:fishing_got_reel.configuration.open_disenchant_screen.title"}]});
    for(const customEnchantment of allCustomEnchantments) {
      const isAvailable = enchantments.hasCustomEnchantment(customEnchantment);
      availableEnchantments.set(customEnchantment.name, isAvailable);
      form.toggle(`${(!isAvailable ? "§c" : "§a")}${customEnchantment.name}`, false);
    }
    form.submitButton({rawtext: [
      {translate: "yn:fishing_got_reel.configuration.general.remove_enchantment"},
      {text: " "}
    ]});
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
        const customEnchantmentToRemove = enchantments.getCustomEnchantment(new CustomEnchantment({name: enchantmentToRemove.key, level: 1}));
        enchantments.removeCustomEnchantment(customEnchantmentToRemove);
        this.player.equippedToolSlot(EquipmentSlot.Mainhand).setItem(equippedItem);
      }
    });
  }
  showEnhancementInfoScreen() {
    let equippedItem = this.player.equippedTool(EquipmentSlot.Mainhand);
    if(!equippedItem) return;
    if(equippedItem?.typeId !== MinecraftItemTypes.FishingRod 
    && (equippedItem = this.player.equippedTool(EquipmentSlot.Offhand))?.typeId !== MinecraftItemTypes.FishingRod) {
      return;
    }
    const enchantments = equippedItem.enchantment.override(equippedItem);
    if(!enchantments.hasCustomEnchantments()) return;
    const form = new ActionFormData()
    .title({rawtext: [{translate: "yn:fishing_got_reel.configuration.view_enhancement_screen.title"}]});

    const AvailableCustomEnchantments = enchantments.getCustomEnchantments();
    for(const customEnchantment of AvailableCustomEnchantments) {
      form.button({
        rawtext: [
          {
            translate: "yn:fishing_got_reel.configuration.general.usage"
          },
          {
            text: `: ${customEnchantment.usage} / ${customEnchantment.maxUsage}`
          }
        ]
      }, customEnchantment.icon);
    }
    form.button({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]}, "textures/ui/arrow_left");

    form.show(this.player).then( (response: ActionFormResponse) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
      if(response.selection >= AvailableCustomEnchantments.length) return this.showFisherTableScreen();
      const index = response.selection;
      const descriptionForm = new MessageFormData();
      const selectedCustomEnchantment = AvailableCustomEnchantments[index];
      descriptionForm.title(selectedCustomEnchantment.name);
      descriptionForm.body({
        rawtext: [
          {
            text: "\n"
          },
          {
            translate: "yn:fishing_got_reel.enchantments.description_text",
          },
          {
            text: "\n    "
          },
          {
            translate: selectedCustomEnchantment.description,
            with: []
          },
          {
            text: "\n\n"
          },
          {
            translate: "yn:fishing_got_reel.enchantments.lore_text"
          },
          {
            text: "\n    "
          },
          {
            translate: selectedCustomEnchantment.lore,
            with: []
          },
        ]
      });
      descriptionForm.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
      descriptionForm.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
      descriptionForm.show(this.player).then((descriptionResponse) => {
        if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
        if(descriptionResponse.selection === 0) return this.showEnhancementInfoScreen();
        return;
      });
      return;
    });
  }
  showFishingBookScreen() {
    return SendMessageTo(this.player);
  }

  showConfigurationScreen() {
    system.run(() => {
      if(this.isConfigurationSettingsOpen) return;
      this.isConfigurationSettingsOpen = true;
      const parsedAddonTitle = ADDON_NAME.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
      const form = new ActionFormData()
      .title({rawtext: [
        {translate: "yn:fishing_got_reel.configuration.addon_options.title", with: [parsedAddonTitle]}
      ]})
      .button({rawtext: [
        {translate: "yn:fishing_got_reel.configuration.addon_options.client"}
      ]}, "textures/gui/configurations/client_status");
      if(this.player.hasTag("isOperator")) {
        form.button({rawtext: [
          {translate: "yn:fishing_got_reel.configuration.addon_options.server"}
        ]}, "textures/gui/configurations/operator_status"); // IF player is operator
      }
      form.button({rawtext: [
        {translate: "yn:fishing_got_reel.configuration.addon_options.guide"}
      ]}, "textures/gui/configurations/guide")
      .button({rawtext: [
        {translate: "yn:fishing_got_reel.configuration.addon_options.credits"}
      ]}, "textures/gui/configurations/credits");
      form.show(this.player).then( (response: ActionFormResponse) => {
        if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) {
          this.isConfigurationSettingsOpen = false;
          return;
        }
        switch(response.selection) {
          case 0:
            this.showClientScreen();
            break;
          case 1:
            if(this.player.hasTag("isOperator")) {
              this.showServerScreen();
            } else {
              this.showGuideScreen();
            }
            break;
          case 2:
            if(this.player.hasTag("isOperator")) {
              this.showGuideScreen();
            } else {
              this.showCreditsScreen();
            }
            break;
          case 3:
            this.showCreditsScreen();
            break;
          default:
            break;
        }
        this.isConfigurationSettingsOpen = false;
        return;
      });
    });
  }
  showGuideScreen() {
    const mainForm = new ActionFormData();
    mainForm.title({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.title"}]})
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.introduction_section"}]}, "textures/gui/addon_guide/info")
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.fishers_table_section"}]}, "textures/gui/addon_guide/fishers_table")
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.fishers_book_section"}]}, "textures/gui/addon_guide/fishers_book")
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancements_section"}]}, "textures/gui/addon_guide/hooks")
    .button({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]}, "textures/ui/arrow_left");

    let form: MessageFormData;
    mainForm.show(this.player).then((response) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
      switch(response.selection) {
        case 0:
          form = new MessageFormData();
          form.title({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.introduction_section"}]});
          form.body({
            rawtext: [
              {
                translate: "yn:fishing_got_reel.configuration.addon_guide.introduction_guide.content",
                with: ["\n    ", "\n\n    "]
              }
            ]
          });
          form.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
          form.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
          form.show(this.player).then((descriptionResponse) => {
            if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
            if(descriptionResponse.selection === 0) return this.showGuideScreen();
            return;
          });
          break;
        case 1:
          form = new MessageFormData();
          form.title({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.fishers_table_section"}]});
          form.body({
            rawtext: [
              {
                translate: "yn:fishing_got_reel.configuration.addon_guide.fishers_table_guide.content",
                with: ["\n    ", "\n"]
              }
            ]
          })
          form.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
          form.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
          form.show(this.player).then((descriptionResponse) => {
            if(descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
            if(descriptionResponse.selection === 0) return this.showGuideScreen();
            return;
          });
          break;
        case 2:
          form = new MessageFormData();
          form.title({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.fishers_book_section"}]});
          form.body({rawtext: [
            {
              translate: "yn:fishing_got_reel.configuration.addon_guide.fishers_book_guide.content",
              with: ["\n    "]
            }
          ]});
          form.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
          form.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
          form.show(this.player).then((descriptionResponse) => {
            if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
            if(descriptionResponse.selection === 0) return this.showGuideScreen();
            return;
          });
          break;
        case 3:
          const HookSectionView = () => {
            const mainForm = new ActionFormData();
            mainForm.title({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancements_section"}]});
            mainForm.button({rawtext: [{translate: "item.yn:fishing_got_reel:normal_hook"}]}, "textures/items/normal_hook");
            mainForm.button({rawtext: [{translate: "item.yn:fishing_got_reel:nautilus_hook"}]}, FishingCustomEnchantmentType.Nautilus.icon);
            mainForm.button({rawtext: [{translate: "item.yn:fishing_got_reel:luminous_siren_hook"}]}, FishingCustomEnchantmentType.Luminous.icon);
            mainForm.button({rawtext: [{translate: "item.yn:fishing_got_reel:pyroclasm_hook"}]}, FishingCustomEnchantmentType.Pyroclasm.icon);
            mainForm.button({rawtext: [{translate: "item.yn:fishing_got_reel:tempus_hook"}]}, FishingCustomEnchantmentType.Tempus.icon);
            mainForm.button({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancement_guide.fermentedEye"}]}, FishingCustomEnchantmentType.FermentedEye.icon);
            mainForm.button({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]}, "textures/ui/arrow_left");

            let hookForm: MessageFormData;
            mainForm.show(this.player).then((response) => {
              if(response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
              switch(response.selection) {
                case 0:
                  hookForm = new MessageFormData();
                  hookForm.title({rawtext: [{translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancements_section"}]});
                  
                  hookForm.body({rawtext: [
                    {
                      "text": "\n"
                    },
                    {
                      translate: "yn:fishing_got_reel.enchantments.iron_hook.description"
                    },
                    {
                      "text": "\n"
                    },
                    { 
                      translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancement_guide.iron_hook_recipe",
                      with: ["\n"]
                    }
                  ]});
                  hookForm.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
                  hookForm.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 1:
                  hookForm = new MessageFormData();
                  hookForm.title({rawtext: [{translate: "item.yn:fishing_got_reel:nautilus_hook"}]});
                  hookForm.body({rawtext: [
                    {
                      "text": "\n"
                    },
                    {
                      translate: "yn:fishing_got_reel.enchantments.nautilus.description"
                    },
                    {
                      "text": "\n"
                    },
                    { 
                      translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancement_guide.nautilus_hook_recipe",
                      with: ["\n"]
                    }
                  ]});
                  hookForm.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
                  hookForm.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 2:
                  hookForm = new MessageFormData();
                  hookForm.title({rawtext: [{translate: "item.yn:fishing_got_reel:luminous_siren_hook"}]});
                  hookForm.body({rawtext: [
                    {
                      "text": "\n"
                    },
                    {
                      translate: "yn:fishing_got_reel.enchantments.luminous.description"
                    },
                    {
                      "text": "\n"
                    },
                    { 
                      translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancement_guide.luminous_hook_recipe",
                      with: ["\n"]
                    }
                  ]});
                  hookForm.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
                  hookForm.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 3:
                  hookForm = new MessageFormData();
                  hookForm.title({rawtext: [{translate: "item.yn:fishing_got_reel:pyroclasm_hook"}]});
                  hookForm.body({rawtext: [
                    {
                      "text": "\n"
                    },
                    {
                      translate: "yn:fishing_got_reel.enchantments.pyroclasm.description"
                    },
                    {
                      "text": "\n"
                    },
                    { 
                      translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancement_guide.pyroclasm_hook_recipe",
                      with: ["\n"]
                    }
                  ]});
                  hookForm.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
                  hookForm.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 4:
                  hookForm = new MessageFormData();
                  hookForm.title({rawtext: [{translate: "item.yn:fishing_got_reel:tempus_hook"}]});
                  hookForm.body({rawtext: [
                    {
                      "text": "\n"
                    },
                    {
                      translate: "yn:fishing_got_reel.enchantments.tempus.description"
                    },
                    {
                      "text": "\n"
                    },
                    { 
                      translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancement_guide.tempus_hook_recipe",
                      with: ["\n"]
                    }
                  ]});
                  hookForm.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
                  hookForm.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 5:
                  hookForm = new MessageFormData();
                  hookForm.title({rawtext: [{translate: "item.yn:fishing_got_reel:fermented_spider_eye_hook"}]});
                  hookForm.body({rawtext: [
                    {
                      "text": "\n"
                    },
                    {
                      translate: "yn:fishing_got_reel.enchantments.fermentedeye.description"
                    },
                    {
                      "text": "\n"
                    },
                    { 
                      translate: "yn:fishing_got_reel.configuration.addon_guide.hook_enhancement_guide.fermeye_hook_recipe",
                      with: ["\n"]
                    }
                  ]});
                  hookForm.button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]});
                  hookForm.button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                default: return this.showGuideScreen();
              }
            });
          }
          HookSectionView();
          break;
        case 4:
          return this.showConfigurationScreen();
        default:
          break;
      }
    });
  }
  showCreditsScreen() {
    const form = new MessageFormData();
    form.title({rawtext: [
      {text: " "},
      {translate: "yn:fishing_got_reel.configuration.addon_options.credits"},
      {text: " "}
    ]})
    .body(
      `
  Here are the people who really made this all possible:

   Dal4y - Created most of the Textures. Follow on Twitter: @DaL4ydobeballin.

   BAO - Minecraft Bedrock-Addon Community for scripts, and technical guides.

   Big Chungus - Splash Particle Template for VFX.

   Martin - For the support and letting me use his microsoft account to create this project.

           You reading this! 
      
              Enjoy fishing!
      `
    )
    .button2({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.exit"}]})
    .button1({rawtext: [{translate: "yn:fishing_got_reel.configuration.general.back"}]});
    form.show(this.player).then((response) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) {
        return;
      }
      if(response.selection === 0) return this.showConfigurationScreen();
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
        form.dropdown({rawtext: [{translate: builder.name}]}, builder.values as string[], cachedConfigurationValues[index] as number);
      } 
      else if (typeof builder.defaultValue === "boolean") {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.toggle({rawtext: [{translate: builder.name}]}, cachedConfigurationValues[index] as boolean);
      } 
      else if (typeof builder.defaultValue === "string" && !isArrayEmpty) {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.textField({rawtext: [{translate: builder.name}]}, cachedConfigurationValues[index], builder.defaultValue);
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
      return this.showConfigurationScreen();
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
        form.dropdown({rawtext: [{translate: builder.name}]}, builder.values as string[], cachedConfigurationValues[index] as number);
      } else if (typeof builder.defaultValue === "string" && !isArrayEmpty) {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.textField({rawtext: [{translate: builder.name}]}, cachedConfigurationValues[index]);
      } else if (typeof builder.defaultValue === "boolean") {
        cachedConfigurationValues[index] = builder.defaultValue;
        form.toggle({rawtext: [{translate: builder.name}]}, cachedConfigurationValues[index] as boolean);
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
      localFishersCache.set(this.player.id, this.source);
      return this.showConfigurationScreen();
    });
  }
}


