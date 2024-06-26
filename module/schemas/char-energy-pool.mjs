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
        return this.actor.system.energy.value + this.actor.system.energy.temporary;
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
        return (this.actor.system.energy.value <= 0 && this.actor.system.energy.temporary <= 0);
    }
    async use(amount, backupPool = null){
        let update = {
            system: {
                energy: {}
            }
        }
        let amtAfterTemporary = amount;
        if (this.actor.system.energy.temporary > 0){
            amtAfterTemporary -= this.actor.system.energy.temporary;
            update.system.energy.temporary = Math.max(this.actor.system.energy.temporary - amount, 0);
        }
        if (amtAfterTemporary > 0){
            update.system.energy.value = this.actor.system.energy.value - amtAfterTemporary;
        }
        if (amount > this.available){
            await this.actor.takeDamage(amount - this.available, "exhaustion", false, false);
        }
        await this.actor.update(update);
    }

}