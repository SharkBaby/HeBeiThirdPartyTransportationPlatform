<template>
  <div class="vehicle-qualification">
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
import { axiosRequest, getLastMonth, getLastDay,storageOperation, handleErrorMsg } from "@/common/common";
import {
  commonConfig,
  carTypeOptions,
  reportLabelId,
  provinceVal
} from "@/config/commonConfig";
// 引入权限控制的文件
import { $_hasAccess } from "@/accessmanagement/accessmanagement";
export default {
  name: "VehicleQualification",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "report_vqualification_zone_table",
      activeNameIndex: 0,
      getVehicleQualificationDataUrl:
        commonConfig.rootUrl + commonConfig.ReportAPI.GetVehicleQualificationData,
      exportVehicleQualificationDataUrl:
        commonConfig.rootUrl +
        commonConfig.ReportAPI.ExportVehicleQualificationData,
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
          tabName: "report_vqualification_zone_table", //将作为标识符来区分
          nType: 1, //根据重构前的请求，可以看到nType 为1
          ctrlId: 'tjfx_clzztj_dqhz', //需要权限控制的情况下，需要制定id号
        },
        secTab: {
          tabLabel: "企业汇总",
          tabName: "report_vqualification_company_table", //将作为标识符来区分
          nType: 2, //根据重构前的请求，可以看到nType 为3
          ctrlId: 'tjfx_clzztj_qyhz', //需要权限控制的情况下，需要制定id号
        }
      },
      tabCtntList: [], //基于目前标签页不能使用自定义指令v-hasAccess进行权限管理
    };
  },
  methods: {
    handleClickSearch: function(msg) {
      // 注释原因：添加起始编号
      let startNumber = (msg.currentPage-1) * 10 + 1;
      //处理子组件触发的查询事件
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上s
      // 封装函数来组装每一页请求的参数
      const getVehicleQualificationDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.activeNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.vehicleQualificationSourceData = [];
      axiosRequest
        .axiosGet(this.getVehicleQualificationDataUrl, getVehicleQualificationDataUrlParams)
        .then(function(response) {
          // const detailListTemp = response.data.DetailList;
          // 注释人：向浩
          // 注释时间：2018-07-05
          // 注释原因：车辆资质统计的API数据来自第三方接口，需要使用另外的格式来解析数据
          const detailListTemp = response.data.Table1;
          for (let vehicleQualificationItem of detailListTemp) {
            self.vehicleQualificationSourceData.push(
              self.pushSourceData(vehicleQualificationItem, msg.activeName, startNumber)
            );
            startNumber ++;
          }
          self.tabCtntList[self.activeNameIndex].TabCtnt =
            self.vehicleQualificationSourceData;
          try{
            self.tabCtntList[self.activeNameIndex].total = parseInt(response.data.Table2[0].CountTotal);
          }catch(err){
            self.$message.error('无法正常显示页码');
          }finally{
          }
          self.tabCtntList[self.activeNameIndex].loading = false;
          self.tabCtntList[
            self.activeNameIndex
          ].btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
          // 在某些特殊的Tab需要加上明细 - 平台连通率明细
          self.tabCtntList[self.activeNameIndex].TabCtnt.push(
            self.pushSourceData(response.data.TotalList, msg.activeName)
          );
        })
        .catch(function(error) {
          self.$message({
            type: 'warning',
            message: handleErrorMsg(error)
            })
          self.tabCtntList[self.activeNameIndex].loading = false;
        });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(vehicleQualificationItem, activeName, startNumber) {
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          return {
            sybid: startNumber,
            regionName: vehicleQualificationItem.regionName,
            companyCnt: vehicleQualificationItem.companyCnt,
            qualifiedComCnt: vehicleQualificationItem.qualifiedComCnt,
            qualifiedComRate: vehicleQualificationItem.qualifiedComRate,

            vehicleCount: vehicleQualificationItem.vehicleCount,
            qualifiedVeRate: vehicleQualificationItem.qualifiedVeRate,
            qualifiedRtpRate: vehicleQualificationItem.qualifiedRtpRate,

            qualifiedBlRate: vehicleQualificationItem.qualifiedBlRate,
            qualifiedVeLicRate: vehicleQualificationItem.qualifiedVeLicRate,
            qualified2mRate: vehicleQualificationItem.qualified2mRate,

            qualifiedInvRate: vehicleQualificationItem.qualifiedInvRate,
            qualifiedCiRate: vehicleQualificationItem.qualifiedCiRate,
            qualifiedSiRate: vehicleQualificationItem.qualifiedSiRate
          };
          break;
        case this.tabNameObj.secTab.tabName:
          return {
            sybid: startNumber,
            companyName: vehicleQualificationItem.companyName,
            regionName: vehicleQualificationItem.regionName,
            vehicleCount: vehicleQualificationItem.vehicleCount,
            qualifiedVeRate: vehicleQualificationItem.qualifiedVeRate,
            qualifiedRtpRate: vehicleQualificationItem.qualifiedRtpRate,

            qualifiedBlRate: vehicleQualificationItem.qualifiedBlRate,
            qualifiedVeLicRate: vehicleQualificationItem.qualifiedVeLicRate,
            qualified2mRate: vehicleQualificationItem.qualified2mRate,

            qualifiedInvRate: vehicleQualificationItem.qualifiedInvRate,
            qualifiedCiRate: vehicleQualificationItem.qualifiedCiRate,
            qualifiedSiRate: vehicleQualificationItem.qualifiedSiRate
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
      const exportVehicleQualificationDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.activeNameIndex].loading = true; //下载数据的时候，显示正在下载数据的logo
      axiosRequest
        .axiosGet(
          this.exportVehicleQualificationDataUrl,
          exportVehicleQualificationDataUrlParams
        )
        .then(function(response) {
          self.downloadServerFile(decodeURIComponent(response.data));
          // 下载完成后，隐藏正在下载的logo
          self.tabCtntList[self.activeNameIndex].loading = false;
        })
        .catch(function(error) {
          self.$message({
            type: 'warning',
            message: handleErrorMsg(error)
            })
          self.tabCtntList[self.activeNameIndex].loading = false;
        });
    },
    formPageParams: function(msg, pageIndex, activeName, isSplitPage) {
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
              ctrlId: 'tjfx_clzztj_dqhz_cx', //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: 'tjfx_clzztj_dqhz_dc', //需要权限控制的情况下，需要制定id号
            }
          ],
          searchCreteria: [
            {
              searchType: "input",
              labelName: "地区:",
              labelId: reportLabelId.ZoneId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
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
              headerKey: "regionName",
              headerVal: "地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "companyCnt",
              headerVal: "企业数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedComCnt",
              headerVal: "车辆资质合格企业数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedComRate",
              headerVal: "车辆资质合格企业率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              labelName: "车辆资质",
              subHeaders: [
                {
                  headerKey: "vehicleCount",
                  headerVal: "车辆数",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                },
                {
                  headerKey: "qualifiedVeRate",
                  headerVal: "车辆资质总合格率",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                },
                {
                  headerKey: "qualifiedRtpRate",
                  headerVal: "道路运输证合格率",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                },
                {
                  headerKey: "qualifiedBlRate",
                  headerVal: "经营许可证合格率",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                },
                {
                  headerKey: "qualifiedVeLicRate",
                  headerVal: "行驶证合格率",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                },
                {
                  headerKey: "qualified2mRate",
                  headerVal: "二级维护卡合格率",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                },
                {
                  headerKey: "qualifiedInvRate",
                  headerVal: "车辆保险合格率",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                },
                {
                  headerKey: "qualifiedCiRate",
                  headerVal: "交强险合格率",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                },
                {
                  headerKey: "qualifiedSiRate",
                  headerVal: "承运人责任险合格率",
                  ssubHeaders: [],
                  columnType: this.columnType.text
                }
              ]
            }
          ],
          TabCtnt: [
            // {
            //   sysbid: "2016-05-03",
            //   regionName: "王小虎",
            //   companyCnt: "普陀区",
            //   qualifiedComCnt: "上海市普陀区金沙江路 1518 弄"
            // },
            // {
            //   sysbid: "2016-05-03",
            //   regionName: "王小虎",
            //   companyCnt: "普陀区",
            //   qualifiedComCnt: "上海市普陀区金沙江路 1518 弄"
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
              ctrlId: 'tjfx_clzztj_qyhz_cx', //需要权限控制的情况下，需要制定id号
            },
            {
              iconName: "el-icon-download",
              btnId: "export_data", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "导出数据",
              isDisabled: true, //控制导出数据按钮初始状态为disabled
              ctrlId: 'tjfx_clzztj_qyhz_dc', //需要权限控制的情况下，需要制定id号
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
              labelName: "地区:",
              labelId: reportLabelId.ZoneId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
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
              headerKey: "companyName",
              headerVal: "企业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "regionName",
              headerVal: "地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "vehicleCount",
              headerVal: "车辆数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedVeRate",
              headerVal: "车辆资质总合格率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedRtpRate",
              headerVal: "道路运输证合格率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedBlRate",
              headerVal: "经营许可证合格率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedVeLicRate",
              headerVal: "行驶证合格率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualified2mRate",
              headerVal: "二级维护卡合格率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedInvRate",
              headerVal: "车辆保险合格率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedCiRate",
              headerVal: "交强险合格率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "qualifiedSiRate",
              headerVal: "承运人责任险合格率",
              subHeaders: [],
              columnType: this.columnType.text
            },
          ],
          TabCtnt: [
            // {
            //   sybid: "2016-05-03",
            //   companyName: "王小虎",
            //   regionName: "上海",
            //   vehicleCount: "普陀区"
            // },
            // {
            //   sybid: "2016-05-03",
            //   companyName: "王小虎",
            //   regionName: "上海",
            //   vehicleCount: "普陀区"
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
