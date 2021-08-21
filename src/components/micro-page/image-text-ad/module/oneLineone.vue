<template>
  <div class="module-content">
    <ul class="content-view-list">
      <li class="content-view-list-item" v-for="(item,index) in navList" :key="index" :style="{'marginBottom':childObj.margin + 'px'}">
        <div class="list-item-a" @click="item.key == 'h5page'? releoadPage(item) : UTIL.goToPage(item)">
          <img mode="widthFix" class="list-itemImg" :src="item.img" :style="{'borderRadius':childObj.borderRadius + 'px'}"/>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import reloadMixin from '@/assets/mixin/reload.js';
  export default {
    data() {
      return {

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
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .module-content {
    width: 100%;

    .content-margin-bottom {
      width: 100%;
      height: 10px;
    }

    .content-view-list {
      width: 100%;
      overflow: hidden;

      .content-view-list-item {
        width: 100%;
        position: relative;
        font-size: 0;
        box-sizing: border-box;
        .list-item-a {
          display: block;
          width: 100%;
          overflow: hidden;
          font-size: 0;

          .list-itemImg {
            display: block;
            width: 100%;
          }

          .list-item-text {
            position: absolute;
            bottom: 0;
            background-color: rgba(0, 0, 0, .4);
            line-height: 30px;
            height: 30px;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;
            color: #FFFFFF;
            text-align: center;
          }
        }
      }
    }
  }
</style>
