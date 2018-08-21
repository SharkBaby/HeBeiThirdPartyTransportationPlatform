
<template>
  <div class="current-online">
    <multi-level-table-component 
    :activeName="activeName" 
    :tabCtntList="tabCtntList"
    class="current-online-multilevel"
    v-on:handleCurActiveIndex="handleCurActiveIndex"
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"></multi-level-table-component>
    <p class="check-footer-p" v-show="activeNameIndex == 0 || activeNameIndex == 1 | activeNameIndex == 2">
      注 : 此处入网车辆数统计截止到昨天
    </p>
  </div>
</template>

<style src="./reportRouter.css" type="text/css">
</style>

<script>
import MultiLevelTableComponent from "@/components/MultiLevelTableComponent/MultiLevelTableComponent";
import { axiosRequest, getLastMonth, getLastDay, storageOperation, handleErrorMs, isNullUndefEmpty } from "@/common/common";
import {
  commonConfig,
  carTypeOptions,
  reportLabelId,
  provinceVal
} from "@/config/commonConfig";
// 引入权限控制的文件
import { $_hasAccess } from "@/accessmanagement/accessmanagement";
export default {
  name: "CurrentOnline",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "currentOnline_tables_zone_div",
      activeNameIndex: 0,
      curNameIndex: 0, //当前地区汇总，主要是解决用户在正在查询数据时，切换了标签页
      getCurrentOnlineDataUrl:
        commonConfig.rootUrl + commonConfig.ReportAPI.GetCurrentOnlineData,
      exportCurrentOnlineDataUrl:
        commonConfig.rootUrl +
        commonConfig.ReportAPI.ExportCurrentOnlineData,
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
          tabName: "currentOnline_tables_zone_div", //将作为标识符来区分
          nType: 1, //根据重构前的请求，可以看到nType 为1
          ctrlId: 'tjfx_clsszxqk_dqhz', //需要权限控制的情况下，需要制定id号
        },
        secTab: {
          tabLabel: "接入平台汇总",
          tabName: "currentOnline_tables_platform_div", //将作为标识符来区分
          nType: 2, //根据重构前的请求，可以看到nType 为2
          ctrlId: 'tjfx_clsszxqk_jrpthz', //需要权限控制的情况下，需要制定id号
        },
        thiTab: {
          tabLabel: "企业汇总",
          tabName: "currentOnline_tables_company_div", //将作为标识符来区分
          nType: 3, //根据重构前的请求，可以看到nType 为3
          ctrlId: 'tjfx_clsszxqk_qyhz', //需要权限控制的情况下，需要制定id号
        },
        fouTab: {
          tabLabel: "在线车辆明细",
          tabName: "currentOnline_tables_vehicle_div", //将作为标识符来区分
          nType: 4, //根据重构前的请求，可以看到nType 为4
          ctrlId: 'tjfx_clsszxqk_zxclmx', //需要权限控制的情况下，需要制定id号
        }
      },
      tabCtntList: [], //基于目前标签页不能使用自定义指令v-hasAccess进行权限管理
    };
  },
  methods: {
    handleCurActiveIndex: function(msg){
      this.activeNameIndex = msg;
    },
    handleClickSearch: function(msg) {
      //处理子组件触发的查询事件
      const self = this;
      self.curNameIndex = self.activeNameIndex;
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const getCurrentOnlineDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.curNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.currentOnlineSourceData = [];
      axiosRequest
        .axiosGet(this.getCurrentOnlineDataUrl, getCurrentOnlineDataUrlParams)
        .then(function(response) {
          self.isDisabled = false;
          const detailListTemp = response.data.DetailList;
          for (let currentOnlineItem of detailListTemp) {
            self.currentOnlineSourceData.push(
              self.pushSourceData(currentOnlineItem, msg.activeName, 'DetailList')
            );
          }
          self.tabCtntList[self.curNameIndex].TabCtnt =
            self.currentOnlineSourceData;
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
    pushSourceData: function(currentOnlineItem, activeName, dataType) {
      let specialColumn = {};
      let basicData = {}
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          basicData = {
            sybid: currentOnlineItem.sybid,
            ZoneName: currentOnlineItem.ZoneName,
          };
          // 地区名称使用的字段名称 - ZName
          if(dataType === 'DetailList'){
            specialColumn = {
              InnetCount: currentOnlineItem.InnetCount,
              OnlineCount: currentOnlineItem.OnlineCount,
              NoOnlineCount: currentOnlineItem.NoOnlineCount,
              OnlineRate: currentOnlineItem.OnlineRate
            }
          }else if(dataType === 'TotalList'){
           specialColumn = {
              InnetCount: currentOnlineItem.InnetCountTotal,
              OnlineCount: currentOnlineItem.OnlineCountTotal,
              NoOnlineCount: currentOnlineItem.NoOnlineCountTotal,
              OnlineRate: currentOnlineItem.OnlineRateTotal
            }
          }
          // 注释人：向浩
          // 注释时间：2018-07-05
          // 注释原因：使用ES6对象的扩展方式来合并两个json对象
          return Object.assign(basicData, specialColumn);
          break;
        case this.tabNameObj.secTab.tabName:
          basicData = {
            sybid: currentOnlineItem.sybid,
            PlatformName: currentOnlineItem.PlatformName,
          };
          // 地区名称使用的字段名称 - ZName
          if(dataType === 'DetailList'){
            specialColumn = {
              InnetCount: currentOnlineItem.InnetCount,
              OnlineCount: currentOnlineItem.OnlineCount,
              NoOnlineCount: currentOnlineItem.NoOnlineCount,
              OnlineRate: currentOnlineItem.OnlineRate
            }
          }else if(dataType === 'TotalList'){
           specialColumn = {
              InnetCount: currentOnlineItem.InnetCountTotal,
              OnlineCount: currentOnlineItem.OnlineCountTotal,
              NoOnlineCount: currentOnlineItem.NoOnlineCountTotal,
              OnlineRate: currentOnlineItem.OnlineRateTotal
            }
          }
          // 注释人：向浩
          // 注释时间：2018-07-05
          // 注释原因：使用ES6对象的扩展方式来合并两个json对象
          return Object.assign(basicData, specialColumn);
          break;
        case this.tabNameObj.thiTab.tabName:
          basicData = {
            sybid: currentOnlineItem.sybid,
            CompanyName: currentOnlineItem.CompanyName,
            CompanyZoneName: currentOnlineItem.CompanyZoneName,
          };
          // 地区名称使用的字段名称 - ZName
          if(dataType === 'DetailList'){
            specialColumn = {
              InnetCount: currentOnlineItem.InnetCount,
              OnlineCount: currentOnlineItem.OnlineCount,
              NoOnlineCount: currentOnlineItem.NoOnlineCount,
              OnlineRate: currentOnlineItem.OnlineRate
            }
          }else if(dataType === 'TotalList'){
           specialColumn = {
              InnetCount: currentOnlineItem.InnetCountTotal,
              OnlineCount: currentOnlineItem.OnlineCountTotal,
              NoOnlineCount: currentOnlineItem.NoOnlineCountTotal,
              OnlineRate: currentOnlineItem.OnlineRateTotal
            }
          }
          // 注释人：向浩
          // 注释时间：2018-07-05
          // 注释原因：使用ES6对象的扩展方式来合并两个json对象
          return Object.assign(basicData, specialColumn);
          break;
        case this.tabNameObj.fouTab.tabName:
          return {
            sybid: currentOnlineItem.sybid,
            LicensePlat: currentOnlineItem.LicensePlat,
            PlateColor: currentOnlineItem.PlateColor,
            ZoneName: currentOnlineItem.ZoneName,
            UnitName: currentOnlineItem.UnitName,
            VehicleType: currentOnlineItem.VehicleType,
            PlatformName: currentOnlineItem.PlatformName,
            Status: currentOnlineItem.Status
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
      const exportCurrentOnlineDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.curNameIndex].loading = true; //下载数据的时候，显示正在下载数据的logo
      axiosRequest
        .axiosGet(
          this.exportCurrentOnlineDataUrl,
          exportCurrentOnlineDataUrlParams
        )
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
        upLineFlag = "",
        govStatus = 0,
        status = "",


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
        upLineFlag,
        govStatus,
        status,


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
              ctrlId: 'tjfx_clsszxqk_dqhz_cx', //需要权限控制的情况下，需要制定id号
            },
            // 注释人：向浩
            // 注释时间：2018-07-05
            // 注释原因：目前车辆实时在线情况里面的报表不支持导出报表功能，因此注释导出数据按钮
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
              searchType: "treeCheckbox",
              labelName: "车辆类型",
              labelId: reportLabelId.CarType, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              treeOps: carTypeOptions,
              treeChkboxProps: {
                label: "label",
                chidlren: "children"
              }
            },
            {
              searchType: "checkbox",
              labelName: "状态",
              labelId: reportLabelId.GovStatus, //该ID主要是用来判断在子组件中出发了哪一种个子组件
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
                },
                {
                  value: 0x10,
                  label: "转出"
                }
                // {
                //   value: 0x100,
                //   label: "锁定"
                // }
              ]
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
              columnType: this.columnType.text
            },
            {
              headerKey: "InnetCount",
              headerVal: "入网车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "OnlineCount",
              headerVal: "在线车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "NoOnlineCount",
              headerVal: "不在线车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "OnlineRate",
              headerVal: "在线率",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   InstalledCount: "王小虎",
            //   OnlineCount: "普陀区",
            //   NoOnlineCount: "上海市普陀区金沙江路 1518 弄"
            // },
            // {
            //   sybid: "2016-05-03",
            //   InstalledCount: "王小虎",
            //   OnlineCount: "普陀区",
            //   NoOnlineCount: "上海市普陀区金沙江路 1518 弄"
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
              ctrlId: 'tjfx_clsszxqk_jrpthz_cx', //需要权限控制的情况下，需要制定id号
            },
            // 注释人：向浩
            // 注释时间：2018-07-05
            // 注释原因：目前车辆实时在线情况里面的报表不支持导出报表功能，因此注释导出数据按钮
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
              labelName: "接入平台",
              labelId: reportLabelId.PlatformId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
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
              searchType: "treeCheckbox",
              labelName: "车辆类型",
              labelId: reportLabelId.CarType, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [],
              treeOps: carTypeOptions,
              treeChkboxProps: {
                label: "label",
                chidlren: "children"
              }
            },
            {
              searchType: "checkbox",
              labelName: "状态",
              labelId: reportLabelId.GovStatus, //该ID主要是用来判断在子组件中出发了哪一种个子组件
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
                },
                {
                  value: 0x10,
                  label: "转出"
                }
                // {
                //   value: 0x100,
                //   label: "锁定"
                // }
              ]
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
              headerKey: "PlatformName",
              headerVal: "接入平台",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "InnetCount",
              headerVal: "入网车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "OnlineCount",
              headerVal: "在线车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "NoOnlineCount",
              headerVal: "不在线车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "OnlineRate",
              headerVal: "在线率",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   InstalledCount: "王小虎",
            //   OnlineCount: "普陀区",
            //   NoOnlineCount: "上海市普陀区金沙江路 1518 弄"
            // },
            // {
            //   sybid: "2016-05-03",
            //   InstalledCount: "王小虎",
            //   OnlineCount: "普陀区",
            //   NoOnlineCount: "上海市普陀区金沙江路 1518 弄"
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
              ctrlId: 'tjfx_clsszxqk_qyhz_cx', //需要权限控制的情况下，需要制定id号
            },
            // 注释人：向浩
            // 注释时间：2018-07-05
            // 注释原因：目前车辆实时在线情况里面的报表不支持导出报表功能，因此注释导出数据按钮
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
              labelName: "运输企业",
              labelId: reportLabelId.UnitId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
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
              searchType: "treeCheckbox",
              labelName: "车辆类型",
              labelId: "CarType", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              treeOps: carTypeOptions,
              treeChkboxProps: {
                label: "label",
                chidlren: "children"
              }
            },
            {
              searchType: "checkbox",
              labelName: "状态",
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
                },
                {
                  value: 0x10,
                  label: "转出"
                }
                // {
                //   value: 0x100,
                //   label: "锁定"
                // }
              ]
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
              headerKey: "CompanyName",
              headerVal: "企业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "CompanyZoneName",
              headerVal: "所属地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "InnetCount",
              headerVal: "入网车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "OnlineCount",
              headerVal: "在线车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "NoOnlineCount",
              headerVal: "不在线车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "OnlineRate",
              headerVal: "在线率",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   InstalledCount: "王小虎",
            //   OnlineCount: "普陀区",
            //   NoOnlineCount: "上海市普陀区金沙江路 1518 弄"
            // },
            // {
            //   sybid: "2016-05-03",
            //   InstalledCount: "王小虎",
            //   OnlineCount: "普陀区",
            //   NoOnlineCount: "上海市普陀区金沙江路 1518 弄"
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
              ctrlId: 'tjfx_clsszxqk_zxclmx_cx', //需要权限控制的情况下，需要制定id号
            },
            // 注释人：向浩
            // 注释时间：2018-07-05
            // 注释原因：目前车辆实时在线情况里面的报表不支持导出报表功能，因此注释导出数据按钮
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
              labelName: "运输企业",
              labelId: reportLabelId.UnitId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "input",
              labelName: "地区",
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
              searchType: "select",
              labelName: "车辆在线情况",
              labelId: reportLabelId.Status, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 1,
                  label: "在线"
                },
                {
                  value: 2,
                  label: "不在线"
                },
              ]
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
            },
            {
              searchType: "checkbox",
              labelName: "状态",
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
                },
                {
                  value: 0x10,
                  label: "转出"
                }
                // {
                //   value: 0x100,
                //   label: "锁定"
                // }
              ]
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
              headerKey: "ZoneName",
              headerVal: "企业所属地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "UnitName",
              headerVal: "企业",
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
              headerKey: "Status",
              headerVal: "车辆在线情况",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            // {
            //   LicensePlat: "2016-05-03",
            //   PlateColor: "王小虎",
            //   CompanyZoneName: "上海",
            //   CompanyName: "上海市普陀区金沙江路 1518 弄",
            //   VehicleType: 200333
            // },
            // {
            //   LicensePlat: "2016-05-03",
            //   PlateColor: "王小虎",
            //   CompanyZoneName: "上海",
            //   CompanyName: "上海市普陀区金沙江路 1518 弄",
            //   VehicleType: 200333
            // }
          ]
        }
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
