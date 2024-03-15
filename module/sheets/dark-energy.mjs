import { NEWERA } from "../helpers/config.mjs";
import { Scholar } from "../helpers/classes/scholar.mjs";
import { Actions } from "../helpers/macros/actions.mjs";
import { Formatting } from "../helpers/formatting.mjs";

export class DarkEnergySheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["newera", "sheet", "actor"],
          width: 320,
          height: 160,
          resizable: false
        });
    }

    get template() {
        return "systems/newera-sol366/templates/actor/features/dark-energy.html";
    }

    getData() {
        const context = super.getData();

        context.name = this.actor.name;
        context.darkEnergy = this.actor.findResource("Dark Energy");
        context.darkEnergy.percentage = (context.darkEnergy.value / context.darkEnergy.max);

        console.log("DARK ENERGY SHEET CONTEXT DUMP");
        console.log(context);
        return context;
    }

    activateListeners(html) {

        html.find(".spell-action-icons").each((i, element) => {
            const spellId = $(element).data("spell");
            $(element).html(Formatting.getSpellActionIcons(this.actor.items.get(spellId)));
        });

        html.find(".cast-prepared").click(ev => {
            const element = $(ev.currentTarget);
            const slotLevel = element.data("slotLevel");
            const slotNumber = element.data("slotNumber");
            const slot = this.actor.system.spellSlots[slotLevel][slotNumber];
            if (!slot.spellId){
                console.log("Tried to cast an empty slot, crickets");
                return;
            }
            if (!slot.available){
                ui.notifications.warn("This slot has been expended. Click the button on the right to recover it.");
                return;
            }
            const spell = this.actor.items.get(slot.spellId);

            Actions.castSpell(this.actor, spell, slot.ampFactor, true);
            Scholar.setSpellSlotAvailability(this.actor, slotLevel, slotNumber, false);
        });

        html.find(".spell-slot").on("drop", ev => {
            const dropData = JSON.parse(ev.originalEvent.dataTransfer.getData("text/plain"));
            const element = $(ev.currentTarget);
            const level = element.data("slotLevel");
            const number = element.data("slotNumber");
            if (dropData.macroType == "spell"){
                const spell = this.actor.items.get(dropData.id);
                if (spell){
                    Scholar.setPreparedSpellSlot(this.actor, spell, level, number);
                } else {
                    ui.notifications.error("Drag spells from your character's spell list to prepare them.");
                }
            } else {
                ui.notifications.error("You can't prepare that. It's a gazebo.");
            }
        });

        html.find(".recover-slot").click(ev => {
            const element = $(ev.currentTarget);
            const tr = element.parents("tr");
            const level = tr.data("slotLevel");
            const number = tr.data("slotNumber");
            Scholar.setSpellSlotAvailability(this.actor, level, number, true);
        });

        html.find("#recoverAll").click(() => {
            Scholar.recoverAllSpellSlots(this.actor);
            Scholar.initializeSpellSlots(this.actor, false);
        });

        html.find("#resetSpellPrep").click(() => {
            new Dialog({
                title: "Clear Spell Slots",
                content: "Are you sure you want to clear your prepared spells?",
                buttons: {
                    confirm: {
                        icon: `<i class="fas fa-check"></i>`,
                        label: "Yes",
                        callback: () => Scholar.initializeSpellSlots(this.actor, true)
                    },
                    cancel: {
                        icon: `<i class="fas fa-x"></i>`,
                        label: "No"
                    }
                },
                default: "cancel"
            }).render(true);
        });

    }

}