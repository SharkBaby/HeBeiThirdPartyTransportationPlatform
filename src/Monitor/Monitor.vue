<template>
  <div class="monitor">
    <el-row class="monitor-show">
      <el-col :xs="10" :sm="5" :md="5" :lg="4" :xl="4" class="monitor-left">
        <el-row class="monitor-presearch">
          <el-input :placeholder="inputPlaceholder" v-model="inputCtntReal.inputVal" class="monitor-blank" @change="changePreSearch(inputCtntReal.inputVal)" @blur="needClearInput">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
          </el-input>
          <el-radio-group v-model="zoneArray.typeSelected" @change="changeRadio">
            <el-radio :label="typeItem.value" v-for="(typeItem, typeKey) of zoneArray.typeItems" :key="typeKey" class="monitor-radio">{{typeItem.labelName}}</el-radio>
          </el-radio-group>
          <el-row class="pre-search">
            <el-row class="pre-search-item" v-for="(preSearchItem, preSearchKey) of preSearchItems" :key="preSearchKey">
              <label @mouseup="handlePreSearchSelect(preSearchItem.Value, preSearchItem.Name)">{{preSearchItem.Name}}</label>
            </el-row>
          </el-row>
        </el-row>
        <div class="monitor-tree">
          <!-- :data="zoneArray.zoneData" -->
          <!-- :load="loadNode"
            lazy 
            :default-expanded-keys="[1]"-->
          <el-tree
            :props="zoneArray.defaultProps"
            :load="loadNode"
            lazy 
            class="zone-check-eltree"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
            :render-content="renderContent"
            ref="monitorTree"
            :filter-node-method="filterNode"
            :disabled=true>
          </el-tree>
        </div>
      </el-col>
      <el-col :xs="13" :sm="19" :md="19" :lg="20" :xl="20" class="monitor-right">
        <baidu-map :baiduMap="baiduMap" :latitude="latitude" :longtitude="longtitude" 
        :seriesPoints="seriesPoints" :vehicleData="vehicleData"
        v-on:handleActionClick="handleActionClick"
        v-on:handleMouseOver="handleMouseOver"
        v-on:handleMouseOut="handleMouseOut"
        v-on:handleHistoryAction="handleHistoryAction"
        :monitorTrackRslt="monitorTrackRslt"></baidu-map>
      </el-col>
    </el-row>
  </div>
