import { NEWERA } from "../helpers/config.mjs";
import { Chanter } from "../helpers/classes/chanter.mjs";
import { SpellSearchParams } from "../schemas/spell-search-params.mjs";
import { NewEraItem } from "../documents/item.mjs";
import { Formatting } from "../helpers/formatting.mjs";

export class SpellBrowser extends ActorSheet {

    constructor(actor, criteria = null, studies = null){
        super(actor);
        this.criteria = criteria || new SpellSearchParams({});
        this.compendium = [];
        this.remainingSelections = this.criteria.studies ? this.criteria.choose : null;
        this.studies = studies || {};
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["newera", "sheet", "actor"],
          width: 840,
          height: 640,
          resizable: false
        });
    }

    get title() {
        return this.criteria.studies ? "Spell Study Guide" : "Spell Browser";
    }

    get template() {
        return "systems/newera-sol366/templates/extras/spell-browser.html";
    }

    getData() {
        const context = super.getData();

        context.initialCriteria = this.criteria;
        context.initialFilterData = this._getHandlebarsInputCriteria();
        context.spellLists = this._getSpellListOptions();

        console.log("SPELL STUDY GUIDE CONTEXT DUMP");
        console.log(context);
        return context;
    }

    _getSpellListOptions(){
        const output = {};
        for (const [key, list] of Object.entries(NEWERA.spellStudiesLists)){
            for (const clazz of this.actor.items.filter(i => i.typeIs(NewEraItem.Types.CLASS))){
                if (key.includes(clazz.system.selectedClass.toLowerCase())){
                    output[key] = list;
                }
            }
        }
        return output;
    }

    //Mapping object derived from the initial search criteria that determines which check boxes on the browser should be initially checked.
    //Since we're not currently going to show the filters section if the study guide mode is used, this may not be necessary
    _getHandlebarsInputCriteria(){
        const filterData = {};

        return filterData;
    }

    activateListeners(html) {
        super.activateListeners(html);

        //Pull the initial results with no filters
        this._searchSpells(this.criteria)
        .then((spells) => {
            this._renderResults(html, spells);
        });

        html.find(".spell-filter-criteria").change(ev => {
            this._displayLoading(html);
            const element = $(ev.currentTarget);
            if (!element.data("filterSubCategory")){ //Ignore the show/hide when the subcategory checkboxes are changed
                if (element.is(":checked")){
                    html.find(`.feat-filter-sub-options[data-filter-category="${element.data("filterCategory")}"]`).show();
                } else {
                    html.find(`.feat-filter-sub-options[data-filter-category="${element.data("filterCategory")}"]`).hide();
                }
            }
            const newParams = new SpellSearchParams({html: html});
            this._searchSpells(newParams)
                .then((feats) => {
                    this._renderResults(html, feats);
            });
        });

        if (this.criteria.studies){
            html.find("#spellsRemaining").html(this.criteria.choose);
        }
        
    }

    async _searchSpells(criteria){
        let results = [];
        this.compendium = await game.packs.get("newera-sol366.spells").getDocuments();
        for (const spell of this.compendium){
            if (criteria.showSpell(spell)){
                const description = Formatting.amplifyAndFormatDescription(spell.system.description);
                const div = document.createElement("div");
                div.innerHTML = description;
                const text = div.textContent;
                spell.preview = Formatting.truncate(text, 150);

                spell.actionIcons = Formatting.getSpellActionIcons(spell, "spell-preview-actions");
                spell.rarity = NEWERA.spellRarity[spell.system.rarity];
                const existingSpell = this.actor.items.find(item => 
                    item.typeIs(NewEraItem.Types.MAGIC) &&
                    item.type == spell.type && 
                    item.system.casperObjectId == spell.system.casperObjectId
                );
                spell.alreadyOwned = !!existingSpell;
                spell.styles = spell.alreadyOwned && " alreadyOwned";
                results.push(spell);
            }
        }
        return results.sort(SpellBrowser.SORT_FUNCTIONS[criteria.sortFunction]);
    }

    async _displayLoading(html){
        html.find("#results").hide();
        html.find("#browserLoading").show();
    }

    async _renderResults(html, spells){
        const render = await renderTemplate("systems/newera-sol366/templates/extras/parts/spell-browser-table.html", { 
            results: spells,
            noResultsFound: spells.length == 0,
            actor: this.actor
        });
        html.find("#results").html(render);
        html.find("#browserLoading").hide();
        html.find("#results").show();

        html.find(".browser-result").on("dragstart", ev => {
            console.log("SPELL BROWSER DRAG START");
            const xfr = ev.originalEvent.dataTransfer;
            const element = $(ev.currentTarget);
            const dragData = {
                transferAction: "addSpellFromBrowser",
                actorId: this.actor.id,
                casperObjectId: element.data("casperObjectId"),
                itemType: element.data("casperType"),
                callback: () => {
                    if (this.criteria.studies){
                        if (this.remainingSelections > 1){
                            this.remainingSelections--;
                            html.find("#spellsRemaining").html(this.remainingSelections);
                        } else {
                            this.close();
                        }
                        //Apply the updated remaining-selections counter to the actor
                        const update = {
                            system: {
                                classes: {}
                            }
                        };
                        update.system.classes[this.studies.class] = {
                            spellStudies: {}
                        };
                        update.system.classes[this.studies.class].spellStudies[this.studies.level] = this.remainingSelections;
                        this.actor.update(update);
                    }
                }
            };
            xfr.setData("text/plain", JSON.stringify(dragData));
        });

        html.find(".spell-preview").click(ev => {
            const element = $(ev.currentTarget);
            const spell = this.compendium.find(spell => spell.type == element.data("casperType") && spell.system.casperObjectId == element.data("casperObjectId"));
            if (spell){
                spell.sheet.render(true);
            }
        });

        
    }

    //All non-alphabetical sort functions use alphabetical as secondary sorta
    static SORT_FUNCTIONS = [
        function(a, b){ //Rarity low-high
            if (a.system.rarity < b.system.rarity) return -1;
            else if (a.system.rarity > b.system.rarity) return 1;
            else return SpellBrowser.SORT_FUNCTIONS[4](a, b);
        },
        function(a, b){ //Rarity high-low
            if (a.system.rarity > b.system.rarity) return -1;
            else if (a.system.rarity < b.system.rarity) return 1;
            else return SpellBrowser.SORT_FUNCTIONS[4](a, b);
        },
        function(a, b){ //Level low-high
            if (a.system.level < b.system.level) return -1;
            else if (a.system.level > b.system.level) return 1;
            else return SpellBrowser.SORT_FUNCTIONS[4](a, b);
        },
        function(a, b){ //Level high-low
            if (a.system.level > b.system.level) return -1;
            else if (a.system.level < b.system.level) return 1;
            else return SpellBrowser.SORT_FUNCTIONS[4](a, b);
        },
        function(a, b){ //A-Z
            if (a.name < b.name) return -1;
            else if (a.name > b.name) return 1;
            else return 0;
        }
    ]

}