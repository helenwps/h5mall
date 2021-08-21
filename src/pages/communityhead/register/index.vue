<template>
  <div class="member-content">
    <h3 class="member-content-title">
      <van-icon class="arrow-left" name="arrow-left" @click="prePage" />
      申请团长（{{ index }}/3）
    </h3>

    <firststep v-show="index == 1" @next="goPage(2)" />
    <secondstep v-show="index == 2" @next="goPage(3)" />
    <thirdstep v-show="index == 3" @next="jumpResult" />
  </div>
</template>

<script>
import firststep from "./firststep";
import secondstep from "./secondstep";
import thirdstep from "./thirdstep";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      index: "registerIndex",
    }),
    ...mapState({
      form: "form",
    }),
    ...mapGetters({
      checkAllPage: "checkAllPage",
    }),
  },
  components: {
    firststep,
    secondstep,
    thirdstep,
  },
  mounted() {},
  methods: {
    resetFormlValue(data) {
      this.form.id  = "";
      this.form.headmobile  ="";
      this.form.code  = "";
      this.form.referrerid  = "";

      this.form.headname  = "";
      this.form.shopname  = "";
      this.form.latitude  = "";
      this.form.longitude  = "";
      this.form.address  = "";
      this.form.provincename  = "";
      this.form.cityname  = "";
      this.form.areaname  = "";
      this.form.businessend  = "";
      this.form.businessstart  = "";
      this.form.shoppic  = "";

      this.form.bankcardholder  =  "";
      this.form.idcardno  =  "";
      this.form.bankname  = "";
      this.form.bankcardno  = "";
      this.form.bankcode  =  "";
      this.form.bankleftmobile  =  "";

      this.form.idcardback  =  "";
      this.form.idcardfront  =  "";
      this.form.wechatpic  =  "";
      this.form.formattedAddress  =  "";

      this.setPageIndex(1);
    },
    prePage() {
      if (this.index > 1) {
        this.setPageIndex(this.index - 1);
      } else {
        this.$router.push({
          name: "message",
          query: {
            referrerid: this.$route.query.referrerid || ""
          }
        });
      }
    },
    goPage(index) {
      this.setPageIndex(index);
    },
    // 下一步
    jumpResult() {
      let data = this.checkAllPage;
      if (data.code == 0) {
        // 保存接口成功后跳转
        let params = JSON.parse(JSON.stringify(this.form));
        params.headname = this.form.bankcardholder;
        let address = "";
        
        if (params.address.indexOf(params.formattedAddress) < 0) {
          params.address =  params.formattedAddress + params.address;
        }
        this.main.request(this.url.savehead,params, "post", ).then((res) => {
          
          if (res.code == 0) {
            this.resetFormlValue();
            this.$router.push({
              path: "result",
              query: {
                id: res.data,
                status: 'success',
                referrerid: this.$route.query.referrerid || ""
              }
              
            });
          } else {
            
            this.$router.push({
              path: "result",
              query: {
                status: 'fail',
                referrerid: this.$route.query.referrerid || ""
              }
            });
            this.$showToast({ title: res.message, duration: 3000 });
          }
        }).catch(res=>{
          //  this.resetFormlValue();
          // if (res.code == 100047) {
            
             
          // }
          // else {
          //   this.resetFormlValue();
          //   this.$router.push({
          //     path: "message",
          //     query: {
          //       referrerid: this.$route.query.referrerid
          //     }
          //   });
          // }
          this.$router.push({
            path: "result",
            query: {
              status: 'fail',
              referrerid: this.$route.query.referrerid || ""
            }
          });
          this.$showToast({ title: res.message, duration: 3000 });
        })
      } else {
        // 跳转页面
        if (data.pageType == 1) {
          this.$router.push({
            name: data.name,
            query: {
              referrerid: this.$route.query.referrerid || ""
            }
          });
        } else {
          this.setPageIndex(data.pageIndex);
        }

        this.$nextTick(() => {
          this.$showToast({ title: data.msg, duration: 1000 });
        });
      }
    },
    ...mapMutations(["setPageIndex"]),
  },
};
</script>

<style lang="scss" scoped>
@import "../components/common.scss";
.member-content {
  background-color: #f7f7f7;
}
</style>
