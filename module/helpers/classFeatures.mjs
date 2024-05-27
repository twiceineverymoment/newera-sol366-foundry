import { NEWERA } from "./config.mjs";

import { Delver } from "./classes/delver.mjs";
import { Mercenary } from "./classes/mercenary.mjs";
import { Ranger } from "./classes/ranger.mjs";
import { Chanter } from "./classes/chanter.mjs";
import { Guardian } from "./classes/guardian.mjs";
import { Artificer } from "./classes/artificer.mjs";
import { Witch } from "./classes/witch.mjs";

import { SpellPreparation } from "../sheets/spell-preparation.mjs";
import { SpellFocus } from "../sheets/spell-focus.mjs";
import { ChantSheet } from "../sheets/chants.mjs";
import { DarkEnergySheet } from "../sheets/dark-energy.mjs";
import { SpellBrowser } from "../sheets/spell-browser.mjs";
import { SpellSearchParams } from "../schemas/spell-search-params.mjs";

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
    delver: [
        {
            level: 1,
            name: "Delver Specialties",
            key: false,
            description: "You gain 1 level in the Sight (Perception) and Climbing (Athletics) specialties."
        },
        {
            level: 1,
            id: "delver.naturalSkills",
            name: "Delver Natural Skills",
            key: false,
            description: "Choose two Natural Skills from the options below.",
            selections: {
                "1": {
                    label: "First Choice",
                    type: "String",
                    options: {
                        agility: "Agility", athletics: "Athletics", perception: "Perception", stealth: "Stealth", instinct: "Instinct", "sleight-of-hand": "Sleight of Hand", "elemental-magic": "Elemental Magic"
                    },
                    onChange: (actor, from, to) => actor.updateNaturalSkill(from, to)
                },
                "2": {
                    label: "Second Choice",
                    type: "String",
                    options: {
                        agility: "Agility", athletics: "Athletics", perception: "Perception", stealth: "Stealth", instinct: "Instinct", "sleight-of-hand": "Sleight of Hand", "elemental-magic": "Elemental Magic"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Immense Energy",
            key: true,
            description: "Your maximum energy increases with your level according to the Delver table. You recover energy during short rests at double the usual rate.",
            tableValues: [
                {
                    field: "immenseEnergy",
                    label: "Maximum Energy",
                    sign: false,
                    values: [null, 24, 27, 30, 40, 41, 42, 43, 64, 67, 70, 72, 92, 95, 98, 128]
                }
            ]
        },
        {
            level: 1,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Delver table.</p>
            <div class="magic-info">
                <h4>3 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.delver",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5]
                }
            ]
        },
        {
            level: 1,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Delver spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
        },
        {
            level: 2,
            common: "naturalSkillImprovement"
        },
        {
            level: 2,
            common: "learningExperience"
        },
        {
            level: 3,
            id: "delver.archetype",
            name: "Elemental Path",
            key: false,
            description: "<p>Choose an archetype from the options below. Your choice will shape how your spellwork improves as you level up.</p><p>Add your Proficiency Bonus to skill checks to cast Elemental spells within your element's school of magic.</p>",
            selections: {
                "1": {
                    label: "Choose an Elemental Path",
                    type: "String",
                    options: {
                        fire: `Path of Fire`,
                        water: `Path of Water`,
                        earth: `Path of Earth`,
                        wind: `Path of Wind`,
                    }
                }
            }
        },
        {
            level: 3,
            archetype: "fire",
            name: "Path of Fire",
            key: true,
            description: `<p>You focus your powers on the element of fire.</p>
            <p>Add your Proficiency Bonus to Pryomancy spell checks. Your elemental channeling powers inflict Burning damage.</p>`,
            tableValues: [
                {
                    field: "proficiencyBonus.delver.fire",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3]
                }
            ]
        },
        {
            level: 3,
            archetype: "water",
            name: "Path of Water",
            key: true,
            description: `<p>You focus your powers on the element of water.</p>
            <p>Add your Proficiency Bonus to Cryomancy spell checks. Your elemental channeling powers inflict Freezing damage.</p>`,
            tableValues: [
                {
                    field: "proficiencyBonus.delver.water",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3]
                }
            ]
        },
        {
            level: 3,
            archetype: "earth",
            name: "Path of Earth",
            key: true,
            description: `<p>You focus your powers on the element of earth.</p>
            <p>Add your Proficiency Bonus to Lithomancy spell checks. Your elemental channeling powers inflict Bludgeoning damage.</p>`,
            tableValues: [
                {
                    field: "proficiencyBonus.delver.earth",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3]
                }
            ]
        },
        {
            level: 3,
            archetype: "wind",
            name: "Path of Wind",
            key: true,
            description: `<p>You focus your powers on the element of air.</p>
            <p>Add your Proficiency Bonus to Evocation spell checks. Your elemental channeling powers inflict Shock damage.</p>`,
            tableValues: [
                {
                    field: "proficiencyBonus.delver",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3]
                }
            ]
        },
        {
            level: 4,
            archetype: "fire",
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Pyromancy spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `
        },
        {
            level: 4,
            archetype: "water",
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Cryomancy spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" />
            </div>
            `
        },
        {
            level: 4,
            archetype: "earth",
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Lithomancy spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            `
        },
        {
            level: 4,
            archetype: "wind",
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Evocation spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            `
        },
        {
            level: 4,
            common: "specialtyImprovement"
        },
        {
            level: 5,
            common: "abilityScoreImprovement"
        },
        {
            level: 6,
            common: "learningExperience"
        },
        {
            level: 6,
            id: "delver.bonus",
            name: "Delver Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "1": {
                    label: "Choose a Stat Increase",
                    options: {
                        passivePerception: "Passive Perception",
                        speed: "Speed",
                        carryWeight: "Carry Weight"
                    }
                }
            }
        },
        {
            level: 7,
            name: "Elemental Channeling",
            key: true,
            description: `<p>You've unlocked the mysterious power of Elemental Channeling - the ability to infuse elemental energy into your attacks without casting spells.</p>
                <p>You may use your Elemental Channeling on a melee attack, unarmed or with any weapon, to add your Elemental Channeling damage to the damage dealt by the attack. Doing so consumes energy equal to the elemental damage added.</p>
                <p>The type of damage your powers inflict is determined by your elemental path.</p>
            `,
            tableValues: [
                {
                   field: "elementalChannelingDmgDie",
                    label: "Elemental Damage",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, "1d4", "1d4", "1d6", "1d6", "1d8", "1d8", "1d10", "1d10", "1d12"] 
                }
            ],
            actions: [
                {
                    name: "Elemental Channeling",
                    images: {
                        base: `${NEWERA.images}/fire-punch.png`,
                        left: `${NEWERA.images}/delver.png`,
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You infuse a melee attack with elemental power.</p><p>First, make an unarmed attack or an attack with a melee weapon, then add your Elemental Channeling damage roll to the amount of damage dealt.</p>",
                    overrideMacroCommand: "game.newera.HotbarActions.elementalChanneling(null)",
                    difficulty: null,
                    actionType: "0",
                    allowed: (actor) => actor.system.energy.value > 0,
                    disallowMessage: "You're out of energy!",
                    rolls: [
                      {
                        label: "Damage",
                        die: "fire-punch",
                        callback: actor => Delver.elementalChanneling(actor, null)
                      }
                    ]
                }
            ]
        },
        {
            level: 8,
            archetype: "fire",
            name: "Invigorating Heat",
            key: false,
            description: "You recover 3 energy per frame while standing within 10 feet of a naturally-fueled fire 1 foot or larger in diameter that isn't obstructed."
        },
        {
            level: 8,
            archetype: "water",
            name: "Livegiving Water",
            key: false,
            description: "For every 8 ounces of water you drink, you can either recover hit points equal to your proficiency bonus, life points equal to twice your proficiency bonus, or energy equal to twice your proficiency bonus. This effect can't heal injuries.",
        },
        {
            level: 8,
            archetype: "earth",
            name: "Shake the Ground",
            key: false,
            description: "Whenever you succeed on a Tumble (Agility) check to avoid falling damage, your impact sends out a shockwave that staggers enemies within 20 feet for one frame. If you fell from a height of at least 20 feet, those creatures each make a Reflex save. On a failure, they take Bludgeoning damage equal to half the falling damage you would've taken and are knocked prone."
        },
        {
            level: 8,
            archetype: "wind",
            name: "Channeling Force",
            key: false,
            description: "Whenever an attack using your Elemental Channeling misses its target or is aimed at a distance, you create a shockwave that travels 30 feet and deals your Elemental Channeling damage to the first target it hits."
        },
        {
            level: 8,
            archetype: "fire",
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Pyromancy spell (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Common Delver spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 8,
            archetype: "water",
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Cryomancy spell (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Common Delver spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 8,
            archetype: "earth",
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Lithomancy spell (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Common Delver spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 8,
            archetype: "wind",
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Evocation spell (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Common Delver spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 9,
            id: "delver.bonus",
            name: "Delver Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "2": {
                    label: "Choose a Stat Increase",
                    options: {
                        passivePerception: "Passive Perception",
                        speed: "Speed",
                        carryWeight: "Carry Weight"
                    }
                }
            }
        },
        {
            level: 10,
            name: "Nature's Fury",
            key: false,
            description: "<p>You can enter <a href='https://www.newerarpg.com/srd/newera-sol366/rage'>Rage</a>, a state of heightened physical ability at the cost of reduced mental faculties.</p><p>You can enter Rage as an action during your turn, at a cost of 10 energy. Each frame you remain in Rage costs an additional 2 energy. You may end your Rage any time as a free action.</p>",
            actions: [
                {
                    name: "Rage",
                    images: {
                        base: `${NEWERA.images}/fire-dash.png`,
                        left: `${NEWERA.images}/delver.png`,
                        right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You enter Rage, a state of heightened physical and reduced mental abilities.</p><p>Your Rage consumes 10 energy upon activation, and 2 energy per frame you remain in Rage. You may end Rage any time as a free action.</p>",
                    difficulty: null,
                    actionType: "1",
                    allowed: (actor) => actor.system.energy.value >= 10,
                    disallowMessage: "You don't have enough energy to enter Rage!",
                    rolls: [
                      {
                        label: "Rage",
                        die: "fire-dash",
                        message: "{NAME} becomes enraged!",
                        difficulty: null
                      }
                    ]
                },
            ]
        },
        {
            level: 11,
            common: "abilityScoreImprovement"
        },
        {
            level: 12,
            archetype: "fire",
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Pyromancy spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Common spells of any form (Level 4 or lower)</h4>
            </div>
            `
        },
        {
            level: 12,
            archetype: "water",
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Cryomancy spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Common spells of any form (Level 4 or lower)</h4>
            </div>
            `
        },
        {
            level: 12,
            archetype: "earth",
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Lithomancy spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Common spells of any form (Level 4 or lower)</h4>
            </div>
            `
        },
        {
            level: 12,
            archetype: "wind",
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Evocation spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            <div class="magic-info">
                <h4>2 Common spells of any form (Level 4 or lower)</h4>
            </div>
            `
        },
        {
            level: 12,
            common: "learningExperience"
        },
        {
            level: 13,
            archetype: "fire",
            name: "Wild Fury",
            key: false,
            description: `<p>Whenever you enter Rage, you feel a rush of unbridled magical power. Roll a d4 on the Path of Fire Wild Fury table to determine the result.</p>`,
            actions: [
                {
                    name: "Wild Fury (Path of Fire)",
                    images: {
                        base: `${NEWERA.images}/embraced-energy.png`,
                        left: `${NEWERA.images}/delver_fire.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You feel a rush of magical power. Use this action whenever you enter Rage.</p><p>If you have multiple elemental paths, you choose which table to roll on.</p>",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Roll",
                        die: "d4",
                        callback: actor => Delver.rollWildFury(actor, "fire")
                      }
                    ]
                },
            ]
        },
        {
            level: 13,
            archetype: "water",
            name: "Wild Fury",
            key: false,
            description: `<p>Whenever you enter Rage, you feel a rush of unbridled magical power. Roll a d4 on the Path of Fire Wild Fury table to determine the result.</p>`,
            actions: [
                {
                    name: "Wild Fury (Path of Water)",
                    images: {
                        base: `${NEWERA.images}/embraced-energy.png`,
                        left: `${NEWERA.images}/delver_water.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You feel a rush of magical power. Use this action whenever you enter Rage.</p><p>If you have multiple elemental paths, you choose which table to roll on.</p>",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Roll",
                        die: "d4",
                        callback: actor => Delver.rollWildFury(actor, "water")
                      }
                    ]
                },
            ]
        },
        {
            level: 13,
            archetype: "earth",
            name: "Wild Fury",
            key: false,
            description: `<p>Whenever you enter Rage, you feel a rush of unbridled magical power. Roll a d4 on the Path of Fire Wild Fury table to determine the result.</p>`,
            actions: [
                {
                    name: "Wild Fury (Path of Earth)",
                    images: {
                        base: `${NEWERA.images}/embraced-energy.png`,
                        left: `${NEWERA.images}/delver_earth.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You feel a rush of magical power. Use this action whenever you enter Rage.</p><p>If you have multiple elemental paths, you choose which table to roll on.</p>",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Roll",
                        die: "d4",
                        callback: actor => Delver.rollWildFury(actor, "earth")
                      }
                    ]
                },
            ]
        },
        {
            level: 13,
            archetype: "wind",
            name: "Wild Fury",
            key: false,
            description: `<p>Whenever you enter Rage, you feel a rush of unbridled magical power. Roll a d4 on the Path of Fire Wild Fury table to determine the result.</p>`,
            actions: [
                {
                    name: "Wild Fury (Path of Wind)",
                    images: {
                        base: `${NEWERA.images}/embraced-energy.png`,
                        left: `${NEWERA.images}/delver_wind.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You feel a rush of magical power. Use this action whenever you enter Rage.</p><p>If you have multiple elemental paths, you choose which table to roll on.</p>",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Roll",
                        die: "d4",
                        callback: actor => Delver.rollWildFury(actor, "wind")
                      }
                    ]
                },
            ]
        },
        {
            level: 13,
            common: "specialtyImprovement"
        },
        {
            level: 14,
            id: "delver.bonus",
            name: "Delver Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "3": {
                    label: "Choose a Stat Increase",
                    options: {
                        passivePerception: "Passive Perception",
                        speed: "Speed",
                        carryWeight: "Carry Weight"
                    }
                }
            }
        },
        {
            level: 14,
            common: "naturalSkillImprovement"
        },
        {
            level: 15,
            name: "Extreme Affinity",
            key: false,
            description: `<p>Your Proficiency Bonus acts as a bonus to your Elemental Magic skill level when casting spells on your Elemental Path.</p>
            `
        },
        {
            level: 15,
            archetype: "fire",
            name: "Spell Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Pyromancy spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            <div class="magic-info">
                <h4>3 Common Delver spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 15,
            archetype: "water",
            name: "Spell Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Cryomancy spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" />
            </div>
            <div class="magic-info">
                <h4>3 Common Delver spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 15,
            archetype: "earth",
            name: "Spell Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Lithomancy spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            <div class="magic-info">
                <h4>3 Common Delver spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 15,
            archetype: "wind",
            name: "Spell Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Evocation spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            <div class="magic-info">
                <h4>3 Common Delver spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            `
        }
    ],
    mercenary: [
        {
            level: 1,
            id: "mercenary.specialties",
            name: "Mercenary Specialties",
            key: false,
            description: "Choose two of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {blocking: "Blocking (Defense)", protection: "Protection (Defense)", swordsOneHanded: "Swords (One-Handed)", swordsTwoHanded: "Swords (Two-Handed)", axes: "Axes", bluntWeapons: "Blunt Weapons"}
                },
                "2": {
                    label: "Specialty #2",
                    options: {blocking: "Blocking (Defense)", protection: "Protection (Defense)", swordsOneHanded: "Swords (One-Handed)", swordsTwoHanded: "Swords (Two-Handed)", axes: "Axes", bluntWeapons: "Blunt Weapons"}
                }
            }
        },
        {
            level: 1,
            id: "mercenary.naturalSkills",
            name: "Mercenary Natural Skills",
            key: false,
            description: "Choose three of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {defense: "Defense", "two-handed": "Two-Handed", athletics: "Athletics", "one-handed": "One-Handed", intimidation: "Intimidation", instinct: "Instinct", endurance: "Endurance", determination: "Determination"}
                },
                "2": {
                    label: "Second Choice",
                    options: {defense: "Defense", "two-handed": "Two-Handed", athletics: "Athletics", "one-handed": "One-Handed", intimidation: "Intimidation", instinct: "Instinct", endurance: "Endurance", determination: "Determination"}
                },
                "3": {
                    label: "Third Choice",
                    options: {defense: "Defense", "two-handed": "Two-Handed", athletics: "Athletics", "one-handed": "One-Handed", intimidation: "Intimidation", instinct: "Instinct", endurance: "Endurance", determination: "Determination"}
                }
            }
        },
        {
            level: 1,
            name: "Rage",
            key: true,
            description: "<p>You can enter <a href='https://www.newerarpg.com/srd/newera-sol366/rage'>Rage</a>, a state of heightened physical ability at the cost of reduced mental faculties.</p><p>You can enter Rage as an action during your turn, up to a number of times per day determined by the Mercenary table.</p><p>Rage lasts until the end of combat, or the end of your turn if you did not attack during that turn.</p>",
            actions: [
                {
                    name: "Rage",
                    images: {
                        base: `${NEWERA.images}/fire-dash.png`,
                        left: `${NEWERA.images}/mercenary.png`,
                        right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You enter Rage, a state of heightened physical and reduced mental abilities.</p>",
                    difficulty: null,
                    actionType: "1",
                    allowed: (actor) => {

                    },
                    disallowMessage: "You have no more Rage uses left. Get some rest to replenish them.",
                    overrideMacroCommand: "game.newera.HotbarActions.rage()",
                    rolls: [
                      {
                        label: "Rage",
                        die: "fire-dash",
                        callback: actor => Mercenary.rage(actor)
                      }
                    ]
                },
            ],
            tableValues: [
                {
                    field: "rage",
                    label: "Rage Uses Per Day",
                    sign: false,
                    values: [null, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4]
                }
            ]
        },
        {
            level: 2,
            common: "abilityScoreImprovement"
        },
        {
            level: 3,
            common: "naturalSkillImprovement"
        },
        {
            level: 3,
            name: "Specialty Improvement",
            key: false,
            description: "Choose one of your specialties and increase its level by 1. If you don't have any specialties that can be increased, you may gain a new specialty of your choice at the GM's discretion.",
        },
        {
            level: 4,
            id: "mercenary.archetype",
            name: "Mercenary Archetype",
            key: false,
            description: "<p>Choose an Archetype. Your choice shapes your mastery of combat as you level up.</p><p>Add your Proficiency Bonus to attack rolls using your archetype's preferred weaponry. Your proficiency bonus increases with level according to the Mercenary table.",
            selections: {
                "1": {
                    label: "Choose an Archetype",
                    options: {raider: "Raider", enforcer: "Enforcer", woodsman: "Woodsman", warrior: "Warrior"}
                }
            }
        },
        {
            level: 4,
            archetype: "raider",
            name: "Raider Archetype",
            key: true,
            description: "Add your proficiency bonus to one-handed attack checks with swords, and to Block and Protect Ally checks using shields. One-handed sword attacks deal additional damage equal to your Proficiency Damage Bonus.",
            tableValues: [
                {
                    field: "proficiencyBonus.mercenary.raider",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4]
                },
                {
                    field: "proficiencyDamageBonus.raider",
                    label: "Proficiency Damage Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
                }
            ]
        },
        {
            level: 4,
            archetype: "enforcer",
            name: "Enforcer Archetype",
            key: true,
            description: "Add your proficiency bonus to attack rolls with a Baton, Club, Crowbar, Hammer, Sledgehammer, or improvised blunt weapon. These weapons deal additional damage equal to your Proficiency Damage Bonus.",
            tableValues: [
                {
                    field: "proficiencyBonus.mercenary.enforcer",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4]
                },
                {
                    field: "proficiencyDamageBonus.enforcer",
                    label: "Proficiency Damage Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
                }
            ]
        },
        {
            level: 4,
            archetype: "woodsman",
            name: "Woodsman Archetype",
            key: true,
            description: "Add your proficiency bonus to one-handed attack checks with Hatchets, Axes, and Battle Axes. These attacks deal additional damage equal to your Proficiency Damage Bonus.",
            tableValues: [
                {
                    field: "proficiencyBonus.mercenary.woodsman",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4]
                },
                {
                    field: "proficiencyDamageBonus.woodsman",
                    label: "Proficiency Damage Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
                }
            ]
        },
        {
            level: 4,
            archetype: "warrior",
            name: "Warrior Archetype",
            key: true,
            description: "Add your proficiency bonus to two-handed attack checks with any weapon. Two-handed attacks deal additional damage equal to your Proficiency Damage Bonus.",
            tableValues: [
                {
                    field: "proficiencyBonus.mercenary.warrior",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4]
                },
                {
                    field: "proficiencyDamageBonus.warrior",
                    label: "Proficiency Damage Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]
                }
            ]
        },
        {
            level: 5,
            common: "learningExperience"
        },
        {
            level: 5,
            id: "mercenary.bonus",
            name: "Mercenary Bonus",
            key: false,
            description: "You gain a +1 class bonus to your Natural Armor. Choose one of the following bonuses.",
            selections: {
                "1": {
                    label: "Choose a Bonus",
                    options: {speed: "+1 Speed", initiative: "+1 Initiative Modifier", specialty: "Specialty Improvement"}
                }
            }
        },
        {
            level: 6,
            common: "abilityScoreImprovement"
        },
        {
            level: 7,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Delver table.</p>
            <div class="magic-info">
                <h4>2 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.mercenary",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3]
                }
            ]
        },
        {
            level: 7,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Common Mercenary spell (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" data-tooltip="Lithomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" data-tooltip="Anjuration" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 8,
            archetype: "raider",
            key: false,
            name: "Protector",
            description: "Shields you use gain a +3 bonus to their Shield Rating."
        },
        {
            level: 8,
            archetype: "enforcer",
            key: false,
            name: "Reckless Attack",
            description: "When you make your first attack during your turn, you can choose to attack recklessly. Doing so gives you advantage on all attacks during your turn, but causes your Passive Agility to be reduced to 0 until the start of your next turn. (Any attacks against you automatically hit unless you use a reaction to Dodge or Block.)",
            actions: [
                {
                    name: "Reckless Attack",
                    images: {
                        base: `${NEWERA.images}/hammer-drop.png`,
                        left: `${NEWERA.images}/mercenary_enforcer.png`,
                        right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You attack recklessly this turn.</p><p>All attacks you attempt this turn have advantage to hit, but your passive agility becomes 0 until your next turn.</p>",
                    overrideMacroCommand: "game.newera.HotbarActions.recklessAttack()",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Activate",
                        die: "hammer-drop",
                        callback: (actor) => Mercenary.recklessAttack(actor)
                      }
                    ]
                }
            ]
        },
        {
            level: 8,
            archetype: "woodsman",
            key: false,
            name: "Danger Sense",
            description: `<p>While adventuring, you and all companions travelling with you have advantage on  Reflex saves and  Instinct skill checks. In  combat, you have advantage on initiative rolls.`
        },
        {
            level: 8,
            archetype: "warrior",
            key: false,
            name: "Armor Proficiency",
            description: "Add your proficiency bonus to the armor rating of equipped armor items you're wearing."
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 10,
            key: false,
            name: "Defensive Fighter",
            description: "While Raging, you can move up to twice your speed to Protect an Ally. Your Rage doesn't end if you Blocked an attack or Protected an Ally during your turn."
        },
        {
            level: 11,
            common: "specialtyImprovement"
        },
        {
            level: 11,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Mercenary spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" data-tooltip="Lithomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" data-tooltip="Anjuration" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 12,
            name: "Combat Expert",
            key: false,
            description: "Your Turn Length increases by 1 frame and 1 reaction frame."
        },
        {
            level: 13,
            common: "abilityScoreImprovement"
        },
        {
            level: 14,
            common: "naturalSkillImprovement"
        },
        {
            level: 14,
            id: "mercenary.bonus",
            name: "Mercenary Bonus",
            key: false,
            description: "You gain a +1 class bonus to your Natural Armor. Choose one of the following bonuses.",
            selections: {
                "2": {
                    label: "Choose a Bonus",
                    options: {speed: "+1 Speed", initiative: "+1 Initiative Modifier", specialty: "Specialty Improvement"}
                }
            }
        },
        {
            level: 15,
            archetype: "raider",
            name: "Flanking",
            key: false,
            description: `<p>You and an ally can flank enemies to gain advantage on your attacks.</p>
            <p>An enemy is flanked whenever you and an ally are positioned within reach of it on opposite sides. Attacks against flanked enemies have advantage.</p>`
        },
        {
            level: 15,
            archetype: "enforcer",
            name: "Juggernaut",
            key: false,
            description: `<p>While Raging, you have Resistance 2 against physical damage (Piercing, Bludgeoning, and Slashing.)`
        },
        {
            level: 15,
            archetype: "woodsman",
            name: "Shield-Breaker",
            key: false,
            description: `<p>Your two-handed attacks with axes or battle-axes always cause armor to take a durability check.</p>
            <p>If these attacks hit a shield, excess damage is dealt to the target and the shield always takes a durability check.</p>`
        },
        {
            level: 15,
            archetype: "warrior",
            name: "Focused Attack",
            key: false,
            description: `<p>On a hit, the target makes an Endurance save with difficulty equal to your current Mercenary level. On a failure, all attacks against that target have advantage until your next turn.</p>`
        },
        {
            level: 15,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Mercenary spell (Level 3 or lower)</h4>
                <h4>2 Common Mercenary spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" data-tooltip="Lithomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" data-tooltip="Anjuration" data-tooltip-direction="UP" />
            </div>
            `
        }
    ],
    ranger: [
        {
            level: 1,
            id: "ranger.specialties",
            name: "Ranger Specialties",
            key: false,
            description: "Choose 3 of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {navigation: "Navigation (Instinct)", tracking: "Tracking (Instinct)", "animal-handling": "Animal Handling (Instinct)", time: "Time (Instinct)", weather: "Weather (Instinct)", archery: "Archery (Marksmanship)", crossbow: "Crossbows (Marksmanship)", rifle: "Rifles (Marksmanship)", crafting: "Crafting (Marksmanship)", cooking: "Cooking (Technology)", alchemy: "Alchemy (Technology)", climbing: "Climbing (Athletics)", swimming: "Swimming (Athletics)"}
                },
                "2": {
                    label: "Specialty #2",
                    options: {navigation: "Navigation (Instinct)", tracking: "Tracking (Instinct)", "animal-handling": "Animal Handling (Instinct)", time: "Time (Instinct)", weather: "Weather (Instinct)", archery: "Archery (Marksmanship)", crossbow: "Crossbows (Marksmanship)", rifle: "Rifles (Marksmanship)", crafting: "Crafting (Marksmanship)", cooking: "Cooking (Technology)", alchemy: "Alchemy (Technology)", climbing: "Climbing (Athletics)", swimming: "Swimming (Athletics)"}
                },
                "3": {
                    label: "Specialty #3",
                    options: {navigation: "Navigation (Instinct)", tracking: "Tracking (Instinct)", "animal-handling": "Animal Handling (Instinct)", time: "Time (Instinct)", weather: "Weather (Instinct)", archery: "Archery (Marksmanship)", crossbow: "Crossbows (Marksmanship)", rifle: "Rifles (Marksmanship)", crafting: "Crafting (Marksmanship)", cooking: "Cooking (Technology)", alchemy: "Alchemy (Technology)", climbing: "Climbing (Athletics)", swimming: "Swimming (Athletics)"}
                }
            }
        },
        {
            level: 1,
            id: "ranger.naturalSkills",
            name: "Ranger Natural Skills",
            key: false,
            description: "Choose 3 of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {instinct: "Instinct", agility: "Agility", marksmanship: "Marksmanship", perception: "Perception", medicine: "Medicine", technology: "Technology", "two-handed": "Two-Handed", endurance: "Endurance"}
                },
                "2": {
                    label: "Second Choice",
                    options: {instinct: "Instinct", agility: "Agility", marksmanship: "Marksmanship", perception: "Perception", medicine: "Medicine", technology: "Technology", "two-handed": "Two-Handed", endurance: "Endurance"}
                },
                "3": {
                    label: "Third Choice",
                    options: {instinct: "Instinct", agility: "Agility", marksmanship: "Marksmanship", perception: "Perception", medicine: "Medicine", technology: "Technology", "two-handed": "Two-Handed", endurance: "Endurance"}
                }
            }
        },
        {
            level: 1,
            id: "ranger.archetype",
            name: "Survivalist",
            key: false,
            description: "You're used to living outdoors and dealing with harsh climates. Choose a Survivalist archetype and gain its benefits.",
            selections: {
                "1": {
                    label: "Choose an Archetype",
                    options: {mountaineer: "Mountaineer", polar: "Polar Explorer", desert: "Desert Explorer", rainforest: "Rainforest Explorer", hiker: "Hiker", diver: "Diver", spelunker: "Spelunker", urbex: "Urban Explorer"}
                }
            }
        },
        {
            level: 1,
            archetype: "mountaineer",
            key: true,
            name: "Mountaineer",
            description: "The effects of High Winds on you and ranged attacks you attempt are reduced by one level."
        },
        {
            level: 1,
            archetype: "polar",
            key: true,
            name: "Polar Explorer",
            description: "You have Extreme Cold Resistance 1."
        },
        {
            level: 1,
            archetype: "desert",
            key: true,
            name: "Desert Explorer",
            description: "You have Extreme Heat Resistance 1."
        },
        {
            level: 1,
            archetype: "rainforest",
            key: true,
            name: "Rainforest Explorer",
            description: "Your sight isn't affected by rainfall, and you have advantage on saves against diseases."
        },
        {
            level: 1,
            archetype: "hiker",
            key: true,
            name: "Hiker",
            description: "You aren't affected by hazardous terrain."
        },
        {
            level: 1,
            archetype: "diver",
            key: true,
            name: "Diver",
            description: "The difficulty of your Hold Breath action starts at 5 instead of 10."
        },
        {
            level: 1,
            archetype: "spelunker",
            key: true,
            name: "Spelunker",
            description: "You have Dark Vision 1."
        },
        {
            level: 1,
            archetype: "urbex",
            key: true,
            name: "Urban Explorer",
            description: "You can Climb at your full speed."
        },
        {
            level: 1,
            name: "Firearms License",
            key: false,
            description: "If you start a leveled campaign as a Ranger, you have a Class I firearms license. If you start at level 10 or above, your license is Class II."
        },
        {
            level: 2,
            name: "Specialty Improvement",
            key: false,
            description: "Choose one of your specialties and increase its level by 1. If you don't have any specialties that can be increased, you may gain a new specialty of your choice at the GM's discretion.",
        },
        {
            level: 3,
            name: "Hunter's Focus",
            key: true,
            description: "<p>As a Ranger, you use your hunting experience to focus your attacks on one creature at a time. Starting at Level 3, you can mark one creature you can see as your Prey. You must be able to sense the creature by sight, hearing, or smell, or be tracking it, in order to mark it as your Prey.</p><p>Add your current Prey Bonus to skill checks to attack, track, or percieve the creature marked as your Prey. You can only have one creature as your prey at a time. You can't change your Prey designation during combat unless you don't currently have one (or your current Prey has died.)</p>",
            actions: [
                {
                    name: "Mark Prey",
                    images: {
                        base: `${NEWERA.images}/human-target.png`,
                        left: `${NEWERA.images}/ranger.png`,
                        right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "You mark a creature you can see as your Prey. Use this action during combat only if you don't currently have a living target marked as Prey.",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Mark",
                        die: "human-target",
                        message: "{NAME} marks a new target as {d} prey!",
                        difficulty: null
                      }
                    ]
                }
            ],
            tableValues: [
                {
                    field: "preyBonus",
                    label: "Prey Bonus",
                    sign: true,
                    values: [null, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5]
                }
            ]
        },
        {
            level: 4,
            common: "abilityScoreImprovement"
        },
        {
            level: 5,
            common: "naturalSkillImprovement"
        },
        {
            level: 5,
            common: "learningExperience"
        },
        {
            level: 6,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Delver table.</p>
            <div class="magic-info">
                <h4>2 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.ranger",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3]
                }
            ]
        },
        {
            level: 6,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Ranger spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 7,
            name: "Deadeye",
            key: true,
            description: `<p>You can Take Aim for up to five frames before firing a shot with any ranged weapon or spell.</p>
            <p>Each frame adds +2 to your attack roll and increases the damage according to the Ranger table.</p>
            <p>You're preoccupied while Taking Aim.</p>`,
            tableValues: [
                {
                    field: "deadeyeDamage",
                    label: "Damage per Frame",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 4, 4]
                }
            ],
            actions: [
                {
                    name: "Take Aim",
                    images: {
                        base: `${NEWERA.images}/human-target.png`,
                        left: `${NEWERA.images}/ranger.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "You spend up to five frames Taking Aim at a target before a ranged attack. Each frame adds +2 to your attack roll and increases the attack damage by your Deadeye Damage.",
                    difficulty: null,
                    actionType: "?",
                    rolls: [
                      {
                        label: "Take Aim",
                        die: "human-target",
                        id: "takeAim"
                      }
                    ]
                }
            ]
        },
        {
            level: 8,
            id: "ranger.specialties",
            name: "Ranger Specialty",
            key: false,
            description: "Choose an additional Specialty.",
            selections: {
                "4": {
                    label: "Specialty #4",
                    options: {navigation: "Navigation (Instinct)", tracking: "Tracking (Instinct)", "animal-handling": "Animal Handling (Instinct)", time: "Time (Instinct)", weather: "Weather (Instinct)", archery: "Archery (Marksmanship)", crossbow: "Crossbows (Marksmanship)", rifle: "Rifles (Marksmanship)", crafting: "Crafting (Marksmanship)", cooking: "Cooking (Technology)", alchemy: "Alchemy (Technology)", climbing: "Climbing (Athletics)", swimming: "Swimming (Athletics)"}
                }
            }
        },
        {
            level: 8,
            common: "specialtyImprovement"
        },
        {
            level: 9,
            common: "abilityScoreImprovement"
        },
        {
            level: 9,
            id: "ranger.bonus",
            name: "Ranger Bonus",
            key: false,
            description: "Choose one of the following bonuses.",
            selections: {
                "1": {
                    label: "Choose a Bonus",
                    options: {
                        "passivePerception": "+1 Passive Perception",
                        "carryWeight": "+1 Carry Weight",
                        "increase": "Increase Natural Skill, Knowledge, or Specialty"
                    }
                }
            }
        },
        {
            level: 10,
            common: "learningExperience"
        },
        {
            level: 10,
            key: false,
            name: "Team Player",
            description: `<p>Whenever you succeed on an Athletics or Agility check during  adventuring, your allies have advantage on the same check to attempt the same action for the next five minutes.</p>
            <p>Whenever you assist an ally on an Athletics or Agility check, you can't roll lower than 10.</p>`
        },
        {
            level: 11,
            common: "naturalSkillImprovement"
        },
        {
            level: 11,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Ranger spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 12,
            archetype: "mountaineer",
            name: "Expert Climber",
            key: false,
            description: `<p>You climb at your full speed instead of half speed.</p><p>Gain 1 level in the Climbing (Athletics) specialty.</p>`
        },
        {
            level: 12,
            archetype: "polar",
            name: "Cold Never Bothered Me",
            key: false,
            description: `<p>You have Resistance 1 to Freezing damage, and advantage on saves against Cryomancy spells.</p>`
        },
        {
            level: 12,
            archetype: "desert",
            name: "Brave the Elements",
            key: false,
            description: `<p>Effects of Exhaustion on you are reduced by 1 level.</p>`
        },
        {
            level: 12,
            archetype: "rainforest",
            name: "Wild Traveler",
            key: false,
            description: `<p>You aren't slowed down by slippery or hazardous terrain.</p>`
        },
        {
            level: 12,
            archetype: "hiker",
            name: "Poison Resistance",
            key: false,
            description: `<p>You have Poison Resistance 1.</p>`
        },
        {
            level: 12,
            archetype: "diver",
            name: "Swim Speed",
            key: false,
            description: `<p>You swim at your full speed instead of half speed.</p><p>Gain 1 level in the Swimming (Athletics) specialty.</p>`
        },
        {
            level: 12,
            archetype: "spelunker",
            name: "Tight Fit",
            key: false,
            description: `<p>You can trivially enter any space large enough to fit a creature 2 sizes smaller than you.</p>`
        },
        {
            level: 12,
            archetype: "urban",
            name: "Stealthy Exploration",
            key: false,
            description: `<p>Gain 1 level in the Climbing (Athletics), Stealth Actions (Stealth), and Lockpicking (Sleight of Hand) specialties.</p>`
        },
        {
            level: 12,
            common: "specialtyImprovement"
        },
        {
            level: 13,
            common: "abilityScoreImprovement"
        },
        {
            level: 14,
            id: "ranger.specialties",
            name: "Ranger Specialty",
            key: false,
            description: "Choose an additional Specialty.",
            selections: {
                "5": {
                    label: "Specialty #5",
                    options: {navigation: "Navigation (Instinct)", tracking: "Tracking (Instinct)", "animal-handling": "Animal Handling (Instinct)", time: "Time (Instinct)", weather: "Weather (Instinct)", archery: "Archery (Marksmanship)", crossbow: "Crossbows (Marksmanship)", rifle: "Rifles (Marksmanship)", crafting: "Crafting (Marksmanship)", cooking: "Cooking (Technology)", alchemy: "Alchemy (Technology)", climbing: "Climbing (Athletics)", swimming: "Swimming (Athletics)"}
                }
            }
        },
        {
            level: 14,
            name: "Primal Magic",
            key: false,
            description: `<p>Whenever you attempt a check using any natural skill, knowledge, or specialty, you may spend up to 10 energy on your Primal Magic sense.</p>
            <p>Every 2 energy spent adds a +1 magic bonus to the outcome.</p>`
        },
        {
            level: 15,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Ranger spell (Level 3 or lower)</h4>
                <h4>3 Common Ranger spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 15,
            common: "learningExperience"
        },
        {
            level: 15,
            id: "ranger.bonus",
            name: "Ranger Bonus",
            key: false,
            description: "Choose one of the following bonuses.",
            selections: {
                "2": {
                    label: "Choose a Bonus",
                    options: {
                        "passivePerception": "+1 Passive Perception",
                        "carryWeight": "+1 Carry Weight",
                        "increase": "Increase Natural Skill, Knowledge, or Specialty"
                    }
                }
            }
        }
    ],
    researcher: [
        {
            level: 1,
            id: "researcher.naturalSkills",
            name: "Researcher Natural Skills",
            key: false,
            description: "Choose 2 of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {insight: "Insight", determination: "Determination", logic: "Logic", diplomacy: "Diplomacy", marksmanship: "Marksmanship"}
                },
                "2": {
                    label: "Second Choice",
                    options: {insight: "Insight", determination: "Determination", logic: "Logic", diplomacy: "Diplomacy", marksmanship: "Marksmanship"}
                }
            }
        },
        {
            level: 1,
            name: "Knowledge Bonus",
            key: false,
            description: "You gain one new Knowledge of your choice."
        },
        {
            level: 1,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Researcher table.</p>
            <div class="magic-info">
                <h4>4 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="Spectral" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="Temporal" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.researcher",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4]
                }
            ]
        },
        {
            level: 1,
            name: "General Spell Studies",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>5 Common spells of any school (Level 1)</h4>
            </div>
            `
        },
        {
            level: 2,
            id: "researcher.archetype",
            name: "Research Major",
            key: true,
            description: "<p>Researchers devote most of their time to a single school of magic. You gain your major's form of magic as a natural skill. Add your proficiency bonus to cast and attack with spells in your major school.</p>",
            selections: {
                "1": {
                    label: "Research Major",
                    options: {pyromancy: "Pyromancer", cryomancy: "Cryomancer", lithomancy: "Lithomancer", evocation: "Evoker", restoration: "Healer", abjuration: "Abjurer", banishment: "Banisher", physiomancy: "Physiomancer", conjuration: "Conjurer", transmutation: "Transmuter", illusion: "Illusionist", hypnotism: "Hypnotist", divination: "Diviner", sangromancy: "Sangromancer*", summoning: "Summoner*", necromancy: "Necromancer*", apparition: "Apparator*", chronomancy: "Chronomancer*"}
                }
            },
            tableValues: [
                {
                    field: "proficiencyBonus.researcher.primary",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3]
                }
            ]
        },
        {
            level: 2,
            archetype: "pyromancy",
            name: "Pyromancer",
            key: true,
            description: "You study the school of Pyromancy. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "pyromancy",
            name: "Spell Studies (1<sup>st</sup> Level Pyromancy)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Pyromancy spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "cryomancy",
            name: "Cryomancer",
            key: true,
            description: "You study the school of Cryomancy. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "cryomancy",
            name: "Spell Studies (1<sup>st</sup> Level Cryomancy)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Cryomancy spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" data-tooltip="Cryomancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "lithomancy",
            name: "Lithomancer",
            key: true,
            description: "You study the school of Lithomancy. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "lithomancy",
            name: "Spell Studies (1<sup>st</sup> Level Lithomancy)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Lithomancy spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" data-tooltip="Lithomancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "evocation",
            name: "Evoker",
            key: true,
            description: "You study the school of Evocation. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "evocation",
            name: "Spell Studies (1<sup>st</sup> Level Evocation)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Evocation spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "restoration",
            name: "Healer",
            key: true,
            description: "You study the school of Restoration. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "restoration",
            name: "Spell Studies (1<sup>st</sup> Level Restoration)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Restoration spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "abjuration",
            name: "Abjurer",
            key: true,
            description: "You study the school of Abjuration. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "abjuration",
            name: "Spell Studies (1<sup>st</sup> Level Abjuration)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Abjuration spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "banishment",
            name: "Banisher",
            key: true,
            description: "You study the school of Banishment. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "banishment",
            name: "Spell Studies (1<sup>st</sup> Level Banishment)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Banishment spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "physiomancy",
            name: "Physiomancer",
            key: true,
            description: "You study the school of Physiomancy. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "physiomancy",
            name: "Spell Studies (1<sup>st</sup> Level Physiomancy)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Physiomancy spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "transmutation",
            name: "Transmuter",
            key: true,
            description: "You study the school of Transmutation. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "transmutation",
            name: "Spell Studies (1<sup>st</sup> Level Transmutation)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Transmutation spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "conjuration",
            name: "Conjurer",
            key: true,
            description: "You study the school of Conjuration. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "conjuration",
            name: "Spell Studies (1<sup>st</sup> Level Conjuration)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Conjuration spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "illusion",
            name: "Illusionist",
            key: true,
            description: "You study the school of Illusion. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "illusion",
            name: "Spell Studies (1<sup>st</sup> Level Illusion)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Illusion spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "divination",
            name: "Diviner",
            key: true,
            description: "You study the school of Divination. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "divination",
            name: "Spell Studies (1<sup>st</sup> Level Divination)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Divination spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divination.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "hypnotism",
            name: "Hypnotist",
            key: true,
            description: "You study the school of Hypnotism. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "hypnotism",
            name: "Spell Studies (1<sup>st</sup> Level Hypnotism)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Hypnotism spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "sangromancy",
            name: "Sancromancer",
            key: true,
            description: "You study the school of Sangromancy. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "sangromancy",
            name: "Spell Studies (1<sup>st</sup> Level Sangromancy)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <div class="magic-info">
                <h4>All Common Sangromancy spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "summoning",
            name: "Summoner",
            key: true,
            description: "You study the school of Summoning. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "summoning",
            name: "Spell Studies (1<sup>st</sup> Level Summoning)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p><b>Restricted Spells: </b>As a practitioner of a controlled school of magic, you can choose Restricted spells from the Spell Study Guide.</p>
            <div class="magic-info">
                <h4>All Common Summoning spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/summoning.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "necromancy",
            name: "Necromancer",
            key: true,
            description: "You study the school of Necromancy. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "necromancy",
            name: "Spell Studies (1<sup>st</sup> Level Necromancy)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p><b>Restricted Spells: </b>As a practitioner of a controlled school of magic, you can choose Restricted spells from the Spell Study Guide.</p>
            <div class="magic-info">
                <h4>All Common Necromancy spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/necromancy.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "apparition",
            name: "Apparator",
            key: true,
            description: "You study the school of Apparition. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "apparition",
            name: "Spell Studies (1<sup>st</sup> Level Apparition)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p><b>Restricted Spells: </b>As a practitioner of a controlled school of magic, you can choose Restricted spells from the Spell Study Guide.</p>
            <div class="magic-info">
                <h4>All Common Apparition spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/apparition.png" />
            </div>
            `
        },
        {
            level: 2,
            archetype: "chronomancy",
            name: "Chronomancer",
            key: true,
            description: "You study the school of Chronomancy. Add your Proficiency Bonus to spellcasting skill checks in your major.",
        },
        {
            level: 2,
            archetype: "chronomancy",
            name: "Spell Studies (1<sup>st</sup> Level Chronomancy)",
            key: false,
            description: `<p>After choosing your Research Major, you learn all level 1 common spells from that school on the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p><b>Restricted Spells: </b>As a practitioner of a controlled school of magic, you can choose Restricted spells from the Spell Study Guide.</p>
            <div class="magic-info">
                <h4>All Common Chronomancy spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/chronomancy.png" />
            </div>
            `
        },
        {
            level: 2,
            common: "specialtyImprovement"
        },
        {
            level: 3,
            common: "naturalSkillImprovement"
        },
        {
            level: 4,
            common: "learningExperience"
        },
        {
            level: 4,
            archetype: "pyromancy",
            name: "Spell Studies (2<sup>nd</sup> Level Pyromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Pyromancy Spells (Level 2)</h4>
                <h4>2 Other Common Elemental Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "cryomancy",
            name: "Spell Studies (2<sup>nd</sup> Level Cryomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Cryomancy Spells (Level 2)</h4>
                <h4>2 Other Common Elemental Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "lithomancy",
            name: "Spell Studies (2<sup>nd</sup> Level Lithomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Lithomancy Spells (Level 2)</h4>
                <h4>2 Other Common Elemental Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "evocation",
            name: "Spell Studies (2<sup>nd</sup> Level Evocation)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Evocation Spells (Level 2)</h4>
                <h4>2 Other Common Elemental Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "restoration",
            name: "Spell Studies (2<sup>nd</sup> Level Restoration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Restoration Spells (Level 2)</h4>
                <h4>2 Other Common Divine Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "abjuration",
            name: "Spell Studies (2<sup>nd</sup> Level Abjuration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Abjuration Spells (Level 2)</h4>
                <h4>2 Other Common Divine Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "banishment",
            name: "Spell Studies (2<sup>nd</sup> Level Banishment)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Banishment Spells (Level 2)</h4>
                <h4>2 Other Common Divine Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "physiomancy",
            name: "Spell Studies (2<sup>nd</sup> Level Physiomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Physiomancy Spells (Level 2)</h4>
                <h4>2 Other Common Physical Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "transmutation",
            name: "Spell Studies (2<sup>nd</sup> Level Transmutation)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Transmutation Spells (Level 2)</h4>
                <h4>2 Other Common Physical Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "conjuration",
            name: "Spell Studies (2<sup>nd</sup> Level Conjuration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Conjuration Spells (Level 2)</h4>
                <h4>2 Other Common Physical Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "illusion",
            name: "Spell Studies (2<sup>nd</sup> Level Illusion)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Illusion Spells (Level 2)</h4>
                <h4>2 Other Common Psionic Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "divination",
            name: "Spell Studies (2<sup>nd</sup> Level Divination)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Divination Spells (Level 2)</h4>
                <h4>2 Other Common Psionic Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divination.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "hypnotism",
            name: "Spell Studies (2<sup>nd</sup> Level Hypnotism)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Hypnotism Spells (Level 2)</h4>
                <h4>2 Other Common Psionic Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "sangromancy",
            name: "Spell Studies (2<sup>nd</sup> Level Sangromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Sangromancy Spells (Level 2)</h4>
                <h4>2 Other Common Spectral Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "summoning",
            name: "Spell Studies (2<sup>nd</sup> Level Summoning)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Summoning Spells (Level 2)</h4>
                <h4>2 Other Common Spectral Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/summoning.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "necromancy",
            name: "Spell Studies (2<sup>nd</sup> Level Necromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Necromancy Spells (Level 2)</h4>
                <h4>2 Other Common Spectral Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/necromancy.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "apparition",
            name: "Spell Studies (2<sup>nd</sup> Level Apparition)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Apparition Spells (Level 2)</h4>
                <h4>2 Other Common Temporal Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/apparition.png" />
            </div>
            `
},
{
            level: 4,
            archetype: "chronomancy",
            name: "Spell Studies (2<sup>nd</sup> Level Chronomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Chronomancy Spells (Level 2)</h4>
                <h4>2 Other Common Temporal Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/chronomancy.png" />
            </div>
            `
},
        {
            level: 5,
            name: "Specialty Improvement",
            key: false,
            description: "Choose one of your specialties and increase its level by 1. If you don't have any specialties that can be increased, you may gain a new specialty of your choice at the GM's discretion.",
        },
        {
            level: 5,
            id: "researcher.bonus",
            name: "Researcher Bonus",
            key: false,
            description: "Choose one of the following.",
            selections: {
                "1": {
                    label: "Choose a Bonus",
                    options: {spell: "Learn a New Spell", intelligence: "+1 Bonus to Any Intelligence skill"}
                }
            }
        },
        {
            level: 6,
            key: true,
            name: "Focal Energy",
            description: `<p>Your Focal Energy is a special reserve of magical energy you can use to cast spells in your major.</p>
            <p>Resting restores an amount of Focal Energy equal to the amount of regular energy you regain. It can't be restored by other means, such as potions.</p>
            <p>Whenever you cast a spell in your major school of magic, you can choose to use your focal energy to cast it.</p>`,
            tableValues: [
                {
                    field: "focalEnergy",
                    label: "Max. Focal Energy",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 10, 10, 12, 15, 15]
                }
            ]
        },
        {
            level: 7,
            common: "naturalSkillImprovement"
        },
        {
            level: 7,
            archetype: "pyromancy",
            name: "Spell Studies (3<sup>rd</sup> Level Pyromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Pyromancy Spells (Level 3)</h4>
                <h4>2 Other Common Elemental Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "cryomancy",
            name: "Spell Studies (3<sup>rd</sup> Level Cryomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Cryomancy Spells (Level 3)</h4>
                <h4>2 Other Common Elemental Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "lithomancy",
            name: "Spell Studies (3<sup>rd</sup> Level Lithomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Lithomancy Spells (Level 3)</h4>
                <h4>2 Other Common Elemental Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "evocation",
            name: "Spell Studies (3<sup>rd</sup> Level Evocation)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Evocation Spells (Level 3)</h4>
                <h4>2 Other Common Elemental Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "restoration",
            name: "Spell Studies (3<sup>rd</sup> Level Restoration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Restoration Spells (Level 3)</h4>
                <h4>2 Other Common Divine Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "abjuration",
            name: "Spell Studies (3<sup>rd</sup> Level Abjuration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Abjuration Spells (Level 3)</h4>
                <h4>2 Other Common Divine Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "banishment",
            name: "Spell Studies (3<sup>rd</sup> Level Banishment)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Banishment Spells (Level 3)</h4>
                <h4>2 Other Common Divine Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "physiomancy",
            name: "Spell Studies (3<sup>rd</sup> Level Physiomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Physiomancy Spells (Level 3)</h4>
                <h4>2 Other Common Physical Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "transmutation",
            name: "Spell Studies (3<sup>rd</sup> Level Transmutation)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Transmutation Spells (Level 3)</h4>
                <h4>2 Other Common Physical Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "conjuration",
            name: "Spell Studies (3<sup>rd</sup> Level Conjuration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Conjuration Spells (Level 3)</h4>
                <h4>2 Other Common Physical Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "illusion",
            name: "Spell Studies (3<sup>rd</sup> Level Illusion)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Illusion Spells (Level 3)</h4>
                <h4>2 Other Common Psionic Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "divination",
            name: "Spell Studies (3<sup>rd</sup> Level Divination)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Divination Spells (Level 3)</h4>
                <h4>2 Other Common Psionic Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divination.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "hypnotism",
            name: "Spell Studies (3<sup>rd</sup> Level Hypnotism)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Hypnotism Spells (Level 3)</h4>
                <h4>2 Other Common Psionic Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "sangromancy",
            name: "Spell Studies (3<sup>rd</sup> Level Sangromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Sangromancy Spells (Level 3)</h4>
                <h4>2 Other Common Spectral Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "summoning",
            name: "Spell Studies (3<sup>rd</sup> Level Summoning)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Summoning Spells (Level 3)</h4>
                <h4>2 Other Common Spectral Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/summoning.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "necromancy",
            name: "Spell Studies (3<sup>rd</sup> Level Necromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Necromancy Spells (Level 3)</h4>
                <h4>2 Other Common Spectral Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/necromancy.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "apparition",
            name: "Spell Studies (3<sup>rd</sup> Level Apparition)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Apparition Spells (Level 3)</h4>
                <h4>2 Other Common Temporal Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/apparition.png" />
            </div>
            `
},
{
            level: 7,
            archetype: "chronomancy",
            name: "Spell Studies (3<sup>rd</sup> Level Chronomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Common Chronomancy Spells (Level 3)</h4>
                <h4>2 Other Common Temporal Spells (Level 3 or lower)</h4>
                <h4>1 Common spell from any school (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/chronomancy.png" />
            </div>
            `
},
        {
            level: 8,
            name: "Spellcraft",
            key: true,
            description: `<p>You can create entirely new spells in your major school of magic. See the SRD page on <a href="https://www.newerarpg.com/srd/newera-sol366/spellcraft">Spellcraft</a>.</p>
            <p>Your Spellcraft skill is equal to your primary proficiency bonus.`
        },
        {
            level: 8,
            archetype: "pyromancy",
            name: "Apprentice Pyromancy",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Pyromancy Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "cryomancy",
            name: "Apprentice Cryomancy",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Cryomancy Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "lithomancy",
            name: "Apprentice Lithomancy",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Lithomancy Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "evocation",
            name: "Apprentice Evocation",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Evocation Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "restoration",
            name: "Apprentice Restoration",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Restoration Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "abjuration",
            name: "Apprentice Abjuration",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Abjuration Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "banishment",
            name: "Apprentice Banishment",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Banishment Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "physiomancy",
            name: "Apprentice Physiomancy",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Physiomancy Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "transmutation",
            name: "Apprentice Transmutation",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Transmutation Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "conjuration",
            name: "Apprentice Conjuration",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Conjuration Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "illusion",
            name: "Apprentice Illusion",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Illusion Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "divination",
            name: "Apprentice Divination",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Divination Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divination.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "hypnotism",
            name: "Apprentice Hypnotism",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Hypnotism Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "sangromancy",
            name: "Apprentice Sangromancy",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Sangromancy Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "summoning",
            name: "Apprentice Summoning",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Summoning Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/summoning.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "necromancy",
            name: "Apprentice Necromancy",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Necromancy Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/necromancy.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "apparition",
            name: "Apprentice Apparition",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Apparition Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/apparition.png" />
            </div>
            `
},
{
            level: 8,
            archetype: "chronomancy",
            name: "Apprentice Chronomancy",
            key: false,
            description: `<p>You learn all Uncommon spells in your major at level 3 and lower. From now on, your spell studies in your major include Uncommon spells.</p>
            <div class="magic-info">
                <h4>All Uncommon Chronomancy Spells (Level 3 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/chronomancy.png" />
            </div>
            `
},
        {
            level: 9,
            common: "abilityScoreImprovement"
        },
        {
            level: 10,
            id: "researcher.bonus",
            name: "Researcher Bonus",
            key: false,
            description: "Choose one of the following.",
            selections: {
                "2": {
                    label: "Choose a Bonus",
                    options: {spell: "Learn a New Spell", intelligence: "+1 Bonus to Any Intelligence skill", spellcraft: "+1 Spellcraft Skill"}
                }
            }
        },
        {
            level: 10,
            archetype: "pyromancy",
            name: "Spell Studies (4<sup>th</sup> Level Pyromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Pyromancy Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Elemental Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "cryomancy",
            name: "Spell Studies (4<sup>th</sup> Level Cryomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Cryomancy Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Elemental Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "lithomancy",
            name: "Spell Studies (4<sup>th</sup> Level Lithomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Lithomancy Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Elemental Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "evocation",
            name: "Spell Studies (4<sup>th</sup> Level Evocation)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Evocation Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Elemental Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "restoration",
            name: "Spell Studies (4<sup>th</sup> Level Restoration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Restoration Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Divine Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "abjuration",
            name: "Spell Studies (4<sup>th</sup> Level Abjuration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Abjuration Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Divine Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "banishment",
            name: "Spell Studies (4<sup>th</sup> Level Banishment)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Banishment Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Divine Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "physiomancy",
            name: "Spell Studies (4<sup>th</sup> Level Physiomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Physiomancy Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Physical Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "transmutation",
            name: "Spell Studies (4<sup>th</sup> Level Transmutation)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Transmutation Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Physical Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "conjuration",
            name: "Spell Studies (4<sup>th</sup> Level Conjuration)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Conjuration Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Physical Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "illusion",
            name: "Spell Studies (4<sup>th</sup> Level Illusion)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Illusion Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Psionic Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "divination",
            name: "Spell Studies (4<sup>th</sup> Level Divination)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Divination Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Psionic Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divination.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "hypnotism",
            name: "Spell Studies (4<sup>th</sup> Level Hypnotism)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Hypnotism Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Psionic Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "sangromancy",
            name: "Spell Studies (4<sup>th</sup> Level Sangromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Sangromancy Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Spectral Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "summoning",
            name: "Spell Studies (4<sup>th</sup> Level Summoning)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Summoning Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Spectral Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/summoning.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "necromancy",
            name: "Spell Studies (4<sup>th</sup> Level Necromancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Necromancy Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Spectral Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/necromancy.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "apparition",
            name: "Spell Studies (4<sup>th</sup> Level Apparition)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Apparition Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Temporal Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/apparition.png" />
            </div>
            `
},
{
            level: 10,
            archetype: "chronomancy",
            name: "Spell Studies (4<sup>th</sup> Level Chronomancy)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You learn all available spells in your major of a given level and rarity (or lower.) You may then learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>, from the other schools of magic within the same form as your major, and from other forms.</p>
            <div class="magic-info">
                <h4>All Uncommon Chronomancy Spells (Level 4 and lower)</h4>
                <h4>2 Other Uncommon Temporal Spells (Level 4 and lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/chronomancy.png" />
            </div>
            `
},
    ],
    chanter: [
        {
            level: 1,
            id: "chanter.naturalSkills",
            name: "Chanter Natural Skills",
            key: false,
            description: "Choose 3 of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {diplomacy: "Diplomacy", insight: "Insight", performance: "Performance", deception: "Deception", intimidation: "Intimidation", determination: "Determination", logic: "Logic", "psionic-magic": "Psionic Magic"}
                },
                "2": {
                    label: "Second Choice",
                    options: {diplomacy: "Diplomacy", insight: "Insight", performance: "Performance", deception: "Deception", intimidation: "Intimidation", determination: "Determination", logic: "Logic", "psionic-magic": "Psionic Magic"}
                },
                "3": {
                    label: "Third Choice",
                    options: {diplomacy: "Diplomacy", insight: "Insight", performance: "Performance", deception: "Deception", intimidation: "Intimidation", determination: "Determination", logic: "Logic", "psionic-magic": "Psionic Magic"}
                }
            }
        },
        {
            level: 1,
            id: "chanter.specialties",
            name: "Chanter Specialties",
            key: false,
            description: "Choose two of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {"sense-motive": "Sense Motive (Insight)", "diversion": "Diversion (Performance)", "socialization": "Socialization (Diplomacy)", "investigation": "Investigation (Logic)", instrument: "Musical Instrument"}
                },
                "2": {
                    label: "Specialty #2",
                    options: {"sense-motive": "Sense Motive (Insight)", "diversion": "Diversion (Performance)", "socialization": "Socialization (Diplomacy)", "investigation": "Investigation (Logic)", instrument: "Musical Instrument"}
                }
            }
        },
        {
            level: 1,
            name: "Verbal Magic",
            key: true,
            description: "You have the unusual gift of Verbal Magic. You have a number of chant slots determined by your level in the Chanter table. You can expend a chant slot to activate a chant you know of equal or lesser level to the expended slot.",
            tableValues: [
                {
                    field: "chantSlots.basic",
                    label: "Basic Chant Slots",
                    sign: false,
                    values: [null, 2, 3, 3, 4, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6]
                },
                {
                    field: "chantSlots.apprentice",
                    label: "Apprentice Chant Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6]
                },
                {
                    field: "chantSlots.intermediate",
                    label: "Intermediate Chant Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 4, 4]
                },
                {
                    field: "chantSlots.advanced",
                    label: "Advanced Chant Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
                },
                {
                    field: "chantSlots.expert",
                    label: "Expert Chant Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    field: "chantSlots.master",
                    label: "Master Chant Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ],
            actions: [
                    {
                        name: "Chant",
                        images: {
                            base: `${NEWERA.images}/shouting.png`,
                            left: `${NEWERA.images}/chanter.png`,
                            right: `${NEWERA.images}/ac_1frame.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: "<p>You use your Verbal Magic powers to begin an arcane chant that has an ongoing effect.</p><p>Choose a chant you know. You expend a chant slot of that chant's level or higher. You continue the chant until it ends, or your concentration is broken.</p>",
                        overrideMacroCommand: "game.newera.HotbarActions.openChants()",
                        difficulty: null,
                        actionType: "1",
                        rolls: [
                          {
                            label: "Chant",
                            die: "shouting",
                            callback: actor => new ChantSheet(actor).render(true)
                          }
                        ]
                    }
            ]
        },
        {
            level: 1,
            name: "Basic Chants",
            key: false,
            description: "You gain two Basic-level chant slots and the ability to take Basic chant feats. You may learn any two Basic chants without paying their character point costs."
        },
        {
            level: 2,
            common: "learningExperience"
        },
        {
            level: 2,
            common: "specialtyImprovement"
        },
        {
            level: 3,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Chanter table.</p>
            <div class="magic-info">
                <h4>3 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.chanter",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]
                }
            ]
        },
        {
            level: 3,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Common Chanter Spell (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" data-tooltip="Hypnotism" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 1,
                    lists: ["chanter"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
        },
        {
            level: 3,
            name: "Clear the Mind",
            key: false,
            description: "<p>You can use your energy to recover expended chant slots.</p><p>You may spend one hour resting to recover a single chant slot of your highest available chant level or below. <i>(You still recover all your chant slots upon completion of a full 8-hour rest.)</i>",
            actions: [
                {
                    name: "Clear the Mind",
                    images: {
                        base: `${NEWERA.images}/meditation.png`,
                        left: `${NEWERA.images}/chanter.png`,
                        right: `${NEWERA.images}/ac_restful.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You spend one hour refocusing your mental energy and recover one expended chant slot of your highest available chant level or lower.</p><ul><li>10 energy for a Basic chant slot</li><li>20 energy for an Apprentice slot</li><li>30 energy for an Intermediate slot</li><li>50 energy for an Advanced slot</li><li>75 energy for an Expert slot</li><li>100 energy for a Master slot</li>",
                    overrideMacroCommand: "game.newera.HotbarActions.clearTheMind()",
                    difficulty: null,
                    actionType: "D",
                    rolls: [
                        {
                            label: "Activate",
                            die: "meditation",
                            callback: actor => Chanter.clearTheMind(actor)
                        }
                    ]
                }
            ]
        },
        {
            level: 4,
            name: "Natural Skill Improvement",
            key: false,
            description: "Your Natural Skills each increase in level by 1.",
        },
        {
            level: 5,
            name: "Apprentice Chants",
            key: false,
            description: "You gain two Apprentice-level chant slots and the ability to take Apprentice chant feats. You may learn any two Apprentice chants without paying their character point costs."
        },
        {
            level: 5,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Chanter Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" data-tooltip="Hypnotism" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["chanter"],
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
        },
        {
            level: 6,
            common: "abilityScoreImprovement"
        },
        {
            level: 7,
            name: "Fount of Knowledge",
            key: true,
            description: `<p>Your mind is a well of what you once thought to be useless information, but you never know when it might come in handy.</p>
            <p>Add your Proficiency Bonus to Research, Investigate, and Recall Information action checks on any subject. Your proficiency bonus increases with your level according to the Chanter Table.</p>`,
            tableValues: [
                {
                    field: "proficiencyBonus.chanter",
                    name: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3]
                }
            ]
        },
        {
            level: 8,
            common: "specialtyImprovement"
        },
        {
            level: 8,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Chanter Spell (Level 3 or lower)</h4>
                <h4>2 Common Chanter Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" data-tooltip="Hypnotism" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    lists: ["chanter"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["chanter"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                }
            ]
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 9,
            name: "Unshakeable Resolve",
            key: false,
            description: "You can perform any number of 1-frame actions during your turn without interrupting your chant, as long as none of those actions involve the use of your voice."
        },
        {
            level: 10,
            id: "chanter.bonus",
            key: false,
            name: "Chanter Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "1": {
                    label: "Choose an Upgrade",
                    options: {
                        passivePerception: "+1 Passive Perception Bonus",
                        passiveAgility: "+1 Passive Agility Bonus",
                        spell: "Learn 1 Common Chanter spell of any level"
                    }
                }
            }
        },
        {
            level: 10,
            name: "Intermediate Chants",
            key: false,
            description: "You gain two Intermediate-level chant slots and the ability to take Intermediate chant feats. You may learn any two Intermediate chants without paying their character point costs."
        },
        {
            level: 11,
            common: "abilityScoreImprovement"
        },
        {
            level: 12,
            id: "chanter.bonus",
            key: false,
            name: "Chanter Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "2": {
                    label: "Choose an Upgrade",
                    options: {
                        passivePerception: "+1 Passive Perception Bonus",
                        passiveAgility: "+1 Passive Agility Bonus",
                        spell: "Learn 1 Common Chanter spell of any level"
                    }
                }
            }
        },
        {
            level: 12,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon Chanter Spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" data-tooltip="Hypnotism" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 2,
                    lists: ["chanter"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                }
            ]
        },
        {
            level: 13,
            common: "naturalSkillImprovement"
        },
        {
            level: 13,
            common: "learningExperience"
        },
        {
            level: 14,
            common: "specialtyImprovement"
        },
        {
            level: 14,
            name: "Chant Blending",
            key: false,
            description: `<p>You can perform two chants simultaneously.</p><p>Activating each chant takes a separate action and expends a chant slot. If your concentration is broken, both chants are ended.</p>`
        },
        {
            level: 15,
            common: "learningExperience"
        },
        {
            level: 15,
            name: "Advanced Chants",
            key: false,
            description: "You gain two Advanced-level chant slots and the ability to take Advanced chant feats. You may learn any two Advanced chants without paying their character point costs."
        }
    ],
    magus: [
        {
            level: 1,
            id: "magus.specialties",
            name: "Magus Specialties",
            key: false,
            description: "Choose one of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty",
                    options: {swordsOneHanded: "Swords (One-Handed)", swordsTwoHanded: "Swords (Two-Handed)", axes: "Axes", bluntWeapons: "Blunt Weapons", archery: "Archery (Marksmanship)", crossbow: "Crossbows (Marksmanship)"}
                }
            }
        },
        {
            level: 1,
            id: "magus.naturalSkills",
            name: "Magus Natural Skills",
            key: false,
            description: "Choose three of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {"one-handed": "One-Handed", "two-handed": "Two-Handed", insight: "Insight", intimidation: "Intimidation", technology: "Technology", defense: "Defense", reflex: "Reflex", "elemental-magic": "Elemental Magic"}
                },
                "2": {
                    label: "Second Choice",
                    options: {"one-handed": "One-Handed", "two-handed": "Two-Handed", insight: "Insight", intimidation: "Intimidation", technology: "Technology", defense: "Defense", reflex: "Reflex", "elemental-magic": "Elemental Magic"}
                },
                "3": {
                    label: "Third Choice",
                    options: {"one-handed": "One-Handed", "two-handed": "Two-Handed", insight: "Insight", intimidation: "Intimidation", technology: "Technology", defense: "Defense", reflex: "Reflex", "elemental-magic": "Elemental Magic"}
                }
            }
        },
        {
            level: 1,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Magus table.</p>
            <div class="magic-info">
                <h4>4 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="Spectral" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.magus",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3]
                }
            ]
        },
        {
            level: 1,
            name: "Enchantment Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Magus Enchantments (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 2,
            common: "specialtyImprovement"
        },
        {
            level: 2,
            name: "Spell Studies",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Magus Spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 3,
            name: "Enchantment Proficiency",
            key: true,
            description: "You rigorously train your enchantment skills. Add your proficiency bonus to magic skill checks to cast enchantments in any school of magic. Your Proficiency Bonus increases with your level according to the Magus Table.",
            tableValues: [
                {
                    field: "proficiencyBonus.magus",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2]
                }
            ]
        },
        {
            level: 4,
            common: "naturalSkillImprovement"
        },
        {
            level: 4,
            name: "Enchantment Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Magus Enchantments (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 5,
            common: "learningExperience"
        },
        {
            level: 5,
            name: "Arcane Crafting",
            key: false,
            description: "You can make use of your enchantment powers in crafting. You can repair and upgrade equipment without affecting its enchantments, and you can amplify existing enchantments on spells."
        },
        {
            level: 6,
            common: "abilityScoreImprovement"
        },
        {
            level: 6,
            name: "Enchantment Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Magus Enchantment (Level 3 or lower)</h4>
                <h4>2 Common Magus Enchantments (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 7,
            id: "magus.bonus",
            key: false,
            name: "Magus Bonus",
            description: "Gain a +1 class bonus to one of the following stats.",
            selections: {
                "1": {
                    label: "Choose a Stat Increase",
                    options: {
                        carryWeight: "Carry Weight",
                        initiative: "Initiative",
                        passiveAgility: "Passive Agility"
                    }
                }
            }
        },
        {
            level: 7,
            name: "Spell Studies",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Magus spell (Level 1 or lower)</h4>
                <h4>2 Common Magus Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 8,
            name: "Spellstrike",
            key: true,
            description: `<p>You can infuse spells into your attacks. Whenever you make an attack with any melee or ranged weapon, you can turn that attack into a Spellstrike.</p>
            <p>You must expend a Spellstrike slot each time you use this ability. You have a number of Spellstrike slots per day which increases with your level according to the Magus table. You recover one Spellstrike slot per hour of rest, and all your slots upon a full rest.
            `,
            tableValues: [
                {
                    field: "spellstrikeSlots",
                    label: "Spellstrike Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5]
                }
            ],
            actions: [
                {
                    name: "Spellstrike",
                    images: {
                        base: `${NEWERA.images}/saber-slash.png`,
                        left: `${NEWERA.images}/magus.png`,
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You cast a spell alongside an attack, turning into a Spellstrike.</p><p>Choose a spell you know that deals damage, and a melee attack using a held weapon.</p>",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "saber-slash",
                        id: "spellstrike"
                      }
                    ]
                }
            ]
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 9,
            common: "specialtyImprovement"
        },
        {
            level: 10,
            common: "learningExperience"
        },
        {
            level: 10,
            id: "magus.bonus",
            key: false,
            name: "Magus Bonus",
            description: "Gain a +1 class bonus to one of the following stats.",
            selections: {
                "2": {
                    label: "Choose a Stat Increase",
                    options: {
                        carryWeight: "Carry Weight",
                        initiative: "Initiative",
                        passiveAgility: "Passive Agility"
                    }
                }
            }
        }
    ],
    guardian: [
        {
            level: 1,
            id: "guardian.specialties",
            name: "Guardian Specialties",
            key: false,
            description: "Choose two of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {
                        "long-jump": "Long Jump (Athletics)",
                        "high-jump": "High Jump (Athletics)",
                        "climbing": "Climbing (Athletics)",
                        "protection": "Protection (Defense)",
                        "disarm": "Disarm (Defense)",
                        "counter": "Counter (Defense)",
                        "pull-to-safety": "Pull to Safety (Reflex)"
                    }
                },
                "2": {
                    label: "Specialty #2",
                    options: {
                        "long-jump": "Long Jump (Athletics)",
                        "high-jump": "High Jump (Athletics)",
                        "climbing": "Climbing (Athletics)",
                        "protection": "Protection (Defense)",
                        "disarm": "Disarm (Defense)",
                        "counter": "Counter (Defense)",
                        "pull-to-safety": "Pull to Safety (Reflex)"
                    }
                }
            }
        },
        {
            level: 1,
            id: "guardian.naturalSkills",
            name: "Guardian Natural Skills",
            key: false,
            description: "Choose three of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {
                        "athletics": "Athletics", 
                        "defense": "Defense",
                        "agility": "Agility",
                        "endurance": "Endurance",
                        "reflex": "Reflex",
                        "determination": "Determination",
                        "divine-magic": "Divine Magic"
                    }
                },
                "2": {
                    label: "Second Choice",
                    options: {
                        "athletics": "Athletics", 
                        "defense": "Defense",
                        "agility": "Agility",
                        "endurance": "Endurance",
                        "reflex": "Reflex",
                        "determination": "Determination",
                        "divine-magic": "Divine Magic"
                    }
                },
                "3": {
                    label: "Third Choice",
                    options: {
                        "athletics": "Athletics", 
                        "defense": "Defense",
                        "agility": "Agility",
                        "endurance": "Endurance",
                        "reflex": "Reflex",
                        "determination": "Determination",
                        "divine-magic": "Divine Magic"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Martial Arts",
            key: true,
            description: "As a professional bodyguard, you learn tried-and-true defense techniques based on ancient traditions. Add your Proficiency Bonus to Unarmed Attack (Athletics) checks. Your proficiency bonus increases with your level according to the Guardian table.",
            tableValues: [
                {
                    field: "proficiencyBonus.guardian",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5]
                }
            ]
        },
        {
            level: 1,
            name: "Martial Unarmed Attack",
            key: false,
            description: "As a Guardian, your unarmed attack deals 1d4 damage plus your Strength modifier.",
            actions: [
                {
                    name: "Unarmed Attack",
                    images: {
                      base: `${NEWERA.images}/unarmed_attack.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: "athletics",
                    specialties: ["Brawl"],
                    description: "As a guardian, you have a stronger unarmed attack than most. This attack deals 1d4 damage plus your Strength modifier.",
                    difficulty: "The difficulty of an attack is the target's passive agility, unless they react.",
                    type: "1",
                    rolls: [
                      {
                        label: "Attack",
                        caption: "Martial Unarmed Attack",
                        die: "d20",
                        formula: "1d20+@skills.athletics.mod+@spec.brawl",
                        message: "{NAME} attacks with {d} fists!",
                        difficulty: null,
                      },
                      {
                        label: "Damage",
                        caption: "Damage (Martial Unarmed Attack)",
                        die: "d4",
                        formula: "1d4+@abilities.strength.mod"
                      }
                    ]
                }
            ]
        },
        {
            level: 2,
            common: "abilityScoreImprovement"
        },
        {
            level: 3,
            name: "Qi",
            key: true,
            description: "You blend your magical powers into your martial arts skills. You can assume a number of different fighting stances, which boost your stamina and grant you other useful powers.",
        },
        {
            level: 3,
            name: "Basic Fighting Stances",
            key: false,
            description: "You've learned three basic fighting stances: Gorilla Stance, Mountain Stance, and Lion Stance.",
            actions: [
                {
                    name: "Exit Stance",
                    images: {
                        base: `${NEWERA.images}/equipment-body.png`,
                        left: `${NEWERA.images}/guardian.png`,
                        right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `You exit your current fighting stance.`,
                    overrideMacroCommand: "game.newera.HotbarActions.exitStance()",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "End",
                        die: "equipment-body",
                        difficulty: null,
                        callback: actor => Guardian.endStance(actor)
                      }
                    ]
                },
                {
                    name: "Gorilla Stance",
                    images: {
                        base: `${NEWERA.images}/gorilla.png`,
                        left: `${NEWERA.images}/guardian.png`,
                        right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You move low to the ground and fight with your fists. While in this stance:
                    <ul>
                        <li style="color: lightblue">Your basic unarmed attack deals 1d6 damage plus your Strength modifier.</li>
                        <li style="color: lightblue">You gain a Strong Punch attack (2 frames) that deals 1d12 Bludgeoning damage plus your Strength modifier.</li>
                        <li style="color: salmon">You have disadvantage on Agility checks and Reflex saves.</li>
                        <li style="color: salmon">You can't hold any items or cast spells, and can only make unarmed attacks.</li>
                    </ul>
                </p>`,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Gorilla')",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "gorilla",
                        callback: actor => Guardian.activateFightingStance(actor, "Gorilla")
                      },
                      {
                        label: "Punch",
                        caption: "Strong Punch (Gorilla Stance)",
                        die: "unarmed_attack",
                        formula: "d20+@skills.dexterity.mod+@proficiencyBonus.guardian",
                      },
                      {
                        label: "Damage",
                        caption: "Strong Punch Damage",
                        die: "d6",
                        formula: "1d6+@abilities.strength.mod"
                      }
                    ]
                },
                {
                    name: "Mountain Stance",
                    images: {
                        base: `${NEWERA.images}/peaks.png`,
                        left: `${NEWERA.images}/guardian.png`,
                        right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You assume the stance of an immovable mountain. While in this stance:
                    <ul>
                        <li style="color: lightblue">You gain a +2 bonus to your Natural Armor.</li>
                        <li style="color: lightblue">You gain a +5 bonus on checks against being staggered, stunned, or forcefully moved.</li>
                        <li style="color: salmon">Your Speed is reduced by 4.</li>
                    </ul>
                </p>`,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Mountain')",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "peaks",
                        callback: actor => Guardian.activateFightingStance(actor, "Mountain")
                      }
                    ]
                },
                {
                    name: "Lion Stance",
                    images: {
                        base: `${NEWERA.images}/lion.png`,
                        left: `${NEWERA.images}/guardian.png`,
                        right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You gain the speed and reflexes of a big cat, allowing you to move about quickly to protect your allies. While in this stance:
                    <ul>
                        <li style="color: lightblue">Your Speed increases by 6.</li>
                        <li style="color: lightblue">You gain a +5 bonus on the Tackle, Protect Ally, and Pull to Safety actions.</li>
                        <li style="color: salmon">You cannot attack.</li>
                    </ul>
                </p>`,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Lion')",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "lion",
                        callback: actor => Guardian.activateFightingStance(actor, "Lion")
                      }
                    ]
                }
            ]
        },
        {
            level: 4,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Guardian table.</p>
            <div class="magic-info">
                <h4>3 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.guardian",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4]
                }
            ]
        },
        {
            level: 4,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Guardian Spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 5,
            common: "naturalSkillImprovement"
        },
        {
            level: 5,
            common: "learningExperience"
        },
        {
            level: 6,
            name: "Second Wind",
            key: true,
            description: `<p>As an adventuring action, you can spend 15 minutes to roll any number of your Second Wind dice (d6). You recover hit points equal to the total result.</p>
            <p>You recover one die per hour of resting, or all your dice after an 8-hour full rest. You gain more Second Wind dice as you level up according to the Guardian table.</p>`,
            tableValues: [
                {
                    field: "secondWind.roll",
                    label: "Second Wind Die",
                    sign: false,
                    values: [null, "", "", "", "", "", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10"]
                },
                {
                    field: "secondWind.count",
                    label: "Dice per Day",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 3, 4, 5, 5, 6, 7, 8, 9, 10, 10]
                }
            ],
            actions: [
                {
                    name: "Second Wind",
                    images: {
                      base: `${NEWERA.images}/mighty-force.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_adventuring.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "You roll one or more of your Second Wind dice and recover hit points equal to the total result.",
                    overrideMacroCommand: "game.newera.HotbarActions.secondWind()",
                    difficulty: null,
                    type: "E",
                    rolls: [
                      {
                        label: "Recover",
                        die: "mighty-force",
                        callback: actor => Guardian.secondWind(actor)
                      }
                    ]
                }
            ]
        },
        {
            level: 7,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Guardian Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 2 or lower)</h4>
            </div>
            `
        },
        {
            level: 7,
            id: "guardian.bonus",
            name: "Guardian Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "1": {
                    label: "Choose a Stat Bonus",
                    options: {
                        speed: "Speed",
                        carryWeight: "Carry Weight",
                        naturalArmor: "Natural Armor"
                    }
                }
            }
        },
        {
            level: 8,
            common: "learningExperience"
        },
        {
            level: 8,
            name: "Stamina",
            key: false,
            description: "The effects of Exhaustion on you are reduced by one level. <i>(You still gain the Exhaustion status effect, but it's treated as though it were one level lower. Exhaustion 1 has no effect, and Exhaustion 6 is required to cause death.)</i>"
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 9,
            name: "Guardian's Vigor (d8)",
            key: false,
            description: "Your Second Wind die becomes a d8."
        },
        {
            level: 10,
            common: "specialtyImprovement"
        },
        {
            level: 10,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Guardian Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 3 or lower)</h4>
            </div>
            `
        },
        {
            level: 10,
            name: "Sentinel Stance",
            key: false,
            description: "You learn the Sentinel Stance, which focuses on fighting reactively and letting your enemies make the first move.",
            actions: [
                {
                    name: "Sentinel Stance",
                    images: {
                      base: `${NEWERA.images}/guards.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `While in this stance, your turn length is reduced by 2 frames, but you gain 2 reaction frames.`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Sentinel')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "guards",
                        callback: actor => Guardian.activateFightingStance(actor, "Sentinel")
                      }
                    ]
                }
            ]
        },
        {
            level: 11,
            common: "abilityScoreImprovement"
        },
        {
            level: 12,
            name: "Arcane Fighter",
            key: false,
            description: `<p>You learn the Swordsman, Monk, and Ward stances. These new fighting stances make use of your magical powers.</p>`,
            actions: [
                {
                    name: "Swordsman Stance",
                    images: {
                      base: `${NEWERA.images}/relic-blade.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `
                    <p><b>Activation Cost: 20 Energy</b></p>
                    <p>You conjure an Ethereal Longsword in your dominant hand upon activating this stance.</p>
                    <ul>
                        <li style="color: lightblue">Your ethereal sword inflicts magical damage, allowing it to damage ghosts.</li>
                        <li style="color: lightblue">The sword doesn't suffer damage from Parrying attacks.</li>
                        <li style="color: salmon">The sword disappears when you exit this stance.</li>
                        <li style="color: salmon">You exit this stance automatically if the sword leaves your hands for even an instant.</li>
                    </ul>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Swordsman')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "relic-blade",
                        callback: actor => Guardian.activateFightingStance(actor, "Swordsman")
                      }
                    ]
                },
                {
                    name: "Monk Stance",
                    images: {
                      base: `${NEWERA.images}/kindle.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>Most spells only require the use of one hand. This stance employs a special techique wherein by using both hands to cast spells, you're able to increase their power. You must have both hands free when activating this stance.</p>
                    <ul>
					<li style="color: lightblue">Spells you cast are amplified to the next-highest factor. The casting difficulty of the spell remains unchanged, but its energy cost reflects the amplified level.</li>
					<li style="color: lightblue">You have advantage on saves against your concentration being broken.</li>
					<li style="color: salmon">You can't hold items and can only attack by casting spells.</li>
				    </ul>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Monk')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "kindle",
                        callback: actor => Guardian.activateFightingStance(actor, "Monk")
                      }
                    ]
                },
                {
                    name: "Ward Stance",
                    images: {
                      base: `${NEWERA.images}/rosa-shield.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `
                    <p><b>Activation Cost: 6 Energy</b></p>
                    <p>You channel your Qi into a powerful defensive posture. While in this stance:</p>
                    <ul>
					<li style="color: lightblue">Spells you cast are amplified to the next-highest factor. The casting difficulty of the spell remains unchanged, but its energy cost reflects the amplified level.</li>
					<li style="color: lightblue">You have advantage on saves against your concentration being broken.</li>
					<li style="color: salmon">You can't hold items and can only attack by casting spells.</li>
				    </ul>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Ward')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "rosa-shield",
                        callback: actor => Guardian.activateFightingStance(actor, "Ward")
                      }
                    ]
                }
            ]
        },
        {
            level: 13,
            name: "Qi Rush",
            key: false,
            description: "You learn the Qi Rush cantrip."
        },
        {
            level: 13,
            id: "guardian.bonus",
            name: "Guardian Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "2": {
                    label: "Choose a Stat Bonus",
                    options: {
                        speed: "Speed",
                        carryWeight: "Carry Weight",
                        naturalArmor: "Natural Armor"
                    }
                }
            }
        },
        {
            level: 13,
            common: "naturalSkillImprovement"
        },
        {
            level: 14,
            common: "learningExperience"
        },
        {
            level: 14,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon Guardian Spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <h3>1 Uncommon spell from any school (Level 4 or lower)</h4>
                <h4>2 Common spells from any school (Level 4 or lower)</h4>
            </div>
            `
        },
        {
            level: 15,
            name: "Guardian's Vigor (d10)",
            key: false,
            description: "Your Second Wind die becomes a d10."
        },
        {
            level: 15,
            name: "Combat Expert",
            key: false,
            description: "Your turn length increases by one action frame and one reaction frame."
        }
    ],
    investigator: [
        {
            level: 1,
            id: "investigator.specialties",
            name: "Investigator Specialties",
            key: false,
            description: "Choose four of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {
                        "diversion": "Diversion (Performance)",
                        "knives": "Knives (One-Handed)",
                        "daggers": "Daggers (One-Handed)",
                        "handguns": "Handguns (Marksmanship)",
                        "lockpicking": "Lockpicking (Sleight of Hand)",
                        "research": "Research (Technology)",
                        "investigation": "Investigation (Logic)",
                        "straight-face": "Straight Face (Deception)",
                        "framing": "Framing (Deception)",
                        "hacking": "Hacking (Technology)"
                    }
                },
                "2": {
                    label: "Specialty #2",
                    options: {
                        "diversion": "Diversion (Performance)",
                        "knives": "Knives (One-Handed)",
                        "daggers": "Daggers (One-Handed)",
                        "handguns": "Handguns (Marksmanship)",
                        "lockpicking": "Lockpicking (Sleight of Hand)",
                        "research": "Research (Technology)",
                        "investigation": "Investigation (Logic)",
                        "straight-face": "Straight Face (Deception)",
                        "framing": "Framing (Deception)",
                        "hacking": "Hacking (Technology)"
                    }
                },
                "3": {
                    label: "Specialty #3",
                    options: {
                        "diversion": "Diversion (Performance)",
                        "knives": "Knives (One-Handed)",
                        "daggers": "Daggers (One-Handed)",
                        "handguns": "Handguns (Marksmanship)",
                        "lockpicking": "Lockpicking (Sleight of Hand)",
                        "research": "Research (Technology)",
                        "investigation": "Investigation (Logic)",
                        "straight-face": "Straight Face (Deception)",
                        "framing": "Framing (Deception)",
                        "hacking": "Hacking (Technology)"
                    }
                },
                "4": {
                    label: "Specialty #4",
                    options: {
                        "diversion": "Diversion (Performance)",
                        "knives": "Knives (One-Handed)",
                        "daggers": "Daggers (One-Handed)",
                        "handguns": "Handguns (Marksmanship)",
                        "lockpicking": "Lockpicking (Sleight of Hand)",
                        "research": "Research (Technology)",
                        "investigation": "Investigation (Logic)",
                        "straight-face": "Straight Face (Deception)",
                        "framing": "Framing (Deception)",
                        "hacking": "Hacking (Technology)"
                    }
                },
            }
        },
        {
            level: 1,
            id: "investigator.naturalSkills",
            name: "Investigator Natural Skills",
            key: false,
            description: "Choose four of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {
                        "agility": "Agility",
                        "one-handed": "One-Handed",
                        "diplomacy": "Diplomacy",
                        "logic": "Logic",
                        "deception": "Deception",
                        "stealth": "Stealth",
                        "sleight-of-hand": "Sleight of Hand",
                        "insight": "Insight",
                        "technology": "Technology"
                    }
                },
                "2": {
                    label: "Second Choice",
                    options: {
                        "agility": "Agility",
                        "one-handed": "One-Handed",
                        "diplomacy": "Diplomacy",
                        "logic": "Logic",
                        "deception": "Deception",
                        "stealth": "Stealth",
                        "sleight-of-hand": "Sleight of Hand",
                        "insight": "Insight",
                        "technology": "Technology"
                    }
                },
                "3": {
                    label: "Third Choice",
                    options: {
                        "agility": "Agility",
                        "one-handed": "One-Handed",
                        "diplomacy": "Diplomacy",
                        "logic": "Logic",
                        "deception": "Deception",
                        "stealth": "Stealth",
                        "sleight-of-hand": "Sleight of Hand",
                        "insight": "Insight",
                        "technology": "Technology"
                    }
                },
                "4": {
                    label: "Fourth Choice",
                    options: {
                        "agility": "Agility",
                        "one-handed": "One-Handed",
                        "diplomacy": "Diplomacy",
                        "logic": "Logic",
                        "deception": "Deception",
                        "stealth": "Stealth",
                        "sleight-of-hand": "Sleight of Hand",
                        "insight": "Insight",
                        "technology": "Technology"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Firearms License",
            key: false,
            description: "If you start a leveled campaign as an Investigator, you have a Class I firearms license."
        },
        {
            level: 1,
            name: "Sneak Attack",
            key: true,
            description: "While Sneaking, you can perform a stealthy attack on a target that doesn't notice you. The attack deals extra damage according to the Investigator table.",
            tableValues: [
                {
                    field: "sneakAttackDamage",
                    label: "Sneak Attack Damage",
                    sign: false,
                    values: [null, "1d4", "1d4", "1d6", "1d6", "1d8", "1d8", "1d8", "1d10", "1d10", "1d10"]
                }
            ]
        },
        {
            level: 2,
            common: "learningExperience"
        },
        {
            level: 2,
            common: "specialtyImprovement"
        },
        {
            level: 3,
            common: "naturalSkillImprovement"
        },
        {
            level: 4,
            common: "abilityScoreImprovement"
        },
        {
            level: 5,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Guardian table.</p>
            <div class="magic-info">
                <h4>3 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="Temporal" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.investigator",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2]
                }
            ]
        },
        {
            level: 5,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Investigator Spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/apparition.png" data-tooltip="Apparition" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 6,
            key: true,
            name: "Evasion Proficiency",
            description: "Add your Proficiency Bonus to Dodge (Agility) checks and Reflex saves. Your Proficiency Bonus increases with your level according to the Investigator table.",
            tableValues: [
                {
                    field: "proficiencyBonus.investigator",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2]
                }
            ]
        },
        {
            level: 7,
            common: "specialtyImprovement"
        },
        {
            level: 7,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Investigator Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/apparition.png" data-tooltip="Apparition" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 8,
            common: "naturalSkillImprovement"
        },
        {
            level: 8,
            key: false,
            id: "investigator.archetype",
            name: "Investigator Archetype",
            description: "Choose one of the three Investigator Archetypes. Your choice will shape how you hone your vast skill set as you level up.",
            selections: {
                "1": {
                    label: "Choose an Archetype",
                    options: {
                        "marauder": "Marauder",
                        "spy": "Spy",
                        "assassin": "Assassin"
                    }
                }
            }
        },
        {
            level: 8,
            archetype: "marauder",
            key: true,
            name: "Marauder",
            description: "Add your Proficiency Bonus to Sleight of Hand skill checks and to checks to perform other actions stealthily."
        },
        {
            level: 8,
            archetype: "spy",
            key: true,
            name: "Spy",
            description: "Add your Proficiency Bonus to Deception and Performance skill checks."
        },
        {
            level: 8,
            archetype: "assassin",
            key: true,
            name: "Assassin",
            description: "Add your Proficiency Bonus to attack rolls when using your Sneak Attack ability."
        },
        {
            level: 9,
            common: "abilityScoreImprovement"
        },
        {
            level: 10,
            common: "naturalSkillImprovement"
        },
        {
            level: 10,
            key: false,
            name: "Covert Spellcasting",
            description: "You've mastered the art of casting spells subtly and silently. You can cast Stealthy spells while sneaking without suffering the circumstance penalty for stealth actions."
        }
    ],
    scholar: [
        {
            level: 1,
            id: "scholar.naturalSkills",
            name: "Scholar Natural Skills",
            key: false,
            description: "Choose two of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {
                        "diplomacy": "Diplomacy",
                        "logic": "Logic",
                        "insight": "Insight",
                        "elemental-magic": "Elemental Magic",
                        "divine-magic": "Divine Magic",
                        "physical-magic": "Physical Magic",
                        "psionic-magic": "Psionic Magic",
                        "spectral-magic": "Spectral Magic",
                        "temporal-magic": "Temporal Magic"
                    }
                },
                "2": {
                    label: "Second Choice",
                    options: {
                        "diplomacy": "Diplomacy",
                        "logic": "Logic",
                        "insight": "Insight",
                        "elemental-magic": "Elemental Magic",
                        "divine-magic": "Divine Magic",
                        "physical-magic": "Physical Magic",
                        "psionic-magic": "Psionic Magic",
                        "spectral-magic": "Spectral Magic",
                        "temporal-magic": "Temporal Magic"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Scholar Specialties",
            key: false,
            description: "Gain three new Knowledges of your choice, at the GM's discretion."
        },
        {
            level: 1,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Scholar table.</p>
            <div class="magic-info">
                <h4>5 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="Spectral" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="Temporal" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.scholar",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 6]
                }
            ]
        },
        {
            level: 1,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <p>As a Scholar, your spell studies can include spells from any school of magic.</p>
            <div class="magic-info">
                <h4>5 Common Spells (Level 1)</h4>
            </div>
            `
        },
        {
            level: 2,
            common: "naturalSkillImprovement"
        },
        {
            level: 2,
            id: "scholar.bonus",
            name: "Scholar Bonus",
            key: false,
            description: "Choose two of your magical skills and gain a +1 class bonus to their modifiers.",
            selections: {
                "1.1": {
                    label: "First Choice",
                    options: {
                        "elemental-magic": "Elemental",
                        "divine-magic": "Divine",
                        "physical-magic": "Physical",
                        "psionic-magic": "Psionic",
                        "spectral-magic": "Spectral",
                        "temporal-magic": "Temporal"
                    }
                },
                "1.2": {
                    label: "Second Choice",
                    options: {
                        "elemental-magic": "Elemental",
                        "divine-magic": "Divine",
                        "physical-magic": "Physical",
                        "psionic-magic": "Psionic",
                        "spectral-magic": "Spectral",
                        "temporal-magic": "Temporal"
                    }
                }
            }
        },
        {
            level: 3,
            name: "Prepared Spells",
            key: true,
            description: `<p>You can prepare a certain number of spells each day, allowing you to cast them without using your energy.</p>
            <p>You have a number of leveled Spell Slots that increase with your level according to the Scholar table. Each day, you may prepare one spell in each slot of its level or higher. You may only expend a spell slot to cast the exact spell that has been prepared in it. You may prepare the same spell in multiple slots.</p>
            `,
            actions: [
                {
                    name: "Spell Preparation",
                    images: {
                        base: `${NEWERA.images}/spell-book.png`,
                        left: `${NEWERA.images}/scholar.png`,
                        right: `${NEWERA.images}/ac_adventuring.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `You spend one hour preparing your spells for the day during meditation. Select a spell to prepare in each of your available spell slots. Your selections last until your next full rest.`,
                    difficulty: null,
                    actionType: "E",
                    overrideMacroCommand: `game.newera.HotbarActions.openSpellPreparation()`,
                    rolls: [
                      {
                        label: "Prepare",
                        die: "spell-book",
                        callback: actor => new SpellPreparation(actor).render(true)
                      }
                    ]
                }
            ],
            tableValues: [
                {
                    field: "spellSlots.1",
                    label: "Level 1 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 2, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                },
                {
                    field: "spellSlots.2",
                    label: "Level 2 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 1, 2, 2, 3, 3, 5, 5, 5, 5, 5, 5]
                },
                {
                    field: "spellSlots.3",
                    label: "Level 3 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 5, 5]
                },
                {
                    field: "spellSlots.4",
                    label: "Level 4 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3]
                },
                {
                    field: "spellSlots.5",
                    label: "Level 5 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]
                },
                {
                    field: "spellSlots.6",
                    label: "Level 6 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    field: "spellSlots.7",
                    label: "Level 7 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    field: "spellSlots.8",
                    label: "Level 8 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    field: "spellSlots.9",
                    label: "Level 9 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    field: "spellSlots.10",
                    label: "Level 10 Spell Slots",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ]
        },
        {
            level: 3,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon spell (Level 2 or lower)</h4>
                <h4>3 Common spells (Level 2 or lower)</h4>
            `
        },
        {
            level: 4,
            common: "naturalSkillImprovement"
        },
        {
            level: 4,
            common: "learningExperience"
        },
        {
            level: 5,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon spells (Level 3 or lower)</h4>
                <h4>3 Common spells (Level 3 or lower)</h4>
            `
        },
        {
            level: 6,
            common: "abilityScoreImprovement"
        },
        {
            level: 7,
            common: "specialtyImprovement"
        },
        {
            level: 7,
            common: "learningExperience"
        },
        {
            level: 8,
            key: false,
            name: "Flexible Casting",
            description: `When casting a prepared spell, you can choose to amplify it to an even higher level than the slot it was prepared in. Doing so consumes energy equal to the difference between the amplified spell's cost and the cost to cast the spell at the level of its slot.`
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 9,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare spell (Level 4 or lower)</h4>
                <h4>2 Uncommon spells (Level 4 or lower)</h4>
                <h4>3 Common spells (Level 4 or lower)</h4>
            </div>
            `
        },
        {
            level: 10,
            common: "specialtyImprovement"
        },
        {
            level: 10,
            id: "scholar.bonus",
            name: "Scholar Bonus",
            key: false,
            description: "Choose two of your magical skills and gain a +1 class bonus to their modifiers.",
            selections: {
                "2.1": {
                    label: "First Choice",
                    options: {
                        "elemental-magic": "Elemental",
                        "divine-magic": "Divine",
                        "physical-magic": "Physical",
                        "psionic-magic": "Psionic",
                        "spectral-magic": "Spectral",
                        "temporal-magic": "Temporal"
                    }
                },
                "2.2": {
                    label: "Second Choice",
                    options: {
                        "elemental-magic": "Elemental",
                        "divine-magic": "Divine",
                        "physical-magic": "Physical",
                        "psionic-magic": "Psionic",
                        "spectral-magic": "Spectral",
                        "temporal-magic": "Temporal"
                    }
                }
            }
        },
        {
            level: 11,
            common: "abilityScoreImprovement"
        },
        {
            level: 11,
            name: "Restricted Schools",
            key: false,
            description: "You can choose Restricted spells to learn as part of your Spell Studies."
        },
        {
            level: 11,
            name: "Spell Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare spell (Level 5 or lower)</h4>
                <h4>2 Uncommon spells (Level 5 or lower)</h4>
            </div>
            `
        },
        {
            level: 12,
            name: "Spellcraft",
            key: true,
            description: `<p>You can create your own spells.</p>
            <p>As a Scholar, you can craft spells and simple enchantments. You can prepare your crafted spells in appropriately-leveled spell slots.</p>
            <p>See the <a href="https://www.newerarpg.com/srd/newera-sol366/spellcraft">Spellcraft</a> section of the rulebook for details.</p>`,
            tableValues: {
                field: "spellcraft.scholar",
                label: "Spellcraft Skill Level",
                sign: false,
                values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2]
            }
        },
        {
            level: 13,
            common: "learningExperience"
        },
        {
            level: 13,
            id: "scholar.bonus",
            name: "Scholar Bonus",
            key: false,
            description: "Choose two of your magical skills and gain a +1 class bonus to their modifiers.",
            selections: {
                "3.1": {
                    label: "First Choice",
                    options: {
                        "elemental-magic": "Elemental",
                        "divine-magic": "Divine",
                        "physical-magic": "Physical",
                        "psionic-magic": "Psionic",
                        "spectral-magic": "Spectral",
                        "temporal-magic": "Temporal"
                    }
                },
                "3.2": {
                    label: "Second Choice",
                    options: {
                        "elemental-magic": "Elemental",
                        "divine-magic": "Divine",
                        "physical-magic": "Physical",
                        "psionic-magic": "Psionic",
                        "spectral-magic": "Spectral",
                        "temporal-magic": "Temporal"
                    }
                }
            }
        },
        {
            level: 14,
            common: "naturalSkillImprovement"
        },
        {
            level: 14,
            common: "specialtyImprovement"
        },
        {
            level: 15,
            name: "Spell Studies (6<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Rare spells (Level 6 or lower)</h4>
                <h4>3 Uncommon spells (Level 6 or lower)</h4>
                <h4>3 Common spells (Level 6 or lower)</h4>
            </div>
            `
        },
        {
            level: 15,
            name: "Mindfulness Mastery",
            key: false,
            description: "<p>You can Meditate to learn and prepare spells as a trivial action <i>(You automatically succeed, unless there are unusual circumstances.)</i></p>"
        }
    ],
    artificer: [
        {
            level: 1,
            key: false,
            name: "Enchanting Specialty",
            description: "You gain Enchanting (Spellcasting) as a specialty."
        },
        {
            level: 1,
            key: false,
            id: "artificer.naturalSkills",
            name: "Artificer Natural Skills",
            description: "Choose two of the following natural skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {
                        "technology": "Technology",
                        "medicine": "Medicine",
                        "logic": "Logic",
                        "perception": "Perception",
                        "instinct": "Instinct",
                        "reflex": "Reflex",
                        "sleight-of-hand": "Sleight of Hand"
                    }
                },
                "2": {
                    label: "Second Choice",
                    options: {
                        "technology": "Technology",
                        "medicine": "Medicine",
                        "logic": "Logic",
                        "perception": "Perception",
                        "instinct": "Instinct",
                        "reflex": "Reflex",
                        "sleight-of-hand": "Sleight of Hand"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Artificer table.</p>
            <p>As an Artificer, you learn new spells and enchantments separately. Your Spell Studies and Enchantment Studies features have different sets of allowed magic schools.</p>
            <div class="magic-info">
                <h4>4 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="Spectral" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="Temporal" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.artificer",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5]
                }
            ]
        },
        {
            level: 1,
            name: "Enchantment Studies",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>5 Common Enchantments (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="All Temporal Schools" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 1,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Artificer Spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" data-tooltip="Cryomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 2,
            common: "learningExperience"
        },
        {
            level: 2,
            common: "naturalSkillImprovement"
        },
        {
            level: 3,
            key: true,
            name: "Magical Focus",
            description: `<p>You can create and use a Magical Focus - an enchanted item that you form a unique bond with and can use to assist in casting spells, such as a wand or staff. Charges of spells you cast can be stored in your focus and released at a later time.</p>
            <p>You learn the Create Focus enchantment. The maximum energy capacity of your focus increases with your level according to the Artificer table.</p>`,
            tableValues: [
                {
                    field: "focusEnergy",
                    label: "Focus Energy",
                    sign: false,
                    values: [null, 0, 0, 20, 24, 30, 36, 42, 50, 56, 64, 72, 84, 96, 110, 120]
                }
            ],
            actions: [
                {
                    name: "Spell Storage",
                    images: {
                        base: `${NEWERA.images}/crystal-shine.png`,
                        left: `${NEWERA.images}/artificer.png`,
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `You utilize your Magical Focus to store spells ahead of time. You can cast your stored spells by releasing them from your focus.`,
                    difficulty: null,
                    actionType: "E",
                    overrideMacroCommand: `game.newera.HotbarActions.openSpellStorage()`,
                    rolls: [
                      {
                        label: "Focus",
                        die: "crystal-shine",
                        callback: actor => new SpellFocus(actor).render(true)
                      }
                    ]
                }
            ]
        },
        {
            level: 4,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Artificer Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" data-tooltip="Cryomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 4,
            common: "specialtyImprovement"
        },
        {
            level: 5,
            id: "artificer.bonus",
            key: false,
            name: "Artificer Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "1": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    }
                }
            }
        },
        {
            level: 5,
            name: "Enchantment Studies",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Enchantment (Level 2 or lower)</h4>
                <h4>2 Common Enchantments (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="All Temporal Schools" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 6,
            common: "abilityScoreImprovement"
        },
        {
            level: 7,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Artificer spell (Level 3 or lower)</h4>
                <h4>3 Common Artificer Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" data-tooltip="Cryomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 7,
            name: "Enchantment Studies",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Unommon Enchantments (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="All Temporal Schools" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 8,
            key: false,
            name: "Introduction to Metamagic",
            description: `<p>You gain an introductory knowledge of Metamagic.</p>
            <p>You learn metamagic enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>4 Common Metamagic Enchantments (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/metamagic.png" data-tooltip="Metamagic" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 8,
            key: true,
            name: "Metamagic",
            description: `<p>You can use Metamagic, creating magical artifacts and complex enchantments by working with the magical code that forms the building blocks of the ancient art.</p>
            <p>You may learn Metamagic enchantments and components as part of your future Enchantment Studies.
            `
        },
        {
            level: 8,
            id: "artificer.bonus",
            key: false,
            name: "Artificer Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "2": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    }
                }
            }
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 9,
            common: "specialtyImprovement"
        },
        {
            level: 10,
            common: "learningExperience"
        },
        {
            level: 10,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Artificer Spells (Level 4 or lower)</h4>
                <h4>2 Common Artificer Spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" data-tooltip="Cryomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 4 or lower)</h4>
            </div>
            `
        },
        {
            level: 11,
            common: "abilityScoreImprovement"
        },
        {
            level: 11,
            id: "artificer.bonus",
            key: false,
            name: "Artificer Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "3": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    }
                }
            }
        },
        {
            level: 12,
            name: "Arcane Enchanter",
            key: false,
            description: `<p>You can store Enchantments in your focus.</p><p>Stored enchantments can be released onto targets in-range as a two-frame action and have a range of 20 feet. Any material costs for the enchantment are consumed when the enchantment is stored in your focus.</p>`
        },
        {
            level: 12,
            name: "Enchantment Studies",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Unommon Enchantments (Level 4 or lower)</h4>
                <h4>3 Common Enchantments (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="All Temporal Schools" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 13, 
            common: "naturalSkillImprovement"
        },
        {
            level: 13,
            name: "Spell Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon Artificer Spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" data-tooltip="Cryomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <h4>3 Common spells from any school (Level 5 or lower)</h4>
            </div>
            `
        },
        {
            level: 14,
            common: "learningExperience"
        },
        {
            level: 14,
            common: "specialtyImprovement"
        },
        {
            level: 14,
            id: "artificer.bonus",
            key: false,
            name: "Artificer Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "4": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    }
                }
            }
        },
        {
            level: 15,
            name: "Ætherium Conservation",
            key: false,
            description: `<p>You cast enchantments for half their usual Ætherium costs.`
        },
        {
            level: 15,
            name: "Enchantment Studies",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Enchantment (Level 5 or lower)
                <h4>2 Unommon Enchantments (Level 5 or lower)</h4>
                <h4>2 Common Enchantments (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="All Temporal Schools" data-tooltip-direction="UP" />
            </div>
            `
        }
    ],
    sage: [
        {
            level: 1,
            id: "sage.specialties",
            name: "Sage Specialties",
            key: false,
            description: "Choose two of the following specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {
                        "cooking": "Cooking (Technology)",
                        "wound_treatment": "Wound Treatment (Medicine)",
                        "first_aid": "First Aid (Medicine)",
                        "sense_motive": "Sense Motive (Insight)"
                    }
                },
                "2": {
                    label: "Specialty #2",
                    options: {
                        "cooking": "Cooking (Technology)",
                        "wound_treatment": "Wound Treatment (Medicine)",
                        "first_aid": "First Aid (Medicine)",
                        "sense_motive": "Sense Motive (Insight)"
                    }
                }
            }
        },
        {
            level: 1,
            id: "sage.naturalSkills",
            name: "Sage Natural Skills",
            key: false,
            description: "Choose 3 of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {
                        medicine: "Medicine",
                        insight: "Insight",
                        diplomacy: "Diplomacy",
                        technology: "Technology",
                        deception: "Deception",
                        determination: "Determination",
                        "divine-magic": "Divine Magic",
                        "psionic-magic": "Psionic Magic"
                    }
                },
                "2": {
                    label: "Second Choice",
                    options: {
                        medicine: "Medicine",
                        insight: "Insight",
                        diplomacy: "Diplomacy",
                        technology: "Technology",
                        deception: "Deception",
                        determination: "Determination",
                        "divine-magic": "Divine Magic",
                        "psionic-magic": "Psionic Magic"
                    }
                },
                "3": {
                    label: "Third Choice",
                    options: {
                        medicine: "Medicine",
                        insight: "Insight",
                        diplomacy: "Diplomacy",
                        technology: "Technology",
                        deception: "Deception",
                        determination: "Determination",
                        "divine-magic": "Divine Magic",
                        "psionic-magic": "Psionic Magic"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Alchemist's Craft",
            key: true,
            description: "The Sage specializes in the formulation of complex potions and other alchemical substances. You have a Proficiency Bonus which you can add to checks to brew, prepare, and identify alchemical items. Your bonus increases with your level according to the Sage table.",
            tableValues: [
                {
                    field: "proficiencyBonus.sage",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4]
                }
            ]
        },
        {
            level: 1,
            name: "Basic Alchemy",
            key: false,
            description: "You learn the Standard Basic potion recipes and three Basic alchemy recipes of your choice."
        },
        {
            level: 2,
            common: "learningExperience"
        },
        {
            level: 2,
            id: "sage.bonus",
            key: false,
            name: "Sage Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "1": {
                    label: "Choose a Bonus",
                    options: {
                        passivePerception: "+1 Passive Perception Bonus",
                        alchemy: "Learn 1 additional alchemy recipe of your highest level or lower",
                        spell: "Learn 1 additional common Sage spell of any level"
                    }
                }
            }
        },
        {
            level: 3,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Scholar table.</p>
            <div class="magic-info">
                <h4>3 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="Spectral" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.sage",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 0, 0, 1, 1, 1, 2, 2, 3, 3, 3]
                }
            ]
        },
        {
            level: 3,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Sage Spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/summoning.png" data-tooltip="Summoning" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 4,
            common: "naturalSkillImprovement"
        },
        {
            level: 5,
            name: "Diviner's Sense",
            key: true,
            description: `<p>Sages have a deep spiritual connection to the world of spirits. Using this connection, they can reach out to the spirits for useful information or assistance. Each Sense takes a varying amount of time.</p>
            <p>You may use Diviner's Senses to obtain information during your adventures. You have a limited number of uses of your Diviner's Sense per day according to the Sage table.</p>
            <p>In addition, you may only use each Sense once per day reliably. If you use the same Sense more than once between rests, there is a chance you will instead contact an Evil Spirit and receive the opposite effect instead.</p>`,
            tableValues: [
                {
                    field: "divinersSenses",
                    label: "Diviner's Senses per Day",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3]
                }
            ]
        },
        {
            level: 5,
            key: false,
            name: "Basic Diviner's Senses",
            description: "You learn the three basic Diviner's Senses: Palm Reading, Gaze Into the Beyond, and Portent.",
            actions: [
                {
                    name: "Palm Reading",
                    images: {
                        base: `${NEWERA.images}/palm.png`,
                        left: `${NEWERA.images}/sage.png`,
                        right: `${NEWERA.images}/ac_adventuring.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You spend 15 minutes reading the future of a single willing creature you can touch based on the palms of their hands. Ask the GM a single, specific question about that creature.
                    <ul type="none">
                        <li><img class="resource-icon" src="${NEWERA.images}/divine.png" />: The GM offers a truthful, though indirect, reply, such as a short cryptic phrase or omen.</li>
                        <li><img class="resource-icon" src="${NEWERA.images}/spectral.png" />: You receive a random or inaccurate reply.</li>
                    </ul>
                </p>`,
                    difficulty: null,
                    actionType: "E",
                    rolls: [
                      {
                        label: "Activate",
                        die: "palm",
                        difficulty: null,
                        message: "{NAME} uses Palm Reading."
                      }
                    ]
                },
                {
                    name: "Gaze Into the Beyond",
                    images: {
                        base: `${NEWERA.images}/fire-iris.png`,
                        left: `${NEWERA.images}/sage.png`,
                        right: `${NEWERA.images}/ac_adventuring.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You spend 30 minutes to contact the spririt world for guidance. Ask the GM a single, specific question about a current objective or anticipated event.
                    <ul type="none">
                        <li><img class="resource-icon" src="${NEWERA.images}/divine.png" />: The GM offers a truthful, though indirect, reply, such as a short cryptic phrase or omen.</li>
                        <li><img class="resource-icon" src="${NEWERA.images}/spectral.png" />: You receive a random or inaccurate reply.</li>
                    </ul>
                </p>`,
                    difficulty: null,
                    actionType: "E",
                    rolls: [
                      {
                        label: "Activate",
                        die: "fire-iris",
                        difficulty: null,
                        message: "{NAME} uses Gaze Into the Beyond."
                      }
                    ]
                },
                {
                    name: "Portent",
                    images: {
                        base: `${NEWERA.images}/sparkles.png`,
                        left: `${NEWERA.images}/sage.png`,
                        right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You use your senses to gain useful insights about a person or your surroundings. Use this Sense when making a Wisdom-based ability or skill check or a Spellcasting skill check, prior to rolling. This is a free action that can't be reacted to or detected by other creatures.
                    <ul type="none">
                        <li><img class="resource-icon" src="${NEWERA.images}/divine.png" />: You gain a +5 bonus to the result.</li>
                        <li><img class="resource-icon" src="${NEWERA.images}/spectral.png" />: You take a -5 penalty to the result.</li>
                    </ul>
                </p>`,
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Activate",
                        die: "sparkles",
                        difficulty: null,
                        message: "{NAME} uses Portent."
                      }
                    ]
                },
            ]
        },
        {
            level: 6,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Sage Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/summoning.png" data-tooltip="Summoning" data-tooltip-direction="UP" />
                <h4>1 Common spell from any school (Level 2 or lower)</h4>
            </div>
            `
        },
        {
            level: 6,
            name: "Apprentice Alchemy",
            key: false,
            description: "You learn the Standard Apprentic potion recipes and three Apprentice alchemy recipes of your choice. You automatically learn any spells that are required for these recipes."
        },
        {
            level: 7,
            common: "abilityScoreImprovement"
        },
        {
            level: 8,
            common: "specialtyImprovement"
        },
        {
            level: 8,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Uncommon Sage Spell (Level 3 or lower)
                <h4>2 Common Sage Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/summoning.png" data-tooltip="Summoning" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 9,
            id: "sage.bonus",
            key: false,
            name: "Sage Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "2": {
                    label: "Choose a Bonus",
                    options: {
                        passivePerception: "+1 Passive Perception Bonus",
                        alchemy: "Learn 1 additional alchemy recipe of your highest level or lower",
                        spell: "Learn 1 additional common Sage spell of any level"
                    }
                }
            }
        },
        {
            level: 10,
            key: true,
            name: "Soulbonding",
            description: `Your Soulbonding ability allows you to use your spells to affect creatures based on your level of connection to them, instead of physical range.
            <p>Whenever you cast a spell with the Targeting keyword or with a range of Touch, instead of its normal targeting rules, you can have it target an ally or any creature that counts you as a Companion (a +6 or higher Relationship). You don't need to be able to see or even know the whereabouts of a creature you target this way, and they can be any distance from you, as long as they're on the same plane of reality.</p>
            <p>Spells cast using Soulbonding are cast 2 levels lower.</p>`
        },
        {
            level: 10,
            key: false,
            name: "Voice of the Soul",
            description: "This Diviner's Sense allows you to communicate with Soulbound creatures across any distance.",
            actions: [
                {
                    name: "Voice of the Soul",
                    images: {
                        base: `${NEWERA.images}/relationship-bounds.png`,
                        left: `${NEWERA.images}/sage.png`,
                        right: `${NEWERA.images}/ac_social.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You use your senses to reach out across another reality to contact someone you hold close. Choose a teammate or someone who has a Companion (+6) or higher relationship with you.
                    <ul type="none">
                        <li><img class="resource-icon" src="${NEWERA.images}/divine.png" />: If the target is willing, you immediately learn their whereabouts and their general condition, and you may communicate both ways with the target for up to ten minutes.</li>
                        <li><img class="resource-icon" src="${NEWERA.images}/spectral.png" />: You receive inaccurate information and may receive false messages from a meddling spirit impersonating the target.</li>
                    </ul>
                </p>`,
                    difficulty: null,
                    actionType: "E",
                    rolls: [
                      {
                        label: "Activate",
                        die: "relationship-bounds",
                        difficulty: null,
                        message: "{NAME} uses Voice of the Soul."
                      }
                    ]
                },
            ]
        }
    ],
    witch: [
        {
            level: 1,
            id: "witch.specialties",
            name: "Witch Specialties",
            key: false,
            description: "Choose two of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {
                        "animal-handling": "Animal Handling (Wisdom)",
                        "cooking": "Cooking (Technology)",
                        "frightening": "Frightening (Intimidation)",
                        "first-aid": "First Aid (Medicine)",
                        "impersonation": "Impersonation (Performance)",
                        "tracking": "Tracking (Instinct)"
                    }
                },
                "2": {
                    label: "Specialty #2",
                    options: {
                        "animal-handling": "Animal Handling (Wisdom)",
                        "cooking": "Cooking (Technology)",
                        "frightening": "Frightening (Intimidation)",
                        "first-aid": "First Aid (Medicine)",
                        "impersonation": "Impersonation (Performance)",
                        "tracking": "Tracking (Instinct)"
                    }
                }
            }
        },
        {
            level: 1,
            id: "witch.naturalSkills",
            name: "Witch Natural Skills",
            key: false,
            description: "Choose three of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {
                        "performance": "Performance",
                        "logic": "Logic",
                        "insight": "Insight",
                        "instinct": "Instinct",
                        "medicine": "Medicine",
                        "spectral-magic": "Spectral Magic"
                    }
                },
                "2": {
                    label: "Second Choice",
                    options: {
                        "performance": "Performance",
                        "logic": "Logic",
                        "insight": "Insight",
                        "instinct": "Instinct",
                        "medicine": "Medicine",
                        "spectral-magic": "Spectral Magic"
                    }
                },
                "3": {
                    label: "Third Choice",
                    options: {
                        "performance": "Performance",
                        "logic": "Logic",
                        "insight": "Insight",
                        "instinct": "Instinct",
                        "medicine": "Medicine",
                        "spectral-magic": "Spectral Magic"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Scholar table.</p>
            <div class="magic-info">
                <h4>4 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="Spectral" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.witch",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4]
                }
            ]
        },
        {
            level: 1,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>4 Common Witch Spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 2,
            common: "learningExperience"
        },
        {
            level: 2,
            common: "naturalSkillImprovement"
        },
        {
            level: 3,
            id: "witch.archetype",
            name: "Familiar",
            key: false,
            description: `<p>You can summon a Familiar, a guardian spirit that takes the form of a spectral animal.</p>
            <p>Choose your familiar's form from the list below. You learn the innate Summon Familiar spell.</p>
            `,
            selections: {
                "1": {
                    label: "Choose a Familiar",
                    options: {
                        "raven": "Raven",
                        "snake": "Snake",
                        "cat": "Cat",
                        "hawk": "Hawk",
                        "wolf": "Wolf",
                        "spider": "Spider",
                        "owl": "Owl",
                        "bear": "Bear"
                    }
                }
            }
        },
        {
            level: 3,
            archetype: "raven",
            key: true,
            name: "Raven Familiar",
            description: `<p>Your familiar takes the form of a raven, crow, or parrot, giving it exceptional intelligence for an animal and the ability to mimic sounds and speech.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28]
                }
            ]
        },
        {
            level: 3,
            archetype: "snake",
            key: true,
            name: "Snake Familiar",
            description: `<p>Your familiar takes the form of a snake, giving it the ability to sneak through almost any space.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28]
                }
            ]
        },
        {
            level: 3,
            archetype: "wolf",
            key: true,
            name: "Wolf Familiar",
            description: `<p>Your familiar takes the form of a wolf, a pack hunter with keen senses and protective instincts.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28]
                }
            ]
        },
        {
            level: 3,
            archetype: "hawk",
            key: true,
            name: "Hawk Familiar",
            description: `<p>Your familiar takes the form of a hawk, eagle, or falcon, giving it fast flight and a powerful talon attack.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28]
                }
            ]
        },
        {
            level: 3,
            archetype: "bear",
            key: true,
            name: "Bear Familiar",
            description: `<p>Your familiar takes the form of a bear, giving it immense size and powerful attacks.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28]
                }
            ]
        },
        {
            level: 3,
            archetype: "spider",
            key: true,
            name: "Spider Familiar",
            description: `<p>Your familiar takes the form of a spider, giving it exceptional dexterity and the ability to squeeze through extremely small spaces.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28]
                }
            ]
        },
        {
            level: 3,
            archetype: "cat",
            key: true,
            name: "Cat Familiar",
            description: `<p>Your familiar takes the form of a cat, giving it keen senses, fast reflexes, and deadly claws.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28]
                }
            ]
        },
        {
            level: 3,
            archetype: "owl",
            key: true,
            name: "Owl Familiar",
            description: `<p>Your familiar takes the form of an owl, a deadly and silent nocturnal hunter.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28]
                }
            ]
        },
        {
            level: 4,
            common: "specialtyImprovement"
        },
        {
            level: 4,
            id: "witch.bonus",
            name: "Witch Bonus",
            key: false,
            description: "Choose one of the following bonuses.",
            selections: {
                "1": {
                    label: "Choose a bonus",
                    options: {
                        "extraSpell": "Learn 1 Common spell of any school",
                        "extraPotion": "Learn 1 Common potion recipe",
                    }
                }
            }
        },
        {
            level: 5,
            common: "learningExperience"
        },
        {
            level: 5,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Witch Spells (Level 2 or lower)</h4>
                <h4>2 Common Witch spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
            </div>
            `
        },
        {
            level: 6,
            common: "abilityScoreImprovement"
        },
        {
            level: 6,
            key: false,
            name: "Spiritual Connection",
            description: "Your familiar's turn length increases to 2 frames."
        },
        {
            level: 7,
            key: true,
            name: "Dark Energy",
            description: `<p>You have a reserve of Dark Energy. This is a special magical energy pool that is shared between you and nearby allies. Whenever any allied creature within 30 feet casts a spell, they may use your dark energy to cover some or all of the spell's energy cost. You control which creatures have access to your dark energy.</p>
            <p>Your Dark Energy increases with your level according to the Witch table, and is separate from your normal energy pool which increases with your caster level as normal.</p>`,
            tableValues: [
                {
                    field: "darkEnergy",
                    label: "Max. Dark Energy",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 15, 20, 25, 40, 45, 50, 55, 60, 65]
                }
            ],
            actions: [
                {
                    name: "Dark Energy",
                    images: {
                        base: `${NEWERA.images}/dark-energy.png`,
                        left: `${NEWERA.images}/witch.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                        Display the status of your Dark Energy pool. Allies you've given the ability to use your energy can also use this action to view how much is remaining.
                    </p>`,
                    difficulty: null,
                    actionType: "0",
                    overrideMacroCommand: "game.newera.HotbarActions.displayDarkEnergy()",
                    rolls: [
                      {
                        label: "Open",
                        die: "dark-energy",
                        callback: actor => new DarkEnergySheet(actor).render(true) 
                      }
                    ]
                },
                {
                    name: "Grant Dark Energy Powers",
                    images: {
                        base: `${NEWERA.images}/linked-rings.png`,
                        left: `${NEWERA.images}/witch.png`,
                        right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>You grant an ally the power to draw from your Dark Energy pool when casting spells.</p>
                    <p>Select an allied creature's token on the map, then click Grant.</p>`,
                    difficulty: null,
                    actionType: "0",
                    overrideMacroCommand: null,
                    rolls: [
                        {
                            label: "Grant",
                            die: "linked-rings",
                            callback: actor => Witch.grantDarkEnergyToSelectedToken(actor)
                        }
                    ]
                }
            ]
        },
        {
            level: 8,
            common: "naturalSkillImprovement"
        },
        {
            level: 8,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon Witch Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 3 or lower)</h4>
            </div>
            `
        },
        {
            level: 9,
            common: "specialtyImprovement"
        },
        {
            level: 9,
            archetype: "raven",
            key: false,
            name: "Mimicry",
            description: `<p>Your familiar can mimic and repeat sounds it hears. It gains the Mimic Sound action.</p>
            <p>Ravens can mimic short sounds, such as cell phone ringtones and the calls of other creatures. It can also mimic and repeat human speech, in single words or short phrases up to five words in length.</p>`
        },
        {
            level: 9,
            archetype: "snake",
            key: false,
            name: "Venom",
            description: "Your familiar can Envenomate targets when summoned at level 9 or higher. This attack inflicts the Poisoned status effect and always hits when the familiar has already grappled a creature."
        },
        {
            level: 9,
            archetype: "bear",
            key: false,
            name: "Mount",
            description: `<p>Your familiar can act as a mount. The number and total size of creatures it can carry increases with its summon level.</p>
            <p>If a creature other than you mounts your familiar, you can willingly give that creature control of the familiar as an action. That creature retains control of the familiar on its turn until they dismount.</p>`
        },
        {
            level: 9,
            archetype: "cat",
            key: false,
            name: "Night Hunter",
            description: "Your familiar gains the Stealth, Athletics, and Agility skills with a level of 1 each."
        },
        {
            level: 9,
            archetype: "owl",
            key: false,
            name: "Ambush Predator",
            description: "Your familiar gains the Stealth skill with a level of 1, and it doesn't make any sound while flying. Creatures must succeed on a difficulty 12 Sight (Perception) check in order to react to the familiar's attack."
        },
        {
            level: 9,
            archetype: "spider",
            key: false,
            name: "Tarantula",
            description: `<p>You can summon your Spider familiar in Giant form by casting Summon Familiar one amplification level higher.</p>
            <p>The Giant spider gains a +5 Size bonus, a +6 Speed bonus, and a basic 1d6 Bite attack.</p>`
        },
        {
            level: 9,
            archetype: "wolf",
            key: false,
            name: "Takedown",
            description: "Your familiar's maximum Long Jump distance increases to 20 feet. If your familiar lands a Tackle attack immediately following a Long Jump, the attack deals an extra 1d6 damage and knocks the target prone."
        },
        {
            level: 9,
            archetype: "hawk",
            key: false,
            name: "Diving Attack",
            description: "Your familiar gains a powerful diving talon attack. Whenever it strikes a target with its talons while Diving, it deals +1d damage and the target has disadvantage on any reactions to the attack."
        },
        {
            level: 10,
            key: false,
            name: "Familiar Focus",
            description: `<p>Your familiar can cast spells.</p>
            <p>You can cast any spell you know through your Familiar, but it can't be amplified and it must draw from your Dark Energy. The cast difficulty of the spell is the same as it would be for you to cast it. Spells cast through your familiar that have a range of Self affect your familiar.</p>`
        },
        {
            level: 10,
            common: "learningExperience"
        },
        {
            level: 11,
            common: "abilityScoreImprovement"
        },
        {
            level: 12,
            name: "Spiritual Connection",
            key: false,
            description: `<p>Your Familiar's turn lengthy increases to 3 action frames.</p>`
        },
        {
            level: 12,
            common: "naturalSkillImprovement"
        },
        {
            level: 13,
            archetype: "raven",
            name: "Object Searching",
            key: false,
            description: "Your Raven familiar gains a +5 bonus to Perception checks involving sight. You can command your familiar to search for a specific object and retrieve it."
        },
        {
            level: 13,
            archetype: "snake",
            name: "In Many Sizes",
            key: false,
            description: "When you summon your Snake familiar, you can choose any size from -9 to +2 for it to take. When summoned with Summon Familiar IV or higher, your familiar gains a Constricting attack."
        },
        {
            level: 13,
            archetype: "cat",
            name: "Double Jump",
            key: false,
            description: "When summoned with Summon Familiar IV or higher, its base Jump distance increases to 20 feet laterally and 10 feet vertically. When your familiar Jumps, it can Jump again as a reaction before landing."
        },
        {
            level: 13,
            archetype: "hawk",
            name: "Intimidating Screech",
            key: false,
            description: "Your Hawk familiar can use a loud screeching call to frighten enemies. It gains the Frighten action and a +2 Intimidation skill."
        },
        {
            level: 13,
            archetype: "wolf",
            name: "Mount",
            key: false,
            description: "Your Wolf familiar gains the ability to be mounted. It can only be controlled by you and can't carry additional riders."
        },
        {
            level: 13,
            archetype: "spider",
            name: "Ensnaring Web",
            key: false,
            description: "Your Spider familiar can spin webs to ensnare enemies. Creatures are either restrained or staggered when they move through the web, depending on their size."
        },
        {
            level: 13,
            archetype: "owl",
            name: "Diving Talon Attack",
            key: false,
            description: "Your Owl familiar gains a Dive action. Its Fly speed is doubled while diving, and its Talon attack deals +1d damage while diving."
        },
        {
            level: 13,
            archetype: "bear",
            name: "Protective Companion",
            key: false,
            description: "Your familiar gains a reaction frame and the Protect Ally action."
        },
        {
            level: 13,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>4 Uncommon Witch Spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 4 or lower)</h4>
            </div>
            `
        },
        {
            level: 14,
            common: "specialtyImprovement"
        },
        {
            level: 14,
            id: "witch.bonus",
            name: "Witch Bonus",
            key: false,
            description: "Choose one of the following bonuses.",
            selections: {
                "2": {
                    label: "Choose a bonus",
                    options: {
                        "extraSpell": "Learn 1 Common spell of any school",
                        "extraPotion": "Learn 1 Common potion recipe",
                    }
                }
            }
        },
        {
            level: 15,
            name: "Collective Might",
            key: false,
            description: `<p>Whenever a spell is cast using your Dark Energy, another creature in range can assist on the spellcasting check. That creature has disadvantage unless they also know the spell being cast.</p><p>Spells cast with assistance using this ability are automatically amplified to the next-highest factor.</p>`
        }
    ],
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