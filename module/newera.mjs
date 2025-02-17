// Import document classes.
import { NewEraActor } from "./documents/actor.mjs";
import { NewEraItem } from "./documents/item.mjs";
// Import sheet classes.
import { NewEraActorSheet } from "./sheets/actor-sheet.mjs";
import { NewEraItemSheet } from "./sheets/item-sheet.mjs";
import { PhoneUI } from "./sheets/phone-ui.mjs";
import { HotbarManager } from "./helpers/macros/hotbarManager.mjs";
import { HotbarActions } from "./helpers/macros/hotbarActions.mjs";
import { Formatting } from "./helpers/formatting.mjs";

// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { NEWERA } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.newera = {
    NewEraActor,
    NewEraItem,
    HotbarActions
  };

  setupGameSettings();

  // Add custom constants for configuration.
  CONFIG.NEWERA = NEWERA;

  //Last Damage Tracking
  game.newera.getLastDamageAmount = function(){
    const damageRolls = game.messages.filter(m => m.flavor && m.flavor.toLowerCase().includes("damage"));
    if (!damageRolls || damageRolls.length == 0){
      return null;
    }
    const lastDamageMessage = damageRolls[damageRolls.length - 1];
    if (lastDamageMessage.rolls){
      let damage = 0;
      lastDamageMessage.rolls.forEach(r => damage += r.total);
      return damage;
    } else {
      return 0;
    }

  }
  game.newera.setLastDamageAmount = async function(n){
    
  }
  game.newera.clearLastDamage = async function(){
    
  }

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20 + @initiative.mod",
    decimals: 2
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = NewEraActor;
  CONFIG.Item.documentClass = NewEraItem;

  //Apply status effects
  CONFIG.statusEffects = NEWERA.defaultStatusEffects;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("newera-sol366", NewEraActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("newera-sol366", NewEraItemSheet, {
    types: ["Item", "Melee Weapon", "Ranged Weapon", "Armor", "Shield", "Action", "Spell", "Enchantment", "Potion", "Class", "Feat"],
    makeDefault: true
  });
  Items.registerSheet("newera-sol366", PhoneUI, {
    types: ["Phone"],
    makeDefault: true
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here are a few useful examples:
Handlebars.registerHelper('concat', function() {
  var outStr = '';
  for (var arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

Handlebars.registerHelper('toUpperCase', function(str) {
  return str.toUpperCase();
});

Handlebars.registerHelper('enabled', function(val) { //Easy inverse of the 'disabled' helper
  if (!val) {
    return "disabled";
  }
});

Handlebars.registerHelper('capitalize', function(str) {
  const words = str.split(" ");
  return words.map(s => s[0].toUpperCase() + s.substr(1)).join(" ");
});

Handlebars.registerHelper('localizeCaps', function(str) {
  return game.i18n.localize(str).toUpperCase();
});

Handlebars.registerHelper('selected', function(check, value) {
  if (check == value){
    //console.log(`[DEBUG] sel ${value} true`);
    return 'selected';
  } else {
    //console.log(`[DEBUG] sel ${value} false`);
    return '';
  }
});

Handlebars.registerHelper('parentAbility', function(data, key) {
  let val = data.abilities[key].mod;
  if (val>=0){
    return "+"+val;
  } else {
    return ""+val;
  }
});

Handlebars.registerHelper('romanNumeral', function(num, showOne) {
  if (num==1 && !showOne){
    return "";
  } else {
    return NEWERA.romanNumerals[num];
  }
});

Handlebars.registerHelper('amplify', function(value, multiplier){
  return Formatting.amplifyValue(value, multiplier);
});

Handlebars.registerHelper('truncate', function(str, maxlength){
  if (str){
    if (str.length > maxlength){
      return str.substr(0, maxlength-1) + "...";
    } else {
      return str;
    }
  } else {
    return "";
  }
});

Handlebars.registerHelper('json', function(obj){
  return JSON.stringify(obj);
});

Handlebars.registerHelper('draggable', function(val){
  if (val){
    return `draggable="true"`;
  } else {
    return "";
  }
});

Handlebars.registerHelper('htmlTooltip', function(msg, direction){
  if (msg){
    return `data-tooltip="${msg}" data-tooltip-direction="${direction.toUpperCase()}"`;
  } else {
    return "";
  }
});

Handlebars.registerHelper('descriptionTarget', function(key){
  return `system.tiers.${key}.description`;
});

Handlebars.registerHelper('includes', function(haystack, value){
  if (typeof haystack == 'array'){
    return haystack.includes(value);
  } else if (typeof haystack == "object"){
    return Object.keys(haystack).includes(value);
  } else {
    return false;
  }
});

Handlebars.registerHelper('populated', function(haystack){
  if (typeof haystack == 'array'){
    return haystack.length > 0;
  } else if (typeof haystack == "object"){
    return Object.keys(haystack).length > 0;
  } else {
    return false;
  }
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  Hooks.on("hotbarDrop", (bar, data, slot) => HotbarManager.onHotbarDrop(bar, data, slot));
  Hooks.on("combatTurnChange", async (combat, updateData, updateOptions) => {
    if (game.settings.get("newera-sol366", "autoClearCombatantStatus") && game.users.activeGM.isSelf) { //This hook fires on all clients so isSelf is used so only the GM performs the update
      //console.log(`[DEBUG] Clearing turn status effects from next actor`);
      const actor = combat.combatants.get(combat.current.combatantId).actor;
      if (actor) {
        const reactionUsed = actor.effects.find(eff => ["Reaction Used", "Reactions Used"].includes(eff.label));
        const preoccupied = actor.effects.find(eff => eff.label == "Preoccupied");
        const waiting = actor.effects.find(eff => eff.label == "Waiting");
        if (reactionUsed) {
          await reactionUsed.delete();
        }
        if (preoccupied) {
          await preoccupied.delete();
        }
        if (waiting) {
          await waiting.delete();
        }
      }
    }
  });
});

/* Game Settings */

function setupGameSettings(){
  game.settings.register("newera-sol366", "autoLevelUp", {
    name: "Auto Level Up (BETA)",
    hint: "Automatically update key values on your character sheet when you level up and when selecting options on class features. This functionality is EXPERIMENTAL - not all features are supported yet, and some may not update correctly. Use at your own risk.",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  game.settings.register("newera-sol366", "autoAmplify", {
    name: "Amplify Spells by Default",
    hint: "Lower-level spells will automatically be amplified to the highest level you can cast trivially",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  game.settings.register("newera-sol366", "autoRollActions", {
    name: "Instant Roll Hotbar Actions",
    hint: "If an action on your hotbar has only one roll, executing it will roll instantly instead of opening a dialog",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true,
  });
  game.settings.register("newera-sol366", "confirmDelete", {
    name: "Confirm Item Deletions",
    hint: "Display a yes/no confirmation when deleting owned items from an actor",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true,
  });
  game.settings.register("newera-sol366", "giveEmptyPotionBottles", {
    name: "Keep Potion Bottles",
    hint: "When consuming potions, replace them with empty bottles in the drinker's inventory",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true,
  });
  game.settings.register("newera-sol366", "favoriteSpellActions", {
    name: "Show Favorite Spells on the Actions Tab",
    hint: "Spells marked as Favorites for a PC or NPC will appear next to your equipment actions on the Actions tab.",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  game.settings.register("newera-sol366", "autoClearCombatantStatus", {
    name: "Clear Combat Status Effects on Turn Start",
    hint: "Automatically remove the Reaction Used, Preoccupied, and Waiting status effects when a combatant starts their turn",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true,
  });
  game.settings.register("newera-sol366", "enforceActionConditions", {
    name: "Enforce Action Conditions",
    hint: "When enabled, actions for items will be grayed out if they aren't equipped in the appropriate slot, and spells will be unavailable if the actor doesn't have a free hand. Disable to ignore these rules.",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true,
  });
  game.settings.register("newera-sol366", "sendEquipMsgs", {
    name: "Send Equipment Action Messages in Chat",
    hint: "Choose whether to send messages in chat when a character equips, unequips, hands off, or drops an item",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    choices: {
      "2": "Always",
      "1": "While In Combat",
      "0": "Never"
    },
    default: "2"
  });
  game.settings.register("newera-sol366", "progressionMode", {
    name: "Progression Mode",
    hint: "The method you will use to track character points and progression",
    scope: "world",
    config: true,
    requiresReload: true,
    type: String,
    choices: {
      "0": "Individual",
      "1": "Group",
      "2": "Milestone",
      "3": "One-Shot Mode"
    },
    default: 0,
  });
  game.settings.register("newera-sol366", "difficulty", {
    name: "Difficulty",
    hint: "Setting the campaign difficulty affects inspiration and the one-hit KO rule.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    choices: {
      0: "Easy",
      1: "Normal",
      2: "Hard",
      3: "Hardcore",
      4: "Lethal"
    },
    default: 1,
  });
  game.settings.register("newera-sol366", "startingLevel", {
    name: "Starting Level",
    hint: "The level new player characters start at",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    range: {
      min: 0,
      max: 30,
      step: 1
    },
    default: 0
  });
  game.settings.register("newera-sol366", "characterCreation", {
    name: "Character Creation Mode",
    hint: "Enable character creation tips and hints on character sheets and show backgrounds and flaws in the feat browser. Disable this once your campaign has started to hide these options.",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: true
  });
  game.settings.register("newera-sol366", "advancedSkills", {
    name: "Enable Advanced Skills",
    hint: "Advanced Skills allows players to earn skill improvements through training and practice. The GM must keep track of skill checks on a Session Sheet.",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false
  });
  game.settings.register("newera-sol366", "inspiration", {
    name: "Enable Inspiration",
    hint: "Players can spend points of inspiration to re-roll dice and to gain extra frames during combat. Inspiration is disabled on Expert and Lethal difficulties.",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false
  });
  game.settings.register("newera-sol366", "nonLethalNPCs", {
    name: "NPCs Deal Non-Lethal Damage",
    hint: "Give your players the satisfaction of delivering the killing blow. When this option is enabled, NPC attacks can't reduce a creature's Hit Points to less than 1.",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false
  });
  game.settings.register("newera-sol366", "prereqCheck", {
    name: "Enable Feat Prerequisite Checking (BETA)",
    hint: "Check whether PC's meet the prerequisites for feats in the feat browser. This feature is experimental and may not work correctly for all feats. Disable to check character point cost only.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  game.settings.register("newera-sol366", "world.time.hour", {
    name: "Game Time - Hour",
    hint: "The time of day in the game world, using the 24-hour system. This and below settings control the information displayed on the home screen of phone and computer items.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    range: {
      min: 0,
      max: 23,
      step: 1
    },
    default: 0,
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.time.minute", {
    name: "Game Time - Minute",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    range: {
      min: 0,
      max: 59,
      step: 1
    },
    default: 0,
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.time.daylight", {
    name: "Game Time - Day/Night",
    hint: "This setting affects the display of weather conditions and sets the theme to dark on phones with Auto theme selected.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    choices: {
      "day": "Daytime",
      "night": "Nighttime",
      "auto": "Auto"
    },
    default: "auto",
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.date.day", {
    name: "Game Time - Day",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    default: 1,
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.date.month", {
    name: "Game Time - Month",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    choices: {
      "1": "January",
      "2": "February",
      "3": "March",
      "4": "April",
      "5": "May",
      "6": "June",
      "7": "September",
      "8": "October",
      "9": "November",
      "10": "December",
      "11": "Pax",
      "12": "Manus",
      "13": "Sol"
    },
    default: "1",
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.date.year", {
    name: "Game Time - Year",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    default: 366,
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.weather.conditions", {
    name: "Game World - Current Weather",
    hint: "Precipitation will display as snow if the temperature is below 0°C",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    choices: {
      "clear": "Sunny / Clear",
      "pc1": "Mostly Sunny / Clear",
      "pc2": "Partly Cloudy",
      "pc3": "Mostly Cloudy",
      "cloudy": "Cloudy",
      "foggy": "Foggy",
      "precip1": "Light Rain / Snow",
      "precip2": "Rain / Snow",
      "precip3": "Heavy Rain / Snow",
      "storm1": "Thunderstorms",
      "storm2": "Strong Thunderstorms"
    },
    default: "clear",
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.weather.temp", {
    name: "Game World - Temperature (°C)",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    range: {
      min: -75,
      max: 50,
      step: 1
    },
    default: 0,
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.weather.wind", {
    name: "Game World - Winds",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    choices: {
      "0": "Calm (<20 km/h)",
      "1": "High Winds 1 (20-50 km/h)",
      "2": "High Winds 2 (50-120 km/h)",
      "3": "High Winds 3 / >150 km/h"
    },
    default: "0",
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.weather.precip", {
    name: "Game World - Chance of Rain/Snow (%)",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Number,
    range: {
      min: 0,
      max: 100,
      step: 10
    },
    default: 20,
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.weather.forecast", {
    name: "Game World - Weather Forecast Message",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    default: 0,
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.location", {
    name: "Game World - Current Location",
    hint: "The current city, county, or township that will be shown on the GPS screen",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    default: "Highgate, KL",
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.signal", {
    name: "Game World - Cellular Service",
    hint: "The quality of cell signal at the current location. Limited service prevents some actions from being taken with phones. Weak service may interfere with calls and cause batteries to drain more quickly.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    choices: {
      "fast": "Excellent (High-Speed)",
      "normal": "Normal",
      "limited": "Limited",
      "weak": "Weak",
      "weakLimited": "Weak/Limited",
      "none": "No Service"
    },
    default: "normal",
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.alert", {
    name: "Game World - Emergency Alert Message",
    scope: "world",
    config: true,
    requiresReload: false,
    type: String,
    default: 0,
    onChange: () => refreshPhones()
  });
  game.settings.register("newera-sol366", "world.scrambleTime", {
    name: "Game World - Alternate Dimension Mode",
    hint: "Scramble the in-game date, time, and location to random values. Use when the party is in another dimension where time doesn't work.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: 0,
    onChange: () => refreshPhones()
  });
}

async function refreshPhones(){
  console.log("Pushing current condition changes to characters' phones");
  for (const actor of game.actors.values()){
    for (const item of actor.items.values()){
      if (item.type == "Phone"){
        console.log(`Found ${item.name} in ${actor.name}'s inventory`);
        if (item.sheet){
          item.sheet.render(false);
        }
      }
    }
  }
  for (const item of game.items.values()){
    if (item.type == "Phone"){
      console.log(`Found ${item.name} in game.items`);
      if (item.sheet){
        item.sheet.render(false);
      }
    }
  }
}