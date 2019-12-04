# Variables  {docsify-ignore-all}

Variables are all the facts that could be useful to justice.cool during mediation

<vue>
    <template>
        <form class="search-container">
            <input type="text" @keyup="find" class="search-bar" placeholder="Search for a variable">
            <a href="#"><img class="search-icon" src="/_media/search-icon.png"></a>
        </form>
        <table>
            <tr v-if="results && results.length">
                <th>ID</th>
                <th>Name</th>
                <!--th>Litigation types</th-->
                <th>Question</th>
                <th>Type</th>
            </tr>
            <template v-for="i in results">
                <tr>
                    <td>
                        <div class="varid">
                            <i class="fa fa-copy" tooltip="Copy to clipboard" @click="copy(i.id)"></i>
                            {{i.id}}
                        </div>
                    </td>
                    <td>{{i.name}}</td>
                    <!--td>{{i.litigationTypes}}</td-->
                    <td class="text-center">
                        <span v-if="!i.question">-</span>
                        <i v-if="i.question" v-tooltip.bottom="i.question" class="fa fa-check"></i>
                    </td>
                    <td @click="clikedValueDesc(i)" class="clickable">
                        <span v-if="!isPlainEnum(i.type)" v-tooltip.bottom="tooltipFor(i.type)" >
                            <i v-if="isSuggestedEnum(i.type)" class="fa fa-info-circle"></i>
                            {{i.type.primary}}
                        </span>
                        <v-popover v-if="isPlainEnum(i.type)">
                            <span>
                                <i class="fa fa-info-circle"></i>
                                {{i.type.primary}}
                            </span>
                            <template slot="popover">
                                <ul>
                                    <li v-for="o in i.type.options">
                                        <b>{{o.value}}</b> <br> &nbsp; &nbsp; <i>{{o.display}}</i>
                                    </li>
                                </ul>
                            </template>
                        </v-popover>
                    </td>
                </tr>
                <tr v-if="showDynEnum(i)">
                    <td colspan="99">
                        <div style="margin-bottom: 10px">
                            Here you can search for an option.<br />
                            Click an option to copy its value.<br/>
                            <span v-if="i.search">The selected option correspond to the value: <strong>{{i.search}}</strong></span>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <option-suggestor :source="i.type.source" v-on:set-option="setSearch($event, i)"></option-suggestor>
                            </div>
                        </div>
                    </td>
                </tr>
            </template>
        </table>
    </template>
    <script>
        return {
            data: {
                results: [],
                currentSearch: null,
            },
            methods: {
                async doFind(txt) {
                    this.currentSearch = txt;
                    const data = await auth.queryPrivate(`query FindVar($txt: String!) {modelize { publicVariables(filter: $txt) {id name scope type question litigationTypes}}}`, {txt});
                    if (data.modelize.publicVariables) {
                        data.modelize.publicVariables.forEach(v => {
                            if (v.litigationTypes)
                                v.litigationTypes = v.litigationTypes.join(', ')
                        })
                    }
                    if (this.currentSearch === txt) {
                        this.results = data.modelize.publicVariables;
                        this.currentSearch = null;
                    }
                },
                copy(txt) {
                    copyToClipboard(txt);
                },
                find: debounce(function(e) {
                    this.doFind(e.target.value);
                }, 100),
                isPlainEnum(type) {
                    if (type.primary !== 'enum')
                        return false;
                    if (!type.options || typeof type.options === 'string')
                        return false;
                    return true;
                },
                isSuggestedEnum(type) {
                    return type.primary === 'enum' && type.options && typeof type.options === 'string';
                },
                tooltipFor(type) {
                    if (type.primary !== 'enum')
                        return '';
                    if (!type.options || typeof type.options === 'string')
                        return 'Click to open option suggestor';
                    return '';
                },
                clikedValueDesc(i) {
                    Vue.set(i, '$show', !i.$show);
                    if (!i.$show)
                        i.search = null;
                },
                showDynEnum(i) {
                    return i.$show && i.type.primary === 'enum' && (!i.type.options || typeof i.type.options === 'string');
                },
                setSearch(value, i) {
                    Vue.set(i, 'search', value);
                    console.log(i)
                }
            },
            mounted() {
                this.doFind('');
            }
        };
    </script>
