import { NEWERA } from "../config.mjs";
import { Actions } from "../actions/actions.mjs";
import { SpellFocus } from "../../sheets/spell-focus.mjs";

export class Artificer {

    static hitPointIncrement = {
        roll: `1d8`,
        average: 5
    }

    static classFeatures = [
        {
            level: 1,
            key: false,
            name: "Enchanting Specialty",
            description: "You gain Enchanting (Spellcasting) as a specialty.",
            onUnlock: (actor) => {
                actor.addSpecialty("Enchanting");
                ui.notifications.info(`You've gained Enchanting as a specialty.`);
            }
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
                    },
                    onChange: (actor, from, to) => actor.setNaturalSkill(from, to)
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
                    },
                    onChange: (actor, from, to) => actor.setNaturalSkill(from, to)
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
                    values: [null, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10],
                    onUpdate: (actor, from, to) => {
                        actor.setCasterLevel(from, to, true);
                    }
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
            `,
            spellStudies: [
                {
                    choose: 5,
                    rarity: 1,
                    spellType: "E",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    onOtherFeature: true
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 1
                    }
                }
            ]
        },
        {
            level: 1,
            name: "Alchemist's Pouch",
            key: true,
            description: `<p>You can designate one small container as your Alchemist's Pouch.</p><p>Once per day, you may use your Alchemist's Pouch to satisfy the material costs of a common spell or enchantment you cast, at or below your skill level in that form of magic. If the enchantment is complex, your pouch supplies all necessary materials for all of its components.</p>
            <p>If you amplify the spell, your pouch can supply the amount of materials needed to cast it at the highest level that's trivial for you.</p>`,
            onUnlock: (actor) => actor.addResource({
                name: "Alchemist's Pouch",
                value: 1,
                max: 1,
                daily: true,
                custom: false
            })
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
                    values: [null, 0, 0, 20, 24, 30, 36, 42, 50, 56, 64, 72, 84, 96, 110, 120, 136, 148, 164, 184, 200, 220, 240, 260, 280, 300, 350, 400, 450, 500, 600]
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
                    actionType: "G",
                    overrideMacroCommand: `game.newera.HotbarActions.openSpellStorage()`,
                    rolls: [
                      {
                        label: "Focus",
                        die: "crystal-shine",
                        callback: actor => new SpellFocus(actor).render(true)
                      }
                    ]
                }
            ],
            onUnlock: actor => Artificer.initializeSpellFocus(actor, false)
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 2
                    }
                }
            ]
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
                "1.bonus": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    },
                    onChange: (actor, from, to) => Artificer.bonus(actor, "1", from, to)
                },
                "1.magicSkill": {
                    label: "Choose a Magical Skill",
                    options: {
                        elemental: "Elemental",
                        divine: "Divine",
                        physical: "Physical",
                        psionic: "Psionic",
                        spectral: "Spectral",
                        temporal: "Temporal"
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["1"].bonus == "magicSkill",
                    onChange: (actor, from, to) => actor.setSkillBoost(from, to, false)
                }
            },
            spellStudies: [
                {
                    onOtherFeature: true
                },
                {
                    onOtherFeature: true
                },
                {
                    choose: 1,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 10
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["1"].bonus == "enchantment"
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    spellType: "E",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    spellType: "E",
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
            level: 6,
            name: "Alchemist's Pouch - Uncommon",
            key: false,
            description: `<p>Your Alchemist's Pouch can supply materials for Uncommon enchantments.</p>`
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 3
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    onOtherFeature: true
                },
                {
                    onOtherFeature: true
                },
                {
                    choose: 2,
                    rarity: 2,
                    spellType: "E",
                    level: {
                        max: 3
                    }
                }
            ]
        },
        {
            level: 8,
            name: "Spellcraft",
            key: true,
            description: `<p>You can create your own spells.</p>
            <p>As an Artificer, you can craft simple and complex enchantments using any combination of other spells, enchantments, and metamagic components you know. Crafted spells may be stored in your focus.</p>
            <p>See the <a href="https://www.newerarpg.com/srd/newera-sol366/spellcraft">Spellcraft</a> section of the rulebook for details.</p>`,
            tableValues: [
                {
                    field: "spellcraft.artificer",
                    label: "Spellcraft Skill Level",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 7, 7, 7, 7],
                    onUpdate: (actor, from, to) => {
                        actor.update({
                            system: {
                                spellcraft: to
                            }
                        });
                        ui.notifications.info(`Your Spellcraft skill increased to ${to}!`);
                    }
                }
            ]
        },
        {
            level: 8,
            id: "artificer.bonus",
            key: false,
            name: "Artificer Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "2.bonus": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    },
                    onChange: (actor, from, to) => Artificer.bonus(actor, "2", from, to)
                },
                "2.magicSkill": {
                    label: "Choose a Magical Skill",
                    options: {
                        elemental: "Elemental",
                        divine: "Divine",
                        physical: "Physical",
                        psionic: "Psionic",
                        spectral: "Spectral",
                        temporal: "Temporal"
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["2"].bonus == "magicSkill",
                    onChange: (actor, from, to) => actor.setSkillBoost(from, to, false)
                }
            },
            spellStudies: [
                {
                    choose: 1,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 10
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["2"].bonus == "enchantment"
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    spellType: "SS",
                    level: {
                        max: 4
                    }
                }
            ]
        },
        {
            level: 10,
            key: true,
            name: "Metamagic",
            description: `<p>You can use Metamagic, creating magical artifacts and complex enchantments by working with the magical code that forms the building blocks of the ancient art.</p>
            <p>You may learn Metamagic enchantments and components as part of your future Enchantment Studies.
            `
        },
        {
            level: 10,
            key: false,
            name: "Introduction to Metamagic",
            description: `<p>You gain an introductory knowledge of Metamagic.</p>
            <p>You learn metamagic enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>4 Common Metamagic Enchantments (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/metamagic.png" data-tooltip="Metamagic" data-tooltip-direction="UP" />
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
                    onOtherFeature: true
                },
                {
                    choose: 4,
                    rarity: 1,
                    schools: ["MM"],
                    metamagic: true,
                    spellType: "E",
                    level: {
                        max: 3
                    }
                }
            ]
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
                "3.bonus": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    },
                    onChange: (actor, from, to) => Artificer.bonus(actor, "3", from, to)
                },
                "3.magicSkill": {
                    label: "Choose a Magical Skill",
                    options: {
                        elemental: "Elemental",
                        divine: "Divine",
                        physical: "Physical",
                        psionic: "Psionic",
                        spectral: "Spectral",
                        temporal: "Temporal"
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["3"].bonus == "magicSkill",
                    onChange: (actor, from, to) => actor.setSkillBoost(from, to, false)
                }
            },
            spellStudies: [
                {
                    choose: 1,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 10
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["3"].bonus == "enchantment"
                }
            ]
        },
        {
            level: 12,
            name: "Fleeting Enchantments",
            key: false,
            description: `<p>You may cast any simple enchantment you know without paying its material costs. Enchantments cast this way are called Fleeting Enchantments, and their effects wear off after one day.</p>
            <p>You may store fleeting enchantments in your focus. Stored enchantments can be released as standard spells with the Targeting keyword, targeting any legal object for the enchantment, and with a range of 30 feet.</p>`
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    metamagic: true,
                    spellType: "E",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    metamagic: true,
                    spellType: "E",
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 2,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SS",
                    level: {
                        max: 5
                    }
                }
            ]
        },
        {
            level: 14,
            common: "learningExperience"
        },
        {
            level: 14,
            id: "artificer.bonus",
            key: false,
            name: "Artificer Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "4.bonus": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    },
                    onChange: (actor, from, to) => Artificer.bonus(actor, "4", from, to)
                },
                "4.magicSkill": {
                    label: "Choose a Magical Skill",
                    options: {
                        elemental: "Elemental",
                        divine: "Divine",
                        physical: "Physical",
                        psionic: "Psionic",
                        spectral: "Spectral",
                        temporal: "Temporal"
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["4"].bonus == "magicSkill",
                    onChange: (actor, from, to) => actor.setSkillBoost(from, to, false)
                }
            },
            spellStudies: [
                {
                    choose: 1,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 10
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["4"].bonus == "enchantment"
                }
            ]
        },
        {
            level: 15,
            common: "specialtyImprovement"
        },
        {
            level: 15,
            name: "Enchantment Studies",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Enchantment (Level 5 or lower)
                <h4>2 Uncommon Enchantments (Level 5 or lower)</h4>
                <h4>2 Common Enchantments (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="All Temporal Schools" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    metamagic: true,
                    spellType: "E",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    metamagic: true,
                    spellType: "E",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    metamagic: true,
                    spellType: "E",
                    level: {
                        max: 5
                    }
                }
            ]
        },
        {
            level: 16,
            name: "Advanced Enchanter",
            key: false,
            modifies: "Alchemist's Pouch",
            description: `<p>Your Alchemist's Pouch can now supply the materials for Rare enchantments, and can be used up to three times per day.</p>`,
            onUnlock: (actor) => actor.updateResource("Alchemist's Pouch", {
                max: 3
            })
        },
        {
            level: 17,
            name: "Spell Studies (6<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Artificer Spell (Level 6 or lower)</h4>
                <h4>2 Uncommon Artificer Spells (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" data-tooltip="Cryomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <h4>3 Common spells from any school (Level 6 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SS",
                    level: {
                        max: 6
                    }
                }
            ]
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
            level: 18,
            id: "artificer.bonus",
            key: false,
            name: "Artificer Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "5.bonus": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    },
                    onChange: (actor, from, to) => Artificer.bonus(actor, "5", from, to)
                },
                "5.magicSkill": {
                    label: "Choose a Magical Skill",
                    options: {
                        elemental: "Elemental",
                        divine: "Divine",
                        physical: "Physical",
                        psionic: "Psionic",
                        spectral: "Spectral",
                        temporal: "Temporal"
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["5"].bonus == "magicSkill",
                    onChange: (actor, from, to) => actor.setSkillBoost(from, to, false)
                }
            },
            spellStudies: [
                {
                    choose: 1,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 10
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["5"].bonus == "enchantment"
                }
            ]
        },
        {
            level: 19,
            common: "specialtyImprovement"
        },
        {
            level: 19,
            name: "Enchantment Studies",
            key: false,
            description: `<p>You learn new enchantments from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Rare Enchantments (Level 6 or lower)
                <h4>3 Uncommon Enchantments (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="All Psionic Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/temporal.png" data-tooltip="All Temporal Schools" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 3,
                    metamagic: true,
                    spellType: "E",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 3,
                    rarity: 2,
                    metamagic: true,
                    spellType: "E",
                    level: {
                        max: 6
                    }
                }
            ]
        },
        {
            level: 20,
            name: "Bond of Friendship",
            key: false,
            modifies: "Magical Focus",
            description: `<p>Your allies can store spells in your Focus.</p>
            <p>Only you can cast stored spells, and it can only be used while in your hand.</p>
            `
        },
        {
            level: 20,
            name: "Spell Studies (7<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Rare Artificer Spells (Level 7 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="All Physical Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" data-tooltip="Pyromancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" data-tooltip="Cryomancy" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <h4>3 Uncommon Spells from any school (Level 7 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 3,
                    lists: ["artificerSpells"],
                    spellType: "SS",
                    level: {
                        max: 7
                    }
                },
                {
                    choose: 3,
                    rarity: 2,
                    spellType: "SS",
                    level: {
                        max: 7
                    }
                }
            ]
        },
        {
            Level: 21,
            common: "abilityScoreImprovement"
            
        },
        {
            level: 21,
            id: "artificer.bonus",
            key: false,
            name: "Artificer Bonus",
            description: "Choose one of the following bonuses.",
            selections: {
                "6.bonus": {
                    label: "Choose a Bonus",
                    options: {
                        magicSkill: "+1 bonus to a magical skill",
                        enchantment: "Learn one common spell or enchantment of any level",
                        alchemy: "Learn one common or uncommon potion recipe",
                        carryWeight: "+1 Carry Weight bonus",
                    },
                    onChange: (actor, from, to) => Artificer.bonus(actor, "6", from, to)
                },
                "6.magicSkill": {
                    label: "Choose a Magical Skill",
                    options: {
                        elemental: "Elemental",
                        divine: "Divine",
                        physical: "Physical",
                        psionic: "Psionic",
                        spectral: "Spectral",
                        temporal: "Temporal"
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["6"].bonus == "magicSkill",
                    onChange: (actor, from, to) => actor.setSkillBoost(from, to, false)
                }
            },
            spellStudies: [
                {
                    choose: 1,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 10
                    },
                    showWhen: (actor) => actor.system.classes.artificer.bonus["6"].bonus == "enchantment"
                }
            ]
        },

    ]

    static classFeats = {
        "369": { //Alchemist
            "1": {
                features: [
                    {
                        onUnlock: actor => actor.setSpecialtyFeature(null, "Alchemy", "technology", true)
                    }
                ]
            }
        }
    }

    static async bonus(actor, bonusNumber, from, to){
        const existingSkill = actor.system.classes.artificer.bonus?.[bonusNumber]?.magicSkill;
        if (from == "magicSkill" && existingSkill){
            await actor.setSkillBoost(existingSkill, "", false);
        } else if (from == "carryWeight"){
            await actor.update({
                system: {
                    carryWeight: {
                        bonus: actor.system.carryWeight.bonus - 1
                    }
                }
            });
        }
        if (to == "magicSkill" && existingSkill){
            await actor.setSkillBoost("", existingSkill, false);
        } else if (to == "carryWeight"){
            await actor.update({
                system: {
                    carryWeight: {
                        bonus: actor.system.carryWeight.bonus + 1
                    }
                }
            });
            ui.notifications.info("Your Carry Weight has been increased.");
        }
    }

    /**
     * Initialize the spell focus data.
     * 
     * @param {Actor} actor 
     */
    static async initializeSpellFocus(actor, reset){

        console.log("[DEBUG] Initializing focus");

        /* If the focusEnergy property already exists, this value is set to undefined so the .update() does not change the maximum. 
        If it doesn't exist, set it to 0. This way non-Artificers initializing the sheet for the first time will get 0 max, or retain their previous value.
        Artificers will still receive the value from their table. */
        const flexibleMaxEnergy = actor.system.focusEnergy ? undefined : 0;

        if (reset || !actor.system.focus){
            await actor.update({
                system: {
                    focus: []
                }
            });
        }

        if (reset || !actor.system.focusEnergy){
            await actor.update({
                system: {
                    focusEnergy: {
                        min: 0,
                        max: actor.system.tableValues.focusEnergy || flexibleMaxEnergy
                    }
                }
            });
        }

        //If the actor has a table value for focus energy and it doesn't match the current max, update it (this prevents needing to reset the focus to get increased maximum after a level up)
        if (actor.system.tableValues.focusEnergy && (actor.system.focusEnergy.max != actor.system.tableValues.focusEnergy)) {
            console.log(`[DEBUG] Updating max focus energy!`);
            await actor.update({
                system: {
                    focusEnergy: {
                        max: actor.system.tableValues.focusEnergy
                    }
                }
            });
        }
    }

    static getTotalStoredEnergy(actor){
        if (!actor.system.focus) return undefined;
        let total = 0;
        structuredClone(actor.system.focus).forEach(obj => {
            const spell = actor.items.get(obj.id);
            total += spell.system.energyCost * obj.ampFactor;
        });
        return total;
    }

    static async castAndStoreSpell(actor, spell, ampFactor, energyPool = undefined){
        const availableEnergy = actor.system.focusEnergy.max - Artificer.getTotalStoredEnergy(actor);
        if (spell.system.energyCost * ampFactor > availableEnergy){
            ui.notifications.error(`${spell.name} wasn't stored because your focus doesn't have enough capacity.`);
            return;
        }
        if (await actor.cast(spell, ampFactor, false, energyPool)){
            await actor.update({
                system: {
                    focus: actor.system.focus.concat({
                        id: spell.id,
                        ampFactor: ampFactor
                    })
                }
            });
            ui.notifications.info(`${spell.name}${ampFactor > 1 ? " "+NEWERA.romanNumerals[ampFactor] : ""} has been stored in your focus.`);
        } else {
            ui.notifications.warn(`Your attempt to store the spell was unsuccessful!`);
        }
    }

    static async onFocusSpellDrop(actor, spell){
        const availableEnergy = actor.system.focusEnergy.max - Artificer.getTotalStoredEnergy(actor);
        if (availableEnergy <= 0){
            ui.notifications.warn("Your focus is full! Use some of your stored spells to free up some space.");
            return;
        }
        if (spell.system.energyCost > availableEnergy){
            ui.notifications.warn(`This spell is too powerful! Your focus can only hold ${availableEnergy} more energy.`);
            return;
        }
        let dialog = new Dialog({
            title: `Store ${spell.name}`,
            content: `<form class="spell-dialog">
              <p class="storage-exceeded-msg" style="display: none"></p>
              <table id="cast-table">
                <tr>
                  <td style="width: 60%">Level</td>
                  <td style="width: 40%"><strong id="level"></strong></td>
                </tr>
                <tr>
                  <td>Difficulty</td>
                  <td><strong id="difficulty"></strong></td>
                </tr>
                <tr>
                  <td data-tooltip="This is the percent chance of successfully casting the spell.">Chance of Success*</td>
                  <td><strong id="chance"></strong></td>
                </tr>
                <tr>
                  <td>Energy Cost</td>
                  <td><strong id="cost"></strong></td>
                </tr>
              </table>
              <div id="amplify-info">
                <p>Amplification Level:</p>
                <div id="amplify-down">
                  <i class="fa-solid fa-chevron-left"></i>
                </div>
                <h2 id="amplify-heading">x<span id="ampFactor">1</span></h2>
                <div id="amplify-up">
                  <i class="fa-solid fa-chevron-right"></i>
                </div>
                <div id="energySelect">
                    Energy Source: <select id="energyPools">${Actions._renderPoolOptions(actor)}</select>
                </div>
              </div>
            </form>
            `,
            render: html => {
                Actions._renderSpellDetails(html, spell, actor, 1, false);
                Artificer._renderFocusStorageError(html, spell, actor, 1);
                html.find("#amplify-up").click(() => {
                    const amp = (actor.type == "Creature" ? spell.system.ampFactor : parseInt(html.find("#ampFactor").html()));
                    html.find("#ampFactor").html(amp + 1);
                    if (amp == 68){
                    ui.notifications.info("Nice");
                    }
                    Actions._renderSpellDetails(html, spell, actor, amp + 1, false);
                    Artificer._renderFocusStorageError(html, spell, actor, amp + 1);
                });
                html.find("#amplify-down").click(() => {
                    const amp = parseInt(html.find("#ampFactor").html());
                    if (amp == 1) return;
                    html.find("#ampFactor").html(amp - 1);
                    Actions._renderSpellDetails(html, spell, actor, amp - 1, false);
                    Artificer._renderFocusStorageError(html, spell, actor, amp - 1);
                });
                html.find("#energyPools").change(async () => {
                    const amp = parseInt(html.find("#ampFactor").html());
                    Actions._renderSpellDetails(html, spell, actor, amp, false);
                });
            },
            buttons: {
                cast: {
                    icon: `<i class="fa-solid fa-hand-sparkles"></i>`,
                    label: "Cast and Store",
                    callback: html => {
                        const ampFactor = html.find("#ampFactor").html();
                        const pool = Actions._getPool(actor, html, false);
                        Artificer.castAndStoreSpell(actor, spell, ampFactor, pool);
                    }
                },
                cancel: {
                    icon: `<i class="fas fa-x"></i>`,
                    label: "Cancel",
                }
            }
        }).render(true);
    }

    static _renderFocusStorageError(html, spell, actor, ampFactor){
        const totalStoredEnergy = Artificer.getTotalStoredEnergy(actor);
        const availableEnergy = actor.system.focusEnergy.max - totalStoredEnergy;
        if (spell.system.energyCost * ampFactor > availableEnergy){
            html.find(".storage-exceeded-msg").show();
            if (spell.system.energyCost > availableEnergy) {
                html.find(".storage-exceeded-msg").html(`This spell is too powerful for your focus! It can only hold ${actor.system.focusEnergy.max} energy worth of spells.`);
            } else {
                html.find(".storage-exceeded-msg").html(`This spell is too powerful! Your focus can only hold ${availableEnergy} more energy. Reduce the amplification level to store it.`);
            }
        } else {
            html.find(".storage-exceeded-msg").hide();
        }
    }

}