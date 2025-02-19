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
    "103": {
        "1": {
            features: [
                {
                    selections: {
                        "skill": {
                            label: "Select a Skill",
                            options: {
                                agility: "Agility",
                                athletics: "Athletics",
                                deception: "Deception",
                                defense: "Defense",
                                determination: "Determination",
                                diplomacy: "Diplomacy",
                                endurance: "Endurance",
                                intimidation: "Intimidation",
                                logic: "Logic",
                                marksmanship: "Marksmanship",
                                medicine: "Medicine",
                                "one-handed": "One-Handed",
                                perception: "Perception",
                                performance: "Performance",
                                reflex: "Reflex",
                                persuasion: "Persuasion",
                                "sleight-of-hand": "Sleight of Hand",
                                stealth: "Stealth",
                                technology: "Technology",
                                "two-handed": "Two-Handed",
                                elemental: "Elemental Magic",
                                divine: "Divine Magic",
                                physical: "Physical Magic",
                                psionic: "Psionic Magic",
                                spectral: "Spectral Magic",
                                temporal: "Temporal Magic"
                            },
                            onChange: (actor, from, to) => actor.setNaturalSkill(from, to)
                        }
                    }
                }
            ]
        }
    },
    "100": {
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
    "135": {
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
    }
};