import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
  },
  {
    path: "/about",
    name: "about",
    // component: function () {
    //   return import(/* webpackChunkName: "about" */ "../views/AboutView.vue");
    // },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
