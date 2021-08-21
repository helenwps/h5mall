import Vue from 'vue'
import app from './app.vue'
import router from "./router";
import url from "@/assets/base/url.js"; // 全局url.js
import main from "@/assets/base/main.js"; // main.js
import utils from "@/assets/base/utils.js"; // utils.js
// 导入组件库
import * as qdamaUi from '@/components/packages/index.js'
Vue.use(qdamaUi)

import 'vant/lib/index.css';
import {
  Field
} from 'vant';
Vue.use(Field);
import {
  Icon
} from 'vant';
Vue.use(Icon);
import {
  Popup
} from 'vant';
Vue.use(Popup);
import {
  DatetimePicker
} from 'vant';
Vue.use(DatetimePicker);
import {
  Tab,
  Tabs
} from 'vant';
Vue.use(Tab);
Vue.use(Tabs);

import {
  Toast
} from 'vant';
Vue.use(Toast);
Vue.prototype.Toast = Toast;
import {
  Uploader
} from 'vant';
Vue.use(Uploader);
import {
  RadioGroup,
  Radio
} from 'vant';
Vue.use(Radio);
Vue.use(RadioGroup);
import {
  List
} from 'vant';
Vue.use(List);

Vue.prototype.url = url;
Vue.prototype.main = main;
Vue.prototype.UTIL = utils;

Vue.config.productionTip = false;
import Vuex from "vuex";
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 记录第一次是否从审核页面进入；情况：如果是 且该记录审核不通过则短信验证页无需再跳转审核结果页，直接跳转注册页
    verifyPageIn: {
      phone: "",
      path: "",
    },
    form: {
      id: "",
      // 短信验证页面
      headmobile: "",
      code: "",
      referrerid: "",

      // 团长（1/3）
      headname: "",
      shopname: "",
      latitude: "", //自提点维度 ,
      longitude: "", //自提点经度
      address: "", //自提点详细地址 ,
      provincename: "", // (string, optional): 自提点省份名称 ,
      cityname: "", // (string, optional): 自提点城市
      areaname: "",
      businessend: "", //(string, optional): 营业结束时间 ,
      businessstart: "", //(string, optional): 营业开始时间 ,
      shoppic: "", // (string, optional): 自提点图片，多个,分开

      // 团长（2/3）
      bankcardholder: "", // (string, optional): 持卡人姓名 ,
      idcardno: "", //  (string, optional): 身份证号码 ,
      bankcardno: "", // (string, optional): 银行卡号

      bankname: "", //  (string, optional): 银行名称 ,
      bankcode: "", //  (string, optional): 银行编码 ,
      bankleftmobile: "", // (string, optional): 银行预留手机号码 ,
      // 团长（3/3）
      idcardback: "", //  (string, optional): 身份证图背面 ,
      idcardfront: "", //  (string, optional): 身份证图正面 ,
      wechatpic: "", //(string, optional): 微信群资源图，多个,分开 ,

      formattedAddress: "" //经纬度地图地址
    },

    // 注册页面步骤页
    registerIndex: 1,
  },
  getters: {
    checkFirstPage: state => {
      if (isEmpty(state.form.shopname)) {
        return "请填写自提点名称";
      }
      if (state.form.shopname.length < 3 || state.form.shopname.length > 10) {
        return "自提点名称需3-10个字符";
      }
      if (!state.form.latitude || !state.form.longitude) {
        return "请选择自提地点"
      }
      if (isEmpty(state.form.address)) {
        return "请填写详细地址";
      }
      if (!state.form.businessstart || !state.form.businessend) {
        return "请填选择营业时间";
      }
      if (!state.form.shoppic) {
        return "请上传自提点照片";
      }
      return "";
      function isEmpty(str) {
        return !str || str.trim() == "";
      }
    },
    checkSecondPage: state => {
      if (isEmpty(state.form.bankcardholder)) {
        return "请填写持卡人姓名";
      }
      if (!isChinese(state.form.bankcardholder)) {
        return "持卡人姓名只能录入中文";
      }
      if (isEmpty(state.form.idcardno)) {
        return "请填写身份证号";
      }
      if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(state.form.idcardno)) {
        return "请填合法的身份证号";
      }
      if (isEmpty(state.form.bankcardno)) {
        return "请填写银行卡号";
      }
      if (state.form.bankcardno.length > 2) {
        if (!/^[0-9]*$/.test(state.form.bankcardno)) {
          return "银行卡卡号只能录入数字";
        }
        if (state.form.bankcardno[0] != 6 || state.form.bankcardno[1] != 2) {
          return "请输入62开头的16-19位卡号";
        }
        if (state.form.bankcardno.length < 16 || state.form.bankcardno.length > 19) {
          return "请输入62开头的16-19位卡号";
        }
      }
      else {
        return "请输入62开头的16-19位卡号";
      }
     
      if (isEmpty(state.form.bankname)) {
        return "请填写开户银行";
      }
      if (!isChinese(state.form.bankname)) {
        return "开户银行只能录入中文";
      }
      if (isEmpty(state.form.bankcode)) {
        return "请填写银行代码";
      }
      if (!/^[A-Za-z0-9]+$/.test(state.form.bankcode)) {
          return "银行代码只能录入数字+英文";
      }
      if (isEmpty(state.form.bankleftmobile)) {
        return "请填写预留手机号码";
      }
      if (state.form.bankleftmobile.length != 11 && state.form.bankleftmobile.length != 8) {
        return "请填写合法的预留手机号码";
      }
      return "";
      function isEmpty(str) {
        return !str || str.trim() == "";
      }
      function isChinese(temp){
        var re=/[^\u4E00-\u9FA5]/;
        if (re.test(temp)) return false ;
        return true ;
      }
    },
    checkThirdPage: state => {
      if (!state.form.idcardback) {
        return "请上传身份证图背面";
      }
      if (!state.form.idcardfront) {
        return "请上传身份证图正面";
      }
      // if (!state.form.wechatpic) {
      //   return "请上传微信群资源图";
      // }
      return "";
    },
    checkMsgPage: state => {
      if (state.form.headmobile.trim().length == 0) {
        return "请输入手机号";
      }
      if (state.form.headmobile.length != 11 && state.form.headmobile.length != 8) {
        return "手机号码格式错误";
      }
      if (state.form.referrerid.trim().length == 0) {
        return "推荐人编号不能为空";
      }
    },
    checkAllPage: (state,getters) => { //通过方法访问
      let msg = getters.checkFirstPage; 
      msg = getters.checkMsgPage;
      if (msg) {
        return {
          code: msg == '' ? 0 : -1,
          msg,
          pageType: 1, //页面跳转1， 注册页内跳转false
          name: "message"
        }
      }
      msg = getters.checkFirstPage; 
      if (msg) {
        return {
          code: msg == '' ? 0 : -1,
          msg,
          pageIndex: 1
        }
      }
      msg = getters.checkSecondPage
      if (msg) {
        return {
          code: msg == '' ? 0 : -1,
          msg,
          pageIndex: 2
        }
      }
      msg = getters.checkThirdPage
      if (msg) {
        return {
          code: msg == '' ? 0 : -1,
          msg,
          pageIndex: 3
        }
      }

      return {
        code: 0
      }
    },
  },
  mutations: {
    setVerifyPageIn(state, data) {
      state.verifyPageIn = data;
    },
    setFormData(state, data) {
      state.form = data;
    },
    setPageIndex(state, data) {
      state.registerIndex = data;
    },
  }
})
new Vue({
  router,
  render: h => h(app),
  store
}).$mount('#app')