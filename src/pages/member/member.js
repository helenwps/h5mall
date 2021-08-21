import Vue from 'vue'
import app from './app.vue'
import router from "./router";
import url from "@/assets/base/url.js"; // 全局url.js
import main from "@/assets/base/main.js"; // main.js
import utils from "@/assets/base/utils.js"; // utils.js
// 导入组件库
import * as qdamaUi from '@/components/packages/index.js'
Vue.use(qdamaUi)

Vue.prototype.url = url;
Vue.prototype.main = main;
Vue.prototype.UTIL = utils;

Vue.config.productionTip = false;
new Vue({ 
  router,
  render: h => h(app)
}).$mount('#app')
