export const NEWERA = {};

import { Actions } from "./macros/actions.mjs";

/**
 * The set of Ability Scores used within the sytem.
 * @type {Object}
 */

/**
 * Static generic implementation of the typeIs function from the Actor and Item classes.
 * DocumentSheets send items through structuredClone() which strips out the prototype chain, so we must use this function instead of the instance function.
 * @param {NewEraActor | NewEraItem} document 
 * @param {string[]} type 
 * @returns 
 */
NEWERA.typeIs = function(document, type){
    if (!document || !document.type) return false;
    return type.includes(document.type);
}

NEWERA.images = "systems/newera-sol366/resources";
NEWERA.objects = "https://www.newerarpg.com/resources/objects";

NEWERA.abilityScoreModifiers = [
  null, -4, -4, -4, -4, -3, -3, -2, -2, -1, 0, 0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9
];

NEWERA.abilityScorePointCosts = [
  null, null, null, null, null, null, 0, 1, 2, 3, 4, 5, 6, 8, 9, 11
];

NEWERA.EMPTY_POTION_BOTTLE_ID = 3;

NEWERA.levelThresholds = {
    "standard": [
        0, 20, 50, 90, 140, 200, 270, 350, 440, 540, 650, 770, 900, 1040, 1190, 1350, 1520, 1700, 1900, 2100, 2300, 2500, 2750, 3000, 3250, 3500, 3800, 4100, 4400, 4700, 5000
    ],
    "advanced": [
        0, 20, 60, 100, 160, 230, 310, 400, 500, 610, 730, 860, 1000, 1150, 1310, 1480, 1660, 1850, 2100, 2320, 2540, 2760, 3030, 3300, 3700, 4000, 4400, 4800, 5200, 5600, 6000
    ]
};

NEWERA.romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"
];

NEWERA.defaultSkillOptions = {
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

NEWERA.pronouns = {
  0: {
    subjective: "He",
    objective: "Him",
    possessiveDependent: "His",
    possessiveIndependent: "His",
    reflexive: "Himself",
    contraction: "He's",
    pluralize: false
  },
  1: {
    subjective: "He",
    objective: "Them",
    possessiveDependent: "His",
    possessiveIndependent: "Theirs",
    reflexive: "Themself",
    contraction: "He's",
    pluralize: false
  },
  2: {
    subjective: "They",
    objective: "Them",
    possessiveDependent: "Their",
    possessiveIndependent: "Theirs",
    reflexive: "Themself",
    contraction: "They're",
    pluralize: true
  },
  3: {
    subjective: "She",
    objective: "Them",
    possessiveDependent: "Her",
    possessiveIndependent: "Theirs",
    reflexive: "Themself",
    contraction: "She's",
    pluralize: false,
  },
  4: {
    subjective: "She",
    objective: "Her",
    possessiveDependent: "Her",
    possessiveIndependent: "Hers",
    reflexive: "Herself",
    contraction: "She's",
    pluralize: false
  }
}

NEWERA.baseEnergyMaximums = [
    0, 20, 30, 50, 70, 100, 130, 170, 220, 280, 350
]

NEWERA.schoolOfMagicNames = {
  "PY": "pyromancy",
  "HM": "cryomancy",
  "GE": "lithomancy",
  "EV": "evocation",
  "RE": "restoration",
  "AB": "abjuration",
  "BA": "banishment",
  "MA": "physiomancy",
  "CO": "conjuration",
  "TR": "transmutation",
  "IL": "illusion",
  "HY": "hypnotism",
  "DI": "divination",
  "CN": "sangromancy",
  "SU": "summoning",
  "NE": "necromancy",
  "AP": "apparition",
  "CH": "chronomancy",
  "MM": "metamagic",
  "CL": "channeling",
  "??": "metamagic"
}

NEWERA.schoolToFormMapping = {
  "PY": "elemental",
  "HM": "elemental",
  "GE": "elemental",
  "EV": "elemental",
  "RE": "divine",
  "AB": "divine",
  "BA": "divine",
  "MA": "physical",
  "CO": "physical",
  "TR": "physical",
  "IL": "psionic",
  "HY": "psionic",
  "DI": "psionic",
  "CN": "spectral",
  "SU": "spectral",
  "NE": "spectral",
  "AP": "temporal",
  "CH": "temporal",
  "MM": "genericCast",
  "CL": "genericCast",
  "??": "genericCast"
}

NEWERA.schoolAttributes = {
    "elemental": "strength",
    "divine": "constitution",
    "physical": "dexterity",
    "psionic": "intelligence",
    "spectral": "charisma",
    "temporal": "wisdom"
}

NEWERA.spellCastingTimes = {
    "C": "Cantrip",
    "Q": "1 Frame",
    "S": "2 Frames",
    "G": "3 Frames (Resolves next turn)",
    "L": null,
    "R": null,
    "E": "30 minutes",
    "F": "1 Frame (Sustained)"
}

NEWERA.conditions = [
    {
        "label": "Broken ",
        "valueMultiplier": 0.1,
        "modifier": -10,
    },
    {
        "label": "Badly Damaged ",
        "valueMultiplier": 0.5,
        "modifier": -2
    },
    {
        "label": "Damaged ",
        "valueMultiplier": 0.75,
        "modifier": -1
    },
    {
        "label": "",
        "valueMultiplier": 1,
        "modifier": 0
    },
    {
        "label": "Pristine ",
        "valueMultiplier": 1.25,
        "modifier": 0
    },
    {
        "label": "Flawless ",
        "valueMultiplier": 1.5,
        "modifier": 0
    }
]

NEWERA.conditionChangedDescriptions = [
    "broken!",
    "badly damaged.",
    "damaged.",
    "becoming worn.",
    "no longer in flawless condition."
]

NEWERA.qualityLabels = [
    {  
        "min": 10,
        "label": "Mastercraft "
    },
    {  
        "min": 6,
        "label": "Refined "
    },
    {  
        "min": 3,
        "label": "Honed "
    },
    {
        "min": 0,
        "label": ""
    },
    {  
        "min": -3,
        "label": "Weak "
    },
    {  
        "min": -99,
        "label": "Makeshift "
    }
]

NEWERA.materials = {
  "Wooden": {
      "durability": 2,
      "rarity": 1,
      "craftDC": 5,
      "adjustWeight": -2,
      "enchantability": 0,
      "valueMultiplier": 0.1,
      "modifiers": {
          "damage": 0,
          "shield": -6,
          "armor": null
      }
  },
  "Stone": {
      "durability": 4,
      "rarity": 2,
      "craftDC": 10,
      "adjustWeight": 1,
      "enchantability": 0,
      "valueMultiplier": 0.3,
      "modifiers": {
          "damage": 0,
          "shield": null,
          "armor": null
      }
  },
  "Bone": {
      "durability": 8,
      "rarity": 2,
      "craftDC": 10,
      "adjustWeight": -3,
      "enchantability": 0,
      "valueMultiplier": 0.75,
      "modifiers": {
          "damage": 0,
          "shield": null,
          "armor": null
      }
  },
  "Rusty Iron": {
      "durability": 6,
      "rarity": 1,
      "craftDC": 6,
      "adjustWeight": 1,
      "enchantability": -5,
      "valueMultiplier": 0.25,
      "modifiers": {
          "damage": -1,
          "shield": -2,
          "armor": -3
      }
  },
  "Tarnished Bronze": {
      "durability": 8,
      "rarity": 1,
      "craftDC": 7,
      "adjustWeight": 0,
      "enchantability": -5,
      "valueMultiplier": 0.5,
      "modifiers": {
          "damage": -1,
          "shield": -3,
          "armor": -3
      }
  },
  "Iron": {
      "durability": 10,
      "rarity": 1,
      "craftDC": 10,
      "adjustWeight": 1,
      "enchantability": 2,
      "valueMultiplier": 0.85,
      "modifiers": {
          "damage": 0,
          "shield": 0,
          "armor": 0
      }
  },
  "Bronze": {
      "durability": 12,
      "rarity": 2,
      "craftDC": 10,
      "adjustWeight": 0,
      "enchantability": 0,
      "valueMultiplier": 0.9,
      "modifiers": {
          "damage": 0,
          "shield": -2,
          "armor": 0
      }
  },
  "Steel": {
      "durability": 14,
      "rarity": 1,
      "craftDC": 15,
      "adjustWeight": 0,
      "enchantability": 0,
      "valueMultiplier": 1,
      "modifiers": {
          "damage": 0,
          "shield": 1,
          "armor": 1
      }
  },
  "Carbon Steel": {
      "durability": 10,
      "rarity": 2,
      "craftDC": 18,
      "adjustWeight": -1,
      "enchantability": 0,
      "valueMultiplier": 2,
      "modifiers": {
          "damage": 1,
          "shield": 1,
          "armor": 2
      }
  },
  "Stainless Steel": {
      "durability": 16,
      "rarity": 1,
      "craftDC": 17,
      "adjustWeight": 0,
      "enchantability": 0,
      "valueMultiplier": 1.5,
      "modifiers": {
          "damage": 0,
          "shield": 3,
          "armor": 2
      }
  },
  "Silver": {
      "durability": 8,
      "rarity": 3,
      "craftDC": 16,
      "adjustWeight": 1,
      "enchantability": 3,
      "valueMultiplier": 40,
      "modifiers": {
          "damage": 0,
          "shield": null,
          "armor": null
      }
  },
  "Ceramic": {
      "durability": 4,
      "rarity": 2,
      "craftDC": 22,
      "adjustWeight": -2,
      "enchantability": 0,
      "valueMultiplier": 4,
      "modifiers": {
          "damage": 2,
          "shield": -8,
          "armor": 3
      }
  },
  "Obsidian": {
      "durability": 2,
      "rarity": 3,
      "craftDC": 25,
      "adjustWeight": -4,
      "enchantability": 0,
      "valueMultiplier": 6,
      "modifiers": {
          "damage": 3,
          "shield": null,
          "armor": null
      }
  },
  "Ætherite": {
      "durability": 10,
      "rarity": 3,
      "craftDC": 20,
      "adjustWeight": 2,
      "enchantability": 5,
      "valueMultiplier": 30,
      "modifiers": {
          "damage": 0,
          "shield": null,
          "armor": -1
      }
  },
  "Æther Crystal": {
      "durability": 0,
      "rarity": 4,
      "craftDC": 30,
      "adjustWeight": -3,
      "enchantability": 10,
      "valueMultiplier": 50,
      "modifiers": {
          "damage": 1,
          "shield": null,
          "armor": null
      }
  },
  "Nocturnum": {
      "durability": 20,
      "rarity": 4,
      "craftDC": 40,
      "adjustWeight": 5,
      "enchantability": 3,
      "valueMultiplier": 60,
      "modifiers": {
          "damage": 4,
          "shield": 12,
          "armor": 6
      }
  },
  "Leather": {
      "durability": 12,
      "rarity": 1,
      "craftDC": 8,
      "adjustWeight": -3,
      "enchantability": 0,
      "valueMultiplier": 1,
      "modifiers": {
          "damage": null,
          "shield": null,
          "armor": -3
      }
  },
  "Ballistic": {
      "durability": 13,
      "rarity": 1,
      "craftDC": 15,
      "adjustWeight": -4,
      "enchantability": 0,
      "valueMultiplier": 2.5,
      "modifiers": {
          "damage": null,
          "shield": -3,
          "armor": -1
      }
  },
  "Acrylic": {
      "durability": 10,
      "craftDC": 15,
      "adjustWeight": -2,
      "enchantability": 0,
      "valueMultiplier": 1.3,
      "modifiers": {
          "damage": null,
          "shield": -3,
          "armor": -1
      }
  },
  "Rubber": {
      "durability": 18,
      "rarity": 1,
      "craftDC": 10,
      "adjustWeight": -1,
      "enchantability": 0,
      "valueMultiplier": 1.4,
      "modifiers": {
          "damage": null,
          "shield": null,
          "armor": -2
      }
  },
  "Lead": {
      "durability": 11,
      "rarity": 1,
      "craftDC": 8,
      "adjustWeight": 4,
      "enchantability": 2,
      "valueMultiplier": 0.8,
      "modifiers": {
          "damage": null,
          "shield": null,
          "armor": 4
      }
  },
  "Aluminum": {
      "durability": 15,
      "rarity": 1,
      "craftDC": 16,
      "adjustWeight": -2,
      "enchantability": 2,
      "valueMultiplier": 1.15,
      "modifiers": {
          "damage": null,
          "shield": null,
          "armor": 1
      }
  },
  "Nylon": {
      "durability": 15,
      "rarity": 1,
      "craftDC": 20,
      "adjustWeight": -3,
      "enchantability": 0,
      "valueMultiplier": 2,
      "modifiers": {
          "damage": null,
          "shield": null,
          "armor": -3
      }
  },
  "Rusty Steel": {
      "durability": 10,
      "rarity": 1,
      "craftDC": 8,
      "adjustWeight": 0,
      "enchantability": -5,
      "valueMultiplier": 0.4,
      "modifiers": {
          "damage": -1,
          "shield": 0,
          "armor": -2
      }
  },
  "Ethereal": {
      "durability": 0,
      "rarity": 0,
      "craftDC": 0,
      "adjustWeight": -10,
      "enchantability": 10,
      "valueMultiplier": 0,
      "modifiers": {
          "damage": 0,
          "shield": null,
          "armor": null
      }
  },
  "Brass": {
      "durability": 11,
      "rarity": 1,
      "craftDC": 11,
      "adjustWeight": 0,
      "enchantability": 0,
      "valueMultiplier": 1,
      "modifiers": {
          "damage": 0,
          "shield": null,
          "armor": null
      }
  }
}

NEWERA.meleeWeaponTypes = {
    "Knife": {
        "handedness": "1H",
        "weight": 0,
        "value": 1500,
        "rarity": 1,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d4"
        },
        "allowedMaterials": [
            "Stone",
            "Bone",
            "Rusty Iron",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Stainless Steel",
            "Ceramic",
            "Obsidian",
            "Nocturnum",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Stab",
                "damageType": "piercing",
                "power": false
            }
        ]
    },
    "Dagger": {
        "handedness": "1H",
        "weight": 0,
        "value": 3000,
        "rarity": 1,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d4"
        },
        "allowedMaterials": [
            "Stone",
            "Bone",
            "Rusty Iron",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Stainless Steel",
            "Silver",
            "Obsidian",
            "Ætherite",
            "Æther Crystal",
            "Nocturnum",
            "Ceramic",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Stab",
                "damageType": "piercing",
                "power": false
            }
        ]
    },
    "Combat Knife": {
        "handedness": "1H",
        "weight": 0,
        "value": 5000,
        "rarity": 2,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d4"
        },
        "allowedMaterials": [
            "Steel",
            "Carbon Steel",
            "Stainless Steel",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Stab",
                "damageType": "piercing",
                "power": false
            }
        ]
    },
    "Shortsword": {
        "handedness": "1H",
        "weight": 1,
        "value": 7000,
        "rarity": 2,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d6"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Carbon Steel",
            "Stainless Steel",
            "Silver",
            "Obsidian",
            "Ætherite",
            "Æther Crystal",
            "Nocturnum",
            "Rusty Steel",
            "Ethereal"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Stab",
                "damageType": "piercing",
                "power": false
            }
        ]
    },
    "Hatchet": {
        "handedness": "1H",
        "weight": 1,
        "value": 2000,
        "rarity": 1,
        "adjustDurability": 2,
        "damage": {
            "oneHanded": "d8"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Iron",
            "Steel",
            "Carbon Steel",
            "Stainless Steel",
            "Nocturnum",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            }
        ]
    },
    "Spiked Club": {
        "handedness": "1.5H",
        "weight": 2,
        "value": 9000,
        "rarity": 2,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d8",
            "twoHanded": "d10"
        },
        "allowedMaterials": [
            "Wooden",
            "Rusty Iron",
            "Iron"
        ],
        "attackActions": [
            {
                "name": "Bludgeon",
                "damageType": "piercing",
                "power": false
            }
        ]
    },
    "Longsword": {
        "handedness": "1.5H",
        "weight": 2,
        "value": 10000,
        "rarity": 2,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d6",
            "twoHanded": "d10"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Carbon Steel",
            "Stainless Steel",
            "Silver",
            "Obsidian",
            "Ætherite",
            "Æther Crystal",
            "Nocturnum",
            "Rusty Steel",
            "Ethereal"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Stab",
                "damageType": "piercing",
                "power": false
            }
        ]
    },
    "Axe": {
        "handedness": "1.5H",
        "weight": 3,
        "value": 8000,
        "rarity": 1,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d8",
            "twoHanded": "d12"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Iron",
            "Steel",
            "Carbon Steel",
            "Stainless Steel",
            "Nocturnum",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            }
        ]
    },
    "Spear": {
        "handedness": "1.5H",
        "weight": 1,
        "value": 2000,
        "rarity": 1,
        "adjustDurability": -3,
        "damage": {
            "oneHanded": "d4",
            "twoHanded": "d6"
        },
        "allowedMaterials": [
            "Wooden",
            "Stone",
            "Rusty Iron",
            "Iron",
            "Steel",
            "Obsidian",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Throw",
                "damageType": "piercing",
                "power": false
            },
            {
                "name": "Stab",
                "damageType": "piercing",
                "power": false
            }
        ]
    },
    "Greatsword": {
        "handedness": "2H",
        "weight": 3,
        "value": 15000,
        "rarity": 2,
        "adjustDurability": 0,
        "damage": {
            "twoHanded": "d10"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Carbon Steel",
            "Stainless Steel",
            "Silver",
            "Obsidian",
            "Ætherite",
            "Æther Crystal",
            "Nocturnum",
            "Rusty Steel",
            "Ethereal"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Deep Slash",
                "damageType": "slashing",
                "power": true
            },
            {
                "name": "Stab",
                "damageType": "piercing",
                "power": false
            },
            {
                "name": "Impale",
                "damageType": "piercing",
                "power": true
            }
        ]
    },
    "Battle Axe": {
        "handedness": "2H",
        "weight": 4,
        "value": 10000,
        "rarity": 2,
        "adjustDurability": 2,
        "damage": {
            "twoHanded": "d12"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Ætherite",
            "Æther Crystal",
            "Nocturnum",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Deep Slash",
                "damageType": "slashing",
                "power": true
            },
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            },
            {
                "name": "Smash",
                "damageType": "bludgeoning",
                "power": true
            }
        ]
    },
    "Sledgehammer": {
        "handedness": "2H",
        "weight": 3,
        "value": 5000,
        "rarity": 1,
        "adjustDurability": 4,
        "damage": {
            "twoHanded": "d12"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Iron",
            "Steel",
            "Lead",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            },
            {
                "name": "Smash",
                "damageType": "bludgeoning",
                "power": true
            }
        ]
    },
    "Baton": {
        "handedness": "1H",
        "weight": 1,
        "value": 1800,
        "rarity": 1,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d6"
        },
        "allowedMaterials": [
            "Wooden",
            "Steel",
            "Rubber",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            }
        ]
    },
    "Club": {
        "handedness": "1.5H",
        "weight": 2,
        "value": 8000,
        "rarity": 1,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d6",
            "twoHanded": "d10"
        },
        "allowedMaterials": [
            "Wooden",
            "Stone",
            "Bone",
            "Rusty Iron",
            "Iron",
            "Steel",
            "Lead",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            }
        ]
    },
    "Hammer": {
        "handedness": "1H",
        "weight": 1,
        "value": 1000,
        "rarity": 1,
        "adjustDurability": 1,
        "damage": {
            "oneHanded": "d6"
        },
        "allowedMaterials": [
            "Wooden",
            "Steel",
            "Stainless Steel",
            "Rubber",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            }
        ]
    },
    "Katana": {
        "handedness": "2H",
        "weight": 1,
        "value": 16000,
        "rarity": 2,
        "adjustDurability": 0,
        "damage": {
            "twoHanded": "d12"
        },
        "allowedMaterials": [
            "Steel",
            "Stainless Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            },
            {
                "name": "Deep Slash",
                "damageType": "slashing",
                "power": true
            }
        ]
    },
    "Cleaver": {
        "handedness": "1H",
        "weight": 0,
        "value": 1000,
        "rarity": 1,
        "adjustDurability": 0,
        "damage": {
            "oneHanded": "d6"
        },
        "allowedMaterials": [
            "Steel",
            "Stainless Steel",
            "Ceramic",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            }
        ]
    },
    "Crowbar": {
        "handedness": "1.5H",
        "weight": 2,
        "value": 2000,
        "rarity": 1,
        "adjustDurability": 2,
        "damage": {
            "oneHanded": "d8",
            "twoHanded": "d10"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Iron",
            "Steel",
            "Stainless Steel",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            }
        ]
    },
    "Shovel": {
        "handedness": "2H",
        "weight": 2,
        "value": 2500,
        "rarity": 1,
        "adjustDurability": -1,
        "damage": {
            "twoHanded": "d10"
        },
        "allowedMaterials": [
            "Rusty Iron",
            "Iron",
            "Steel",
            "Stainless Steel",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Bludgeon",
                "damageType": "bludgeoning",
                "power": false
            },
            {
                "name": "Smash",
                "damageType": "bludgeoning",
                "power": true
            }
        ]
    },
    "Chainsaw": {
        "handedness": "2H",
        "weight": 3,
        "value": 10000,
        "rarity": 1,
        "adjustDurability": -2,
        "damage": {
            "twoHanded": "1dnull"
        },
        "allowedMaterials": []
    },
    "Bayonet": {
        "handedness": "2H",
        "weight": 0,
        "value": 7000,
        "rarity": 2,
        "adjustDurability": 0,
        "damage": {
            "twoHanded": "d10"
        },
        "allowedMaterials": [
            "Steel",
            "Rusty Steel",
            "Stainless Steel",
            "Iron",
            "Rusty Iron"
        ],
        "attackActions": [
            {
                "name": "Stab",
                "damageType": "piercing",
                "power": false
            },
            {
                "name": "Impale",
                "damageType": "piercing",
                "power": true
            }
        ]
    },
    "Machete": {
        "handedness": "1.5H",
        "weight": 1,
        "value": 4000,
        "rarity": 1,
        "adjustDurability": -1,
        "damage": {
            "oneHanded": "d6",
            "twoHanded": "d8"
        },
        "allowedMaterials": [
            "Steel",
            "Carbon Steel",
            "Stainless Steel",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Slash",
                "damageType": "slashing",
                "power": false
            }
        ]
    },
    "Knuckleduster": {
        "handedness": "1H",
        "weight": 0,
        "value": 2400,
        "rarity": 1,
        "adjustDurability": -2,
        "damage": {
            "oneHanded": "d6"
        },
        "allowedMaterials": [
            "Steel",
            "Stainless Steel",
            "Brass",
            "Rusty Steel",
            "Ballistic"
        ],
        "attackActions": [
            {
                "name": "Punch",
                "damageType": "bludgeoning",
                "power": false
            }
        ]
    },
    "Spiked Knuckleduster": {
        "handedness": "1H",
        "weight": 0,
        "value": 3200,
        "rarity": 2,
        "adjustDurability": -3,
        "damage": {
            "oneHanded": "d8"
        },
        "allowedMaterials": [
            "Steel",
            "Stainless Steel",
            "Brass",
            "Rusty Steel"
        ],
        "attackActions": [
            {
                "name": "Punch",
                "damageType": "piercing",
                "power": false
            }
        ]
    }
}

