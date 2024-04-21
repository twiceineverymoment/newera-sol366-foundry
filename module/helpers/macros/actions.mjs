/* 
Contains global scripts that are invoked by buttons on the Actions tab or by macros created from those actions.
These actions assume the relevant Actor can perform them if they were invoked from the ActorSheet.
For invoking these functions via global macros, use HotBarActions.mjs for validations.
 */

import { Formatting } from "../formatting.mjs";
import { NEWERA } from "../config.mjs";

export class Actions {

    /* Displays the dialog to rest for a number of hours. */
    static restForTheNight(actor){
        new Dialog({
            title: "Sleep",
            content: `<form>
              <div>
                Sleep for how many hours?
                <input type="text" id="hours" />
              </div>
            </form>`,
            buttons: {
              confirm: {
                icon: `<i class="fa-regular fa-bed"></i>`,
                label: "Sleep",
                callback: async (html) => {
                  let hours = html.find("#hours").val();
                  if (hours > 12){
                    hours = 12;
                    ui.notifications.warn("You can't rest for more than 12 hours at a time.");
                  }
                  await actor.rest(hours, false);
                }
              },
              cancel: {
                icon: `<i class="fas fa-x"></i>`,
                label: "Cancel"
              }
            },
            default: "cancel"
          }).render(true);
    }

