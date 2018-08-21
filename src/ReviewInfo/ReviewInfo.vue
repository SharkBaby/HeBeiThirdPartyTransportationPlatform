<template>
  <el-row class="review-info">
    <el-row class="review-info-top">
      <el-col :span="8" v-for="(complainItem, complainKey) of complainItems" :key="complainKey">
        <complain-component :complainItem="complainItem"></complain-component>
      </el-col>
    </el-row>
    <el-row class="review-info-bottom">
      <el-col :span="16" class="review-info-bottom-left">
        <el-row class="review-info-bottom-left-content">
          <multi-level-table-component 
          :activeName="activeName" 
          :tabCtntList="tabCtntList" 
          class="zone-check-multilevel"
          v-on:handleClickSearch="handleClickSearch"
          v-on:handleClickExpData="handleClickExpData"
          v-on:handleCurrentChange="handleCurrentChange"></multi-level-table-component>
        </el-row>
      </el-col>
      <el-col :span="8" class="review-info-bottom-right">
        <el-row class="review-info-bottom-right-top">
          <pie-component :pieEcharts="pieEcharts"></pie-component>
        </el-row>
        <el-row class="review-info-bottom-right-bottom">
          <el-table 
          ref="singleTable"
          :data="complainRankTabCtntList.TabCtnt"
          highlight-current-row
          max-height="325"
          style="width: 100%" 
          :default-sort="{prop: 'date', order: 'descending'}"
          row-class-name="table-body-row-class-name"
          header-cell-class-name="table-cell-class-name"
          class="multi-level-no-table">
          <el-table-column 
          :prop="tabHeaderItem.headerKey" 
          :label="tabHeaderItem.headerVal" 
          v-for="(tabHeaderItem,tabHeaderKey) in complainRankTabCtntList.tabHeader" 
          :key="tabHeaderKey"
          align="center"
          header-align="center">
            <template slot-scope="scope"> 
              <router-link :to="tabHeaderItem.router_link" v-if="tabHeaderItem.columnType === columnType.router_link" class="table-router-link">{{scope.row[tabHeaderItem.headerKey]}}</router-link>
              <p v-else>{{scope.row[tabHeaderItem.headerKey]}}</p>
            </template>
          </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>
