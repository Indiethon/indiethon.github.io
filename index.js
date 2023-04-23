let match;
let config;
let loading;
let routes;

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const router = async () => {

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path)),
        };
    });

    const path = window.location.pathname.replace(/\/$/, "");
    match = potentialMatches.find(potentialMatch => potentialMatch.route.path === path);

    console.log(match)

    let head = document.querySelector('head');
    let main = document.querySelector('main');

    document.querySelector('#navbar-toggle').checked = false
    document.title = `${match.route.name} - Indiethon`

    let fade = new Promise((resolve) => {
        document.querySelector('.fader').classList.add('visible');
        setTimeout(() => resolve(), 1000)
    })

    loading = true;

    let res = await fetch(`/pages/${match.route.html}`);
    let text = await res.text();

    let link;
    let script;

    let jsPromise = new Promise(async (jsResolve) => {
        if (!match.route.javascript) return jsResolve();
        script = document.createElement('script');
        script.setAttribute('src', `/pages/${match.route.javascript}`);
        script.setAttribute('import', '')
        script.onload = () => jsResolve();
        head.appendChild(script);
    })

    await Promise.all([fade, jsPromise])

    let cssPromise = new Promise(async (cssResolve) => {
        if (!match.route.stylesheet) return cssResolve();
        link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', `/pages/${match.route.stylesheet}`);
        link.setAttribute('import', '')
        link.onload = () => cssResolve();
        head.appendChild(link);
    })

    await Promise.all([cssPromise])
    
    document.querySelectorAll('[route]').forEach(x => x.remove());
    main.innerHTML = text;
    if (link) link.setAttribute('route', '')
    if (script) script.setAttribute('route', '')
    document.querySelector('.page-container').scrollTo(0, 0);
    document.querySelector('main').scrollTo(0, 0);
    try {
        await load(config, match.route.name)
    } catch { }
    document.querySelector('.fader').classList.remove('visible');
    setTimeout(() => { try { visible(config) } catch { } }, 1000);
    loading = false;
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", async () => {

    config = await (await fetch('/config.json')).json();
    routes = config.pages;

    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            let href = e.target.href;
            history.pushState(null, null, href);
            router();
        };
    });

    router();
});

function changePath(path) {
    let href = path;
    history.pushState(null, null, href);
    router();
}