    /* Displays a dialog to cast a spell, inputting the amplification factor */
    static async castSpell(actor, spell, paramAmpFactor = 1, isPrepared = false){
      let stayOpen = false;
      let dialog = new Dialog({
        title: `Cast ${spell.name} [${actor.name}]`,
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
              <td data-tooltip="This is the percent chance of successfully casting the spell. You may still miss your target even if you cast it successfully.">Chance of Success*</td>
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
            <h2 id="amplify-heading">x<span id="ampFactor">${paramAmpFactor}</span></h2>
            <div id="amplify-up">
              <i class="fa-solid fa-chevron-right"></i>
            </div>
          </div>
          <p>
            <button class="spell-dialog-button" id="cast"><i class="fa-solid fa-hand-sparkles"></i> Cast</button>
            <button class="spell-dialog-button" id="attack"${spell.system.rangedAttack ? "" : `disabled data-tooltip="This spell isn't a projectile attack."`}><i class="fa-solid fa-crosshairs"></i> Attack</button>
            <button class="spell-dialog-button" id="damage"${(spell.system.damage && spell.system.damage.type) ? "" : `disabled data-tooltip="This spell doesn't deal damage."`}><i class="fa-solid fa-heart-crack"></i> Damage</button>
          </p>
        </form>
        `,
        buttons: {
          sheet: {
            icon: `<i class="fas fa-edit"></i>`,
            label: "Spell Details",
            callback: () => {
              stayOpen = true;
              spell.sheet.render(true);
            }
          },
          close: {
            icon: `<i class="fas fa-x"></i>`,
            label: "Close",
            callback: () => {
              stayOpen = false;
            }
          }
        },
        render: html => {
          const initialAmpFactor = (actor.type == "Creature" ? spell.system.ampFactor : paramAmpFactor);
          Actions._renderSpellDetails(html, spell, actor, initialAmpFactor, isPrepared);
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
          html.find("#cast").click(() => {
            const amp = actor.type == "Creature" ? spell.system.ampFactor : html.find("#ampFactor").html();
            const noEnergyUse = isPrepared || actor.type == "Creature";
            actor.cast(spell, amp, false, isPrepared, noEnergyUse);
            Actions._renderSpellDetails(html, spell, actor, amp, isPrepared);
          });
          html.find("#attack").click(() => {
            const amp = actor.type == "Creature" ? spell.system.ampFactor : html.find("#ampFactor").html();
            const noEnergyUse = isPrepared || actor.type == "Creature";
            actor.cast(spell, amp, true, isPrepared, noEnergyUse);
            Actions._renderSpellDetails(html, spell, actor, amp, isPrepared);
          });
          html.find("#damage").click(async () => {
            const amp = actor.type == "Creature" ? spell.system.ampFactor : html.find("#ampFactor").html();
            const formula = spell.name == "Lightning Bolt" ? NEWERA.lightningBoltDamageRolls[amp] : Formatting.amplifyValue(spell.system.damage.amount, amp);
            const dmgRoll = new Roll(formula);
            await dmgRoll.evaluate();
            dmgRoll.toMessage({
              speaker: ChatMessage.getSpeaker({actor: actor}),
              flavor: `Damage - ${spell.name}${amp>1 ? " "+NEWERA.romanNumerals[amp] : ""}`
            });
            game.newera.setLastDamageAmount(dmgRoll.total);
          });
        },
        close: () => {
          if (stayOpen){
            stayOpen = false;
            dialog.render(true);
          }
        }
      }).render(true, {
        width: 480
      });
    }

    static _renderSpellDetails(html, spell, actor, ampFactor, prepared){
      const level = spell.system.level * ampFactor;
      const spellSkill = spell.system.form;
      const spellSkillLevel = actor.system.magic[spellSkill].level;
      const difficulty = prepared ? 0 : (level <= spellSkillLevel ? 0 : 5 + ((level - spellSkillLevel) * 5));
      const energyCost = prepared ? 0 : spell.system.energyCost * ampFactor;

      //Determine chance of success
      const passiveSpellSkill = 10 + actor.system.magic[spellSkill].mod;
      let pctChance = 55 + ((passiveSpellSkill - difficulty) * 5);

      html.find("#level").html(level);
      html.find("#difficulty").html(difficulty);
      
      if (actor.type == "Creature"){
        html.find("#cast-table").hide();
        html.find("#amplify-info").hide();
        return;
      } else if (prepared) {
        html.find("#cost").html("Prepared");
      } else if (energyCost > actor.system.energy.value){
        html.find("#cost").html(`${energyCost} (-${energyCost-actor.system.energy.value})`);
        html.find("#cost").css("color", "red");
      } else {
        html.find("#cost").html(energyCost);
        html.find("#cost").css("color", "rgb(17,111,250)");
      }
      if (difficulty == 0){
        html.find("#chance").html("100%");
        html.find("#chance").css("color", "green");
      } else if (pctChance <= -50){
        html.find("#chance").html("0%");
        html.find("#chance").css("color", "red");
      } else if (pctChance < 5){ //Less than 5 here because 0 to -45% is still 5% chance because of the possibility of a nat 20
        html.find("#chance").html("5%");
        html.find("#chance").css("color", "red");
      } else if (pctChance < 25){
        html.find("#chance").html(`${pctChance}%`);
        html.find("#chance").css("color", "red");
      } else if (pctChance < 50){
        html.find("#chance").html(`${pctChance}%`);
        html.find("#chance").css("color", "orange");
      } else if (pctChance < 100){
        html.find("#chance").html(`${pctChance}%`);
        html.find("#chance").css("color", "black");
      } else {
        html.find("#chance").html(`100%`);
        html.find("#chance").css("color", "green");
      }

      if (spell.system.keywords.includes("Static") || actor.type == "Creature" || prepared){
        html.find("#amplify-info").hide();
      }
    }

    static displayDamageDialog(actor){
      new Dialog({
        title: `Damage [${actor.name}]`,
        content: `
            <form>
              <div>
                Amount: <input type="number" id="damageAmount" data-dtype="Number" />
              </div>
              <div>
                <input type="checkbox" id="injury" data-dtype="Boolean" /> Injury (reduces max. HP) <br />
                <input type="checkbox" id="calledShot" data-dtype="Boolean" /> Called Shot
              </div>
              <div id="calledShotSelect" style="display: none">
                <select name="calledShot" id="calledShotType">
                  <option value="head">Head / Face</option>
                  <option value="back">Back</option>
                  <option value="arm">Arm</option>
                  <option value="leg">Leg</option>
                  <option value="heart">Heart</option>
                  <option value="eye">Eye</option>
                  <option value="neck">Neck</option>
                </select>
              </div>
            </form>`,
        render: html => {
          html.find("#damageAmount").val(game.newera.getLastDamageAmount() || "");
          html.find("#calledShot").change(ev => {
            if ($(ev.currentTarget).is(":checked")){
              html.find("#calledShotSelect").show();
            } else {
              html.find("#calledShotSelect").hide();
            }
          });
        },
        buttons: {
            generic: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_.png" />`,
              label: "Damage (Nonspecific)",
              callback: html => Actions._damage(actor, html, "")
            },
            slashing: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_slashing.png" />`,
              label: "Slashing",
              callback: html => Actions._damage(actor, html, "slashing")
            },
            piercing: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_piercing.png" />`,
              label: "Piercing",
              callback: html => Actions._damage(actor, html, "piercing")
            },
            bludgeoning: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_bludgeoning.png" />`,
              label: "Bludgeoning",
              callback: html => Actions._damage(actor, html, "bludgeoning")
            },
            burning: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_burning.png" />`,
              label: "Burning",
              callback: html => Actions._damage(actor, html, "burning")
            },
            freezing: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_freezing.png" />`,
              label: "Freezing",
              callback: html => Actions._damage(actor, html, "freezing")
            },
            shock: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_shock.png" />`,
              label: "Shock",
              callback: html => Actions._damage(actor, html, "shock")
            },
            psychic: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_psychic.png" />`,
              label: "Mental",
              callback: html => Actions._damage(actor, html, "psychic")
            },
            poison: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_poison.png" />`,
              label: "Poison",
              callback: html => Actions._damage(actor, html, "poison")
            },
            suffocation: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_suffocation.png" />`,
              label: "Suffocation",
              callback: html => Actions._damage(actor, html, "suffocation")
            },
            necrotic: {
              icon: `<img class="skill-icon" src="${NEWERA.images}/dt_necrotic.png" />`,
              label: "Necrotic",
              callback: html => Actions._damage(actor, html, "necrotic")
            },
            cancel: {
                icon: `<i class="fas fa-x"></i>`,
                label: "Cancel"
            }
        },
        default: "cancel"
    }).render(true, {
      width: 520
    });
    }

    static displayHealDialog(actor){
      new Dialog({
        title: `Heal ${actor.name}`,
        content: `
            <form>
              <div>
                Amount: <input type="number" id="damageAmount" data-dtype="Number" />
              </div>
              <div>
                <input type="checkbox" id="overheal" data-dtype="Boolean" /> Overheal (heals beyond max. HP) <br />
                <input type="checkbox" id="recovery" data-dtype="Boolean" /> Recover Injuries
              </div>
            </form>`,
        buttons: {
            confirm: {
              icon: `<i class="fa-solid fa-heart"></i>`,
              label: "Heal",
              callback: html => Actions._heal(actor, html)
            },
            cancel: {
                icon: `<i class="fas fa-x"></i>`,
                label: "Cancel"
            }
        },
        default: "cancel"
    }).render(true, {
      width: 320
    });
    }

    /**
     * Helper method that initializes taking damage via the updated form
     * @param {} actor 
     * @param {*} html 
     * @param {*} dmgType 
     * @returns 
     */
    static async _damage(actor, html, dmgType){
      const amount = html.find("#damageAmount").val();
      const isInjury = html.find("#injury").is(":checked");
      //TODO called shots
      if (!amount){
        ui.notifications.error("You must enter an amount.");
        return;
      }
      actor.takeDamage(amount, dmgType, false, isInjury);
      game.newera.clearLastDamage(); //Only does something if incremental damage mode is enabled
    }

    static async _heal(actor, html){
      const amount = html.find("#damageAmount").val();
      const isOverheal = html.find("#overheal").is(":checked");
      const injuryRecovery = html.find("#recovery").is(":checked");
      if (!amount){
        ui.notifications.error("You must enter an amount.");
        return;
      }
      actor.heal(amount, isOverheal, injuryRecovery);
    }

    static async useInspiration(actor){
      if (!actor.system.inspiration){
        ui.notifications.warn(`${actor.name} doesn't have any points of inspiration.`);
        return;
      }
      new Dialog({
        title: "Use Inspiration",
        content: "Choose the effect to use your point of Inspiration on.",
        buttons: {
          luckyRoll: {
            icon: `<i class="fa-regular fa-clover"></i>`,
            label: "Lucky Roll",
            callback: () => {
              actor.update({
                system: {
                  inspiration: actor.system.inspiration - 1
                }
              });
              actor.actionMessage(actor.img, `${NEWERA.images}/inspiration.png`, `<b>Lucky Roll.</b> You spend a point of Inspiration to gain a +7 Luck bonus to your next d20 check. If that roll results in a critical failure, it's treated as a normal failure instead.`)
            }
          },
          reroll: {
            icon: `<i class="fa-regular fa-rotate-left"></i>`,
            label: "Re-Roll",
            callback: () => {
              actor.update({
                system: {
                  inspiration: actor.system.inspiration - 1
                }
              });
              actor.actionMessage(actor.img, `${NEWERA.images}/inspiration.png`, `<b>Reroll.</b> You spend a point of Inspiration to reroll any die roll you just made. You must take the second result, even if it's worse.`)
            }
          },
          extraFrame: {
            icon: `<i class="fa-regular fa-clock"></i>`,
            label: "Extra Frame",
            callback: () => {
              actor.update({
                system: {
                  inspiration: actor.system.inspiration - 1
                }
              });
              actor.actionMessage(actor.img, `${NEWERA.images}/inspiration.png`, `<b>Extra Frame.</b> You spend a point of Inspiration to gain one additional action or reaction frame in the current turn.`)
            }
          },
          cancel: {
            icon: `<i class="fas fa-x"></i>`,
            label: "Cancel",
            callback: () => {
              actor.update({
                system: {
                  inspiration: actor.system.inspiration - 1
                }
              });
            }
          }
        },
        default: "cancel"
      }).render(true, {
        width: 480
      });
    }

}