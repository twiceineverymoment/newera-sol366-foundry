import { NEWERA } from "../helpers/config.mjs";
import { Artificer } from "../helpers/classes/artificer.mjs";
import { Actions } from "../helpers/macros/actions.mjs";
import { Formatting } from "../helpers/formatting.mjs";

export class SpellFocus extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["newera", "sheet", "actor"],
          width: 480,
          height: 960,
          resizable: true,
          title: "Magical Focus"
        });
    }

    get title() {
        return `Spell Storage [${this.actor.name}]`;
    }

    get template() {
        return "systems/newera-sol366/templates/actor/features/spell-focus.html";
    }

    getData() {
        const context = super.getData();

        Artificer.initializeSpellFocus(this.actor, false);

        let totalStoredEnergy = 0;
        context.spells = structuredClone(this.actor.system.focus);
        for (const storedObj of context.spells){
            storedObj.spell = this.actor.items.find(s => s.id == storedObj.id);
            storedObj.castLevel = storedObj.spell.system.level * storedObj.ampFactor;
            totalStoredEnergy += (storedObj.spell.system.energyCost * storedObj.ampFactor);
        };

        context.focusEnergy = {
            value: totalStoredEnergy,
            max: this.actor.system.focusEnergy.max,
            percentage: totalStoredEnergy / this.actor.system.focusEnergy.max
        };

        context.maxEnergyIsDisabled = !!this.actor.system.tableValues.focusEnergy;

        console.log("FOCUS SHEET CONTEXT DUMP");
        console.log(context);
        return context;
    }

    activateListeners(html) {

        super.activateListeners(html);

        html.find(".spell-action-icons").each((i, element) => {
            const spellId = $(element).data("spell");
            $(element).html(Formatting.getSpellActionIcons(this.actor.items.get(spellId)));
        });

        html.find("#resetFocus").click(() => {
            new Dialog({
                title: "Reset Spell Focus",
                content: "This will clear all the spells in your focus. You cannot undo this action. Are you sure?",
                buttons: {
                    confirm: {
                        icon: `<i class="fas fa-check"></i>`,
                        label: "Yes",
                        callback: () => {
                            Artificer.initializeSpellFocus(this.actor, true);
                        }
                    },
                    cancel: {
                        icon: `<i class="fas fa-x"></i>`,
                        label: "No"
                    }
                }
            }).render(true);
        });

        html.find(".focus-dropzone").on("drop", ev => {
            console.log("SPELL FOCUS DROP");
            const dropData = JSON.parse(ev.originalEvent.dataTransfer.getData("text/plain"));
            console.log(dropData);
            if (dropData.macroType == "spell"){
                const spell = this.actor.items.find(s => s.id == dropData.id);
                if (!spell){
                    ui.notifications.warn(`Hmm... ${this.actor.name} doesn't know that spell.`);
                    return;
                }
                Artificer.onFocusSpellDrop(this.actor, spell);
            } else {
                ui.notifications.error("You can't prepare that. It's a gazebo.");
            }
        });
        
        html.find(".cast-stored").click(ev => {
            const index = $(ev.currentTarget).data("storeId");
            const store = this.actor.system.focus[index];
            const spell = this.actor.items.find(s => s.id == store.id);
            Actions.castSpell(this.actor, spell, store.ampFactor, true);
            //Remove the stored spell
            const update = structuredClone(this.actor.system.focus);
            update.splice(index, 1);
            this.actor.update({
                system: {
                    focus: update
                }
            });
        });

    }

}