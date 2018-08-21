<template>
  <div class="security-content" v-hasAccess= "{accessId: 'home_aqjg'}">
    <p class="home-security-head">{{ secHeadTitle }}</p>
    <!-- <el-row class="home_security_xxx" v-if="mapItem.mapTitle === '全省隐患预览'">
      <pie-component :pieEcharts="mapItem.pieEcharts"></pie-component>
    </el-row> -->
    <security-ctnt-map :mapType="mapType" :mapItem="mapItem" class="map-class"></security-ctnt-map>
  </div>
</template>
<style type="text/css" src="./securityContent.css"></style>
<script>
import SecurityCtntMap from "./SecurityCtntMap/SecurityCtntMap";
import PieComponent from "@/components/PieComponent/PieComponent";
export default {
  name: "SecurityContent",
  props: ["mapItem"],
  components: {
    SecurityCtntMap,
    PieComponent
  },
  data() {
    return {
      secHeadTitle: "安全监管",
      mapType: "河北",
      // securityCtntMap: this.mapSeriesData
    };
  },
};
</script>
