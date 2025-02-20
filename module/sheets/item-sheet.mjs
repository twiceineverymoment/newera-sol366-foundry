import { NEWERA } from "../helpers/config.mjs";
import { NewEraItem } from "../documents/item.mjs";
import { NewEraActor } from "../documents/actor.mjs";
import { NewEraUtils } from "../helpers/utils.mjs";
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

    //Set values of select elements 
    html.find('select.auto-value').each((i, element) => {
      const dataField = $(element).attr("name") || $(element).data("indirectName"); // Using data-indirect-name prevents the select from being picked up by Foundry's built-in updates, in cases where the manual listener performs an update (to avoid updating twice)
      const value = NewEraUtils.getSelectValue(dataField, this.item);
      if (value !== null){
        $(element).val(value);
      }
    });
    if (this.item.typeIs(NewEraItem.Types.AMPLIFIABLE)){
      /*
      * This logic hides the normal text content field and replaces it with one that shows the formatted text.
      * Clicking on the editor will open it normally.
      * Made transparent instead of hidden so it is still clickable.
      */
      html.find(".editor-content").css("color", "rgba(0, 0, 0, 0.0)"); //I reject your HTML and substitute my own
      html.find("#amplified-description").html(system.formattedDescription);
    } else if (this.item.typeIs(NewEraItem.Types.CLASS)){
      html.find('#class-desc').html(system.description);
    } else if (this.item.typeIs(NewEraItem.Types.ACTION)){
      if (this.isEditable){
        html.find("#addRoll").click(ev => {
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
