
(function() {

    var id = 0;
    function render () {
        var dom = window.Docsify.dom

        if (!dom) {
            return
        }

        (dom.findAll('vue') || []).forEach(function (element) {

            // extract template
            var children = [...element.children];
            var template = children.find(x => x.tagName === "TEMPLATE");
            var script = children.find(x => x.tagName === "SCRIPT");
            if (!template || !script)
                return;


            // parse vue template
            var scriptData = new Function(script.innerText)();

            // create template root
            var rendered = dom.create('div')
            rendered.innerHTML = template.innerHTML;
            element.parentNode.replaceChild(rendered, element);
            const vueElt = new Vue({
                el: rendered,
                ...scriptData
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