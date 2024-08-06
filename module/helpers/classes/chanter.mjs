import { NEWERA } from "../config.mjs";

export class Chanter {

    static async resetChants(actor){
        const chantSlotCount = {
            basic: actor.system.tableValues.chantSlots.basic, 
            apprentice: actor.system.tableValues.chantSlots.apprentice, 
            intermediate: actor.system.tableValues.chantSlots.intermediate, 
            advanced: actor.system.tableValues.chantSlots.advanced, 
            expert: actor.system.tableValues.chantSlots.expert, 
            master: actor.system.tableValues.chantSlots.master
        };

        await actor.update({
            system: {
                chants: chantSlotCount
            }
        });

    }

    static async startChant(actor, name){
        const chant = actor.items.find(c => c.type == "Feat" && c.system.featType == "CH" && c.name == name);
        if (!chant){
            ui.notifications.error(`${actor.name} does not know ${name}.`);
            return;
        }
        if (!actor.system.chants){
            ui.notifications.warn(`${actor.name} has no chants available.`);
            return;
        }
        const chantLevel = NEWERA.chantLevels[chant.system.chantLevel];
        if (actor.system.chants[chantLevel]){
            Chanter.chant(actor, chant, chantLevel);
        } else {
            for (let i=chant.system.chantLevel; i<=5; i++){
                const levelToUse = NEWERA.chantLevels[i];
                if (actor.system.chants[levelToUse]){
                    new Dialog({
                        title: "Chant",
                        content: `<p>${actor.name} has no ${chantLevel} chant slots remaining.</p>
                        <p>Would you like to use your ${levelToUse} chant slot instead?</p>`,
                        buttons: {
                            confirm: {
                                icon: `<i class="fas fa-check"></i>`,
                                label: "Yes",
                                callback: () => Chanter.chant(actor, chant, levelToUse)
                            },
                            cancel: {
                                icon: `<i class="fas fa-x"></i>`,
                                label: "No"
                            }
                        }
                    }).render(true);
                    return;
                }
            }
            ui.notifications.warn(`${actor.name} has no chants available.`);
        }
    }

    static async chant(actor, chant, slotLevel){

        actor.actionMessage(actor.img, null, "{NAME} begins chanting {0}!", chant.name);
        //TODO Find and delete existing chant effect
        await actor.createEmbeddedDocuments('ActiveEffect', [{
            label: `Chanting (${chant.name})`,
            img: `${NEWERA.images}/shouting.png`,
            description: chant.system.base.description
        }]);
        const update = actor.system.chants;
        update[slotLevel] -= 1;
        await actor.update({
            system: {
                chants: update
            }
        });
        ui.notifications.info(`You spent 1 ${slotLevel} chant slot to perform ${chant.name}.`);
    }

    static async clearTheMind(actor){
        if (!actor.system.chants) return;
        const chanterLevel = actor.getClassLevel("chanter");
        const recoveryCost = [10, 20, 30, 50, 75, 100];
        let options = `<option value="0">Basic</option>`;
        
        if (chanterLevel >= 5) options += `<option value="1">Apprentice</option>`;
        if (chanterLevel >= 10) options += `<option value="2">Intermediate</option>`;
        if (chanterLevel >= 15) options += `<option value="3">Advanced</option>`;
        if (chanterLevel >= 20) options += `<option value="4">Expert</option>`;
        if (chanterLevel >= 25) options += `<option value="5">Master</option>`;

        new Dialog({
            title: "Clear the Mind",
            content: `<p>Select a chant slot level to recover.</p>
            <select id="slotLevel">${options}</select>`,
            buttons: {
                confirm: {
                    icon: `<i class="fas fa-check"></i>`,
                    label: "Confirm",
                    callback: (html) => {
                        const slotLevel = html.find("#slotLevel").val();
                        const slot = NEWERA.chantLevels[slotLevel];
                        const chants = actor.system.chants;
                        chants[slot]++;
                        const cost = recoveryCost[slotLevel];
                        if (cost > actor.system.energy.value){
                            ui.notifications.error("You don't have enough energy!");
                            return;
                        }
                        if (chants[slot] > actor.system.tableValues.chantSlots[slot]){
                            ui.notifications.warn("You haven't expended any chants at this level. This ability can't be used to gain more chants than your normal amount per day.");
                            return;
                        }
                        actor.update({
                            system: {
                                chants: chants,
                                energy: {
                                    value: actor.system.energy.value - cost
                                }
                            }
                        });
                    }
                }
            }
        }).render(true);
    }

}