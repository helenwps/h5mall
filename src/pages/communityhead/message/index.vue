<template>
  <div class="member-content">
    <h3 class="member-content-title">短信验证</h3>
    <div class="c-divider" />
    <div class="community-form">
      <div class="c-form-item">
        <label>手机号</label>
        <div class="c-form-item-value">
          <div></div>
          <input v-model="form.headmobile" placeholder="输入11位手机号码" type='tel'/>
        </div>
      </div>
      <div class="c-form-item">
        <label>短信验证码</label>
        <div class="c-form-item-value">
          <div class="code-validate">
            <input v-model="form.code" placeholder="输入短信验证码" />
            <div class="btn-code" :class="{ 'gray-color': second > 0 }" @click="getCode">
              {{ second <= 0 ? "发送验证码" : second + "s秒重试" }}
            </div>
          </div>
        </div>
      </div>
      <div class="c-form-item">
        <label>推荐人编号</label>
        <div class="c-form-item-value">
          <input v-model="form.referrerid" placeholder="123000" :disabled="isDisabledReferid"/>
        </div>
      </div>
    </div>
    <div class="agreement">
      <van-radio-group
        icon-size="16px"
        v-model="isagree"
        checked-color="#F84747"
      >
        <van-radio name="1">
          <div class="agreement-part">
            已阅读并同意<span class="agreement-book" @click="showAgreement(true)"
              >钱大妈团长合作协议</span
            >
          </div>
        </van-radio>
      </van-radio-group>
    </div>

    <a :class="{ disabled: !canNext, 'btn-next-wrap': true }">
      <div class="btn-next" @click="nextstep">下一步</div>
    </a>
    <agreement ref="agreement" />
    <getMap ref="getMap"/>
  </div>
</template>

