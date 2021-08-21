import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const rotuerList = {
  mode: "hash",
  routes: [{
      path: "/",
      name: "index",
      component:() => import("./index/index.vue")
    },{
      path: "/index",
      name: "跳转小程序",
      component:  () => import("./index/index.vue")
    }],
}
const router = new Router(rotuerList);

export default router;
