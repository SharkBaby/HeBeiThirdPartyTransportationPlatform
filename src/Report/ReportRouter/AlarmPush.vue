<template>
  <div class="alarm-push">
    <multi-level-table-component 
    :activeName="activeName" 
    :tabCtntList="tabCtntList"
    class="alarm-push-multilevel"
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"
    v-on:handleCurActiveIndex="handleCurActiveIndex"></multi-level-table-component>
    <p class="check-footer-p" v-show="activeNameIndex == 0 || activeNameIndex == 1 | activeNameIndex == 2">
      说明: 1.查询日期值得是警情提示时间
            2.数据库之前应该有记录先终端发送警情提醒
    </p>
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
  name: "CompanyCheckRank",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "report_alarmpush_alarmpush_table",
      activeNameIndex: 0,
      curNameIndex: 0, //当前地区汇总，主要是解决用户在正在查询数据时，切换了标签页
      getTerminalAlarmRemindUrl: commonConfig.rootUrl + commonConfig.ReportAPI.GetTerminalAlarmRemind,
      exportTerminalAlarmRemindUrl: commonConfig.rootUrl + commonConfig.ReportAPI.ExportTerminalAlarmRemind,
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
          tabLabel: "终端警情提醒统计",
          tabName: "report_alarmpush_alarmpush_table", //将作为标识符来区分
          nType: 1, //根据重构前的请求，可以看到nType 为1
          ctrlId: 'tjfx_jqtstj_jqtstj', //需要权限控制的情况下，需要制定id号
        }
      },
      tabCtntList: [], //基于目前标签页不能使用自定义指令v-hasAccess进行权限管理
      // 处理在点击查询、导出等任何按钮的时候是不准切换Tabs
      isDisabled: false,
    };
  },
  methods: {
    handleClickSearch: function(msg) {
      //处理子组件触发的查询事件
      const self = this;
      self.curNameIndex = self.activeNameIndex;
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const getTerminalAlarmRemindUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.curNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.alarmPushSourceData = [];
      axiosRequest
        .axiosGet(this.getTerminalAlarmRemindUrl, getTerminalAlarmRemindUrlParams)
        .then(function(response) {
          self.isDisabled = false;
          const detailListTemp = response.data.DetailList;
          for (let alarmPushItem of detailListTemp) {
            self.alarmPushSourceData.push(
              self.pushSourceData(alarmPushItem, msg.activeName, 'DetailList')
            );
          }
          self.tabCtntList[self.curNameIndex].TabCtnt = self.alarmPushSourceData;
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
    pushSourceData: function(alarmPushItem, activeName, dataType) {
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          return {
            sybid: alarmPushItem.sybid,
            LicensePlat: alarmPushItem.LicensePlat,
            PlateColor: alarmPushItem.PlateColor,

            VehicleType: alarmPushItem.VehicleType,
            ZoneName: alarmPushItem.ZoneName,
            UnitName: alarmPushItem.UnitName,

            PlatformName: alarmPushItem.PlatformName,
            AlarmType: alarmPushItem.AlarmType,
            RemindDate: alarmPushItem.RemindDate,

            RemindContext: alarmPushItem.RemindContext, //向浩注：这个字段名由自己起的
            RemindState: alarmPushItem.RemindState, //向浩注：这个字段名由自己起的
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
      const exportTerminalAlarmRemindUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.curNameIndex].loading = true; //下载数据的时候，显示正在下载数据的logo
      axiosRequest
        .axiosGet(
          this.exportTerminalAlarmRemindUrl,
          exportTerminalAlarmRemindUrlParams
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
        vehicleId = "",
        zoneId = "",
        unitId = "",
        platformId = "",
        beginDate = "",
        endDate = "",
        carType = 0,
        alarmType = "",

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
          case reportLabelId.VehicleId:
            vehicleId = msgItem.compId;
            break;
          case reportLabelId.ZoneId:
            zoneId = msgItem.compId;
            break;
          case reportLabelId.UnitId:
            unitId = msgItem.compId;
            break;
          case reportLabelId.PlatformId:
            platformId = msgItem.compId;
            break;
          case reportLabelId.fromTodatePicker:
            beginDate = msgItem.compVal[0]; //时间起
            endDate = msgItem.compVal[1]; //时间止
            break;
          case reportLabelId.CarType:
            carType = msgItem.compVal;
            break;
          case reportLabelId.AlarmType:
            alarmType = msgItem.compVal;
            break;
          default:
        }
      }
      return {
        nType,
        vehicleId,
        zoneId,
        unitId,
        platformId,
        beginDate,
        endDate,
        carType,
        alarmType,


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
              ctrlId: 'tjfx_jqtstj_jqtstj_cx', //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: 'tjfx_jqtstj_jqtstj_dc', //需要权限控制的情况下，需要制定id号
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
              searchType: "fromTodatePicker",
              labelName: "时间起 - 时间至",
              labelId: reportLabelId.fromTodatePicker, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: [
                (new Date().format("yyyyMMdd")-1).toString(),
                (new Date().format("yyyyMMdd")-1).toString()
              ]
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
              labelName: "报警类型",
              labelId: reportLabelId.AlarmType, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: 0,
              options: [
                {
                  value: 0,
                  label: "全部"
                },
                {
                  value: 1,
                  label: "超速"
                },
                {
                  value: 2,
                  label: "凌晨2-5报警运行"
                },
                {
                  value: 3,
                  label: "疲劳驾驶"
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
              headerKey: "ZoneName",
              headerVal: "所属地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "UnitName",
              headerVal: "所属企业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "PlatformName",
              headerVal: "所属接入平台",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "AlarmType",
              headerVal: "报警类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "RemindDate",
              headerVal: "提示时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            // 注释人：向浩
            // 注释时间：2018-08-12
            // 注释原因：服务端展示没有存储提示内容，故屏蔽此字段 - 春雨
            // {
            //   headerKey: "RemindContext",
            //   headerVal: "提示内容",
            //   subHeaders: [],
            //   columnType: this.columnType.text
            // },
            {
              headerKey: "RemindState",
              headerVal: "发送状态",
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

