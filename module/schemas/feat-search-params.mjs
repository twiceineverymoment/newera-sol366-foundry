import { NewEraItem } from "../documents/item.mjs";
import { NEWERA } from "../helpers/config.mjs";

export class FeatSearchParams {

    constructor(html = null){
            this.types = [];
            this.cost = {
                min: 0,
                max: 999
            };
            this.sortFunction = 0;
        if (html){
            this.cost.min = html.find("#costMin").val();
            this.cost.max = html.find("#costMax").val();
            this.searchTerm = html.find("#searchTerm").val();
            this.sortFunction = html.find("#sort").val();
            html.find("input.feat-filter-criteria:checked").each((index, element) => {
                if (element.dataset.filterSubCategory){
                    const parentType = this.types.find(t => t.type == element.dataset.filterCategory);
                    if (parentType){
                        parentType.subtypes.push(element.dataset.filterSubCategory);
                    }
                } else if (element.dataset.filterCategory){
                    this.types.push({
                        type: element.dataset.filterCategory,
                        subtypes: []
                    });
                } else {
                    //Uhh
                }
            });
        }
    }

    /**
     * Fo' free?
     * @param {NewEraItem} feat 
     */
    showFeat(feat){
        if (this.cost.min > Math.abs(feat.system.tiers.base.cost) || this.cost.max < Math.abs(feat.system.tiers.base.cost)){ //TODO This will need to be looked at when multi-tiered feats are improved
            return false;
        }
        if (this.searchTerm){
            if (!feat.name.toLowerCase().includes(this.searchTerm.toLowerCase()) && !this.searchTerm.toLowerCase().includes(feat.name.toLowerCase())){
                return false;
            }
        }
        //If the types array is empty, show all types
        if (this.types.length > 0){
            if (["GF", "GU"].includes(feat.system.featType)){
                return this.types.find(t => t.type == "general") ? true : false;
            } else if (["BG"].includes(feat.system.featType)){
                return this.types.find(t => t.type == "background") ? true : false;
            } else if (["CB"].includes(feat.system.featType)){
                return this.types.find(t => t.type == "career") ? true : false;
            } else if (["FL"].includes(feat.system.featType)){
                return this.types.find(t => t.type == "flaw") ? true : false;
            } else if (["SF", "SU"].includes(feat.system.featType)){
                const subCriteria = this.types.find(t => t.type == "skill");
                if (subCriteria){
                    if (!subCriteria.subtypes || subCriteria.subtypes.length == 0){
                        return true;
                    } else {
                        return subCriteria.subtypes.includes(feat.system.featSubType);
                    }
                } else {   
                    return false;
                }
            } else if (["CF", "CU"].includes(feat.system.featType)){
                const subCriteria = this.types.find(t => t.type == "class");
                if (subCriteria){
                    if (!subCriteria.subtypes || subCriteria.subtypes.length == 0){
                        return true;
                    } else {
                        return subCriteria.subtypes.includes(feat.system.featSubType);
                    }
                } else {   
                    return false;
                }
            } else if (["AF", "AU"].includes(feat.system.featType)){
                const subCriteria = this.types.find(t => t.type == "archetype");
                if (subCriteria){
                    if (!subCriteria.subtypes || subCriteria.subtypes.length == 0){
                        return true;
                    } else {
                        return subCriteria.subtypes.includes(NEWERA.archetypeFeatSubtypeMapping[feat.system.featSubType]);
                    }
                } else {   
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    }

}