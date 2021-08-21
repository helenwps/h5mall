<template>
    <div class="main-caontent">
    <div class="search">
        <div class="search-box" @click="toSearchStore" >
            <i class="search-icon el-icon-search"></i>
            搜索您想添加的门店
        </div>
    </div>
    <div class="store-content">
        <div class="store-info">
            <div class="s-name">{{storeInfo.shopname}}</div>
            <div class="address">{{storeInfo.address}}</div>
            <p> <span class="distanceunit" v-if="storeInfo.showdistance" >距您 {{storeInfo.showdistance+storeInfo.distanceunit}} </span> </p>
            <div class="open-location" @click="openLocation" >
                <i class="location-icon el-icon-map-location"></i>
                去这里
            </div>
        </div>

            <div class="qrcode">
                <img class="qrcode-img" :src="storeInfo.asscode" :alt="storeInfo.shopname">
            </div>
            <div v-if="storeInfo.asscode">
                <p class="store-name">长按识别二维码</p>
                <p class="tip-msg">加入门店街坊群</p>
                <button v-if="storeInfo.asscode" class="sub-btn">识别二维码加入门店街坊群</button>
            </div>
            <div v-if="!storeInfo.asscode">
                <p class="tip-msg">当前门店暂未设置社群，可加入其他门店的社群</p>
                <button class="sub-btn change-btn" @click="toSearchStore">切换门店</button>
            </div>
    </div>
    <div class="member-welfare">
        <div class="mw-title">街坊群福利</div>
        <ul class="welfare-list">
            <li class="welfare-item">
               <img class="w-icon" src="../../../assets/image/h5/icon4.png" /> 
                每天特价
            </li>
            <li class="welfare-item">
                <img class="w-icon" src="../../../assets/image/h5/icon1.png" /> 
                预留菜品
            </li>
            <li class="welfare-item">
                <img class="w-icon" src="../../../assets/image/h5/icon2.png" /> 
                线上秒杀
            </li>
            <li class="welfare-item">
                <img class="w-icon" src="../../../assets/image/h5/icon3.png" /> 
                送货上门
            </li>
        </ul>
    </div>

    </div>
</template>
<script>
	export default {
		name: "storelist",
		data() {
			return {
        parmas:{
            shopid :"",
            shopnameoraddress:"",
            latitude:"",
            longitude:"",
            page:1,
            size:1000
        },
        storeInfo:{},
        storeList:[]
			};
        },
		created() {    
      let vm = this;
			let meta = document.createElement('meta');
      this.parmas.shopid =this.$route.params.id
			meta.name = 'viewport';
			meta.content = 'width=device-width, initial-scale=1, user-scalable=no';
			document.head.appendChild(meta);
            let title = document.getElementsByTagName('title')[0];
            title.innerText="钱大妈";
            this.loadScript('https://res.wx.qq.com/open/js/jweixin-1.6.0.js',function(){
                  vm.associationGetsign();
            })   
		},        
		mounted() {
    },
		methods: {
      preview(src){
        // let urls =[]
        // urls.push(src)
        // wx.previewImage({
        //   current: src,
        //   urls :urls // 当前显示图片的http链接  
        // })
        // wx.scanCode({
        //   onlyFromCamera: true,
        //   success(res) {
        //     console.log(res)
        //   }
        // })
       },
      //格式化json对象，打印成字符串格式
      format(obj) {
        // Object.keys(obj)
        // Object.keys 返回一个所有元素为字符串的数组
        // Object.keys(obj).map
        // map() 方法创建一个新数组
        // 使用 map 重新格式化数组中的对象
        return '{\n' +
          Object.keys(obj).map(function(key) {
            return '  ' + key + ': ' + obj[key] + ','
          }).join('\n') + '\n' +
          '}'
      },
      openLocation(){
          let locationInfo = {
              latitude: Number(this.storeInfo.latitude), // 纬度，浮点数，范围为90 ~ -90
              longitude:Number(this.storeInfo.longitude), // 经度，浮点数，范围为180 ~ -180。
              name: this.storeInfo.shopname, // 位置名
              address:this.storeInfo.address, // 地址详情说明
              scale: 20, // 地图缩放级别,整形值,范围从1~28。默认为最大
              infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转                  
          }
          wx.openLocation(locationInfo);
      },    
      toSearchStore(){
          this.$router.push({path:'/searchStore'});
      },                   
      selectStore(row){
          let data = JSON.stringify(row);
          window.sessionStorage.setItem('store',data);
          this.$router.push({path:'/submitSuccess'});
      },
      initWeixin(config){
          let vm = this;
              wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: config.appid, // 必填，公众号的唯一标识
                  timestamp: config.timestamp, // 必填，生成签名的时间戳
                  nonceStr: config.noncestr, // 必填，生成签名的随机串
                  signature: config.signature,// 必填，签名
                  jsApiList: ['getLocation','openLocation'] // 必填，需要使用的JS接口列表
              }); 
              wx.ready(function(){
                      wx.getLocation({
                      type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                      success: function (res) {
                          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                          vm.parmas.latitude =latitude;
                          vm.parmas.longitude =longitude;
                          vm.getshoplistbyposition();
                      },fail:function(){
                          // vm.toSearchStore();
                            vm.getshoplistbyposition();
                      }
                      });
              });
      },
      handleSearch(){
          this.getshoplistbyposition();
      },
      getshoplistbyposition(){
          let vm = this;    
          let d = window.sessionStorage.getItem('store')||'';
          if(d){
               this.storeInfo = JSON.parse(d);
          }else{
              this.main.request(this.url.getshoplistbyposition,this.parmas,
                res => {
                    if (res.code == 0) { 
                        if(res.data.rows && res.data.rows.length>0){
                            // this.storeInfo = res.data.rows[0];  
                            let data = res.data.rows.filter(item=>{
                            return item.shopid == this.parmas.shopid});  
                            this.storeInfo = data[0]
                        }else{
                            this.$notify.error({
                                title: "错误",
                                message: '您附近没有门店'
                            });
                            setTimeout(()=>{
                                vm.toSearchStore();
                            },2000)
                        }                   
                      // this.storeList = res.data.rows;
                    } else {
                        this.$notify.error({
                            title: "错误",
                            message: res.message
                        });
                    }
                },"POST");  
          }  
      },
      associationGetsign(){
        let host = window.location;
        let url = host.href;
        this.main.request(this.url.associationGetsign,{},
            res => {
              if (res.code == 0) {                        
                this.initWeixin(res.data);
              } else {
                this.$notify.error({
                  title: "错误",
                  message: res.message
                });
              }
            },"GET",{url:url});                
      },
      loadScript(src, callback) {
        var script = document.createElement('script'),
            head = document.getElementsByTagName('head')[0];
        script.type = 'text/javascript';
        script.charset = 'UTF-8';
        script.src = src;
        if (script.addEventListener) {
            script.addEventListener('load', function () {
                callback();
            }, false);
        } else if (script.attachEvent) {
            script.attachEvent('onreadystatechange', function () {
                var target = window.event.srcElement;
                if (target.readyState == 'loaded') {
                    callback();
                }
            });
        }
        head.appendChild(script);
    }            

		}
	};
