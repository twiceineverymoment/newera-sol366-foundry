import { DarkEnergyPool } from "../../schemas/dark-energy-pool.mjs";
import { NEWERA } from "../config.mjs";
import { HotbarActions } from "../macros/hotbarActions.mjs";
export class Witch {

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