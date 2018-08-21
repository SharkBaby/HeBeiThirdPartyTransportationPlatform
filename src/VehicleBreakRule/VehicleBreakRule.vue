<template>
  <div class="vehicle-break-rule">
    <multi-level-table-component 
    :activeName="activeName" 
    :tabCtntList="tabCtntList"
    class="vehicle-break-rule-multilevel"
    v-on:handleCurActiveIndex="handleCurActiveIndex"
    v-on:handleClickSearch="handleClickSearch" 
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"></multi-level-table-component>
    <p class="check-footer-p" v-show="activeNameIndex == 0 || activeNameIndex == 1 | activeNameIndex == 2">
      注 : 车辆入网总数为截止查询“结束日期”的入网数
    </p>
  </div>
</template>
<style src="./vehicleBreakRule.css" type="text/css" scoped>
</style>

<script>
// scoped: 防止css全局污染
import MultiLevelTableComponent from "@/components/MultiLevelTableComponent/MultiLevelTableComponent";
import {
  axiosRequest,
  storageOperation,
  handleErrorMsg,
  isNullUndefEmpty
} from "@/common/common";
import {
  commonConfig,
  provinceVal,
  reportLabelId
} from "@/config/commonConfig";
// 引入权限控制的文件
import { $_hasAccess } from "@/accessmanagement/accessmanagement";
export default {
  name: "VehicleBreakRule",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "report_vehiclebreakrule_zone_table",
      activeNameIndex: 0,
      curNameIndex: 0, //当前地区汇总，主要是解决用户在正在查询数据时，切换了标签页
      getVehicleBreakRuleDataUrl:
        commonConfig.rootUrl +
        commonConfig.VehicleBreakRuleAPI.GetVehicleBreakRuleData,
      exportVehicleBreakRuleDataUrl:
        commonConfig.rootUrl +
        commonConfig.VehicleBreakRuleAPI.ExportVehicleBreakRuleData,
      // // 每一大列的满分得分
      // columnFullScore: {
      //   rwl: 5,
      //   sxl: 10,
      //   wxpyl: 15,
      //   gjwzl: 40,
      //   sjhgl: 30,
      //   pjcscs: 0,
      //   pjpjsc: 0
      // },
      // 每一列的类型，目前已经有纯文本和router-link
      columnType: {
        text: "text",
        router_link: "router_link"
      },
      // 存储每10行的数据
      providerCheckSourceData: [],
      // 存储合计的数据
      countData: [],
      // tabName作为标识符
      tabNameObj: {
        firTab: {
          tabLabel: "地区汇总",
          tabName: "report_vehiclebreakrule_zone_table", //将作为标识符来区分
          nType: 1, //根据重构前的请求，可以看到nType 为1
          ctrlId: "wztj_dqhz" //需要权限控制的情况下，需要制定id号
        },
        secTab: {
          tabLabel: "接入平台汇总",
          tabName: "report_vehiclebreakrule_service_table", //将作为标识符来区分
          nType: 2, //根据重构前的请求，可以看到nType 为2
          ctrlId: "wztj_jrpthz" //需要权限控制的情况下，需要制定id号
        },
        thiTab: {
          tabLabel: "企业汇总",
          tabName: "report_vehiclebreakrule_company_table", //将作为标识符来区分
          nType: 3, //根据重构前的请求，可以看到nType 为3
          ctrlId: "wztj_qyhz" //需要权限控制的情况下，需要制定id号
        },
        fouTab: {
          tabLabel: "车辆汇总",
          tabName: "report_vehiclebreakrule_vehicle_table", //将作为标识符来区分
          nType: 4, //根据重构前的请求，可以看到nType 为4
          ctrlId: "wztj_clhz" //需要权限控制的情况下，需要制定id号
        },
        fifTab: {
          tabLabel: "超速",
          tabName: "report_vehiclebreakrule_overSpeed_table", //将作为标识符来区分
          nType: 5, //根据重构前的请求，可以看到nType 为5
          ctrlId: "wztj_cs" //需要权限控制的情况下，需要制定id号
        },
        sixTab: {
          tabLabel: "2-5点运行",
          tabName: "report_vehiclebreakrule_abnormal_table", //将作为标识符来区分
          nType: 6, //根据重构前的请求，可以看到nType 为6
          ctrlId: "wztj_25yx" //需要权限控制的情况下，需要制定id号
        },
        svnTab: {
          tabLabel: "疲劳驾驶",
          tabName: "report_vehiclebreakrule_over4H_table", //将作为标识符来区分
          nType: 7, //根据重构前的请求，可以看到nType 为7
          ctrlId: "wztj_c4xsyx" //需要权限控制的情况下，需要制定id号
        }
        // egtTab: {
        //   tabLabel: "定位异常明细",
        //   tabName: "report_vehiclebreakrule_positionAbnormal_table", //将作为标识符来区分
        //   nType: 8 //根据重构前的请求，可以看到nType 为8
        // },
        // ninTab: {
        //   tabLabel: "禁行明细",
        //   tabName: "report_vehiclebreakrule_stop_table", //将作为标识符来区分
        //   nType: 9 //根据重构前的请求，可以看到nType 为9
        // },
        // tenTab: {
        //   tabLabel: "不良驾驶行为明细",
        //   tabName: "report_vehiclebreakrule_badness_table", //将作为标识符来区分
        //   nType: 10 //根据重构前的请求，可以看到nType 为10
        // },
        // eleTab: {
        //   tabLabel: "疑似屏蔽信号",
        //   tabName: "report_vehiclebreakrule_shield_table", //将作为标识符来区分
        //   nType: 11 //根据重构前的请求，可以看到nType 为11
        // }
      },
      tabCtntList: [], //基于目前标签页不能使用自定义指令v-hasAccess进行权限管理
    };
  },
  methods: {
    handleCurActiveIndex: function(msg) {
      this.activeNameIndex = msg;
    },
    handleClickSearch: function(msg) {
      //处理子组件触发的查询事件
      const self = this;
      self.curNameIndex = self.activeNameIndex;
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const getProviderCheckDetailDataParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.curNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.providerCheckSourceData = [];
      axiosRequest
        .axiosGet(
          this.getVehicleBreakRuleDataUrl,
          getProviderCheckDetailDataParams
        )
        .then(function(response) {
          const providerCheckRankTemp = response.data.DetailList;
          for (let vehicleBreakRuleItem of providerCheckRankTemp) {
            self.providerCheckSourceData.push(
              self.pushSourceData(vehicleBreakRuleItem, msg.activeName)
            );
          }
          self.tabCtntList[self.curNameIndex].TabCtnt =
            self.providerCheckSourceData;
          self.tabCtntList[self.curNameIndex].total =
            response.data.CountTotal;
          self.tabCtntList[self.curNameIndex].loading = false;
          self.tabCtntList[
            self.curNameIndex
          ].btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
          // 在某些特殊的Tab需要加上明细 - 平台连通率明细
          if (!isNullUndefEmpty(response.data.TotalList)) {
            self.tabCtntList[self.curNameIndex].TabCtnt.push(
              self.pushSourceData(response.data.TotalList, msg.activeName)
            );
          }
        })
        .catch(function(error) {
          self.$message({
            type: "warning",
            message: handleErrorMsg(error)
          });
          self.tabCtntList[self.curNameIndex].loading = false;
        });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(vehicleBreakRuleItem, activeName) {
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          return {
            /**
             * 多余的字段：
             * BreakRuleVRate
              IsIncludeLower
              Overspeed
              PositionBreak
              PositionBreakV
              PositionBreakVRate
              ZoneId
             */
            sybid: vehicleBreakRuleItem.sybid,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            InstalledCount: vehicleBreakRuleItem.InstalledCount,
            TotalRate: vehicleBreakRuleItem.TotalRate, //加入合计违章率字段
            OverspeedV: vehicleBreakRuleItem.OverspeedV,
            OverspeedVRate: vehicleBreakRuleItem.OverspeedVRate,
            BreakBanV: vehicleBreakRuleItem.BreakBanV,
            NightBan: vehicleBreakRuleItem.NightBan,
            BreakBanVRate: vehicleBreakRuleItem.BreakBanVRate,
            Overspeed_25: vehicleBreakRuleItem.Overspeed_25,
            Overspeed_5: vehicleBreakRuleItem.Overspeed_5,
            NightOverspeed_25: vehicleBreakRuleItem.NightOverspeed_25,
            NightOverspeed_5: vehicleBreakRuleItem.NightOverspeed_5,

            FatigueDriveV: vehicleBreakRuleItem.FatigueDriveV,
            FatigueDrive: vehicleBreakRuleItem.FatigueDrive,
            FatigueDriveVRate: vehicleBreakRuleItem.FatigueDriveVRate,

            PositionAbnormalV: vehicleBreakRuleItem.PositionAbnormalV,
            PositionAbnormal: vehicleBreakRuleItem.PositionAbnormal,
            PositionAbnormalVRate: vehicleBreakRuleItem.PositionAbnormalVRate,

            DriveProhibitV: vehicleBreakRuleItem.DriveProhibitV,
            DriveProhibit: vehicleBreakRuleItem.DriveProhibit,
            DriveProhibitVRate: vehicleBreakRuleItem.DriveProhibitVRate,

            DriveActionV: vehicleBreakRuleItem.DriveActionV,
            DriveAction: vehicleBreakRuleItem.DriveAction,
            DriveActionVRate: vehicleBreakRuleItem.DriveActionVRate,

            SignalShieldV: vehicleBreakRuleItem.SignalShieldV,
            SignalShield: vehicleBreakRuleItem.SignalShield,
            SignalShieldVRate: vehicleBreakRuleItem.SignalShieldVRate,
            BreakRuleV: vehicleBreakRuleItem.BreakRuleV,
            BreakRule: vehicleBreakRuleItem.BreakRule
          };
          break;
        case this.tabNameObj.secTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            PlatformName: vehicleBreakRuleItem.PlatformName,
            PlatformType: vehicleBreakRuleItem.PlatformType,
            InstalledCount: vehicleBreakRuleItem.InstalledCount,
            TotalRate: vehicleBreakRuleItem.TotalRate, //加入合计违章率字段

            OverspeedV: vehicleBreakRuleItem.OverspeedV,
            OverspeedVRate: vehicleBreakRuleItem.OverspeedVRate,

            BreakBanV: vehicleBreakRuleItem.BreakBanV,
            NightBan: vehicleBreakRuleItem.NightBan,
            BreakBanVRate: vehicleBreakRuleItem.BreakBanVRate,
            Overspeed_25: vehicleBreakRuleItem.Overspeed_25,
            Overspeed_5: vehicleBreakRuleItem.Overspeed_5,
            NightOverspeed_25: vehicleBreakRuleItem.NightOverspeed_25,
            NightOverspeed_5: vehicleBreakRuleItem.NightOverspeed_5,

            FatigueDriveV: vehicleBreakRuleItem.FatigueDriveV,
            FatigueDrive: vehicleBreakRuleItem.FatigueDrive,
            FatigueDriveVRate: vehicleBreakRuleItem.FatigueDriveVRate,

            PositionAbnormalV: vehicleBreakRuleItem.PositionAbnormalV,
            PositionAbnormal: vehicleBreakRuleItem.PositionAbnormal,
            PositionAbnormalVRate: vehicleBreakRuleItem.PositionAbnormalVRate,
            DriveProhibitV: vehicleBreakRuleItem.DriveProhibitV,
            DriveProhibit: vehicleBreakRuleItem.DriveProhibit,
            DriveProhibitVRate: vehicleBreakRuleItem.DriveProhibitVRate,

            DriveActionV: vehicleBreakRuleItem.DriveActionV,
            DriveAction: vehicleBreakRuleItem.DriveAction,
            DriveActionVRate: vehicleBreakRuleItem.DriveActionVRate,

            SignalShieldV: vehicleBreakRuleItem.SignalShieldV,
            SignalShield: vehicleBreakRuleItem.SignalShield,
            SignalShieldVRate: vehicleBreakRuleItem.SignalShieldVRate,
            BreakRuleV: vehicleBreakRuleItem.BreakRuleV,
            BreakRule: vehicleBreakRuleItem.BreakRule
          };
          break;
        case this.tabNameObj.thiTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            InstalledCount: vehicleBreakRuleItem.InstalledCount,
            TotalRate: vehicleBreakRuleItem.TotalRate, //加入合计违章率字段
            
            OverspeedV: vehicleBreakRuleItem.OverspeedV,
            OverspeedVRate: vehicleBreakRuleItem.OverspeedVRate,

            BreakBanV: vehicleBreakRuleItem.BreakBanV,
            NightBan: vehicleBreakRuleItem.NightBan,
            BreakBanVRate: vehicleBreakRuleItem.BreakBanVRate,
            Overspeed_25: vehicleBreakRuleItem.Overspeed_25,
            Overspeed_5: vehicleBreakRuleItem.Overspeed_5,
            NightOverspeed_25: vehicleBreakRuleItem.NightOverspeed_25,
            NightOverspeed_5: vehicleBreakRuleItem.NightOverspeed_5,
            FatigueDriveV: vehicleBreakRuleItem.FatigueDriveV,
            FatigueDrive: vehicleBreakRuleItem.FatigueDrive,
            FatigueDriveVRate: vehicleBreakRuleItem.FatigueDriveVRate,

            PositionAbnormalV: vehicleBreakRuleItem.PositionAbnormalV,
            PositionAbnormal: vehicleBreakRuleItem.PositionAbnormal,
            PositionAbnormalVRate: vehicleBreakRuleItem.PositionAbnormalVRate,
            DriveProhibitV: vehicleBreakRuleItem.DriveProhibitV,
            DriveProhibit: vehicleBreakRuleItem.DriveProhibit,
            DriveProhibitVRate: vehicleBreakRuleItem.DriveProhibitVRate,

            DriveActionV: vehicleBreakRuleItem.DriveActionV,
            DriveAction: vehicleBreakRuleItem.DriveAction,
            DriveActionVRate: vehicleBreakRuleItem.DriveActionVRate,

            SignalShieldV: vehicleBreakRuleItem.SignalShieldV,
            SignalShield: vehicleBreakRuleItem.SignalShield,
            SignalShieldVRate: vehicleBreakRuleItem.SignalShieldVRate,
            BreakRuleV: vehicleBreakRuleItem.BreakRuleV,
            BreakRule: vehicleBreakRuleItem.BreakRule
          };
          break;
        case this.tabNameObj.fouTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            LicensePlat: vehicleBreakRuleItem.LicensePlat,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            Overspeed_25: vehicleBreakRuleItem.Overspeed_25,
            Overspeed_5: vehicleBreakRuleItem.Overspeed_5,
            NightOverspeed_25: vehicleBreakRuleItem.NightOverspeed_25,
            NightOverspeed_5: vehicleBreakRuleItem.NightOverspeed_5,
            NightBan: vehicleBreakRuleItem.NightBan,
            FatigueDrive: vehicleBreakRuleItem.FatigueDrive,
            PositionAbnormal: vehicleBreakRuleItem.PositionAbnormal,
            DriveProhibit: vehicleBreakRuleItem.DriveProhibit,
            DriveAction: vehicleBreakRuleItem.DriveAction,
            SignalShield: vehicleBreakRuleItem.SignalShield,
            BreakRule: vehicleBreakRuleItem.BreakRule
          };
          break;
        case this.tabNameObj.fifTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            LicensePlat: vehicleBreakRuleItem.LicensePlat,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            BDate: vehicleBreakRuleItem.BDate,
            EDate: vehicleBreakRuleItem.EDate,
            ContinueTime: vehicleBreakRuleItem.ContinueTime,
            SpeedLimit: vehicleBreakRuleItem.SpeedLimit,
            Speed: vehicleBreakRuleItem.Speed,
            OverspeedRate: vehicleBreakRuleItem.OverspeedRate,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            CityName: vehicleBreakRuleItem.CityName,
            VehicleType: vehicleBreakRuleItem.VehicleType,
            BLocation: vehicleBreakRuleItem.BLocation,
            ELocation: vehicleBreakRuleItem.ELocation,
            IsHeihgtRoad: vehicleBreakRuleItem.IsHeihgtRoad,
            PlatformName: vehicleBreakRuleItem.PlatformName
          };
          break;
        case this.tabNameObj.sixTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            LicensePlat: vehicleBreakRuleItem.LicensePlat,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            BDate: vehicleBreakRuleItem.BDate,
            EDate: vehicleBreakRuleItem.EDate,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            CityName: vehicleBreakRuleItem.CityName,
            VehicleType: vehicleBreakRuleItem.VehicleType,
            ContinueTime: vehicleBreakRuleItem.ContinueTime,
            BLocation: vehicleBreakRuleItem.BLocation,
            ELocation: vehicleBreakRuleItem.ELocation,
            PlatformName: vehicleBreakRuleItem.PlatformName
          };
          break;
        case this.tabNameObj.svnTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            CityName: vehicleBreakRuleItem.CityName,
            LicensePlat: vehicleBreakRuleItem.LicensePlat,
            VehicleType: vehicleBreakRuleItem.VehicleType,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            BDate: vehicleBreakRuleItem.BDate,
            EDate: vehicleBreakRuleItem.EDate,
            ContinueTime: vehicleBreakRuleItem.ContinueTime,
            BLocation: vehicleBreakRuleItem.BLocation,
            ELocation: vehicleBreakRuleItem.ELocation,
            PlatformNameRe: vehicleBreakRuleItem.PlatformNameRe,
            PlatformName: vehicleBreakRuleItem.PlatformName
          };
          break;
        case this.tabNameObj.egtTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            LicensePlat: vehicleBreakRuleItem.LicensePlat,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            BDate: vehicleBreakRuleItem.BDate,
            EDate: vehicleBreakRuleItem.EDate,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            Distance: vehicleBreakRuleItem.Distance,
            CityName: vehicleBreakRuleItem.CityName,
            VehicleType: vehicleBreakRuleItem.VehicleType,
            ContinueTime: vehicleBreakRuleItem.ContinueTime,
            BLocation: vehicleBreakRuleItem.BLocation,
            ELocation: vehicleBreakRuleItem.ELocation,
            PlatformName: vehicleBreakRuleItem.PlatformName
          };
          break;
        case this.tabNameObj.ninTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            LicensePlat: vehicleBreakRuleItem.LicensePlat,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            BDate: vehicleBreakRuleItem.BDate,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            CityName: vehicleBreakRuleItem.CityName,
            VehicleType: vehicleBreakRuleItem.VehicleType,
            PlatformName: vehicleBreakRuleItem.PlatformName
          };
          break;
        case this.tabNameObj.tenTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            LicensePlat: vehicleBreakRuleItem.LicensePlat,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            BDate: vehicleBreakRuleItem.BDate,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            CityName: vehicleBreakRuleItem.CityName,
            VehicleType: vehicleBreakRuleItem.VehicleType,
            Action: vehicleBreakRuleItem.Action,
            PlatformName: vehicleBreakRuleItem.PlatformName,
            LicensePlat: vehicleBreakRuleItem.LicensePlat
          };
          break;
        case this.tabNameObj.eleTab.tabName:
          return {
            sybid: vehicleBreakRuleItem.sybid,
            LicensePlat: vehicleBreakRuleItem.LicensePlat,
            CompanyName: vehicleBreakRuleItem.CompanyName,
            BDate: vehicleBreakRuleItem.BDate,
            EDate: vehicleBreakRuleItem.EDate,
            ZoneName: vehicleBreakRuleItem.ZoneName,
            CityName: vehicleBreakRuleItem.CityName,
            VehicleType: vehicleBreakRuleItem.VehicleType,
            ContinueTime: vehicleBreakRuleItem.ContinueTime,

            Distance: vehicleBreakRuleItem.Distance,
            BLocation: vehicleBreakRuleItem.BLocation,
            ELocation: vehicleBreakRuleItem.ELocation,
            PlatformName: vehicleBreakRuleItem.PlatformName
          };
          break;
        default:
      }
    },
    // 注释人：向浩
    // 注释时间：2018-06-12
    // 注释原因：实现导出数据功能
    handleClickExpData: function(msg) {
      //处理子组件触发的导出数据事件
      const self = this;
      self.curNameIndex = self.activeNameIndex;
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const exportVehicleBreakRuleDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.curNameIndex].loading = true; //下载数据的时候，显示正在下载数据的logo
      axiosRequest
        .axiosGet(
          this.exportVehicleBreakRuleDataUrl,
          exportVehicleBreakRuleDataUrlParams
        )
        .then(function(response) {
          self.isDisabled = false;
          self.downloadServerFile(decodeURIComponent(response.data));
          // 下载完成后，隐藏正在下载的logo
          self.tabCtntList[self.curNameIndex].loading = false;
        })
        .catch(function(error) {
          self.$message({
            type: "warning",
            message: handleErrorMsg(error)
          });
          self.tabCtntList[self.curNameIndex].loading = false;
        });
    },
    formPageParams: function(msg, pageIndex, activeName, isSplitPage) {
      let nType = 0,
        beginDate = "",
        endDate = "",
        zoneId = "",
        platformId = "",
        carType = 0,
        breakRuleType = "",
        govStatus = 0,
        isIncludeLower = 1,
        funcVtype = "0,0,0,0||",
        platformType = "",
        unitId = "",
        vehicleId = "",
        dayOrNight = "",
        overSpeedRate = "",
        misconductType = "",
        pageSize = 10;

      for (let tabItem of this.tabCtntList) {
        if (tabItem.tabName === activeName) {
          this.activeNameIndex = tabItem.indexNumber; //权限控制下找到真实的下标
          nType = tabItem.nType;
        }
      }
      //统一为每一种类型赋值，而不需要单独判断
      for (let msgItem of msg) {
        switch (msgItem.labelId) {
          case reportLabelId.ZoneId:
            zoneId = msgItem.compId;
            break;
          case reportLabelId.PlatformId:
            platformId = msgItem.compId;
            break;
          case reportLabelId.fromTodatePicker:
            beginDate = msgItem.compVal[0]; //时间起
            endDate = msgItem.compVal[1]; //时间止
            break;
          case reportLabelId.CarType:
            for (let item of msgItem.compVal) {
              carType += item;
            }
            break;
          case reportLabelId.BreakRuleType:
            breakRuleType = msgItem.compVal;
            break;
          case reportLabelId.GovStatus:
            for (let item of msgItem.compVal) {
              govStatus += item;
            }
            break;
          case reportLabelId.PlatformType:
            platformType = msgItem.compVal;
            break;
          case reportLabelId.UnitId:
            unitId = msgItem.compId;
            break;
          case reportLabelId.VehicleId:
            vehicleId = msgItem.compId;
            break;
          case reportLabelId.DayOrNight:
            dayOrNight = msgItem.compVal;
            break;
          case reportLabelId.OverSpeedRate:
            overSpeedRate = msgItem.compVal;
            break;
          case reportLabelId.MisconductType:
            misconductType = msgItem.compVal;
            break;
          // case reportLabelId.InstallID:
          //   installID = msgItem.compVal;
          //   break;
          // case reportLabelId.UpLineFlag:
          //   upLineFlag = msgItem.compVal;
          //   break;
          // case reportLabelId.CheckUnitID:
          //   checkUnitID = msgItem.compVal;
          //   break;
          // case reportLabelId.CheckType:
          //   checkType = msgItem.compVal;
          //   break;
          // case reportLabelId.IsOnGuard:
          //   isOnGuard = msgItem.compVal;
          //   break;
          // case reportLabelId.TargetUserId:
          //   targetUserId = msgItem.compVal;
          //   break;
          // case reportLabelId.DeviceID:
          //   deviceID = msgItem.compVal;
          //   break;
          // case reportLabelId.GPSInstalled:
          //   gPSInstalled = msgItem.compVal;
          //   break;
          default:
        }
      }
      return {
        nType,
        beginDate,
        endDate,
        zoneId,
        platformId,
        carType,
        breakRuleType,
        govStatus,
        isIncludeLower,
        funcVtype,
        platformType,
        unitId,
        vehicleId,
        dayOrNight,
        overSpeedRate,
        misconductType,

        pageSize,
        pageIndex,
        isSplitPage
      };
    },
    // 处理子组件出发的换页数据加载
    handleCurrentChange: function(msg) {
      this.handleClickSearch(msg);
    },
    // 封装函数来通过HTML5的a标签来下载服务器生成的报表文件
    downloadServerFile: function(url) {
      // 使用HTML5的 <a download></a>来下载服务器文件
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    // 由于标签页不能直接使用ctrlId来进行权限管理，所以需要换种方式
    loadAccess: function() {
      const accessList = JSON.parse(storageOperation.getItem("accessList"));
      const tabCtntListFinalArr = [
        {
          tabLabel: this.tabNameObj.firTab.tabLabel,
          tabName: this.tabNameObj.firTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.firTab.ctrlId, //需要权限控制的情况下，需要制定id号
          indexNumber: "", //在权限控制下真正的下标
          nType: this.tabNameObj.firTab.nType,
          currentPage: 1, //当前页数
          total: 0, //总条数,
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: "wztj_dqhz_cx" //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: "wztj_dqhz_dc" //需要权限控制的情况下，需要制定id号
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId, // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
            },
            {
              searchType: "checkbox",
              itemTitle: "",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x0001,
                  label: "三类以上班线客车"
                },
                {
                  value: 0x1000,
                  label: "高速客运车"
                },
                {
                  value: 0x0004,
                  label: "旅游客车"
                },
                {
                  value: 0x0002,
                  label: "超长客运车"
                },
                {
                  value: 0x0080, // this value is customized by Perry,not securate
                  label: "危险品运输车"
                },
                {
                  value: 0x0010, // this value is customized by Perry,not securate
                  label: "重型货运车"
                },
                {
                  value: 0x0020, // this value is customized by Perry,not securate
                  label: "半挂牵引车"
                },
                {
                  value: 0x100000,
                  label: "包车客车"
                }
              ]
            },
            {
              searchType: "select",
              labelName: "违章类型",
              labelId: "BreakRuleType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 2,
                  label: "超速"
                },
                {
                  value: 3,
                  label: "疲劳驾驶"
                },
                {
                  value: 10,
                  label: "凌晨2-5点异动"
                },
                // 注释人：向浩
                // 注释时间：2018-08-13
                // 注释原因：根据河北第三方新版需求，没有下列的报表信息
                // {
                //   value: 4,
                //   label: "定位异常"
                // },
                // {
                //   value: 1,
                //   label: "禁行"
                // },
                // {
                //   value: 5,
                //   label: "不良驾驶行为"
                // },
                // {
                //   value: 6,
                //   label: "疑似屏蔽信号"
                // },
                // {
                //   value: 11,
                //   label: "半小时无数据上传"
                // }
              ]
            },
            {
              searchType: "checkbox",
              labelName: "车辆状态",
              labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x2,
                  label: "营运"
                },
                {
                  value: 0x4,
                  label: "停运"
                },
                {
                  value: 0x40,
                  label: "歇业"
                }
              ]
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "ZoneName",
              headerVal: "地区",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "InstalledCount",
              headerVal: "车辆入网总数",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "TotalRate",
              headerVal: "合计违章率",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              labelName: "超速（次）",
              subHeaders: [
                {
                  headerKey: "OverspeedV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "OverspeedVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  slabelName: "白天",
                  ssubHeaders: [
                    {
                      headerKey: "Overspeed_25",
                      headerVal: "高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 80, //限制报表每一列的宽度
                    },
                    {
                      headerKey: "Overspeed_5",
                      headerVal: "非高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 80, //限制报表每一列的宽度
                    }
                  ]
                },
                {
                  slabelName: "夜间(限速是日间的80%)",
                  ssubHeaders: [
                    {
                      headerKey: "NightOverspeed_25",
                      headerVal: "高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 120, //限制报表每一列的宽度
                    },
                    {
                      headerKey: "NightOverspeed_5",
                      headerVal: "非高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 120, //限制报表每一列的宽度
                    }
                  ]
                }
              ]
            },
            {
              labelName: "凌晨2-5点违规运行",
              subHeaders: [
                {
                  headerKey: "BreakBanV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "NightBan",
                  headerVal: "次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail,
                  width: 80, //限制报表每一列的宽度
                },
                {
                  headerKey: "BreakBanVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                }
              ]
            },
            {
              labelName: "疲劳驾驶",
              subHeaders: [
                {
                  headerKey: "FatigueDriveV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "FatigueDrive",
                  headerVal: "次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail,
                  width: 80, //限制报表每一列的宽度
                },
                {
                  headerKey: "FatigueDriveVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                }
              ]
            },
            // {
            //   labelName: "定位异常车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "PositionAbnormalV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "PositionAbnormal",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "PositionAbnormalVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "禁行车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "DriveProhibitV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "DriveProhibit",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "DriveProhibitVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "不良驾驶车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "DriveActionV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "DriveAction",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "DriveActionVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "屏蔽信号车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "SignalShieldV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "SignalShield",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "SignalShieldVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            {
              headerKey: "BreakRuleV",
              headerVal: "违章行为车辆数合计",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "BreakRule",
              headerVal: "违章行为次数合计",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail,
              width: 160, //限制报表每一列的宽度
            }
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   ZoneName: "王小虎",
            //   InstalledCount: "上海",
            //   OverspeedV: "普陀区",
            //   OverspeedVRate: "上海市普陀区金沙江路 1518 弄",
            //   BreakBanV: 200333
            // },
            // {
            //   sybid: "2016-05-03",
            //   ZoneName: "王小虎",
            //   InstalledCount: "上海",
            //   OverspeedV: "普陀区",
            //   OverspeedVRate: "上海市普陀区金沙江路 1518 弄",
            //   BreakBanV: 200333
            // },
          ]
        },
        {
          tabLabel: this.tabNameObj.secTab.tabLabel,
          tabName: this.tabNameObj.secTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.secTab.ctrlId, //需要权限控制的情况下，需要制定id号
          nType: this.tabNameObj.secTab.nType,
          indexNumber: "", //在权限控制下真正的下标
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: "wztj_jrpthz_cx" //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: "wztj_jrpthz_dc" //需要权限控制的情况下，需要制定id号
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
            },
            {
              searchType: "select",
              labelName: "平台类型",
              labelId: "PlatformType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 2,
                  label: "两客一危平台"
                },
                {
                  value: 3,
                  label: "货运平台"
                },
                {
                  value: -1,
                  label: "其他平台"
                }
              ]
            },
            {
              searchType: "checkbox",
              itemTitle: "",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x0001,
                  label: "三类以上班线客车"
                },
                {
                  value: 0x1000,
                  label: "高速客运车"
                },
                {
                  value: 0x0004,
                  label: "旅游客车"
                },
                {
                  value: 0x0002,
                  label: "超长客运车"
                },
                {
                  value: 0x0080, // this value is customized by Perry,not securate
                  label: "危险品运输车"
                },
                {
                  value: 0x0010, // this value is customized by Perry,not securate
                  label: "重型货运车"
                },
                {
                  value: 0x0020, // this value is customized by Perry,not securate
                  label: "半挂牵引车"
                },
                {
                  value: 0x100000,
                  label: "包车客车"
                }
              ]
            },
            {
              searchType: "select",
              labelName: "违章类型",
              labelId: "BreakRuleType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 2,
                  label: "超速"
                },
                {
                  value: 3,
                  label: "疲劳驾驶"
                },
                {
                  value: 10,
                  label: "凌晨2-5点异动"
                },
                // 注释人：向浩
                // 注释时间：2018-08-13
                // 注释原因：根据河北第三方新版需求，没有下列的报表信息
                // {
                //   value: 4,
                //   label: "定位异常"
                // },
                // {
                //   value: 1,
                //   label: "禁行"
                // },
                // {
                //   value: 5,
                //   label: "不良驾驶行为"
                // },
                // {
                //   value: 6,
                //   label: "疑似屏蔽信号"
                // },
                // {
                //   value: 11,
                //   label: "半小时无数据上传"
                // }
              ]
            },
            {
              searchType: "checkbox",
              labelName: "车辆状态",
              labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x2,
                  label: "营运"
                },
                {
                  value: 0x4,
                  label: "停运"
                },
                {
                  value: 0x40,
                  label: "歇业"
                }
              ]
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "PlatformName",
              headerVal: "接入平台",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail,
              width: 200, //限制报表每一列的宽度
            },
            {
              headerKey: "PlatformType",
              headerVal: "平台类型",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "InstalledCount",
              headerVal: "车辆安装总数",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "TotalRate",
              headerVal: "合计违章率",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              labelName: "超速（次）",
              subHeaders: [
                {
                  headerKey: "OverspeedV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 80, //限制报表每一列的宽度
                },
                {
                  headerKey: "OverspeedVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.text,
                  width: 80, //限制报表每一列的宽度
                },
                {
                  slabelName: "白天",
                  ssubHeaders: [
                    {
                      headerKey: "Overspeed_25",
                      headerVal: "高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 80, //限制报表每一列的宽度
                    },
                    {
                      headerKey: "Overspeed_5",
                      headerVal: "非高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 80, //限制报表每一列的宽度
                    }
                  ]
                },
                {
                  slabelName: "夜间(限速是日间的80%)",
                  ssubHeaders: [
                    {
                      headerKey: "NightOverspeed_25",
                      headerVal: "高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 120, //限制报表每一列的宽度
                    },
                    {
                      headerKey: "NightOverspeed_5",
                      headerVal: "非高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 120, //限制报表每一列的宽度
                    }
                  ]
                }
              ]
            },
            {
              labelName: "凌晨2-5点违规运行",
              subHeaders: [
                {
                  headerKey: "BreakBanV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "NightBan",
                  headerVal: "次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail,
                  width: 80, //限制报表每一列的宽度
                },
                {
                  headerKey: "BreakBanVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                }
              ]
            },
            {
              labelName: "疲劳驾驶",
              subHeaders: [
                {
                  headerKey: "FatigueDriveV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "FatigueDrive",
                  headerVal: "次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "FatigueDriveVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                }
              ]
            },
            // {
            //   labelName: "定位异常车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "PositionAbnormalV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "PositionAbnormal",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "PositionAbnormalVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "禁行车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "DriveProhibitV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "DriveProhibit",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "DriveProhibitVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "不良驾驶车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "DriveActionV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "DriveAction",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "DriveActionVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "屏蔽信号车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "SignalShieldV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "SignalShield",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "SignalShieldVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            {
              headerKey: "BreakRuleV",
              headerVal: "违章行为车辆数合计",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "BreakRule",
              headerVal: "违章行为次数合计",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail,
              width: 160, //限制报表每一列的宽度
            }
          ],
          TabCtnt: [
            // {
            //   LicensePlat: "2016-05-03",
            //   PlateColor: "王小虎",
            //   ZName: "上海",
            //   CityName: "普陀区",
            //   UnitName: "上海市普陀区金沙江路 1518 弄",
            //   VehicleType: 200333
            // },
            // {
            //   LicensePlat: "2016-05-03",
            //   PlateColor: "王小虎",
            //   ZName: "上海",
            //   CityName: "普陀区",
            //   UnitName: "上海市普陀区金沙江路 1518 弄",
            //   VehicleType: 200333
            // }
          ]
        },
        {
          tabLabel: this.tabNameObj.thiTab.tabLabel,
          tabName: this.tabNameObj.thiTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.thiTab.ctrlId, //需要权限控制的情况下，需要制定id号
          nType: this.tabNameObj.thiTab.nType,
          indexNumber: "", //在权限控制下真正的下标
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: "wztj_qyhz_cx" //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: "wztj_qyhz_dc" //需要权限控制的情况下，需要制定id号
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "运输企业",
              labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
            },
            {
              searchType: "checkbox",
              itemTitle: "",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x0001,
                  label: "三类以上班线客车"
                },
                {
                  value: 0x1000,
                  label: "高速客运车"
                },
                {
                  value: 0x0004,
                  label: "旅游客车"
                },
                {
                  value: 0x0002,
                  label: "超长客运车"
                },
                {
                  value: 0x0080, // this value is customized by Perry,not securate
                  label: "危险品运输车"
                },
                {
                  value: 0x0010, // this value is customized by Perry,not securate
                  label: "重型货运车"
                },
                {
                  value: 0x0020, // this value is customized by Perry,not securate
                  label: "半挂牵引车"
                },
                {
                  value: 0x100000,
                  label: "包车客车"
                }
              ]
            },
            {
              searchType: "select",
              labelName: "违章类型",
              labelId: "BreakRuleType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 2,
                  label: "超速"
                },
                {
                  value: 3,
                  label: "疲劳驾驶"
                },
                {
                  value: 10,
                  label: "凌晨2-5点异动"
                },
                // 注释人：向浩
                // 注释时间：2018-08-13
                // 注释原因：根据河北第三方新版需求，没有下列的报表信息
                // {
                //   value: 4,
                //   label: "定位异常"
                // },
                // {
                //   value: 1,
                //   label: "禁行"
                // },
                // {
                //   value: 5,
                //   label: "不良驾驶行为"
                // },
                // {
                //   value: 6,
                //   label: "疑似屏蔽信号"
                // },
                // {
                //   value: 11,
                //   label: "半小时无数据上传"
                // }
              ]
            },
            {
              searchType: "checkbox",
              labelName: "车辆状态",
              labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x2,
                  label: "营运"
                },
                {
                  value: 0x4,
                  label: "停运"
                },
                {
                  value: 0x40,
                  label: "歇业"
                }
              ]
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "ZoneName",
              headerVal: "所属企业地区",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "CompanyName",
              headerVal: "所属企业",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 240, //限制报表每一列的宽度
            },
            {
              headerKey: "InstalledCount",
              headerVal: "车辆入网总数",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "TotalRate",
              headerVal: "合计违章率",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              labelName: "超速（次）",
              subHeaders: [
                {
                  headerKey: "OverspeedV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "OverspeedVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  slabelName: "白天",
                  ssubHeaders: [
                    {
                      headerKey: "Overspeed_25",
                      headerVal: "高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 80, //限制报表每一列的宽度
                    },
                    {
                      headerKey: "Overspeed_5",
                      headerVal: "非高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 80, //限制报表每一列的宽度
                    }
                  ]
                },
                {
                  slabelName: "夜间(限速是日间的80%)",
                  ssubHeaders: [
                    {
                      headerKey: "NightOverspeed_25",
                      headerVal: "高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 120, //限制报表每一列的宽度
                    },
                    {
                      headerKey: "NightOverspeed_5",
                      headerVal: "非高速",
                      columnType: this.columnType.router_link,
                      router_link: commonConfig.routerConst.ProviderCheckDetail,
                      width: 120, //限制报表每一列的宽度
                    }
                  ]
                }
              ]
            },
            {
              labelName: "凌晨2-5点违规运行",
              subHeaders: [
                {
                  headerKey: "BreakBanV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "NightBan",
                  headerVal: "次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail,
                  width: 80, //限制报表每一列的宽度
                },
                {
                  headerKey: "BreakBanVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                }
              ]
            },
            {
              labelName: "疲劳驾驶",
              subHeaders: [
                {
                  headerKey: "FatigueDriveV",
                  headerVal: "违章车辆数",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                },
                {
                  headerKey: "FatigueDrive",
                  headerVal: "次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail,
                  width: 80, //限制报表每一列的宽度
                },
                {
                  headerKey: "FatigueDriveVRate",
                  headerVal: "违章车辆比例",
                  columnType: this.columnType.text,
                  width: 120, //限制报表每一列的宽度
                }
              ]
            },
            // {
            //   labelName: "定位异常车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "PositionAbnormalV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "PositionAbnormal",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "PositionAbnormalVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "禁行车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "DriveProhibitV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "DriveProhibit",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "DriveProhibitVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "不良驾驶车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "DriveActionV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "DriveAction",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "DriveActionVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "屏蔽信号车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "SignalShieldV",
            //       headerVal: "违章车辆数",
            //       columnType: this.columnType.text
            //     },
            //     {
            //       headerKey: "SignalShield",
            //       headerVal: "次数",
            //       columnType: this.columnType.router_link,
            //       router_link: commonConfig.routerConst.ProviderCheckDetail
            //     },
            //     {
            //       headerKey: "SignalShieldVRate",
            //       headerVal: "违章车辆比例",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            {
              headerKey: "BreakRuleV",
              headerVal: "违章行为车辆数合计",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "BreakRule",
              headerVal: "违章行为次数合计",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail,
              width: 160, //限制报表每一列的宽度
            }
          ],
          TabCtnt: [
            // {
            //   Name: "2016-05-03",
            //   OnlineTime: "王小虎",
            //   TotalTime: "上海",
            //   OnlineRate: "普陀区"
            // },
            // {
            //   Name: "2016-05-03",
            //   OnlineTime: "王小虎",
            //   TotalTime: "上海",
            //   OnlineRate: "普陀区"
            // }
          ]
        },
        {
          tabLabel: this.tabNameObj.fouTab.tabLabel,
          tabName: this.tabNameObj.fouTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.fouTab.ctrlId, //需要权限控制的情况下，需要制定id号
          nType: this.tabNameObj.fouTab.nType,
          indexNumber: "", //在权限控制下真正的下标
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: "wztj_clhz_cx" //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: "wztj_clhz_dc" //需要权限控制的情况下，需要制定id号
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "运输企业",
              labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "车牌号",
              labelId: "VehicleId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
            },
            {
              searchType: "checkbox",
              itemTitle: "",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x0001,
                  label: "三类以上班线客车"
                },
                {
                  value: 0x1000,
                  label: "高速客运车"
                },
                {
                  value: 0x0004,
                  label: "旅游客车"
                },
                {
                  value: 0x0002,
                  label: "超长客运车"
                },
                {
                  value: 0x0080, // this value is customized by Perry,not securate
                  label: "危险品运输车"
                },
                {
                  value: 0x0010, // this value is customized by Perry,not securate
                  label: "重型货运车"
                },
                {
                  value: 0x0020, // this value is customized by Perry,not securate
                  label: "半挂牵引车"
                },
                {
                  value: 0x100000,
                  label: "包车客车"
                }
              ]
            },
            {
              searchType: "select",
              labelName: "违章类型",
              labelId: "BreakRuleType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 2,
                  label: "超速"
                },
                {
                  value: 3,
                  label: "疲劳驾驶"
                },
                {
                  value: 10,
                  label: "凌晨2-5点异动"
                },
                // 注释人：向浩
                // 注释时间：2018-08-13
                // 注释原因：根据河北第三方新版需求，没有下列的报表信息
                // {
                //   value: 4,
                //   label: "定位异常"
                // },
                // {
                //   value: 1,
                //   label: "禁行"
                // },
                // {
                //   value: 5,
                //   label: "不良驾驶行为"
                // },
                // {
                //   value: 6,
                //   label: "疑似屏蔽信号"
                // },
                // {
                //   value: 11,
                //   label: "半小时无数据上传"
                // }
              ]
            },
            {
              searchType: "checkbox",
              labelName: "车辆状态",
              labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x2,
                  label: "营运"
                },
                {
                  value: 0x4,
                  label: "停运"
                },
                {
                  value: 0x40,
                  label: "歇业"
                }
              ]
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "ZoneName",
              headerVal: "所属企业地区",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "LicensePlat",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "CompanyName",
              headerVal: "运输企业",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 240, //限制报表每一列的宽度
            },
            {
              labelName: "超速（次）",
              subHeaders: [
                {
                  slabelName: "白天",
                  ssubHeaders: [
                    {
                      headerKey: "Overspeed_25",
                      headerVal: "高速",
                      columnType: this.columnType.text,
                      width: 120, //限制报表每一列的宽度
                    },
                    {
                      headerKey: "Overspeed_5",
                      headerVal: "非高速",
                      columnType: this.columnType.text,
                      width: 120, //限制报表每一列的宽度
                    }
                  ]
                },
                {
                  slabelName: "夜间(限速是日间的80%)",
                  ssubHeaders: [
                    {
                      headerKey: "NightOverspeed_25",
                      headerVal: "高速",
                      columnType: this.columnType.text,
                      width: 120, //限制报表每一列的宽度
                    },
                    {
                      headerKey: "NightOverspeed_5",
                      headerVal: "非高速",
                      columnType: this.columnType.text,
                      width: 120, //限制报表每一列的宽度
                    }
                  ]
                }
              ]
            },
            {
              labelName: "凌晨2-5点违规运行",
              subHeaders: [
                {
                  headerKey: "NightBan",
                  headerVal: "次数",
                  columnType: this.columnType.text,
                  width: 160, //限制报表每一列的宽度
                }
              ]
            },
            {
              labelName: "疲劳驾驶",
              subHeaders: [
                {
                  headerKey: "FatigueDrive",
                  headerVal: "次数",
                  columnType: this.columnType.text,
                  width: 160, //限制报表每一列的宽度
                }
              ]
            },
            // {
            //   labelName: "定位异常车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "PositionAbnormal",
            //       headerVal: "次数",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "禁行车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "DriveProhibit",
            //       headerVal: "次数",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "不良驾驶车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "DriveAction",
            //       headerVal: "次数",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            // {
            //   labelName: "屏蔽信号车辆",
            //   subHeaders: [
            //     {
            //       headerKey: "SignalShield",
            //       headerVal: "次数",
            //       columnType: this.columnType.text
            //     }
            //   ]
            // },
            {
              headerKey: "BreakRule",
              headerVal: "违章行为次数合计",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            }
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   ZoneName: "王小虎",
            //   LicensePlat: "上海",
            //   CompanyName: "普陀区",
            //   OverspeedV: "上海市普陀区金沙江路 1518 弄",
            //   OverspeedVRate: 200333
            // },
            // {
            //   sybid: "2016-05-03",
            //   ZoneName: "王小虎",
            //   LicensePlat: "上海",
            //   CompanyName: "普陀区",
            //   OverspeedV: "上海市普陀区金沙江路 1518 弄",
            //   OverspeedVRate: 200333,
            //   columnType: this.columnType.text
            // }
          ]
        },
        {
          tabLabel: this.tabNameObj.fifTab.tabLabel,
          tabName: this.tabNameObj.fifTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.fifTab.ctrlId, //需要权限控制的情况下，需要制定id号
          nType: this.tabNameObj.fifTab.nType,
          indexNumber: "", //在权限控制下真正的下标
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: "wztj_cs_cx" //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: "wztj_cs_dc" //需要权限控制的情况下，需要制定id号
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "运输企业",
              labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "车牌号",
              labelId: "VehicleId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: ""
            },
            {
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
            },
            {
              searchType: "select",
              labelName: "报警时段",
              labelId: "DayOrNight", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 1,
                  label: "白天"
                },
                {
                  value: 2,
                  label: "夜间"
                }
              ]
            },
            {
              searchType: "select",
              labelName: "超速率:",
              labelId: "OverSpeedRate", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 25,
                  label: "高速≥20%"
                },
                {
                  value: 50,
                  label: "非高速≥50%"
                }
              ]
            },
            {
              searchType: "checkbox",
              itemTitle: "",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x0001,
                  label: "三类以上班线客车"
                },
                {
                  value: 0x1000,
                  label: "高速客运车"
                },
                {
                  value: 0x0004,
                  label: "旅游客车"
                },
                {
                  value: 0x0002,
                  label: "超长客运车"
                },
                {
                  value: 0x0080, // this value is customized by Perry,not securate
                  label: "危险品运输车"
                },
                {
                  value: 0x0010, // this value is customized by Perry,not securate
                  label: "重型货运车"
                },
                {
                  value: 0x0020, // this value is customized by Perry,not securate
                  label: "半挂牵引车"
                },
                {
                  value: 0x100000,
                  label: "包车客车"
                }
              ]
            },
            {
              searchType: "checkbox",
              labelName: "车辆状态",
              labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x2,
                  label: "营运"
                },
                {
                  value: 0x4,
                  label: "停运"
                },
                {
                  value: 0x40,
                  label: "歇业"
                }
              ]
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "LicensePlat",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "CompanyName",
              headerVal: "所属道路运输企业",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 200, //限制报表每一列的宽度
            },
            {
              headerKey: "BDate",
              headerVal: "超速开始时间",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "EDate",
              headerVal: "超速结束时间",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "ContinueTime",
              headerVal: "持续时长",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "SpeedLimit",
              headerVal: "限速（km/h）",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "Speed",
              headerVal: "最高速度（km/h）",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "OverspeedRate",
              headerVal: "超速率（%）",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "ZoneName",
              headerVal: "所属企业地区",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "CityName",
              headerVal: "企业所属市(州)",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "VehicleType",
              headerVal: "车辆类型",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "BLocation",
              headerVal: "开始位置",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 240, //限制报表每一列的宽度
            },
            {
              headerKey: "ELocation",
              headerVal: "结束位置",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 240, //限制报表每一列的宽度
            },
            {
              headerKey: "IsHeihgtRoad",
              headerVal: "是否高速",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "PlatformName",
              headerVal: "接入平台",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 200, //限制报表每一列的宽度
            }
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   LicensePlat: "王小虎",
            //   CompanyName: "上海",
            //   BDate: "普陀区",
            //   EDate: "上海市普陀区金沙江路 1518 弄",
            //   ContinueTime: 200333
            // },
            // {
            //   sybid: "2016-05-03",
            //   LicensePlat: "王小虎",
            //   CompanyName: "上海",
            //   BDate: "普陀区",
            //   EDate: "上海市普陀区金沙江路 1518 弄",
            //   ContinueTime: 200333
            // }
          ]
        },
        {
          tabLabel: this.tabNameObj.sixTab.tabLabel,
          tabName: this.tabNameObj.sixTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.sixTab.ctrlId, //需要权限控制的情况下，需要制定id号
          nType: this.tabNameObj.sixTab.nType,
          indexNumber: "", //在权限控制下真正的下标
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: "wztj_25yx_cx" //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: "wztj_25yx_dc" //需要权限控制的情况下，需要制定id号
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "运输企业",
              labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "车牌号",
              labelId: "VehicleId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: ""
            },
            {
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
              // compVal: ""
            },
            {
              searchType: "checkbox",
              itemTitle: "",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x0001,
                  label: "三类以上班线客车"
                },
                {
                  value: 0x1000,
                  label: "高速客运车"
                },
                {
                  value: 0x0004,
                  label: "旅游客车"
                },
                {
                  value: 0x0002,
                  label: "超长客运车"
                },
                {
                  value: 0x0080, // this value is customized by Perry,not securate
                  label: "危险品运输车"
                },
                {
                  value: 0x0010, // this value is customized by Perry,not securate
                  label: "重型货运车"
                },
                {
                  value: 0x0020, // this value is customized by Perry,not securate
                  label: "半挂牵引车"
                },
                {
                  value: 0x100000,
                  label: "包车客车"
                }
              ]
            },
            {
              searchType: "checkbox",
              labelName: "车辆状态",
              labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x2,
                  label: "营运"
                },
                {
                  value: 0x4,
                  label: "停运"
                },
                {
                  value: 0x40,
                  label: "歇业"
                }
              ]
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "LicensePlat",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "CompanyName",
              headerVal: "所属道路运输企业",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 200, //限制报表每一列的宽度
            },
            {
              headerKey: "BDate",
              headerVal: "开始时间",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "EDate",
              headerVal: "结束时间",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "ZoneName",
              headerVal: "所属企业地区",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "CityName",
              headerVal: "企业所属市(州)",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "VehicleType",
              headerVal: "车辆类型",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "ContinueTime",
              headerVal: "持续时长",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "BLocation",
              headerVal: "开始位置",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 240, //限制报表每一列的宽度
            },
            {
              headerKey: "ELocation",
              headerVal: "结束位置",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 240, //限制报表每一列的宽度
            },
            {
              headerKey: "PlatformName",
              headerVal: "接入平台",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 200, //限制报表每一列的宽度
            }
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   LicensePlat: "王小虎",
            //   CompanyName: "上海",
            //   BDate: "普陀区",
            //   EDate: "上海市普陀区金沙江路 1518 弄",
            //   ZoneName: 200333
            // },
            // {
            //   sybid: "2016-05-03",
            //   LicensePlat: "王小虎",
            //   CompanyName: "上海",
            //   BDate: "普陀区",
            //   EDate: "上海市普陀区金沙江路 1518 弄",
            //   ZoneName: 200333
            // },
            // {
            //   sybid: "2016-05-03",
            //   LicensePlat: "王小虎",
            //   CompanyName: "上海",
            //   BDate: "普陀区",
            //   EDate: "上海市普陀区金沙江路 1518 弄",
            //   ZoneName: 200333
            // }
          ]
        },
        {
          tabLabel: this.tabNameObj.svnTab.tabLabel,
          tabName: this.tabNameObj.svnTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.svnTab.ctrlId, //需要权限控制的情况下，需要制定id号
          nType: this.tabNameObj.svnTab.nType,
          indexNumber: "", //在权限控制下真正的下标
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: "wztj_c4xsyx_cx" //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: "wztj_c4xsyx_dc" //需要权限控制的情况下，需要制定id号
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "运输企业",
              labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: "" // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "车牌号",
              labelId: "VehicleId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: ""
            },
            {
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
            },
            {
              searchType: "checkbox",
              itemTitle: "",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x0001,
                  label: "三类以上班线客车"
                },
                {
                  value: 0x1000,
                  label: "高速客运车"
                },
                {
                  value: 0x0004,
                  label: "旅游客车"
                },
                {
                  value: 0x0002,
                  label: "超长客运车"
                },
                {
                  value: 0x0080, // this value is customized by Perry,not securate
                  label: "危险品运输车"
                },
                {
                  value: 0x0010, // this value is customized by Perry,not securate
                  label: "重型货运车"
                },
                {
                  value: 0x0020, // this value is customized by Perry,not securate
                  label: "半挂牵引车"
                },
                {
                  value: 0x100000,
                  label: "包车客车"
                }
              ]
            },
            {
              searchType: "checkbox",
              labelName: "车辆状态",
              labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              options: [
                {
                  value: 0x2,
                  label: "营运"
                },
                {
                  value: 0x4,
                  label: "停运"
                },
                {
                  value: 0x40,
                  label: "歇业"
                }
              ]
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 80, //限制报表每一列的宽度
            },
            {
              headerKey: "ZoneName",
              headerVal: "所属企业地区",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "CityName",
              headerVal: "企业所属市(州)",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "LicensePlat",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "VehicleType",
              headerVal: "车辆类型",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "CompanyName",
              headerVal: "所属道路运输企业",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 280, //限制报表每一列的宽度
            },
            {
              headerKey: "BDate",
              headerVal: "疲劳驾驶时间",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 200, //限制报表每一列的宽度
            },
            {
              headerKey: "EDate",
              headerVal: "结束时间",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 160, //限制报表每一列的宽度
            },
            {
              headerKey: "ContinueTime",
              headerVal: "持续时长",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 120, //限制报表每一列的宽度
            },
            {
              headerKey: "BLocation",
              headerVal: "开始位置",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 240, //限制报表每一列的宽度
            },
            {
              headerKey: "ELocation",
              headerVal: "结束位置",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 240, //限制报表每一列的宽度
            },
            {
              headerKey: "PlatformNameRe",
              headerVal: "违章时接入平台",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 200, //限制报表每一列的宽度
            },
            {
              headerKey: "PlatformName",
              headerVal: "接入平台",
              subHeaders: [],
              columnType: this.columnType.text,
              width: 200, //限制报表每一列的宽度
            }
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   ZoneName: "王小虎",
            //   CityName: "上海",
            //   LicensePlat: "普陀区",
            //   VehicleType: "上海市普陀区金沙江路 1518 弄",
            //   CompanyName: 200333
            // },
            // {
            //   sybid: "2016-05-03",
            //   ZoneName: "王小虎",
            //   CityName: "上海",
            //   LicensePlat: "普陀区",
            //   VehicleType: "上海市普陀区金沙江路 1518 弄",
            //   CompanyName: 200333
            // },
            // {
            //   sybid: "2016-05-03",
            //   ZoneName: "王小虎",
            //   CityName: "上海",
            //   LicensePlat: "普陀区",
            //   VehicleType: "上海市普陀区金沙江路 1518 弄",
            //   CompanyName: 200333
            // },
          ]
        }
        // {
        //   tabLabel: this.tabNameObj.egtTab.tabLabel,
        //   tabName: this.tabNameObj.egtTab.tabName, //将作为标识符来区分
        //   currentPage: 1, //当前页数
        //   total: 0, //总条数
        //   loading: false,
        //   btnEvents: [
        //     {
        //       iconName: "el-icon-search",
        //       btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
        //       btnName: "查询",
        //       isDisabled: false //控制查询数据按钮初始状态为enabled
        //     },
        //     {
        //       iconName: "el-icon-download",
        //       btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
        //       btnName: "导出数据",
        //       isDisabled: true //控制导出数据按钮初始状态为disabled
        //     }
        //   ],
        //   searchCreteria: [
        //     {
        //       searchType: "input",
        //       labelName: "所属地区:",
        //       labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: provinceVal.provinceName,
        //       compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "接入平台:",
        //       labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "运输企业:",
        //       labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "车牌号:",
        //       labelId: "VehicleId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "fromTodatePicker",
        //       labelName: "时间起 - 时间至",
        //       labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [(new Date().format("yyyyMMdd")-1).toString(), (new Date().format("yyyyMMdd")-1).toString()]
        //     },
        //     {
        //       searchType: "checkbox",
        //       itemTitle: "",
        //       labelName: "车辆类型：",
        //       labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [],
        //       options: [
        //         {
        //           value: 0x0001,
        //           label: "三类以上班线客车"
        //         },
        //         {
        //           value: 0x1000,
        //           label: "高速客运车"
        //         },
        //         {
        //           value: 0x0004,
        //           label: "旅游客车"
        //         },
        //         {
        //           value: 0x0002,
        //           label: "超长客运车"
        //         },
        //         {
        //           value: 0x0080, // this value is customized by Perry,not securate
        //           label: "危险品运输车"
        //         },
        //         {
        //           value: 0x0010, // this value is customized by Perry,not securate
        //           label: "重型货运车"
        //         },
        //         {
        //           value: 0x0020, // this value is customized by Perry,not securate
        //           label: "半挂牵引车"
        //         }
        //       ]
        //     },
        //     {
        //       searchType: "checkbox",
        //       labelName: "车辆状态:",
        //       labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [],
        //       options: [
        //         {
        //           value: 0x2,
        //           label: "营运"
        //         },
        //         {
        //           value: 0x4,
        //           label: "停运"
        //         },
        //         {
        //           value: 0x40,
        //           label: "歇业"
        //         }
        //       ]
        //     }
        //   ],
        //   tabHeader: [
        //     {
        //       headerKey: "sybid",
        //       headerVal: "序号",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "LicensePlat",
        //       headerVal: "车牌号",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "CompanyName",
        //       headerVal: "所属道路运输企业",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "BDate",
        //       headerVal: "开始时间",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "EDate",
        //       headerVal: "结束时间",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "ZoneName",
        //       headerVal: "所属企业地区",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "Distance",
        //       headerVal: "异常距离",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "CityName",
        //       headerVal: "企业所属市(州)",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "VehicleType",
        //       headerVal: "车辆类型",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "ContinueTime",
        //       headerVal: "持续时长",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "BLocation",
        //       headerVal: "开始位置",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "ELocation",
        //       headerVal: "结束位置",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "PlatformName",
        //       headerVal: "接入平台",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     }
        //   ],
        //   TabCtnt: [
        //     // {
        //     //   sybid: "2016-05-03",
        //     //   LicensePlat: "王小虎",
        //     //   CompanyName: "上海",
        //     //   BDate: "普陀区",
        //     //   EDate: "上海市普陀区金沙江路 1518 弄",
        //     //   ZoneName: 200333
        //     // }
        //   ]
        // },
        // {
        //   tabLabel: this.tabNameObj.ninTab.tabLabel,
        //   tabName: this.tabNameObj.ninTab.tabName, //将作为标识符来区分
        //   currentPage: 1, //当前页数
        //   total: 0, //总条数
        //   loading: false,
        //   btnEvents: [
        //     {
        //       iconName: "el-icon-search",
        //       btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
        //       btnName: "查询",
        //       isDisabled: false //控制查询数据按钮初始状态为enabled
        //     },
        //     {
        //       iconName: "el-icon-download",
        //       btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
        //       btnName: "导出数据",
        //       isDisabled: true //控制导出数据按钮初始状态为disabled
        //     }
        //   ],
        //   searchCreteria: [
        //     {
        //       searchType: "input",
        //       labelName: "所属地区:",
        //       labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: provinceVal.provinceName,
        //       compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "接入平台:",
        //       labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "运输企业:",
        //       labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "车牌号:",
        //       labelId: "VehicleId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "fromTodatePicker",
        //       labelName: "时间起 - 时间至",
        //       labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [(new Date().format("yyyyMMdd")-1).toString(), (new Date().format("yyyyMMdd")-1).toString()]
        //     },
        //     {
        //       searchType: "checkbox",
        //       itemTitle: "",
        //       labelName: "车辆类型：",
        //       labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [],
        //       options: [
        //         {
        //           value: 0x0001,
        //           label: "三类以上班线客车"
        //         },
        //         {
        //           value: 0x1000,
        //           label: "高速客运车"
        //         },
        //         {
        //           value: 0x0004,
        //           label: "旅游客车"
        //         },
        //         {
        //           value: 0x0002,
        //           label: "超长客运车"
        //         },
        //         {
        //           value: 0x0080, // this value is customized by Perry,not securate
        //           label: "危险品运输车"
        //         },
        //         {
        //           value: 0x0010, // this value is customized by Perry,not securate
        //           label: "重型货运车"
        //         },
        //         {
        //           value: 0x0020, // this value is customized by Perry,not securate
        //           label: "半挂牵引车"
        //         }
        //       ]
        //     },
        //     {
        //       searchType: "checkbox",
        //       labelName: "车辆状态:",
        //       labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [],
        //       options: [
        //         {
        //           value: 0x2,
        //           label: "营运"
        //         },
        //         {
        //           value: 0x4,
        //           label: "停运"
        //         },
        //         {
        //           value: 0x40,
        //           label: "歇业"
        //         }
        //       ]
        //     }
        //   ],
        //   tabHeader: [
        //     {
        //       headerKey: "sybid",
        //       headerVal: "序号",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "LicensePlat",
        //       headerVal: "车牌号",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "CompanyName",
        //       headerVal: "所属道路运输企业",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "BDate",
        //       headerVal: "违章时间",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "ZoneName",
        //       headerVal: "所属企业地区",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "CityName",
        //       headerVal: "企业所属市(州)",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "VehicleType",
        //       headerVal: "车辆类型",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "PlatformName",
        //       headerVal: "接入平台",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     }
        //   ],
        //   TabCtnt: [
        //     // {
        //     //   sybid: "2016-05-03",
        //     //   LicensePlat: "王小虎",
        //     //   CompanyName: "上海",
        //     //   BDate: "普陀区",
        //     //   ZoneName: "上海市普陀区金沙江路 1518 弄",
        //     //   CityName: 200333
        //     // }
        //   ]
        // },
        // {
        //   tabLabel: this.tabNameObj.tenTab.tabLabel,
        //   tabName: this.tabNameObj.tenTab.tabName, //将作为标识符来区分
        //   currentPage: 1, //当前页数
        //   total: 0, //总条数
        //   loading: false,
        //   btnEvents: [
        //     {
        //       iconName: "el-icon-search",
        //       btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
        //       btnName: "查询",
        //       isDisabled: false //控制查询数据按钮初始状态为enabled
        //     },
        //     {
        //       iconName: "el-icon-download",
        //       btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
        //       btnName: "导出数据",
        //       isDisabled: true //控制导出数据按钮初始状态为disabled
        //     }
        //   ],
        //   searchCreteria: [
        //     {
        //       searchType: "input",
        //       labelName: "所属地区:",
        //       labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: provinceVal.provinceName,
        //       compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "接入平台:",
        //       labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "运输企业:",
        //       labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "车牌号:",
        //       labelId: "VehicleId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "fromTodatePicker",
        //       labelName: "时间起 - 时间至",
        //       labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [(new Date().format("yyyyMMdd")-1).toString(), (new Date().format("yyyyMMdd")-1).toString()]
        //       // compVal: ""
        //     },
        //     {
        //       searchType: "checkbox",
        //       itemTitle: "",
        //       labelName: "车辆类型：",
        //       labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [],
        //       options: [
        //         {
        //           value: 0x0001,
        //           label: "三类以上班线客车"
        //         },
        //         {
        //           value: 0x1000,
        //           label: "高速客运车"
        //         },
        //         {
        //           value: 0x0004,
        //           label: "旅游客车"
        //         },
        //         {
        //           value: 0x0002,
        //           label: "超长客运车"
        //         },
        //         {
        //           value: 0x0080, // this value is customized by Perry,not securate
        //           label: "危险品运输车"
        //         },
        //         {
        //           value: 0x0010, // this value is customized by Perry,not securate
        //           label: "重型货运车"
        //         },
        //         {
        //           value: 0x0020, // this value is customized by Perry,not securate
        //           label: "半挂牵引车"
        //         }
        //       ]
        //     },
        //     {
        //       searchType: "select",
        //       labelName: "不良行为类型:",
        //       labelId: "MisconductType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: 0,
        //       options: [
        //         {
        //           value: 0,
        //           label: "全部"
        //         },
        //         {
        //           value: 1,
        //           label: "抽烟"
        //         },
        //         {
        //           value: 2,
        //           label: "打电话"
        //         },
        //         {
        //           value: 3,
        //           label: "吃东西"
        //         }
        //       ]
        //     },
        //     {
        //       searchType: "checkbox",
        //       labelName: "车辆状态:",
        //       labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [],
        //       options: [
        //         {
        //           value: 0x2,
        //           label: "营运"
        //         },
        //         {
        //           value: 0x4,
        //           label: "停运"
        //         },
        //         {
        //           value: 0x40,
        //           label: "歇业"
        //         }
        //       ]
        //     }
        //   ],
        //   tabHeader: [
        //     {
        //       headerKey: "sybid",
        //       headerVal: "序号",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "LicensePlat",
        //       headerVal: "车牌号",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "CompanyName",
        //       headerVal: "所属道路运输企业",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "BDate",
        //       headerVal: "违章时间",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "ZoneName",
        //       headerVal: "所属企业地区",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "CityName",
        //       headerVal: "企业所属市(州)",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "VehicleType",
        //       headerVal: "车辆类型",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "Action",
        //       headerVal: "不良行为驾驶",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "PlatformName",
        //       headerVal: "接入平台",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "LicensePlat",
        //       headerVal: "播放视频",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     }
        //   ],
        //   TabCtnt: [
        //     // {
        //     //   sybid: "2016-05-03",
        //     //   LicensePlat: "王小虎",
        //     //   CompanyName: "上海",
        //     //   BDate: "普陀区",
        //     //   ZoneName: "上海市普陀区金沙江路 1518 弄",
        //     //   CityName: 200333
        //     // }
        //   ]
        // },
        // {
        //   tabLabel: this.tabNameObj.eleTab.tabLabel,
        //   tabName: this.tabNameObj.eleTab.tabName, //将作为标识符来区分
        //   currentPage: 1, //当前页数
        //   total: 0, //总条数
        //   loading: false,
        //   btnEvents: [
        //     {
        //       iconName: "el-icon-search",
        //       btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
        //       btnName: "查询",
        //       isDisabled: false //控制查询数据按钮初始状态为enabled
        //     },
        //     {
        //       iconName: "el-icon-download",
        //       btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
        //       btnName: "导出数据",
        //       isDisabled: true //控制导出数据按钮初始状态为disabled
        //     }
        //   ],
        //   searchCreteria: [
        //     {
        //       searchType: "input",
        //       labelName: "所属地区:",
        //       labelId: "ZoneId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: provinceVal.provinceName,
        //       compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "接入平台:",
        //       labelId: "PlatformId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "运输企业:",
        //       labelId: "UnitId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "input",
        //       labelName: "车牌号:",
        //       labelId: "VehicleId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: "",
        //       compId: "" // 在需要使用预搜索的输入框需要compId字段
        //     },
        //     {
        //       searchType: "fromTodatePicker",
        //       labelName: "时间起 - 时间至",
        //       labelId: "fromTodatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [(new Date().format("yyyyMMdd")-1).toString(),(new Date().format("yyyyMMdd")-1).toString()]
        //     },
        //     {
        //       searchType: "checkbox",
        //       itemTitle: "",
        //       labelName: "车辆类型：",
        //       labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [],
        //       options: [
        //         {
        //           value: 0x0001,
        //           label: "三类以上班线客车"
        //         },
        //         {
        //           value: 0x1000,
        //           label: "高速客运车"
        //         },
        //         {
        //           value: 0x0004,
        //           label: "旅游客车"
        //         },
        //         {
        //           value: 0x0002,
        //           label: "超长客运车"
        //         },
        //         {
        //           value: 0x0080, // this value is customized by Perry,not securate
        //           label: "危险品运输车"
        //         },
        //         {
        //           value: 0x0010, // this value is customized by Perry,not securate
        //           label: "重型货运车"
        //         },
        //         {
        //           value: 0x0020, // this value is customized by Perry,not securate
        //           label: "半挂牵引车"
        //         }
        //       ]
        //     },
        //     {
        //       searchType: "checkbox",
        //       labelName: "车辆状态:",
        //       labelId: "GovStatus", //该ID主要是用来判断在子组件中出发了哪一种个子组件
        //       compVal: [],
        //       options: [
        //         {
        //           value: 0x2,
        //           label: "营运"
        //         },
        //         {
        //           value: 0x4,
        //           label: "停运"
        //         },
        //         {
        //           value: 0x40,
        //           label: "歇业"
        //         }
        //       ]
        //     }
        //   ],
        //   tabHeader: [
        //     {
        //       headerKey: "sybid",
        //       headerVal: "序号",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "LicensePlat",
        //       headerVal: "车牌号",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "CompanyName",
        //       headerVal: "所属道路运输企业",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "BDate",
        //       headerVal: "屏蔽开始时间",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "EDate",
        //       headerVal: "屏蔽结束时间",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "ZoneName",
        //       headerVal: "所属企业地区",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "CityName",
        //       headerVal: "企业所属市(州)",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "VehicleType",
        //       headerVal: "车辆类型",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "ContinueTime",
        //       headerVal: "屏蔽时长",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "Distance",
        //       headerVal: "屏蔽距离",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "BLocation",
        //       headerVal: "屏蔽开始位置",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "ELocation",
        //       headerVal: "屏蔽结束位置",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     },
        //     {
        //       headerKey: "PlatformName",
        //       headerVal: "接入平台",
        //       subHeaders: [],
        //       columnType: this.columnType.text
        //     }
        //   ],
        //   TabCtnt: [
        //     // {
        //     //   sybid: "2016-05-03",
        //     //   LicensePlat: "王小虎",
        //     //   CompanyName: "上海",
        //     //   BDate: "普陀区",
        //     //   ZoneName: "上海市普陀区金沙江路 1518 弄",
        //     //   CityName: 200333
        //     // }
        //   ]
        // }
      ];
      let indexNumber = 0;
      for (let tabCtntItem of tabCtntListFinalArr) {
        if ($_hasAccess(tabCtntItem.ctrlId, accessList)) {
          //该值和sessionStorage中的accessList是一致的，因为vue自定义指令无法访问vuex，所以才会出现sessionStorage的副本
          tabCtntItem.indexNumber = indexNumber;
          this.tabCtntList.push(tabCtntItem);
          indexNumber++;
        }
      }
    }
  },
  created: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
    // 进行权限检测
    this.loadAccess();
  }
};
</script>
