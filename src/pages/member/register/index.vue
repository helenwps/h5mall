<template>
    <div class="member-content">
        <img class="member-content-logo" src="../../../assets/image/common/logo.png" />
        <h3 class="member-content-title">註冊錢大媽，會員福利享不停</h3>
        <form class="member-content-form">
            <div class="form-input">
                <input class="form-input-item" placeholder="請輸入您的手機號碼" v-model="mobile"/>
            </div>
            <div class="form-input">
                <input class="form-input-item" maxlength="6" placeholder="輸入驗證碼" v-model="code"/>
                <div class="form-input-btn" :class="{'gray-color': second > 0}" @click="getCode">{{second <= 0 ? '發送驗證碼' : second + 's後重試'}}</div>
            </div>
            <div class="form-button" @click="nextStep">繼續</div>
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                second:0,
                interval:null,
                mobile:'',
                code:''
            }
        },
        created(){
           // this.$showToast({title:'系统异常'})  
        },
        methods: {
            // 下一步
            nextStep() {
                if(this.mobile.trim().length == 0){
                    this.$showToast({title:'請輸入手機號',duration:1000});
                    return false;
                }
                if(this.mobile.length != 11 && this.mobile.length != 8){
                    this.$showToast({title:'手機號格式錯誤',duration:1000});
                    return false;
                }
                if(this.code.trim().length == 0){
                    this.$showToast({title:'驗證碼不能為空',duration:1000});
                    return false;
                }
                if(this.code.length != 6){
                    this.$showToast({title:'驗證碼錯誤',duration:1000});
                    return false;
                }
                this.$router.push({
                    path: '/memberdetail?code='+this.code + "&mobile="+this.mobile
                })
            },
            
            // 获取验证码
            getCode(){
                if(this.mobile.trim().length == 0){
                    this.$showToast({title:'請輸入手機號',duration:1000});
                    return false;
                }
                if(this.mobile.length != 11 && this.mobile.length != 8){
                    this.$showToast({title:'手機號格式錯誤',duration:1500});
                    return false;
                }
                if(this.second > 0){
                    return false;
                }
                this.sendsmscode();
            },
            sendsmscode(){
                this.main.request(this.url.sendsmscode, {phone:this.mobile},'get').then((res)=>{
                    if(this.interval){
                        clearInterval(this.interval);
                    }
                    this.second = 60;
                    this.interval = setInterval(()=>{
                        this.second --;
                        if(this.second <= 0){
                            clearInterval(this.interval);
                        }
                    },1000)
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .member-content {
        min-height: 100vh;
        width: 100%;
        overflow: hidden;

        .member-content-logo {
            display: block;
            height: 72px;
            width: 72px;
            margin: 48px auto 24px;
        }

        .member-content-title {
            font-size: 15px;
            color: #000000;
            text-align: center;
            font-weight: normal;
        }

        .member-content-form {
            width: 100%;
            margin-top: 56px;
            overflow: hidden;

            .form-input {
                position: relative;
                height: 50px;
                width: 300px;
                box-sizing: border-box;
                overflow: hidden;
                margin: 0 auto 26px;
                background: #F9F8F8;
                border-radius: 26px;

                .form-input-item {
                    display: flex;
                    align-items: center;
                    height: 50px;
                    width: 100%;
                    box-sizing: border-box;
                    background: transparent;
                    color: #000000;
                    padding-left: 24px;
                    font-size: 14px;
                }

                .form-input-btn {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 40px;
                    width: 100px;
                    background: #FE0203;
                    border-radius: 21px;
                    color: #FFFFFF;
                    font-size: 13px;
                    &.gray-color{
                        background-color: rgba(254, 2, 3, .5);
                    }
                }
            }

            .form-button {
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
            }
        }
    }

    ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #999;
        font-size: 13px;
    }

    ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #999;
        font-size: 13px;
    }

    :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #999;
        font-size: 13px;
    }
</style>
