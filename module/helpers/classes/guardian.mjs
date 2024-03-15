import { NEWERA } from "../config.mjs";
export class Guardian {


    static async activateFightingStance(actor, name){
        const stance = Guardian.stanceEffects[name];
        if (!stance){
            ui.notifications.error("Macro error: Stance not found");
            return;
        }
        const oldStance = actor.effects.find(e => e.name && e.name.toLowerCase().includes("stance"));
        if (oldStance){
            actor.actionMessage(actor.img, `${NEWERA.images}/ac_1frame.png`, `{NAME} switches from ${oldStance.label} to ${stance.label}!`);
            oldStance.delete();
        } else {
            actor.actionMessage(actor.img, `${NEWERA.images}/ac_1frame.png`, `{NAME} enters ${stance.label}!`);
        }
        actor.createEmbeddedDocuments('ActiveEffect', [stance]);
    }

    static async endStance(actor){
        const oldStance = actor.effects.find(e => e.name && e.name.toLowerCase().includes("stance"));
        if (oldStance){
            actor.actionMessage(actor.img, `${NEWERA.images}/guardian.png`, `{NAME} exits ${oldStance.label}.`);
            oldStance.delete();
        } else {
            ui.notifications.warn(`${actor.name} isn't in a stance.`);
        }
    }

    static stanceEffects = {
        "Gorilla": {
            label: "Gorilla Stance",
            icon: `${NEWERA.images}/gorilla.png`,
            description: `<p>
            You move low to the ground and fight with your fists. While in this stance:
            <ul>
                <li style="color: lightblue">Your basic unarmed attack deals 1d6 damage plus your Strength modifier.</li>
                <li style="color: lightblue">You gain a Strong Punch attack (2 frames) that deals 1d12 Bludgeoning damage plus your Strength modifier.</li>
                <li style="color: salmon">You have disadvantage on Agility checks and Reflex saves.</li>
                <li style="color: salmon">You can't hold any items or cast spells, and can only make unarmed attacks.</li>
            </ul>
        </p>
        <p>You may exit your stance as a free action or switch to another stance in one frame. You exit your stance when combat ends.</p>`
        },
        "Mountain": {
            label: "Mountain Stance",
            icon: `${NEWERA.images}/peaks.png`,
            description: `<p>
            You assume the stance of an immovable mountain. While in this stance:
            <ul>
                <li style="color: lightblue">You gain a +2 bonus to your Natural Armor.</li>
                <li style="color: lightblue">You gain a +5 bonus on checks against being staggered, stunned, or forcefully moved.</li>
                <li style="color: salmon">Your Speed is reduced by 4.</li>
            </ul>
        </p>`
        },
        "Lion": {
            label: "Lion Stance",
            icon: `${NEWERA.images}/lion.png`,
            description: `<p>
            You gain the speed and reflexes of a big cat, allowing you to move about quickly to protect your allies. While in this stance:
            <ul>
                <li style="color: lightblue">Your Speed increases by 6.</li>
                <li style="color: lightblue">You gain a +5 bonus on the Tackle, Protect Ally, and Pull to Safety actions.</li>
                <li style="color: salmon">You cannot attack.</li>
            </ul>
        </p>`
        },
        "Sentinel": {
            label: "Sentinel Stance",
            icon: `${NEWERA.images}/guards.png`,
            description: "Your turn length is reduced by 2 frames, but you gain 2 fraction frames"
        }
    }
}