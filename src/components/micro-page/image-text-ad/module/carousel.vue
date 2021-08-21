<template>
  <div class="module-content">
    <van-swipe class="swiper-content" :autoplay="5000" indicator-color="white" :height="bannerHeight" :show-indicators="false"  @change="swiperChange">
        <van-swipe-item v-for="(item,index) in navList" :key="index">
            <div class="image-box" style="display: block;" @click="item.key == 'h5page'? releoadPage(item) : UTIL.goToPage(item)">
              <img :src="item.img" class="slide-image"  :style="{'borderRadius':childObj.borderRadius + 'px','height':bannerHeight + 'px'}"/>
            </div>
        </van-swipe-item>
    </van-swipe>
    <div class="indicator-box" style="bottom: 8px;">
      <span class="indicator-box-item" :class="{'active':bannerIdx == index}" v-for="(item,index) in navList.length" :key="index"></span>
      <div class="indicator-num">{{bannerIdx+1}} / {{navList.length}}</div>
    </div>
  </div>
</template>

<script>
  import reloadMixin from '@/assets/mixin/reload.js';
  export default {
    data() {
      return {
        bannerHeight:180,
        bannerIdx: 0,
      }
    },
    mixins:[reloadMixin],
    props: {
      navList: {
        'type': Array,
        'default': []
      },
      childObj:{
        'type':Object,
        'default':{}
      }
    },
    created(){
      // if(!this.childObj.ratio){
      //   this.childObj.ratio = '2:1';
      // }
      // let systemInfo =  mpvue.getSystemInfoSync();
      // let w=2,h=1,sw=systemInfo.windowWidth-16;
      // [w,h] = this.childObj.ratio.split(':');
      // this.bannerHeight =(h / w) * sw;
    },
    methods: {
      swiperChange(val) {
        this.bannerIdx = val;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .module-content {
    position: relative;
    width: 100%;
    height: auto;

    .content-margin-bottom {
      width: 100%;
      height: 10px;
    }

    .swiper-content {
      height: 180px;

      .image-box{
          width: 100%;
          height: auto;
          box-sizing: border-box;
          .slide-image{
              width: 100%;
          }
      }
    }

    .indicator-box {
      position: absolute;
      width: 100%;
      z-index: 100;
      bottom: 8px;
      left: 0;
      font-size: 10px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .indicator-num{
        position: absolute;
        bottom: 0;
        right: 12px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background: rgba(0,0,0,.4);
        border-radius:100px;
        font-size: 11px;
        color: #fff;
        z-index: 10;
        padding: 0 8px;
      }
      .indicator-box-item{
        height: 4px;
        width: 4px;
        border-radius: 50%;
        background-color: #FFFFFF;
        margin-right: 4px;
        opacity: 0.6;
        &:last-child{
          margin-right: 0;
        }
        &.active{
          opacity: 1;
          width: 8px;
          border-radius: 2px;
        }
      }
    }
  }
</style>
