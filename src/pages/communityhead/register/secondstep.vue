<template>
  <div>
    <div class="spot-tip">
      <img class="spot-tip-img" src="@/assets/image/communityhead/icon_edit.png"/>
      <div class="spot-tip-str">
        <div>填写银行卡信息</div>
        <div class="spot-tip-grey">用于后续结算，填写错误将无法提现，请使用本人银行卡并确保信息无误</div>
      </div>
    </div>
    <div class="c-divider" />
    <div class="community-form">
      <div class="c-form-item">
        <label>持卡人姓名</label>
        <div class="c-form-item-value">
          <input v-model="form.bankcardholder" placeholder="填写持卡人姓名" />
        </div>
      </div>
      <div class="c-form-item">
        <label>身份证号</label>
        <div class="c-form-item-value">
          <input v-model="form.idcardno" placeholder="填写身份证号"/>
        </div>
      </div>
      <div class="c-form-item">
        <label>银行卡号</label>
        <div class="c-form-item-value">
          <input v-model="form.bankcardno" placeholder="填写62开头的银行卡号" type="number"/>
        </div>
      </div>
      <div class="c-form-item">
        <label>开户银行</label>
        <div class="c-form-item-value">
          <input v-model="form.bankname" placeholder="填写开户银行卡名称" />
        </div>
      </div>
      <div class="c-form-item">
        <label>银行代码</label>
        <div class="c-form-item-value">
          <input v-model="form.bankcode" placeholder="填写开户银行代码" />
        </div>
      </div>
      <div class="c-form-item">
        <label>预留手机号</label>
        <div class="c-form-item-value">
          <input v-model="form.bankleftmobile" placeholder="填写银行卡绑定的预留手机号" type="number"/>
        </div>
      </div>
    </div>
    <a :class="{ disabled: !canNext, 'btn-next-wrap': true }">
      <div class="btn-next" @click="nextstep">下一步</div>
    </a>
    <selectTime ref="selectTime" title="营业时间" @change="changeTime" />
    <selectMap ref="selectMap"/>
  </div>
  
</template>
<script>
import selectTime from "../components/selectTime/index";
import selectMap from "../components/selectMap/index";
import uploadImg from "../components/uploadImg";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  components: { selectTime,selectMap, uploadImg },
  data() {
    return {
    
    };
  },
  computed: {
    canNext() {
      return this.form.bankcardholder.trim() && this.form.idcardno.trim() && this.form.bankcardno.trim() && this.form.bankname.trim() && this.form.bankcode.trim()&& this.form.bankleftmobile.trim();
    },
     ...mapState({
      form: "form",
    }),
    ...mapGetters({
      checkRule: "checkSecondPage",
    }),
  },
  methods: {
    nextstep() {
      let msg = this.checkRule;
      if (msg) {
        this.$showToast({ title: msg, duration: 1000 });
      } else {
        this.$emit("next");
      }
    },
    showPopup() {
      this.$refs.selectTime.showPopup(this.form);
    },
    showSelectMap() {
      this.$refs.selectMap.show(this.form);
    },
    changeTime({ startDate, endDate }) {
      this.form.startDate = startDate;
      this.form.endDate = endDate;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../components/common.scss";

.spot-tip,.community-form,.uploadimg-item {
  background-color: white;
}
.uploadimg-item {
  color: #000000;
  font-size: 16px;
  padding: 14px 16px;
  label{
    // font-weight: bold;
  }
  .uploadimg-item-tip {
    margin-top: 8px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #999999;
  }
  .uploadImg-style {
    padding-bottom: 24px;
  }
}
.btn-next-wrap {
  margin-top: 40px;
  margin-bottom: 104px;
}
</style>
