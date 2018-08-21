<template>
  <el-row class="supervise">
    <el-row class="supervise-center-map">
      <baidu-map :baiduMap="baiduMap" :latitude="latitude" :longtitude="longtitude" :seriesPoints="seriesPoints" :tabCtntList="tabCtntList[0]"></baidu-map>
    </el-row>
    <multi-level-table-component 
    :activeName="activeName" 
    :tabCtntList="tabCtntList" 
    class="supervise-multilevel"
    v-on:handleRowClick="handleRowClick"
    v-on:rowDblClick="rowDblClick"></multi-level-table-component>
  </el-row>
</template>
<style src="./supervise.css" type="text/css"  scoped></style>

<script>
// scoped: 防止css全局污染
import MultiLevelTableComponent from "./SuperviseMultiLevelTableComponent/SuperviseMultiLevelTableComponent";
import BaiduMap from "@/components/BaiduMap/BaiduMap";
import {
  axiosRequest,
  storageOperation,
  handleErrorMsg
} from "@/common/common";
import { commonConfig, provinceVal } from "@/config/commonConfig";
// 引入权限控制的文件
import { $_hasAccess } from "@/accessmanagement/accessmanagement";
export default {
  name: "Supervise",
  components: {
    MultiLevelTableComponent,
    BaiduMap
  },
  data() {
    return {
      activeName: "supervise_o_count",
      activeNameIndex: 0,
      getProviderCheckDetailDataUrl:
        commonConfig.rootUrl + commonConfig.GetProviderCheckDetailData,
      exportProviderCheckDetailDataUrl: commonConfig.rootUrl + commonConfig.ExportProviderCheckDetailData,
      // 双击获取车辆历史轨迹
      getHistoryInfoUrl: commonConfig.rootUrl + commonConfig.MonitorAPI.GetHistoryInfo,
      // // 每一大列的满分得分
      // columnFullScore: {
      //   rwl: 5,
      //   sxl: 10,
      //   wxpyl: 15,
      //   gjwzl: 40,
      //   sjhgl: 30,
      //   pjcscs: 0,
      //   pjpjsc: 0
      // },
      // 每一列的类型，目前已经有纯文本和router-link
      columnType: {
        text: "text",
        router_link: "router_link"
      },
      // 存储每10行的数据
      providerCheckSourceData: [],
      // 存储合计的数据
      countData: [],
      // tabName作为标识符
      tabNameObj: {
        firTab: {
          tabLabel: "超速",
          tabLabelNumber: 0, //标签旁边的总数
          tabName: "supervise_o_count", //将作为标识符来区分-这个名字还需要作为时候需要显示操作（定位，督办）
          nType: 1, //根据重构前的请求，可以看到nType 为1
          ctrlId: "fjbj_cs" //需要权限控制的情况下，需要制定id号
        },
        secTab: {
          tabLabel: "凌晨2-5报警运行",
          tabLabelNumber: 0, //标签旁边的总数
          tabName: "supervise_a_count", //将作为标识符来区分-这个名字还需要作为时候需要显示操作（定位，督办）
          nType: 2, //根据重构前的请求，可以看到nType 为2
          ctrlId: "fjbj_lc24bjyx" //需要权限控制的情况下，需要制定id号
        },
        thiTab: {
          tabLabel: "疲劳驾驶",
          tabLabelNumber: 0, //标签旁边的总数
          tabName: "supervise_f_count", //将作为标识符来区分-这个名字还需要作为时候需要显示操作（定位，督办）
          nType: 3, //根据重构前的请求，可以看到nType 为3
          ctrlId: "fjbj_pljs" //需要权限控制的情况下，需要制定id号
        }
      },
      tabCtntList: [], //基于目前标签页不能使用自定义指令v-hasAccess进行权限管理
      // 百度地图需要使用的参数
      baiduMap: {
        textObj: {
          title: "",
          message: ""
        },
        // displayType: '单击显示messageBox, 双击显示historyRoute'
        displayType: "messageBox"
      },
      seriesPoints: [],
      latitude: provinceVal.latitude, //默认情况下显示石家庄的维度（权限控制）
      longtitude: provinceVal.longtitude, //默认情况下显示石家庄的经度（权限控制）
      overspeedLength: 0, //用来保存实时报警-超速的信息
    };
  },
  methods: {
    // 响应子组件传递的实时警情单击事件
    handleRowClick: function(msg) {
      this.latitude = msg.eLatitude;
      this.longtitude = msg.eLongtitude;
      this.baiduMap.displayType = "messageBox";
      this.baiduMap.textObj = {
        title: msg.plate,
        message:
          "<div class='supervise-msg-box-left'>所属企业：</div>" + "<div class='supervise-msg-box-right'>" + msg.unitName + "</div>"+
          "<div class='supervise-msg-box-left'>所属接入平台：</div>" + "<div class='supervise-msg-box-right'>" + msg.platformName + "</div>"+
          "<div class='supervise-msg-box-left'>地址：</div>" + "<div class='supervise-msg-box-right'>" + msg.bAddress + "</div>"+
          "<div class='supervise-msg-box-left'>速度/限速值：</div>" + "<div class='supervise-msg-box-right'>" + msg.topSpeed + "/" + msg.speedLimit||0 + " km/h</div>"+
          "<div class='supervise-msg-box-left'>报警类别：</div>" + "<div class='supervise-msg-box-right'>" + msg.alarmTypeName + "</div>"+
          "<div class='supervise-msg-box-left'>报警时间：</div>" + "<div class='supervise-msg-box-right'>" + msg.startTime + "</div>"
      };
    },
    rowDblClick: function(msg) {
      this.baiduMap.displayType = "historyRoute";
      console.log(this.baiduMap.displayType);
      this.getHisotryInfo(msg);
    },
    // 获取当前行的车辆的历史轨迹
    getHisotryInfo: function(rowItem) {
      storageOperation.setItem(commonConfig.ctrlId, "home_cljg_clnsgj"); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const self = this;
      // 封装函数来组装每一页请求的参数
      const getHistoryInfoUrlParams = {
        VehicleId: rowItem.vehicleId,
        StartDate: rowItem.sDate,
        EndDate: rowItem.eDate,
        StartTime: rowItem.sTime,
        EndTime: rowItem.eTime
      };
      // self.tabCtntList[self.activeNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // // 清空当前数据的集合
      // self.providerCheckSourceData = [];
      axiosRequest
        .axiosGet(this.getHistoryInfoUrl, getHistoryInfoUrlParams)
        .then(function(response) {
          const historyInfoTemp = response.data;
          console.log(historyInfoTemp);
          const seriesPointsTemp = [];
          for (let historyInfoItem of historyInfoTemp) {
            seriesPointsTemp.push({
              latitude: historyInfoItem.latitudeCNV,
              longitude: historyInfoItem.longitudeCNV
            });
          }
          self.seriesPoints = seriesPointsTemp;
          console.log(self.seriesPoints);
        })
        .catch(function(error) {
          self.$message({
            type: "warning",
            message: handleErrorMsg(error)
          });
          self.tabCtntList[self.activeNameIndex].loading = false;
        });
    }
  },
  computed: {
    tabCtntListFinalArr: function() {
      return [
        {
          tabLabel:
            this.tabNameObj.firTab.tabLabel +
            "（" +
            this.$store.state.overspeedLength +
            "）",
          tabName: this.tabNameObj.firTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.firTab.ctrlId, //需要权限控制的情况下，需要制定id号
          indexNumber: "", //在权限控制下真正的下标
          nType: this.tabNameObj.firTab.nType,
          currentPage: 1, //当前页数
          total: 0, //总条数,
          loading: false,
          btnEvents: [],
          searchCreteria: [],
          tabHeader: [
            {
              headerKey: "alarmStatus",
              headerVal: "违章状态",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "tel",
              headerVal: "企业联系电话",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "plate",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "plateColor",
              headerVal: "车牌颜色",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "vehicleType",
              headerVal: "车辆类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "zoneName",
              headerVal: "所属地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "unitName",
              headerVal: "所属企业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "platformName",
              headerVal: "所属接入平台",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "alarmTypeName",
              headerVal: "报警类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "startTime",
              headerVal: "报警开始时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "endTime",
              headerVal: "报警结束时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "bAddress",
              headerVal: "开始位置",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "eAddress",
              headerVal: "结束位置",
              subHeaders: [],
              columnType: this.columnType.text
            },

            {
              headerKey: "roadLevel",
              headerVal: "是否高速",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "dayType",
              headerVal: "报警时段",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "topSpeed",
              headerVal: "最高速度",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "overSpeedRate",
              headerVal: "超速率",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "speedLimit",
              headerVal: "限速值",
              subHeaders: [],
              columnType: this.columnType.text
            },
            // {
            //   headerKey: "levelStr",
            //   headerVal: "严重级别",
            //   subHeaders: [],
            //   columnType: this.columnType.text
            // },
            // {
            //   headerKey: "source",
            //   headerVal: "报警来源",
            //   subHeaders: [],
            //   columnType: this.columnType.text
            // },
            // {
            //   headerKey: "isSupervise",
            //   headerVal: "是否督办",
            //   subHeaders: [],
            //   columnType: this.columnType.text
            // }
          ],
          TabCtnt: this.$store.state.superviseRslt.overspeed
          // TabCtnt: [
          //     {
          //       sybid: "2016-05-031",
          //       plate: "王小虎1",
          //       plateColor: "上海1",
          //       vehicleType: "普陀区1",
          //       zoneName: "上海市普陀区金沙江路 1518 弄1",
          //       unitName: 2003331,
          //       eLatitude: 38.045474,
          //       eLongtitude: 112.502461,
          //       startTime: '20180713000000',
          //       endTime: '20180713132257',
          //       vehicleId: 2035,
          //     },
          //     {
          //       sybid: "2016-05-032",
          //       plate: "王小虎2",
          //       plateColor: "上海2",
          //       vehicleType: "普陀区2",
          //       zoneName: "上海市普陀区金沙江路 1518 弄2",
          //       unitName: 2003332,
          //       eLatitude: 40.045474,
          //       eLongtitude: 116.502461,
          //       startTime: '20180713080201',
          //       endTime: '20180713080631',
          //       vehicleId: 2093,
          //     },
          // ]
        },
        {
          tabLabel:
            this.tabNameObj.secTab.tabLabel +
            "（" +
            this.$store.state.abnormalmoveLength +
            "）",
          tabName: this.tabNameObj.secTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.secTab.ctrlId, //需要权限控制的情况下，需要制定id号
          indexNumber: "", //在权限控制下真正的下标
          nType: this.tabNameObj.secTab.nType,
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [],
          searchCreteria: [],
          tabHeader: [
            {
              headerKey: "alarmStatus",
              headerVal: "违章状态",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "tel",
              headerVal: "企业联系电话",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "plate",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "plateColor",
              headerVal: "车牌颜色",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "vehicleType",
              headerVal: "车辆类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "zoneName",
              headerVal: "所属地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "unitName",
              headerVal: "所属企业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "platformName",
              headerVal: "所属接入平台",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "alarmTypeName",
              headerVal: "报警类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "startTime",
              headerVal: "报警开始时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "endTime",
              headerVal: "报警结束时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "bAddress",
              headerVal: "开始位置",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "eAddress",
              headerVal: "结束位置",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "topSpeed",
              headerVal: "最高速度",
              subHeaders: [],
              columnType: this.columnType.text
            },
            // {
            //   headerKey: "source",
            //   headerVal: "报警来源",
            //   subHeaders: [],
            //   columnType: this.columnType.text
            // },
            // {
            //   headerKey: "isSupervise",
            //   headerVal: "是否督办",
            //   subHeaders: [],
            //   columnType: this.columnType.text
            // }
          ],
          TabCtnt: this.$store.state.superviseRslt.abnormalmove
          // TabCtnt: [
          //     // {
          //     //   sybid: "2016-05-03",
          //     //   plate: "王小虎",
          //     //   plateColor: "上海",
          //     //   vehicleType: "普陀区",
          //     //   zoneName: "上海市普陀区金沙江路 1518 弄",
          //     //   unitName: 200333
          //     // },
          //     // {
          //     //   sybid: "2016-05-03",
          //     //   plate: "王小虎",
          //     //   plateColor: "上海",
          //     //   vehicleType: "普陀区",
          //     //   zoneName: "上海市普陀区金沙江路 1518 弄",
          //     //   unitName: 200333
          //     // },
          // ]
        },
        {
          tabLabel:
            this.tabNameObj.thiTab.tabLabel +
            "（" +
            this.$store.state.over4hourLength +
            "）",
          tabName: this.tabNameObj.thiTab.tabName, //将作为标识符来区分
          ctrlId: this.tabNameObj.thiTab.ctrlId, //需要权限控制的情况下，需要制定id号
          indexNumber: "", //在权限控制下真正的下标
          nType: this.tabNameObj.thiTab.nType,
          currentPage: 1, //当前页数
          total: 0, //总条数
          loading: false,
          btnEvents: [],
          searchCreteria: [],
          tabHeader: [
            {
              headerKey: "alarmStatus",
              headerVal: "违章状态",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "tel",
              headerVal: "企业联系电话",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "plate",
              headerVal: "车牌号",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "plateColor",
              headerVal: "车牌颜色",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "vehicleType",
              headerVal: "车辆类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "zoneName",
              headerVal: "所属地区",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "unitName",
              headerVal: "所属企业",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "platformName",
              headerVal: "所属接入平台",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "alarmTypeName",
              headerVal: "报警类型",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "startTime",
              headerVal: "报警开始时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "endTime",
              headerVal: "报警结束时间",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "bAddress",
              headerVal: "开始位置",
              subHeaders: [],
              columnType: this.columnType.text
            },
            {
              headerKey: "eAddress",
              headerVal: "结束位置",
              subHeaders: [],
              columnType: this.columnType.text
            },
            // {
            //   headerKey: "source",
            //   headerVal: "报警来源",
            //   subHeaders: [],
            //   columnType: this.columnType.text
            // },
            // {
            //   headerKey: "isSupervise",
            //   headerVal: "是否督办",
            //   subHeaders: [],
            //   columnType: this.columnType.text
            // }
          ],
          TabCtnt: this.$store.state.superviseRslt.over4hour
          // TabCtnt: [
          //     // {
          //     //   sybid: "2016-05-03",
          //     //   plate: "王小虎",
          //     //   plateColor: "上海",
          //     //   vehicleType: "普陀区",
          //     //   zoneName: "上海市普陀区金沙江路 1518 弄",
          //     //   unitName: 200333
          //     // },
          //     // {
          //     //   sybid: "2016-05-03",
          //     //   plate: "王小虎",
          //     //   plateColor: "上海",
          //     //   vehicleType: "普陀区",
          //     //   zoneName: "上海市普陀区金沙江路 1518 弄",
          //     //   unitName: 200333200333
          //     // },
          // ]
        }
      ];
    },
    //设置超速的值
    getOverspeedLength(){
      return this.$store.state.overspeedLength;
    },
    //设置凌晨2-5报警运行
    getAbnormalmoveLength(){
      return this.$store.state.abnormalmoveLength;
    },
    //设置疲劳驾驶的值
    getOver4hourLength(){
      return this.$store.state.over4hourLength;
    },
  },
  watch: {
    getOverspeedLength: function(newVal){
      this.overspeedLength = newVal;
      // 向浩：上面设置的值无效，因为ElementUI框架不支持更新标签页，只能通过js强制修改标签页的值
      //注意这个id 需要修改
      document.getElementById('tab-supervise_o_count').innerHTML = this.tabNameObj.firTab.tabLabel + "（" + newVal + "）"; //设置超速的值
    },
    getAbnormalmoveLength: function(newVal){
      this.overspeedLength = newVal;
      // 向浩：上面设置的值无效，因为ElementUI框架不支持更新标签页，只能通过js强制修改标签页的值
      //注意这个id 需要修改
      document.getElementById('tab-supervise_a_count').innerHTML = this.tabNameObj.secTab.tabLabel + "（" + newVal + "）"; //设置凌晨2-5报警运行
    },
    getOver4hourLength: function(newVal){
      this.overspeedLength = newVal;
      // 向浩：上面设置的值无效，因为ElementUI框架不支持更新标签页，只能通过js强制修改标签页的值
      //注意这个id 需要修改
      document.getElementById('tab-supervise_f_count').innerHTML = this.tabNameObj.thiTab.tabLabel + "（" + newVal + "）"; //设置疲劳驾驶的值
    },
  },
  created: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
    // 由于标签页不能直接使用ctrlId来进行权限管理，所以需要换种方式
    const accessList = JSON.parse(storageOperation.getItem("accessList"));
    let indexNumber = 0;
    for (let tabCtntItem of this.tabCtntListFinalArr) {
      if ($_hasAccess(tabCtntItem.ctrlId, accessList)) {
        //该值和sessionStorage中的accessList是一致的，因为vue自定义指令无法访问vuex，所以才会出现sessionStorage的副本
        tabCtntItem.indexNumber = indexNumber;
        this.tabCtntList.push(tabCtntItem);
        indexNumber++;
      }
    }
  }
};
</script>
