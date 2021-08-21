<template>
  <div class="communityhead-selecttime">
    <van-popup v-model="show" position="bottom" round>
      <van-datetime-picker
        :title="title"
        visible-item-count="4"
        v-model="currentDate"
        type="time"
        @change="onChange"
        @confirm="confirmTime"
        @cancel="show = false"
        confirm-button-text="确定"
        class="datetimepicker"
      >
        <template v-slot:columns-top>
          <div class="time-tab-wrap">
            <van-tabs
              v-model="active"
              @click="changeSelect"
              color="#F84747"
              class="time-tab"
            >
              <van-tab title="开始时间" name="开始时间"></van-tab>
              <van-tab title="结束时间" name="结束时间"></van-tab>
            </van-tabs>
          </div>
        </template>
      </van-datetime-picker>
    </van-popup>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "选择时间",
    },
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      currentDate: "",
      show: false,
      active: "开始时间",
    };
  },

  methods: {
    showPopup({startDate,endDate}) {
      this.startDate = startDate;
      this.endDate = endDate;

      this.currentDate = startDate;
      this.active = "开始时间";
      this.show = true;
    },
    // 切换时间
    changeSelect(name, title) {
      if (title == "开始时间") {
        this.currentDate = this.startDate;
      } else if (title == "结束时间") {
        this.currentDate = this.endDate;
      }
    },
    // 改变时间
    onChange(picker) {
      let value = picker.getValues();
      if (Array.isArray(value)) {
        value = value.join(":");
      }
      // this.currentDate = value;
      console.log(value);
      if (this.active == "开始时间") {
        this.startDate = value;
      } else if (this.active == "结束时间") {
        this.endDate = value;
      }
    },
    confirmTime() {
      if (!this.startDate) {
        this.Toast("请输入开始时间");
        this.currentDate = this.startDate;
        this.active = "开始时间";
        return;
      }
      if (!this.endDate) {
        this.Toast("请输入结束时间");
        this.currentDate = this.endDate;
        this.active = "结束时间";
        return;
      }
      if (this.startDate > this.endDate) {
        this.Toast("结束时间不能早于开始时间");
        return;
      }
      this.$emit("change",{
        startDate: this.startDate,
        endDate: this.endDate,
      })
      this.show = false;
    },
    formatter(type, val) {
      if (type === "hour") {
        return val + "时";
      }
      if (type === "minute") {
        return val + "分";
      }
      return val;
    },
  },
};
</script>
<style scoped>
.tip-color {
  color: #999999;
}
.time-tab-wrap {
  background: #fafafa;
}
.time-tab {
  width: 200px;
}
.datetimepicker {
    font-size: 20px;
}
</style>
