import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Viewer from "../views/Viewer.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Viewer",
    component: Viewer
  }
];

const router = new VueRouter({
  routes
});

export default router;
