import { Actions } from "./actions.mjs";
import { NEWERA } from "../config.mjs";

import { Delver } from "../classes/delver.mjs";
import { Mercenary } from "../classes/mercenary.mjs";
import { Chanter } from "../classes/chanter.mjs";
import { Guardian } from "../classes/guardian.mjs";
import { Scholar } from "../classes/scholar.mjs";

import { SpellPreparation } from "../../sheets/spell-preparation.mjs";
import { SpellFocus } from "../../sheets/spell-focus.mjs";
import { ChantSheet } from "../../sheets/chants.mjs";
import { DarkEnergySheet } from "../../sheets/dark-energy.mjs";
import { NewEraActor } from "../../documents/actor.mjs";
import { NewEraItem } from "../../documents/item.mjs";
import { SpellstrikeSheet } from "../../sheets/spellstrike.mjs";


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
        if (actor.typeIs(NewEraActor.Types.INANIMATE)){
            ui.notifications.error("You can't deal damage to this actor. Select a PC/NPC or Creature token.");
            return;
        }
        Actions.displayDamageDialog(actor);
    }

    static async displayHealingDialog(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (actor.typeIs(NewEraActor.Types.INANIMATE)){
            ui.notifications.error("You can't heal this actor. Select a PC/NPC or Creature token.");
            return;
        }
        Actions.displayHealDialog(actor);
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

    static async sustainCurrentSpell(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        Actions.sustainCurrentSpell(actor);
    }

    static async endAllSpells(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        actor.stopAllSpells();
    }

    static async endSustainedSpell(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        actor.stopSustaining();
    }

    static async endEphemeralSpells(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        actor.endSpell(true);
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
            let r = new Roll(roll.formula, actor.getRollData());
            await r.evaluate();
            r.toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: roll.caption});
            if (roll.label.toLowerCase().includes("damage")){
                game.newera.setLastDamageAmount(r.total);
            }
            return;
        }
        let rollButtons = "";
        rolls.forEach(r => {
            rollButtons += `<button class="quick-action-roll" data-caption="${r.caption}" data-label="${r.label}" data-formula="${r.formula}">${r.die ? `<i class="fa-solid fa-dice-${r.die}"></i> ` : ""}${r.label}</button>`;
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
                html.find(".quick-action-roll").click(async ev => {
                    const element = $(ev.currentTarget);
                    let r = new Roll(element.data("formula"), actor.getRollData());
                    await r.evaluate();
                    r.toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: element.data("caption")});
                    if (element.data("label").toLowerCase().includes("damage")){
                        game.newera.setLastDamageAmount(r.total);
                    }
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
            let r = new Roll(roll.formula, actor.getRollData());
            await r.evaluate();
            r.toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: roll.caption});
            if (roll.label.toLowerCase().includes("damage")){
                game.newera.setLastDamageAmount(r.total);
            }
            return;
        }
        let rollButtons = "";
        action.system.rolls.forEach(r => {
            rollButtons += `<button class="quick-action-roll" data-caption="${r.caption}" data-label="${r.label}" data-formula="${r.formula}">${r.die ? `<i class="fa-solid fa-dice-${r.die}"></i> ` : ""}${r.label}</button>`;
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
                html.find(".quick-action-roll").click(async ev => {
                    const element = $(ev.currentTarget);
                    let r = new Roll(element.data("formula"), actor.getRollData());
                    await r.evaluate();
                    r.toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: element.data("caption")});
                    if (element.data("label").toLowerCase().includes("damage")){
                        game.newera.setLastDamageAmount(r.total);
                    }
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
            let r = new Roll(roll.formula, actor.getRollData());
            await r.evaluate();
            r.toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: roll.caption});
            if (roll.label.toLowerCase().includes("damage")){
                game.newera.setLastDamageAmount(r.total);
            }
            return;
        }
        let rollButtons = "";
        action.rolls.forEach(r => {
            rollButtons += `<button class="quick-action-roll" data-caption="${r.caption}" data-label="${r.label}" data-formula="${r.formula}">${r.die ? `<i class="fa-solid fa-dice-${r.die}"></i> ` : ""}${r.label}</button>`;
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
                html.find(".quick-action-roll").click(async ev => {
                    const element = $(ev.currentTarget);
                    let r = new Roll(element.data("formula"), actor.getRollData());
                    await r.evaluate();
                    r.toMessage({speaker: ChatMessage.getSpeaker({actor: actor}), flavor: element.data("caption")});
                    if (element.data("label").toLowerCase().includes("damage")){
                        game.newera.setLastDamageAmount(r.total);
                    }
                });
            },
            default: "close"
        }).render(true);
    }

    static async markActorAsDefeated(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (actor.typeIs(NewEraActor.Types.INANIMATE)){
            ui.notifications.error("That which was never alive cannot die.");
            return;
        } else if (actor.typeIs(NewEraActor.Types.CREATURE)){
            if (actor.system.defeated){
                ui.notifications.info(`Looting is DISABLED for ${actor.name}.`);
            } else {
                ui.notifications.info(`Looting is enabled for ${actor.name}. Players can remove items from the creature's inventory.`);
            }
            await actor.setDefeated(!actor.system.defeated);
        } else {
            if (actor.system.defeated){
                await actor.setDefeated(false);
                ui.notifications.info(`Looting is DISABLED for ${actor.name}.`);
            } else {
                new Dialog({
                    title: "Mark Actor As Defeated",
                    content: `Are you sure you want to mark ${actor.name} as defeated? This will enable players to access the token's inventory and take items from it.`,
                    buttons: {
                        confirm: {
                            icon: `<i class="fas fa-check"></i>`,
                            label: "Yes",
                            callback: () => {
                                 actor.setDefeated(true);
                            }
                        },
                        cancel: {
                            icon: `<i class="fas fa-x"></i>`,
                            label: "No"
                        }
                    },
                    default: "cancel"
                }).render(true);
            }
        }
    }

    static async usePotion(potionName){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (actor.typeIs(NewEraActor.Types.INANIMATE)){
            ui.notifications.error("The selected token can't do that!");
            return;
        }
        const potion = actor.items.find(i => i.typeIs(NewEraItem.Types.POTION) && i.name == potionName);
        if (!potion){
            ui.notifications.error(`${actor.name} doesn't have any potions called ${potionName}.`);
            return;
        }
        Actions.displayPotionDialog(actor, potion);
    }

    static async updateItems(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }
        if (!actor.typeIs(NewEraActor.Types.CHARACTER)){
            ui.notifications.error("You can only run this process on PC and NPC sheets.");
            return;
        }
        Actions.confirmUpdateItems(actor);
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
        } else if (actor.getClassLevel("delver") >= 10){
            Delver.rage(actor);
        } else if (actor.getClassLevel("guardian") >= 1 && actor.hasFeatOrFeature("Rage")){
            Guardian.rage(actor);
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

    static async hotBloodedBoost(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }

        if (actor.getClassLevel("guardian") >= 16){
            Guardian.hotBloodedBoostPrompt(actor);
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

    static async secondWind(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error("No token is selected.");
            return;
        }

        if (actor.getClassLevel("guardian") >= 6){
            Guardian.secondWind(actor);
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

    static async openSpellStorage(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (typeof actor.system.focus == "object"){
            new SpellFocus(actor).render(true);
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

    static async wildFury(table){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (actor.getClassLevel("delver") >= 13){
            Delver.rollWildFury(actor, table);
        } else {
            ui.notifications.error(this.INVALID_FEATURE_ERROR);
        }
    }
  
  static async displayDarkEnergy(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (actor.getClassLevel("witch") >= 7){
            new DarkEnergySheet(actor).render(true);
        } else {
            ui.notifications.error(this.INVALID_FEATURE_ERROR);
        }
  }

  static async spellstrike(){
    const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (actor.getClassLevel("magus") >= 8){
            new SpellstrikeSheet(actor).render(true);
        } else {
            ui.notifications.error(this.INVALID_FEATURE_ERROR);
        }
  }

  /* GM Shortcuts */

    static async addPlayerContact(){
        const actor = this.getSelectedActor();
        //No token selected is allowed for this one. Just means the form will start empty instead of auto-filled with contact info
        Actions.addPlayerContact(actor);
    }

    //Decrease the battery level of the selected actor's phone by one segment
    //If no token is selected, affects all player characters' phones.
    static async decreasePhoneBattery(){

    }

    static async lockUnlockContainer(){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        if (actor.typeIs(NewEraActor.Types.ANIMATE)){
            ui.notifications.error("You can only use this action on Container and Vehicle tokens.");
            return;
        } else {
            await actor.lockUnlockContainer();
        }
    }

    static async use(slot){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }

    }

    static async advanceGameClock(){
        if (game.user.isGM){
        new Dialog({
            title: "Advance Game Clock",
            content: `
                <table id="advance-game-clock-table">
                    <tr>
                        <td>Days</td>
                        <td>Hours</td>
                        <td>Minutes</td>
                    </tr>
                    <tr>
                        <td><input type="number" id="days" value="0" min="0" step="1" /></td>
                        <td><input type="number" id="hours" value="0" min="0" step="1" /></td>
                        <td><input type="number" id="minutes" value="0" min="0" step="1" /></td>
                    </tr>
                </table>
                <label for="weather-update">Alter Weather?</label>
                <select id="weather-update">
                    <option value="0">No Change</option>
                    <option value="1">Slight</option>
                    <option value="2">Random</option>
                </select>
            `,
            buttons: {
                confirm: {
                    icon: `<i class="fa-solid fa-arrows-rotate"></i>`,
                    label: "Confirm",
                    callback: async (html) => {
                        const days = parseInt(html.find("#days").val());
                        const hours = parseInt(html.find("#hours").val());
                        const minutes = parseInt(html.find("#minutes").val());
                        const weather = parseInt(html.find("#weather-update").val());
                        await Actions.advanceGameClock({
                            days: days,
                            hours: hours,
                            minutes: minutes
                        });
                        await Actions.randomizeWeather(weather);
                    }
                }
            }
        }).render(true);
        } else {
            ui.notifications.error("Only the GM can use this!");
        }
    }

    static async fireRangedWeapon(weaponName){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        const weapon = actor.items.find(i => i.type == "Ranged Weapon" && i.name == weaponName);
        if (!weapon){
            ui.notifications.error(`${actor.name} doesn't have a ${weaponName}.`);
            return;
        }
        if (!actor.hasItemInHand(weapon)){
            ui.notifications.warn(`${actor.name}'s ${weaponName} isn't equipped!`);
            return;
        }
        Actions.fireRangedWeapon(actor, weapon);
    }

    static async reloadRangedWeapon(weaponName){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        const weapon = actor.items.find(i => i.type == "Ranged Weapon" && i.name == weaponName);
        if (!weapon){
            ui.notifications.error(`${actor.name} doesn't have a ${weaponName}.`);
            return;
        }
        if (!actor.hasItemInHand(weapon)){
            ui.notifications.warn(`${actor.name}'s ${weaponName} isn't equipped!`);
            return;
        }
        Actions.reloadRangedWeapon(actor, weapon);
    }

    static async cockRangedWeapon(weaponName){
        const actor = this.getSelectedActor();
        if (!actor){
            ui.notifications.error(this.NO_ACTOR_ERROR);
            return;
        }
        const weapon = actor.items.find(i => i.type == "Ranged Weapon" && i.name == weaponName);
        if (!weapon){
            ui.notifications.error(`${actor.name} doesn't have a ${weaponName}.`);
            return;
        }
        if (!actor.hasItemInHand(weapon)){
            ui.notifications.warn(`${actor.name}'s ${weaponName} isn't equipped!`);
            return;
        }
        if (!weapon.isLoaded()){
            ui.notifications.warn(`The magazine is empty!`);
            return;
        }
        if (weapon.isReadyToFire()){
            ui.notifications.warn(`${weaponName} is already cocked!`);
            return;
        }
        weapon.cock();
        ui.notifications.info("Chk-chk!");
    }
}