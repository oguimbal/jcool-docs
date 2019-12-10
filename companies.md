# Companies  {docsify-ignore-all}

Here you can find the list of the companies that you can send to the API as your opponent.
<br/>
<br/>
Any company with <i class="fa fa-check-circle"></i> is validated by Justice.cool. It means that we know how to contact them efficiently. Use them in priority.
<br/>
<br/>
If you think that a company is missing among the validated companies and may be relevant to add, contact us at contact@justice.cool.

<vue>
    <template>
        <div style="margin-bottom:10px;">
            <select class="select-type" v-model="litigationType" @change="onLitigationTypeChange">
                <option value="">-- Filter by litigation type --</option>
                <option v-for="opt in litigationTypeOpt" :value="opt.value">
                    <span> {{ opt.display }}</span>
                </option>
            </select>
            <br />
            <span>* This filter will only be applied for validated companies.</span>
        </div>
        <form class="search-container">
            <input type="text" @keyup="find" class="search-bar" placeholder="Search for a company">
            <a href="#"><img class="search-icon" src="/_media/search-icon.png"></a>
        </form>
        <table>
            <tr>
                <th>Identifier</th>
                <th>Name</th>
                <th>Litigation type</th>
            </tr>
            <tr v-for="i in results">
                <td>
                    <div class="varid">
                        <i class="fa fa-copy" tooltip="Copy to clipboard" @click="copy(i.value)"></i>
                        <i v-if="i.value.startsWith('known:')" class="fa fa-check-circle" tooltip="Validated company"></i>
                        {{i.value}}
                    </div>
                </td>
                <td>{{i.data.name}}</td>
                <td style="text-align: center">{{displayFor(i.data.litigationType)}}</td>
            </tr>
        </table>
    </template>
    <script>
        return {
            data: {
                results: [],
                currentSearch: null,
                litigationTypeOpt: [],
                litigationType: ''
            },
            methods: {
                async doFind(txt) {
                    this.currentSearch = txt;
                    let reqData = {txt};
                    if (this.litigationType)
                        reqData.litigationType = this.litigationType;
                    const data = await auth.queryPrivate(`query FindCompany($txt: String!, $litigationType: String) {modelize { suggestCompanies(litigationType: $litigationType, suggest: $txt)}}`, reqData);
                    if (this.currentSearch === txt)
                        this.results = data.modelize.suggestCompanies;
                },
                async getLitigationTypes() {
                    const data = await auth.queryPrivate(`query getLitigationType {
                        modelize {
                            publicVariables (filter: "litigationType") { type }
                        }}`)
                    this.litigationTypeOpt = data.modelize.publicVariables[0].type.options;
                },
                onLitigationTypeChange() {
                    this.doFind(this.currentSearch || '')
                },
                displayFor(type) {
                    if (!type)
                        return '-';
                    const litType = this.litigationTypeOpt.find(t => t.value === type);
                    if (!litType)
                        return '-';
                    return litType.display;
                },
                copy(txt) {
                    copyToClipboard(txt);
                },
                find: debounce(function(e) {
                    this.doFind(e.target.value);
                }, 500),
            },
            mounted() {
                this.doFind('');
                this.getLitigationTypes();
            }
        };
    </script>
</vue>

<style>
.select-type {
    height: 40px;
    font-size: 16px
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
    margin-right: 0.3em;
}
.varid .fa-copy
{
    cursor: pointer;
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