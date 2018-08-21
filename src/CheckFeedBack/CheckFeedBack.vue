<template>
  <div class="check-feedback">
    <multi-level-no-tab-component
    :tabCtntList="tabCtntList" 
    class="check-feedback-multilevel"
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"
    v-on:handleAddEvent="handleAddEvent"></multi-level-no-tab-component>
    <add-check-feedback-form :addchkfdbkformVisible="addchkfdbkformVisible" v-on:handleAddEvent="handleAddEvent" :columnName="tabHeader"></add-check-feedback-form>
  </div>
</template>

<style src="./checkFeedBack.css" type="text/css">
</style>

<script>
import MultiLevelTableComponent from "@/components/MultiLevelTableComponent/MultiLevelTableComponent";
import MultiLevelNoTabComponent from "@/components/MultiLevelNoTabComponent/MultiLevelNoTabComponent";
import AddCheckFeedbackForm from "@/CheckFeedBack/AddCheckFeedbackForm/AddCheckFeedbackForm";
import { axiosRequest, getLastDay, storageOperation } from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "CheckFeedBack",
  components: {
    MultiLevelTableComponent,
    AddCheckFeedbackForm,
    MultiLevelNoTabComponent
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
      zoneCheckSourceData: [],
      // 存储合计的数据
      countData: [],
      // tabName作为标识符
      tabNameObj: {
        firTab: {
          tabLabel: "检查回执单",
          tabName: "check_feedback_table", //将作为标识符来区分
          nType: 1 //根据重构前的请求，可以看到nType 为1
        }
      },
      addchkfdbkformVisible: false, // 隐藏“添加”表单
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
          headerKey: "BreakDetail",
          headerVal: "违章情况"
        },
        {
          headerKey: "DealDetail",
          headerVal: "处理情况"
        },
        {
          headerKey: "Notes",
          headerVal: "备注"
        }
      ]
    };
  },
  computed: {
    tabCtntList: function() {
      return {
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
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'xtsz_jchzd_cx', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-circle-plus-outline",
            btnId: "add", //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "增加",
            isDisabled: false, //控制导出数据按钮初始状态为disabled
            ctrlId: 'xtsz_jchzd_zj', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-download",
            btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "导出数据",
            isDisabled: true, //控制导出数据按钮初始状态为disabled
            ctrlId: 'xtsz_jchzd_dc', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          }
        ],
        searchCreteria: [
          {
            searchType: "input",
            labelName: "单号:",
            labelId: "OrderId", //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: "0",
            compId: "0" // 在需要使用预搜索的输入框需要compId字段
          }
        ],
        tabHeader: [
          {
            headerKey: "sybid",
            headerVal: "序号",
            subHeaders: []
          },
          {
            headerKey: "OrderID",
            headerVal: "单号",
            subHeaders: []
          },
          {
            headerKey: "LicensePlat",
            headerVal: "企业",
            subHeaders: []
          },
          {
            headerKey: "BreakDetail",
            headerVal: "违章情况",
            subHeaders: []
          },
          {
            headerKey: "DealDetail",
            headerVal: "处理情况",
            subHeaders: []
          },
          {
            headerKey: "Notes",
            headerVal: "备注",
            subHeaders: []
          }
        ],
        TabCtnt: []
      };
    }
  },
  methods: {
    //处理子组件触发的查询事件
    handleClickSearch: function(msg) {
      const self = this;
      // storageOperation.setItem(commonConfig.ctrlId, 'xtsz_jchzd_cx'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // // 封装函数来组装每一页请求的参数
      // const GetCheckManageByZoneParams = self.formPageParams(
      //   msg.searchCreteria,
      //   msg.currentPage,
      //   msg.isSplitPage
      // );
      // self.tabCtntList.loading = true; //加载数据的时候，显示加载数据的logo
      // // 清空当前数据的集合
      // self.zoneCheckSourceData = [];
      // axiosRequest.axiosGet(this.getCheckManageByZoneUrl, GetCheckManageByZoneParams)
      //   .then(function(response) {
      //     const zoneCheckRankTemp = response.data.DetailList;
      //     for (let zoneCheckItem of zoneCheckRankTemp) {
      //       self.zoneCheckSourceData.push(self.pushSourceData(zoneCheckItem));
      //     }
      //     // 加上合计这一行
      //     self.countData = self.pushSourceData(response.data.TotalList);
      //     self.tabCtntList.TabCtnt = self.zoneCheckSourceData;
      //     self.tabCtntList.TabCtnt.push(self.countData);
      //     self.tabCtntList.total = response.data.CountTotal;
      //     self.tabCtntList.loading = false;
      //     self.tabCtntList.btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
      //   })
      //   .catch(function(error) {});
      this.$message({
        message:
          "恭喜你点击了检查回执单-查询事件，目前该功能正在马不停蹄开发中，敬请期待",
        type: "warning"
      });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(zoneCheckItem) {
      return {
        sybid: zoneCheckItem.sybid,
        ZName: zoneCheckItem.ZName,
        AllInstallCount: zoneCheckItem.AllInstallCount,
        InstallCount: zoneCheckItem.InstallCount,
        InstallRate: zoneCheckItem.InstallRate,
        InstallScore: zoneCheckItem.InstallScore,
        InnetCount: zoneCheckItem.InnetCount,
        UplineCount: zoneCheckItem.UplineCount,
        UplineRate: zoneCheckItem.UplineRate,
        UplineScore: zoneCheckItem.UplineScore,
        DriftInnetCount: zoneCheckItem.DriftInnetCount,
        DriftCount: zoneCheckItem.DriftCount,
        DriftRate: zoneCheckItem.DriftRate,
        DriftScore: zoneCheckItem.DriftRate,
        AllDistance: zoneCheckItem.AllDistance,
        InteDistance: zoneCheckItem.InteDistance,
        LocInteRate: zoneCheckItem.LocInteRate,
        LocInteScore: zoneCheckItem.LocInteScore,
        AllLoc: zoneCheckItem.AllLoc,
        ValidLoc: zoneCheckItem.ValidLoc,
        ValidRate: zoneCheckItem.ValidRate,
        ValidScore: zoneCheckItem.ValidScore,
        Score: zoneCheckItem.Score,
        LinkRelativeRatio: zoneCheckItem.LinkRelativeRatio
      };
    },
    // 注释人：向浩
    // 注释时间：2018-06-12
    // 注释原因：实现导出数据功能
    handleClickExpData: function(msg) {
      //处理子组件触发的导出数据事件
      const self = this;
      self.tabCtntList.loading = false;
      // self.tabCtntList.loading = true; //下载数据的时候，显示正在下载数据的logo
      // // 封装函数来组装每一页请求的参数
      // const GetCheckManageByZoneParams = self.formPageParams(
      //   msg.searchCreteria,
      //   msg.currentPage,
      //   msg.isSplitPage //是否分页 - 导出数据
      // );
      // axiosRequest.axiosGet(this.exportCheckManageDataUrl, GetCheckManageByZoneParams)
      //   .then(function(response) {
      //     self.downloadServerFile(decodeURIComponent(response.data));
      //     // 下载完成后，隐藏正在下载的logo
      //     self.tabCtntList.loading = false;
      //   })
      //   .catch(function(error) {});
      this.$message({
        message:
          "恭喜你点击了检查回执单-导出数据事件，目前该功能正在马不停蹄开发中，敬请期待",
        type: "warning"
      });
    },
    formPageParams: function(msg, pageIndex, isSplitPage) {
      let nType = 1,
        vehicleId = "", //入网明细 - 车牌号
        zoneId = "", //入网明细 - 所属地区
        platformId = "", //入网明细 - 接入平台
        unitId = "", //入网明细 - 运输企业
        endDate = "", //入网明细 - 日期止
        carType = 0, //入网明细 - 车辆类型：
        installID = "", //入网明细 - GPS入网情况
        upLineFlag = "", //上线明细 - 上线情况
        beginDate = "", //上线明细 - 事件止
        isOnGuard = "", //平台查岗响应率明细 - 是否在岗
        checkType = "", //平台查岗响应率明细 - 查岗方式
        checkUnitID = "", //平台查岗响应率明细 - 查岗机构
        targetUserId = "", //平台查岗响应率明细 - 查岗人
        pageSize = 10, //默认参数 - 分页大小
        readPage = "", //默认参数 - 目前还不清楚这个参数的作用
        isIncludeLower = 1,
        sortName = "",
        sortOrder = "";
      nType = this.tabNameObj.firTab.nType;
      for (let msgItem of msg) {
        if (msgItem.labelId === "ZoneId") zoneId = msgItem.compId;
        else if (msgItem.labelId === "DatePicker") {
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
        } else if (msgItem.labelId === "CarType") {
          for (let carItem of msgItem.compVal) {
            carType += carItem;
          }
        } else if (msgItem.labelId === "IsIncludeLower")
          isIncludeLower = Number(msgItem.compVal);
      }
      return {
        nType,
        vehicleId, //入网明细 - 车牌号
        zoneId, //入网明细 - 所属地区
        platformId, //入网明细 - 接入平台
        unitId, //入网明细 - 运输企业
        endDate, //入网明细 - 日期止
        carType, //入网明细 - 车辆类型：
        installID, //入网明细 - GPS入网情况
        upLineFlag,
        beginDate,

        isOnGuard,
        checkType,
        checkUnitID,
        targetUserId,

        isSplitPage, //默认参数 - 是否分页
        pageSize, //默认参数 - 分页大小
        readPage, //默认参数 - 目前还不清楚这个参数的作用

        isIncludeLower,
        sortName,
        sortOrder,
        pageIndex
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
    // 相应子组件单击增加按钮，弹出表单
    handleAddEvent(message) {
      this.addchkfdbkformVisible = message;
    }
  },
  created: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
