import { NEWERA } from "../config.mjs";
import { Actions } from "../macros/actions.mjs";

export class Artificer {

    /**
     * Initialize the spell focus data.
     * 
     * @param {Actor} actor 
     */
    static async initializeSpellFocus(actor, reset){

        console.log("[DEBUG] Initializing focus");

        /* If the focusEnergy property already exists, this value is set to undefined so the .update() does not change the maximum. 
        If it doesn't exist, set it to 0. This way non-Artificers initializing the sheet for the first time will get 0 max, or retain their previous value.
        Artificers will still receive the value from their table. */
        const flexibleMaxEnergy = actor.system.focusEnergy ? undefined : 0;

        if (reset || !actor.system.focus){
            await actor.update({
                system: {
                    focus: []
                }
            });
        }

        if (reset || !actor.system.focusEnergy){
            await actor.update({
                system: {
                    focusEnergy: {
                        min: 0,
                        max: actor.system.tableValues.focusEnergy || flexibleMaxEnergy
                    }
                }
            });
        }
    }

    static getTotalStoredEnergy(actor){
        if (!actor.system.focus) return undefined;
        let total = 0;
        structuredClone(actor.system.focus).forEach(obj => {
            const spell = actor.items.get(obj.id);
            total += spell.system.energyCost * obj.ampFactor;
        });
        return total;
    }

    static async castAndStoreSpell(actor, spell, ampFactor){
        const availableEnergy = actor.system.focusEnergy.max - Artificer.getTotalStoredEnergy(actor);
        if (spell.system.energyCost * ampFactor > availableEnergy){
            ui.notifications.error(`${spell.name} wasn't stored because your focus doesn't have enough capacity.`);
            return;
        }
        if (await actor.cast(spell, ampFactor)){
            await actor.update({
                system: {
                    focus: actor.system.focus.concat({
                        id: spell.id,
                        ampFactor: ampFactor
                    })
                }
            });
            ui.notifications.info(`${spell.name}${ampFactor > 1 ? " "+NEWERA.romanNumerals[ampFactor] : ""} has been stored in your focus.`);
        } else {
            ui.notifications.warn(`Your attempt to store the spell was unsuccessful!`);
        }
    }

    static async onFocusSpellDrop(actor, spell){
        const availableEnergy = actor.system.focusEnergy.max - Artificer.getTotalStoredEnergy(actor);
        if (availableEnergy <= 0){
            ui.notifications.warn("Your focus is full! Use some of your stored spells to free up some space.");
            return;
        }
        if (spell.system.energyCost > availableEnergy){
            ui.notifications.warn(`This spell is too powerful! Your focus can only hold ${availableEnergy} more energy.`);
            return;
        }
        let dialog = new Dialog({
            title: `Store ${spell.name}`,
            content: `<form class="spell-dialog">
              <p class="storage-exceeded-msg" style="display: none"></p>
              <table id="cast-table">
                <tr>
                  <td style="width: 60%">Level</td>
                  <td style="width: 40%"><strong id="level"></strong></td>
                </tr>
                <tr>
                  <td>Difficulty</td>
                  <td><strong id="difficulty"></strong></td>
                </tr>
                <tr>
                  <td data-tooltip="This is the percent chance of successfully casting the spell.">Chance of Success*</td>
                  <td><strong id="chance"></strong></td>
                </tr>
                <tr>
                  <td>Energy Cost</td>
                  <td><strong id="cost"></strong></td>
                </tr>
              </table>
              <div id="amplify-info">
                <p>Amplification Level:</p>
                <div id="amplify-down">
                  <i class="fa-solid fa-chevron-left"></i>
                </div>
                <h2 id="amplify-heading">x<span id="ampFactor">1</span></h2>
                <div id="amplify-up">
                  <i class="fa-solid fa-chevron-right"></i>
                </div>
              </div>
            </form>
            `,
            render: html => {
                Actions._renderSpellDetails(html, spell, actor, 1, false);
                Artificer._renderFocusStorageError(html, spell, actor, 1);
                html.find("#amplify-up").click(() => {
                    const amp = (actor.type == "Creature" ? spell.system.ampFactor : parseInt(html.find("#ampFactor").html()));
                    html.find("#ampFactor").html(amp + 1);
                    if (amp == 68){
                    ui.notifications.info("Nice");
                    }
                    Actions._renderSpellDetails(html, spell, actor, amp + 1, false);
                    Artificer._renderFocusStorageError(html, spell, actor, amp + 1);
                });
                html.find("#amplify-down").click(() => {
                    const amp = parseInt(html.find("#ampFactor").html());
                    if (amp == 1) return;
                    html.find("#ampFactor").html(amp - 1);
                    Actions._renderSpellDetails(html, spell, actor, amp - 1, false);
                    Artificer._renderFocusStorageError(html, spell, actor, amp - 1);
                });
            },
            buttons: {
                cast: {
                    icon: `<i class="fa-solid fa-hand-sparkles"></i>`,
                    label: "Cast and Store",
                    callback: html => {
                        const ampFactor = html.find("#ampFactor").html();
                        Artificer.castAndStoreSpell(actor, spell, ampFactor);
                    }
                },
                cancel: {
                    icon: `<i class="fas fa-x"></i>`,
                    label: "Cancel",
                }
            }
        }).render(true);
    }

    static _renderFocusStorageError(html, spell, actor, ampFactor){
        const totalStoredEnergy = Artificer.getTotalStoredEnergy(actor);
        const availableEnergy = actor.system.focusEnergy.max - totalStoredEnergy;
        if (spell.system.energyCost * ampFactor > availableEnergy){
            html.find(".storage-exceeded-msg").show();
            if (spell.system.energyCost > availableEnergy) {
                html.find(".storage-exceeded-msg").html(`This spell is too powerful for your focus! It can only hold ${actor.system.focusEnergy.max} energy worth of spells.`);
            } else {
                html.find(".storage-exceeded-msg").html(`This spell is too powerful! Your focus can only hold ${availableEnergy} more energy. Reduce the amplification level to store it.`);
            }
        } else {
            html.find(".storage-exceeded-msg").hide();
        }
    }

}