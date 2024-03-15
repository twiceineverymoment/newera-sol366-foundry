import { Actions } from "./actions.mjs";
import { NEWERA } from "../config.mjs";

import { Delver } from "../classes/delver.mjs";
import { Mercenary } from "../classes/mercenary.mjs";
import { Chanter } from "../classes/chanter.mjs";
import { Guardian } from "../classes/guardian.mjs";
import { Scholar } from "../classes/scholar.mjs";

import { SpellPreparation } from "../../sheets/spell-preparation.mjs";
import { ChantSheet } from "../../sheets/chants.mjs";


/*
    This class handles the initiation of common actions through macros on the hotbar.
    The actions themselves, including any resulting Dialogs, are handled in Actions.mjs.
    This class handles the retrieval of the selected actor and validation before invoking the dialog itself, since the dialogs assume some contextual info about the actor that isn't guarantted in a macro context.
*/
export class HotbarActions {

    static NO_ACTOR_ERROR = "No token is selected.";
    static INVALID_FEATURE_ERROR = "The selected token doesn't have that ability.";

    //Returns the Actor instance for the current token (either the copy if the token's linkActorData is false, or the original instance if true.)
    static getSelectedActor(){
        const speaker = ChatMessage.getSpeaker();
        let actor;
        if (speaker.token) actor = game.actors.tokens[speaker.token];
        if (!actor) actor = game.actors.get(speaker.actor);
        return actor;
    }

    static async restForTheNight(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (!["Player Character", "Non-Player Character"].includes(actor.type)){
            ui.notifications.error("Only characters and NPCs can rest for the night.");
            return;
        }
        Actions.restForTheNight(actor);
    }

    static async displayDamageDialog(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (actor.type == "Vehicle"){
            ui.notifications.error("Vehicles don't have hit points.");
            return;
        }
        Actions.displayDamageDialog(actor);
    }

    static async roll(label, formula){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        let r = new Roll({
            
        });
    }

    static async rollInitialHP(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (actor.type != "Creature"){
            ui.notifications.error("This actor doesn't have an initial HP roll.");
            return;
        }
        if (actor.system.hitPoints.max > 0){
            ui.notifications.warn("This actor already has a hit point maximum.");
            return;
        }
        actor.rollInitialHP();
    }

    static async castSpell(name){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        //Determine whether the actor can cast any spells
        if (actor.type == "Player Character" || actor.type == "Non-Player Character"){
            if (actor.system.casterLevel == 0){
                ui.notifications.warn(`${actor.name} hasn't learned to use magic.`);
                return;
            }
            if (actor.system.energy.value == 0){
                ui.notifications.warn(`${actor.name}'s energy is depleted.`);
                return;
            }
        } else if (actor.type == "Creature"){
            if (!actor.system.hasMagic){
                ui.notifications.warn(`This creature doesn't have magical abilities.`);
                return;
            }
        } else {
            ui.notifications.warn("Vehicles cannot cast spells.");
            return;
        }
        //Determine whether the selected actor knows the spell
        const spell = actor.items.find(s => (s.type == "Spell" || s.type == "Enchantment") && s.name == name);
        if (!spell){
            ui.notifications.warn(`${actor.name} does not know ${name}.`);
            return;
        }
        Actions.castSpell(actor, spell);
    }

    static async openPhone(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (!["Player Character", "Non-Player Character"].includes(actor.type)){
            ui.notifications.error("The selected actor can't perform this action.");
            return;
        }
        //Determine who was phone
        const phone = actor.system.equipment.phone ? actor.items.get(actor.system.equipment.phone) : undefined;
        if (!phone){
            ui.notifications.warn(`${actor.name} doesn't have a phone equipped!`);
            return;
        }
        phone.sheet.render(true);
    }

    static templateAction = {
        name: "Test Action",

    };

