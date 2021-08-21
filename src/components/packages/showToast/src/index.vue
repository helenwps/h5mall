<template>
    <transition name="qdm-showtoast-fade">
        <div class="showtoast-content" v-show="visible" role="alert">
            <!-- 加载动画 -->
            <div class="loading-box" v-show="type == 'loading'"> 
                <div class="load-container">
                    <div class="loader"></div>
                    <div class="loader-tit">{{title}}</div>
                </div>
            </div>
            <!-- 提示 -->
            <div class="showtoast-tips" v-show="type == 'info'">{{title}}</div>
        </div>
    </transition>
    
</template>

<script>
    const typeMap = {
      success: 'success',
      info: 'info',
      warning: 'warning',
      error: 'error'
    };
    export default {
        data(){
            return {
                visible:false,
                title:'',
                type:'info',
                duration:0,
                closed:false,
                onClose: null,
            }
        },
        watch: {
          closed(newVal) {
            if (newVal) {
              this.visible = false;
              this.$el.parentNode.removeChild(this.$el);
              this.$destroy(true);
            }
          }
        },
        methods:{
            close() {
              this.closed = true;
              if (typeof this.onClose === 'function') {
                this.onClose(this);
              }
            },
            startTimer() {
              if (this.duration > 0) {
                this.timer = setTimeout(() => {
                  if (!this.closed) {
                    this.close();
                  }
                }, this.duration);
              }
            },
        },
        mounted() {
          this.startTimer();
        },
    }
</script>

<style lang="scss" scoped>
    .qdm-showtoast-fade-enter,
    .qdm-showtoast-fade-leave-active {
    	opacity: 0;
    	-webkit-transform: translate(-50%, -100%);
    	transform: translate(-50%, -100%)
    }
    
    .showtoast-content{
    	position: fixed;
    	top: 0;
    	left: 0;
    	right: 0;
    	bottom: 0;
    	z-index: 100;
        display: flex;
        justify-content: center;
        align-items: center;
        .showtoast-tips{
            width: auto;
            height: 48px;
            padding: 0 24px;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(0,0,0,.8);
            border-radius: 24px;
            color: #FFFFFF;
            font-size: 14px;
        }
    }
    // 加载动画
    @-webkit-keyframes load {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes load {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    .loading-box{
       width: 100%; 
       height: 40px;
      .load-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: auto;
          .loader {
            font-size: 0;
            text-indent: -9999rem;
            border-top: 7px solid rgba(0, 0, 0, .1);
            border-right: 7px solid rgba(0, 0, 0, .1);
            border-bottom: 7px solid rgba(0, 0, 0, .1);
            border-left: 7px solid #fc0786;
            -webkit-animation: load 1.1s infinite linear;
            animation: load 1.1s infinite linear;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            &:after {
                border-radius: 50%;
                width: 30px;
                height: 30px;
              }
          }
          .loader-tit {
            font-size: 12px;
            color: #545454;
            margin-left: 12px;
          }
      }
    }
    
    
</style>
