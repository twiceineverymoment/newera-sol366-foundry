import { ResourcePool } from "./resource-pool.mjs";
import { Witch } from "../helpers/classes/witch.mjs";
import { NewEraActor } from "../documents/actor.mjs";

export class DarkEnergyPool extends ResourcePool {

    constructor(actor, isOwnPool = false){
        super(actor);
        this.isOwnPool = isOwnPool;
        if (!actor instanceof NewEraActor){
            throw new TypeError("Invalid energy pool constructor");
        }
        if (actor.type != "Player Character" || actor.getClassLevel("witch") < 7){
            throw new TypeError("Invalid actor type in energy pool constructor");
        }
        Witch.initializeDarkEnergy(actor, false);
    }
    get available(){
        return this.actor.system.darkEnergy.value;
    }
    get max(){
        return this.actor.system.darkEnergy.max;
    }
    get id(){
        return `${this.actor.id}::DARK`;
    }
    get name(){
        return this.isOwnPool ? "Dark Energy" : `${this.actor.name}'s Dark Energy`;
    }
    get depleted(){
        return (this.actor.system.darkEnergy.value <= 0);
    }
    async use(amount, backupPool = null){
        let update = {
            system: {
                darkEnergy: {
                    value: Math.max(0, this.available - amount)
                }
            }
        }
        if (amount > this.available){
            await backupPool.use(amount - this.available, null);
        }
        await this.actor.update(update);
    }

}