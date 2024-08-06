import { Witch } from "../helpers/classes/witch.mjs";

export class DarkEnergySheet extends ActorSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["newera", "sheet", "actor"],
          template: "systems/newera-sol366/templates/actor/features/dark-energy.hbs",
          width: 320,
          height: 130,
          resizable: false
        });
    }

    get title(){
        return `Dark Energy [${this.actor.name}]`;
    }

    get template() {
        return "systems/newera-sol366/templates/actor/features/dark-energy.hbs";
    }

    async getData() {
        const context = super.getData();

        await Witch.initializeDarkEnergy(this.actor, false);

        context.name = this.actor.name;
        context.darkEnergy = this.actor.system.darkEnergy;
        context.darkEnergy.percentage = (context.darkEnergy.value / context.darkEnergy.max);

        console.log("DARK ENERGY SHEET CONTEXT DUMP");
        console.log(context);
        return context;
    }

}