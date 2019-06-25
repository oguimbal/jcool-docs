
(function() {
    function render (selector) {
        var dom = window.Docsify.dom

        if (!dom) {
            return
        }

        (dom.findAll(selector) || []).forEach(function (element) {
            
            var parent = element.parentNode
            var rendered = dom.create('div')
            rendered.className  = 'gqleditor';
            rendered.innerHTML = '';
            // rendered.style.height = '400px';
            parent.replaceChild(rendered, element)
            // https://github.com/prisma/graphql-playground
            GraphQLPlayground.init(rendered, {
                workspaceName: element.innerText,
                tabs: [{
                    endpoint: 'https://api.justice.cool/graphql',
                    query: element.innerText,
                    name: 'my query',
                    headers: { my: 'header'}
                }]
            })
        })
    }

    function install (hook) {
        hook.doneEach(function () {
            return render('pre[data-lang="graphql"]')
        })
    }

    $docsify.plugins = [].concat(install, $docsify.plugins)
})();