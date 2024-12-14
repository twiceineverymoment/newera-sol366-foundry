import { NEWERA } from "../helpers/config.mjs";
import { Magus } from "../helpers/classes/magus.mjs";
import { Actions } from "../helpers/macros/actions.mjs";
import { Formatting } from "../helpers/formatting.mjs";

export class SpellstrikeSheet extends ActorSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["newera", "sheet", "actor"],
          width: 480,
          height: 640,
          resizable: true,
          title: "Spellstrike",
          scrollY: [".feature-sheet-scroll"]
        });
    }

    get title() {
        return `Spellstrike [${this.actor.name}]`;
    }

    get template() {
        return "systems/newera-sol366/templates/actor/features/spellstrike.hbs";
    }

    getData() {
        const context = super.getData();

        Magus.initializeSpellstrike(this.actor);

        const spellstrikeSpells = this.actor.items.filter(i => {
            if (i.type == 'Spell'
                && i.system.damage.amount
                && ['Q', 'S'].includes(i.system.castType)
            ) {
                const spellSkillLevel = this.actor.system.magic[i.system.form].level;
                if (spellSkillLevel >= i.system.level) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });

        spellstrikeSpells.forEach(spell => {
            const spellSkillLevel = this.actor.system.magic[spell.system.form].level;
            spell.autoAmpFactor = Math.floor(spellSkillLevel / spell.system.level);
            spell.castLevel = spell.system.level * spell.autoAmpFactor;
            spell.amplified = (spell.autoAmpFactor > 1);
        });

        context.spellstrikes = this.actor.system.spellstrikes;
        context.spells = spellstrikeSpells;

        console.log("SPELLSTRIKE SHEET CONTEXT DUMP");
        console.log(context);
        return context;
    }

    activateListeners(html) {

        super.activateListeners(html);
        
        html.find(".cast-strike").click(ev => {
            if (this.actor.system.spellstrikes.value == 0) {
                ui.notifications.warn(`${this.actor.name} is out of spellstrikes! Take a full rest to recover them.`);
                return;
            }
            const spellId = $(ev.currentTarget).data("spellId");
            const ampFactor = $(ev.currentTarget).data("ampFactor");
            const spell = this.actor.items.find(s => s.id == spellId);
            Actions.printAbilityInfo(actor, {
                img: actor.img,
                title: "Spellstrike",
                details: `<p>${actor.name} infuses an attack with the power of ${spell.name}!</p>`
            });
            Actions.castSpell(this.actor, spell, ampFactor, true);
            //Decrement spellstrike
            this.actor.update({
                system: {
                    spellstrikes: {
                        value: this.actor.system.spellstrikes.value - 1
                    }
                }
            });
        });

    }

}