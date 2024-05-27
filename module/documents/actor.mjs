import { NEWERA } from "../helpers/config.mjs";
import { Formatting } from "../helpers/formatting.mjs";
import { Witch } from "../helpers/classes/witch.mjs";
import { CharacterEnergyPool } from "../schemas/char-energy-pool.mjs";
import { ClassInfo } from "../helpers/classFeatures.mjs";
import { NewEraItem } from "./item.mjs";
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
    system.totalWeight = this._getTotalWeight(this.items);
    this._prepareAbilityScoreModifiers(system);
    this._prepareCalculatedStats(system);
    this._prepareSkillModifiers(system);

    let highestHpIncrement = 0;
    for (const item of this.items) {
      if (item.type == "Class" && item.system.selectedClass != "Adventurer"){
        //console.log(item);
        highestHpIncrement = Math.max(highestHpIncrement, item.system.hitPointIncrement.roll);
      }
    }
    system.hitPointIncrement = (highestHpIncrement == 0) ? 8 : highestHpIncrement;
    const expectedLifePointMax = 10 + (system.level * 5);
    system.hpIncreaseAvailable = (system.lifePoints.max < expectedLifePointMax);

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
      ui.notifications.warn("Your level doesn't meet the requirement for the number of class levels you have. Reduce your class levels so their total doesn't exceed your overall level.");
    } else if (classlessLevels < 0){
      ui.notifications.info(`LEVEL UP! Choose a class for ${this.name} to gain a level in on the Class tab.`);
    }
  }

  //Returns the CPA and populates data with feat costs
  _calculateCpa(cpt, age, items){
    const system = this.system;
    system.featCosts = {};
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

  _getTotalWeight(items){
    let total = 0;
    for (const item of items){
      if (!item.system.stored && typeof item.system.weight != "undefined"){
        total += item.system.weight * (item.system.quantity || 1);
      }
    }
    return total;
  }

  _getEquippedArmor(items){
    let total = 0;
    for (const item of items){
      if (item.type == "Armor"){
        if (item.system.armorType == "Chest" || item.system.armorType == "Full Body"){
          total += item.system.armorRating;
        }
      }
    }
    return total;
  }

  //Help with point buy calculations for level 0 characters' ability scores
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
   * Prepare NPC type specific system.
   */
  _prepareNpcData(system) {
    if (this.type !== 'Non-Player Character') return;

    system.injured = (system.hitPointTrueMax > system.hitPoints.max);

    system.totalWeight = this._getTotalWeight(this.items);
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
    armor.equipped = this._getEquippedArmor(this.items);
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

  }

  findResource(name){
    return Object.entries(this.system.additionalResources).find(r => r[1].name.toLowerCase() == name.toLowerCase());
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

    return rollData;
  }

  /**
   * Prepare character roll system.
   */
  _getCharacterRollData(system) {
    if (this.type !== 'Player Character' || this.type == 'Non-Player Character') return;

    //Copy specialty modifiers to the top level with an abbreviated name
    if (system.specialties){
      const spec = {};
      for (let [k, v] of Object.entries(system.specialties)) {
        if (v.subject){
          const specId = v.subject.replace(" ", "_").toLowerCase();
          spec[specId] = v.level;
        }
      }
      system.spec = spec;
    }
  }

  addKnowledge() {
    const system = this.system;
    system.knowledges[Object.keys(system.knowledges).length] = {
      subject: "New Knowledge",
      level: 0,
      bonus: 0,
      natural: false,
      grandmaster: false
    };
  }

  addSpecialty() {
    const system = this.system;
    system.specialties[Object.keys(system.specialties).length] = {
      subject: "New Specialty",
      level: 0,
      bonus: 0,
      defaultParent: "other"
    };
  }

  addSpecialModifier() {
    const system = this.system;
    system.specialModifiers[Object.keys(system.specialModifiers).length] = {
      subject: "New Modifier",
      bonus: 0,
      parent: ""
    };
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

  addResource() {
    const system = this.system;
    system.additionalResources[Object.keys(system.additionalResources).length] = {
      name: "New Resource",
      value: 0,
      max: 0
    };
  }

  async deleteResource(index){
    await this.update({
      system: {
        additionalResources: Formatting.spliceIndexedObject(this.system.additionalResources, index)
      }
    });
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

  moveItem(id, source, destination){
    console.log(`Moving item ${id} from ${source} to ${destination}`);
    const system = this.system;
    const item = this.items.get(id);
    if (source != "backpack"){
      system.equipment[source] = "";
    }
    if (destination != "backpack"){
      system.equipment[destination] = id;
    }
    //Handle two-handed items.
    //For "2H", force the item to the right hand and clear the left.
    //For "1.5H", only clear the left if the item was dragged to the right hand AND the left hand is empty. Otherwise consider it held one-handed
    if (item.system.handedness && (destination == "leftHand" || destination == "rightHand")){
      console.log("Checking for a two-handed item...");
      if (item.system.handedness == "2H" || (item.system.handedness == "1.5H" && destination == "rightHand" && !system.equipment.leftHand)){
        console.log("Moved to right hand and cleared left");
        system.equipment.rightHand = id;
        system.equipment.leftHand = "";
      }
    }
  }

  /**
   * 
   * @param {NewEraActor} recipient The actor receiving the item
   * @param {NewEraItem} item The item being transferred
   * @param {string} targetSlot The inventory slot to place the transferred item in on the recipient
   */
  async transferItem(recipient, item, targetSlot){
    console.log(`Entering transferItem ${this.id}->${recipient.id} item=${item.id}`);
    const sourceSlot = this.findItemLocation(item);
    const newItem = await Item.create(item, {parent: recipient});
    if (targetSlot != "backpack"){
      let recUpdate = {
        system: {
          equipment: {}
        }
      };
      recUpdate.system.equipment[targetSlot] = newItem._id;
      await recipient.update(recUpdate);
    }
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
    if (recipient.typeIs(NewEraActor.Types.ANIMATE)){
      const frameImg = "systems/newera-sol366/resources/" + ((sourceSlot == "backpack" || targetSlot == "backpack") ? "ac_3frame.png" : "ac_1frame.png");
      if (Formatting.sendEquipmentChangeMessages()){
        if (this.typeIs(NewEraActor.Types.CHARACTER) && !this.system.defeated){
          this.actionMessage(item.img, frameImg, "{NAME} gave {d} {0} to {1}.", (item.type == "Phone" ? "phone" : item.name), recipient.name);
        } else {
          recipient.actionMessage(item.img, this.img, "{NAME} takes the {0}.", item.name);
        }
      }
    }
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

  async increaseMaxHp(roll){
    const system = this.system;
    const update = {
      system: {
        lifePoints: {},
        hitPoints: {}
      }
    };
    if (roll){
      const r = new Roll(`1d${system.hitPointIncrement}+@abilities.constitution.mod`, this.getRollData());
      await r.evaluate();
      r.toMessage({
        speaker: ChatMessage.getSpeaker({actor: this}),
        flavor: `Max HP Increase - Level ${system.level}`
      })
      const gained = r.total;
      update.system.hitPointTrueMax = system.hitPointTrueMax + gained;
      update.system.hitPoints.max = system.hitPoints.max + gained;
      update.system.hitPoints.value = system.hitPoints.value + gained;
    } else {
      const average = Math.round((1 + system.hitPointIncrement) / 2);
      const gained = average + system.abilities.constitution.mod;
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
      gained.lifePoints = system.lifePoints.max - system.lifePoints.value;
      gained.energy = system.energy.max - system.energy.value;
      //TODO Reduce exhaustion by 1 and clear other status effects
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
        tiers: {
          base: {
            cost: cost,
            description: ""
          }
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
    if (!spell){
      return;
    }

    if (energyPool){
      await energyPool.use()
    }
  }

  async cast(spell, ampFactor = 1, attack = false, noSkillCheck = false, energyPool = undefined){
      if (energyPool === undefined){
        if (this.type == "Player Character" || this.type == "Non-Player Character"){
          energyPool = new CharacterEnergyPool(this);
        } else if (this.type == "Creature"){
          energyPool = null;
        }
      }
      const level = spell.system.level * ampFactor;
      const spellSkill = spell.system.form;
      const spellSkillLevel = this.system.magic[spellSkill].level;
      const difficulty = noSkillCheck ? 0 : (level <= spellSkillLevel ? 0 : 5 + ((level - spellSkillLevel) * 5));
      const energyCost = spell.system.energyCost * ampFactor;
      let successful = false;

      if (!attack && difficulty == 0){
        this.actionMessage(this.img, `${NEWERA.images}/${spell.system.specialty}.png`, "{NAME} casts {0}!", `${spell.name}${ampFactor > 1 ? ` ${NEWERA.romanNumerals[ampFactor]}` : ""}`);
        successful = true;
      } else {
        const castRoll = new Roll(`d20 + @magic.${spellSkill}.mod + ${spell.spellcraftModifier} + ${attack ? "@skills.marksmanship.mod" : 0}`, this.getRollData());
        await castRoll.evaluate();
        successful = (castRoll.total >= difficulty);
        castRoll.toMessage({
          speaker: ChatMessage.getSpeaker({actor: this}),
          flavor: `${attack ? "Spell Attack -" : "Cast"} ${spell.name} ${ampFactor > 1 ? NEWERA.romanNumerals[ampFactor] : ""} ${difficulty > 0 ? `(Difficulty ${difficulty})` : ""}`
        });
      } 


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
        const sustainEffect = this.effects.find(e => e.label.includes("Sustaining: "));
        await sustainEffect.delete();
        await this.createEmbeddedDocuments("ActiveEffect", [{
          label: `Sustaining: ${spell.name}${ampfactor > 1 && NEWERA.romanNumerals[ampFactor]}`,
          icon: spell.img,
          description: `<p>You're sustaining a spell.</p>
          ${Formatting.amplifyAndFormatDescription(spell.system.description, ampFactor, "S")}
          <p>You can use any number of frames on your turn to sustain the spell. You can continue sustaining it as long as you spend at least one frame doing so during your turn.
          You stop sustaining the spell if your concentration is broken.</p>`,
          origin: spell._id
        }]);
      }

      if (energyPool){
        await energyPool.use(energyCost, new CharacterEnergyPool(this));
      }
      return successful;
  }

    async stopSustaining(){
        const sustainEffect = this.effects.find(e => e.label.includes("Sustaining: "));
        await sustainEffect.delete();
        await this.update({
          system: {
            sustaining: {
              id: "",
              ampFactor: 1
            }
          }
        })
    }

    /* Determines whether an action should be shown based on the action's type and the location within the actor's equipment */
    isItemActionAvailable(action, item){
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
          available = (location == "leftHand" || (location == "rightHand" && equipment.leftHand != ""));
          break;
        case "twoHanded": //Only used for 1.5H equipment
          available = (location == "rightHand" && !equipment.leftHand);
          break;
        default:
          available = (showWhen == location);
          break;
      }
      //console.log(`available=${available}`);
      return available;
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

  updateNaturalSkill(from, to){
    if (this.type != "Player Character") return;
    const update = structuredClone(this.system);
    if (from){
      if (update.skills[from]){
        update.skills[from].natural = false;
      } else if (update.magic[from]){
        update.magic[from].natural = false;
      } else {
        const knowledge = update.knowledges.find(k => k.subject == from);
        
      }
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

  hasFeatOrFeature(text){
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
  }

  getLearningExperienceOptions(){
    const output = {
      improvement: {
        label: "Make a Selection",
        options: {}
      }
    };
    for (const [k, v] of Object.entries(this.system.knowledges)){
      if (v.level < 10){
        output.improvement.options[k] = v.subject;
      }
    }
    return output;
  }

  getSpecialtyImprovementOptions(){
    const output = {
      improvement: {
        label: "Choose a Specialty",
        options: {}
      }
    };
    for (const [k, v] of Object.entries(this.system.specialties)){
      if (v.level < 3){
        output.improvement.options[k] = v.subject;
      }
    }
    return output;
  }
}