    static async displayQuickAction(name, actionType, description, rolls){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (!rolls || rolls.length == 0){
            ui.notifications.info(`The action ${name} has no rolls, so nothing happened.`);
            return;
        }
        if (game.settings.get("newera-sol366", "autoRollActions") == true && rolls.length == 1){
            const roll = rolls[0];
            new Roll(roll.formula, actor.getRollData()).toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: roll.caption});
            return;
        }
        let rollButtons = "";
        rolls.forEach(r => {
            rollButtons += `<button class="quick-action-roll" data-caption="${r.caption}" data-formula="${r.formula}">${r.die ? `<i class="fa-solid fa-dice-${r.die}"></i> ` : ""}${r.label}</button>`;
        });
        new Dialog({
            title: `${name} [${actor.name}]`,
            content: `<form>
                <img class="quick-action-img" src="${NEWERA.actionTypeIcons[actionType]}" />
                ${description}
                <div class="quick-action-buttons">
                    ${rollButtons}
                </div>
            </form>`,
            buttons: {
                close: {
                    icon: "",
                    label: "Close"
                }
            },
            render: html => {
                html.find(".quick-action-roll").click(ev => {
                    const element = $(ev.currentTarget);
                    new Roll(element.data("formula"), actor.getRollData()).toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: element.data("caption")});
                });
            },
            default: "close"
        }).render(true);
    }

    static async displayCustomAction(name){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        const action = actor.items.find(a => a.type == "Action" && a.name == name);
        if (!action){
            ui.notifications.error("The selected actor doesn't have that action.");
            return;
        }
        if (!action.system.rolls || action.system.rolls.length == 0){
            ui.notifications.info(`The action ${action.name} has no rolls, so nothing happened.`);
            return;
        }
        if (game.settings.get("newera-sol366", "autoRollActions") == true && action.system.rolls.length == 1){
            const roll = action.system.rolls[0];
            new Roll(roll.formula, actor.getRollData()).toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: roll.caption});
            return;
        }
        let rollButtons = "";
        action.system.rolls.forEach(r => {
            rollButtons += `<button class="quick-action-roll" data-caption="${r.caption}" data-formula="${r.formula}">${r.die ? `<i class="fa-solid fa-dice-${r.die}"></i> ` : ""}${r.label}</button>`;
        });
        new Dialog({
            title: `${action.name} [${actor.name}]`,
            content: `<form>
                <img class="quick-action-img" src="${NEWERA.actionTypeIcons[action.system.actionType]}" />
                ${action.system.description}
                <div class="quick-action-buttons">
                    ${rollButtons}
                </div>
            </form>`,
            buttons: {
                edit: {
                    icon: `<i class="fas fa-edit"></i>`,
                    label: "Edit Action",
                    callback: () => {
                        action.sheet.render(true);
                    }
                },
                close: {
                    icon: `<i class="fas fa-x"></i>`,
                    label: "Close"
                }
            },
            render: html => {
                html.find(".quick-action-roll").click(ev => {
                    const element = $(ev.currentTarget);
                    new Roll(element.data("formula"), actor.getRollData()).toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: element.data("caption")});
                });
            },
            default: "close"
        }).render(true);
    }

    static async displayItemAction(name, itemId){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        const item = actor.items.find(i => i.id == itemId);
        if (!item){
            //TODO try for a "close enough" comparison? This will only really affect the GM so it's not a high priority
            ui.notifications.error(`${actor.name} doesn't own that item.`);
            return;
        }
        const itemActions = item.getActions();
        const action = itemActions.find(a => a.name == name);
        if (!action){
            ui.notifications.error(`The ${item.name} doesn't have an action called ${name}. Please double check the item's stats.`);
            return;
        }
        if (!action.rolls || action.rolls.length == 0){
            ui.notifications.info(`The action ${action.name} has no rolls, so nothing happened.`);
            return;
        }
        //Check whether the action is enabled (item is properly equipped), and prompt to equip it if needed?
        if (!actor.isItemActionAvailable(action, item)){
            ui.notifications.warn(`Your ${item.name} isn't equipped!`);
            return;
        }

        if (game.settings.get("newera-sol366", "autoRollActions") == true && action.rolls.length == 1){
            const roll = action.rolls[0];
            new Roll(roll.formula, actor.getRollData()).toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: roll.caption});
            return;
        }
        let rollButtons = "";
        action.rolls.forEach(r => {
            rollButtons += `<button class="quick-action-roll" data-caption="${r.caption}" data-formula="${r.formula}">${r.die ? `<i class="fa-solid fa-dice-${r.die}"></i> ` : ""}${r.label}</button>`;
        });
        new Dialog({
            title: `${name} [${actor.name}]`,
            content: `<form>
                <img class="quick-action-img" src="${NEWERA.actionTypeIcons[action.actionType]}" />
                ${action.description}
                <div class="quick-action-buttons">
                    ${rollButtons}
                </div>
            </form>`,
            buttons: {
                edit: {
                    icon: `<i class="fas fa-edit"></i>`,
                    label: "Item Details",
                    callback: () => {
                        item.sheet.render(true);
                    }
                },
                close: {
                    icon: `<i class="fas fa-x"></i>`,
                    label: "Close"
                }
            },
            render: html => {
                html.find(".quick-action-roll").click(ev => {
                    const element = $(ev.currentTarget);
                    new Roll(element.data("formula"), actor.getRollData()).toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: element.data("caption")});
                });
            },
            default: "close"
        }).render(true);
    }

    //Feature-specific actions

    static async rage(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }

        if (actor.getClassLevel("mercenary") >= 1){
            Mercenary.rage(actor);
        } else if (actor.getClassLevel("delver") >= 1){
            //TODO Delver rage
        } else {
            ui.notifications.error("The selected token doesn't have that ability.");
        }
    }

    static async enterStance(name){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }

        if (actor.getClassLevel("guardian") >= 3){
            Guardian.activateFightingStance(actor, name);
        } else {
            ui.notifications.error("The selected token doesn't have that ability.");
        }
    }

    static async exitStance(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }

        if (actor.getClassLevel("guardian") >= 3){
            Guardian.endStance(actor);
        } else {
            ui.notifications.error("The selected token doesn't have that ability.");
        }
    }

    static async openSpellPreparation(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (typeof actor.system.spellSlots == "object"){
            new SpellPreparation(actor).render(true);
        } else {
            ui.notifications.error(this.INVALID_FEATURE_ERROR);
        }
    }

    static async elementalChanneling(type){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (actor.getClassLevel("delver") >= 7){
            Delver.elementalChanneling(actor, type);
        } else {
            ui.notifications.error(this.INVALID_FEATURE_ERROR);
        }
    }

    static async openChants(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (actor.getClassLevel("chanter") >= 1){
            new ChantSheet(actor).render(true);
        } else {
            ui.notifications.error(this.INVALID_FEATURE_ERROR);
        }
    }

    static async chant(name){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (actor.getClassLevel("chanter") >= 1){
            Chanter.startChant(actor, name);
        } else {
            ui.notifications.error(this.INVALID_FEATURE_ERROR);
        }
    }

    static async clearTheMind(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (actor.getClassLevel("chanter") >= 3){
            Chanter.clearTheMind(actor);
        } else {
            ui.notifications.error(this.INVALID_FEATURE_ERROR);
        }
    }
}