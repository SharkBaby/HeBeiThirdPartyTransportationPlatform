<template>
  <el-row class="vehicleDistribution">
    <!-- 元饼图 -->
    <el-col :xs="24" :sm="12" :md="4" :lg="4" :xl="4" class="vehicle-col-left">
      <el-row class="vehicle-col-left-pie">
        <pie-component :pieEcharts="pieEcharts"></pie-component>
      </el-row>
    </el-col>
    <!-- 地图 -->
    <el-col :xs="24" :sm="12" :md="9" :lg="9" :xl="9" class="vehicle-col-center">
      <security-ctnt-map :mapType="mapType" :mapItem="mapItem" v-on:handleVhcleLeft="handleVhcleLeft" v-on:handleVhcleRight="handleVhcleRight"></security-ctnt-map>
    </el-col>
    <!-- 车辆信息 -->
    <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" class="vehicle-col-right">
      <el-tabs type="border-card" @tab-click="handleTabClick">
        <el-tab-pane label="全部车辆" v-hasAccess="{accessId: 'home_clfb_qbcl'}">
          <el-row class="chkbox-all-vehicle">
            <el-checkbox v-model="vhcleItem.compVal" v-for="(vhcleItem, vhcleKey) of vhcleRslt" :key="vhcleKey" @change="handleVhcleType(vhcleKey)">{{vhcleItem.labelName}}</el-checkbox>
          </el-row>
          <el-table 
          ref="singleTable"
          :data="tabCtntList.TabCtnt"
          highlight-current-row
          max-height="900"
          style="width: 100%" 
          :default-sort="{prop: 'date', order: 'descending'}"
          row-class-name="table-body-row-class-name"
          header-cell-class-name="table-cell-class-name"
          class="multi-level-no-table">
            <el-table-column :prop="tabHeaderKey" :label="tabHeaderItem" v-for="(tabHeaderItem,tabHeaderKey) in tabCtntList.tabHeader" :key="tabHeaderKey">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--注释人：向浩
        注释时间：2018-08-12
        注释原因：暂时隐藏掉重点车辆功能
        -->
        <!-- <el-tab-pane label="重点车辆" v-hasAccess="{accessId: 'home_clfb_zdcl'}">
          <el-row :class="impVehicles.operationStyle">
            <el-input placeholder="请输入内容" v-model="impVehicles.inputCtnt.inputName" class="important-vehicle" @change="changePreSearch(impVehicles.inputCtnt.inputName)">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch(impVehicles.inputCtnt.vehicleId)"></el-button>
            </el-input>
            <el-row class="pre-search">
              <el-row class="pre-search-item" v-for="(preSearchItem, preSearchKey) of impVehicles.preSearchItems" :key="preSearchKey">
                <label @mouseup="handlePreSearchSelect(preSearchItem.Value, preSearchItem.Name)">{{preSearchItem.Name}}</label>
              </el-row>
            </el-row>
            <el-row class="important-vehicle-button">
              <el-button type="primary" plain v-for="(impVhcleItem, impVhcleKey) of impVehicles.impItems" :key="impVhcleKey" @click="handleImpClick(impVhcleItem.VehicleID)">{{impVhcleItem.name}}</el-button>
            </el-row>
          </el-row>
          <el-row :class="['vehicle-distribution-right-vehicle-detail', impVehicles.detailStyle]">
            <el-row class="vehicle-distribution-vehicle-photo">
              <el-row></el-row>
              <el-button type="primary" plain class="license-plat">{{impVehicles.impVhcleDetail.LicensePlat}}</el-button>
            </el-row>
            <el-row class="vehicle-distribution-vehicle-license">
              <el-row class="vehicle-distribution-detail-title">
                <label>行驶证信息</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>车牌号：</label>
                <label name="LicensePlat">{{impVehicles.impVhcleDetail.LicensePlat}}</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>车牌颜色：</label>
                <label name="PlateColor">{{impVehicles.impVhcleDetail.PlateColor}}</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>车辆类型：</label>
                <label name="VehicleType">{{impVehicles.impVhcleDetail.VehicleType}}</label>
              </el-row>
            </el-row>
            <el-row class="vehicle-distribution-vehicle-license">
              <el-row class="vehicle-distribution-detail-title">
                <label>道路运输证信息</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>所属企业：</label>
                <label name="UnitName">{{impVehicles.impVhcleDetail.UnitName}}</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>所属地区：</label>
                <label name="ZName">{{impVehicles.impVhcleDetail.ZName}}</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>所属运政：</label>
                <label name="LogicUnitName">{{impVehicles.impVhcleDetail.LogicUnitName}}</label>
              </el-row>
            </el-row>
            <el-row class="vehicle-distribution-vehicle-license">
              <el-row class="vehicle-distribution-detail-title">
                <label>车辆入网终端字信息</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>所属服务商：</label>
                <label name="ProviderName">{{impVehicles.impVhcleDetail.ProviderName}}</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>终端型号：</label>
                <label>暂无</label>
              </el-row>
              <el-row class="vehicle-distribution-detail-item">
                <label>终端主要功能：</label>
                <label>暂无</label>
              </el-row>
            </el-row>
            <el-row class="vehicle-distribution-vehicle-license">
              <label class="vehicle-distribution-icon vehicle-distribution-synchronous" @mouseup="handleSynchronous"></label>
              <label class="vehicle-distribution-icon vehicle-distribution-synchronous-return" @mouseup="handleReturn"></label>
            </el-row>
          </el-row>
        </el-tab-pane> -->
      </el-tabs>
    </el-col>
  </el-row>
