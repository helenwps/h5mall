<template>
    <div class="member-content">
        <img class="member-content-logo" src="../../../assets/image/common/icon_right2x.png" />
        <div class="member-content-title">恭喜您，註冊成功</div>
        <div class="member-content-subtitle">前往錢大媽門店開啟您的生鮮之旅~</div>
        <!-- <div class="form-button" @click="closePage">好的</div> -->
    </div>
</template>

<script>
    export default {
        data(){
            return {
                
            }
        },
        methods:{
            closePage(){
               var userAgent = navigator.userAgent; 
               if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) { 
                 window.location.href="about:blank"; 
               }else if(userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1){ 
                 window.opener=null;window.open('about:blank','_self','').close(); 
               }else { 
                 window.opener = null; 
                 window.open("about:blank", "_self"); 
                 window.close(); 
               }
               var isWeixin = userAgent.toLowerCase.indexOf('micromessenger') != -1;
               if (isWeixin) {
                 this.wxback();
               }
            },
            wxback() {
                function onBridgeReady() {
                    console.log('WeixinJSBridge',WeixinJSBridge);
                    WeixinJSBridge.call("closeWindow");
                }
                if (typeof WeixinJSBridge === "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .member-content {
        min-height: 100vh;
        width: 100%;
        overflow: hidden;
        background-color: #FFFFFF;
        .member-content-logo{
            display: block;
            height: 56px;
            width: 56px;
            margin: 49px auto 16px;
        }
        .member-content-title{
            text-align: center;
            font-size: 18px;
            color: #000000;
        }
        .member-content-subtitle{
            text-align: center;
            font-size: 14px;
            color: rgba(152, 152, 152, 1);
            margin-top: 20px;
        }
        .form-button {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50px;
            width: 327px;
            margin: 48px auto 0;
            background: #FE0203;
            border-radius: 26px;
            color: #FFFFFF;
            font-size: 15px;
        }
    }
</style>