NEWERA.rangedWeaponTypes = {
    "Pistol": {
        "handedness": "1H",
        "weight": 1,
        "value": 20000,
        "rarity": 1,
        "reliability": 12,
        "range": {
            "effective": 150,
            "maximum": 300
        },
        "damage": "1d4",
        "shotgunDamage": false,
        "magazine": true,
        "ammo": {
            "itemName": "Small Firearm Ammunition",
            "clipSize": 12
        },
        "firingAction": "SA",
        "licenseLevel": 1
    },
    "Revolver": {
        "handedness": "1H",
        "weight": 1,
        "value": 16000,
        "rarity": 1,
        "reliability": 19,
        "range": {
            "effective": 120,
            "maximum": 240
        },
        "damage": "1d4",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Small Firearm Ammunition",
            "clipSize": 6
        },
        "firingAction": "M",
        "licenseLevel": 1
    },
    "Magnum Pistol": {
        "handedness": "1H",
        "weight": 1,
        "value": 28000,
        "rarity": 1,
        "reliability": 10,
        "range": {
            "effective": 100,
            "maximum": 200
        },
        "damage": "1d6",
        "shotgunDamage": false,
        "magazine": true,
        "ammo": {
            "itemName": "Medium Firearm Ammunition",
            "clipSize": 8
        },
        "firingAction": "SA",
        "licenseLevel": 1
    },
    "Magnum Revolver": {
        "handedness": "1H",
        "weight": 1,
        "value": 32000,
        "rarity": 1,
        "reliability": 18,
        "range": {
            "effective": 160,
            "maximum": 320
        },
        "damage": "1d6",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Medium Firearm Ammunition",
            "clipSize": 6
        },
        "firingAction": "M",
        "licenseLevel": 1
    },
    "Snubnose Revolver": {
        "handedness": "1H",
        "weight": 0,
        "value": 20000,
        "rarity": 2,
        "reliability": 16,
        "range": {
            "effective": 80,
            "maximum": 160
        },
        "damage": "1d4",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Small Firearm Ammunition",
            "clipSize": 5
        },
        "firingAction": "M",
        "licenseLevel": 1
    },
    "Sport Shotgun": {
        "handedness": "2H",
        "weight": 3,
        "value": 40000,
        "rarity": 1,
        "reliability": 14,
        "range": {
            "increment": 8,
            "falloff": 1
        },
        "damage": "1d10",
        "shotgunDamage": true,
        "magazine": false,
        "ammo": {
            "itemName": "Shotgun Shell",
            "clipSize": 3
        },
        "firingAction": "M",
        "licenseLevel": 1
    },
    "Pump Shotgun": {
        "handedness": "2H",
        "weight": 3,
        "value": 50000,
        "rarity": 1,
        "reliability": 15,
        "range": {
            "increment": 10,
            "falloff": 1
        },
        "damage": "1d12",
        "shotgunDamage": true,
        "magazine": false,
        "ammo": {
            "itemName": "Shotgun Shell",
            "clipSize": 6
        },
        "firingAction": "M",
        "licenseLevel": 2
    },
    "Auto Shotgun": {
        "handedness": "2H",
        "weight": 3,
        "value": 65000,
        "rarity": 2,
        "reliability": 8,
        "range": {
            "increment": 10,
            "falloff": 1
        },
        "damage": "1d10",
        "shotgunDamage": true,
        "magazine": false,
        "ammo": {
            "itemName": "Shotgun Shell",
            "clipSize": 8
        },
        "firingAction": "SA",
        "licenseLevel": 2
    },
    "Combat Shotgun": {
        "handedness": "2H",
        "weight": 2,
        "value": 80000,
        "rarity": 2,
        "reliability": 15,
        "range": {
            "increment": 12,
            "falloff": 1
        },
        "damage": "1d12",
        "shotgunDamage": true,
        "magazine": false,
        "ammo": {
            "itemName": "Shotgun Shell",
            "clipSize": 6
        },
        "firingAction": "SA",
        "licenseLevel": 3
    },
    "Long Rifle": {
        "handedness": "2H",
        "weight": 2,
        "value": 34000,
        "rarity": 1,
        "reliability": 14,
        "range": {
            "effective": 800,
            "maximum": 1600
        },
        "damage": "1d8",
        "shotgunDamage": false,
        "magazine": true,
        "ammo": {
            "itemName": "Medium Firearm Ammunition",
            "clipSize": 10
        },
        "firingAction": "SA",
        "licenseLevel": 1
    },
    "Hunting Rifle": {
        "handedness": "2H",
        "weight": 3,
        "value": 70000,
        "rarity": 1,
        "reliability": 15,
        "range": {
            "effective": 1200,
            "maximum": 2400
        },
        "damage": "1d12",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Large Firearm Ammunition",
            "clipSize": 4
        },
        "firingAction": "M",
        "licenseLevel": 2
    },
    "Sniper Rifle": {
        "handedness": "2H",
        "weight": 4,
        "value": 100000,
        "rarity": 3,
        "reliability": 18,
        "range": {
            "effective": 3000,
            "maximum": 6000
        },
        "damage": "1d12",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Large Firearm Ammunition",
            "clipSize": 1
        },
        "firingAction": "M",
        "licenseLevel": 3
    },
    "Machine Pistol": {
        "handedness": "1H",
        "weight": 1,
        "value": 44000,
        "rarity": 2,
        "reliability": 6,
        "range": {
            "effective": 100,
            "maximum": 200
        },
        "damage": "1d4",
        "shotgunDamage": false,
        "magazine": true,
        "ammo": {
            "itemName": "Small Firearm Ammunition",
            "clipSize": 20
        },
        "firingAction": "FA",
        "firingRate": 4,
        "licenseLevel": 3
    },
    "Submachine Gun": {
        "handedness": "2H",
        "weight": 2,
        "value": 80000,
        "rarity": 2,
        "reliability": 12,
        "range": {
            "effective": 300,
            "maximum": 600
        },
        "damage": "1d6",
        "shotgunDamage": false,
        "magazine": true,
        "ammo": {
            "itemName": "Medium Firearm Ammunition",
            "clipSize": 30
        },
        "firingAction": "FA",
        "firingRate": 4,
        "licenseLevel": 3
    },
    "Assault Rifle": {
        "handedness": "2H",
        "weight": 3,
        "value": 125000,
        "rarity": 3,
        "reliability": 15,
        "range": {
            "effective": 800,
            "maximum": 1600
        },
        "damage": "1d8",
        "shotgunDamage": false,
        "magazine": true,
        "ammo": {
            "itemName": "Medium Firearm Ammunition",
            "clipSize": 30
        },
        "firingAction": "FA",
        "firingRate": 2,
        "licenseLevel": 3
    },
    "Long Bow": {
        "handedness": "2H",
        "weight": 2,
        "value": 3000,
        "rarity": 1,
        "reliability": 16,
        "range": {
            "quickFire": 100,
            "effective": 200,
            "maximum": 400
        },
        "damage": "1d8",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Arrow",
            "clipSize": 1
        },
        "firingAction": "B",
        "licenseLevel": 0
    },
    "Recurve Bow": {
        "handedness": "2H",
        "weight": 2,
        "value": 10000,
        "rarity": 1,
        "reliability": 18,
        "range": {
            "quickFire": 150,
            "effective": 300,
            "maximum": 600
        },
        "damage": "1d10",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Arrow",
            "clipSize": 1
        },
        "firingAction": "B",
        "licenseLevel": 0
    },
    "Compound Bow": {
        "handedness": "2H",
        "weight": 3,
        "value": 35000,
        "rarity": 2,
        "reliability": 19,
        "range": {
            "quickFire": 120,
            "effective": 250,
            "maximum": 500
        },
        "damage": "1d12",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Arrow",
            "clipSize": 1
        },
        "firingAction": "B",
        "licenseLevel": 0
    },
    "Slingshot": {
        "handedness": "2H",
        "weight": 0,
        "value": 1000,
        "rarity": 1,
        "reliability": 10,
        "effectiveRange": 30,
        "damage": "1",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Stone",
            "clipSize": 1
        },
        "firingAction": "B",
        "licenseLevel": 0
    },
    "Blowgun": {
        "handedness": "2H",
        "weight": 2,
        "value": 5000,
        "rarity": 2,
        "reliability": 20,
        "range": {
            "effective": 60,
            "maximum": 120
        },
        "damage": "1d4",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Blowdart",
            "clipSize": 1
        },
        "firingAction": "M",
        "licenseLevel": 0
    },
    "Short Blowgun": {
        "handedness": "1H",
        "weight": 1,
        "value": 2000,
        "rarity": 2,
        "reliability": 20,
        "range": {
            "effective": 30,
            "maximum": 60
        },
        "damage": "1",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Blowdart",
            "clipSize": 1
        },
        "firingAction": "M",
        "licenseLevel": 0
    },
    "Crossbow": {
        "handedness": "2H",
        "weight": 2,
        "value": 24000,
        "rarity": 1,
        "reliability": 17,
        "range": {
            "effective": 200,
            "maximum": 400
        },
        "damage": "1d10",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Arrow",
            "clipSize": 1
        },
        "firingAction": "M",
        "licenseLevel": 2
    },
    "Compound Crossbow": {
        "handedness": "2H",
        "weight": 2,
        "value": 60000,
        "rarity": 2,
        "reliability": 19,
        "range": {
            "effective": 400,
            "maximum": 800
        },
        "damage": "1d12",
        "shotgunDamage": false,
        "magazine": false,
        "ammo": {
            "itemName": "Arrow",
            "clipSize": 1
        },
        "firingAction": "M",
        "licenseLevel": 2
    },
    "Light Machine Gun": {
        "handedness": "2H",
        "weight": 5,
        "value": 240000,
        "rarity": 3,
        "reliability": 16,
        "range": {
            "effective": 1000,
            "maximum": 2000
        },
        "damage": "1d10",
        "shotgunDamage": false,
        "magazine": true,
        "ammo": {
            "itemName": "Medium Firearm Ammunition",
            "clipSize": 30
        },
        "firingAction": "FA",
        "firingRate": 3,
        "licenseLevel": 3
    },
}