</template>

<style type="text/css" src="./vehicleDistributionIndex.css">
</style>

<script>
import PieComponent from "@/components/PieComponent/PieComponent";
import SecurityCtntMap from "@/components/SecurityContent/SecurityCtntMap/SecurityCtntMap";
import SingleChkboxComponent from "@/components/SingleChkboxComponent/SingleChkboxComponent";
import { axiosRequest, storageOperation, handleErrorMsg } from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "VehicleDistribution",
  components: {
    PieComponent,
    SecurityCtntMap,
    SingleChkboxComponent
  },
  data() {
    return {
      getVehicleSpreadDataUrl: commonConfig.rootUrl + commonConfig.VehicleDistributionAPI.GetVehicleSpreadData,
      getVehicleListUrl: commonConfig.rootUrl + commonConfig.VehicleDistributionAPI.GetVehicleList,
      getGetVehicleDetailUrl: commonConfig.rootUrl + commonConfig.VehicleDistributionAPI.GetVehicleDetail, //获取单个重点车辆的详细信息
      getAutoDataListUrl: commonConfig.rootUrl + commonConfig.GetAutoDataList, // 通用接口 - 预搜索
      pieRslt: [],
      mapType: "河北",
      mapData: [],
      sourceData: [], //地图显示的数据
      allVehicleData: [], //存储每一个市的所有信息，以便在鼠标mouseover上会有数据
      vhcleRslt: [
        {
          labelName: "包车客车",
          keyVal: ["CBusTotalCount"],
          compVal: true
        },
        {
          labelName: "旅游客车",
          keyVal: ["TourTotalCount"],
          compVal: true
        },
        {
          labelName: "三类以上班线客车",
          keyVal: ["LineTotalCount"],
          compVal: true
        },
        {
          labelName: "危险品车",
          keyVal: ["DTotalCount"],
          compVal: true
        },
        {
          labelName: "重货、半挂牵引车",
          keyVal: ["HeavyTotalCount", "TractorTotalCount"],
          compVal: true
        }
      ],
      VehicleAllCnt: 0, // 获得当前省份或者地区的所有入网车辆
      tabCtnt: [],
      // 重点车辆数据
      impVehicles: {
        operationStyle: "",
        detailStyle: "hide-important-part",
        inputCtnt: {
          inputName: "",
          vehicleId: ""
        },
        preSearchItems: [], //存储预搜索的返回结果
        impItems: [],
        impVhcleDetail: {
          LicensePlat: "",
          PlateColor: "",
          VehicleType: "",
          VehicleType: "",
          UnitName: "",
          LogicUnitName: "",
          ProviderName: ""
        }
      }
    };
  },
  computed: {
    pieEcharts: function() {
      return {
        routerLink: "",
        titleName: this.pieRslt.titleName,
        titleX: '50%',
        titleY: 'center',
        idName: "platform-top-left",
        color: ["#f8143a", "#8effff", "#3882ec", "#0056c0", "#F18F51"],
        // data: ['包车客车', '旅游客车', '重货、半挂牵引车', '三类班线客车', '危险品车'],
        data: [],
        legendOrient: 'horizontal',
        legendX: 'center',
        legendY: 'top',
        seriesRadius: ['45%', '70%'],
        seriesName: "车辆分布",
        seriesdata: this.pieRslt.seriesdata
        // seriesdata: [{
        //     value: 93,
        //     name: '包车客车'
        //   },
        //   {
        //     value: 0,
        //     name: '旅游客车'
        //   }, {
        //     value: 0,
        //     name: '重货、半挂牵引车'
        //   },
        //   {
        //     value: 463,
        //     name: '三类班线客车'
        //   }, {
        //     value: 333,
        //     name: '危险品车'
        //   }
        // ]
      };
    },
    mapItem: function() {
      return {
        chart_map: {
          data: this.mapData
          // data: [{
          //   name: "河北省",
          //   value: 0
          // }, {
          //   name: "长沙市",
          //   value: 0
          // }, {
          //   name: "株洲市",
          //   value: 0
          // }, {
          //   name: "湘潭市",
          //   value: 0
          // }, {
          //   name: "衡阳市",
          //   value: 0
          // }, {
          //   name: "邵阳市",
          //   value: 0
          // }, {
          //   name: "岳阳市",
          //   value: 0
          // }]
        },
        seriesData: [
            {
              name: "车辆分布",
              type: "map",
              mapType: "河北", //sessionStorage.zoneName
              // geoCoord: geoCoord,
              mapLocation: {
                y: "20"
              },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: "#FFF",
                      fontFamily: "Microsoft YaHei"
                    },
                    formatter: "{b}"
                  },
                  areaColor: "rgb(43,61,78)",
                  borderColor: "rgb(228,230,231)",
                  borderWidth: 0.5,
                  areaStyle: {
                    color: "rgb(43,61,78)"
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    textStyle: {
                      //color: 'yellow',
                      color: "#2FFFFF",
                      fontFamily: "Microsoft YaHei"
                    }
                    // formatter: function(name, value) {
                    //   //"{a}:{b}"
                    //   var res = "";
                    //   if (name.length > 5) {
                    //     res = name.substr(0, 4) + "\n" + name.substr(4);
                    //     return res + ":" + value;
                    //   }
                    //   return name + ":" + value;
                    // }
                  },
                  color: "#1A2C36",
                  areaColor: "rgb(26,44,54)",
                  borderColor: "#FFF",
                  borderWidth: 1
                }
              },
              hoverable: true,
              data: this.sourceData
            }
          ],
        mapType: "VehicleDistibution", // 这个参数会在地图组建中区分是来自于哪一个页面的调用，从而处理不同的逻辑
        allVehicleData: this.allVehicleData
      };
    },
    tabCtntList: function() {
      return {
        tabHeader: {
          ZName: "地区",
          Rate: "入网车辆占全省车辆比重",
          VhcleCount: "车辆总数"
        },
        TabCtnt: this.tabCtnt
        // TabCtnt: [{
        //   ZName: '河北省',
        //   Rate: '0.34%',
        //   VhcleCount: '97'
        // }, {
        //   ZName: '长沙市',
        //   Rate: '21.66%',
        //   VhcleCount: '6091'
        // }, {
        //   ZName: '株洲市',
        //   Rate: '5.77%',
        //   VhcleCount: '1631'
        // }, {
        //   ZName: '湘潭市',
        //   Rate: '2.98%',
        //   VhcleCount: '839'
        // }, {
        //   ZName: '衡阳市',
        //   Rate: '8.14%',
        //   VhcleCount: '2290'
        // }, {
        //   ZName: '邵阳市',
        //   Rate: '4.94%',
        //   VhcleCount: '1389'
        // }]
      };
    }
  },
  mounted: function() {
    this.initVehicleDistribution();
  },
  methods: {
    initVehicleDistribution: function() {
      storageOperation.setItem(commonConfig.ctrlId, 'home_clfb_qbcl'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const self = this;
      axiosRequest.axiosGet(this.getVehicleSpreadDataUrl, {
          zoneId: 0,
          vehicleType: 0
        })
        .then(function(response) {
          /**
             * CBusTotalCount
            :
            128
            DTotalCount
            :
            226
            HeavyTotalCount
            :
            0
            LineTotalCount
            :
            446
            TourTotalCount
            :
            0
            TractorTotalCount
            :
            0
            VehicleCnt
            :
            800
            ZoneID
            :
            43030000
            ZoneName
            :
            "湘潭市"
             */
          self.allVehicleData = response.data;
          const tempSourceData = [];
          for(let tempSDItem of response.data){
            tempSourceData.push({
              name: tempSDItem.ZoneName,
              value: tempSDItem.VehicleCnt,
            })
          }
          self.sourceData = tempSourceData;
          if (response.data[0].VehicleCnt !== 0)
            self.VehicleAllCnt = response.data[0].VehicleCnt; // 获得当前省份或者地区的所有入网车辆
          for (let vhcleItem of response.data) {
            self.mapData.push({
              name: vhcleItem.ZoneName,
              value: vhcleItem.VehicleCnt
            }); //中间地图的数据加载
            self.tabCtnt.push({
              ZName: vhcleItem.ZoneName,
              Rate:
                self.VehicleAllCnt == 0
                  ? "0.00"
                  : (vhcleItem.VehicleCnt / self.VehicleAllCnt * 100).toFixed(
                      2
                    ) + "%",
              VhcleCount: vhcleItem.VehicleCnt,
              CurrnetVhcleCount: vhcleItem.VehicleCnt, //这是一个临时变量来保存当前勾选筛选框后的总量
              CBusTotalCount: vhcleItem.CBusTotalCount,
              TourTotalCount: vhcleItem.TourTotalCount,
              LineTotalCount: vhcleItem.LineTotalCount,
              DTotalCount: vhcleItem.DTotalCount,
              HeavyTotalCount: vhcleItem.HeavyTotalCount,
              TractorTotalCount: vhcleItem.TractorTotalCount
            }); //右边初始加载的城市数据
          }
        })
        .catch(function(error) {});
    },
    handleVhcleLeft: function(message) {
      this.pieRslt = message;
    },
    handleVhcleRight: function(message) {
      this.tabCtnt = message;
      this.VehicleAllCnt = this.tabCtnt[0].VhcleCount;
    },
    handleVhcleType: function(vhcleKey) {
      if (this.vhcleRslt[vhcleKey].compVal) {
        //勾选相应的车型
        for (let increaseItem of this.vhcleRslt[vhcleKey].keyVal) {
          //获得需要加上的数目
          this.VehicleAllCnt += this.tabCtnt[0][increaseItem];
        }
        for (let vhcleItem in this.tabCtnt) {
          let increaseVal = 0;

          for (let increaseItem of this.vhcleRslt[vhcleKey].keyVal) {
            //获得需要加上的数目
            increaseVal += this.tabCtnt[vhcleItem][increaseItem];
          }
          this.tabCtnt[vhcleItem].CurrnetVhcleCount =
            this.tabCtnt[vhcleItem].CurrnetVhcleCount + increaseVal;
          this.tabCtnt[vhcleItem].Rate =
            this.VehicleAllCnt == 0
              ? "0.00"
              : (
                  this.tabCtnt[vhcleItem].CurrnetVhcleCount /
                  this.VehicleAllCnt *
                  100
                ).toFixed(2) + "%";
        }
      } else {
        //取消勾选相应的车型
        for (let increaseItem of this.vhcleRslt[vhcleKey].keyVal) {
          //获得需要加上的数目
          this.VehicleAllCnt -= this.tabCtnt[0][increaseItem];
        }
        for (let vhcleItem in this.tabCtnt) {
          let decreaseVal = 0;
          for (let decreaseItem of this.vhcleRslt[vhcleKey].keyVal) {
            //获得需要减去的数目
            decreaseVal += this.tabCtnt[vhcleItem][decreaseItem];
          }
          this.tabCtnt[vhcleItem].CurrnetVhcleCount =
            this.tabCtnt[vhcleItem].CurrnetVhcleCount - decreaseVal;
          this.tabCtnt[vhcleItem].Rate =
            this.VehicleAllCnt == 0
              ? "0.00"
              : (
                  this.tabCtnt[vhcleItem].CurrnetVhcleCount /
                  this.VehicleAllCnt *
                  100
                ).toFixed(2) + "%";
        }
      }
    },
    // 处理tab 点击事件
    handleTabClick: function(tab, event) {
      if (tab.index == 1) this.GetVehicleList();
    },
    // 重点车辆
    GetVehicleList: function() {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_clfb_zdcl'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      self.impVehicles.impItems = []; //注意在每次调用获取重点车辆前需要清空数据
      axiosRequest
        .axiosGet(this.getVehicleListUrl, {
          zoneId: 0,
          vehicleId: 0
        })
        .then(function(response) {
          /**
             * AbnormalCNT
              :
              0
              DeviceID
              :
              3401
              HoursDriveCNT
              :
              0
              LicensePlat
              :
              "湘B07228黄"
              OverSpeedCNT
              :
              2
              TotalCNT
              :
              2
              UnitName
              :
              "株洲天润汽车运输有限公司"
              ZName
              :
              "市辖区"
             */
          for (let impVhcleItem of response.data) {
            self.impVehicles.impItems.push({
              name: impVhcleItem.LicensePlat,
              VehicleID: impVhcleItem.DeviceID
            });
          }
        })
        .catch(function(error) {
          self.$message({
            type: 'warning',
            message: handleErrorMsg(error)
          })
        });
    },
    // 重点单个车辆Click事件
    handleImpClick: function(VehicleID) {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      self.impVehicles.operationStyle = "hide-important-part";
      self.impVehicles.detailStyle = "";
      axiosRequest
        .axiosGet(this.getGetVehicleDetailUrl, {
          VehicleID
        })
        .then(function(response) {
          /**
             * DeviceID
              :
              3401
              Gpspa
              :
              null
              LicensePlat
              :
              "湘B07228"
              LogicUnitName
              :
              "市辖区运管所"
              Optional
              :
              null
              PlateColor
              :
              "黄"
              ProviderName
              :
              null
              UnitName
              :
              "株洲天润汽车运输有限公司"
              Vediopa
              :
              null
              VehicleType
              :
              "危险品运输车"
              ZName
              :
              "市辖区"
             */
          const impVhcleTemp = response.data;
          self.impVehicles.impVhcleDetail = {
            LicensePlat: impVhcleTemp.LicensePlat,
            PlateColor: impVhcleTemp.PlateColor,
            VehicleType: impVhcleTemp.VehicleType,
            UnitName: impVhcleTemp.UnitName,
            LogicUnitName: impVhcleTemp.LogicUnitName,
            ProviderName: impVhcleTemp.ProviderName
          };
        })
        .catch(function(error) {});
    },
    // 单击返回按钮
    handleReturn: function() {
      this.impVehicles.operationStyle = "";
      this.impVehicles.detailStyle = "hide-important-part";
    },
    // 单击同步按钮
    handleSynchronous: function() {
      this.$message({
        message:
          "服务未连接成功，此功能无法使用（注：重构项目中此功能还未开发）",
        type: "warning"
      });
    },
    // 车辆预搜索功能
    changePreSearch: function(inputCtnt) {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      this.impVehicles.preSearchItems = [];
      axiosRequest
        .axiosGet(this.getAutoDataListUrl, {
          type: 3, // 参数详细设置请参考commonConfig.js的说明
          text: inputCtnt.toString(),
          zoneId: 0,
          queryType: 0
        })
        .then(function(response) {
          /**
             * Id
            :
            24357
            Name
            :
            "湘F22501|黄"
            UnitName
            :
            "岳阳永昌物流有限公司"
            Value
            :
            24357
             */
          for (let preSearchItem of response.data) {
            self.impVehicles.preSearchItems.push({
              Name: preSearchItem.Name,
              Value: preSearchItem.Value
            });
          }
        })
        .catch(function(error) {});
    },
    //从预搜索中选择结果
    handlePreSearchSelect: function(Value, Name) {
      //1. 清除预搜索数据
      this.impVehicles.preSearchItems = [];
      //2. 填充到当前输入框
      this.impVehicles.inputCtnt.inputName = Name;
      this.impVehicles.inputCtnt.vehicleId = Value;
    },
    // 单击查询按钮
    handleSearch: function(vehicleId) {
      this.handleImpClick(vehicleId);
    }
  },
  created: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>