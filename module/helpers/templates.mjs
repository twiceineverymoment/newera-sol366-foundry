/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    //Actor sheet templates (all actor types)
    "systems/newera-sol366/templates/actor/parts/actions.hbs",
    "systems/newera-sol366/templates/actor/parts/effects.hbs",

    //Character sheet templates (PC and NPC shared)
    "systems/newera-sol366/templates/actor/parts/char-profile.hbs",
    "systems/newera-sol366/templates/actor/parts/char-inventory.hbs",
    "systems/newera-sol366/templates/actor/parts/char-spell-table.hbs",
    "systems/newera-sol366/templates/actor/parts/char-spell-row.hbs", 
    "systems/newera-sol366/templates/actor/parts/char-stats.hbs",

    //Player Character sheet templates
    "systems/newera-sol366/templates/actor/parts/pc-top-section.hbs",
    "systems/newera-sol366/templates/actor/parts/pc-abilities.hbs",
    "systems/newera-sol366/templates/actor/parts/pc-class.hbs",
    "systems/newera-sol366/templates/actor/parts/pc-feats.hbs",
    "systems/newera-sol366/templates/actor/parts/pc-magic.hbs",

    //NPC sheet templates
    "systems/newera-sol366/templates/actor/parts/npc-top-section.hbs",
    "systems/newera-sol366/templates/actor/parts/npc-abilities.hbs",
    "systems/newera-sol366/templates/actor/parts/npc-magic.hbs",

    //Creature templates
    "systems/newera-sol366/templates/actor/parts/creature-top-section.hbs",
    "systems/newera-sol366/templates/actor/parts/creature-stats.hbs",
    "systems/newera-sol366/templates/actor/parts/creature-abilities.hbs",
    "systems/newera-sol366/templates/actor/parts/creature-description.hbs",
    "systems/newera-sol366/templates/actor/parts/creature-items.hbs",
    "systems/newera-sol366/templates/actor/parts/creature-magic.hbs",

    //Item sheet templates
    "systems/newera-sol366/templates/item/parts/item-effects.hbs",
    "systems/newera-sol366/templates/item/parts/item-enchantments.hbs",
    "systems/newera-sol366/templates/item/parts/item-actions.hbs",
    "systems/newera-sol366/templates/item/parts/melee-weapon-attacks.hbs",
    "systems/newera-sol366/templates/item/parts/materials.hbs",
    "systems/newera-sol366/templates/item/parts/components.hbs",
    "systems/newera-sol366/templates/item/parts/secret.hbs",

    //Miscellaneous Actor templates
    "systems/newera-sol366/templates/actor/parts/vehicle-occupants.hbs",

    //Phone UI templates
    "systems/newera-sol366/templates/item/phone/phone-settings.hbs",
    "systems/newera-sol366/templates/item/phone/phone-contacts.hbs",
    "systems/newera-sol366/templates/item/phone/phone-weather.hbs",
    "systems/newera-sol366/templates/item/phone/phone-map.hbs",
    "systems/newera-sol366/templates/item/phone/phone-call.hbs",
    "systems/newera-sol366/templates/item/phone/phone-messages.hbs",
    "systems/newera-sol366/templates/item/phone/phone-browser.hbs",
    "systems/newera-sol366/templates/item/phone/phone-photos.hbs",
    "systems/newera-sol366/templates/item/phone/phone-chat.hbs",
    "systems/newera-sol366/templates/item/phone/phone-photo-view.hbs",

    //Extras templates
    "systems/newera-sol366/templates/extras/parts/feat-filters.hbs",
    "systems/newera-sol366/templates/extras/parts/feat-browser-table.hbs",
    "systems/newera-sol366/templates/extras/parts/spell-filters.hbs",
    "systems/newera-sol366/templates/extras/parts/spell-browser-table.hbs"

  ]);
};