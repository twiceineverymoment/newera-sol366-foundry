import { Delver } from "./classes/delver.mjs";
import { Mercenary } from "./classes/mercenary.mjs";
import { Ranger } from "./classes/ranger.mjs";
import { Chanter } from "./classes/chanter.mjs";
import { Guardian } from "./classes/guardian.mjs";
import { Artificer } from "./classes/artificer.mjs";
import { Witch } from "./classes/witch.mjs";
import { Sage } from "./classes/sage.mjs";
import { Researcher } from "./classes/researcher.mjs";
import { Magus } from "./classes/magus.mjs";
import { Investigator } from "./classes/investigator.mjs";
import { Scholar } from "./classes/scholar.mjs";

export const ClassInfo = {};

ClassInfo.findFeatureSelectionByLabel = function(label) {
    for (const [i, clazz] of Object.entries(ClassInfo.features)){
        if (label.contains(i)){ //Skips iterating on the other classes
            for (const feature of clazz){
                if (feature.id && feature.selections && label.contains(feature.id)){
                    for (const [j, selection] of Object.entries(feature.selections)){
                        if (label == `system.classes.${feature.id}.${j}`){
                            return selection;
                        }
                    }
                }
            }
        }
    }
    return null;
}

ClassInfo.features = {
    delver: Delver.classFeatures,
    mercenary: Mercenary.classFeatures,
    ranger: Ranger.classFeatures,
    researcher: Researcher.classFeatures,
    chanter: Chanter.classFeatures,
    magus: Magus.classFeatures,
    guardian: Guardian.classFeatures,
    investigator: Investigator.classFeatures,
    scholar: Scholar.classFeatures,
    artificer: Artificer.classFeatures,
    sage: Sage.classFeatures,
    witch: Witch.classFeatures,
    adventurer: [
        {
            level: 1,
            id: "adventurer.brainsVsBrawn1",
            name: "Brains vs. Brawn",
            key: false,
            description: "<p>Choose Brains or Brawn.</p><p><b>Brains:</b> Gain a +1 class bonus to your Passive Perception, gain an additional knowledge of your choice, or increase one of your existing knowledge skills by 1 (but not higher than 5.)</p><p><b>Brawn:</b> Choose a combat-related stat and receive a +1 class bonus to it.</p>",
            selections: {
                mode: {
                    label: "Choose a Bonus",
                    options: {newKnowledge: "Brains - New Knowledge", lvlKnowledge: "Brains - Increase Existing Knowledge", perception: "Brains - Passive Perception +1", speed: "Brawn - Speed +1", initiative: "Brawn - Initiative +1", armor: "Brawn - Natural Armor +1", agility: "Brawn - Passive Agility +1"}
                }
            }
        },
        {
            level: 2,
            common: "naturalSkillImprovement"
        },
        {
            level: 3,
            common: "abilityScoreImprovement"
        }
    ],
    common: {
        abilityScoreImprovement: {
            name: "Ability Score Improvement",
            key: false,
            description: "Choose two +1 increases to your ability scores. You can choose the same score for both choices to increase it by 2, or two different scores to increase each of them by 1.",
            selections: {
                first: {
                    label: "First Choice",
                    options: {
                        strength: "Strength",
                        dexterity: "Dexterity",
                        constitution: "Constitution",
                        intelligence: "Intelligence",
                        wisdom: "Wisdom",
                        charisma: "Charisma"
                    }
                },
                second: {
                    label: "Second Choice",
                    options: {
                        strength: "Strength",
                        dexterity: "Dexterity",
                        constitution: "Constitution",
                        intelligence: "Intelligence",
                        wisdom: "Wisdom",
                        charisma: "Charisma"
                    }
                }
            }
        },
        naturalSkillImprovement: {
            name: "Natural Skill Improvement",
            key: false,
            description: "Your Natural Skills each increase in level by 1.",
        },
        learningExperience: {
            name: "Learning Experience",
            key: false,
            description: `Gain 1 level in one of your Knowledge skills, or a new one of your choice.
            <br /><i>(To gain a new knowledge, add it to your character sheet and then choose it here.)</i>`,
            dynamicSelections: actor => actor.getLearningExperienceOptions()
        },
        specialtyImprovement: {
            name: "Specialty Improvement",
            key: false,
            description: `Choose one of your specialties and increase its level by 1. If you don't have any specialties that can be increased, you may gain a new specialty of your choice at the GM's discretion.
            <br /><i>(To gain a new specialty, add it to your character sheet and then choose it here.)</i>`,
            dynamicSelections: actor => actor.getSpecialtyImprovementOptions()
        }
    },
}