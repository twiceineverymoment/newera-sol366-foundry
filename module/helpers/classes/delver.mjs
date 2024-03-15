import { NEWERA } from "../config.mjs";
export class Delver {

    static async elementalChanneling(actor, pType){
        if (actor.system.energy.value <= 0){
            ui.notifications.warn(`${actor.name}'s energy is depleted.`);
            return;
        }
        const type = pType || actor.system.classes.delver.archetype[1]; //TODO Placeholder since this version only goes through level 10. This will eventually need to support multiple options when delvers get multiple elements
        const dmgTypes = {
            "fire": "Burning",
            "water": "Freezing",
            "earth": "Bludgeoning",
            "wind": "Shock"
        };
        const channelingDmgRoll = actor.system.tableValues.elementalChannelingDmgDie;
        const r = new Roll(channelingDmgRoll, actor.getRollData());
        await r.evaluate();
        r.toMessage({
            speaker: ChatMessage.getSpeaker({actor: actor}),
            flavor: `Damage - Elemental Channeling (${dmgTypes[type]})`
        });
        if (r.total > actor.system.energy.value){
            await actor.takeDamage(r.total - actor.system.energy.value, "exhaustion", false, false);
        }
        await actor.update({
            system: {
                energy: {
                    value: Math.max(actor.system.energy.value - r.total, 0)
                }
            }
        });
    }
}