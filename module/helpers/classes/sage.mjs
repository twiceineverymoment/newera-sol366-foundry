import { NEWERA } from "../config.mjs";

export class Sage {

    static hitPointIncrement = {
        roll: `1d6`,
        average: 4
    }

    static classFeatures = [
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["sage"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["sage"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 1,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    lists: ["sage"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["sage"],
                    restricted: true,
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
    ]

    static classFeats = {}
}