import { NEWERA } from "../helpers/config.mjs";
import { SpellSearchParams } from "../schemas/spell-search-params.mjs";
import { NewEraItem } from "../documents/item.mjs";
import { NewEraUtils } from "../helpers/utils.mjs";

export class ClassSelect extends ActorSheet {

    constructor(actor){
        super(actor);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["newera", "sheet", "actor"],
          width: 720,
          height: 560,
          resizable: false,
          tabs: [
            {navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "adventurer"}
          ]
        });
    }

    get title() {
        return "Choose a Class";
    }

    get template() {
        return "systems/newera-sol366/templates/extras/class-select.hbs";
    }

    getData() {
        const context = super.getData();

        context.webUrl = game.system.url;

        context.alreadySelected = this.actor.items.filter(i => i.typeIs(NewEraItem.Types.CLASS)).reduce((acc, curr) => {
            acc[curr.system.selectedClass.toLowerCase()] = true;
            return acc;
        }, {});

        console.log("CLASS SELECT CONTEXT DUMP");
        console.log(context);
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find("#confirm").click(async () => {
            const className = html.find("div.tab.active").data("selectedClass");
            if (this.actor.getClassLevel(className.toLowerCase()) > 0) {
                ui.notifications.warn(`You already have the ${className} class. To increase its level, click the yellow arrow next to the ${className} on the Class tab.`);
                return;
            }
            const clazz = await Item.create({
                type: "Class",
                name: className,
                system: {
                    selectedClass: className,
                    level: 0
                }
            }, {parent: this.actor});
            await this.actor.levelUp(clazz);
            ui.notifications.info(`You have chosen the ${className} class!`);
            this.close();
        });
    }


}