<template>
  <div class="alarm-supervision">
    <multi-level-table-component 
    :activeName="activeName" 
    :tabCtntList="tabCtntList"
    class="alarm-supervision-multilevel"
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
import {
  commonConfig,
  carTypeOptions,
  reportLabelId,
  provinceVal
} from "@/config/commonConfig";
// 引入权限控制的文件
import { $_hasAccess } from "@/accessmanagement/accessmanagement";
export default {
  name: "AlarmSupervision",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "report_alarmsupervision_zone_table",
      activeNameIndex: 0,
      curNameIndex: 0, //当前地区汇总，主要是解决用户在正在查询数据时，切换了标签页
      getAlarmSupervisionDataUrl: commonConfig.rootUrl + commonConfig.ReportAPI.GetAlarmSupervisionData,
      exportAlarmSupervisionDataUrl: commonConfig.rootUrl + commonConfig.ReportAPI.ExportAlarmSupervisionData,
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
          tabName: "report_alarmsupervision_zone_table", //将作为标识符来区分
          nType: 1, //根据重构前的请求，可以看到nType 为1
          ctrlId: 'tjfx_clbjdbtj_dqhz', //需要权限控制的情况下，需要制定id号
        },
        secTab: {
          tabLabel: "车辆报警督办明细",
          tabName: "report_alarmsupervision_detail_table", //将作为标识符来区分
          nType: 2, //根据重构前的请求，可以看到nType 为3
          ctrlId: 'tjfx_clbjdbtj_clbjdbmx', //需要权限控制的情况下，需要制定id号
        },
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
      const getAlarmSupervisionDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.curNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.alarmSupervisionSourceData = [];
      axiosRequest
        .axiosGet(this.getAlarmSupervisionDataUrl, getAlarmSupervisionDataUrlParams)
        .then(function(response) {
          self.isDisabled = false;
          // 处理返回结果的异常
          if(isNullUndefEmpty(response.data)){
            self.tabCtntList[self.curNameIndex].loading = false;
            return;
          }
          const detailListTemp = response.data.DetailList;
          for (let alarmSupervisionItem of detailListTemp) {
            self.alarmSupervisionSourceData.push(
              self.pushSourceData(alarmSupervisionItem, msg.activeName, 'DetailList')
            );
          }
          self.tabCtntList[self.curNameIndex].TabCtnt = self.alarmSupervisionSourceData;
          self.tabCtntList[self.curNameIndex].total = response.data.CountTotal;
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
    pushSourceData: function(alarmSupervisionItem, activeName, dataType) {
      // let specialColumn = {};
      // let basicData = {}
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          return {
            sybid: alarmSupervisionItem.sybid,
            ZName: alarmSupervisionItem.ZName,
            OverSpeedCNT: alarmSupervisionItem.OverSpeedCNT,
            OverSpeedDealResult: alarmSupervisionItem.OverSpeedDealResult,
            OverSpeedDealRate: alarmSupervisionItem.OverSpeedDealRate,

            AbnormalCNT: alarmSupervisionItem.AbnormalCNT,
            AbnormalDealResult: alarmSupervisionItem.AbnormalDealResult,
            AbnormalDealRate: alarmSupervisionItem.AbnormalDealRate,

            HoursDriveCNT: alarmSupervisionItem.HoursDriveCNT,
            HoursDriveDealResult: alarmSupervisionItem.HoursDriveDealResult,
            HoursDriveDealRate: alarmSupervisionItem.HoursDriveDealRate,

            TotalCNT: alarmSupervisionItem.TotalCNT,
            TotalDeal: alarmSupervisionItem.TotalDeal,
            TotalDealRate: alarmSupervisionItem.TotalDealRate,
          };
          // 地区名称使用的字段名称 - ZName
          // if(dataType === 'DetailList'){
          //   specialColumn = {ZName: alarmSupervisionItem.ZName}
          // }else if(dataType === 'TotalList'){
          //   // 合计使用的字段名称 - CompanyZone
          //   specialColumn = {ZName: alarmSupervisionItem.CompanyZone}
          // }
          // 注释人：向浩
          // 注释时间：2018-07-05
          // 注释原因：使用ES6对象的扩展方式来合并两个json对象
          // return Object.assign(basicData, specialColumn);
          break;
        case this.tabNameObj.secTab.tabName:
          return {
            sybid: alarmSupervisionItem.sybid,
            LicensePlat: alarmSupervisionItem.LicensePlat,
            ZName: alarmSupervisionItem.ZName,
            UnitName: alarmSupervisionItem.UnitName,
            PlatformName: alarmSupervisionItem.PlatformName,
            VehicleType: alarmSupervisionItem.VehicleType,
            AlarType: alarmSupervisionItem.AlarType,

            BTime: alarmSupervisionItem.BTime,
            ETime: alarmSupervisionItem.ETime,
            Duration: alarmSupervisionItem.Duration,

            BLocation: alarmSupervisionItem.BLocation,
            ELocation: alarmSupervisionItem.ELocation,
            DealResult: alarmSupervisionItem.DealResult,

            Username: alarmSupervisionItem.Username,
            SuperviseTime: alarmSupervisionItem.SuperviseTime,
            Organization: alarmSupervisionItem.Organization,
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
      const exportalarmSupervisionDataParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.curNameIndex].loading = true; //下载数据的时候，显示正在下载数据的logo
      axiosRequest
        .axiosGet(
          this.exportAlarmSupervisionDataUrl,
          exportalarmSupervisionDataParams
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
      let nType = 0,
        zoneId = "",
        beginDate = "",
        endDate = "",
        carType = 0,

        // 车辆报警督办详情字段
        unitId = "",
        platformId = "",
        vehicleId = "",
        isSupervise="",

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
          case reportLabelId.CarType:
            carType = msgItem.compVal;
            break;
          case reportLabelId.UnitId:
            unitId = msgItem.compId;
            break;
          case reportLabelId.PlatformId:
            platformId = msgItem.compId;
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
          case reportLabelId.VehicleId:
            vehicleId = msgItem.compId;
            break;
          case reportLabelId.isSupervise:
            isSupervise = msgItem.compVal;
            break;
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
        carType,
        unitId,
        platformId,
        vehicleId,
        isSupervise,

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
              ctrlId: 'tjfx_clbjdbtj_dqhz_cx', //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: 'tjfx_clbjdbtj_dqhz_dc', //需要权限控制的情况下，需要制定id号
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
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: reportLabelId.fromTodatePicker, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
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
              headerKey: "ZName",
              headerVal: "地区",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail
            },
            {
              labelName: "超速",
              subHeaders: [
                {
                  headerKey: "OverSpeedCNT",
                  headerVal: "应督办次数",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "OverSpeedDealResult",
                  headerVal: "已督办次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail
                },
                {
                  headerKey: "OverSpeedDealRate",
                  headerVal: "督办率",
                  columnType: this.columnType.text
                }
              ]
            },
            {
              labelName: "凌晨2-5点异动",
              subHeaders: [
                {
                  headerKey: "AbnormalCNT",
                  headerVal: "应督办次数",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "AbnormalDealResult",
                  headerVal: "已督办次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail
                },
                {
                  headerKey: "AbnormalDealRate",
                  headerVal: "督办率",
                  columnType: this.columnType.text
                }
              ]
            },
            {
              labelName: "疲劳驾驶",
              subHeaders: [
                {
                  headerKey: "HoursDriveCNT",
                  headerVal: "应督办次数",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "HoursDriveDealResult",
                  headerVal: "已督办次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail
                },
                {
                  headerKey: "HoursDriveDealRate",
                  headerVal: "督办率",
                  columnType: this.columnType.text
                }
              ]
            },
            {
              labelName: "合计",
              subHeaders: [
                {
                  headerKey: "TotalCNT",
                  headerVal: "应督办次数",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "TotalDeal",
                  headerVal: "已督办次数",
                  columnType: this.columnType.router_link,
                  router_link: commonConfig.routerConst.ProviderCheckDetail
                },
                {
                  headerKey: "TotalDealRate",
                  headerVal: "督办率",
                  columnType: this.columnType.text
                }
              ]
            }
          ],
          TabCtnt: [
            // {
            //   ZName: "2016-05-03",
            //   IncrementVehicle: "王小虎",
            //   ALLVehicle: "上海",
            //   InstalledVehicle: "普陀区",
            //   InstalledRate: "上海市普陀区金沙江路 1518 弄"
            // },
            // {
            //   ZName: "2016-05-03",
            //   IncrementVehicle: "王小虎",
            //   ALLVehicle: "上海",
            //   InstalledVehicle: "普陀区",
            //   InstalledRate: "上海市普陀区金沙江路 1518 弄"
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
              ctrlId: 'tjfx_clbjdbtj_clbjdbmx_cx', //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: 'tjfx_clbjdbtj_clbjdbmx_dc', //需要权限控制的情况下，需要制定id号
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
              searchType: "select",
              labelName: "是否督办",
              labelId: reportLabelId.isSupervise,
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 1,
                  label: "已督办"
                },
                {
                  value: 2,
                  label: "未督办"
                },
              ]
            },
            {
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: reportLabelId.fromTodatePicker, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
            },
            // {
            //   searchType: "input",
            //   labelName: "账号:",
            //   labelId: reportLabelId.AccountNumber, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            //   compVal: "",
            //   compId: ""
            // },
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
              headerKey: "ZName",
              headerVal: "地区",
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
              headerKey: "PlatformName",
              headerVal: "接入平台",
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
              headerKey: "AlarType",
              headerVal: "报警类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "BTime",
              headerVal: "报警开始时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "ETime",
              headerVal: "报警结束时间",
              subHeaders: [],
              columnType: this.columnType.text,
            },

            {
              headerKey: "Duration",
              headerVal: "持续时长",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "BLocation",
              headerVal: "开始位置",
              subHeaders: [],
              columnType: this.columnType.text,
            },
            {
              headerKey: "ELocation",
              headerVal: "结束位置",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DealResult",
              headerVal: "是否督办",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "Username",
              headerVal: "督办人",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "SuperviseTime",
              headerVal: "督办时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "Organization",
              headerVal: "督办机构",
              subHeaders: [],
              columnType: this.columnType.text
            },
          ],
          TabCtnt: [
            // {
            //   ZName: "2016-05-03",
            //   IncrementVehicle: "王小虎",
            //   ALLVehicle: "上海",
            //   InstalledVehicle: "普陀区",
            //   InstalledRate: "上海市普陀区金沙江路 1518 弄"
            // },
            // {
            //   ZName: "2016-05-03",
            //   IncrementVehicle: "王小虎",
            //   ALLVehicle: "上海",
            //   InstalledVehicle: "普陀区",
            //   InstalledRate: "上海市普陀区金沙江路 1518 弄"
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

