<template>
  <div class="home-content">
    <el-row class="home-main">
      <el-col class="content-left" :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <main-display-items :mainDisItems="mainDisItems"></main-display-items>
        <!--注释人：向浩
        注释时间：2018-07-03
        注释原因：由于业务调整，隐藏该模块内容
        -->
        <!-- <el-col class="left-top" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <carsousel-component :swiperRslt="swiperRslt"></carsousel-component>
        </el-col> -->
        <el-col class="left-bottom" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-col class="home-industry-regulation" :xs="14" :sm="12" :md="12" :lg="12" :xl="12" v-hasAccess= "{accessId:'home_jrptjg'}">
            <router-link to="">
            <pie-component :pieEcharts="pieEcharts"></pie-component>
            <div class="platform-total">
              <span class="platform-total-number">{{getCompanyCountTemp.CompanyTotal}}</span>
              <label>{{totalText}}</label>
            </div>
            </router-link>
          </el-col>
          <el-col class="home-accessPlatform-regulation" :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-hasAccess= "{accessId:'home_cljg'}">
            <router-link :to="routerLink">
            <pie-component :pieEcharts="pieEchartsAccess"></pie-component>
            <div class="platform-total">
              <span class="platform-total-number">{{AccessPlatTotal}}</span>
              <label>{{onltotalText}}</label>
            </div>
            </router-link>
          </el-col>
        </el-col>
        <el-col class="left-bottom" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <vehicle-distribution-dashboard></vehicle-distribution-dashboard>
        </el-col>
      </el-col>
      <el-col class="content-right" :xs="24" :sm="24" :md="10" :lg="13" :xl="13">
        <home-security-right></home-security-right>
      </el-col>
    </el-row>
    <footer-container></footer-container>
  </div>
</template>

<style src="./bodycontent-container.css" type="text/css"></style>

<script>
import MainDisplayItems from "@/components/MainDisplayItems/MainDisplayItems";
import IndustryRegulation from "@/components/IndustryRegulation/IndustryRegulation";
import AccessPlatformRegulation from "@/components/AccessPlatformRegulation/AccessPlatformRegulation";
import VehicleDistributionDashboard from "@/components/VehicleDistributionDashboard/VehicleDistributionDashboard";
import HomeSecurityRight from "@/components/HomeSecurityRight/HomeSecurityRight";
import FooterContainer from "@/Home/container/FooterContainer/FooterContainer";
import CarsouselComponent from "@/components/CarsouselComponent/CarsouselComponent";
import PieComponent from "@/components/PieComponent/PieComponent";
import {
  axiosRequest,
  // getalarm_actual,
  superviseRslt,
  storageOperation
} from "@/common/common";
// 注释人：向浩
// 注释时间：2018-07-17
// 注释原因：目前这种包管理方式还不能正常工作， 展示还是需要采用这种方式
// import {
//   getalarm_actual,
//   superviseRslt
// } from "@/common/webSocket";

