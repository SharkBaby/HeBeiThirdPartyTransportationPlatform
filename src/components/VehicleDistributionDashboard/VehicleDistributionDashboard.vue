<template>
  <div class="vehicle-distribute-part" v-hasAccess= "{accessId: 'home_clfb'}">
    <router-link :to="routerLink">
      <p class="vehicle-distribute-head">
        <span>{{ vehDisDasTitle }}</span>
        <span class="vehicle-innet-count">{{ vehInnetCount }}</span>
      </p>
      <div id="vehicle-distribute-echarts"></div>
    </router-link>
  </div>
</template>

<style type="text/css" src="./vehicleDistributionDashboard.css" scoped>
</style>

<script>
import { axiosRequest, ObjToArray, twoArrayDivide, storageOperation, innetCountNumber } from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
import * as echarts from "echarts";
import vhcleEchartsConfig from "./vhcleEchartsConfig";
export default {
  name: "VehicleDistributionDashboard",
  components: {},
  data() {
    return {
      routerLink: "/Home/VehicleDistribution",
      vehDisDasTitle: "车辆分布",
      vehInnetCount: "入网车辆总数：",
      getUrl: commonConfig.rootUrl + commonConfig.HomeAPI.GetCarOnLine,
      CarOnlineNumberArr: "",
      CarOnlineNumberRate: "",
      VideoNumberArr: "",
      // VideoNumberRate: "",
      CarTotalArr: ""
    };
  },
  mounted() {
    this.GetCarOnLine();
  },
  methods: {
    GetCarOnLine() {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_clfb'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      axiosRequest.axiosGet(this.getUrl)
        .then(function(response) {
          const carOnlineNumberTemp = response.data.CarOnlineNumber;
          self.VideoNumberArr = response.data.VideoNumber;
          self.CarTotalArr = response.data.CarTotal;
          self.CarOnlineNumberArr = innetCountNumber(carOnlineNumberTemp);
          // 注释人：向浩
          // 注释时间：2018-08-11
          // 注释原因：根据平台演示整改项-河北文档要求，保证入网车辆总数和首页右边-安全监管-车辆在线情况和全省违章车辆的入网车辆总数保持一致
          // 注： 使用ES6的reduce语法进行累加求和
          self.vehInnetCount += self.CarOnlineNumberArr.reduce((prevNumber, curNumber)=>{return prevNumber + curNumber},0);
          self.CarOnlineNumberRate = twoArrayDivide(
            carOnlineNumberTemp,
            self.CarTotalArr
          );
          // self.VideoNumberRate = twoArrayDivide(
          //   self.VideoNumberArr,
          //   self.CarTotalArr
          // );
          self.drawLine();
        })
        .catch(function(error) {});
    },

    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(
        document.getElementById("vehicle-distribute-echarts")
      );
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "车辆类型入网概况",
          subtext: "",
          x: "center",
          textStyle: {
            color: "#fff",
            fontSize: 15,
            fontWeight: 300
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        // 注释人：向浩
        // 注释时间：2018-07-23
        // 注释原因：根据测试人员要求，不显示导出图标的功能
        // toolbox: {
        //   feature: {
        //     dataView: {
        //       show: true,
        //       readOnly: false
        //     },
        //     magicType: {
        //       show: true,
        //       type: ["line", "bar"]
        //     },
        //     restore: {
        //       show: true
        //     },
        //     saveAsImage: {
        //       show: true
        //     }
        //   }
        // },
        legend: {
          x: "center",
          y: "bottom",
          data: vhcleEchartsConfig.legendData,
          textStyle: {
            color: "#fff"
          }
        },
        color: [
          "rgb(2,244,245)",
          "rgb(2,244,245)",
          // "rgb(142,254,245)",
          // "rgb(142,254,245)"
        ],
        // dataset: {
        //   source: [
        //     ['product','入网车辆数','视频入网数'],
        //     ['包车客车', 43.3, 85.8],
        //     ['旅游客车', 83.1, 73.4],
        //     ['三类班线', 86.4, 65.2],
        //     ['危险品', 72.4, 53.9]
        //   ]
        // },
        xAxis: {
          type: "category",
          data: ["旅游包车", "三类以上班线客车", "危险品车", "重型货车"],
          axisPointer: {
            type: "shadow"
          },
          axisLabel: {
            color: "#fff"
          }
        },
        yAxis: [
          {
            type: "value",
            name: "入网总量",
            min: 0,
            max: 40000,
            interval: 4000,
            axisLabel: {
              formatter: "{value} 台"
            },
            axisLabel: { //坐标刻度的颜色设置
              color: "#fff"
            },
            nameTextStyle: { //坐标名字的颜色设置
              color: "#fff"
            }
          },
          {
            type: "value",
            name: "入网百分比: %",
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: "{value} %"
            },
            axisLabel: { //坐标刻度的颜色设置
              color: "#fff"
            },
            nameTextStyle: { //坐标名字的颜色设置
              color: "#fff"
            }
          }
        ],
        series: [
          {
            name: "入网车辆数",
            type: "bar",
            // data: [6685, 12963, 12155, 12954]
            data: this.CarOnlineNumberArr
          },
          {
            name: "入网车辆率",
            type: "line",
            // data: [0.5871 * 100, 0.5745 * 100, 0.2043 * 100, 0.0031 * 100],
            data: this.CarOnlineNumberRate,
            yAxisIndex: 1,
            smooth: true
          },
          // 注释人：向浩
          // 注释时间：2018-08-08
          // 注释原因：根据平台演示整改项-河北文档，去掉视频入网数的显示
          // {
          //   name: "视频入网数",
          //   type: "bar",
          //   data: this.VideoNumberArr
          // },
          // {
          //   name: "视频入网率",
          //   type: "line",
          //   data: this.VideoNumberRate,
          //   yAxisIndex: 1,
          //   smooth: true
          // }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>
