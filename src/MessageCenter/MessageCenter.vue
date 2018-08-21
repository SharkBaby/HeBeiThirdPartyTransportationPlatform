<template>
  <div class="message-center">
    <multi-level-table-component 
    :activeName="activeName" 
    :tabCtntList="tabCtntList" 
    class="message-center-multilevel" 
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"></multi-level-table-component>
  </div>
</template>

<style src="./messageCenter.css" type="text/css">
</style>

<script>
import MultiLevelTableComponent from "@/components/MultiLevelTableComponent/MultiLevelTableComponent";
import { axiosRequest, getLastMonth, getLastDay, storageOperation } from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "ZoneCheckRank",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "messages_checksentry_table",
      activeNameIndex: 0,
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
          tabLabel: "查岗",
          tabName: "messages_checksentry_table", //将作为标识符来区分
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
          btnEvents: [],
          searchCreteria: [],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: []
            },
            {
              headerKey: "content",
              headerVal: "查岗问题",
              subHeaders: []
            },
            {
              headerKey: "loginCode",
              headerVal: "查岗人",
              subHeaders: []
            },
            {
              headerKey: "unitName",
              headerVal: "查岗机构",
              subHeaders: []
            },
            {
              headerKey: "checkTime",
              headerVal: "查岗时间",
              subHeaders: []
            },{
              headerKey: "responseStatus",
              headerVal: "查岗应答",
              subHeaders: []
            },{
              headerKey: "responseStatus", //需要double confirm字段的headerKey为什么和查岗应答一致
              headerVal: "响应状态",
              subHeaders: []
            },{
              headerKey: "responseStatus",
              headerVal: "查岗应答",
              subHeaders: []
            },{
              headerKey: "responseTime",
              headerVal: "响应时间",
              subHeaders: []
            }
          ],
          TabCtnt: [
            // {
            //   ZName: "2016-05-03",
            //   AllInstallCount: "王小虎",
            //   InstallCount: "上海",
            //   InstallRate: "普陀区",
            //   InstallScore: "上海市普陀区金沙江路 1518 弄",
            //   InnetCount: 200333
            // },
            // {
            //   ZName: "2016-05-03",
            //   AllInstallCount: "王小虎",
            //   InstallCount: "上海",
            //   InstallRate: "普陀区",
            //   InstallScore: "上海市普陀区金沙江路 1518 弄",
            //   InnetCount: 200333
            // },
            // {
            //   ZName: "2016-05-03",
            //   AllInstallCount: "王小虎",
            //   InstallCount: "上海",
            //   InstallRate: "普陀区",
            //   InstallScore: "上海市普陀区金沙江路 1518 弄",
            //   InnetCount: 200333
            // },
            // {
            //   ZName: "2016-05-03",
            //   AllInstallCount: "王小虎",
            //   InstallCount: "上海",
            //   InstallRate: "普陀区",
            //   InstallScore: "上海市普陀区金沙江路 1518 弄",
            //   InnetCount: 200333
            // },
            // {
            //   ZName: "2016-05-03",
            //   AllInstallCount: "王小虎",
            //   InstallCount: "上海",
            //   InstallRate: "普陀区",
            //   InstallScore: "上海市普陀区金沙江路 1518 弄",
            //   InnetCount: 200333
            // },
            // {
            //   ZName: "2016-05-03",
            //   AllInstallCount: "王小虎",
            //   InstallCount: "上海",
            //   InstallRate: "普陀区",
            //   InstallScore: "上海市普陀区金沙江路 1518 弄",
            //   InnetCount: 200333
            // }
          ]
        }
      ];
    }
  },
  methods: {
    //处理子组件触发的查询事件
    handleClickSearch: function(msg) {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const GetCheckManageByZoneParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.activeNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.zoneCheckSourceData = [];
      axiosRequest.axiosGet(this.getCheckManageByZoneUrl, GetCheckManageByZoneParams)
        .then(function(response) {
          const zoneCheckRankTemp = response.data.DetailList;
          for (let zoneCheckItem of zoneCheckRankTemp) {
            self.zoneCheckSourceData.push(
              self.pushSourceData(zoneCheckItem, msg.activeName)
            );
          }
          // 加上合计这一行
          self.countData = self.pushSourceData(
            response.data.TotalList,
            msg.activeName
          );
          self.tabCtntList[self.activeNameIndex].TabCtnt =
            self.zoneCheckSourceData;
          self.tabCtntList[self.activeNameIndex].TabCtnt.push(self.countData);
          self.tabCtntList[self.activeNameIndex].total =
            response.data.CountTotal;
          self.tabCtntList[self.activeNameIndex].loading = false;
          self.tabCtntList[
            self.activeNameIndex
          ].btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
        })
        .catch(function(error) {});
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(zoneCheckItem, activeName) {
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
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
      storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      self.tabCtntList[self.activeNameIndex].loading = true; //下载数据的时候，显示正在下载数据的logo
      // 封装函数来组装每一页请求的参数
      const GetCheckManageByZoneParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      axiosRequest.axiosGet(this.exportCheckManageDataUrl, GetCheckManageByZoneParams)
        .then(function(response) {
          self.downloadServerFile(decodeURIComponent(response.data));
          // 下载完成后，隐藏正在下载的logo
          self.tabCtntList[self.activeNameIndex].loading = false;
        })
        .catch(function(error) {});
    },
    formPageParams: function(msg, pageIndex, activeName, isSplitPage) {
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
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          this.activeNameIndex = 0;
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
        default:
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
    }
  },
  created: function(){
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
