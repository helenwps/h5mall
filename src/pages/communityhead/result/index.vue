<template>
  <div class="member-content">
    <h3 class="member-content-title">
      <van-icon class="arrow-left" name="arrow-left" @click="restart" />
      {{status == 'success'?'提交成功':'提交失败'}}
    </h3>
    <div class="result-part">
      <template v-if="status == 'success'">
        <img class="result-logo" src="@/assets/image/communityhead/success.png" />
        <div class="result-tip">提交成功</div>
        <div class="result-detail">
          资料提交成功，保存下方二维码可查看审核 进度，最终结果将以短信通知
        </div>
        <div class="qrcode">
          <img :src="qrcodeImg" style="width: 100%;height:100%;"/>
        </div>
        <div class="result-cut">截图保存二维码</div>
      </template>
      <template v-if="status == 'fail'">
        <img class="result-logo" src="@/assets/image/communityhead/fail.png" />
        <div class="result-tip">提交失败</div>
        <div class="result-detail">资料提交失败，请点击下方按钮重新提交</div>
        <div class="btn-restart" @click="restart">重新提交</div>
      </template>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';
export default {
  data() {
    return {
      visible: false,
      status: "success",
      qrcodeImg: ""
    };
  },
  created() {
    this.status = this.$route.query.status;
  },
  mounted() {
    if (this.status == 'success') {
      let url = window.location.origin + '/communityhead.html#/verify?id='+ this.$route.query.id + "&referrerid="+(this.$route.query.referrerid || "");
      QRCode.toDataURL(url)
      .then(url => {
        console.log(url)
        this.qrcodeImg = url;
      })
      .catch(err => {
        console.error(err)
      })
    }
  },
  methods: {
    restart() {
      this.$router.push({
        path: "message",
        query: {
          referrerid: this.$route.query.referrerid || ""
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../components/common.scss";
.member-content {
  background-color: white;
  height: 100%;
  box-sizing: border-box;
}
.result-part {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;

  .result-logo {
    width: 60px;
    height: 74px;
  }

  .result-tip {
    margin: 32px auto 12px;
    font-size: 18px;
    color: #000000;
    font-weight: bold;
  }
  .result-detail {
    width: 266px;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    margin-bottom: 48px;
    text-align: center;
  }
  .qrcode {
    width: 160px;
    height: 160px;
    border-radius: 8px;
    border: 1px solid #ebebeb;
    display: flex;
    justify-content: center;
    align-items: center;
    // padding: 17px;
    #qrcanvas {
      width: 100% !important;
      height: 100% !important;
    }
  }
  .result-cut {
    margin-top: 12px;
    font-size: 14px;
    color: #999999;
  }

  .btn-restart {
    width: 295px;
    height: 50px;
    background: #f74747;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin-top: 48px;
  }
}
</style>
