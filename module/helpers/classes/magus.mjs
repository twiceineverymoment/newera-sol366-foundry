import { NEWERA } from "../config.mjs";


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
    ]
}