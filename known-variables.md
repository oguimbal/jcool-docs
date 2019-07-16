# Variables  {docsify-ignore-all}

Variables are all the facts that could be usefull to justice.cool during mediation

<vue>
    <template>
        <form class="search-container">
            <input type="text" @keyup="find" class="search-bar" placeholder="Search for a variable">
            <a href="#"><img class="search-icon" src="/_media/search-icon.png"></a>
        </form>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Litigation types</th>
                <th>Question</th>
                <th>Type</th>
            </tr>
            <tr v-for="i in results">
                <td>
                    <div class="varid">
                        <i class="fa fa-copy" tooltip="Copy to clipboard" @click="copy(i.id)"></i>
                        {{i.id}}
                    </div>
                </td>
                <td>{{i.name}}</td>
                <td>{{i.litigationTypes}}</td>
                <td class="text-center">
                    <span v-if="!i.question">-</span>
                    <i v-if="i.question" v-tooltip.bottom="i.question" class="fa fa-check"></i>
                </td>
                <td>
                    <span v-if="!isEnum(i.type)" v-tooltip.bottom="tooltipFor(i.type)">{{i.type.primary}}</span>
                    <v-popover v-if="isEnum(i.type)">
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
                    data.modelize.publicVariables.forEach(v => v.litigationTypes = v.litigationTypes.join(', '))
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
                isEnum(type) {
                    if (type.primary !== 'enum')
                        return false;
                    if (!type.options || typeof type.options === 'string')
                        return false;
                    return true;
                },
                tooltipFor(type) {
                    if (type.primary !== 'enum')
                        return '';
                    if (!type.options || typeof type.options === 'string')
                        return 'Dynamic options :(\nContact us.';
                    return '';
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
            <input type="text" @keyup="find" class="search-bar" placeholder="Search for a variable">
            <a href="#"><img class="search-icon" src="/_media/search-icon.png"></a>
        </form>
        <table>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Litigation Type</th>
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
                <td>{{i.litigationType || '-'}}</td>
                <td>
                    <v-popover>
                        <span>
                            <i class="fa fa-info-circle"></i>
                            {{i.variables.length}} variables
                        </span>
                        <template slot="popover">
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
                    const data = await auth.queryPrivate(`query FindClaim($txt: String!) {modelize { publicClaims(filter: $txt) {id name litigationType variables {id name}}}}`, {txt});
                    if (this.currentSearch === txt) {
                        this.results = data.modelize.publicClaims;
                        this.currentSearch = null;
                    }
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

input.search-bar{
  margin: 0 auto;
  width: 100%;
  height: 45px;
  padding: 0 20px;
  font-size: 1rem;
  border: 1px solid #D0CFCE;
  outline: none;
}
input.search-bar:focus {
    border: 1px solid #008ABF;
    transition: 0.35s ease;
    color: #008ABF;
}
 input.search-bar:focus::-webkit-input-placeholder{
      transition: opacity 0.45s ease;
  	  opacity: 0;
     }
input.search-bar:focus::-moz-placeholder {
      transition: opacity 0.45s ease;
  	  opacity: 0;
     }
input.search-bar:focus :-ms-placeholder {
     transition: opacity 0.45s ease;
  	 opacity: 0;
     }

.search-icon {
  position: relative;
  float: right;
  width: 75px;
  height: 75px;
  top: -62px;
  right: -15px;
}




</style>