import { NEWERA } from "../config.mjs";

export class Artificer {

    /**
     * Initialize the spell focus data.
     * 
     * @param {Actor} actor 
     */
    static async initializeSpellFocus(actor, reset){

        console.log("[DEBUG] Initializing focus");

        if (reset || !actor.system.focus){
            await actor.update({
                system: {
                    focus: []
                }
            });
        }

        if (!actor.system.focusEnergy){
            await actor.update({
                system: {
                    focusEnergy: {
                        min: 0,
                        value: 0
                    }
                }
            });
        }
        //Set the maximum focus energy
        await actor.update({
            system: {
                focusEnergy: {
                    max: actor.system.tableValues.focusEnergy
                }
            }
        })

    }

    static async castAndStoreSpell(actor, spell, ampFactor){
        if (await actor.cast(spell, ampFactor)){
            await actor.update({
                system: {
                    focus: actor.system.focus.concat({
                        id: spell.id,
                        name: spell.name,
                        ampFactor: ampFactor
                    })
                }
            });
            ui.notifications.info(`${spell.name}${ampFactor > 1 ? " "+NEWERA.romanNumerals[ampFactor] : ""} has been stored in your focus.`);
        } else {
            ui.notifications.warn(`Your attempt to store the spell was unsuccessful!`);
        }
    }

    static async startFocusStore(actor, spell){

    }

    

}