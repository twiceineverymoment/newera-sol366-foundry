import { Actions } from "./actions.mjs";
import { NEWERA } from "../config.mjs";

/**
 * This class contains default action data for items based on their properties.
 */
export class ItemActions {

    static getDefaultActionsForItem(item){
        switch (item.type){
            case "Melee Weapon":
                return ItemActions._getMeleeWeaponActions(item);
            case "Potion":
                return ItemActions._getPotionActions(item);
            case "Shield":
                return ItemActions._getShieldActions(item);
            case "Ranged Weapon":
                return ItemActions._getRangedWeaponActions(item);
            default:
                return [];
        }
    }

    static _getMeleeWeaponActions(item){
      const attacks = item.system.attacks || [];
      const actions = [];
      const system = item.system;
      for (const attack of attacks){
        actions.push({
          name: attack.name,
          images: {
            base: item.img,
            left: `${NEWERA.images}/dt_${attack.damageType}.png`,
            right: `${NEWERA.images}/ac_${attack.frames}frame.png`
          },
          ability: null,
          skill: (attack.handedness == 2 ? "two-handed" : "one-handed"),
          specialties: [],
          description: `You ${attack.name.toLowerCase()} a creature with your ${item.name}.`,
          difficulty: "The difficulty to hit is the target's Passive Agility. If the target reacts, the outcome of the reaction is used instead.",
          actionType: attack.frames.toString(),
          show: system.handedness == "1.5H" ? (attack.handedness == 2 ? "twoHanded" : "oneHanded") : "equipped",
          rolls: [
            {
              label: "Attack",
              caption: `${attack.name} Attack (${item.name})`,
              die: "d20",
              formula: attack.attackRoll
            },
            {
              label: "Damage",
              caption: `${attack.damageType} damage (${item.name})`,
              die: attack.damageDie.slice(1),
              formula: attack.damageRoll
            }
          ]
        });
      }
      if (system.handedness == "2H"){
        actions.push({
          name: "Parry",
          images: {
            base: item.img,
            left: `${NEWERA.images}/sword-clash.png`,
            right: `${NEWERA.images}/ac_reaction.png`
          },
          ability: null,
          skill: "defense",
          specialties: [],
          description: `You use your ${item.name} to parry an incoming attack. Your weapon suffers a durability check when used to block.`,
          difficulty: "The result of your roll replaces your Passive Agility when contesting the attacker's roll.",
          actionType: "R",
          show: "equipped",
          rolls: [
            {
              label: "Block",
              caption: `Parry (${item.name})`,
              die: "d20",
              formula: "1d20+@skills.defense.mod+@specialty.partial.parrying"
            }
          ]
        });
      }
      return actions;
    }

