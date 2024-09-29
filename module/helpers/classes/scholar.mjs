import { SpellPreparation } from "../../sheets/spell-preparation.mjs";
import { NEWERA } from "../config.mjs";
import { Actions } from "../macros/actions.mjs";

export class Scholar {

    static classFeatures = [
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
            `,
            spellStudies: [
                {
                    choose: 5,
                    rarity: 1,
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
                        left: `${NEWERA.images}/scholar.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `You spend one hour preparing your spells for the day during meditation. Select a spell to prepare in each of your available spell slots. Your selections last until your next full rest.`,
                    difficulty: null,
                    actionType: "G",
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
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
            name: "Spellcraft",
            key: true,
            description: `<p>You can create your own spells.</p>
            <p>As a Scholar, you can craft spells and simple enchantments. You can prepare your crafted spells in appropriately-leveled spell slots.</p>
            <p>See the <a href="https://www.newerarpg.com/srd/newera-sol366/spellcraft">Spellcraft</a> section of the rulebook for details.</p>`,
            tableValues: [
                {
                    field: "spellcraft.scholar",
                    label: "Spellcraft Skill Level",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 2,
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 3
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    spellType: "SE",
                    restricted: true,
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    spellType: "SE",
                    restricted: true,
                    level: {
                        max: 5
                    }
                },
            ]
        },
        {
            level: 12,
            name: "Derivative Spells",
            key: false,
            description: `<p>You can create Derivative spells based on other spells you know.</p>
            <p>The GM decides what changes you can make to your spells and can make additional changes to balance them.</p>`
        },
        {
            level: 12,
            name: "Creative Inspiration",
            key: false,
            description: `<p>During your level-up, you may either craft or refine up to three spells. New spells crafted this way start one refinement level higher.</p>`
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 3,
                    spellType: "SE",
                    restricted: true,
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 3,
                    rarity: 2,
                    spellType: "SE",
                    restricted: true,
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    restricted: true,
                    level: {
                        max: 6
                    }
                },
            ]
        },
        {
            level: 15,
            name: "Spell Scribe",
            key: false,
            description: `<p>While meditating, you can create a spell script of any spell you know, including ones you've created.</p>
            <p>Crafted spells must be refined to the Revised state in order to be inscribed this way. If you've successfully taught a spell you created to another mage and watched them cast it, you gain a +10 bonus to further refinement checks on that spell.</p>`,
            actions: [
                {
                    name: "Create a Spell Script",
                    images: {
                        base: `${NEWERA.images}/scroll-quill-2.png`,
                        left: `${NEWERA.images}/scholar.png`,
                        right: `${NEWERA.images}/ac_adventuring.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `You spend one hour preparing your spells for the day during meditation. Select a spell to prepare in each of your available spell slots. Your selections last until your next full rest.`,
                    difficulty: null,
                    actionType: "E",
                    rolls: [
                      {
                        label: "Check",
                        die: "scroll-quill-2",
                        caption: "Create Spell Script",
                        formula: `1d20+@spellcraft.mod+@knowledges.tolgethic`
                      }
                    ]
                }
            ]
        },
        {
            level: 16,
            name: "Readied Casting",
            key: false,
            modifies: "Prepared Spells",
            description: "Once per turn, you may cast a prepared spell that takes 2 or 3 frames in a single frame.",
            actions: [
                {
                    name: "Readied Cast",
                    images: {
                        base: `${NEWERA.images}/hazard-sign.png`,
                        left: `${NEWERA.images}/scholar.png`,
                        right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `The next standard or charged spell you cast this turn from your prepared spells takes only one frame. Use this ability only once per turn.`,
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Activate",
                        die: "hazard-sign",
                        callback: actor => Actions.printAbilityInfo(actor, {
                            img: actor.img,
                            title: "Readied Cast",
                            details: "Once per turn, you cast a prepared standard or charged spell in one frame, as though it were a quick spell."
                        })
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
            level: 17,
            name: "Extra Natural Skill",
            id: "scholar.naturalSkills",
            key: false,
            description: `<p>You may choose an additional skill to become a natural in.</p>`,
            choices: {
                "3": {
                    label: "Third Choice",
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
            }
        },
        {
            level: 18,
            name: "Spell Studies (7<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Rare spells (Level 6 or lower)</h4>
                <h4>3 Uncommon spells (Level 6 or lower)</h4>
                <h4>3 Common spells (Level 6 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 3,
                    spellType: "SE",
                    restricted: true,
                    level: {
                        max: 7
                    }
                },
                {
                    choose: 3,
                    rarity: 2,
                    spellType: "SE",
                    restricted: true,
                    level: {
                        max: 7
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    restricted: true,
                    level: {
                        max: 7
                    }
                },
            ]
        },
        {
            level: 18,
            id: "scholar.bonus",
            name: "Scholar Bonus",
            key: false,
            description: "Choose two of your magical skills and gain a +1 class bonus to their modifiers.",
            selections: {
                "4.1": {
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
                "4.2": {
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
        //TODO Additional feature at lvl 18 or 19 in S366 v1.2.1
        {
            level: 19,
            common: "learningExperience"
        },
        {
            level: 20,
            name: "Trivial Spellcasting (1<sup>st</sup> Level)",
            key: false,
            modifies: "Prepared Spells",
            description: `<p>Your Level 1 spell slots aren't expended when you cast them at base level. (You can prepare up to 10 1st-level spells and cast those spells an unlimited number of times, but using Flexible Casting to amplify the spell will expend it.)</p>`
        }
    ]

    /**
     * Initialize a Scholar character's spell slots by creating the appropriate number of empty slots based on the character's feature table.
     * If reset is true, clears all existing prepared spells back to empty slots.
     * Otherwise, adds new slots to the actor sheet based on the character's level up.
     * @param {Actor} actor 
     */
    static async initializeSpellSlots(actor, reset){

        console.log("[DEBUG] Initializing spell slots");

        const spellSlots = (actor.system.spellSlots && !reset) ? actor.system.spellSlots : {
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
            6: {},
            7: {},
            8: {},
            9: {},
            10: {}
        };

        for (let i=1; i<=10; i++){
            const slotsAtThisLevel = actor.system.tableValues.spellSlots[i] || 0;
            console.log(`[DEBUG] level ${i} slot count ${slotsAtThisLevel}`);
            for (let ii=0; ii<slotsAtThisLevel; ii++){
                if (!spellSlots[i][ii]){
                    spellSlots[i][ii] = {
                        spellId: null,
                        ampFactor: 1,
                        available: false
                    };
                }
            }
        }

        actor.update({
            system: {
                spellSlots: spellSlots
            }
        });

        console.log(spellSlots);
    }

    static async setPreparedSpellSlot(actor, spell, level, slotNumber){
        const spellSlots = actor.system.spellSlots;
        let ampFactor = 1;
        if (spell.type != "Spell"){
            ui.notifications.error("You can't prepare enchantments.");
            return;
        }
        if (spell.system.castType == "R"){
            ui.notifications.error("You can't prepare ritual spells.");
            return;
        }
        if (spell.system.level > level){
            ui.notifications.error("That slot isn't the right level for that spell.");
            return;
        } else if (spell.system.level < level){
            ampFactor = Math.floor(level / spell.system.level);
        }
        spellSlots[level][slotNumber] = {
            spellId: spell.id,
            ampFactor: ampFactor,
            available: true
        };
        await actor.update({
            system: {
                spellSlots: spellSlots
            }
        });
        ui.notifications.info(`You prepare ${spell.name} in a level ${level} spell slot.`);
    }

    static async setSpellSlotAvailability(actor, level, slotNumber, state){
        const spellSlots = actor.system.spellSlots;
        const slot = spellSlots[level][slotNumber];
        slot.available = state;

        await actor.update({
            system: {
                spellSlots: spellSlots
            }
        });
    }

    static async recoverAllSpellSlots(actor){
        const spellSlots = actor.system.spellSlots;
        for (const level of Object.values(spellSlots)){
            for (const slot of Object.values(level)){
                if (slot.spellId) slot.available = true;
            }
        }
        await actor.update({
            system: {
                spellSlots: spellSlots
            }
        });
    }

}