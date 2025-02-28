import { NEWERA } from "../helpers/config.mjs";
import { NewEraUtils } from "../helpers/utils.mjs";
import { Witch } from "../helpers/classes/witch.mjs";
import { CharacterEnergyPool } from "../schemas/char-energy-pool.mjs";
import { ClassInfo } from "../helpers/classFeatures.mjs";
import { NewEraItem } from "./item.mjs";
import { Actions } from "../helpers/actions/actions.mjs";
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class NewEraActor extends Actor {

  static Types = {
    PC: ["Player Character"],
    NPC: ["Non-Player Character"],
    CREATURE: ["Creature"],
    CONTAINER: ["Container"],
    VEHICLE: ["Vehicle"],
    CHARACTER: ["Player Character", "Non-Player Character"],
    ANIMATE: ["Player Character", "Non-Player Character", "Creature"],
    INANIMATE: ["Container", "Vehicle"]
  }

  typeIs(types){
    return types.includes(this.type);
  }

  static EquipmentSlots = {
    RIGHT_HAND: "rightHand",
    LEFT_HAND: "leftHand",
    HEAD: "head",
    NECK: "neck",
    WAIST: "waist", 
    BODY: "body",
    FEET: "feet",
    HANDS: "hands",
    PHONE: "phone",
    BACKPACK: "backpack"
  };


  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived system.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic system. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const system = this.system;
    const flags = this.flags.newera || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._validateResources(system);
    this._prepareCharacterData(system);
    this._prepareNpcData(system);
    this._prepareCreatureData(system);
    this._prepareVehicleData(system);
  }

  /*
  * Verify and correct problems with resource bar values, i.e. if a resource's value is negative or higher than the maximum
  */
  _validateResources(system){
    if (system.hitPoints){
      if (system.hitPoints.value < 0) system.hitPoints.value = 0;
      if (system.hitPoints.value > system.hitPoints.max) system.hitPoints.value = system.hitPoints.max;
      if (system.hitPoints.temporary < 0) system.hitPoints.temporary = 0;
    }
    if (system.lifePoints){
      if (system.lifePoints.value < 0) system.lifePoints.value = 0;
      if (system.lifePoints.value > system.lifePoints.max) system.lifePoints.value = system.lifePoints.max;
    }
    if (system.energy){
      if (system.energy.value < 0) system.energy.value = 0;
      if (system.energy.value > system.energy.max) system.energy.value = system.energy.max;
      if (system.energy.temporary < 0) system.energy.temporary = 0;
    }
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(system) {
    if (this.type !== 'Player Character') return;

    this._calculateLevel();
    if (system.level == 0){
      this._doAbilityScorePoints();
    }
    system.characterPoints.cpa = this._calculateCpa(system.characterPoints.cpt, system.age, this.items);
    this._calculateInventoryLoad(system, this.items);
    this._prepareAbilityScoreModifiers(system);
    this._prepareCalculatedStats(system);
    this._prepareSkillModifiers(system);

    system.injured = (system.hitPointTrueMax > system.hitPoints.max);

    const difficulty = game.settings.get("newera-sol366", "difficulty");
    const maxInspiration = (difficulty == 0 ? 5 : (difficulty == 1 ? 3 : (difficulty == 2 ? 1 : 0)));

    if (system.inspiration > maxInspiration){
      //ui.notifications.warn(`You can't have more than ${maxInspiration} points of inspiration.`);
      system.inspiration = maxInspiration;
    }
    if (system.inspiration < 0){
      system.inspiration = 0;
    }
  }

  /** 
   * Calculates a PC's overall level during data preparation, and sets the overLeveled and underLeveled flags for the character sheet
   */
  _calculateLevel(){
    const system = this.system;

    const levelThresholds = game.settings.get("newera-sol366", "advancedSkills") ? NEWERA.levelThresholds.advanced : NEWERA.levelThresholds.standard;

    for (let i=0; i<100; i++){
      let currentLevelThreshold = i<31 ? levelThresholds[i] : 5000 + ((i-30)*500);
      let nextLevelThreshold = i<30 ? levelThresholds[i+1] : 5000 + ((i-29)*500);
      system.levelGap = nextLevelThreshold - currentLevelThreshold;
      if (system.characterPoints.cpt >= currentLevelThreshold && system.characterPoints.cpt < nextLevelThreshold){
        system.level = i;
        system.characterPoints.progressMax = nextLevelThreshold - currentLevelThreshold;
        system.characterPoints.progressValue = system.characterPoints.cpt - currentLevelThreshold;
        //console.log("[NEWERA] CP="+system.characterPoints.available+"/"+system.characterPoints.cpt+" level="+system.level+" progressValue="+system.characterPoints.progressValue+" progressMax="+system.characterPoints.progressMax);
        break;
      }
    }

    let classlessLevels = system.level;

    for (const item of this.items){
      if (item.type == 'Class'){
        classlessLevels -= item.system.level;
      }
    }
    system.classlessLevels = classlessLevels;
    if (classlessLevels < 0){
      system.classlessLevels = 0;
      system.isOverLeveled = true;
      system.isUnderLeveled = false;
    } else if (classlessLevels > 0){
      system.isUnderLeveled = true;
      system.isOverLeveled = false;
    } else {
      system.isOverLeveled = false;
      system.isUnderLeveled = false;
    }
  }

  /**
   * Returns the character's current CPA (Character Points Available) - Total earned plus age bonus minus the cost of owned feats
   * @param {number} cpt - The character's current CPT (Character Points Total)
   * @param {number} age - The character's age
   * @param {NewEraItem[]} items - The character's inventory
   * @returns {number} The character's current CPA
   */
  _calculateCpa(cpt, age, items){
    let cpa = cpt;
    if (age < 20){
      cpa += 10;
    } else if (age < 30){
      cpa += 15;
    } else if (age < 40){
      cpa += 20;
    } else if (age < 50){
      cpa += 25;
    } else if (age < 60){
      cpa += 30;
    } else {
      cpa += 35;
    }
    for (const item of items){
      if (item.type == 'Feat'){
        cpa -= item.system.totalCost;
      }
    }
    return cpa;
  }

  /**
   * Calculate values which depend on the items in the actor's inventory
   * @param {} system 
   * @param {*} items 
   */
  _calculateInventoryLoad(system, items){
    let weight = 0;
    let ench = 0;
    let armor = 0;
    let money = 0;
    let ancientMoney = 0;
    for (const item of items){
      if (item.typeIs(NewEraItem.Types.INVENTORY) && !item.system.stored && typeof item.system.weight != "undefined"){
        weight += item.system.weight * (item.system.quantity || 1);
      }
      if (item.typeIs(NewEraItem.Types.ENCHANTABLE) && item.system.enchanted) {
        const slot = this.findItemLocation(item);
        if (slot && !["backpack", "leftHand", "rightHand"].includes(slot) && !item.typeIs(NewEraItem.Types.WEAPON)) { //Count enchanted items, that are not weapons, and are worn on the body
          ench += item.system.totalEnchantmentLevel;
        }
      }
      if (item.typeIs(NewEraItem.Types.ARMOR)) {
        if (item.system.armorType == "Chest" || item.system.armorType == "Full Body"){
          armor += item.system.armorRating;
        }
      }
      if (item.system.casperObjectId && NEWERA.moneyItemValues[item.system.casperObjectId]){
        money += NEWERA.moneyItemValues[item.system.casperObjectId] * item.system.quantity;
      }``
      if (item.system.casperObjectId && NEWERA.ancientMoneyItemValues[item.system.casperObjectId]){
        ancientMoney += NEWERA.ancientMoneyItemValues[item.system.casperObjectId] * item.system.quantity;
      }
    }
    system.carryWeight.current = weight;
    system.magicTolerance.current = ench;
    system.armor.equipped = armor;
    system.money.cash = money;
    system.money.total = system.money.digital + system.money.cash;
    system.money.ancient = ancientMoney;
  }

  _getTotalVehicleWeight(items, occupants = []){
    let total = 0;
    for (const item of items){
      if (!item.system.stored && typeof item.system.weight != "undefined"){
        total += item.system.weight * (item.system.quantity || 1);
      }
    }
    for (const actor of occupants){
      total += Math.max(6 + actor.system.size.mod, 0);
    }
    return total;
  }

  /**
   * For level 0 characters, calculates the number of ability score points available to spend.
   */
  _doAbilityScorePoints(){
    const system = this.system;
    let pts = 0;
    let outOfRange = false;
    if (system.age < 20){
      pts = 32;
    } else if (system.age < 30){
      pts = 31;
    } else if (system.age < 40){
      pts = 30;
    } else if (system.age < 50){
      pts = 29;
    } else if (system.age < 60){
      pts = 28;
    } else {
      pts = 27;
    }
    let bal = pts;
    for (let [key, ability] of Object.entries(system.abilities)) {
      if (ability.score < 6 || ability.score > 15){
        outOfRange = true;
      } else {
        bal -= NEWERA.abilityScorePointCosts[ability.score];
      }
    }
    system.abilityScorePointBuy = {
      initial: pts,
      remaining: bal,
      outOfRange: outOfRange
    };
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(system) {
    if (this.type !== 'Non-Player Character') return;

    system.injured = (system.hitPointTrueMax > system.hitPoints.max);

    this._calculateInventoryLoad(system, this.items);
    this._prepareAbilityScoreModifiers(system);
    this._prepareSkillModifiers(system);
    this._prepareCalculatedStats(system);
  }

  _prepareCreatureData(system) {
    if (this.type !== 'Creature') return;
    this._prepareAbilityScoreModifiers(system);
    system.rollableHP = (system.hitPoints.max == 0 && system.initialHitPoints.dieCount > 0);
    system.hitPoints.total = system.hitPoints.value;

    system.saves.endurance.mod = system.abilities.strength.mod + system.abilities.constitution.mod + system.saves.endurance.bonus;
    system.saves.reflex.mod = system.abilities.dexterity.mod + system.abilities.wisdom.mod + system.saves.reflex.bonus;
    system.saves.determination.mod = system.abilities.intelligence.mod + system.abilities.charisma.mod + system.saves.determination.bonus;

    system.isMonster = (system.rarity <= 5);

    let baseCastMod = system.specialModifiers.spellcasting ? system.specialModifiers.spellcasting.mod : 0;
    system.spellMods = {
      elemental: baseCastMod + system.abilities.strength.mod,
      divine: baseCastMod + system.abilities.constitution.mod,
      physical: baseCastMod + system.abilities.dexterity.mod,
      psionic: baseCastMod + system.abilities.intelligence.mod,
      spectral: baseCastMod + system.abilities.charisma.mod,
      temporal: baseCastMod + system.abilities.wisdom.mod,
    };

    for (const [key, spec] of Object.entries(system.specialModifiers)){
      if (spec.parent == "static"){
        spec.static = true;
      } else {
        spec.parentMod = spec.parent ? system.abilities[spec.parent].mod : 0;
        spec.mod = spec.parentMod + spec.bonus;
      }
    }

    system.turnLength.actions.value = system.turnLength.actions.bonus;
    system.turnLength.reactions.value = system.turnLength.reactions.bonus;

    system.armor.total = system.armor.equipped + system.armor.bonus;

  }

  _prepareVehicleData(system){
    if (this.type != "Vehicle") return;
    system.passengers = system.occupants.map(id => {
      const actor = structuredClone(game.actors.get(id));
      actor.id = id;
      return actor;
    });
    system.empty = (system.occupants.length == 0);
    system.totalWeight = this._getTotalVehicleWeight(this.items, system.passengers);
    system.isElectric = (this.system.fuelType == "electric");
  }

  //Calculate the base and total modifiers for each ability score
  _prepareAbilityScoreModifiers(system) {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(system.abilities)) {
      if (ability.score > 30) ability.score = 30;
      if (ability.score < 1) ability.score = 1;
      // Calculate the modifier using d20 rules.
      ability.baseMod = NEWERA.abilityScoreModifiers[ability.score];
      ability.mod = ability.baseMod + ability.bonus;
    }
  }

  //Calculate the modifiers for each main skill
  _prepareSkillModifiers(system) {
    //Main skills
    for (let [key, skill] of Object.entries(system.skills)) {
      if (skill.level > 10) skill.level = 10;
      if (skill.level < 0) skill.level = 0;
      skill.parentMod = 0;
      for (const parentKey of skill.parentAbilities){
        skill.parentMod += system.abilities[parentKey].mod;
      }
      skill.rollLabel = skill.parentAbilities.length > 1 ? "Save" : "Skill Check";
      //console.log(`${typeof skill.level} ${typeof skill.parentMod} ${typeof skill.bonus}`);
      skill.mod = skill.level + skill.parentMod + skill.bonus;
      if (skill.grandMaster){
        skill.mod += system.level;
      }
    }
    //Knowledges
    for (let [key, skill] of Object.entries(system.knowledges)) {
      if (skill.level > 10) skill.level = 10;
      if (skill.level < 0) skill.level = 0;
      skill.mod = system.abilities.intelligence.mod + skill.level + skill.bonus;
      if (skill.grandmaster){
        skill.mod += system.level;
      }
    }
    //Magic Skills
    if (typeof system.magic !== "undefined"){
      system.isMagicUser = (system.casterLevel > 0);
      if (system.casterLevel > 10) system.casterLevel = 10;
      if (system.casterLevel < 0) system.casterLevel = 0;
      for (let [key, skill] of Object.entries(system.magic)) {
        if (skill.level > 10) skill.level = 10;
        if (skill.level < 0) skill.level = 0;
        skill.baseMod = system.casterLevel + system.abilities[skill.parentAbility].mod;
        //console.log(typeof system.casterLevel);
        //console.log(typeof system.abilities[skill.parentAbility].mod);
        //console.log(typeof skill.baseMod);
        skill.mod = skill.baseMod + skill.bonus;
        if (skill.grandMaster){
          skill.mod += system.level;
        }
        skill.rangedAttackMod = skill.mod + system.skills.marksmanship.mod;
        //console.log("MSMOD "+key+" CL="+system.casterLevel+" BM="+skill.baseMod+" CM="+skill.mod+" RA="+skill.rangedAttackMod);
      }
    }
    //Specialties
    for (let [key, spec] of Object.entries(system.specialties)) {
      if (spec.level > 3) spec.level = 3;
      if (spec.level < 0) spec.level = 0;
      if (system.skills[spec.defaultParent]){
        spec.parentMod = system.skills[spec.defaultParent].mod;
      } else if (system.magic[spec.defaultParent]) {
        spec.parentMod = system.magic[spec.defaultParent].mod;
      } else if (spec.defaultParent == "spellcasting") {
        spec.parentMod = system.casterLevel || 0;
      } else {
        spec.parentMod = 0;
      }
        //console.log(`SPEC ${spec.level} ${spec.parentMod} ${spec.bonus}`);
        spec.mod = (spec.level || 0) + spec.parentMod + spec.bonus;
    }

  }

  _prepareCalculatedStats(system) {

    const armor = system.armor;
    armor.calculated = Math.max(system.size.mod, 0);
    armor.natural = armor.calculated + armor.bonus;
    armor.total = armor.natural + armor.equipped;

    const passiveAgility = system.passiveAgility;
    passiveAgility.calculated = Math.max(system.abilities.dexterity.score - system.size.mod, 0);
    passiveAgility.value = passiveAgility.calculated + passiveAgility.bonus;

    const passivePerception = system.passivePerception;
    passivePerception.calculated = system.abilities.wisdom.score;
    passivePerception.value = passivePerception.calculated + passivePerception.bonus;

    const carryWeight = system.carryWeight;
    carryWeight.calculated = system.abilities.strength.mod + 8;
    carryWeight.value = carryWeight.calculated + carryWeight.bonus;

    const initiative = system.initiative;
    initiative.calculated = Math.max(system.abilities.dexterity.mod, system.abilities.wisdom.mod);
    initiative.mod = initiative.calculated + initiative.bonus;

    const speed = system.speed;
    speed.value = speed.base + speed.bonus;

    system.turnLength.actions.value = system.turnLength.actions.base + system.turnLength.actions.bonus;
    system.turnLength.reactions.value = system.turnLength.reactions.base + system.turnLength.reactions.bonus;

    system.hitPoints.total = system.hitPoints.value + system.hitPoints.temporary;
    if (system.hitPoints.value > 0){
      system.hpPercentage = (system.hitPoints.value + system.hitPoints.temporary) / system.hitPointTrueMax;
    } else {
      system.hpPercentage = system.lifePoints.value / system.lifePoints.max;
    }

    system.energy.total = system.energy.value + system.energy.temporary;
    system.energyPercentage = (system.energy.value + system.energy.temporary) / system.energy.max;

    system.magicTolerance.max = Math.max(5, system.level);

  }

  /**
   * Finds an entry in system.additionalResources by name.
   * @param {string} name 
   * @returns 
   */
  findResource(name){
    return Object.values(this.system.additionalResources).find(r => r.name.toLowerCase() == name.toLowerCase());
  }

  /**
   * Whether the character has the given amount of a named special resource.
   * @param {string} name 
   * @param {number} amount 
   * @returns {boolean}
   */
  hasResource(name, amount = 1){
    const resource = this.findResource(name);
    if (resource){
      return resource.value >= amount;
    }
    return false;
  }

  getClassLevel(clazz) {
    const classObj = this.items.contents.find(i => i.type == "Class" && i.system.classId == clazz);
    return classObj ? classObj.system.level : 0;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const rollData = super.getRollData();

    // Prepare character roll system.
    this._getCharacterRollData(rollData);
    this._getCreatureRollData(rollData);
    return rollData;
  }

  /**
   * Prepare character roll system.
   */
  _getCharacterRollData(system) {
    if (this.type !== 'Player Character' || this.type == 'Non-Player Character') return;

    //Copy specialty modifiers to the top level with an abbreviated name
    if (system.specialties){
      const specialtyFull = {};
      const specialty = {};
      for (let [k, v] of Object.entries(system.specialties)) {
        if (v.subject){
          const specId = v.subject.replace(" ", "_").toLowerCase();
          specialtyFull[specId] = v.mod;
          specialty[specId] = (v.level || 0) + (v.bonus || 0);
        }
      }
      system.spec = specialtyFull; //Backwards compatibility
      //This object is used to refer to specialties by their name. The buttons directly on the sheet reference them by their index number in the system.specialties object.
      system.specialty = {
        full: specialtyFull,
        partial: specialty
      }

    }
  }

  _getCreatureRollData(rd){
    if (this.type !== 'Creature') return;
    rd.special = {};
    for (let [k, v] of Object.entries(rd.specialModifiers)) {
      const specId = v.subject.replace(" ", "_").toLowerCase();
      rd.special[specId] = v.mod;
    }
  }

  async setPronouns(set, pronouns) {
    const update = {
      system: {}
    };
    if (set != 5) {
      const selectedSet = NEWERA.pronouns[set];
      update.system.pronouns = {
        index: set,
        ...selectedSet
      }
    } else {
      update.system.pronouns = {
        index: 5,
        ...pronouns
      }
    }
    await this.update(update);
  }

  async addKnowledge(subject = null, count = 1) {
    const update = {
      system: {
        knowledges: {}
      }
    }
    for (let i = 0; i < count; i++){
      update.system.knowledges[Object.keys(this.system.knowledges).length + i] = {
        subject: subject || "New Knowledge",
        level: 0,
        bonus: 0,
        natural: false,
        grandmaster: false
      };
    }
    await this.update(update);
  }

  async addSpecialty(subject = null, count = 1) {
    const update = {
      system: {
        specialties: {}
      }
    }
    for (let i = 0; i < count; i++){
      update.system.specialties[Object.keys(this.system.specialties).length] = {
        subject: subject || "New Specialty",
        level: 0,
        bonus: 0,
        defaultParent: NEWERA.specialtyDefaultParents[subject] || "other"
      };
    }
    await this.update(update);
  }

  async addSpecialModifier() {
    const update = {
      system: {
        specialModifiers: {}
      }
    }
    update.system.specialModifiers[Object.keys(this.system.specialModifiers).length] = {
      subject: "New Modifier",
      bonus: 0,
      parent: ""
    };
    await this.update(update);
  }

  async deleteKnowledge(index){
    const update = {
      system: {
        knowledges: {}
      }
    }
    update.system.knowledges = NewEraUtils.spliceIndexedObject(this.system.knowledges, index);
    //Update learning experience selections to reflect the deleted knowledge
    if (this.system.classes){
      for (const [className, classData] of Object.entries(this.system.classes)){
        if (classData.learningExperience){
          for (const [level, obj] of Object.entries(classData.learningExperience)){
            const prevSelection = parseInt(obj.improvement);
            if (prevSelection == index){
              update.system.classes[className].learningExperience[level].improvement = "";
            } else if (prevSelection > index){
              update.system.classes[className].learningExperience[level].improvement = (prevSelection - 1).toString();
            }
          }
        }
      }
    }
    await this.update(update);
  }

  async deleteSpecialty(index){
    const update = {
      system: {
        specialties: {}
      }
    }
    update.system.specialties = NewEraUtils.spliceIndexedObject(this.system.specialties, index);
    //Update specialty improvement selections to reflect the deleted specialty
    if (this.system.classes){
      for (const [className, classData] of Object.entries(this.system.classes)){
        if (classData.specialtyImprovement){
          for (const [level, obj] of Object.entries(classData.specialtyImprovement)){
            const prevSelection = parseInt(obj.improvement);
            if (prevSelection == index){
              update.system.classes[className].specialtyImprovement[level].improvement = "";
            } else if (prevSelection > index){
              update.system.classes[className].specialtyImprovement[level].improvement = (prevSelection - 1).toString();
            }
          }
        }
      }
    }
    await this.update(update);
  }

  async deleteSpecialModifier(index){
    await this.update({
      system: {
        specialModifiers: NewEraUtils.spliceIndexedObject(this.system.specialModifiers, index)
      }
    });
  }

  async deleteItem(id){
    const item = this.items.get(id);
    if (item) {
      if (item.typeIs(NewEraItem.Types.INVENTORY)) {
        this.actionMessage(item.img, null, "{NAME} drops the {0}.", item.name);
      }
      await item.delete();
    }
  }

  getSkillModifier(skill) {
    const system = this.system;
    return system.skills[skill].mod || 0;
  }

  getAbilityModifier(ability){
    const system = this.system;
    return system.abilities[ability].mod || 0;
  }

  getSpecialtySkillModifier(skill, ...specialties){
    if (!specialties){
      return this.getSkillModifier(skill);
    } else {
      for (const spec of specialties){

      }
    }
  }

  async addResource(resource = null) {
    const update = {
      system: {
        additionalResources: {}
      }
    }
    update.system.additionalResources[Object.keys(this.system.additionalResources).length] = resource || {
      name: "New Resource",
      value: 0,
      max: 0,
      daily: false,
      custom: true
    };
    await this.update(update);
  }

  async updateResourceByName(name, resourceUpdate) {
    const index = Object.keys(this.system.additionalResources).find(r => this.system.additionalResources[r].name.toLowerCase() == name.toLowerCase());
    if (index !== undefined){
      const update = {
        system: {
          additionalResources: {
            [index]: resourceUpdate
          }
        }
      };
      await this.update(update);
    }
  }

  async updateResourceByIndex(index, resourceUpdate) {
    const update = {
      system: {
        additionalResources: {
          [index]: resourceUpdate
        }
      }
    };
    await this.update(update);
  }

  async deleteResource(index){
    const update = {
      system: {
        additionalResources: NewEraUtils.spliceIndexedObject(this.system.additionalResources, index)
      }
    };
    await this.update(update);
  }

  getNarration(template, ...args){
    const system = this.system;
    const flavorReplace = {
      "{|s}": system.pronouns.pluralize ? "s" : "",
      "{s|}": system.pronouns.pluralize ? "" : "s",
      "{S}": system.pronouns.subjective,
      "{s}": system.pronouns.subjective.toLowerCase(),
      "{O}": system.pronouns.objective,
      "{o}": system.pronouns.objective.toLowerCase(),
      "{D}": system.pronouns.possessiveDependent,
      "{d}": system.pronouns.possessiveDependent.toLowerCase(),
      "{I}": system.pronouns.possessiveIndependent,
      "{i}": system.pronouns.possessiveIndependent.toLowerCase(),
      "{R}": system.pronouns.reflexive,
      "{r}": system.pronouns.reflexive.toLowerCase(),
      "{C}": system.pronouns.contraction,
      "{c}": system.pronouns.contraction.toLowerCase(),
      "{NAME}": this.name
    }
    let output = template;
    for (const [token, val] of Object.entries(flavorReplace)){
      output = output.replace(token, val);
    }
    for (let i=0; i<args.length; i++){
      output = output.replace(`{${i}}`, args[i]);
    }
    return output;
  }

  async moveItem(id, source, destination){
    console.log(`Moving item ${id} from ${source} to ${destination}`);
    const system = this.system;
    const update = {
      system: {
        equipment: {}
      }
    };
    const item = this.items.get(id);
    if (source != "backpack"){
      update.system.equipment[source] = "";
    }
    if (destination != "backpack"){
      update.system.equipment[destination] = id;
    }
    //Handle two-handed items.
    //For "2H", force the item to the right hand and clear the left.
    //For "1.5H", only clear the left if the item was dragged to the right hand AND the left hand is empty. Otherwise consider it held one-handed
    if (item.system.handedness && (destination == "leftHand" || destination == "rightHand")){
      console.log("Checking for a two-handed item...");
      if (item.system.handedness == "2H" || (item.system.handedness == "1.5H" && destination == "rightHand" && !system.forceOneHanded)){
        console.log("Moved to right hand and cleared left");
        update.system.equipment.rightHand = id;
        update.system.equipment.leftHand = "";
      }
    }
    await this.update(update);
  }

  /**
   * 
   * @param {NewEraActor} recipient The actor receiving the item
   * @param {NewEraItem} item The item being transferred
   * @param {string} targetSlot The inventory slot to place the transferred item in on the recipient
   * @param {number} quantity The quantity of the item to transfer
   */
  async transferItem(recipient, item, targetSlot, quantity = 1){
    console.log(`Entering transferItem ${this.id}->${recipient.id} item=${item.id} x${quantity}`);
    if (quantity <= 0) return;
    const sourceSlot = this.findItemLocation(item);
    let newItem = null;
    let stacked = false;
    //For stackable items
    if (item.typeIs(NewEraItem.Types.STACKABLE) && !item.system.enchanted){ //Enchanted items can differ even when they have the same object ID, so avoid stacking them
      //Determine whether the recipient already has an item of the same type and object ID. If so, add the quantity to that item.
      let existingItem = null;
      if (item.system.casperObjectId){
        if (targetSlot == NewEraActor.EquipmentSlots.BACKPACK){
          existingItem = recipient.items.find(i => i.canStackWith(item) && recipient.findItemLocation(i) == NewEraActor.EquipmentSlots.BACKPACK);
        } else {
          const targetItemId = recipient.system.equipment[targetSlot];
          if (targetItemId){
            const targetItem = recipient.items.get(targetItemId);
            if (targetItem && targetItem.canStackWith(item)){
              existingItem = targetItem
            }
          }
        }
      }
      if (existingItem){
        console.log(`Found existing item ${existingItem.id} to stack ${quantity} of ${item.name} with.`);
        await existingItem.update({
          system: {
            quantity: existingItem.system.quantity + quantity
          }
        });
        newItem = existingItem;
        stacked = true;
      } else {
        console.log(`No existing item found or casperObjectId is not set. Creating a new item.`);
        newItem = await Item.create({
          ...item,
          system: {
            ...item.system,
            quantity: quantity
          }
        }, {parent: recipient});
      }
    } else {
      console.log(`Item is not stackable or is enchanted. Creating a new item.`);
      newItem = await Item.create(item, {parent: recipient});
    }

    if (targetSlot != "backpack" && !stacked){
      let recUpdate = {
        system: {
          equipment: {}
        }
      };
      recUpdate.system.equipment[targetSlot] = newItem._id;
      await recipient.update(recUpdate);
    }
      
    const remainingQuantity = item.system.quantity - quantity;
    if (remainingQuantity > 0){
      await item.update({
        system: {
          quantity: remainingQuantity
        }
      });
    } else {
      //If the remaining quantity is 0, delete the item and clear it from equipment
      if (sourceSlot != "backpack"){
        let srcUpdate = {
          system: {
            equipment: {}
          }
        };
        srcUpdate.system.equipment[sourceSlot] = "";
        await this.update(srcUpdate);
      }
      await item.delete();
    }
    if (recipient.typeIs(NewEraActor.Types.ANIMATE)){
      const frameImg = "systems/newera-sol366/resources/" + ((sourceSlot == "backpack" || targetSlot == "backpack") ? "ac_3frame.png" : "ac_1frame.png");
      if (NewEraUtils.sendEquipmentChangeMessages()){
        if (this.typeIs(NewEraActor.Types.CHARACTER) && !this.system.defeated){
          if (item.typeIs(NewEraItem.Types.STACKABLE)){
            this.actionMessage(item.img, frameImg, "{NAME} gave {0} of {d} {1} to {2}.", quantity, item.name, recipient.name);
          } else {
            this.actionMessage(item.img, frameImg, "{NAME} gave {d} {0} to {1}.", (item.type == "Phone" ? "phone" : item.name), recipient.name);
          }
        } else {
          recipient.actionMessage(item.img, this.img, "{NAME} takes the {0}.", item.name);
        }
      }
    }
  }

  /**
   * Split a stackable item into two new items of equivalent total quantity.
   * @param {NewEraItem} item The item to split
   * @param {number} quantity The quantity of the item to split off - must be at least 1 and less than the total quantity of the item
   */
  async splitStack(item, quantity){
    if (!item.typeIs(NewEraItem.Types.STACKABLE) || item.system.quantity == 1 || quantity <= 0 || quantity >= item.system.quantity) return;

    const remainingQuantity = item.system.quantity - quantity;
    await item.update({
      system: {
        quantity: remainingQuantity
      }
    });
    await Item.create({
      ...item,
      system: {
        ...item.system,
        quantity: quantity
      }
    }, {parent: this});
  }

  /** Look for all items in the inventory with the same object ID and merge them into a single item. */
  async mergeStacks(item){
    if (!item.typeIs(NewEraItem.Types.STACKABLE) || !item.system.casperObjectId || item.system.enchanted) return;
    const sameStacks = this.items.filter(i => i.canStackWith(item));
    if (sameStacks.length == 0) return;
    const totalQuantity = sameStacks.reduce((acc, i) => acc + i.system.quantity, 0) + item.system.quantity;
    await item.update({
      system: {
        quantity: totalQuantity
      }
    });
    for (const stack of sameStacks){
      await stack.delete();
    }
    ui.notifications.info(`Stacked ${totalQuantity} total ${item.name}.`); 
  }

  actionMessage(baseImage, overlayImage, template, ...args){
    const system = this.system;
    if (!system.pronouns) return; //Creatures don't currently use action messages. This might be changed later
    let html = "";
    if (baseImage){
      html += `<div class="chat-action-container"><img class="action-image-base" src="${baseImage}" />`;
      if (overlayImage){
        html += `<img class="action-image-overlay-right" src="${overlayImage}" />`;
      }
    }
    html += "</div>";
    html += `<p class="chat-narration">${this.getNarration(template, ...args)}</p>`;
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: this}),
      content: html
    });
  }

  async takeDamage(amount, dmgType, calledShot, injury = false, hitShield = false){
    let dying = false;
    let ded = false;
    const system = this.system;
    const update = {
      system: {
        hitPoints: {},
        lifePoints: {}
      }
    };
    const hasLifePoints = (this.type == "Player Character" || this.type == "Non-Player Character");
    const damageType = dmgType ? NEWERA.damageTypes[dmgType] : NEWERA.damageTypes.default;
    const shield = this.findEquippedItem(i => i.type == "Shield");
    if (hitShield && !shield){
      ui.notifications.warn("You don't have a shield equipped!");
    }
    const dmg = amount
      - (damageType.ignoreEquipped ? 0 : system.armor.equipped)
      - (damageType.ignoreNatural ? 0 : (hasLifePoints ? system.armor.natural : system.armor.bonus))
      - ((!damageType.ignoreEquipped && hitShield && shield) ? shield.system.shieldRating : 0)
    ; //Creatures don't have armor.natural - only bonus
    //console.log(`taking damage dmg=${dmg} amount=${amount} equipped=${system.armor.equipped} natural=${system.armor.natural}`);
    if (dmg > 0){
      this.actionMessage(this.img, `systems/newera-sol366/resources/dt_${damageType.label.toLowerCase()}.png`, "{NAME} takes {0} {1} damage!", dmg, damageType.label);
      if (injury && this.type != "Creature"){
        if (system.hitPoints.max > 1){
          update.system.hitPoints.max = Math.max(1, system.hitPoints.max - dmg);
          if (!system.injured){
            this.actionMessage(this.img, `${NEWERA.images}/hand-bandage.png`, "{NAME} is injured!");
          }
        } else {
          this.actionMessage(this.img, `${NEWERA.images}/lp-hot.png`, "{NAME} is gravely injured!");
        }
      }
    if (hasLifePoints){
      let dmgAfterTemporary = dmg;
      if (system.hitPoints.temporary > 0){
        dmgAfterTemporary -= system.hitPoints.temporary;
        update.system.hitPoints.temporary = Math.max(system.hitPoints.temporary - dmg, 0)
      }
      if (dmgAfterTemporary > 0){
        if (system.hitPoints.value > 0){ 
          if (system.hitPoints.value <= dmgAfterTemporary){
            const prevHp = system.hitPoints.value;
            update.system.hitPoints.value = 0;
            update.system.lifePoints.value = system.lifePoints.value - (dmgAfterTemporary - prevHp);
            this.actionMessage(this.img, `${NEWERA.images}/se_unconscious.png`, "{NAME} is down!");
            dying = true;
          } else {
            update.system.hitPoints.value = system.hitPoints.value - dmgAfterTemporary;
          }
        } else {
          update.system.lifePoints.value = system.lifePoints.value - dmgAfterTemporary;
          if (update.system.lifePoints.value <= 0){
            update.system.lifePoints.value = 0;
            this.actionMessage(`${NEWERA.images}/tombstone.png`, this.img, "{NAME} is dead!");
            ded = true;
          }
        }
      }
    } else {
      update.system.hitPoints.value = system.hitPoints.value - dmg; //Ignore life points for creatures. They just die
      if (update.system.hitPoints.value <= 0){
        update.system.hitPoints.value = 0;
        ui.notifications.info(`${this.name} has been defeated!`);
        ded = true;
      } else {
        ui.notifications.info(`${this.name} has ${system.hitPoints.value - dmg}/${system.hitPoints.max} HP remaining.`);
      }
    }
    } else if (amount > 0){
      this.actionMessage(null, null, "{NAME} took {0} damage, but it was absorbed by {d} armor!", amount);
    } else {
      //Crickets - damage was negative or zero to start with
    }
    console.log(update);
    await this.update(update);
    if (hitShield && shield && amount > shield.system.shieldRating){
      shield.durabilityCheck();
    }
    if (ded){
      const dying = this.effects.find(e => e.label == "Dying");
      if (dying) {
        dying.delete();
      }
      await this.createEmbeddedDocuments('ActiveEffect', [NEWERA.statusEffects.dead[1]]);
    } else if (dying) {
      await this.createEmbeddedDocuments('ActiveEffect', [NEWERA.statusEffects.dying[1]]);
    }
  }

  async heal(amount, overheal = false, recovery = false){
    const system = this.system;
    const update = {
      system: {
        hitPoints: {},
        lifePoints: {}
      }
    };

    //Injury recovery
    if (recovery && system.hitPoints.max < system.hitPointTrueMax) {
      const newMax = system.hitPoints.max + parseInt(amount);
      update.system.hitPoints.max = Math.min(system.hitPointTrueMax, newMax);
      this.actionMessage(this.img, `${NEWERA.images}/hand-bandage.png`, "{NAME} recovers from {d} injuries.");
      await this.update(update);
    }

    //Continue with healing regular HP after updating max HP from injuries
    const prevHp = system.hitPoints.value;
    const newHp = system.hitPoints.value + parseInt(amount);
    const max = system.hitPoints.max;
    update.system.hitPoints.value = Math.min(newHp, max);
    const gained = update.system.hitPoints.value - prevHp;
    if (newHp > max){
      const excess = newHp - max;
      if (overheal){
        update.system.hitPoints.temporary = system.hitPoints.temporary + excess;
        this.actionMessage(this.img, `${NEWERA.images}/hp-hot.png`, "{NAME} recovers {0} hit points and gains {1} temporary hit points.", gained, excess);
      } else if (system.lifePoints.value < system.lifePoints.max){
        const newLp = Math.min(system.lifePoints.value + excess, system.lifePoints.max);
        const gainedLp = newLp - system.lifePoints.value;
        update.system.lifePoints.value = newLp;
        this.actionMessage(this.img, `${NEWERA.images}/hp-hot.png`, "{NAME} recovers {0} hit points and {1} life points.", gained, gainedLp);
      } else if (gained > 0) {
        this.actionMessage(this.img, `${NEWERA.images}/hp-hot.png`, "{NAME} recovers {0} hit points.", gained);
      } else {
        //Character didn't actually gain any HP.
      }
    } else {
      this.actionMessage(this.img, `${NEWERA.images}/hp-hot.png`, "{NAME} recovers {0} hit points.", gained);
    }
    
    console.log(`HEAL A=${amount} PREV=${prevHp} NEW=${newHp} MAX=${max} G=${gained}`);
    console.log(update);
    await this.update(update);
  }

  async increaseMaxHp(clazz, roll){
    const system = this.system;
    const className = clazz.system.classId;
    const update = {
      system: {
        lifePoints: {},
        hitPoints: {}
      }
    };
    if (roll){
      const r = new Roll(`${ClassInfo.hitPointIncrements[className].roll}+@abilities.constitution.mod`, this.getRollData());
      await r.evaluate();
      r.toMessage({
        speaker: ChatMessage.getSpeaker({actor: this}),
        flavor: `Max HP Increase - ${clazz.system.selectedClass} Level ${system.level}`
      })
      const gained = Math.max(r.total, 1); //Characters with low CON modifiers could get a negative result - guarantee at least 1 HP per level
      update.system.hitPointTrueMax = system.hitPointTrueMax + gained;
      update.system.hitPoints.max = system.hitPoints.max + gained;
      update.system.hitPoints.value = system.hitPoints.value + gained;
    } else {
      const average = ClassInfo.hitPointIncrements[className].average;
      const gained = Math.max(average + system.abilities.constitution.mod, 1);
      update.system.hitPointTrueMax = system.hitPointTrueMax + gained;
      update.system.hitPoints.max = system.hitPoints.max + gained;
      update.system.hitPoints.value = system.hitPoints.value + gained;
    }
    update.system.lifePoints.max = system.lifePoints.max + 5;
    update.system.lifePoints.value = system.lifePoints.value + 5;

    await this.update(update);
  }

  async rollInitialHP(){
    const system = this.system;
    const initHpRoll = new Roll(`${system.initialHitPoints.dieCount}d${system.initialHitPoints.dieSize} + ${system.initialHitPoints.modifier}`, this.getRollData());
    await initHpRoll.evaluate();
    await this.update({
      system: {
        hitPoints: {
          value: initHpRoll.total,
          max: initHpRoll.total
        }
      }
    });
    initHpRoll.toMessage({
      speaker: ChatMessage.getSpeaker({actor: this}),
      flavor: "Starting Hit Points"
    });
  }

  getSpecialModifier(key){
    const system = this.system;
    if (!system.specialModifiers) return 0;
    for (const [k, v] of Object.entries(system.specialModifiers)){
      if (v.subject == key){
        return v.mod;
      }
    }
    return 0;
  }

  async rest(hours, extraRestful){
    const system = this.system;

    //Overheal and overcharge reset on any rest - do this before the next steps so it doesn't look like they gained negative HP
    if (system.hitPoints.value > system.hitPoints.max){
      system.hitPoints.value = system.hitPoints.max; 
    }
    if (system.energy.value > system.energy.max){
      system.energy.value = system.energy.max; 
    }

    if (hours < 1) return;

    let hoursToLongRest = 8;
    if (extraRestful) hoursToLongRest -= 4;
    if (this.hasFeatOrFeature("Insomnia")) hoursToLongRest += 2;

    const isLongRest = (hours >= hoursToLongRest);
    const extraRestHours = (hours - hoursToLongRest); //The number of additional hours rested beyond the long-rest threshold
    const gained = {
      hitPoints: 0,
      energy: 0,
      lifePoints: 0
    }

    /*
      A successful full rest completely restores energy and life points.
      A short rest doesn't affect life points, and restores energy equal to caster level per hour.
      Any rest, short or long, restores HP equal to level per hour.

      Add exhaustion reduction by 1 to this in v0.10 after active effects are completed.
    */
    if (isLongRest) {
      //Fully restore life points and energy
      gained.lifePoints = system.lifePoints.max - system.lifePoints.value;
      gained.energy = system.energy.max - system.energy.value;
      //Fully refresh any daily resources
      const resUpdate = structuredClone(system.additionalResources);
      Object.values(resUpdate).forEach(r => {
        if (r.daily){
          r.value = r.max;
        }
      });
      await this.update({
        system: {additionalResources: resUpdate}
      });
    } else {
      const recoverableEnergy = system.energy.max - system.energy.value;
      gained.energy = Math.min(recoverableEnergy, system.casterLevel * hours);
    }

    const recoverableHp = system.hitPoints.max - system.hitPoints.value;
    const hpToGain = system.level == 0 ? hours : system.level * hours;
    const excessRecovery = Math.min(0, hpToGain - recoverableHp);
    gained.hitPoints = Math.min(recoverableHp, hpToGain);

    if (gained.energy){
      this.actionMessage(this.img, `${NEWERA.images}/ac_restful.png`, "{NAME} rests for {0} hours. {S} recover{s|} {1} hit points and {2} energy.", hours, gained.hitPoints, gained.energy);
    } else {
      this.actionMessage(this.img, `${NEWERA.images}/ac_restful.png`, "{NAME} rests for {0} hours and recovers {1} hit points.", hours, gained.hitPoints);
    }

    if (excessRecovery > 0){
      const r = new Roll(`d20 + ${excessRecovery}`);
      await r.evaluate();
      r.toMessage({
        speaker: ChatMessage.getSpeaker({actor: this}),
        flavor: "Resting Check"
      });
      if (r.total > 20) {
        this.actionMessage(null, null, "{NAME} awakens feeling Well Rested.");
      } else if (r.total > 10) {
        this.actionMessage(null, null, "{NAME} awakens feeling Rested.");
      }
    }

    await this.update({
      system: {
        energy: {
          value: system.energy.value + gained.energy
        },
        lifePoints: {
          value: system.lifePoints.value + gained.lifePoints
        },
        hitPoints: {
          value: system.hitPoints.value + gained.hitPoints
        }
      }
    });

    return system.hitPoints.value;
  }

  get modifierList() {
    const output = [];
    const system = this.system;
    //console.log(data);
    Object.keys(system.abilities).forEach(a => {
      output.push({
        name: a,
        type: "abilities"
      });
    });
    Object.keys(system.skills).forEach(a => {
      output.push({
        name: a,
        type: "skills"
      });
    });
    Object.keys(system.magic).forEach(a => {
      output.push({
        name: a,
        type: "magic"
      });
    });
    Object.values(system.knowledges).forEach(obj => {
      output.push({
        name: obj.subject,
        type: "knowledges"
      });
    });
    Object.values(system.specialties).forEach(obj => {
      output.push({
        name: obj.subject,
        type: "specialties"
      });
    });
    return output;
  }

  async improveSkill(key, type){
    console.log(`[DEBUG] Entering improveSkill key=${key} type=${type}`);
    const system = this.system;
    const skillset = (type == "skills" ? system.skills : (type == "magic" ? system.magic : system.knowledges));
    const currentLevel = skillset[key].level;
    const skillName = (type == "knowledges" ? `Knowledge: ${system.knowledges[key].subject}` : game.i18n.localize(`newera.skill.${key}.name`));
    if (currentLevel >= 10){
      ui.notifications.error(`Your ${skillName} skill is already at the maximum level of 10.`);
      return;
    }
    const cost = NEWERA.skillImprovementCosts[currentLevel];
    const reqLevel = NEWERA.skillImprovementMinLevel[currentLevel];
    if (cost > system.characterPoints.cpa){
      ui.notifications.error(`Increasing a skill to ${currentLevel+1} costs ${cost} character points. You don't have enough.`);
      return;
    }
    if (system.level < reqLevel){
      ui.notifications.error(`You must be overall level ${reqLevel} or higher to increase a skill to ${currentLevel+1}.`);
      return;
    }
    await Item.create({
      name: `Skill Improvement - ${skillName} ${currentLevel + 1}`,
      type: "Feat",
      system: {
        featType: "SI",
        featSubType: type == "knowledges" ? "brain" : key, //This sets the feat's image
        currentTier: 1,
        maximumTier: 1,
        isUpgrade: false,
        base: {
          cost: cost,
          description: "",
          prerequisites: "",
          conflicts: ""
        }
      }
    }, {parent: this});
    const systemUpdateData = {};
    switch(type){
      case "skills":
        systemUpdateData.skills = {};
        systemUpdateData.skills[key] = {
          level: currentLevel + 1
        };
        break;
      case "magic":
        systemUpdateData.magic = {};
        systemUpdateData.magic[key] = {
          level: currentLevel + 1
        };
        break;
      case "knowledges":
        systemUpdateData.knowledges = {};
        systemUpdateData.knowledges[key] = {
          level: currentLevel + 1
        };
        break;
    }
    await this.update({
      system: systemUpdateData
    });
    ui.notifications.info(`You spent ${cost} CP to increase your ${skillName} skill to ${currentLevel+1}.`);
  }

  async applyStatusEffect(category, level, duration){
    const effect = structuredClone(NEWERA.statusEffects[category][level]);
    effect.duration = duration;
    this.createEmbeddedDocuments("ActiveEffect", [effect]);
  }

  async updateStatusEffectLevel(effectId, category, level){
    const effect = this.effects.get(effectId);
    const replacement = NEWERA.statusEffects[category][level];
    effect.update({
      name: replacement.name,
      description: replacement.description
    });
  }

  async sustain(energyPool = undefined){
    if (energyPool === undefined){
      if (this.type == "Player Character" || this.type == "Non-Player Character"){
        energyPool = new CharacterEnergyPool(this);
      } else if (this.type == "Creature"){
        energyPool = null;
      }
    }

    const spell = this.items.get(this.system.sustaining.id);
    const ampFactor = this.system.sustaining.ampFactor;
    if (!spell){
      return;
    }

    const energyCost = spell.system.energyCost * ampFactor;
    if (energyPool){
      await energyPool.use(energyCost, new CharacterEnergyPool(this));
    }

    this.actionMessage(this.img, spell.img, `{NAME} sustains {0}.`, spell.name+(ampFactor>1 ? " "+NEWERA.romanNumerals[ampFactor] : ""));
  }

  async cast(spell, ampFactor = 1, noSkillCheck = false, energyPool = undefined){
      if (energyPool === undefined){
        if (this.type == "Player Character" || this.type == "Non-Player Character"){
          energyPool = new CharacterEnergyPool(this);
        } else if (this.type == "Creature"){
          energyPool = null;
        }
      }
      const level = spell.system.level * ampFactor;
      const spellSkill = spell.system.form;
      const spellSkillLevel = spellSkill == "genericCast" ? this.system.casterLevel : this.system.magic[spellSkill].level;
      const difficulty = noSkillCheck ? 0 : (level <= spellSkillLevel ? 0 : 5 + ((level - spellSkillLevel) * 5));
      const energyCost = spell.system.energyCost * ampFactor;
      let totalEnergyCost = energyCost;
      let alwaysRoll = false;
      let attackMod = '';
      let rollPrefix = '';
      let rollSuffix = '';
      let successful = false;

      //For complex enchantments - cast the component list, then proceed to the regular logic for the final roll
      if (spell.type == 'Enchantment' && spell.system.enchantmentType == 'CE') {
        const stepResults = await this.castComplexComponents(spell);
        if (!stepResults.success) {
          if (energyPool){
            await energyPool.use(stepResults.energyUsed, new CharacterEnergyPool(this));
          }
          return false;
        } else {
          totalEnergyCost += stepResults.energyUsed;
        }
      }
      
      switch (spell.spellRollMode) {
        case "ranged": //The projectile keyword takes precedence over all other roll conditions
          alwaysRoll = true;
          attackMod = '@skills.marksmanship.mod';
          rollPrefix = "Ranged Spell Attack -";
          break;
        case "melee": //This mode is not used as of S366 v1.3 but might be in the future
          alwaysRoll = true;
          attackMod = spell.system.castType == 'G' ? '@skills.two-handed.mod' : '@skills.one-handed.mod';
          rollPrefix = spell.system.castType == 'G' ? "Two-Handed Spell Attack -" : "One-Handed Spell Attack -";
          break;
        case "contested": //If the spell has a contested check/save, always roll (but don't set an attack mod)
          alwaysRoll = true;
          rollPrefix = "Cast";
          rollSuffix = " (Contested) ";
          attackMod = '0';
          break;
        case "wildMagic": //Same if the spell is crafted and is anything less than perfected, as there's a possibility of wild magic on a low roll
          alwaysRoll = true;
          rollPrefix = "Cast";
          rollSuffix = ` (${NEWERA.spellcraftSuffixes[spell.system.refinementLevel]}) `;
          attackMod = '0';
          break;
        default:
        case "cast":
          alwaysRoll = false;
          attackMod = '0';
          rollPrefix = "Cast";
          break;
      }

      if (this.type == 'Creature') {
        const spellAttr = NEWERA.schoolAttributes[spell.system.form];
        const castRoll = new Roll(`d20 + @abilities.${spellAttr}.mod + @special.${spell.system.specialty} + @special.spellcasting`, this.getRollData());
        await castRoll.evaluate();
        castRoll.toMessage({
          speaker: ChatMessage.getSpeaker({actor: this}),
          flavor: `Cast ${spell.name} ${ampFactor > 1 ? NEWERA.romanNumerals[ampFactor] : ""}`
        });
        successful = true;
      } else if (!alwaysRoll && difficulty == 0){
        this.actionMessage(this.img, `${NEWERA.images}/${spell.system.specialty}.png`, "{NAME} casts {0}!", `${spell.name}${ampFactor > 1 ? ` ${NEWERA.romanNumerals[ampFactor]}` : ""}`);
        successful = true;
      } else {
        const castRoll = new Roll(`d20 + ${spellSkill == "genericCast" ? `@casterLevel` : `@magic.${spellSkill}.mod`} + @specialty.partial.${spell.system.specialty} + ${attackMod} + ${spell.spellcraftModifier}`, this.getRollData());
        await castRoll.evaluate();
        successful = (castRoll.total >= difficulty);
        castRoll.toMessage({
          speaker: ChatMessage.getSpeaker({actor: this}),
          flavor: `${rollPrefix} ${spell.name} ${ampFactor > 1 ? NEWERA.romanNumerals[ampFactor] : ""}${rollSuffix}${difficulty > 0 ? `(Difficulty ${difficulty})` : ""}`
        });
      } 

      /**
       * Apply Sustaining effect when starting a sustained spell
       */
      if (spell.system.castType == "F" && successful){
        let existingSustain = this.effects.find(e => e.label.includes("Sustaining"));
        if (existingSustain){
          existingSustain.delete();
        }
        await this.update({
          system: {
            sustaining: {
              id: spell._id,
              ampFactor: ampFactor
            }
          }
        });
        await this.createEmbeddedDocuments("ActiveEffect", [{
          label: `Sustaining: ${spell.name}${ampFactor > 1 ? " "+NEWERA.romanNumerals[ampFactor] : ""}`,
          img: spell.img,
          description: `<p>You're sustaining a spell.</p>
          ${NewEraUtils.amplifyAndFormatDescription(spell.system.description, ampFactor, "S")}
          <p>You can use any number of frames on your turn to sustain the spell. You can continue sustaining it as long as you spend at least one frame doing so during your turn.
          You stop sustaining the spell if your concentration is broken.</p>`,
          origin: spell._id
        }]);
      } else if (spell.system.keywords.includes("Ephemeral") && successful) {
        await this.update({
          system: {
            ephemeralEffectActive: true
          }
        });
        await this.createEmbeddedDocuments("ActiveEffect", [{
          label: `Casting: ${spell.name}${ampFactor > 1 ? " "+NEWERA.romanNumerals[ampFactor] : ""}`,
          img: spell.img,
          description: `<p>You're casting an Ephemeral spell.</p>
          <p>You can end this effect at any time as a free action from the Actions tab.</p>
          ${NewEraUtils.amplifyAndFormatDescription(spell.system.description, ampFactor, "S")}`,
          origin: spell._id
        }]);
      }

      if (successful && this.type != 'Creature'){
        spell.printDetails(this, ampFactor);
      }

      if (energyPool){
        await energyPool.use(totalEnergyCost, new CharacterEnergyPool(this));
      }
      return successful;
  }

  async castComplexComponents(enchantment, ampFactor = 1) {
    let energyConsumed = 0;
    for (const [stepNo, component] of Object.entries(enchantment.system.components)) {
      energyConsumed += (component.energyCost * (component.scales ? ampFactor : 1));
      const school = NEWERA.schoolOfMagicNames[component.check];
      const form = NEWERA.schoolToFormMapping[component.check];
      const spellSkillLevel = form == "genericCast" ? this.system.casterLevel : this.system.magic[form].level;
      const level = component.level * (component.scales ? ampFactor : 1);
      const difficulty = level <= spellSkillLevel ? 0 : 5 + ((level - spellSkillLevel) * 5);
      if (difficulty > 0) {
        const castRoll = new Roll(`d20 + ${form == "genericCast" ? `@casterLevel` : `@magic.${form}.mod`} + @specialty.partial.${school}`, this.getRollData());
        await castRoll.evaluate();
        const successful = (castRoll.total >= difficulty);
        castRoll.toMessage({
          speaker: ChatMessage.getSpeaker({actor: this}),
          flavor: `Step ${parseInt(stepNo)+1}: ${component.name} (Difficulty ${difficulty})`
        });
        if (!successful) {
          return {
            energyUsed: energyConsumed,
            success: false
          };
        }
      } else {
        console.log(`Skipped rolling for step ${parseInt(stepNo)+1} because difficulty is 0`);
      }
    }
    return {
      energyUsed: energyConsumed,
      success: true
    };
  }

  async stopAllSpells(){
    await this.endSpell(true);
    await this.stopSustaining();
  }

  async endSpell(message = true){
    const spellEffect = this.effects.find(e => e.label.includes("Casting: "));
    if (spellEffect){
      const spell =  this.items.get(spellEffect.origin);
      await spellEffect.delete();
      if (message) {
        this.actionMessage(this.img, null, "{NAME} cancels {0}.", spell ? spell.name : "the spell");
      }
    }
    await this.update({
      system: {
        ephemeralEffectActive: false
      }
    });
}
    async stopSustaining(){
        const sustainEffect = this.effects.find(e => e.label.includes("Sustaining: "));
        if (sustainEffect){
          await sustainEffect.delete();
        }
        await this.update({
          system: {
            sustaining: {
              id: "",
              ampFactor: 1
            }
          }
        })
    }

    async usePotion(potion, qty){
      const qtyAvailable = potion.system.quantity;
      const qtyUsed = Math.min(qty, qtyAvailable);
      await potion.printDetails(this, qtyUsed);
      if (qtyUsed == qtyAvailable){
        await potion.delete();
      } else {
        await potion.update({
          system: {
            quantity: qtyAvailable - qtyUsed
          }
        });
      }
      //Add a number of empty bottles to the user's inventory
      if (game.settings.get("newera-sol366", "giveEmptyPotionBottles")){
        //Find a stack of bottles
        const bottles = this.items.find(i => i.type == "Item" && i.system.casperObjectId == NEWERA.EMPTY_POTION_BOTTLE_ID);
        if (bottles){
          await bottles.update({
            system: {
              quantity: bottles.system.quantity + qtyUsed
            }
          });
        } else {
          await Item.create({
            name: "Empty Potion Bottle",
            type: "Item",
            img: `${NEWERA.images}/empty_bottle.png`,
            system: {
              casperObjectId: NEWERA.EMPTY_POTION_BOTTLE_ID,
              quantity: qtyUsed,
              rarity: 0,
              description: `<p>An empty 8 ounce glass bottle that once held a potion. Re-use it for brewing new ones!</p>`,
              actions: {},
              weight: 0,
              value: 0,
              equipSlot: "C",
              stored: false
            }
          }, {parent: this});
        }
      }
    }

    /* Determines whether an action should be shown based on the action's type and the location within the actor's equipment */
    isItemActionAvailable(action, item){
      if (game.settings.get("newera-sol366", "enforceActionConditions")){
        const showWhen = action.show;
        const location = this.findItemLocation(item);
        const equipment = this.system.equipment;
        //console.log(`IIAA item=${item._id} show=${showWhen} location=${location}`);
        //console.log(action);
        //console.log(item);
      let available = false;
      switch (showWhen){
        case "always":
          available = true;
          break;
        case "equipped":
          available = ["leftHand", "rightHand", "head", "neck", "waist", "body", "outfit", "feet", "hands", "phone"].includes(location);
          break;
        case "worn":
          available = (location && location!="backpack");
          break;
        case "oneHanded": //Only used for 1.5H equipment
          available = (location == "leftHand"
            || (location == "rightHand" && equipment.leftHand != "")
            || (location == "rightHand" && this.system.forceOneHanded)
          );
          break;
        case "twoHanded": //Only used for 1.5H equipment
          available = (location == "rightHand" && (!equipment.leftHand || !this.system.forceOneHanded));
          break;
        default:
          available = (showWhen == location);
          break;
        }
        //console.log(`available=${available}`);
        return available;
      } else {
        return true;
      }
    }  

    /* Returns the current equipment slot location of the specified item. Returns "backpack" if the item is not equipped anywhere, and null if not owned by the actor at all. */
    findItemLocation(item){
      if (!this.typeIs(NewEraActor.Types.CHARACTER)){
        return "backpack";
      }
      const equipment = this.system.equipment;
      for (const [k, v] of Object.entries(equipment)){
        if (v == item._id){
          return k;
        }
      }
      for (const i of this.items.contents){
        if (i._id == item._id){
          return "backpack";
        }
      }
      return null;
    }

    hasItemInHand(item){
      return ["rightHand", "leftHand"].includes(this.findItemLocation(item));
    }

  /* 
    Find an item action based on the name and some characteristics of the item it was created from.
    This is more of a 'close enough' comparison. If there are two items with the same or very similar properties, the one that's equipped should take priority.
  */
  findItemAction(name, compareData){
    for (const item of this.items){
      if (item.type == "Melee Weapon"){

      } else if (item.type == "Ranged Weapon"){

      } else if (item.type == "Shield"){

      } else if (item.type == "Feat"){

      }
    }
  }

  getSpecialResource(name){
    const resource = this.system.additionalResources.find(r => r.name == name);
    if (!resource) {
      return null;
    } else {
      return resource.value;
    }
  }

  useSpecialResource(name){
    const resource = this.system.additionalResources.find(r => r.name == name);
    if (resource) {
      this.update({
        system: {
          additionalResources: {
            
          }
        }
      })
    }
  }

  /**
   * Returns an object with information about all the different energy pool options (i.e. Focus Energy, Dark Energy) available to this actor when casting spells.
   */
  get energyPools() {
    if (!["Player Character", "Non-Player Character"].includes(this.type)){
      return [];
    }
    if (this.system.casterLevel > 0) {
      let pools = [];
      pools.push(new CharacterEnergyPool(this));
      pools = pools.concat(Witch.getDarkEnergyPools(this));
      return pools;
    } else {
      return [];
    }
    
  }

  hasEnergyAvailable(amount = 1){
    for (const pool of this.energyPools){
      if (pool.available >= amount){
        return true;
      }
    }
    return false;
  }

  hasFeatOrFeature(text){
    if (!this.typeIs(NewEraActor.Types.PC)) {
      return false;
    }
    //console.log(`[DEBUG] Checking for feature: ${text}`);
    if (this.items.find(i => i.type == "Feat" && i.name.toLowerCase() == text.toLowerCase())) {
      //console.log(`[DEBUG] Found in feats`);
      return true;
    }
    let foundFeature = false;
    Object.entries(this.system.classes).forEach(([key, obj]) => {
      if (ClassInfo.features[key]){
        const feature = ClassInfo.features[key].find(f => f.name && f.name.toLowerCase() == text.toLowerCase());
        if (feature){
          //console.log(`[DEBUG] found feature ${feature.name} in ${key}`);
          if (parseInt(feature.level) <= parseInt(obj.level)){
            foundFeature = true;
          }
        }
      }
    });
    return foundFeature;
  }

  /**
   * Checks for and returns the first item found equipped in a primary equipment slot.
   * Checks the right hand first, then the left hand, for a match to the supplied condition.
   * If no item is found, returns null.
   * @param {} condition An anonymous function to check items against, similar to Array.prototype.find()
   * @param {*} allowWorn If true, checks worn items and accesory slots after the hands.
   */
  findEquippedItem(condition, allowWorn = false){
    if (this.system.equipment){
        if (this.system.equipment.rightHand){
          const rightHandItem = this.items.get(this.system.equipment.rightHand);
          if (rightHandItem && condition(rightHandItem)){
            return rightHandItem;
          }
        }
        if (this.system.equipment.leftHand){
          const leftHandItem = this.items.get(this.system.equipment.leftHand);
          if (leftHandItem && condition(leftHandItem)){
            return leftHandItem;
          }
        }
        if (allowWorn){
          for (const [slot, itemId] of Object.entries(this.system.equipment)){
            const item = this.items.get(itemId);
            if (item && condition(item)){
              return item;
            }
          }
        }
        return null;
    } else {
      return null;
    }
  }

  async setDefeated(defeated){
    if (this.typeIs(NewEraActor.Types.INANIMATE)) return;
    await this.update({
      system: {
        defeated: defeated
      },
      ownership: {
        default: defeated ? 3 : 0
      }
    });
    if (defeated){
      this.items.forEach(item => {
        if (item.typeIs(NewEraItem.Types.STACKABLE) && item.system.rollQuantity){
          item.rollQuantity();
        }
      });
    }
  }

  async lockUnlockContainer(){
    const ownership = (this.ownership.default == 3) ? 0 : 3;
    await this.update({
      ownership: {
        default: ownership
      }
    });
    if (ownership == 3){
      ui.notifications.info(`${this.name} is now UNLOCKED. Players can open and change the token and take items.`);
      this.items.forEach(item => {
        if (item.typeIs(NewEraItem.Types.STACKABLE) && item.system.rollQuantity){
          item.rollQuantity();
        }
      });
    } else {
      ui.notifications.info(`${this.name} is now LOCKED.`);
    }
  }

  getLearningExperienceOptions(){
    const output = {};
    for (const [k, v] of Object.entries(this.system.knowledges)){
      if (v.level == 10){
        output[k] = v.subject + " (Max Level)";
      } else {
        output[k] = v.subject;
      }
    }
    return output;
  }

  getSpecialtyImprovementOptions(){
    const output = {};
    for (const [k, v] of Object.entries(this.system.specialties)){
      if (v.level == 3){
        output[k] = v.subject + " (Max Level)";
      } else {
        output[k] = v.subject;
      }
    }
    return output;
  }

  getSkillOptions(){
    return {
      ...NEWERA.defaultSkillOptions,
      ...this.getLearningExperienceOptions()
    }
  }

  getNaturalSkillOptions(){
    let output = {};
    for (const [key, obj] of Object.entries(this.system.skills)){
      if (obj.natural) {
        output[key] = NewEraUtils.keyToTitle(key);
      }
    }
    for (const [key, obj] of Object.entries(this.system.magic)){
      if (obj.natural) {
        output[key] = NewEraUtils.keyToTitle(key) + " Magic";
      }
    }
    return output;
  }

  /**
   * Updates the data on all owned items that have a casperObjectId property with refreshed data from the latest compendiums.
   * Some properties are preserved from the old items if they have been modified by the user.
   */
  async updateItems(){
    ui.notifications.warn(`Update initiated. Please wait a few seconds before doing anything else with ${this.name}.`);
    console.log(`Initiating item update for ${this.name}`);
    const spellsEnchantments = await game.packs.get('newera-sol366.spells').getDocuments();
    const equipment = await game.packs.get('newera-sol366.equipment').getDocuments();
    const consumables = await game.packs.get('newera-sol366.consumables').getDocuments();
    const feats = await game.packs.get('newera-sol366.feats').getDocuments();
    const weapons = await game.packs.get('newera-sol366.weapons').getDocuments();
    const artifacts = await game.packs.get('newera-sol366.potionsArtifacts').getDocuments();
    const wearables = await game.packs.get('newera-sol366.wearables').getDocuments();
    const actions = await game.packs.get('newera-sol366.actions').getDocuments();

    for (const item of this.items){
      console.log(`Checking for update: ${item.name} [${item.system.casperObjectId}]`);
      if (item.typeIs(NewEraItem.Types.MAGIC) && item.system.casperObjectId && item.system.rarity > 0){
        const fromComp = spellsEnchantments.find(i => i.type == item.type && i.system.casperObjectId == item.system.casperObjectId);
        if (fromComp){
          await item.update({
            name: fromComp.name,
            system: {
              ...fromComp.system,
              ampFactor: item.system.ampFactor
            }
          });
          console.log(`${item.name} Updated (spell/ench - ${fromComp.id})`);
        } else {
          console.log(`${item.name} Not Updated - No Compendium Match`);
        }
      } else if (item.typeIs(NewEraItem.Types.FEAT) && item.system.casperObjectId){
        const fromComp = feats.find(i => i.system.casperObjectId == item.system.casperObjectId);
        if (fromComp){
          await item.update({
            name: fromComp.name,
            system: {
              ...fromComp.system,
              currentTier: item.system.currentTier,
              tiers: {
                ...fromComp.system.tiers,
                "-=base": null
              }
            }
          });
          console.log(`${item.name} Updated (feat - ${fromComp.id})`);
        } else {
          console.log(`${item.name} Not Updated - No Compendium Match`);
        }
      } else if (item.typeIs(NewEraItem.Types.WEAPON) && item.system.casperObjectId){
        const fromComp = weapons.find(i => i.system.casperObjectId == item.system.casperObjectId)
          || artifacts.find(i => i.system.casperObjectId == item.system.casperObjectId);
        if (fromComp){
          if (item.typeIs(NewEraItem.Types.MELEE_WEAPON)) {
            await item.update({
              name: fromComp.name,
              system: {
                ...fromComp.system,
                stored: item.system.stored,
                customName: item.system.customName,
                useCustomItemName: item.system.useCustomItemName,
                condition: item.system.condition,
                quality: item.system.quality,
                //Preserve enchantment data
                enchanted: item.system.enchanted,
                arcane: item.system.arcane,
                enchantmentDescriptor: item.system.enchantmentDescriptor,
                enchantmentColor: item.system.enchantmentColor,
                totalEnchantmentLevel: item.system.totalEnchantmentLevel,
                useCharge: item.system.useCharge,
                charges: item.system.charges,
                recharge: item.system.recharge
              }
            });
          } else if (item.typeIs(NewEraItem.Types.RANGED_WEAPON)) {
            await item.update({
              name: fromComp.name,
              system: {
                ...fromComp.system,
                stored: item.system.stored,
                condition: item.system.condition,
                quality: item.system.quality,
                ammo: {
                  ...fromComp.system.ammo,
                  loaded: item.system.ammo.loaded
                },
                //Preserve enchantment data
                enchanted: item.system.enchanted,
                arcane: item.system.arcane,
                enchantmentDescriptor: item.system.enchantmentDescriptor,
                enchantmentColor: item.system.enchantmentColor,
                totalEnchantmentLevel: item.system.totalEnchantmentLevel,
                useCharge: item.system.useCharge,
                charges: item.system.charges,
                recharge: item.system.recharge
              }
            });
          }
          console.log(`${item.name} Updated (weapon - ${fromComp.id})`);
        } else {
          console.log(`${item.name} Not Updated - No Compendium Match`);
        }
      } else if (item.typeIs(NewEraItem.Types.BASIC_ITEM) && item.system.casperObjectId){
        const fromComp = equipment.find(i => i.system.casperObjectId == item.system.casperObjectId)
          || consumables.find(i => i.system.casperObjectId == item.system.casperObjectId)
          || artifacts.find(i => i.system.casperObjectId == item.system.casperObjectId)
          || wearables.find(i => i.system.casperObjectId == item.system.casperObjectId);
        if (fromComp) {
          await item.update({
          name: fromComp.name,
          system: {
            ...fromComp.system,
            quantity: item.system.quantity,
            stored: item.system.stored,
            //Preserve enchantment data
            enchanted: item.system.enchanted,
            arcane: item.system.arcane,
            enchantmentDescriptor: item.system.enchantmentDescriptor,
            enchantmentColor: item.system.enchantmentColor,
            totalEnchantmentLevel: item.system.totalEnchantmentLevel,
            useCharge: item.system.useCharge,
            charges: item.system.charges,
            recharge: item.system.recharge
          }
        });
        console.log(`${item.name} Updated (item - ${fromComp.id})`);
        } else {
            console.log(`${item.name} Not Updated - No Compendium Match (item)`);
        }
      } else if (item.typeIs(NewEraItem.Types.ARMOR_TABLE) && item.system.casperObjectId){
        const fromComp = equipment.find(i => i.system.casperObjectId == item.system.casperObjectId)
          || wearables.find(i => i.system.casperObjectId == item.system.casperObjectId)
          || artifacts.find(i => i.system.casperObjectId == item.system.casperObjectId);
          if (fromComp){
            await item.update({
              name: fromComp.name,
              system: {
                ...fromComp.system,
                stored: item.system.stored,
                condition: item.system.condition,
                quality: item.system.quality,
                //Preserve enchantment data
                enchanted: item.system.enchanted,
                arcane: item.system.arcane,
                enchantmentDescriptor: item.system.enchantmentDescriptor,
                enchantmentColor: item.system.enchantmentColor,
                totalEnchantmentLevel: item.system.totalEnchantmentLevel,
                useCharge: item.system.useCharge,
                charges: item.system.charges,
                recharge: item.system.recharge
              }
            });
            console.log(`${item.name} Updated (armor/shield - ${fromComp.id})`);
          } else {
            console.log(`${item.name} Not Updated - No Compendium Match (armor/shield)`);
          }
      } else if (item.typeIs(NewEraItem.Types.POTION) && item.system.casperObjectId){
        const fromComp = artifacts.find(i => item.typeIs(NewEraItem.Types.POTION) && i.system.casperObjectId == item.system.casperObjectId);
        if (fromComp) {
          await item.update({
          name: fromComp.name,
          system: {
            ...fromComp.system,
            quantity: item.system.quantity,
            stored: item.system.stored
          }
        });
        console.log(`${item.name} Updated (potion - ${fromComp.id})`);
        } else {
            console.log(`${item.name} Not Updated - No Compendium Match (potion)`);
        }
      } else if (item.typeIs(NewEraItem.Types.ACTION) && item.system.casperObjectId){
        const fromComp = actions.find(i => i.system.casperObjectId == item.system.casperObjectId);
          if (fromComp){
            await item.update({
              name: fromComp.name,
              system: fromComp.system
            });
            console.log(`${item.name} Updated (action - ${fromComp.id})`);
          } else {
            console.log(`${item.name} Not Updated - No Compendium Match (action)`);
          }
      } else {
        console.log(`${item.name} Not Updated - Not a supported type or not from a compendium`);
      }
      //Migration of legacy (0.14 and earlier) custom feats to new structure
      if (item.typeIs(NewEraItem.Types.FEAT) && !item.system.casperObjectId) {
        await item.update({
          system: {
            base: item.system.tiers.base,
            tiers: {
              "-=base": null
            }
          }
        });
        console.log(`Migrated custom feat ${this.name} to v0.15 schema`);
      }
    }
    ui.notifications.info(`Item update for ${this.name} complete.`);
  }

  async putAwayAll(store = false){
    const wornItems = {};
    for (let i=0; i<this.system.wornItemSlots; i++){
      wornItems[`worn${i}`] = "";
    }
    await this.update({
      system: {
        equipment: {
          "leftHand": "",
					"rightHand": "",
					"head": "",
					"feet": "",
					"hands": "",
					"body": "",
					"outfit": "",
					"neck": "",
					"waist": "",
					"phone": "",
          ...wornItems
        }
      }
    });
    if (store) {
      this.items.forEach(item => {
        if (item.typeIs(NewEraItem.Types.INVENTORY)) {
          item.update({
            system: {
              stored: true
            }
          });
        }
      });
    }
  }

  findAmmoFor(item) {
    if (!item.typeIs(NewEraItem.Types.RANGED_WEAPON)) {
      return null;
    }
    const priority = game.settings.get("newera-sol366", "ammoPriority");
    const compatibleAmmoIds = NEWERA.compatibleAmmoIds[item.system.ammo.type];
    if (priority == "strongest") {
      for (const id of compatibleAmmoIds) {
        const ammo = this.items.contents.find(i => i.type == "Item" && i.system.casperObjectId);
        if (ammo) {
          return ammo;
        }
      }
      return null;
    } else if (priority == "quantity") {
      const ammo = this.items.contents.filter(i => i.type == "Item" && compatibleAmmoIds.includes(i.system.casperObjectId));
      if (ammo.length == 0) {
        return null;
      } else if (ammo.length == 1) {
        return ammo[0];
      } else {
        //Select the ammo with the highest quantity
        return ammo.sort((a, b) => b.system.quantity - a.system.quantity)[0];
      }
    } else if (priority == "manual") {
      //Manual checks the worn item slots in order for a compatible ammo item - if none are found, grab the first one found in the inventory
      for (let i=0; i<this.system.wornItemSlots; i++) {
        const slot = `worn${i}`;
        if (this.system.equipment[slot]) {
          const item = this.items.get(this.system.equipment[slot]);
          if (item && item.type == "Item" && compatibleAmmoIds.includes(item.system.casperObjectId)) {
            return item;
          }
        }
      }
      const ammo = this.items.contents.find(i => i.type == "Item" && compatibleAmmoIds.includes(i.system.casperObjectId));
      return ammo ||null;
    }
  }

  hasAmmoFor(item, minimum = 1) {
    const compatibleAmmoIds = NEWERA.compatibleAmmoIds[item.system.ammo.type];
    return this.items.contents.some(i => i.type == "Item" && compatibleAmmoIds.includes(i.system.casperObjectId) && i.system.quantity >= minimum);
  }

  hasFreeHands(number) {
    if (number > 2){
      ui.notifications.error("Please contact the Curse Recovery Association at (+29) 049 003 001.");
      return false;
    }
    if (game.settings.get("newera-sol366", "enforceActionConditions")){
      if (number == 2){
        return this.system.equipment.leftHand == "" && this.system.equipment.rightHand == "";
      } else if (number == 1){
        return !(
          (this.system.equipment.leftHand && this.system.equipment.rightHand)
          || (this.system.equipment.rightHand && this.items.get(this.system.equipment.rightHand).system.handedness == '2H')
          || (this.system.equipment.rightHand && this.items.get(this.system.equipment.rightHand).system.handedness == '1.5H' && !this.system.forceOneHanded)
          )
      } else {
        return true;
      }
    }
    return true;
  }

  canCastSpell(spell){
    if (game.settings.get("newera-sol366", "enforceActionConditions")){
      if (!spell.system.keywords.includes("Asomatic")){
        if (["G", "L", "R"].includes(spell.system.castType)){
          return this.hasFreeHands(2);
        } else {
          return this.hasFreeHands(1);
        }
      }
    }
    return true;
  }

  /* AUTO LEVEL UP FUNCTIONS */

  async levelUp(clazz) {
    const fromLevel = clazz.system.level;
    const toLevel = fromLevel + 1;
    const className = clazz.system.selectedClass.toLowerCase();
    console.log(`[ALU] Leveling up ${this.name}:${className} to ${toLevel}`);
    await clazz.update({
      system: {
        level: toLevel
      }
    });
    if (game.settings.get("newera-sol366", "autoLevelUp")) {
      console.log(`[ALU] Starting auto-level up for ${this.name}:${className} ${fromLevel} -> ${toLevel}`);
      const archetypeData = ClassInfo.getArchetypeData(this);
      const featuresToUnlock = ClassInfo.features[className].filter(feature => 
        feature.level > fromLevel
        && feature.level <= toLevel
        && (!feature.archetype || archetypeData.hasOwnProperty(feature.archetype)) //This will not catch retroactive archetype features or those that unlock at the same time as the archetype selection, but unlockArchetypeFeatures will
      );
      for (const feature of featuresToUnlock){
          if (typeof feature.onUnlock == 'function'){
            await feature.onUnlock(this);
            console.log(`[ALU] Unlocked ${feature.name}`);
          }
          if (feature.common) {
            const commonFeature = ClassInfo.features.common[feature.common];
            if (typeof commonFeature.onUnlock == 'function'){
              await commonFeature.onUnlock(this);
              console.log(`[ALU] Unlocked common feature ${commonFeature.name}`);
            }
          }
          if (feature.spellStudies && feature.spellStudies.some(s => typeof s.showWhen != 'function')) { //Don't trigger this notification for conditional spell studies
            ui.notifications.info(`You can learn new spells at this level! Access the Spell Study Guide from the Class tab.`);
          }
      }
      const featuresToUpdate = ClassInfo.features[className].filter(feature => 
        feature.level <= toLevel
        && feature.tableValues
        && (!feature.archetype || archetypeData.hasOwnProperty(feature.archetype)) //This will not catch retroactive archetype features or those that unlock at the same time as the archetype selection, but unlockArchetypeFeatures will
      );
      for (const feature of featuresToUpdate){
        feature.tableValues.forEach(async tv => {
          if (typeof tv.onUpdate == 'function'){
            const fromVal = tv.values[fromLevel];
            const toVal = tv.values[toLevel];
            if (toVal > fromVal){
              await tv.onUpdate(this, fromVal, toVal);
              console.log(`[ALU] Updated Table value for ${feature.name}:${tv.label} from ${fromVal} to ${toVal}`);
            } else {
              console.log(`[ALU] Table value for ${feature.name}:${tv.label} is still ${fromVal}.`);
            }
          } else {
            console.log(`[ALU] Table value for ${feature.name}:${tv.label} has no onUpdate function.`);
          }
        });
      }
      console.log(`[ALU] Auto-Level Up for ${this.name}:${className} ${fromLevel} -> ${toLevel} complete.`);
    } else {
      console.log(`[ALU] Auto-Level Up is disabled.`);
    }
    Actions.showHpIncreaseDialog(this, clazz, ClassInfo.hitPointIncrements[className]); //Passing the HP increment here because importing ClassInfo in Actions creates a circular dependency
  }

  async unlockArchetypeFeatures(className, archetype, level){
    console.log(`[ALU] Unlocking archetype features for ${this.name} ${className}:${archetype} level ${level}`);
    const archetypeFeatures = ClassInfo.features[className].filter(feature => 
      feature.archetype == archetype
      && feature.level <= this.getClassLevel(className)
      && (feature.level >= level || feature.retroactiveUnlock));
    for (const feature of archetypeFeatures){
      if (typeof feature.onUnlock == 'function'){
        await feature.onUnlock(this);
        console.log(`[ALU] Unlocked archetype feature ${feature.name}`);
      }
    }
  }

  /**
   * Improve natural skills by 1 level each.
   */
  async improveNaturalSkills(){
    const update = {
      system: {
        skills: {},
        magic: {},
        knowledges: {}
      }
    }
    for (const [k, obj] of Object.entries(this.system.skills)){
      if (obj.natural && obj.level < 10) {
        update.system.skills[k] = {
          level: obj.level + 1
        }
      }
    }
    for (const [k, obj] of Object.entries(this.system.magic)){
      if (obj.natural && obj.level < 10) {
        update.system.magic[k] = {
          level: obj.level + 1
        }
      }
    }
    for (const [k, obj] of Object.entries(this.system.knowledges)){
      if (obj.natural && obj.level < 10) {
        update.system.knowledges[k] = {
          level: obj.level + 1
        }
      }
    }
    await this.update(update);
    ui.notifications.info("Your Natural Skills increased!");
  }

  /**
   * Set a skill as natural based on selections in a class Natural Skills feature.
   * @param {*} from The old skill to remove.
   * @param {*} to The new skill to set.
   */
  async setNaturalSkill(from, to){
    if (from == to) return;
    if (this.type != "Player Character") return;
    const update = {
      skills: {},
      magic: {}
    };
    if (from){
      if (this.system.skills[from]){
        update.skills[from] = {
          natural: false
        }
      } else if (this.system.magic[from]){
        update.magic[from] = {
          natural: false
        }
      } else {
        ui.notifications.error(`Error: Unable to locate skill key: ${from}`);
      }
    }
    if (to) {
      if (this.system.skills[to]){
        if (this.system.skills[to].natural) {
          ui.notifications.warn(`You're already a natural in that skill!`);
        } else {
          update.skills[to] = {
            natural: true
          }
          ui.notifications.info(`You're now a natural in ${NewEraUtils.keyToTitle(to)}!`);
        }
      } else if (this.system.magic[to]){
        if (this.system.magic[to].natural) {
          ui.notifications.warn(`You're already a natural in that skill!`);
        } else {
          update.magic[to] = {
            natural: true
          }
          ui.notifications.info(`You're now a natural in ${NewEraUtils.keyToTitle(to)} magic!`);
        }
      } else {
          ui.notifications.error(`Error: Unable to locate skill key: ${from}`);
      }
    }
    await this.update({
      system: update
    });
  }

  /**
   * Boost a skill through a class feature.
   * @param {*} from The old skill to remove.
   * @param {*} to The new skill to set.
   * @param {boolean} levelIncrease If true, the skill's level is increased. Otherwise, the boost applies to the modifier bonus.
   */
  async setSkillBoost(from, to, levelIncrease = false){
    if (this.type != "Player Character") return;
    const field = levelIncrease ? "level" : "bonus";
    const update = {
      skills: {},
      magic: {}
    };
    if (from){
      if (this.system.skills[from]){
        update.skills[from] = {
          [field]: this.system.skills[from][field] - 1
        }
      } else if (this.system.magic[from]){
        update.magic[from] = {
          [field]: this.system.magic[from][field] - 1
        }
      } else { //This function and setNaturalSkill might need to support knowledges but there is no need yet.
        ui.notifications.error(`Error: Unable to locate skill key: ${from}`);
      }
    }
    if (to) {
      if (this.system.skills[to]){
        if (levelIncrease && this.system.skills[to].level == 10) {
          ui.notifications.warn(`Your ${NewEraUtils.keyToTitle(to)} skill is already at max level!`);
        } else {
          update.skills[to] = {
            [field]: this.system.skills[to][field] + 1
          }
          if (levelIncrease){
            ui.notifications.info(`Your ${NewEraUtils.keyToTitle(to)} skill increased to ${update.skills[to][field]}!`);
          } else {
            ui.notifications.info(`Your ${NewEraUtils.keyToTitle(to)} skill bonus is now ${update.skills[to][field]}.`);
          }
        }
      } else if (this.system.magic[to]){
        if (levelIncrease && this.system.magic[to].level == 10) {
          ui.notifications.warn(`Your ${NewEraUtils.keyToTitle(to)} magic skill is already at max level!`);
        } else {
          update.magic[to] = {
            [field]: this.system.magic[to][field] + 1
          }
          if (levelIncrease){
            ui.notifications.info(`Your ${NewEraUtils.keyToTitle(to)} magic skill increased to ${update.magic[to][field]}!`);
          } else {
            ui.notifications.info(`Your ${NewEraUtils.keyToTitle(to)} magic skill bonus is now ${update.magic[to][field]}.`);
          }
        }
      } else {
        ui.notifications.error(`Error: Unable to locate skill key: ${from}`);
      }
    }
    await this.update({
      system: update
    });
  }

  /**
   * Set a level in the specified specialty.
   * If the actor already has a specialty in that subject, increase its level by 1 unless it's already 3.
   * Otherwise, add a new specialty at level 1.
   * @param {*} fromSubject An optional old specialty to remove. This specialty will be lowered by 1 level, or deleted if it's already level 1.
   * @param {*} subject The new specialty to set.
   * @param {*} parentSkill The parent skill of the new specialty, if one is created.
   */
  async setSpecialtyFeature(fromSubject, subject, parentSkill = "", allowStacking = false) {
    const from = NEWERA.alternateSpecialtyKeys[fromSubject] || fromSubject;
    const to = NEWERA.alternateSpecialtyKeys[subject] || subject;
    const defaultParent = parentSkill || NEWERA.specialtyDefaultParents[subject] || NEWERA.specialtyDefaultParents[to];
    const update = {
      specialties: {}
    };
    if (from){
      const fromIndex = Object.keys(this.system.specialties).find(spec => this.system.specialties[spec].subject == NewEraUtils.keyToTitle(from));
      if (fromIndex !== undefined){
        if (this.system.specialties[fromIndex].level > 1){
          update.specialties[fromIndex] = {
            level: this.system.specialties[fromIndex].level - 1
          }
        } else {
          await this.deleteSpecialty(fromIndex);
        }
      }
    }
    if (to){
      const title = NewEraUtils.keyToTitle(to);
      const toIndex = Object.keys(this.system.specialties).find(spec => this.system.specialties[spec].subject == title);
      if (toIndex !== undefined){
        if (allowStacking){
          if (this.system.specialties[toIndex].level < 3){
            update.specialties[toIndex] = {
              level: this.system.specialties[toIndex].level + 1
            }
            ui.notifications.info(`Your ${title} specialty increased to ${update.specialties[toIndex].level}!`);
          } else {
            ui.notifications.warn(`Your ${title} specialty is already at max level! Specialties can't exceed level 3.`);
          }
        } else {
          ui.notifications.warn(`You already have a specialty in ${title}. You can't use this feature to increase its level.`);
        }
      } else {
        update.specialties[Object.keys(this.system.specialties).length] = {
          subject: title,
          level: 1,
          bonus: 0,
          defaultParent: defaultParent
        };
        ui.notifications.info(`You've gained a specialty in ${title}!`);
      }
    }
    await this.update({
      system: update
    });
  }

  async setCasterLevel(from, to, setMaxEnergy = true) {
    const energyChange = setMaxEnergy ? NEWERA.baseEnergyMaximums[to] - NEWERA.baseEnergyMaximums[from || 0] : 0;
    await this.update({
      system: {
        casterLevel: to,
        energy: {
          max: this.system.energy.max + energyChange,
          value: this.system.energy.value + energyChange
        }
      }
    });
    ui.notifications.info(`Your caster level increased to ${to}!`);
  }

  async setAbilityScoreImprovement(from, to){
    if (to == from) return;
    const update = {
      abilities: {}
    };
    if (from){
      update.abilities[from] = {
        score: this.system.abilities[from].score - 1
      }
      if (from == "constitution" && NEWERA.abilityScoreModifiers[update.abilities.constitution.score] < NEWERA.abilityScoreModifiers[this.system.abilities.constitution.score]){
        update.hitPoints = {
          max: this.system.hitPoints.max - 1, //This method only ever changes the score by 1
          value: this.system.hitPoints.value - 1
        }
        update.hitPointTrueMax = this.system.hitPointTrueMax - 1;
      }
    }
    if (to){
      if (this.system.abilities[to].score >= 20 && this.system.level < 15){
        ui.notifications.warn(`You can't increase an ability score beyond 20 until you reach level 15.`);
      } else if (this.system.abilities[to].score >= 30){
        ui.notifications.warn(`You can't increase an ability score beyond 30.`);
      } else {
        update.abilities[to] = {
          score: this.system.abilities[to].score + 1
        }
        ui.notifications.info(`Your ${to} increased to ${update.abilities[to].score}!`);
        //Adjust max HP if constitution modifier changed 
        if (to == "constitution" && NEWERA.abilityScoreModifiers[update.abilities.constitution.score] > NEWERA.abilityScoreModifiers[this.system.abilities.constitution.score]){
          update.hitPoints = {
            max: this.system.hitPoints.max + 1, //This method only ever changes the score by 1
            value: this.system.hitPoints.value + 1
          }
          update.hitPointTrueMax = this.system.hitPointTrueMax + 1;
        }
      }
    }
    await this.update({system: update});
  }

  async setLearningExperience(from, to){
    const update = {
      system: {
        knowledges: {}
      }
    }
    if (from !== ""){
      update.system.knowledges[parseInt(from)] = {
        level: this.system.knowledges[parseInt(from)].level - 1
      }
    }
    if (to) {
      const knowledge = this.system.knowledges[parseInt(to)];
      update.system.knowledges[parseInt(to)] = {
        level: knowledge.level + 1
      }
      ui.notifications.info(`Your ${knowledge.subject} knowledge increased to ${knowledge.level + 1}!`);
    }
    await this.update(update);
  }

  async setSpecialtyImprovement(from, to){
    const update = {
      system: {
        specialties: {}
      }
    }
    if (from !== ""){
      update.system.specialties[parseInt(from)] = {
        level: this.system.specialties[parseInt(from)].level - 1
      }
    }
    if (to) {
      const specialty = this.system.specialties[parseInt(to)];
      update.system.specialties[parseInt(to)] = {
        level: specialty.level + 1
      }
      ui.notifications.info(`Your ${specialty.subject} specialty increased to ${specialty.level + 1}!`);
    }
    await this.update(update);
  }
  /**
   * Add a spell, enchantment, or potion recipe to the character by its compendium ID.
   * @param {string} id The unique ID of the object in the Spells compendium, i.e. CASPERSP00000001
   */
  async addMagicById(id){
    const entry = await game.packs.get("newera-sol366.spells").getDocument(id);
    if (entry) {
      await Item.create(entry, {parent: this});
      ui.notifications.info(`You learned ${entry.name}!`);
    } else {
      ui.notifications.error(`Error: Unable to locate object with ID: ${id}`);
    }
  }

  async increaseBaseTurnLength(actions = 1, reactions = 0){
    await this.update({
      system: {
        turnLength: {
          actions: {
            base: this.system.turnLength.actions.base + actions
          },
          reactions: {
            base: this.system.turnLength.reactions.base + reactions
          }
        }
      }
    });
    ui.notifications.info(`Your Turn Length has been increased!`);
  }

  async setGrandMaster(from, to){
    const update = {
      system: {
        skills: {},
        magic: {},
      }
    };
    if (from){
      if (this.system.skills[from]){
        update.skills[from] = {
          grandMaster: false
        }
      } else if (this.system.magic[from]){
        update.magic[from] = {
          grandMaster: false
        }
      }
    }
    if (to){
      if (this.system.skills[to]){
        if (this.system.skills[to].level < 10){
          ui.notifications.warn(`You must reach skill level 10 before you can become a grand master!`);
        } else {
          update.skills[to] = {
            grandMaster: true
          }
          ui.notifications.info(`${this.name} is now a grand master in ${NewEraUtils.keyToTitle(to)}!`);
        }
      } else if (this.system.magic[to]){
        if (this.system.magic[to].level < 10){
          ui.notifications.warn(`You must reach magic level 10 before you can become a grand master!`);
        } else {
          update.magic[to] = {
            grandMaster: true
          }
          ui.notifications.info(`${this.name} is now a grand master in ${NewEraUtils.keyToTitle(to)} magic!`);
        }
      }
    }
    await this.update(update);
  }
}