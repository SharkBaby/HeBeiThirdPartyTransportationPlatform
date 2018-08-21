<template>
  <ul class="left-ico-list">
    <li v-for="(mainDisItem, mainDisItemKey) of mainDisItems" :key="mainDisItemKey" v-hasAccess= "{accessId: mainDisItem.ctrlId}">
      <!--注释人：向浩
      注释时间：2018-06-27
      注释原因：添加显示新消息数量
      -->
      <el-badge :value="mainDisItem.badgeValue" :max="99" class="main-display-items">
        <router-link :to="mainDisItem.href" class="page-load">
          <span :class="mainDisItem.spanClass"></span>
          {{mainDisItem.spanText}}
        </router-link>
      </el-badge>
    </li>
  </ul>
</template>
<style src="./maindisplayitems.css" type="text/css" scoped></style>
<script>
import {
  getalarm_actual
} from "@/common/webSocket";
export default {
  name: 'mainDisplayItems',
  props: ['mainDisItems'],
  data () {
    return {
    }
  },
  mounted: function() {
    // 获取websocket实时警情的总数目
    // getalarm_actual(); //获取实时报警的车辆数据
  },
}
</script>
