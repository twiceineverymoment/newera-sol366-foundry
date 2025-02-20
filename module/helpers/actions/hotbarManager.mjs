import { NEWERA } from "../config.mjs";

export class HotbarManager {

    static onHotbarDrop(hotbar, data, slot){

        switch(data.macroType){
            case "check": 
                HotbarManager.createCheckMacro(data, slot);
                return false;
            case "spell":
                HotbarManager.createSpellMacro(data, slot);
                return false;
            case "action-basic":
                HotbarManager.createActionMacro(data, slot);
                return false;
            case "action-custom":
                HotbarManager.createCustomActionMacro(data, slot);
                return false;
            case "action-item":
                HotbarManager.createItemActionMacro(data, slot);
                return false;
            default:
                return true;
                //Returning true defaults the hook to its default behavior, for moving macros and dropping from the directory
        }
    }

    static async createCheckMacro(data, slot){
        const command = `/roll ${data.rollFormula} # ${data.rollLabel}`;
        let macro = game.macros.find(m => (m.name === data.name) && (m.command === command));
        if (!macro) {
            macro = await Macro.create({
                name: data.name,
                type: "chat",
                img: data.img,
                command: command,
                ownership: {
                    default: 2
                }
            });
        }
        game.user.assignHotbarMacro(macro, slot);
    }

    static async createSpellMacro(data, slot){
        const command = `game.newera.HotbarActions.castSpell("${data.name}")`;
        let macro = game.macros.find(m => (m.name === data.name) && (m.command === command));
        if (!macro) {
            macro = await Macro.create({
                name: data.name,
                type: "script",
                img: data.img,
                command: command,
                ownership: {
                    default: 2
                }
            });
        }
        game.user.assignHotbarMacro(macro, slot);
        ui.notifications.info(`${data.name} has been added to your action bar.`);
    }

    /*
    Creates a macro for a generic action (one not tied to an item.)
    The action property 'overrideMacroCommand' may be used to replace the default command structure with a specific one for actions that have dedicated dialog functions, such as resting and spell preparation.
    */
    static async createActionMacro(data, slot){
        const action = typeof data.action == "object" ? data.action : JSON.parse(data.action);
        const rolls = action.rolls;
        if (action.overrideMacroCommand === null){
            ui.notifications.error("Sorry, macros can't be created for this action.");
            return;
        }
        if (!action.overrideMacroCommand && (!rolls || rolls.length == 0)){
            ui.notifications.error(`The action ${action.name} has nothing to roll.`);
            return;
        }
        const command = action.overrideMacroCommand || `game.newera.HotbarActions.displayQuickAction("${action.name}", "${action.actionType}", "${action.description}", ${JSON.stringify(action.rolls)})`;
        let macro = game.macros.find(m => (m.name === data.name) && (m.command === command));
        if (!macro) {
            macro = await Macro.create({
                name: action.name,
                type: "script",
                img: action.images.base,
                command: command,
                ownership: {
                    default: 2
                }
            });
        }
        game.user.assignHotbarMacro(macro, slot);
        ui.notifications.info(`${action.name} has been added to your action bar.`);
    }


    static async createCustomActionMacro(data, slot){
        const action = JSON.parse(data.action);
        const command = `game.newera.HotbarActions.displayCustomAction("${action.name}")`;
        let macro = game.macros.find(m => (m.name === data.name) && (m.command === command));
        if (!macro) {
            macro = await Macro.create({
                name: action.name,
                type: "script",
                img: action.images.base,
                command: command,
                ownership: {
                    default: 2
                }
            });
        }
        game.user.assignHotbarMacro(macro, slot);
        ui.notifications.info(`${action.name} has been added to your action bar.`);
    }

    static async createItemActionMacro(data, slot){
        const action = JSON.parse(data.action);
        const command = action.overrideMacroCommand || `game.newera.HotbarActions.displayItemAction("${action.name}", "${action.itemId}")`;
        let macro = game.macros.find(m => (m.name === data.name) && (m.command === command));
        if (!macro) {
            macro = await Macro.create({
                name: `${action.name} (${action.itemName})`,
                type: "script",
                img: action.images.base,
                command: command,
                ownership: {
                    default: 2
                }
            });
        }
        game.user.assignHotbarMacro(macro, slot);
        ui.notifications.info(`${action.name} has been added to your action bar.`);
    }
}