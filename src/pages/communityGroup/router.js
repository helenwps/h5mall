import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const rotuerList = {
  mode: "hash",
  routes: [{
      path: "/",
      name: "storeList",
      component: () => import("./storeList/index.vue")
    },{
      path: "/searchStore",
      name: "搜索",
      component:  () => import("./searchStore/index.vue")
    },{
        path: "/userInfo",
        name:'会员信息',
        component: () => import("./userInfo/index.vue")
    },{
        path: "/submitSuccess",
        name:'会员信息',
        component: () => import("./submitSuccess/index.vue")
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
