<template>
  <div class="vehicle">
    <multi-level-no-tab-component
    :tabCtntList="tabCtntList" 
    class="vehicle-multilevel" 
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"></multi-level-no-tab-component>
  </div>
</template>

<style src="./baseInfoRouter.css" type="text/css">
</style>

<script>
import MultiLevelNoTabComponent from "@/components/MultiLevelNoTabComponent/MultiLevelNoTabComponent";
import { axiosRequest, getLastMonth, getLastDay, storageOperation,handleErrorMsg } from "@/common/common";
import { commonConfig, reportLabelId, provinceVal } from "@/config/commonConfig";
export default {
  name: "Vehicle",
  components: {
    MultiLevelNoTabComponent
  },
  data() {
    return {
      getBaseVehInfoDataUrl:
        commonConfig.rootUrl + commonConfig.BaseInfoAPI.GetBaseVehInfoData,
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
      vehicleSourceData: [],
      // 存储合计的数据
      countData: []
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
            btnName: "查询",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_clgl_cx', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          }
        ],
        searchCreteria: [
          {
            searchType: "input",
            labelName: "车牌号",
            labelId: reportLabelId.Licenseplat, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: "",
            compId: "" // 在需要使用预搜索的输入框需要compId字段
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
            labelName: "所属单位",
            labelId: reportLabelId.UnitId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: "",
            compId: ""
          },
          {
            searchType: "input",
            labelName: "接入平台",
            labelId: reportLabelId.PlatformId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: "",
            compId: "" // 在需要使用预搜索的输入框需要compId字段
          },
          {
            searchType: "checkbox",
            labelName: "车辆类型",
            labelId: reportLabelId.CarType, //该ID主要是用来判断在子组件中出发了哪一种个子组件
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
                label: "旅游包车"
              },
              {
                value: 0x0002,
                label: "超长客运"
              },
              {
                value: 0x0080, // this value is customized by Perry,not securate
                label: "危险品运输车"
              },
              {
                value: 0x0010,
                label: "重型货运车"
              },
              {
                value: 0x0020, // this value is customized by Perry,not securate
                label: "牵引车"
              },
              {
                value: 0x100000,
                label: "包车客车"
              }
            ]
          },
          {
            searchType: "select",
            labelName: "已安装GPS",
            labelId: reportLabelId.GPSInstalled, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: -1,
            options: [
              {
                value: -1,
                label: "全部"
              },
              {
                value: 1,
                label: "已安装"
              },
              {
                value: 0,
                label: "未安装"
              }
            ]
          },
          {
            searchType: "singleChkbox",
            labelName: "是否已删除",
            labelId: reportLabelId.Status, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
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
                value: 0x1,
                label: "报废"
              },
              {
                value: 0x4,
                label: "停运"
              },
              {
                value: 0x8,
                label: "注销"
              },
              {
                value: 0x10,
                label: "转出"
              },
              {
                value: 0x20,
                label: "挂失"
              },
              {
                value: 0x40,
                label: "歇业"
              },
              {
                value: 0x100,
                label: "锁定"
              },
              {
                value: 0x80,
                label: "删除"
              }
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
            headerKey: "Licenseplat",
            headerVal: "车牌号",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "Platecolor",
            headerVal: "车牌颜色",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "UnitName",
            headerVal: "所属企业",
            subHeaders: [],
            columnType: this.columnType.text,
            width:240
          },
          {
            headerKey: "LogicUnitName",
            headerVal: "运营机构",
            subHeaders: [],
            columnType: this.columnType.text,
            width:200
          },
          {
            headerKey: "GnssCenterName",
            headerVal: "接入平台",
            subHeaders: [],
            columnType: this.columnType.text,
            width:180
          },
          {
            headerKey: "VehicleType",
            headerVal: "车辆类型",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "Bs",
            headerVal: "经营范围",
            subHeaders: [],
            columnType: this.columnType.text,
            width:180
          },
          {
            headerKey: "Owner",
            headerVal: "车主姓名",
            subHeaders: [],
            columnType: this.columnType.text,
            width:240
          },
          {
            headerKey: "OwnerTel",
            headerVal: "车主电话",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "ZoneName",
            headerVal: "车辆籍贯地",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "TransportNo",
            headerVal: "道路运输证号",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "BEGIN",
            headerVal: "道路运输证时间起",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "END",
            headerVal: "道路运输证时间止",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "SeatTon",
            headerVal: "座位或吨位",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "Optional",
            headerVal: "车台配置参数",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "Gpspa",
            headerVal: "拍照参数",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "Vediopa",
            headerVal: "视频参数",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "GpsInstalled",
            headerVal: "GPS安装",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "GPSLastDate",
            headerVal: "最后一次定位",
            subHeaders: [],
            columnType: this.columnType.text,
            width:180
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
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_clgl_cx'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const getBaseVehInfoDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.isSplitPage
      );
      self.tabCtntList.loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.vehicleSourceData = [];
      axiosRequest.axiosGet(this.getBaseVehInfoDataUrl, getBaseVehInfoDataUrlParams)
        .then(function(response) {
          const vehicleRankTemp = response.data.DetailList;
          for (let vehicleItem of vehicleRankTemp) {
            self.vehicleSourceData.push(self.pushSourceData(vehicleItem));
          }
          // 加上合计这一行
          // self.countData = self.pushSourceData(response.data.TotalList);
          self.tabCtntList.TabCtnt = self.vehicleSourceData;
          // self.tabCtntList.TabCtnt.push(self.countData);
          self.tabCtntList.total = response.data.CountTotal;
          self.tabCtntList.loading = false;
          // self.tabCtntList.btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
        })
        .catch(function(error) {
          self.$message.error(handleErrorMsg(error));
        });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(vehicleItem) {
      return {
        sybid: vehicleItem.sybid,
        Licenseplat: vehicleItem.Licenseplat,
        Platecolor: vehicleItem.Platecolor,
        UnitName: vehicleItem.UnitName,
        LogicUnitName: vehicleItem.LogicUnitName,
        GnssCenterName: vehicleItem.GnssCenterName,
        VehicleType: vehicleItem.VehicleType,
        Bs: vehicleItem.Bs,
        Owner: vehicleItem.Owner,
        OwnerTel: vehicleItem.OwnerTel,
        ZoneName: vehicleItem.ZoneName,
        TransportNo: vehicleItem.TransportNo,
        BEGIN: vehicleItem.BEGIN,
        END: vehicleItem.END,
        SeatTon: vehicleItem.SeatTon,
        Optional: vehicleItem.Optional,
        Gpspa: vehicleItem.Gpspa,
        Vediopa: vehicleItem.Vediopa,
        GpsInstalled: vehicleItem.GpsInstalled,
        GPSLastDate: vehicleItem.GPSLastDate
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
      let zoneId = "",
        unitId = "",
        licenseplat = "",
        platformId = "",
        carType = 0,
        gPSInstalled = "",
        govStatus = 0,
        status = "",
        
        pageSize = 10,
        readPage = "";
      //统一为每一种类型赋值，而不需要单独判断
      for (let msgItem of msg) {
        switch (msgItem.labelId) {
          case reportLabelId.ZoneId:
            zoneId = msgItem.compId;
            break;
          case reportLabelId.UnitId:
            unitId = msgItem.compId;
            break;
          case reportLabelId.Licenseplat:
            licenseplat = msgItem.compVal;
            break;
          case reportLabelId.PlatformId:
            platformId = msgItem.compId;
            break;
          case reportLabelId.CarType:
            for(let item of msgItem.compVal){
              carType += item;
            }
            break;
          case reportLabelId.GPSInstalled:
            gPSInstalled = msgItem.compVal;
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
        zoneId,
        unitId,
        licenseplat,
        platformId,
        carType,
        gPSInstalled,
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
    }
  },
  beforeMount: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
