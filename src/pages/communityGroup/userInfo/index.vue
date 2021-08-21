<template>
    <div class="main-caontent">
         <p class="title-text">提货门店：</p>
        <div class="store">     
                <div class="store-info">
                    <p class="store-name">{{store.shopname}}</p>
                    <div class="distance">距您<span>{{store.showdistance+store.distanceunit}}</span></div>
                </div>
                <div class="address">{{store.address}}</div>
        </div>
       <p class="title-text">填写你的提货信息用于到店提货核对</p>
       <div class="form-content">
           <div class="form-item">
               <div class="f-label"><i class="start">*</i>姓名</div>
               <div class="f-value">
                   <input class="f-input" maxlength="6" v-model="parmas.username" placeholder="请填写你的姓名" type="text">
               </div>
           </div>
           <div class="form-item">
               <div class="f-label"><i class="start">*</i>手机号</div>
               <div class="f-value">
                   <input class="f-input" v-model="parmas.phone" placeholder="请填写你的手机号" type="text">
               </div>
               <div class="btn-box">
                   <button v-show="btn=='获取验证码'" class="btn"  @click="getSmscode" >{{btn}}</button>
                   <button v-show="btn!='获取验证码'" class="btn disabled-btn"   >{{btn}}</button>   
                   </div>
           </div>
           <div class="form-item">
               <div class="f-label"><i class="start">*</i>验证码</div>
               <div class="f-value">
                   <input class="f-input" v-model="parmas.smscode" placeholder="请填写你收到的验证码" type="text">
               </div>
           </div>
       </div>
        
        <button class="sub-btn" @click="associationJoin" >确认</button>

    </div>
</template>
<script>
	export default {
		name: "storelist",
		data() {
			return {
                btn:'获取验证码',
                store:{},
                parmas:{
                    phone:'',
                    shopid:'',
                    smscode:'',
                    username:''
                }
			};
        },
		created() {
			let meta = document.createElement('meta');
			meta.name = 'viewport';
			meta.content = 'width=device-width, initial-scale=1, user-scalable=no';
            document.head.appendChild(meta);
            let title = document.getElementsByTagName('title')[0];
            title.innerText="提货门店";           
            let d = window.sessionStorage.getItem('store');
            this.store =  JSON.parse(d);
            this.parmas.shopid = this.store.shopid;
		},        
		mounted() {
            
		},
		methods: {
        checkPhone(phone){ 
            if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){ 
                this.UTIL.toast("手机号码有误，请重新输入");  
                return false; 
            }else{
                 return true; 
            } 
        },           
        associationJoin(){
            if(this.parmas.username==''){
                this.UTIL.toast('请输入您的姓名');
                return false;
            };
            if(this.parmas.phone==''){
                this.UTIL.toast('请输入您的手机号');
                return false;                
            }
           if(this.parmas.smscode==''){
                this.UTIL.toast('请输入验证码');
                return false;                
            }
 			this.main.request(this.url.associationJoin,this.parmas,
					res => {
						if (res.code == 0) {                        
                this.$router.replace({path:'/h5/submitSuccess'});
                             
						} else {
							this.$notify.error({
								title: "错误",
								message: res.message
							});
						}
					},"POST"); 
            },
            getSmscode(){
                let idPhone = this.checkPhone(this.parmas.phone);
                if(idPhone){
                    this.associationSendsmscode();
                }
                
            },
            associationSendsmscode(){
                let vm = this;
 			this.main.request(this.url.associationSendsmscode,{},
					res => {
						if (res.code == 0) { 
                            let t = 60;                       
                        let Interval  =  setInterval(function(){
                            if(t>0){
                                t--;
                                vm.btn = '重新发送('+t+'s)';
                            }else{
                              vm.btn = '获取验证码';
                              clearInterval(Interval);
                            }

                        },1000)

						} else {
							this.$notify.error({
								title: "错误",
								message: res.message
							});
						}
					},"GET",{phone:this.parmas.phone}); 


            }


		}
	};
</script>

<style lang="less" scoped>
.main-caontent{
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    background:#F7F7F9;
    padding:0 10px;

}

    .title-text{
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        text-align: left;
        color: #989898;
    }

.store{
    padding: 12px 16px;
    box-sizing: border-box;
    width: 100%;
    height: auto;
    border-radius: 5px;
    background: #ffffff;
    .store-info{
        margin-top: 5px;
        position: relative;
        height: 20px;
        line-height: 20px;
        width: 100%;
        box-sizing: border-box;
        padding-right: 80px;
        .store-name{
            height: 20px;
            line-height: 20px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 15px;
            font-weight: 500;
            color: #000;
        }
        .distance{
            position: absolute;
            top: 0;
            right: 0;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #989898;
            span{
                margin-left: 2px;
                font-size: 13px;
                color: #000;
            }
        }
    }
    .address{
        width: 100%;
        line-height: 18px;
        font-size: 13px;
        color: #989898;
        margin-top: 6px;
    }
}

.form-content{
    height: auto;
    width: 100%;
    background: #fff;
    border-radius: 5px;
    padding-bottom: 120px;
    .form-item{
        height:47px;
        width: 100%;
        box-sizing: border-box;
        padding: 0 5px;
        display: flex;
        .f-label{
            flex: 0 0 70px;
            overflow: hidden;
            line-height: 47px;
            font-size:15px ;
            box-sizing: border-box;
            font-weight: 400;
            padding-left: 10px;
            color: #000;
            text-align: left;
            .start{
                color: red;
                margin-right: 2px;
            }
        }
        .f-value{
            flex: 1;
            .f-input{
                width: 100%;
                height: 47px;
                box-sizing: border-box;
                border: none;
                background: none;
                outline: none;
                border-bottom:1px solid #eeeff0;
                font-size: 13px;
                
            }
        }
        .btn-box{
            flex: 0 0 100px;
            overflow: hidden;
            text-align: right;
            .btn{
                margin-right: 10px;
                height: 47px;
                line-height: 47px;
                font-size: 13px;
                color: #E70113;
                background: none;
                padding: 0;
                border: none;
                outline: none;
                &.disabled-btn{
                    opacity: 0.7;
                }
            }
        }
    }
}

.sub-btn{
    margin-top: 10px;
    height: 44px;
    width: 100%;
    background: #e70113;
    border-radius: 4px;
    text-align: center;
    font-size: 13px;
    color: #fff;
    padding: 0;
    outline: none;
    border: none;
}

</style>
