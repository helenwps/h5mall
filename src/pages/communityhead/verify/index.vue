<template>
  <div class="member-content">
    <h3 class="member-content-title">
      <van-icon class="arrow-left" name="arrow-left" @click="goMSg" />
      审核进度
    </h3>

    <div class="result-part">
      <template v-if="status == 'WAITING'">
        <img class="result-logo" src="@/assets/image/communityhead/verifing.png" />
        <div class="result-tip">审核中</div>
        <div class="result-detail">
          审核人员正快马加鞭对你的资料进行审核，审核结果将以短信通知，请留意手机信息
        </div>
      </template>
      <template v-if="status == 'PASS'">
        <img class="result-logo" src="@/assets/image/communityhead/verify_passed.png" />
        <div class="result-tip">审核通过</div>
        <div class="result-detail">
          恭喜你的资料已通过审核，扫描下方二维码下载钱大妈门店助手APP，开启你的卖菜之路吧
        </div>
        <div class="qrcode">
           <img :src="qrcodeImg" style="width: 100%;height:100%;"/>
        </div>
        <div class="result-cut">初次使用可通过手机验证码登录</div>
      </template>
      <template v-if="status == 'FAIL'">
        <img class="result-logo" src="@/assets/image/communityhead/verifyfail.png" />
        <div class="result-tip">审核未通过</div>
        <div class="result-detail">
          很遗憾你的资料未通过审核，原因：{{verifystatusdesc}}
        </div>
        <div class="btn-restart" @click="restart">修改资料</div>
      </template>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      visible: false,
      status: "WAITING", //审核状态 WAITING(待审核) PASS (通过) FAIL(不通过) ,
      verifystatusdesc: "未通过，请修改资料重新提交审核",
      downloadUrl: "",
      qrcodeImg: ""
    };
  },
  computed: {
    ...mapGetters({
      checkMsgPage: "checkMsgPage",
    }),
  },
  created() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      return this.main
        .request(
          this.url.getheadbycondition,
          {
            headcode: this.$route.query.id,
          },
          "post"
        )
        .then((res) => {
          if (res.code == 0) {
            if (!!res.data.id) {
              this.status = res.data.verifystatus || 'WAITING';
              this.verifystatusdesc = res.data.auditfailreason || '未通过，请修改资料重新提交审核';
               QRCode.toDataURL("https://olpadmin.qdama.cn/#/appDownload/")
                .then(url => {
                  console.log(url)
                  this.qrcodeImg = url;
                })
                .catch(err => {
                  console.error(err)
                })
            } else {
              this.$router.push({
                path: "message",
              });
            }
          } else {
            this.$showToast({ title: res.message, duration: 3000 });
          }
        });
    },
    goMSg() {
      this.$router.push({
        path: "message",
        query: {
          referrerid: this.$route.query.referrerid || ""
        }
      });
    },
    restart() {
      if (!!this.checkMsgPage) {
        this.$router.push({
          path: "message",
          query: {
            referrerid: this.$route.query.referrerid || ""
          }
        });
      }
      else {
        this.$router.push({
          path: "register",
          query: {
            referrerid: this.$route.query.referrerid || ""
          }
        });
      }
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
    width: 80px;
    height: 80px;
  }

  .result-tip {
    margin: 30px auto 12px;
    font-size: 18px;
    color: #000000;
    font-weight: bold;
  }
  .result-detail {
    width: 336px;
    font-size: 14px;
    color: #999999;
    line-height: 20px;
    margin-bottom: 48px;
    text-align: center;
    word-break: break-all;
  }
  .qrcode {
    width: 160px;
    height: 160px;
    border-radius: 8px;
    border: 1px solid #ebebeb;
    // padding: 17px;
  }
  .result-cut {
    margin-top: 12px;
    font-size: 14px;
    color: #999999;
  }

  .btn-restart {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #232323;
    margin-top: 40px;

    width: 295px;
    height: 50px;
    border-radius: 8px;
    border: 1px solid #ebebeb;
  }
}
</style>
