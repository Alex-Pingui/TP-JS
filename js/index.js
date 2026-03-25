import Utils from "./services/ParsedURL.js";

import Home from "./views/Home.js";
import EntityAll from "./views/EntityAll.js";
import EntityDetail from "./views/details.js";
import About from "./views/About.js";
import Error404 from "./views/Error404.js";

const routes = {
    '/' : Home,
    '/entities' : EntityAll,
    '/entities/:id' : EntityDetail,
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
        if (e.target.matches('.btn[href^="#/entities/"]')) {
            e.preventDefault();
            location.hash = e.target.getAttribute('href');
        }
    });
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// const Home = {
//   template: `<div><h1>Home</h1></div>`,
// };

// const EntityAll = {
//   template: `<div><h1>Entities</h1></div>`,
// };

// const routes = [
//   {
//     path: "/",
//     name: "Home",
//     component: Home,
//     alias: ["/home", "/accueil"],
//   },
//   {
//     path: "/entities",
//     name: "Entities",
//     component: EntityAll,
//     alias: "/entites",
//   },
//   {
//     path: "/:pathMatch(.*)*",
//     redirect: { name: "Home" },
//   },
// ];

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes,
// });

// const app = createApp({});
// app.use(router);
// app.mount("#app");
