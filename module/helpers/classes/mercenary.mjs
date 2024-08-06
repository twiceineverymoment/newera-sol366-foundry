/* Contains class-specific ability functions for the Mercenary. */

import { NEWERA } from "../config.mjs";

export class Mercenary {

    static async rage(actor){
        const rageResource = Object.entries(actor.system.additionalResources).find(r => r[1].name == "Rage");
        if (rageResource && rageResource[1].value > 0){
            actor.actionMessage(actor.img, null, "{NAME} is becoming enraged!");
            actor.createEmbeddedDocuments('ActiveEffect', [{
                label: "Rage",
                img: `${NEWERA.images}/fire-dash.png`,
                description: `<p>Your physical abilities are enhanced at the cost of reduced presence of mind. Your Rage ends at the end of combat, or at the end of your turn if you did not attempt an attack during that turn.</p>
                <ul>
                    <li>Your Speed is increased by 4 feet.</li>
                    <li>Strength-based attacks deal additional damage according to your Rage Damage Bonus in the Mercenary table.</li>
                    <li>You're immune to being staggered.</li>
                    <li>You have disadvantage on all mental ability-based checks.</li>
                    <li>Your Passive Perception is reduced by 4.</li>
                </ul>`
            }]);
            let update = {
                system: {
                    additionalResources: {}
                }
            };
            update.system.additionalResources[rageResource[0]] = {
                value: rageResource[1].value - 1
            };
            await actor.update(update);
            ui.notifications.info(`${actor.name} has ${rageResource[1].value - 1} uses of Rage left.`);
        } else {
            ui.notifications.warn(`${actor.name} has expended all Rage for this day. Take a full rest to recover your Rage uses.`);
        }
    }

    static async recklessAttack(actor){
        actor.createEmbeddedDocuments('ActiveEffect', [{
            label: "Reckless",
            img: `${NEWERA.images}/hammer-drop.png`,
            origin: "Reckless Attack",
            "duration.rounds": undefined,
            disabled: false,
            description: `<p>You attack recklessly this round.</p><p>Your attacks have advantage during your turn. Your Passive Agility is reduced to 0 until the start of your next turn.</p>`
        }]);
        actor.actionMessage(actor.img, null, "{NAME} is attacking recklessly!");
    }

}