</vue>










# Claim types

Claims that are supported by justice.cool: Those claims are available for automatic scoring.


?> `Data dependencies` is a list of all variables that **might** be needed to compute the claim automatically. In most cases, only a fraction of them will be required.


<vue>
    <template>
        <form class="search-container">
            <input type="text" @keyup="find" class="search-bar" placeholder="Search for a claim">
            <a href="#"><img class="search-icon" src="/_media/search-icon.png"></a>
        </form>
        <table>
            <tr v-if="results && results.length">
                <th>ID</th>
                <th>Name</th>
                <!--th>Litigation Type</th-->
                <th>Data dependencies</th>
            </tr>
            <tr v-for="i in results">
                <td>
                    <div class="varid">
                        <i class="fa fa-copy" tooltip="Copy to clipboard" @click="copy(i.id)"></i>
                        {{i.id}}
                    </div>
                </td>
                <td>{{i.name}}</td>
                <!--td>{{i.litigationType || '-'}}</td-->
                <td>
                    <v-popover>
                        <span v-if="i.variables">
                            <i class="fa fa-info-circle"></i>
                            {{ i.variables.length || 0}} variable(s)
                        </span>
                        <span v-if="!i.variables" @click="getDataDependencies(i)" style="cursor: pointer;">Show</span>
                        <template slot="popover" v-if="i.variables && i.variables.length">
                            <ul>
                                <li v-for="o in i.variables">
                                    <b>{{o.id}}</b> <br> &nbsp; &nbsp; <i>{{o.name}}</i>
                                </li>
                            </ul>
                        </template>
                    </v-popover>
                </td>
            </tr>
        </table>
    </template>
    <script>
        return {
            data: {
                results: [],
                currentSearch: null,
            },
            methods: {
                async doFind(txt) {
                    this.currentSearch = txt;
                    const data = await auth.queryPrivate(`query FindClaim($txt: String!) {modelize { publicClaims(filter: $txt) {id name litigationType }}}`, {txt});
                    if (data.modelize.publicClaims) {
                        data.modelize.publicClaims.forEach(v => {
                            if (v.litigationTypes)
                                v.litigationTypes = v.litigationTypes.join(', ')
                        })
                    }
                    if (this.currentSearch === txt) {
                        this.results = data.modelize.publicClaims;
                        this.currentSearch = null;
                    }
                },
                async getDataDependencies(claim) {
                    const data = await auth.queryPrivate(`query FindDataDependencies($claimId: String!) {modelize { dataDependencies(claimId: $claimId) {id, name} }}`, {claimId: claim.id});
                    Vue.set(claim, 'variables', data.modelize.dataDependencies);
                },
                copy(txt) {
                    copyToClipboard(txt);
                },
                find: debounce(function(e) {
                    this.doFind(e.target.value);
                }, 100),
            },
            mounted() {
                this.doFind('');
            }
        };
    </script>
</vue>




<style>
.row {
    display: flex;
    flex-direction: row;
}
.vertical-align {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.col-6 {
    width: 50%;
}
.clickable {
    cursor: pointer;
} 
.varid {
    width: 15em;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    white-space: nowrap;
}
.varid .fa {
    opacity: 0.5;
    transition: opacity 0.3s;
    cursor: pointer;
    margin-right: 0.3em;
}
.varid .fa:hover {
    opacity: 1;
}

table, tbody {
    width: 100%;
}

table {

    /* weird... */
    transform: translateY(-4em);
}

.search-container{
  width: 100%;
  display: block;
}

</style>