</script>

<style lang="less" scoped>
.main-caontent{
    padding: 10px;
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    background:#F7F7F9;
}
.search{
    height: 44px;
    width: 100%;
    margin-bottom: 12px;
    background: none;
    position: relative;
    box-sizing: border-box;
    .search-box{
        width: 100%;
        height: 44px;
        text-align:center;
        line-height: 44px;
        overflow: hidden;
        background: #fff;
        box-sizing: border-box;
        border-radius:5px;
        font-size: 14px;
        color: #666666;

        .search-icon{
            position: relative;
            top: 2px;
            height: 34px;
            line-height: 34px;
            font-size: 18px;
            color: #989898;
            text-align: center;
        }
    }
}
.store-content{
    position: relative;
    height: auto;
    width: 100%;
    height: 450px;
    background: #FFFFFF;
    border-radius: 4px; 
    box-sizing: border-box;
    padding:12px 20px;
    overflow: hidden;
    .store-info{
        position: relative;
        height: auto;
        box-sizing: border-box;
        width: 100%;
        padding-right: 60px;
        .s-name{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 20px;
            color: #121212;
            text-align: left;
            font-weight: 500;
            height: 30px;
            line-height: 30px;
            .arrow-right {
                font-size: 16px;
                color: #666666;
            }
        }
        .distanceunit{
                font-size: 12px;
                color: #E70113;
                text-decoration: underline;               
            }       
        .address{
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            color: #666666;
            text-align: left;
            height: 24px;
            line-height: 24px;  
            margin-top: 5px;         
        }
        .open-location{
            position: absolute;
            top: 50%;
            margin-top: -25px;
            right: 0;
            height: 50px;
            width: 40px;
            text-align: center;
            font-size: 12px;
            color: #121212;
            box-sizing: border-box;
            padding-top:20px;
            line-height: 30px;
            .location-icon{
                position: absolute;
                top: 0;
                color: #E70113;
                font-size: 24px;
                left: 50%;
                margin-left: -12px;

            }
        }
    }


        .qrcode{
            width: 240px;
            height:240px;
            box-sizing: border-box;
            margin: auto;
            padding: 20px;
            .qrcode-img{
                height: 200px;
                width: 200px;
            }
        } 
        .store-name{
            height: auto;
            line-height: 20px;
            font-size: 18px;
            color: #121212;
            text-align: center;
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;
            margin-top: 10px;
        }
        .tip-msg{
            margin-top: 10px;
            height: auto;
            font-size: 14px;
            padding: 0 20px;
            text-align: center;
            color: #666666;
            line-height: 16px;           
        }  
        

        .sub-btn{
            position: absolute;
            bottom: 0;
            left: 0;
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
        .change-btn{
          width: 50%;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 22px;
          margin-bottom: 20px;
        }

}

.member-welfare{
    margin-top: 14px;
    height: auto;
    width: 100%;
    box-sizing: border-box;
    padding: 8px;
    background:#fff;
    border-radius: 8px;
    .mw-title{
        width: 100%;
        height: 40px;
        line-height: 50px;
        font-size: 16px;
        color: #121212;
        text-align: center;
        font-weight: 500;
    }
    .welfare-list{
        width: 100%;
        height: 80px;
        display: flex;
        padding-bottom: 20px;
        .welfare-item{
            position: relative;
            flex: 1;
            text-align: center;
            box-sizing: border-box;
            padding-top:60px;
            color: #121212;
            font-size: 14px;
            line-height: 30px;
            .w-icon{
                position: absolute;
                top: 8px;
                left: 50%;
                margin-left: -25px;
                height: 50px;
                width: 50px;
            }
        }
    }
}

</style>
