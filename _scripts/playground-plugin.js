
(function() {
    const template = `
    <div class="tplroot" :class="editorClassName">
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

        (dom.findAll('pre[data-lang="graphql"]') || []).forEach(function (element) {
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
                    idstr,
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
                            this.hasSchema ? 'schema' : null,
                            this.state === 'logged-out' ? 'logged-out' : 'logged-in',
                            this.heightClass || '',
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
                        let [query] = spl.splice(0, 1);
                        let matched = spl.map(x => /^\s*(\$?)([a-zA-Z]+)([\r\n\s]+((.|\r|\n)*))?$/g.exec(x) || []);
                        const variables = {};
                        for (let [_, dol, k, __, v] of matched) {
                            if (!k)
                                continue;
                            if (dol) {
                                v = '(function() { return ' + v + ';})()';
                                variables[k] = eval(v);
                            } else {
                                switch (k) {
                                    case 'height':
                                        this.heightClass = v.trim();
                                        break;

                                    case 'fullpage':
                                        this.heightClass = 'fullpage';
                                        break;
                                    case 'schema':
                                        this.hasSchema = true;
                                        break;
                                }
                            }

                        }

                        // instanciate
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
                        console.log('...created');
                        this.$data.state = token ? 'logged-in' : 'logged-out';
                        this.$forceUpdate();

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