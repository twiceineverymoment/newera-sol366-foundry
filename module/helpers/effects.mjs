import { NEWERA } from "../helpers/config.mjs";

/**
 * Manage Active Effect instances through the Actor Sheet via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning document which manages this effect
 */
 export function onManageActiveEffect(event, owner) {
  event.preventDefault();
  const a = event.currentTarget;
  const li = a.closest("li");
  const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
  switch ( a.dataset.action ) {
    case "create":
      return owner.createEmbeddedDocuments("ActiveEffect", [{
        label: "New Effect",
        img: "icons/svg/aura.svg",
        origin: owner.uuid,
        "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
        disabled: li.dataset.effectType === "inactive"
      }]);
    case "edit":
      return effect.sheet.render(true);
    case "delete":
      return effect.delete();
    case "toggle":
      return effect.update({disabled: !effect.data.disabled});
  }
}

export function createEffect(owner){
  owner.createEmbeddedDocuments("ActiveEffect", [{
    label: "New Effect",
    img: "icons/svg/aura.svg",
    owner: owner.uuid,
    disabled: false
  }]);
  console.log("Created new effect");
}

export function editEffect(event, owner){
  const element = event.currentTarget;
  const effect = owner.effects.get(element.dataset.effectId);
  return effect.sheet.render(true);
}

export function deleteEffect(event, owner){
  const element = event.currentTarget;
  const effect = owner.effects.get(element.dataset.effectId);
  effect.delete();
}

export function toggleEffect(event, owner){
  const element = event.currentTarget;
  const effect = owner.effects.get(element.dataset.effectId);
  return effect.update({disabled: !effect.data.disabled});
}

export function getEffectDuration(effect){
  if (!effect.isTemporary) return null;
  if (effect.duration.rounds){
    return `${effect.duration.rounds} ${game.combat && game.combat.active && game.combat.round > 0 ? "Rounds" : "Minutes"}`
  } else {
    if (effect.duration.seconds >= 86400){
      const days = Math.floor(effect.duration.seconds / 86400);
      return `${days} ${days > 1 ? "Days" : "Day"}`
    } else if (effect.duration.seconds >= 3600){
      const hours = Math.floor(effect.duration.seconds / 3600);
      return `${hours} ${hours > 1 ? "Hours" : "Hour"}`
    } else if (effect.duration.seconds >= 60){
      const minutes = Math.floor(effect.duration.seconds / 60);
      return `${minutes} ${minutes > 1 ? "Minutes" : "Minute"}`
    } else if (effect.duration.seconds) { //Status effects from the game canvas appear to always have isTemporary=true even when all duration fields are empty. In this case it forces the status effect to appear on the UI, but also shows "null seconds" as the duration unless we do this final check to make sure duration.seconds isn't falsy
      return `${effect.duration.seconds} Seconds`;
    } else {
      return "";
    }
  }
}

export function advanceGameTime(){
  
}

/*
  Lookup an ActiveEffect by its name to determine whether it's one of the standard ones, and if it has multiple levels.
  Returns an object containing the category key, current level, and maximum level if the effect is standard.
  Returns false if the effect is not found in the standard set.
*/
export function findStandardActiveEffectByName(name){
  //console.log(`[DEBUG] find std effect ${name}`);
  for (const [i, category] of Object.entries(NEWERA.statusEffects)){
    for (const [j, effect] of Object.entries(category)){
      if (name == effect.name){
        return {
          category: i,
          level: j,
          max: Object.keys(category).length
        };
      }
    }
  }
  return false;
}