NEWERA.armorTypes = {
    "Full Body": {
        "defaultName": "Body Armor",
        "weight": 6,
        "adjustDurability": 1,
        "armorRating": 5,
        "value": 40000,
        "rarity": 3,
        "allowedMaterials": [
            "Rusty Iron",
            "Rusty Steel",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Leather",
            "Rubber",
            "Stainless Steel",
            "Ballistic",
            "Ceramic",
            "Ætherite",
            "Nocturnum"
        ]
    },
    "Head": {
        "defaultName": "Helmet",
        "weight": 2,
        "adjustDurability": 0,
        "armorRating": 6,
        "value": 5000,
        "rarity": 1,
        "allowedMaterials": [
            "Rusty Iron",
            "Rusty Steel",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Leather",
            "Acrylic",
            "Stainless Steel",
            "Ballistic",
            "Nocturnum"
        ]
    },
    "Face": {
        "defaultName": "Visor",
        "weight": 1,
        "adjustDurability": -3,
        "armorRating": 3,
        "value": 800,
        "rarity": 1,
        "allowedMaterials": [
            "Rusty Iron",
            "Rusty Steel",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Acrylic"
        ]
    },
    "Hands": {
        "defaultName": "Gloves",
        "weight": 2,
        "adjustDurability": 0,
        "armorRating": 6,
        "value": 4000,
        "rarity": 1,
        "allowedMaterials": [
            "Rusty Iron",
            "Rusty Steel",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Leather",
            "Rubber",
            "Stainless Steel",
            "Nylon"
        ]
    },
    "Feet": {
        "defaultName": "Boots",
        "weight": 2,
        "adjustDurability": 2,
        "armorRating": 6,
        "value": 4000,
        "rarity": 1,
        "allowedMaterials": [
            "Rusty Iron",
            "Rusty Steel",
            "Tarnished Bronze",
            "Iron",
            "Bronze",
            "Steel",
            "Leather",
            "Rubber",
            "Stainless Steel"
        ]
    },
    "Eyes": {
        "defaultName": "Goggles",
        "weight": 0,
        "adjustDurability": -2,
        "armorRating": 3,
        "value": 700,
        "rarity": 1,
        "allowedMaterials": [
            "Acrylic"
        ]
    },
    "Chest": {
        "defaultName": "Vest",
        "weight": 3,
        "adjustDurability": 0,
        "armorRating": 5,
        "value": 15000,
        "rarity": 1,
        "allowedMaterials": [
            "Lead",
            "Leather",
            "Nylon",
            "Ballistic",
            "Ceramic"
        ]
    }
}

NEWERA.shieldTypes = {
    "Kite Shield": {
        "weight": 1,
        "adjustDurability": -2,
        "shieldRating": 10,
        "value": 1000,
        "rarity": 2,
        "allowedMaterials": [
            "Wooden",
            "Rusty Iron",
            "Tarnished Bronze",
            "Rusty Steel",
            "Iron",
            "Bronze",
            "Steel",
            "Acrylic",
            "Stainless Steel",
            "Ballistic",
            "Nocturnum"
        ]
    },
    "Cavalry Shield": {
        "weight": 2,
        "adjustDurability": 0,
        "shieldRating": 15,
        "value": 3000,
        "rarity": 1,
        "allowedMaterials": [
            "Wooden",
            "Rusty Iron",
            "Tarnished Bronze",
            "Rusty Steel",
            "Iron",
            "Bronze",
            "Steel",
            "Acrylic",
            "Stainless Steel",
            "Ballistic",
            "Ceramic",
            "Nocturnum"
        ]
    },
    "Body Shield": {
        "weight": 3,
        "adjustDurability": 3,
        "shieldRating": 22,
        "value": 6500,
        "rarity": 1,
        "allowedMaterials": [
            "Wooden",
            "Rusty Iron",
            "Tarnished Bronze",
            "Rusty Steel",
            "Iron",
            "Bronze",
            "Steel",
            "Acrylic",
            "Stainless Steel",
            "Ballistic",
            "Ceramic",
            "Nocturnum"
        ]
    },
    "Targe": {
        "weight": 2,
        "adjustDurability": 0,
        "shieldRating": 12,
        "value": 4000,
        "rarity": 2,
        "allowedMaterials": [
            "Wooden",
            "Rusty Iron",
            "Tarnished Bronze",
            "Rusty Steel",
            "Iron",
            "Bronze",
            "Steel",
            "Nocturnum"
        ]
    }
}

