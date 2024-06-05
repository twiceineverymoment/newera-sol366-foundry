import { NewEraItem } from "../documents/item.mjs";
import { NEWERA } from "../helpers/config.mjs";

export class SpellSearchParams {

    constructor(params){
            console.log(`[DEBUG] created SpellSearchParams ${JSON.stringify(params)}`);
            this.searchTerm = params.searchTerm || "";
            this.lists = params.lists  || [];
            this.forms = params.forms || [];
            this.schools = params.schools || [];
            this.spellType = params.spellType || "SE";
            this.rarity = params.rarity || "0";
            this.showLowerRarity = params.showLowerRarity || !!params.choose;
            this.restricted = params.restricted || false;
            this.metamagic = params.metamagic || false;
            this.studies = !!params.choose;
            this.choose = params.choose || null;
            this.level = {
                min: params.level ? params.level.min || 1 : 1,
                max: params.level ? params.level.max || 10 : 10,
            };
            this.sortFunction = this.studies ? 5 : params.sortFunction || 0;
        if (params.html){

            this.level.min = params.html.find("#levelMin").val();
            this.level.max = params.html.find("#levelMax").val();
            this.rarity = params.html.find("#rarity").val();
            this.spellType = params.html.find("#spellType").val();
            this.sortFunction = params.html.find("#sort").val();
            this.searchTerm = params.html.find("#searchTerm").val();

            //If any of the sub-category school boxes are checked, remove the parent form from this.forms
            
            params.html.find("input.spell-filter-criteria:checked").each((index, element) => {
                if (element.dataset.filterCategory == "metamagic"){
                    this.metamagic = true;
                } if (element.dataset.filterCategory == "spellList"){
                    this.lists.push(element.dataset.filterSubCategory);
                } else if (element.dataset.filterSubCategory){
                    this.forms = this.forms.filter(f => f != element.dataset.filterCategory);
                    this.schools.push(element.dataset.filterSubCategory);
                } else {
                    this.forms.push(element.dataset.filterCategory);
                }
            });
        }
        for (const listName of this.lists){
            const list = NEWERA.spellStudiesLists[listName];
            if (list){
                this.forms = this.forms.concat(list.forms);
                this.schools = this.schools.concat(list.schools.map(f => {
                    return Object.entries(NEWERA.schoolOfMagicNames).find(([k, v]) => v == f)[0];
                }));
            }
        }
        console.log(this);
    }

    showSpell(spell){
        if (this.searchTerm){
            if (!spell.name.toLowerCase().includes(this.searchTerm.toLowerCase()) && !this.searchTerm.toLowerCase().includes(spell.name.toLowerCase())){
                //console.log(`[DEBUG] hide ${spell.name}: search term doesn't match`);
                return false;
            }
        }
        if (!this._includeByFormAndSchool(spell)){
            return false;
        }
        if (this.rarity != "0"){
            if (this.showLowerRarity){
                if (this.rarity < spell.system.rarity){
                    if (this.restricted && spell.system.rarity == "5"){
                        //console.log(`[DEBUG] including ${spell.name} due to restricted school`);
                    } else {
                        //console.log(`[DEBUG] hide ${spell.name}: rarity above maximum`);
                        return false;
                    }
                }
            } else {
                if (this.rarity != spell.system.rarity){
                    //console.log(`[DEBUG] hide ${spell.name}: rarity mismatch (need exact)`);
                    return false;
                }
            }
        }
        if (this.spellType) {
            if (!(
                this.spellType == "SE" ||
                (this.spellType == "SS" && spell.typeIs(NewEraItem.Types.SPELL)) ||
                (this.spellType == "E" && spell.typeIs(NewEraItem.Types.ENCHANTMENT)) ||
                this.spellType == spell.system.castType
            )) {
                //console.log(`[DEBUG] hide ${spell.name}: spell type mismatch`);
                return false;
            }
        }
        if (spell.system.level > this.level.max || spell.system.level < this.level.min){
            //console.log(`[DEBUG] hide ${spell.name}: level out of range`);
            return false;
        }

        //console.log(`[DEBUG] show ${spell.name}`);
        return true;

    }

    _includeByFormAndSchool(spell){
        //Separate parameter for including metamagic which precludes all other checks
        if (spell.system.school == "MM"){
            return this.metamagic;
        }
        //Return true for everything if both arrays are empty.
        if (this.forms.length == 0 && this.schools.length == 0){
            return true;
        }
        //Check form.
        //If form match found, return true.
        //If no forms set or match not found, check school.
        if (this.forms.length > 0 && this.forms.includes(spell.system.form)){
            return true;
        }
        //Check school.
        //If school match found, return true.
        if (this.schools.length > 0 && this.schools.includes(spell.system.school)){
            return true;
        }

        return false;
    }

}