import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const rotuerList = {
  mode: "hash",
  routes: [{
    path: "/",
    name: "message",
    component: () => import("./message/index.vue")
  },{
    path: "/message",
    name: "message",
    component: () => import("./message/index.vue")
    
  }, {
    path: "/register",
    name: "register",
    component: () => import("./register/index.vue")
    
  }, {
    path: "/result",
    name: "result",
    component: () => import("./result/index.vue")
  }, {
    path: "/verify",
    name: "verify",
    component: () => import("./verify/index.vue")
  }],
}
const router = new Router(rotuerList);
// 路由守卫
// router.beforeEach((to, from, next) => {
// 	next(); //如果匹配到正确跳转
// });

// router.onError((error) => {

// })

export default router;