NEWERA.classes = {
    "Adventurer": {
        "description": "<p>Want to level up, but not ready to choose a class? You can gain Classless levels in the meantime. The Adventurer is mRPG 3.0's default class with a basic table of abilities.</p><p>Any character can choose to level up in Classless at any point.</p>",
        "hitPointIncrement": {
            "roll": "1d8",
            "average": 5
        },
        "naturalSkills": {
            "choose": 1,
            "choices": [],
        },
        "magicTraining": {
            "points": 0,
            "schools": []
        }
    },
    "Delver": {
        "description": "<p>The Delver is an agile explorer and powerful offensive spellcaster. They are the masters of  Elemental Magic, with a strong attunement to the forces of nature and a high level of  magical energy.</p><p>In the Torchlight Society, Delvers are responsible for venturing into the perilous ancient ruin sites in search of valuable treasures and artifacts for research. They are trained in self-defense and know how to navigate dangerous areas.</p><p>While they are very powerful spellcasters, Delvers generally don't concern themselves with the theoretical aspects of magic, as long as they can use it to get what they're after. Some can become so well attuned with the elements that they can evoke certain elemental powers without casting a complete spell- a power known as Elemental Channeling.</p>",
        "hitPointIncrement": {
            "roll": 8,
            "average": 5
        },
        "naturalSkills": {
            "choose": 2,
            "choices": [
                "agility",
                "athletics",
                "perception",
                "stealth",
                "instinct",
                "sleight-of-hand",
                "elemental-magic"
            ]
        },
        "magicTraining": {
            "points": 3,
            "schools": [
                "elemental-magic",
                "banishment"
            ]
        },
        "archetypes": {
            "fire": "Path of Fire",
            "water": "Path of Water",
            "earth": "Path of Earth",
            "wind": "Path of Wind",
        }
    },
    "Mercenary": {
        "description": "<p>A Mercenary is a soldier-for-hire. They are undisputed masters of combat, using a variety of weapons and fighting techniques.</p><p>The Torchlight Society trains mercenaries as protectors for those exploring dangerous ancient ruins. There, they are usually the muscles of the adventuring party, and the ones responsible for protecting their companions from the many dangers that lurk in the ruins.</p><p>Mercenaries fight mainly with conventional melee weapons, though they do receive basic training in defensive spells.</p>",
        "hitPointIncrement": {
            "roll": 12,
            "average": 7
        },
        "naturalSkills": {
            "choose": 3,
            "choices": [
                "defense",
                "two-handed",
                "athletics",
                "one-handed",
                "intimidation",
                "instinct",
                "endurance",
                "determination"
            ],
        },
        "magicTraining": {
            "points": 2,
            "schools": [
                "physiomancy",
                "lithomancy",
                "abjuration"
            ]
        },
        "archetypes": {
            "raider": "Raider",
            "enforcer": "Enforcer",
            "woodsman": "Woodsman",
            "warrior": "Warrior"
        }
    },
    "Ranger": {
        "description": "<p>Rangers are top-notch survivalists. The Aetherian wilderness is an unforgiving landscape with wet summers and dangerously cold winters, so those looking to explore off the beaten path must be ready to survive in the most extreme conditions. The Ranger is an excellent marksman, hunter, and agile explorer.</p><p>As employees of the Torchlight Society, Rangers are often stationed in towns near dangerous ancient ruins or at remote posts outside the ruins themselves, to guard against unauthorized entry. Many have backgrounds in the local military.</p>",
        "hitPointIncrement": {
            "roll": 8,
            "average": 5
        },
        "naturalSkills": {
            "choose": 3,
            "choices": [
                "instinct",
                "agility",
                "marksmanship",
                "perception",
                "medicine",
                "technology",
                "two-handed",
                "endurance"
            ],
        },
        "magicTraining": {
            "points": 2,
            "schools": [
                "physiomancy",
                "conjuration",
                "divination",
                "pyromancy"
            ]
        },
        "archetypes": {
            "mountaineer": "Mountaineer",
            "polar": "Polar Explorer",
            "desert": "Desert Explorer",
            "rainforest": "Rainforest Explorer",
            "hiker": "Hiker",
            "diver": "Diver",
            "spelunker": "Spelunker",
            "urbex": "Urban Explorer"
        }
    },
    "Researcher": {
        "description": "<p>The Researcher is a focused spellcaster. They devote their studies to a single school of magic, with the goal of learning and refining its many spells and enchantments and looking for ways to use their magic to advance society.</p><p>The role of a Researcher in an adventuring party is highly variable depending on the school of magic they focus on. Those with an  Elemental focus are more suited to combat encounters, while those looking to fill a social role might choose  Hypnotism to get what they need or  Divination to see through falsehoods. Researchers looking for a more utilitarian approach might consider  Physiomancy for its many practical uses, and a researcher of  Restoration can be an effective healer.</p><p>Advanced Researchers can begin to scribe entirely new spells of their own creation.</p>",
        "hitPointIncrement": {
            "roll": 6,
            "average": 4
        },
        "naturalSkills": {
            "choose": 2,
            "choices": [
                "insight",
                "determination",
                "logic",
                "diplomacy",
                "marksmanship"
            ],
        },
        "magicTraining": {
            "points": 4,
            "schools": [
                "elemental-magic",
                "divine-magic",
                "physical-magic",
                "psionic-magic",
                "spectral-magic",
                "temporal-magic"
            ]
        },
        archetypes: {pyromancy: "Pyromancer", cryomancy: "Cryomancer", lithomancy: "Lithomancer", evocation: "Evoker", restoration: "Healer", abjuration: "Abjurer", banishment: "Banisher", physiomancy: "Physiomancer", conjuration: "Conjurer", transmutation: "Transmuter", illusion: "Illusionist", hypnotism: "Hypnotist", divination: "Diviner", sangromancy: "Sangromancer", summoning: "Summoner", necromancy: "Necromancer", apparition: "Apparator", chronomancy: "Chronomancer"}
    },
    "Chanter": {
        "description": "<p>The Chanter is a spellcaster whose magical energy expresses itself more verbally than somatically. This somewhat uncommon ability gives the Chanter access to an aspect of magic that most mages are unable to tap into.</p><p>Chanters are able to compose and use a variety of special verbal spells called Chants. These can have effects on the minds and bodies of their teammates, and their enemies.</p>",
        "hitPointIncrement": {
            "roll": 6,
            "average": 4
        },
        "naturalSkills": {
            "choose": 3,
            "choices": [
                "diplomacy",
                "insight",
                "performance",
                "deception",
                "intimidation",
                "determination",
                "logic",
                "psionic-magic"
            ],
        },
        "magicTraining": {
            "points": 3,
            "schools": [
                "restoration",
                "illusion",
                "hypnotism"
            ]
        }
    },
    "Magus": {
        "description": "<p>The Magus is a fearsome fighter who combines the power of magic with weaponry. As masters of both martial and magical arts, they specialize in fine-tuning their arsenal of weapons with enchantments to be as effective as possible against any foe they might encounter.</p><p>To a Magus, the simplest solution to a problem is usually the best. They're not as concerned with the intricacies or theory of magic as they are maximizing their power. They work well with the  Scholar and  Artificer who can contribute their vast knowledge of magical theory to the Magus's pursuit of the most effective enchantments.</p>",
        "hitPointIncrement": {
            "roll": 10,
            "average": 6
        },
        "naturalSkills": {
            "choose": 3,
            "choices": [
                "one-handed",
                "two-handed",
                "insight",
                "intimidation",
                "technology",
                "defense",
                "reflex",
                "elemental-magic"
            ],
        },
        "magicTraining": {
            "points": 4,
            "schools": [
                "elemental-magic",
                "banishment",
                "sangromancy"
            ],
            "enchantmentSchools": [
                "elemental-magic",
                "banishment",
                "physiomancy",
                "illusion",
                "sangromancy"
            ]
        }
    },
    "Guardian": {
        "description": "<p>Guardians are highly trained, disciplined magical fighters. They specialize in defensive combat magic, using  Abjuration and other protective magic to drive enemies back. They fight with a combination of martial arts and spells.</p><p>For a guardian, the safety of their allies is their top priority. In the Torchlight Society, Guardians accompany adventuring parties into ruins to keep them safe using their powerful defensive magic.</p>",
        "hitPointIncrement": {
            "roll": 12,
            "average": 7
        },
        "naturalSkills": {
            "choose": 3,
            "choices": [
                "athletics",
                "defense",
                "agility",
                "endurance",
                "reflex",
                "determination",
                "divine-magic"
            ],
        },
        "magicTraining": {
            "points": 3,
            "schools": [
                "divine-magic",
                "conjuration",
                "divination"
            ]
        }
    },
    "Investigator": {
        "description": "<p>The Investigator is an intellectual and highly-skilled explorer. They solve the toughest mysteries using a mixture of magic, martial skills, and modern technology.</p><p>Investigators in the Torchlight Society work as special agents, investigating magical crimes and working undercover to keep a close eye on Rogue mages. They train in  Hypnotism to modify the memories of anyone who suspects them, or who simply knows too much. Some also work as paranormal investigators, researching reported hauntings and other anomalous activity while telling a convincing story to the general populace.</p><p>With a wide array of martial skills, investigators are opportunistic and quick. They prefer to get what they need covertly, either by stealth or by simply blending into their surroundings.</p>",
        "hitPointIncrement": {
            "roll": 4,
            "average": 3
        },
        "naturalSkills": {
            "choose": 4,
            "choices": [
                "agility",
                "one-handed",
                "diplomacy",
                "logic",
                "deception",
                "stealth",
                "sleight-of-hand",
                "perception",
                "insight",
                "technology"
            ],
        },
        "magicTraining": {
            "points": 3,
            "schools": [
                "psionic-magic",
                "physiomancy",
                "apparition"
            ]
        },
        "archetypes": {
            "marauder": "Marauder",
            "spy": "Spy",
            "assassin": "Assassin"
        }
    },
    "Scholar": {
        "description": "<p>Scholars are the world's top magical minds. In their careers, they learn a wide variety of spells, enchantments, and complex rituals.</p><p>Unlike  Researchers, who dive deeply into the secrets of a single school of magic, Scholars take a more generalist approach to the mysterious art. They believe that true mastery of magic requires a diverse understanding of all of its forms, and that they must be used in conjunction with one another in order for mankind to achieve the most value from them.</p><p>Scholars prepare themselves to cast specific spells each day by meditating and focusing on the spells they</p>",
        "hitPointIncrement": {
            "roll": 4,
            "average": 3
        },
        "naturalSkills": {
            "choose": 2,
            "choices": [
                "logic",
                "insight",
                "diplomacy",
                "elemental-magic",
                "divine-magic",
                "physical-magic",
                "psionic-magic",
                "spectral-magic",
                "temporal-magic"
            ],
        },
        "magicTraining": {
            "points": 5,
            "schools": [
                "elemental-magic",
                "divine-magic",
                "physical-magic",
                "psionic-magic",
                "spectral-magic",
                "temporal-magic"
            ]
        }
    },
    "Artificer": {
        "description": "<p>Artificers are masters of invention. Their studies deal with  metamagic, the &quot;seventh form&quot; of magic that consists of the intricacies of magical theory and the building blocks by which all other spells are formed. Using this knowledge they can create complex magical artifacts to solve almost any problem.</p><p>To an Artificer, nothing is more fascinating than uncovering the secrets of magic and how it relates to modern science. In the Torchlight Society, artificers study both complex enchantments and alchemy. They are constantly working on the idea for their next great creation.</p>",
        "hitPointIncrement": {
            "roll": 8,
            "average": 5
        },
        "naturalSkills": {
            "choose": 1,
            "choices": [
                "technology",
                "medicine",
                "logic",
                "perception",
                "instinct",
                "reflex",
                "sleight-of-hand"
            ],
        },
        "magicTraining": {
            "points": 4,
            "schools": [
                "physical-magic",
                "pyromancy",
                "cryomancy",
                "illusion"
            ],
            "enchantmentSchools": [
                "elemental-magic",
                "divine-magic",
                "physical-magic",
                "psionic-magic",
                "spectral-magic",
                "temporal-magic",
                "metamagic"
            ]
        }
    },
    "Sage": {
        "description": "<p>Sages are mysterious spellcasters that have a deep connection to the world of good and evil spirits. They practice magic that heals and repels evil, both through conventional spells and the practice of Alchemy. They are excellent  Diviners and can use their connections to other planes to communicate across great distances.</p><p>Sages are practicioners of Soulbonding, a rare form of advanced magic that allows them to induce magical effects on those they have a strong relationship with. In the Torchlight Society they use this magic along with their alchemy and fortune telling abilities to act as healers and protectors.</p>",
        "hitPointIncrement": {
            "roll": 6,
            "average": 4
        },
        "naturalSkills": {
            "choose": 3,
            "choices": [
                "medicine",
                "insight",
                "diplomacy",
                "technology",
                "deception",
                "determination",
                "divine-magic",
                "psionic-magic"
            ],
        },
        "magicTraining": {
            "points": 3,
            "schools": [
                "restoration",
                "banishment",
                "illusion",
                "divination",
                "summoning"
            ]
        }
    },
    "Witch": {
        "description": "<p>The Witch studies magic on the very bleeding edge of modern knowledge. Using a mysterious connection with other planes of existence, they gain the ability to summon and command ghostly companions known as Familiars. Each Familiar is different and unique to the Witch who summons it, and they act as both a focus for their magic and as an adventuring companion.</p><p>Witches are specialists in  spectral magic, a form which is generally frowned upon by other mages such as those in the Torchlight Society. As a result, they often become social outcasts and tend to associate with others of their own discipline.</p>",
        "hitPointIncrement": {
            "roll": 6,
            "average": 4
        },
        "naturalSkills": {
            "choose": 3,
            "choices": [
                "insight",
                "instinct",
                "logic",
                "performance",
                "medicine",
                "spectral-magic"
            ],
        },
        "magicTraining": {
            "points": 4,
            "schools": [
                "spectral-magic",
                "evocation",
                "transmutation",
                "illusion"
            ]
        },
        "archetypes": {
            "raven": "Raven Familiar",
            "snake": "Snake Familiar",
            "owl": "Owl Familiar",
            "cat": "Cat Familiar",
            "wolf": "Wolf Familiar",
            "bear": "Bear Familiar",
            "spider": "Spider Familiar",
            "hawk": "Hawk Familiar"
        }
    }
}

NEWERA.damageTypes = {
    default: {
        ignoreNatural: false,
        ignoreEquipped: false,
        label: ""
    },
    bludgeoning: {
        ignoreNatural: false,
        ignoreEquipped: false,
        label: "Bludgeoning"
    },
    piercing: {
        ignoreNatural: false,
        ignoreEquipped: false,
        label: "Piercing"
    },
    slashing: {
        ignoreNatural: false,
        ignoreEquipped: false,
        label: "Slashing"
    },
    burning: {
        ignoreNatural: false,
        ignoreEquipped: false,
        label: "Burning"
    },
    freezing: {
        ignoreNatural: true,
        ignoreEquipped: false,
        label: "Freezing"
    },
    shock: {
        ignoreNatural: true,
        ignoreEquipped: false,
        label: "Shock"
    },
    psychic: {
        ignoreNatural: true,
        ignoreEquipped: true,
        label: "Mental"
    },
    necrotic: {
        ignoreNatural: true, 
        ignoreEquipped: true,
        label: "Necrotic"
    },
    poison: {
        ignoreNatural: false,
        ignoreEquipped: true,
        label: "Poison"
    },
    suffocation: {
        ignoreNatural: true,
        ignoreEquipped: true,
        label: "Suffocation"
    },
    exhaustion: {
        ignoreNatural: true,
        ignoreEquipped: true,
        label: "Magical Exhaustion"
    }
}

NEWERA.pcGeneralActions = [
    {
        name: "Run",
        images: {
            base: `${NEWERA.images}/ac_movement.png`
        },
        ability: null,
        skill: null,
        specialties: [],
        description: "You move up to your Speed.",
        difficulty: 0,
        actionType: "M",
        displayCallback: (actor) => {
            return !actor.hasStatusEffect("unconscious") && !actor.hasStatusEffect("prone");
        },
        rolls: []
    },
    {
        name: "Sprint",
        images: {
            base: `${NEWERA.images}/run.png`,
            right: `${NEWERA.images}/ac_movement.png`
        },
        ability: null,
        skill: "athletics",
        specialties: ["Sprinting"],
        description: "Double your movement speed for one frame. You can attempt to sprint once per turn.",
        difficulty: "The GM sets the difficulty depending on circumstances, such as the terrain and weather conditions.",
        actionType: "movement",
        rolls: [
          {
            label: "Sprint",
            caption: "Sprint (Athletics)",
            die: "d20",
            formula: "1d20+@skills.athletics.mod+@specialty.partial.sprinting",
            message: "{NAME} sprints!",
            difficulty: null,
          }
        ]
    },
    {
        name: "Stand Up",
        images: {
            base: `${NEWERA.images}/equipment-body.png`,
            right: `${NEWERA.images}/ac_1frame.png`
        },
        ability: null,
        skill: null,
        specialties: [],
        description: "While Prone, you stand up.",
        difficulty: 0,
        actionType: "1",
        rolls: []
    },
    {
        name: "Jump",
        images: {
            base: `${NEWERA.images}/jump1.png`,
            right: `${NEWERA.images}/ac_1frame.png`
        },
        ability: null,
        skill: "athletics",
        specialties: ["Long Jump", "High Jump", "Jumping"],
        description: "You jump across a large gap or a great height. You can jump up to 2 feet in height and up to your speed minus your size modifier in distance. For longer or higher jumps, a check is required.",
        difficulty: "The GM sets the difficulty depending on the jump distance and environmental conditions.",
        actionType: "1",
        rolls: [
            {
                label: "Long",
                caption: "Long Jump (Athletics)",
                die: "d20",
                formula: "1d20+@skills.athletics.mod+@specialty.partial.jumping+@specialty.partial.long_jump",
                difficulty: null,
            },
            {
                label: "High",
                caption: "High Jump (Athletics)",
                die: "d20",
                formula: "1d20+@skills.athletics.mod+@specialty.partial.jumping+@specialty.partial.high_jump",
                difficulty: 20,
            }
        ]
    },
    {
        name: "Dodge",
        images: {
            base: `${NEWERA.images}/body-balance.png`,
            right: `${NEWERA.images}/ac_reaction.png`
        },
        ability: null,
        skill: "agility",
        specialties: ["Dodging"],
        description: "You try to avoid an incoming attack. Optionally, you may move 2 feet in any direction.",
        difficulty: "The result of your roll replaces your Passive Agility when contesting the attacker's roll.",
        actionType: "R",
        rolls: [
            {
                label: "Dodge",
                caption: "Dodge (Agility)",
                die: "d20",
                formula: "1d20+@skills.agility.mod+@specialty.partial.jumping+@specialty.partial.dodging",
                message: "{NAME} tries to Dodge!",
                difficulty: null,
            }
        ]
    },
    {
        name: "Throw / Pass",
        images: {
            base: `${NEWERA.images}/throwing-ball.png`,
            right: `${NEWERA.images}/ac_1frame.png`
        },
        ability: null,
        skill: null,
        specialties: [],
        description: "Throw an item to a willing teammate, or as a projectile at an enemy.",
        difficulty: "No check is required to pass to an ally within 6 feet. For long distances or to target enemy creatures, the GM sets the difficulty.",
        actionType: "1",
        rolls: [
            {
                label: "Distance",
                caption: "Yeet for Distance (Athletics)",
                die: "d20",
                formula: "1d20+@skills.athletics.mod+@specialty.partial.throw_distance",
                message: "{NAME} throws an item a great distance!",
                difficulty: null,
            },
            {
                label: "Accuracy",
                caption: "Kobe for Accuracy (Marksmanship)",
                die: "d20",
                formula: "1d20+@skills.marksmanship.mod+@specialty.partial.throw_accuracy",
                message: "{NAME} throws a projectile!",
                difficulty: null,
            }
        ]
    },
    {
        name: "Escape",
        images: {
            base: `${NEWERA.images}/breaking-chain.png`,
            right: `${NEWERA.images}/ac_2frame.png`
        },
        ability: "strength",
        skill: null,
        specialties: ["Escape"],
        description: "You attempt to escape from restraints or a creature's grasp. You may use your Strength to force your way free, or Agility to slip out.",
        difficulty: "The difficulty is based on the condition and type of restraint. It may be different for one method of escape versus the other.",
        actionType: "2",
        rolls: [
            {
                label: "Strength",
                caption: "Escape (Strength)",
                die: "d20",
                formula: "1d20+@abilities.strength.mod+@specialty.partial.escape",
                difficulty: null,
            },
            {
                label: "Agility",
                caption: "Escape (Agility)",
                die: "d20",
                formula: "1d20+@skills.agility.mod+@specialty.partial.escape",
                difficulty: null,
            }
        ]
    }
];

