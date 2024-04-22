import { NEWERA } from "../config.mjs";
import { HotbarActions } from "../macros/hotbarActions.mjs";
export class Witch {

    /**
     * Creates the ActiveEffect that grants an actor access to the witch's Dark Energy pool.
     * @param {Actor} actor A witch! Burn her!
     * @param {Actor} target The actor being granted access
     */
    static async grantDarkEnergy(actor, target){
        await target.createEmbeddedDocuments('ActiveEffect', [{
            icon: `${NEWERA.images}/dark-energy.png`,
            label: `Dark Energy Link`,
            description: `<p>${actor.name} has given you the power to use ${actor.system.pronouns.possessiveDependent.toLowerCase()} dark energy pool.</p>
            <p>When you cast a spell, you can choose to cast it from the Dark Energy of any caster who has given you this power, or from your own energy.</p>`,
            origin: actor.id
        }]);
        ui.notifications.info(`You gave ${target.name} the power to use your Dark Energy.`);
    }

    static async grantDarkEnergyToSelectedToken(actor){
        const target = HotbarActions.getSelectedActor()
        if (target.id == actor.id){
            ui.notifications.error("You don't need to grant this power to yourself! Select a different token, then try again.");
            return;
        }
        await Witch.grantDarkEnergy(actor, target);
    }

    
    static getLinkedDarkEnergyPools(actor){

    }

    static async castFromDarkEnergy(caster, witch, spell, ampFactor){
        
    }

}