import { NEWERA } from "../config.mjs";
import { Formatting } from "../formatting.mjs";
import { Actions } from "../macros/actions.mjs";
export class Guardian {

    static hitPointIncrement = {
        roll: `1d12`,
        average: 7
    }

    static classFeatures = [
        {
            level: 1,
            id: "guardian.specialties",
            name: "Guardian Specialties",
            key: false,
            description: "Choose two of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {
                        "long-jump": "Long Jump (Athletics)",
                        "high-jump": "High Jump (Athletics)",
                        "climbing": "Climbing (Athletics)",
                        "protection": "Protection (Defense)",
                        "disarm": "Disarm (Defense)",
                        "counter": "Counter (Defense)",
                        "pull-to-safety": "Pull to Safety (Reflex)"
                    }
                },
                "2": {
                    label: "Specialty #2",
                    options: {
                        "long-jump": "Long Jump (Athletics)",
                        "high-jump": "High Jump (Athletics)",
                        "climbing": "Climbing (Athletics)",
                        "protection": "Protection (Defense)",
                        "disarm": "Disarm (Defense)",
                        "counter": "Counter (Defense)",
                        "pull-to-safety": "Pull to Safety (Reflex)"
                    }
                }
            }
        },
        {
            level: 1,
            id: "guardian.naturalSkills",
            name: "Guardian Natural Skills",
            key: false,
            description: "Choose three of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {
                        "athletics": "Athletics", 
                        "defense": "Defense",
                        "agility": "Agility",
                        "endurance": "Endurance",
                        "reflex": "Reflex",
                        "determination": "Determination",
                        "divine-magic": "Divine Magic"
                    }
                },
                "2": {
                    label: "Second Choice",
                    options: {
                        "athletics": "Athletics", 
                        "defense": "Defense",
                        "agility": "Agility",
                        "endurance": "Endurance",
                        "reflex": "Reflex",
                        "determination": "Determination",
                        "divine-magic": "Divine Magic"
                    }
                },
                "3": {
                    label: "Third Choice",
                    options: {
                        "athletics": "Athletics", 
                        "defense": "Defense",
                        "agility": "Agility",
                        "endurance": "Endurance",
                        "reflex": "Reflex",
                        "determination": "Determination",
                        "divine-magic": "Divine Magic"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Martial Arts",
            key: true,
            description: "As a professional bodyguard, you learn tried-and-true defense techniques based on ancient traditions. Add your Proficiency Bonus to Unarmed Attack (Athletics) checks. Your proficiency bonus increases with your level according to the Guardian table.",
            tableValues: [
                {
                    field: "proficiencyBonus.guardian",
                    label: "Proficiency Bonus",
                    sign: true,
                    values: [null, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7]
                }
            ]
        },
        {
            level: 1,
            name: "Martial Unarmed Attack",
            key: false,
            description: "As a Guardian, your unarmed attack deals 1d4 damage plus your Strength modifier.",
            actions: [
                {
                    name: "Unarmed Attack",
                    images: {
                      base: `${NEWERA.images}/unarmed_attack.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: "athletics",
                    specialties: ["Brawl"],
                    description: "As a guardian, you have a stronger unarmed attack than most. This attack deals 1d4 damage plus your Strength modifier.",
                    difficulty: "The difficulty of an attack is the target's passive agility, unless they react.",
                    type: "1",
                    rolls: [
                      {
                        label: "Attack",
                        caption: "Martial Unarmed Attack",
                        die: "d20",
                        formula: "1d20+@skills.athletics.mod+@specialty.partial.brawl",
                        message: "{NAME} attacks with {d} fists!",
                        difficulty: null,
                      },
                      {
                        label: "Damage",
                        caption: "Damage (Martial Unarmed Attack)",
                        die: "d4",
                        formula: "1d4+@abilities.strength.mod"
                      }
                    ]
                }
            ]
        },
        {
            level: 2,
            common: "abilityScoreImprovement"
        },
        {
            level: 3,
            name: "Qi",
            key: true,
            description: "You blend your magical powers into your martial arts skills. You can assume a number of different fighting stances, which boost your stamina and grant you other useful powers.",
        },
        {
            level: 3,
            name: "Basic Fighting Stances",
            key: false,
            description: "You've learned three basic fighting stances: Gorilla Stance, Mountain Stance, and Lion Stance.",
            actions: [
                {
                    name: "Exit Stance",
                    images: {
                        base: `${NEWERA.images}/equipment-body.png`,
                        left: `${NEWERA.images}/guardian.png`,
                        right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `You exit your current fighting stance.`,
                    overrideMacroCommand: "game.newera.HotbarActions.exitStance()",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "End",
                        die: "equipment-body",
                        difficulty: null,
                        callback: actor => Guardian.endStance(actor)
                      }
                    ]
                },
                {
                    name: "Gorilla Stance",
                    images: {
                        base: `${NEWERA.images}/gorilla.png`,
                        left: `${NEWERA.images}/guardian.png`,
                        right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You move low to the ground and fight with your fists. While in this stance:
                    <ul>
                        <li style="color: lightblue">Your basic unarmed attack deals 1d6 damage plus your Strength modifier.</li>
                        <li style="color: lightblue">You gain a Strong Punch attack (2 frames) that deals 1d12 Bludgeoning damage plus your Strength modifier.</li>
                        <li style="color: salmon">You have disadvantage on Agility checks and Reflex saves.</li>
                        <li style="color: salmon">You can't hold any items or cast spells, and can only make unarmed attacks.</li>
                    </ul>
                </p>`,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Gorilla')",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "gorilla",
                        callback: actor => Guardian.activateFightingStance(actor, "Gorilla")
                      },
                      {
                        label: "Punch",
                        caption: "Strong Punch (Gorilla Stance)",
                        die: "unarmed_attack",
                        formula: "d20+@skills.dexterity.mod+@proficiencyBonus.guardian",
                      },
                      {
                        label: "Damage",
                        caption: "Strong Punch Damage",
                        die: "d6",
                        formula: "1d6+@abilities.strength.mod"
                      }
                    ]
                },
                {
                    name: "Mountain Stance",
                    images: {
                        base: `${NEWERA.images}/peaks.png`,
                        left: `${NEWERA.images}/guardian.png`,
                        right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You assume the stance of an immovable mountain. While in this stance:
                    <ul>
                        <li style="color: lightblue">You gain a +2 bonus to your Natural Armor.</li>
                        <li style="color: lightblue">You gain a +5 bonus on checks against being staggered, stunned, or forcefully moved.</li>
                        <li style="color: salmon">Your Speed is reduced by 4.</li>
                    </ul>
                </p>`,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Mountain')",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "peaks",
                        callback: actor => Guardian.activateFightingStance(actor, "Mountain")
                      }
                    ]
                },
                {
                    name: "Lion Stance",
                    images: {
                        base: `${NEWERA.images}/lion.png`,
                        left: `${NEWERA.images}/guardian.png`,
                        right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                    You gain the speed and reflexes of a big cat, allowing you to move about quickly to protect your allies. While in this stance:
                    <ul>
                        <li style="color: lightblue">Your Speed increases by 6.</li>
                        <li style="color: lightblue">You gain a +5 bonus on the Tackle, Protect Ally, and Pull to Safety actions.</li>
                        <li style="color: salmon">You cannot attack.</li>
                    </ul>
                </p>`,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Lion')",
                    difficulty: null,
                    actionType: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "lion",
                        callback: actor => Guardian.activateFightingStance(actor, "Lion")
                      }
                    ]
                }
            ]
        },
        {
            level: 4,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Guardian table.</p>
            <div class="magic-info">
                <h4>3 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.guardian",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5]
                }
            ]
        },
        {
            level: 4,
            name: "Spell Studies (1<sup>st</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Common Guardian Spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 1,
                    lists: ["guardian"],
                    spellType: "SE",
                    level: {
                        max: 1
                    }
                }
            ]
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
            name: "Second Wind",
            key: true,
            description: `<p>As an adventuring action, you can spend 15 minutes to roll any number of your Second Wind dice (d6). You recover hit points equal to the total result.</p>
            <p>You recover one die per hour of resting, or all your dice after an 8-hour full rest. You gain more Second Wind dice as you level up according to the Guardian table.</p>`,
            tableValues: [
                {
                    field: "secondWind.roll",
                    label: "Second Wind Die",
                    sign: false,
                    values: [null, "", "", "", "", "", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d10"]
                },
                {
                    field: "secondWind.count",
                    label: "Dice per Day",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 3, 4, 5, 5, 6, 7, 8, 9, 10, 10, 11, 12, 13, 14, 15],
                    onUpdate: (actor, from, to) => actor.updateResourceByName("Second Wind Dice", {
                        max: to
                    })
                }
            ],
            actions: [
                {
                    name: "Second Wind",
                    images: {
                      base: `${NEWERA.images}/mighty-force.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_adventuring.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: "You roll one or more of your Second Wind dice and recover hit points equal to the total result.",
                    overrideMacroCommand: "game.newera.HotbarActions.secondWind()",
                    difficulty: null,
                    type: "E",
                    rolls: [
                      {
                        label: "Recover",
                        die: "mighty-force",
                        callback: actor => Guardian.secondWind(actor)
                      }
                    ]
                }
            ],
            onUnlock: actor => {
                actor.addResource({
                    name: "Second Wind Dice",
                    value: 3,
                    max: 3,
                    custom: false,
                    daily: true
                });
            }
        },
        {
            level: 7,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Common Guardian Spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 2 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["guardian"],
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                }
            ]
        },
        {
            level: 7,
            id: "guardian.bonus",
            name: "Guardian Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "1": {
                    label: "Choose a Stat Bonus",
                    options: {
                        speed: "Speed",
                        carryWeight: "Carry Weight",
                        naturalArmor: "Natural Armor"
                    }
                }
            }
        },
        {
            level: 8,
            common: "learningExperience"
        },
        {
            level: 8,
            name: "Stamina",
            key: false,
            description: "The effects of Exhaustion on you are reduced by one level. <i>(You still gain the Exhaustion status effect, but it's treated as though it were one level lower. Exhaustion 1 has no effect, and Exhaustion 6 is required to cause death.)</i>"
        },
        {
            level: 9,
            common: "naturalSkillImprovement"
        },
        {
            level: 9,
            name: "Guardian's Vigor (d8)",
            key: false,
            description: "Your Second Wind die becomes a d8."
        },
        {
            level: 10,
            common: "specialtyImprovement"
        },
        {
            level: 10,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Guardian Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 3 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["guardian"],
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    spellType: "SE",
                    level: {
                        max: 3
                    }
                }
            ]
        },
        {
            level: 10,
            name: "Sentinel Stance",
            key: false,
            description: "You learn the Sentinel Stance, which focuses on fighting reactively and letting your enemies make the first move.",
            actions: [
                {
                    name: "Sentinel Stance",
                    images: {
                      base: `${NEWERA.images}/guards.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `While in this stance, your turn length is reduced by 2 frames, but you gain 2 reaction frames.`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Sentinel')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "guards",
                        callback: actor => Guardian.activateFightingStance(actor, "Sentinel")
                      }
                    ]
                }
            ]
        },
        {
            level: 11,
            common: "abilityScoreImprovement"
        },
        {
            level: 12,
            name: "Arcane Fighter",
            key: false,
            description: `<p>You learn the Swordsman, Monk, and Ward stances. These new fighting stances make use of your magical powers.</p>`,
            actions: [
                {
                    name: "Swordsman Stance",
                    images: {
                      base: `${NEWERA.images}/relic-blade.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `
                    <p><b>Activation Cost: 20 Energy</b></p>
                    <p>You conjure an Ethereal Longsword in your dominant hand upon activating this stance.</p>
                    <ul>
                        <li style="color: lightblue">Your ethereal sword inflicts magical damage, allowing it to damage ghosts.</li>
                        <li style="color: lightblue">The sword doesn't suffer damage from Parrying attacks.</li>
                        <li style="color: salmon">The sword disappears when you exit this stance.</li>
                        <li style="color: salmon">You exit this stance automatically if the sword leaves your hands for even an instant.</li>
                    </ul>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Swordsman')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "relic-blade",
                        callback: actor => Guardian.activateFightingStance(actor, "Swordsman")
                      }
                    ]
                },
                {
                    name: "Monk Stance",
                    images: {
                      base: `${NEWERA.images}/kindle.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>Most spells only require the use of one hand. This stance employs a special techique wherein by using both hands to cast spells, you're able to increase their power. You must have both hands free when activating this stance.</p>
                    <ul>
					<li style="color: lightblue">Spells you cast are amplified to the next-highest factor. The casting difficulty of the spell remains unchanged, but its energy cost reflects the amplified level.</li>
					<li style="color: lightblue">You have advantage on saves against your concentration being broken.</li>
					<li style="color: salmon">You can't hold items and can only attack by casting spells.</li>
				    </ul>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Monk')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "kindle",
                        callback: actor => Guardian.activateFightingStance(actor, "Monk")
                      }
                    ]
                },
                {
                    name: "Ward Stance",
                    images: {
                      base: `${NEWERA.images}/rosa-shield.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `
                    <p><b>Activation Cost: 6 Energy</b></p>
                    <p>You channel your Qi into a powerful defensive posture. While in this stance:</p>
                    <ul>
					<li style="color: lightblue">Spells you cast are amplified to the next-highest factor. The casting difficulty of the spell remains unchanged, but its energy cost reflects the amplified level.</li>
					<li style="color: lightblue">You have advantage on saves against your concentration being broken.</li>
					<li style="color: salmon">You can't hold items and can only attack by casting spells.</li>
				    </ul>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Ward')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "rosa-shield",
                        callback: actor => Guardian.activateFightingStance(actor, "Ward")
                      }
                    ]
                }
            ]
        },
        {
            level: 13,
            name: "Qi Rush",
            key: false,
            description: "You learn the Qi Rush cantrip."
        },
        {
            level: 13,
            id: "guardian.bonus",
            name: "Guardian Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "2": {
                    label: "Choose a Stat Bonus",
                    options: {
                        speed: "Speed",
                        carryWeight: "Carry Weight",
                        naturalArmor: "Natural Armor"
                    }
                }
            }
        },
        {
            level: 13,
            common: "naturalSkillImprovement"
        },
        {
            level: 14,
            common: "learningExperience"
        },
        {
            level: 14,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon Guardian Spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <h3>1 Uncommon spell from any school (Level 4 or lower)</h4>
                <h4>2 Common spells from any school (Level 4 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 2,
                    lists: ["guardian"],
                    spellType: "SE",
                    level: {
                        max: 4
                    }
                },
                {
                    choose: 1,
                    rarity: 2,
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
            level: 15,
            name: "Guardian's Vigor (d10)",
            key: false,
            description: "Your Second Wind die becomes a d10."
        },
        {
            level: 15,
            name: "Combat Expert",
            key: false,
            description: "Your turn length increases by one action frame and one reaction frame."
        },
        {
            level: 16,
            name: "Hot-Blooded",
            key: false,
            modifies: "Second Wind",
            description: `<p>You may use up to three of your Second Wind dice to increase the healing done by a Restoration spell or Medicine check you perform, or to increase the damage dealt by a spell or unarmed attack you make.</p>`,
            actions: [
                {
                    name: "Healing/Damage Boost",
                    images: {
                      base: `${NEWERA.images}/blast.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>Roll up to three of your Second Wind dice. The next time you make a Medicine check, unarmed attack, or cast a spell this turn, add the result of these rolls to the healing or damage done by that action.</p>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.hotBloodedBoost()",
                    type: "0",
                    rolls: [
                      {
                        label: "Activate",
                        die: "blast",
                        callback: actor => Guardian.hotBloodedBoostPrompt(actor)
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
            common: "specialtyImprovement"
        },
        {
            level: 18,
            name: "Spell Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Guardian Spell (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="All Divine Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/conjuration.png" data-tooltip="Conjuration" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/divination.png" data-tooltip="Divination" data-tooltip-direction="UP" />
                <h3>3 Uncommon spells from any school (Level 5 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    lists: ["guardian"],
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 3,
                    rarity: 2,
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                }
            ]
        },
        {
            level: 19,
            id: "guardian.bonus",
            name: "Guardian Bonus",
            key: false,
            description: "Choose one of the following stats to gain a +1 class bonus to.",
            selections: {
                "3": {
                    label: "Choose a Stat Bonus",
                    options: {
                        speed: "Speed",
                        carryWeight: "Carry Weight",
                        naturalArmor: "Natural Armor"
                    }
                }
            }
        },
        {
            level: 19,
            common: "naturalSkillImprovement"
        },
        {
            level: 20,
            common: "learningExperience"
        },
        {
            level: 20,
            name: "Advanced Fighting Techniques",
            key: false,
            modifies: "Qi",
            description: "You learn the Phalanx Stance and Flanking Stance.",
            actions: [
                {
                    name: "Phalanx Stance",
                    images: {
                      base: `${NEWERA.images}/backup.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `
                    <p>You project your Qi into a protective and invigorating energy field which forms a straight line perpendicular to the direction you're facing. Allies standing on your sides form a Phalanx formation, taking advantage of your energy to create a powerful defensive wall. Allies are part of the Phalanx formation as long as they're standing immediately to your left or right, or to the left or right of another ally that is also part of the formation.</p>
                    <p>While in this stance:</p>
                    <ul>
					<li style="color: lightblue">Allies have advantage on attack actions and <a>Defense</a> checks while positioned immediately to your left or right side. Other allies to the side of those creatures also gain these benefits. You gain the same benefit as long as the formation is maintained.</li>
					<li style="color: lightblue">Whenever you move on your turn, any allies on your left or right side can move up to their speed as a free action to maintain their positions in the phalanx.</li>
					<li style="color: salmon">You exit the stance whenever no ally is standing on your immediate left or right.</li>
				    </ul>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Phalanx')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "backup",
                        callback: actor => Guardian.activateFightingStance(actor, "Phalanx")
                      }
                    ]
                },
                {
                    name: "Flanking Stance",
                    images: {
                      base: `${NEWERA.images}/encirclement.png`,
                      left: `${NEWERA.images}/guardian.png`,
                      right: `${NEWERA.images}/ac_1frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `
                    <p>
                        Your Qi amplifies your <a>Perception</a> and situational awareness. While in this stance, you and one or more allies can Flank an enemy creature for a tactical edge.
				        A creature is flanked as long as you and at least one ally are adjacent to an enemy and on opposite sides or corners.
                    </p>
                    <p>While in this stance:</p>
                    <ul>
                        <li style="color: lightblue">You and your allies have advantage on attack actions and <a>Defense</a> checks against flanked creatures.</li>
					    <li style="color: lightblue">Whenever an enemy you're flanking attacks an ally, you get an <a page="opportunity">opportunity attack</a> against that creature.</li>
					    <li style="color: salmon">If you aren't flanking at least one enemy when your turn ends, you exit this stance.</li>
				    </ul>`,
                    difficulty: null,
                    overrideMacroCommand: "game.newera.HotbarActions.enterStance('Flanking')",
                    type: "1",
                    rolls: [
                      {
                        label: "Activate",
                        die: "encirclement",
                        callback: actor => Guardian.activateFightingStance(actor, "Flanking")
                      }
                    ]
                }
            ]
        }
    ]

    static classFeats = {
        "594": { //Lemur Stance 
            "1": {
                actions: [
                    {
                        name: "Lemur Stance",
                        images: {
                            base: `${NEWERA.images}/koala.png`,
                            left: `${NEWERA.images}/guardian.png`,
                            right: `${NEWERA.images}/ac_1frame.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: `<p>
                        You leap about with incredible agility. While in this stance:
                        <ul>
                            <li style="color: lightblue">Your Speed increases by 4.</li>
                            <li style="color: lightblue">You gain a +10 bonus to the Long Jump, High Jump, and Tumble actions.</li>
                            <li style="color: salmon">You can't equip items in either hand.</li>
                        </ul>
                    </p>`,
                        overrideMacroCommand: "game.newera.HotbarActions.enterStance('Lemur')",
                        difficulty: null,
                        actionType: "1",
                        rolls: [
                          {
                            label: "Activate",
                            die: "jump1",
                            callback: actor => Guardian.activateFightingStance(actor, "Lemur")
                          },
                        ]
                    }
                ]
            }
        },
        "424": { //Coursing River Stance
            "1": {
                actions: [
                    {
                        name: "Coursing River Stance",
                        images: {
                            base: `${NEWERA.images}/splashy-stream.png`,
                            left: `${NEWERA.images}/guardian.png`,
                            right: `${NEWERA.images}/ac_1frame.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: `
                        <p><b>Activation Cost: 10 Energy</b></p>
                        <p>
                        You make flowing movements that emanate your body's natural energy. While in this stance:
                        <ul>
                            <li style="color: lightblue">Your Speed increases by 2.</li>
                            <li style="color: lightblue">All Cryomancy spells cast by you and allies within 30 feet are amplified one level higher.</li>
                        </ul>
                    </p>`,
                        overrideMacroCommand: "game.newera.HotbarActions.enterStance('Coursing River')",
                        difficulty: null,
                        actionType: "1",
                        rolls: [
                          {
                            label: "Activate",
                            die: "splashy-stream",
                            callback: actor => Guardian.activateFightingStance(actor, "Coursing River")
                          },
                        ]
                    }
                ]
            }
        },
        "434": { //Great Typhoon Stance
            "1": {
                actions: [
                    {
                        name: "Great Typhoon Stance",
                        images: {
                            base: `${NEWERA.images}/tornado.png`,
                            left: `${NEWERA.images}/guardian.png`,
                            right: `${NEWERA.images}/ac_1frame.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: `
                        <p><b>Activation Cost: 10 Energy</b></p>
                        <p>
                        You put the full force of your body's strength behind your spells. While in this stance:
                        <ul>
                            <li style="color: lightblue">All Evocation spells cast by you and allies within 30 feet are amplified one level higher.</li>
                        </ul>
                    </p>`,
                        overrideMacroCommand: "game.newera.HotbarActions.enterStance('Great Typhoon')",
                        difficulty: null,
                        actionType: "1",
                        rolls: [
                          {
                            label: "Activate",
                            die: "tornado",
                            callback: actor => Guardian.activateFightingStance(actor, "Great Typhoon")
                          },
                        ]
                    }
                ]
            }
        },
        "435": { //Raging Fire Stance
            "1": {
                actions: [
                    {
                        name: "Raging Fire Stance",
                        images: {
                            base: `${NEWERA.images}/burning-forest.png`,
                            left: `${NEWERA.images}/guardian.png`,
                            right: `${NEWERA.images}/ac_1frame.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: `
                        <p><b>Activation Cost: 10 Energy</b></p>
                        <p>
                        You let your emotions run wild for a brief moment. While in this stance:
                        <ul>
                            <li style="color: lightblue">You gain a +1 bonus to Strength ability checks.</li>
                            <li style="color: lightblue">All Pyromancy spells cast by you and allies within 30 feet are amplified one level higher.</li>
                        </ul>
                    </p>`,
                        overrideMacroCommand: "game.newera.HotbarActions.enterStance('Raging Fire')",
                        difficulty: null,
                        actionType: "1",
                        rolls: [
                          {
                            label: "Activate",
                            die: "burning-forest",
                            callback: actor => Guardian.activateFightingStance(actor, "Raging Fire")
                          },
                        ]
                    } 
                ]
            }
        },
        "423": { //Fierce Protector
            "1": {
                actions: [
                    {
                        name: "Rage",
                        images: {
                            base: `${NEWERA.images}/fire-dash.png`,
                            left: `${NEWERA.images}/guardian.png`,
                            right: `${NEWERA.images}/ac_reaction.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: `<p>You enter Rage as a reaction to seeing an ally or friend get hurt. Rage lasts until combat ends or until the end of your turn if you didn't attack that turn.</p>
                        <p>Use this as a reaction to witnessing any ally take a critical hit or be knocked prone, stunned, or unconscious.</p>
                        `,
                        overrideMacroCommand: "game.newera.HotbarActions.rage()",
                        difficulty: null,
                        actionType: "1",
                        rolls: [
                          {
                            label: "Rage",
                            die: "burning-forest",
                            callback: actor => Guardian.rage(actor)
                          },
                        ]
                    }
                ]
            }
        },
        "428": { //Fast Vitality
            "1": {
                actions: [
                    {
                        name: "Second Wind (Quick)",
                        images: {
                          base: `${NEWERA.images}/mighty-force.png`,
                          left: `${NEWERA.images}/guardian.png`,
                          right: `${NEWERA.images}/ac_1frame.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: "You roll one of your Second Wind dice and recover hit points equal to the total result.",
                        overrideMacroCommand: "game.newera.HotbarActions.secondWind()",
                        difficulty: null,
                        type: "1",
                        rolls: [
                          {
                            label: "Recover",
                            die: "mighty-force",
                            callback: actor => Guardian.secondWind(actor)
                          }
                        ]
                    }
                ]
            }
        }
    }

    static async activateFightingStance(actor, name){
        const stance = Guardian.stanceEffects[name];
        if (!stance){
            ui.notifications.error("Macro error: Stance not found");
            return;
        }
        if (stance.activationCost){
            if (actor.system.energy.value < stance.activationCost){
                ui.notifications.warn(`This stance requires ${stance.activationCost} energy to activate. You don't have enough energy.`);
                return;
            }
            await actor.update({
                system: {
                    energy: {
                        value: actor.system.energy.value - stance.activationCost
                    }
                }
            });
        }
        const oldStance = actor.effects.find(e => e.name && e.name.toLowerCase().includes("stance"));
        if (oldStance){
            actor.actionMessage(actor.img, `${NEWERA.images}/ac_1frame.png`, `{NAME} switches from ${oldStance.label} to ${stance.label}!`);
            oldStance.delete();
        } else {
            actor.actionMessage(actor.img, `${NEWERA.images}/ac_1frame.png`, `{NAME} enters ${stance.label}!`);
        }
        actor.createEmbeddedDocuments('ActiveEffect', [stance]);
    }

    static async endStance(actor){
        const oldStance = actor.effects.find(e => e.name && e.name.toLowerCase().includes("stance"));
        if (oldStance){
            actor.actionMessage(actor.img, `${NEWERA.images}/guardian.png`, `{NAME} exits ${oldStance.label}.`);
            oldStance.delete();
        } else {
            ui.notifications.warn(`${actor.name} isn't in a stance.`);
        }
    }

    static async secondWind(actor){
        if (actor.system.hitPoints.value >= actor.system.hitPoints.max) {
            ui.notifications.info(`${actor.name} is already at full health!`);
            return;
        }
        const resource = Object.entries(actor.system.additionalResources).find(r => r[1].name == "Second Wind Dice");
        if (resource && resource[1].value > 0){
            let roll = new Roll(`${actor.system.tableValues.secondWind.roll}`, actor.getRollData());
            await roll.evaluate();
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: actor}),
                flavor: "Second Wind"
            });
            await actor.heal(roll.total, false, false);
            let update = {
                system: {
                    additionalResources: {}
                }
            };
            update.system.additionalResources[resource[0]] = {
                value: resource[1].value - 1
            };
            await actor.update(update);
            ui.notifications.info(`You recovered ${roll.total} HP with Second Wind. ${actor.name} has ${resource[1].value - 1} Second Wind dice left.`);
        } else {
            ui.notifications.error(`${actor.name} has expended all their Second Wind dice. Recover one die per hour of resting, or all your dice on a full rest.`);
        }
    }

    static async hotBloodedBoostPrompt(actor) {
        new Dialog({
            title: `Hot-Blooded Boost [${actor.name}]`,
            content: `<p>Select the number of dice to roll.</p>`,
            buttons: {
                roll1: {
                    icon: `<i class="fa-solid fa-dice"></i>`,
                    label: `Roll 1`,
                    callback: () => Guardian.hotBloodedBoost(actor, 1)
                },
                roll2: {
                    icon: `<i class="fa-solid fa-dice"></i>`,
                    label: `Roll 2`,
                    callback: () => Guardian.hotBloodedBoost(actor, 2)
                },
                roll3: {
                    icon: `<i class="fa-solid fa-dice"></i>`,
                    label: `Roll 3`,
                    callback: () => Guardian.hotBloodedBoost(actor, 3)
                }
            }
        }).render(true);
    }

    static async hotBloodedBoost(actor, amount) {
        const resource = Object.entries(actor.system.additionalResources).find(r => r[1].name == "Second Wind Dice");
        if (resource && resource[1].value >= amount){
            const die = actor.system.tableValues.secondWind.roll;
            const formula = `${amount}${die}`;
            const roll = new Roll(formula, actor.getRollData());
            await roll.evaluate();
            await actor.actionMessage(actor.img, '', "{NAME} spends {0} of {d} Second Wind dice to increase damage or healing.", amount);
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: actor}),
                flavor: "Healing/Damage Boost (Hot-Blooded)"
            });
            let update = {
                system: {
                    additionalResources: {}
                }
            };
            update.system.additionalResources[resource[0]] = {
                value: resource[1].value - amount
            };
            await actor.update(update);
        } else {
            ui.notifications.error(`${actor.name} doesn't have that many Second Wind dice available. Recover one die per hour of resting, or all your dice on a full rest.`);
        }
    }

    static async rage(actor){
        actor.actionMessage(actor.img, null, "{NAME} is becoming enraged!");
            await actor.createEmbeddedDocuments('ActiveEffect', [{
                label: "Rage",
                img: `${NEWERA.images}/fire-dash.png`,
                description: `<p>Your physical abilities are enhanced at the cost of reduced presence of mind. Your Rage ends at the end of combat, or at the end of your turn if you did not attempt an attack during that turn.</p>
                <ul>
                    <li>Your Speed is increased by 4 feet.</li>
                    <li>Strength-based attacks deal additional damage according to your Rage Damage Bonus in the Mercenary table.</li>
                    <li>You're immune to being staggered.</li>
                    <li>You have disadvantage on all mental ability-based checks.</li>
                    <li>Your Passive Perception is reduced by 4.</li>
                </ul>`
            }]);
    }

    static stanceEffects = {
        "Gorilla": {
            label: "Gorilla Stance",
            img: `${NEWERA.images}/gorilla.png`,
            description: `<p>
            You move low to the ground and fight with your fists. While in this stance:
            <ul>
                <li style="color: lightblue">Your basic unarmed attack deals 1d6 damage plus your Strength modifier.</li>
                <li style="color: lightblue">You gain a Strong Punch attack (2 frames) that deals 1d12 Bludgeoning damage plus your Strength modifier.</li>
                <li style="color: salmon">You have disadvantage on Agility checks and Reflex saves.</li>
                <li style="color: salmon">You can't hold any items or cast spells, and can only make unarmed attacks.</li>
            </ul>
        </p>
        <p>You may exit your stance as a free action or switch to another stance in one frame. You exit your stance when combat ends.</p>`
        },
        "Mountain": {
            label: "Mountain Stance",
            img: `${NEWERA.images}/peaks.png`,
            description: `<p>
            You assume the stance of an immovable mountain. While in this stance:
            <ul>
                <li style="color: lightblue">You gain a +2 bonus to your Natural Armor.</li>
                <li style="color: lightblue">You gain a +5 bonus on checks against being staggered, stunned, or forcefully moved.</li>
                <li style="color: salmon">Your Speed is reduced by 4.</li>
            </ul>
        </p>`
        },
        "Lion": {
            label: "Lion Stance",
            img: `${NEWERA.images}/lion.png`,
            description: `<p>
            You gain the speed and reflexes of a big cat, allowing you to move about quickly to protect your allies. While in this stance:
            <ul>
                <li style="color: lightblue">Your Speed increases by 6.</li>
                <li style="color: lightblue">You gain a +5 bonus on the Tackle, Protect Ally, and Pull to Safety actions.</li>
                <li style="color: salmon">You cannot attack.</li>
            </ul>
        </p>`
        },
        "Sentinel": {
            label: "Sentinel Stance",
            img: `${NEWERA.images}/guards.png`,
            description: "Your turn length is reduced by 2 frames, but you gain 2 fraction frames"
        },
        "Swordsman": {
            label: "Swordsman Stance",
            img: `${NEWERA.images}/relic-blade.png`,
            description: `<p>
            Upon entering this stance, you conjure pure energy into the shape of a <a>Longsword</a> in your hand. This item functions identically to an Iron Longsword, but its attacks are magical.
            It can be used either one- or two-handed. Activating this stance requires least one free hand. While in this stance:
           <ul>
               <li style="color: lightblue">Your ethereal sword inflicts magical damage, allowing it to damage spirits.</li>
               <li style="color: lightblue">The sword can Parry (block) attacks without suffering damage.</li>
               <li style="color: salmon">You automatically exit this stance if the sword leaves your hands for any amount of time. When you exit this stance, the sword disappears.</li>
           </ul>
       </p>`,
            activationCost: 20
        },
        "Monk": {
            label: "Monk Stance",
            img: `${NEWERA.images}/kindle.png`,
            description: `<p>
            Most spells only require the use of one hand. This stance employs a special techique wherein by using both hands to cast spells, you're able to increase their power.
            You must have both hands free when activating this stance.
        </p>
        <p>
            <ul>
                <li style="color: lightblue">Spells you cast are amplified to the next-highest factor. The casting difficulty of the spell remains unchanged, but its energy cost reflects the amplified level.</li>
                <li style="color: lightblue">You have advantage on saves against your concentration being broken.</li>
                <li style="color: salmon">You can't hold items and can only attack by casting spells.</li>
            </ul>
        </p>`
        },
        "Ward": {
            label: "Ward Stance",
            img: `${NEWERA.images}/rosa-shield.png`,
            activationCost: 6,
            description: `<p>
			You channel your Qi into a powerful defensive posture. While in this stance:
				<ul>
					<li style="color: lightblue">You cast Abjuration spells two levels higher. <i>(The casting difficulty is determined as though your Divine Magic skill level were increased by 2.)</i></li>
					<li style="color: lightblue">If using a shield, its Shield Rating receives a +4 bonus.</li>
					<li style="color: salmon">You can't cast spells from any school of magic other than Abjuration.</li>
				</ul>
			</p>`
        },
        "Lemur": {
            label: "Lemur Stance",
            img: `${NEWERA.images}/jump1.png`,
            description: `<p>
            You leap about with incredible agility. While in this stance:
            <ul>
                <li style="color: lightblue">Your Speed increases by 4.</li>
                <li style="color: lightblue">You gain a +10 bonus to the Long Jump, High Jump, and Tumble actions.</li>
                <li style="color: salmon">You can't equip items in either hand.</li>
            </ul>
        </p>`
        },
        "Coursing River": {
            label: "Coursing River Stance",
            img: `${NEWERA.images}/splashy-stream.png`,
            activationCost: 10,
            description: `<p>
            You make flowing movements that emanate your body's natural energy. While in this stance:
            <ul>
                <li style="color: lightblue">Your Speed increases by 2.</li>
                <li style="color: lightblue">All Cryomancy spells cast by you and allies within 30 feet are amplified one level higher.</li>
            </ul>
        </p>`
        },
        "Great Typhoon": {
            label: "Great Typhoon Stance",
            img: `${NEWERA.images}/tornado.png`,
            activationCost: 10,
            description: `<p>
            You put the full force of your body's strength behind your spells. While in this stance:
            <ul>
                <li style="color: lightblue">All Evocation spells cast by you and allies within 30 feet are amplified one level higher.</li>
            </ul>
        </p>`
        },
        "Raging Fire": {
            label: "Raging Fire Stance",
            img: `${NEWERA.images}/burning-forest.png`,
            activationCost: 10,
            description: `<p>
            You let your emotions run wild for a brief moment. While in this stance:
            <ul>
                <li style="color: lightblue">You gain a +1 bonus to Strength ability checks.</li>
                <li style="color: lightblue">All Pyromancy spells cast by you and allies within 30 feet are amplified one level higher.</li>
            </ul>
        </p>`
        },
        "Phalanx": {
            label: "Phalanx Stance",
            img: ``,
            description: `<p>
				You project your Qi into a protective and invigorating energy field which forms a straight line perpendicular to the direction you're facing. Allies standing on your sides form a Phalanx formation, taking advantage of your energy to create a powerful defensive wall.
				Allies are part of the Phalanx formation as long as they're standing immediately to your left or right, or to the left or right of another ally that is also part of the formation.
				<ul>
					<li style="color: lightblue">Allies have advantage on attack actions and <a>Defense</a> checks while positioned immediately to your left or right side. Other allies to the side of those creatures also gain these benefits. You gain the same benefit as long as the formation is maintained.</li>
					<li style="color: lightblue">Whenever you move on your turn, any allies on your left or right side can move up to their speed as a free action to maintain their positions in the phalanx.</li>
					<li style="color: salmon">You exit the stance whenever no ally is standing on your immediate left or right.</li>
				</ul>
			</p>`
        },
        "Flanking": {
            label: "Flanking Stance",
            img: ``,
            description: `<p>
				Your Qi amplifies your <a>Perception</a> and situational awareness. While in this stance, you and one or more allies can Flank an enemy creature for a tactical edge.
				A creature is flanked as long as you and at least one ally are adjacent to an enemy and on opposite sides or corners. While in this stance:
				<ul>
					<li style="color: lightblue">You and your allies have advantage on attack actions and <a>Defense</a> checks against flanked creatures.</li>
					<li style="color: lightblue">Whenever an enemy you're flanking attacks an ally, you get an <a page="opportunity">opportunity attack</a> against that creature.</li>
					<li style="color: salmon">If you aren't flanking at least one enemy when your turn ends, you exit this stance.</li>
				</ul>
			</p>`
        }
    }
}