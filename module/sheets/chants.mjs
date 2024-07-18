import { NEWERA } from "../helpers/config.mjs";
import { Chanter } from "../helpers/classes/chanter.mjs";

export class ChantSheet extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["newera", "sheet", "actor"],
          width: 480,
          height: 960,
          resizable: false,
          title: "Chants",
          scrollY: [".feature-sheet-scroll"]
        });
    }

    get title(){
        return `Chants [${this.actor.name}]`;
    }

    get template() {
        return "systems/newera-sol366/templates/actor/features/chants.hbs";
    }

    getData() {
        const context = super.getData();
        const system = this.actor.system;

        context.chantLevels = [];
        const chants = [];

        if (!system.chants){
            Chanter.resetChants(this.actor);
        }

        for (let i=0; i<=5; i++){
            const level = NEWERA.chantLevels[i];
            if (system.tableValues.chantSlots[level] && parseInt(system.tableValues.chantSlots[level]) > 0){
                context.chantLevels.push({
                    key: level,
                    heading: level.toUpperCase(),
                    value: system.chants[level],
                });
            }
        }

        for (const item of context.items){
            if (item.type == "Feat" && item.system.featType == "CH"){
                chants.push({
                    level: item.system.chantLevel,
                    name: item.name,
                    label: NEWERA.chantLevels[item.system.chantLevel].toUpperCase(),
                    cssClass: `chant-${NEWERA.chantLevels[item.system.chantLevel]}`
                });
            }
        }

        //Sort chants by level low-high
        context.chants = chants.sort((a, b) => b.level - a.level);

        console.log("CHANT SHEET CONTEXT DUMP");
        console.log(context);
        return context;
    }

    activateListeners(html) {

        html.find(".chant-slot-down").click((ev) => {
            const level = $(ev.currentTarget).data("chantLevel");
            const chants = this.actor.system.chants;
            if (chants[level] == 0) return;
            chants[level]--;
            this.actor.update({
                system: {
                    chants: chants
                }
            });
        });
        html.find(".chant-slot-up").click((ev) => {
            const level = $(ev.currentTarget).data("chantLevel");
            const chants = this.actor.system.chants;
            chants[level]++;
            this.actor.update({
                system: {
                    chants: chants
                }
            });
        });
        html.find("#resetChants").click(() => Chanter.resetChants(this.actor));

        html.find(".chant-macro").click(ev => {
            const chantName = $(ev.currentTarget).data("chantName");
            Chanter.startChant(this.actor, chantName);
        });

        html.find(".chant-macro").on("dragstart", ev => {
            console.log(`CHANT DRAG START`);
            const xfr = ev.originalEvent.dataTransfer;
            const element = $(ev.currentTarget);
            const chantName = element.data("chantName");
            const chantLevel = NEWERA.chantLevels[element.data("chantLevel")];
            const dragData = {
                macroType: "action-basic",
                action: {
                    name: chantName,
                    images: {
                        base: `${NEWERA.images}/chant-${chantLevel}.png`
                    },
                    overrideMacroCommand: `game.newera.HotbarActions.chant("${chantName}")`
                }
            };
            xfr.setData("text/plain", JSON.stringify(dragData));
        });

    }

}