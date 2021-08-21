<template>
  <div>
    <div class="spot-tip">
      <img class="spot-tip-img" src="@/assets/image/communityhead/icon_edit.png" />
      <div class="spot-tip-str">
        <div>请告诉我们你的自提点在哪里</div>
        <div class="spot-tip-grey">自提点将用于司机送货和用户取货，请如实填写</div>
      </div>
    </div>
    <div class="c-divider" />
    <div class="community-form">
      <div class="c-form-item">
        <label>自提点名称</label>
        <div class="c-form-item-value">
          <input v-model="form.shopname" placeholder="输入3～10个字符" />
        </div>
      </div>
      <div class="c-form-item">
        <label>自提点地址</label>
        <div class="c-form-item-value" @click="showSelectMap">
          <div class="location-tip">
            {{form.formattedAddress?form.formattedAddress:'在地图上标记详细位置'}}<van-icon class="arrow-right" name="arrow" />
          </div>
        </div>
      </div>
      <div class="c-form-item">
        <label>详细地址</label>
        <div class="c-form-item-value">
          <input v-model="form.address" placeholder="详细街道、门牌号，如长安街25号" />
        </div>
      </div>
      <div class="c-form-item">
        <label>营业时间</label>
        <div class="c-form-item-value">
          <div @click="showPopup">
            <template v-if="!form.businessstart && !form.businessend"
              ><span class="tip-color">可提货时间</span></template
            >
            <template v-else>
              <div>{{ form.businessstart }}至{{ form.businessend }}</div>
            </template>
          </div>
          <van-icon class="arrow-right" name="arrow" @click.stop="showPopup" />
        </div>
      </div>
    </div>
    <div class="c-divider" />
    <div>
      <div class="uploadimg-item">
        <label>自提点照片</label>
        <div class="uploadimg-item-tip">自提点照片将便于司机、用户快速找到你的门店</div>
        <div class="uploadImg-style">
          <uploadImg :value.sync="form.shoppic"/>
        </div>
      </div>
    </div>

    <a :class="{ disabled: !canNext, 'btn-next-wrap': true }">
      <div class="btn-next" @click="nextstep">下一步</div>
    </a>
    <selectTime ref="selectTime" title="营业时间" @change="changeTime" />
    <selectMap ref="selectMap" @change="changeSpot"/>
  </div>
</template>
<script>
import selectTime from "../components/selectTime/index";
import selectMap from "../components/selectMap/index";
import uploadImg from "../components/uploadImg";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  components: { selectTime, selectMap, uploadImg },
  computed: {
    canNext() {
      return this.form.shopname.trim() && this.form.latitude && this.form.longitude && this.form.address && this.form.businessstart && this.form.businessend && this.form.shoppic; 
    },
    ...mapState({
      form: "form",
    }),
    ...mapGetters({
      checkRule: "checkFirstPage",
    }),
  },
  data() {
    return {
      formattedAddress: ""
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
      this.form.businessstart = startDate;
      this.form.businessend = endDate;
    },
    changeSpot({ latitude, longitude, provincename, cityname,areaname,formattedAddress}) {
      this.form.latitude = latitude;
      this.form.longitude = longitude;
      this.form.provincename = provincename;
      this.form.cityname = cityname;
      this.form.areaname = areaname;
      this.form.formattedAddress = formattedAddress;
    },

    // ...mapMutations(['checkRule']),
  },
};
</script>
<style lang="scss" scoped>
@import "../components/common.scss";

.spot-tip,
.community-form,
.uploadimg-item {
  background-color: white;
}
.uploadimg-item {
  color: #000000;
  font-size: 16px;
  padding: 14px 16px;
  label {
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