<style type="text/css" src="./reviewInfo.css"></style>
<script>
import ComplainComponent from "@/components/ComplainComponent/ComplainComponent";
import MultiLevelTableComponent from "@/components/MultiLevelTableComponent/MultiLevelTableComponent";
import PieComponent from "@/components/PieComponent/PieComponent";
import { storageOperation } from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "ReviewInfo",
  components: {
    ComplainComponent,
    MultiLevelTableComponent,
    PieComponent
  },
  data: function() {
    return {
      complainItems: [
        {
          title: "乘客对司机投诉",
          reviewNumNo: 7,
          reviewNum: 14
        },
        {
          title: "企业对第三方监测平台投诉",
          reviewNumNo: 2,
          reviewNum: 3
        },
        {
          title: "行业对第三方监测平台投诉",
          reviewNumNo: 3,
          reviewNum: 5
        }
      ],
      // 以下是对乘客对司机/企业对第三方检测平台/行业对第三方检测平台的常量定义
      activeName: "high-review-num-no",
      activeNameIndex: 0,
      getVehicleInstallDataUrl:
        commonConfig.rootUrl +
        commonConfig.StatisticConst.GetVehicleInstallData,
      exportVehicleInstallDataUrl:
        commonConfig.rootUrl +
        commonConfig.StatisticConst.ExportVehicleInstallData,
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
          tabLabel: "乘客对司机投诉",
          tabName: "high-review-num-no", //将作为标识符来区分
          nType: 1 //根据重构前的请求，可以看到nType 为1
        },
        secTab: {
          tabLabel: "企业对第三方监测平台投诉",
          tabName: "low-review-num-no", //将作为标识符来区分
          nType: 2 //根据重构前的请求，可以看到nType 为2
        },
        thiTab: {
          tabLabel: "行业对第三方监测平台投诉",
          tabName: "all-review-num-no", //将作为标识符来区分
          nType: 3 //根据重构前的请求，可以看到nType 为3
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
              headerKey: "LicensePlat",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainant",
              headerVal: "投诉人",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainType",
              headerVal: "投诉类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainTime",
              headerVal: "投诉时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "status",
              headerVal: "状态",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "comments",
              headerVal: "备注",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "detail",
              headerVal: "详情",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            {
              LicensePlat: "2016-05-03",
              complainant: "上海",
              complainType: "上海市普陀区金沙江路 1518 弄",
              complainTime: "王小虎",
              status: "普陀区"
            },
            {
              LicensePlat: "2016-05-03",
              complainant: "上海",
              complainType: "上海市普陀区金沙江路 1518 弄",
              complainTime: "王小虎",
              status: "普陀区"
            }
          ]
        },
        {
          tabLabel: this.tabNameObj.secTab.tabLabel,
          tabName: this.tabNameObj.secTab.tabName, //将作为标识符来区分
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [],
          searchCreteria: [],
          tabHeader: [
            {
              headerKey: "complainCompany",
              headerVal: "投诉企业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainant",
              headerVal: "投诉人",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainType",
              headerVal: "投诉类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainTime",
              headerVal: "投诉时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "status",
              headerVal: "状态",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "comments",
              headerVal: "备注",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "detail",
              headerVal: "详情",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            {
              complainCompany: "2016-05-03",
              complainant: "上海",
              complainType: "上海市普陀区金沙江路 1518 弄",
              complainTime: "王小虎",
              status: "普陀区"
            },
            {
              complainCompany: "2016-05-03",
              complainant: "上海",
              complainType: "上海市普陀区金沙江路 1518 弄",
              complainTime: "王小虎",
              status: "普陀区"
            }
          ]
        },
        {
          tabLabel: this.tabNameObj.thiTab.tabLabel,
          tabName: this.tabNameObj.thiTab.tabName, //将作为标识符来区分
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [],
          searchCreteria: [],
          tabHeader: [
            {
              headerKey: "complainCompany",
              headerVal: "投诉行业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainant",
              headerVal: "投诉人",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainType",
              headerVal: "投诉类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "complainTime",
              headerVal: "投诉时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "status",
              headerVal: "状态",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "comments",
              headerVal: "备注",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "detail",
              headerVal: "详情",
              subHeaders: [],
              columnType: this.columnType.text
            }
          ],
          TabCtnt: [
            {
              complainCompany: "2016-05-03",
              complainant: "上海",
              complainType: "上海市普陀区金沙江路 1518 弄",
              complainTime: "王小虎",
              status: "普陀区"
            },
            {
              complainCompany: "2016-05-03",
              complainant: "上海",
              complainType: "上海市普陀区金沙江路 1518 弄",
              complainTime: "王小虎",
              status: "普陀区"
            }
          ]
        }
      ];
    },
    complainRankTabCtntList: function() {
      return {
        tabHeader: [
          {
            headerKey: "rankNumber",
            headerVal: "排名",
            subHeaders: []
          },
          {
            headerKey: "complainLicensePlat",
            headerVal: "被投诉车辆",
            subHeaders: []
          },
          {
            headerKey: "complainant",
            headerVal: "投诉人",
            subHeaders: []
          },
          {
            headerKey: "complainCount",
            headerVal: "投诉个数",
            subHeaders: []
          }
        ],
        TabCtnt: [
          {
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },
          {
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },
          {
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },
          {
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },
          {
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },
          {
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },{
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },
          {
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },{
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },{
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          },
          {
            rankNumber: "2016-05-03",
            complainLicensePlat: "王小虎",
            complainant: "上海",
            complainCount: "普陀区"
          }
        ]
      };
    },
    pieEcharts: function() {
      return {
        routerLink: "",
        idName: "review-scatter",
        // data: ['包车客车', '旅游客车', '重货、半挂牵引车', '三类以上班线客车', '危险品车'],
        data: ["乘客对司机", "企业对第三方检测平台", "行业对第三方检测平台"],
        titleX: "2%",
        titleY: "3%",
        titleName: "投诉分布", //显示饼图的title
        legendOrient: "vertical",
        legendX: "2%",
        legendY: "15%",
        color: ["#97ffff", "#3a8dff", "#4ccfd1",],
        seriesName: "投诉分布",
        seriesRadius: ["45%", "70%"],
        seriesdata: [
          {
            value: 14,
            name: "乘客对司机"
          },
          {
            value: 3,
            name: "企业对第三方检测平台"
          },
          {
            value: 5,
            name: "行业对第三方检测平台"
          }
        ]
      };
    }
  },
  methods: {
    handleClickSearch: function(msg) {
      //处理子组件触发的查询事件
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const GetVehicleUplineDataParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.activeNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.transCheckSourceData = [];
      axiosRequest
        .axiosGet(this.getVehicleUplineDataUrl, GetVehicleUplineDataParams)
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
            ZoneName: vehicleUplineItem.ZoneName,
            InstalledCount: vehicleUplineItem.InstalledCount,
            UpCount: vehicleUplineItem.UpCount,
            UpRate: vehicleUplineItem.UpRate,

            ALLVehicle_sanlei: vehicleUplineItem.ALLVehicle_sanlei,
            UplineVehicle_sanlei: vehicleUplineItem.UplineVehicle_sanlei,
            UplineRate_sanlei: vehicleUplineItem.UplineRate_sanlei,

            ALLVehicle_GAOSU: vehicleUplineItem.ALLVehicle_GAOSU,
            UplineVehicle_GAOSU: vehicleUplineItem.UplineVehicle_GAOSU,
            UplineRate_GAOSU: vehicleUplineItem.UplineRate_GAOSU,

            ALLVehicle_CHAOCHANG: vehicleUplineItem.ALLVehicle_CHAOCHANG,
            UplineVehicle_CHAOCHANG: vehicleUplineItem.UplineVehicle_CHAOCHANG,
            UplineRate_CHAOCHANG: vehicleUplineItem.UplineRate_CHAOCHANG,

            ALLVehicle_LVYOU: vehicleUplineItem.ALLVehicle_LVYOU,
            UplineVehicle_LVYOU: vehicleUplineItem.UplineVehicle_LVYOU,
            UplineRate_LVYOU: vehicleUplineItem.UplineRate_LVYOU,

            ALLVehicle_BAOCHE: vehicleUplineItem.ALLVehicle_BAOCHE,
            UplineVehicle_BAOCHE: vehicleUplineItem.UplineVehicle_BAOCHE,
            UplineRate_BAOCHE: vehicleUplineItem.UplineRate_BAOCHE,

            ALLVehicle_WEIXIAN: vehicleUplineItem.ALLVehicle_WEIXIAN,
            UplineVehicle_WEIXIAN: vehicleUplineItem.UplineVehicle_WEIXIAN,
            UplineRate_WEIXIAN: vehicleUplineItem.UplineRate_WEIXIAN,

            ALLVehicle_ZHONGHUO: vehicleUplineItem.ALLVehicle_ZHONGHUO,
            UplineVehicle_ZHONGHUO: vehicleUplineItem.UplineVehicle_ZHONGHUO,
            UplineRate_ZHONGHUO: vehicleUplineItem.UplineRate_ZHONGHUO,

            ALLVehicle_BANGUA: vehicleUplineItem.ALLVehicle_BANGUA,
            UplineVehicle_BANGUA: vehicleUplineItem.UplineVehicle_BANGUA,
            UplineRate_BANGUA: vehicleUplineItem.UplineRate_BANGUA,

            ALLVehicle_puhuo: vehicleUplineItem.ALLVehicle_puhuo,
            UplineVehicle_puhuo: vehicleUplineItem.UplineVehicle_puhuo,
            UplineRate_puhuo: vehicleUplineItem.UplineRate_puhuo,

            ALLVehicle_NONGCUN: vehicleUplineItem.ALLVehicle_NONGCUN,
            UplineVehicle_NONGCUN: vehicleUplineItem.UplineVehicle_NONGCUN,
            UplineRate_NONGCUN: vehicleUplineItem.UplineRate_NONGCUN,

            ALLVehicle_jiaolian: vehicleUplineItem.ALLVehicle_jiaolian,
            UplineVehicle_jiaolian: vehicleUplineItem.UplineVehicle_jiaolian,
            UplineRate_jiaolian: vehicleUplineItem.UplineRate_jiaolian,

            ALLVehicle_chuzu: vehicleUplineItem.ALLVehicle_chuzu,
            UplineVehicle_chuzu: vehicleUplineItem.UplineVehicle_chuzu,
            UplineRate_chuzu: vehicleUplineItem.UplineRate_chuzu,

            ALLVehicle_gongjiao: vehicleUplineItem.ALLVehicle_gongjiao,
            UplineVehicle_gongjiao: vehicleUplineItem.UplineVehicle_gongjiao,
            UplineRate_gongjiao: vehicleUplineItem.UplineRate_gongjiao,

            ALLVehicle_zulin: vehicleUplineItem.ALLVehicle_zulin,
            UplineVehicle_zulin: vehicleUplineItem.UplineVehicle_zulin,
            UplineRate_zulin: vehicleUplineItem.UplineRate_zulin,

            ALLVehicle_xiaoyuan: vehicleUplineItem.ALLVehicle_xiaoyuan,
            UplineVehicle_xiaoyuan: vehicleUplineItem.UplineVehicle_xiaoyuan,
            UplineRate_xiaoyuan: vehicleUplineItem.UplineRate_xiaoyuan,

            ALLVehicle_qita: vehicleUplineItem.ALLVehicle_qita,
            UplineVehicle_qita: vehicleUplineItem.UplineVehicle_qita,
            UplineRate_qita: vehicleUplineItem.UplineRate_qita
          };
          break;
        case this.tabNameObj.secTab.tabName:
          return {
            sybid: vehicleUplineItem.sybid,
            PlatformName: vehicleUplineItem.PlatformName,
            InstalledCount: vehicleUplineItem.InstalledCount,
            UpCount: vehicleUplineItem.UpCount,
            UpRate: vehicleUplineItem.UpRate,

            ALLVehicle_sanlei: vehicleUplineItem.ALLVehicle_sanlei,
            UplineVehicle_sanlei: vehicleUplineItem.UplineVehicle_sanlei,
            UplineRate_sanlei: vehicleUplineItem.UplineRate_sanlei,

            ALLVehicle_GAOSU: vehicleUplineItem.ALLVehicle_GAOSU,
            UplineVehicle_GAOSU: vehicleUplineItem.UplineVehicle_GAOSU,
            UplineRate_GAOSU: vehicleUplineItem.UplineRate_GAOSU,

            ALLVehicle_CHAOCHANG: vehicleUplineItem.ALLVehicle_CHAOCHANG,
            UplineVehicle_CHAOCHANG: vehicleUplineItem.UplineVehicle_CHAOCHANG,
            UplineRate_CHAOCHANG: vehicleUplineItem.UplineRate_CHAOCHANG,

            ALLVehicle_LVYOU: vehicleUplineItem.ALLVehicle_LVYOU,
            UplineVehicle_LVYOU: vehicleUplineItem.UplineVehicle_LVYOU,
            UplineRate_LVYOU: vehicleUplineItem.UplineRate_LVYOU,

            ALLVehicle_BAOCHE: vehicleUplineItem.ALLVehicle_BAOCHE,
            UplineVehicle_BAOCHE: vehicleUplineItem.UplineVehicle_BAOCHE,
            UplineRate_BAOCHE: vehicleUplineItem.UplineRate_BAOCHE,

            ALLVehicle_WEIXIAN: vehicleUplineItem.ALLVehicle_WEIXIAN,
            UplineVehicle_WEIXIAN: vehicleUplineItem.UplineVehicle_WEIXIAN,
            UplineRate_WEIXIAN: vehicleUplineItem.UplineRate_WEIXIAN,

            ALLVehicle_ZHONGHUO: vehicleUplineItem.ALLVehicle_ZHONGHUO,
            UplineVehicle_ZHONGHUO: vehicleUplineItem.UplineVehicle_ZHONGHUO,
            UplineRate_ZHONGHUO: vehicleUplineItem.UplineRate_ZHONGHUO,

            ALLVehicle_BANGUA: vehicleUplineItem.ALLVehicle_BANGUA,
            UplineVehicle_BANGUA: vehicleUplineItem.UplineVehicle_BANGUA,
            UplineRate_BANGUA: vehicleUplineItem.UplineRate_BANGUA,

            ALLVehicle_puhuo: vehicleUplineItem.ALLVehicle_puhuo,
            UplineVehicle_puhuo: vehicleUplineItem.UplineVehicle_puhuo,
            UplineRate_puhuo: vehicleUplineItem.UplineRate_puhuo,

            ALLVehicle_NONGCUN: vehicleUplineItem.ALLVehicle_NONGCUN,
            UplineVehicle_NONGCUN: vehicleUplineItem.UplineVehicle_NONGCUN,
            UplineRate_NONGCUN: vehicleUplineItem.UplineRate_NONGCUN,

            ALLVehicle_jiaolian: vehicleUplineItem.ALLVehicle_jiaolian,
            UplineVehicle_jiaolian: vehicleUplineItem.UplineVehicle_jiaolian,
            UplineRate_jiaolian: vehicleUplineItem.UplineRate_jiaolian,

            ALLVehicle_chuzu: vehicleUplineItem.ALLVehicle_chuzu,
            UplineVehicle_chuzu: vehicleUplineItem.UplineVehicle_chuzu,
            UplineRate_chuzu: vehicleUplineItem.UplineRate_chuzu,

            ALLVehicle_gongjiao: vehicleUplineItem.ALLVehicle_gongjiao,
            UplineVehicle_gongjiao: vehicleUplineItem.UplineVehicle_gongjiao,
            UplineRate_gongjiao: vehicleUplineItem.UplineRate_gongjiao,

            ALLVehicle_zulin: vehicleUplineItem.ALLVehicle_zulin,
            UplineVehicle_zulin: vehicleUplineItem.UplineVehicle_zulin,
            UplineRate_zulin: vehicleUplineItem.UplineRate_zulin,

            ALLVehicle_xiaoyuan: vehicleUplineItem.ALLVehicle_xiaoyuan,
            UplineVehicle_xiaoyuan: vehicleUplineItem.UplineVehicle_xiaoyuan,
            UplineRate_xiaoyuan: vehicleUplineItem.UplineRate_xiaoyuan,

            ALLVehicle_qita: vehicleUplineItem.ALLVehicle_qita,
            UplineVehicle_qita: vehicleUplineItem.UplineVehicle_qita,
            UplineRate_qita: vehicleUplineItem.UplineRate_qita
          };
          break;
        case this.tabNameObj.thiTab.tabName:
          return {
            sybid: vehicleUplineItem.sybid,
            CompanyZoneName: vehicleUplineItem.CompanyZoneName,
            CompanyName: vehicleUplineItem.CompanyName,
            InstalledCount: vehicleUplineItem.InstalledCount,
            UpCount: vehicleUplineItem.UpCount,
            UpRate: vehicleUplineItem.UpRate,

            ALLVehicle_sanlei: vehicleUplineItem.ALLVehicle_sanlei,
            UplineVehicle_sanlei: vehicleUplineItem.UplineVehicle_sanlei,
            UplineRate_sanlei: vehicleUplineItem.UplineRate_sanlei,

            ALLVehicle_GAOSU: vehicleUplineItem.ALLVehicle_GAOSU,
            UplineVehicle_GAOSU: vehicleUplineItem.UplineVehicle_GAOSU,
            UplineRate_GAOSU: vehicleUplineItem.UplineRate_GAOSU,

            ALLVehicle_CHAOCHANG: vehicleUplineItem.ALLVehicle_CHAOCHANG,
            UplineVehicle_CHAOCHANG: vehicleUplineItem.UplineVehicle_CHAOCHANG,
            UplineRate_CHAOCHANG: vehicleUplineItem.UplineRate_CHAOCHANG,

            ALLVehicle_LVYOU: vehicleUplineItem.ALLVehicle_LVYOU,
            UplineVehicle_LVYOU: vehicleUplineItem.UplineVehicle_LVYOU,
            UplineRate_LVYOU: vehicleUplineItem.UplineRate_LVYOU,

            ALLVehicle_BAOCHE: vehicleUplineItem.ALLVehicle_BAOCHE,
            UplineVehicle_BAOCHE: vehicleUplineItem.UplineVehicle_BAOCHE,
            UplineRate_BAOCHE: vehicleUplineItem.UplineRate_BAOCHE,

            ALLVehicle_WEIXIAN: vehicleUplineItem.ALLVehicle_WEIXIAN,
            UplineVehicle_WEIXIAN: vehicleUplineItem.UplineVehicle_WEIXIAN,
            UplineRate_WEIXIAN: vehicleUplineItem.UplineRate_WEIXIAN,

            ALLVehicle_ZHONGHUO: vehicleUplineItem.ALLVehicle_ZHONGHUO,
            UplineVehicle_ZHONGHUO: vehicleUplineItem.UplineVehicle_ZHONGHUO,
            UplineRate_ZHONGHUO: vehicleUplineItem.UplineRate_ZHONGHUO,

            ALLVehicle_BANGUA: vehicleUplineItem.ALLVehicle_BANGUA,
            UplineVehicle_BANGUA: vehicleUplineItem.UplineVehicle_BANGUA,
            UplineRate_BANGUA: vehicleUplineItem.UplineRate_BANGUA,

            ALLVehicle_puhuo: vehicleUplineItem.ALLVehicle_puhuo,
            UplineVehicle_puhuo: vehicleUplineItem.UplineVehicle_puhuo,
            UplineRate_puhuo: vehicleUplineItem.UplineRate_puhuo,

            ALLVehicle_NONGCUN: vehicleUplineItem.ALLVehicle_NONGCUN,
            UplineVehicle_NONGCUN: vehicleUplineItem.UplineVehicle_NONGCUN,
            UplineRate_NONGCUN: vehicleUplineItem.UplineRate_NONGCUN,

            ALLVehicle_jiaolian: vehicleUplineItem.ALLVehicle_jiaolian,
            UplineVehicle_jiaolian: vehicleUplineItem.UplineVehicle_jiaolian,
            UplineRate_jiaolian: vehicleUplineItem.UplineRate_jiaolian,

            ALLVehicle_chuzu: vehicleUplineItem.ALLVehicle_chuzu,
            UplineVehicle_chuzu: vehicleUplineItem.UplineVehicle_chuzu,
            UplineRate_chuzu: vehicleUplineItem.UplineRate_chuzu,

            ALLVehicle_gongjiao: vehicleUplineItem.ALLVehicle_gongjiao,
            UplineVehicle_gongjiao: vehicleUplineItem.UplineVehicle_gongjiao,
            UplineRate_gongjiao: vehicleUplineItem.UplineRate_gongjiao,

            ALLVehicle_zulin: vehicleUplineItem.ALLVehicle_zulin,
            UplineVehicle_zulin: vehicleUplineItem.UplineVehicle_zulin,
            UplineRate_zulin: vehicleUplineItem.UplineRate_zulin,

            ALLVehicle_xiaoyuan: vehicleUplineItem.ALLVehicle_xiaoyuan,
            UplineVehicle_xiaoyuan: vehicleUplineItem.UplineVehicle_xiaoyuan,
            UplineRate_xiaoyuan: vehicleUplineItem.UplineRate_xiaoyuan,

            ALLVehicle_qita: vehicleUplineItem.ALLVehicle_qita,
            UplineVehicle_qita: vehicleUplineItem.UplineVehicle_qita,
            UplineRate_qita: vehicleUplineItem.UplineRate_qita
          };
          break;
        case this.tabNameObj.fouTab.tabName:
          return {
            sybid: vehicleUplineItem.sybid,
            LicensePlat: vehicleUplineItem.LicensePlat,
            PlateColor: vehicleUplineItem.PlateColor,
            CompanyZoneName: vehicleUplineItem.CompanyZoneName,
            CityName: vehicleUplineItem.CityName,
            CompanyName: vehicleUplineItem.CompanyName,
            VehicleType: vehicleUplineItem.VehicleType,
            PlatformName: vehicleUplineItem.PlatformName,
            GPSLastDate: vehicleUplineItem.GPSLastDate
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
      // 封装函数来组装每一页请求的参数
      const exportvehicleUplineDataParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.activeNameIndex].loading = true; //下载数据的时候，显示正在下载数据的logo
      axiosRequest.axiosGet(
          this.exportVehicleUplineDataUrl,
          exportvehicleUplineDataParams
        )
        .then(function(response) {
          self.downloadServerFile(decodeURIComponent(response.data));
          // 下载完成后，隐藏正在下载的logo
          self.tabCtntList[self.activeNameIndex].loading = false;
        })
        .catch(function(error) {});
    },
    formPageParams: function(msg, pageIndex, activeName, isSplitPage) {
      let nType = 0,
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
        readPage = "";
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          this.activeNameIndex = 0;
          nType = this.tabNameObj.firTab.nType;
          break;
        case this.tabNameObj.secTab.tabName:
          this.activeNameIndex = 1;
          nType = this.tabNameObj.secTab.nType;
          break;
        case this.tabNameObj.thiTab.tabName:
          this.activeNameIndex = 2;
          nType = this.tabNameObj.thiTab.nType;
          break;
        case this.tabNameObj.fouTab.tabName:
          this.activeNameIndex = 3;
          nType = this.tabNameObj.fouTab.nType;
          break;
        default:
      }
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
  created: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>