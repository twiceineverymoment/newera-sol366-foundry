import { Artificer } from "./classes/artificer.mjs";
import { Chanter } from "./classes/chanter.mjs";
import { Delver } from "./classes/delver.mjs";
import { Guardian } from "./classes/guardian.mjs";
import { Investigator } from "./classes/investigator.mjs";
import { Magus } from "./classes/magus.mjs";
import { Mercenary } from "./classes/mercenary.mjs";
import { Ranger } from "./classes/ranger.mjs";
import { Researcher } from "./classes/researcher.mjs";
import { Scholar } from "./classes/scholar.mjs";
import { Sage } from "./classes/sage.mjs";
import { Witch } from "./classes/witch.mjs";

/**
 * This file contains custom logic for feats.
 * Although each tier has a unique ID in CASPER, only the first tier is exported to Foundry by its number.
 * Selection keys must be unique to the entire feat/tier
 */
const generalFeats = {
    "148": {
        "1": {
            prerequisite: {
                check: "value",
                value: actor => {
                    return Object.values(actor.system.skills).filter(skill => skill.level == 10).length + Object.values(actor.system.magic).filter(skill => skill.level == 10).length
                },
                required: 1,
                doubleCheck: "You have a skill that has reached level 10. Confirm with your GM before taking this feat."
            }
        }
    },
    "85": {
        "1": {
            prerequisite: {
                check: "value",
                value: actor => Object.entries(actor.system.knowledges).length,
                required: 1,
                doubleCheck: "Confirm your foreign language knowledge with the GM."
            } 
        } 
    },
    "262": {
        "1": {
            prerequisite: {
                check: "none",
                doubleCheck: "Confirm your choice with the GM."
            }
        }
    },
    "367": {
        "1": {
            prerequisite: {
                check: "value",
                value: actor => actor.items.filter(i => ["Spell", "Enchantment"].includes(i.type) && i.system.rarity == 0).length,
                required: 3
            }
        }
    },
    "458": {
        "1": {
            prerequisite: {
                check: "value",
                value: actor => Object.values(actor.system.specialties).filter(spec => spec.subject && spec.subject.toLowerCase() == "Animal Handling").length,
                required: 1
            }  
        }
    },
    "94": { //Combat Adept
        "1": {
            features: [
                {
                    onUnlock: (actor) => actor.increaseBaseTurnLength()
                }
            ]
        },
        "2": {
            features: [
                {
                    onUnlock: (actor) => actor.increaseBaseTurnLength() 
                }
            ]
        },
        "3": {
            features: [
                {
                    onUnlock: (actor) => actor.increaseBaseTurnLength()
                }
            ]
        }
    },
    "103": { //Extra Natural Skill
        "1": {
            features: [
                {
                    selections: {
                        "skill": {
                            label: "Select a Skill",
                            dynamicOptions: actor => actor.getSkillOptions(),
                            onChange: (actor, from, to) => actor.setNaturalSkill(from, to)
                        }
                    }
                }
            ]
        }
    },
    "100": { //Working Out
        "1": {
            features: [
                {
                    selections: {
                        "0": {
                            label: "Size Change",
                            options: {increase: "Increase", decrease: "Decrease"},
                            onChange: (actor, from, to) => {
                                //TODO find original size 
                                let change = 0;
                                if (from == "increase") {
                                    change--;
                                } else if (from == "decrease") {
                                    change++;
                                }
                                if (to == "increase") {
                                    change++;
                                } else if (to == "decrease") {
                                    change--;
                                }

                                actor.update({
                                    system: {
                                        size: {
                                            mod: actor.system.size.mod + change
                                        }
                                    }
                                });

                                ui.notifications.info(`Your Size modifier has been changed.`);
                            }
                        }
                    }
                }
            ]
        }
    },
    "135": { //Heavy Lifter
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        actor.update({
                            system: {
                                carryWeight: {
                                    bonus: actor.system.carryWeight.bonus + 2
                                }
                            }
                        });
                        ui.notifications.info(`Your carry weight has been increased.`);
                    }
                }
            ]
        }
    },
    "101": { //Alert 
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        actor.update({
                            system: {
                                passivePerception: {
                                    bonus: actor.system.passivePerception.bonus + 1
                                }
                            }
                        });
                        ui.notifications.info(`Your Passive Perception has been increased.`);
                    }
                }
            ]
        }
    },
    "259": { //Tough 
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        if (actor.system.armor.bonus >= 6){
                            ui.notifications.warn(`${actor.name} Your armor bonus can't be increased beyond 6 via this feat.`);
                            return;
                        }
                        actor.update({
                            system: {
                                armor: {
                                    bonus: actor.system.armor.bonus + 1
                                }
                            }
                        });
                        ui.notifications.info(`Your Natural Armor bonus has been increased.`);
                    }
                }
            ]
        }
    },
    "260": { //Fast Fighter 
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        actor.update({
                            system: {
                                initiative: {
                                    bonus: actor.system.initiative.bonus + 1
                                }
                            }
                        });
                        ui.notifications.info(`Your Initiative bonus has been increased.`);
                    }
                }
            ]
        }
    },
    "261": { //Runner 
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        if (actor.system.speed.base >= 12){
                            ui.notifications.warn(`${actor.name} Your speed can't be increased beyond 12 via this feat.`);
                            return;
                        }
                        actor.update({
                            system: {
                                speed: {
                                    base: actor.system.speed.base + 1
                                }
                            }
                        });
                        ui.notifications.info(`Your Speed has been increased.`);
                    }
                }
            ]
        }
    },
    "148": { //Grand Master
        "1": {
            features: [
                {
                    selections: {
                        "skill": {
                            label: "Select a Skill",
                            dynamicOptions: actor => actor.getSkillOptions(),
                            onChange: (actor, from, to) => actor.setGrandMaster(from, to)
                        }
                    }
                }
            ]
        }
    }
};

