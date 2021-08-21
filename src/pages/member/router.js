import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const rotuerList = {
  mode: "hash",
  routes: [{
      path: "/",
      name: "register",
      component: () => import("./register/index.vue")
    },{
      path: "/register",
      name: "注册",
      component:  () => import("./register/index.vue")
    },{
        path: "/memberDetail",
        name:'会员信息',
        component: () => import("./register/memberDetail.vue")
    },{
        path: "/registerSuccess",
        name:'会员信息',
        component: () => import("./register/registerSuccess.vue")
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
