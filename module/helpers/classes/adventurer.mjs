export class Adventurer {

    static hitPointIncrement = {
        roll: `1d8`,
        average: 5
    }

    static classFeatures = [
        {
            level: 1,
            id: "adventurer.brainsVsBrawn1",
            name: "Brains vs. Brawn",
            key: false,
            description: "<p>Choose Brains or Brawn.</p><p><b>Brains:</b> Gain a +1 class bonus to your Passive Perception, gain an additional knowledge of your choice, or increase one of your existing knowledge skills by 1 (but not higher than 5.)</p><p><b>Brawn:</b> Choose a combat-related stat and receive a +1 class bonus to it.</p>",
            selections: {
                mode: {
                    label: "Choose a Bonus",
                    options: {newKnowledge: "Brains - New Knowledge", lvlKnowledge: "Brains - Increase Existing Knowledge", perception: "Brains - Passive Perception +1", speed: "Brawn - Speed +1", initiative: "Brawn - Initiative +1", armor: "Brawn - Natural Armor +1", agility: "Brawn - Passive Agility +1"}
                }
            }
        },
        {
            level: 2,
            common: "naturalSkillImprovement"
        },
        {
            level: 3,
            common: "abilityScoreImprovement"
        }
    ] 
}