<template>
  <el-carousel :interval="5000" arrow="always" class="carousel-part">
    <el-carousel-item v-for="(swiperItem, swiperKey) of swiperRslt" :key="swiperKey">
      <p class="home-insurance-title">{{swiperItem.titleName}}</p>
      <el-row class="carousel-table">
        <el-row>
          <el-col v-for="(headerItem, headerKey) of swiperItem.tabHeader" :key="headerKey" v-bind:span="headerItem.span==24?8:8">{{headerItem.label}}</el-col>
        </el-row>
        <marquee direction="up">
          <el-row v-for="(tabItem, tabKey) of swiperItem.tabCtnt" :key="tabKey">
            <el-col v-bind:span="rowItem.span==24?8:8" v-for="(rowItem, rowKey) of swiperItem.tabHeader" :key="rowKey">{{tabItem[rowItem.prop]}}</el-col>
          </el-row>
        </marquee>
      </el-row>
    </el-carousel-item>
  </el-carousel>
</template>

<style src="./carsouselComponent.css" type="text/css">
  
</style>

<script>
  import {
    storageOperation,
    isNullUndefEmpty
  } from "@/common/common";
  import {
    initElemtColor
  } from "@/Base/Package";
  export default {
    name: "CarsouselComponent",
    props: ["swiperRslt"],
    data() {
      return {
        homeLink: "/Home/Dashboard",
        headerTitle: "河北省重点营运车辆动态信息公共监管与服务平台112"
      };
    },
    // 注释人：向浩
    // 注释时间：2018-06-05
    // 注释原因：由于不方便调用button单击事件，所以取消将button封装为一个组件
    mounted() {}
  };
</script>
