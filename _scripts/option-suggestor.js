Vue.component('option-suggestor', {
    template: `
    <div>
        <template>
            <input
                type="text"
                v-model="search"
                @input="onChange"
                class="search-bar"
            />
            <ul
                v-show="isOpen"
                style="margin-left: 10px"
                :style="autocompleteResults"
            >
                <li
                    v-for="option in options"
                    @click="setOption(option)"
                    :style="autocompleteResult"
                >
                <b>{{option.value}}</b> : {{ option.display }}
                </li>
            </ul>
        </template>
    </div>
    `,
    props: ['source'],
    data: () => ({
        options: [],
        search: '',
        currentSearch: null,
        isOpen: false,
        autocompleteResults: {
            margin: '0',
            border: '1px solid #eeeeee',
            'max-height': '200px',
            overflow: 'scroll',
        },
        autocompleteResult: {
            'list-style': 'none',
            'text-align': 'left',
            padding: '4px 2px',
            cursor: 'pointer',
        }
    }),
    methods: {
        async doFind(txt) {
            if (txt.length < 3)
                return;
            this.currentSearch = txt;
            let reqData = {
                suggest: txt,
                source: this.source,
            };
            const data = await auth.queryPrivate(`query FindQuestionOption($source: String!, $suggest: String) {suggestionSource(source: $source, suggest: $suggest)}`, reqData);
            if (this.currentSearch === txt)
                this.options = data.suggestionSource;
        },
        onChange: debounce(function(e) {
            this.isOpen = true;
            this.doFind(e.target.value);
        }, 100),
        setOption(option) {
            this.search = `${option.value} - ${option.display}`;
            copyToClipboard(option.value);
            this.$emit('set-option', option.value)
            this.isOpen = false;
        },
    },
    mounted() {
        this.doFind('');
    }
});