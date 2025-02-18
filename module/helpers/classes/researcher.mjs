import { NEWERA } from "../config.mjs";

export class Researcher {

    static hitPointIncrement = {
        roll: `1d6`,
        average: 4
    }

    static classFeatures = [
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
        /* BEGIN GENERATED SECTION L2 */
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["PY"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["HM"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["GE"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["EV"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["RE"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["AB"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["BA"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["MA"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["TR"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["CO"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["IL"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["DI"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["HY"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["CN"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["SU"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["NE"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["AP"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["CH"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
        },
        /* END GENERATED SECTION L2 */
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
        /* BEGIN GENERATED SECTION L4 */
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
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["PY"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["elemental"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["HM"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["elemental"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["GE"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["elemental"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["EV"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["elemental"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["RE"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["divine"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["AB"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["divine"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["BA"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["divine"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["MA"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["physical"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["TR"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["physical"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["CO"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["physical"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["IL"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["psionic"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["HY"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["psionic"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["DI"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["psionic"],
                    restricted: false,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["CN"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["spectral"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["SU"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["spectral"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["NE"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["spectral"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["AP"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["temporal"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
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
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            `,
            spellStudies: [
                {
                    choose: -1,
                    rarity: 1,
                    schools: ["CH"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    forms: ["temporal"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
            ]
        },
        /* END GENERATED SECTION L4 */
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
        /* BEGIN GENERATED SECTION L7 */
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["PY"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["elemental"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["HM"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["elemental"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["GE"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["elemental"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["EV"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["elemental"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["RE"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["divine"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["AB"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["divine"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["BA"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["divine"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["MA"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["physical"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["TR"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["physical"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["CO"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["physical"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["IL"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["psionic"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["HY"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["psionic"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["DI"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["psionic"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["CN"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["spectral"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["SU"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["spectral"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["NE"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["spectral"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["AP"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["temporal"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 1,
                schools: ["CH"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 2,
                rarity: 1,
                forms: ["temporal"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              },
              {
                choose: 1,
                rarity: 1,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
},
        /* END GENERATED SECTION L7 */
        {
            level: 8,
            name: "Spellcraft",
            key: true,
            description: `<p>You can create entirely new spells in your major school of magic. See the SRD page on <a href="https://www.newerarpg.com/srd/newera-sol366/spellcraft">Spellcraft</a>.</p>
            <p>Your Spellcraft skill is equal to your primary proficiency bonus.`
        },
        /* BEGIN GENERATED SECTION L8 */
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["PY"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["HM"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["GE"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["EV"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["RE"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["AB"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["BA"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["MA"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["TR"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["CO"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["IL"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["HY"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["DI"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["CN"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["SU"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["NE"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["AP"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["CH"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 3
                }
              }
            ]
        },
        /* END GENERATED SECTION L8 */
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
        /* BEGIN GENERATED SECTION L10 */
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["PY"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["elemental"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["HM"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["elemental"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["GE"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["elemental"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["EV"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["elemental"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["RE"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["divine"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["AB"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["divine"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["BA"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["divine"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["MA"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["physical"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["TR"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["physical"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["CO"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["physical"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["IL"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["psionic"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["HY"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["psionic"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["DI"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["psionic"],
                restricted: false,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["CN"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["spectral"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["SU"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["spectral"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["NE"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["spectral"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["AP"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["temporal"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
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
            `,
            spellStudies: [
              {
                choose: -1,
                rarity: 2,
                schools: ["CH"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
              {
                choose: 2,
                rarity: 2,
                forms: ["temporal"],
                restricted: true,
                spellType: "SE",
                level: {
                  max: 4
                }
              },
            ]
        },
        /* END GENERATED SECTION L10 */
    ]

    static archetypeSelectionLevels = {
      1: 2
    }

}