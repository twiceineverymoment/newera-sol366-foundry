/* Contains class-specific ability functions for the Mercenary. */

import { NEWERA } from "../config.mjs";
import { Actions } from "../macros/actions.mjs";

export class Mercenary {

    static hitPointIncrement = {
        roll: `1d12`,
        average: 7
    }

    static classFeatures = [
        {
            level: 1,
            id: "mercenary.specialties",
            name: "Mercenary Specialties",
            key: false,
            description: "Choose two of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {blocking: "Blocking (Defense)", protection: "Protection (Defense)", swordsOneHanded: "Swords (One-Handed)", swordsTwoHanded: "Swords (Two-Handed)", axes: "Axes", bluntWeapons: "Blunt Weapons"},
                    onChange: (actor, from, to) => actor.setSpecialtyFeature(from, to)
                },
                "2": {
                    label: "Specialty #2",
                    options: {blocking: "Blocking (Defense)", protection: "Protection (Defense)", swordsOneHanded: "Swords (One-Handed)", swordsTwoHanded: "Swords (Two-Handed)", axes: "Axes", bluntWeapons: "Blunt Weapons"},
                    onChange: (actor, from, to) => actor.setSpecialtyFeature(from, to)
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
                    options: {defense: "Defense", "two-handed": "Two-Handed", athletics: "Athletics", "one-handed": "One-Handed", intimidation: "Intimidation", instinct: "Instinct", endurance: "Endurance", determination: "Determination"},
                    onChange: (actor, from, to) => actor.setNaturalSkill(from, to)
                },
                "2": {
                    label: "Second Choice",
                    options: {defense: "Defense", "two-handed": "Two-Handed", athletics: "Athletics", "one-handed": "One-Handed", intimidation: "Intimidation", instinct: "Instinct", endurance: "Endurance", determination: "Determination"},
                    onChange: (actor, from, to) => actor.setNaturalSkill(from, to)
                },
                "3": {
                    label: "Third Choice",
                    options: {defense: "Defense", "two-handed": "Two-Handed", athletics: "Athletics", "one-handed": "One-Handed", intimidation: "Intimidation", instinct: "Instinct", endurance: "Endurance", determination: "Determination"},
                    onChange: (actor, from, to) => actor.setNaturalSkill(from, to)
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
                    values: [null, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
                    onUpdate: (actor, from, to) => actor.updateResourceByName("Rage", {
                        max: to
                    })
                }
            ],
            onUnlock: (actor) => {
                actor.addResource({
                    name: "Rage",
                    value: 1,
                    max: 1,
                    daily: true
                });
            }
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
            common: "specialtyImprovement"
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
                    options: {raider: "Raider", enforcer: "Enforcer", woodsman: "Woodsman", warrior: "Warrior"},
                    onChange: (actor, oldValue, newValue) => actor.unlockArchetypeFeatures("mercenary", newValue, 4)
                }
            }
        },
        {
            level: 4,
            archetype: "raider",
            name: "Raider Archetype",
            key: true,
            retroactiveUnlock: true,
            description: "Add your proficiency bonus to one-handed attack checks with swords, and to Block and Protect Ally checks using shields. One-handed sword attacks deal additional damage equal to your Proficiency Damage Bonus.",
            tableValues: [
                {
                    field: "proficiencyBonus.mercenary.raider",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5]
                },
                {
                    field: "proficiencyDamageBonus.raider",
                    label: "Proficiency Damage Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9]
                }
            ]
        },
        {
            level: 4,
            archetype: "enforcer",
            name: "Enforcer Archetype",
            key: true,
            retroactiveUnlock: true,
            description: "Add your proficiency bonus to attack rolls with a Baton, Club, Crowbar, Hammer, Sledgehammer, or improvised blunt weapon. These weapons deal additional damage equal to your Proficiency Damage Bonus.",
            tableValues: [
                {
                    field: "proficiencyBonus.mercenary.enforcer",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5]
                },
                {
                    field: "proficiencyDamageBonus.enforcer",
                    label: "Proficiency Damage Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9]
                }
            ]
        },
        {
            level: 4,
            archetype: "woodsman",
            name: "Woodsman Archetype",
            key: true,
            retroactiveUnlock: true,
            description: "Add your proficiency bonus to one-handed attack checks with Hatchets, Axes, and Battle Axes. These attacks deal additional damage equal to your Proficiency Damage Bonus.",
            tableValues: [
                {
                    field: "proficiencyBonus.mercenary.woodsman",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5]
                },
                {
                    field: "proficiencyDamageBonus.woodsman",
                    label: "Proficiency Damage Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9]
                }
            ]
        },
        {
            level: 4,
            archetype: "warrior",
            name: "Warrior Archetype",
            key: true,
            retroactiveUnlock: true,
            description: "Add your proficiency bonus to two-handed attack checks with any weapon. Two-handed attacks deal additional damage equal to your Proficiency Damage Bonus.",
            tableValues: [
                {
                    field: "proficiencyBonus.mercenary.warrior",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5]
                },
                {
                    field: "proficiencyDamageBonus.warrior",
                    label: "Proficiency Damage Bonus",
                    sign: true,
                    values: [null, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9]
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
            onUnlock: (actor) => {
                actor.update({
                    system: {
                        armor: {
                            bonus: actor.system.armor.bonus + 1
                        }
                    }
                });
            },
            selections: {
                "1.bonus": {
                    label: "Choose a Bonus",
                    options: {speed: "+1 Speed", initiative: "+1 Initiative Modifier", specialty: "Specialty Improvement"},
                    onChange: (actor, from, to) => Mercenary.bonus(actor, "1", from, to)
                },
                "1.specialty": {
                    label: "Choose a Specialty",
                    showWhen: (actor) => actor.system.classes.mercenary.bonus["1"].bonus == "specialty",
                    dynamicOptions: actor => actor.getSpecialtyImprovementOptions(),
                    onChange: (actor, from, to) => actor.setSpecialtyImprovement(from, to)
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
                    values: [null, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4],
                    onUpdate: (actor, from, to) => {
                        actor.setCasterLevel(from, to, true);
                    }
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 1,
                    lists: ["mercenary"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
        },
        {
            level: 8,
            archetype: "raider",
            key: false,
            retroactiveUnlock: true,
            name: "Protector",
            description: "Shields you use gain a +3 bonus to their Shield Rating."
        },
        {
            level: 8,
            archetype: "enforcer",
            key: false,
            retroactiveUnlock: true,
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
            retroactiveUnlock: true,
            name: "Danger Sense",
            description: `<p>While adventuring, you and all companions travelling with you have advantage on  Reflex saves and  Instinct skill checks. In  combat, you have advantage on initiative rolls.`
        },
        {
            level: 8,
            archetype: "warrior",
            key: false,
            retroactiveUnlock: true,
            name: "Armor Proficiency",
            description: "Add your proficiency bonus to the armor rating of equipped armor items you're wearing."
        },
        {
            level: 8,
            common: "specialtyImprovement"
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["mercenary"],
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
        },
        {
            level: 12,
            name: "Combat Expert",
            key: false,
            description: "Your Turn Length increases by 1 frame and 1 reaction frame.",
            onUnlock: (actor) => actor.increaseBaseTurnLength(1, 1)
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
            onUnlock: (actor) => {
                actor.update({
                    system: {
                        armor: {
                            bonus: actor.system.armor.bonus + 1
                        }
                    }
                });
            },
            selections: {
                "2.bonus": {
                    label: "Choose a Bonus",
                    options: {speed: "+1 Speed", initiative: "+1 Initiative Modifier", specialty: "Specialty Improvement"},
                    onChange: (actor, from, to) => Mercenary.bonus(actor, "2", from, to)
                },
                "2.specialty": {
                    label: "Choose a Specialty",
                    showWhen: (actor) => actor.system.classes.mercenary.bonus["2"].bonus == "specialty",
                    dynamicOptions: actor => actor.getSpecialtyImprovementOptions(),
                    onChange: (actor, from, to) => actor.setSpecialtyImprovement(from, to)
                }
            }
        },
        {
            level: 15,
            archetype: "raider",
            name: "Flanking",
            key: false,
            retroactiveUnlock: true,
            description: `<p>You and an ally can flank enemies to gain advantage on your attacks.</p>
            <p>An enemy is flanked whenever you and an ally are positioned within reach of it on opposite sides. Attacks against flanked enemies have advantage.</p>`
        },
        {
            level: 15,
            archetype: "enforcer",
            name: "Juggernaut",
            key: false,
            retroactiveUnlock: true,
            description: `<p>While Raging, you have Resistance 2 against physical damage (Piercing, Bludgeoning, and Slashing.)`
        },
        {
            level: 15,
            archetype: "woodsman",
            name: "Shield-Breaker",
            key: false,
            retroactiveUnlock: true,
            description: `<p>Your two-handed attacks with axes or battle-axes always cause armor to take a durability check.</p>
            <p>If these attacks hit a shield, excess damage is dealt to the target and the shield always takes a durability check.</p>`
        },
        {
            level: 15,
            archetype: "warrior",
            name: "Focused Attack",
            key: false,
            retroactiveUnlock: true,
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    lists: ["mercenary"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["mercenary"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                }
            ]
        },
        {
            level: 16,
            archetype: "raider",
            retroactiveUnlock: true,
            name: "Savage Raider",
            key: false,
            modifies: "Rage",
            description: "When using one-handed swords while Raging, your rage damage bonus increases to +2d."
        },
        {
            level: 16,
            archetype: "enforcer",
            retroactiveUnlock: true,
            name: "Savage Enforcer",
            key: false,
            modifies: "Rage",
            description: "When using blunt weapons while Raging, your rage damage bonus increases to +2d."
        },
        {
            level: 16,
            archetype: "woodsman",
            retroactiveUnlock: true,
            name: "Savage Woodsman",
            key: false,
            modifies: "Rage",
            description: "When using axes while Raging, your rage damage bonus increases to +2d."
        },
        {
            level: 16,
            archetype: "warrior",
            retroactiveUnlock: true,
            name: "Savage Warrior",
            key: false,
            modifies: "Rage",
            description: "When using two-handed swords while Raging, your rage damage bonus increases to +2d."
        },
        {
            level: 17,
            common: "abilityScoreImprovement"
        },
        {
            level: 18,
            common: "naturalSkillImprovement"
        },
        {
            level: 18,
            common: "learningExperience"
        },
        {
            level: 19,
            common: "specialtyImprovement"
        },
        {
            level: 19,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Mercenary spells (Level 4 or lower)</h4>
                <h4>2 Common Mercenary spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" data-tooltip="Lithomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/abjuration.png" data-tooltip="Anjuration" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["mercenary"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["mercenary"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                }
            ]
        },
        {
            level: 20,
            name: "Combat Master",
            key: false,
            modifies: "Combat Expert",
            description: `<p>You've mastered the art of battle. Your turn length increases by one frame.</p><p>During your turn you may Stay On Guard. If you do, your turn ends and any unused frames become reaction frames until the start of your next turn.</p>`,
            actions: [
                {
                    name: "Stay On Guard",
                    images: {
                        base: `${NEWERA.images}/armor-upgrade.png`,
                        left: `${NEWERA.images}/mercenary.png`,
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You keep watch for incoming threats. Your turn ends, and you gain reaction frames equal to the number of unused frames left in your turn. Extra reaction frames are lost if they aren't used before your next turn.</p>",
                    overrideMacroCommand: "game.newera.HotbarActions.stayOnGuard()",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Activate",
                        die: "armor-upgrade",
                        callback: (actor) => Actions.printAbilityInfo(actor, {
                            title: "Stay On Guard",
                            img: `${NEWERA.images}/armor-upgrade.png`,
                            details: "You keep watch for incoming threats. Your turn ends, and you gain reaction frames equal to the number of unused frames left in your turn. Extra reaction frames are lost if they aren't used before your next turn."
                        })
                      }
                    ]
                }
            ],
            onUnlock: (actor) => actor.increaseBaseTurnLength(1, 0)
        }
    ]
    
    static classFeats = {}

    static archetypeSelectionLevels = {
        1: 4
    }

    static async bonus(actor, bonusNumber, from, to){
        const update = {
            speed: {},
            initiative: {}
        };
        if (from == "speed"){
            update.speed.bonus = actor.system.speed.bonus - 1;
        } else if (from == "initiative"){
            update.initiative.bonus = actor.system.initiative.bonus - 1;
        } else if (from == "specialty"){ //Try to clear the specialty improvement when the bonus is removed
            try {
                const specialty = actor.system.classes.mercenary.bonus[bonusNumber].specialty;
                if (specialty !== undefined){
                    await actor.setSpecialtyImprovement(specialty, "");
                }
            } catch (err) {}
        }

        if (to == "speed"){
            update.speed.bonus = actor.system.speed.bonus + 1;
            ui.notifications.info(`${actor.name} has gained a +1 Speed bonus.`);
        } else if (to == "initiative"){
            update.initiative.bonus = actor.system.initiative.bonus + 1;
            ui.notifications.info(`${actor.name} has gained a +1 Initiative bonus.`);
        } else if (to == "specialty"){ //Re-activate the specialty improvement if already chosen (This is a serious edge case, but it can happen)
            try {
                const specialty = actor.system.classes.mercenary.bonus[bonusNumber].specialty;
                if (specialty !== undefined){
                    await actor.setSpecialtyImprovement("", specialty);
                }
            } catch (err) {}
        }
        await actor.update({system: update});
    }

    static async rage(actor){
        const rageResource = Object.entries(actor.system.additionalResources).find(r => r[1].name == "Rage");
        const isSavageFighter = actor.getClassLevel("mercenary") >= 16;
        if (rageResource && rageResource[1].value > 0){
            actor.actionMessage(actor.img, null, "{NAME} is becoming enraged!");
            actor.createEmbeddedDocuments('ActiveEffect', [{
                label: "Rage" + (isSavageFighter ? " (Savage)" : ""),
                img: `${NEWERA.images}/fire-dash.png`,
                description: `<p>Your physical abilities are enhanced at the cost of reduced presence of mind. Your Rage ends at the end of combat, or at the end of your turn if you did not attempt an attack during that turn.</p>
                <ul>
                    <li>Your Speed is increased by 4 feet.</li>
                    <li>Strength-based attacks deal +${isSavageFighter?2:1}d damage.</li>
                    <li>You're immune to being staggered.</li>
                    <li>You have disadvantage on all mental ability-based checks.</li>
                    <li>Your Passive Perception is reduced by 4.</li>
                </ul>`
            }]);
            let update = {
                system: {
                    additionalResources: {}
                }
            };
            update.system.additionalResources[rageResource[0]] = {
                value: rageResource[1].value - 1
            };
            await actor.update(update);
            ui.notifications.info(`${actor.name} has ${rageResource[1].value - 1} uses of Rage left.`);
        } else {
            ui.notifications.warn(`${actor.name} has expended all Rage for this day. Take a full rest to recover your Rage uses.`);
        }
    }

    static async recklessAttack(actor){
        actor.createEmbeddedDocuments('ActiveEffect', [{
            label: "Reckless",
            img: `${NEWERA.images}/hammer-drop.png`,
            origin: "Reckless Attack",
            "duration.rounds": undefined,
            disabled: false,
            description: `<p>You attack recklessly this round.</p><p>Your attacks have advantage during your turn. Your Passive Agility is reduced to 0 until the start of your next turn.</p>`
        }]);
        actor.actionMessage(actor.img, null, "{NAME} is attacking recklessly!");
    }

}