/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    //Actor sheet templates (all actor types)
    "systems/newera-sol366/templates/actor/parts/actions.html",
    "systems/newera-sol366/templates/actor/parts/effects.html",

    //Character sheet templates (PC and NPC shared)
    "systems/newera-sol366/templates/actor/parts/char-profile.html",
    "systems/newera-sol366/templates/actor/parts/char-inventory.html",
    "systems/newera-sol366/templates/actor/parts/char-spell-table.html",
    "systems/newera-sol366/templates/actor/parts/char-spell-row.html", 
    "systems/newera-sol366/templates/actor/parts/char-stats.html",

    //Player Character sheet templates
    "systems/newera-sol366/templates/actor/parts/pc-top-section.html",
    "systems/newera-sol366/templates/actor/parts/pc-abilities.html",
    "systems/newera-sol366/templates/actor/parts/pc-class.html",
    "systems/newera-sol366/templates/actor/parts/pc-feats.html",
    "systems/newera-sol366/templates/actor/parts/pc-magic.html",

    //NPC sheet templates
    "systems/newera-sol366/templates/actor/parts/npc-top-section.html",
    "systems/newera-sol366/templates/actor/parts/npc-abilities.html",
    "systems/newera-sol366/templates/actor/parts/npc-magic.html",

    //Creature templates
    "systems/newera-sol366/templates/actor/parts/creature-top-section.html",
    "systems/newera-sol366/templates/actor/parts/creature-stats.html",
    "systems/newera-sol366/templates/actor/parts/creature-abilities.html",
    "systems/newera-sol366/templates/actor/parts/creature-description.html",
    "systems/newera-sol366/templates/actor/parts/creature-items.html",
    "systems/newera-sol366/templates/actor/parts/creature-magic.html",

    //Item sheet templates
    "systems/newera-sol366/templates/item/parts/item-effects.html",
    "systems/newera-sol366/templates/item/parts/item-enchantments.html",
    "systems/newera-sol366/templates/item/parts/item-actions.html",
    "systems/newera-sol366/templates/item/parts/melee-weapon-attacks.html",

    //Phone UI templates
    "systems/newera-sol366/templates/item/phone/phone-settings.html",
    "systems/newera-sol366/templates/item/phone/phone-contacts.html",
    "systems/newera-sol366/templates/item/phone/phone-weather.html",
    "systems/newera-sol366/templates/item/phone/phone-map.html",
    "systems/newera-sol366/templates/item/phone/phone-call.html",
    "systems/newera-sol366/templates/item/phone/phone-messages.html",
    "systems/newera-sol366/templates/item/phone/phone-browser.html",
    "systems/newera-sol366/templates/item/phone/phone-photos.html",
    "systems/newera-sol366/templates/item/phone/phone-chat.html",

    //Extras templates
    "systems/newera-sol366/templates/extras/parts/feat-filters.html",
    "systems/newera-sol366/templates/extras/parts/feat-browser-table.html",
    "systems/newera-sol366/templates/extras/parts/spell-filters.html",
    "systems/newera-sol366/templates/extras/parts/spell-browser-table.html"

  ]);
};