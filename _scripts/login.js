async function loadScript(url, force) {
    this.loaded = this.loaded || {};
    if (!force && this.loaded[url])
        return this.loaded[url];

    var done;
    var error;
    const prom = new Promise((_done, _error) => {
        done = _done;
        error = _error;
    });
    var script = document.createElement('script');
    script.onload = done;
    script.onerror = error;
    script.src = url;
    scripts = document.getElementsByTagName('script')[0];
    scripts.parentNode.insertBefore(script, scripts);
    return this.loaded[url] = prom;
};

async function loadStyle(url) {
    this.loaded = this.loaded || {};
    if (this.loaded[url])
        return this.loaded[url];

    var done;
    var error;
    const prom = new Promise((_done, _error) => {
        done = _done;
        error = _error;
    });
    var script = document.createElement('link');
    script.setAttribute('rel', 'stylesheet');
    script.onload = done;
    script.onerror = error;
    script.href = url;
    scripts = document.getElementsByTagName('script')[0];
    scripts.parentNode.insertBefore(script, scripts);
    return this.loaded[url] = prom;
};

function debounce (fn, delay) {
    var timeoutID = null
    return function () {
      clearTimeout(timeoutID)
      var args = arguments
      var that = this
      timeoutID = setTimeout(function () {
        fn.apply(that, args)
      }, delay)
    }
  }

async function copyToClipboard(text) {

    (function() {
        if (window['clipboardData'] && window['clipboardData'].setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return window['clipboardData'].setData('Text', text);

        } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            const textarea = document.createElement('textarea');
            textarea.textContent = text;
            textarea.style.position = 'fixed';  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand('copy');  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    })();

    toast.info('Copied !');
}

(function() {
    async function load() {
        await loadScript('//cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js');
        await loadScript('//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js');
        await loadStyle('//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css');
    }
    window.toast = {};
    for (const c of ['info', 'error', 'success', 'warning']) {
        const cp = c;
        window.toast[c] = async function() {
            await load();
            toastr[cp](...arguments);
        };
    }
})();


// load auth0 lock
(function() {
    var isDev = window.location.href.includes('localhost');
    var auth0config = {
        responseType: 'token id_token code',
        audience: 'api.justice.cool',
        scope: 'openid profile email offline_access user_metadata app_metadata',
        ... isDev ? {
            clientID: 'MpnJmQFhBG0yo69XVvXFCLQKnXbBFtFX',
            domain: 'justicecool.eu.auth0.com',
            redirectUri: 'http://localhost:3001',
        } : {
            clientID: 'mDttl5aVQOmmKQnXuydhkGua3b1AQ2dd',
            domain: 'justice.eu.auth0.com',
            redirectUri: 'https://docs.justice.cool',
        }
    };
    var defautltAuthParams = {
        scope: auth0config.scope,
    }

    var _init;
    var initialized = new Promise((done)=> _init = done);

    function load() {
        if (!this.lock) {
            this.lock = loadScript('/_scripts/auth0-lock/lock.min.js')
                .then(() => {
                    return new Auth0Lock(auth0config.clientID, auth0config.domain, {
                        // container: idstr,
                        closable: true,
                        allowSignUp: true,
                        initialScreen: 'login',
                        // languageDictionary,
                        theme: {
                            logo: '/assets/images/logo.png',
                            primaryColor: '#3082F7',
                            // foregroundColor: '#414851',
                        },
                        auth: {
                            redirectUrl: auth0config.redirectUri,
                            responseType: auth0config.responseType, // 'token id_token',
                            audience: auth0config.audience,
                            params: defautltAuthParams,
                        }
                    });
                })
        }
        return this.lock;
    };

    function show() {
        // load auth0 asynchronously & show lock
        var data = {
            ...defautltAuthParams,
            state: document.location.hash,
        };
        return load().then(x => x.show({auth: {params: data}}));
    }

    async function handle() {
        if (
            !window.location.hash ||
            !window.location.hash.startsWith('#access_token=')
        ) {
            _init();
            return;
        }

        const hash = window.location.hash;
        const lock = await load();
        await new Promise(_done => {
            const done = () => {
                _done();
                _init();
            }
            lock.resumeAuth(hash, (err, evt) => {
                lock.hide();
                if(evt && evt.idToken)
                    setSession(evt);
                if (evt && evt.state && evt.state[0] === '#')
                    window.location.hash = evt.state;
                done();
            });
        });
    };
    function setSession(authResult) {
        const expiresAt = JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
        );
        sessionStorage.setItem('access_token', authResult.accessToken);
        sessionStorage.setItem('id_token', authResult.idToken);
        sessionStorage.setItem('expires_at', expiresAt);
        getProfile();// <= start loading profile
    }

    function logout() {
        sessionStorage.clear();
    }

    async function isAuthenticated() {
        await initialized;
        const expiresAt = JSON.parse(sessionStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    async function getProfile() {
        if(this._loadedProfile)
            return this._loadedProfile;
        if (!await isAuthenticated())
            throw new Error('Not authenticated');
        const stored = sessionStorage.getItem('profile');
        if (stored)
            this._loadedProfile = JSON.parse(stored);
        const accessToken = sessionStorage.getItem('access_token');
        if (!accessToken)
            throw new Error('Access Token must exist to fetch profile');
        const lock = await load();
        return await new Promise((done,err)=> {
            lock.getUserInfo(accessToken, (error, profile) => {
                if (error) {
                return err(error);
                }
                this._loadedProfile = profile;
                sessionStorage.setItem('profile', JSON.stringify(profile));
                done(profile);
            });
        });
    }


    async function loadCrisp() {
        if (typeof window === 'undefined')
            return;
        // <script type="text/javascript">(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
        window['$crisp']=[];
        window['CRISP_WEBSITE_ID']="24d98a5c-f2b6-44c8-8356-0b759661a972";
        await loadScript('https://client.crisp.chat/l.js');
    }

    if (!isDev)
        loadCrisp();

    const endpoint = isDev ? 'http://localhost:3000/v1' : 'https://api.staging.justice.cool/v1';
    const endpointPrivate = isDev ? 'http://localhost:3000/graphql' : 'https://api.staging.justice.cool/graphql';
    window.auth = {
        show,
        isDev,
        isAuthenticated,
        endpoint,
        getProfile,
        logout,
        async token() {
            if (await isAuthenticated())
                return sessionStorage.getItem('access_token');
        },
        query(query) {
            return fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })
            .then(res => res.json());
        },
        queryPrivate(query, variables) {
            return fetch(endpointPrivate, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables })
            })
            .then(res => res.json())
            .then(res => {
                if (!res.data)
                    throw res;
                return res.data;
            })
        }
    }

    handle();
})();