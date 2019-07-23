
(function() {
    const template = `
    <div class="tplroot" :class="editorClassName">

        <template v-if="equivalents.length > 1">
            <div class="tab" v-for="t in equivalents" :class="{selected: tab === t}" @click="tab=t">
                {{t.language || 'GraphQL'}}
            </div>
        </template>
        <div class="tabsection gql" v-show="tab==='gql'">
            <div v-if="state === 'loading'" class="tplload text-center">
                <div class="loader"></div>
            </div>
            <div class="login-btn text-center" v-if="state === 'logged-out'">
                <button class="btn" @click="login">Login to run</button>
            </div>
            <div class="login-btn text-center" v-if="state === 'logged-in'">
                <button class="btn" @click="logout">Logout</button>
            </div>
            <div :class="editorClassName" class="gqleditor" :id="idstr">
            </div>
            <div v-if="state === 'error'" class="text-danger text-center">Error loading playground</div>
        </div>
        <div class="tabsection code" v-if="tab !== 'gql'">
            <pre class="wrapper" v-html="tab.body">
            </pre>
        </div>
    </div>
    `;

    const oldFocus = HTMLTextAreaElement.prototype.focus;

    function snoozeFocus() {
        HTMLTextAreaElement.prototype.focus = function() {
            // prevent focusing when playground loads
        };
        setTimeout(function() {
            HTMLTextAreaElement.prototype.focus = oldFocus
        }, 1000);
    }

    var id = 0;
    function render () {
        var dom = window.Docsify.dom

        if (!dom) {
            return
        }

        (dom.findAll('pre[data-lang="playground"]') || []).forEach(function (element) {
            // create template root
            var rendered = dom.create('div')
            rendered.innerHTML = template;
            var el = rendered.getElementsByClassName('tplroot')[0];
            element.parentNode.replaceChild(rendered, element);
            id++;
            var idstr =  'vid' + id;

            const vueElt = new Vue({
                el: el,
                data: {
                    state: 'loading',
                    heightClass: '',
                    loggedIn: false,
                    hasSchema: false,
                    tab: 'gql',
                    idstr,
                    equivalents: [],
                },
                methods: {
                    login() {
                        auth.show();
                    },
                    logout() {
                        auth.logout();
                        this.state = 'logged-out';
                    }
                },
                computed: {
                    editorClassName() {
                        return [
                            this.tab === 'gql' ? 'withgql' : '',
                            this.hasSchema ? 'schema' : null,
                            this.state === 'logged-out' ? 'logged-out' : 'logged-in',
                            (this.tab === 'gql' ? this.heightClass : null) || '',
                            this.equivalents.length ? 'tabs' : '',
                        ].join(' ');
                    }
                },

                async beforeDestroy() {
                    // destroy playground (avoids requests in the background)
                    if (this.playElt)
                        ReactDOM.unmountComponentAtNode(this.playElt);
                    this.playElt = null;
                },
                async mounted() {
                    // https://github.com/prisma/graphql-playground
                    // force reload script (to allow multiple-instances on the same page)

                    // load react (required for destroy)
                    try {
                        await loadScript('https://unpkg.com/react@16/umd/react.production.min.js');
                        await loadScript('https://unpkg.com/react-dom@16/umd/react-dom.production.min.js');
                        await loadScript('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js');
                        await loadScript('//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js', true);
                        console.log('Creating a playground');
                        const playground = GraphQLPlayground;
                        delete GraphQLPlayground;

                        // auth headers
                        const token = await auth.token();
                        let headers = !token
                            ? undefined
                            : {
                                Authorization: 'Bearer ' + token,
                            };

                        let spl = element.innerText.split(/==>/g);
                        let matched = spl.map(x => ({
                            match: /^\s*([a-zA-Z]+)([\r\n\s]+((.|\r|\n)*))?$/g.exec(x) || [],
                            val: x,
                        }));
                        const variables = {};
                        const variablesDef = {};
                        for (let {match, val} of matched) {
                            const [full, k, __, v] = match;
                            if (!k)
                                continue;
                            switch (k) {
                                case 'gql':
                                    const query = v.trim();
                                    snoozeFocus();
                                    // const playElt = this.$refs.gqleditor.firstElementChild;
                                    this.playElt = document.getElementById(idstr);
                                    playground.init(this.playElt, {
                                            // workspaceName: element.innerText,
                                            settings: {
                                                'schema.polling.enable': false,
                                            },
                                            tabs: [{
                                                endpoint: auth.endpoint,
                                                query,
                                                name: 'my query',
                                                headers,
                                                variables: JSON.stringify(variables),
                                            }]
                                        });
                                    this.equivalents.push('gql');
                                    break;
                                case 'variable':
                                    const [_, varName, varVal] = /^\s*([a-zA-Z]+)(.+)$/gs.exec(v) || [];
                                    if (varName && varVal) {
                                        const toEval = '(function() { return ' + varVal.trim() + ';})()';
                                        variablesDef[varName] = varVal.trim();
                                        variables[varName] = eval(toEval);
                                    }
                                    break;
                                case 'height':
                                    this.heightClass = v.trim();
                                    break;

                                case 'fullpage':
                                    this.heightClass = 'fullpage';
                                    break;
                                case 'schema':
                                    this.hasSchema = true;
                                    break;
                                case 'wrapper':
                                    const [__, language, code] = /^([a-zA-Z\#\+]+)\b(.+)$/mgs.exec(v.trim()) || [];
                                    const finalCode = code.replace(/\$[a-zA-Z]+\b/g, (arg) => {
                                        return variablesDef[arg] || arg;
                                    })
                                    this.equivalents.push({
                                        language,
                                        body: Prism.highlight(finalCode.trim(), Prism.languages[language.toLowerCase()], language.toLowerCase()),
                                    });
                            }

                        }

                        this.tab = this.equivalents[0];
                        this.$data.state = token ? 'logged-in' : 'logged-out';
                        this.$forceUpdate();
                        console.log('...created');

                    } catch (e) {
                        console.error(e);
                        this.state = 'error';
                    }
                }
            });

            // subscribe to path change & destroy view
            function simplifiedHash() {
                const h = window.location.hash;
                const i = h.indexOf('?');
                return i > 0 ? h.substr(0, i) : h;
            }
            var oldHash = simplifiedHash();
            function hashChange() {
                const h = simplifiedHash();
                if (oldHash === h)
                    return;
                console.log('Destroying playground');
                vueElt.$destroy();
                window.removeEventListener('hashchange', hashChange);
            }

            window.addEventListener('hashchange', hashChange);
        })
    }

    function install (hook) {
        hook.doneEach(function () {
            return render()
        })
    }

    $docsify.plugins = [].concat(install, $docsify.plugins)
})();