    static _getRangedWeaponActions(item){
      const actions = [];
      const system = item.system;
      if (system.firingAction == "M" || system.firingAction == "SA"){
        actions.push({
          name: `Fire ${item.name}`,
          images: {
            base: item.img,
            left: `${NEWERA.images}/crosshair.png`,
            right: `${NEWERA.images}/ac_1frame.png`
          },
          ability: null,
          skill: "marksmanship",
          specialties: [`${item.name}s`],
          description: `Fire your ${item.name} at a target in range.`,
          difficulty: "The difficulty to hit is the target's Passive Agility. If the target reacts, the result of their roll becomes the difficulty.",
          actionType: "1",
          show: "equipped",
          rolls: [
            {
              label: "Attack",
              caption: `Ranged Attack (${item.name})`,
              die: "d20",
              formula: "1d20+@skills.marksmanship.mod"
            },
            {
              label: "Damage",
              caption: `Ranged Attack Damage (${item.name})`,
              die: system.damage.slice(1),
              formula: system.damage
            }
          ]
        });
      }
      /* Full auto fire action */
      if (system.firingAction == "FA"){
        actions.push({
          name: `Fire ${item.name}`,
          images: {
            base: item.img,
            left: `${NEWERA.images}/crosshair.png`,
            right: `${NEWERA.images}/ac_1frame.png`
          },
          ability: null,
          skill: "marksmanship",
          specialties: [`${item.name}s`],
          description: `Fire your ${item.name} at a target in range. The fully-automatic weapon fires ${system.firingRate} rounds in one frame.`,
          difficulty: "The difficulty to hit is the target's Passive Agility. If the target reacts, the result of their roll becomes the difficulty.",
          actionType: "1",
          show: "equipped",
          rolls: [
            {
              label: `Attack (${system.firingRate})`,
              caption: `Ranged Attack (${item.name})`,
              die: "d20",
              formula: "1d20+@skills.marksmanship.mod"
            },
            {
              label: "Damage",
              caption: `Ranged Attack Damage (${item.name})`,
              die: system.damage.slice(1),
              formula: system.damage
            }
          ]
        });
      }
      /* Manual load/cock action */
      if (system.firingAction == "M"){
        actions.push({
          name: `Cock ${item.name}`,
          images: {
            left: item.img,
            base: `${NEWERA.images}/cowboy-holster.png`,
            right: `${NEWERA.images}/ac_1frame.png`
          },
          ability: null,
          skill: null,
          specialties: [],
          description: `Chamber a round into your ${item.name}, getting ready to fire a shot.`,
          difficulty: "",
          actionType: "1",
          show: "equipped",
          rolls: []
        });
      }
      /* Load/reload actions */
      if (system.magReload){
        actions.push({
          name: `Reload ${item.name}`,
          images: {
            base: `${NEWERA.images}/machine-gun-magazine.png`,
            left: item.img,
            right: `${NEWERA.images}/ac_3frame.png`
          },
          ability: null,
          skill: null,
          specialties: [],
          description: `Reload your ${item.name} from ammunition in your inventory.`,
          difficulty: "",
          actionType: "3",
          show: "equipped",
          rolls: []
        });
      } else if (system.firingAction == "B"){
        actions.push({
          name: `Notch Arrow`,
          images: {
            base: `${NEWERA.images}/quiver.png`,
            left: item.img,
            right: `${NEWERA.images}/ac_1frame.png`
          },
          ability: null,
          skill: null,
          specialties: [],
          description: `Notch an arrow onto your ${item.name} and prepare to fire.`,
          difficulty: "",
          actionType: "1",
          show: "equipped",
          rolls: []
        });
      } else {
        actions.push({
          name: `Load ${item.name}`,
          images: {
            base: `${NEWERA.images}/shotgun-rounds.png`,
            left: item.img,
            right: `${NEWERA.images}/ac_1frame.png`
          },
          ability: null,
          skill: null,
          specialties: [],
          description: `Load a single shot into your ${item.name} from your inventory.`,
          difficulty: "",
          actionType: "1",
          show: "equipped",
          rolls: []
        });
      }
      /* Bow firing actions */
      if (system.firingAction == "B"){
        actions.push({
          name: `Quick shot`,
          images: {
            base: item.img,
            right: `${NEWERA.images}/ac_1frame.png`
          },
          ability: null,
          skill: "marksmanship",
          specialties: ["Archery"],
          description: "Quickly draw your bow and fire a weak shot. The damage and range of your bow is halved.",
          difficulty: "The difficulty to hit is the target's Passive Agility. If the target reacts, the result of their roll becomes the difficulty.",
          actionType: "1",
          show: "equipped",
          rolls: [
            {
              label: "Shoot",
              caption: `Quick Shot (${item.name})`,
              die: "d20",
              formula: "1d20+@skills.marksmanship.mod",
            },
            {
              label: "Half Damage",
              caption: `Quick Shot Damage (${item.name})`,
              die: system.damage.slice(1),
              formula: `(${system.damage})/2`
            }
          ]
        });
        actions.push({
          name: `Shoot Arrow`,
          images: {
            base: item.img,
            right: `${NEWERA.images}/ac_2frame.png`
          },
          ability: null,
          skill: "marksmanship",
          specialties: ["Archery"],
          description: "You draw your bow back to its normal tension and loose an arrow.",
          difficulty: "The difficulty to hit is the target's Passive Agility. If the target reacts, the result of their roll becomes the difficulty.",
          actionType: "2",
          show: "equipped",
          rolls: [
            {
              label: "Shoot",
              caption: `Ranged Attack (${item.name})`,
              die: "d20",
              formula: "1d20+@skills.marksmanship.mod",
            },
            {
              label: "Damage",
              caption: `Damage (${item.name})`,
              die: system.damage.slice(1),
              formula: `${system.damage}`
            }
          ]
        });
        actions.push({
          name: `Power Shot`,
          images: {
            base: item.img,
            left: `${NEWERA.images}/muscle-up.png`,
            right: `${NEWERA.images}/ac_3frame.png`
          },
          ability: null,
          skill: "marksmanship",
          specialties: ["Archery"],
          description: "Draw your bow to its maximum tension and loose a powerful shot. The range of your shot increases by 100 feet and the damage is doubled. You must succeed on a Strength check to hold onto the drawn bow.",
          difficulty: "The difficulty to hit is the target's Passive Agility. If the target reacts, the result of their roll becomes the difficulty.",
          actionType: "3",
          show: "equipped",
          rolls: [
            {
              label: "Draw",
              caption: `Draw ${item.name}`,
              die: "d20",
              formula: "1d20+@strength.mod"
            },
            {
              label: "Shoot",
              caption: `Power Shot (${item.name})`,
              die: "d20",
              formula: "1d20+@skills.marksmanship.mod",
            },
            {
              label: "Damage",
              caption: `Power Shot Damage (${item.name})`,
              die: system.damage.slice(1),
              formula: `(${system.damage}+@abilities.str.mod)*2`
            }
          ]
        });
      }
      return actions;
    }

    static _getShieldActions(item){
        return [
            {
                name: "Block",
                images: {
                  base: item.img,
                  right: `${NEWERA.images}/ac_reaction.png`
                },
                ability: null,
                skill: "defense",
                specialties: [],
                description: `You use your ${item.name} to block an incoming attack. The shield blocks incoming damage up to its shield rating.`,
                difficulty: "The result of your roll replaces your Passive Agility when contesting the attacker's roll.",
                actionType: "R",
                show: "equipped",
                rolls: [
                  {
                    label: "Block",
                    caption: `Block (${item.name})`,
                    die: "d20",
                    formula: "1d20+@skills.defense.mod+@specialty.partial.shields"
                  }
                ]
            }
        ];
    }

    static _getPotionActions(item){
        if (item.system.isRecipe) return [];
        let verb = "";
        let action = "0";
        let icon = "";
        switch(item.system.potionType){
            case "P":
            case "E":
            verb = "Drink";
            action = "3";
            icon = "ac_3frame";
            break;
        case "S":
          verb = "Apply";
          action = "E";
          icon = "ac_adventuring";
          break;
        case "B":
          verb = "Throw";
          action = "1";
          icon = "ac_1frame";
          break;
        case "R":
          return; //Reagents don't have any actions
        }
        return [{
          name: `${verb} ${item.name}`,
          images: {
          base: item.img,
          right: `${NEWERA.images}/${icon}.png`
        },
        ability: null,
        skill: null,
        specialties: [],
        description: item.system.description,
        actionType: action,
        show: "always",
        overrideMacroCommand: `game.newera.HotbarActions.usePotion("${item.name}")`,
        rolls: [
          {
            label: verb,
            die: "bottle",
            callback: actor => Actions.displayPotionDialog(actor, item)
          }
        ]
      }];
    }

}