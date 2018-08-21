<template>
  <div class="vehicle-inspect">
    <multi-level-table-component 
    :activeName="activeName" 
    :tabCtntList="tabCtntList" 
    class="zone-check-multilevel"
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"></multi-level-table-component>
  </div>
</template>

<style src="./reportRouter.css" type="text/css">
</style>

<script>
import MultiLevelTableComponent from "@/components/MultiLevelTableComponent/MultiLevelTableComponent";
import { axiosRequest, getLastMonth, getLastDay } from "@/common/common";
import {
  commonConfig,
  carTypeOptions,
  reportLabelId,
  provinceVal
} from "@/config/commonConfig";
export default {
  name: "VehicleInspect",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "report_vehicleinspect_detail_table",
      activeNameIndex: 0,
      getVehicleInspectDataUrl:
        commonConfig.rootUrl + commonConfig.ReportAPI.GetVehicleInspectData,
      exportVehicleInspectDataUrl:
        commonConfig.rootUrl +
        commonConfig.ReportAPI.ExportVehicleInspectData,
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
          tabLabel: "巡检报表",
          tabName: "report_vehicleinspect_detail_table", //将作为标识符来区分
          nType: 1 //根据重构前的请求，可以看到nType 为1
        }
      }
    };
  },
  computed: {
    tabCtntList: function() {
      return [
        {
          tabLabel: this.tabNameObj.firTab.tabLabel,
          tabName: this.tabNameObj.firTab.tabName, //将作为标识符来区分
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false //控制查询数据按钮初始状态为enabled
            },
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
              labelName: "运输企业:",
              labelId: reportLabelId.UnitId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "input",
              labelName: "所属地区:",
              labelId: reportLabelId.ZoneId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "车牌号:",
              labelId: reportLabelId.VehicleId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "fromToTimePickerChange",
              labelName: "时间起 - 时间至",
              labelId: reportLabelId.fromToTimePickerChange, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [new Date(2018,7,5,0,0,20).format('yyyyMMddhhmmss'), new Date(2018,7,5,0,0,50).format('yyyyMMddhhmmss')]
            },
            {
              searchType: "select",
              labelName: "是否上线:",
              labelId: reportLabelId.IsIpline, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 1,
                  label: "是"
                },
                {
                  value: 2,
                  label: "否"
                }
              ]
            },
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "UnitName",
              headerVal: "企业名称",
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
              headerKey: "VehicleType",
              headerVal: "车辆类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "BDate",
              headerVal: "开始时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "EDate",
              headerVal: "结束时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "BLocation",
              headerVal: "开始位置",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "ELocation",
              headerVal: "结束位置",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "IsUpline",
              headerVal: "期间是否上线",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "IsAlarm",
              headerVal: "期间是否产生报警",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "AlarmType",
              headerVal: "报警类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
          ],
          TabCtnt: [
            // {
            //   sysbid: "2016-05-03",
            //   UnitName: "王小虎",
            //   ZName: "普陀区",
            //   LicensePlat: "上海市普陀区金沙江路 1518 弄"
            // },
            // {
            //   sysbid: "2016-05-03",
            //   UnitName: "王小虎",
            //   ZName: "普陀区",
            //   LicensePlat: "上海市普陀区金沙江路 1518 弄"
            // }
          ]
        }
      ];
    }
  },
  methods: {
    handleClickSearch: function(msg) {
      //处理子组件触发的查询事件
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const getVehicleInspectDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.activeNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.transCheckSourceData = [];
      axiosRequest
        .axiosGet(this.getVehicleInspectDataUrl, getVehicleInspectDataUrlParams)
        .then(function(response) {
          console.log(response.data);
          const detailListTemp = response.data.DetailList;
          for (let vehicleUplineItem of detailListTemp) {
            self.transCheckSourceData.push(
              self.pushSourceData(vehicleUplineItem, msg.activeName)
            );
          }
          self.tabCtntList[self.activeNameIndex].TabCtnt =
            self.transCheckSourceData;
          self.tabCtntList[self.activeNameIndex].total =
            response.data.CountTotal;
          self.tabCtntList[self.activeNameIndex].loading = false;
          self.tabCtntList[
            self.activeNameIndex
          ].btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
          // 在某些特殊的Tab需要加上明细 - 平台连通率明细
          self.tabCtntList[self.activeNameIndex].TabCtnt.push(
            self.pushSourceData(response.data.TotalList, msg.activeName)
          );
        })
        .catch(function(error) {});
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(vehicleUplineItem, activeName) {
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          return {
            sybid: vehicleUplineItem.sybid,
            UnitName: vehicleUplineItem.UnitName,
            ZName: vehicleUplineItem.ZName,
            LicensePlat: vehicleUplineItem.LicensePlat,
            PlateColor: vehicleUplineItem.PlateColor,

            VehicleType: vehicleUplineItem.VehicleType,
            BDate: vehicleUplineItem.BDate,
            EDate: vehicleUplineItem.EDate,

            BLocation: vehicleUplineItem.BLocation,
            ELocation: vehicleUplineItem.ELocation,
            IsUpline: vehicleUplineItem.IsUpline,

            IsAlarm: vehicleUplineItem.IsAlarm,
            AlarmType: vehicleUplineItem.AlarmType
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
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const exportVehicleInspectDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.activeNameIndex].loading = true; //下载数据的时候，显示正在下载数据的logo
      axiosRequest
        .axiosGet(
          this.exportVehicleInspectDataUrl,
          exportVehicleInspectDataUrlParams
        )
        .then(function(response) {
          self.downloadServerFile(decodeURIComponent(response.data));
          // 下载完成后，隐藏正在下载的logo
          self.tabCtntList[self.activeNameIndex].loading = false;
        })
        .catch(function(error) {});
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
        upLineFlag = "",
        govStatus = 0,
        status = "",
        isIpline = "",
        bTime = "",
        eTime = "",


        pageSize = 10,
        readPage = "";
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          this.activeNameIndex = 0;
          nType = this.tabNameObj.firTab.nType;
          break;
        default:
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
          case "UplineFlag":
            upLineFlag = msgItem.compVal;
            break;
          case reportLabelId.GovStatus:
            for(let item of msgItem.compVal){
              govStatus += item;
            }
            break;
          case reportLabelId.Status:
            status = msgItem.compVal;
            break;
          case reportLabelId.IsIpline:
            isIpline = msgItem.compVal;
            break;
          case reportLabelId.fromToTimePickerChange:
            beginDate = msgItem.compVal[0].substr(0,8); //时间起
            endDate = msgItem.compVal[1].substr(0,8); //时间止
            bTime = parseInt(msgItem.compVal[0].substr(8,2)*3600) + parseInt(msgItem.compVal[0].substr(10,2)*60) + parseInt(msgItem.compVal[0].substr(12));
            eTime = parseInt(msgItem.compVal[1].substr(8,2)*3600) + parseInt(msgItem.compVal[1].substr(10,2)*60) + parseInt(msgItem.compVal[1].substr(12));
            break;
          // case reportLabelId.BreakRuleType:
          //   breakRuleType = msgItem.compVal;
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
        RegionCode: zoneId,
        beginDate,
        endDate,
        deviceID,
        carType,
        isIncludeLower,
        CompanyCode: unitId,
        vehicleId,
        platformId,
        installID,
        upLineFlag,
        govStatus,
        status,
        isIpline,
        bTime,
        eTime,


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
    }
  }
};
</script>
