import { NEWERA } from "../config.mjs";

export class Ranger {

    static async markCurrentTargetAsPrey(ranger){
        //Get the targeted token

    }

    static async markPrey(actor, target){
        if (actor.system.prey){
            if (game.combat){
                //TODO check if the current prey is dead
                ui.notifications.warn("You can't change prey during combat.");
            }
            if (target.id == actor.system.prey){
                ui.notifications.warn("You have already marked this creature as your Prey.");
                return;
            }
            const preyEffect = game.actors.get(actor.system.prey).effects.find(e => e.name == "Prey" && e.origin == actor.name);
            if (preyEffect) preyEffect.delete();
        }

        const preyBonus = actor.system.tableValues.preyBonus || 1;

        target.createEmbeddedDocuments('ActiveEffect', [{
            label: "Prey",
            img: `${NEWERA.images}/mark-target.png`,
            origin: actor.name,
            description: `<p>You've been marked as Prey by ${actor.name}.</p>
            <p>${actor.system.pronouns.subjective.toUpperCase()} gets a +${preyBonus} bonus to attacks against you.</p>
            `
        }]);

        actor.update({
            system: {
                prey: target.id
            }
        });

        actor.actionMessage(actor.img, `${NEWERA.images}/ranger.png`, "{NAME} marks {0} as {d} prey!", target.name);
    }

    static async removePrey(actor){
        if (actor.system.prey){
            const preyEffect = game.actors.get(actor.system.prey).effects.find(e => e.name == "Prey" && e.origin == actor.id);

        }
    }

}