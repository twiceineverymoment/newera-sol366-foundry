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
    return game.settings.get("newera-sol366", "lastDamageAmt");
  }
  game.newera.setLastDamageAmount = async function(n){
    const current = game.settings.get("newera-sol366", "incrementalDamage") ? game.settings.get("newera-sol366", "lastDamageAmt") : 0;
    await game.settings.set("newera-sol366", "lastDamageAmt", n+current);
    console.log("[DEBUG] Last Damage Amount set to "+(n+current));
  }
  game.newera.clearLastDamage = async function(){
    if (game.settings.get("newera-sol366", "incrementalDamage")){
      await game.settings.set("newera-sol366", "lastDamageAmt", 0);
      console.log("[DEBUG] Cleared the incremental damage ticker");
    }
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

Handlebars.registerHelper('capitalize', function(str) {
  const words = str.split(" ");
  return words.map(s => s[0].toUpperCase() + s.substr(1)).join(" ");
});

Handlebars.registerHelper('localizeCaps', function(str) {
  return game.i18n.localize(str).toUpperCase();
});

Handlebars.registerHelper('selected', function(check, value) {
  if (check == value){
    return 'selected';
  } else {
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

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  Hooks.on("hotbarDrop", (bar, data, slot) => HotbarManager.onHotbarDrop(bar, data, slot));
  Hooks.on("combatTurn", (combat, updateData, updateOptions) => {
    
  });
});

/* Game Settings */

function setupGameSettings(){
  game.settings.register("newera-sol366", "lastDamageAmt", {
    name: "Last Damage Dealt",
    scope: "world",
    config: false,
    requiresReload: false,
    type: Number,
    default: 0,
  });
  game.settings.register("newera-sol366", "autoApplyFeatures", {
    name: "Automatically Apply Unlocked Features",
    hint: "When unlocking new character or class features and making selections, certain changes will be automatically applied to your character sheet",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true,
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
  game.settings.register("newera-sol366", "incrementalDamage", {
    name: "Enable Incremental Damage Counter",
    hint: "When enabled, sequential damage rolls will add to the next amount of damage dealt by the Take Damage button or macro and the counter will be cleared when a creature takes that damage. When disabled, only the most recent roll is taken into account.",
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
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
    hint: "Players can spend points of inspiration to re-roll dice and to gain extra frames during combat",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false
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