import { NEWERA } from "../config.mjs";

export class Ranger {

    static classFeatures = [
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
                    values: [null, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6]
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
                    values: [null, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["ranger"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
        },
        {
            level: 7,
            name: "Deadeye",
            key: true,
            description: `<p>You can Take Aim for up to five frames before firing a shot with any ranged weapon or spell.</p>
            <p>Each frame adds +1 to your attack roll and increases the damage according to the Ranger table.</p>
            <p>You're preoccupied while Taking Aim.</p>`,
            tableValues: [
                {
                    field: "deadeyeDamage",
                    label: "Damage per Frame",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4]
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["ranger"],
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    lists: ["ranger"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["ranger"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                }
            ]
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
        },
        {
            level: 16,
            id: "ranger.specialties",
            name: "Ranger Specialty",
            key: false,
            description: "Choose an additional Specialty.",
            selections: {
                "6": {
                    label: "Specialty #6",
                    options: {navigation: "Navigation (Instinct)", tracking: "Tracking (Instinct)", "animal-handling": "Animal Handling (Instinct)", time: "Time (Instinct)", weather: "Weather (Instinct)", archery: "Archery (Marksmanship)", crossbow: "Crossbows (Marksmanship)", rifle: "Rifles (Marksmanship)", crafting: "Crafting (Marksmanship)", cooking: "Cooking (Technology)", alchemy: "Alchemy (Technology)", climbing: "Climbing (Athletics)", swimming: "Swimming (Athletics)"}
                }
            }
        },
        {
            level: 16,
            common: "naturalSkillImprovement"
        },
        {
            level: 17,
            common: "specialtyImprovement"
        },
        {
            level: 17,
            id: "ranger.bonus",
            name: "Ranger Bonus",
            key: false,
            description: "Choose one of the following bonuses.",
            selections: {
                "3": {
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
            level: 18,
            common: "abilityScoreImprovement"
        },
        {
            level: 18,
            name: "Combat Expert",
            key: false,
            description: "Your Turn Length increases by 1 frame."
        },
        {
            level: 19,
            common: "naturalSkillImprovement"
        },
        {
            level: 19,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon Ranger spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 2,
                    lists: ["ranger"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                }
            ]
        },
        {
            level: 20,
            name: "Lethal Shot",
            key: false,
            modifies: "Hunter's Focus",
            description: `<p>Called shots against your Prey don't take an additional frame.</p>
            <p>If your Prey is immobilized, incapacitated, or didn't move during its most recent turn, you have a +10 bonus to hit.</p>`
        }
    ]

    static async markCurrentTargetAsPrey(ranger){
        //Get the targeted token

    }

    static async markPrey(actor, target){
        if (actor.system.prey){
            if (game.combat){
                //TODO check if the current prey is dead
                ui.notifications.warn("You can't change prey during combat.");
            }
            if (target.id == actor.system.prey){
                ui.notifications.warn("You have already marked this creature as your Prey.");
                return;
            }
            const preyEffect = game.actors.get(actor.system.prey).effects.find(e => e.name == "Prey" && e.origin == actor.name);
            if (preyEffect) preyEffect.delete();
        }

        const preyBonus = actor.system.tableValues.preyBonus || 1;

        target.createEmbeddedDocuments('ActiveEffect', [{
            label: "Prey",
            img: `${NEWERA.images}/mark-target.png`,
            origin: actor.name,
            description: `<p>You've been marked as Prey by ${actor.name}.</p>
            <p>${actor.system.pronouns.subjective.toUpperCase()} gets a +${preyBonus} bonus to attacks against you.</p>
            `
        }]);

        actor.update({
            system: {
                prey: target.id
            }
        });

        actor.actionMessage(actor.img, `${NEWERA.images}/ranger.png`, "{NAME} marks {0} as {d} prey!", target.name);
    }

    static async removePrey(actor){
        if (actor.system.prey){
            const preyEffect = game.actors.get(actor.system.prey).effects.find(e => e.name == "Prey" && e.origin == actor.id);

        }
    }

}