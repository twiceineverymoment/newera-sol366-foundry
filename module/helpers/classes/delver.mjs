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

    static async rage(actor){
        if (actor.system.energy.value > 10){
            actor.actionMessage(actor.img, null, "{NAME} is becoming enraged!");
            await actor.createEmbeddedDocuments('ActiveEffect', [{
                label: "Rage",
                icon: `${NEWERA.images}/fire-dash.png`,
                description: `<p>Your physical abilities are enhanced at the cost of reduced presence of mind. You may end Rage at any time as a free action.</p>
                <ul>
                    <li>Your Speed is increased by 4 feet.</li>
                    <li>Strength-based attacks deal additional damage according to your Rage Damage Bonus in the Mercenary table.</li>
                    <li>You're immune to being staggered.</li>
                    <li>You have disadvantage on all mental ability-based checks.</li>
                    <li>Your Passive Perception is reduced by 4.</li>
                </ul>`
            }]);
            await actor.update({
                system: {
                    energy: {
                        value: actor.system.energy.value - 10
                    }
                }
            });
        } else {
            ui.notifications.error("You don't have enough energy!");
        }
    }

    static async rollWildFury(actor, table){
        let r = new Roll('1d4');
        await r.evaluate();
        r.toMessage({
            speaker: ChatMessage.getSpeaker({actor: actor}),
            flavor: `Wild Fury (Path of ${table})`
        });
        actor.actionMessage(`${NEWERA.images}/embraced-energy.png`, null, `<b>Wild Fury: </b>{0}`, NEWERA.wildFuryTable[table][r.total - 1]);
    }
}