const skillFeats = {}

const backgrounds = {
    "105": { //Resourceful
        "1": {
            features: [
                {
                    onUnlock: actor => actor.setSpecialtyFeature(null, "Improvisation", "technology")
                }
            ]
        }
    },
    "112": { //Persistent
        "1": {
            features: [
                {
                    onUnlock: actor => {
                        actor.setSpecialtyFeature(null, "Concentration", "determination", true);
                        actor.setSkillBoost(null, "determination", false);
                    }
                }
            ]
        }
    },
    "601": { //Magically Inclined
        "1": {
            features: [
                {
                    onUnlock: actor => {
                        actor.update({
                            system: {
                                energy: {
                                    max: actor.system.energy.max + 10
                                }
                            }
                        });
                    }
                }
            ]
        }
    }
}

const flaws = {
    "89": { //Allergy
        "1": {
            features: [
                {
                    selections: {
                        "allergy": {
                            label: "Allergic to...",
                            text: true
                        }
                    }
                }
            ]
        }
    },
    "88": { //Phobia
        "1": {
            features: [
                {
                    selections: {
                        "phobia": {
                            label: "Fear of...",
                            text: true
                        }
                    }
                }
            ]
        }
    },
    "23": { //Inattentive
        "1": {
            features: [
                {
                    onUnlock: actor => {
                        actor.update({
                            system: {
                                skills: {
                                    perception: {
                                        bonus: actor.system.skills.perception.bonus - 1
                                    }
                                },
                                passivePerception: {
                                    bonus: actor.system.passivePerception.bonus - 1
                                }
                            }
                        });
                    }
                }
            ]
        }
    }
}

export class ExtendedFeatData {

    static _featData = null;

    static getFeatData = function() {
        if (!ExtendedFeatData._featData) {
            ExtendedFeatData._featData = {
                ...generalFeats,
                ...skillFeats,
                ...backgrounds,
                ...flaws,
                ...Artificer.classFeats,
                ...Chanter.classFeats,
                ...Delver.classFeats,
                ...Guardian.classFeats,
                ...Investigator.classFeats,
                ...Magus.classFeats,
                ...Mercenary.classFeats,
                ...Ranger.classFeats,
                ...Researcher.classFeats,
                ...Scholar.classFeats,
                ...Sage.classFeats,
                ...Scholar.classFeats,
                ...Witch.classFeats
            }
        }
        return ExtendedFeatData._featData;
    }

    static getFeatDataById = function(id, tier = 1) {
        const featData = ExtendedFeatData.getFeatData();
        try {
            return featData[id.toString()][tier.toString()];
        } catch (err) {
            return undefined;
        }
    }

    static getFeatures(id, tier = 1) {
        const featData = ExtendedFeatData.getFeatDataById(id, tier);
        if (!featData) {
            return [];
        }
        return featData.features || [];
    }

    static getCustomPrerequisiteData(id, tier = 1) {
        const featData = ExtendedFeatData.getFeatDataById(id, tier);
        if (!featData) {
            return null;
        }
        return featData.prerequisite || null;
    }

    static getActions(id, tier = 1) {
        const globalData = ExtendedFeatData.getFeatData();
        const featData = globalData[id.toString()];
        if (!featData) {
            return [];
        }
        const actions = [];
        for (let t = 1; t <= tier; t++) {
            if (featData[t.toString()] && featData[t.toString()].actions) {
                actions.push(...featData[t.toString()].actions);
            }
        }
        return actions;
    }

    static getFeatActions(feat) {
        if (feat.type != "Feat") {
            return undefined;
        }
        if (!feat.system.casperObjectId) {
            return [];
        }
        return ExtendedFeatData.getActions(feat.system.casperObjectId, feat.system.currentTier);
    }
}
