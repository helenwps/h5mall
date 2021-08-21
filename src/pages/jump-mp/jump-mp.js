import Vue from 'vue'
import app from './app.vue'
import router from "./router";
import 'vant/lib/index.css';
import url from "@/assets/base/url.js"; // 全局url.js
import main from "@/assets/base/main.js"; // main.js
import { Swipe, SwipeItem } from 'vant';
import utils from "@/assets/base/utils.js"; // utils.js
Vue.use(Swipe);
Vue.use(SwipeItem);

Vue.prototype.url = url;
Vue.prototype.main = main;
Vue.prototype.UTIL = utils;
// 导入组件库
import * as qdamaUi from '@/components/packages/index.js'
Vue.use(qdamaUi);
Vue.config.productionTip = false;
new Vue({ 
  router,
  render: h => h(app)
}).$mount('#app')
