import {createEffect, editEffect, deleteEffect, toggleEffect, getEffectDuration, findStandardActiveEffectByName} from "../helpers/effects.mjs";
import { NEWERA } from "../helpers/config.mjs";
import { ClassInfo } from "../helpers/classFeatures.mjs";
import { Actions } from "../helpers/macros/actions.mjs";
import { Formatting } from "../helpers/formatting.mjs";
import { FeatBrowser } from "./feat-browser.mjs";
import { FeatActions } from "../helpers/macros/featActions.mjs";
import { NewEraActor } from "../documents/actor.mjs";
import { NewEraItem } from "../documents/item.mjs";
import { SpellSearchParams } from "../schemas/spell-search-params.mjs";
import { SpellBrowser } from "./spell-browser.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class NewEraActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
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
      this._prepareInspiration(context);
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
    for (const clazz of classes){
      //Get selected archetype id if it exists
      const className = clazz.system.selectedClass.toLowerCase();
      let archetypes = [];
      try {
        archetypes = Object.values(system.classes[className].archetype);
      } catch (err) {
        console.log("Caught ReferenceError when looking up archetype. Must not have one!");
      }
      for (const feature of ClassInfo.features[className]){
        if (feature.archetype) {
          if (!archetypes.includes(feature.archetype)){
            continue;
          }
        }
        if (feature.level <= clazz.system.level){
          feature.className = feature.archetype ? NEWERA.classes[clazz.system.selectedClass].archetypes[feature.archetype] : clazz.system.selectedClass;
          feature.classImg = feature.archetype ? `${NEWERA.images}/${className == "researcher" ? "" : className+"_"}${feature.archetype}.png` : clazz.img;
          feature.clazz = clazz.system.selectedClass;
          if (feature.common){
            const commonFeature = ClassInfo.features.common[feature.common];
            feature.name = commonFeature.name;
            feature.description = commonFeature.description;
            feature.selections = commonFeature.selections;
            feature.key = commonFeature.key; //Common features are never going to be key=true, but whatever, this'll probably confuse the hell out of me in 2 years if I hard code it to false
            if (typeof commonFeature.dynamicSelections == "function"){
              feature.selections = commonFeature.dynamicSelections(this.actor);
            }
            if (feature.selections){
              feature.id = `${feature.className.toLowerCase()}.${feature.common}.${feature.level}`;
            }
          }
          if (feature.tableValues){
            for (const tv of feature.tableValues){
              tv.current = tv.values[clazz.system.level];
            }
          }
          if (feature.spellStudies){
            for (let i=0; i<feature.spellStudies.length; i++){
              if (feature.spellStudies[i].onOtherFeature){
                /*
                Spell studies blocks with this property set are used to offset their index position for that level in the rare case of a class having multiple study-guide-enabled features at the same level.
                They are not rendered in the sheet and should be skipped here too.
                */
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
      enchantments: []
    };

    //Disable the left hand slot if a two-handed item is in the right hand
    if (equipment.rightHand){
      const itemInMainHand = this.actor.items.get(equipment.rightHand);
      if (itemInMainHand){
        if (itemInMainHand.system.handedness == "2H" || (itemInMainHand.system.handedness == "1.5H" && !equipment.leftHand)){
          equipment.twoHanded = true;
          equipment.leftHand = "";
        }
      } else {
        console.warn("Encountered a nonexistent item ID in equipment");
      }
    }

    let highestHpIncrement = 0;

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      i.multiple = (i.system.quantity && i.system.quantity > 1);
      switch(i.type){
        case "Item":
        case "Melee Weapon":
        case "Ranged Weapon":
        case "Armor":
        case "Shield":
        case "Phone":
        case "Potion":
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
      death: false,
      show: {
        general: (actor.type == "Player Character" || actor.type == "Non-Player Character" || system.hasStandardActions),
        equipped: false,
        feats: false,
        exploration: (actor.type == "Player Character" || actor.type == "Non-Player Character"),
        social: (actor.type == "Player Character" || actor.type == "Non-Player Character"),
        magic: (actor.type == "Creature" && system.hasMagic) || (system.casterLevel > 0)
      }
    };

    if (system.hitPoints.total > 0 || actor.type == "Creature"){ //If a PC or NPC's HP is 0, remove all actions and show only the death save
      /* Actions from inventory */
      for (const item of this.actor.items.contents){
        for (const itemAction of item.getActions()){
        /*
          Currently, creatures do not use the equipment slot system.
          Actions should never be grayed out based on equipment location for creatures.
          This may change in a future version.
        */
        itemAction.disabled = (!this.actor.isItemActionAvailable(itemAction, item)) && (actor.type != 'Creature');
        //console.log(`action ${itemAction.name} disabled=${itemAction.disabled}`);
        itemAction.itemName = item.name;
        itemAction.itemId = item.id;
        itemAction.itemType = item.type;
        NewEraActorSheet._prepareActionContextInfo(itemAction, false);

        if (["Item", "Melee Weapon", "Ranged Weapon", "Armor", "Shield", "Phone"].includes(item.type)){
          actions.show.equipped = true; //This sets the equipment section to show when there is at least one item with an action in the inventory
          actions.equipped.push(itemAction);
        } else {
          actions.show.feats = true;
          itemAction.macroClass = "action-macro-item";
          actions.feats.push(itemAction);
        }
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
      NewEraActorSheet._prepareActionContextInfo(actionSheetData, true);
      actions.custom.push(actionSheetData);
    }

    /*Feature actions*/
    if (actor.type == "Player Character"){
      for (const clazz of context.inventory.classes){
        for (const feature of ClassInfo.features[clazz.system.selectedClass.toLowerCase()]){
          if (feature.level <= clazz.system.level && feature.actions){
            for (const a of feature.actions){
              NewEraActorSheet._prepareActionContextInfo(a, false);
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
        const extendedFeatData = FeatActions.find(f => f.casperObjectId == feat.system.casperObjectId);
        if (extendedFeatData){
          for (const a of extendedFeatData.actions){
            NewEraActorSheet._prepareActionContextInfo(a, false);
            a.macroClass = "action-macro-basic";
            actions.feats.push(a);
          }
        }
      }
    }

    if (actions.feats.length > 0){
      actions.show.feats = true;
    }


    /* General actions from config for characters and humanoid creatures */
    if (actor.type == "Player Character" || actor.type == "Non-Player Character" || system.hasStandardActions){
      actions.general = [...NEWERA.pcGeneralActions];
      actions.general.forEach((a) => NewEraActorSheet._prepareActionContextInfo(a, false));
      actions.exploration = [...NEWERA.explorationActions];
      actions.exploration.forEach((a) => NewEraActorSheet._prepareActionContextInfo(a, false));
      actions.social = [...NEWERA.generalSocialActions];
      actions.social.forEach((a) => NewEraActorSheet._prepareActionContextInfo(a, false));
      actions.magic = [...NEWERA.generalMagicActions];
      actions.magic.forEach((a) => NewEraActorSheet._prepareActionContextInfo(a, false));
      system.customActionSection = true;
    }

    /* Unarmed attack */
    if (((!system.equipment.leftHand || !system.equipment.rightHand) && actor.type != 'Creature') || system.hasStandardActions){
      actions.general.push({
        name: "Unarmed Attack",
        images: {
          base: `${NEWERA.images}/unarmed_attack.png`,
          right: `${NEWERA.images}/ac_1frame.png`
        },
        ability: null,
        skill: "athletics",
        specialties: ["Brawl"],
        description: "When you haven't got your weapons ready, attack with your fists!",
        difficulty: "The difficulty of an attack is the target's passive agility, unless they react.",
        type: "1",
        rolls: [
          {
            label: "Attack",
            caption: "Unarmed Attack",
            die: "d20",
            formula: "1d20+@skills.athletics.mod+@spec.brawl",
            message: "{NAME} attacks with {d} fists!",
            difficulty: null,
          },
          {
            label: "Damage",
            caption: "Damage (Unarmed Attack)",
            die: "unarmed_attack",
            formula: "1+@abilities.strength.mod"
          }
        ]
      });
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

  static _prepareActionContextInfo(action, isCustom){
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

    action.disallowed = ["E", "S", "D"].includes(action.actionType) && game.combat && game.combat.active && game.combat.round > 0;

    const rolls = action.rolls ? (typeof action.rolls == "Array" ? action.rolls : Object.values(action.rolls)) : [];
    for (const roll of rolls) {
      roll.isFunctionButton = (typeof roll.callback == "function");
    }
  }

  _prepareItemActions(item){

  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    const system = this.actor.system;

    // Render the item sheet for viewing/editing prior to the editable check.
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
      this.render(false);
    });

    html.find('.spell-cast').click(ev => {
      const li = $(ev.currentTarget).parents(".inventory-entry");
      const spell = this.actor.items.get(li.data("itemId"));
      Actions.castSpell(this.actor, spell);
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
      //console.log("[NEWERA] Stored pronoun data "+JSON.stringify(system.pronouns));
      if (system.pronouns.index == 5) {
        html.find('#profile-pronouns').show();
      }
      html.find('#pronoun-select-'+this.actor.id).val(system.pronouns.index);
      html.find('#pronoun-select-'+this.actor.id).change(event => {
        let selection = event.target.value;
        let data = this.actor.system;
        if (selection != 5) {
          html.find('#section-pronouns').hide();
          const selectedSet = NEWERA.pronouns[selection];
          html.find('#pronoun-subjective').val(selectedSet.subjective);
          html.find('#pronoun-objective').val(selectedSet.objective);
          html.find('#pronoun-possessiveDependent').val(selectedSet.possessiveDependent);
          html.find('#pronoun-possessiveIndependent').val(selectedSet.possessiveIndependent);
          html.find('#pronoun-reflexive').val(selectedSet.reflexive);
          html.find('#pronoun-contraction').val(selectedSet.contraction);
          html.find('#pronoun-pluralize').val(selectedSet.pluralize);
        }
        this.submit();
      });
    }

    //Bio field update
    if (this.actor.typeIs(NewEraActor.Types.ANIMATE)){
      html.find('#alignment-moral').val(system.alignment.moral);
      html.find('#alignment-ethical').val(system.alignment.ethical);
    }

    //Other dropdown updates
    if (this.actor.typeIs(NewEraActor.Types.CHARACTER)){
      html.find('#skillmode-select').val(system.advancedSkills.toString());
      html.find('#wornSlotSelect').val(system.wornItemSlots);
    }
    if (this.actor.typeIs(NewEraActor.Types.CREATURE)){
      html.find('#creature-rarity').val(system.rarity);
    }

    //Vehicle dropdowns
    if (this.actor.typeIs(NewEraActor.Types.VEHICLE)){
      html.find('#fuel-type').val(system.fuelType);
      html.find('#vehicle-type').val(system.vehicleType);
      html.find('#color').val(system.color);
    }

    this._setClassFeatureDropdowns(html);
    html.find(".feature-select").change(ev => this._onFeatureSelectionChange(ev));
 
    //Spellbook cast DC's
    if (this.actor.typeIs(NewEraActor.Types.CHARACTER)){
      html.find(".inventory-entry-magic").each((i, val) => {
        const spellId = $(val).data("itemId");
        const dc = this._getSpellCastDifficulty(spellId, 1);
        if (this.actor.items.get(spellId).system.energyCost > this.actor.system.energy.value) {
          html.find(`#spell-dc-${spellId}`).html(`Not enough energy!`);
          html.find(`#spell-dc-${spellId}`).addClass("sheet-error");
          html.find(`#spell-dc-${spellId}`).show();
        } else if (dc){
          html.find(`#spell-dc-${spellId}`).html(`Diff. <b>${dc}</b>`);
          html.find(`#spell-cast-${spellId}`).attr("data-difficulty", dc);
          html.find(`#spell-attack-${spellId}`).attr("data-difficulty", dc);
          html.find(`#spell-dc-${spellId}`).show();
        } else {
          html.find(`#spell-dc-${spellId}`).hide();
        }
        html.find(`.spell-action-icons.${spellId}`).html(Formatting.getSpellActionIcons(this.actor.items.get(spellId)));
      });
    //Monster magic stuff
    } else if (this.actor.typeIs(NewEraActor.Types.CREATURE)){
      html.find(".inventory-entry-magic").each((i, val) => {
        const spellId = $(val).data("itemId");
        const ampFactor = this.actor.items.get(spellId).system.ampFactor;
        const ampLevel = this.actor.items.get(spellId).system.level * ampFactor;
        html.find(`#spell-level-${spellId}`).html(ampLevel);
        html.find(`.spell-action-icons.${spellId}`).html(Formatting.getSpellActionIcons(this.actor.items.get(spellId)));
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

    //Carry weight color
    if (this.actor.typeIs(NewEraActor.Types.CHARACTER)){
      if (system.totalWeight > system.carryWeight.value){
        html.find("#cw-wrapper").addClass("cw-full");
      }
    }
    if (this.actor.typeIs(NewEraActor.Types.VEHICLE)){
      if (system.totalWeight > system.carryWeight){
        html.find("#cw-wrapper").addClass("cw-full");
      }
    }

    //Actions tab
    html.find(".action-icon").click(ev => {
      if ($(ev.currentTarget).data("actionCategory")){ //This check prevents the listener from triggering on click of the 'new custom action' button
        html.find("#selectedActionCategory").val($(ev.currentTarget).data("actionCategory"));
        html.find("#selectedActionIndex").val($(ev.currentTarget).data("actionId"));
        html.find(".newera-actorsheet-scroll").scrollTop(0);
        this.submit();
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

    //Effect rows (have to do this here because VS code doesn't like Handlebars in CSS)
    html.find(".effect-row").each(function(){
      $(this).css("background-color", $(this).data("color"));
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
        !!feature.spellStudies
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
      const li = $(ev.currentTarget).parents(".inventory-entry");
      const item = this.actor.items.get(li.data("itemId"));
      const isPhysicalItem = ["Item", "Melee Weapon", "Ranged Weapon", "Armor", "Shield"].includes(item.type);
      if (game.settings.get("newera-sol366", "confirmDelete")){
        new Dialog({
          title: "Confirm Delete",
          content: `<p>Are you sure you want to delete this?</p>${isPhysicalItem ? `<p>If you'll need it later, use the <i class="fa-solid fa-box-open"></i> Store button to mark the item as not currently in your possession without deleting it entirely.</p>` : ""}`,
          buttons: {
            confirm: {
              icon: '<i class="fas fa-trash"></i>',
              label: "Yes",
              callback: () => {
                if (isPhysicalItem){
                  this.actor.actionMessage(item.img, null, "{NAME} drops the {0}.", item.name);
                }
                item.delete();
                this.render(false);
              }
            },
            cancel: {
              icon: `<i class="fas fa-x"></i>`,
              label: "No",
            }
          },
          default: "cancel"
        }).render(true);
      } else {
        if (isPhysicalItem){
          this.actor.actionMessage(item.img, null, "{NAME} drops the {0}.", item.name);
        }
        item.delete();
        this.render(false);
      }
    });

    //Add Skills
    html.find('#addKnowledgeButton').click(ev => {
      this.actor.addKnowledge();
      this.render(false);
    }); 
    html.find('#addSpecialtyButton').click(ev => {
      this.actor.addSpecialty();
      this.render(false);
    }); 
    html.find('#addResourceButton').click(ev => {
      this.actor.addResource();
      this.render(false);
    }); 
    html.find(".deleteResource").click(ev => {
      Formatting.confirm(this.actor, ev, (actor, event) => actor.deleteResource($(event.currentTarget).data("resourceIndex")));
    });
    html.find('#addSpecialModifierButton').click(ev => {
      this.actor.addSpecialModifier();
      this.render(false);
    });
    html.find(`.improveSkillButton`).click(() => {
      this.showSkillImprovementDialog();
    });

    //Inventory drag-and-drop
    html.find(".newera-draggable-equipment").on("dragstart", ev => {
      //ev.preventDefault();
      //console.log(ev);
      const itemId = $(ev.currentTarget).data("itemId");
      const fromZone = $(ev.currentTarget).parents(".newera-equipment-dropzone");
      console.log(`INV DRAGSTART ${itemId}`);
      ev.originalEvent.dataTransfer.setData("objectType", "equipment");
      ev.originalEvent.dataTransfer.setData("itemId", itemId);
      ev.originalEvent.dataTransfer.setData("fromZone", fromZone.data("dropZone"));
      ev.originalEvent.dataTransfer.setData("fromActor", this.actor.uuid);
      ev.originalEvent.dataTransfer.effectAllowed = "move";
    });
    html.find(".newera-equipment-dropzone").on("dragover", ev => {
      ev.preventDefault();
    });
    html.find(".newera-equipment-dropzone").on("drop", ev => {
      const itemId = ev.originalEvent.dataTransfer.getData("itemId");
      const sourceSlot = ev.originalEvent.dataTransfer.getData("fromZone");
      const targetSlot = $(ev.currentTarget).data("dropZone");
      const sourceActor = ev.originalEvent.dataTransfer.getData("fromActor");
      const targetActor = this.actor.uuid;
      //Prevent listener from running on drops from unrelated stuff
      if (!itemId){
        return;
      }
      console.log(`INV DROP ${itemId} ${sourceActor}.${sourceSlot}->${targetActor}.${targetSlot}`);
      //Moving items between slots on the same actor (existing behavior)
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
          if (Formatting.sendEquipmentChangeMessages()){
            this.actor.actionMessage(movedItem.img, frameImg, "{NAME} {0} {d} {1}!", this._getItemActionVerb(sourceSlot, targetSlot), (movedItem.type == "Phone" ? "phone" : movedItem.name));
          }
          this.actor.moveItem(itemId, sourceSlot, targetSlot);
          html.find(`#newera-equipment-${this.actor.id}-${targetSlot}-input`).val(itemId);
          html.find(`#newera-equipment-${this.actor.id}-${sourceSlot}-input`).val("");
          this.submit();
        }
      }
      //Moving an item to a different actor (new behavior)
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
          origin.transferItem(this.actor, movedItem, targetSlot);
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
    html.find("#init-hp-roll").click(async () => {
      await this.actor.rollInitialHP();
      html.find("#resourceValHp").val(this.actor.system.hitPoints.value);
      html.find("#resourceMaxHp").val(this.actor.system.hitPoints.max);
      this.submit();
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
    html.find("#increaseHpButton").click(() => {
      this.showHpIncreaseDialog();
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

  showHpIncreaseDialog(){
    new Dialog({
      title: "Increase Maximum HP",
      content: "This will increase your maximum hit points by your hit point increment.<br/>If you earned any ability score increases this level, apply those first!",
      buttons: {
        roll: {
          icon: `<i class="fa-solid fa-dice"></i>`,
          label: "Roll",
          callback: async () => {
            await this.actor.increaseMaxHp(true);
            $(this.form).find("#hp-true-max").val(this.actor.system.hitPointTrueMax);
            $(this.form).find("#resourceValHp").val(this.actor.system.hitPoints.value);
            $(this.form).find("#resourceMaxHp").val(this.actor.system.hitPoints.max);
            $(this.form).find("#resourceValLp").val(this.actor.system.lifePoints.value);
            $(this.form).find("#resourceMaxLp").val(this.actor.system.lifePoints.max);
            this.submit();
          }
        },
        average: {
          icon: `<i class="fa-solid fa-arrow-trend-up"></i>`,
          label: "Average",
          callback: async () => {
            await this.actor.increaseMaxHp(false);
            $(this.form).find("#hp-true-max").val(this.actor.system.hitPointTrueMax);
            $(this.form).find("#resourceValHp").val(this.actor.system.hitPoints.value);
            $(this.form).find("#resourceMaxHp").val(this.actor.system.hitPoints.max);
            $(this.form).find("#resourceValLp").val(this.actor.system.lifePoints.value);
            $(this.form).find("#resourceMaxLp").val(this.actor.system.lifePoints.max);
            //console.log($(this.form).find("#hp-true-max"));
            this.submit();
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

  /*
    Set the existing values of the dropdowns in class feature selections.
    For each selection dropdown, this has to step through the DataModel using the input field's name until it arrives at the value for each one.
  */
  _setClassFeatureDropdowns(html){
    const system = this.actor.system;
    if (this.actor.type != "Player Character") return;
    html.find(".feature-select").val(function() {
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

    //Set the "oldValue" data property to the current value so that when the selection changes, we can pull the old value that way
    html.find(".feature-select").data("oldValue", function(){
      return $(this).val();
    });
  }

  _onFeatureSelectionChange(ev){
    if (game.settings.get("newera-sol366", "autoApplyFeatures")){
      const element = $(ev.currentTarget);
      const dataField = element.attr("name");
      const oldValue = element.data("oldValue") || "";
      const newValue = element.val() || "";
      const selection = ClassInfo.findFeatureSelectionByLabel(dataField);
      if (!selection){
        console.warn(`Couldn't find feature selection for ${dataField}`);
        return;
      }
      if (typeof selection.onChange == "function"){
        selection.onChange(this.actor, oldValue, newValue);
        console.log(`Executed feature selection change ${dataField} ${oldValue}->${newValue}`);
      } else {
        console.warn(`Changed feature ${dataField} has no onChange function`);
      }
    } else {
      console.log("Ignoring feature selection change because autoApplyFeatures is turned off");
    }
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
        if (featFromCompendium){
          if (featFromActor){ //Increase tier
            if (featFromActor.system.maximumTier == -1){
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
                  await featFromActor.update({
                    system: {
                      currentTier: featFromActor.system.currentTier + 1
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
              ui.notifications.info(`You took ${featFromCompendium.name} for ${featFromCompendium.system.base.cost} character points.`);
            } else {
              ui.notifications.warn(`${this.actor.name} doesn't meet the prerequisites for ${featFromCompendium.name}.`);
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
            } else if (dropData.remaining === 0){
              ui.notifications.info(`You learned ${spellFromCompendium.name}! You've completed this study guide.`);
            } else if (dropData.remaining == -1 || dropData.remaining === null){
              ui.notifications.info(`You learned ${spellFromCompendium.name}!`);
            }
          }
        } else {
          ui.notifications.error(`Error: Couldn't load spell data`);
        }
      }
    }
}
