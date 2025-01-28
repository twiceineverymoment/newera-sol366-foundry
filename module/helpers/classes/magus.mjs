import { SpellstrikeSheet } from "../../sheets/spellstrike.mjs";
import { NEWERA } from "../config.mjs";
import { Actions } from "../macros/actions.mjs";


export class Magus {
    static classFeatures = [
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
                    values: [null, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6]
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["magusEnchantments"],
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 1
                    }
                }
            ]
        },
        {
            level: 1,
            name: "Alchemist's Pouch",
            key: false,
            description: `<p>You can designate one small container as your Alchemist's Pouch.</p><p>Once per day, you may use your Alchemist's Pouch to satisfy the material costs of a common enchantment you cast, at or below your skill level in that form of magic.</p>
            <p>If you amplify the enchantment, your pouch can supply the amount of materials needed to cast it at the highest level that's trivial for you.</p>`
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 1
                    }
                }
            ]
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
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["magusEnchantments"],
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 2
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    lists: ["magusEnchantments"],
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["magusEnchantments"],
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 3
                    }
                }
            ]
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
                <h4>1 Uncommon Magus spell (Level 3 or lower)</h4>
                <h4>2 Common Magus Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 3
                    }
                }
            ]
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
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 5, 6, 6, 8, 8, 10, 12, 12, 15, 15]
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
                    description: "<p>You cast a spell alongside an attack, turning it into a Spellstrike.</p><p>Choose a spell you know that deals damage, and a melee attack using a held weapon.</p>",
                    overrideMacroCommand: `game.newera.HotbarActions.spellstrike()`,
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Activate",
                        die: "saber-slash",
                        callback: (actor) => new SpellstrikeSheet(actor).render(true)
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
            name: "Spellcraft",
            key: true,
            description: `<p>You can create your own spells.</p>
            <p>As a Magus, you can craft spells and simple enchantments. You can perform Spellstrikes using spells you create.</p>
            <p>See the <a href="https://www.newerarpg.com/srd/newera-sol366/spellcraft">Spellcraft</a> section of the rulebook for details.</p>`,
            tableValues: [
                {
                    field: "spellcraft.artificer",
                    label: "Spellcraft Skill Level",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3]
                }
            ]
        },
        {
            level: 11,
            name: "Spell Studies",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Magus spells (Level 4 or lower)</h4>
                <h4>3 Common Magus Spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 4
                    }
                }
            ]
        },
        {
            level: 11,
            name: "Enchantment Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon Magus Enchantments (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
                <h4>1 Common Enchantment from any school (Level 4 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    onOtherFeature: true
                },
                {
                    onOtherFeature: true
                },
                {
                    choose: 3,
                    rarity: 2,
                    lists: ["magusEnchantments"],
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 1,
                    rarity: 1,
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 4
                    }
                }
            ]
        },
        {
            level: 12,
            name: "Enchantment Blending",
            key: false,
            description: `<p>You can put two simple enchantments on one item.</p>
            <p>You gain the ability to cast simple enchantments on items that are already enchanted. You take a -5 penalty to cast the second enchantment. The penalty is reduced to -3 if the second enchantment is of the same form of magic as the existing enchantment, and to -1 if from the same school of magic.</p>`
        },
        {
            level: 12,
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
        },
        {
            level: 13,
            common: "abilityScoreImprovement"
        },
        {
            level: 13,
            name: "Enchantment Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Magus Enchantment (Level 5 or lower)</h4>
                <h4>2 Uncommon Magus Enchantments (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    lists: ["magusEnchantments"],
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["magusEnchantments"],
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 5
                    }
                }
            ]
        },
        {
            level: 14,
            name: "Combat Expert",
            key: false,
            description: `<p>Your Turn Length increases by one frame.</p>`
        },
        {
            level: 14,
            common: "specialtyImprovement"
        },
        {
            level: 15,
            common: "naturalSkillImprovement"
        },
        {
            level: 15,
            name: "Spell Studies",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Magus spell (Level 5 or lower)</h4>
                <h4>3 Uncommon Magus Spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 3,
                    rarity: 2,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 5
                    }
                }
            ]
        },
        {
            level: 15,
            id: "magus.bonus",
            key: false,
            name: "Magus Bonus",
            description: "Gain a +1 class bonus to one of the following stats.",
            selections: {
                "3": {
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
            level: 16,
            name: "Energy Channeling",
            key: false,
            description: `<p>You can utilize your Spellstrikes to briefly amplify the enchantments on weapons and armor.</p>`,
            actions: [
                {
                    name: "Energy Channeling: Attack",
                    images: {
                        base: `${NEWERA.images}/saber-slash.png`,
                        left: `${NEWERA.images}/magus.png`,
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You expend a Spellstrike to amplify the enchantment on a weapon one factor higher during an attack. Use this action as part of an attack. If there are multiple enchantments on the weapon, one spellstrike is consumed for each.</p>",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Activate",
                        die: "saber-slash",
                      }
                    ]
                },
                {
                    name: "Energy Channeling: Passive",
                    images: {
                        base: `${NEWERA.images}/saber-slash.png`,
                        left: `${NEWERA.images}/magus.png`,
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "<p>You expend a Spellstrike to amplify the enchantment on a worn or held item one factor higher. The effect lasts for one round. If there are multiple enchantments on the item, one spellstrike is consumed for each.</p>",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "saber-slash",
                      }
                    ]
                }
            ]
        },
        {
            level: 17,
            common: "abilityScoreImprovement"
        },
        {
            level: 18,
            common: "learningExperience"
        },
        {
            level: 18,
            name: "Enchantment Studies (6<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Rare Magus Enchantments (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physiomancy.png" data-tooltip="Physiomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
                <h4>2 Uncommon Enchantments from any school (Level 6 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 3,
                    lists: ["magusEnchantments"],
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    restricted: true,
                    spellType: "E",
                    level: {
                        max: 6
                    }
                }
            ]
        },
        {
            level: 19,
            id: "magus.bonus",
            key: false,
            name: "Magus Bonus",
            description: "Gain a +1 class bonus to one of the following stats.",
            selections: {
                "4": {
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
            level: 19,
            common: "specialtyImprovement"
        },
        {
            level: 20,
            name: "Enhanced Strike",
            modifies: "Spellstrike",
            key: false,
            description: `<ul>
                <li>You can perform two Spellstrikes in a single attack action.</li>
                <li>You can cast channeled spells as spellstrikes on three-frame attack actions.</li>
                <li>You can amplify spells cast as part of spellstrikes by making a Spellcasting check and paying the difference in the energy cost.</li>
                <li>You can use Energy Channeling multiple times on a single action or attack.</li>
            </ul>`
        },
        {
            level: 20,
            name: "Spell Studies",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Rare Magus spells (Level 6 or lower)</h4>
                <h4>2 Uncommon Magus Spells (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/sangromancy.png" data-tooltip="Sangromancy" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 6 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 3,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["magusSpells"],
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    restricted: true,
                    spellType: "SS",
                    level: {
                        max: 6
                    }
                }
            ]
        }
    ]

    static spellstrikeSlotNames = ["spellstrike", "spellstrikes", "spellstrike slots"];

    static async initializeSpellstrike(actor) {
        const currMaxSpellstrikes = actor.system.tableValues.spellstrikeSlots;
        if (!actor.system.spellstrikes) {
            await actor.update({
                system: {
                    spellstrikes: {
                        value: currMaxSpellstrikes,
                        max: currMaxSpellstrikes
                    }
                }
            })
        }
        if (actor.system.spellstrikes.max != currMaxSpellstrikes) {
            await actor.update({
                system: {
                    spellstrikes: {
                        max: currMaxSpellstrikes
                    }
                }
            })
        }
    }

    static async spellstrike(actor) {
        const resource = Object.entries(actor.system.additionalResources).find(r => Magus.spellstrikeSlotNames.includes(r[1].name.toLowerCase()));
        if (resource && resource[1].value > 0) {
            Actions.printAbilityInfo(actor, {
                img: actor.img,
                title: "Spellstrike",
                details: `<p>${actor.name} infuses an attack with the power of a spell.</p>`
            });
            let update = {
                system: {
                    additionalResources: {}
                }
            };
            update.system.additionalResources[resource[0]] = {
                value: resource[1].value - 1
            };
            await actor.update(update);
            ui.notifications.info(`${actor.name} has ${resource[1].value - 1} / ${resource[1].max} spellstrikes remaining.`);
        } else {
            ui.notifications.warn(`${actor.name} is out of Spellstrikes. Take a full rest to replenish your energy.`);
        }
    }
}