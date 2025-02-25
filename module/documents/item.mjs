import { NEWERA } from "../helpers/config.mjs";
import { ExtendedFeatData } from "../helpers/feats.mjs";
import { NewEraUtils } from "../helpers/utils.mjs";
import { ItemActions } from "../helpers/actions/itemActions.mjs";
/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class NewEraItem extends Item {

  static Types = {
    BASIC_ITEM: ["Item"],
    MELEE_WEAPON: ["Melee Weapon"],
    RANGED_WEAPON: ["Ranged Weapon"],
    ARMOR: ["Armor"],
    SHIELD: ["Shield"],
    SPELL: ["Spell"],
    ENCHANTMENT: ["Enchantment"],
    POTION: ["Potion"],
    CLASS: ["Class"],
    FEAT: ["Feat"],
    ACTION: ["Action"],
    PHONE: ["Phone"],
    EQUIPMENT: ["Melee Weapon", "Ranged Weapon", "Armor", "Shield"],
    WEAPON: ["Melee Weapon", "Ranged Weapon"],
    ARMOR_TABLE: ["Armor", "Shield"],
    MAGIC: ["Spell", "Enchantment"],
    ENCHANTABLE: ["Item", "Melee Weapon", "Ranged Weapon", "Armor", "Shield"],
    INVENTORY: ["Item", "Melee Weapon", "Ranged Weapon", "Armor", "Shield", "Potion", "Phone"],
    NON_INVENTORY: ["Spell", "Enchantment", "Class", "Feat", "Action"],
    STACKABLE: ["Item", "Potion"],
    AMPLIFIABLE: ["Spell", "Enchantment", "Potion"]
  }

  static ActionConditions = {
    ALWAYS: "always", //Action is available regardless of location
    EQUIPPED: "equipped", //Available when in left or right hand
    WORN_OR_EQUIPPED: "worn", //Available when on any item slot other than backpack
    EQUIPPED_ONE_HANDED: "oneHanded", //For 1.5H only, available when held one-handed
    EQUIPPED_TWO_HANDED: "twoHanded", //For 1.5H only, available when held two-handed
  };

  typeIs(types){
    return types.includes(this.type);
  }

  /**
   * Augment the basic Item data model with additional dynamic system.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();

    const system = this.system;

    if (this.type == "Spell"){
      this._prepareMagicData(system);
    } else if (this.type == "Feat"){
      this._prepareFeatData(system);
    } else if (this.type == "Melee Weapon"){
      this._prepareMeleeWeaponData(system);
    } else if (this.type == "Ranged Weapon"){
      this._prepareRangedWeaponData(system);
      system.listDisplayName = this.name;
    } else if (this.type == "Armor"){
      this._prepareArmorData(system);
    } else if (this.type == "Shield"){
      this._prepareShieldData(system);
    } else if (this.type == "Enchantment"){
      this._prepareMagicData(system);
    } else if (this.type == "Class"){
      this._prepareClassData(system);
    } else if (this.type == "Item"){
      this._prepareBasicItemData(system);
    } else if (this.type == "Potion"){
      this._preparePotionData(system);
    } else if (this.type == "Action"){
      this._prepareCustomActionData(this.actor, system);
    } else if (this.type == "Phone"){
      this._preparePhoneData(this.actor, system);
    }

    if (this.type == "Melee Weapon" || this.type == "Armor" || this.type == "Shield"){
      this._prepareEquipmentName(system, this.type);
    }

    if (system.actions){
      this._serializeActionData(system);
    }

    //console.log(`[DEBUG] ${this.name} actions: ${typeof itemData.actions}`);
    if (typeof system.actions == "object"){
      this._prepareItemActionAndEffectData(system);
    }
  }

  _prepareBasicItemData(system){
    if (system.equipSlot == "O"){
      system.isOutfit = true;
    } if (system.batteryLevel > -1){
      system.hasBattery = true;
    }

    if (system.units){
      if (system.rollQuantity){ 
        system.listDisplayName = `${this.name} (${NewEraUtils.formatRollExpression(system.variableQuantity.dieCount, system.variableQuantity.dieSize, system.variableQuantity.modifier)} ${system.units})`;
      } else {
        system.listDisplayName = `${this.name} (${system.quantity} ${system.units})`;
      }
    } else {
      if (system.rollQuantity){
        system.listDisplayName = `${this.name} x${NewEraUtils.formatRollExpression(system.variableQuantity.dieCount, system.variableQuantity.dieSize, system.variableQuantity.modifier)}`;
      } else if (system.quantity > 1){
        system.listDisplayName = `${this.name} x${system.quantity}`;
      } else {
        system.listDisplayName = this.name;
      }
    }
  }

  _prepareItemActionAndEffectData(system){
    //console.log(`[DEBUG] preparing ${Object.values(system.actions).length} actions`);
    for (const action of Object.values(system.actions)){
      //console.log(`[DEBUG] Preparing action data for ${action.name}`);
      //Prepare roll data
      if (typeof action.rolls != "object") continue;
      for (const roll of Object.values(action.rolls)){
        if (roll.formula){
          if (roll.formula.includes("d20")){
            roll.die = "d20";
          } else if (roll.formula.includes("d12")){
            roll.die = "d12";
          } else if (roll.formula.includes("d10")){
            roll.die = "d10";
          } else if (roll.formula.includes("d8")){
            roll.die = "d8";
          } else if (roll.formula.includes("d6")){
            roll.die = "d6";
          } else if (roll.formula.includes("d4")){
            roll.die = "d4";
          } else {
            roll.die = "unknown";
          }
        }
        //console.log(`${roll.label} ${roll.formula} ${roll.die}`);
        roll.caption = `${roll.label} (${action.name})`;
      }
    }
    //console.log(system);
  }

  _prepareEquipmentName(system, type) {
      if (system.customName.length == 0){
        system.customName = this.name; //Fill in the custom name field with the display name if it's empty
      }
      this.name = system.useCustomItemName ? system.customName : this._generateDefaultName(system, type);
      system.listDisplayName = this.name;
  }

  _generateDefaultName(system, type){
    let conditionLabel = NEWERA.conditions[system.condition].label;
    let qualityLabel = "";
    let baseName = "";
    for (const qual of NEWERA.qualityLabels){
      if (system.quality >= qual.min){
        qualityLabel = qual.label;
        break;
      }
    }
    switch (type){
      case "Melee Weapon":
        baseName = system.weaponType;
        break;
      case "Armor":
        baseName = NEWERA.armorTypes[system.armorType].defaultName;
        break;
      case "Shield":
        baseName = system.shieldType;
        break;
    }
    return `${conditionLabel}${system.arcane ? "Arcane " : ""}${qualityLabel}${system.material} ${baseName}${system.enchanted ? ` of ${system.enchantmentDescriptor}` : ""}`;
  }

  _prepareMagicData(system){
    if (system.rarity == 0 && system.author){
      const authorRef = game.actors.get(system.author);
      system.authorName = authorRef?.name || "a modern mage";
    }
    system.standard = (system.rarity > 0);
    if (!system.keywords) {
      system.keywords = ""; //For some reason keywords are null on some enchantments. This breaks the next line causing the sheet render
      console.warn(`Null keywords on enchantment ${this.name}`);
    }
    system.amplifiable = !system.keywords.includes("Static");
    system.form = NEWERA.schoolToFormMapping[system.school];
    system.specialty = NEWERA.schoolOfMagicNames[system.school];
    system.spellImageUrl = `systems/newera-sol366/resources/${system.specialty}.png`;
    this.img = system.spellImageUrl;
    if (typeof system.ampFactor == "undefined"){
      system.ampFactor = 1;
    }
    system.formattedDescription = NewEraUtils.amplifyAndFormatDescription(system.description, system.ampFactor, "S");
    system.amplified = (system.ampFactor > 1);

    if (this.type == "Spell"){
      this._prepareSpellData(system);
    } else if (this.type == "Enchantment") {
      this._prepareEnchantmentData(system);
    } else {
      console.error(`[ERROR] prepareMagicData invoked on non-magic item!`);
    }
  }

  _prepareSpellData(system) {
      system.concentrated = (system.castType == "F");
      system.rangedAttack = (system.range.description == "Projectile");
      system.amplifiedDamage = (system.amplified && system.damage.scales);
      system.amplifiedRange = (system.amplified && system.range.scales);
      if (system.ampFactor > 1){
        system.amplifiedData = {
          level: system.level * system.ampFactor,
          energyCost: system.energyCost * system.ampFactor,
          damage: NewEraUtils.amplifyValue(system.damage.amount, system.ampFactor),
          range: system.range.value * system.ampFactor,
        };
      }
  }

  _prepareEnchantmentData(system) {
    if (system.ampFactor > 1){
      system.amplifiedData = {
        level: system.level * system.ampFactor,
        energyCost: system.energyCost * system.ampFactor,
        aetheriumCost: system.aetheriumCost * system.ampFactor
      };
    }
    system.isComponent = (system.enchantmentType == "C");
    system.thingsAreComplex = (system.enchantmentType == "CE");
}

_preparePotionData(system){
  system.enableMultiDosing = (system.stackingBehavior != "N");
  if (typeof system.doses == "undefined"){
    system.doses = 1;
  }
  system.formattedDescription = NewEraUtils.amplifyAndFormatDescription(system.description, system.doses, system.stackingBehavior);
  system.amplified = (system.doses > 1);
  if (system.isRecipe) {
    system.listDisplayName = this.name + " Recipe";
    this.img = `systems/newera-sol366/resources/pr_${NEWERA.chantLevels[this.system.recipeLevel]}.png`; //Chant levels are the same as potion levels so this works
  } else if (system.quantity > 1){
    system.listDisplayName = `${this.name} x${system.quantity}`;
  } else {
    system.listDisplayName = this.name;
  }
}

  _prepareFeatData(system){

    if (system.tiers.base) {
      console.warn(`Feat ${this.name} requires migration.`);
      return;
    }

    const subTypedCategories = ["SF", "CF", "AF"];
    system.hasSubType = subTypedCategories.includes(system.featType);
    system.isSingleTiered = (system.maximumTier < 2) ? true : false; //This is true for feats with 1 tier and unlimited tiers (upgrades)
    system.isUpgrade = (system.maximumTier == -1) ? true : false;
    system.enableTierSelect = (system.isSingleTiered || system.isUpgrade);
    system.isChant = (system.featType == "CH") ? true : false;

    if (system.currentTier < 1) system.currentTier = 1;
    if (system.currentTier > system.maximumTier && !system.isUpgrade) system.currentTier = system.maximumTier;

    //The "base" object contains tier 1 data. For single-tier feats and upgrades, empty the tiers object entirely
    if (system.isSingleTiered){
      system.tiers = {};
    } else {
      //When the maximum tier is increased, add empty tiers up to the new value. When decreased, delete objects with keys higher than the maximum
      for (let i = 2; i <= 5; i++){
        if (system.maximumTier < i && system.tiers[i]){
          delete system.tiers[i];
        } else if (system.maximumTier >= i && !system.tiers[i]){
          system.tiers[i] = {
            cost: 0,
            description: "",
            prerequisites: "",
            conflicts: ""
          }
        }
      }
    }

    Object.entries(system.tiers).forEach(([n, tier]) => {
      tier.unlocked = (system.currentTier >= n);
    });

    //Derive feat image
    if (system.featType == "GF"){
      this.img = "systems/newera-sol366/resources/achievement.png";
    } else if (system.featType == "BG"){
      this.img = "systems/newera-sol366/resources/backward-time.png";
    } else if (system.featType == "CB"){
      this.img = "systems/newera-sol366/resources/id-card.png";
    } else if (system.featType == "FL"){
      this.img = "systems/newera-sol366/resources/achilles-heel.png";
    } else if (system.featType == "AF"){
      this.img = "systems/newera-sol366/resources/star-medal.png"; //TODO More detailed archetype feat images
    } else if (system.featType == "CH"){
      this.img = `${NEWERA.images}/chant-${NEWERA.chantLevels[system.chantLevel]}.png`;
    } else {
      this.img = `systems/newera-sol366/resources/${system.featSubType.toLowerCase().replaceAll(" ", "-")}.png`;
    }

    //Derive total cost and display name for feat list
    if (system.isUpgrade) {
      let total = system.base.cost * system.currentTier;
      system.displayName = this.name + " (x" + system.currentTier + ")";
      system.totalCost = total.toString();
    } else if (system.isSingleTiered){
      system.totalCost = system.base.cost.toString();
      system.displayName = this.name;
    } else {
      let total = system.base.cost;
      for (const [k, v] of Object.entries(system.tiers)){
        if (parseInt(k) <= system.currentTier){
          total += v.cost;
        }
      }
      system.totalCost = total.toString();
      system.displayName = this.name + " " + NEWERA.romanNumerals[system.currentTier];
    }
    system.displayCost = (system.featType == 'FL') ? "+"+Math.abs(system.totalCost) : system.totalCost;
  }

  _prepareMeleeWeaponData(system){
    if (system.quality < -10) system.quality = -10;
    if (system.quality > 20) system.quality = 20;
    if (system.weaponType){
      system.standard = true;
      let weaponStats = NEWERA.meleeWeaponTypes[system.weaponType];
      if (!weaponStats.allowedMaterials.includes(system.material)){
        system.material = weaponStats.allowedMaterials[0]; //Change the material to the first allowed if the currently-selected one doesn't exist (i.e. a rubber sword)
      }
      let materialStats = NEWERA.materials[system.material];

      //Populate an array to enable/disable material entries in the weapon sheet UI
      system.selectableMaterials = {};
      for (const mt of weaponStats.allowedMaterials){
        let materialId = mt.replace(" ", "_").toLowerCase();
        system.selectableMaterials[materialId] = true;
      }

      //Derive stats for standard weapons
      system.rarity = Math.max(weaponStats.rarity, materialStats.rarity);
      system.weight = Math.max(weaponStats.weight + materialStats.adjustWeight, 0);
      system.durability = materialStats.durability + weaponStats.adjustDurability;
      system.value = NewEraUtils.getEstimatedValue(weaponStats.value, materialStats.valueMultiplier, system.condition, system.quality);
      system.handedness = weaponStats.handedness;

      let oneHandedHitSkill = system.weaponType.includes("Knuckleduster") ? "athletics" : "one-handed"; 
    //This is a bit of a hack but it'll work for now since this is the only weapon type that has this special roll formula

      system.showHandednessOptions = (system.handedness == "1.5H");

    //Prepare and store attack info (actor sheet can use these formulas to roll on)
    system.attacks = [];
    if (system.handedness == "1H" || system.handedness == "1.5H"){
      let actionSuffix = system.handedness == "1.5H" ? " (One-Handed)" : "";
      for (const attack of weaponStats.attackActions){
        system.attacks.push({
          name: attack.name + actionSuffix,
          damageType: attack.damageType,
          attackRoll: `d20+@skills.${oneHandedHitSkill}.mod`,
          damageRoll: `1${weaponStats.damage.oneHanded}+@abilities.strength.mod+${system.quality + materialStats.modifiers.damage}`,
          damageDie: `1${weaponStats.damage.oneHanded}`,
          frames: 1,
          handedness: 1
        });
      }
    }
    if (system.handedness == "2H" || system.handedness == "1.5H"){
      let actionSuffix = system.handedness == "1.5H" ? " (Two-Handed)" : "";
      for (const attack of weaponStats.attackActions){
        system.attacks.push({
          name: attack.name + actionSuffix,
          damageType: attack.damageType,
          attackRoll: "d20+@skills.two-handed.mod",
          damageRoll: `${attack.power ? 2 : 1}${weaponStats.damage.twoHanded}+@abilities.strength.mod+${system.quality + materialStats.modifiers.damage}`,
          damageDie: `${attack.power ? 2 : 1}${weaponStats.damage.twoHanded}`,
          frames: attack.power ? 3 : 2,
          handedness: 2
        })
      }
    }

    } else {
      system.standard = false;
    }
  }

  _prepareRangedWeaponData(system){
    switch(system.weaponType){
      case "CF":
        system.standard = false;
        system.isShotgun = false;
        break;
      case "CS":
        system.standard = false;
        system.isShotgun = true;
        break;
      case "CB":
        system.standard = false;
        system.isShotgun = true;
        break;
      default:
        system.standard = true;
        break;
    }

    if (system.standard){
      let weaponStats = NEWERA.rangedWeaponTypes[system.weaponType];

      //Apply standardized weapon attributes
      system.rarity = weaponStats.rarity;
      system.handedness = weaponStats.handedness;
      system.weight = weaponStats.weight;
      system.value = weaponStats.value;
      system.reliability = weaponStats.reliability;
      system.effectiveRange = weaponStats.effectiveRange;
      system.damage = weaponStats.damage;
      system.isShotgun = weaponStats.shotgunDamage;
      system.magReload = weaponStats.magazine;
      system.ammo.clipSize = weaponStats.ammo.clipSize;
      system.ammo.type = weaponStats.ammo.type;
      system.firingAction = weaponStats.firingAction;
      system.firingRate = weaponStats.firingRate;
      system.licenseLevel = weaponStats.licenseLevel;

      //console.log(system);
    }
  }

  _prepareArmorData(system){
    if (system.armorType){
      system.standard = true;

      let armorStats = NEWERA.armorTypes[system.armorType];
      if (!armorStats.allowedMaterials.includes(system.material)){
        system.material = armorStats.allowedMaterials[0]; //Change the material to the first allowed if the currently-selected one doesn't exist (i.e. a rubber sword)
      }
      let materialStats = NEWERA.materials[system.material];

      //Populate an array to enable/disable material entries in the weapon sheet UI
      system.selectableMaterials = {};
      for (const mt of armorStats.allowedMaterials){
        let materialId = mt.replace(" ", "_").toLowerCase();
        system.selectableMaterials[materialId] = true;
      }

      //Derive data for standard armor items
      system.rarity = Math.max(armorStats.rarity, materialStats.rarity);
      system.weight = Math.max(armorStats.weight + materialStats.adjustWeight, 0);
      system.durability = materialStats.durability + armorStats.adjustDurability;
      system.value = NewEraUtils.getEstimatedValue(armorStats.value, materialStats.valueMultiplier, system.condition, system.quality);
      system.armorRating = armorStats.armorRating + materialStats.modifiers.armor;

    } else {
      system.standard = false;
    }
  }

  _prepareShieldData(system){
    if (system.shieldType){
      system.standard = true;

      let shieldStats = NEWERA.shieldTypes[system.shieldType];
      if (!shieldStats.allowedMaterials.includes(system.material)){
        system.material = shieldStats.allowedMaterials[0]; //Change the material to the first allowed if the currently-selected one doesn't exist (i.e. a rubber sword)
      }
      let materialStats = NEWERA.materials[system.material];

      //Populate an array to enable/disable material entries in the weapon sheet UI
      system.selectableMaterials = {};
      for (const mt of shieldStats.allowedMaterials){
        let materialId = mt.replace(" ", "_").toLowerCase();
        system.selectableMaterials[materialId] = true;
      }

      //Derive data for standard armor items
      system.rarity = Math.max(shieldStats.rarity, materialStats.rarity);
      system.weight = Math.max(shieldStats.weight + materialStats.adjustWeight, 0);
      system.durability = materialStats.durability + shieldStats.adjustDurability;
      system.value = NewEraUtils.getEstimatedValue(shieldStats.value, materialStats.valueMultiplier, system.condition, system.quality);
      system.shieldRating = shieldStats.shieldRating + materialStats.modifiers.shield;

    } else {
      system.standard = false;
    }
  }

  _prepareClassData(system){
    let clazz = NEWERA.classes[system.selectedClass];
    system.description = clazz.description;
    system.hitPointIncrement = clazz.hitPointIncrement;
    system.naturalSkills = clazz.naturalSkills;
    system.magicTraining = clazz.magicTraining;
    system.classId = system.selectedClass.toLowerCase();

    this.name = `Level ${system.level} ${system.selectedClass}`;
    this.img = `systems/newera-sol366/resources/${system.classId}.png`;
  }

  _prepareCustomActionData(actor, system){
    for(const roll of Object.values(system.rolls)){
      roll.caption = `${roll.label} (${this.name})`;
      roll.formula = roll.customFormula || `${roll.dieCount}d${roll.dieSize}+${roll.modifier}`;
      if (["4", "6", "8", "10", "12", "20"].includes(roll.dieSize)){
        roll.die = `d${roll.dieSize}`;
      } else {
        roll.die = "unknown";
      }
    }
    system.images.right = NEWERA.actionTypeIcons[system.actionType];
  }

  _preparePhoneData(actor, system){
    const actorData = actor ? actor.system : null;
    if (system.batteryLevel < 0) system.batteryLevel = 0;
    if (system.batteryLevel > 4) system.batteryLevel = 4;
    system.deadBattery = system.batteryLevel < 1;

    system.listDisplayName = system.model;

    //Set Wallpaper
    system.backgroundImage = `${NEWERA.images}/phone-ui/wallpaper/${system.background}`;

    //If in a call, get the actor's image or a placeholder
    if (system.openApp == "call"){
      system.callImg = `${NEWERA.images}/phone-ui/contact-placeholder.png`;
      for (const actor of game.actors.values()){
        if (actor.type.includes("Character") && actor.name.toLowerCase() == this.system.contacts[system.currentContact].name.toLowerCase()){
          system.callImg = actor.img;
          break;
        }
      }
    }
  }

  async switchRollMode(index, advanced){
    if (this.type != "Action") return;
    if (this.system.rolls){
      const rolls = this.system.rolls;
      if (rolls[index]){
        if (advanced){
          rolls[index].customFormula = '1d20';
          await this.update({
            system: {
              rolls: rolls
            }
          });
        } else {
          rolls[index].customFormula = null;
          await this.update({
            system: {
              rolls: rolls
            }
          });
        }
      }
    }
  }

  async deleteRoll(index){
    if (this.type != "Action") return;
    if (this.system.rolls){
      const update = {
        system: {
          rolls: NewEraUtils.spliceIndexedObject(this.system.rolls, index)
        }
      }
      await this.update(update);
    }
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
   getRollData() {
    // If present, return the actor's roll system.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.system);

    rollData.durability = this.system.durability;

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this.data;

    // Initialize chat system.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll system.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.item.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }

  _serializeActionData(system){
    system.actionData = {};
    for (let i=0; i<system.actions.length; i++){
      system.actionData[i] = system.actions[i];
    }
  }

  _deserializeActionData(system){
    system.actions = [];
    Object.values(system.actionData).forEach((actionString) => system.actions.push(JSON.parse(actionString)));
  }

  getActions() {
    const system = this.system;
    const actions = ItemActions.getDefaultActionsForItem(this);
    if (typeof this.system.actions == "object") {
      for (const action of Object.values(system.actions)){
        actions.push({
          name: action.name,
          images: {
            base: this.type == "Feat" ? `${NEWERA.images}/${action.icon}.png` : this.img,
            left: this.type == "Feat" ? this.img : undefined,
            right: NEWERA.actionImages[action.actionType]
          },
          ability: null,
          skill: null,
          specialties: [],
          description: action.description,
          difficulty: null,
          actionType: action.actionType,
          show: action.show,
          rolls: action.rolls,
          decrement: action.decrement
        });
      }
    }
    actions.forEach(action => {
      action.item = this;
    });
    return actions;
  }

  _prepareSecretData(system) {
    if (this.typeIs(NewEraItem.Types.MAGIC)) {
      switch (system.secretLevel) {
        case 1:
        case 2:
          system.secretName = `Unknown Level ${system.level} ${system.specialty} ${this.type}`;
          break;
        case 3:
          system.secretName = `Unknown ${system.form} ${this.type}`;
          this.img = `$q{NEWERA.images}/${system.form.toLowerCase()}.png`;
          break;
        case 4:
          system.secretName = `Unknown ${this.type}`;
          this.img = `${NEWERA.images}/unknown.png`;
          break;
        case 0:
        default: 
          system.secretName = this.name;
      }
    }
    const gm = (game.user.role >= 2);
    /*This object is used to control rendering of secret data points in sheets.
    {{#if system.secret.level2}} means "Hide this piece of info if the secret level is 2 or higher"
    These are always false if the user is a GM or Assistant GM
    */
    system.secret = {
      "level1": (!gm && system.secretLevel >= 1),
      "level2": (!gm && system.secretLevel >= 2),
      "level3": (!gm && system.secretLevel >= 3),
      "level4": (!gm && system.secretLevel == 4)
    }
  }

  async addRoll(){
    if (this.type !== "Action") return;
    const system = this.system;
    const update = {
      system: {
        rolls: {
          [Object.keys(system.rolls).length]: {
            label: "New Roll",
            dieCount: 1,
            dieSize: 20,
            modifier: 0,
            stat: ""
          }
        }
      }
    };
    await this.update(update);
  }

  async createContact() {
    if (this.type !== "Phone") return;
    const system = this.system;
    await this.update({
      system: {
        contacts: {
          [Object.keys(system.contacts).length]: {
            name: "New Contact",
            number: "+29 (000) 000 000",
            messages: {},
            lastCheckedTime: Date.now()
          }
        }
      }
    });
  }

  async addContact(name, number){
    if (this.type !== "Phone") return;
    const contacts = structuredClone(this.system.contacts);
    const newIndex = Object.keys(contacts).length;
    contacts[newIndex] = {
      name: name,
      number: number,
      messages: {},
      lastCheckedTime: Date.now()
    };
    await this.update({
      system: {
        contacts: contacts
      }
    });
    return newIndex;
  }

  async addPhoto() {
    if (this.type !== "Phone") return false;
    const system = this.system;
    const newIndex = Object.keys(system.photos).length;
    const update = {
      system: {
        photos: {
          [newIndex]: {
            title: "New Photo",
            description: "Describe what you took a photo of",
            timestamp: this.timestamp,
            img: `${NEWERA.images}/phone-ui/photo.png`
          }
        },
        selectedPhoto: newIndex
      }
    };
    await this.update(update);
    return newIndex;
  }

  async addMessage(sent, index, content){
    if (this.type !== "Phone") return;
    const system = this.system;
    const newMessageIndex = system.contacts[index].messages ? Object.keys(system.contacts[index].messages).length : 0;
    const update = {
      system: {
        contacts: {
          [index]: {
            messages: {}
          }
        }
      }
    };
    update.system.contacts[index].messages[newMessageIndex] = {
      sent: sent,
      content: content,
      timestamp: this.timestamp,
      realTime: Date.now()
    };
    await this.update(update);
    return newMessageIndex;
  }

  get timestamp(){
    const year = game.settings.get("newera-sol366", "world.date.year");
    const month = game.settings.get("newera-sol366", "world.date.month");
    const day = game.settings.get("newera-sol366", "world.date.day");
    const hour = game.settings.get("newera-sol366", "world.time.hour");
    const minute = game.settings.get("newera-sol366", "world.time.minute");

    return `${year}/${month<10?"0":""}${month}/${day<10?"0":""}${day} ${hour<10?"0":""}${hour}:${minute<10?"0":""}${minute}`;
  }

  get totalEnergyCost(){
    if (this.typeIs(NewEraItem.Types.ENCHANTMENT) && this.system.enchantmentType == 'CE') {
    let total = this.system.energyCost;
    Object.values(this.system.components).forEach(comp => {
      total += comp.energyCost;
    });
    return total;
    } else if (this.typeIs(NewEraItem.Types.MAGIC)) {
      return this.system.energyCost;
    } else {
      return null;
    }
  }

  async addAction() {
    const system = this.system;
    const update = {
      system: {
        actions: {
          [Object.keys(system.actions).length]: {
            name: "New Action",
            icon: "unknown",
            actionType: "E",
            description: "Enter a description...",
            show: "equipped",
            decrement: false,
            rolls: {}
          }
        }
      }
    };
    await this.update(update);
  }

  async addActionRoll(index) {
    const system = this.system;
    const newIndex = system.actions[index].rolls ? Object.keys(system.actions[index].rolls).length : 0;
    const update = {
      system: {
        actions: {
          [index]: {
            rolls: {
              [newIndex]: {
                die: "d20",
                label: "New Roll",
                formula: "1d20"
              }
            }
          }
        }
      }
    };
    await this.update(update);
  }

  async enchant(enchantment, ampFactor = 1, caster = undefined, noSkillCheck = false, energyPool = undefined){
    console.log(`Entering enchant()`);

    //Check that the enchantment can be applied to this item
    if (!this.isEnchantmentValid(enchantment.system.validTargets)) {
      ui.notifications.error(`${enchantment.name} can't be applied to this item.`);
      return;
    }

    if (caster) {
      const success = await caster.cast(enchantment, ampFactor, noSkillCheck, energyPool);
      if (!success) {
        return false;
      }
    }

    //Copy the actions from the enchantment to the item
    const newActions = {};
    for (const action of Object.values(enchantment.system.actions)){
      action.name = action.name.replaceAll("{NAME}", this.name);
      action.description = action.description.replaceAll("{NAME}", this.name);
      newActions[Object.keys(newActions).length + Object.keys(this.system.actions).length] = action;
    }
    console.log("Updated Actions object");
    console.log(newActions);
    this.update({
      system: {
        actions: {
          ...this.system.actions,
          ...newActions
        }
      }
    });
    //Update the item's properties
    const level = enchantment.system.level * ampFactor;
    const totalLevel = this.system.totalEnchantmentLevel + level;
    if (!this.system.enchanted){
      this.update({
        system: {
          enchanted: true,
          enchantmentDescriptor: enchantment.system.enchantedItemDescriptor,
          enchantmentColor: enchantment.system.effectColor,
          totalEnchantmentLevel: totalLevel,
          useCharge: enchantment.system.keywords.includes("Charged"),
          charges: {
            min: 0,
            max: enchantment.system.maxCharges,
            value: enchantment.system.maxCharges
          }
        }
      });
    } else {
      this.update({
        system: {
          arcane: true,
          totalEnchantmentLevel: totalLevel
        }
      });
    }
    //Create the ActiveEffect
    await this.createEmbeddedDocuments("ActiveEffect", [{
      label: enchantment.name,
      img: enchantment.img,
      description: enchantment.system.description,
      owner: this.uuid,
      disabled: false,
      //transfer: enchantment.system.transfer //This function will be re-enabled when we figure out how to make ActiveEffects actually work this way
    }]);
    ui.notifications.info(`Applied enchantment ${enchantment.name} to ${this.name}`);
    console.log("Exiting enchant()");
    console.log(system);
    return true;
  }

  isEnchantmentValid(targetData){
    if (targetData.other == true){
      return true;
    }
    switch (this.type){
      case "Melee Weapon":
        return targetData.melee;
      case "Ranged Weapon":
        return targetData.ranged;
      case "Armor":
        return targetData.clothing;
      case "Shield":
        return targetData.shield;
      case "Item":
        switch (this.system.equipSlot) {
          case "I":
            return targetData.object;
          case "C":
            return targetData.object || targetData.ranged;
          case "O":
          case "B":
            return targetData.clothing;
          case "F":
          case "N":
          case "S":
          case "R":
          case "W":
            return targetData.accessory;
        }
      default:
        return false;
    }
  }

  async toggleStorage(){
    if (typeof this.system.stored == "boolean"){
      const prevState = this.system.stored;
      this.update({
        system: {
          stored: !prevState
        }
      });
      if (this.actor && NewEraUtils.sendEquipmentChangeMessages()){
        if (prevState){
          this.actor.actionMessage(this.img, `${NEWERA.images}/ac_adventuring.png`, "{NAME} retrieves {d} {0} from storage.", this.name);
        } else {
          this.actor.actionMessage(this.img, `${NEWERA.images}/ac_adventuring.png`, "{NAME} stores {d} {0}.", this.name);
        }
      }
    }
  }

  get spellcraftModifier(){
    if (!["Spell", "Enchantment"].includes(this.type)) return undefined;
    if (this.system.rarity > 0) {
      return 0;
    } else {
      return [-5, -3, -1, 0, 0][this.system.refinementLevel];
    }
  }

  /**
   * Determines whether the specified actor meets the requirements for this feat.
   * If the actor doesn't have a feat with the same object ID, this is evaluated against tier 1's prerequisites.
   * If they do, it's evaluated against the next highest tier's prerequisites.
   * Returns true if the actor already has the highest tier available.
   * @param {*} actor 
   * @returns 
   */
  characterMeetsFeatPrerequisites(actor, tier = 1){
    if (this.type == "Feat"){
      if (actor.type == "Player Character"){
        if (!game.settings.get("newera-sol366", "prereqCheck")){
          return true;
        }
        if (tier < 1) tier = 1; //nextTier is set to -1 for upgrade feats. Always look at tier 1 for these
        //console.log(`[DEBUG] Evaluating prerequisites : ${this.name}`);
        const conditionTokens = this._tokenizePrerequisites(tier);
        //console.log(conditionTokens);
        for (const ANDcondition of conditionTokens){
          let subResult = false;
          for (const ORcondition of ANDcondition){
            if (ORcondition == {} || ORcondition.check == "none")
            {
              //console.log(`[DEBUG] Empty condition object is always true`);
              subResult = true;
              break;
            }
            else if (ORcondition.check == "value")
            {
              //console.log(`[DEBUG] Evaluate value condition req=${ORcondition.required} func={${ORcondition.value}} eval=${ORcondition.value(actor)} inverse=${ORcondition.inverse}`);
              if (ORcondition.inverse){
                if (parseInt(ORcondition.required) >= parseInt(ORcondition.value(actor))){
                  //console.log(`[DEBUG] Value condition true`);
                  subResult = true;
                  break;
                }
              } else {
                if (parseInt(ORcondition.required) <= parseInt(ORcondition.value(actor))){
                  //console.log(`[DEBUG] Value condition true`);
                  subResult = true;
                  break;
                }
              }
              //console.log(`[DEBUG] Value condition false`);
            }
            else if (ORcondition.check == "ability")
            {
              //console.log(`[DEBUG] Evaluate feature condition name=${ORcondition.value}`);
              if (actor.hasFeatOrFeature(ORcondition.value)){
                //console.log(`[DEBUG] Feature condition true`);
                subResult = true;
                break;
              }
              //console.log(`[DEBUG] Feature condition false`);
            }
          }
          if (!subResult) {
            //console.log(`[DEBUG] ${this.name} FALSE`);
            return false; //If any one of the condition groups evaluates to false, stop here because nothing else matters
          }
          //console.log(`[DEBUG] subResult is true for this group, continuing the check`);
        }
        //console.log(`[DEBUG] ${this.name} TRUE`);
        return true; //If we get here and we haven't returned false, then all condition groups evaluated to true
      } else { 
        return false;
      }
    } else {
      return false;
    }
  }

  _tokenizePrerequisites(tier){
    //console.log(`[DEBUG] TP name=${this.name} T=${tier}`);
    if (this.type == "Feat"){
      try {
        const customCondition = ExtendedFeatData.getCustomPrerequisiteData(this.system.casperObjectId, tier);
        if (customCondition){
          return [
            [ customCondition ]
          ];
        }
      } catch (error){}
      const prerequisiteString = tier == 1 ? this.system.base.prerequisites : this.system.tiers[tier].prerequisites;
      if (prerequisiteString){
        let prerequisites = [];
        const conditions = prerequisiteString.split(",");
        for (const condition of conditions){ //First, break out the expression by commas/semicolons. This step is an AND (each part must evaluate to true)
          let currentCondition = [];
          const subConditions = condition.split(" or "); //Second, break out the individual conditions by the word "or" to determine if this is a multi-part condition
          for (const subCondition of subConditions){
            currentCondition.push(this._getPrerequisiteCondition(subCondition));
          }
          prerequisites.push(currentCondition);
        }
        return prerequisites;
      } else {
        return [];
      }
    } else {
      return null;
    }
  }

  _getPrerequisiteCondition(text){
    const inverseKeywords = ["below", "smaller", "lower", "less", "fewer"];
    const words = text.split(" ");
    const number = words.find(w => !isNaN(w) && !isNaN(parseInt(w))); //isNaN returns false for empty strings. So we do this instead
    if (number){ //Evaluate the condition as a minimum numeric stat value
      const expr = NEWERA.prerequisiteActorStatTextMatching[Object.keys(NEWERA.prerequisiteActorStatTextMatching).find(word => text.toLowerCase().includes(word))];
      if (!expr){
        return {}; //Unable to identify an expression to evaluate the numeric check with. Return an empty object which indicates the condition should be ignored
      }
      return {
        check: "value",
        value: expr,
        required: number,
        inverse: words.filter(word => inverseKeywords.includes(word)).length > 0
      };
    } else { //Evaluate the condition as requiring a specific feat or feature
      return {
        check: "ability",
        value: text
      };
    }
  }

  /**
   * Rolls against this item's durability. If the result is greater than the durability rating, reduces the item's condition by 1.
   * Returns true if the item suffered damage from the event, or false otherwise.
   */
  async durabilityCheck(modifier = 0){
    if (!this.system.durability){
      console.warn("Tried to perform a durability check on an invalid item!");
      return false;
    }
    const roll = new Roll(`d20+${modifier}`, this.getRollData()); 
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({actor: this.parent}),
      flavor: `Durability Check - ${this.name}`
    });
    if (roll.total > this.system.durability){
      const newCondition = Math.max(0, this.system.condition - 1);
      if (this.parent){
        this.parent.actionMessage(this.parent.img, this.img, "{NAME}'s {0} is {1}", this.name, NEWERA.conditionChangedDescriptions[newCondition]);
      }
      await this.update({
        system: {
          condition: newCondition
        }
      });
      return true;
    } else {
      return false;
    }
  }

  async printDetails(speaker, ampFactor = 1){
    let template = "";
    if (this.typeIs(NewEraItem.Types.SPELL)){
      const description = NewEraUtils.amplifyAndFormatDescription(this.system.description, ampFactor);
      const title = NewEraUtils.spellTitle(this, ampFactor);
      const range = `${this.system.range.value * (this.system.range.scales ? ampFactor : 1)} ft ${this.system.range.description}`;
      const castingTime = NEWERA.spellCastingTimes[this.system.castType] || this.system.castTime;
      template = `
        <div class="chat-item-details">
          <img src="${this.img}" />
          <h2>${title}</h2>
          <h3>Level <strong>${this.system.level * ampFactor}</strong> ${this.system.specialty}</h3>
          <p>${description}</p>
          <p><strong>Casting Time: </strong> ${castingTime} </p>
          <p><strong>Range: </strong> ${range} </p>
        </div>
      `;
    } else if (this.typeIs(NewEraItem.Types.ENCHANTMENT)){
      const description = NewEraUtils.amplifyAndFormatDescription(this.system.description, ampFactor);
      const title = NewEraUtils.spellTitle(this, ampFactor);
      template = `
        <div class="chat-item-details">
          <img src="${this.img}" />
          <h2>${title}</h2>
          <h3>Level <strong>${this.system.level * ampFactor}</strong> ${this.system.specialty}</h3>
          <p>${description}</p>
        </div>
      `;
    } else if (this.typeIs(NewEraItem.Types.POTION)){
      const description = NewEraUtils.amplifyAndFormatDescription(this.system.description, ampFactor, this.system.stackingBehavior);
      template = `
        <div class="chat-item-details">
          <img src="${this.img}" />
          <h2>${this.name}</h2>
          <p><strong>Quantity Consumed:</strong> ${ampFactor}</p>
          <p>${description}</p>
        </div>
      `;
    }
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: speaker}),
      content: template
    });
  }

  get spellRollMode() {
    if (this.typeIs(NewEraItem.Types.SPELL)) {
      if (this.system.keywords.includes("Projectile")) {
        return "ranged";
      } else if (this.system.keywords.includes("Contested")) {
        return "contested";
      } else if (this.system.rarity == 0 && this.system.refinementLevel < 4) {
        return "wildMagic";
      } else {
        return "cast";
      }
    } else if (this.typeIs(NewEraItem.Types.ENCHANTMENT)) {
      if (this.system.rarity == 0 && this.system.refinementLevel < 4) {
        return "wildMagic";
      }
      return "cast";
    } else {
      console.warn(`Trying to get roll mode for a non-spell item`);
      return null;
    }
  }

  async addMaterialCost() {
    if (this.typeIs(NewEraItem.Types.MAGIC)) {
      const newKey = Object.keys(this.system.materialCosts).length;
      const materials = {};
      materials[newKey] = {
        name: "Material",
        quantity: 1,
        scales: false,
        unique: false
      };
      await this.update({
        system: {
          materialCosts: materials
        }
      });
    }
  }

  async deleteMaterialCost(index){
    await this.update({
      system: {
        materialCosts: NewEraUtils.spliceIndexedObject(this.system.materialCosts, index)
      }
    });
  }

  async addComponent() {
    if (this.typeIs(NewEraItem.Types.ENCHANTMENT)) {
      const newKey = Object.keys(this.system.components).length;
      const components = {};
      components[newKey] = {
        name: "New Component",
        level: 1,
        check: "??",
        scales: false
      };
      await this.update({
        system: {
          components
        }
      });
    }
  }

  async deleteComponent(index){
    await this.update({
      system: {
        components: NewEraUtils.spliceIndexedObject(this.system.components, index)
      }
    });
  }

  async clearCasperMetadata(){
    await this.update({
      system: {
        '-=casperObjectId': null,
      }
    });
  }

  async rollQuantity(){
    if (this.system.rollQuantity){
      const roll = new Roll(`${this.system.variableQuantity.dieCount}d${this.system.variableQuantity.dieSize}+${this.system.variableQuantity.modifier}`, this.getRollData());
      await roll.evaluate();
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({actor: this.parent}),
        flavor: this.name
      });
      if (roll.total > 0){
        await this.update({
          system: {
            quantity: roll.total,
            rollQuantity: false
          }
        });
      } else {
        await this.delete();
      }
    }
  }

  async setOpenApp(appId){
    if (this.typeIs(NewEraItem.Types.PHONE)){
      await this.update({
        system: {
          openApp: appId == "home" ? "" : appId
        }
      });
    }
  }

  async call(index){
    if (this.typeIs(NewEraItem.Types.PHONE)){
      await this.update({
        system: {
          currentContact: index,
          openApp: "call"
        }
      });
    }
  }

  async openChat(index){
    if (this.typeIs(NewEraItem.Types.PHONE)){
      await this.update({
        system: {
          currentContact: index,
          openApp: "chat",
          contacts: this.system.contacts[index] ? {
            [index]: {
              lastCheckedTime: Date.now()
            }
          } : {}
        }
      });
    }
  }

  async openPhotoView(index){
    if (this.typeIs(NewEraItem.Types.PHONE)){
      if (index !== null){
         await this.update({
          system: {
            selectedPhoto: index,
            openApp: "photo-view"
          }
      });
      }
    }
  }

  async setBatteryLevel(level){
    if (this.typeIs(NewEraItem.Types.PHONE)){
      await this.update({
        system: {
          batteryLevel: level
        }
      });
    }
  }

  async toggleFlashlight(){
    if (this.typeIs(NewEraItem.Types.PHONE)){
      await this.update({
        system: {
          flashlight: this.system.flashlight == "on" ? "off" : "on"
        }
      });
    }
  }

  async fire() {
    if (this.typeIs(NewEraItem.Types.RANGED_WEAPON)){
      if (this.system.firingAction == "SA"){
        await this.update({
          system: {
            ammo: {
              loaded: this.system.ammo.loaded - 1
            }
          }
        });
        if (this.system.ammo.loaded == 0) {
          ui.notifications.info("You need to reload!");
        }
        return 1;
      } else if (this.system.firingAction == "M"){ //Crossbow AND Shotgun
        await this.update({
          system: {
            ammo: {
              loaded: this.system.ammo.loaded - 1
            }
          }
        });
        return 1;
      } else if (this.system.firingAction == "FA"){
        const toShoot = Math.min(this.system.firingRate, this.system.ammo.loaded);
        if (toShoot < this.system.firingRate){
          ui.notifications.info(`Only ${toShoot} shots left in the clip!`);
        }
        await this.update({
          system: {
            ammo: {
              loaded: this.system.ammo.loaded - toShoot
            }
          }
        });
        if (this.system.ammo.loaded == 0) {
          ui.notifications.warn("You need to reload!");
        }
        return toShoot;
      } else if (this.system.firingAction == "B"){
        await this.update({
          system: {
            ammo: {
              loaded: 0
            }
          }
        });
        return 1;
      }
    }
  }

  async reload(ammo) {
    if (this.typeIs(NewEraItem.Types.RANGED_WEAPON)){
      if (!ammo || ammo.system.quantity == 0){
        ui.notifications.warn("Out of ammo!");
      } else {
        const available = ammo.system.quantity;
        const canLoad = this.system.ammo.clipSize - this.system.ammo.loaded;
        const perAction = ["SA", "FA"].includes(this.system.firingAction) ? this.system.ammo.clipSize : 1;
        const loaded = Math.min(available, canLoad, perAction);
        await this.update({
          system: {
            ammo: {
              loaded: this.system.ammo.loaded + loaded
            }
          }
        });
        if (ammo.system.quantity == loaded) {
          await ammo.delete();
        } else {
          await ammo.update({
            system: {
              quantity: ammo.system.quantity - loaded
            }
          });
        }
        return loaded;
      }
    }
  }

  isLoaded(){
    if (this.typeIs(NewEraItem.Types.RANGED_WEAPON)){
      return this.system.ammo.loaded > 0;
    } else {
      return null;
    }
  }

  isFullyLoaded(){
    if (this.typeIs(NewEraItem.Types.RANGED_WEAPON)){
      return this.system.ammo.loaded == this.system.ammo.clipSize;
    } else {
      return null;
    }
  }

  /**
   * Determines whether the specified item can be stacked with this one.
   * In order to stack, the items must have matching types and CASPER IDs, and must not be enchanted or have a variable quantity.
   * @param {NewEraItem} candidate The item to check for stackability.
   * @returns {boolean} True if the item can be stacked, false otherwise.
   */
  canStackWith(candidate){
    return candidate !== this
      && candidate.typeIs(NewEraItem.Types.STACKABLE)
      && candidate.type == this.type
      && candidate.system.casperObjectId
      && candidate.system.casperObjectId == this.system.casperObjectId
      && !candidate.system.rollQuantity
      && !this.system.rollQuantity
      && !candidate.system.enchanted
      && !this.system.enchanted;
  }

  /**
   * Static version of canStackWith that works for any two items.
   * This has to work on plain objects because context.items strips the prototype chain for some reason - hence the manual type check
   * @param {*} a 
   * @param {*} b 
   * @returns 
   */
  static canStack(a, b){
    return a !== b
      && ["Item", "Potion"].includes(a.type)
      && a.type == b.type
      && a.system.casperObjectId
      && a.system.casperObjectId == b.system.casperObjectId
      && !a.system.rollQuantity
      && !b.system.rollQuantity
      && !a.system.enchanted
      && !b.system.enchanted;
  }
}

