<template>
  <div class="header-container">
    <Header ></Header>
    <Weather :breadNavs="breadNavs"></Weather>
  </div>
</template>
<style src="./headerContainer.css" type="text/css"></style>
<script>
import Header from "@/components/Header/Header";
import Weather from "@/components/Weather/Weather";
import {
  initSetupWebSocket
} from "@/common/webSocket";
import { commonConfig } from "@/config/commonConfig";
// 注释人：向浩
// 注释时间：2018-07-17
// 注释原因：目前这种包管理方式还不能正常工作， 展示还是需要采用这种方式
// import {
//   getalarm_actual,
//   superviseRslt
// } from "@/common/webSocket";
export default {
  name: "Header-Container",
  props: ["breadNavs"],
  components: {
    Header,
    Weather
  },
  beforeCreate: function() {
    // 登录成功后，将进行第一次握手建立连接
    initSetupWebSocket();
  }
};
</script>
