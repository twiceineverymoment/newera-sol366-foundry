
/**
 * This file contains custom logic for feats.
 * Although each tier has a unique ID in CASPER, only the first tier is exported to Foundry by its number.
 * Selection keys must be unique to the entire feat/tier
 */
export const FeatData = {
    "148": {
        "1": {
            prerequisite: {
                check: "value",
                value: actor => {
                    return Object.values(actor.system.skills).filter(skill => skill.level == 10).length + Object.values(actor.system.magic).filter(skill => skill.level == 10).length
                },
                required: 1,
                doubleCheck: "You have a skill that has reached level 10. Confirm with your GM before taking this feat."
            }
        }
    },
    "85": {
        "1": {
            prerequisite: {
                check: "value",
                value: actor => Object.entries(actor.system.knowledges).length,
                required: 1,
                doubleCheck: "Confirm your foreign language knowledge with the GM."
            } 
        } 
    },
    "262": {
        "1": {
            prerequisite: {
                check: "none",
                doubleCheck: "Confirm your choice with the GM."
            }
        }
    },
    "367": {
        "1": {
            prerequisite: {
                check: "value",
                value: actor => actor.items.filter(i => ["Spell", "Enchantment"].includes(i.type) && i.system.rarity == 0).length,
                required: 3
            }
        }
    },
    "458": {
        "1": {
            prerequisite: {
                check: "value",
                value: actor => Object.values(actor.system.specialties).filter(spec => spec.subject && spec.subject.toLowerCase() == "Animal Handling").length,
                required: 1
            }  
        }
    },
    "94": { //Combat Adept
        "1": {
            features: [
                {
                    onUnlock: (actor) => actor.increaseBaseTurnLength()
                }
            ]
        },
        "2": {
            features: [
                {
                    onUnlock: (actor) => actor.increaseBaseTurnLength() 
                }
            ]
        },
        "3": {
            features: [
                {
                    onUnlock: (actor) => actor.increaseBaseTurnLength()
                }
            ]
        }
    },
    "103": { //Extra Natural Skill
        "1": {
            features: [
                {
                    selections: {
                        "skill": {
                            label: "Select a Skill",
                            dynamicOptions: actor => actor.getSkillOptions(),
                            onChange: (actor, from, to) => actor.setNaturalSkill(from, to)
                        }
                    }
                }
            ]
        }
    },
    "100": { //Working Out
        "1": {
            features: [
                {
                    selections: {
                        "0": {
                            label: "Size Change",
                            options: {increase: "Increase", decrease: "Decrease"},
                            onChange: (actor, from, to) => {
                                //TODO find original size 
                                let change = 0;
                                if (from == "increase") {
                                    change--;
                                } else if (from == "decrease") {
                                    change++;
                                }
                                if (to == "increase") {
                                    change++;
                                } else if (to == "decrease") {
                                    change--;
                                }

                                actor.update({
                                    system: {
                                        size: {
                                            mod: actor.system.size.mod + change
                                        }
                                    }
                                });

                                ui.notifications.info(`Your Size modifier has been changed.`);
                            }
                        }
                    }
                }
            ]
        }
    },
    "135": { //Heavy Lifter
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        actor.update({
                            system: {
                                carryWeight: {
                                    bonus: actor.system.carryWeight.bonus + 2
                                }
                            }
                        });
                        ui.notifications.info(`Your carry weight has been increased.`);
                    }
                }
            ]
        }
    },
    "101": { //Alert 
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        actor.update({
                            system: {
                                passivePerception: {
                                    bonus: actor.system.passivePerception.bonus + 1
                                }
                            }
                        });
                        ui.notifications.info(`Your Passive Perception has been increased.`);
                    }
                }
            ]
        }
    },
    "259": { //Tough 
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        if (actor.system.armor.bonus >= 6){
                            ui.notifications.warn(`${actor.name} Your armor bonus can't be increased beyond 6 via this feat.`);
                            return;
                        }
                        actor.update({
                            system: {
                                armor: {
                                    bonus: actor.system.armor.bonus + 1
                                }
                            }
                        });
                        ui.notifications.info(`Your Natural Armor bonus has been increased.`);
                    }
                }
            ]
        }
    },
    "260": { //Fast Fighter 
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        actor.update({
                            system: {
                                initiative: {
                                    bonus: actor.system.initiative.bonus + 1
                                }
                            }
                        });
                        ui.notifications.info(`Your Initiative bonus has been increased.`);
                    }
                }
            ]
        }
    },
    "261": { //Runner 
        "1": {
            features: [
                {
                    onUnlock: (actor) => {
                        if (actor.system.speed.base >= 12){
                            ui.notifications.warn(`${actor.name} Your speed can't be increased beyond 12 via this feat.`);
                            return;
                        }
                        actor.update({
                            system: {
                                speed: {
                                    base: actor.system.speed.base + 1
                                }
                            }
                        });
                        ui.notifications.info(`Your Speed has been increased.`);
                    }
                }
            ]
        }
    },
    "148": { //Grand Master
        "1": {
            features: [
                {
                    selections: {
                        "skill": {
                            label: "Select a Skill",
                            dynamicOptions: actor => actor.getSkillOptions(),
                            onChange: (actor, from, to) => actor.setGrandMaster(from, to)
                        }
                    }
                }
            ]
        }
    }
};