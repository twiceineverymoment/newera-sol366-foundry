import { ResourcePool } from "./resource-pool.mjs";
import { NewEraActor } from "../documents/actor.mjs";

export class CharacterEnergyPool extends ResourcePool {

    constructor(actor){
        super(actor);
        this.canOverdraw = true;
        if (!actor instanceof NewEraActor){
            throw new TypeError("Invalid energy pool constructor");
        }
        if (!["Player Character", "Non-Player Character"].includes(actor.type)){
            console.error("Invalid actor type in energy pool constructor");
        }
    }
    get available(){
        return this.actor.system.energy.value;
    }
    get max(){
        return this.actor.system.energy.max;
    }
    get id(){
        return `${this.actor.id}::REG`;
    }
    get name(){
        return "Energy Pool";
    }
    get depleted(){
        return (this.actor.system.energy.value <= 0);
    }
    async use(amount, backupPool = null){
        let update = {
            system: {
                energy: {
                    value: Math.max(0, this.available - amount)
                }
            }
        }
        if (amount > this.available){
            await this.actor.takeDamage(amount - this.actor.system.energy.value, "exhaustion", false, false);
        }
        await this.actor.update(update);
    }

}