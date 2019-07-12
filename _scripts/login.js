async function loadScript(url, force) {
    this.loaded = this.loaded || {};
    if (!force && this.loaded[url])
        return this.loaded[url];

    var done;
    const prom = new Promise(_done => done = _done);
    var script = document.createElement('script');
    script.onload = done;
    script.src = url;
    scripts = document.getElementsByTagName('script')[0];
    scripts.parentNode.insertBefore(script, scripts);
    return this.loaded[url] = prom;
};

// load auth0 lock
(function() {
    var isDev = window.location.href.includes('localhost');
    var auth0config = {
        responseType: 'token id_token code',
        audience: 'api.justice.cool',
        scope: 'openid profile email offline_access user_metadata app_metadata',
        clientID: 'MpnJmQFhBG0yo69XVvXFCLQKnXbBFtFX',
        domain: 'justicecool.eu.auth0.com',
        redirectUri: isDev ? 'http://localhost:3001' : 'https://docs.justice.cool',
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


    window.auth = {
        show,
        isDev,
        isAuthenticated,
        getProfile,
        logout,
        async token() {
            if (await isAuthenticated())
                return sessionStorage.getItem('access_token');
        }
    }

    handle();
})();