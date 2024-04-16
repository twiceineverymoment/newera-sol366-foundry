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
                        max: actor.system.tableValues.focusEnergy
                    }
                }
            });
        }
    }

    static async castAndStoreSpell(actor, spell, ampFactor){
        const availableStorageEnergy = actor.system.focusEnergy.max - actor.system.focusEnergy.value;
        if (spell.system.energyCost * ampFactor > availableStorageEnergy){
            ui.notifications.warn("Your focus isn't strong enough to contain a spell that powerful! You'll need to increase your maximum Focus Energy.");
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
        
        let dialog = new Dialog({
            title: `Store ${spell.name}`,
            content: `<form class="spell-dialog">
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
                html.find("#amplify-up").click(() => {
                    const amp = (actor.type == "Creature" ? spell.system.ampFactor : parseInt(html.find("#ampFactor").html()));
                    html.find("#ampFactor").html(amp + 1);
                    if (amp == 68){
                    ui.notifications.info("Nice");
                    }
                    Actions._renderSpellDetails(html, spell, actor, amp + 1, false);
                });
                html.find("#amplify-down").click(() => {
                    const amp = parseInt(html.find("#ampFactor").html());
                    if (amp == 1) return;
                    html.find("#ampFactor").html(amp - 1);
                    Actions._renderSpellDetails(html, spell, actor, amp - 1, false);
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

    

}