NEWERA.generalMagicActions = [
    {
        name: "Cast a Spell",
        images: {
            base: `${NEWERA.images}/glowing-hands.png`,
        },
        ability: null,
        skill: null,
        specialties: [],
        description: "You cast a spell or enchantment that you've memorized. The time it takes to cast the spell varies depending on the type of spell.",
        difficulty: "The difficulty depends on your skill level in the spell's form of magic. Casting a spell at or below your current level doesn't require a check. For spells above your level, the difficulty is 10 for one level higher, plus 5 for each additional level.",
        altInstructions: "Cast spells and enchantments from the Magic tab.",
        actionType: "?",
        rolls: []
    },
    {
        name: "Sustain a Spell",
        images: {
            base: `${NEWERA.images}/fire-spell-cast.png`,
            right: `${NEWERA.images}/ac_1frame.png`
        },
        ability: null,
        skill: null,
        specialties: [],
        description: "You continue to concentrate on a sustained spell you're already casting. You may spend any number of frames on your turn sustaining a spell. If your turn ends without having used at least one frame to sustain a spell, the spell ends.",
        difficulty: "0",
        overrideMacroCommand: "game.newera.HotbarActions.sustainCurrentSpell()",
        actionType: "1",
        rolls: [
            {
                label: "Sustain",
                die: "fire-spell-cast",
                callback: actor => Actions.sustainCurrentSpell(actor)
            }
        ]
    },
    {
        name: "Learn a Spell",
        images: {
            base: `${NEWERA.images}/scroll-unfurled.png`,
            right: `${NEWERA.images}/ac_restful.png`
        },
        ability: "wisdom",
        skill: null,
        specialties: [],
        description: "You attempt to commit a new spell to your subconscious memory from a spell script you can read. You must first meditate to become semi-conscious. You can attempt to learn up to three spells per successful meditation session.",
        difficulty: 10,
        altInstructions: "",
        actionType: "D",
        rolls: [
            {
                label: "Meditate",
                caption: "Meditation check",
                die: "d20",
                formula: "1d20+@abilities.wisdom.mod",
                difficulty: 10
            }
        ]
    },
    {
        name: "Disenchant",
        images: {
            base: `${NEWERA.images}/shatter.png`,
            right: `${NEWERA.images}/ac_adventuring.png`
        },
        ability: null,
        skill: null,
        specialties: [],
        description: "You use your magical powers to remove an enchantment from an item. If the enchantment is complex, each component must be removed individually. Care must be taken, as removing them in the improper order might have unexpected results.",
        difficulty: "The difficulty is as though you were casting a spell one level higher than the target enchantment.",
        actionType: "E",
        rolls: [
            {
                label: "Cast",
                caption: "Disenchant Item",
                die: "d20",
                formula: "1d20+@data.casterLevel",
                difficulty: 10
            },
        ]
    },
    {
        name: "End Spell",
        images: {
            base: `${NEWERA.images}/halt-2.png`,
            right: `${NEWERA.images}/ac_0frame.png`
        },
        ability: null,
        skill: null,
        specialties: [],
        description: "You end the effects of any sustained or ephemeral spell you're casting.",
        difficulty: "0",
        overrideMacroCommand: "game.newera.HotbarActions.stopAllSpells()",
        actionType: "0",
        disallow: actor => (!actor.system.ephemeralEffectActive && !actor.system.sustaining.id) ? "You aren't casting any spells right now." : false,
        rolls: [
            {
                label: "End Spell",
                die: "halt-2",
                callback: actor => actor.stopAllSpells()
            }
        ]
    },
];

NEWERA.explorationActions = [
    {
        name: "Search the Area",
        images: {
            base: `${NEWERA.images}/binoculars.png`,
            right: `${NEWERA.images}/ac_3frame.png`
        },
        ability: null,
        skill: "perception",
        specialties: ["Searching"],
        description: "Look around the room for hard-to-find objects. This action can be performed once per player when entering a new room or area. You might suffer penalties if the room is poorly lit or if you're searching during combat.",
        difficulty: "The GM determines the perception difficulty of objects in the room and tells each player what they find.",
        actionType: "3",
        rolls: [
            {
                label: "Search",
                caption: "Perception check",
                die: "d20",
                formula: "1d20+@skills.perception.mod+@specialty.partial.searching",
                message: "{NAME} searches the area!",
                difficulty: null,
            }
        ]
    },
    {
        name: "Examine",
        images: {
            base: `${NEWERA.images}/magnifying-glass.png`,
            right: `${NEWERA.images}/ac_adventuring.png`
        },
        ability: null,
        skill: "perception",
        specialties: ["Searching"],
        description: "You closely examine an object or small area to learn about its properties or hidden features. Use Perception if you're looking for things you may not have noticed, or Logic if you're trying to learn about an object based on what you can see.",
        difficulty: "The GM determines what you learn based on the outcome of your check.",
        actionType: "E",
        rolls: [
            {
                label: "Perception",
                caption: "Examine Object (Perception)",
                die: "d20",
                formula: "1d20+@skills.perception.mod+@specialty.partial.examination",
                difficulty: null,
            },
            {
                label: "Logic",
                caption: "Examine Object (Logic)",
                die: "d20",
                formula: "1d20+@skills.logic.mod+@specialty.partial.examination",
                difficulty: null,
            }
        ]
    },
    {
        name: "Craft",
        images: {
            base: `${NEWERA.images}/crafting.png`,
            right: `${NEWERA.images}/ac_adventuring.png`
        },
        ability: null,
        skill: "technology",
        specialties: ["Crafting"],
        description: "You combine raw materials into a new item. You must have all the required materials before performing this action.",
        difficulty: "The difficulty and time taken depends on the item being crafted.",
        actionType: "E",
        rolls: [
            {
                label: "Craft",
                caption: "Crafting check",
                die: "d20",
                formula: "1d20+@skills.technology.mod+@specialty.partial.crafting",
                difficulty: null,
            }
        ]
    },
    {
        name: "Repair/Upgrade",
        images: {
            base: `${NEWERA.images}/anvil-impact.png`,
            right: `${NEWERA.images}/ac_adventuring.png`
        },
        ability: null,
        skill: "technology",
        specialties: ["Crafting", "Repair"],
        description: "You repair or upgrade an item in your inventory. You must have the appropriate raw materials.",
        difficulty: "The difficulty and time taken depends on the current condition, quality, and material of the item.",
        actionType: "E",
        rolls: [
            {
                label: "Repair",
                caption: "Crafting check - Repair",
                die: "d20",
                formula: "1d20+@skills.technology.mod+@specialty.partial.crafting+@specialty.partial.repair",
                difficulty: null,
            },
            {
                label: "Upgrade",
                caption: "Crafting check - Upgrade",
                die: "d20",
                formula: "1d20+@skills.technology.mod+@specialty.partial.crafting+@specialty.partial.refinement",
                difficulty: null,
            }
        ]
    },
    {
        name: "Cook",
        images: {
            base: `${NEWERA.images}/cooking-pot.png`,
            right: `${NEWERA.images}/ac_adventuring.png`
        },
        ability: null,
        skill: "technology",
        specialties: ["Cooking"],
        description: "You prepare a meal for yourself or your party. A well-made meal before bed increases the benefits you get from resting.",
        difficulty: null,
        actionType: "E",
        rolls: [
            {
                label: "Cook",
                caption: "Cooking",
                die: "d20",
                formula: "1d20+@skills.technology.mod+@specialty.partial.cooking",
                difficulty: null,
            }
        ]
    },
    {
        name: "Wilderness Survival",
        images: {
            base: `${NEWERA.images}/forest-camp.png`,
            right: `${NEWERA.images}/ac_adventuring.png`
        },
        ability: null,
        skill: "instinct",
        specialties: ["Navigation", "Time", "Weather"],
        description: "You use your instincts to discern one of a number of things about your environment. You can use this skill to orient yourself in the wilderness, tell how long until the next sunrise or sunset, or predict changes in the weather.",
        difficulty: "The GM sets the difficulty based on the conditions of your environment.",
        actionType: "E",
        rolls: [
            {
                label: "Navigate",
                caption: "Wilderness Survival - Navigation (Instinct)",
                die: "d20",
                formula: "1d20+@skills.instinct.mod+@specialty.partial.navigation",
                difficulty: null,
            },
            {
                label: "Time",
                caption: "Wilderness Survival - Time (Instinct)",
                die: "d20",
                formula: "1d20+@skills.instinct.mod+@specialty.partial.time",
                difficulty: null,
            },
            {
                label: "Weather",
                caption: "Wilderness Survival - Weather (Instinct)",
                die: "d20",
                formula: "1d20+@skills.instinct.mod+@specialty.partial.weather",
                difficulty: null,
            }
        ]
    },
    {
        name: "Rest for the Night",
        images: {
            base: `${NEWERA.images}/bed.png`,
            right: `${NEWERA.images}/ac_restful.png`
        },
        ability: null,
        skill: null,
        specialties: [],
        description: "You sleep for the night, regaining energy and strength. For every hour you sleep, you regain HP equal to your hit point increment plus your level, and energy equal to your caster level.",
        actionType: "D",
        overrideMacroCommand: `game.newera.HotbarActions.restForTheNight()`,
        rolls: [
            {
                label: "Sleep",
                die: "bed",
                callback: actor => Actions.restForTheNight(actor)
            }
        ]
    }
];

NEWERA.generalSocialActions = [
    {
        name: "Socialize",
        images: {
            base: `${NEWERA.images}/character.png`,
            right: `${NEWERA.images}/ac_social.png`
        },
        ability: null,
        skill: "diplomacy",
        specialties: ["Socialization"],
        description: "With a few choice words or a flattering compliment, you attempt to gain a person's favor.",
        difficulty: "Contested (Determination)",
        actionType: "S",
        rolls: [
            {
                label: "Socialize",
                caption: "First Impression (Diplomacy)",
                die: "d20",
                formula: "1d20+@skills.diplomacy.mod+@specialty.partial.socialization",
                difficulty: null,
            }
        ]
    },
    {
        name: "Persuade",
        images: {
            base: `${NEWERA.images}/conversation.png`,
            right: `${NEWERA.images}/ac_social.png`
        },
        ability: null,
        skill: "diplomacy",
        specialties: ["Persuasion"],
        description: "You attempt to persuade someone to help you with a task or give you information. People with a high relationship to you are more likely to accept.",
        difficulty: "Contested (Insight)",
        actionType: "S",
        rolls: [
            {
                label: "Persuade",
                caption: "Persuade (Diplomacy)",
                die: "d20",
                formula: "1d20+@skills.diplomacy.mod+@specialty.partial.persuasion",
                difficulty: null,
            }
        ]
    },
    {
        name: "Trade",
        images: {
            base: `${NEWERA.images}/cash.png`,
            right: `${NEWERA.images}/ac_social.png`
        },
        ability: null,
        skill: "diplomacy",
        specialties: ["Persuasion"],
        description: "You haggle with another person to buy or sell an item at a good price. Use your Diplomacy or Deception skill to make an offer, and your Wisdom to tell if an offer or counter-offer is a good deal. Not all merchants are willing to haggle.",
        difficulty: null,
        actionType: "S",
        rolls: [
            {
                label: "Offer",
                caption: "Haggle - Offer (Diplomacy)",
                die: "d20",
                formula: "1d20+@skills.diplomacy.mod+@specialty.partial.trading",
                difficulty: null,
            },
            {
                label: "Deceive",
                caption: "Haggle - Offer (Deception)",
                die: "d20",
                formula: "1d20+@skills.deception.mod+@specialty.partial.trading",
                difficulty: null,
            },
            {
                label: "Check",
                caption: "Haggle - Check Offer (Wisdom)",
                die: "d20",
                formula: "1d20+@abilities.wisdom.mod+@specialty.partial.trading",
                difficulty: null,
            }
        ]
    },
    {
        name: "Seduce",
        images: {
            base: `${NEWERA.images}/charm.png`,
            right: `${NEWERA.images}/ac_social.png`
        },
        ability: "charisma",
        skill: null,
        specialties: ["Seduction"],
        description: "You use your charm to attract someone and attempt to form a positive relationship with them.",
        difficulty: "Contested (Insight) - This action has no effect unless you're compatible with the target's romantic and sexual preferences.",
        actionType: "S",
        rolls: [
            {
                label: "Seduce",
                caption: "Seduce (Charisma)",
                die: "d20",
                formula: "1d20+@abilities.charisma.mod+@specialty.partial.seduction",
                difficulty: null,
            }
        ]
    },
    {
        name: "Deceive",
        images: {
            base: `${NEWERA.images}/fingers-crossed.png`,
            right: `${NEWERA.images}/ac_social.png`
        },
        ability: null,
        skill: "deception",
        specialties: [],
        description: "You tell a convincing lie or come up with a good story.",
        difficulty: "Contested (Insight) - Creatures with a lower relationship to you are less likely to believe you.",
        actionType: "S",
        rolls: [
            {
                label: "Lie",
                caption: "Deception check",
                die: "d20",
                formula: "1d20+@skills.deception.mod",
                difficulty: null,
            }
        ]
    },
    {
        name: "Intimidate",
        images: {
            base: `${NEWERA.images}/biceps.png`,
            right: `${NEWERA.images}/ac_social.png`
        },
        ability: null,
        skill: null,
        specialties: ["Coercion"],
        description: "You threaten a creature to get them to do what you want. You may threaten them physically using your Strength, or through blackmail using your Charisma. Using this action automatically lowers your relationship with the target, regardless of outcome.",
        difficulty: "Contested (Determination or Strength)",
        actionType: "S",
        rolls: [
            {
                label: "Charisma",
                caption: "Intimidate (Charisma)",
                die: "d20",
                formula: "1d20+@skills.intimidation.mod+@specialty.partial.coercion",
                difficulty: null,
            },
            {
                label: "Strength",
                caption: "Intimidate (Strength)",
                die: "d20",
                formula: "1d20+@skills.intimidation.mod+@specialty.partial.coercion+@abilities.strength.mod",
                difficulty: null,
            }
        ]
    }
];

NEWERA.daysOfWeek = {
    "Sunday": [1, 8, 15, 22],
    "Monday": [2, 9, 16, 23],
    "Tuesday": [3, 10, 17, 24],
    "Wednesday": [4, 11, 18, 25],
    "Thursday": [5, 12, 19, 26],
    "Friday": [6, 13, 20, 27],
    "Saturday": [7, 14, 21, 28],
    "Uransday": [29]
};

