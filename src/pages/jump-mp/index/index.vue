<template>
    <div class="main-content">
        <div class="module-content" :style="{ backgroundColor: backGroundColor }">
            <section v-for="(item,idx) in h5pagemodelvolist" :key="idx">
                <imageTextAD v-if="item.type == 'IMAGE_TEXT_AD'" :parentObj="item"></imageTextAD>
            </section>
        </div>
    </div>
</template>
 
<script>
    import imageTextAD from "@/components/micro-page/image-text-ad/index.vue";//图文导航
    export default {
        components:{
            imageTextAD
        },
        data(){
         return {
             parentObj:{
                 
             },
             h5pagemodelvolist:[],
             backGroundColor: "#F5F7F9",
         }   
        },
        mounted(){
            this.getH5PageByIdInWhiteUrls();
        },
        methods:{
            // 获取微页面详情
            getH5PageByIdInWhiteUrls(){
                this.main.request(this.url.getH5PageByIdInWhiteUrls, {id:this.$route.query.id},'get').then((res)=>{
                    this.backGroundColor = res.data.backGroundColor ? res.data.backGroundColor : '#F5F7F9';
                    this.h5pagemodelvolist = res.data.h5pagemodelvolist;
                    document.title = res.data.title;
                    if(res.data.directaddr && res.data.directaddr.length > 0 && (res.data.directaddr.indexOf('http') > -1 || res.data.directaddr.indexOf('weixin') > -1)){
                        location.href = res.data.directaddr;
                    }
                }); 
            },
            openWeapp(onBeforeJump) {
              location.href = 'weixin://dl/business/?t=JfiYRNpk5Xq';
            },
            docReady(){
                var ua = navigator.userAgent.toLowerCase()
                var isWXWork = ua.match(/wxwork/i) == 'wxwork'
                var isWeixin = !isWXWork && ua.match(/micromessenger/i) == 'micromessenger'
                var isMobile = false
                var isDesktop = false
                if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i)) {
                  isMobile = true
                } else {
                  isDesktop = true
                }
                
                if (isDesktop) {
                  // 在 pc 上则给提示引导到手机端打开
                  var containerEl = document.getElementById('desktop-web-container')
                  containerEl.classList.remove('hidden')
                  containerEl.classList.add('full', 'desktop-web-container')
                } 
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-content{
        position: relative;
        min-height: 100vh;
        width: 375px;
        .bg-img{
            width: 100%;
            height: 100vh;
        }
        .main-content-btn{
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 265px;
            height: 46px;
            font-size: 16px;
            color: #FFFFFF;
            bottom: 30px;
            left: 55px;
            z-index: 99;
            background-color: #FE0203;
            border-radius: 23px;
            margin: 0 auto;
        }
    }
</style>
