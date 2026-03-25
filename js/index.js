import Utils from "./services/ParsedURL.js";

import Home from "./views/Home.js";
import EntityAll from "./views/EntityAll.js";
import EntityDetail from "./views/details.js";
import About from "./views/About.js";
import Error404 from "./views/Error404.js";
import Combat from "./views/Combat.js";

const routes = {
    '/' : Home,
    '/entities' : EntityAll,
    '/entities/:id' : EntityDetail,
    '/combat' : Combat,
    '/about' : About
};

const router = async () => {
    const content = document.querySelector('#content');
    let request = Utils.parseRequestURL();
    let parsedURL;
    if (!request.resource) {
        parsedURL = '/';
    } else if (!request.id) {
        parsedURL = '/' + request.resource;
    } else {
        parsedURL = '/' + request.resource + '/:id';
    }
    let page = routes[parsedURL] ? new routes[parsedURL]() : new Error404();
    content.innerHTML = await page.render();
    if (typeof page.after_render === 'function') {
        await page.after_render();
    }
    content.addEventListener('click', (e) => {
        if (e.target.matches('.btn[href^="#/entities/"]' || e.target.matches('a[href^="#/combat"]'))) {
            e.preventDefault();
            location.hash = e.target.getAttribute('href');
        }
    });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
