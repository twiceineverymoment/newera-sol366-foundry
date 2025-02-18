import { NEWERA } from "../config.mjs";
import { ChantSheet } from "../../sheets/chants.mjs";

export class Chanter {

    static hitPointIncrement = {
        roll: `1d6`,
        average: 4
    }

    static classFeatures = [
            {
                level: 1,
                id: "chanter.naturalSkills",
                name: "Chanter Natural Skills",
                key: false,
                description: "Choose 3 of the following Natural Skills.",
                selections: {
                    "1": {
                        label: "First Choice",
                        options: {diplomacy: "Diplomacy", insight: "Insight", performance: "Performance", deception: "Deception", intimidation: "Intimidation", determination: "Determination", logic: "Logic", "psionic-magic": "Psionic Magic"}
                    },
                    "2": {
                        label: "Second Choice",
                        options: {diplomacy: "Diplomacy", insight: "Insight", performance: "Performance", deception: "Deception", intimidation: "Intimidation", determination: "Determination", logic: "Logic", "psionic-magic": "Psionic Magic"}
                    },
                    "3": {
                        label: "Third Choice",
                        options: {diplomacy: "Diplomacy", insight: "Insight", performance: "Performance", deception: "Deception", intimidation: "Intimidation", determination: "Determination", logic: "Logic", "psionic-magic": "Psionic Magic"}
                    }
                }
            },
            {
                level: 1,
                id: "chanter.specialties",
                name: "Chanter Specialties",
                key: false,
                description: "Choose two of the following Specialties.",
                selections: {
                    "1": {
                        label: "Specialty #1",
                        options: {"sense-motive": "Sense Motive (Insight)", "diversion": "Diversion (Performance)", "socialization": "Socialization (Diplomacy)", "investigation": "Investigation (Logic)", instrument: "Musical Instrument"}
                    },
                    "2": {
                        label: "Specialty #2",
                        options: {"sense-motive": "Sense Motive (Insight)", "diversion": "Diversion (Performance)", "socialization": "Socialization (Diplomacy)", "investigation": "Investigation (Logic)", instrument: "Musical Instrument"}
                    }
                }
            },
            {
                level: 1,
                name: "Verbal Magic",
                key: true,
                description: "You have the unusual gift of Verbal Magic. You have a number of chant slots determined by your level in the Chanter table. You can expend a chant slot to activate a chant you know of equal or lesser level to the expended slot.",
                tableValues: [
                    {
                        field: "chantSlots.basic",
                        label: "Basic Chant Slots",
                        sign: false,
                        values: [null, 2, 3, 3, 4, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6]
                    },
                    {
                        field: "chantSlots.apprentice",
                        label: "Apprentice Chant Slots",
                        sign: false,
                        values: [null, 0, 0, 0, 0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6]
                    },
                    {
                        field: "chantSlots.intermediate",
                        label: "Intermediate Chant Slots",
                        sign: false,
                        values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 4, 4]
                    },
                    {
                        field: "chantSlots.advanced",
                        label: "Advanced Chant Slots",
                        sign: false,
                        values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
                    },
                    {
                        field: "chantSlots.expert",
                        label: "Expert Chant Slots",
                        sign: false,
                        values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        field: "chantSlots.master",
                        label: "Master Chant Slots",
                        sign: false,
                        values: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ],
                actions: [
                    {
                        name: "Chant",
                        images: {
                            base: `${NEWERA.images}/shouting.png`,
                            left: `${NEWERA.images}/chanter.png`,
                            right: `${NEWERA.images}/ac_1frame.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: "<p>You use your Verbal Magic powers to begin an arcane chant that has an ongoing effect.</p><p>Choose a chant you know. You expend a chant slot of that chant's level or higher. You continue the chant until it ends, or your concentration is broken.</p>",
                        overrideMacroCommand: "game.newera.HotbarActions.openChants()",
                        difficulty: null,
                        actionType: "1",
                        rolls: [
                            {
                            label: "Chant",
                            die: "shouting",
                            callback: actor => new ChantSheet(actor).render(true)
                            }
                        ]
                    }
                ]
            },
            {
                level: 1,
                name: "Basic Chants",
                key: false,
                description: "You gain two Basic-level chant slots and the ability to take Basic chant feats. You may learn any two Basic chants without paying their character point costs."
            },
            {
                level: 2,
                common: "learningExperience"
            },
            {
                level: 2,
                common: "specialtyImprovement"
            },
            {
                level: 3,
                name: "Spellcasting",
                key: true,
                description: `<p>You've unlocked your magical abilities.</p>
                <p>Assign values to your Magical Skills. You may assign the number of points shown below to the forms of magic shown below.</p>
                <p>Your Caster Level increases with your level according to the Chanter table.</p>
                <div class="magic-info">
                    <h4>3 Magic Skill Points</h4>
                    <img class="resource-icon" src="${NEWERA.images}/divine.png" data-tooltip="Divine" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/psionic.png" data-tooltip="Psionic" data-tooltip-direction="UP" />
                </div>
                `,
                tableValues: [
                    {
                        field: "casterLevel.chanter",
                        label: "Caster Level",
                        sign: false,
                        values: [null, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]
                    }
                ]
            },
            {
                level: 3,
                name: "Spell Studies (1<sup>st</sup> Level)",
                key: false,
                description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
                <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
                <div class="magic-info">
                    <h4>1 Common Chanter Spell (Level 1)</h4>
                    <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" data-tooltip="Hypnotism" data-tooltip-direction="UP" />
                </div>
                `,
                spellStudies: [
                    {
                        choose: 1,
                        rarity: 1,
                        lists: ["chanter"],
                        spellType: "SE",
                        level: {
                            max: 1
                        }
                    }
                ]
            },
            {
                level: 3,
                name: "Clear the Mind",
                key: false,
                description: "<p>You can use your energy to recover expended chant slots.</p><p>You may spend one hour resting to recover a single chant slot of your highest available chant level or below. <i>(You still recover all your chant slots upon completion of a full 8-hour rest.)</i>",
                actions: [
                    {
                        name: "Clear the Mind",
                        images: {
                            base: `${NEWERA.images}/meditation.png`,
                            left: `${NEWERA.images}/chanter.png`,
                            right: `${NEWERA.images}/ac_restful.png`
                        },
                        ability: null,
                        skill: null,
                        specialties: [],
                        description: "<p>You spend one hour refocusing your mental energy and recover one expended chant slot of your highest available chant level or lower.</p><ul><li>10 energy for a Basic chant slot</li><li>20 energy for an Apprentice slot</li><li>30 energy for an Intermediate slot</li><li>50 energy for an Advanced slot</li><li>75 energy for an Expert slot</li><li>100 energy for a Master slot</li>",
                        overrideMacroCommand: "game.newera.HotbarActions.clearTheMind()",
                        difficulty: null,
                        actionType: "D",
                        rolls: [
                            {
                                label: "Activate",
                                die: "meditation",
                                callback: actor => Chanter.clearTheMind(actor)
                            }
                        ]
                    }
                ]
            },
            {
                level: 4,
                name: "Natural Skill Improvement",
                key: false,
                description: "Your Natural Skills each increase in level by 1.",
            },
            {
                level: 5,
                name: "Apprentice Chants",
                key: false,
                description: "You gain two Apprentice-level chant slots and the ability to take Apprentice chant feats. You may learn any two Apprentice chants without paying their character point costs."
            },
            {
                level: 5,
                name: "Spell Studies (2<sup>nd</sup> Level)",
                key: false,
                description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
                <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
                <div class="magic-info">
                    <h4>3 Common Chanter Spells (Level 2 or lower)</h4>
                    <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" data-tooltip="Hypnotism" data-tooltip-direction="UP" />
                </div>
                `,
                spellStudies: [
                    {
                        choose: 3,
                        rarity: 1,
                        lists: ["chanter"],
                        spellType: "SE",
                        level: {
                            max: 2
                        }
                    }
                ]
            },
            {
                level: 6,
                common: "abilityScoreImprovement"
            },
            {
                level: 7,
                name: "Fount of Knowledge",
                key: true,
                description: `<p>Your mind is a well of what you once thought to be useless information, but you never know when it might come in handy.</p>
                <p>Add your Proficiency Bonus to Research, Investigate, and Recall Information action checks on any subject. Your proficiency bonus increases with your level according to the Chanter Table.</p>`,
                tableValues: [
                    {
                        field: "proficiencyBonus.chanter",
                        name: "Proficiency Bonus",
                        sign: true,
                        values: [null, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3]
                    }
                ]
            },
            {
                level: 8,
                common: "specialtyImprovement"
            },
            {
                level: 8,
                name: "Spell Studies (3<sup>rd</sup> Level)",
                key: false,
                description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
                <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
                <div class="magic-info">
                    <h4>1 Uncommon Chanter Spell (Level 3 or lower)</h4>
                    <h4>2 Common Chanter Spells (Level 3 or lower)</h4>
                    <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" data-tooltip="Hypnotism" data-tooltip-direction="UP" />
                </div>
                `,
                spellStudies: [
                    {
                        choose: 1,
                        rarity: 2,
                        lists: ["chanter"],
                        spellType: "SE",
                        level: {
                            max: 3
                        }
                    },
                    {
                        choose: 2,
                        rarity: 1,
                        lists: ["chanter"],
                        spellType: "SE",
                        level: {
                            max: 3
                        }
                    }
                ]
            },
            {
                level: 9,
                common: "naturalSkillImprovement"
            },
            {
                level: 9,
                name: "Unshakeable Resolve",
                key: false,
                description: "You can perform any number of 1-frame actions during your turn without interrupting your chant, as long as none of those actions involve the use of your voice."
            },
            {
                level: 10,
                id: "chanter.bonus",
                key: false,
                name: "Chanter Bonus",
                description: "Choose one of the following bonuses.",
                selections: {
                    "1": {
                        label: "Choose an Upgrade",
                        options: {
                            passivePerception: "+1 Passive Perception Bonus",
                            passiveAgility: "+1 Passive Agility Bonus",
                            spell: "Learn 1 Common Chanter spell of any level"
                        }
                    }
                }
            },
            {
                level: 10,
                name: "Intermediate Chants",
                key: false,
                description: "You gain two Intermediate-level chant slots and the ability to take Intermediate chant feats. You may learn any two Intermediate chants without paying their character point costs."
            },
            {
                level: 11,
                common: "abilityScoreImprovement"
            },
            {
                level: 12,
                id: "chanter.bonus",
                key: false,
                name: "Chanter Bonus",
                description: "Choose one of the following bonuses.",
                selections: {
                    "2": {
                        label: "Choose an Upgrade",
                        options: {
                            passivePerception: "+1 Passive Perception Bonus",
                            passiveAgility: "+1 Passive Agility Bonus",
                            spell: "Learn 1 Common Chanter spell of any level"
                        }
                    }
                }
            },
            {
                level: 12,
                name: "Spell Studies (4<sup>th</sup> Level)",
                key: false,
                description: `<p>You learn new spells from the <a href="https://www.newerarpg.com/srd/newera-sol366/spell-study-guide">Spell Study Guide</a>.</p>
                <p>You may learn the listed number of new spells or enchantments, of equal or lower level to your current caster level, and of equal or lesser <a href="https://www.newerarpg.com/srd-newera-sol366/spell-rarity">rarity</a>.</p>
                <div class="magic-info">
                    <h4>3 Uncommon Chanter Spells (Level 4 or lower)</h4>
                    <img class="resource-icon" src="${NEWERA.images}/restoration.png" data-tooltip="Restoration" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/illusion.png" data-tooltip="Illusion" data-tooltip-direction="UP" />
                    <img class="resource-icon" src="${NEWERA.images}/hypnotism.png" data-tooltip="Hypnotism" data-tooltip-direction="UP" />
                </div>
                `,
                spellStudies: [
                    {
                        choose: 3,
                        rarity: 2,
                        lists: ["chanter"],
                        spellType: "SE",
                        level: {
                            max: 4
                        }
                    }
                ]
            },
            {
                level: 13,
                common: "naturalSkillImprovement"
            },
            {
                level: 13,
                common: "learningExperience"
            },
            {
                level: 14,
                common: "specialtyImprovement"
            },
            {
                level: 14,
                name: "Chant Blending",
                key: false,
                description: `<p>You can perform two chants simultaneously.</p><p>Activating each chant takes a separate action and expends a chant slot. If your concentration is broken, both chants are ended.</p>`
            },
            {
                level: 15,
                common: "learningExperience"
            },
            {
                level: 15,
                name: "Advanced Chants",
                key: false,
                description: "You gain two Advanced-level chant slots and the ability to take Advanced chant feats. You may learn any two Advanced chants without paying their character point costs."
            }
    ]

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