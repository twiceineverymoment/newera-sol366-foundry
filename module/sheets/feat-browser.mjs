import { Witch } from "../helpers/classes/witch.mjs";
import { FeatSearchParams } from "../schemas/feat-search-params.mjs";
import { NewEraActor } from "../documents/actor.mjs";
import { NewEraItem } from "../documents/item.mjs";
import { NEWERA } from "../helpers/config.mjs";
import { FeatData } from "../helpers/feats.mjs";
export class FeatBrowser extends ActorSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
          title: "Feat Browser",
          classes: ["newera", "sheet", "actor"],
          template: "systems/newera-sol366/templates/extras/feat-browser.hbs",
          width: 840,
          height: 640,
          resizable: true,
          scrollY: [".feat-browser-contents"]
        });
    }

    get title(){
        return "Feat Browser";
    }

    get template() {
        return "systems/newera-sol366/templates/extras/feat-browser.hbs";
    }

    async getData() {
        const context = super.getData();

        context.classData = this._getClassAndArchetypeData(this.actor);
        context.classData.archetypeNames = context.classData.archetypes.map(str => 
            NEWERA.archetypeFeatInclusionMapping.find(arch => arch.selection == str).name
        );
        context.characterCreationMode = game.settings.get("newera-sol366", "characterCreation");
        context.skillData = Object.keys(this.actor.system.skills).map(s => game.i18n.localize(`newera.skill.${s}.name`));

        console.log("FEAT BROWSER CONTEXT DUMP");
        console.log(context);
        return context;
    }

    /**
     * 
     * @param {NewEraActor} actor 
     * @param {FeatSearchParams} criteria 
     */
    async _searchFeats(criteria, classData){
        let results = [];
        const allFeats = await game.packs.get("newera-sol366.feats").getDocuments();
        const cpa = this.actor.system.characterPoints.cpa;
        //Filter results
        for (const feat of allFeats){
            if (this._includeFeat(classData, feat) && criteria.showFeat(feat)){
                feat.cost = feat.system.base.cost.toString().replace("-", "+");
                feat.available = true;
                feat.styles = "";
                feat.showNextTier = "";
                feat.isUpgrade = feat.system.maximumTier == -1;
                const existingFeat = this.actor.items.find(i => i.type == "Feat" && i.system.casperObjectId == feat.system.casperObjectId);
                if (existingFeat){
                    if (feat.system.maximumTier == -1){
                        feat.nextTier = -1;
                    } else if (feat.system.maximumTier <= existingFeat.system.currentTier){
                        feat.available = false;
                        feat.alreadyOwned = true;
                        feat.styles = "alreadyOwned";
                        feat.tooltip = "You already have this feat!";
                        feat.nextTier = 0;
                        feat.isTopTier = (feat.system.maximumTier > 1);
                    } else {
                        feat.nextTier = existingFeat.system.currentTier + 1;
                        feat.showNextTier = " "+NEWERA.romanNumerals[feat.nextTier];
                        if (feat.nextTier == existingFeat.system.maximumTier){
                            feat.isTopTier = true;
                        } else {
                            feat.isTiered = true;
                        }
                    }
                } else {
                    feat.nextTier = 1;
                    feat.isTiered = (feat.system.maximumTier > 1);
                }
                feat.display = {
                    name: `${feat.name}${feat.showNextTier}`,
                    description: feat.nextTier < 2 ? feat.system.base.description : feat.system.tiers[feat.nextTier].description,
                    cost: feat.nextTier < 2 ? feat.system.base.cost : feat.system.tiers[feat.nextTier].cost,
                    prerequisites: feat.nextTier < 2 ? feat.system.base.prerequisites : feat.system.tiers[feat.nextTier].prerequisites
                }
                if (feat.nextTier){
                    if (feat.display.cost > cpa){
                        feat.available = false;
                        feat.styles += " cantAfford";
                        feat.tooltip = "You don't have enough character points available.";
                    }
                    if (!feat.characterMeetsFeatPrerequisites(this.actor, feat.nextTier)){
                        feat.available = false;
                        feat.styles += " missingPrerequisites";
                        feat.tooltip = "You haven't fulfilled all the requirements for this feat. (NOTE: This is experimental - if this looks to be incorrect, ask your GM to override it)";
                    } else {
                        try {
                            const customCondition = FeatData[feat.system.casperObjectId][feat.nextTier].prerequisite;
                            if (customCondition && customCondition.doubleCheck){
                                feat.styles += " doubleCheck";
                                feat.doubleCheck = true;
                                feat.tooltip = customCondition.doubleCheck;
                            }
                        } catch (error){
                            //Ignore, custom condition not found
                        }
                    }
                    if (feat.system.featType == "FL"){
                        if (this.actor.items.filter(f => f.type == "Feat" && f.system.featType == "FL").length >= 3){
                            feat.available = false;
                            feat.styles += " missingPrerequisites";
                            feat.tooltip = "You can't have more than three flaws.";
                        }
                    }
                }
                results.push(feat);
            }
        }

        //console.log("[DEBUG] searchFeats Results");
        //console.log(results);
        return results.sort(this._sortFunctions[criteria.sortFunction]);
    }

    /**
     * Whether to include the feat in search results based on type and subtype
     * @param classData 
     * @param {*} feat 
     * @returns 
     */
    _includeFeat(classData, feat){
        if (["CF", "CU"].includes(feat.system.featType)){
            return feat.system.featSubType && classData.classes.includes(feat.system.featSubType); //If a class or archetype feat has an empty subtype field, it's messed up and should be hidden
        } else if (["AF", "AU"].includes(feat.system.featType)){
            const archMapping = NEWERA.archetypeFeatInclusionMapping.find(arch => arch.name == feat.system.featSubType);
            if (archMapping){
                return (classData.classes.includes(archMapping.className) && classData.archetypes.includes(archMapping.selection));
            } else {
                console.warn(`_searchFeats encountered an archetype feat with an unknown subtype: ${feat.system.featSubType}`);
                return false;
            }
        } else if (["GF", "GU", "SF", "SU"].includes(feat.system.featType)){
            return true;
        } else if (["CB", "BG", "FL"].includes(feat.system.featType)){
            return game.settings.get("newera-sol366", "characterCreation");
        } else {
            return false;
        }
    }

    /**
     * Checks whether the character already has the given feat.
     * If so, returns the current tier of the existing feat.
     * Returns 0/false otherwise.
     * @param {NewEraActor} actor 
     * @param {NewEraItem} feat 
     */
    _characterAlreadyHasFeat(actor, feat){
        const existingFeat = actor.items.find(i => i.type == "Feat" && i.name == feat.name);
        return existingFeat ? existingFeat.system.currentTier : false;
    }

    /**
     * Generate the criteria for classes and archetypes to include in the search results
     * @param {NewEraActor} actor 
     */
    _getClassAndArchetypeData(actor){
        let data = {
            classes: [],
            archetypes: []
        }
        const classes = actor.items.filter(i => i.type == "Class");
        for (const clazz of classes){
            data.classes.push(clazz.system.selectedClass);
            const classSelections = actor.system.classes[clazz.system.selectedClass.toLowerCase()];
            if (classSelections){ //This can be null if the data model hasn't been set yet i.e. if none of the feature selection dropdowns have been modified
                const archetype = classSelections.archetype;
                if (archetype){ //This can be null if the class doesn't have archetypes or if the archetype hasn't been unlocked or chosen yet
                    if (Array.isArray(archetype)){
                        data.archetypes = data.archetypes.concat(archetype);
                    } else if (typeof archetype == "object"){
                        Object.values(archetype).forEach(str => data.archetypes.push(str));
                    } else if (typeof archetype == "string"){
                        data.archetypes.push(archetype);
                    }
                }
            }
        }
        return data;
    }

    async activateListeners(html) {
        super.activateListeners(html);

        //Pull the initial results with no filters
        this._searchFeats(new FeatSearchParams(), this._getClassAndArchetypeData(this.actor))
        .then((feats) => {
            this._renderResults(html, feats);
        });

        html.find(".feat-filter-criteria").change(ev => {
            this._displayLoading(html);
            const element = $(ev.currentTarget);
            if (!element.data("filterSubCategory")){ //Ignore the show/hide when the subcategory checkboxes are changed
                if (element.is(":checked")){
                    html.find(`.feat-filter-sub-options[data-filter-category="${element.data("filterCategory")}"]`).show();
                } else {
                    html.find(`.feat-filter-sub-options[data-filter-category="${element.data("filterCategory")}"]`).hide();
                }
            }
            const newParams = new FeatSearchParams(html);
            this._searchFeats(newParams, this._getClassAndArchetypeData(this.actor))
                .then((feats) => {
                    this._renderResults(html, feats);
            });
        });
    }

   

    async _displayLoading(html){
        html.find("#results").hide();
        html.find("#browserLoading").show();
    }

    async _renderResults(html, feats){

        const render = await renderTemplate("systems/newera-sol366/templates/extras/parts/feat-browser-table.hbs", { 
            results: feats,
            noResultsFound: feats.length == 0
        });
        html.find("#results").html(render);
        html.find("#browserLoading").hide();
        html.find("#results").show();

        html.find(".browser-result").on("dragstart", ev => {
            console.log("FEAT BROWSER DRAG START");
            const xfr = ev.originalEvent.dataTransfer;
            const element = $(ev.currentTarget);
            const dragData = {
                transferAction: "addFeatFromBrowser",
                actorId: this.actor.id,
                casperObjectId: element.data("casperObjectId")
            };
            xfr.setData("text/plain", JSON.stringify(dragData));
        });
    }

    _sortFunctions = [
        function(a, b){
            if (a.system.casperSortOrder < b.system.casperSortOrder) return -1;
            else if (a.system.casperSortOrder > b.system.casperSortOrder) return 1;
            else return 0;
        },
        function(a, b){
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
        },
        function(a, b){
            if (a.system.base.cost < b.system.base.cost) return -1;
            else if (a.system.base.cost > b.system.base.cost) return 1;
            else return 0;
        },
        function(a, b){
            if (a.system.base.cost > b.system.base.cost) return -1;
            else if (a.system.base.cost < b.system.base.cost) return 1;
            else return 0;
        }
    ]


}