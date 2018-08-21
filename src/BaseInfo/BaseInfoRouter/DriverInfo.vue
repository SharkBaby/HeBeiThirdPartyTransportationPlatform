<template>
  <div class="driver-info">
    <multi-level-no-tab-component
    :tabCtntList="tabCtntList" 
    class="driver-info-multilevel" 
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"
    v-on:handleEditBtn="handleEditBtn"
    v-on:handleAddEvent="handleAddEvent"></multi-level-no-tab-component>
  </div>
</template>

<style src="./baseInfoRouter.css" type="text/css">
</style>

<script>
import MultiLevelNoTabComponent from "@/components/MultiLevelNoTabComponent/MultiLevelNoTabComponent";
import { axiosRequest, getLastMonth, getLastDay, isNullUndefEmpty, storageOperation,handleErrorMsg  } from "@/common/common";
import {
  commonConfig,
  reportLabelId,
  provinceVal
} from "@/config/commonConfig";
export default {
  name: "DriverInfo",
  components: {
    MultiLevelNoTabComponent
  },
  data() {
    return {
      getDriverDataUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.GetDriverData,
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
      userInfoSourceData: [],
      // 存储合计的数据
      countData: []
    };
  },
  computed: {
    tabCtntList: function() {
      return {
        currentPage: 1, //当前页数
        isDriverInfo: true, //目前驾驶员管理页面没有实现分页功能，故隐藏分页的组件
        total: 0, //总条数
        loading: false,
        btnEvents: [
          {
            iconName: "el-icon-search",
            btnId: commonConfig.btnEventsId.search, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "查询",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_jsygl_cx', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          }
        ],
        searchCreteria: [
          {
            searchType: "input",
            labelName: "驾驶员姓名",
            labelId: reportLabelId.Name, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          }
        ],
        tabHeader: [
          {
            headerKey: "sybid",
            headerVal: "序号",
            subHeaders: []
          },
          {
            headerKey: "Name",
            headerVal: "姓名",
            subHeaders: []
          },
          {
            headerKey: "Sex",
            headerVal: "性别",
            subHeaders: []
          },
          {
            headerKey: "BirthDate",
            headerVal: "出生日期",
            subHeaders: []
          },
          {
            headerKey: "Nature",
            headerVal: "民族",
            subHeaders: []
          },
          {
            headerKey: "IDNumber",
            headerVal: "身份证",
            subHeaders: []
          },
          {
            headerKey: "Education",
            headerVal: "文化",
            subHeaders: []
          },
          {
            headerKey: "Tel",
            headerVal: "手机号码",
            subHeaders: []
          },
          {
            headerKey: "UnitName",
            headerVal: "所属公司",
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
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_jsygl_cx'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const getDriverDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.isSplitPage
      );
      self.tabCtntList.loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.userInfoSourceData = [];
      axiosRequest.axiosGet(this.getDriverDataUrl, getDriverDataUrlParams)
        .then(function(response) {
          if(!isNullUndefEmpty(response.data)){
            const driverInfoTemp = response.data;
            for (let driverInfoItem in driverInfoTemp) {
              self.userInfoSourceData.push(self.pushSourceData(parseInt(driverInfoItem)+1, driverInfoTemp[driverInfoItem]));
            }
            // 加上合计这一行
            // self.countData = self.pushSourceData(response.data.TotalList);
            self.tabCtntList.TabCtnt = self.userInfoSourceData;
            self.tabCtntList.loading = false;
            // self.tabCtntList.TabCtnt.push(self.countData);
            self.tabCtntList.total = response.data.CountTotal;
            self.tabCtntList.btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
          }else {
            self.tabCtntList.loading = false;
            self.tabCtntList.TabCtnt = [];
          }
        })
        .catch(function(error) {
          self.$message.error(handleErrorMsg(error));
        });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(driverInfoItem, driverInfoTemp) {
      return {
        sybid: driverInfoItem,
        Name: driverInfoTemp.Name,
        Sex: driverInfoTemp.Sex,
        BirthDate: driverInfoTemp.BirthDate,
        Nature: driverInfoTemp.Nature,
        IDNumber: driverInfoTemp.IDNumber,
        Education: driverInfoTemp.Education,
        Tel: driverInfoTemp.Tel,
        UnitName: driverInfoTemp.UnitName
      };
    },
    // 注释人：向浩
    // 注释时间：2018-06-12
    // 注释原因：实现导出数据功能
    handleClickExpData: function(msg) {
      //处理子组件触发的导出数据事件
      const self = this;
      self.tabCtntList.loading = true; //下载数据的时候，显示正在下载数据的logo
      // 封装函数来组装每一页请求的参数
      const GetCheckManageByZoneParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.isSplitPage //是否分页 - 导出数据
      );
      axiosRequest
        .axiosGet(this.exportCheckManageDataUrl, GetCheckManageByZoneParams)
        .then(function(response) {
          self.downloadServerFile(decodeURIComponent(response.data));
          // 下载完成后，隐藏正在下载的logo
          self.tabCtntList.loading = false;
        })
        .catch(function(error) {
          self.$message.error(handleErrorMsg(error));
        });
    },
    formPageParams: function(msg, pageIndex, isSplitPage) {
      let driverName = "",
      
        pageSize = 10,
        readPage = "";;
      //统一为每一种类型赋值，而不需要单独判断
      for (let msgItem of msg) {
        switch (msgItem.labelId) {
          case reportLabelId.Name:
            driverName = msgItem.compVal; //如果没有输入此字段，将隐藏这个字段向后台传输
            break;
          default:
        }
      }
      return {
        driverName,
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
    handleEditBtn: function(msg) {
      this.$message({
        message: msg,
        type: "warning"
      });
    },
    handleAddEvent: function(msg){
      this.$message({
        message: msg + '恭喜你，点击了增加事件，目前该功能正在马不停蹄开发中，敬请期待',
        type: "warning"
      });
    }
  },
  beforeMount: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
