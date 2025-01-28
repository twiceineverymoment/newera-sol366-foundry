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
        this.studies = studies || {};
        this.remainingSelections = null;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
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
        return "systems/newera-sol366/templates/extras/spell-browser.hbs";
    }

    getData() {
        const context = super.getData();

        if (this.studies){
            if (this.criteria.choose == -1){
                context.chooseAll = true;
                this.remainingSelections = -1;
            } else {
                try {
                    this.remainingSelections = this.actor.system.classes[this.studies.className].spellStudies[this.studies.level][this.studies.index];
                    if (this.remainingSelections === undefined){
                        this.remainingSelections = this.criteria.choose;
                    }
                } catch (err) {
                    this.remainingSelections = this.criteria.choose;
                }
            }
        }

        context.initialCriteria = this.criteria;
        context.initialFilterData = this._getHandlebarsInputCriteria();
        context.spellLists = this._getSpellListOptions();
        context.remainingSelections = this.remainingSelections;
        context.complete = !!this.studies.className && this.remainingSelections == 0;

        console.log("SPELL STUDY GUIDE CONTEXT DUMP");
        console.log(context);
        return context;
    }

    _getSpellListOptions(){
        const output = {};
        for (const [key, list] of Object.entries(NEWERA.spellStudiesLists)){
            for (const clazz of this.actor.items.filter(i => i.typeIs(NewEraItem.Types.CLASS))){
                if (key.includes(clazz.system.selectedClass.toLowerCase())){
                    if (this.criteria.lists.includes(key)){
                        list.checked = true;
                    }
                    output[key] = list;
                }
            }
        }
        return output;
    }

    //Mapping object derived from the initial search criteria that determines which check boxes on the browser should be initially checked.
    _getHandlebarsInputCriteria(){
        const filterData = {};
        for (const form of this.criteria.forms){
            filterData[form] = true;
        }
        for (const school of this.criteria.schools){
            filterData[NEWERA.schoolOfMagicNames[school]] = true;
        }
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
        
    }

    async _searchSpells(criteria){
        let results = [];
        const documents = await game.packs.get("newera-sol366.spells").getDocuments();
        this.compendium = documents.filter(doc => doc.typeIs(NewEraItem.Types.MAGIC)); //As of v1.3, alchemy recipes now live in the spells compendium. We only want the spell browser to deal with spells and enchantments
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
        const render = await renderTemplate("systems/newera-sol366/templates/extras/parts/spell-browser-table.hbs", { 
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
                studies: this.studies,
                remaining: this.remainingSelections,
                casperObjectId: element.data("casperObjectId"),
                itemType: element.data("casperType"),
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
        },
        function(a, b){ //SSG Sort Order (Level high-low then rarity high-low)
            if (a.system.level > b.system.level) return -1;
            else if (a.system.level < b.system.level) return 1;
            else if (a.system.rarity > b.system.rarity) return -1;
            else if (a.system.rarity < b.system.rarity) return 1;
            else if (a.type == "Enchantment" && b.type == "Spell") return 1;
            else if (a.type == "Spell" && b.type == "Enchantment") return -1;
            else return 0;
        }
    ]

    static generateSpellStudiesFeature(className, feature){
        let isEnchantmentStudies = false;
        let listHtml = "";
        for (const study of feature.studies){
            if (study.spellType == "E") isEnchantmentStudies = true;
            const listDesc = "";
            if (study.lists && study.lists.length == 1){
                const spellListParams = NEWERA.spellLists[study.lists[0]]
                listDesc = spellListParams.label;
            } else if (study.schools && study.schools.length == 1){
                listDesc = `${NEWERA.schoolOfMagicNames[study.schools[0]]} ${study.spellType == 'E' ? "Enchantments" : "Spells"}`;
            } else if (study.forms && study.forms.length == 1){

            } else {
                listDesc = (study.spellType == 'E' ? "Enchantments" : "Spells");
            }
            const listHeader = `<h4>${study.choose} ${NEWERA.spellRarity[study.rarity]} ${listDesc} (Level ${study.level.max}${study.level.max > 1 ? " or lower":""})</h4>`;
            const button = `<button class="sheet-input spell-studies" data->`
        }

        const output = `<p>You learn new spells from the Spell Study Guide.</p>`
    }

}