NEWERA.months = {
    1: {
        name: "January",
        twilight: 0,
        sunrise: 0,
        sunset: null,
        night: null
    },
    2: {
        name: "February",
        twilight: 0,
        sunrise: 4,
        sunset: 23,
        night: null
    },
    3: {
        name: "March",
        twilight: 0,
        sunrise: 6,
        sunset: 21,
        night: null
    },
    4: {
        name: "April",
        twilight: 6,
        sunrise: 8,
        sunset: 19,
        night: 21
    },
    5: {
        name: "May",
        twilight: 7,
        sunrise: 9,
        sunset: 17,
        night: 20
    },
    6: {
        name: "June",
        twilight: 9,
        sunrise: 11,
        sunset: 16,
        night: 18
    },
    7: {
        name: "September",
        twilight: 9,
        sunrise: null,
        sunset: null,
        night: 18
    },
    8: {
        name: "October",
        twilight: 9,
        sunrise: 12,
        sunset: 15,
        night: 18
    },
    9: {
        name: "November",
        twilight: 8,
        sunrise: 10,
        sunset: 17,
        night: 19
    },
    10: {
        name: "December",
        twilight: 6,
        sunrise: 8,
        sunset: 19,
        night: 21
    },
    11: {
        name: "Pax",
        twilight: 4,
        sunrise: 6,
        sunset: 20,
        night: 23
    },
    12: {
        name: "Manus",
        twilight: 0,
        sunrise: 4,
        sunset: 22,
        night: null
    },
    13: {
        name: "Sol",
        twilight: 0,
        sunrise: 0,
        sunset: null,
        night: null
    }
};

NEWERA.serviceDesc = {
    "none": "No Service",
    "limited": "Limited Network - Calls and Texts Only",
    "weak": "Weak Signal",
    "limitedWeak": "Weak Signal - Calls and Texts Only",
    "normal": "Connected",
    "fast": "Connected"
};

NEWERA.enchantmentAuraColors = {
    "PY": "#f76605",
    "HM": "#6bc6ff",
    "GE": "#805632",
    "EV": "#ffd900",
    "RE": "#ffd573",
    "AB": "#c2d674",
    "BA": "#fff4db",
    "MA": "#00a105",
    "TR": "#12c462",
    "CO": "#82eb02",
    "IL": "#05bff7",
    "HY": "#165af7",
    "DI": "#5722d4",
    "CN": "#8c0000",
    "SU": "#b80b50",
    "NE": "#000000",
    "AP": "#be39f7",
    "CH": "#7a04d4",
    "MM": "#888888"
};

NEWERA.skillImprovementCosts = [
    10, 15, 20, 30, 50, 75, 100, 160, 220, 300, null
];
NEWERA.skillImprovementMinLevel = [
    0, 0, 0, 0, 0, 3, 6, 10, 15, 20
];

