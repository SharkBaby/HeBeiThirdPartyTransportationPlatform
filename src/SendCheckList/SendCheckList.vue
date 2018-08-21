<template>
  <div class="send-check-list">
    <multi-level-no-tab-component
    :tabCtntList="tabCtntList" 
    class="company-multilevel" 
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"
    v-on:handleEditBtn="handleEditBtn"
    v-on:handleviewOptionDetail="handleviewOptionDetail"
    v-on:handlegetNewChoucha="handlegetNewChoucha"
    ></multi-level-no-tab-component>
    <view-option-detail :viewOptionVisible="viewOptionVisible" v-on:handleCloseEvent="handleviewOptionDetail"></view-option-detail>
    <get-new-choucha :getNewChouchaVisible="getNewChouchaVisible" v-on:handleCloseEvent="handlegetNewChoucha" :columnName="tabHeader"></get-new-choucha>
  </div>
</template>

<style src="./sendCheckList.css" type="text/css">
</style>

<script>
import MultiLevelNoTabComponent from "@/components/MultiLevelNoTabComponent/MultiLevelNoTabComponent";
import ViewOptionDetail from '@/SendCheckList/ViewOptionDetail/ViewOptionDetail';
import GetNewChoucha from '@/SendCheckList/GetNewChoucha/GetNewChoucha';
import { axiosRequest, storageOperation } from "@/common/common";
import {
  commonConfig,
  reportLabelId,
  provinceVal,
} from "@/config/commonConfig";
export default {
  name: "Company",
  components: {
    MultiLevelNoTabComponent,
    ViewOptionDetail,
    GetNewChoucha
  },
  data() {
    return {
      getCheckManageByZoneUrl:
        commonConfig.rootUrl + commonConfig.GetCheckManageByZone,
      exportCheckManageDataUrl:
        commonConfig.rootUrl + commonConfig.ExportCheckManageData,
      // 每一大列的满分得分
      columnFullScore: {
        rwl: 5,
        sxl: 10,
        wxpyl: 15,
        gjwzl: 40,
        sjhgl: 30,
        pjcscs: 0,
        pjpjsc: 0
      },
      // 每一列的类型，目前已经有纯文本和router-link
      columnType: {
        text: "text",
        router_link: "router_link"
      },
      // 存储每10行的数据
      sendChkListItemSourceData: [],
      // 存储合计的数据
      countData: [],
      viewOptionVisible: false,// 隐藏“查看选项详情”表单
      getNewChouchaVisible: false, // 隐藏“获取新抽查”表单
      tabHeader: [
        {
          headerKey: "OrderID",
          headerVal: "单号"
        },
        {
          headerKey: "LicensePlat",
          headerVal: "企业"
        },
        {
          headerKey: "User",
          headerVal: "安全检查人员"
        },
        {
          headerKey: "CheckState",
          headerVal: "检查状态"
        },
        {
          headerKey: "OrderDate",
          headerVal: "时间安排"
        }
      ]
    };
  },
  computed: {
    tabCtntList: function() {
      return {
        currentPage: 1, //当前页数
        total: 0, //总条数
        loading: false,
        btnEvents: [
          {
            iconName: "el-icon-search",
            btnId: commonConfig.btnEventsId.search, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "筛选",
            isDisabled: false //控制查询数据按钮初始状态为enabled
          },
          {
            iconName: "",
            btnId: commonConfig.btnEventsId.viewOptionDetail, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "查看选项详情",
            isDisabled: false //控制查询数据按钮初始状态为enabled
          },
          {
            iconName: "",
            btnId: commonConfig.btnEventsId.getNewChoucha, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "获取新抽查",
            isDisabled: false //控制查询数据按钮初始状态为enabled
          },
          {
            iconName: "",
            btnId: commonConfig.btnEventsId.delete, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "删除选项",
            isDisabled: false //控制查询数据按钮初始状态为enabled
          },
          {
            iconName: "",
            btnId: commonConfig.btnEventsId.export_data, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "导出数据",
            isDisabled: false //控制查询数据按钮初始状态为enabled
          }
        ],
        searchCreteria: [
          {
            searchType: "input",
            labelName: "单号",
            labelId: reportLabelId.OrderCode, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          },
          {
            searchType: "singleDayPicker",
            labelName: "日期",
            labelId: reportLabelId.BeginDate, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          },
          {
            searchType: "select",
            labelName: "检查状态:",
            labelId: reportLabelId.CheckState, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: "",
            options: [
              { label: "待检查", value: 0x01 },
              { label: "待整改", value: 0x02 },
              { label: "已整改", value: 0x04 },
              { label: "已过期", value: 0x08 }
            ]
          }
        ],
        tabHeader: [
          {
            headerKey: "sybid",
            headerVal: "序号",
            subHeaders: []
          },
          {
            headerKey: "OrderCode",
            headerVal: "单号",
            subHeaders: []
          },
          {
            headerKey: "Unit",
            headerVal: "企业",
            subHeaders: []
          },
          {
            headerKey: "User",
            headerVal: "安全检查人员",
            subHeaders: []
          },
          {
            headerKey: "CheckState",
            headerVal: "检查状态",
            subHeaders: []
          },
          {
            headerKey: "OrderDate",
            headerVal: "时间安排",
            subHeaders: []
          }
        ],
        TabCtnt: [{
        sybid: 1,
        OrderCode: '2017100301',
        Unit: '石家庄市某某企业',
        User: 'user0',
        CheckState: '待检查',
        OrderDate: '20171203'
      }],
      };
    }
  },
  methods: {
    //处理子组件触发的查询事件
    handleClickSearch: function(msg) {
      // const self = this;
      // storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // // 封装函数来组装每一页请求的参数
      // const GetCheckManageByZoneParams = self.formPageParams(
      //   msg.searchCreteria,
      //   msg.currentPage,
      //   msg.isSplitPage
      // );
      // self.tabCtntList.loading = true; //加载数据的时候，显示加载数据的logo
      // // 清空当前数据的集合
      // self.sendChkListItemSourceData = [];
      // axiosRequest.axiosGet(this.getCheckManageByZoneUrl, GetCheckManageByZoneParams)
      //   .then(function(response) {
      //     const vehicleRankTemp = response.data.DetailList;
      //     for (let sendChkListItem of vehicleRankTemp) {
      //       self.sendChkListItemSourceData.push(
      //         self.pushSourceData(sendChkListItem)
      //       );
      //     }
      //     // 加上合计这一行
      //     self.countData = self.pushSourceData(response.data.TotalList);
      //     self.tabCtntList.TabCtnt = self.sendChkListItemSourceData;
      //     self.tabCtntList.TabCtnt.push(self.countData);
      //     self.tabCtntList.total = response.data.CountTotal;
      //     self.tabCtntList.loading = false;
      //     self.tabCtntList.btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
      //   })
      //   .catch(function(error) {});
      this.$message({
        message:
          "恭喜你点击了双随机抽查-查询事件，目前该功能正在马不停蹄开发中，敬请期待",
        type: "warning"
      });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(sendChkListItem) {
      return {
        sybid: sendChkListItem.sybid,
        OrderCode: sendChkListItem.OrderCode,
        Unit: sendChkListItem.Unit,
        User: sendChkListItem.User,
        CheckState: sendChkListItem.CheckState,
        OrderDate: sendChkListItem.OrderDate
      };
    },
    // 注释人：向浩
    // 注释时间：2018-06-12
    // 注释原因：实现导出数据功能
    handleClickExpData: function(msg) {
      // //处理子组件触发的导出数据事件
      const self = this;
      self.tabCtntList.loading = false;
      // storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // self.tabCtntList.loading = true; //下载数据的时候，显示正在下载数据的logo
      // // 封装函数来组装每一页请求的参数
      // const GetCheckManageByZoneParams = self.formPageParams(
      //   msg.searchCreteria,
      //   msg.currentPage,
      //   msg.isSplitPage //是否分页 - 导出数据
      // );
      // axiosRequest
      //   .axiosGet(this.exportCheckManageDataUrl, GetCheckManageByZoneParams)
      //   .then(function(response) {
      //     self.downloadServerFile(decodeURIComponent(response.data));
      //     // 下载完成后，隐藏正在下载的logo
      //     self.tabCtntList.loading = false;
      //   })
      //   .catch(function(error) {});
      this.$message({
        message:
          "恭喜你点击了双随机抽查-导出数据事件，目前该功能正在马不停蹄开发中，敬请期待",
        type: "warning"
      });
    },
    formPageParams: function(msg, pageIndex, isSplitPage) {
      let nType = 1,
        beginDate = "",
        endDate = "",
        zoneId = "",
        carType = 0,
        isIncludeLower = 1,
        sortName = "",
        sortOrder = "",
        vehicleId = "",
        platformId = "",
        installID = "",
        upLineFlag = "",
        checkUnitID = "",
        checkType = "",
        isOnGuard = "",
        unitId = "",
        targetUserId = "",
        deviceID = "",
        gPSInstalled = "",
        pageSize = 10,
        readPage = "",
        changeSourceType = "",
        operationType = "",
        govStatus = "",
        status = "",
        name = "",
        licenseNumber = "",
        orderCode = "",
        checkState = "";
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
            carType = msgItem.compVal;
            break;
          case reportLabelId.UnitId:
            unitId = msgItem.compId;
            break;
          case reportLabelId.IsIncludeLower:
            isIncludeLower = msgItem.compVal;
            break;
          case reportLabelId.VehicleId:
            vehicleId = msgItem.compId;
            break;
          case reportLabelId.InstallID:
            installID = msgItem.compVal;
            break;
          case reportLabelId.UpLineFlag:
            upLineFlag = msgItem.compVal;
            break;
          case reportLabelId.CheckUnitID:
            checkUnitID = msgItem.compVal;
            break;
          case reportLabelId.CheckType:
            checkType = msgItem.compVal;
            break;
          case reportLabelId.IsOnGuard:
            isOnGuard = msgItem.compVal;
            break;
          case reportLabelId.TargetUserId:
            targetUserId = msgItem.compVal;
            break;
          case reportLabelId.DeviceID:
            deviceID = msgItem.compVal;
            break;
          case reportLabelId.GPSInstalled:
            gPSInstalled = msgItem.compVal;
            break;
          case reportLabelId.ChangeSourceType:
            changeSourceType = msgItem.compVal;
            break;
          case reportLabelId.OperationType:
            operationType = msgItem.compVal;
            break;
          case reportLabelId.GovStatus:
            govStatus = msgItem.compVal;
            break;
          case reportLabelId.Status:
            status = msgItem.compVal;
            break;
          case reportLabelId.Name:
            name = msgItem.compVal;
            break;
          case reportLabelId.LicenseNumber:
            licenseNumber = msgItem.compVal;
            break;
          case reportLabelId.OrderCode:
            orderCode = msgItem.compVal;
            break;
          case reportLabelId.BeginDate:
            beginDate = msgItem.compVal;
            break;
          case reportLabelId.CheckState:
            checkState = msgItem.compVal;
            break;
          default:
        }
      }
      return {
        nType,
        beginDate,
        endDate,
        zoneId,
        carType,
        isIncludeLower,
        sortName,
        sortOrder,
        vehicleId,
        platformId,
        installID,
        upLineFlag,
        checkUnitID,
        checkType,
        isOnGuard,
        unitId,
        targetUserId,
        deviceID,
        gPSInstalled,
        pageSize,
        pageIndex,
        isSplitPage,
        readPage,
        changeSourceType,
        operationType,
        govStatus,
        status,
        name,
        licenseNumber,
        orderCode,
        beginDate,
        checkState
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
    handleEditBtn: function(msg) {
      this.$message({
        message: msg,
        type: "warning"
      });
    },
    // 处理单击查看选项详情
    handleviewOptionDetail: function(msg) {
      this.viewOptionVisible = msg;
    },
    // 处理单击获取新抽查
    handlegetNewChoucha: function(msg) {
      this.getNewChouchaVisible = msg;
    }
  },
  created: function() {
      const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
      this.$emit("viewIn", breadNavs);
    }
};
</script>