<script>
import agreement from "../components/agreement";
import { mapState, mapMutations, mapActions } from "vuex";
import getMap from "../components/selectMap/getMap";
export default {
  components: { agreement,getMap },
  data() {
    return {
      index: 1,
      second: 0,
      interval: null,

      isagree: false,
    };
  },
  mounted() {
    let queryid = this.$route.query.referrerid;
    if (queryid == undefined || queryid == 'undefined') {
        queryid = '';
    }
    this.form.referrerid =  queryid || this.form.referrerid || "";
  },
  computed: {
    canNext() {
      return (
        this.form.headmobile.trim() &&
        this.form.code.trim() &&
        this.form.referrerid.trim() &&
        this.isagree
      );
    },
    isDisabledReferid() {
        let queryid = this.$route.query.referrerid;
        if (queryid == undefined || queryid == 'undefined') {
            return false;
        }
        return !!queryid;
    },
    ...mapState({
      form: "form",
    }),
  },
  methods: {
    setFailValue(data) {
      this.form.id  = this.form.id || data.id || "";
      this.form.headmobile  = this.form.headmobile || data.headmobile || "";
      this.form.code  = this.form.code || data.code || "";
      this.form.referrerid  = this.form.referrerid || data.referrerid || "";

      this.form.headname  = this.form.headname || data.headname || "";
      this.form.shopname  = this.form.shopname || data.shopname || "";
      this.form.latitude  = this.form.latitude || data.latitude || "";
      this.form.longitude  = this.form.longitude || data.longitude || "";
      this.form.address  = "";
      this.form.provincename  = this.form.provincename || data.provincename || "";
      this.form.cityname  = this.form.cityname || data.cityname || "";
      this.form.areaname  = this.form.areaname || data.areaname || "";
      this.form.businessend  = this.form.businessend || data.businessend || "";
      this.form.businessstart  = this.form.businessstart || data.businessstart || "";
      this.form.shoppic  = this.form.shoppic || data.shoppic || "";

      this.form.bankcardholder  = this.form.bankcardholder || data.bankcardholder || "";
      this.form.idcardno  = this.form.idcardno || data.idcardno || "";
      this.form.bankname  = this.form.bankname || data.bankname || "";
      this.form.bankcardno  = this.form.bankcardno || data.bankcardno || "";
      this.form.bankcode  = this.form.bankcode || data.bankcode || "";
      this.form.bankleftmobile  = this.form.bankleftmobile || data.bankleftmobile || "";

      this.form.idcardback  = this.form.idcardback || data.idcardback || "";
      this.form.idcardfront  = this.form.idcardfront || data.idcardfront || "";
      this.form.wechatpic  = this.form.wechatpic || data.wechatpic || "";
      this.form.verifystatus  = data.verifystatus; 
      this.form.formattedAddress  = this.form.formattedAddress || ""; //显示自提点地址

      // 显示详细地址
      this.$nextTick(()=>{
        if (this.form.longitude && this.form.latitude) {
          
          this.$refs.getMap.getAddressBylnglat([ this.form.longitude, this.form.latitude]).then(res=>{
            let formattedAddress =
            res.addressComponent.province +
            res.addressComponent.city +
            res.addressComponent.district +
            res.addressComponent.township +
            res.addressComponent.street +
            res.addressComponent.streetNumber;
            this.form.formattedAddress  = this.form.formattedAddress || formattedAddress || ""; //显示自提点地址
          });
        }
      })
    },
    ...mapMutations(["setPageIndex"]),
    validatePhoneStatus() {
      return this.ckecksmscode()
        .then(() => {
          return this.main.request(
            this.url.getheadbycondition,
            {
              headmobile: this.form.headmobile,
            },
            "post"
          );
        })
        .then((res) => {
          if (res.code == 0) {
            this.setPageIndex(1);
            if (!!res.data.id) {
              if (res.data.verifystatus == 'FAIL') {
                this.setFailValue(res.data);
              }
              this.$router.push({
                path: "verify",
                query: {
                  id: res.data.headcode,
                  referrerid: this.$route.query.referrerid || ""
                },
              });
            } else {
              this.$router.push({
                path: "register",
                query: {
                  referrerid: this.$route.query.referrerid || ""
                }
              });
            }
          } else {
            this.$showToast({ title: res.message, duration: 3000 });
          }
        });
    },
    ckecksmscode() {
      // return Promise.resolve();
      return this.main
        .request(
          this.url.ckecksmscode,
          {
            phone: this.form.headmobile,
            code: this.form.code,
          },
          "get"
        )
        .then((res) => {
          if (res.code == 0) {
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        });
    },
    showAgreement(val) {
      val && this.$refs.agreement.show();
    },
    // 下一步
    nextstep() {
      if (this.form.headmobile.trim().length == 0) {
        this.$showToast({ title: "手机号格式错误", duration: 1000 });
        return false;
      }
      if (this.form.headmobile.length != 11 && this.form.headmobile.length != 8) {
        this.$showToast({ title: "手机号码格式错误", duration: 1000 });
        return false;
      }
      if (!/(^[1-9]\d*$)/.test(this.form.headmobile)) {
        this.$showToast({ title: "手机号格式错误", duration: 1000 });
        return false;
      }
      if (this.form.code.trim().length == 0) {
        this.$showToast({ title: "验证码不能为空", duration: 1000 });
        return false;
      }
      if (this.form.code.length != 6) {
        this.$showToast({ title: "验证码错误", duration: 1000 });
        return false;
      }

      if (this.form.referrerid.trim().length == 0) {
        this.$showToast({ title: "推荐人编号不能为空", duration: 1000 });
        return false;
      }
      if (!this.isagree) {
        this.$showToast({ title: "请勾选并阅读协议", duration: 1000 });
        return false;
      }
      this.validatePhoneStatus().catch(data=>{
          this.$showToast({ title: data.message, duration: 1500 });
        });
    },
    getCode() {
      if (this.form.headmobile.trim().length == 0) {
        this.$showToast({ title: "手机号格式错误", duration: 1000 });
        return false;
      }
      if (!/(^[1-9]\d*$)/.test(this.form.headmobile)) {
        this.$showToast({ title: "手机号格式错误", duration: 1000 });
        return false;
      }
      if (this.form.headmobile.length != 11 && this.form.headmobile.length != 8) {
        this.$showToast({ title: "手机号格式错误", duration: 1500 });
        return false;
      }
      if (this.second > 0) {
        return false;
      }
      this.sendsmscode();
    },
    // 获取验证码
    sendsmscode() {
      this.main
        .request(this.url.sendcomheadsmscode, { phone: this.form.headmobile }, "get")
        .then((res) => {
          if (this.interval) {
            clearInterval(this.interval);
          }
          this.second = 60;
          this.interval = setInterval(() => {
            this.second--;
            if (this.second <= 0) {
              clearInterval(this.interval);
            }
          }, 1000);
        }).catch(data=>{
          this.$showToast({ title: data.message, duration: 1500 });
        })
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../components/common.scss";
.member-content {
  background-color: #f7f7f7;
}

.code-validate {
  display: flex;
  input {
    flex: 1;
    margin-right: 20px;
  }
  .btn-code {
    background: #f84747;
    border-radius: 4px;
    display: flex;
    justify-content: center;

    align-items: center;
    color: white;
    width: 96px;
    height: 32px;
    margin-right: 16px;
    &.gray-color {
      background: #cccccc;
      color: white;
    }
  }
}
.agreement {
  margin-top: 12px;
  margin-left: 15px;
  margin-bottom: 40px;
  .agreement-part {
    color: #999999;
    font-size: 14px;
    .agreement-book {
      color: #f84747;
    }
  }
}
</style>
<style>
.agreement .van-radio {
  align-items: center;
}
</style>
