import { NEWERA } from "../config.mjs";
export class Delver {

    static classFeatures = [
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
                    values: [null, 24, 27, 30, 40, 41, 42, 43, 64, 67, 70, 72, 92, 95, 98, 128, 135, 142, 150, 160, 190]
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
                    values: [null, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 6]
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
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5]
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
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5]
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
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5]
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
                    values: [null, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5]
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    schools: ["PY"],
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    schools: ["HM"],
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    schools: ["GE"],
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    schools: ["EV"],
                    spellType: "SE",
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
                    values: [null, 0, 0, 0, 0, 0, 0, "1d4", "1d4", "1d6", "1d6", "1d8", "1d8", "1d10", "1d10", "1d12", "1d12", "1d12", "3d4", "3d4", "2d8"] 
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    schools: ["PY"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    schools: ["HM"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    schools: ["GE"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 2,
                    schools: ["EV"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["delver"],
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
                    overrideMacroCommand: 'game.newera.HotbarActions.rage()',
                    rolls: [
                      {
                        label: "Rage",
                        die: "fire-dash",
                        callback: actor => Delver.rage(actor)
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    schools: ["PY"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    schools: ["HM"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    schools: ["GE"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    schools: ["EV"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    schools: ["PY"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    schools: ["HM"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    schools: ["GE"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                }
            ]
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
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    schools: ["EV"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                }
            ]
        },
        {
            level: 16,
            common: "abilityScoreImprovement"
        },
        {
            level: 17,
            common: "learningExperience"
        },
        {
            level: 17,
            id: "delver.bonus",
            name: "Delver Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "4": {
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
            level: 18,
            common: "naturalSkillImprovement"
        },
        {
            level: 18,
            archetype: "fire",
            name: "Burning Passion",
            key: false,
            description: `While raging, your body emits bright light in a 20-foot radius, and creatures standing within 6 feet of you take 3 points of burning damage per frame.`
        },
        {
            level: 18,
            archetype: "water",
            name: "Water Bender",
            key: false,
            description: `<p>You can swim at your full movement speed.</p><p>Whenever you make a Hold Breath check underwater, you may spend energy equal to half the difficulty of that check. If you do, you automatically succeed.</p>`
        },
        {
            level: 18,
            archetype: "earth",
            name: "Seismic Sense",
            key: false,
            description: "Your Perception skill allows you to sense nearby moving creatures or objects within 100 feet through vibrations in the ground. You use your sense of touch for this ability, so it isn't impeded by reduced visibility or blindness."
        },
        {
            level: 18,
            archetype: "wind",
            name: "Lightning Charge",
            key: false,
            description: "Whenever you would deal Shock damage to any target, you can choose to replace the damage with energy recovery for that creature. You must activate this ability before rolling.",
            actions: [
                {
                    name: "Lightning Charge",
                    images: {
                        base: `${NEWERA.images}/chain-lightning.png`,
                        left: `${NEWERA.images}/delver_wind.png`,
                        right: `${NEWERA.images}/ac_0frame.png`,
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "The next time you would deal Shock damage this turn, the target instead gains energy with overcharge equal to the amount you roll.",
                    difficulty: null,
                    actionType: "0",
                    rolls: [
                      {
                        label: "Activate",
                        die: "chain-lightning",
                        callback: actor => Actions.printAbilityInfo(actor, {
                            title: "Lightning Charge",
                            img: `${NEWERA.images}/ac_0frame.png`,
                            details: "The next time you would deal Shock damage this turn, the target instead gains energy with overcharge equal to the amount you roll."
                        })
                      }
                    ]
                },
            ]
        },
        {
            level: 19,
            common: "specialtyImprovement"
        },
        {
            level: 19,
            id: "delver.bonus",
            name: "Delver Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "5": {
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
            level: 20,
            id: "delver.archetype",
            name: "Duality",
            key: false,
            description: "<p>Choose a second Delver Archetype.</p><p>Your Proficiency Bonus applies to spells cast in this school as well as your original elemental path.</p>",
            selections: {
                "2": {
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
            level: 20,
            archetype: "fire",
            name: "Spell Studies (6<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Pyromancy spell (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/pyromancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Uncommon Delver spells (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            <div class="magic-info">
                <h4>3 Common spells of any school (Level 6 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    schools: ["PY"],
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                }
            ]
        },
        {
            level: 20,
            archetype: "water",
            name: "Spell Studies (6<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Cryomancy spell (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/cryomancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Uncommon Delver spells (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            <div class="magic-info">
                <h4>3 Common spells of any school (Level 6 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    schools: ["HM"],
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                }
            ]
        },
        {
            level: 20,
            archetype: "earth",
            name: "Spell Studies (6<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Lithomancy spell (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/lithomancy.png" />
            </div>
            <div class="magic-info">
                <h4>2 Uncommon Delver spells (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            <div class="magic-info">
                <h4>3 Common spells of any school (Level 6 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    schools: ["GE"],
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                }
            ]
        },
        {
            level: 20,
            archetype: "wind",
            name: "Spell Studies (6<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Evocation spell (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" />
            </div>
            <div class="magic-info">
                <h4>2 Uncommon Delver spells (Level 6 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="All Elemental Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/banishment.png" data-tooltip="Banishment" data-tooltip-direction="UP" />
            </div>
            <div class="magic-info">
                <h4>3 Common spells of any school (Level 6 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    schools: ["EV"],
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["delver"],
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                },
                {
                    choose: 3,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 6
                    }
                }
            ]
        }
    ]

    static async elementalChanneling(actor, pType){
        if (actor.system.energy.value <= 0){
            ui.notifications.warn(`${actor.name}'s energy is depleted.`);
            return;
        }
        const type = pType || actor.system.classes.delver.archetype[1]; //TODO Placeholder since this version only goes through level 10. This will eventually need to support multiple options when delvers get multiple elements
        const dmgTypes = {
            "fire": "Burning",
            "water": "Freezing",
            "earth": "Bludgeoning",
            "wind": "Shock"
        };
        const channelingDmgRoll = actor.system.tableValues.elementalChannelingDmgDie;
        const r = new Roll(channelingDmgRoll, actor.getRollData());
        await r.evaluate();
        r.toMessage({
            speaker: ChatMessage.getSpeaker({actor: actor}),
            flavor: `Damage - Elemental Channeling (${dmgTypes[type]})`
        });
        if (r.total > actor.system.energy.value){
            await actor.takeDamage(r.total - actor.system.energy.value, "exhaustion", false, false);
        }
        await actor.update({
            system: {
                energy: {
                    value: Math.max(actor.system.energy.value - r.total, 0)
                }
            }
        });
    }

    static async rage(actor){
        if (actor.system.energy.value > 10){
            actor.actionMessage(actor.img, null, "{NAME} is becoming enraged!");
            await actor.createEmbeddedDocuments('ActiveEffect', [{
                label: "Rage",
                img: `${NEWERA.images}/fire-dash.png`,
                description: `<p>Your physical abilities are enhanced at the cost of reduced presence of mind. You may end Rage at any time as a free action.</p>
                <ul>
                    <li>Your Speed is increased by 4 feet.</li>
                    <li>Strength-based attacks deal additional damage according to your Rage Damage Bonus in the Mercenary table.</li>
                    <li>You're immune to being staggered.</li>
                    <li>You have disadvantage on all mental ability-based checks.</li>
                    <li>Your Passive Perception is reduced by 4.</li>
                </ul>`
            }]);
            await actor.update({
                system: {
                    energy: {
                        value: actor.system.energy.value - 10
                    }
                }
            });
        } else {
            ui.notifications.error("You don't have enough energy!");
        }
    }

    static async rollWildFury(actor, table){
        let r = new Roll('1d4');
        await r.evaluate();
        r.toMessage({
            speaker: ChatMessage.getSpeaker({actor: actor}),
            flavor: `Wild Fury (Path of ${table})`
        });
        actor.actionMessage(`${NEWERA.images}/embraced-energy.png`, null, `<b>Wild Fury: </b>{0}`, NEWERA.wildFuryTable[table][r.total - 1]);
    }
}