import { NEWERA } from "../helpers/config.mjs";
import { NewEraItem } from "../documents/item.mjs";
import { NewEraActor } from "../documents/actor.mjs";
import {createEffect, editEffect, deleteEffect, toggleEffect} from "../helpers/effects.mjs";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class NewEraItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["newera", "sheet", "item"],
      width: 680,
      height: 520,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "properties" }],
      scrollY: [".sheet-body"]
    });
  }

  /** @override */
  get template() {
    switch(this.item.type){
      case "Item":
        return `systems/newera-sol366/templates/item/item-sheet.hbs`;
      case "Melee Weapon":
        return `systems/newera-sol366/templates/item/melee-weapon-sheet.hbs`;
      case "Ranged Weapon":
        return `systems/newera-sol366/templates/item/ranged-weapon-sheet.hbs`;
      case "Armor":
        return `systems/newera-sol366/templates/item/armor-sheet.hbs`;
      case "Shield":
        return `systems/newera-sol366/templates/item/shield-sheet.hbs`;
      case "Spell":
        return `systems/newera-sol366/templates/item/spell-sheet.hbs`;
      case "Enchantment":
        return `systems/newera-sol366/templates/item/enchantment-sheet.hbs`;
      case "Potion":
        return `systems/newera-sol366/templates/item/potion-sheet.hbs`;
      case "Feat":
        return `systems/newera-sol366/templates/item/feat-sheet.hbs`;
      case "Action":
        return `systems/newera-sol366/templates/item/action-sheet.hbs`;
      case "Class":
        return `systems/newera-sol366/templates/item/class-sheet.hbs`;
    }
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
      /* Disabling this bit until it's needed in a later build
      if (this.item.type == "Action" && actor.type == "Player Character"){
        itemData.system.statModifierList = actor.modifierList;
      }
      */
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = context.item.system
    context.flags = context.item.flags;
    context.effects = context.item.effects;

    //Abort data retrieval if the feat is unmigrated
    if (this.item.type == 'Feat' && context.system.tiers.base){
      ui.notifications.warn(`This feat requires migration. Please perform the Update Items (Admin) action on this token.`);
      return {};
    }

    if(this.item.typeIs(NewEraItem.Types.STACKABLE)){
      if (this.item.isEmbedded && this.item.parent instanceof Actor && !this.item.parent.typeIs(NewEraActor.Types.CHARACTER)) {
        context.showRollQuantity = true;
      }
    }

    if (this.item.typeIs(NewEraItem.Types.SPELL)) {
      if (this.item.system.keywords.includes("Material")) {
        context.showMaterials = true;
      }
    }

    if (this.item.typeIs(NewEraItem.Types.ENCHANTMENT)) {
      context.thingsAreComplex = (this.item.system.enchantmentType == 'CE');
      context.charged = this.item.system.keywords.includes("Charged");
      context.totalEnergyCost = this.item.totalEnergyCost;
    }

    if (context.thingsAreComplex) {
      for (const [key, comp] of Object.entries(this.item.system.components)) {
        const school = NEWERA.schoolOfMagicNames[comp.check];
        this.item.system.components[key].img = `systems/newera-sol366/resources/${school}.png`;
      }
    }
    
    context.gm = (game.user.role >= 2);

    console.log("ITEM SHEET CONTEXT DUMP");
    console.log(context);

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    const system = this.item.system;

    //Handlers to set up UI for various sheets

    //auto-value select dropdowns
    html.find("select.auto-value").val(function() {
      const dataField = $(this).attr("name");
      const paths = dataField.split(".");
      //console.log(paths);
      let retVal = system;
      for (let i=1; i<paths.length; i++){
        //console.log(paths[i]);
        if (retVal === undefined){ //If we come across undefined in the data model, assume it's for a new selection that hasn't been set yet and return the default value (an empty string)
          return "";
        }
        retVal = retVal[paths[i]];
        //console.log(retVal);
      }
      return retVal;
    });

    if (this.item.type == "Item"){
      html.find("#rarity-"+this.item.id).val(system.rarity);
      html.find("#slot-"+this.item.id).val(system.equipSlot);
      html.find("#outfit-"+this.item.id).val(system.outfitType);
    }
    else if (this.item.type == "Spell"){

      html.find("#rarity-"+this.item.id).val(system.rarity);
      html.find("#cast-type-"+this.item.id).val(system.castType);
      html.find("#range-desc-"+this.item.id).val(system.range.description);
      html.find("#damage-type-"+this.item.id).val(system.damage.type);
      html.find("#school-"+this.item.id).val(system.school);
      html.find("#refinement-"+this.item.id).val(system.refinementLevel);

      html.find(".editor-content").css("color", "rgba(0, 0, 0, 0.0)"); //I reject your HTML and substitute my own
      html.find("#amplified-description").html(system.formattedDescription);
    }
    else if (this.item.type == "Feat"){
      html.find("#feat-type-"+this.item.id).val(system.featType);
      html.find("#feat-max-"+this.item.id).val(system.maximumTier);
      if(system.hasSubType){
        html.find("#feat-subtype-"+this.item.id).show();
      } else {
        html.find("#feat-subtype-"+this.item.id).hide();
      }
    } else if (this.item.type == "Melee Weapon"){
      html.find("#rarity-"+this.item.id).val(system.rarity);
      html.find("#melee-type-"+this.item.id).val(system.weaponType);
      html.find("#handedness-"+this.item.id).val(system.handedness);
      html.find("#material-"+this.item.id).val(system.material);
      html.find("#condition-"+this.item.id).val(system.condition);
      html.find("#damage-type-"+this.item.id).val(system.customDamage.type);
    } else if (this.item.type == "Ranged Weapon"){
      html.find("#rarity-"+this.item.id).val(system.rarity);
      html.find("#ranged-type-"+this.item.id).val(system.weaponType);
      html.find("#handedness-"+this.item.id).val(system.handedness);
      html.find("#ammo-"+this.item.id).val(system.ammo.itemName);
      html.find("#action-"+this.item.id).val(system.firingAction);
      html.find("#license-"+this.item.id).val(system.licenseLevel);
    } else if (this.item.type == "Armor"){
      html.find("#armor-type-"+this.item.id).val(system.armorType);
      html.find("#rarity-"+this.item.id).val(system.rarity);
      html.find("#material-"+this.item.id).val(system.material);
      html.find("#condition-"+this.item.id).val(system.condition);
    } else if (this.item.type == "Shield"){
      html.find("#shield-type-"+this.item.id).val(system.shieldType);
      html.find("#rarity-"+this.item.id).val(system.rarity);
      html.find("#material-"+this.item.id).val(system.material);
      html.find("#condition-"+this.item.id).val(system.condition);
    } else if (this.item.type == "Enchantment"){
      html.find("#rarity-"+this.item.id).val(system.rarity);
      html.find("#ench-type-"+this.item.id).val(system.enchantmentType);
      html.find("#school-"+this.item.id).val(system.school);
      html.find("#refinement-"+this.item.id).val(system.refinementLevel);
      html.find(".editor-content").css("color", "rgba(0, 0, 0, 0.0)");
      html.find("#amplified-description").html(system.formattedDescription);
    } else if (this.item.type == "Class"){
      html.find("#class-"+this.item.id).val(system.selectedClass);
      html.find('#class-desc-'+this.item.id).html(system.description);
    } else if (this.item.type == "Potion"){
      html.find("#rarity-"+this.item.id).val(system.rarity);
      html.find("#potion-type-"+this.item.id).val(system.potionType);
      html.find("#recipe-level-"+this.item.id).val(system.recipeLevel);
      html.find("#behavior-"+this.item.id).val(system.stackingBehavior);

      html.find(".editor-content").css("color", "rgba(0, 0, 0, 0.0)");
      html.find("#amplified-description").html(system.formattedDescription);
    } else if (this.item.type == "Phone"){
      html.find("#weather-"+this.item.id).val(system.weather.conditions);
      html.find("#service-"+this.item.id).val(system.service);
      html.find("#month-"+this.item.id).val(system.time.month);
      html.find("#apply-game-state").click(ev => {
        this.updateLinkedItems();
      });
    } else if (this.item.type == "Action"){
      html.find("#action-type-"+this.item.id).val(system.actionType);
      for (const [i, roll] of Object.entries(system.rolls)){
        html.find(`#die-size-${this.item.id}-${i}`).val(roll.dieSize);
        console.log(`#die-size-${this.item.id}-${i} ${roll.dieSize}`);
        html.find(`#mod-stat-${this.item.id}-${i}`).val(roll.stat); //Shouldn't do anything if this dropdown is hidden
      }
      if (this.isEditable){
        html.find("#addRollButton-"+this.item.id).click(ev => {
          this.item.addRoll();
        });
        html.find(".roll-switch").click(ev => {
          const element = $(ev.currentTarget);
          this.item.switchRollMode(element.data("rollIndex"), element.data("switch") == "advanced");
        });
        html.find(".roll-delete").click(ev => {
          const element = $(ev.currentTarget);
          this.item.deleteRoll(element.data("rollIndex"));
        });
      }
    }

    //Enchantment drag-and-drop to items
    html.find(".drag-to-enchant").on("dragstart", ev => this.onEnchantmentDragStart(ev));
    html.find(".enchantment-dropzone").on("dragover", ev => ev.preventDefault());
    html.find(".enchantment-dropzone").on("drop", ev => {
      this.onEnchantmentDrop(ev);
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;
    html.find("#clearCasperMetadata").click(() => {
      new Dialog({
        title: "Are you sure?",
        content: `<p>This will remove the CASPER metadata from this item. It will be treated as a custom item, rather than one from the compendium, and cannot be updated by future compendium changes. The item will no longer be stackable with others of the same type.</p>
        <p>You should only do this if you've made modifications to the item's core properties that you don't want to lose. Note that superficial changes like quantity, condition, and enchantments do not require this in order to be preserved.</p>
        <p>You cannot undo this action!</p>`,
        buttons: {
          confirm: {
            icon: `<i class="fa-solid fa-check"></i>`,
            label: "I know what I'm doing",
            callback: () => this.item.clearCasperMetadata()
          },
          cancel: {
            icon: `<i class="fa-solid fa-x"></i>`,
            label: "Cancel",
          }
        }
      }).render(true);
    });
    html.find("#addItemAction").click(() => {
      this.item.addAction();
      this.render(false);
    });
    html.find(".addItemActionRoll").click(ev => {
      const actionIndex = $(ev.currentTarget).data("actionIndex");
      this.item.addActionRoll(actionIndex);
      this.render(false);
    });

    html.find("#addMaterialCost").click(() => {
      this.item.addMaterialCost();
    });
    html.find(".deleteMaterialCost").click(ev => {
      const index = $(ev.currentTarget).data("index");
      this.item.deleteMaterialCost(index);
    });
    html.find("#addComponent").click(() => {
      this.item.addComponent();
    });
    html.find(".deleteComponent").click(ev => {
      const index = $(ev.currentTarget).data("index");
      this.item.deleteComponent(index);
    });

    // Active Effect management
    html.find(".effect-create").click((() => createEffect(this.item)));
    html.find(".effect-edit").click((ev => editEffect(ev, this.item)));
    html.find(".effect-delete").click((ev => deleteEffect(ev, this.item)));
    html.find(".effect-toggle").click((ev => toggleEffect(ev, this.item)));

    // Roll handlers, click handlers, etc. would go here.
  }

  async onEnchantmentDragStart(event) {
    //event.preventDefault();
    const ampFactor = this.item.system.ampFactor;
    const oe = event.originalEvent;
    console.log(`ENCHANTMENT DRAG START ${this.item.name} x${ampFactor}`);
    oe.dataTransfer.setData("enchantmentUuid", this.item.uuid);
    oe.dataTransfer.setData("ampFactor", this.item.system.ampFactor);
    oe.dataTransfer.effectAllowed = "copy";
  }

  async onEnchantmentDrop(event) {
    const oe = event.originalEvent;
    console.log(`Entering NEW onEnchantmentDrop`);
    //Get the data from the drop
    const uuid = oe.dataTransfer.getData("enchantmentUuid");
    const ampFactor = oe.dataTransfer.getData("ampFactor");
    const enchantment = await fromUuid(uuid);
    if (enchantment && enchantment.typeIs(NewEraItem.Types.ENCHANTMENT)) {
      await this.item.enchant(enchantment, ampFactor);
    }
  }
}
