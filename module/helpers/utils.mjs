import { NEWERA } from "./config.mjs";

export class NewEraUtils {

    static amplifyAndFormatDescription(text, multiplier, stackingBehavior = "S"){
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
            let ampVal = amplify ? NewEraUtils.amplifyValue(token, multiplier) : token;
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

      static getSelectValue(name, document) {
        if (!name) {
          console.warn(`You have a broken select field : auto-value with no name`);
          return null;
        }
        let tokens = name.split(".");
        try {
          let value = tokens.reduce((acc, token) => acc[token], document);
          //console.log(`[DEBUG] auto-value ${name} = ${value}`);
          return value;
        } catch (err) {
          //console.warn(`[DEBUG] auto-value ${name} = undefined`);
          return null;
        }
      }

      static formatRollExpression(count, size, modifier){
        if (modifier > 0){
          return `${count}d${size}+${modifier}`;
        } else if (modifier < 0){
          return `${count}d${size}${modifier}`;
        } else {
          return `${count}d${size}`;
        }
      }

      static getSpellActionIcons(spell, cssClass = "skill-icon"){
        //console.log(spell);
          if (spell.type == "Enchantment"){
            return `<img src="${NEWERA.images}/sp_enchantment.png" class="${cssClass}" data-tooltip="Enchantment" data-tooltip-direction="UP" /><img src="${NEWERA.images}/ac_adventuring.png" class="${cssClass}" data-tooltip="Adventuring Phase (non-combat)" data-tooltip-direction="UP" />`;
          } else {
            switch(spell.system.castType){
              case "Q":
                return `<img src="${NEWERA.images}/ac_1frame.png" class="${cssClass}" data-tooltip="1 Frame" data-tooltip-direction="UP" /><img src="${NEWERA.images}/ac_reaction.png" class="${cssClass}" data-tooltip="Reaction" data-tooltip-direction="UP"/>`;
              case "S":
                return `<img src="${NEWERA.images}/ac_2frame.png" class="${cssClass}" data-tooltip="2 Frames" data-tooltip-direction="UP"/>`;
              case "G":
                return `<img src="${NEWERA.images}/ac_3frame.png" class="${cssClass}" data-tooltip="3 Frames" data-tooltip-direction="UP"/><img src="${NEWERA.images}/ac_delayed.png" class="${cssClass}" data-tooltip="Delayed - Finishes Next Turn" data-tooltip-direction="UP"/>`;
              case "F":
                return `<img src="${NEWERA.images}/ac_1frame.png" class="${cssClass}" data-tooltip="1 Frame" data-tooltip-direction="UP" /><img src="${NEWERA.images}/ac_ongoing.png" class="${cssClass}" data-tooltip="Sustained" data-tooltip-direction="UP" />`;
              case "C":
                return `<img src="${NEWERA.images}/sp_cantrip.png" class="${cssClass}" data-tooltip="Cantrip" data-tooltip-direction="UP" />`;
              case "L":
                return `<img src="${NEWERA.images}/ac_adventuring.png" class="${cssClass}" data-tooltip="Adventuring Phase (Non-Combat)" data-tooltip-direction="UP" />`;
              case "R":
                return `<img src="${NEWERA.images}/sp_ritual.png" class="${cssClass}" data-tooltip="Ritual" data-tooltip-direction="UP" /><img src="${NEWERA.images}/ac_adventuring.png" class="${cssClass}" data-tooltip="Adventuring Phase (non-combat)" />`;
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
          }
        });
        update[`-=${Object.entries(obj).length-1}`] = null;
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

      static truncate(text, length){
        if (!text) return "";
        if (text.length <= length - 3){
          return text;
        } else {
          return text.substring(0, length-3)+"...";
        }
      }

      static spellTitle(spell, ampFactor){
        if (!ampFactor) ampFactor = spell.system.ampFactor;
        return `${spell.name}${ampFactor > 1 ? " "+NEWERA.romanNumerals[ampFactor] : ""}`;
      }

      static keyToTitle(key){
        return key.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
      }

      static titleToKey(title){
        return title.toLowerCase().replace(/\s+/g, "-");
      }

      /**
       * Splits an indexed object into two based on a predicate function.
       * Returns an array with two objects, the first containing the entries for which the predicate returns true, the second containing the rest.
       * @param {*} obj 
       * @param {*} pred 
       * @returns 
       */
      static splitIndexedObject(obj, pred){
        const result = [{}, {}];
        for (const [key, value] of Object.entries(obj)){
          if (pred(value)){
            result[0][key] = value;
          } else {
            result[1][key] = value;
          }
        }
        return result;
      }
    
      static getEstimatedValue(vBase, vMaterial, condition, quality){
        let v1 = vBase * vMaterial * NEWERA.conditions[condition].valueMultiplier;
        let v2 = v1 * (1.0 + (0.05 * quality));
        return Math.ceil(v2 / 5) * 5;
      }

}