import { Witch } from "../helpers/classes/witch.mjs";
import { FeatSearchParams } from "../schemas/feat-search-params.mjs";
import { NewEraActor } from "../documents/actor.mjs";
import { NewEraItem } from "../documents/item.mjs";
import { NEWERA } from "../helpers/config.mjs";

export class FeatBrowser extends ActorSheet {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["newera", "sheet", "actor"],
          template: "systems/newera-sol366/templates/extras/feat-browser.html",
          width: 840,
          height: 640,
          resizable: true,
          scrollY: [".feat-browser-contents"]
        });
    }

    get template() {
        return "systems/newera-sol366/templates/extras/feat-browser.html";
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
        const allFeats = structuredClone(await game.packs.get("newera-sol366.feats").getDocuments());
        const cpa = this.actor.system.characterPoints.cpa;
        //Filter results
        for (const feat of allFeats){
            if (this._includeFeat(classData, feat) && criteria.showFeat(feat)){
                feat.styles = feat.system.tiers.base.cost > cpa ? "cantAfford" : "";
                feat.cost = feat.system.tiers.base.cost.toString().replace("-", "+");
                results.push(feat);
            }
        }

        return results.sort(function(a, b){
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
        });
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
        html.find("#loading").show();
    }

    async _renderResults(html, feats){

        const render = await renderTemplate("systems/newera-sol366/templates/extras/parts/feat-browser-table.html", { results: feats });
        html.find("#results").html(render);
        html.find("#loading").hide();
        html.find("#results").show();

        html.find(".browser-result").on("dragstart", ev => {
            console.log("FEAT BROWSER DRAG START");
            const xfr = ev.originalEvent.dataTransfer;
            const element = $(ev.currentTarget);
            const dragData = {
                transferAction: "addFeatFromBrowser",
                actorId: this.actor.id,
                featId: element.data("itemId")
            };
            xfr.setData("text/plain", JSON.stringify(dragData));
        });
    }


}