
<template>
  <el-row class="home-security-right-part">
    <el-col class="home-security-left" :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
      <security-content-vue :mapItem="mapItem"></security-content-vue>
    </el-col>
    <el-col class="home-security-right" :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
      <div @mouseover="overShow(hmSecItem.key, 'mouseOver')"
        @mouseout="outShow(hmSecItem.key)"
        v-for="hmSecItem in HomeSecurityItems" 
        :key="hmSecItem.key" 
        :class="['home-security-right-item', hmSecItem.activeflag]"
        v-hasAccess= "{accessId: hmSecItem.ctrlId}">
        <home-security-item :idName="hmSecItem.idName" :homSecItmTitle="hmSecItem.homSecItmTitle" :subTitle="hmSecItem.subTitle" :seriesData="hmSecItem.seriesData"></home-security-item>
      </div>
    </el-col>
  </el-row>
</template>

<style type="text/css" src="./homeSecurityRight.css" scoped>
</style>

<script>
import HomeSecurityItem from "./HomeSecurityItem/HomeSecurityItem";
import SecurityContentVue from "@/components/SecurityContent/SecurityContent";
import {
  axiosRequest,
  formatterNumber,
  getFromLastDayToLastMonth,
  storageOperation,
  isNullUndefEmpty,
  toPoint
} from "@/common/common";
import { commonConfig, provinceVal } from "@/config/commonConfig";
export default {
  name: "HomeSecurityRight",
  components: {
    HomeSecurityItem,
    SecurityContentVue
  },
  data() {
    return {
      // 指定元饼图总的数量
      chartNumbers: {
        // safe_manage_chart: 0,
        home_security_online_chart: 0,
        home_security_line_chart: 0,
        home_security_break_chart: 0
      },
      // 指定元饼图在线总量
      chartCounts: {
        // safe_manageCount: 0,
        home_security_onlineCount: 0,
        home_security_lineCount: 0,
        home_security_breakCount: 0
      },
      // 指定哪一个元饼图处于活跃状态
      activeFlag: {
        // safe_manage_chart_flag: "security-right-selected",
        home_security_online_chart_flag: "security-right-selected",
        home_security_line_chart_flag: "",
        home_security_break_chart_flag: ""
      },
      getCurrentOnlineDataUrl: commonConfig.rootUrl + commonConfig.HomeAPI.GetCurrentOnlineData,
      getSafeManageIllegalDataUrl: commonConfig.rootUrl + commonConfig.HomeAPI.GetSafeManageIllegalData,
      getAlarmDealDataUrl :commonConfig.rootUrl + commonConfig.HomeAPI.GetAlarmDealData,
      planePath:
        "path://M917.965523 917.331585c0 22.469758-17.891486 40.699957-39.913035 40.699957-22.058388 0-39.913035-18.2302-39.913035-40.699957l-0.075725-0.490164-1.087774 0c-18.945491-157.665903-148.177807-280.296871-306.821991-285.4748-3.412726 0.151449-6.751774 0.562818-10.240225 0.562818-3.450589 0-6.789637-0.410346-10.202363-0.524956-158.606321 5.139044-287.839661 127.806851-306.784128 285.436938l-1.014096 0 0.075725 0.490164c0 22.469758-17.854647 40.699957-39.913035 40.699957s-39.915082-18.2302-39.915082-40.699957l-0.373507-3.789303c0-6.751774 2.026146-12.903891 4.91494-18.531052 21.082154-140.712789 111.075795-258.241552 235.432057-312.784796C288.420387 530.831904 239.989351 444.515003 239.989351 346.604042c0-157.591201 125.33352-285.361213 279.924387-285.361213 154.62873 0 279.960203 127.770012 279.960203 285.361213 0 97.873098-48.391127 184.15316-122.103966 235.545644 124.843356 54.732555 215.099986 172.863023 235.808634 314.211285 2.437515 5.290493 4.01443 10.992355 4.01443 17.181311L917.965523 917.331585zM719.822744 346.679767c0-112.576985-89.544409-203.808826-199.983707-203.808826-110.402459 0-199.944821 91.232864-199.944821 203.808826s89.542362 203.808826 199.944821 203.808826C630.278335 550.488593 719.822744 459.256752 719.822744 346.679767z",
      // "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z", //飞机样式
      color: ["#a6c84c", "#ffa022", "#46bee9"],
      series: [],
      homeDataCache: {
        geoCoordMap: {
          石家庄市: [114.525673, 38.057523],
          保定市: [115.463935, 38.896339],
          邯郸市: [114.525673, 36.64762],
          唐山市: [118.186735, 39.668433],
          张家口市: [114.912016, 40.768486],
          廊坊市: [116.678156, 39.540347],
          沧州市: [116.806937, 38.333391]
        },
        markPoints: [
          [
            {
              name: "石家庄市"
            },
            {
              name: "保定市", //终点城市位置
              value: 150 //终点城市圆圈大小
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "邯郸市", //终点城市位置
              value: 150 //终点城市圆圈大小
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "唐山市", //终点城市位置
              value: 150 //终点城市圆圈大小
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "张家口市", //终点城市位置
              value: 150 //终点城市圆圈大小
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "廊坊市", //终点城市位置
              value: 150 //终点城市圆圈大小
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "沧州市", //终点城市位置
              value: 150 //终点城市圆圈大小
            }
          ]
        ],
        // 展示没有使用markLines
        markLines: [
          [
            {
              name: "石家庄市"
            },
            {
              name: "保定市",
              value: 95
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "邯郸市",
              value: 90
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "唐山市",
              value: 80
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "张家口市",
              value: 40
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "廊坊市",
              value: 60
            }
          ],
          [
            {
              name: "石家庄市"
            },
            {
              name: "沧州市",
              value: 20
            }
          ]
        ]
      },
      // 隐患排查地图临时数据
      onLineOffline: {
        offlineData: [],
        onlineData: [],
        // 隐患种类
        yinhuanCategory: {
          breakRuleYinHuan: 0, //违章隐患
          securityYinHuan: 0, //安全隐患
          roadYinHuan: 0, //道路隐患
          transportYinHuan: 0, //交通设施隐患
          otherYinHuan: 0 //其他隐患
        }
      },
      // 车辆在线情况
      vehicleInnetList: [],
      // 全省车辆违章预览
      zoneDataList: [],
      // 全省违章处理情况
      breakRuleHandleList: [],
      // 先默认展示地图
      mapItem: {
          seriesData: [
            {
              name: "车辆在线情况",
              type: "map",
              mapType: "河北", //sessionStorage.zoneName
              // geoCoord: geoCoord,
              mapLocation: {
                y: "20"
              },
              tooltip: {
                formatter: function (params, ticket, callback) {
                  return "请等待一下，正在准备地图数据..."
                }
              },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: "#FFF",
                      fontFamily: "Microsoft YaHei"
                    },
                    formatter: "{b}"
                  },
                  areaColor: "rgb(43,61,78)",
                  borderColor: "rgb(228,230,231)",
                  borderWidth: 0.5,
                  areaStyle: {
                    color: "rgb(43,61,78)"
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    textStyle: {
                      //color: 'yellow',
                      color: "#2FFFFF",
                      fontFamily: "Microsoft YaHei"
                    }
                    // formatter: function(name, value) {
                    //   //"{a}:{b}"
                    //   var res = "";
                    //   if (name.length > 5) {
                    //     res = name.substr(0, 4) + "\n" + name.substr(4);
                    //     return res + ":" + value;
                    //   }
                    //   return name + ":" + value;
                    // }
                  },
                  color: "#1A2C36",
                  areaColor: "rgb(26,44,54)",
                  borderColor: "#FFF",
                  borderWidth: 1
                }
              },
              hoverable: true
            }
          ],
          mapTitle: "车辆在线情况"
        },
      timer: "",//默认情况下启动轮播
      timerKey: 0, //默认情况下从0开始
    };
  },
  computed: {
    HomeSecurityItems: function() {
      return [
        // {
        //   key: 0,
        //   idName: "safe_manage_chart",
        //   homSecItmTitle: "运输企业安全形势",
        //   ctrlId: 'home_aqjg_ysqyaqxs',
        //   activeflag: this.activeFlag.safe_manage_chart_flag,
        //   subTitle: formatterNumber(this.chartNumbers.safe_manage_chart),
        //   seriesData: [
        //     {
        //       value: this.chartCounts.safe_manageCount,
        //       name: "在线"
        //     },
        //     {
        //       value:
        //         this.chartNumbers.safe_manage_chart -
        //         this.chartCounts.safe_manageCount,
        //       name: "未在线"
        //     }
        //   ]
        // },
        {
          key: 0,
          idName: "home_security_online_chart",
          homSecItmTitle: "车辆在线情况",
          ctrlId: 'home_aqjg_clzxqk',
          activeflag: this.activeFlag.home_security_online_chart_flag,
          subTitle:
            "入网车辆总数：" +
            formatterNumber(this.chartNumbers.home_security_online_chart) +
            "辆",
          seriesData: [
            {
              value: this.chartCounts.home_security_onlineCount,
              name: "在线车辆"
            },
            {
              value:
                this.chartNumbers.home_security_online_chart -
                this.chartCounts.home_security_onlineCount,
              name: "未在线车辆"
            }
          ]
        },
        {
          key: 1,
          idName: "home_security_line_chart",
          homSecItmTitle: "全省违章车辆",
          ctrlId: 'home_aqjg_qswzcl', //需要权限控制的情况下，需要制定id号
          activeflag: this.activeFlag.home_security_line_chart_flag,
          subTitle:
            "入网车辆总数：" +
            formatterNumber(this.chartNumbers.home_security_line_chart) +
            "辆",
          seriesData: [
            {
              value: this.chartCounts.home_security_lineCount,
              name: "违章车辆"
            },
            {
              value:
                this.chartNumbers.home_security_line_chart -
                this.chartCounts.home_security_lineCount,
              name: "未违章车辆"
            }
          ]
        },
        {
          key: 2,
          idName: "home_security_break_chart",
          homSecItmTitle: "全省违章处理情况",
          ctrlId: 'home_aqjg_qswzclqk', //需要权限控制的情况下，需要制定id号
          activeflag: this.activeFlag.home_security_break_chart_flag,
          subTitle:
            "违章总次数：" +
            formatterNumber(this.chartNumbers.home_security_break_chart) +
            "次",
          seriesData: [
            {
              value: this.chartCounts.home_security_breakCount,
              name: "处理次数"
            },
            {
              value: this.chartNumbers.home_security_break_chart -
                this.chartCounts.home_security_breakCount,
              name: "未处理次数"
            }
          ]
        }
      ];
    },
    // 配置地图的信息
    mapDetailItems: function() {
      return [
        // {
        //   //注：Home/Index.js 第201行假数据
        //   chart_map: {
        //     data: [
        //       {
        //         name: "保定市",
        //         value: 95
        //       },
        //       {
        //         name: "邯郸市",
        //         value: 90
        //       },
        //       {
        //         name: "唐山市",
        //         value: 80
        //       },
        //       {
        //         name: "张家口市",
        //         value: 40
        //       },
        //       {
        //         name: "廊坊市",
        //         value: 60
        //       },
        //       {
        //         name: "沧州市",
        //         value: 20
        //       }
        //     ]
        //   },
        //   seriesData: [
        //     {
        //       name: "运输企业安全形势",
        //       type: "map",
        //       mapType: "河北", //sessionStorage.zoneName
        //       // geoCoord: geoCoord,
        //       mapLocation: {
        //         y: "20"
        //       },
        //       tooltip: {
        //         formatter: function (params, ticket, callback) {
        //           if(isNullUndefEmpty(params.value) || isNaN(params.value)) return params.seriesName + "<br />" + "数据异常，请联系技术人员";
        //           else return params.seriesName + "<br />" + params.name + ":" + params.value;
        //         }
        //       },
        //       itemStyle: {
        //         normal: {
        //           label: {
        //             show: true,
        //             textStyle: {
        //               color: "#FFF",
        //               fontFamily: "Microsoft YaHei"
        //             },
        //             formatter: "{b}"
        //           },
        //           areaColor: "rgb(43,61,78)",
        //           borderColor: "rgb(228,230,231)",
        //           borderWidth: 0.5,
        //           areaStyle: {
        //             color: "rgb(43,61,78)"
        //           }
        //         },
        //         emphasis: {
        //           label: {
        //             show: true,
        //             textStyle: {
        //               //color: 'yellow',
        //               color: "#2FFFFF",
        //               fontFamily: "Microsoft YaHei"
        //             }
        //             // formatter: function(name, value) {
        //             //   //"{a}:{b}"
        //             //   var res = "";
        //             //   if (name.length > 5) {
        //             //     res = name.substr(0, 4) + "\n" + name.substr(4);
        //             //     return res + ":" + value;
        //             //   }
        //             //   return name + ":" + value;
        //             // }
        //           },
        //           color: "#1A2C36",
        //           areaColor: "rgb(26,44,54)",
        //           borderColor: "#FFF",
        //           borderWidth: 1
        //         }
        //       },
        //       hoverable: true,
        //       data: [
        //         {
        //           name: "承德市",
        //           value: 95
        //         },
        //         {
        //           name: "秦皇岛市",
        //           value: 90
        //         },
        //         {
        //           name: "衡水市",
        //           value: 80
        //         },
        //         {
        //           name: "邢台市",
        //           value: 40
        //         },
        //         {
        //           name: "石家庄市",
        //           value: 60
        //         },
        //         {
        //           name: "保定市",
        //           value: 95
        //         },
        //         {
        //           name: "邯郸市",
        //           value: 90
        //         },
        //         {
        //           name: "唐山市",
        //           value: 80
        //         },
        //         {
        //           name: "张家口市",
        //           value: 40
        //         },
        //         {
        //           name: "廊坊市",
        //           value: 60
        //         },
        //         {
        //           name: "沧州市",
        //           value: 20
        //         }
        //       ]
        //     }
        //   ],
        //   mapTitle: "运输企业安全形势"
        // },
        {
          // legend: {
          //   orient: "vertical",
          //   x: "70%",
          //   y: "83%",
          //   data: ["总数", "已排查隐患"],
          //   textStyle: {
          //     color: "#FFF"
          //   }
          // },
          seriesData: [
            {
              name: "在线车辆情况",
              type: "map",
              mapType: "河北",
              // geoCoord: geoCoord,
              mapLocation: {
                y: "20"
              },
              tooltip: {
                formatter: function (params, ticket, callback) {
                  if(isNullUndefEmpty(params.value) || isNaN(params.value)) return params.seriesName + "<br />" + "数据异常，请联系技术人员";
                  else return params.seriesName + "<br />" + params.name + ":" + params.value;
                }
              },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: "#FFF",
                      fontFamily: "Microsoft YaHei"
                    },
                    formatter: "{b}"
                  },
                  areaColor: "rgb(43,61,78)",
                  borderColor: "rgb(228,230,231)",
                  borderWidth: 0.5,
                  areaStyle: {
                    color: "#2b3d4e"
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    textStyle: {
                      //color: 'yellow',
                      color: "#2FFFFF",
                      fontFamily: "Microsoft YaHei"
                    }
                    // formatter: function(name, value) {
                    //   //"{a}:{b}"
                    //   var res = "";
                    //   if (name.length > 5) {
                    //     res = name.substr(0, 4) + "\n" + name.substr(4);
                    //     return res + ":" + value;
                    //   }
                    //   return name + ":" + value;
                    // }
                  },
                  color: "#1A2C36",
                  areaColor: "rgb(26,44,54)",
                  borderColor: "#FFF",
                  borderWidth: 1
                }
              },
              hoverable: true,
              data: this.vehicleInnetList
              // data: [
              //   {
              //     name: "承德市",
              //     value: 95
              //   },
              //   {
              //     name: "秦皇岛市",
              //     value: 90
              //   },
              //   {
              //     name: "衡水市",
              //     value: 80
              //   },
              //   {
              //     name: "邢台市",
              //     value: 40
              //   },
              //   {
              //     name: "石家庄市",
              //     value: 60
              //   },
              //   {
              //     name: "保定市",
              //     value: 95
              //   },
              //   {
              //     name: "邯郸市",
              //     value: 90
              //   },
              //   {
              //     name: "唐山市",
              //     value: 80
              //   },
              //   {
              //     name: "张家口市",
              //     value: 40
              //   },
              //   {
              //     name: "廊坊市",
              //     value: 60
              //   },
              //   {
              //     name: "沧州市",
              //     value: 20
              //   }
              // ]
            },
            // {
            //   name: "已排查隐患",
            //   type: "map",
            //   mapType: "河北",
            //   // geoCoord: geoCoord,
            //   mapLocation: {
            //     y: "20"
            //   },
            //   tooltip: {
            //     formatter: function (params, ticket, callback) {
            //       // console.log(params)
            //       if(isNullUndefEmpty(params.value) || isNaN(params.value)) return params.seriesName + "<br />" + "数据异常，请联系技术人员";
            //       else return params.seriesName + "<br />" + params.name + ":" + params.value;
            //     }
            //   },
            //   itemStyle: {
            //     normal: {
            //       label: {
            //         show: true,
            //         textStyle: {
            //           color: "#FFF",
            //           fontFamily: "Microsoft YaHei"
            //         },
            //         formatter: "{b}"
            //       },
            //       areaColor: "rgb(43,61,78)",
            //       borderColor: "rgb(228,230,231)",
            //       borderWidth: 0.5,
            //       areaStyle: {
            //         color: "#1A2C36"
            //       }
            //     },
            //     emphasis: {
            //       label: {
            //         show: true,
            //         textStyle: {
            //           //color: 'yellow',
            //           color: "#2FFFFF",
            //           fontFamily: "Microsoft YaHei"
            //         }
            //         // formatter: function(name, value) {
            //         //   //"{a}:{b}"
            //         //   var res = "";
            //         //   if (name.length > 5) {
            //         //     res = name.substr(0, 4) + "\n" + name.substr(4);
            //         //     return res + ":" + value;
            //         //   }
            //         //   return name + ":" + value;
            //         // }
            //       },
            //       color: "#1A2C36",
            //       areaColor: "rgb(26,44,54)",
            //       borderColor: "#FFF",
            //       borderWidth: 1
            //     }
            //   },
            //   hoverable: true,
            //   data: this.onLineOffline.onlineData
            //   // data: [
            //   //   {
            //   //     name: "承德市",
            //   //     value: 95
            //   //   },
            //   //   {
            //   //     name: "秦皇岛市",
            //   //     value: 90
            //   //   },
            //   //   {
            //   //     name: "衡水市",
            //   //     value: 80
            //   //   },
            //   //   {
            //   //     name: "邢台市",
            //   //     value: 40
            //   //   },
            //   //   {
            //   //     name: "石家庄市",
            //   //     value: 60
            //   //   },
            //   //   {
            //   //     name: "保定市",
            //   //     value: 95
            //   //   },
            //   //   {
            //   //     name: "邯郸市",
            //   //     value: 90
            //   //   },
            //   //   {
            //   //     name: "唐山市",
            //   //     value: 80
            //   //   },
            //   //   {
            //   //     name: "张家口市",
            //   //     value: 40
            //   //   },
            //   //   {
            //   //     name: "廊坊市",
            //   //     value: 60
            //   //   },
            //   //   {
            //   //     name: "沧州市",
            //   //     value: 20
            //   //   }
            //   // ]
            // }
          ],
          pieEcharts: {
            routerLink: "",
            idName: "home_security_xxx",
            // data: ['包车客车', '旅游客车', '重货、半挂牵引车', '三类班线客车', '危险品车'],
            data: [
              "违章隐患",
              "安全隐患",
              "道路隐患",
              "交通设施隐患",
              "其他隐患"
            ],
            titleX: "2%",
            titleY: "3%",
            titleName: "隐患种类", //显示饼图的title
            legendOrient: "vertical",
            legendX: "2%",
            legendY: "12%",
            color: ["#3a8dff", "#6da5f1", "#02F4F5", "#4ccfd1", "#97ffff"],
            seriesName: "隐患种类",
            seriesRadius: ["45%", "70%"],
            seriesdata: [
              {
                value: this.onLineOffline.yinhuanCategory.breakRuleYinHuan,
                name: "违章隐患"
              },
              {
                value: this.onLineOffline.yinhuanCategory.securityYinHuan,
                name: "安全隐患"
              },
              {
                value: this.onLineOffline.yinhuanCategory.roadYinHuan,
                name: "道路隐患"
              },
              {
                value: this.onLineOffline.yinhuanCategory.transportYinHuan,
                name: "交通设施隐患"
              },
              {
                value: this.onLineOffline.yinhuanCategory.otherYinHuan,
                name: "其他隐患"
              }
            ]
          },
          mapTitle: "车辆在线情况"
        },
        {
          seriesData: [
            {
              name: "全省违章车辆",
              type: "map",
              mapType: "河北", //sessionStorage.zoneName
              // geoCoord: geoCoord,
              mapLocation: {
                y: "20"
              },
              tooltip: {
                formatter: function (params, ticket, callback) {
                  // console.log(params)
                  if(isNullUndefEmpty(params.value) || isNaN(params.value)) return params.seriesName + "<br />" + "数据异常，请联系技术人员";
                  else return params.seriesName + "<br />" + params.name + ":" + (params.value*100).toFixed(2)+ '%';
                }
              },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: "#FFF",
                      fontFamily: "Microsoft YaHei"
                    },
                    formatter: "{b}"
                  },
                  areaColor: "rgb(43,61,78)",
                  borderColor: "rgb(228,230,231)",
                  borderWidth: 0.5,
                  areaStyle: {
                    color: "rgb(43,61,78)"
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    textStyle: {
                      //color: 'yellow',
                      color: "#2FFFFF",
                      fontFamily: "Microsoft YaHei"
                    }
                    // formatter: function(name, value) {
                    //   //"{a}:{b}"
                    //   var res = "";
                    //   if (name.length > 5) {
                    //     res = name.substr(0, 4) + "\n" + name.substr(4);
                    //     return res + ":" + value;
                    //   }
                    //   return name + ":" + value;
                    // }
                  },
                  color: "#1A2C36",
                  areaColor: "rgb(26,44,54)",
                  borderColor: "#FFF",
                  borderWidth: 1
                }
              },
              hoverable: true,
              data: this.zoneDataList
              // data: [
              //   {
              //     name: "承德市",
              //     value: 95
              //   },
              //   {
              //     name: "秦皇岛市",
              //     value: 90
              //   },
              //   {
              //     name: "衡水市",
              //     value: 80
              //   },
              //   {
              //     name: "邢台市",
              //     value: 40
              //   },
              //   {
              //     name: "石家庄市",
              //     value: 60
              //   },
              //   {
              //     name: "保定市",
              //     value: 95
              //   },
              //   {
              //     name: "邯郸市",
              //     value: 90
              //   },
              //   {
              //     name: "唐山市",
              //     value: 80
              //   },
              //   {
              //     name: "张家口市",
              //     value: 40
              //   },
              //   {
              //     name: "廊坊市",
              //     value: 60
              //   },
              //   {
              //     name: "沧州市",
              //     value: 20
              //   }
              // ]
            }
          ],
          visualMap: {
            orient: "horizontal",
            x: "right",
            show: true,
            min: 0,
            max: 1,
            inRange: {
              color: ['#2b3d4e', '#752A2B','#98302C','#F74233'],
            },
            text: ["违章程度：严重(100%)", "无"], // 文本，默认为数值文本
            realtime: false,
            calculable: true,
            splitNumber: 0,
            itemGap: 0,
            itemWidth: 50,
            textStyle: {
              color: "#FFF"
            },
            itemWidth: 20
          },
          mapTitle: "全省违章车辆"
        },
        // {
        //   //注：Home/Index.js 第85行假数据
        //   seriesData: this.series,
        //   geo: {
        //     map: "河北",
        //     label: {
        //       emphasis: {
        //         show: false
        //       }
        //     },
        //     roam: true,
        //     itemStyle: {
        //       normal: {
        //         areaColor: "#323c48",
        //         borderColor: "#404a59"
        //       },
        //       emphasis: {
        //         areaColor: "#2a333d"
        //       }
        //     }
        //   },
        //   mapTitle: "全省违章车辆"
        // },
        {
          seriesData: [
            {
              name: "全省违章处理情况",
              type: "map",
              mapType: "河北", //sessionStorage.zoneName
              // geoCoord: geoCoord,
              mapLocation: {
                y: "20"
              },
              tooltip: {
                formatter: function (params, ticket, callback) {
                  // console.log(params)
                  if(isNullUndefEmpty(params.value) || isNaN(params.value)) return params.seriesName + "<br />" + "数据异常，请联系技术人员";
                  else return params.seriesName + "<br />" + params.name + ":" + (params.value*100).toFixed(2)+ '%';
                }
              },
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    textStyle: {
                      color: "#FFF",
                      fontFamily: "Microsoft YaHei"
                    },
                    formatter: "{b}"
                  },
                  areaColor: "rgb(43,61,78)",
                  borderColor: "rgb(228,230,231)",
                  borderWidth: 0.5,
                  areaStyle: {
                    color: "rgb(43,61,78)"
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    textStyle: {
                      //color: 'yellow',
                      color: "#2FFFFF",
                      fontFamily: "Microsoft YaHei"
                    }
                    // formatter: function(name, value) {
                    //   //"{a}:{b}"
                    //   var res = "";
                    //   if (name.length > 5) {
                    //     res = name.substr(0, 4) + "\n" + name.substr(4);
                    //     return res + ":" + value;
                    //   }
                    //   return name + ":" + value;
                    // }
                  },
                  color: "#1A2C36",
                  areaColor: "rgb(26,44,54)",
                  borderColor: "#FFF",
                  borderWidth: 1
                }
              },
              hoverable: true,
              data: this.breakRuleHandleList
              // data: [
              //   {
              //     name: "承德市",
              //     value: 95
              //   },
              //   {
              //     name: "秦皇岛市",
              //     value: 90
              //   },
              //   {
              //     name: "衡水市",
              //     value: 80
              //   },
              //   {
              //     name: "邢台市",
              //     value: 40
              //   },
              //   {
              //     name: "石家庄市",
              //     value: 60
              //   },
              //   {
              //     name: "保定市",
              //     value: 95
              //   },
              //   {
              //     name: "邯郸市",
              //     value: 90
              //   },
              //   {
              //     name: "唐山市",
              //     value: 80
              //   },
              //   {
              //     name: "张家口市",
              //     value: 40
              //   },
              //   {
              //     name: "廊坊市",
              //     value: 60
              //   },
              //   {
              //     name: "沧州市",
              //     value: 20
              //   }
              // ]
            }
          ],
          visualMap: {
            orient: "horizontal",
            x: "right",
            show: true,
            min: 0,
            max: 1,
            inRange: {
              color: ['#2b3d4e', '#752A2B','#98302C','#F74233'],
            },
            text: ["未处理情况：严重(100%)", "无"], // 文本，默认为数值文本
            realtime: false,
            calculable: true,
            splitNumber: 0,
            itemGap: 0,
            itemWidth: 50,
            textStyle: {
              color: "#FFF"
            },
            itemWidth: 20
          },
          mapTitle: "全省违章处理情况"
        }
      ];
    }
  },
  mounted: function() {
    this.getCurrentOnlineData(); //获取车辆在线情况
    this.getSafeManageIllegalData(); //获取全省违章车辆
    this.getAlarmDealData(); //获取全省违章处理情况
    // 加载完成这个模块后就开始实现Echarts的动态效果
    const self = this;
    [this.homeDataCache.markPoints].forEach(function(item, i) {
      self.series.push(
        {
          name: "全国车辆运行情况",
          type: "lines",
          zlevel: 1,
          effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: "#fff",
            symbolSize: 3
          },
          lineStyle: {
            normal: {
              color: self.color[i],
              width: 0,
              curveness: 0.2
            }
          },
          draggable: false,
          data: self.convertData(item)
        },
        {
          // name: item[0] + " Top10",
          name: "全国车辆运行情况",
          type: "lines",
          zlevel: 2,
          effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: self.planePath,
            symbolSize: 15
          },
          lineStyle: {
            normal: {
              color: self.color[i],
              width: 1,
              opacity: 0.4,
              curveness: 0.2
            }
          },
          draggable: false,
          data: self.convertData(item)
        },
        {
          // name: item[0] + " Top10",
          name: "全国车辆运行情况",
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          rippleEffect: {
            brushType: "stroke"
          },
          label: {
            normal: {
              show: true,
              position: "right",
              formatter: "{b}"
            }
          },
          symbolSize: function(val) {
            return val[2] / 8;
          },
          itemStyle: {
            normal: {
              color: self.color[i]
            }
          },
          draggable: false,
          data: item.map(function(dataItem) {
            return {
              name: dataItem[1].name,
              value: self.homeDataCache.geoCoordMap[dataItem[1].name].concat([
                dataItem[1].value
              ])
            };
          })
        }
      );
    });
  },
  methods: {
    getCurrentOnlineData: function() {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_aqjg_clzxqk'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const getCurrentOnlineDataParams = {
        ZoneId: provinceVal.provinceId,
        PlatformId: 0,
        CarType: 0,
        GovStatus: 2,
        BeginDate: new Date().format("yyyyMMdd"),
        EndDate: new Date().format("yyyyMMdd"),
        IsCurrent: 0,
        PageIndex: 1,
        PageSize: 10,
        IsSplitPage: false
      };
      axiosRequest.axiosGet(this.getCurrentOnlineDataUrl, getCurrentOnlineDataParams)
        .then(function(response) {
          const tempResponse = response.data;
          // 注释人：向浩
          // 注释时间：2018-08-12
          // 注释原因：根据王建新要求，直接展示车辆在线情况，不展示总数和已排查隐患
          // const online = [],
          //   offline = [];
          // for (let item of tempResponse.DetailList) {
          //   /**
          //    * InnetCount
          //     :
          //     139
          //     NoOnlineCount
          //     :
          //     139
          //     OnlineCount
          //     :
          //     0
          //     OnlineRate
          //     :
          //     "0.00%"
          //     ZoneName
          //     :
          //     "乌鲁木齐市"
          //    */
          //   online.push({
          //     name: item.ZoneName,
          //     value: Math.round(item.OnlineCount + item.NoOnlineCount)
          //   });
          //   offline.push({
          //     name: item.ZoneName,
          //     value: Math.round(item.NoOnlineCount)
          //   });
          // }
          // 隐患排查左边饼图-隐患种类
          //注：不知道乘的系数0.8的意义，以及后面的系数的意义，具体的代码请参考重构前的系统代码
          // self.onLineOffline.yinhuanCategory.breakRuleYinHuan = Math.round(tempResponse.TotalList.InnetCountTotal * 0.4) ;
          // self.onLineOffline.yinhuanCategory.securityYinHuan = Math.round(tempResponse.TotalList.InnetCountTotal * 0.25);
          // self.onLineOffline.yinhuanCategory.roadYinHuan = Math.round(tempResponse.TotalList.InnetCountTotal * 0.17);
          // self.onLineOffline.yinhuanCategory.transportYinHuan = Math.round(tempResponse.TotalList.InnetCountTotal * 0.13);
          // self.onLineOffline.yinhuanCategory.otherYinHuan = Math.round(tempResponse.TotalList.InnetCountTotal * 0.05);
          // self.onLineOffline.offlineData = offline; //隐患排查-总数
          // self.onLineOffline.onlineData = online; //隐患排查-已排查总数
          self.chartNumbers.home_security_online_chart = tempResponse.TotalList.InnetCountTotal;
          self.chartCounts.home_security_onlineCount = tempResponse.TotalList.OnlineCountTotal;
          for(let item of tempResponse.DetailList){
            self.vehicleInnetList.push({
              name: item.ZoneName,
              // 后端没有进行数据运算，所以需要前端进行数据展示
              value: item.OnlineCount
            })
            // tempHomeSecurity.chartNumbers += item.InstalledCount; //车辆总数
            // tempHomeSecurity.chartCounts += item.BreakRuleV; //违章总数
          }
          // 首次加载成功后先展示第一个饼图对应的地图信息
          self.overShow(self.timerKey, 'autoCarousel');
        })
        .catch(function(error) {});
    },
    getSafeManageIllegalData: function(){
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_aqjg_qswzcl'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const getSafeManageIllegalDataParams = {
        ZoneId: provinceVal.provinceId,
      };
      axiosRequest.axiosGet(this.getSafeManageIllegalDataUrl, getSafeManageIllegalDataParams)
        .then(function(response) {
          const tempResponse = response.data;
          /**
           * InnetCount
          :
          118
          NoOnlineCount
          :
          118
          OnlineCount
          :
          0
          OnlineRate
          :
          "0.00%"
          ZoneId
          :
          65010000
          ZoneName
          :
          "乌鲁木齐市"
           */
          // let tempHomeSecurity = {
          //   chartNumbers: 0,
          //   chartCounts: 0,
          // }
          self.chartNumbers.home_security_line_chart = tempResponse.TotalList.InstalledCount;
          self.chartCounts.home_security_lineCount = tempResponse.TotalList.BreakRuleV;
          for(let item of tempResponse.DetailList){
            self.zoneDataList.push({
              name: item.ZoneName,
              // 后端没有进行数据运算，所以需要前端进行数据展示
              value: item.BreakRuleV/self.chartCounts.home_security_lineCount
            })
            // tempHomeSecurity.chartNumbers += item.InstalledCount; //车辆总数
            // tempHomeSecurity.chartCounts += item.BreakRuleV; //违章总数
          }
        })
        .catch(function(error) {});
    },
    getAlarmDealData: function(){
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_aqjg_qswzclqk'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const getAlarmDealDataUrlParams = {
        ZoneId: provinceVal.provinceId,
      };
      axiosRequest.axiosGet(this.getAlarmDealDataUrl, getAlarmDealDataUrlParams)
        .then(function(response) {
          const tempResponse = response.data;
          // let tempHomeSecurity = {
          //   chartNumbers: 0,
          //   chartCounts: 0,
          // }
          for(let item of tempResponse.DetailList){
            self.breakRuleHandleList.push({
              name: item.ZName,
              value: toPoint(item.TotalDealRate)
            })
          }
          self.chartNumbers.home_security_break_chart = tempResponse.TotalList.TotalCNT;
          self.chartCounts.home_security_breakCount = tempResponse.TotalList.TotalDeal;
        })
        .catch(function(error) {});
    },
    // actionType: (mouseOver: '鼠标移动到某一个元饼图取消轮播'，autoCarousel: '自动开始轮播')
    overShow(key, actionType) {
      switch(actionType){
        case 'mouseOver':
        clearInterval(this.timer);
        break;
      }
      this.mapItem = this.mapDetailItems[key];
      switch (key) {
        // case 0:
        //   this.activeFlag.safe_manage_chart_flag = "security-right-selected";
        //   this.activeFlag.home_security_online_chart_flag = "";
        //   this.activeFlag.home_security_line_chart_flag = "";
        //   this.activeFlag.home_security_break_chart_flag = "";
        //   break;
        case 0:
          // this.activeFlag.safe_manage_chart_flag = "";
          this.activeFlag.home_security_online_chart_flag = "security-right-selected";
          this.activeFlag.home_security_line_chart_flag = "";
          this.activeFlag.home_security_break_chart_flag = "";
          break;
        case 1:
          // this.activeFlag.safe_manage_chart_flag = "";
          this.activeFlag.home_security_online_chart_flag = "";
          this.activeFlag.home_security_line_chart_flag = "security-right-selected";
          this.activeFlag.home_security_break_chart_flag = "";
          break;
        case 2:
          // this.activeFlag.safe_manage_chart_flag = "";
          this.activeFlag.home_security_online_chart_flag = "";
          this.activeFlag.home_security_line_chart_flag = "";
          this.activeFlag.home_security_break_chart_flag = "security-right-selected";
          break;
        default:
      }
    },
    outShow: function(key){
      const self = this;
      self.timerKey = key;
      this.timer = setInterval(()=>{
        self.overShow(self.timerKey, 'autoCarousel');
        self.timerKey ++;
        if(self.timerKey>=self.mapDetailItems.length) self.timerKey = 0;
      }, 5000);//每隔指定时间开始轮播
    },
    convertData: function(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = this.homeDataCache.geoCoordMap[dataItem[0].name];
        var toCoord = this.homeDataCache.geoCoordMap[dataItem[1].name];
        if (fromCoord && toCoord) {
          res.push([
            {
              coord: fromCoord
            },
            {
              coord: toCoord
            }
          ]);
        }
      }
      return res;
    }
  }
};
</script>
