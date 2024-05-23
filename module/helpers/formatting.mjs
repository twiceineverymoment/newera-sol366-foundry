import { NEWERA } from "./config.mjs";

export class Formatting {

    static amplifyAndFormatDescription(text, multiplier, stackingBehavior){
        let tokens = text.split(/\[|\]/g);
        let markup = [];
        for(let i=0; i<tokens.length; i++){
          if (i%2 == 1){
            let token = "";
            let amplify = null;
            let highlightClass = "";
            let highlightClassAmplified = "";
            if (tokens[i].startsWith("_")){
              token = tokens[i].substr(1);
              amplify = (multiplier > 1 && ["D", "B"].includes(stackingBehavior));
              highlightClass = "ampText2";
              highlightClassAmplified = "ampText2-hot";
            } else {
              token = tokens[i];
              amplify = (multiplier > 1 && ["S", "B"].includes(stackingBehavior));
              highlightClass = "ampText";
              highlightClassAmplified = "ampText-hot";
            }
            let ampVal = amplify ? Formatting.amplifyValue(token, multiplier) : token;
            markup.push(`<span class="${amplify ? highlightClassAmplified : highlightClass}">`);
            markup.push(ampVal);
            markup.push("</span>");
          } else {
            markup.push(tokens[i]);
          }
        }
        return markup.join("");
    }
    
    static amplifyValue(value, multiplier) {
        if (value.startsWith("+")){
          let newVal = Math.round(value.substring(1) * multiplier);
          return "+"+newVal;
        } else if (value.includes("d")){
          let contents = value.split("d");
          if (contents.length == 2){
            return Math.round(contents[0] * multiplier) + "d" + contents[1];
          } else {
            return "!InvDVal";
          }
        } else {
          return Math.round(value * multiplier);
        }
      }

      static getSpellActionIcons(spell){
        //console.log(spell);
          if (spell.type == "Enchantment"){
            return `<img src="${NEWERA.images}/sp_enchantment.png" class="skill-icon" data-tooltip="Enchantment" data-tooltip-direction="UP" /><img src="${NEWERA.images}/ac_adventuring.png" class="skill-icon" data-tooltip="Adventuring Phase (non-combat)" data-tooltip-direction="UP" />`;
          } else {
            switch(spell.system.castType){
              case "Q":
                return `<img src="${NEWERA.images}/ac_1frame.png" class="skill-icon" data-tooltip="1 Frame" data-tooltip-direction="UP" /><img src="${NEWERA.images}/ac_reaction.png" class="skill-icon" data-tooltip="Reaction" data-tooltip-direction="UP"/>`;
              case "S":
                return `<img src="${NEWERA.images}/ac_2frame.png" class="skill-icon" data-tooltip="2 Frames" data-tooltip-direction="UP"/>`;
              case "G":
                return `<img src="${NEWERA.images}/ac_3frame.png" class="skill-icon" data-tooltip="3 Frames" data-tooltip-direction="UP"/><img src="${NEWERA.images}/ac_delayed.png" class="skill-icon" data-tooltip="Delayed - Finishes Next Turn" data-tooltip-direction="UP"/>`;
              case "F":
                return `<img src="${NEWERA.images}/ac_1frame.png" class="skill-icon" data-tooltip="1 Frame" data-tooltip-direction="UP" /><img src="${NEWERA.images}/ac_ongoing.png" class="skill-icon" data-tooltip="Sustained" data-tooltip-direction="UP" />`;
              case "C":
                return `<img src="${NEWERA.images}/sp_cantrip.png" class="skill-icon" data-tooltip="Cantrip" data-tooltip-direction="UP" />`;
              case "L":
                return `<img src="${NEWERA.images}/ac_adventuring.png" class="skill-icon" data-tooltip="Adventuring Phase (Non-Combat)" data-tooltip-direction="UP" />`;
              case "R":
                return `<img src="${NEWERA.images}/sp_ritual.png" class="skill-icon" data-tooltip="Ritual" data-tooltip-direction="UP" /><img src="${NEWERA.images}/ac_adventuring.png" class="skill-icon" data-tooltip="Adventuring Phase (non-combat)" />`;
          }
        }
      }

      static randomInt(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      /**
       * Removes a numbered entry from an object with numerical keys in a similar manner to Array.splice()
       * Used where objects are used in the DataModel in-place of arrays due to easier handling by Handlebars templates
       * @param {any} obj 
       * @param {*} index 
       * @returns 
       */
      static spliceIndexedObject(obj, index){
        const update = {};
        console.log(`SIO(${index})`);
        Object.entries(obj).forEach(([id, res], i) => {
          if (id < index){
            update[id] = res;
          } else if (id > index){
            update[id-1] = res;
          } else {
            update[`-=${id}`] = null;
          }
        });
        console.log(update);
        return update;
      }

      static async confirm(actor, event, onAccept){
        if (game.settings.get("newera-sol366", "confirmDelete")){
          new Dialog({
            title: "Confirm Delete",
            content: "Are you sure you want to delete this?",
            buttons: {
              yes: {
                icon: `<i class="fas fa-trash"></i>`,
                label: "Yes",
                callback: () => onAccept(actor, event)
              },
              no: {
                icon: `<i class="fas fa-x"></i>`,
                label: "No"
              }
            }
          }).render(true);
        } else {
          onAccept(actor, event);
        }
      }

      static sendEquipmentChangeMessages(){
        switch(game.settings.get("newera-sol366", "sendEquipMsgs")){
          case "0": return false;
          case "2": return true;
          case "1": return game.combat && game.combat.active && game.combat.round > 0;
        }
      }

}