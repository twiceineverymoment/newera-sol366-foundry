import {createEffect, editEffect, deleteEffect, toggleEffect, getEffectDuration, findStandardActiveEffectByName} from "../helpers/effects.mjs";
import { NEWERA } from "../helpers/config.mjs";
import { ClassInfo } from "../helpers/classFeatures.mjs";
import { Actions } from "../helpers/actions/actions.mjs";
import { NewEraUtils } from "../helpers/utils.mjs";
import { FeatBrowser } from "./feat-browser.mjs";
import { NewEraActor } from "../documents/actor.mjs";
import { NewEraItem } from "../documents/item.mjs";
import { SpellSearchParams } from "../schemas/spell-search-params.mjs";
import { SpellBrowser } from "./spell-browser.mjs";
import { ClassSelect } from "./class-select.mjs";
import { ExtendedFeatData } from "../helpers/feats.mjs";
import { DefaultActions } from "../helpers/actions/defaultActions.mjs";
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class NewEraActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["newera", "sheet", "actor"],
      template: "systems/newera-sol366/templates/actor/actor-sheet.hbs",
      width: 785,
      height: 875,
      scrollY: [".newera-actorsheet-scroll", ".action-detail", ".inventory-table-container"],
      tabs: [
        { navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "profile" },
        { navSelector: ".spell-tabs", contentSelector: ".spell-table", initial: "all"}
      ]
    });
  }

  /** @override */
  get template() {
    if (this.actor.system.defeated){
      return `systems/newera-sol366/templates/actor/defeated-actor-sheet.hbs`;
    }
    switch(this.actor.type){
      case "Player Character":
        return `systems/newera-sol366/templates/actor/actor-character-sheet.hbs`;
      case "Non-Player Character":
        return `systems/newera-sol366/templates/actor/actor-npc-sheet.hbs`;
      case "Creature":
        return `systems/newera-sol366/templates/actor/actor-creature-sheet.hbs`;
      case "Container":
        return `systems/newera-sol366/templates/actor/actor-container-sheet.hbs`;
      case "Vehicle":
        return `systems/newera-sol366/templates/actor/actor-vehicle-sheet.hbs`;
    }
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = structuredClone(this.actor.system);
    context.flags = this.actor.flags;

    // Prepare character data and items.
    if (this.actor.typeIs(NewEraActor.Types.CHARACTER)){
      this._prepareCharacterData(context);
      if (this.actor.system.defeated){
        this._prepareCreatureItems(context); //If a character is defeated, using this item method puts all their stuff in the standard inventory list without changing the equipment slot data in case the character is revived
      } else {
        this._prepareItems(context);
      }
    }
    if (this.actor.typeIs(NewEraActor.Types.PC)) {
      this._prepareClassFeatures(context, context.inventory.classes);
      this._prepareFeatOptions(context, context.inventory.feats);
      this._prepareInspiration(context);
      //Split out custom resources
      const [custom, standard] = NewEraUtils.splitIndexedObject(context.system.additionalResources, r => r.custom);
      context.resources = {
        standard,
        custom
      }
    }
    if (this.actor.typeIs(NewEraActor.Types.CREATURE)){
      this._prepareCreatureData(context);
      this._prepareCreatureItems(context);
    }
    if (this.actor.typeIs(NewEraActor.Types.CONTAINER)){
      this._prepareContainerData(context);
    }
    if (this.actor.typeIs(NewEraActor.Types.ANIMATE)){
      this._prepareActions(context, this.actor);
    }
    if (this.actor.typeIs(NewEraActor.Types.INANIMATE)){
      this._prepareInanimateActorItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = this._prepareActiveEffects(context.actor.effects);

    console.log("ACTOR SHEET CONTEXT DUMP");
    console.log(context);
    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Localized labels for objects displayed on character sheet
    for (let [key, obj] of Object.entries(context.system.abilities)) {
      obj.label = game.i18n.localize("newera.ability."+key+".name") ?? key;
    }
    for (let [key, obj] of Object.entries(context.system.skills)) {
      obj.label = game.i18n.localize("newera.skill."+key+".name") ?? key;
    }
    for (let [key, obj] of Object.entries(context.system.magic)) {
      obj.label = game.i18n.localize("newera.magic.form."+key) ?? key;
    }
    for (let [key, obj] of Object.entries(context.system.specialties)) {
      obj.label = obj.subject + " (" + game.i18n.localize("newera.skill."+obj.defaultParent+".abbr") + ")";
    }
    context.useCustomPronouns = context.system.pronouns.index == 5;
  }

  _prepareCreatureData(context) {
    for (let [key, obj] of Object.entries(context.system.abilities)) {
      obj.label = game.i18n.localize("newera.ability."+key+".name") ?? key;
    }
    for (let [key, obj] of Object.entries(context.system.saves)) {
      obj.label = game.i18n.localize("newera.skill."+key+".name") ?? key;
    }
  }

  _prepareClassFeatures(context, classes){
    const features = [];
    const keys = [];
    const system = this.actor.system;
    const archetypes = ClassInfo.getArchetypeData(this.actor);
    for (const clazz of classes){
      const className = clazz.system.selectedClass.toLowerCase();
      for (const feature of ClassInfo.features[className]){
        if (feature.level <= clazz.system.level){
          if (feature.archetype) {
            //Determine whether to show the archetype-specific feature
            let unlockThreshold = archetypes[feature.archetype];
            let showFeature = (
              //If unlockThreshold is undefined, the actor doesn't have that archetype
              //'retroactiveUnlock' means the feature is unlocked if its respective archetype is chosen at a later level than the feature, i.e. if a character picks a second archetype and unlocks features that they would have gotten if they picked it as their first
              unlockThreshold && (unlockThreshold <= feature.level || feature.retroactiveUnlock)
            );
            if (!showFeature){
              continue;
            }
          }
          feature.className = feature.archetype ? NEWERA.classes[clazz.system.selectedClass].archetypes[feature.archetype] : clazz.system.selectedClass;
          feature.classImg = feature.archetype ? `${NEWERA.images}/${className == "researcher" ? "" : className+"_"}${feature.archetype}.png` : clazz.img;
          feature.clazz = clazz.system.selectedClass;

          //Copy the data from common features to the feature to be rendered
          if (feature.common){
            const commonFeature = ClassInfo.features.common[feature.common];
            feature.name = commonFeature.name;
            feature.description = commonFeature.description;
            feature.selections = commonFeature.selections;
            feature.key = commonFeature.key; //Common features are never going to be key=true, but whatever, this'll probably confuse the hell out of me in 2 years if I hard code it to false
            if (feature.selections){
              feature.id = `${feature.className.toLowerCase()}.${feature.common}.${feature.level}`; //Give common features a unique id so their selections can persist in the data model
            }
          }
          //Load the current value of each table value into the Handlebars context
          if (feature.tableValues){
            for (const tv of feature.tableValues){
              tv.current = tv.values[clazz.system.level];
            }
          }
          //Load the status of Spell Studies features into the Handlebars context
          if (feature.spellStudies){
            for (let i=0; i<feature.spellStudies.length; i++){
              //Determine whether to show the study guide butto
              feature.spellStudies[i].show = true;
              if (typeof feature.spellStudies[i].showWhen == "function"){
                try {
                  feature.spellStudies[i].show = feature.spellStudies[i].showWhen(this.actor);
                } catch (err) {
                  feature.spellStudies[i].show = false;
                }
              }
              if (feature.spellStudies[i].onOtherFeature){
                /*
                Spell studies blocks with this property set are used to offset their index position for that level in the rare case of a class having multiple study-guide-enabled features at the same level.
                They are not rendered in the sheet and should be skipped here too.
                UPDATE 2025 - This is less rare than originally thought
                */
                feature.spellStudies[i].show = false;
              }
              if (!feature.spellStudies[i].show){
                continue;
              }

              //Mark the spell studies features as complete if the remaining selection counter is EXPLICITLY zero (undefined means none chosen yet)
              feature.spellStudies[i].status = feature.spellStudies.length > 1 ? `(${i+1}/${feature.spellStudies.length})` : "";
              feature.spellStudies[i].index = i;
              try {
                const remainingSelections = this.actor.system.classes[clazz.system.selectedClass.toLowerCase()].spellStudies[feature.level][i.toString()];
                feature.spellStudies[i].remaining = (remainingSelections !== undefined) ? remainingSelections : feature.spellStudies[i].choose;
                feature.spellStudies[i].complete = (remainingSelections === 0);
                if (feature.spellStudies[i].complete){
                  feature.spellStudies[i].status += " (Complete)";
                } else if (remainingSelections) {
                  feature.spellStudies[i].status += ` (${remainingSelections} Remaining)`;
                }
              } catch (err) {
                //Several levels of the .classes object containing remainingSelections may not exist depending on how many spells the character has learned. Catching a ReferenceError here prevents needing to null check at every level
                feature.spellStudies[i].complete = false;
                feature.spellStudies[i].remaining = feature.spellStudies[i].choose;
              }
            }
          }
          //Prepare the selections for rendering
          if (feature.selections){
            Object.entries(feature.selections).forEach(([key, selection]) => {
              //Populate the options for dynamic selections
              if (typeof selection.dynamicOptions == "function"){
                selection.options = selection.dynamicOptions(this.actor);
              }
              //Determine whether to show the selection
              if (typeof selection.showWhen == "function"){
                try {
                  selection.show = selection.showWhen(this.actor);
                } catch (err) {
                  selection.show = false; //Assume that if the showWhen function throws an error, it's because the data isn't there yet as the feature just got unlocked. In virtually all cases, these selections should be hidden until a prior option is chosen.
                }
              } else {
                selection.show = true;
              }
              //Load the current value of the selection into the Handlebars context - This is so we know the previous value when a selection is changed
              const path = `${feature.id}.${key}`;
              const keys = path.split(".");
              //console.log(`[DEBUG] Finding current value for ${path}`);
              try {
                const currentValue = keys.reduce((acc, key) => acc[key], system.classes);
                selection.currentValue = currentValue;
                //console.log(`[DEBUG] ${path} = ${currentValue}`);
              } catch (err) {
                //During level-up, the new selection values will not exist yet, which will cause a ReferenceError. This is expected behavior - set the new feature's current value to an empty string.
                //console.log(`[DEBUG] Finding current value for ${path} returned an error - setting to empty`);
                selection.currentValue = "";
              }
            });
          }
          if (feature.key){
            keys.push(feature);
          } else {
            features.push(feature);
          }
        }
      }
    }
    //console.log(features);
    context.features = {
      key: keys.sort((a, b) => {
        if (a.level < b.level){
          return 1;
        } else if (a.level > b.level){
          return -1;
        } else {
          return 0;
        }
      }),
      basic: features.sort((a, b) => {
        if (a.level < b.level){
          return 1;
        } else if (a.level > b.level){
          return -1;
        } else {
          if (a.className == "Adventurer" && b.className != "Adventurer"){
            return 1;
          } else if (a.className != "Adventurer" && b.className == "Adventurer"){
            return -1;
          } else {
            return 0;
          }
        }
      }),
    };
  }

  _prepareFeatOptions(context, feats){
    context.features.feats = [];
    const globalFeatData = ExtendedFeatData.getFeatData();
    for (const feat of feats){
      if (feat.system.casperObjectId && globalFeatData[feat.system.casperObjectId]) {
        for (let tier = 1; tier <= feat.system.currentTier; tier++){
          if (globalFeatData[feat.system.casperObjectId][tier] && globalFeatData[feat.system.casperObjectId][tier].features) {
            for (const feature of globalFeatData[feat.system.casperObjectId][tier].features){
              feature.name = feat.name;
              feature.description = feat.system.base.description;
              feature.featType = NEWERA.featTypeMapping[feat.system.featType];
              feature.img = feat.img;
              feature.id = feat.system.casperObjectId;
              feature.tier = tier;
              
              if (feature.selections) {
                //If the feat is an upgrade, create copies of the selections for each tier
                if (feature.selections["0"] && feat.system.maximumTier == -1) {
                  feature.selections["0"].show = false;
                  for (let t = 1; t <= feat.system.currentTier; t++) {
                    feature.selections[t.toString()] = {
                      label: feature.selections["0"].label + ` #${t}`,
                      options: feature.selections["0"].options,
                      repeated: true //This flag tells the UI event listener to run the onChange function from the original selection, since structuredClone doesn't copy functions
                    }
                  }
                }
                Object.entries(feature.selections).forEach(([key, selection]) => {
                  //Populate the options for dynamic selections
                  if (typeof selection.dynamicOptions == "function"){
                    selection.options = selection.dynamicOptions(this.actor);
                  }
                  //Determine whether to show the selection
                  if (typeof selection.showWhen == "function"){
                    try {
                      selection.show = selection.showWhen(this.actor);
                    } catch (err) {
                      selection.show = false; //Assume that if the showWhen function throws an error, it's because the data isn't there yet as the feature just got unlocked. In virtually all cases, these selections should be hidden until a prior option is chosen.
                    }
                  } else if (selection.show !== false) {
                    selection.show = true;
                  }
                  //Load the current value of the selection into the Handlebars context - This is so we know the previous value when a selection is changed
                  const keys = [feature.id, feature.tier, key];
                  //console.log(`[DEBUG] Finding current value for ${keys.join(".")}`);
                  try {
                    const currentValue = keys.reduce((acc, key) => acc[key], this.actor.system.featSelections);
                    selection.currentValue = currentValue;
                    //console.log(`[DEBUG] ${keys.join(".")} = ${currentValue}`);
                  } catch (err) {
                    //During level-up, the new selection values will not exist yet, which will cause a ReferenceError. This is expected behavior - set the new feature's current value to an empty string.
                    //console.log(`[DEBUG] Finding current value for ${keys.join(".")} returned an error - setting to empty`);
                    //console.error(err);
                    selection.currentValue = "";
                  }
                });
              }

              if (feature.spellStudies) {
                //TODO
              }

              if (feature.selections || feature.spellStudies) { //Features which have data defined purely for unlock triggers or prerequisites have no need to be rendered on the sheet
                context.features.feats.push(feature);
              }
            }
          }
        }
      }
    }
  }

  _prepareActiveEffects(effects){
    for (const e of effects){
      e.durationText = getEffectDuration(e);
      e.allow = {
        up: false,
        down: false
      };
      const effectData = findStandardActiveEffectByName(e.name);
      //console.log(effectData);
      if (effectData){
        if (effectData.max > effectData.level){
          e.allow.up = true;
        }
        if (effectData.level > 1){
          e.allow.down = true;
        }
        e.stdData = effectData;
      }
      //console.log(`[DEBUG] Effect Prepare ${e.name}`);
      //console.log(e);
    }
    return effects;
  }

  _prepareContainerData(context){
    context.gm = (game.user.role >= 2);

  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    //console.log(`[NEWERA] sorting actor's items`);

    // Initialize containers.
    const backpack = []; //Array of all equipment items not in hands or on body
    const equipped = {}; //k/v of wearable slots to items
    const worn = {}; //k/v of slot numbers to items
    const feats = [];
    const classes = [];
    const actions = [];

    const equipment = context.system.equipment;
    const magic = {
      all: [],
      favorites: [],
      elemental: [],
      divine: [],
      physical: [],
      psionic: [],
      spectral: [],
      temporal: [],
      enchantments: [],
      recipes: []
    };

    //Disable the left hand slot if a two-handed item is in the right hand
    if (equipment.rightHand){
      context.disableHandednessSwap = true;
      const itemInMainHand = this.actor.items.get(equipment.rightHand);
      if (itemInMainHand){
        if (itemInMainHand.system.handedness == "2H" || (itemInMainHand.system.handedness == "1.5H" && !context.system.forceOneHanded)){
          equipment.twoHanded = true;
          equipment.leftHand = "";
        }
        if (itemInMainHand.system.handedness == "1.5H") {
          context.disableHandednessSwap = false;
        }
      } else {
        console.warn("Encountered a nonexistent item ID in equipment");
      }
    }

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      //console.log(i);
      i.img = i.img || DEFAULT_TOKEN;
      i.multiple = (i.system.quantity && i.system.quantity > 1);
      switch(i.type){
        case "Potion":
          if (i.system.isRecipe) {
            magic.recipes.push(i);
            break; //Break inside the if statement so actual potions will continue into the block below (equipment)
          }
        case "Item":
          //Show merge stacks if there is another item with the same object ID in the inventory - This runs on non-recipe potions and basic items
          i.showMergeStacks = (i.system.casperObjectId && !i.system.enchanted && context.items.some(j => NewEraItem.canStack(i, j)));
        case "Melee Weapon":
        case "Ranged Weapon":
        case "Armor":
        case "Shield":
        case "Phone":
            let inBackpack = true;
            for (const [slot, id] of Object.entries(equipment)){
              if (id == i._id){ //This should return false for the worn array, so no need for a type check here (probably)
                inBackpack = false;
                if (slot.includes("worn")){
                  const slotNum = parseInt(slot.substring(4));
                  if (slotNum < context.system.wornItemSlots){ //Only populate the slots for which the actor has enough room
                    worn[slotNum] = i;
                  } else {
                    inBackpack = true; //If an item is in a worn item slot outside the number the actor currently has, sort it into the backpack instead
                  }
                } else {
                  equipped[slot] = i;
                }
                break;
              }
            }
            if (inBackpack){
              backpack.push(i);
            }
          break;
        case "Enchantment":
          magic.enchantments.push(i);
          //No break here on purpose
        case "Spell":
          magic.all.push(i);
          if (context.system.favoriteSpells.includes(i._id)){
            i.favorite = true;
            magic.favorites.push(i);
          }
          let form = NEWERA.schoolToFormMapping[i.system.school];
          if (form && form != "genericCast"){
            magic[form].push(i);
          }
          break;
        case "Class":
          classes.push(i);
          break;
        case "Feat":
          feats.push(i);
          break;
        case "Action":
          actions.push(i);
          break;
      }
    }

    //Fill the worn items object with empty slots
    for (let w=0; w<context.system.wornItemSlots; w++){
      if (!worn[w]){
        worn[w] = null;
      }
    }

    if (backpack.length == 0){
      context.system.backpackEmpty = true;
    }

    context.inventory = {
      backpack: backpack,
      equipped: equipped,
      worn: worn,
      feats: feats,
      magic: magic,
      classes: classes,
      actions: actions
    }

    //console.log(context.items);
    //console.log(equipment);
    //console.log(context.inventory);

    
  }

  _prepareCreatureItems(context){
    context.inventory = {
      items: [],
      actions: []
    };
    context.magic = [];
    for (const i of context.items){
      if (NEWERA.typeIs(i, NewEraItem.Types.INVENTORY)){
        context.inventory.items.push(i);
      } else if (NEWERA.typeIs(i, NewEraItem.Types.MAGIC)){
        context.magic.push(i);
      } else if (NEWERA.typeIs(i, NewEraItem.Types.ACTION)){
        context.inventory.actions.push(i);
      } else {
        /* Crickets */ 
        // (Any other item types outside of these i.e. classes and feats should be ignored if someone adds one to a non-character actor)
      }
    }
  }

  _prepareInanimateActorItems(context){
    context.inventory = {
      items: []
    };
    for (const i of context.items){
      if (NEWERA.typeIs(i, NewEraItem.Types.INVENTORY)){
        context.inventory.items.push(i);
      } else {
        console.log(`Removed an item with type ${i.type} from inanimate actor`);
        i.delete();
      }
    }
  }

  _prepareActions(context, actor){
    const system = structuredClone(actor.system);
    //console.log(`Deriving actions for ${this.actor.name}`);
    const actions = {
      general: [],
      equipped: [],
      feats: [],
      exploration: [],
      social: [],
      downtime: [],
      magic: [],
      custom: [],
      spells: [],
      death: false,
      show: {
        general: (actor.type == "Player Character" || actor.type == "Non-Player Character" || system.hasStandardActions),
        equipped: false,
        feats: false,
        exploration: (actor.type == "Player Character" || actor.type == "Non-Player Character"),
        social: (actor.type == "Player Character" || actor.type == "Non-Player Character"),
        magic: (actor.type == "Creature" && system.hasMagic) || (system.casterLevel > 0),
        spells: (actor.typeIs(NewEraActor.Types.CHARACTER) && system.casterLevel > 0 && game.settings.get("newera-sol366", "favoriteSpellActions"))
      }
    };

    if (system.hitPoints.total > 0 || actor.type == "Creature"){ //If a PC or NPC's HP is 0, remove all actions and show only the death save
      /* Actions from inventory */
      const sortedItemIds = this._generateSortedItemIdList();
      for (const i of sortedItemIds){
        const item = this.actor.items.get(i);
        if(item.system.stored){
          continue;
        }
        for (const itemAction of item.getActions()){
        /*
          Currently, creatures and inanimate actors do not use the equipment slot system - all inventory drop zones are 'backpack'.
          Actions should never be grayed out based on equipment location for creatures.
          This may change in a future version.
        */
        itemAction.itemNotEquipped = (!this.actor.isItemActionAvailable(itemAction, item)) && (actor.type != 'Creature');
        //console.log(`action ${itemAction.name} disabled=${itemAction.disabled}`);
        itemAction.itemName = item.name;
        itemAction.itemId = item.id;
        itemAction.itemType = item.type;
        this._prepareActionContextInfo(itemAction, false);

        if (["Item", "Melee Weapon", "Ranged Weapon", "Armor", "Shield", "Phone", "Potion"].includes(item.type)){
          actions.show.equipped = true; //This sets the equipment section to show when there is at least one item with an action in the inventory
          actions.equipped.push(itemAction);
        } else if (["Feat", "Spell"].includes(item.type)){
          actions.show.feats = true;
          itemAction.macroClass = "action-macro-item";
          actions.feats.push(itemAction);
        } //Don't push actions from enchantments here, they only apply to items that get enchanted
      }
    }

    /*Custom Actions*/
    for(const action of context.inventory.actions){
      const actionSheetData = {
          name: action.name,
          itemId: action._id,
          images: {
            base: action.img,
            left: action.system.images.left,
            right: action.system.images.right
          },
          ability: "Special",
          skill: null,
          specialties: [],
          description: action.system.description,
          difficulty: "",
          actionType: action.system.actionType,
          rolls: action.system.rolls
      };
      this._prepareActionContextInfo(actionSheetData, true);
      actions.custom.push(actionSheetData);
    }

    /*Feature actions*/
    if (actor.type == "Player Character"){
      for (const clazz of context.inventory.classes){
        const className = clazz.system.selectedClass.toLowerCase();
        let archetypes = [];
        try {
          archetypes = Object.values(system.classes[className].archetype);
        } catch (err) {}
        for (const feature of ClassInfo.features[clazz.system.selectedClass.toLowerCase()]){
          if (
            feature.level <= clazz.system.level &&
            (!feature.archetype || archetypes.includes(feature.archetype)) &&
            feature.actions){
            for (const a of feature.actions){
              this._prepareActionContextInfo(a, false);
              a.macroClass = "action-macro-basic";
              actions.feats.push(a);
            }
          }
        }
      }
    }

    /* Feat Actions from extended data class */
    if (actor.type == "Player Character"){
      for (const feat of this.actor.items.filter(i => i.type == "Feat")){
        const featActions = ExtendedFeatData.getFeatActions(feat);
        for (const a of featActions){
          this._prepareActionContextInfo(a, false);
          a.macroClass = "action-macro-basic";
          actions.feats.push(a);
        }
      }
    }

    if (actions.feats.length > 0){
      actions.show.feats = true;
    }


    /* General actions from config for characters and humanoid creatures */
    if (actor.type == "Player Character" || actor.type == "Non-Player Character" || system.hasStandardActions){
      Object.assign(actions, DefaultActions); //Copy the default actions into the actions object
      actions.general.forEach((a) => this._prepareActionContextInfo(a, false));
      actions.exploration.forEach((a) => this._prepareActionContextInfo(a, false));
      actions.social.forEach((a) => this._prepareActionContextInfo(a, false));
      actions.magic.forEach((a) => this._prepareActionContextInfo(a, false));
      system.customActionSection = true;
    }

    /* List favorited spells as actions */
    if (actions.show.spells) {
      const spells = this.actor.items.filter(i => i.type == "Spell" && system.favoriteSpells.includes(i.id));
      spells.forEach(spell => {
        const actionSheetData = {
          name: spell.name,
          itemId: spell._id,
          images: {
            base: spell.img,
            left: "",
            right: ""
          },
          ability: `${spell.system.form} Spell`,
          skill: null,
          specialties: [],
          description: NewEraUtils.amplifyAndFormatDescription(spell.system.description, 1),
          overrideMacroCommand: `game.newera.HotbarActions.castSpell(${spell.name})`,
          difficulty: null,
          actionType: "",
          spellLevel: spell.system.level,
          disable: actor => {
            if (spell.system.keywords.includes('Asomatic')){
              return false;
            } else if (['G', 'L', 'R'].includes(spell.system.castType)){
              if (!actor.hasFreeHands(2)){
                return "You need both hands free in order to cast this spell.";
              }
            } else {
              if (!actor.hasFreeHands(1)){
                return "You need a free hand in order to cast this spell.";
              }
            }
            return false;
          },
          rolls: [
            {
              label: "Cast",
              die: "glowing-hands",
              callback: actor => Actions.castSpell(actor, spell)
            }
          ]
        };
        this._prepareActionContextInfo(actionSheetData, false);
        actions.spells.push(actionSheetData);
      });
    }

    /* Unarmed attack */
    if (((!system.equipment.leftHand || !system.equipment.rightHand) && actor.type != 'Creature') || system.hasStandardActions){
      actions.general.push();
    }
    if (system.lastAction){
      actions.selected = actions[system.lastAction.category][system.lastAction.index] || false;
      actions.isCustomSelected = system.lastAction.category == "custom";
      //console.log(actions.selected);
    }
    } else {
      actions.death = {
        name: "Death Save",
        images: {
          base: `${NEWERA.images}/heartbeat.png`
        },
        ability: null,
        skill: "endurance",
        specialties: [],
        description: "While you have 0 HP, you make an endurance save on your turn. If you succeed, you regain 1 HP and wake up, and your turn ends. If you fail, you lose 5 life points.",
        difficulty: 15,
        type: "0",
        rolls: [
          {
            label: "Save",
            caption: "Death Save",
            die: "d20",
            formula: "1d20+@skills.endurance.mod",
            difficulty: 15
          }
        ]
      };
      actions.selected = actions.death;
    }

    context.actions = actions;

    //console.log(context.actions);

  }

  _prepareActionContextInfo(action, isCustom){
    const actionTypes = {
      "1": "1 Frame",
      "2": "2 Frames",
      "3": "3 Frames",
      "4": "4 Frames",
      "5": "5 Frames",
      "0": "Free Action",
      "R": "Reaction",
      "E": "Exploration",
      "S": "Social",
      "D": "Downtime Action",
      "M": "Movement",
      "G": "Action"
    }
    const skillInfo = isCustom ? "" : (action.ability ? ` - ${action.ability.charAt(0).toUpperCase()}${action.ability.slice(1)} check` : (action.skill ? ` - ${action.skill.charAt(0).toUpperCase()}${action.skill.slice(1)} check` : '')); 
    action.typeDescription = `${actionTypes[action.actionType] || "Generic Action"}${skillInfo}`;

    //The 'disabled' property is false when enabled. When disabled, it should be a string explaining why it's disabled, which will be shown on the sheet.
    if (action.itemNotEquipped) {
      action.disabled = `Equip your ${action.itemName} to use this action.`;
    } else if (typeof action.disable == 'function') {
      action.disabled = action.disable(this.actor);
    } else {
      action.disabled = ["E", "S", "D"].includes(action.actionType) && game.combat && game.combat.active && game.combat.round > 0 ? "You can't do this during combat." : false;
    }

    const rolls = action.rolls ? (typeof action.rolls == "Array" ? action.rolls : Object.values(action.rolls)) : [];
    for (const roll of rolls) {
      roll.isFunctionButton = (typeof roll.callback == "function");
      roll.smol = (roll.label.length >= 10);
    }
  }

  /**
   * Sorts the actor's items in the order their actions should be displayed.
   * Items equipped come first in the order defined in NewEraActor.EquipmentSlots, followed by worn items, then the rest of the inventory.
   * @returns 
   */
  _generateSortedItemIdList(){
    const system = this.actor.system;
    const list = [];
    for (const slot of Object.values(NewEraActor.EquipmentSlots)){
      if (system.equipment[slot]){
        list.push(system.equipment[slot]);
      }
    }
    for (let i = 0; i < system.wornItemSlots; i++){
      if (system.equipment[`worn${i}`]){
        list.push(system.equipment[`worn${i}`]);
      }
    }
    for (const item of this.actor.items.contents){
      if (!list.includes(item._id)){
        list.push(item._id);
      }
    }
    return list;
  }


  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    const system = this.actor.system;

    //Set values of select elements 
    html.find('select.auto-value').each((i, element) => {
      const dataField = $(element).attr("name") || $(element).data("indirectName"); // Using data-indirect-name prevents the select from being picked up by Foundry's built-in updates, in cases where the manual listener performs an update (to avoid updating twice)
      const value = NewEraUtils.getSelectValue(dataField, this.actor);
      if (value !== null){
        $(element).val(value);
      }
    });

    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".inventory-entry");
      //console.log(li);
      const item = this.actor.items.get(li.data("itemId"));
      //console.log(item);
      item.sheet.render(true);
    });
    html.find('.item-storage').click(async ev => {
      const li = $(ev.currentTarget).parents(".inventory-entry");
      const item = this.actor.items.get(li.data("itemId"));
      await item.toggleStorage();
    });
    html.find('.item-split').click(async ev => {
      const li = $(ev.currentTarget).parents(".inventory-entry");
      const item = this.actor.items.get(li.data("itemId"));
      const quantity = await Actions.getStackQuantity(item, false);
      await this.actor.splitStack(item, quantity);
    });
    html.find('.item-merge').click(async ev => {
      const li = $(ev.currentTarget).parents(".inventory-entry");
      const item = this.actor.items.get(li.data("itemId"));
      await this.actor.mergeStacks(item);
    });
    html.find('.spell-cast').click(ev => {
      const li = $(ev.currentTarget).parents(".inventory-entry");
      const item = this.actor.items.get(li.data("itemId"));
      if (item.typeIs(NewEraItem.Types.MAGIC)) {
        Actions.castSpell(this.actor, item);
      } else if (item.typeIs(NewEraItem.Types.POTION)) {
        Actions.brewPotion(this.actor, item);
      } else {
        ui.notifications.error("Huh?");
      }
    });

    html.find('.occupant-display').click(ev => {
      const actorId = $(ev.currentTarget).parents(".vehicle-occupant").data("actorId");
      const actor = game.actors.get(actorId);
      actor.sheet.render(true);
    });
    html.find('.occupant-delete').click(ev => {
      const actorId = $(ev.currentTarget).parents(".vehicle-occupant").data("actorId");
      const actor = game.actors.get(actorId);
      this.actor.update({
        system: {
          occupants: this.actor.system.occupants.filter(n => n != actorId)
        }
      });
      ui.notifications.info(`${actor.name} is no longer a passenger in ${this.actor.name}.`);
    });

    //Ability Score Point Buy
    if (system.level <= game.settings.get("newera-sol366", "startingLevel") && game.settings.get("newera-sol366", "characterCreation") && this.actor.typeIs(NewEraActor.Types.PC)){
      html.find('#ability-points-counter').show();
      if (system.abilityScorePointBuy){
        if (system.abilityScorePointBuy.outOfRange){
          html.find('#ability-points-msg').css('color', 'red');
          html.find('#ability-points-msg').html('Starting ability scores must be between 6 and 15');
        } else if (system.abilityScorePointBuy.remaining == 0){
          html.find('#ability-points-msg').css('color', 'white');
          html.find('#ability-points-msg').html('All set!');
        } else if (system.abilityScorePointBuy.remaining > 0){
          html.find('#ability-points-msg').css('color', 'yellow');
          html.find('#ability-points-msg').html('<b>'+system.abilityScorePointBuy.remaining+'</b> points remaining');
        } else {
          html.find('#ability-points-msg').css('color', 'red');
          html.find('#ability-points-msg').html('<b>'+Math.abs(system.abilityScorePointBuy.remaining)+'</b> points over');
        }
      }
    }

    //Progress bar dynamic styling
    if (this.actor.typeIs(NewEraActor.Types.ANIMATE)){
      if (system.energy.max == 0){
        html.find('#energy-icon').attr('src', 'systems/newera-sol366/resources/energy.png');
        html.find('.resource-energy').addClass('resource-energy-no-magic');
        html.find('.resource-energy-no-magic').removeClass('resource-energy');
      } else if (system.energyPercentage > 1.0) {
        html.find('#energy-icon').attr('src', 'systems/newera-sol366/resources/energy-over.png');
        html.find('#energy-wrapper').addClass('res-over');
      }
  
      if (system.hitPoints.total == 0) {
        html.find('#health-wrapper').addClass('hp-on-lifepoints');
        html.find("#hp-icon").attr('src', `${NEWERA.images}/hp.png`);
        html.find("#lp-icon").attr('src', `${NEWERA.images}/lp-hot.png`);
        html.find("#resourceMaxHp").removeClass("resource-hp");
        html.find("#resourceValHp").removeClass("resource-hp");
        html.find("#resourceTempHp").removeClass("resource-hp");
        html.find("#resourceMaxLp").addClass("resource-hp");
        html.find("#resourceValLp").addClass("resource-hp");
      }
      else if (system.hpPercentage > 1.0){
        html.find('#health-wrapper').addClass('res-over');
        html.find('#hp-icon').attr('src', `${NEWERA.images}/hp-over.png`);
      }
      else if (system.hpPercentage > 0.75) {
        html.find('#health-wrapper').addClass('hp-high');
      }
      else if (system.hpPercentage > 0.25){
        html.find('#health-wrapper').addClass('hp-medium');
      }
      else {
        html.find('#health-wrapper').addClass('hp-low');
      }
    }



    //Pronoun field update
    if (system.pronouns) {
      html.find('#pronoun-select').change(async event => {
        let selection = event.target.value;
        await this.actor.setPronouns(selection, {});
      });
    }
 
    //Spellbook cast DC's
    if (this.actor.typeIs(NewEraActor.Types.CHARACTER)){
      html.find(".inventory-entry-magic").each((i, val) => {
        const id = $(val).data("itemId");
        const item = this.actor.items.get(id);
        if (item.typeIs(NewEraItem.Types.MAGIC)) {
          html.find(`.spell-action-icons.${id}`).html(NewEraUtils.getSpellActionIcons(item));
        }
      });
    //Monster magic stuff
    } else if (this.actor.typeIs(NewEraActor.Types.CREATURE)){
      html.find(".inventory-entry-magic").each((i, val) => {
        const spellId = $(val).data("itemId");
        const ampFactor = this.actor.items.get(spellId).system.ampFactor;
        const ampLevel = this.actor.items.get(spellId).system.level * ampFactor;
        html.find(`#spell-level-${spellId}`).html(ampLevel);
        html.find(`.spell-action-icons.${spellId}`).html(NewEraUtils.getSpellActionIcons(this.actor.items.get(spellId)));
        if (ampFactor == 1){
          html.find(`#spell-level-${spellId}`).removeClass("ampText-hot");
        } else {
          html.find(`#spell-level-${spellId}`).addClass("ampText-hot");
        }
      });
    }

    //Feat CPA coloration
    if (this.actor.typeIs(NewEraActor.Types.PC)){
      if (this.actor.system.characterPoints.cpa < 0){
        html.find("#character-points").css("color", "red");
      } else {
        html.find("#character-points").css("color", "white");
      }
    }

    //Carry weight and Magic Tolerance color
    if (this.actor.typeIs(NewEraActor.Types.CHARACTER)){
      if (system.carryWeight.current > system.carryWeight.value){
        html.find("#cw-wrapper").addClass("cw-full");
      }
      if (system.magicTolerance.current > system.magicTolerance.max){
        html.find("#mt-wrapper").addClass("cw-full");
      } 
    }
    if (this.actor.typeIs(NewEraActor.Types.VEHICLE)){
      if (system.totalWeight > system.carryWeight){
        html.find("#cw-wrapper").addClass("cw-full");
      }
    } 

    //Actions tab
    html.find(".action-icon").click(async ev => {
      if ($(ev.currentTarget).data("actionCategory")){ //This check prevents the listener from triggering on click of the 'new custom action' button
        html.find(".newera-actorsheet-scroll").scrollTop(0);
        await this.actor.update({
          system: {
            lastAction: {
              category: $(ev.currentTarget).data("actionCategory"),
              index: $(ev.currentTarget).data("actionId")
            }
          }
        });
      }
    });
    html.find(".newera-roll-button").click(async ev => {
      let roll = new Roll($(ev.currentTarget).data("roll"), this.actor.getRollData());
      await roll.evaluate();
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({actor: this.actor}),
        flavor: $(ev.currentTarget).data("caption"),
        rollMode: game.settings.get('core', 'rollMode')
      });
      if ($(ev.currentTarget).data("label").toLowerCase().includes("damage")){
        game.newera.setLastDamageAmount(roll.total);
      }
    });

    //Enchanted item glow on inventory tab
    html.find(".enchant-glow").each(function(){
      if($(this).data("enchanted") == true){
        const color = $(this).data("glowColor");
        $(this).css("filter", `drop-shadow(0px 0px 3px ${color})`);
      }
    });

    /* EDIT CUTOFF - Everything below here is only run if the sheet is editable */
    if (!this.isEditable) return;

    //Level Up buttons for classes
    html.find(".class-level-up").click(async (ev) => {
      const li = $(ev.currentTarget).parents(".inventory-entry");
      const item = this.actor.items.get(li.data("itemId"));
      if (item.typeIs(NewEraItem.Types.CLASS)) {
        this.actor.levelUp(item);
      }
    });
    //Auto level up functions
    if (game.settings.get("newera-sol366", "autoLevelUp")) {
      html.find(".feature-select").change(async ev => {
        const element = $(ev.currentTarget);
        const newValue = element.val();
        const oldValue = element.data("oldValue");
        const className = element.data("class").toLowerCase();
        const featureSelectionId = element.data("selectionId");
        const selectionIndex = element.data("selectionNumber");
        console.log(`[ALU] Triggered feature selection change ${className}:${featureSelectionId}.${selectionIndex} ${oldValue} -> ${newValue}`);
        try {
          const feature = ClassInfo.features[className].find(feature => feature.id == featureSelectionId && feature.selections && feature.selections[selectionIndex]);
          const selection = feature.selections[selectionIndex];
          if (typeof selection.onChange == 'function') {
            await selection.onChange(this.actor, oldValue, newValue);
          } else {
            console.log(`[ALU] No onChange function found!`);
          }
        } catch (err) {
          ui.notifications.error("Error: Couldn't update data for this selection. See the log for details.");
          console.error(`[ALU] Failed to locate selection change function! class=${className} id=${featureSelectionId} index=${selectionIndex}`);
          console.error(err);
        }
      });
      html.find(".feat-select").change(async ev => {
        const element = $(ev.currentTarget);
        const newValue = element.val();
        const oldValue = element.data("oldValue");
        const featId = element.data("featId");
        const repeated = element.data("repeated");
        const tier = repeated ? "1" : element.data("tier");
        const selectionIndex = repeated ? "0" : element.data("selectionKey");
        console.log(`[ALU] Triggered feat selection change ${featId}.${tier}.${selectionIndex} ${oldValue} -> ${newValue}`);
        try {
          const featData = ExtendedFeatData.getFeatures(featId, tier);
          const selection = featData.find(f => f.selections[selectionIndex]).selections[selectionIndex];
          if (typeof selection.onChange == 'function') {
            await selection.onChange(this.actor, oldValue, newValue);
          }
        } catch (err) {
          console.error(err);
        }
      });
    }

    //Store All buttons
    html.find("#putAwayAll").click(() => this.actor.putAwayAll(false));
    html.find("#storeAll").click(() => this.actor.putAwayAll(true));

    html.find("#toggleHandednessOverride").click(() => {
      this.actor.update({
        system: {
          forceOneHanded: !this.actor.system.forceOneHanded
        }
      });
    });

    //Browser open buttons
    html.find(".feat-browser").click(() => new FeatBrowser(this.actor).render(true));
    html.find(".spell-browser").click(() => new SpellBrowser(this.actor).render(true));
    html.find(".spell-studies").click(ev => {
      const element = $(ev.currentTarget);
      const className = element.data("class");
      const archetype = element.data("archetype") || undefined; //This comes back as an empty string for non-archetype features which isn't equivalent to undefined in the feature data
      const level = element.data("level");
      const index = element.data("index");
      console.log(`[DEBUG] loading spell study guide class=${className} arch=${archetype} level=${level} index=${index}`);
      const spellStudiesCriteria = ClassInfo.features[className.toLowerCase()].find(
        feature => 
        feature.archetype == archetype &&
        feature.level == level &&
        !!feature.spellStudies &&
        !!feature.spellStudies[index] &&
        !feature.spellStudies[index].onOtherFeature
      ).spellStudies;
      if (spellStudiesCriteria && spellStudiesCriteria[index]){
        const criteria = new SpellSearchParams(spellStudiesCriteria[index]);
        new SpellBrowser(this.actor, criteria, {className: className.toLowerCase(), level: level, index: index}).render(true);
      } else {
        ui.notifications.error("Couldn't load spell studies for this level. Please report this to the developers.");
      }
    });

    //Favorite Spells management
    html.find(".spell-favorite-add").click(async ev => {
      const li = $(ev.currentTarget).parents(".inventory-entry");

      let favorites = structuredClone(this.actor.system.favoriteSpells);
      favorites.push(li.data("itemId"));
      await this.actor.update({
        system: {
          favoriteSpells: favorites
        }
      });

    });
    html.find(".spell-favorite-remove").click(async ev => {
      const li = $(ev.currentTarget).parents(".inventory-entry");

      let favorites = structuredClone(this.actor.system.favoriteSpells).filter(s => s != li.data("itemId"));
      await this.actor.update({
        system: {
          favoriteSpells: favorites
        }
      });

    });

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      NewEraUtils.confirm(this.actor, ev, (actor, event) => {
        const li = $(event.currentTarget).parents(".inventory-entry");
        actor.deleteItem(li.data("itemId"));
      });
    });

    //Add Skills
    html.find('#addKnowledgeButton').click(() => {
      this.actor.addKnowledge();
    }); 
    html.find('#addSpecialtyButton').click(() => {
      this.actor.addSpecialty();
    });
    html.find('#addResourceButton').click(() => {
      this.actor.addResource();
    });
    html.find("#chooseClass").click(() => {
      new ClassSelect(this.actor).render(true);
    });
    html.find(".deleteResource").click(ev => {
      NewEraUtils.confirm(this.actor, ev, (actor, event) => actor.deleteResource($(event.currentTarget).data("resourceIndex")));
    });
    html.find(".deleteKnowledge").click(ev => {
      NewEraUtils.confirm(this.actor, ev, (actor, event) => actor.deleteKnowledge($(event.currentTarget).data("knowledgeIndex")));
    });
    html.find(".deleteSpecialty").click(ev => {
      NewEraUtils.confirm(this.actor, ev, (actor, event) => actor.deleteSpecialty($(event.currentTarget).data("specialtyIndex")));
    });
    html.find(".deleteSpecialModifier").click(ev => {
      NewEraUtils.confirm(this.actor, ev, (actor, event) => actor.deleteSpecialModifier($(event.currentTarget).data("specialModifierIndex")));
    });
    html.find('#addSpecialModifierButton').click(() => {
      this.actor.addSpecialModifier();
    });
    html.find(`.improveSkillButton`).click(() => {
      this.showSkillImprovementDialog();
    });
    html.find(".toggleDailyResource").click(ev => {
      const resourceIndex = $(ev.currentTarget).data("resourceIndex");
      this.actor.updateResourceByIndex(resourceIndex, {
        daily: !$(ev.currentTarget).hasClass("daily-enabled")
      });
    });

    html.find('.item-quantity-roll').click(ev => {
      const itemId = $(ev.currentTarget).parents(".inventory-entry").data("itemId");
      const item = this.actor.items.get(itemId);
      item.rollQuantity();
    });

    //Inventory drag-and-drop
    html.find(".newera-draggable-equipment").on("dragstart", ev => {
      //ev.preventDefault();
      //console.log(ev);
      const itemId = $(ev.currentTarget).data("itemId");
      const item = this.actor.items.get(itemId);
      if (item.system.rollQuantity){
        ui.notifications.warn("This item has a variable quantity. You must roll to determine the quantity before you can move it.");
        ev.originalEvent.dataTransfer.effectAllowed = "none";
      } else {
        const fromZone = $(ev.currentTarget).parents(".newera-equipment-dropzone");
        console.log(`INV DRAGSTART ${itemId}`);
        ev.originalEvent.dataTransfer.setData("neweraItemTransfer", true);
        ev.originalEvent.dataTransfer.setData("objectType", "equipment");
        ev.originalEvent.dataTransfer.setData("itemId", itemId);
        ev.originalEvent.dataTransfer.setData("fromZone", fromZone.data("dropZone"));
        ev.originalEvent.dataTransfer.setData("fromActor", this.actor.uuid);
        ev.originalEvent.dataTransfer.effectAllowed = "move";
      }  
    });
    html.find(".newera-equipment-dropzone").on("dragover", ev => {
      ev.preventDefault();
    });
    html.find(".newera-equipment-dropzone").on("drop", async ev => {
      //Prevent listener from running on drag-and-drop from other sources
      if (!ev.originalEvent.dataTransfer.getData("neweraItemTransfer")){
        return;
      }
      ev.preventDefault();
      ev.stopPropagation(); //Prevent the drop from bubbling up to parent dropzones which causes duplicate drop events
      const itemId = ev.originalEvent.dataTransfer.getData("itemId");
      const sourceSlot = ev.originalEvent.dataTransfer.getData("fromZone");
      const targetSlot = $(ev.currentTarget).data("dropZone");
      const sourceActor = ev.originalEvent.dataTransfer.getData("fromActor");
      const targetActor = this.actor.uuid;
      console.log(`INV DROP ${itemId} ${sourceActor}.${sourceSlot}->${targetActor}.${targetSlot}`);
      //Moving items between slots on the same actor
      if (sourceActor == targetActor){
        const movedItem = this.actor.items.get(itemId);
        if (sourceSlot == targetSlot || !sourceSlot){
          console.log("But, it failed!");
          return;
        } else if (!this._isItemDroppable(movedItem, targetSlot)){
          ui.notifications.error("That item can't be placed in that slot. Try a different location.");
        } else if (sourceSlot == "backpack" && movedItem.system.stored == true){
          ui.notifications.error("That item is in storage. You must retrieve it before you can equip it.");
        } else {
          const frameImg = "systems/newera-sol366/resources/" + ((sourceSlot == "backpack" || targetSlot == "backpack") ? "ac_3frame.png" : "ac_1frame.png");
          if (NewEraUtils.sendEquipmentChangeMessages()){
            this.actor.actionMessage(movedItem.img, frameImg, "{NAME} {0} {d} {1}!", this._getItemActionVerb(sourceSlot, targetSlot), (movedItem.type == "Phone" ? "phone" : movedItem.name));
          }
          await this.actor.moveItem(itemId, sourceSlot, targetSlot);
        }
      }
      //Moving an item to a different actor
      else {
        const origin = fromUuidSync(sourceActor);
        if (!origin){
          ui.notifications.error("Failed to move item: Unable to locate source actor");
          return;
        }
        const movedItem = origin.items.get(itemId);
        if (!movedItem){
          ui.notifications.error("Failed to move item: The source actor doesn't seem to have that item.");
          return;
        }
        if (!this._isItemDroppable(movedItem, targetSlot)){
          ui.notifications.error("That item can't be placed in that slot. Try a different location.");
        } else if (sourceSlot == "backpack" && movedItem.system.stored == true){
          ui.notifications.error("That item is in storage. You must retrieve it before you can give it to someone else.");
        } else {
          let quantity = 1;
          //If the item is stackable, prompt the user to specify how many to transfer
          if (movedItem.typeIs(NewEraItem.Types.STACKABLE)){
            quantity = await Actions.getStackQuantity(movedItem);
          }
          origin.transferItem(this.actor, movedItem, targetSlot, quantity);
        }
      }
    });

    /* Other drag-and-drop handlers for the hotbar */

    //Action bar drag-and-drop
    html.find(".action-macro-basic").on("dragstart", ev => {
      console.log(`ACTION MENU DRAG START`);
      const xfr = ev.originalEvent.dataTransfer;
      const element = $(ev.currentTarget);
      const actionData = element.find(".action-data").html();
      const dragData = {
        macroType: "action-basic",
        action: actionData
      };
      xfr.setData("text/plain", JSON.stringify(dragData));
    });
    html.find(".action-macro-custom").on("dragstart", ev => {
      console.log(`CUSTOM ACTION DRAG START`);
      const xfr = ev.originalEvent.dataTransfer;
      const element = $(ev.currentTarget);
      const actionData = element.find(".action-data").html();
      const dragData = {
        macroType: "action-custom",
        action: actionData
      };
      xfr.setData("text/plain", JSON.stringify(dragData));
    });
    html.find(".action-macro-item").on("dragstart", ev => {
      console.log(`ITEM ACTION DRAG START`);
      const xfr = ev.originalEvent.dataTransfer;
      const element = $(ev.currentTarget);
      const actionData = element.find(".action-data").html();
      const dragData = {
        macroType: "action-item",
        action: actionData
      };
      xfr.setData("text/plain", JSON.stringify(dragData));
    });

    html.find(".check-macro").on("dragstart", ev => {
      console.log(`SKILL TABLE DRAG START`);
      const xfr = ev.originalEvent.dataTransfer;
      const element = $(ev.currentTarget);
      const dragData = {
        macroType: "check",
        name: element.data("macroName"),
        img: element.data("macroImg") || `${NEWERA.images}/d20.png`,
        rollLabel: element.data("macroLabel"),
        rollFormula: element.data("macroFormula")
      };
      xfr.setData("text/plain", JSON.stringify(dragData));
    });

    html.find(".spell-macro").on("dragstart", ev => {
      console.log(`SPELL DRAG START`);
      const xfr = ev.originalEvent.dataTransfer;
      const element = $(ev.currentTarget);
      const spell = this.actor.items.get(element.data("itemId"));
      const dragData = {
        macroType: "spell",
        name: spell.name,
        img: spell.img,
        id: spell.id
      };
      xfr.setData("text/plain", JSON.stringify(dragData));
    });

    //Inspiration
    html.find("#inspiration").click(() => {
      Actions.useInspiration(this.actor);
    });
    html.find("#inspiration").on("contextmenu", () => {
      this.actor.update({
        system: {
          inspiration: this.actor.system.inspiration + 1
        }
      })
    });

    //Initial HP for creatures
    html.find("#init-hp-roll").click(() => {
      this.actor.rollInitialHP();
    });

    //Macro/action button listeners
    html.find("button.newera-action-button").click(ev => {
      console.log(`Executing function button`);
      const context = this.getData();
      const element = $(ev.currentTarget);
      const actionData = context.actions.selected.rolls.find(r => r.label = element.data("actionButton"));
      if (actionData && typeof actionData.callback == "function"){
        actionData.callback(this.actor);
      } else {
        console.error(`Missing callback function for action button ${element.data("actionButton")} on ${actions.selected.name}`);
      }
    });

    html.find("#takeDamageButton").click(() => {
      Actions.displayDamageDialog(this.actor);
    });
    html.find("#sleepButton").click(() => {
      Actions.restForTheNight(this.actor);
    });

    //Browser drop listener
    html.on("drop", ev => this._onActorSheetDrop(ev));

    //BOILERPLATE STUFF BELOW

    // Active Effect management
    html.find(".effect-create").click((() => createEffect(this.actor)));
    html.find(".effect-edit").click((ev => editEffect(ev, this.actor)));
    html.find(".effect-delete").click((ev => deleteEffect(ev, this.actor)));
    html.find(".effect-toggle").click((ev => toggleEffect(ev, this.actor)));

    html.find(".effect-up").click(ev => {
      const tr = $(ev.currentTarget).parents(".effect-row");
      const category = tr.data("effectCategory");
      const currLevel = tr.data("levelCurrent");
      const effectId = tr.data("effectId");
      this.actor.updateStatusEffectLevel(effectId, category, currLevel + 1);
    });
    html.find(".effect-down").click(ev => {
      const tr = $(ev.currentTarget).parents(".effect-row");
      const category = tr.data("effectCategory");
      const currLevel = tr.data("levelCurrent");
      const effectId = tr.data("effectId");
      this.actor.updateStatusEffectLevel(effectId, category, currLevel - 1);
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    //For created spells and enchantments, set their author to the current actor.
    if (type == "Spell" || type == "Enchantment"){
      data.author = this.actor.id;
    }
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
      //Spellcasting rolls with specialty included
      if (dataset.rollType == 'spell') {
        const spellDetail = `${dataset.ampFactor > 1 ? ` ${NEWERA.romanNumerals[dataset.ampFactor]}` : ""}${parseInt(dataset.difficulty) > 0 ? ` (Difficulty ${dataset.difficulty})` : ""}`;
        console.log(`SPELLCASTMSG diff=${dataset.difficulty} ampFactor=${dataset.ampFactor} detail=${spellDetail}`);
        dataset.spellCaption = dataset.label + spellDetail;
        if (dataset.difficulty == '0' && dataset.spellType == "cast"){
          this.actor.actionMessage(this.actor.img, `${NEWERA.images}/${dataset.spellSchool}.png`, "{NAME} casts {0}!", `${dataset.name}${spellDetail}`);
          return;
        }
        let systemData = this.actor.system;
        let totalCastMod = 0;
        if (this.actor.type == 'Creature'){
          totalCastMod = systemData.spellMods[dataset.spellForm];
          if (dataset.spellType == 'attack'){
            totalCastMod += systemData.abilities.dexterity.mod;
          }
        } else {
          let formMod = systemData.magic[dataset.spellForm].mod;
          let specialty = null;
          for (const [key, spec] of Object.entries(systemData.specialties)){
            if (spec.subject.toLowerCase() == dataset.spellSchool.toLowerCase){
              specialty = spec;
            }
          }
          if (specialty){
            totalCastMod = formMod + specialty.level + specialty.bonus;
          } else {
            totalCastMod = formMod;
          }
          if (dataset.spellType == 'attack'){
            totalCastMod += systemData.skills.marksmanship.level + systemData.skills.marksmanship.bonus;
          }
        }

        let roll = new Roll(`d20 + ${totalCastMod}`, this.actor.getRollData());
        roll.evaluate();
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({actor: this.actor}),
            flavor: dataset.rollType = "spell" ? dataset.spellCaption : dataset.label,
            rollMode: game.settings.get('core', 'rollMode')
        });
        if (dataset.label && dataset.label.toLowerCase().includes("damage")){
          game.newera.setLastDamageAmount(roll.total);
        }
      }

      if (dataset.rollType == "spell-damage"){

      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }

  }

  // Update the styling on resource controls whenever the data is changed
  updateResourceDisplay() {
    const system = this.actor.system;
    if (system.energy.max == 0){
      html.find('.resource-energy').classList.add('resource-energy-no-magic');
    } else {
      html.find('.resource-energy').classList.remove('resource-energy-no-magic');
    }

    //Update the HP progress bar
    if (system.hitPoints.value > 0){

    } else {

    }
  }

  _getSpellCastDifficulty(spellId, ampFactor){
        const spell = this.actor.items.get(spellId);
        if (spell.system.school == "CL") { //Channeling spells don't have a casting difficulty.
          return null;
        }
        let form = spell.system.form;
        let formSkill = 0;
        if (spell.system.school == "??" || spell.system.school == "MM"){
          formSkill = this.actor.system.casterLevel;
        } else {
          formSkill = this.actor.system.magic[form].level;
        }
        let spellLevel = spell.system.level * ampFactor;
        let skillDiff = spellLevel - formSkill;
        let dc = 10 + (5 * (skillDiff - 1));
        //console.log(`SPELLAMP ID=${spellId} FORM=${form} FS=${formSkill} SL=${spellLevel} SD=${skillDiff} DC=${dc}`);
      
        if (skillDiff <= 0){
          return null;
        } else {
          return dc;
        }

  }

  _isItemDroppable(item, destination){
    //console.log(`IID ${item} ${destination}`);
    const slotsAllowed = NewEraActorSheet._getAllowedItemSlots(item);
    const droppable = (slotsAllowed.includes(destination) || destination == "backpack" || (destination.includes("worn") && slotsAllowed.includes("worn"))); //The "worn" case is necessary because the slotsAllowed method doesn't explicitly list all 10 worn item slots
    return droppable;
  }

  static _getAllowedItemSlots(item){
    //console.log(`GIIS ${item._id} is ${item.type}`);
    if (item.type == "Melee Weapon" || item.type == "Ranged Weapon"){
      return ["leftHand", "rightHand", "worn"];
    } else if (item.type == "Armor"){
      switch(item.system.armorType){
        case "Head":
          return ["head"];
        case "Face":
        case "Eyes":
          return ["worn"];
        case "Chest":
        case "Full Body":
          return ["body"];
        case "Hands":
          return ["hands"];
        case "Feet":
          return ["feet"];
        default:
          return ["head", "worn", "body", "hands", "feet"]; //Custom armor can drop in any slot. Don't want to have to make yet another dropdown
      }
    } else if (item.type == "Item"){
      switch(item.system.equipSlot){
        case "I":
          return ["leftHand", "rightHand", "worn"];
        case "C":
          return ["worn"];
        case "O":
          return ["outfit"];
        case "A":
          return ["worn"];
        case "B":
          return ["body", "outfit"];
        case "S":
          return ["feet"];
        case "W":
          return ["waist"];
        case "R":
          return ["hands", "worn"];
        case "F":
          return ["worn"];
        case "N":
          return ["neck"];
      }
    } else if (item.type == "Shield"){
      return ["leftHand", "rightHand"];
    } else if (item.type == "Potion"){
      return ["worn"];
    } else if (item.type == "Phone"){
      return ["phone"];
    } else {
      return [];
    }
  }

  _getItemActionVerb(source, destination){
    if (source == "backpack"){
      if (destination == "leftHand" || destination == "rightHand" || destination == "phone" || destination.includes("worn")){
        return "takes out";
      } else {
        return "puts on";
      }
    } else if (destination == "backpack"){
      if (source == "leftHand" || source == "rightHand" || source == "phone" || source.includes("worn")){
        return "puts away";
      } else {
        return "takes off";
      }
    } else if (source.includes("worn")) {
      return "readies";
    } else if (destination.includes("worn")){
      return "lowers";
    } else {
      return "moves";
    }
  }

  //isItemActionAvailable and findItemLocation moved to Actor

  showSkillImprovementDialog(){
    new Dialog({
      title: "Improve Skill",
      content: () => {
        let formContent = `<form>
        <table>
          <tr>
            <th>Skill Level</th>
            <th>Character Point Cost</th>
            <th>Requirement</th>
          </tr>
          <tr>
            <td>0 <i class="fa-solid fa-arrow-right"></i> 1</td>
            <td>10</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>1 <i class="fa-solid fa-arrow-right"></i> 2</td>
            <td>15</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>2 <i class="fa-solid fa-arrow-right"></i> 3</td>
            <td>20</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>3 <i class="fa-solid fa-arrow-right"></i> 4</td>
            <td>30</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>4 <i class="fa-solid fa-arrow-right"></i> 5</td>
            <td>50</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>5 <i class="fa-solid fa-arrow-right"></i> 6</td>
            <td>75</td>
            <td>Level 3</td>
          </tr>
          <tr>
            <td>6 <i class="fa-solid fa-arrow-right"></i> 7</td>
            <td>100</td>
            <td>Level 6</td>
          </tr>
          <tr>
            <td>7 <i class="fa-solid fa-arrow-right"></i> 8</td>
            <td>160</td>
            <td>Level 10</td>
          </tr>
          <tr>
            <td>8 <i class="fa-solid fa-arrow-right"></i> 9</td>
            <td>220</td>
            <td>Level 15</td>
          </tr>
          <tr>
            <td>9 <i class="fa-solid fa-arrow-right"></i> 10</td>
            <td>300</td>
            <td>Level 20</td>
          </tr>
        </table>
        <p>Select a skill to increase:</p>
        <select id="skillSelected">
          <option value="skills.agility">Agility</option>
          <option value="skills.athletics">Athletics</option>
          <option value="skills.deception">Deception</option>
          <option value="skills.defense">Defense</option>
          <option value="skills.determination">Determination</option>
          <option value="skills.diplomacy">Diplomacy</option>
          <option value="skills.endurance">Endurance</option>
          <option value="skills.insight">Insight</option>
          <option value="skills.intimidation">Intimidation</option>
          <option value="skills.logic">Logic</option>
          <option value="skills.marksmanship">Marksmanship</option>
          <option value="skills.medicine">Medicine</option>
          <option value="skills.one-handed">One-Handed</option>
          <option value="skills.perception">Perception</option>
          <option value="skills.performance">Performance</option>
          <option value="skills.reflex">Reflex</option>
          <option value="skills.sleight-of-hand">Sleight of Hand</option>
          <option value="skills.stealth">Stealth</option>
          <option value="skills.technology">Technology</option>
          <option value="skills.two-handed">Two-Handed</option>
          `
        for (const [i, knowledge] of Object.entries(this.actor.system.knowledges)) {
          formContent += `<option value="knowledges.${i}">Knowledge: ${knowledge.subject}</option>`;
        }
        if (this.actor.system.casterLevel){
          formContent += `
          <option value="magic.elemental">Magic: Elemental</option>
          <option value="magic.divine">Magic: Divine</option>
          <option value="magic.physical">Magic: Physical</option>
          <option value="magic.psionic">Magic: Psionic</option>
          <option value="magic.spectral">Magic: Spectral</option>
          <option value="magic.temporal">Magic: Temporal</option>
          `;
        }
        formContent += `</select></form>`;
        return formContent;
      },
      buttons: {
        confirm: {
          icon: `<i class="fas fa-check"></i>`,
          label: "Confirm",
          callback: async (html) => {
            const selection = html.find("#skillSelected").val();
            const selections = selection.split(".");
            await this.actor.improveSkill(selections[1], selections[0]);
          }
        },
        cancel: {
          icon: `<i class="fas fa-x"></i>`,
          label: "Cancel"
        }
      },
      default: "cancel"
    }).render(true);
  }

  _prepareInspiration(context){
    const difficulty = game.settings.get("newera-sol366", "difficulty");
    context.inspiration = {
      enabled: game.settings.get("newera-sol366", "inspiration") && difficulty < 3,
      points: {},
      cp: Math.floor(this.actor.system.inspiration * this.actor.system.levelGap * 0.1)
    };
    
    if (context.inspiration.enabled){
      let max = 0;
      switch(difficulty){
        case 0:
          max = 5;
          break;
        case 1:
          max = 3;
          break;
        case 2:
          max = 1;
          break;
        case 3:
        case 4:
          return;
      }
      for (let i=1; i<=max; i++){
        if (this.actor.system.inspiration >= i){
          context.inspiration.points[i] = true;
        } else {
          context.inspiration.points[i] = false;
        }
      }
    }
  }

  /**
   * Handle dropping objects into the actor sheet from browser windows.
   * If the dropped data doesn't seem to fit this action, do NOT preventDefault() so that Foundry's built-in drop listeners will work as intended
   * @param {*} event 
   */
  async _onActorSheetDrop(event){
    const xfr = event.originalEvent.dataTransfer;
    const json = xfr.getData("text/plain") || null;
    const dropData = JSON.parse(json);
    //console.log(`[DEBUG] ActorSheet Drop ${json}`);
    if (dropData && dropData.type == "Actor" && this.actor.type == "Vehicle"){
      event.preventDefault();
      const id = dropData.uuid.replace("Actor.", "");
      const passenger = game.actors.get(id);
      if (this.actor.system.occupants.includes(id)){
        ui.notifications.warn(`${passenger.name} is already in this vehicle!`);
        return;
      }
      if (passenger && passenger.typeIs(NewEraActor.Types.ANIMATE)){
        await this.actor.update({
          system: {
            occupants: this.actor.system.occupants.concat([id])
          }
        });
        ui.notifications.info(`${passenger.name} is now a passenger in ${this.actor.name}.`);
      }
    }
    if (dropData && dropData.transferAction){
      event.preventDefault();
      if (dropData.transferAction == "addFeatFromBrowser"){
        const compendium = await game.packs.get("newera-sol366.feats").getDocuments();
        const featFromCompendium = compendium.find(feat => feat.system.casperObjectId == dropData.casperObjectId);
        const featFromActor = this.actor.items.find(feat => feat.system.casperObjectId == dropData.casperObjectId);
        let tierUnlocked = null;
        if (featFromCompendium){
          if (featFromActor){ //Increase tier
            if (featFromActor.system.maximumTier == -1){
              tierUnlocked = 1;
              await featFromActor.update({
                system: {
                  currentTier: featFromActor.system.currentTier + 1
                }
              });
              ui.notifications.info(`You took another instance of ${featFromActor.name} for ${featFromCompendium.system.base.cost} character points.`);
            } else if (featFromActor.system.maximumTier == 1){
              ui.notifications.error(`${this.actor.name} already has ${featFromCompendium.name}.`);
            } else {
              if (featFromActor.system.currentTier == featFromActor.system.maximumTier){
                ui.notifications.error(`${this.actor.name} already has the highest available tier of ${featFromCompendium.name}.`);
              } else {
                if (featFromActor.characterMeetsFeatPrerequisites(this.actor, featFromActor.system.currentTier + 1)){
                  tierUnlocked = featFromActor.system.currentTier + 1;
                  await featFromActor.update({
                    system: {
                      currentTier: tierUnlocked
                    }
                  });
                  ui.notifications.info(`You upgraded ${this.actor.name}'s ${featFromCompendium.name} feat to tier ${featFromActor.system.currentTier} for ${featFromActor.system.tiers[featFromActor.system.currentTier].cost} character points.`);
                } else {
                  ui.notifications.warn(`${this.actor.name} doesn't meet the prerequisites for tier ${featFromActor.system.currentTier+1} of ${featFromActor.name}.`)
                }
              }
            }
          } else { //Add new feat
            if (featFromCompendium.characterMeetsFeatPrerequisites(this.actor, 1)){
              const featData = structuredClone(featFromCompendium);
              await Item.create(featData, { parent: this.actor });
              tierUnlocked = 1;
              ui.notifications.info(`You took ${featFromCompendium.name} for ${featFromCompendium.system.base.cost} character points.`);
            } else {
              ui.notifications.warn(`${this.actor.name} doesn't meet the prerequisites for ${featFromCompendium.name}.`);
            }
          }
          //Check for onUnlock function 
          if (tierUnlocked && game.settings.get("newera-sol366", "autoLevelUp")) {
            console.log(`[ALU] Processing unlock triggers for ${featFromCompendium.name} tier ${tierUnlocked}`);
            try {
              const features = ExtendedFeatData.getFeatures(dropData.casperObjectId, tierUnlocked);
              for (const feature of features){
                if (feature.unlocksCoreFeature) { //Run this BEFORE the onUnlock handlers, as they may depend on data set by the core feature template!
                  if (this.system.coreFeatures[feature.unlocksCoreFeature]) {
                    console.log(`[ALU] Skipped core feature ${feature.unlocksCoreFeature} because it already has data!`);
                    } else {
                      const coreFeatureData = NEWERA.coreFeatureInitData[feature.unlocksCoreFeature];
                      await this.update({
                        system: {
                          coreFeatures: {
                            [feature.unlocksCoreFeature]: coreFeatureData
                          }
                        }
                      });
                      console.log(`[ALU] Activated core feature ${feature.unlocksCoreFeature} from feat ${featFromCompendium.name}`);
                      ui.notifications.info(`You gained the ${coreFeatureData.label} feature!`);
                    }
                  }
                if (typeof feature.onUnlock == "function"){
                  await feature.onUnlock(this.actor);
                }
              }
            } catch (err) {
              console.log(`[ALU] No logic found or error encountered.`);
            }
          }
        } else {
          ui.notifications.error("Couldn't find a feat in the CASPER database matching this item. Please report this to the developers.");
        }
      } else if (dropData.transferAction == "addSpellFromBrowser") {
        if (dropData.studies && dropData.studies.className){
          if (this.actor.id != dropData.actorId){
            ui.notifications.error(`This spell study guide is for a different actor.`);
            return;
          }
          if (dropData.remaining == -1){
            //For "choose all" study guides on the researcher, don't set the counter. these will never show as complete
          } else if (dropData.remaining > 0){
            const update = {
              system: {
                  classes: {}
              }
            };
            update.system.classes[dropData.studies.className] = {
              spellStudies: {}
            };
            update.system.classes[dropData.studies.className].spellStudies[dropData.studies.level] = {};
            update.system.classes[dropData.studies.className].spellStudies[dropData.studies.level][dropData.studies.index] = dropData.remaining - 1;
            await this.actor.update(update);
          } else {
            ui.notifications.warn("You've completed your spell studies for this list. Please close the study guide and choose another one.");
            return;
          }
        }
        const compendium = await game.packs.get("newera-sol366.spells").getDocuments();
        const spellFromCompendium = compendium.find(spell => 
          spell.type == dropData.itemType &&
          spell.system.casperObjectId == dropData.casperObjectId
        );
        if (spellFromCompendium){
            await Item.create(spellFromCompendium, { parent: this.actor });
            this.actor.actionMessage(this.actor.img, spellFromCompendium.img, "{NAME} learned {0}!", spellFromCompendium.name);
            if (dropData.remaining > 1){
              ui.notifications.info(`You learned ${spellFromCompendium.name}! You can choose ${dropData.remaining-1} more spell${dropData.remaining>2?'s':''} from the current study guide.`);
            } else if (dropData.remaining == 1){
              ui.notifications.info(`You learned ${spellFromCompendium.name}! You've completed this study guide.`);
            } else {
              ui.notifications.info(`You learned ${spellFromCompendium.name}!`);
            }
          }
        } else {
          ui.notifications.error(`Error: Couldn't load spell data`);
        }
      }
    }
}
