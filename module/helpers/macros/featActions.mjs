import { SpellFocus } from "../../sheets/spell-focus.mjs";

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
];