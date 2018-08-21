<template>
  <div class="vehicle-online">
    <multi-level-table-component 
    :activeName="activeName" 
    :tabCtntList="tabCtntList"
    class="vehicle-online-multilevel"
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"
    v-on:handleCurActiveIndex="handleCurActiveIndex"></multi-level-table-component>
  </div>
</template>

<style src="./reportRouter.css" type="text/css">
</style>

<script>
import MultiLevelTableComponent from "@/components/MultiLevelTableComponent/MultiLevelTableComponent";
import { axiosRequest, getLastMonth, getLastDay, storageOperation, handleErrorMsg, isNullUndefEmpty } from "@/common/common";
import { commonConfig,carTypeOptions, provinceVal, reportLabelId } from "@/config/commonConfig";
// 引入权限控制的文件
import { $_hasAccess } from "@/accessmanagement/accessmanagement";
export default {
  name: "VehicleOnline",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "report_vehicleonline_zone_table",
      activeNameIndex: 0,
      curNameIndex: 0, //当前地区汇总，主要是解决用户在正在查询数据时，切换了标签页
      getVehicleOnlineDataUrl:
        commonConfig.rootUrl +
        commonConfig.ReportAPI.GetVehicleOnlineData,
      exportVehicleOnlineDataUrl:
        commonConfig.rootUrl +
        commonConfig.ReportAPI.ExportVehicleOnlineData,
      // 每一列的类型，目前已经有纯文本和router-link
      columnType: {
        text: "text",
        router_link: "router_link"
      },
      // 存储每10行的数据
      zoneCheckSourceData: [],
      // 存储合计的数据
      countData: [],
      // tabName作为标识符
      tabNameObj: {
        firTab: {
          tabLabel: "地区汇总",
          tabName: "report_vehicleonline_zone_table", //将作为标识符来区分
          nType: 1, //根据重构前的请求，可以看到nType 为1
          ctrlId: 'tjfx_clzxl_dqhz', //需要权限控制的情况下，需要制定id号
        },
        secTab: {
          tabLabel: "接入平台汇总",
          tabName: "report_vehicleonline_platform_table", //将作为标识符来区分
          nType: 2, //根据重构前的请求，可以看到nType 为2
          ctrlId: 'tjfx_clzxl_jrpthz', //需要权限控制的情况下，需要制定id号
        },
        thiTab: {
          tabLabel: "企业汇总",
          tabName: "report_vehicleonline_company_table", //将作为标识符来区分
          nType: 3, //根据重构前的请求，可以看到nType 为3
          ctrlId: 'tjfx_clzxl_qyhz', //需要权限控制的情况下，需要制定id号
        },
        fouTab: {
          tabLabel: "车辆汇总",
          tabName: "report_vehicleonline_vehicle_table", //将作为标识符来区分
          nType: 4, //根据重构前的请求，可以看到nType 为4
          ctrlId: 'tjfx_clzxl_clhz', //需要权限控制的情况下，需要制定id号
        }
      },
      tabCtntList: [], //基于目前标签页不能使用自定义指令v-hasAccess进行权限管理
    };
  },
  methods: {
    handleClickSearch: function(msg) {
      //处理子组件触发的查询事件
      const self = this;
      self.curNameIndex = self.activeNameIndex;
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const getVehicleOnlineDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.curNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.vehicleOnlineSourceData = [];
      axiosRequest
        .axiosGet(this.getVehicleOnlineDataUrl, getVehicleOnlineDataUrlParams)
        .then(function(response) {
          self.isDisabled = false;
          const detailListTemp = response.data.DetailList;
          for (let vehicleInstallItem of detailListTemp) {
            self.vehicleOnlineSourceData.push(
              self.pushSourceData(vehicleInstallItem, msg.activeName, 'DetailList')
            );
          }
          self.tabCtntList[self.curNameIndex].TabCtnt =
            self.vehicleOnlineSourceData;
          self.tabCtntList[self.curNameIndex].total =
            response.data.CountTotal;
          self.tabCtntList[self.curNameIndex].loading = false;
          self.tabCtntList[self.curNameIndex].btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
          // 在某些特殊的Tab需要加上明细 - 平台连通率明细
          if(!isNullUndefEmpty(response.data.TotalList)){
            self.tabCtntList[self.curNameIndex].TabCtnt.push(
              self.pushSourceData(response.data.TotalList, msg.activeName, 'TotalList')
            );
          }
        })
        .catch(function(error) {
          self.$message({
            type: 'warning',
            message: handleErrorMsg(error)
            })
          self.tabCtntList[self.curNameIndex].loading = false;
        });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(vehicleInstallItem, activeName, dataType) {
      let specialColumn = {};
      let basicData = {}
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          basicData = {
            ZoneName: vehicleInstallItem.ZoneName,
            TOTAL: vehicleInstallItem.TOTAL,
            LinkRelativeRatio: vehicleInstallItem.LinkRelativeRatio,
            DB01: vehicleInstallItem.DB01,
            DB02: vehicleInstallItem.DB02,
            DB03: vehicleInstallItem.DB03,
            DB04: vehicleInstallItem.DB04,
            DB05: vehicleInstallItem.DB05,
            DB06: vehicleInstallItem.DB06,
            DB07: vehicleInstallItem.DB07,
            DB08: vehicleInstallItem.DB08,
            DB09: vehicleInstallItem.DB09,
            DB10: vehicleInstallItem.DB10,
            DB11: vehicleInstallItem.DB11,
            DB12: vehicleInstallItem.DB12,
            DB13: vehicleInstallItem.DB13,
            DB14: vehicleInstallItem.DB14,
            DB15: vehicleInstallItem.DB15,
            DB16: vehicleInstallItem.DB16,
            DB17: vehicleInstallItem.DB17,
            DB18: vehicleInstallItem.DB18,
            DB19: vehicleInstallItem.DB19,
            DB20: vehicleInstallItem.DB20,
            DB21: vehicleInstallItem.DB21,
            DB22: vehicleInstallItem.DB22,
            DB23: vehicleInstallItem.DB23,
            DB24: vehicleInstallItem.DB24,
            DB25: vehicleInstallItem.DB25,
            DB26: vehicleInstallItem.DB26,
            DB27: vehicleInstallItem.DB27,
            DB28: vehicleInstallItem.DB28,
            DB29: vehicleInstallItem.DB29,
            DB30: vehicleInstallItem.DB30,
            DB31: vehicleInstallItem.DB31
          };
          // 地区名称使用的字段名称 - ZName
          if(dataType === 'DetailList'){
            specialColumn = {sybid: vehicleInstallItem.sybid}
          }else if(dataType === 'TotalList'){
            // 合计使用的字段名称 - CompanyZone
            specialColumn = {sybid: ''}
          }
          // 注释人：向浩
          // 注释时间：2018-07-05
          // 注释原因：使用ES6对象的扩展方式来合并两个json对象
          return Object.assign(basicData, specialColumn);
          break;
        case this.tabNameObj.secTab.tabName:
          return {
            sybid: vehicleInstallItem.sybid,
            ZoneName: vehicleInstallItem.ZoneName,
            TYPE: vehicleInstallItem.TYPE,
            TOTAL: vehicleInstallItem.TOTAL,
            LinkRelativeRatio: vehicleInstallItem.LinkRelativeRatio,
            DB01: vehicleInstallItem.DB01,
            DB02: vehicleInstallItem.DB02,
            DB03: vehicleInstallItem.DB03,
            DB04: vehicleInstallItem.DB04,
            DB05: vehicleInstallItem.DB05,
            DB06: vehicleInstallItem.DB06,
            DB07: vehicleInstallItem.DB07,
            DB08: vehicleInstallItem.DB08,
            DB09: vehicleInstallItem.DB09,
            DB10: vehicleInstallItem.DB10,
            DB11: vehicleInstallItem.DB11,
            DB12: vehicleInstallItem.DB12,
            DB13: vehicleInstallItem.DB13,
            DB14: vehicleInstallItem.DB14,
            DB15: vehicleInstallItem.DB15,
            DB16: vehicleInstallItem.DB16,
            DB17: vehicleInstallItem.DB17,
            DB18: vehicleInstallItem.DB18,
            DB19: vehicleInstallItem.DB19,
            DB20: vehicleInstallItem.DB20,
            DB21: vehicleInstallItem.DB21,
            DB22: vehicleInstallItem.DB22,
            DB23: vehicleInstallItem.DB23,
            DB24: vehicleInstallItem.DB24,
            DB25: vehicleInstallItem.DB25,
            DB26: vehicleInstallItem.DB26,
            DB27: vehicleInstallItem.DB27,
            DB28: vehicleInstallItem.DB28,
            DB29: vehicleInstallItem.DB29,
            DB30: vehicleInstallItem.DB30,
            DB31: vehicleInstallItem.DB31
          };
          break;
        case this.tabNameObj.thiTab.tabName:
          basicData = {
            ZNAME: vehicleInstallItem.ZNAME,
            UnitName: vehicleInstallItem.UnitName,
            TOTAL: vehicleInstallItem.TOTAL,
            LinkRelativeRatio: vehicleInstallItem.LinkRelativeRatio,
            DB01: vehicleInstallItem.DB01,
            DB02: vehicleInstallItem.DB02,
            DB03: vehicleInstallItem.DB03,
            DB04: vehicleInstallItem.DB04,
            DB05: vehicleInstallItem.DB05,
            DB06: vehicleInstallItem.DB06,
            DB07: vehicleInstallItem.DB07,
            DB08: vehicleInstallItem.DB08,
            DB09: vehicleInstallItem.DB09,
            DB10: vehicleInstallItem.DB10,
            DB11: vehicleInstallItem.DB11,
            DB12: vehicleInstallItem.DB12,
            DB13: vehicleInstallItem.DB13,
            DB14: vehicleInstallItem.DB14,
            DB15: vehicleInstallItem.DB15,
            DB16: vehicleInstallItem.DB16,
            DB17: vehicleInstallItem.DB17,
            DB18: vehicleInstallItem.DB18,
            DB19: vehicleInstallItem.DB19,
            DB20: vehicleInstallItem.DB20,
            DB21: vehicleInstallItem.DB21,
            DB22: vehicleInstallItem.DB22,
            DB23: vehicleInstallItem.DB23,
            DB24: vehicleInstallItem.DB24,
            DB25: vehicleInstallItem.DB25,
            DB26: vehicleInstallItem.DB26,
            DB27: vehicleInstallItem.DB27,
            DB28: vehicleInstallItem.DB28,
            DB29: vehicleInstallItem.DB29,
            DB30: vehicleInstallItem.DB30,
            DB31: vehicleInstallItem.DB31
          };
          // 地区名称使用的字段名称 - ZName
          if(dataType === 'DetailList'){
            specialColumn = {sybid: vehicleInstallItem.sybid}
          }else if(dataType === 'TotalList'){
            // 合计使用的字段名称 - CompanyZone
            specialColumn = {sybid: ''}
          }
          // 注释人：向浩
          // 注释时间：2018-07-05
          // 注释原因：使用ES6对象的扩展方式来合并两个json对象
          return Object.assign(basicData, specialColumn);
          break;
        case this.tabNameObj.fouTab.tabName:
          return {
            sybid: vehicleInstallItem.sybid,
            LicensePlat: vehicleInstallItem.LicensePlat,
            PlateColor: vehicleInstallItem.PlateColor,
            TOTAL: vehicleInstallItem.TOTAL,
            LinkRelativeRatio: vehicleInstallItem.LinkRelativeRatio,
            ZName: vehicleInstallItem.ZName,
            CompanyName: vehicleInstallItem.CompanyName,
            VehicleType: vehicleInstallItem.VehicleType,
            PlatformName: vehicleInstallItem.PlatformName,
            DB01: vehicleInstallItem.DB01,
            DB02: vehicleInstallItem.DB02,
            DB03: vehicleInstallItem.DB03,
            DB04: vehicleInstallItem.DB04,
            DB05: vehicleInstallItem.DB05,
            DB06: vehicleInstallItem.DB06,
            DB07: vehicleInstallItem.DB07,
            DB08: vehicleInstallItem.DB08,
            DB09: vehicleInstallItem.DB09,
            DB10: vehicleInstallItem.DB10,
            DB11: vehicleInstallItem.DB11,
            DB12: vehicleInstallItem.DB12,
            DB13: vehicleInstallItem.DB13,
            DB14: vehicleInstallItem.DB14,
            DB15: vehicleInstallItem.DB15,
            DB16: vehicleInstallItem.DB16,
            DB17: vehicleInstallItem.DB17,
            DB18: vehicleInstallItem.DB18,
            DB19: vehicleInstallItem.DB19,
            DB20: vehicleInstallItem.DB20,
            DB21: vehicleInstallItem.DB21,
            DB22: vehicleInstallItem.DB22,
            DB23: vehicleInstallItem.DB23,
            DB24: vehicleInstallItem.DB24,
            DB25: vehicleInstallItem.DB25,
            DB26: vehicleInstallItem.DB26,
            DB27: vehicleInstallItem.DB27,
            DB28: vehicleInstallItem.DB28,
            DB29: vehicleInstallItem.DB29,
            DB30: vehicleInstallItem.DB30,
            DB31: vehicleInstallItem.DB31
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
      const exportVehicleOnlineDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.curNameIndex].loading = true;//下载数据的时候，显示正在下载数据的logo
      axiosRequest
        .axiosGet(this.exportVehicleOnlineDataUrl, exportVehicleOnlineDataUrlParams)
        .then(function(response) {
          self.isDisabled = false;
          self.downloadServerFile(decodeURIComponent(response.data));
          // 下载完成后，隐藏正在下载的logo
          self.tabCtntList[self.curNameIndex].loading = false;
        })
        .catch(function(error) {
          self.$message({
            type: 'warning',
            message: handleErrorMsg(error)
            })
          self.tabCtntList[self.curNameIndex].loading = false;
        });
    },
    formPageParams: function(msg, pageIndex, activeName, isSplitPage) {
      // let nType = 0,
      //   beginDate = "",
      //   endDate = "",
      //   zoneId = "",
      //   carType = 0,
      //   isIncludeLower = 1,
      //   sortName = "",
      //   sortOrder = "",
      //   vehicleId = "",
      //   platformId = "",
      //   installID = "",
      //   upLineFlag = "",
      //   checkUnitID = "",
      //   checkType = "",
      //   isOnGuard = "",
      //   unitId = "",
      //   targetUserId = "",
      //   deviceID = "",
      //   gPSInstalled = "",
      //   pageSize = 10,
      //   readPage = "";
      let nType = 0,
        zoneId = "",
        beginDate = "",
        endDate = "",
        deviceID = "",
        carType = 0,
        isIncludeLower = 1,
        unitId = "",
        vehicleId = "",
        platformId = "",
        installID = "",
        singleDatePicker = "",


        pageSize = 10,
        readPage = "";
      for(let tabItem of this.tabCtntList){
        if(tabItem.tabName === activeName){
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
          case reportLabelId.fromTodatePicker:
            beginDate = msgItem.compVal[0]; //时间起
            endDate = msgItem.compVal[1]; //时间止
            break;
          case reportLabelId.DeviceID:
            deviceID = msgItem.compVal;
            break;
          case reportLabelId.CarType:
            carType = msgItem.compVal;
            break;
          case reportLabelId.UnitId:
            unitId = msgItem.compId;
            break;
          case reportLabelId.VehicleId:
            vehicleId = msgItem.compId;
            break;
          case reportLabelId.PlatformId:
            platformId = msgItem.compId;
            break;
          case reportLabelId.EndDate:
            endDate = msgItem.compVal;
            break;
          case reportLabelId.InstallID:
            installID = msgItem.compVal;
            break;
          case reportLabelId.singleDatePicker:
            switch (msgItem.type) {
                case "month":
                  beginDate = msgItem.compVal + "01";
                  endDate =
                    msgItem.compVal +
                    getLastDay(
                      msgItem.compVal.substr(0, 4),
                      msgItem.compVal.substr(4)
                    );
                  break;
                case "year":
                  beginDate = msgItem.compVal + "0101";
                  endDate = msgItem.compVal + "1231";
                  break;
                case "daterange":
                  beginDate = msgItem.compVal[0]; //时间起
                  endDate = msgItem.compVal[1]; //时间止
                  break;
                default:
              }
            break;


            
          // case reportLabelId.BreakRuleType:
          //   breakRuleType = msgItem.compVal;
          //   break;
          // case reportLabelId.GovStatus:
          // for(let item of msgItem.compVal){
          //     govStatus += item;
          //   }
          //   break;
          // case reportLabelId.PlatformType:
          //   platformType = msgItem.compVal;
          //   break;
          // case reportLabelId.UnitId:
          //   unitId = msgItem.compId;
          //   break;
          // case reportLabelId.VehicleId:
          //   vehicleId = msgItem.compId;
          //   break;
          // case reportLabelId.DayOrNight:
          //   dayOrNight = msgItem.compVal;
          //   break;
          // case reportLabelId.OverSpeedRate:
          //   overSpeedRate = msgItem.compVal;
          //   break;
          // case reportLabelId.MisconductType:
          //   misconductType = msgItem.compVal;
          //   break;
          default:
        }
      }
      return {
        nType,
        zoneId,
        beginDate,
        endDate,
        deviceID,
        carType,
        isIncludeLower,
        unitId,
        vehicleId,
        platformId,
        installID,


        pageSize,
        pageIndex,
        isSplitPage,
        readPage
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
    loadAccess: function(){
      const accessList = JSON.parse(storageOperation.getItem("accessList"));
      const tabCtntListFinalArr = [
        {
          tabLabel: this.tabNameObj.firTab.tabLabel,
          tabName: this.tabNameObj.firTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.firTab.ctrlId, //需要权限控制的情况下，需要制定id号
          indexNumber: '', //在权限控制下真正的下标
          nType: this.tabNameObj.firTab.nType,
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: 'tjfx_clzxl_dqhz_cx', //需要权限控制的情况下，需要制定id号
            },
            // 注释人：向浩
            // 注释时间：2018-07-05
            // 注释原因：目前车辆在线率里面的报表不支持导出报表功能，因此注释导出数据按钮

            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true //控制导出数据按钮初始状态为disabled
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: reportLabelId.ZoneId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: reportLabelId.PlatformId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "singleDatePicker",
              type: "month",
              labelName: "月份",
              format: "yyyy-MM",
              valueformat: "yyyyMM",
              labelId: reportLabelId.singleDatePicker, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: new Date().format('yyyyMM')
            },
            {
              searchType: "treeCheckbox",
              labelName: "车辆类型",
              labelId: reportLabelId.CarType, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              treeOps: carTypeOptions,
              treeChkboxProps: {
                label: "label",
                chidlren: "children"
              }
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "ZoneName",
              headerVal: "地区",
              subHeaders: [],              
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail
            },
            {
              headerKey: "TOTAL",
              headerVal: "月在线率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "LinkRelativeRatio",
              headerVal: "环比增长率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB01",
              headerVal: "1号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB02",
              headerVal: "2号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB03",
              headerVal: "3号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB04",
              headerVal: "4号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB05",
              headerVal: "5号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB06",
              headerVal: "6号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB07",
              headerVal: "7号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB08",
              headerVal: "8号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB09",
              headerVal: "9号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB10",
              headerVal: "10号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB11",
              headerVal: "11号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB12",
              headerVal: "12号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB13",
              headerVal: "13号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB14",
              headerVal: "14号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB15",
              headerVal: "15号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB16",
              headerVal: "16号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB17",
              headerVal: "17号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB18",
              headerVal: "18号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB19",
              headerVal: "19号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB20",
              headerVal: "20号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB21",
              headerVal: "21号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB22",
              headerVal: "22号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB23",
              headerVal: "23号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB24",
              headerVal: "24号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB25",
              headerVal: "25号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB26",
              headerVal: "26号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB27",
              headerVal: "27号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB28",
              headerVal: "28号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB29",
              headerVal: "29号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB30",
              headerVal: "30号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB31",
              headerVal: "31号",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            // {
            //   ZoneName: "2016-05-03",
            //   total: "王小虎",
            //   LinkRelativeRatio: "上海"
            // },
            // {
            //   ZoneName: "2016-05-03",
            //   total: "王小虎",
            //   LinkRelativeRatio: "上海"
            // }
          ]
        },
        {
          tabLabel: this.tabNameObj.secTab.tabLabel,
          tabName: this.tabNameObj.secTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.secTab.ctrlId, //需要权限控制的情况下，需要制定id号
          indexNumber: '', //在权限控制下真正的下标
          nType: this.tabNameObj.secTab.nType,
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: 'tjfx_clzxl_jrpthz_cx', //需要权限控制的情况下，需要制定id号
            },
            // 注释人：向浩
            // 注释时间：2018-07-05
            // 注释原因：目前车辆在线率里面的报表不支持导出报表功能，因此注释导出数据按钮
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true //控制导出数据按钮初始状态为disabled
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
              compId: ""
            },
            {
              searchType: "select",
              labelName: "平台类型",
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
              searchType: "singleDatePicker",
              labelName: "月份",
              type: "month",
              format: "yyyy-MM",
              valueformat: "yyyyMM",
              labelId: "singleDatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: new Date().format('yyyyMM')
            },
            {
              searchType: "treeCheckbox",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              treeOps: carTypeOptions,
              treeChkboxProps: {
                label: "label",
                chidlren: "children"
              }
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "ZoneName",
              headerVal: "接入平台",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail
            },
            {
              headerKey: "TYPE",
              headerVal: "平台类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "TOTAL",
              headerVal: "月在线率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "LinkRelativeRatio",
              headerVal: "环比增长率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB01",
              headerVal: "1号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB02",
              headerVal: "2号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB03",
              headerVal: "3号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB04",
              headerVal: "4号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB05",
              headerVal: "5号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB06",
              headerVal: "6号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB07",
              headerVal: "7号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB08",
              headerVal: "8号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB09",
              headerVal: "9号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB10",
              headerVal: "10号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB11",
              headerVal: "11号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB12",
              headerVal: "12号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB13",
              headerVal: "13号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB14",
              headerVal: "14号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB15",
              headerVal: "15号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB16",
              headerVal: "16号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB17",
              headerVal: "17号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB18",
              headerVal: "18号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB19",
              headerVal: "19号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB20",
              headerVal: "20号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB21",
              headerVal: "21号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB22",
              headerVal: "22号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB23",
              headerVal: "23号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB24",
              headerVal: "24号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB25",
              headerVal: "25号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB26",
              headerVal: "26号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB27",
              headerVal: "27号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB28",
              headerVal: "28号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB29",
              headerVal: "29号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB30",
              headerVal: "30号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB31",
              headerVal: "31号",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            // {
            //   ZoneName: "2016-05-03",
            //   TYPE: "TYPE1",
            //   total: "王小虎",
            //   LinkRelativeRatio: "上海"
            // },
            // {
            //   ZoneName: "2016-05-03",
            //   TYPE: "TYPE2",
            //   total: "王小虎",
            //   LinkRelativeRatio: "上海"
            // }
          ]
        },
        {
          tabLabel: this.tabNameObj.thiTab.tabLabel,
          tabName: this.tabNameObj.thiTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.thiTab.ctrlId, //需要权限控制的情况下，需要制定id号
          indexNumber: '', //在权限控制下真正的下标
          nType: this.tabNameObj.thiTab.nType,
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: 'tjfx_clzxl_qyhz_cx', //需要权限控制的情况下，需要制定id号
            },
            // 注释人：向浩
            // 注释时间：2018-07-05
            // 注释原因：目前车辆在线率里面的报表不支持导出报表功能，因此注释导出数据按钮
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true //控制导出数据按钮初始状态为disabled
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: reportLabelId.ZoneId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "运输企业",
              labelId: reportLabelId.UnitId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: reportLabelId.PlatformId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "singleDatePicker",
              type: "month",
              labelName: "月份",
              format: "yyyy-MM",
              valueformat: "yyyyMM",
              labelId: reportLabelId.singleDatePicker, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: new Date().format('yyyyMM')
            },
            {
              searchType: "treeCheckbox",
              labelName: "车辆类型",
              labelId: reportLabelId.CarType, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              treeOps: carTypeOptions,
              treeChkboxProps: {
                label: "label",
                chidlren: "children"
              }
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "ZNAME",
              headerVal: "企业所属地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "UnitName",
              headerVal: "所属企业",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail
            },
            {
              headerKey: "TOTAL",
              headerVal: "月在线率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "LinkRelativeRatio",
              headerVal: "环比增长率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB01",
              headerVal: "1号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB02",
              headerVal: "2号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB03",
              headerVal: "3号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB04",
              headerVal: "4号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB05",
              headerVal: "5号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB06",
              headerVal: "6号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB07",
              headerVal: "7号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB08",
              headerVal: "8号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB09",
              headerVal: "9号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB10",
              headerVal: "10号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB11",
              headerVal: "11号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB12",
              headerVal: "12号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB13",
              headerVal: "13号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB14",
              headerVal: "14号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB15",
              headerVal: "15号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB16",
              headerVal: "16号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB17",
              headerVal: "17号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB18",
              headerVal: "18号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB19",
              headerVal: "19号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB20",
              headerVal: "20号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB21",
              headerVal: "21号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB22",
              headerVal: "22号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB23",
              headerVal: "23号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB24",
              headerVal: "24号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB25",
              headerVal: "25号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB26",
              headerVal: "26号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB27",
              headerVal: "27号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB28",
              headerVal: "28号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB29",
              headerVal: "29号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB30",
              headerVal: "30号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB31",
              headerVal: "31号",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            // {
            //   LicensePlat: "2016-05-03",
            //   PlateColor: "TYPE1",
            //   total: "王小虎",
            //   LinkRelativeRatio: "上海"
            // },
            // {
            //   LicensePlat: "2016-05-03",
            //   PlateColor: "TYPE1",
            //   total: "王小虎",
            //   LinkRelativeRatio: "上海"
            // }
          ]
        },
        {
          tabLabel: this.tabNameObj.fouTab.tabLabel,
          tabName: this.tabNameObj.fouTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.fouTab.ctrlId, //需要权限控制的情况下，需要制定id号
          indexNumber: '', //在权限控制下真正的下标
          nType: this.tabNameObj.fouTab.nType,
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false, //控制查询数据按钮初始状态为enabled
              ctrlId: 'tjfx_clzxl_clhz_cx', //需要权限控制的情况下，需要制定id号
            },
            // 注释人：向浩
            // 注释时间：2018-07-05
            // 注释原因：目前车辆在线率里面的报表不支持导出报表功能，因此注释导出数据按钮
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true //控制导出数据按钮初始状态为disabled
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "车牌号",
              labelId: reportLabelId.VehicleId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "input",
              labelName: "所属地区",
              labelId: reportLabelId.ZoneId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "接入平台",
              labelId: reportLabelId.PlatformId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "input",
              labelName: "运输企业",
              labelId: reportLabelId.UnitId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "singleDatePicker",
              type: "month",
              labelName: "月份",
              format: "yyyy-MM",
              valueformat: "yyyyMM",
              labelId: reportLabelId.singleDatePicker, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: new Date().format('yyyyMM')
            },
            {
              searchType: "treeCheckbox",
              labelName: "车辆类型",
              labelId: reportLabelId.CarType, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              treeOps: carTypeOptions,
              treeChkboxProps: {
                label: "label",
                chidlren: "children"
              }
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "LicensePlat",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "PlateColor",
              headerVal: "车牌颜色",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "TOTAL",
              headerVal: "月在线率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "LinkRelativeRatio",
              headerVal: "环比增长率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "ZName",
              headerVal: "企业所属地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "CompanyName",
              headerVal: "所属企业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "VehicleType",
              headerVal: "车辆类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "PlatformName",
              headerVal: "接入平台",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB01",
              headerVal: "1号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB02",
              headerVal: "2号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB03",
              headerVal: "3号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB04",
              headerVal: "4号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB05",
              headerVal: "5号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB06",
              headerVal: "6号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB07",
              headerVal: "7号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB08",
              headerVal: "8号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB09",
              headerVal: "9号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB10",
              headerVal: "10号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB11",
              headerVal: "11号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB12",
              headerVal: "12号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB13",
              headerVal: "13号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB14",
              headerVal: "14号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB15",
              headerVal: "15号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB16",
              headerVal: "16号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB17",
              headerVal: "17号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB18",
              headerVal: "18号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB19",
              headerVal: "19号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB20",
              headerVal: "20号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB21",
              headerVal: "21号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB22",
              headerVal: "22号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB23",
              headerVal: "23号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB24",
              headerVal: "24号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB25",
              headerVal: "25号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB26",
              headerVal: "26号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB27",
              headerVal: "27号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB28",
              headerVal: "28号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB29",
              headerVal: "29号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB30",
              headerVal: "30号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DB31",
              headerVal: "31号",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            // {
            //   LicensePlat: "2016-05-03",
            //   PlateColor: "TYPE1",
            //   total: "王小虎",
            //   LinkRelativeRatio: "上海"
            // },
            // {
            //   LicensePlat: "2016-05-03",
            //   PlateColor: "TYPE1",
            //   total: "王小虎",
            //   LinkRelativeRatio: "上海"
            // }
          ]
        },
      ];
      let indexNumber = 0;
      for (let tabCtntItem of tabCtntListFinalArr) {
        if ($_hasAccess(tabCtntItem.ctrlId, accessList)){
          //该值和sessionStorage中的accessList是一致的，因为vue自定义指令无法访问vuex，所以才会出现sessionStorage的副本
          tabCtntItem.indexNumber = indexNumber;
          this.tabCtntList.push(tabCtntItem);
          indexNumber++;
        }
      }
    },
    // 更新子组件传过来的activeIndex
    handleCurActiveIndex: function(msg){
      this.activeNameIndex = msg;
    }
  },
  created: function(){
    // 进行权限检测
    this.loadAccess();
  },
  beforeMount: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
