<template>
  <div class="accessPlatform-regulation-part">
    <router-link :to="routerLink">
      <p class="accessPlatform-regulation-head">{{ accPlatTitle }}</p>
      <div class="accessPlatform-regulation-detail-part">
        <div class="accessPlatform-regulation-detail">
          <div class="">
            <img src="../../assets/online-platform-number-sector.png" class="online-platform-number">
            <label>{{accPlaRegDetTopTitle}}</label>
            <label>{{TYPE2CNT}}</label>
          </div>
          <div class="">
            <img src="../../assets/offline-platform-number-sector.png" class="offline-platform-number">
            <label>{{accPlaRegDetBotTitle}}</label>
            <label>{{TYPE3CNT}}</label>
          </div>
        </div>
        <el-row class="access-platform-echarts">
          <pie-component :pieEcharts="pieEcharts"></pie-component>
        </el-row>
        <div class="online-platform-total">
          <span class="online-platform_total_number">{{AccessPlatTotal}}</span>
          <label>{{onltotalText}}</label>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style type="text/css" src="./accessPlatformRegulation.css" scoped>
</style>

<script>
import PieComponent from "@/components/PieComponent/PieComponent";
import { axiosRequest, storageOperation } from "@/common/common";
import { commonConfig, provinceVal } from "@/config/commonConfig";
export default {
  name: "AccessPlatformRegulation",
  components: {
    PieComponent
  },
  data() {
    return {
      routerLink: "/Home/Monitor",
      accPlatTitle: "车辆监管",
      accPlaRegDetTopTitle: "在线行驶车辆:",
      TYPE2CNT: 0,
      accPlaRegDetBotTitle: "在线停车车辆:",
      TYPE3CNT: 0,
      AccessPlatTotal: 0,
      onltotalText: "在线车辆总数",
      getUrl: commonConfig.rootUrl + commonConfig.HomeAPI.GetHomeCurrentOnlineData
    };
  },
  computed: {
    pieEcharts: function() {
      return {
        routerLink: "",
        idName: "access_platform_echarts",
        // data: ['包车客车', '旅游客车', '重货、半挂牵引车', '三类班线客车', '危险品车'],
        data: [],
        color: ["#97ffff", "#3a8dff"],
        legendOrient: "horizontal",
        legendX: "center",
        legendY: "top",
        seriesName: "车辆监管",
        seriesRadius: ["45%", "70%"],
        seriesdata: [
          {
            value: this.TYPE2CNT,
            name: "在线行驶车辆"
          },
          {
            value: this.TYPE3CNT,
            name: "在线停车车辆"
          }
        ]
      };
    }
  },
  mounted: function() {
    this.getHomeCurrentOnlineData();
  },
  methods: {
    getHomeCurrentOnlineData: function() {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_cljg'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const getHomeCurrentOnlineDataParams = {
        zoneId: provinceVal.provinceId
      };
      axiosRequest.axiosGet(this.getUrl, getHomeCurrentOnlineDataParams)
        .then(function(response) {
          /*AccessPlatTotal:0
            OnlineRunCount:0
            OnlineStopCount:0 */
          self.AccessPlatTotal = response.data.OnlineRunCount + response.data.OnlineStopCount;
          self.TYPE2CNT = response.data.OnlineRunCount;
          self.TYPE3CNT = response.data.OnlineStopCount;
        })
        .catch(function(error) {});
    }
  }
};
</script>
