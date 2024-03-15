import { NEWERA } from "../config.mjs";

export class Scholar {

    /**
     * Initialize a Scholar character's spell slots by creating the appropriate number of empty slots based on the character's feature table.
     * If reset is true, clears all existing prepared spells back to empty slots.
     * Otherwise, adds new slots to the actor sheet based on the character's level up.
     * @param {Actor} actor 
     */
    static async initializeSpellSlots(actor, reset){

        console.log("[DEBUG] Initializing spell slots");

        const spellSlots = (actor.system.spellSlots && !reset) ? actor.system.spellSlots : {
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
            6: {},
            7: {},
            8: {},
            9: {},
            10: {}
        };

        for (let i=1; i<=10; i++){
            const slotsAtThisLevel = actor.system.tableValues.spellSlots[i] || 0;
            console.log(`[DEBUG] level ${i} slot count ${slotsAtThisLevel}`);
            for (let ii=0; ii<slotsAtThisLevel; ii++){
                if (!spellSlots[i][ii]){
                    spellSlots[i][ii] = {
                        spellId: null,
                        ampFactor: 1,
                        available: false
                    };
                }
            }
        }

        actor.update({
            system: {
                spellSlots: spellSlots
            }
        });

        console.log(spellSlots);
    }

    static async setPreparedSpellSlot(actor, spell, level, slotNumber){
        const spellSlots = actor.system.spellSlots;
        let ampFactor = 1;
        if (spell.type != "Spell"){
            ui.notifications.error("You can't prepare enchantments.");
            return;
        }
        if (spell.system.castType == "R"){
            ui.notifications.error("You can't prepare ritual spells.");
            return;
        }
        if (spell.system.level > level){
            ui.notifications.error("That slot isn't the right level for that spell.");
            return;
        } else if (spell.system.level < level){
            ampFactor = Math.floor(level / spell.system.level);
        }
        spellSlots[level][slotNumber] = {
            spellId: spell.id,
            ampFactor: ampFactor,
            available: true
        };
        await actor.update({
            system: {
                spellSlots: spellSlots
            }
        });
        ui.notifications.info(`You prepare ${spell.name} in a level ${level} spell slot.`);
    }

    static async setSpellSlotAvailability(actor, level, slotNumber, state){
        const spellSlots = actor.system.spellSlots;
        const slot = spellSlots[level][slotNumber];
        slot.available = state;

        await actor.update({
            system: {
                spellSlots: spellSlots
            }
        });
    }

    static async recoverAllSpellSlots(actor){
        const spellSlots = actor.system.spellSlots;
        for (const level of Object.values(spellSlots)){
            for (const slot of Object.values(level)){
                if (slot.spellId) slot.available = true;
            }
        }
        await actor.update({
            system: {
                spellSlots: spellSlots
            }
        });
    }

}