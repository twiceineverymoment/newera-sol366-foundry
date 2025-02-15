/* 
Contains global scripts that are invoked by buttons on the Actions tab or by macros created from those actions.
These actions assume the relevant Actor can perform them if they were invoked from the ActorSheet.
For invoking these functions via global macros, use HotBarActions.mjs for validations.
 */

import { Formatting } from "../formatting.mjs";
import { NEWERA } from "../config.mjs";
import { CharacterEnergyPool } from "../../schemas/char-energy-pool.mjs";
import { NewEraActor } from "../../documents/actor.mjs";
import { ResourcePool } from "../../schemas/resource-pool.mjs";
import { NewEraItem } from "../../documents/item.mjs";

export class Actions {

    static brewPotion(actor, recipe) {
      ui.notifications.info("Coming soon!");
      actor.actionMessage(actor.img, recipe.img, "{NAME} creates {0}.", recipe.name);
    }

    static printAbilityInfo(actor, info){
      const template = `
        <div class="chat-item-details">
          <img src="${info.img}" />
          <h2>${info.title}</h2>
          <p>${info.details}</p>
        </div>
      `;
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({actor: actor}),
        content: template
      });
    }

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

    static async sustainCurrentSpell(actor){
      let stayOpen = false;
      const energyRequired = (actor.type != "Creature");
      if (energyRequired && actor.energyPools.filter(p => !p.depleted).length == 0){
        ui.notifications.error("Your energy is depleted. You can still continue sustaining the spell if you recover enough energy before the end of your turn.");
        return;
      }
      const spell = actor.items.get(actor.system.sustaining.id);
      if (!spell || !actor.system.sustaining.id){
        ui.notifications.error(`${actor.name} isn't sustaining a spell.`);
        return;
      }
      const spellTitle = `${spell.name}${actor.system.sustaining.ampFactor > 1 ? " "+NEWERA.romanNumerals[actor.system.sustaining.ampFactor] : ""}`;
      let dialog = new Dialog({
        title: `Sustain ${spellTitle} [${actor.name}]`,
        content: `<form class="spell-dialog">
          <div id="energySelect">
            Energy Source: <select id="energyPools">${this._renderPoolOptions(actor)}</select>
          </div>
          <p>
            <button class="spell-dialog-button" id="cast"><i class="fa-solid fa-hand-sparkles"></i> Sustain</button>
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
          html.find("#cast").click(async () => {
            const pool = Actions._getPool(actor, html, false);
            await actor.sustain(pool);
          });
          html.find("#attack").click(async () => {
            const pool = Actions._getPool(actor, html, false);
            await actor.sustain(pool);
          });
          html.find("#damage").click(async () => {
            const amp = actor.system.sustaining.ampFactor;
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

    /* Displays a dialog to cast a spell, inputting the amplification factor */
    static async castSpell(actor, spell, paramAmpFactor = 1, isPrepared = false){
      if (game.settings.get('newera-sol366', 'enforceActionConditions') && !spell.system.keywords.includes('Asomatic')) {
        if (['G', 'L', 'R'].includes(spell.system.castType)) {
          if (actor.system.equipment.leftHand || actor.system.equipment.rightHand) { //For channeled and long spells, error out if either hand is occupied
            ui.notifications.warn(`You need both hands free in order to cast ${spell.name}!`);
            return;
          }
        } else {
          if (
            (actor.system.equipment.leftHand && actor.system.equipment.rightHand)
            || (actor.system.equipment.rightHand && actor.items.get(actor.system.equipment.rightHand).system.handedness == '2H')
            || (actor.system.equipment.rightHand && actor.items.get(actor.system.equipment.rightHand).system.handedness == '1.5H' && !actor.system.forceOneHanded)
            ) { //For all other spell types, only error if both hands are occupied
            ui.notifications.warn(`You need a free hand in order to cast ${spell.name}!`);
            return;
          }
        }
      }
      let stayOpen = false;
      const energyRequired = (!isPrepared && actor.type != "Creature");
      const pools = actor.energyPools;
      if (energyRequired) {
        if (!pools || pools.length == 0){
          ui.notifications.error(`${actor.name} can't cast spells right now.`);
          return;
        }
        if (pools.filter(p => !p.depleted).length == 0){
          ui.notifications.error("Your energy is depleted. You can't cast any spells until you drink a potion or rest to recover.");
          return;
        }
      }
      let castButton;
      switch(spell.spellRollMode) {
        case "ranged":
          castButton = {
            icon: 'fa-crosshairs',
            label: 'Ranged Attack'
          };
          break;
        case "melee":
          castButton = {
            icon: 'fa-hand-fist',
            label: 'Melee Attack',
          };
          break;
        default:
        case "cast":
          castButton = {
            icon: 'fa-hand-sparkles',
            label: 'Cast'
          };
          if (spell.typeIs(NewEraItem.Types.ENCHANTMENT)) {
            castButton.label = 'Enchant';
          }
          break;
      }
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
          <div id="complex-stuff"></div>
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
          <div id="energySelect">
            Energy Source: <select id="energyPools">${this._renderPoolOptions(actor)}</select>
          </div>
          <p>
            <button class="spell-dialog-button" id="cast"><i class="fa-solid ${castButton.icon}"></i> ${castButton.label}</button>
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
          html.find("#cast").click(async () => {
            const amp = actor.type == "Creature" ? spell.system.ampFactor : html.find("#ampFactor").html();
            const pool = Actions._getPool(actor, html, isPrepared);
            await actor.cast(spell, amp, isPrepared, pool);
            Actions._renderSpellDetails(html, spell, actor, amp, isPrepared);
          });
          html.find("#damage").click(async () => {
            const amp = actor.type == "Creature" ? spell.system.ampFactor : html.find("#ampFactor").html();
            const formula = spell.name == "Lightning Bolt" ? NEWERA.lightningBoltDamageRolls[amp] : (spell.system.damage.scales ? Formatting.amplifyValue(spell.system.damage.amount, amp) : spell.system.damage.amount);
            const dmgRoll = new Roll(formula);
            await dmgRoll.evaluate();
            dmgRoll.toMessage({
              speaker: ChatMessage.getSpeaker({actor: actor}),
              flavor: `Damage - ${spell.name}${amp>1 ? " "+NEWERA.romanNumerals[amp] : ""}`
            });
            game.newera.setLastDamageAmount(dmgRoll.total);
          });
          html.find("#energyPools").change(async () => {
            const amp = actor.type == "Creature" ? spell.system.ampFactor : html.find("#ampFactor").html();
            Actions._renderSpellDetails(html, spell, actor, amp, isPrepared);
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

    static _renderPoolOptions(actor){
      let options = "";
      for (const pool of actor.energyPools){
        options += `<option value="${pool.id}" ${pool.depleted ? "disabled" : ""}>${pool.name} (${pool.available}/${pool.max})</option>`
      }
      return options;
    }

    static _getPool(actor, html, isPrepared){
      if (isPrepared || actor.type == "Creature"){
        return null;
      }
      try {
        const id = html.find("#energyPools").val();
        return actor.energyPools.find(p => p.id == id); //The select list is populated by this same array so if this ever fails to find something is very wrong
      } catch (err){
        return null;
      }
    }

    static _renderSpellDetails(html, spell, actor, ampFactor, prepared){
      const level = spell.system.level * ampFactor;
      const spellSkill = spell.system.form;
      const spellSkillLevel = spellSkill == "genericCast" ? actor.system.casterLevel : actor.system.magic[spellSkill].level;
      const difficulty = prepared ? 0 : (level <= spellSkillLevel ? 0 : 5 + ((level - spellSkillLevel) * 5));
      const energyCost = prepared ? 0 : spell.totalEnergyCost * ampFactor;
      let availableEnergy = 0;
      let pool = null;

      //Get selected energy pool
      if (!prepared){
        pool = Actions._getPool(actor, html, prepared);
        if (pool instanceof ResourcePool){
          availableEnergy = pool.available;
        }
      }

      //Determine chance of success
      const thingsAreComplex = (spell.type == 'Enchantment' && spell.system.enchantmentType == 'CE');
      const passiveSpellSkill = 10 + (spellSkill == "genericCast" ? actor.system.casterLevel : actor.system.magic[spellSkill].mod);
      let pctChance = thingsAreComplex ? Actions._getComplexPercentage(spell, actor, ampFactor) : 55 + ((passiveSpellSkill - difficulty) * 5);

      html.find("#level").html(level);
      html.find("#difficulty").html(difficulty);
      html.find("#energyPools").html(Actions._renderPoolOptions(actor));
      if (pool) {
        html.find("#energyPools").val(pool.id);
      }
      
      if (actor.type == "Creature"){
        html.find("#cast-table").hide();
        html.find("#amplify-info").hide();
        html.find("#energySelect").hide();
        return;
      } else if (prepared) {
        html.find("#cost").html("Prepared");
        html.find("#energySelect").hide();
      } else if (energyCost > availableEnergy){
        html.find("#cost").html(`${energyCost} (-${energyCost-availableEnergy})`);
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
      if (thingsAreComplex) {
        html.find("#chance").append('*');
        html.find("#complex-stuff").html(`<p>*This is a complex enchantment with <b>${Object.entries(spell.system.components).length}</b> components. You will attempt to cast each one in sequence. If any step fails, the GM decides what ultimately happens.</p>`);
      }

      if (spell.system.keywords.includes("Static") || actor.type == "Creature" || prepared){
        html.find("#amplify-info").hide();
      }
    }

    static _getComplexPercentage(enchantment, actor, ampFactor) {
      let prob = 1.0;
      for (const component of Object.values(enchantment.system.components)) {
        const form = NEWERA.schoolToFormMapping[component.check];
        const spellSkillLevel = form == "genericCast" ? actor.system.casterLevel : actor.system.magic[form].level;
        const level = component.level * (component.scales ? ampFactor : 1);
        const difficulty = level <= spellSkillLevel ? 0 : 5 + ((level - spellSkillLevel) * 5);
        const passiveSpellSkill = 10 + (form == "genericCast" ? actor.system.casterLevel : actor.system.magic[form].mod);
        const stepProb = Math.min(1.0, 0.55 + ((passiveSpellSkill - difficulty) * 0.05));
        prob *= stepProb;
        console.log(`[DEBUG] component form=${form} level=${level} skill=${spellSkillLevel} diff=${difficulty} passive=${passiveSpellSkill} prob=${stepProb} cumulative=${prob}`);
      }
      return Math.round(prob * 100);
    }

    static displayPotionDialog(actor, potion){
      new Dialog({
        title: `Use ${potion.name} [${actor.name}]`,
        content: `<form class="spell-dialog">
          <div id="amplify-info">
            <p>How Many?</p>
            <div id="amplify-down">
              <i class="fa-solid fa-chevron-left"></i>
            </div>
            <h2 id="amplify-heading"><span id="ampFactor">1</span></h2>
            <div id="amplify-up">
              <i class="fa-solid fa-chevron-right"></i>
            </div>
          </div>
        </form>
        `,
        render: html => {
          html.find("#amplify-up").click(() => {
            const qty = parseInt(html.find("#ampFactor").html());
            if (qty == potion.system.quantity) {
              ui.notifications.error(`You only have ${potion.system.quantity}!`);
              return;
            }
            html.find("#ampFactor").html(qty + 1);
          });
          html.find("#amplify-down").click(() => {
            const qty = parseInt(html.find("#ampFactor").html());
            if (qty == 1) return;
            html.find("#ampFactor").html(qty - 1);
          });
        },
        buttons: {
          confirm: {
            icon: `<i class="fas fa-check"></i>`,
            label: "Confirm",
            callback: html => {
              const qty = html.find("#ampFactor").html();
              actor.usePotion(potion, qty);
            }
          },
          details: {
            icon: `<i class="fas fa-edit"></i>`,
            label: "Item Details",
            callback: () => {
              potion.sheet.render(true);
            }
          },
          cancel: {
            icon: `<i class="fas fa-x"></i>`,
            label: "Cancel",
          },
        }
      }).render(true);
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
                <input type="checkbox" id="calledShot" data-dtype="Boolean" /> Called Shot <br />
                <input type="checkbox" id="hitShield" data-dtype="Boolean" /> Hit Shield
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
              label: "Psychic",
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
                <input type="checkbox" id="overheal" data-dtype="Boolean" /> Overheal (excess becomes Temporary HP) <br />
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
      const hitShield = html.find("#hitShield").is(":checked");
      //TODO called shots
      if (!amount){
        ui.notifications.error("You must enter an amount.");
        return;
      }
      actor.takeDamage(amount, dmgType, false, isInjury, hitShield);
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

    static async addPlayerContact(actor){
      let phoneNum = "";
      let name = "";
      let count = 0;
      if (actor){
        name = actor.name;
        const phone = actor.items.find(i => i.type == "Phone");
        if (phone){
          phoneNum = phone.system.phoneNumber;
        }
      }
      new Dialog({
        title: "Add Contact to Player Phones",
        content: `<form id="contactForm">
          <p>Enter the name and phone number of a contact to add to all player-owned phones.</p>
          <input type="text" id="contactName" value="${name}" />
          <input type="text" id="contactNumber" value="${phoneNum}" />
          </form>`,
        buttons: {
          confirm: {
            icon: `<i class="fas fa-plus"></i>`,
            label: "Add",
            callback: (html) => {
              const name = html.find("#contactName").val();
              const number = html.find("#contactNumber").val();
              const playerCharacters = game.actors.filter(a => a.type == "Player Character");
              for (const actor of playerCharacters){
                const phones = actor.items.filter(i => i.type == "Phone");
                phones.forEach(i => {
                  i.addContact(name, number);
                  count++;
                  console.log(`Added contact to ${i.name} in inventory of ${actor.name}`);
              });
              }
              ui.notifications.info(`${name} has been added to all player character phone contacts (${count} total devices.)`);
            }
          },
          cancel: {
            icon: `<i class="fas fa-x"></i>`,
            label: "Cancel"
          }
        }
      }).render(true);
    }

    static async confirmUpdateItems(actor){
      new Dialog({
        title: `Update Items [${actor.name}]`,
        content: `
          <p style="color: red"><b>BAD THINGS WILL HAPPEN IF YOU DON'T READ THIS!</b></p>
          <p>
            This action will overwrite ALL compendium-based items, spells, enchantments, and feats this actor owns with new copies of those objects from the Compendium.
            This is meant to be done when you need to update a character to reflect recent rules changes. Any customizations or changes made to them will be reverted.
            <b>You cannot undo this!</b> It is STRONGLY recommended to make a backup of your world before continuing.
          </p>
        `,
        buttons: {
          confirm: {
            icon: `<i class="fa-solid fa-arrows-rotate"></i>`,
            label: `<b>Update All Items</b>`,
            callback: () => actor.updateItems()
          },
          cancel: {
            icon: `<i class="fas fa-x"></i>`,
            label: "Cancel"
          }
        }
      }).render(true);
    }

    static async advanceGameClock(time = {}) {
      const current = {
        year: game.settings.get("newera-sol366", "world.date.year"),
        month: game.settings.get("newera-sol366", "world.date.month"),
        day: game.settings.get("newera-sol366", "world.date.day"),
        hour: game.settings.get("newera-sol366", "world.time.hour"),
        minute: game.settings.get("newera-sol366", "world.time.minute"),
      }
      const next = structuredClone(current);
      const advance = {
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        ...time
      };
      next.minute += advance.minutes;
      if (next.minute >= 60) {
        next.hour += Math.floor(next.minute / 60);
        next.minute = next.minute % 60;
      }
      next.hour += advance.hours;
      if (next.hour >= 24) {
        next.day += Math.floor(next.hour / 24);
        next.hour = next.hour % 24;
      }
      next.day += advance.days;
      if (next.day > 28) {
        next.month += Math.floor(next.day / 28);
        next.day = (next.day % 28) + 1;
      }
      next.month += advance.months;
      if (next.month > 13) {
        next.year += Math.floor(next.month / 13);
        next.month = (next.month % 13) + 1;
      }
      next.year += advance.years;
      await game.settings.set("newera-sol366", "world.date.year", next.year);
      await game.settings.set("newera-sol366", "world.date.month", next.month);
      await game.settings.set("newera-sol366", "world.date.day", next.day);
      await game.settings.set("newera-sol366", "world.time.hour", next.hour);
      await game.settings.set("newera-sol366", "world.time.minute", next.minute);

      const now = {
        year: game.settings.get("newera-sol366", "world.date.year"),
        month: game.settings.get("newera-sol366", "world.date.month"),
        day: game.settings.get("newera-sol366", "world.date.day"),
        hour: game.settings.get("newera-sol366", "world.time.hour"),
        minute: game.settings.get("newera-sol366", "world.time.minute"),
      }
      ui.notifications.info(`The time is now ${now.year}-${now.month}-${now.day} ${now.hour}:${now.minute}.`);
    }

    static _is29DayMonth(year, month) {
      if (Actions._isLeapYear(year)) {
        return (month == 13 || month == 1);
      } else if (year % 2 == 0) {
        return (month == 7);
      } else if ((year+1) % 2 == 0) {
        return (month == 4);
      } else if ((year-1) % 2 == 0) {
        return (month == 10);
      } else { //bruh
        return false;
      }
    }

    static _isLeapYear(year) {
      return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
    }

    static async randomizeWeather(weather) {
      const currentWeather = await game.settings.get("newera-sol366", "world.weather.conditions");
      const conditionSequence = ["clear", "pc1", "pc2", "pc3", "cloudy", "foggy", "precip1", "precip2", "precip3", "storm1", "storm2"];
      if (weather == 0) {
        return;
      } else if (weather == 1) {
        //Slight change - maximum of 2 steps away from current weather
        const index = conditionSequence.indexOf(currentWeather);
        const newIndex = Math.max(0, Math.min(conditionSequence.length - 1, index + (Math.random() < 0.5 ? 1 : -1)));
        await game.settings.set("newera-sol366", "world.weather.conditions", conditionSequence[newIndex]);
      } else if (weather == 2) {
        //Random
        const newWeather = conditionSequence[Math.floor(Math.random() * conditionSequence.length)];
        await game.settings.set("newera-sol366", "world.weather.conditions", newWeather);
      }
    }

    static async getStackQuantity(item, allowAll = true) {
      if (!item.typeIs(NewEraItem.Types.STACKABLE) || item.system.quantity == 1){
        return 1;
      }
      let quantity = 1;
      return new Promise((resolve) => {
        new Dialog({
          title: item.name,
          content: `<form class="spell-dialog">
          <p>How many?</p>
          <div id="amplify-info">
              <div id="quantity-down">
                <i class="fa-solid fa-chevron-left"></i>
              </div>
              <h2 id="quantity-heading"><span id="quantity">${quantity}</span></h2>
              <div id="quantity-up">
                <i class="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </form>`,
          buttons: {
            confirm: {
              icon: `<i class="fa-solid fa-check"></i>`,
              label: "Confirm",
              callback: (html) => {
                const qty = parseInt(html.find("#quantity").text());
                resolve(qty);
              }
            },
            ...(allowAll ? {
              all: {
                icon: `<i class="fa-solid fa-layer-group"></i>`,
                label: "All",
                callback: () => resolve(item.system.quantity)
              }
            } : {}),
            cancel: {
              icon: `<i class="fa-solid fa-x"></i>`,
              label: "Cancel",
              callback: () => resolve(0)
            }
          },
          default: "cancel",
          render: html => {
            html.find("#quantity-down").click(() => {
              quantity = Math.max(1, quantity - 1);
              html.find("#quantity").text(quantity);
            });
            html.find("#quantity-up").click(() => {
              quantity = Math.min(allowAll ? item.system.quantity : item.system.quantity - 1, quantity + 1);
              html.find("#quantity").text(quantity);
            });
          }
        }).render(true);
      });
    }

}