import { commonConfig, provinceVal } from "@/config/commonConfig";
import { store } from '@/vuex/store';
export default {
  name: "BodyContent-Container",
  components: {
    MainDisplayItems,
    IndustryRegulation,
    AccessPlatformRegulation,
    VehicleDistributionDashboard,
    HomeSecurityRight,
    FooterContainer,
    CarsouselComponent,
    PieComponent
  },
  
  data() {
    return {
      totalText: "企业总数",
      GetCompanyCountUrl: commonConfig.rootUrl + commonConfig.HomeAPI.GetCompanyCount,
      storeUsrAccessManagement: store.state.usrAccessManagement,
      swiperRslt: [
        {
          titleName: "车辆",
          tabHeader: [
            {
              prop: "date",
              label: "日期",
              span: "8"
            },
            {
              prop: "name",
              label: "名字",
              span: "8"
            },
            {
              prop: "address",
              label: "地址",
              span: "8"
            }
          ],
          tabCtnt: [
            {
              date: "2016-05-02",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1518 弄"
            },
            {
              date: "2016-05-04",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1517 弄"
            },
            {
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            },
            {
              date: "2016-05-03",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1516 弄"
            },
            {
              date: "2016-05-02",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1518 弄"
            },
            {
              date: "2016-05-04",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1517 弄"
            },
            {
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            },
            {
              date: "2016-05-03",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1516 弄"
            }
          ]
        },
        {
          titleName: "企业",
          tabHeader: [
            {
              prop: "date",
              label: "日期"
            },
            {
              prop: "name",
              label: "名字"
            },
            {
              prop: "address",
              label: "地址"
            }
          ],
          tabCtnt: [
            {
              date: "2016-05-02",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1518 弄"
            },
            {
              date: "2016-05-04",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1517 弄"
            },
            {
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            },
            {
              date: "2016-05-03",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1516 弄"
            },
            {
              date: "2016-05-02",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1518 弄"
            },
            {
              date: "2016-05-04",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1517 弄"
            },
            {
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            }
          ]
        },
        {
          titleName: "地区",
          tabHeader: [
            {
              prop: "date",
              label: "日期"
            },
            {
              prop: "name",
              label: "名字"
            },
            {
              prop: "address",
              label: "地址"
            }
          ],
          tabCtnt: [
            {
              date: "2016-05-02",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1518 弄"
            },
            {
              date: "2016-05-04",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1517 弄"
            },
            {
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄"
            },
            {
              date: "2016-05-03",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1516 弄"
            }
          ]
        }
      ],
      getCompanyCountTemp: {
        BanxianCount: "",
        LvyouBaoCount: "",
        WeihuoCount: "",
        ZhonghuoCount: "",
        QitaCount: "",
        CompanyTotal: ""
      },
      // start - 车辆监管
      routerLink: "/Home/Monitor",
      accPlatTitle: "车辆监管",
      TYPE2CNT: 0,
      TYPE3CNT: 0,
      AccessPlatTotal: 0,
      onltotalText: "在线车辆总数",
      getUrl: commonConfig.rootUrl + commonConfig.HomeAPI.GetHomeCurrentOnlineData,
      // end - 车辆监管
      defaultHyperLink: { //根据权限来动态生成默认打开的统计分析和基本信息的界面
        reportUrl: [{
          urlName: '/VehicleInstall',
          ctrlId: 'tjfx_clazs'
        },{
          urlName: '/VehicleOnline',
          ctrlId: 'tjfx_clzxl'
        },{
          urlName: '/VehicleUplineRate',
          ctrlId: 'tjfx_clsxtj'
        },{
          urlName: '/CurrentOnline',
          ctrlId: 'tjfx_clsszxqk'
        },{
          urlName: '/AlarmSupervision',
          ctrlId: 'tjfx_clbjdbtj'
        },{
          urlName: '/AlarmDeal',
          ctrlId: 'tjfx_wzcltj'
        },{
          urlName: '/AlarmPush',
          ctrlId: 'tjfx_jqtstj'
        }],
        reportLink: '',
        baseinfoUrl: [
          {
            urlName: '/Vehicle',
            ctrlId: 'jbxx_clgl'
          },{
            urlName: '/Company',
            ctrlId: 'jbxx_ysqygl'
          },{
            urlName: '/UserInfo',
            ctrlId: 'jbxx_yhgl'
          },{
            urlName: '/DriverInfo',
            ctrlId: 'jbxx_jsygl'
          },{
            urlName: '/Role',
            ctrlId: 'jbxx_jsgl'
          }],
        baseinfoLink: '',
      }
    };
  },
  computed: {
    pieEcharts: function() {
      return {
        routerLink: "",
        idName: "home_platform_chart",
        // data: ['包车客车', '旅游客车', '重货、半挂牵引车', '三类班线客车', '危险品车'],
        data: [
          "班线客运: " + this.getCompanyCountTemp.BanxianCount + "家", //banxianCount
          "旅游包车: " + this.getCompanyCountTemp.LvyouBaoCount + "家", //tourCount
          "危货运输: " + this.getCompanyCountTemp.WeihuoCount + "家", //dangerCount
          "重货运输: " + this.getCompanyCountTemp.ZhonghuoCount + "家", //heavyCount
          "其他类型: " + this.getCompanyCountTemp.QitaCount + "家" //otherCount
        ],
        titleX: "2%",
        titleY: "3%",
        titleName: "企业分布", //显示饼图的title
        legendOrient: "vertical",
        legendX: "2%",
        legendY: "15%",
        color: ["#97ffff", "#3a8dff", "#4ccfd1", "#02F4F5", "#6da5f1"],
        seriesName: "企业分布",
        seriesRadius: "45%",
        seriesdata: [
          {
            value: this.getCompanyCountTemp.BanxianCount,
            name: "班线客运: " + this.getCompanyCountTemp.BanxianCount + "家" //banxianCount
          },
          {
            value: this.getCompanyCountTemp.LvyouBaoCount,
            name: "旅游包车: " + this.getCompanyCountTemp.LvyouBaoCount + "家" //tourCount
          },
          {
            value: this.getCompanyCountTemp.WeihuoCount,
            name: "危货运输: " + this.getCompanyCountTemp.WeihuoCount + "家" //banxianCount
          },
          {
            value: this.getCompanyCountTemp.ZhonghuoCount,
            name: "重货运输: " + this.getCompanyCountTemp.ZhonghuoCount + "家" //tourCount
          },
          {
            value: this.getCompanyCountTemp.QitaCount,
            name: "其他类型: " + this.getCompanyCountTemp.QitaCount + "家" //banxianCount
          }
        ]
      };
    },
    // 车辆监管
    pieEchartsAccess: function() {
      return {
        routerLink: "",
        idName: "access_platform_echarts",
        // data: ['包车客车', '旅游客车', '重货、半挂牵引车', '三类班线客车', '危险品车'],
        data: [
          "在线行驶车辆: " + this.TYPE2CNT + "辆",
          "在线停车车辆: " + this.TYPE3CNT + "辆",
        ],
        titleX: "2%",
        titleY: "3%",
        titleName: "车辆监管", //显示饼图的title
        legendOrient: "vertical",
        legendX: "2%",
        legendY: "15%",
        color: ["#97ffff", "#3a8dff"],
        seriesName: "车辆监管",
        seriesRadius: ["25%","45%"],
        seriesdata: [
          {
            value: this.TYPE2CNT,
            name: "在线行驶车辆: " + this.TYPE2CNT + "辆"
          },
          {
            value: this.TYPE3CNT,
            name: "在线停车车辆: " + this.TYPE3CNT + "辆"
          }
        ],
      };
    },
    mainDisItems: function(){
      return [
        {
          href: "/Home/VehicleBreakRule",
          spanClass: "ban6",
          spanText: "违章统计 >>",
          ctrlId: 'wztj', //需要权限控制的情况下，需要制定id号
        },
        {
          href: "/Home/Supervise",
          spanClass: "Illegal",
          spanText: "实时报警 >>",
          // badgeValue: this.$store.state.superviseRslt.overspeedLength + this.$store.state.superviseRslt.abnormalmoveLength + this.$store.state.superviseRslt.over4hourLength,
          badgeValue: this.$store.getters.allLengths,
          ctrlId: 'fjbj', //需要权限控制的情况下，需要制定id号
        },
        {
          href: "/Home/Report" + this.defaultHyperLink.reportLink,
          spanClass: "report",
          spanText: "统计分析 >>",
          ctrlId: 'tjfx', //需要权限控制的情况下，需要制定id号
        },
        {
          href: "/Home/BaseInfo" + this.defaultHyperLink.baseinfoLink,
          spanClass: "baseInfo",
          spanText: "基本信息 >>",
          ctrlId: 'jbxx', //需要权限控制的情况下，需要制定id号
        },
        // {
        //   href: "/Home/SendCheckList",
        //   spanClass: "share",
        //   spanText: "双随机抽查 >>",
        //   ctrlId: 'ssjcc', //需要权限控制的情况下，需要制定id号
        // },
        // 注释人：向浩
        // 注释时间：2018-08-12
        // 注释原因：根据分析需求，屏蔽没有实现功能
        // {
        //   href: "/Home/ReviewInfo",
        //   spanClass: "companySupervise",
        //   spanText: "投诉管理 >>",
        //   ctrlId: 'tsgl', //需要权限控制的情况下，需要制定id号
        // }
      ]
    }
  },
  mounted: function() {
    this.getCompanyCount();
    // 获取车辆监管
    this.getHomeCurrentOnlineData();
    // 设置默认的第一个有权限的统计分析连接，这里涉及到权限管理，所以需要知道哪一个连接是有权限访问的
    const accessList = JSON.parse(storageOperation.getItem('accessList'));
    let isHasAccess = false;
    for(let reportItem of this.defaultHyperLink.reportUrl){
      for (let usrAccessItem of accessList) {
        if (usrAccessItem.CtrlId === reportItem.ctrlId) {
          if (usrAccessItem.RightKind) {
            isHasAccess = true;
            this.defaultHyperLink.reportLink = reportItem.urlName;
            break;
          }
        }
      }
      if(isHasAccess) break;
    }
    isHasAccess = false;
    // 设置默认的第一个有权限的基本信息连接，这里涉及到权限管理，所以需要知道哪一个连接是有权限访问的
    for(let baseinfoItem of this.defaultHyperLink.baseinfoUrl){
      for (let usrAccessItem of accessList) {
        if (usrAccessItem.CtrlId === baseinfoItem.ctrlId) {
          if (usrAccessItem.RightKind) {
            isHasAccess = true;
            this.defaultHyperLink.baseinfoLink = baseinfoItem.urlName;
            break;
          }
        }
      }
      if(isHasAccess) break;
    }
  },
  methods: {
    getCompanyCount: function() {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_jrptjg'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const getCompanyCountParams = {
        zoneId: provinceVal.provinceId
      };
      axiosRequest.axiosGet(this.GetCompanyCountUrl, getCompanyCountParams)
        .then(function(response) {
          // console.log(response.data);
          /**
             * BanxianCount
                :
                26
                CompanyTotal
                :
                46
                LvyouBaoCount
                :
                11
                QitaCount
                :
                22
                WeihuoCount
                :
                5
                ZhonghuoCount
                :
                2
             */
          self.getCompanyCountTemp = response.data;
        })
        .catch(function(error) {});
    },
    getHomeCurrentOnlineData: function() {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_cljg'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const getHomeCurrentOnlineDataParams = {
        zoneId: provinceVal.provinceId
      };
      axiosRequest.axiosGet(this.getUrl, getHomeCurrentOnlineDataParams)
        .then(function(response) {
          /*AccessPlatTotal:0
            OnlineRunCount:0
            OnlineStopCount:0 */
          self.AccessPlatTotal = response.data.OnlineRunCount + response.data.OnlineStopCount;
          self.TYPE2CNT = response.data.OnlineRunCount;
          self.TYPE3CNT = response.data.OnlineStopCount;
        })
        .catch(function(error) {});
    }
  },
  created: function() {
    // 实现面包屑导航
    const breadNavs = [];
    this.$emit("viewIn", breadNavs);
  }
};
</script>
