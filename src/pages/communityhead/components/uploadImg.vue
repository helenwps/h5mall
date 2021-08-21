<template>
  <div class="uploadImg-part">
    <template v-if="value">
      <img class="whole-img" :src="value"  />
    </template>
    <template v-else>
      <img class="whole-img" :src="background" v-if="background"/>
    </template>
    <van-uploader :after-read="afterRead" :before-read="beforeRread" accept="image/*">
      <div class="center-part">
        <template v-if="value">
          <img class="center-img" src="@/assets/image/communityhead/icon_phone.png" />
          <span class="reupolad">重新上传{{ placeholder }}</span>
        </template>
        <template v-else>
          <img class="center-img" src="@/assets/image/communityhead/icon_phone.png" />
          <span>点击上传{{ placeholder }}</span>
        </template>
      </div>
    </van-uploader>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    background: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "照片",
    },
  },
  data() {
    return {};
  },
  methods: {
    afterRead(event) {
      const { file } = event;
      this.UTIL.uploadImgOss(file, this, "header").then((res) => {
        this.$emit("update:value",res)
      }).catch(res=>{
        this.$showToast({ title: res.message, duration: 1000 });
      })
    },
    beforeRread(file) {
      if (["image/gif", "image/jpg", "image/jpeg", "image/png"].indexOf(file.type) < 0) {
        this.$showToast({ title: '请上传jpg或png格式图片', duration: 1000 });
        return false;
      }
      if (file.size  > 10 * 1024 * 1024) {
        this.$showToast({ title: '图片大小不能超过10M', duration: 1000 });
        return false;
      }
      return true;
    }
  },
};
</script>
<style lang="scss" scoped>
.uploadImg-part {
  width: 263px;
  height: 160px;
  border-radius: 8px;
  border: 1px solid #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .center-part {
    position: relative;
    // z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #000000;
    font-size: 14px;
    .reupolad {
      color: white;
    }
  }
  .center-img {
    width: 64px;
  }
  .whole-img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
</style>
