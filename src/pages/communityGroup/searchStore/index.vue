<template>
    <div class="main-caontent">
    <div class="search">
        <div class="search-box">
            <i class="search-icon el-icon-search"></i>
            <input class="search-input" v-model="parmas.shopnameoraddress"  @keyup.enter="handleSearch" placeholder="请输入门店名称或地址" type="text">
        </div>
        <button class="search-btn" @click="handleSearch" >搜索</button>
        <!-- <button class="search-btn">取消</button> -->
    </div>
    <div class="store-content">

        <ul class="store-list">
            <li class="store-item" v-for="(item,index) in storeList" :key="index" @click="selectStore(item)" >
                <div class="store-info">
                    <p class="store-name">{{item.shopname}}</p>
                    <div class="distance" v-if="item.showdistance" ><div class="tag" v-if="index==0" >距离最近</div> 距您<span>{{item.showdistance+item.distanceunit}}</span></div>
                </div>
                <div class="adderss">{{item.address}}</div>
            </li>
        </ul>
        <p class="nomore">暂无更多～</p>
    </div>

    </div>
</template>
<script>
	export default {
		name: "storelist",
		data() {
			return {
                parmas:{
                    shopnameoraddress:"",
                    latitude:"",
                    longitude:"",
                    page:1,
                    size:1000
                },
                storeList:[]
			};
        },
		created() {
            
            let vm = this;
			let meta = document.createElement('meta');
			meta.name = 'viewport';
			meta.content = 'width=device-width, initial-scale=1, user-scalable=no';
			document.head.appendChild(meta);
            let title = document.getElementsByTagName('title')[0];
            title.innerText="选择门店进群";
            this.loadScript('https://res.wx.qq.com/open/js/jweixin-1.6.0.js',function(){
                  vm.associationGetsign();
            })   
		},        
		mounted() {},
		methods: {
            selectStore(row){
                console.log(row)
                let data = JSON.stringify(row);
                let shopid = row.shopid;
                window.sessionStorage.setItem('store',data);
                this.$router.push({path:'/h5/storeList/'+shopid});
            },
            initWeixin(config){
                let vm = this;
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: config.appid, // 必填，公众号的唯一标识
                        timestamp: config.timestamp, // 必填，生成签名的时间戳
                        nonceStr: config.noncestr, // 必填，生成签名的随机串
                        signature: config.signature,// 必填，签名
                        jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表
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
                                 vm.getshoplistbyposition();
                            }
                            });
                    });

            },
            handleSearch(){
                this.getshoplistbyposition();
            },
            getshoplistbyposition(){
                this.main.request(this.url.getshoplistbyposition,this.parmas,
                        res => {
                            if (res.code == 0) {                        
                                this.storeList = res.data.rows;
                            } else {
                                this.$notify.error({
                                    title: "错误",
                                    message: res.message
                                });
                            }
                        },"POST");                
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
    height: 34px;
    width: 100%;
    margin-bottom: 10px;
    background: none;
    position: relative;
    padding-right: 40px;
    box-sizing: border-box;
    .search-box{
        width: 100%;
        height: 34px;
        overflow: hidden;
        background: #fff;
        box-sizing: border-box;
        padding-left: 28px;
        border-radius:5px;
        .search-input{
            height: 34px;
            line-height: 34px;
            font-size: 13px;
            width: 100%;
            border: none;
            outline: none;
        }
        .search-icon{
            position: absolute;
            top: 0;
            left: 4px;
            display: block;
            height: 34px;
            line-height: 34px;
            font-size: 18px;
            color: #989898;
            text-align: center;
        }
    }
    .search-btn{
        position: absolute;
        height: 34px;
        padding: 0;
        line-height: 34px;
        font-size: 13px;
        color: #000;
        text-align: right;
        top: 0;
        right: 0;
        background: none;
        border: none;
        outline: none;
    }
}
.store-content{
    height: auto;
    width: 100%;
    border-radius:5px;
    .store-list{
        height: auto;
        width: 100%;
        .store-item{
            width: 100%;
            margin-bottom: 8px;
            min-height: 68px;
            background: #fff;
            box-sizing: border-box;
            padding: 16px;
            .store-info{
                height: 16px;
                line-height: 16px;
                position: relative;
                padding-right: 100px;                
            }
            .store-name{
                width: 100%;
                height: 16px;
                line-height: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 15px;
                font-weight: 500;
                color: #000;
                text-align: left;
            }
            .distance{
                height: 16px;
                line-height: 16px;
                position: absolute;
                top: 0;
                right: 0;
                text-align: right;
                font-size: 12px;
                color: #989898;
                span{
                    margin-left: 2px;
                    font-size: 14px;
                    color: #000;
                }
                .tag{
                    position: absolute;
                    top: 50%;
                    margin-top: -8px;
                    left: -100%;
                    height: 16px;
                    line-height: 16px;
                    padding: 0 5px;
                    background: #E70113;
                    color: #ffffff;
                    border-radius:2px ;
                    font-size: 10px;
                    &::before{
                        position: absolute;
                        top: 50%;
                        margin-top: -3px;
                        right: -3px;
                        content: '';
                        height: 6px;
                        width: 6px;
                        background: #E70113;
                        transform: rotateZ(45deg);

                    }
                }
            }
        }
        .adderss{
            margin-top: 12px;
            height: auto;
            line-height: 18px;
            font-size: 13px;
            color: #989898;
            text-align: left;
        }
    }
    .nomore{
        height: 30px;
        line-height: 30px;
        text-align: center;
        width: 100%;
        font-size: 12px;
        color: #cccccc;

        
        }

        
}


</style>
