<template>
    <div class="main-caontent">
        <!-- <div  class="success-icon el-icon-success"></div>
        <p class="status-text">提交成功</p> -->
 
        <div class="qrcode-content">
            <div class="qrcode">
                <img class="qrcode-img" :src="store.asscode" :alt="store.shopname">
            </div>
            <p class="store-name">{{store.shopname}}社群码</p>
            <p class="sub-title">预留菜品 特价优惠 线上商品</p>
            <p class="tip-msg">每天都会定时发送各类优惠商品、各种优惠活动快快进群来参与哦！</p>
             <button class="sub-btn">长按识别二维码即可进群</button>
        </div>
       

    </div>
</template>
<script>

	export default {
		name: "storelist",
		data() {
			return {
                 store:{},
			};
        },
		created() {
			let meta = document.createElement('meta');
			meta.name = 'viewport';
			meta.content = 'width=device-width, initial-scale=1, user-scalable=no';
            document.head.appendChild(meta);
            let title = document.getElementsByTagName('title')[0];
            title.innerText="扫码进群";
            let d = window.sessionStorage.getItem('store');
            this.store = JSON.parse(d);
            // history.pushState(null,null,document.URL);
            // window.addEventListener('popstate',function(){
            //      history.pushState(null,null,document.URL);
            // });
		},        
		mounted() {

		},
		methods: {



		}
	};
</script>

<style lang="less" scoped>
.main-caontent{
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    background:#F7F7F9;
    padding:32px 10px;

}


.success-icon{
    height:56px;
    width: 56px;
    color: #E70113;
    font-size: 56px;
    display: block;
    margin:  auto;

}

.status-text{
        height: 40px;
        line-height: 40px;
        width: 100%;
        text-align: center;
        font-size: 18px;
        font-weight: 400;
        font-size: #000;   
    }

    .qrcode-content{
        width: 88%;
        margin:15px auto 0 auto;
        height: auto;
        overflow: hidden;
        background: #ffffff;
        border-radius: 8px;
        .qrcode{
            width: 100%;
            height:auto;
            box-sizing: border-box;
            padding: 30px 40px 0 40px;
            .qrcode-img{
                height: auto;
                width: 100%;
            }
        } 
        .store-name{
            height: auto;
            line-height: 20px;
            font-size: 17px;
            color: #000;
            text-align: center;
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
            margin-top: 20px;
        }
        .sub-title{
            height: 30px;
            line-height: 45px;
            color: #000000;
            font-size: 12px;
            text-align: center;
        } 
        .tip-msg{
            margin: 5px 0;
            height: auto;
            font-size: 12px;
            padding: 0 20px;
            text-align: center;
            color: #989898;
            line-height: 16px;           
        }  
         
    }



.sub-btn{
    margin-top: 10px;
    height: 44px;
    width: 100%;
    background: #e70113;
    text-align: center;
    font-size: 13px;
    color: #fff;
    padding: 0;
    outline: none;
    border: none;
}

</style>
