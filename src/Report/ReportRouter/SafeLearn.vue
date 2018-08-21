<template>
  <div class="sefe-learn">
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
import { axiosRequest, getLastMonth, getLastDay } from "@/common/common";
import { commonConfig, carTypeOptions, reportLabelId, provinceVal } from "@/config/commonConfig";

export default {
  name: "SafeLearn",
  components: {
    MultiLevelTableComponent
  },
  data() {
    return {
      activeName: "report_safelearn_zone_table",
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
          tabLabel: "地区汇总",
          tabName: "report_safelearn_zone_table", //将作为标识符来区分
          nType: 1 //根据重构前的请求，可以看到nType 为1
        },
        secTab: {
          tabLabel: "企业汇总",
          tabName: "report_safelearn_company_table", //将作为标识符来区分
          nType: 2 //根据重构前的请求，可以看到nType 为3
        },
        thiTab: {
          tabLabel: "驾驶员汇总",
          tabName: "report_safelearn_vehicle_table", //将作为标识符来区分
          nType: 3 //根据重构前的请求，可以看到nType 为4
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
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false //控制查询数据按钮初始状态为enabled
            },
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
              labelName: "地区:",
              labelId: reportLabelId.ZoneId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "singleDatePicker",
              type: "year",
              labelName: "年份",
              labelId: "singleDatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: new Date().format('yyyy')
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
            },
            {
              headerKey: "ZoneName",
              headerVal: "地区",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail
            },
            {
              headerKey: "CompanyCount",
              headerVal: "企业数",
              subHeaders: [],
              columnType: this.columnType.router_link,
              router_link: commonConfig.routerConst.ProviderCheckDetail
            },
            {
              labelName: "驾驶员安全学习会议次数",
              subHeaders: [
                {
                  headerKey: "01",
                  headerVal: "1月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "02",
                  headerVal: "2月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "03",
                  headerVal: "3月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "04",
                  headerVal: "4月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "05",
                  headerVal: "5月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "06",
                  headerVal: "6月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "07",
                  headerVal: "7月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "08",
                  headerVal: "8月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "09",
                  headerVal: "9月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "10",
                  headerVal: "10月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "11",
                  headerVal: "11月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "12",
                  headerVal: "12月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "total",
                  headerVal: "合计",
                  columnType: this.columnType.text
                }
              ]
            }
          ],
          TabCtnt: [
            {
              sybid: "2016-05-03",
              UnitName: "王小虎",
              ZoneName: "上海",
              DriverCount: "普陀区",
              '01': "上海市普陀区金沙江路 1518 弄"
            },
            {
              sybid: "2016-05-03",
              UnitName: "王小虎",
              ZoneName: "上海",
              DriverCount: "普陀区",
              '01': "上海市普陀区金沙江路 1518 弄"
            }
          ]
        },
        {
          tabLabel: this.tabNameObj.secTab.tabLabel,
          tabName: this.tabNameObj.secTab.tabName, //将作为标识符来区分
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false //控制查询数据按钮初始状态为enabled
            },
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
            },
            {
              searchType: "singleDatePicker",
              type: "year",
              labelName: "年份",
              labelId: "singleDatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: new Date().format('yyyy')
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
            },
            {
              headerKey: "ZoneName",
              headerVal: "地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "DriverCount",
              headerVal: "驾驶员人数",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              labelName: "驾驶员安全学习人次",
              subHeaders: [
                {
                  headerKey: "01",
                  headerVal: "1月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "02",
                  headerVal: "2月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "03",
                  headerVal: "3月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "04",
                  headerVal: "4月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "05",
                  headerVal: "5月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "06",
                  headerVal: "6月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "07",
                  headerVal: "7月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "08",
                  headerVal: "8月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "09",
                  headerVal: "9月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "10",
                  headerVal: "10月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "11",
                  headerVal: "11月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "12",
                  headerVal: "12月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "total",
                  headerVal: "合计",
                  columnType: this.columnType.text
                }
              ]
            }
          ],
          TabCtnt: [
            {
              sybid: "2016-05-03",
              UnitName: "王小虎",
              ZoneName: "上海",
              DriverCount: "普陀区",
              "01": "上海市普陀区金沙江路 1518 弄"
            },
            {
              sybid: "2016-05-03",
              UnitName: "王小虎",
              ZoneName: "上海",
              DriverCount: "普陀区",
              "01": "上海市普陀区金沙江路 1518 弄"
            }
          ]
        },
        {
          tabLabel: this.tabNameObj.thiTab.tabLabel,
          tabName: this.tabNameObj.thiTab.tabName, //将作为标识符来区分
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [
            {
              iconName: "el-icon-search",
              btnId: "search", //该ID主要是用来判断在子组件中出发了哪一个按钮
              btnName: "查询",
              isDisabled: false //控制查询数据按钮初始状态为enabled
            },
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
              labelName: "所属地区:",
              labelId: reportLabelId.ZoneId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: provinceVal.provinceName,
              compId: provinceVal.provinceId // 在需要使用预搜索的输入框需要compId字段
            },
            {
              searchType: "input",
              labelName: "运输企业:",
              labelId: reportLabelId.UnitId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "input",
              labelName: "驾驶员姓名:",
              labelId: reportLabelId.DriverName, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "input",
              labelName: "驾驶证号:",
              labelId: reportLabelId.DriverNumber, //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: "",
              compId: ""
            },
            {
              searchType: "singleDatePicker",
              type: "year",
              labelName: "年份",
              labelId: "singleDatePicker", //该ID主要是用来判断在子组件中出发了哪一种个子组件
              compVal: new Date().format('yyyy')
            }
          ],
          tabHeader: [
            {
              headerKey: "sybid",
              headerVal: "序号",
              subHeaders: [],
              columnType: this.columnType.text,
            },
            {
              headerKey: "Name",
              headerVal: "姓名",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "IDNumber",
              headerVal: "驾驶证号",
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
              labelName: "驾驶员安全学习次数",
              subHeaders: [
                {
                  headerKey: "01",
                  headerVal: "1月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "02",
                  headerVal: "2月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "03",
                  headerVal: "3月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "04",
                  headerVal: "4月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "05",
                  headerVal: "5月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "06",
                  headerVal: "6月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "07",
                  headerVal: "7月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "08",
                  headerVal: "8月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "09",
                  headerVal: "9月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "10",
                  headerVal: "10月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "11",
                  headerVal: "11月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "12",
                  headerVal: "12月",
                  columnType: this.columnType.text
                },
                {
                  headerKey: "total",
                  headerVal: "合计",
                  columnType: this.columnType.text
                }
              ]
            }
          ],
          TabCtnt: [
            {
              sybid: "2016-05-03",
              Name: "王小虎",
              IDNumber: "上海",
              UnitName: "普陀区",
              '01': "上海市普陀区金沙江路 1518 弄",
              '02': "上海市普陀区金沙江路 1518 弄",
              '03': "上海市普陀区金沙江路 1518 弄",
              '04': "上海市普陀区金沙江路 1518 弄"
            },
            {
              sybid: "2016-05-03",
              Name: "王小虎",
              IDNumber: "上海",
              UnitName: "普陀区",
              '01': "上海市普陀区金沙江路 1518 弄",
              '02': "上海市普陀区金沙江路 1518 弄",
              '03': "上海市普陀区金沙江路 1518 弄",
              '04': "上海市普陀区金沙江路 1518 弄"
            },
          ]
        }
      ];
    }
  },
  methods: {
    handleClickSearch: function(msg) {
      //处理子组件触发的查询事件
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, msg.ctrlId); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const GetVehicleInstallDataUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage
      );
      self.tabCtntList[self.activeNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.transCheckSourceData = [];
      axiosRequest
        .axiosGet(this.getVehicleInstallDataUrl, GetVehicleInstallDataUrlParams)
        .then(function(response) {
          const detailListTemp = response.data.DetailList;
          for (let vehicleInstallItem of detailListTemp) {
            self.transCheckSourceData.push(
              self.pushSourceData(vehicleInstallItem, msg.activeName)
            );
          }
          self.tabCtntList[self.activeNameIndex].TabCtnt =
            self.transCheckSourceData;
          self.tabCtntList[self.activeNameIndex].total =
            response.data.CountTotal;
          self.tabCtntList[self.activeNameIndex].loading = false;
          self.tabCtntList[self.activeNameIndex].btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
          // 在某些特殊的Tab需要加上明细 - 平台连通率明细
          self.tabCtntList[self.activeNameIndex].TabCtnt.push(
            self.pushSourceData(response.data.TotalList, msg.activeName)
          );
        })
        .catch(function(error) {});
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(vehicleInstallItem, activeName) {
      switch (activeName) {
        case this.tabNameObj.firTab.tabName:
          return {
            sybid: vehicleInstallItem.sybid,
            ZName: vehicleInstallItem.ZName,
            IncrementVehicle: vehicleInstallItem.IncrementVehicle,
            OfflineCountV: vehicleInstallItem.OfflineCountV,
            AddCountV: vehicleInstallItem.AddCountV,
            ALLVehicle: vehicleInstallItem.ALLVehicle,
            InstalledVehicle: vehicleInstallItem.InstalledVehicle,
            InstalledRate: vehicleInstallItem.InstalledRate,

            ALLVehicle_sanlei: vehicleInstallItem.ALLVehicle_sanlei,
            InstalledVehicle_sanlei: vehicleInstallItem.InstalledVehicle_sanlei,
            InstalledRate_sanlei: vehicleInstallItem.InstalledRate_sanlei,

            ALLVehicle_GAOSU: vehicleInstallItem.ALLVehicle_GAOSU,
            InstalledVehicle_GAOSU: vehicleInstallItem.InstalledVehicle_GAOSU,
            InstalledRate_GAOSU: vehicleInstallItem.InstalledRate_GAOSU,

            ALLVehicle_CHAOCHANG: vehicleInstallItem.ALLVehicle_CHAOCHANG,
            InstalledVehicle_CHAOCHANG: vehicleInstallItem.InstalledVehicle_CHAOCHANG,
            FatigueDrivInstalledRate_CHAOCHANGeRate: vehicleInstallItem.InstalledRate_CHAOCHANG,
            
            ALLVehicle_LVYOU: vehicleInstallItem.ALLVehicle_LVYOU,
            InstalledVehicle_LVYOU: vehicleInstallItem.InstalledVehicle_LVYOU,
            InstalledRate_LVYOU: vehicleInstallItem.InstalledRate_LVYOU,

            ALLVehicle_BAOCHE: vehicleInstallItem.ALLVehicle_BAOCHE,
            InstalledVehicle_BAOCHE: vehicleInstallItem.InstalledVehicle_BAOCHE,
            InstalledRate_BAOCHE: vehicleInstallItem.InstalledRate_BAOCHE,

            ALLVehicle_WEIXIAN: vehicleInstallItem.ALLVehicle_WEIXIAN,
            InstalledVehicle_WEIXIAN: vehicleInstallItem.InstalledVehicle_WEIXIAN,
            InstalledRate_WEIXIAN: vehicleInstallItem.InstalledRate_WEIXIAN,

            ALLVehicle_ZHONGHUO: vehicleInstallItem.ALLVehicle_ZHONGHUO,
            InstalledVehicle_ZHONGHUO: vehicleInstallItem.InstalledVehicle_ZHONGHUO,
            InstalledRate_ZHONGHUO: vehicleInstallItem.InstalledRate_ZHONGHUO,

            ALLVehicle_BANGUA: vehicleInstallItem.ALLVehicle_BANGUA,
            InstalledVehicle_BANGUA: vehicleInstallItem.InstalledVehicle_BANGUA,
            InstalledRate_BANGUA: vehicleInstallItem.InstalledRate_BANGUA,

            ALLVehicle_puhuo: vehicleInstallItem.ALLVehicle_puhuo,
            InstalledVehicle_puhuo: vehicleInstallItem.InstalledVehicle_puhuo,
            InstalledRate_puhuo: vehicleInstallItem.InstalledRate_puhuo,

            ALLVehicle_NONGCUN: vehicleInstallItem.ALLVehicle_NONGCUN,
            InstalledVehicle_NONGCUN: vehicleInstallItem.InstalledVehicle_NONGCUN,
            InstalledRate_NONGCUN: vehicleInstallItem.InstalledRate_NONGCUN,

            ALLVehicle_jiaolian: vehicleInstallItem.ALLVehicle_jiaolian,
            InstalledVehicle_jiaolian: vehicleInstallItem.InstalledVehicle_jiaolian,
            InstalledRate_jiaolian: vehicleInstallItem.InstalledRate_jiaolian,

            ALLVehicle_chuzu: vehicleInstallItem.ALLVehicle_chuzu,
            InstalledVehicle_chuzu: vehicleInstallItem.InstalledVehicle_chuzu,
            InstalledRate_chuzu: vehicleInstallItem.InstalledRate_chuzu,

            ALLVehicle_gongjiao: vehicleInstallItem.ALLVehicle_gongjiao,
            InstalledVehicle_gongjiao: vehicleInstallItem.InstalledVehicle_gongjiao,
            InstalledRate_gongjiao: vehicleInstallItem.InstalledRate_gongjiao,

            ALLVehicle_zulin: vehicleInstallItem.ALLVehicle_zulin,
            InstalledVehicle_zulin: vehicleInstallItem.InstalledVehicle_zulin,
            InstalledRate_zulin: vehicleInstallItem.InstalledRate_zulin,

            ALLVehicle_xiaoyuan: vehicleInstallItem.ALLVehicle_xiaoyuan,
            InstalledVehicle_xiaoyuan: vehicleInstallItem.InstalledVehicle_xiaoyuan,
            InstalledRate_xiaoyuan: vehicleInstallItem.InstalledRate_xiaoyuan,

            ALLVehicle_qita: vehicleInstallItem.ALLVehicle_qita,
            InstalledVehicle_qita: vehicleInstallItem.InstalledVehicle_qita,
            InstalledRate_qita: vehicleInstallItem.InstalledRate_qita
          };
          break;
        case this.tabNameObj.secTab.tabName:
          return {
            sybid: vehicleInstallItem.sybid,
            Name: vehicleInstallItem.Name,
            IncrementVehicle: vehicleInstallItem.IncrementVehicle,
            OfflineCountV: vehicleInstallItem.OfflineCountV,
            AddCountV: vehicleInstallItem.AddCountV,

            InstalledVehicle: vehicleInstallItem.InstalledVehicle,
            InstalledVehicle_sanlei: vehicleInstallItem.InstalledVehicle_sanlei,
            InstalledVehicle_GAOSU: vehicleInstallItem.InstalledVehicle_GAOSU,
            InstalledVehicle_CHAOCHANG: vehicleInstallItem.InstalledVehicle_CHAOCHANG,
            InstalledVehicle_LVYOU: vehicleInstallItem.InstalledVehicle_LVYOU,
            InstalledVehicle_BAOCHE: vehicleInstallItem.InstalledVehicle_BAOCHE,

            InstalledVehicle_WEIXIAN: vehicleInstallItem.InstalledVehicle_WEIXIAN,
            InstalledVehicle_ZHONGHUO: vehicleInstallItem.InstalledVehicle_ZHONGHUO,
            InstalledVehicle_BANGUA: vehicleInstallItem.InstalledVehicle_BANGUA,

            InstalledVehicle_puhuo: vehicleInstallItem.InstalledVehicle_puhuo,
            InstalledVehicle_NONGCUN: vehicleInstallItem.InstalledVehicle_NONGCUN,
            InstalledVehicle_jiaolian: vehicleInstallItem.InstalledVehicle_jiaolian,
            
            InstalledVehicle_chuzu: vehicleInstallItem.InstalledVehicle_chuzu,
            InstalledVehicle_gongjiao: vehicleInstallItem.InstalledVehicle_gongjiao,
            InstalledVehicle_zulin: vehicleInstallItem.InstalledVehicle_zulin,

            InstalledVehicle_xiaoyuan: vehicleInstallItem.InstalledVehicle_xiaoyuan,
            InstalledVehicle_qita: vehicleInstallItem.InstalledVehicle_qita
          };
          break;
        case this.tabNameObj.thiTab.tabName:
          return {
            sybid: vehicleInstallItem.sybid,
            ZName: vehicleInstallItem.ZName,
            UnitName: vehicleInstallItem.UnitName,
            IncrementVehicle: vehicleInstallItem.IncrementVehicle,
            ALLVehicle: vehicleInstallItem.ALLVehicle,

            InstalledVehicle: vehicleInstallItem.InstalledVehicle,
            InstalledRate: vehicleInstallItem.InstalledRate,

            ALLVehicle_sanlei: vehicleInstallItem.ALLVehicle_sanlei,
            InstalledVehicle_sanlei: vehicleInstallItem.InstalledVehicle_sanlei,
            InstalledRate_sanlei: vehicleInstallItem.InstalledRate_sanlei,

            ALLVehicle_GAOSU: vehicleInstallItem.ALLVehicle_GAOSU,
            InstalledVehicle_GAOSU: vehicleInstallItem.InstalledVehicle_GAOSU,
            InstalledRate_GAOSU: vehicleInstallItem.InstalledRate_GAOSU,

            ALLVehicle_CHAOCHANG: vehicleInstallItem.ALLVehicle_CHAOCHANG,
            InstalledVehicle_CHAOCHANG: vehicleInstallItem.InstalledVehicle_CHAOCHANG,
            FatigueDrivInstalledRate_CHAOCHANGeRate: vehicleInstallItem.InstalledRate_CHAOCHANG,
            
            ALLVehicle_LVYOU: vehicleInstallItem.ALLVehicle_LVYOU,
            InstalledVehicle_LVYOU: vehicleInstallItem.InstalledVehicle_LVYOU,
            InstalledRate_LVYOU: vehicleInstallItem.InstalledRate_LVYOU,

            ALLVehicle_BAOCHE: vehicleInstallItem.ALLVehicle_BAOCHE,
            InstalledVehicle_BAOCHE: vehicleInstallItem.InstalledVehicle_BAOCHE,
            InstalledRate_BAOCHE: vehicleInstallItem.InstalledRate_BAOCHE,

            ALLVehicle_WEIXIAN: vehicleInstallItem.ALLVehicle_WEIXIAN,
            InstalledVehicle_WEIXIAN: vehicleInstallItem.InstalledVehicle_WEIXIAN,
            InstalledRate_WEIXIAN: vehicleInstallItem.InstalledRate_WEIXIAN,

            ALLVehicle_ZHONGHUO: vehicleInstallItem.ALLVehicle_ZHONGHUO,
            InstalledVehicle_ZHONGHUO: vehicleInstallItem.InstalledVehicle_ZHONGHUO,
            InstalledRate_ZHONGHUO: vehicleInstallItem.InstalledRate_ZHONGHUO,

            ALLVehicle_BANGUA: vehicleInstallItem.ALLVehicle_BANGUA,
            InstalledVehicle_BANGUA: vehicleInstallItem.InstalledVehicle_BANGUA,
            InstalledRate_BANGUA: vehicleInstallItem.InstalledRate_BANGUA,

            ALLVehicle_puhuo: vehicleInstallItem.ALLVehicle_puhuo,
            InstalledVehicle_puhuo: vehicleInstallItem.InstalledVehicle_puhuo,
            InstalledRate_puhuo: vehicleInstallItem.InstalledRate_puhuo,

            ALLVehicle_NONGCUN: vehicleInstallItem.ALLVehicle_NONGCUN,
            InstalledVehicle_NONGCUN: vehicleInstallItem.InstalledVehicle_NONGCUN,
            InstalledRate_NONGCUN: vehicleInstallItem.InstalledRate_NONGCUN,

            ALLVehicle_jiaolian: vehicleInstallItem.ALLVehicle_jiaolian,
            InstalledVehicle_jiaolian: vehicleInstallItem.InstalledVehicle_jiaolian,
            InstalledRate_jiaolian: vehicleInstallItem.InstalledRate_jiaolian,

            ALLVehicle_chuzu: vehicleInstallItem.ALLVehicle_chuzu,
            InstalledVehicle_chuzu: vehicleInstallItem.InstalledVehicle_chuzu,
            InstalledRate_chuzu: vehicleInstallItem.InstalledRate_chuzu,

            ALLVehicle_gongjiao: vehicleInstallItem.ALLVehicle_gongjiao,
            InstalledVehicle_gongjiao: vehicleInstallItem.InstalledVehicle_gongjiao,
            InstalledRate_gongjiao: vehicleInstallItem.InstalledRate_gongjiao,

            ALLVehicle_zulin: vehicleInstallItem.ALLVehicle_zulin,
            InstalledVehicle_zulin: vehicleInstallItem.InstalledVehicle_zulin,
            InstalledRate_zulin: vehicleInstallItem.InstalledRate_zulin,

            ALLVehicle_xiaoyuan: vehicleInstallItem.ALLVehicle_xiaoyuan,
            InstalledVehicle_xiaoyuan: vehicleInstallItem.InstalledVehicle_xiaoyuan,
            InstalledRate_xiaoyuan: vehicleInstallItem.InstalledRate_xiaoyuan,

            ALLVehicle_qita: vehicleInstallItem.ALLVehicle_qita,
            InstalledVehicle_qita: vehicleInstallItem.InstalledVehicle_qita,
            InstalledRate_qita: vehicleInstallItem.InstalledRate_qita
          };
          break;
        case this.tabNameObj.fouTab.tabName:
          return {
            sybid: vehicleInstallItem.sybid,
            LicensePlat: vehicleInstallItem.LicensePlat,
            PlateColor: vehicleInstallItem.PlateColor,
            ZName: vehicleInstallItem.ZName,
            CityName: vehicleInstallItem.CityName,

            UnitName: vehicleInstallItem.UnitName,
            VehicleType: vehicleInstallItem.VehicleType,
            PlatformName: vehicleInstallItem.PlatformName,
            GPSInstalled: vehicleInstallItem.GPSInstalled,
            GPSTime: vehicleInstallItem.GPSTime,
            DeviceConfig: vehicleInstallItem.DeviceConfig
          };
          break;
        case this.tabNameObj.fifTab.tabName:
          return {
            sybid: vehicleInstallItem.sybid,
            LicensePlat: vehicleInstallItem.LicensePlat,
            PlateColor: vehicleInstallItem.PlateColor,
            ZName: vehicleInstallItem.ZName,
            CityName: vehicleInstallItem.CityName,

            UnitName: vehicleInstallItem.UnitName,
            VehicleType: vehicleInstallItem.VehicleType,
            PlatformName: vehicleInstallItem.PlatformName,
            GPSInstalled: vehicleInstallItem.GPSInstalled,
            GPSTime: vehicleInstallItem.GPSTime,
            DeviceConfig: vehicleInstallItem.DeviceConfig
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
      const exportVehicleInstallDataParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.activeName,
        msg.isSplitPage //是否分页 - 导出数据
      );
      self.tabCtntList[self.activeNameIndex].loading = true;//下载数据的时候，显示正在下载数据的logo
      axiosRequest
        .axiosGet(this.exportVehicleInstallDataUrl, exportVehicleInstallDataParams)
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
          for (let msgItem of msg) {
            if (msgItem.labelId === "ZoneId") zoneId = msgItem.compId;
            else if (msgItem.labelId === "fromTodatePicker") {
              beginDate = msgItem.compVal[0]; //时间起
              endDate = msgItem.compVal[1]; //时间止
            } else if (msgItem.labelId === "DeviceID") deviceID = msgItem.compVal;
            else if (msgItem.labelId === "CarType") carType = msgItem.compVal;
          }
          break;
        case this.tabNameObj.secTab.tabName:
          this.activeNameIndex = 1;
          nType = this.tabNameObj.secTab.nType;
          for (let msgItem of msg) {
            if (msgItem.labelId === "PlatformId") platformId = msgItem.compId;
            else if (msgItem.labelId === "ZoneId") zoneId = msgItem.compId;
            else if (msgItem.labelId === "fromTodatePicker") {
              beginDate = msgItem.compVal[0]; //时间起
              endDate = msgItem.compVal[1]; //时间止
            } else if (msgItem.labelId === "DeviceID") deviceID = msgItem.compVal;
            else if (msgItem.labelId === "CarType") carType = msgItem.compVal;
          }
          break;
        case this.tabNameObj.thiTab.tabName:
          this.activeNameIndex = 2;
          nType = this.tabNameObj.thiTab.nType; 
          for (let msgItem of msg) {
            if (msgItem.labelId === "ZoneId") zoneId = msgItem.compId;
            else if (msgItem.labelId === "UnitId") unitId = msgItem.compId;
            else if (msgItem.labelId === "fromTodatePicker") {
              beginDate = msgItem.compVal[0]; //时间起
              endDate = msgItem.compVal[1]; //时间止
            } else if (msgItem.labelId === "DeviceID") deviceID = msgItem.compVal;
            else if (msgItem.labelId === "CarType") carType = msgItem.compVal;
          }
          break;
        case this.tabNameObj.fouTab.tabName:
          this.activeNameIndex = 3;
          nType = this.tabNameObj.fouTab.nType; 
          for (let msgItem of msg) {
            if (msgItem.labelId === "VehicleId") vehicleId = msgItem.compId;
            else if (msgItem.labelId === "ZoneId") zoneId = msgItem.compId;
            else if (msgItem.labelId === "PlatformId") platformId = msgItem.compId;
            else if (msgItem.labelId === "UnitId") unitId = msgItem.compId;
            else if (msgItem.labelId === "EndDate") endDate = msgItem.compVal;
            else if (msgItem.labelId === "CarType") carType = msgItem.compVal;
            else if (msgItem.labelId === "DeviceID") deviceID = msgItem.compVal;
            else if (msgItem.labelId === "InstallID") installID = msgItem.compVal;
          }
          break;
        case this.tabNameObj.fifTab.tabName:
          this.activeNameIndex = 4;
          nType = this.tabNameObj.fifTab.nType; 
          for (let msgItem of msg) {
            if (msgItem.labelId === "VehicleId") vehicleId = msgItem.compId;
            else if (msgItem.labelId === "ZoneId") zoneId = msgItem.compId;
            else if (msgItem.labelId === "PlatformId") platformId = msgItem.compId;
            else if (msgItem.labelId === "UnitId") unitId = msgItem.compId;
            else if (msgItem.labelId === "fromTodatePicker") {
              beginDate = msgItem.compVal[0]; //时间起
              endDate = msgItem.compVal[1]; //时间止
            } else if (msgItem.labelId === "CarType") carType = msgItem.compVal;
            else if (msgItem.labelId === "DeviceID") deviceID = msgItem.compVal;
            else if (msgItem.labelId === "GPSInstalled") gPSInstalled = msgItem.compVal;
          }
          break;
        default:
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
  }
};
</script>
