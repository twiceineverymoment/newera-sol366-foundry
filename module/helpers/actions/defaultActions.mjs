import { Actions } from "./actions.mjs";
import { NEWERA } from "../config.mjs";

export const DefaultActions = {
    general: [
        {
            name: "Run",
            images: {
                base: `${NEWERA.images}/ac_movement.png`
            },
            ability: null,
            skill: null,
            specialties: [],
            description: "You move up to your Speed.",
            difficulty: 0,
            actionType: "M",
            displayCallback: (actor) => {
                return !actor.hasStatusEffect("unconscious") && !actor.hasStatusEffect("prone");
            },
            rolls: []
        },
        {
            name: "Sprint",
            images: {
                base: `${NEWERA.images}/run.png`,
                right: `${NEWERA.images}/ac_movement.png`
            },
            ability: null,
            skill: "athletics",
            specialties: ["Sprinting"],
            description: "Double your movement speed for one frame. You can attempt to sprint once per turn.",
            difficulty: "The GM sets the difficulty depending on circumstances, such as the terrain and weather conditions.",
            actionType: "movement",
            rolls: [
              {
                label: "Sprint",
                caption: "Sprint (Athletics)",
                die: "d20",
                formula: "1d20+@skills.athletics.mod+@specialty.partial.sprinting",
                message: "{NAME} sprints!",
                difficulty: null,
              }
            ]
        },
        {
            name: "Stand Up",
            images: {
                base: `${NEWERA.images}/equipment-body.png`,
                right: `${NEWERA.images}/ac_1frame.png`
            },
            ability: null,
            skill: null,
            specialties: [],
            description: "While Prone, you stand up.",
            difficulty: 0,
            actionType: "1",
            rolls: []
        },
        {
            name: "Jump",
            images: {
                base: `${NEWERA.images}/jump1.png`,
                right: `${NEWERA.images}/ac_1frame.png`
            },
            ability: null,
            skill: "athletics",
            specialties: ["Long Jump", "High Jump", "Jumping"],
            description: "You jump across a large gap or a great height. You can jump up to 2 feet in height and up to your speed minus your size modifier in distance. For longer or higher jumps, a check is required.",
            difficulty: "The GM sets the difficulty depending on the jump distance and environmental conditions.",
            actionType: "1",
            rolls: [
                {
                    label: "Long",
                    caption: "Long Jump (Athletics)",
                    die: "d20",
                    formula: "1d20+@skills.athletics.mod+@specialty.partial.jumping+@specialty.partial.long_jump",
                    difficulty: null,
                },
                {
                    label: "High",
                    caption: "High Jump (Athletics)",
                    die: "d20",
                    formula: "1d20+@skills.athletics.mod+@specialty.partial.jumping+@specialty.partial.high_jump",
                    difficulty: 20,
                }
            ]
        },
        {
            name: "Dodge",
            images: {
                base: `${NEWERA.images}/body-balance.png`,
                right: `${NEWERA.images}/ac_reaction.png`
            },
            ability: null,
            skill: "agility",
            specialties: ["Dodging"],
            description: "You try to avoid an incoming attack. Optionally, you may move 2 feet in any direction.",
            difficulty: "The result of your roll replaces your Passive Agility when contesting the attacker's roll.",
            actionType: "R",
            rolls: [
                {
                    label: "Dodge",
                    caption: "Dodge (Agility)",
                    die: "d20",
                    formula: "1d20+@skills.agility.mod+@specialty.partial.jumping+@specialty.partial.dodging",
                    message: "{NAME} tries to Dodge!",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Throw / Pass",
            images: {
                base: `${NEWERA.images}/throwing-ball.png`,
                right: `${NEWERA.images}/ac_1frame.png`
            },
            ability: null,
            skill: null,
            specialties: [],
            description: "Throw an item to a willing teammate, or as a projectile at an enemy.",
            difficulty: "No check is required to pass to an ally within 6 feet. For long distances or to target enemy creatures, the GM sets the difficulty.",
            actionType: "1",
            rolls: [
                {
                    label: "Distance",
                    caption: "Yeet for Distance (Athletics)",
                    die: "d20",
                    formula: "1d20+@skills.athletics.mod+@specialty.partial.throw_distance",
                    message: "{NAME} throws an item a great distance!",
                    difficulty: null,
                },
                {
                    label: "Accuracy",
                    caption: "Kobe for Accuracy (Marksmanship)",
                    die: "d20",
                    formula: "1d20+@skills.marksmanship.mod+@specialty.partial.throw_accuracy",
                    message: "{NAME} throws a projectile!",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Escape",
            images: {
                base: `${NEWERA.images}/breaking-chain.png`,
                right: `${NEWERA.images}/ac_2frame.png`
            },
            ability: "strength",
            skill: null,
            specialties: ["Escape"],
            description: "You attempt to escape from restraints or a creature's grasp. You may use your Strength to force your way free, or Agility to slip out.",
            difficulty: "The difficulty is based on the condition and type of restraint. It may be different for one method of escape versus the other.",
            actionType: "2",
            rolls: [
                {
                    label: "Strength",
                    caption: "Escape (Strength)",
                    die: "d20",
                    formula: "1d20+@abilities.strength.mod+@specialty.partial.escape",
                    difficulty: null,
                },
                {
                    label: "Agility",
                    caption: "Escape (Agility)",
                    die: "d20",
                    formula: "1d20+@skills.agility.mod+@specialty.partial.escape",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Unarmed Attack",
            images: {
                base: `${NEWERA.images}/unarmed_attack.png`,
                right: `${NEWERA.images}/ac_1frame.png`
            },
            ability: null,
            skill: "athletics",
            specialties: ["Brawl"],
            description: "When you haven't got your weapons ready, attack with your fists!",
            difficulty: "The difficulty of an attack is the target's passive agility, unless they react.",
            disable: actor => actor.type != "Creature" && !actor.hasFreeHands(1) ? "You must have a hand free to perform unarmed attacks." : false,
            type: "1",
            rolls: [
                {
                    label: "Attack",
                    caption: "Unarmed Attack",
                    die: "d20",
                    formula: "1d20+@skills.athletics.mod+@specialty.partial.brawl",
                    message: "{NAME} attacks with {d} fists!",
                    difficulty: null,
                },
                {
                    label: "Damage",
                    caption: "Damage (Unarmed Attack)",
                    die: "unarmed_attack",
                    formula: "1+@abilities.strength.mod"
                }
            ]
        }
    ],
    magic: [
        {
            name: "Cast a Spell",
            images: {
                base: `${NEWERA.images}/glowing-hands.png`,
            },
            ability: null,
            skill: null,
            specialties: [],
            description: "You cast a spell or enchantment that you've memorized. The time it takes to cast the spell varies depending on the type of spell.",
            difficulty: "The difficulty depends on your skill level in the spell's form of magic. Casting a spell at or below your current level doesn't require a check. For spells above your level, the difficulty is 10 for one level higher, plus 5 for each additional level.",
            altInstructions: "Cast spells and enchantments from the Magic tab.",
            disable: actor => actor.hasEnergyAvailable() ? false : "You don't have any energy!",
            actionType: "?",
            rolls: []
        },
        {
            name: "Sustain a Spell",
            images: {
                base: `${NEWERA.images}/fire-spell-cast.png`,
                right: `${NEWERA.images}/ac_1frame.png`
            },
            ability: null,
            skill: null,
            specialties: [],
            description: "You continue to concentrate on a sustained spell you're already casting. You may spend any number of frames on your turn sustaining a spell. If your turn ends without having used at least one frame to sustain a spell, the spell ends.",
            difficulty: "0",
            disable: actor => {
                if (!actor.hasEnergyAvailable()){
                    return "You don't have any energy!";
                }
                if (!actor.system.sustaining.id){
                    return "You aren't sustaining a spell right now. Cast one from the Magic tab.";
                }
                return false;
            },
            overrideMacroCommand: "game.newera.HotbarActions.sustainCurrentSpell()",
            actionType: "1",
            rolls: [
                {
                    label: "Sustain",
                    die: "fire-spell-cast",
                    callback: actor => Actions.sustainCurrentSpell(actor)
                }
            ]
        },
        {
            name: "Learn a Spell",
            images: {
                base: `${NEWERA.images}/scroll-unfurled.png`,
                right: `${NEWERA.images}/ac_restful.png`
            },
            ability: "wisdom",
            skill: null,
            specialties: [],
            description: "You attempt to commit a new spell to your subconscious memory from a spell script you can read. You must first meditate to become semi-conscious. You can attempt to learn up to three spells per successful meditation session.",
            difficulty: 10,
            altInstructions: "",
            actionType: "D",
            rolls: [
                {
                    label: "Meditate",
                    caption: "Meditation check",
                    die: "d20",
                    formula: "1d20+@abilities.wisdom.mod",
                    difficulty: 10
                }
            ]
        },
        {
            name: "Disenchant",
            images: {
                base: `${NEWERA.images}/shatter.png`,
                right: `${NEWERA.images}/ac_adventuring.png`
            },
            ability: null,
            skill: null,
            specialties: [],
            description: "You use your magical powers to remove an enchantment from an item. If the enchantment is complex, each component must be removed individually. Care must be taken, as removing them in the improper order might have unexpected results.",
            difficulty: "The difficulty is as though you were casting a spell one level higher than the target enchantment.",
            actionType: "E",
            rolls: [
                {
                    label: "Cast",
                    caption: "Disenchant Item",
                    die: "d20",
                    formula: "1d20+@data.casterLevel",
                    difficulty: 10
                },
            ]
        },
        {
            name: "End Spell",
            images: {
                base: `${NEWERA.images}/halt-2.png`,
                right: `${NEWERA.images}/ac_0frame.png`
            },
            ability: null,
            skill: null,
            specialties: [],
            description: "You end the effects of any sustained or ephemeral spell you're casting.",
            difficulty: "0",
            overrideMacroCommand: "game.newera.HotbarActions.stopAllSpells()",
            actionType: "0",
            disable: actor => (!actor.system.ephemeralEffectActive && !actor.system.sustaining.id) ? "You aren't casting any spells right now." : false,
            rolls: [
                {
                    label: "End Spell",
                    die: "halt-2",
                    callback: actor => actor.stopAllSpells()
                }
            ]
        },
    ],
    exploration: [
        {
            name: "Search the Area",
            images: {
                base: `${NEWERA.images}/binoculars.png`,
                right: `${NEWERA.images}/ac_3frame.png`
            },
            ability: null,
            skill: "perception",
            specialties: ["Searching"],
            description: "Look around the room for hard-to-find objects. This action can be performed once per player when entering a new room or area. You might suffer penalties if the room is poorly lit or if you're searching during combat.",
            difficulty: "The GM determines the perception difficulty of objects in the room and tells each player what they find.",
            actionType: "3",
            rolls: [
                {
                    label: "Search",
                    caption: "Perception check",
                    die: "d20",
                    formula: "1d20+@skills.perception.mod+@specialty.partial.searching",
                    message: "{NAME} searches the area!",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Examine",
            images: {
                base: `${NEWERA.images}/magnifying-glass.png`,
                right: `${NEWERA.images}/ac_adventuring.png`
            },
            ability: null,
            skill: "perception",
            specialties: ["Searching"],
            description: "You closely examine an object or small area to learn about its properties or hidden features. Use Perception if you're looking for things you may not have noticed, or Logic if you're trying to learn about an object based on what you can see.",
            difficulty: "The GM determines what you learn based on the outcome of your check.",
            actionType: "E",
            rolls: [
                {
                    label: "Perception",
                    caption: "Examine Object (Perception)",
                    die: "d20",
                    formula: "1d20+@skills.perception.mod+@specialty.partial.examination",
                    difficulty: null,
                },
                {
                    label: "Logic",
                    caption: "Examine Object (Logic)",
                    die: "d20",
                    formula: "1d20+@skills.logic.mod+@specialty.partial.examination",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Craft",
            images: {
                base: `${NEWERA.images}/crafting.png`,
                right: `${NEWERA.images}/ac_adventuring.png`
            },
            ability: null,
            skill: "technology",
            specialties: ["Crafting"],
            description: "You combine raw materials into a new item. You must have all the required materials before performing this action.",
            difficulty: "The difficulty and time taken depends on the item being crafted.",
            actionType: "E",
            rolls: [
                {
                    label: "Craft",
                    caption: "Crafting check",
                    die: "d20",
                    formula: "1d20+@skills.technology.mod+@specialty.partial.crafting",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Repair/Upgrade",
            images: {
                base: `${NEWERA.images}/anvil-impact.png`,
                right: `${NEWERA.images}/ac_adventuring.png`
            },
            ability: null,
            skill: "technology",
            specialties: ["Crafting", "Repair"],
            description: "You repair or upgrade an item in your inventory. You must have the appropriate raw materials.",
            difficulty: "The difficulty and time taken depends on the current condition, quality, and material of the item.",
            actionType: "E",
            rolls: [
                {
                    label: "Repair",
                    caption: "Crafting check - Repair",
                    die: "d20",
                    formula: "1d20+@skills.technology.mod+@specialty.partial.crafting+@specialty.partial.repair",
                    difficulty: null,
                },
                {
                    label: "Upgrade",
                    caption: "Crafting check - Upgrade",
                    die: "d20",
                    formula: "1d20+@skills.technology.mod+@specialty.partial.crafting+@specialty.partial.refinement",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Cook",
            images: {
                base: `${NEWERA.images}/cooking-pot.png`,
                right: `${NEWERA.images}/ac_adventuring.png`
            },
            ability: null,
            skill: "technology",
            specialties: ["Cooking"],
            description: "You prepare a meal for yourself or your party. A well-made meal before bed increases the benefits you get from resting.",
            difficulty: null,
            actionType: "E",
            rolls: [
                {
                    label: "Cook",
                    caption: "Cooking",
                    die: "d20",
                    formula: "1d20+@skills.technology.mod+@specialty.partial.cooking",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Wilderness Survival",
            images: {
                base: `${NEWERA.images}/forest-camp.png`,
                right: `${NEWERA.images}/ac_adventuring.png`
            },
            ability: null,
            skill: "instinct",
            specialties: ["Navigation", "Time", "Weather"],
            description: "You use your instincts to discern one of a number of things about your environment. You can use this skill to orient yourself in the wilderness, tell how long until the next sunrise or sunset, or predict changes in the weather.",
            difficulty: "The GM sets the difficulty based on the conditions of your environment.",
            actionType: "E",
            rolls: [
                {
                    label: "Navigate",
                    caption: "Wilderness Survival - Navigation (Instinct)",
                    die: "d20",
                    formula: "1d20+@skills.instinct.mod+@specialty.partial.navigation",
                    difficulty: null,
                },
                {
                    label: "Time",
                    caption: "Wilderness Survival - Time (Instinct)",
                    die: "d20",
                    formula: "1d20+@skills.instinct.mod+@specialty.partial.time",
                    difficulty: null,
                },
                {
                    label: "Weather",
                    caption: "Wilderness Survival - Weather (Instinct)",
                    die: "d20",
                    formula: "1d20+@skills.instinct.mod+@specialty.partial.weather",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Rest for the Night",
            images: {
                base: `${NEWERA.images}/bed.png`,
                right: `${NEWERA.images}/ac_restful.png`
            },
            ability: null,
            skill: null,
            specialties: [],
            description: "You sleep for the night, regaining energy and strength. For every hour you sleep, you regain HP equal to your hit point increment plus your level, and energy equal to your caster level.",
            actionType: "D",
            overrideMacroCommand: `game.newera.HotbarActions.restForTheNight()`,
            rolls: [
                {
                    label: "Sleep",
                    die: "bed",
                    callback: actor => Actions.restForTheNight(actor)
                }
            ]
        }
    ],
    social: [
        {
            name: "Socialize",
            images: {
                base: `${NEWERA.images}/character.png`,
                right: `${NEWERA.images}/ac_social.png`
            },
            ability: null,
            skill: "diplomacy",
            specialties: ["Socialization"],
            description: "With a few choice words or a flattering compliment, you attempt to gain a person's favor.",
            difficulty: "Contested (Determination)",
            actionType: "S",
            rolls: [
                {
                    label: "Socialize",
                    caption: "First Impression (Diplomacy)",
                    die: "d20",
                    formula: "1d20+@skills.diplomacy.mod+@specialty.partial.socialization",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Persuade",
            images: {
                base: `${NEWERA.images}/conversation.png`,
                right: `${NEWERA.images}/ac_social.png`
            },
            ability: null,
            skill: "diplomacy",
            specialties: ["Persuasion"],
            description: "You attempt to persuade someone to help you with a task or give you information. People with a high relationship to you are more likely to accept.",
            difficulty: "Contested (Insight)",
            actionType: "S",
            rolls: [
                {
                    label: "Persuade",
                    caption: "Persuade (Diplomacy)",
                    die: "d20",
                    formula: "1d20+@skills.diplomacy.mod+@specialty.partial.persuasion",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Trade",
            images: {
                base: `${NEWERA.images}/cash.png`,
                right: `${NEWERA.images}/ac_social.png`
            },
            ability: null,
            skill: "diplomacy",
            specialties: ["Persuasion"],
            description: "You haggle with another person to buy or sell an item at a good price. Use your Diplomacy or Deception skill to make an offer, and your Wisdom to tell if an offer or counter-offer is a good deal. Not all merchants are willing to haggle.",
            difficulty: null,
            actionType: "S",
            rolls: [
                {
                    label: "Offer",
                    caption: "Haggle - Offer (Diplomacy)",
                    die: "d20",
                    formula: "1d20+@skills.diplomacy.mod+@specialty.partial.trading",
                    difficulty: null,
                },
                {
                    label: "Deceive",
                    caption: "Haggle - Offer (Deception)",
                    die: "d20",
                    formula: "1d20+@skills.deception.mod+@specialty.partial.trading",
                    difficulty: null,
                },
                {
                    label: "Check",
                    caption: "Haggle - Check Offer (Wisdom)",
                    die: "d20",
                    formula: "1d20+@abilities.wisdom.mod+@specialty.partial.trading",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Seduce",
            images: {
                base: `${NEWERA.images}/charm.png`,
                right: `${NEWERA.images}/ac_social.png`
            },
            ability: "charisma",
            skill: null,
            specialties: ["Seduction"],
            description: "You use your charm to attract someone and attempt to form a positive relationship with them.",
            difficulty: "Contested (Insight) - This action has no effect unless you're compatible with the target's romantic and sexual preferences.",
            actionType: "S",
            rolls: [
                {
                    label: "Seduce",
                    caption: "Seduce (Charisma)",
                    die: "d20",
                    formula: "1d20+@abilities.charisma.mod+@specialty.partial.seduction",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Deceive",
            images: {
                base: `${NEWERA.images}/fingers-crossed.png`,
                right: `${NEWERA.images}/ac_social.png`
            },
            ability: null,
            skill: "deception",
            specialties: [],
            description: "You tell a convincing lie or come up with a good story.",
            difficulty: "Contested (Insight) - Creatures with a lower relationship to you are less likely to believe you.",
            actionType: "S",
            rolls: [
                {
                    label: "Lie",
                    caption: "Deception check",
                    die: "d20",
                    formula: "1d20+@skills.deception.mod",
                    difficulty: null,
                }
            ]
        },
        {
            name: "Intimidate",
            images: {
                base: `${NEWERA.images}/biceps.png`,
                right: `${NEWERA.images}/ac_social.png`
            },
            ability: null,
            skill: null,
            specialties: ["Coercion"],
            description: "You threaten a creature to get them to do what you want. You may threaten them physically using your Strength, or through blackmail using your Charisma. Using this action automatically lowers your relationship with the target, regardless of outcome.",
            difficulty: "Contested (Determination or Strength)",
            actionType: "S",
            rolls: [
                {
                    label: "Charisma",
                    caption: "Intimidate (Charisma)",
                    die: "d20",
                    formula: "1d20+@skills.intimidation.mod+@specialty.partial.coercion",
                    difficulty: null,
                },
                {
                    label: "Strength",
                    caption: "Intimidate (Strength)",
                    die: "d20",
                    formula: "1d20+@skills.intimidation.mod+@specialty.partial.coercion+@abilities.strength.mod",
                    difficulty: null,
                }
            ]
        }
    ]
}