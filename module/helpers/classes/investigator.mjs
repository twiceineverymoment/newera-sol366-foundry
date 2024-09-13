import { NEWERA } from "../config.mjs";

export class Investigator {
    static classFeatures = [
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["investigator"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["investigator"],
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
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
    ]
}