NEWERA.statusEffects = {
    burning: {
        1: {
            id: "burning",
            name: "Burning",
            description: `<p>At the end of your turn, you take 1d6 Burning damage.</p>
            <p>Then this effect ends if you didn't take any Burning damage from other sources this turn.</p>
            `,
            img: `${NEWERA.images}/dt_burning.png`
        },
        2: {
            id: "burning",
            name: "Burning 2",
            description: `<p>At the end of your turn, you take 2d6 Burning damage.</p>
            <p>Then, if you didn't take any Burning damage from other sources this turn, your Burning status lowers to 1.</p>
            `,
            img: `${NEWERA.images}/dt_burning.png`
        },
        3: {
            id: "burning",
            name: "Burning 3",
            description: `<p>At the end of your turn, you take 3d6 Burning damage.</p>
            <p>Then, if you didn't take any Burning damage from other sources this turn, your Burning status lowers to 2.</p>
            `,
            img: `${NEWERA.images}/dt_burning.png`
        },
        4: {
            id: "burning",
            name: "Burning 4",
            description: `<p>At the end of your turn, you take 4d6 Burning damage.</p>
            <p>Then, if you didn't take any Burning damage from other sources this turn, your Burning status lowers to 3.</p>
            `,
            img: `${NEWERA.images}/dt_burning.png`
        },
        5: {
            id: "burning",
            name: "Burning 5",
            description: `<p>At the end of your turn, you take 5d6 Burning damage.</p>
            <p>Then, if you didn't take any Burning damage from other sources this turn, your Burning status lowers to 4.</p>
            `,
            img: `${NEWERA.images}/dt_burning.png`
        }
    },
    bleeding: {
        1: {
            id: "bleeding",
            name: "Bleeding",
            description: `<p>At the end of your turn, you take 1d6 Bleeding damage.</p>
            <p>Receiving first aid clears this effect. Additional sources of Bleeding cause this effect's status to increase.</p>
            `,
            img: `${NEWERA.images}/se_bleeding.png`
        },
        2: {
            id: "bleeding",
            name: "Bleeding 2",
            description: `<p>At the end of your turn, you take 2d6 Bleeding damage.</p>
            <p>Receiving first aid lowers your Bleeding status by 1. Additional sources of Bleeding cause this effect's status to increase.</p>
            `,
            img: `${NEWERA.images}/se_bleeding.png`
        },
        3: {
            id: "bleeding",
            name: "Bleeding 3",
            description: `<p>At the end of your turn, you take 3d6 Bleeding damage.</p>
            <p>Receiving first aid lowers your Bleeding status by 1. Additional sources of Bleeding cause this effect's status to increase.</p>
            `,
            img: `${NEWERA.images}/se_bleeding.png`
        },
        4: {
            id: "bleeding",
            name: "Bleeding 4",
            description: `<p>At the end of your turn, you take 4d6 Bleeding damage.</p>
            <p>Receiving first aid lowers your Bleeding status by 1. Additional sources of Bleeding cause this effect's status to increase.</p>
            `,
            img: `${NEWERA.images}/se_bleeding.png`
        },
        5: {
            id: "bleeding",
            name: "Bleeding 5",
            description: `<p>At the end of your turn, you take 5d6 Bleeding damage.</p>
            <p>Receiving first aid lowers your Bleeding status by 1. Additional sources of Bleeding cause this effect's status to increase.</p>
            `,
            img: `${NEWERA.images}/se_bleeding.png`
        }
    },
    poisoned: {
        1: {
            id: "poisoned",
            name: "Poisoned",
            description: `<p>At the end of your turn, you take 1d6 Poison damage. Then make a difficulty 15 endurance save. On a success, you are no longer Poisoned.</p>`,
            img: `${NEWERA.images}/se_poisoned.png`
        },
        2: {
            id: "poisoned",
            name: "Poisoned 2",
            description: `<p>At the end of your turn, you take 2d6 Poison damage. Then make a difficulty 15 endurance save. On a success, your Poisoned status is reduced to 1.</p>`,
            img: `${NEWERA.images}/se_poisoned.png`
        },
        3: {
            id: "poisoned",
            name: "Poisoned 3",
            description: `<p>At the end of your turn, you take 3d6 Poison damage. Then make a difficulty 15 endurance save. On a success, your Poisoned status is reduced to 2.</p>`,
            img: `${NEWERA.images}/se_poisoned.png`
        },
        4: {
            id: "poisoned",
            name: "Poisoned 4",
            description: `<p>At the end of your turn, you take 4d6 Poison damage. Then make a difficulty 15 endurance save. On a success, your Poisoned status is reduced to 3.</p>`,
            img: `${NEWERA.images}/se_poisoned.png`
        },
        5: {
            id: "poisoned",
            name: "Poisoned 5",
            description: `<p>At the end of your turn, you take 5d6 Poison damage. Then make a difficulty 15 endurance save. On a success, your Poisoned status is reduced to 4.</p>`,
            img: `${NEWERA.images}/se_poisoned.png`
        }
    },
    blinded: {
        1: {
            id: "partial-blind",
            name: "Blinded 1",
            description: `<p>You're blind in one eye, or your vision is obscured.</p><p>You take a -2 penalty to Perception checks involving sight, and a -5 penalty to Marksmanship. Your Passive Perception is reduced by 2.`,
            img: `${NEWERA.images}/se_blinded.png`
        },
        2: {
            id: "blind",
            name: "Blinded 2",
            description: `<p>You're completely blind.</p><p>You automatically fail Marksmanship and Perception checks involving your sight. Your Passive Perception is reduced by 5.</p>`,
            img: `${NEWERA.images}/se_blinded.png`
        }
    },
    deafened: {
        1: {
            id: "deaf",
            name: "Deafened 1",
            description: `<p>Your hearing is impaired.</p><p>You take a -4 penalty to Perception checks involving your hearing. Your Passive Perception is reduced by 2.</p>`,
            img: `${NEWERA.images}/se_deafened.png`,
        },
        2: {
            id: "deaf",
            name: "Deafened 2",
            description: `<p>You're completely deaf.</p><p>You automatically fail Perception checks involving your hearing. Your Passive Perception is reduced by 5.</p>`,
            img: `${NEWERA.images}/se_deafened.png`,
        }
    },
    prone: {
        1: {
            id: "prone",
            name: "Prone",
            description: `<p>Your attacks have disadvantage against creatures that aren't prone, and attacks against you have advantage. You move by Crawling at half your speed.</p><p>You may stand up from prone as an action {1}.`,
            img: `${NEWERA.images}/se_prone.png`
        }
    },
    dying: {
        1: {
            id: "dying",
            name: "Dying",
            description: `<p>You're unconscious. During each of your turns, you make a difficulty 15 Endurance save. If you succeed, you regain 1 hit point and wake up. If you fail, you lose 5 life points.</p><p>Any additional damage you take while Dying is dealt to your life points. If your life points reach zero, you die.</p>`,
            img: `${NEWERA.images}/lp-hot.png`
        }
    },
    dead: {
        1: {
            id: "dead",
            name: "Dead",
            description: `<p>You have died.</p><p>You must create a new character in order to continue playing.</p>`,
            img: `${NEWERA.images}/se_dead.png`,
        }
    },
    unconscious: {
        1: {
            id: "unconscious",
            name: "Unconscious",
            description: `<p>You're unable to act or speak, and you're unaware of your surroundings.</p><p>Your Passive Perception and Passive Agility are reduced to 0.</p>`,
            img: `${NEWERA.images}/se_unconscious.png`,
        }
    },
    incapacitated: {
        1: {
            id: "incapacitated",
            name: "Incapacitated",
            description: `</p>You're unable to declare actions. Your turn length and speed are reduced to 0, and you can't react.</p><p>You can still speak, and are aware of your surroundings.</p>`,
            img: `${NEWERA.images}/se_incapacitated.png`
        }
    },
    stunned: {
        1: {
            id: "stunned",
            name: "Stunned",
            description: `<p>You can't declare actions or reactions until the beginning of your next turn.</p>`,
            img: `${NEWERA.images}/dt_shock.png`,
        }
    },
    busy: {
        1: {
            id: "busy",
            name: "Preoccupied",
            description: `<p>You can't use reactions until you finish your current task.</p>`,
            img: `${NEWERA.images}/se_preoccupied.png`,
        }
    },
    reacted: {
        1: {
            id: "reacted",
            name: "Reaction Used",
            description: `<p>You've used <b>1</b> reaction frame this round. Your reaction frames reset at the start of your next turn.</p>`,
            img: `${NEWERA.images}/ac_reaction.png`
        },
        2: {
            id: "reacted",
            name: "Reactions Used",
            description: `<p>You've used <b>2</b> reaction frames this round. Your reaction frames reset at the start of your next turn.</p>`,
            img: `${NEWERA.images}/ac_reaction.png`
        },
        3: {
            id: "reacted",
            name: "Reactions Used",
            description: `<p>You've used <b>3</b> reaction frame this round. Your reaction frames reset at the start of your next turn.</p>`,
            img: `${NEWERA.images}/ac_reaction.png`
        }
    },
    staggered: {
        1: {
            id: "staggered",
            name: "Staggered",
            description: `<p>You lose the next frame of your turn, and are unable to use reactions.</p>`,
            img: `${NEWERA.images}/svg/knocked-out-stars.svg`
        },
        2: {
            id: "staggered",
            name: "Staggered for 2 Frames",
            description: `<p>You lose the next two frames of your turn, and are unable to use reactions.</p>`,
            img: `${NEWERA.images}/knocked-out-stars.png`
        },
        3: {
            id: "staggered",
            name: "Staggered for 3 Frames",
            description: `<p>You lose the next three frames of your turn, and are unable to use reactions.</p>`,
            img: `${NEWERA.images}/knocked-out-stars.png`
        }
    },
    grappled: {
        1: {
            id: "grappled",
            name: "Grappled",
            description: `<p>You're being held by another creature.</p>
            <p>You can't move on your own. You move with the creature holding you at half its speed.</p>
            <p>You may make an Escape action check during your turn.</p>`,
            img: `${NEWERA.images}/grab.png`
        }
    },
    paralyzed: {
        1: {
            id: "paralyzed",
            name: "Paralyzed",
            description: `<p>You're unable to move or speak. You can't declare actions, but you're conscious and aware of your surroundings.</p>`,
            img: `${NEWERA.images}/se_paralyzed.png`,
        }
    },
    frightened: {
        1: {
            id: "frightened",
            name: "Frightened",
            description: `<p>You're frightened of a specific creature or object nearby.</p><p>You have disadvantage on all ability and skill checks while the source of your fear is within your line of sight, and you cannot willingly move closer to the source of your fear.</p>`,
            img: `${NEWERA.images}/se_frightened.png`
        }
    },
    extremeCold: {
        1: {
            id: "cold",
            name: "Extreme Cold",
            description: `<p>You take a -1 penalty to Dexterity and Wisdom-based checks.</p>`,
            img: `${NEWERA.images}/ec_extreme_cold.png`,
        },
        2: {
            id: "cold",
            name: "Extreme Cold 2",
            description: `<p>You take a -3 penalty to Dexterity and Wisdom-based checks, and a -2 penalty to all other ability and skill checks. You have disadvantage on reactions.</p>`,
            img: `${NEWERA.images}/ec_extreme_cold.png`,
        },
        3: {
            id: "cold",
            name: "Extreme Cold 3",
            description: `<p>You take a -3 penalty to Dexterity and Wisdom-based checks, and a -2 penalty to all other ability and skill checks. You have disadvantage on reactions.</p><p>At the end of your turn, or every minute out of combat, you suffer Freezing damage equal to your hit point increment minus your Constitution modifier.</p>`,
            img: `${NEWERA.images}/ec_extreme_cold.png`,
        }
    },
    extremeHeat: {
        1: {
            id: "heat",
            name: "Extreme Heat",
            description: `<p>You take a -1 penalty to physical ability and skill checks.</p><p>You gain a level of Exhaustion every hour.</p>`,
            img: `${NEWERA.images}/ec_extreme_heat.png`,
        },
        2: {
            id: "heat",
            name: "Extreme Heat 2",
            description: `<p>You take a -3 penalty to physical ability and skill checks, and a -2 penalty to all other checks.</p><p>You gain a level of Exhaustion every 30 minutes.</p>`,
            img: `${NEWERA.images}/ec_extreme_heat.png`,
        },
        3: {
            id: "heat",
            name: "Extreme Heat 3",
            description: `<p>You take Burning damage equal to your hit point increment minus your constitution modifier at the end of your turn, or every minute out of combat.</p>
            <p>You take a -3 penalty to physical ability and skill checks, and a -2 penalty to all other checks.</p><p>You gain a level of Exhaustion every 30 minutes.</p>`,
            img: `${NEWERA.images}/ec_extreme_heat.png`,
        }
    },
    highWinds: {
        1: {
            id: "wind",
            name: "High Winds",
            description: `<p>You take a -2 penalty to Marksmanship.</p>`,
            img: `${NEWERA.images}/ec_wind.png`
        },
        2: {
            id: "wind",
            name: "High Winds 2",
            description: `<p>You take a -3 penalty to Marksmanship. You move at half speed against the direction of the wind.</p>`,
            img: `${NEWERA.images}/ec_wind.png`
        },
        3: {
            id: "wind",
            name: "High Winds 3",
            description: `<p>You take a -5 penalty to Marksmanship. You move at half speed against the direction of the wind.</p>
            <p>At the beginning of your turn, you must make an Endurance save to avoid being knocked prone by the wind.</p>`,
            img: `${NEWERA.images}/ec_wind.png`
        }
    },
    exhausted: {
        1: {
            id: "exhaustion",
            name: "Exhausted",
            description:`<p>You have <b>1</b> level of exhaustion.</p>
            <p>You have disadvantage on all ability and skill checks.</p>
            `,
            img: `${NEWERA.images}/se_exhaustion.png`
        },
        2: {
            id: "exhaustion",
            name: "Exhausted 2",
            description:`<p>You have <b>2</b> levels of exhaustion.</p>
            <p>You have disadvantage on all ability and skill checks, and your speed is reduced by half.</p>
            `,
            img: `${NEWERA.images}/se_exhaustion.png`
        },
        3: {
            id: "exhaustion",
            name: "Exhausted 3",
            description:`<p>You have <b>3</b> levels of exhaustion.</p>
            <p>You have disadvantage on all ability and skill checks, and your speed, carry weight, and maximum hit points are each reduced by half.</p>
            `,
            img: `${NEWERA.images}/se_exhaustion.png`
        },
        4: {
            id: "exhaustion",
            name: "Exhausted 4",
            description:`<p>You have <b>4</b> levels of exhaustion.</p>
            <p>You become Incapacitated. Any further exhaustion means death.</p>
            `,
            img: `${NEWERA.images}/se_exhaustion.png`
        }
    },
    sneak: {
        1: {
            id: "sneak",
            name: "Sneaking",
            description: `<p>You move stealthily at half your speed.</p><p>Creatures actively looking for you make Perception checks, while oblivious creatures use their Passive Perception. The difficulty to notice you is the result of your Stealth check.</p>`,
            img: `${NEWERA.images}/se_sneak.png`
        }
    },
    swim: {
        1: {
            id: "swim",
            name: "Underwater",
            description: `<p>You must make a difficulty 10 Endurance save after one minute. On a failure, you take 1d6 Suffocation damage and automatically fail all future saves. On a success, the difficulty of the next save increases by 1. The difficulty resets when you surface for air.</p>`,
            img: `${NEWERA.images}/se_swim.png`
        }
    },
    fly: {
        1: {
            id: "fly",
            name: "Flying",
            description: `<p>You're flying above the ground. You move laterally at your Fly Speed.`,
            img: `${NEWERA.images}/se_fly.png`
        }
    },
    overencumbered: {
        1: {
            id: "overencumbered",
            name: "Overencumbered",
            description: `<p>You're carrying more than your maximum carry weight.</p>
            <p>Your speed is reduced by half and you have disadvantage on Reflex saves. Any failed physical ability or skill check causes you to take a level of Exhaustion.</p>`,
            img: `${NEWERA.images}/se_overencumbered.png`
        },
        2: {
            id: "overencumbered",
            name: "Overencumbered 2",
            description: `<p>You're carrying more than twice your maximum carry weight.</p>
            <p>Your speed is reduced to 0 and you are unable to attack or use reactions.</p>`,
            img: `${NEWERA.images}/se_overencumbered.png`
        }
    },
    drunk: {
        1: {
            id: "drunk",
            name: "Inebriated",
            description: `<p>You're under the influence of drugs or alcohol.</p>
            <p>You gain a +1 bonus to Charisma-based checks, and a -1 penalty to Wisdom and Dexterity-based checks.</p>
            <p>If you consume another drink, make a difficulty 5 Endurance save. On a failure, you become Unconscious.</p>`,
            img: `${NEWERA.images}/se_drunk.png`
        },
        2: {
            id: "drunk",
            name: "Inebriated 2",
            description: `<p>You're under the influence of drugs or alcohol.</p>
            <p>You gain a +2 bonus to Charisma-based checks, and a -2 penalty to Wisdom and Dexterity-based checks.</p>
            <p>If you consume another drink, make a difficulty 10 Endurance save. On a failure, you become Unconscious and are Poisoned 1.</p>`,
            img: `${NEWERA.images}/se_drunk.png`
        },
        3: {
            id: "drunk",
            name: "Inebriated 3",
            description: `<p>You're under the influence of drugs or alcohol.</p>
            <p>You gain a +3 bonus to Charisma-based checks, and a -3 penalty to Wisdom and Dexterity-based checks.</p>
            <p>If you consume another drink, make a difficulty 15 Endurance save. On a failure, you become Unconscious and are Poisoned 2.</p>`,
            img: `${NEWERA.images}/se_drunk.png`
        },
        4: {
            id: "drunk",
            name: "Inebriated 4",
            description: `<p>You're under the influence of drugs or alcohol.</p>
            <p>You gain a +4 bonus to Charisma-based checks, and a -4 penalty to Wisdom and Dexterity-based checks.</p>
            <p>If you consume another drink, make a difficulty 20 Endurance save. On a failure, you become Unconscious and are Poisoned 3.</p>`,
            img: `${NEWERA.images}/se_drunk.png`
        },
        5: {
            id: "drunk",
            name: "Inebriated 5",
            description: `<p>You're under the influence of drugs or alcohol.</p>
            <p>You gain a +5 bonus to Charisma-based checks, and a -5 penalty to Wisdom and Dexterity-based checks.</p>
            <p>If you consume another drink, make a difficulty 25 Endurance save. On a failure, you become Unconscious and are Poisoned 4.</p>`,
            img: `${NEWERA.images}/se_drunk.png`
        }
    },
    trapped: {
        1: {
            id: "trapped",
            name: "Trapped",
            description: `<p>You're caught in a trap or restraint. Your speed is reduced to 0.</p>
            <p>You may make an Escape action check to escape the trap, or wait for an ally to help you.</p>`,
            img: `${NEWERA.images}/se_trapped.png`
        }
    },
    dazed: {
        1: {
            id: "dazed",
            name: "Dazed",
            description: `<p>You have disadvantage on all mental ability and skill checks.</p>`,
            img: `${NEWERA.images}/se_dazed.png`
        }
    },
    wet: {
        1: {
            id: "wet",
            name: "Wet",
            description: `<p>You experience the effects of Extreme Cold one level higher and Extreme Heat one level lower. Shock damage attacks that hit you become critical hits.</p>`,
            img: `${NEWERA.images}/se_wet.png`
        }
    },
    invisible: {
        1: {
            id: "invisible",
            name: "Invisible",
            description: `<p>Perception checks to detect you by sight automatically fail.</p>`,
            img: `${NEWERA.images}/se_invisible.png`
        }
    },
    disguised: {
        1: {
            id: "disguised",
            name: "Disguised",
            description: `<p>You're dressed to disguise your true identity. Creatures you interact with must make an Insight check to see through your disguise.</p>`,
            img: `${NEWERA.images}/se_disguised.png`
        }
    },
    rested: {
        1: {
            id: "rested",
            name: "Rested",
            description: `<p>You're feeling well-rested after a good night's sleep. You gain a +1 bonus to all skill checks and saves.</p>`,
            img: `${NEWERA.images}/se_rested.png`
        },
        2: {
            id: "rested",
            name: "Rested 2",
            description: `<p>You're feeling well-rested after a good night's sleep. You gain a +2 bonus to all skill checks and saves.</p>`,
            img: `${NEWERA.images}/se_rested.png`
        },
        3: {
            id: "rested",
            name: "Rested 3",
            description: `<p>You're feeling well-rested after a good night's sleep. You gain a +3 bonus to all skill checks and saves.</p>`,
            img: `${NEWERA.images}/se_rested.png`
        }
    },
    marked: {
        1: {
            id: "marked",
            name: "Marked",
            description: "You've been marked by another creature's ability or spell. The GM identifies which ability or spell is targeting you.</p>",
            img: `${NEWERA.images}/se_marked.png`
        }
    },
    undead: {
        1: {
            id: "undead",
            name: "Undead",
            description: `<p>You gain hit points when dealt Necrotic damage, and lose hit points when healed by conventional means.</p>`,
            img: `${NEWERA.images}/se_undead.png`
        }
    },
    incorporeal: {
        1: {
            id: "incorporeal",
            name: "Incorporeal",
            description: `<p>You can move through solid walls and creatures and end your turn in the same space as an enemy.</p>
            <p>Non-magical attacks automatically miss you, and non-magical attacks you attempt automatically miss corporeal targets.</p>`,
            img: `${NEWERA.images}/se_incorporeal.png`
        }
    },
    weakened: {
        1: {
            id: "weakened",
            name: "Weakened",
            description: `<p>You have disadvantage on constitution checks and endurance saves. Your speed and carry weight are reduced by 1.</p>`,
            img: `${NEWERA.images}/se_weakened.png`
        },
        2: {
            id: "weakened",
            name: "Weakened 2",
            description: `<p>You have disadvantage on constitution checks and endurance saves. Your speed and carry weight are reduced by 2.</p>`,
            img: `${NEWERA.images}/se_weakened.png`
        },
        3: {
            id: "weakened",
            name: "Weakened 3",
            description: `<p>You have disadvantage on constitution checks and endurance saves. Your speed and carry weight are reduced by 3.</p>`,
            img: `${NEWERA.images}/se_weakened.png`
        }
    },
    waiting: {
        1: {
            id: "waiting",
            name: "Waiting",
            description: `<p>You're ready to perform a specific action when conditions are right. You may cancel your readied action at any time as a free action.</p>`,
            img: `${NEWERA.images}/se_waiting.png`
        }
    },
    winded: {
        1: {
            id: "winded",
            name: "Winded",
            description: `<p>You take a -1 penalty to all physical ability and skill checks.</p>`,
            img: `${NEWERA.images}/se_winded.png`
        },
        2: {
            id: "winded",
            name: "Winded 2",
            description: `<p>You take a -2 penalty to all physical ability and skill checks.</p>`,
            img: `${NEWERA.images}/se_winded.png`
        },
        3: {
            id: "winded",
            name: "Winded 3",
            description: `<p>You take a -3 penalty to all physical ability and skill checks.</p><p>Any further Winded effects will cause you to suffer a level of Exhaustion.</p>`,
            img: `${NEWERA.images}/se_winded.png`
        }
    },
    hastened: {
        1: {
            id: "hastened",
            name: "Hastened",
            description: `<p>You have advantage on reactions, and your Turn Length is increased by one frame.</p>`,
            img: `${NEWERA.images}/se_hastened.png`
        },
        2: {
            id: "hastened",
            name: "Hastened 2",
            description: `<p>You have advantage on reactions, and your Turn Length is increased by two frames.</p>`,
            img: `${NEWERA.images}/se_hastened.png`
        },
        3: {
            id: "hastened",
            name: "Hastened 3",
            description: `<p>You have advantage on reactions, and your Turn Length is increased by three frames.</p>`,
            img: `${NEWERA.images}/se_hastened.png`
        }
    },
    slowed: {
        1: {
            id: "slowed",
            name: "Slowed",
            description: `<p>You have disadvantage on reactions, and your Turn Length is reduced by one frame.</p>`,
            img: `${NEWERA.images}/se_slowed.png`
        },
        2: {
            id: "slowed",
            name: "Slowed 2",
            description: `<p>You have disadvantage on reactions, and your Turn Length is reduced by two frames.</p><p>This effect can't reduce your turn length to less than one frame.</p>`,
            img: `${NEWERA.images}/se_slowed.png`
        },
        3: {
            id: "slowed",
            name: "Slowed 3",
            description: `<p>You have disadvantage on reactions, and your Turn Length is reduced by three frames.</p><p>This effect can't reduce your turn length to less than one frame.</p>`,
            img: `${NEWERA.images}/se_slowed.png`
        }
    },
    opportunity: {
        1: {
            id: "opportunity",
            name: "Opportunity",
            description: `<p>You've gained an opportunity action.</p><p>You have exclusive priority until your opportunity frames are expended.</p>`,
            img: `${NEWERA.images}/ac_opportunity.png`
        }
    },
    surprised: {
        1: {
            id: "surprised",
            name: "Surprised",
            description: `<p>You skip your first turn this combat.</p>`,
            img: `${NEWERA.images}/se_surprised.png`
        }
    },
    spellsick: {
        1: {
            id: "spellsick",
            name: "Spellsickness",
            description: `<p>You're affected by more enchantments than your body can handle.</p><p>You take a penalty to all Intelligence and Wisdom checks equal to the difference between your Total Enchantment Level and your Magic Tolerance.</p>`,
            img: `${NEWERA.images}/se_spellsickness.png`
        }
    },
    insane: {
        1: {
            id: "insane",
            name: "Insane",
            description: `<p>Whenever you perform any action, you must succeed on a difficulty 10 Intelligence or Wisdom check. On a failure, you act erratically instead of performing the intended action. The specifics of what you do while Insane are at the GM's discretion.</p>`,
            img: `${NEWERA.images}/se_insane.png`
        }
    },
}

NEWERA.defaultStatusEffects = [
    //Timing-related statuses
    NEWERA.statusEffects.reacted[1],
    NEWERA.statusEffects.waiting[1],
    NEWERA.statusEffects.busy[1],
    NEWERA.statusEffects.opportunity[1],

    //Movement statuses
    NEWERA.statusEffects.prone[1],
    NEWERA.statusEffects.sneak[1],
    NEWERA.statusEffects.swim[1],
    NEWERA.statusEffects.fly[1],

    NEWERA.statusEffects.invisible[1],
    NEWERA.statusEffects.incorporeal[1],
    NEWERA.statusEffects.disguised[1],
    NEWERA.statusEffects.undead[1],

    //Ongoing damage/debuffs
    NEWERA.statusEffects.burning[1],
    NEWERA.statusEffects.bleeding[1],
    NEWERA.statusEffects.poisoned[1],
    NEWERA.statusEffects.weakened[1],

    //Misc
    NEWERA.statusEffects.marked[1],
    NEWERA.statusEffects.drunk[1],
    NEWERA.statusEffects.dazed[1],
    NEWERA.statusEffects.rested[1],

    //Environmental effects
    NEWERA.statusEffects.extremeCold[1],
    NEWERA.statusEffects.extremeHeat[1],
    NEWERA.statusEffects.highWinds[1],
    NEWERA.statusEffects.wet[1],

    //Effects involving other creatures
    NEWERA.statusEffects.grappled[1],
    NEWERA.statusEffects.trapped[1],
    NEWERA.statusEffects.staggered[1],
    NEWERA.statusEffects.stunned[1],

    NEWERA.statusEffects.frightened[1],
    NEWERA.statusEffects.surprised[1],
    NEWERA.statusEffects.hastened[1],
    NEWERA.statusEffects.slowed[1],

    NEWERA.statusEffects.overencumbered[1],
    NEWERA.statusEffects.spellsick[1],
    NEWERA.statusEffects.winded[1],
    NEWERA.statusEffects.exhausted[1],

    //Handicaps
    NEWERA.statusEffects.blinded[1],
    NEWERA.statusEffects.deafened[1],
    NEWERA.statusEffects.paralyzed[1],
    NEWERA.statusEffects.insane[1],

    //Death-related effects
    NEWERA.statusEffects.unconscious[1],
    NEWERA.statusEffects.incapacitated[1],
    NEWERA.statusEffects.dying[1],
    NEWERA.statusEffects.dead[1],
]

