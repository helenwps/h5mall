<template>
    <transition name="qdm-modal-fade">
        <div class="modal-content">
            <div class="modal-content-mark" :class="{'mark_show':visible}"></div>
            <div class="modal-content-box">
                <div class="modal-close" @click="handleAction('cancel')"  v-if="showClose"><img src="../../../../assets/image/common/icon_close_gray.png" class="modal-close-img"/></div>
                <h3 class="modal-title">{{title || ''}}</h3>
                <div class="modal-middle">{{message ||''}}</div> 
                <div class="modal-footer">
                    <button class="modal-footer-btn cancel-btn" v-if="showClose" @click="handleAction('cancel')">{{cancelButtonText || "取消"}}</button>
                    <button class="modal-footer-btn confirm-btn" @click="handleAction('confirm')">{{confirmButtonText || "确定"}}</button>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
  let messageBox;
  let typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };
export default {
    data() {
        return {
            uid: 1,
        title: undefined,
        message: '',
        type: '',
        iconClass: '',
        customClass: '',
        showInput: false,
        inputValue: null,
        inputPlaceholder: '',
        inputType: 'text',
        inputPattern: null,
        inputValidator: null,
        inputErrorMessage: '',
        showConfirmButton: true,
        showCancelButton: false,
        action: '',
        confirmButtonText: '',
        cancelButtonText: '',
        confirmButtonLoading: false,
        cancelButtonLoading: false,
        confirmButtonClass: '',
        confirmButtonDisabled: false,
        cancelButtonClass: '',
        editorErrorMessage: null,
        callback: null,
        dangerouslyUseHTMLString: false,
        focusAfterClosed: null,
        isOnComposition: false,
        distinguishCancelAndClose: false
        }
    },
    props: {
      showClose: {
        type: Boolean,
        default: true
      },
      visible: {
        type: Boolean,
        default: false
        },
    },
    methods: {
      doClose() {
          const self = this;
        if (!this.visible) return;
        this.visible = false;
        //从页面删除节点
        this.$el.parentNode.removeChild(this.$el);
        this.$destroy(true);
        setTimeout(() => {
          if (this.action) this.callback(this.action, this);
        });  
      },

      handleAction(action) {
        this.action = action;
        this.doClose();
      },
    },

    watch: {
    },
}
</script>
<style lang="scss" scoped>
 @keyframes zoom_move {
    0% {
      transform: scale(1)
    }

    35% {
      transform: scale(.8)
    }

    70% {
      transform: scale(1.1)
    }

    100% {
      transform: scale(1)
    }
  }
  @keyframes show_mark {
      0% {
      opacity: 0;
    }

    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
    .modal-content{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
        .modal-content-mark{
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            background: rgba($color: #000000, $alpha: 0.4);
            z-index: 1;
            animation: show_mark 0.3s;
        }
        .modal-content-box{
            position: relative;
            z-index: 2;
            height: 185px;
            width: 320px;
            display: flex;
            flex-direction: column;
            border-radius:8px;
            background-color: #fff;
            animation: zoom_move .5s;
            .modal-close{
                position: absolute;
                right: 0;
                top: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 36px;
                width: 36px;
                .modal-close-img{
                    height: 13px;
                    width: 13px;
                }
            }
            .modal-title{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 60px;
                font-size: 18px;
                color: #000000;
            }
            .modal-middle{
                flex: 1;
                width: 100%;
                box-sizing: border-box;
                padding: 0 16px;
                color: #666666;
                font-size: 16px;
                text-align: center;
            }
            .modal-footer{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 66px;
                display: flex;
                .modal-footer-btn{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 35px;
                    width: 90px;
                    border-radius: 18px;
                    font-size: 13px;
                    border: 0;
                    background-color: #FFFFFF;
                    &.cancel-btn{
                        color: #F84747;
                        margin-right: 40px;
                        border: 1px solid #F84747;
                    }
                    &.confirm-btn{
                        color: #FFFFFF;
                        background-color: #F84747;
                    }
                }
            }
        }
    }
</style>