<template>
  <div>
    <div class="community-form">
      <div class="uploadimg-item">
        <div class="uploadimg-item-outline">
          <img src="@/assets/image/communityhead/icon_upload.png" />
          <div class="ui-outline-str">
            <label>上传本人身份证照片</label>
            <div class="uploadimg-item-tip">用于平台审核，请保证上传照片清晰、无遮挡</div>
          </div>
        </div>
        
        <div class="uploadImg-style">
          <uploadImg :value.sync="form.idcardfront" placeholder="人像面照片" :background="identityperson"/>
        </div>
        <div class="uploadImg-style">
          <uploadImg :value.sync="form.idcardback" placeholder="国徽面照片" :background="identityflg"/>
        </div>
      </div>
      <div class="c-divider" />
      <div class="uploadimg-item">
        <div class="uploadimg-item-outline">
          <img src="@/assets/image/communityhead/icon_upload.png" />
          <div class="ui-outline-str">
            <label>上传微信群资源截图（选填）</label>
            <div class="uploadimg-item-tip">提供社群资源凭证将提升你成为团长的概率</div>
          </div>
        </div>
        <div class="uploadImg-style">
          <uploadImg :value.sync="form.wechatpic"/>
        </div>
      </div>
    </div>
    
    <a :class="{ disabled: !canNext, 'btn-next-wrap': true }">
      <div class="btn-next" @click="nextstep">提交审核资料</div>
    </a>
    <selectTime ref="selectTime" title="营业时间" @change="changeTime" />
    <selectMap ref="selectMap"/>
  </div>
  
</template>
<script>
import selectTime from "../components/selectTime/index";
import selectMap from "../components/selectMap/index";
import uploadImg from "../components/uploadImg";
import identityperson from "assets/image/communityhead/identityperson.png";
import identityflg from "assets/image/communityhead/identityflg.png";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  components: { selectTime,selectMap, uploadImg },
  computed: {
     canNext() {
      return this.form.idcardback.trim() && this.form.idcardfront.trim();
    },
   
     ...mapState({
      form: "form",
    }),
    ...mapGetters({
      checkRule: "checkThirdPage",
    }),
  },
  data() {
    return {
      identityperson,
      identityflg,
    };
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
  .uploadimg-item-outline {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    img {
      width: 40px;
    }
    .ui-outline-str {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 8px;
      label {
        color: #000000;
        font-size: 16px;
      }
      color: #999999;
      font-size: 14px;
      .uploadimg-item-tip {
        margin-top: 12px;
        margin-bottom: 0;
      }
    }
  } 
}
.btn-next-wrap {
  margin-top: 40px;
  margin-bottom: 104px;
}
</style>
