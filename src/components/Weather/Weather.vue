<template>
  <el-row class="home-split-line noprint">
    <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
      <bread-crumb-component :breadNavs="weatherbreadNavs" class="bread-crub"></bread-crumb-component>
      <el-row class="weather-part">
        <el-row class="weather" v-for="(weatherItem ,weatherKey) of weatherdetail" :key="weatherKey" :style="{ top }" :class="{rollScreen_list_unanim:activeIndex === 0}">
          <label class="weather-label">{{weatherItem.ZName}}</label>
          <!-- <label>白天：</label><img :src="weatherItem.dayPictureUrl">
          <label>夜间：</label><img :src="weatherItem.nightPictureUrl"> -->
          <label class="weather-label">{{weatherItem.date}}</label>
          <label class="weather-label">{{weatherItem.weather}}</label>
          <label class="weather-label">{{weatherItem.wind}}</label>
          <label class="weather-label">{{weatherItem.temperature}}</label>
          <label class="weather-label"> ， 请注意安全监管做好安全预防措施~</label>
        </el-row>
      </el-row>
    </el-col>
    <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="personal-settings">
      <personal-settings></personal-settings>
    </el-col>
  </el-row>
</template>
<style src="./weather.css" type="text/css"></style>
<script>
import PersonalSettings from "./PersonalSettings/PersonalSettings";
import BreadCrumbComponent from "@/components/BreadCrumbComponent/BreadCrumbComponent";
import { axiosRequest, storageOperation } from "@/common/common";
import { commonConfig, provinceVal } from "@/config/commonConfig";
import axios from "axios";
import jsonp from "jsonp";
export default {
  name: "Weather",
  props: ["breadNavs"],
  components: {
    PersonalSettings,
    BreadCrumbComponent
  },
  data() {
    return {
      weatherdetail: [],
      weatherbreadNavs: this.breadNavs,
      weatherUrl: commonConfig.weatherUrl,
      weatherTail: "&output=json&ak=Xk63FYkGBlGO6h7vZQ407Ggi",
      zoneData: [
        { ZoneID: 13000000, ZName: "河北省", Up_ZID: 86000000, ZLevel: 1 },
        { ZoneID: 13010000, ZName: "石家庄市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13020000, ZName: "唐山市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13030000, ZName: "秦皇岛市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13040000, ZName: "邯郸市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13050000, ZName: "邢台市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13060000, ZName: "保定市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13070000, ZName: "张家口市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13080000, ZName: "承德市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13090000, ZName: "沧州市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13100000, ZName: "廊坊市", Up_ZID: 13000000, ZLevel: 2 },
        { ZoneID: 13110000, ZName: "衡水市", Up_ZID: 13000000, ZLevel: 2 }
      ],
      activeIndex: 0
    };
  },
  watch: {
    breadNavs: function(val) {
      this.weatherbreadNavs = val;
    }
  },
  computed: {
    top() {
      return -this.activeIndex * 38 + "px";
    }
  },
  mounted() {
    // 注释人：向浩
    // 注释时间：2018-06-27
    // 注释原因：通过百度天气接口来获取主要城市的天气信息
    this.getWeatherInfo();
  },
  methods: {
    getWeatherInfo: function() {
      const self = this;
      for (let cityItem of this.zoneData) {
        jsonp(
          this.weatherUrl + cityItem.ZName + this.weatherTail,
          null,
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              const currentWeather = data.results[0].weather_data[0];
              self.weatherdetail.push({
                ZName: cityItem.ZName,
                dayPictureUrl: currentWeather.dayPictureUrl,
                nightPictureUrl: currentWeather.nightPictureUrl,
                date: currentWeather.date,
                weather: currentWeather.weather,
                wind: currentWeather.wind,
                temperature: currentWeather.temperature
              });
            }
          }
        );
      }
      // 实现天气的上下轮流播出
      setInterval(_ => {
        if (this.activeIndex < this.weatherdetail.length-1) {
          this.activeIndex += 1;
        } else {
          this.activeIndex = 0;
        }
      }, 3000);
    }
  }
};
</script>
