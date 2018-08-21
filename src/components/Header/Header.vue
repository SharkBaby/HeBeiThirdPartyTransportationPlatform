<template>
  <header class="home-header noprint">
    <h1>
      <router-link :to="homeLink" class="dashboard-link">
        <img src="../../assets/logo.png" class="header-logo">
        <label class="header-label">{{ headerTitle }}</label>
      </router-link>
    </h1>
  </header>
</template>

<style src="./header.css" type="text/css">
</style>

<script>
import { storageOperation, isNullUndefEmpty } from "@/common/common";
import { initElemtColor } from "@/Base/Package";
import { provinceVal } from "@/config/commonConfig";
export default {
  name: "Header",
  data() {
    return {
      homeLink: "/Home/Dashboard",
      headerTitle: provinceVal.titleName
    };
  },
  // 注释人：向浩
  // 注释时间：2018-06-05
  // 注释原因：由于不方便调用button单击事件，所以取消将button封装为一个组件
  mounted() {
    const changeTheme = storageOperation.getItem("changeTheme");
    if (!isNullUndefEmpty(changeTheme)) {
      initElemtColor("app", changeTheme);
    } else initElemtColor("app", "#34495e");
  }
};
</script>
