import { NEWERA } from "../config.mjs";
export class Guardian {


    static async activateFightingStance(actor, name){
        const stance = Guardian.stanceEffects[name];
        if (!stance){
            ui.notifications.error("Macro error: Stance not found");
            return;
        }
        if (stance.activationCost){
            if (actor.system.energy.value < stance.activationCost){
                ui.notifications.warn(`This stance requires ${stance.activationCost} energy to activate. You don't have enough energy.`);
                return;
            }
            await actor.update({
                system: {
                    energy: {
                        value: actor.system.energy.value - stance.activationCost
                    }
                }
            });
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

    static async secondWind(actor){
        if (actor.system.hitPoints.value >= actor.system.hitPoints.max) {
            ui.notifications.info(`${actor.name} is already at full health!`);
            return;
        }
        const resource = Object.entries(actor.system.additionalResources).find(r => r[1].name.toLowerCase().includes("second wind"));
        if (resource && resource[1].value > 0){
            let roll = new Roll(`${actor.system.tableValues.secondWind.roll}`, actor.getRollData());
            await roll.evaluate();
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({actor: actor}),
                flavor: "Second Wind"
            });
            await actor.heal(roll.total, false, false);
            let update = {
                system: {
                    additionalResources: {}
                }
            };
            update.system.additionalResources[resource[0]] = {
                value: resource[1].value - 1
            };
            await actor.update(update);
            ui.notifications.info(`You recovered ${roll.total} HP with Second Wind. ${actor.name} has ${resource[1].value - 1} Second Wind dice left.`);
        } else {
            ui.notifications.error(`${actor.name} has expended all their Second Wind dice. Recover one die per hour of resting, or all your dice on a full rest.`);
        }
    }

    static async rage(actor){
        actor.actionMessage(actor.img, null, "{NAME} is becoming enraged!");
            await actor.createEmbeddedDocuments('ActiveEffect', [{
                label: "Rage",
                icon: `${NEWERA.images}/fire-dash.png`,
                description: `<p>Your physical abilities are enhanced at the cost of reduced presence of mind. Your Rage ends at the end of combat, or at the end of your turn if you did not attempt an attack during that turn.</p>
                <ul>
                    <li>Your Speed is increased by 4 feet.</li>
                    <li>Strength-based attacks deal additional damage according to your Rage Damage Bonus in the Mercenary table.</li>
                    <li>You're immune to being staggered.</li>
                    <li>You have disadvantage on all mental ability-based checks.</li>
                    <li>Your Passive Perception is reduced by 4.</li>
                </ul>`
            }]);
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
        },
        "Swordsman": {
            label: "Swordsman Stance",
            icon: `${NEWERA.images}/relic-blade.png`,
            description: `<p>
            Upon entering this stance, you conjure pure energy into the shape of a <a>Longsword</a> in your hand. This item functions identically to an Iron Longsword, but its attacks are magical.
            It can be used either one- or two-handed. Activating this stance requires least one free hand. While in this stance:
           <ul>
               <li style="color: lightblue">Your ethereal sword inflicts magical damage, allowing it to damage spirits.</li>
               <li style="color: lightblue">The sword can Parry (block) attacks without suffering damage.</li>
               <li style="color: salmon">You automatically exit this stance if the sword leaves your hands for any amount of time. When you exit this stance, the sword disappears.</li>
           </ul>
       </p>`,
            activationCost: 20
        },
        "Monk": {
            label: "Monk Stance",
            icon: `${NEWERA.images}/kindle.png`,
            description: `<p>
            Most spells only require the use of one hand. This stance employs a special techique wherein by using both hands to cast spells, you're able to increase their power.
            You must have both hands free when activating this stance.
        </p>
        <p>
            <ul>
                <li style="color: lightblue">Spells you cast are amplified to the next-highest factor. The casting difficulty of the spell remains unchanged, but its energy cost reflects the amplified level.</li>
                <li style="color: lightblue">You have advantage on saves against your concentration being broken.</li>
                <li style="color: salmon">You can't hold items and can only attack by casting spells.</li>
            </ul>
        </p>`
        },
        "Ward": {
            label: "Ward Stance",
            icon: `${NEWERA.images}/rosa-shield.png`,
            activationCost: 6,
            description: `<p>
			You channel your Qi into a powerful defensive posture. While in this stance:
				<ul>
					<li style="color: lightblue">You cast Abjuration spells two levels higher. <i>(The casting difficulty is determined as though your Divine Magic skill level were increased by 2.)</i></li>
					<li style="color: lightblue">If using a shield, its Shield Rating receives a +4 bonus.</li>
					<li style="color: salmon">You can't cast spells from any school of magic other than Abjuration.</li>
				</ul>
			</p>`
        },
        "Lemur": {
            label: "Lemur Stance",
            icon: `${NEWERA.images}/jump1.png`,
            description: `<p>
            You leap about with incredible agility. While in this stance:
            <ul>
                <li style="color: lightblue">Your Speed increases by 4.</li>
                <li style="color: lightblue">You gain a +10 bonus to the Long Jump, High Jump, and Tumble actions.</li>
                <li style="color: salmon">You can't equip items in either hand.</li>
            </ul>
        </p>`
        },
        "Coursing River": {
            label: "Coursing River Stance",
            icon: `${NEWERA.images}/splashy-stream.png`,
            activationCost: 10,
            description: `<p>
            You make flowing movements that emanate your body's natural energy. While in this stance:
            <ul>
                <li style="color: lightblue">Your Speed increases by 2.</li>
                <li style="color: lightblue">All Cryomancy spells cast by you and allies within 30 feet are amplified one level higher.</li>
            </ul>
        </p>`
        },
        "Great Typhoon": {
            label: "Great Typhoon Stance",
            icon: `${NEWERA.images}/tornado.png`,
            activationCost: 10,
            description: `<p>
            You put the full force of your body's strength behind your spells. While in this stance:
            <ul>
                <li style="color: lightblue">All Evocation spells cast by you and allies within 30 feet are amplified one level higher.</li>
            </ul>
        </p>`
        },
        "Raging Fire": {
            label: "Raging Fire Stance",
            icon: `${NEWERA.images}/burning-forest.png`,
            activationCost: 10,
            description: `<p>
            You let your emotions run wild for a brief moment. While in this stance:
            <ul>
                <li style="color: lightblue">You gain a +1 bonus to Strength ability checks.</li>
                <li style="color: lightblue">All Pyromancy spells cast by you and allies within 30 feet are amplified one level higher.</li>
            </ul>
        </p>`
        }
    }
}