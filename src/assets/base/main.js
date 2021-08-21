import Vue from 'vue'
import axios from "axios";
import md5 from "js-md5";
import urls from "./url";
 import {showToast} from "@/components/packages/index.js";
import {
    JSEncrypt
} from "jsencrypt";
//rsa加密
Vue.prototype.$getRsaCode = function(str) {
    // 注册方法
    console.log(str);
    let pubKey = "";
    if (
        document.domain == "localhost"
    ) {
        pubKey =
            "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAN2nINiXBXIzzC6LMqS7/cyXLtEpqa+e2WcyHQoyXytWabBNRH8Vno/d/sDXCZm81LIJJwralJHYUciMMTEkqeMCAwEAAQ=="; // ES6 模板字符串 引用 rsa 公钥//测试环境
    } else {
        pubKey =
            "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJwAr8nfsmnOswIuQdY5hrs88aSgIKNBiyCYpgBKDX5+QYh90vG0e5iHxC0u9srRRFlpfMfDpPvQQRHADeCi6l8CAwEAAQ=="; // ES6 模板字符串 引用 rsa 公钥//正式环境
    }
    let encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(pubKey); // 设置 加密公钥
    let data = encryptStr.encrypt(str.toString()); // 进行加密
    return data;
};
// 服务器状态值拦截
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response.status == 503){
            
        }
        return Promise.reject(error);
    }
);
export default {
    // 公共方法
    objKeySort(obj) {
        //排序的函数
        var newkey = Object.keys(obj).sort();
        var newObj = {};
        for (var i = 0; i < newkey.length; i++) {
            newObj[newkey[i]] = obj[newkey[i]];
        }
        return newObj;
    },

    //生成20位随机字符串
    randomWord(randomFlag, min, max) {
        var str = "",
        range = min,
        arr = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
        ];
        // 随机产生
        if (randomFlag) {
            range = Math.round(Math.random() * (max - min)) + min;
        }
        for (var i = 0; i < range; i++) {
            var pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    },
    request(url, data = {}, reqMethod = "POST",tostTitle,lazloding = true) {
        return new Promise((resove, reject) => {
            let loading = null;
           if (lazloding == true) {
              loading = showToast({
                   text: tostTitle,
                   type:'loading'
               });
           }
           let [link, sing, responseData] = ["", "", ""]; // 页面参数拼接 sing签名 页面参数转字符串
           var nonce = this.randomWord(false, 20);
           var timestamp = new Date().getTime();
           reqMethod = reqMethod.toUpperCase();
           if (reqMethod == 'GET' && Object.keys(data).length != 0) {
               console.log('进来这')
               data.nonce = nonce;
               var linkData = this.objKeySort(data);
               for (let key in linkData) {
                   responseData += key + linkData[key];
                   if (key != "nonce") {
                       if (key === "url") {
                           link += "&" + key + "=" + encodeURIComponent(linkData[key]);
                       } else {
                           link += "&" + key + "=" + linkData[key];
                       }
                   }
               }
           } else {
               responseData = responseData + "nonce" + nonce; 
           }
           
           if (reqMethod == 'GET') {
               //get
               sing = md5(urls.md5key + responseData + timestamp);
           } else {
               //post
               sing = md5(urls.md5key + responseData + timestamp + JSON.stringify(data));
           }
           axios({
               url: url + "?sign=" + sing + "&nonce=" + nonce + link,
               method: reqMethod,
               data: Object.keys(data).length == 0 ? null : JSON.stringify(data),
               headers: {
                   "Content-Type": "application/json; charset=UTF-8",
                   "B2B-Authorization": localStorage.getItem("token") == null ? "" : localStorage.getItem("token"),
                   "X-QDM-Shop-Id": '',
                   "X-ZZ-Timestamp": timestamp,
                   v: "1.0",
               },
           })
           .then((res) => {
               if (Number(res.data.code) == 0) {
                   resove(res.data);
               } else {
                   reject(res.data)
               }
               if (lazloding == true) {
                   setTimeout(() => {
                       loading.close();
                   }, 200);
               }
           })
           .catch((res) => {
               if(res.response.status == 503){
                   showToast({title:res.response.status + '访问过于频繁，请稍后再试',duration:1000})
               }
               if (lazloding == true) {
                   loading.close();
               }
               reject(res.data)
           }); 
        })
    },
}
