(() => {

    Vue.component('type-display', {
        template: `<span>
            <ul v-if="kind === 'plainEnum'">
                <li v-for="o in type.options">
                    <b>{{o.value}}</b> <br> &nbsp; &nbsp; <i>{{o.display}}</i>
                </li>
            </ul>
            <span v-else-if="kind === 'array'"><i>Array</i> [<type-display :type="type.of" />]</span>
            <span v-else-if="kind === 'class'">{
                <div v-for="(o, k) in type.fields">
                &nbsp;&nbsp;&nbsp;&nbsp;<b>{{k}}</b> ⇨ <type-display :type="o" />
                </div>
            }
            </span>
            <span v-else-if="kind === 'suggestEnum' && firstLevel">
                Click to open option suggestor
            </span>
            <span v-else>
                {{type.primary}}
            </span>


            <i v-if="type.desc">
            &nbsp;({{type.desc}})
            </i>
        </span>`,
        props: ['type', 'firstLevel'],
        data: () => ({
        }),
        computed: {
            kind() {
                return toKind(this.type);
            },
        },
        methods: {

        },
        mounted() {
        }
    })
    Vue.component('type-details', {
        template: `
<span>
    <span  v-if="!kind">
        {{type.primary}}
    </span>

    <v-popover v-if="kind">
        <span>
            <i class="fa fa-info-circle"></i>
            {{type.primary}}
        </span>
        <template slot="popover">
            <type-display :type="type" :firstLevel="true" />
        </template>
    </v-popover>
</span>
    `,
        props: ['type'],
        data: () => ({
        }),
        computed: {
            kind() {
                return toKind(this.type);
            },
        },
        methods: {

        },
        mounted() {
        }
    });

    function toKind(type) {
        switch (type.primary) {
            case 'enum':
                if (!type.options) {
                    return null;
                }
                if (typeof type.options === 'string')
                    return 'suggestEnum';
                return 'plainEnum';
            case 'class':
            case 'array':
                return type.primary;
        }
    }

})();