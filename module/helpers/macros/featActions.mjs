import { SpellFocus } from "../../sheets/spell-focus.mjs";
import { Guardian } from "../classes/guardian.mjs";
import { NEWERA } from "../config.mjs";

//Mapping of feat-specific actions to compendium IDs. Consider moving this to the database after setting up compendium-based actions
//Some of this info may not be possible to represent in the DB due to the need to have callbacks present in action definitions. Might be able to do it using eval()
export const FeatActions = [
    {
        casperObjectId: 493,
        featureId: "magicalFocus",
        actions: [
            {
                name: "Spell Storage",
                images: {
                    base: `${NEWERA.images}/crystal-shine.png`,
                    left: `${NEWERA.images}/researcher.png`,
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
    },
    {
        casperObjectId: 634,
        featureId: "magicalFocus",
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
    },
    {
        casperObjectId: 594,
        featureId: "qi",
        actions: [
            {
                name: "Lemur Stance",
                images: {
                    base: `${NEWERA.images}/jump1.png`,
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
    },
    {
        casperObjectId: 424,
        featureId: "qi",
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
    },
    {
        casperObjectId: 434,
        featureId: "qi",
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
    },
    {
        casperObjectId: 435,
        featureId: "qi",
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
    },
    {
        casperObjectId: 423,
        featureId: "rage",
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
    },
];