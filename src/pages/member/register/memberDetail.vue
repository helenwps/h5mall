<template>
    <div class="member-content">
        <div class="upload-box">
            <img class="upload-box-camera" v-if="params.logo.length <= 0" src="../../../assets/image/common/photo_icon.png" />
            <img class="upload-box-camera" v-else :src="params.logo" />
            <input type="file" class="upload-box-file" @change="addImg" ref="inputer" multiple accept="image/png,image/jpeg,image/gif,image/jpg"/>
        </div>
        <form class="member-content-form">
            <div class="form-input">
                <span class="form-input-lable">姓名</span>
                <input class="form-input-item" placeholder="請輸入您的姓名" v-model="params.nickname"/>
            </div>
            <div class="form-input">
                <span class="form-input-lable">性別</span>
                <div class="form-input-gender">
                    <div class="form-input-gender-item" @click="changegender(1)" :class="{'active':params.gender == 1}">男</div>
                    <div class="form-input-gender-item" @click="changegender(0)" :class="{'active':params.gender == 0}">女</div>
                </div>
            </div>
            <div class="form-input">
                <span class="form-input-lable">生日</span>
                <span class="text">{{params.birthday || '請選擇'}}</span>
                <img class="rignt-icon" src="../../../assets/image/common/icon_arrow_right_small_gray.png" />
                <input type="date" v-model="params.birthday" class="form-input-item opacity" placeholder="請選擇生日"/>
                <span class="form-input-tips">生日當天會有神秘券贈送哦～</span>
            </div>
            <div class="form-button" @click="nowRegister">註冊</div>
            <div class="form-button-jumpout" @click="passReg">跳过</div>
        </form>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                gender:0,
                file:null,
                img:'',
                birthday:'',
                params:{
                  "birthday": "1980-01-01",
                  "gender": 0,
                  "logo": "",
                  "mobile": "",
                  "nickname": "",
                  "validationcode": ""
                },
                staticLogo:'https://cnhqvztoss02.cn//electricityManagement/ytmzJteNKNTK3mYTPPzzb3NFQXsAxm4P.png'
            }   
        },
        created(){
            this.params.validationcode = this.$route.query.code;
            this.params.mobile = this.$route.query.mobile;
        },
        methods:{
            nowRegister(){
                if(this.params.logo.length == 0){
                    // this.$showToast({
                    //     title:'請上傳頭像',
                    //     duration:1000
                    // })
                    // return false;
                    this.params.logo = this.staticLogo;
                }
                if(this.params.nickname.length == 0){
                    this.$showToast({
                        title:'請輸入您的姓名',
                        duration:1000
                    })
                    return false;
                }
                this.memberheaderRegist(this.params);
            },
            passReg(){
                let params = {
                    "birthday": "1980-01-01",
                    "gender": 0,
                    "logo": this.staticLogo,
                    "mobile": this.$route.query.mobile,
                    "nickname": "钱大妈会员",
                    "validationcode": this.$route.query.code
                }
                this.memberheaderRegist(params);
            },
            memberheaderRegist(params) {
                this.main.request(this.url.memberheaderRegist, params).then((res)=>{
                    this.$showToast({
                        title:'註冊成功',
                        duration:1000
                    })
                    setTimeout(()=>{
                       this.$router.replace({
                        path: '/registerSuccess'
                       }) 
                    },1000)
                }).catch((res)=>{
                    this.$showToast({
                        title:res.message || '网络异常，请重试',
                        duration:1000
                    })
                });
            },
            changegender(val){
                this.params.gender = val;
            },
            addImg(){
               let inputDOM = this.$refs.inputer;
               this.file = inputDOM.files; 
               this.UTIL.uploadImgOss(inputDOM.files[0],this).then((res)=>{
                   console.log(res)
                   this.params.logo = res;
               })
            },
            getObjectURL(file) {
                var url = null ;
                if (window.createObjectURL!=undefined) { // basic
                  url = window.createObjectURL(file) ;
                } else if (window.URL!=undefined) { // mozilla(firefox)
                  url = window.URL.createObjectURL(file) ;
                } else if (window.webkitURL!=undefined) { // webkit or chrome
                  url = window.webkitURL.createObjectURL(file) ;
                }
                return url ;
              },
        }
    }
</script>

<style lang="scss" scoped>
    .member-content{
        min-height: 100vh;
        width: 100%;
        overflow: hidden;
        .upload-box{
          position: relative;
          height: 72px;
          width: 72px;
          margin: 48px auto 40px; 
          .upload-box-camera{
              position: absolute;
              height: 72px;
              width: 72px;
              left: 0;
              top: 0;
              border-radius: 50%;
          }
          .upload-box-file{
             position: absolute;
             height: 72px;
             width: 72px;
             left: 0;
             top: 0;
             z-index: 999;
             opacity: 0;
             -ms-filter: 'alpha(opacity=0)';
          }
        }
        .member-content-form{
            width: 100%;
            margin-top: 56px;
            overflow: hidden;
            .form-input{
               display: flex;
               position: relative;
               height: 50px;
               width: 300px;
               box-sizing: border-box;
               // overflow: hidden;
               margin: 0 auto 26px;
               background: #F9F8F8;
               border-radius: 26px;
               .form-input-tips{
                   position: absolute;
                   left: 24px;
                   bottom: -18px;
                   font-size: 12px;
                   color: #999999;
               }
               .text{
                   position: absolute;
                   color: #999999;
                   font-size: 13px;
                   left: 66px;
                   top: 19px;
               }
               .rignt-icon{
                  position: absolute;
                   height: 12px;
                   width: 12px;
                   right: 19px;
                   top: 19px;
               }
               .form-input-lable{
                   display: flex;
                   justify-content: center;
                   align-items: center;
                   width: 66px;
                   height: 50px;
                   font-size: 13px;
                   color: #000000;
               }
               .form-input-item{
                   display: flex;
                   align-items: center;
                   height: 50px;
                   flex: 1;
                   box-sizing: border-box;
                   background: transparent;
                   color: #000000;
                   font-size: 14px;
                   &.opacity{
                       opacity: 0;
                       -ms-filter: 'alpha(opacity=0)';
                   }
               }
               .form-input-gender{
                   position: absolute;
                   right: 5px;
                   top: 5px;
                   height: 40px;
                   width: 120px;
                   display: flex;
                   justify-content: space-between;
                   .form-input-gender-item{
                       display: flex;
                       justify-content: center;
                       align-items: center;
                       width: 56px;
                       height: 40px;
                       box-sizing: border-box;
                       border-radius: 20px;
                       border: 1px solid #DDDDDD;
                       font-size: 13px;
                       color: #000000;
                       &.active{
                           border:none;
                           color: #FFFFFF;
                           background-color: #FE0203;
                       }
                   }
               }
            }
            .form-button{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 50px;
                width: 300px;
                margin: 0 auto;
                background: #FE0203;
                border-radius: 26px;
                color: #FFFFFF;
                font-size: 15px;
                margin-top: 65px;
            }
            .form-button-jumpout{
                margin-top: 32px;
                text-align: center;
                font-size: 12px;
                color: #FE0203;
            }
        }
    }
    ::-webkit-input-placeholder { /* WebKit browsers */
      color: #999;
      font-size: 13px;
    }
    
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #999;
      font-size: 13px;
    }
    
    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #999;
      font-size: 13px;
    }  
</style>
