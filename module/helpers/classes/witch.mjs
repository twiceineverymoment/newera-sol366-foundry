import { DarkEnergyPool } from "../../schemas/dark-energy-pool.mjs";
import { DarkEnergySheet } from "../../sheets/dark-energy.mjs";
import { NEWERA } from "../config.mjs";
import { HotbarActions } from "../actions/hotbarActions.mjs";
import { SpellFocus } from "../../sheets/spell-focus.mjs";

export class Witch {

    static hitPointIncrement = {
        roll: `1d6`,
        average: 4
    }

    static classFeatures = [
        {
            level: 1,
            id: "witch.specialties",
            name: "Witch Specialties",
            key: false,
            description: "Choose two of the following Specialties.",
            selections: {
                "1": {
                    label: "Specialty #1",
                    options: {
                        "animal-handling": "Animal Handling (Wisdom)",
                        "cooking": "Cooking (Technology)",
                        "frightening": "Frightening (Intimidation)",
                        "first-aid": "First Aid (Medicine)",
                        "impersonation": "Impersonation (Performance)",
                        "tracking": "Tracking (Instinct)"
                    }
                },
                "2": {
                    label: "Specialty #2",
                    options: {
                        "animal-handling": "Animal Handling (Wisdom)",
                        "cooking": "Cooking (Technology)",
                        "frightening": "Frightening (Intimidation)",
                        "first-aid": "First Aid (Medicine)",
                        "impersonation": "Impersonation (Performance)",
                        "tracking": "Tracking (Instinct)"
                    }
                }
            }
        },
        {
            level: 1,
            id: "witch.naturalSkills",
            name: "Witch Natural Skills",
            key: false,
            description: "Choose three of the following Natural Skills.",
            selections: {
                "1": {
                    label: "First Choice",
                    options: {
                        "performance": "Performance",
                        "logic": "Logic",
                        "insight": "Insight",
                        "instinct": "Instinct",
                        "medicine": "Medicine",
                        "spectral-magic": "Spectral Magic"
                    }
                },
                "2": {
                    label: "Second Choice",
                    options: {
                        "performance": "Performance",
                        "logic": "Logic",
                        "insight": "Insight",
                        "instinct": "Instinct",
                        "medicine": "Medicine",
                        "spectral-magic": "Spectral Magic"
                    }
                },
                "3": {
                    label: "Third Choice",
                    options: {
                        "performance": "Performance",
                        "logic": "Logic",
                        "insight": "Insight",
                        "instinct": "Instinct",
                        "medicine": "Medicine",
                        "spectral-magic": "Spectral Magic"
                    }
                }
            }
        },
        {
            level: 1,
            name: "Spellcasting",
            key: true,
            description: `<p>You've unlocked your magical abilities.</p>
            <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
            <p>Your Caster Level increases with your level according to the Scholar table.</p>
            <div class="magic-info">
                <h4>4 Magic Skill Points</h4>
                <img class="resource-icon" src="${NEWERA.images}/elemental.png" data-tooltip="Elemental" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/physical.png" data-tooltip="Physical" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="Spectral" data-tooltip-direction="UP" />
            </div>
            `,
            tableValues: [
                {
                    field: "casterLevel.witch",
                    label: "Caster Level",
                    sign: false,
                    values: [null, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6]
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
                <h4>4 Common Witch Spells (Level 1)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 4,
                    rarity: 1,
                    lists: ["witch"],
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
            common: "learningExperience"
        },
        {
            level: 2,
            common: "naturalSkillImprovement"
        },
        {
            level: 3,
            id: "witch.archetype",
            name: "Familiar",
            key: false,
            description: `<p>You can summon a Familiar, a guardian spirit that takes the form of a spectral animal.</p>
            <p>Choose your familiar's form from the list below. You learn the innate Summon Familiar spell.</p>
            `,
            selections: {
                "1": {
                    label: "Choose a Familiar",
                    options: {
                        "raven": "Raven",
                        "snake": "Snake",
                        "cat": "Cat",
                        "hawk": "Hawk",
                        "wolf": "Wolf",
                        "spider": "Spider",
                        "owl": "Owl",
                        "bear": "Bear"
                    }
                }
            }
        },
        {
            level: 3,
            archetype: "raven",
            key: true,
            name: "Raven Familiar",
            description: `<p>Your familiar takes the form of a raven, crow, or parrot, giving it exceptional intelligence for an animal and the ability to mimic sounds and speech.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28, 32, 36, 40, 45, 50]
                }
            ]
        },
        {
            level: 3,
            archetype: "snake",
            key: true,
            name: "Snake Familiar",
            description: `<p>Your familiar takes the form of a snake, giving it the ability to sneak through almost any space.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28, 32, 36, 40, 45, 50]
                }
            ]
        },
        {
            level: 3,
            archetype: "wolf",
            key: true,
            name: "Wolf Familiar",
            description: `<p>Your familiar takes the form of a wolf, a pack hunter with keen senses and protective instincts.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28, 32, 36, 40, 45, 50]
                }
            ]
        },
        {
            level: 3,
            archetype: "hawk",
            key: true,
            name: "Hawk Familiar",
            description: `<p>Your familiar takes the form of a hawk, eagle, or falcon, giving it fast flight and a powerful talon attack.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28, 32, 36, 40, 45, 50]
                }
            ]
        },
        {
            level: 3,
            archetype: "bear",
            key: true,
            name: "Bear Familiar",
            description: `<p>Your familiar takes the form of a bear, giving it immense size and powerful attacks.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28, 32, 36, 40, 45, 50]
                }
            ]
        },
        {
            level: 3,
            archetype: "spider",
            key: true,
            name: "Spider Familiar",
            description: `<p>Your familiar takes the form of a spider, giving it exceptional dexterity and the ability to squeeze through extremely small spaces.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28, 32, 36, 40, 45, 50]
                }
            ]
        },
        {
            level: 3,
            archetype: "cat",
            key: true,
            name: "Cat Familiar",
            description: `<p>Your familiar takes the form of a cat, giving it keen senses, fast reflexes, and deadly claws.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28, 32, 36, 40, 45, 50]
                }
            ]
        },
        {
            level: 3,
            archetype: "owl",
            key: true,
            name: "Owl Familiar",
            description: `<p>Your familiar takes the form of an owl, a deadly and silent nocturnal hunter.</p>
            <p>Your Familiar's maximum hit points increase with your level according to the Witch table.</p>
            `,
            tableValues: [
                {
                    field: "familiarBonusHp",
                    label: "Familiar Bonus HP",
                    sign: true,
                    values: [null, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 15, 18, 21, 24, 28, 32, 36, 40, 45, 50]
                }
            ]
        },
        {
            level: 4,
            common: "specialtyImprovement"
        },
        {
            level: 4,
            id: "witch.bonus",
            name: "Witch Bonus",
            key: false,
            description: "Choose one of the following bonuses.",
            selections: {
                "1": {
                    label: "Choose a bonus",
                    options: {
                        "extraSpell": "Learn 1 Common spell of any school",
                        "extraPotion": "Learn 1 Common potion recipe",
                    }
                }
            }
        },
        {
            level: 5,
            common: "learningExperience"
        },
        {
            level: 5,
            name: "Spell Studies (2<sup>nd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>2 Uncommon Witch Spells (Level 2 or lower)</h4>
                <h4>2 Common Witch spells (Level 2 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 2,
                    rarity: 2,
                    lists: ["witch"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 2
                    }
                },
                {
                    choose: 2,
                    rarity: 1,
                    lists: ["witch"],
                    restricted: true,
                    spellType: "SE",
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
            key: false,
            name: "Spiritual Connection",
            description: "Your familiar's turn length increases to 2 frames."
        },
        {
            level: 7,
            key: true,
            name: "Dark Energy",
            description: `<p>You have a reserve of Dark Energy. This is a special magical energy pool that is shared between you and nearby allies. Whenever any allied creature within 30 feet casts a spell, they may use your dark energy to cover some or all of the spell's energy cost. You control which creatures have access to your dark energy.</p>
            <p>Your Dark Energy increases with your level according to the Witch table, and is separate from your normal energy pool which increases with your caster level as normal.</p>`,
            tableValues: [
                {
                    field: "darkEnergy",
                    label: "Max. Dark Energy",
                    sign: false,
                    values: [null, 0, 0, 0, 0, 0, 0, 15, 20, 25, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 100]
                }
            ],
            actions: [
                {
                    name: "Dark Energy",
                    images: {
                        base: `${NEWERA.images}/dark-energy.png`,
                        left: `${NEWERA.images}/witch.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>
                        Display the status of your Dark Energy pool. Allies you've given the ability to use your energy can also use this action to view how much is remaining.
                    </p>`,
                    difficulty: null,
                    actionType: "0",
                    overrideMacroCommand: "game.newera.HotbarActions.displayDarkEnergy()",
                    rolls: [
                      {
                        label: "Open",
                        die: "dark-energy",
                        callback: actor => new DarkEnergySheet(actor).render(true) 
                      }
                    ]
                },
                {
                    name: "Grant Dark Energy Powers",
                    images: {
                        base: `${NEWERA.images}/linked-rings.png`,
                        left: `${NEWERA.images}/witch.png`,
                        right: `${NEWERA.images}/ac_0frame.png`
                    },
                    ability: null,
                    skill: null,
                    specialties: [],
                    description: `<p>You grant an ally the power to draw from your Dark Energy pool when casting spells.</p>
                    <p>Select an allied creature's token on the map, then click Grant.</p>`,
                    difficulty: null,
                    actionType: "0",
                    overrideMacroCommand: null,
                    rolls: [
                        {
                            label: "Grant",
                            die: "linked-rings",
                            callback: actor => Witch.grantDarkEnergyToSelectedToken(actor)
                        }
                    ]
                }
            ]
        },
        {
            level: 8,
            common: "naturalSkillImprovement"
        },
        {
            level: 8,
            name: "Spell Studies (3<sup>rd</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>3 Uncommon Witch Spells (Level 3 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 3 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 3,
                    rarity: 2,
                    lists: ["witch"],
                    restricted: true,
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
            level: 9,
            common: "specialtyImprovement"
        },
        {
            level: 9,
            archetype: "raven",
            key: false,
            name: "Mimicry",
            description: `<p>Your familiar can mimic and repeat sounds it hears. It gains the Mimic Sound action.</p>
            <p>Ravens can mimic short sounds, such as cell phone ringtones and the calls of other creatures. It can also mimic and repeat human speech, in single words or short phrases up to five words in length.</p>`
        },
        {
            level: 9,
            archetype: "snake",
            key: false,
            name: "Venom",
            description: "Your familiar can Envenomate targets when summoned at level 9 or higher. This attack inflicts the Poisoned status effect and always hits when the familiar has already grappled a creature."
        },
        {
            level: 9,
            archetype: "bear",
            key: false,
            name: "Mount",
            description: `<p>Your familiar can act as a mount. The number and total size of creatures it can carry increases with its summon level.</p>
            <p>If a creature other than you mounts your familiar, you can willingly give that creature control of the familiar as an action. That creature retains control of the familiar on its turn until they dismount.</p>`
        },
        {
            level: 9,
            archetype: "cat",
            key: false,
            name: "Night Hunter",
            description: "Your familiar gains the Stealth, Athletics, and Agility skills with a level of 1 each."
        },
        {
            level: 9,
            archetype: "owl",
            key: false,
            name: "Ambush Predator",
            description: "Your familiar gains the Stealth skill with a level of 1, and it doesn't make any sound while flying. Creatures must succeed on a difficulty 12 Sight (Perception) check in order to react to the familiar's attack."
        },
        {
            level: 9,
            archetype: "spider",
            key: false,
            name: "Tarantula",
            description: `<p>You can summon your Spider familiar in Giant form by casting Summon Familiar one amplification level higher.</p>
            <p>The Giant spider gains a +5 Size bonus, a +6 Speed bonus, and a basic 1d6 Bite attack.</p>`
        },
        {
            level: 9,
            archetype: "wolf",
            key: false,
            name: "Takedown",
            description: "Your familiar's maximum Long Jump distance increases to 20 feet. If your familiar lands a Tackle attack immediately following a Long Jump, the attack deals an extra 1d6 damage and knocks the target prone."
        },
        {
            level: 9,
            archetype: "hawk",
            key: false,
            name: "Diving Attack",
            description: "Your familiar gains a powerful diving talon attack. Whenever it strikes a target with its talons while Diving, it deals +1d damage and the target has disadvantage on any reactions to the attack."
        },
        {
            level: 10,
            key: false,
            name: "Familiar Focus",
            description: `<p>Your familiar can cast spells.</p>
            <p>You can cast any spell you know through your Familiar, but it can't be amplified and it must draw from your Dark Energy. The cast difficulty of the spell is the same as it would be for you to cast it. Spells cast through your familiar that have a range of Self affect your familiar.</p>`
        },
        {
            level: 10,
            common: "learningExperience"
        },
        {
            level: 11,
            common: "abilityScoreImprovement"
        },
        {
            level: 12,
            name: "Spiritual Connection",
            key: false,
            description: `<p>Your Familiar's turn lengthy increases to 3 action frames.</p>`
        },
        {
            level: 12,
            common: "naturalSkillImprovement"
        },
        {
            level: 13,
            archetype: "raven",
            name: "Object Searching",
            key: false,
            description: "Your Raven familiar gains a +5 bonus to Perception checks involving sight. You can command your familiar to search for a specific object and retrieve it."
        },
        {
            level: 13,
            archetype: "snake",
            name: "In Many Sizes",
            key: false,
            description: "When you summon your Snake familiar, you can choose any size from -9 to +2 for it to take. When summoned with Summon Familiar IV or higher, your familiar gains a Constricting attack."
        },
        {
            level: 13,
            archetype: "cat",
            name: "Double Jump",
            key: false,
            description: "When summoned with Summon Familiar IV or higher, its base Jump distance increases to 20 feet laterally and 10 feet vertically. When your familiar Jumps, it can Jump again as a reaction before landing."
        },
        {
            level: 13,
            archetype: "hawk",
            name: "Intimidating Screech",
            key: false,
            description: "Your Hawk familiar can use a loud screeching call to frighten enemies. It gains the Frighten action and a +2 Intimidation skill."
        },
        {
            level: 13,
            archetype: "wolf",
            name: "Mount",
            key: false,
            description: "Your Wolf familiar gains the ability to be mounted. It can only be controlled by you and can't carry additional riders."
        },
        {
            level: 13,
            archetype: "spider",
            name: "Ensnaring Web",
            key: false,
            description: "Your Spider familiar can spin webs to ensnare enemies. Creatures are either restrained or staggered when they move through the web, depending on their size."
        },
        {
            level: 13,
            archetype: "owl",
            name: "Diving Talon Attack",
            key: false,
            description: "Your Owl familiar gains a Dive action. Its Fly speed is doubled while diving, and its Talon attack deals +1d damage while diving."
        },
        {
            level: 13,
            archetype: "bear",
            name: "Protective Companion",
            key: false,
            description: "Your familiar gains a reaction frame and the Protect Ally action."
        },
        {
            level: 13,
            name: "Spell Studies (4<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>4 Uncommon Witch Spells (Level 4 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                <h4>2 Common spells from any school (Level 4 or lower)</h4>
            </div>
            `,
            spellStudies: [
                {
                    choose: 4,
                    rarity: 2,
                    lists: ["witch"],
                    restricted: true,
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
            level: 14,
            common: "specialtyImprovement"
        },
        {
            level: 14,
            id: "witch.bonus",
            name: "Witch Bonus",
            key: false,
            description: "Choose one of the following bonuses.",
            selections: {
                "2": {
                    label: "Choose a bonus",
                    options: {
                        "extraSpell": "Learn 1 Common spell of any school",
                        "extraPotion": "Learn 1 Common potion recipe",
                    }
                }
            }
        },
        {
            level: 15,
            name: "Collective Might",
            key: false,
            description: `<p>Whenever a spell is cast using your Dark Energy, another creature in range can assist on the spellcasting check. That creature has disadvantage unless they also know the spell being cast.</p><p>Spells cast with assistance using this ability are automatically amplified to the next-highest factor.</p>`
        },
        {
            level: 16,
            common:"naturalSkillImprovement"
        },
        {
            level: 16,
            name: "Spell Studies (5<sup>th</sup> Level)",
            key: false,
            description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
            <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
            <div class="magic-info">
                <h4>1 Rare Witch Spell (Level 5 or lower)</h4>
                <h4>3 Uncommon Witch Spells (Level 5 or lower)</h4>
                <img class="resource-icon" src="${NEWERA.images}/spectral.png" data-tooltip="All Spectral Schools" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/evocation.png" data-tooltip="Evocation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/transmutation.png" data-tooltip="Transmutation" data-tooltip-direction="UP" />
                <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
            </div>
            `,
            spellStudies: [
                {
                    choose: 1,
                    rarity: 3,
                    lists: ["witch"],
                    restricted: true,
                    spellType: "SE",
                    level: {
                        max: 5
                    }
                },
                {
                    choose: 3,
                    rarity: 2,
                    lists: ["witch"],
                    spellType: "SE",
                    level: {
                        max: 5
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
            id: "witch.bonus",
            name: "Witch Bonus",
            key: false,
            description: "Choose one of the following bonuses.",
            selections: {
                "3": {
                    label: "Choose a bonus",
                    options: {
                        "extraSpell": "Learn 1 Common spell of any school",
                        "extraPotion": "Learn 1 Common potion recipe",
                    }
                }
            }
        },
        {
            level: 18,
            archetype: "raven",
            key: false,
            name: "Wild Intelligence",
            description: "Your familiar gains the Logic, Insight, and Instinct skills with a level of 2. Your familiar can assist you on any of these skills, even for actions where assistance isn't usually possible."
        },
        {
            level: 18,
            archetype: "snake",
            key: false,
            name: "Rapid Strike",
            description: "Your familiar can use its Strike attack twice in a "
        }
    ]

    static classFeats = {
        "634": { //Magical Focus
            "1": {
                unlocksCoreFeature: "magicalFocus",
                actions: [
                    {
                        name: "Spell Storage",
                        images: {
                            base: `${NEWERA.images}/crystal-shine.png`,
                            left: `${NEWERA.images}/witch.png`,
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: `You utilize your Magical Focus to store spells ahead of time. You can cast your stored spells by releasing them from your focus.`,
                        difficulty: null,
                        actionType: "E",
                        overrideMacroCommand: `game.newera.HotbarActions.openSpellStorage()`,
                        rolls: [
                          {
                            label: "Focus",
                            die: "crystal-shine",
                            callback: actor => new SpellFocus(actor).render(true)
                          }
                        ]
                    }
                ]
            }
        }
    }

    static async initializeDarkEnergy(actor, reset){
        const max = actor.system.tableValues.darkEnergy;
        const value = reset ? max : (actor.system.darkEnergy ? actor.system.darkEnergy.value : 0);
        await actor.update({
            system: {
                darkEnergy: {
                    value: value,
                    min: 0,
                    max: max
                }
            }
        });
    }

    /**
     * Creates the ActiveEffect that grants an actor access to the witch's Dark Energy pool.
     * @param {Actor} actor A witch! Burn her!
     * @param {Actor} target The actor being granted access
     */
    static async grantDarkEnergy(actor, target){
        await target.createEmbeddedDocuments('ActiveEffect', [{
            img: `${NEWERA.images}/dark-energy.png`,
            label: `Dark Energy Link`,
            description: `<p>${actor.name} has given you the power to use ${actor.system.pronouns.possessiveDependent.toLowerCase()} dark energy pool.</p>
            <p>When you cast a spell, you can choose to cast it from the Dark Energy of any caster who has given you this power, or from your own energy.</p>`,
            origin: actor.id
        }]);
        ui.notifications.info(`You gave ${target.name} the power to use your Dark Energy.`);
    }

    static async grantDarkEnergyToSelectedToken(actor){
        const target = HotbarActions.getSelectedActor()
        if (!target){
            ui.notifications.error("No token is selected. Select the token of the person you want to grant dark energy power to.");
            return;
        }
        if (target.id == actor.id){
            ui.notifications.error("You don't need to grant this power to yourself! Select a different token, then try again.");
            return;
        }
        await Witch.grantDarkEnergy(actor, target);
    }


    static getDarkEnergyPools(actor){
        let pools = [];
        if (actor.system.darkEnergy){
            pools.push(new DarkEnergyPool(actor, true));
        }
        for (const link of actor.effects.filter(e => e.name == "Dark Energy Link")){
            const linkedActor = game.actors.get(link.origin);
            if (linkedActor && linkedActor.system.darkEnergy){
                pools.push(new DarkEnergyPool(linkedActor, false));
            }
        }
        return pools;
    }

}