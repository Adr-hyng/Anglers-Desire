import { EntityInventoryComponent, EquipmentSlot, ItemEnchantableComponent, ItemStack, ItemTypes, Player, system } from "@minecraft/server";
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
import { CustomEnchantment } from "custom_enchantment/custom_enchantment";
import { MinecraftItemTypes } from "vanilla-types/index";
import { MyCustomItemTypes } from "fishing_system/items/custom_items";

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
    .title(" Fisher's Table ")
    .button("Add Enhancements", "textures/gui/fishers_table/add_enhancement")
    .button("Remove Enhancements", "textures/gui/fishers_table/remove_enhancement")
    .button("View Enhancements", "textures/gui/fishers_table/view_enhancement")
    .button("View Fishing Book", "textures/gui/fishers_table/view_book")
    .button("Give Settings Item", "textures/gui/fishers_table/give_configuration");
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
              inventory.giveItem(addonConfigItemType, 1);
            } else {
              SendMessageTo(this.player, {rawtext: [
                {
                  translate: "yn:fishing_got_reel.already_has_item",
                  with: ["Reelz Configuration (Item)"]
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
    form.title("Choose enhancement to add");
    for(const customEnchantment of allCustomEnchantments){
      let isAvailable = false;
      const result = this.player.runCommand(`testfor @s[hasItem={item=${customEnchantment.id}}]`);
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
        const customEnchantment = CustomEnchantmentTypes.get(new CustomEnchantment({ name: enchantmentToAdd.key, level: 1 }));
        enchantments.override(equippedFishingRod).addCustomEnchantment(customEnchantment);
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
    form.title("Choose enhancement to remove");
    for(const customEnchantment of allCustomEnchantments) {
      const isAvailable = enchantments.hasCustomEnchantment(customEnchantment);
      availableEnchantments.set(customEnchantment.name, isAvailable);
      form.toggle(`${(!isAvailable ? "§c" : "§a")}${customEnchantment.name}`, false);
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
    .title("Choose enhancement to inspect");

    const AvailableCustomEnchantments = enchantments.getCustomEnchantments();
    for(const customEnchantment of AvailableCustomEnchantments) {
      form.button(`Usage: ${customEnchantment.usage} / ${customEnchantment.maxUsage}`, customEnchantment.icon);
    }
    form.button("BACK", "textures/ui/arrow_left");

    form.show(this.player).then( (response: ActionFormResponse) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
      if(response.selection >= AvailableCustomEnchantments.length) return this.showFisherTableScreen();
      const index = response.selection;
      const descriptionForm = new MessageFormData();
      const selectedCustomEnchantment = AvailableCustomEnchantments[index];
      descriptionForm.title(selectedCustomEnchantment.name);
      descriptionForm.body( 
      `
§lDescription:§r
  ${selectedCustomEnchantment.description}.

§lLore:§r
  §o${selectedCustomEnchantment.lore}
      `);
      descriptionForm.button2("EXIT");
      descriptionForm.button1("BACK");
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
      .title(parsedAddonTitle + " Settings")
      .button("Client Options", "textures/gui/configurations/client_status"); //"C:\Users\Adrian Abaigar\Downloads\Compressed\bedrock-samples-1.21.0.3\bedrock-samples-1.21.0.3\resource_pack\textures\ui\deop.png"

      form.button("Server Options", "textures/gui/configurations/operator_status"); // IF player is operator

      form.button("Addon Guide", "textures/gui/configurations/guide")
      .button("Special Thanks", "textures/gui/configurations/credits");
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
            this.showServerScreen();
            break;
          case 2:
            this.showGuideScreen();
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
    mainForm.title("Addon Guide")
    .button("What to expect?")
    .button("Fisher's Table")
    .button("Fisher's Caught List")
    .button("Hook Enhancements")
    .button("Back");

    let form: MessageFormData;
    mainForm.show(this.player).then((response) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
      switch(response.selection) {
        case 0:
          form = new MessageFormData();
          form.title("What to expect?");
          form.body(
            "\n    This addon completely overhauls the vanilla fishing experience, replacing the simple reeling of fish items with a dynamic system where you catch real entities. \n\n    Similar to the fishing mechanics in games like Harvest Moon Series, Stardew Valley and Animal Crossing, you’ll now reel entities or items up into the sky. \n\n    As well as adding more practical uses for amethyst shard, glowing ink sacs, nautilus shell, and more to enhance your fishing experience."
          );
          form.button2("EXIT");
          form.button1("BACK");
          form.show(this.player).then((descriptionResponse) => {
            if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
            if(descriptionResponse.selection === 0) return this.showGuideScreen();
            return;
          });
          break;
        case 1:
          form = new MessageFormData();
          form.title("Fisher's Table");
          form.body(`
    The Fisher's Table is a new useful block that functions similarly to the Smithing Table. While it doesn’t replace the barrel for the fisherman villager yet, it allows players to enhance fishing rod hooks, view available enhancements, and access the list of catchable fish.
    
    To craft one, you need the following materials and in a crafting table, follow this pattern:
    | A B |
    | X X | 
    | X X |

    Materials:
    A = Stick
    B = Any vanilla fish
    X = Any vanilla planks
    `);
          form.button2("EXIT");
          form.button1("BACK");
          form.show(this.player).then((descriptionResponse) => {
            if(descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
            if(descriptionResponse.selection === 0) return this.showGuideScreen();
            return;
          });
          break;
        case 2:
          form = new MessageFormData();
          form.title("Fisher's Caught List");
          form.body(
            `
    A detailed list of all catchable fish in the addon, including lore, obtainability, and catch rates. This feature enriches the fishing experience by giving players more insight into what they can catch.
            `
          );
          form.button2("EXIT");
          form.button1("BACK");
          form.show(this.player).then((descriptionResponse) => {
            if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
            if(descriptionResponse.selection === 0) return this.showGuideScreen();
            return;
          });
          break;
        case 3:
          const HookSectionView = () => {
            const mainForm = new ActionFormData();
            mainForm.title("Hooks");
            mainForm.button("Iron Hook", "textures/items/normal_hook");
            mainForm.button("Nautilus Hook", FishingCustomEnchantmentType.Nautilus.icon);
            mainForm.button("Luminous Hook", FishingCustomEnchantmentType.Luminous.icon);
            mainForm.button("Pyroclasm Hook", FishingCustomEnchantmentType.Pyroclasm.icon);
            mainForm.button("Tempus Hook", FishingCustomEnchantmentType.Tempus.icon);
            mainForm.button("Ferm. Spider Eye Hook", FishingCustomEnchantmentType.FermentedEye.icon);
            mainForm.button("Back");

            let hookForm: MessageFormData;
            mainForm.show(this.player).then((response) => {
              if(response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) return;
              switch(response.selection) {
                case 0:
                  hookForm = new MessageFormData();
                  hookForm.title("Iron Hook");
                  hookForm.body(
                  `
    Crafting Type: Crafting Table
    Crafting Recipe:
    |      X |
    | X   X |
    |   X    |

    Material:
    X = Iron Nugget
                  `);
                  hookForm.button2("EXIT");
                  hookForm.button1("BACK");
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 1:
                  hookForm = new MessageFormData();
                  hookForm.title("Nautilus Hook");
                  hookForm.body(
                  `
    Crafting Type: Any
    Crafting Recipe:
    | A B |

    Materials:
    A = Nautilus Shell
    B = Iron Hook
                  `);
                  hookForm.button2("EXIT");
                  hookForm.button1("BACK");
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 2:
                  hookForm = new MessageFormData();
                  hookForm.title("Luminous Hook");
                  hookForm.body(
                  `
    Crafting Type: Any
    Crafting Recipe:
    | A B |

    Materials:
    A = Glow Ink Sac
    B = Iron Hook
                  `);
                  hookForm.button2("EXIT");
                  hookForm.button1("BACK");
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 3:
                  hookForm = new MessageFormData();
                  hookForm.title("Pyroclasm Hook");
                  hookForm.body(
                  `
    Crafting Type: any
    Crafting Recipe:
    | A B |

    Materials:
    A = Magma Cream
    B = Iron Hook
                  `);
                  hookForm.button2("EXIT");
                  hookForm.button1("BACK");
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 4:
                  hookForm = new MessageFormData();
                  hookForm.title("Tempus Hook");
                  hookForm.body(
                  `
    Crafting Type: Any
    Crafting Recipe:
    | A B |

    Materials:
    A = Amethyst Shard
    B = Iron Hook
                  `);
                  hookForm.button2("EXIT");
                  hookForm.button1("BACK");
                  hookForm.show(this.player).then((descriptionResponse) => {
                    if (descriptionResponse.canceled || descriptionResponse.cancelationReason === FormCancelationReason.UserClosed || descriptionResponse.cancelationReason === FormCancelationReason.UserBusy) return;
                    if(descriptionResponse.selection === 0) return HookSectionView();
                    return;
                  });
                  break;
                case 5:
                  hookForm = new MessageFormData();
                  hookForm.title("Fermented Spider Eye covered Hook");
                  hookForm.body(
                  `
    Crafting Type: Any
    Crafting Recipe:
    | A B |

    Materials:
    A = Fermented Spider Eye
    B = Iron Hook
                  `);
                  hookForm.button2("EXIT");
                  hookForm.button1("BACK");
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
    form.title(" Special Thanks ")
    .button2("BACK")
    .button1("EXIT")
    .body(
      `
  Here are the people who really made this all possible:

   Dal4y - Created most of the textures. Follow this talented artist's Twitter: @DaL4ydobeballin.

   BAO - Minecraft Bedrock-Addon Community for scripts, and technical guides.

   Big Chungus - Splash Particle Template for VFX.

   Martin - For the support and letting me use his microsoft account to create this project.

           You reading this! 
      
              Enjoy fishing!
      `
    );
    form.show(this.player).then((response) => {
      if (response.canceled || response.cancelationReason === FormCancelationReason.UserClosed || response.cancelationReason === FormCancelationReason.UserBusy) {
        return;
      }
      if(response.selection === 1) return this.showConfigurationScreen();
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
      localFishersCache.set(this.player.id, this.source);
      return this.showConfigurationScreen();
    });
  }
}


