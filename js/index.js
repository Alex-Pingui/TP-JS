const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const Home = {
  template: `<div><h1>Home</h1></div>`,
};

const EntityAll = {
  template: `<div><h1>Entities</h1></div>`,
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    alias: ["/home", "/accueil"],
  },
  {
    path: "/entities",
    name: "Entities",
    component: EntityAll,
    alias: "/entites",
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "Home" },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp({});
app.use(router);
app.mount("#app");