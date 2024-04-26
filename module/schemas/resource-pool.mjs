export class ResourcePool {

    constructor(actor){
        this.actor = actor;
        this.canOverdraw = false;
    }
    get id(){
        return "EMPTY-RES";
    }
    get available(){
        return 0;
    }
    get max(){
        return 0;
    }
    get name(){
        return "Resource Pool";
    }
    get depleted(){
        return true;
    }

    /**
     * Uses the specified amount of energy from the pool. Returns the amount remaining after the usage.
     * @param {Number} amount The amount of energy to consume
     */
    async use(amount, backupPool){}

}