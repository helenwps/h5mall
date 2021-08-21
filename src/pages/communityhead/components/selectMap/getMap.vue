<template>
  <div id="container" v-show="false"></div>
</template>
<script>
// 1.根据经纬度，设置当前地图位置，搜索附近地点
// 2.地图内选址，设置当前地图位置，搜索附近地点
// 3.搜索框内选址，设置当前地图位置，搜索附近地点
// 4.搜索框联想输入

// 进来带有经纬度，查询附近地点，回显已有的值
// 进来无地址，查询附近地点；
let isloadScript = false;
window.onLoad = function () {};
export default {
  data() {
    return {
      visible: false,
      keywords: "",
      spotList: [],
      mapRef: null,

      curMarker: null,
      curPosition: {
        lng: "",
        lat: "",
      },

      selectRadio: null,
      loading: false,
      finished: false,

      nearbyParam: {
        pageSize: 20, // 单页显示结果条数
        pageIndex: 1, // 页码
        type:
          "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|公共设施",
      },
      stopJump: false,
    };
  },
  mounted() {
    this.show()
  },
  methods: {
    keyChange() {
      if (!!this.keywords) {
        let vm = this;
        return new Promise((resolve, reject) => {
          var placeSearch = new AMap.PlaceSearch({
            pageSize: 20, // 单页显示结果条数
            pageIndex: 1, // 页码
            type:
              "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|公共设施",
          });
          placeSearch.search(this.keywords, function (status, result) {
            if (status == "complete") {
              let spotList = result.poiList.pois || [];
              spotList.forEach((item) => {
                item.distance = null;
              });
              vm.spotList = spotList;
              resolve(vm.spotList);
            } else {
              reject();
            }
          });
        });
      } else {
        this.initData();
      }
    },
    show(form={}) {
      this.visible = true;
      this.curPosition = {
        lng: form.longitude || "",
        lat: form.latitude || "",
      };
      this.$nextTick(() => {
        this.drawMap();
      });
    },
    onClose() {
      this.visible = false;
    },

    clearMarker() {
      if (this.curMarker) {
        this.curMarker.setMap(null);
        this.curMarker = null;
      }
    },
    addMarker(lng, lat) {
      // console.log(lng,lat)
      this.clearMarker();
      this.curPosition = {
        lng,
        lat,
      };
      // 设置地图中心
      this.mapRef.setCenter([lng, lat]);
      setTimeout(() => {
        // 设置图标
        this.curMarker = new AMap.Marker({
          position: this.mapRef.getCenter(),
          icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png",
          offset: new AMap.Pixel(0, 0),
          // 设置是否可以拖拽
          // draggable: true,
          // cursor: 'move',
          // 设置拖拽效果
          // raiseOnDrag: true
        });
        this.curMarker.setMap(this.mapRef);
      }, 500);
    },
    scrollTop() {},
    // 鼠标点击经纬度事件
    initMapClick() {
      let vm = this;
      this.mapRef.on("click", function (e) {
        vm.stopJump = true;
        vm.selectAddressBylnglat(e.lnglat.getLng(), e.lnglat.getLat()).then(() => {
          vm.updateProps();
        });
        vm.scrollTop();
      });
    },
    drawMap() {
      let vm = this;
      if (isloadScript) {
        vm.drawMapAction();
        return;
      }
      isloadScript = true;
      console.log("isloadScript", isloadScript);
      var url =
        "https://webapi.amap.com/maps?v=1.4.8&key=468631da176556b1d279127c9e611066&callback=onLoad&plugin=AMap.Geolocation,AMap.Autocomplete,AMap.PlaceSearch,AMap.Scale,AMap.ToolBar,AMap.PolyEditor,AMap.Geocoder";
      var jsapi = document.createElement("script");
      jsapi.charset = "utf-8";
      jsapi.src = url;
      jsapi.onload = jsapi.onreadystatechange = function () {
        console.log("jsapi.onload");
        vm.drawMapAction();
      };
      document.head.appendChild(jsapi);
    },
    drawMapAction() {
      if (this.mapRef) {
        this.mapRef.destroy();
      }

      this.mapRef = new AMap.Map("container", {
        zoom: 16,
        resizeEnable: true,
        // center: [116.39, 39.9]
      });
      // this.initData();
      // this.initMapClick();
      // this.initInputAuto();
    },
    initData() {
      this.stopJump = true;
      // 没有值就近定位

      if (!this.curPosition || !this.curPosition.lng || !this.curPosition.lat) {
        this.setLocation();
      } else if (this.curPosition && this.curPosition.lng && this.curPosition.lat) {
        this.selectAddressBylnglat(this.curPosition.lng, this.curPosition.lat);
      }
    },
    // 输入框初始化，输入联想,点击事件
    initInputAuto() {
      let vm = this;

      var autoOptions = {
        // input: "tipinput",
      };
      var auto = new AMap.Autocomplete(autoOptions);
      var placeSearch = new AMap.PlaceSearch({}); //构造地点查询类
      AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
      function select(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name); //关键字查询查询
        // vm.keywords = e.poi.name;
        vm.selectAddressBylnglat(e.poi.location.lng, e.poi.location.lat);
        vm.scrollTop();
        // vm.getAddressBylnglat([e.poi.location.lng, e.poi.location.lat]);
      }
    },
    // 根据当前经纬度查询地点
    searchNearBy(lng, lat) {
      let vm = this;
      return new Promise((resolve, reject) => {
        var placeSearch = new AMap.PlaceSearch(vm.nearbyParam);
        placeSearch.searchNearBy("", [lng, lat], 200, function (status, result) {
          if (status == "complete") {
            let pusharr = result.poiList.pois || [];
            // if (vm.nearbyParam.pageIndex == 1) {
            //   vm.spotList = pusharr;
            // } else {
            //   pusharr.forEach((item) => {
            //     vm.spotList.unshift(item);
            //   });
            // }
            vm.spotList = pusharr;
            resolve(pusharr);
          } else {
            reject();
          }
        });
      });
    },
    // 根据经纬度查询地址
    getAddressBylnglat(lnglat = []) {
      // var lnglat = [116.396574, 39.992706]
      return new Promise((resolve, reject) => {
        var geocoder = new AMap.Geocoder();
        geocoder.getAddress(lnglat, function (status, result) {
          console.log(result);
          if (status === "complete" && result.info === "OK") {
            // result为对应的地理位置详细信息

            resolve(result.regeocode);
          } else {
            reject();
          }
        });
      });
    },
    selectAddress(item) {
      // this.resetMarker(item.location.lng, item.location.lat);

      this.keywords = "";
      if (this.selectRadio) {
        this.updateProps().then(() => {
          if (this.stopJump) {
            this.stopJump = false;
          } else {
            this.visible = false;
          }
        });
      } else {
        if (this.stopJump) {
          this.stopJump = false;
        } else {
          this.visible = false;
        }
      }
    },
    updateProps() {
      return this.getAddressBylnglat([
        this.selectRadio.location.lng,
        this.selectRadio.location.lat,
      ]).then((data) => {
        let formattedAddress =
          data.addressComponent.province +
          data.addressComponent.city +
          data.addressComponent.district +
          data.addressComponent.township +
          data.addressComponent.street +
          data.addressComponent.streetNumber;
        this.$emit("change", {
          latitude: this.selectRadio.location.lat,
          longitude: this.selectRadio.location.lng,
          provincename: data.addressComponent.province,
          cityname: data.addressComponent.city,
          areaname: data.addressComponent.district,
          // formattedAddress: data.formattedAddress||'',
          formattedAddress,
        });
      });
    },
    resetMarker(lng, lat) {
      this.keywords = "";
      this.addMarker(lng, lat);
    },
    selectAddressBylnglat(lng, lat) {
      this.resetMarker(lng, lat);
      return this.searchNearBy(lng, lat).then(() => {
        let item;
        let flg = false;
        for (let i = 0; i < this.spotList.length; i++) {
          item = this.spotList[i];
          if (item.location.lng == lng && item.location.lat == lat) {
            this.selectRadio = item;
            flg = true;
            break;
          }
        }
        if (!flg && this.spotList.length > 0) {
          this.selectRadio = this.spotList[0];
        }
      });
    },
    setLocation() {
      // 定位出错
      let vm = this;
      // let centerpos = vm.mapRef.getCenter();
      // if (centerpos) {
      //   vm.curPosition = {
      //     lng: centerpos.lng,
      //     lat: centerpos.lat,
      //   };
      // }
      // if (!!vm.curPosition && !!vm.curPosition.lng && !!vm.curPosition.lat) {
      //   vm.selectAddressBylnglat(vm.curPosition.lng, vm.curPosition.lat);
      // }
      var geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        // enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonOffset: new AMap.Pixel(10, 20),
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        //  定位按钮的排放位置,  RB表示右下
        buttonPosition: "RB",
      });

      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, "complete", onComplete);
      AMap.event.addListener(geolocation, "error", onError);
      function onComplete(data) {
        // data是具体的定位信息
        // alert("onComplete:",data)
        vm.selectAddressBylnglat(data.position.getLng(), data.position.getLat());
      }
      function onError(data) {
        // 定位出错
        // alert("onError:",data)
        let centerpos = vm.mapRef.getCenter();
        if (centerpos) {
          vm.curPosition = {
            lng: centerpos.lng,
            lat: centerpos.lat,
          };
        }
        if (!!vm.curPosition && !!vm.curPosition.lng && !!vm.curPosition.lat) {
          vm.selectAddressBylnglat(vm.curPosition.lng, vm.curPosition.lat);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../common.scss";
#container {
  width: 100%;
  height: 172px;
}
.search-box {
  display: flex;
  justify-content: center;
  background-color: white;
  .search-wrap {
    margin: 12px auto;
    .search-icon {
      font-size: 24px;
      margin: auto 10px;
    }
    #tipinput {
      flex: 1;
      font-size: 14px;
      background-color: #fafafa;
      margin-right: 38px;
    }
    width: 343px;
    height: 44px;
    overflow: hidden;
    background: #fafafa;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.address-list,
.area-container {
  padding: 0 16px;
}
.address-list-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  .address-name {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    color: #999999;
    .address-detail {
      font-size: 16px;
      color: #000000;
    }
  }
  .address-distance {
    width: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #999999;
  }
}
.member-content {
  padding-top: 300px;
  overflow: scroll;
  box-sizing: border-box;
  height: 100%;
  .topbar {
    position: fixed;
    transform: translateZ(0);
    left: 0;
    right: 0;
    top: 40px;
    width: 100%;
    margin: auto;
    background: white;
    z-index: 2;
  }
}
.empty-phrase {
  display: flex;
  font-size: 16px;
  color: #999999;
  line-height: 32px;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
.ch-selectmap {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  transform: translate3d(0, 0, 0);
  .amap-marker img {
    width: 25px;
    height: 34px;
  }
  .van-radio__label {
    flex: 1;
    margin-left: 17px;
  }
  .van-cell {
    background: #fafafa;
    padding: 10px 0;
    padding-right: 37px;
  }
}
.amap-sug-result {
  z-index: 9999;
}
</style>