</template>
<style src="./monitor.css" type="text/css"></style>
<script>
import BaiduMap from "@/components/BaiduMap/BaiduMap";
import {
  axiosRequest,
  storageOperation,
  isNullUndefEmpty,
  formatYMD,
  formatHHmmss
} from "@/common/common";
import {
  monitorTrack,
  cancelMonitorTrack
} from "@/common/webSocket";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "Monitor",
  components: {
    BaiduMap
  },
  data() {
    return {
      inputCtnt: '', //筛选企业的值
      inputCtntReal: {
        inputVal: '', //输入框里面的值
        Id: ''
      },
      inputPlaceholder: '请先选择类型 车辆/企业',
      getAutoDataListUrl: commonConfig.rootUrl + commonConfig.GetAutoDataList, // 通用接口 - 预搜索
      preSearchItems: [], //存储预搜索的返回结果
      mTGetQueryNodeUrl:
        commonConfig.rootUrl + commonConfig.MonitorAPI.MTGetQueryNode, //获取企业列表
      mTQueryDataByNameUrl:
        commonConfig.rootUrl + commonConfig.MonitorAPI.MTQueryDataByName, //查询车辆
      getTpVehPositionUrl:
        commonConfig.rootUrl + commonConfig.MonitorAPI.GetTpVehPosition,
      // 双击获取车辆历史轨迹
      getHistoryInfoUrl:
        commonConfig.rootUrl + commonConfig.MonitorAPI.GetHistoryInfo,
      vehicleData: "", //传递车辆信息到地图的历史轨迹
      baiduMap: {
        monitor_top_left: [
          {
            monitorClass: "monitor-topleft-basic-icon icon-open",
            monitorTitle: "历史轨迹",
            actionType: "historyRoute",
            isShow: false, //默认状态下是不显示的
          },
          // ,
          // {
          //   monitorClass:
          //     "monitor-topleft-basic-icon monitor-send-message-open",
          //   monitorTitle: "短信"
          // },
          // {
          //   monitorClass: "monitor-topleft-basic-icon monitor-voice-open",
          //   monitorTitle: "监听"
          // },
          // {
          //   monitorClass: "monitor-topleft-basic-icon monitor-photos-open",
          //   monitorTitle: "拍照"
          // },
          // {
          //   monitorClass: "monitor-topleft-basic-icon  monitor-video-open",
          //   monitorTitle: "视频"
          // },
          // {
          //   monitorClass: "monitor-topleft-basic-icon monitor-recorder-open",
          //   monitorTitle: "行驶记录仪"
          // },
          {
            monitorClass: "monitor-topleft-basic-icon monitor-track-open",
            monitorTitle: "跟踪",
            actionType: "monitorTrack",
            isShow: true, //默认状态下是不显示的
            isClicked: false,
          }
        ],
        // monitor_bottom_right: [
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon map-a",
        //     monitorTitle: "全图"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon roam-a",
        //     monitorTitle: "漫游"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon ranging-a",
        //     monitorTitle: "测距"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon enclosure-a",
        //     monitorTitle: "电子围栏"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon route-a",
        //     monitorTitle: "路径分析"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon geography-a",
        //     monitorTitle: "地理信息"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon line-a",
        //     monitorTitle: "行驶路线"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon zone-a",
        //     monitorTitle: "行驶区域"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon enlarge-a",
        //     monitorTitle: "放大"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon narrow-a",
        //     monitorTitle: "缩小"
        //   },
        //   {
        //     monitorDivClass: "vehicle-map-controls-icons-button",
        //     monitorAClass: "monitor-bottomright-basic-icon sign-a",
        //     monitorTitle: "标记"
        //   }
        // ],
        monitor_right_bottom: [
          // {
          //   monitorDivClass: "vehicle-map-control-right-bottom",
          //   monitorAClass:
          //     "monitor-rightbottom-basic-icon vehicle-crossZone-icon",
          //   monitorTitle: "跨入跨出车辆"
          // },
          // {
          //   monitorDivClass: "vehicle-map-control-right-bottom",
          //   monitorAClass:
          //     "monitor-rightbottom-basic-icon vehicle-areaalarm-icon",
          //   monitorTitle: "区域报警车辆"
          // }
          // ,
          // {
          //   monitorDivClass: "vehicle-map-control-right-bottom",
          //   monitorAClass: "monitor-rightbottom-basic-icon show9HLines-icon",
          //   monitorTitle: "显示九黄线"
          // }
        ],
        textObj: {
          title: "",
          message: ""
        },
        // displayType: '单击显示messageBox, 双击显示historyRoute'
        displayType: "messageBox"
      },
      seriesPoints: [],
      latitude: 38.045474,
      longtitude: 114.502461,
      zoneArray: {
        typeSelected: "",
        typeItems: [
          {
            labelName: "车辆",
            value: "vehicle"
          },
          {
            labelName: "企业",
            value: "company"
          }
        ],
        zoneData: [
          // {
          //   Name: "河北省运管局",
          //   children: [
          //     {
          //       Name: "石家庄市运管处",
          //       children: [
          //         {
          //           Name: "市辖区运管所",
          //           children: [
          //             {
          //               Name: "市辖区某某企业",
          //               children: [
          //                 {
          //                   Role: 159383552,
          //                   Id: 2018,
          //                   Name: "新F17712黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 0
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2021,
          //                   Name: "新F17866黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2027,
          //                   Name: "新F18697黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2029,
          //                   Name: "新F19207黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2031,
          //                   Name: "新F19225黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2033,
          //                   Name: "新F19231黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2035,
          //                   Name: "新F19239黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2037,
          //                   Name: "新F19259黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2039,
          //                   Name: "新F19375黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2041,
          //                   Name: "新F19429黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 1
          //                 },
          //                 {
          //                   Role: 159383552,
          //                   Id: 2043,
          //                   Name: "新F19522黄",
          //                   ZoneId: 65400200,
          //                   IcoType: 0,
          //                   IsPermission: 1,
          //                   ReUpUnitId: 1157,
          //                   VecType: 537395200,
          //                   ord: 3,
          //                   ZName: "伊宁市",
          //                   UpUnitId: 1157,
          //                   LogicUnitid: 87,
          //                   GnsscenterId: 65000003,
          //                   PlateName: "新疆奇华信息科技有限公司",
          //                   UpUnitName: "伊犁交通运输集团有限公司",
          //                   VecTypeName: "三类以上班线客车",
          //                   "16": 0
          //                 }
          //               ]
          //             },
          //             {
          //               Name: "个体户营运企业"
          //             }
          //           ]
          //         },
          //         {
          //           Name: "长安区运管所",
          //           children: [
          //             {
          //               Name: "市辖区某某企业",
          //               children: [
          //                 {
          //                   Name: "湘A24909黄"
          //                 },
          //                 {
          //                   Name: "湘A31878黄"
          //                 },
          //                 {
          //                   Name: "湘A34537黄"
          //                 },
          //                 {
          //                   Name: "湘A42871黄"
          //                 },
          //                 {
          //                   Name: "湘A47553黄"
          //                 },
          //                 {
          //                   Name: "湘A811TP蓝"
          //                 },
          //                 {
          //                   Name: "湘A823TR蓝"
          //                 },
          //                 {
          //                   Name: "湘A831TV蓝"
          //                 },
          //                 {
          //                   Name: "湘A842TU蓝"
          //                 }
          //               ]
          //             },
          //             {
          //               Name: "个体户营运企业"
          //             }
          //           ]
          //         },
          //         {
          //           Name: "桥东区运管所",
          //           children: [
          //             {
          //               Name: "市辖区某某企业",
          //               children: [
          //                 {
          //                   Name: "湘A24909黄"
          //                 },
          //                 {
          //                   Name: "湘A31878黄"
          //                 },
          //                 {
          //                   Name: "湘A34537黄"
          //                 },
          //                 {
          //                   Name: "湘A42871黄"
          //                 },
          //                 {
          //                   Name: "湘A47553黄"
          //                 },
          //                 {
          //                   Name: "湘A811TP蓝"
          //                 },
          //                 {
          //                   Name: "湘A823TR蓝"
          //                 },
          //                 {
          //                   Name: "湘A831TV蓝"
          //                 },
          //                 {
          //                   Name: "湘A842TU蓝"
          //                 }
          //               ]
          //             },
          //             {
          //               Name: "个体户营运企业"
          //             }
          //           ]
          //         },
          //         {
          //           Name: "桥西区运管所",
          //           children: [
          //             {
          //               Name: "市辖区某某企业",
          //               children: [
          //                 {
          //                   Name: "湘A24909黄"
          //                 },
          //                 {
          //                   Name: "湘A31878黄"
          //                 },
          //                 {
          //                   Name: "湘A34537黄"
          //                 },
          //                 {
          //                   Name: "湘A42871黄"
          //                 },
          //                 {
          //                   Name: "湘A47553黄"
          //                 },
          //                 {
          //                   Name: "湘A811TP蓝"
          //                 },
          //                 {
          //                   Name: "湘A823TR蓝"
          //                 },
          //                 {
          //                   Name: "湘A831TV蓝"
          //                 },
          //                 {
          //                   Name: "湘A842TU蓝"
          //                 }
          //               ]
          //             },
          //             {
          //               Name: "个体户营运企业"
          //             }
          //           ]
          //         },
          //         {
          //           Name: "新华区运管所",
          //           children: [
          //             {
          //               Name: "市辖区某某企业",
          //               children: [
          //                 {
          //                   Name: "湘A24909黄"
          //                 },
          //                 {
          //                   Name: "湘A31878黄"
          //                 },
          //                 {
          //                   Name: "湘A34537黄"
          //                 },
          //                 {
          //                   Name: "湘A42871黄"
          //                 },
          //                 {
          //                   Name: "湘A47553黄"
          //                 },
          //                 {
          //                   Name: "湘A811TP蓝"
          //                 },
          //                 {
          //                   Name: "湘A823TR蓝"
          //                 },
          //                 {
          //                   Name: "湘A831TV蓝"
          //                 },
          //                 {
          //                   Name: "湘A842TU蓝"
          //                 }
          //               ]
          //             },
          //             {
          //               Name: "个体户营运企业"
          //             }
          //           ]
          //         },
          //         {
          //           Name: "井陉矿区运管所",
          //           children: [
          //             {
          //               Name: "市辖区某某企业",
          //               children: [
          //                 {
          //                   Name: "湘A24909黄"
          //                 },
          //                 {
          //                   Name: "湘A31878黄"
          //                 },
          //                 {
          //                   Name: "湘A34537黄"
          //                 },
          //                 {
          //                   Name: "湘A42871黄"
          //                 },
          //                 {
          //                   Name: "湘A47553黄"
          //                 },
          //                 {
          //                   Name: "湘A811TP蓝"
          //                 },
          //                 {
          //                   Name: "湘A823TR蓝"
          //                 },
          //                 {
          //                   Name: "湘A831TV蓝"
          //                 },
          //                 {
          //                   Name: "湘A842TU蓝"
          //                 }
          //               ]
          //             },
          //             {
          //               Name: "个体户营运企业"
          //             }
          //           ]
          //         },
          //         {
          //           Name: "长沙区",
          //           children: [
          //             {
          //               Name: "市辖区某某企业",
          //               children: [
          //                 {
          //                   Name: "湘A24909黄"
          //                 },
          //                 {
          //                   Name: "湘A31878黄"
          //                 },
          //                 {
          //                   Name: "湘A34537黄"
          //                 },
          //                 {
          //                   Name: "湘A42871黄"
          //                 },
          //                 {
          //                   Name: "湘A47553黄"
          //                 },
          //                 {
          //                   Name: "湘A811TP蓝"
          //                 },
          //                 {
          //                   Name: "湘A823TR蓝"
          //                 },
          //                 {
          //                   Name: "湘A831TV蓝"
          //                 },
          //                 {
          //                   Name: "湘A842TU蓝"
          //                 }
          //               ]
          //             },
          //             {
          //               Name: "个体户营运企业"
          //             }
          //           ]
          //         }
          //       ]
          //     }
          //   ]
          // }
        ],
        defaultProps: {
          children: "children",
          label: "Name",
          isLeaf: "leaf"
        }
      },
      monitor_car_lists: [
        {
          carName: "湘A24909黄",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A31878黄",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A34537黄",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A42871黄",
          carStatus: "offline",
          statusName: "离线"
        },
        {
          carName: "湘A47553黄",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A811TP蓝",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A823TR蓝",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A831TV蓝",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A842TU蓝",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A85F31蓝",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A8C035黄",
          carStatus: "online",
          statusName: "在线"
        },
        {
          carName: "湘A8C079黄",
          carStatus: "offline",
          statusName: "离线"
        }
      ],
      monitorTrackRslt: [], //车辆监管-跟踪
      monitorTrack: {
        deviceH: '',
        featureH: '',
      }
    };
  },
  // 注释人：向浩
  // 注释时间：2018-07-25
  // 注释原因：筛选树节点
  watch: {
    inputCtnt: function(newVal){
      this.$refs.monitorTree.filter(newVal);
    },
    getMonitorTrackRslt: function(newVal){
      this.baiduMap.displayType = "monitorTrack";
      this.monitorTrackRslt = newVal;
      // this.latitude = newVal[0].model.latitude / 1000000;
      // this.longtitude = newVal[0].model.longitude / 1000000;
      // console.log('最新经度' + this.latitude);
      // console.log('最新维度' + this.longtitude);
      // this.baiduMap.textObj = {
      //   // title: newVal[0].model.PlateNumber + newVal[0].model.PlateColor,
      //   title: newVal[0].model.device + '(车辆deviceId)',
      //   message:
      //     "<p>所属企业：" +
      //     newVal[0].model.uint + '(企业uintId)' +
      //     "</p>" +
      //     "<p>地址：" +
      //     '此地址需要根据经纬度从百度接口获得地址信息' +
      //     "</p>" +
      //     "<p>速度/限速值：" +
      //     // 由于标准809协议是不需要进行&操作，但是扩展809协议的高两位是标记为，作为其他用途
      //     // 目前没有限速值，所以设置为未知
      //     (newVal[0].model.speed&0xffffff)/1000 + '未知' + 'km/h' + 
      //     "</p>" +
      //     "<p>定位时间：" +
      //     newVal[0].model.gpsdate  + " " + formatHHmmss(newVal[0].model.gpstime) +
      //     "</p>" +
      //     "<p>接收时间：" +
      //     newVal[0].model.recvdate + " " + formatHHmmss(newVal[0].model.recvtime) +
      //     "</p>"
      // };
    }
  },
  computed: {
    getMonitorTrackRslt(){
      return this.$store.state.monitorTrackRslt;
    }
  },
  created: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  },
  methods: {
    handleNodeClick: function(data, nodeObj, nodeSelf) {
      const self = this;
      // 如果id<1000 就是运管，如果id>1000 就是企业
      if (data.VecType) { //选中了某一行车辆信息
        for(let hrItem of self.baiduMap.monitor_top_left){
          if(hrItem.actionType === 'historyRoute') hrItem.isShow = true; //显示历史轨迹按钮
        }
        // //处理点击
        // self.getHistoryInfo(data);
        this.vehicleData = data;
        // 目前使能历史轨迹图标
        for (let baiduMapItem of this.baiduMap.monitor_top_left) {
          if (baiduMapItem.actionType === "historyRoute")
            baiduMapItem.monitorClass = "monitor-topleft-basic-icon icon-open";
        }
        this.getTpVehPosition(data);
        // 单车跟踪
        self.monitorTrack.deviceH = data.Id
        self.monitorTrack.featureH = 1;
      }else if(data.Id < 1000){ //企业
        self.monitorTrack.deviceH = data.Id
        self.monitorTrack.featureH = 0;
      }else if(data.Id > 1000){ //如果Id>1000 就是企业
        self.monitorTrack.deviceH = data.Id
        self.monitorTrack.featureH = 1;
      }
    },
    loadNode(node, resolve) {
      // 持续采坑的记录：
      // 由于resolve采用的是promise原理，使用异步方式，所以需要同步操作
      let self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_cljg_cxqy'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 加载第一级的车辆监管信息
      let mTGetQueryNodeUrlParams = Object();
      if (node.level === 0) {
        mTGetQueryNodeUrlParams = {
          type: 0,
          parentId: 0
        };
      } else if (!node.VecType) {
        mTGetQueryNodeUrlParams = {
          type: 0,
          parentId: node.data.Id
        };
      }
      let currentArr = [];
      axiosRequest
        .axiosGet(this.mTGetQueryNodeUrl, mTGetQueryNodeUrlParams)
        .then(function(response) {
          /**
           * 1. GnsscenterId:0
              2. IcoType:0
              3. Id:999000013
              4. IsPermission:0
              5. LogicUnitid:1
              6. Name:"个体户营运企业"
              7. PlateName:""
              8. ReUpUnitId:999000013
              9. Role:155189248
              10. UpUnitId:2
              11. UpUnitName:"石家庄市运管处"
              12. VecType:0
              13. VecTypeName:"其他车"
              14. ZName:"市辖区"
              15. ZoneId:13010100
              ord:99
           */
          /**
           * _data = {
                type: item[0],
                typeVal: item[0],
                id: item[1],
                name: item[2],
                zoneId: item[3],
                icoType: item[4],
                isPermission: item[5],
                reUpUnitId: item[6],
                vecType: item[7],
                ord: [8],
                zoneName: item[9],

                upUnitId: item[10],
                logicUnitId: item[11],
                gnsscenterId: item[12],

                role: item[0],
                //logicUnitName: item[14],
                plateName: item[13],
                upUnitName: item[14] == "-1" ? item[2] : item[14],
                isPush: false,
                isOnline: item[16]
            }
          */
          const monitorTemp = response.data;
          for (let monitorItem of monitorTemp) {
            if (node.level === 0) {
              if (monitorItem.ord === -1) {
                // monitorItem = init_templet(monitorItem);
                currentArr.push({
                  Id: monitorItem.Id,
                  Name: monitorItem.Name,
                  ZoneId: monitorItem.ZoneId,
                  IsOnline: monitorItem.IsOnline,
                  VecType: monitorItem.VecType, //判断是否点击在车辆节点上
                  leaf: monitorItem.VecType?true:false
                });
                // 作为测试数据
              }
            } else {
              currentArr.push({
                Id: monitorItem.Id,
                Name: monitorItem.Name,
                ZoneId: monitorItem.ZoneId,
                IsOnline: monitorItem.IsOnline,
                VecType: monitorItem.VecType, //判断是否点击在车辆节点上
                leaf: monitorItem.VecType?true:false
              });
            }
          }
          if(currentArr.length == 0){
            for (let monitorItem of monitorTemp) {
               currentArr.push({
                Id: monitorItem.Id,
                Name: monitorItem.Name,
                ZoneId: monitorItem.ZoneId,
                IsOnline: monitorItem.IsOnline,
                VecType: monitorItem.VecType, //判断是否点击在车辆节点上
                leaf: monitorItem.VecType?true:false
              });
            }
          }
          return resolve(currentArr);
        })
        .catch(function(error) {});
    },
    init_templet: function(item) {
      _data = {
        type: item[0],
        typeVal: item[0],
        id: item[1],
        name: item[2],
        zoneId: item[3],
        icoType: item[4],
        isPermission: item[5],
        reUpUnitId: item[6],
        vecType: item[7],
        ord: [8],
        zoneName: item[9],

        upUnitId: item[10],
        logicUnitId: item[11],
        gnsscenterId: item[12],

        role: item[0],
        //logicUnitName: item[14],
        plateName: item[13],
        upUnitName: item[14] == "-1" ? item[2] : item[14],
        isPush: false,
        isOnline: item[16]
      };
      return _data;
    },
    // 获取当前行的车辆的历史轨迹
    getHistoryInfo: function(getHistoryInfoUrlParams) {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_cljg_clnsgj'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // const nowSeconds = new Date().format("hhmmss");
      // 封装函数来组装每一页请求的参数
      // const getHistoryInfoUrlParams = {
      //   VehicleId: rowItem.Id,
      //   // VehicleId: 2027,
      //   StartDate: new Date().format("yyyyMMdd"),
      //   EndDate: new Date().format("yyyyMMdd"),
      //   StartTime: 0,
      //   EndTime:
      //     parseInt(nowSeconds.substr(0, 2) * 3600) +
      //     parseInt(nowSeconds.substr(2, 2) * 60) +
      //     parseInt(nowSeconds.substr(4, 2))
      // };
      // self.tabCtntList[self.activeNameIndex].loading = true; //加载数据的时候，显示加载数据的logo
      // // 清空当前数据的集合
      // self.providerCheckSourceData = [];
      axiosRequest
        .axiosGet(this.getHistoryInfoUrl, getHistoryInfoUrlParams)
        .then(function(response) {
          const historyInfoTemp = response.data;
          let filterHistoryInfo = [];
          filterHistoryInfo = historyInfoTemp;
          // if (historyInfoTemp.length < 1000) {
          //   filterHistoryInfo = historyInfoTemp;
          // } else if (
          //   historyInfoTemp.length > 1000 &&
          //   historyInfoTemp.length < 2000
          // ) {
          //   for (let item = 0; item < historyInfoTemp.length; item += 20) {
          //     filterHistoryInfo.push(historyInfoTemp[item]);
          //   }
          // } else if (
          //   historyInfoTemp.length > 2000 &&
          //   historyInfoTemp.length < 3000
          // ) {
          //   for (let item = 0; item < historyInfoTemp.length; item += 60) {
          //     filterHistoryInfo.push(historyInfoTemp[item]);
          //   }
          // } else if (historyInfoTemp.length > 3000) {
          //   for (let item = 0; item < historyInfoTemp.length; item += 100) {
          //     filterHistoryInfo.push(historyInfoTemp[item]);
          //   }
          // }
          const seriesPointsTemp = [];

          for (let historyInfoItem of filterHistoryInfo) {
            seriesPointsTemp.push({
              latitude: historyInfoItem.latitudeCNV, //纬度
              longitude: historyInfoItem.longitudeCNV, //经度
              // companyName: historyInfoItem.CompanyName, //所属企业
              // speedAndSLimit: historyInfoItem.speed, //速度和限速值
              // platformNameRe: historyInfoItem.PlatformNameRe, //接入平台
              // location:historyInfoItem.Location, //地址
              // GPSDataAndTime: formatYMD(historyInfoItem.GPSDate) + " " + formatHHmmss(historyInfoItem.GPSTime), //定位时间
            });
          }
          self.baiduMap.displayType = "historyRoute";
          self.seriesPoints = seriesPointsTemp;
        })
        .catch(function(error) {});
    },
    // 获取跟踪websocket

    handleActionClick: function(msg) {
      // 设置样式
      for(let item of this.baiduMap.monitor_top_left){
        if(item.actionType === msg.actionType){
          if(msg.actionType === 'monitorTrack'){
            let clickClass = '';
            if(item.isClicked) {
              clickClass = 'monitor-track-open';
              item.isClicked = false;
              // this.baiduMap.displayType = "cancelMonitorTrack"; //要清空地图上的坐标信息
              this.monitorTrackRslt = []; //清空地图上的坐标信息
              cancelMonitorTrack(this.monitorTrack);
              this.$message({
                message: '已取消跟踪',
                type: 'success'
              });
            }
            else {
              clickClass = 'monitor-track-select';
              item.isClicked = true;
              this.$message({
                message: '跟踪设置成功，正在准备数据...',
                type: 'success'
              });
              monitorTrack(this.monitorTrack);
            }
            item.monitorClass = 'monitor-topleft-basic-icon ' + clickClass;
          }
        }
      }
      switch (msg.actionType) {
        case 'historyRoute':
          if(!msg.vehicleData.IsOnline){
            this.$message({
              message: '抱歉，当前没有选中在线车辆',
              type: 'warning'
            });
          }
          break;
        default:
          break;
      }
    },
    // 处理子组件上传的mouseover事件
    handleMouseOver: function(msg){
      let overClass = '';
      switch (msg) {
        case 'historyRoute':
          overClass = 'icon-over';
          break;
        case 'monitorTrack':
          overClass = 'monitor-track-hover';
          break;
        default:
          break;
      }
      for(let item of this.baiduMap.monitor_top_left){
        if(item.actionType === msg){
           if(msg === 'monitorTrack' && !item.isClicked){
            item.monitorClass = 'monitor-topleft-basic-icon ' + overClass;
          }else if(msg === 'historyRoute') item.monitorClass = 'monitor-topleft-basic-icon ' + overClass;
        }
      }
    },
    // 处理子组件上传的mouseover事件
    handleMouseOut: function(msg){
      let outClass = '';
      switch (msg) {
        case 'historyRoute':
          outClass = 'icon-open';
          break;
        case 'monitorTrack':
          outClass = 'monitor-track-open';
          break;
        default:
          break;
      }
      for(let item of this.baiduMap.monitor_top_left){
        if(item.actionType === msg){
          if(msg === 'monitorTrack' && !item.isClicked){
            item.monitorClass = 'monitor-topleft-basic-icon ' + outClass;
          }else if(msg === 'historyRoute') item.monitorClass = 'monitor-topleft-basic-icon ' + outClass;
        }
      }
    },
    // 车辆监管-获取车辆最新定位
    getTpVehPosition: function(data) {
      let self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'home_cljg_clzxdw'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const getTpVehPositionUrlParams = {
        vehicleId: data.Id
      };
      axiosRequest
        .axiosGet(this.getTpVehPositionUrl, getTpVehPositionUrlParams)
        .then(function(response) {
          const tpVehPositionTemp = response.data;
          self.latitude = tpVehPositionTemp.Latitude / 1000000;
          self.longtitude = tpVehPositionTemp.Longitude / 1000000;
          self.baiduMap.displayType = "messageBox";
          self.baiduMap.textObj = {
            title: tpVehPositionTemp.PlateNumber + "(" + tpVehPositionTemp.PlateColor + ")",
            message:
              "<div class='supervise-msg-box-left'>所属企业：</div>" + "<div class='supervise-msg-box-right'>" + tpVehPositionTemp.UnitName + "</div>"+
              // "<div class='supervise-msg-box-left'>所属运营商：</div>" + "<div class='supervise-msg-box-right'>" + tpVehPositionTemp.ProviderName + "</div>"+
              // "<div class='supervise-msg-box-left'>车辆类型：</div>" + "<div class='supervise-msg-box-right'>" + tpVehPositionTemp.VehicleType + "</div>"+
              // "<div class='supervise-msg-box-left'>速度/限速值：</div>" + "<div class='supervise-msg-box-right'>" + tpVehPositionTemp.Speed + "/" + "0" +" km/h</div>"+
              "<div class='supervise-msg-box-left'>接入平台：</div>" + "<div class='supervise-msg-box-right'>" + tpVehPositionTemp.PlatformName + "</div>"+
              "<div class='supervise-msg-box-left'>地址：</div>" + "<div class='supervise-msg-box-right'>" + tpVehPositionTemp.LatitudeCNY + "</div>"+
              "<div class='supervise-msg-box-left'>定位时间：</div>" + "<div class='supervise-msg-box-right'>" + formatYMD(tpVehPositionTemp.GPSDate) + " " + formatHHmmss(tpVehPositionTemp.GPSTime) + "</div>"+
              "<div class='supervise-msg-box-left'>接收时间：</div>" + "<div class='supervise-msg-box-right'>" + formatYMD(tpVehPositionTemp.RecvDate) + " " + formatHHmmss(tpVehPositionTemp.RecvTime) + "</div>"
          };
        })
        .catch(function(error) {});
    },
    renderContent(h, { node, data, store }) {
      if (data.VecType) {
        let onlineofflineHTML = '';
        if(data.IsOnline) onlineofflineHTML = <div title="在线" class="online"></div>;
        else onlineofflineHTML = <div title="离线" class="offline"></div>;
        //显示车辆的状态
        return (
          <span class="custom-tree-node">
            <span class="monitor-tree-text">{node.label}</span>
            {onlineofflineHTML}
          </span>
        );
      }else return (<span class="monitor-tree-text">{node.label}</span>)
    },
    filterNode: function(value, data){
      if (!value) return true;
      return data.Name.indexOf(value) !== -1;
    },
    // 单选按钮选中时改变提示框的内容
    changeRadio: function(value){
      this.preSearchItems = []; //置空预搜索功能，当切换车辆、企业的时候
      switch(value){
        case "vehicle":
        this.inputPlaceholder = "请输入车辆名称"
        break;
        case "company":
        this.inputPlaceholder = "请输入企业名称"
        break;
        default:
      }
    },
    // 判断是进行企业搜索还是车辆搜索
    handleSearch(){
      switch(this.zoneArray.typeSelected){
        case "vehicle":
        this.getTpVehPosition(this.inputCtntReal);
        break;
        case "company":
        this.inputCtnt = this.inputCtntReal.inputVal; //如果是企业搜索将会调用filterNode
        break;
        default:
        this.$message({
          type: 'warning',
          message: '请先选择类型 车辆/企业'
        })
      }
    },
     // Multil-Level预搜索功能
    changePreSearch: function(inputCtnt) {
      const self = this;
      if(this.zoneArray.typeSelected === 'vehicle'){
        axiosRequest.axiosGet(this.getAutoDataListUrl, {
            type: 3, // 参数详细设置请参考commonConfig.js的说明
            text: inputCtnt.toString(),
            zoneId: 0,
            queryType: 0
          })
          .then(function(response) {
              const preSearchTemp = [];
              for (let preSearchItem of response.data) {
                preSearchTemp.push({
                  Name: preSearchItem.Name,
                  Value: preSearchItem.Value
                });
              }
              self.preSearchItems = preSearchTemp;
          })
          .catch(function(error) {});
      }
    },
    //从预搜索中选择结果
    handlePreSearchSelect: function(Value, Name) {
      //1. 清除预搜索数据
      this.preSearchItems = [];
      //3. 填充到当前输入框
      this.inputCtntReal.inputVal = Name;
      this.inputCtntReal.Id = Value;
    },
    needClearInput: function() {
      // this.inputCtntReal.inputVal = "";
      // this.inputCtntReal.Id = '';
    },
    // 处理子组件上传的播放历史轨迹请求
    handleHistoryAction: function(msg){
      switch (msg.actionType) {
        case 'play':
          this.getHistoryInfo(msg.emitData);
          break;
        case 'stop':
          break;
        case 'pause':
          break;
        case 'hideMessageBox':
          break;
        case 'showMessageBox':
          break;
        default:
      }
    }
  }
};
</script>
