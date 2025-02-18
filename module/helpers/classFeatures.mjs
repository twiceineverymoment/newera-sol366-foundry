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
import { Adventurer } from "./classes/adventurer.mjs";
export const ClassInfo = {};

ClassInfo.findFeatureSelectionByLabel = function(label) {
    for (const [i, clazz] of Object.entries(ClassInfo.features)){
        if (label.includes(i)){ //Skips iterating on the other classes
            for (const feature of clazz){
                if (feature.id && feature.selections && label.includes(feature.id)){
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

ClassInfo.getArchetypeData = function(actor) {
    const output = {};
    if (!actor.system.classes){
        return output;
    }
    for (const [className, classData] of Object.entries(actor.system.classes)){
        if (ClassInfo.archetypeSelectionLevels[className]){
            const selectedArchetypes = classData.archetype;
            if (selectedArchetypes){
                for (const [order, selection] of Object.entries(selectedArchetypes)){
                const levelThreshold = ClassInfo.archetypeSelectionLevels[className][order];
                    output[selection] = levelThreshold;
                }
            }
        }
    }
    return output;
}

// Describes the levels at which a class selects an archetype. Used to determine which features are unlocked retroactively when a new archetype is selected. Only the classes that have archetypes are included here.
ClassInfo.archetypeSelectionLevels = {
    delver: Delver.archetypeSelectionLevels,
    mercenary: Mercenary.archetypeSelectionLevels,
    ranger: Ranger.archetypeSelectionLevels,
    researcher: Researcher.archetypeSelectionLevels,
    investigator: Investigator.archetypeSelectionLevels
}

ClassInfo.hitPointIncrements = {
    delver: Delver.hitPointIncrement,
    mercenary: Mercenary.hitPointIncrement,
    ranger: Ranger.hitPointIncrement,
    researcher: Researcher.hitPointIncrement,
    investigator: Investigator.hitPointIncrement,
    scholar: Scholar.hitPointIncrement,
    artificer: Artificer.hitPointIncrement,
    sage: Sage.hitPointIncrement,
    witch: Witch.hitPointIncrement,
    adventurer: Adventurer.hitPointIncrement,
    magus: Magus.hitPointIncrement,
    chanter: Chanter.hitPointIncrement,
    guardian: Guardian.hitPointIncrement
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
    adventurer: Adventurer.classFeatures,
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
                    },
                    onChange: (actor, oldValue, newValue) => actor.setAbilityScoreImprovement(oldValue, newValue)
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
                    },
                    onChange: (actor, oldValue, newValue) => actor.setAbilityScoreImprovement(oldValue, newValue)
                }
            }
        },
        naturalSkillImprovement: {
            name: "Natural Skill Improvement",
            key: false,
            description: "Your Natural Skills each increase in level by 1.",
            onUnlock: actor => actor.improveNaturalSkills()
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