NEWERA.actionTypeIcons = {
    "1": `${NEWERA.images}/ac_1frame.png`,
    "2": `${NEWERA.images}/ac_2frame.png`,
    "3": `${NEWERA.images}/ac_3frame.png`,
    "4": `${NEWERA.images}/ac_4frame.png`,
    "5": `${NEWERA.images}/ac_5frame.png`,
    "0": `${NEWERA.images}/ac_0frame.png`,
    "E": `${NEWERA.images}/ac_adventuring.png`,
    "R": `${NEWERA.images}/ac_reaction.png`,
    "S": `${NEWERA.images}/ac_social.png`,
    "M": `${NEWERA.images}/ac_movement.png`,
    "D": `${NEWERA.images}/ac_downtime.png`
}

NEWERA.spellcraftSuffixes = [
    "Experimental", "Alpha", "Beta", "Revised", "Published"
]

NEWERA.lightningBoltDamageRolls = [
    "0", "1d4", "1d8", "1d12", "1d16", "1d20", "1d24", "1d30", "1d50", "1d60", "1d100"
];

NEWERA.chantLevels = [
    "basic", "apprentice", "intermediate", "advanced", "expert", "master"
];

NEWERA.wildFuryTable = {
    "fire": [
        "A fiery explosion erupts from your body. All creatures within 6 feet of you take 1d10 Burning damage.",
        "One creature of your choice you can see instantly bursts into flame, gaining the Burning 3 status effect.",
        "The ground around you spontaneously ignites, creating an circular area of flames 6 feet in diameter centered on your location. For three rounds, any creatures standing in the flames take 2 Burning damage per frame.",
        "You feel a fiery rush of adrenaline. You gain 2 bonus action frames during your current turn (or your next turn if you entered Rage as a reaction.)"
    ],
    "water": [
        "A blast of icy cold shoots from your chest. One creature you can see within 30 feet takes 1d10 Freezing damage and is staggered for one frame.",
        "Spikes of ice fall on up to three creatures of your choice you can see. Those creatures each make a difficulty 15  Reflex save or 1d10 Freezing damage.",
        "The ground within 10 feet around you ices over and becomes Slippery Ground for three rounds.",
        "A whirlwind of icy cold emanates from your body. Until your Rage ends, enemies have their speed reduced by 2 feet per frame while they're within 20 feet of you."
    ],
    "earth": [
        "Vines shoot out from the ground and ensnare one creature of your choice that you can see. That creature's speed is reduced to zero. During that creature's turn, it may make an Escape (Agility) or Escape (Strength) check to escape the restraints.",
        "A small earthquake shakes the ground. All creatures within 30 feet of you make a  Reflex save to avoid being knocked prone. Your allies have advantage on the save.",
        "A 6-foot deep circular hole 2 feet in diameter opens up in the ground at a location of your choice within 10 feet. A creature standing over the hole makes a Reflex save to avoid falling in.",
        "Earth magic infuses your body. Until your Rage ends, you can't be staggered or knocked prone and you have advantage on Endurance saves."
    ],
    "wind": [
        "A sudden gust of wind blows in the direction you're facing. Creatures within a 20-foot cone in front of you make an Endurance save or are pushed 10 feet away from you. Your allies have advantage on the save.",
        "A bolt of electricity shoots from your chest shocks one creature of your choice you can see. That creature takes 1d6 Shock damage and makes an Endurance save or drops any weapons they're holding.",
        "A static discharge courses through metallic objects within 20 feet of you. Any creatures within this range wearing metal armor or touching a metal object makes an Endurance save or become Stunned.",
        "You feel a rush of wind at your back. Until your Rage ends, your movement speed increases by 4 and enemies can't react to you moving in or out of reach."
    ]
};

NEWERA.alternateDimensionLocations = [
    "null",
    "undefined",
    "ERROR",
    "37",
    "Soup",
    "-2,147,483,647",
    "');sudo rm -rf /*",
    "THEFOGISCOMINGTHEFOGISCOMINGTHEFOGISCOMINGTHEFOGISCOMING",
    "Sɹ∀W פ∩q",
    "👽",
    "Exception in thread 'Main' java.lang.NullPointerException: null",
    "0x80034CFF",
    "lorem ipsum dolor sit amet",
    "E",
    "SUPPLY CLOSET",
    "Stop.",
    "Birdo in my opinion is the best character in Mario Kart. She gets +1 to her mini-turbo as a hidden stat in Mario Kart Wii, is the best partner for Yoshi in Double Dash (all Daisy/Birdo or Waluigi /Birdo users can take a hike, I'll never accept these pairings) and has the best/cutest tricks in Wii, Tour and 8 Deluxe. HOWEVER, when it comes to other people using pink Birdo or the other Birdo colors, I take it as a challenge and an insult. The best Birdo user (mostly pink Birdo) is me. If I see other Birdo players online (even Birdo Mi Suit users, my Birdo Mi is the one true accurate Birdo Mii), I must humiliate them. If they dare pull out the Teddy Buggy/Roller Tires in my presence (Azure Roller included) I must destroy them by landing them in a bad position after a race. If they have the audacity to win against me, I'm denying their win and cutting off the communication by quitting the race or closing the software. Show up in my Friends list even though I hate you and refuse to race against you? REMOVED. And I hate the player named Rainbow Das. I hate her Mr. Scooty/Azure Roller Tires combo. Your combo is not better than mine (Birdo/Sports Coupe/GLA Tires)! Also, you're not better than me! You are not welcome in my Friends list. Your VR means nothing to me. And fuck those damn Yoshi players. Hate 'em, not playing again them."
];

NEWERA.archetypeFeatInclusionMapping = [
    {
        selection: "fire",
        className: "Delver",
        name: "Path of Fire"
    },
    {
        selection: "water",
        className: "Delver",
        name: "Path of Water"
    },
    {
        selection: "earth",
        className: "Delver",
        name: "Path of Earth"
    },
    {
        selection: "wind",
        className: "Delver",
        name: "Path of Wind"
    },
    {
        selection: "raider",
        className: "Mercenary",
        name: "Raider"
    },
    {
        selection: "enforcer",
        className: "Mercenary",
        name: "Enforcer"
    },
    {
        selection: "woodsman",
        className: "Mercenary",
        name: "Woodsman"
    },
    {
        selection: "warrior",
        className: "Mercenary",
        name: "Warrior"
    },
    {
        selection: "mountaineer",
        className: "Ranger",
        name: "Mountaineer"
    },
    {
        selection: "polar",
        className: "Ranger",
        name: "Polar Explorer"
    },
    {
        selection: "desert",
        className: "Ranger",
        name: "Desert Explorer"
    },
    {
        selection: "rainforest",
        className: "Ranger",
        name: "Rainforest Explorer"
    },
    {
        selection: "hiker",
        className: "Ranger",
        name: "Hiker"
    },
    {
        selection: "diver",
        className: "Ranger",
        name: "Diver"
    },
    {
        selection: "spelunker",
        className: "Ranger",
        name: "Spelunker"
    },
    {
        selection: "urbex",
        className: "Ranger",
        name: "Urban Explorer"
    },
    {
        selection: "marauder",
        className: "Investigator",
        name: "Marauder"
    },
    {
        selection: "spy",
        className: "Investigator",
        name: "Spy"
    },
    {
        selection: "assassin",
        className: "Investigator",
        name: "Assassin"
    },
    {
        selection: "raven",
        className: "Witch",
        name: "Raven"
    },
    {
        selection: "snake",
        className: "Witch",
        name: "Snake"
    },
    {
        selection: "cat",
        className: "Witch",
        name: "Cat"
    },
    {
        selection: "wolf",
        className: "Witch",
        name: "Wolf"
    },
    {
        selection: "spider",
        className: "Witch",
        name: "Spider"
    },
    {
        selection: "owl",
        className: "Witch",
        name: "Owl"
    },
    {
        selection: "bear",
        className: "Witch",
        name: "Bear"
    }
]

NEWERA.prerequisiteActorStatTextMatching = {
    "strength": actor => actor.system.abilities.strength.score,
    "dexterity": actor => actor.system.abilities.dexterity.score,
    "constitution": actor => actor.system.abilities.constitution.score,
    "intelligence": actor => actor.system.abilities.intelligence.score,
    "wisdom": actor => actor.system.abilities.wisdom.score,
    "charisma": actor => actor.system.abilities.charisma.score,
    "agility": actor => actor.system.skills.agility.level,
    "athletics": actor => actor.system.skills.athletics.level,
    "deception": actor => actor.system.skills.deception.level,
    "defense": actor => actor.system.skills.defense.level,
    "determination": actor => actor.system.skills.determination.level,
    "diplomacy": actor => actor.system.skills.diplomacy.level,
    "endurance": actor => actor.system.skills.endurance.level,
    "insight": actor => actor.system.skills.insight.level,
    "instinct": actor => actor.system.skills.instinct.level,
    "intimidation": actor => actor.system.skills.intimidation.level,
    "logic": actor => actor.system.skills.logic.level,
    "one-handed": actor => actor.system.skills["one-handed"].level,
    "marksmanship": actor => actor.system.skills.marksmanship.level,
    "medicine": actor => actor.system.skills.medicine.level,
    "perception": actor => actor.system.skills.perception.level,
    "performance": actor => actor.system.skills.performance.level,
    "reflex": actor => actor.system.skills.reflex.level,
    "stealth": actor => actor.system.skills.stealth.level,
    "sleight of hand": actor => actor.system.skills["sleight-of-hand"].level,
    "technology": actor => actor.system.skills.technology.level,
    "two-handed": actor => actor.system.skills["two-handed"].level,
    "overall level": actor => actor.system.level,
    "age": actor => actor.system.age,
    "size": actor => actor.system.size.mod,
    "caster level": actor => actor.system.casterLevel,
    "delver level": actor => actor.system.classes.delver.level,
    "mercenary level": actor => actor.system.classes.mercenary.level,
    "ranger level": actor => actor.system.classes.ranger.level,
    "chanter level": actor => actor.system.classes.chanter.level,
    "magus level": actor => actor.system.classes.magus.level,
    "guardian level": actor => actor.system.classes.guardian.level,
    "researcher level": actor => actor.system.classes.researcher.level,
    "investigator level": actor => actor.system.classes.investigator.level,
    "scholar level": actor => actor.system.classes.scholar.level,
    "artificer level": actor => actor.system.classes.artificer.level,
    "sage level": actor => actor.system.classes.sage.level,
    "witch level": actor => actor.system.classes.witch.level,
    "elemental": actor => actor.system.magic.elemental.level,
    "divine": actor => actor.system.magic.divine.level,
    "physical": actor => actor.system.magic.physical.level,
    "psionic": actor => actor.system.magic.psionic.level,
    "spectral": actor => actor.system.magic.spectral.level,
    "temporal": actor => actor.system.magic.temporal.level,
}

NEWERA.featTypeMapping = {
    "GF": "General Feat",
    "SF": "Skill Feat",
    "CF": "Class Feat",
    "AF": "Archetype Feat",
    "CB": "Career Background",
    "BG": "Background",
    "FL": "Flaw",
    "GU": "General Feat",
    "SU": "Skill Feat",
    "CU": "Class Feat",
    "AU": "Archetype Feat",
}

//These types denote feats that can be taken any number of times.
NEWERA.repeatableFeatTypes = [
    "GU", "SU", "CU", "AU"
];

NEWERA.spellStudiesLists = {
    delver: {
        label: "Delver Spells",
        forms: ["elemental"],
        schools: ["banishment"],
    },
    mercenary: {
        label: "Mercenary Spells",
        forms: [],
        schools: ["lithomancy", "physiomancy", "abjuration"],
    },
    ranger: {
        label: "Ranger Spells",
        forms: [],
        schools: ["physiomancy", "conjuration", "divination", "pyromancy"],
    },
    chanter: {
        label: "Chanter Spells",
        forms: [],
        schools: ["restoration", "illusion", "hypnotism"],
    },
    magusSpells: {
        label: "Magus Spells",
        forms: ["elemental"],
        schools: ["banishment", "sangromancy"],
    },
    magusEnchantments: {
        label: "Magus Enchantments",
        forms: ["elemental", "divine"],
        schools: ["sangromancy", "physiomancy", "illusion"],
    },
    guardian: {
        label: "Guardian Spells",
        forms: ["divine"],
        schools: ["conjuration", "illusion"],
    },
    investigator: {
        label: "Investigator Spells",
        forms: ["psionic"],
        schools: ["physiomancy", "apparition"],
    },
    scholar: {
        label: "Scholar Spells",
        forms: ["elemental", "divine", "physical", "psionic", "spectral", "temporal"],
        schools: [],
    },
    artificerSpells: {
        label: "Artificer Spells",
        forms: ["physical"],
        schools: ["pyromancy", "cryomancy", "illusion"]
    },
    artificerEnchantments: {
        label: "Artificer Enchantments",
        forms: ["elemental", "divine", "physical", "psionic", "spectral", "temporal"],
        schools: ["metamagic"]
    },
    sage: {
        label: "Sage Spells",
        forms: [],
        schools: ["restoration", "banishment", "illusion", "divination", "sangromancy"]
    },
    witch: {
        label: "Witch Spells",
        forms: ["spectral"],
        schools: ["evocation", "transmutation", "illusion"]
    }
}

NEWERA.spellRarity = [
    "Inscribed", "Common", "Uncommon", "Rare", "Legendary", "Restricted", "Classified", "Mystery", "Innate"
]

NEWERA.specialtyDefaultParents = {
    "archery": "marksmanship",
    "crossbow": "marksmanship",
    "rifle": "marksmanship",
    "crafting": "technology",
    "cooking": "technology",
    "alchemy": "technology",
    "climbing": "athletics",
    "swimming": "athletics"
}