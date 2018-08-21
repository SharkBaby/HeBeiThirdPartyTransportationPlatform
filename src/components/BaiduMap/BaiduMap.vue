<template>
  <div class="baiduMap">
    <div id="divContainer" class="monitor-container"></div>
    <!--top left -->
    <div class="monitor-top-left">
      <div :class="monitorTpLft.monitorClass" :title="monitorTpLft.monitorTitle" 
      v-for="(monitorTpLft,monitorTpLftKey) of baiduMapVal.monitor_top_left" :key="monitorTpLftKey"
      v-show="monitorTpLft.isShow"
      @click="handleAction(monitorTpLft.actionType)"
      @mouseover="handleMouseOver(monitorTpLft.actionType)"
      @mouseout="handleMouseOut(monitorTpLft.actionType)"></div>
      <el-popover
        placement="bottom"
        :title="baiduMapVal.textObj.title"
        width="600"
        trigger="manual"
        v-model="historyRouteInfoConfig.visible">
        <div>
        <div class='supervise-history-route-left'>时间起-时间至：</div><div class='supervise-history-route-right'>
        <from-to-time-picker-component
        :labelName="historyRouteInfoConfig.startTime.labelName" 
        :compVal="historyRouteInfoConfig.startTime.compVal" 
        :labelId="historyRouteInfoConfig.startTime.labelId"
        v-on:fromToTimePickerChange="fromToTimePickerChange"></from-to-time-picker-component>
        </div>
        <!-- <div class='supervise-msg-box-left'>播放速度：</div><div class='supervise-msg-box-right'></div> -->
        <!-- <div class='supervise-msg-box-left'>播放进度：</div><div class='supervise-msg-box-right'></div> -->
        <el-row class="supervise-history-route-button">
          <el-button 
          type="primary" 
          :icon="btnItem.iconName" 
          v-for="(btnItem, btnKey) of historyRouteInfoConfig.historyBtnEvents" 
          :key="btnKey" 
          @click="handleBtnClick(btnItem.btnId)" 
          class="btn-com" :disabled=btnItem.isDisabled
          v-hasAccess= "{accessId: btnItem.ctrlId}">{{btnItem.btnName}}</el-button>
        </el-row>
        </div>
      </el-popover>
    </div>
    <!--bottom right -->
    <div class="monitor-bottom-right">
      <div :class="monitorBtmRgt.monitorDivClass" v-for="(monitorBtmRgt,monitorBtmRgtKey) of baiduMapVal.monitor_bottom_right" :key="monitorBtmRgtKey">
        <a href="#" :class="monitorBtmRgt.monitorAClass" :title="monitorBtmRgt.monitorTitle"></a>
      </div>
      <!-- <div class="vehicle-map-control">
        <a href="#" class="mapControl-icon"></a>
      </div> -->
    </div>
    <!--right bottom -->
    <div class="monitor-right-bottom">
      <div :class="monitorRgtBtm.monitorDivClass" v-for="(monitorRgtBtm,monitorRgtBtmKey) of baiduMapVal.monitor_right_bottom" :key="monitorRgtBtmKey">
        <a href="#" :class="monitorRgtBtm.monitorAClass" :title="monitorRgtBtm.monitorTitle"></a>
      </div>
    </div>
  </div>
</template>
<style src="./baiduMap.css" type="text/css"></style>
<script>
import FromToTimePickerComponent from '@/components/FromToTimePickerComponent/FromToTimePickerComponent';
import {
  formatHHmmss,
  isNullUndefEmpty,
  formatYMD
} from "@/common/common";
export default {
  name: "BaiduMap",
  props: ["baiduMap", "latitude", "longtitude", "seriesPoints", "tabCtntList", "vehicleData", "monitorTrackRslt"],
  components: {
    FromToTimePickerComponent
  },
  data() {
    return {
      latitudeVal: this.latitude,
      longtitudeVal: this.longtitude,
      seriesPointsVal: this.seriesPoints,
      baiduMapVal: this.baiduMap,
      monitorTrackRsltVal: this.monitorTrackRslt,
      map: '', //全局保存地图的对象，不用刷新时重新绘制地图
      isMonitorTracked: true, 
      historyRouteInfoConfig: { //该对象配置所有关于历史轨迹的信息
        visible: false,
        historyBtnEvents: [ //管理历史轨迹的按钮
          {
            iconName: "",
            btnId: "play", //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "播放",
            // isDisabled: false, //控制查询数据按钮初始状态为enabled
            // ctrlId: 'tjfx_wzcltj_dqhz_cx', //需要权限控制的情况下，需要制定id号
          },
          // {
          //   iconName: "",
          //   btnId: "stop", //该ID主要是用来判断在子组件中出发了哪一个按钮
          //   btnName: "停止",
          //   // isDisabled: true, //控制导出数据按钮初始状态为disabled
          //   // ctrlId: 'tjfx_wzcltj_dqhz_dc', //需要权限控制的情况下，需要制定id号
          // },
          // {
          //   iconName: "",
          //   btnId: "pause", //该ID主要是用来判断在子组件中出发了哪一个按钮
          //   btnName: "暂停",
          //   // isDisabled: false, //控制查询数据按钮初始状态为enabled
          //   // ctrlId: 'tjfx_wzcltj_dqhz_cx', //需要权限控制的情况下，需要制定id号
          // },
          // {
          //   iconName: "",
          //   btnId: "hideMessageBox", //该ID主要是用来判断在子组件中出发了哪一个按钮
          //   btnName: "隐藏信息窗口",
          //   // isDisabled: true, //控制导出数据按钮初始状态为disabled
          //   // ctrlId: 'tjfx_wzcltj_dqhz_dc', //需要权限控制的情况下，需要制定id号
          // },
          // {
          //   iconName: "",
          //   btnId: "showMessageBox", //该ID主要是用来判断在子组件中出发了哪一个按钮
          //   btnName: "展示信息窗口",
          //   // isDisabled: false, //控制查询数据按钮初始状态为enabled
          //   // ctrlId: 'tjfx_wzcltj_dqhz_cx', //需要权限控制的情况下，需要制定id号
          // }
        ],
        startTime: {
          labelName: "",
          labelId: 'startTime', //该ID主要是用来判断在子组件中出发了哪一种个子组件
          compVal: [new Date(new Date().getTime() - 1 * 60 * 60 * 1000).format('yyyyMMddhhmmss'), new Date().format('yyyyMMddhhmmss')] //默认展示过去一个小时的行驶轨迹
        }
      }
    };
  },
  watch: {
    latitude: function(newVal) {
      this.latitudeVal = newVal;
      this.displayNormalMap();
    },
    longtitude: function(newVal) {
      this.longtitudeVal = newVal;
      this.displayNormalMap();
    },
    seriesPoints: function(newVal) {
      this.seriesPointsVal = newVal;
      console.log("有新的更新至哦");
      this.displayNormalMap();
    },
    baiduMap: function(newVal) {
      this.baiduMapVal = newVal;
      this.displayNormalMap();
    },
    monitorTrackRslt: function(newVal){
      this.monitorTrackRsltVal = newVal;
      this.displayNormalMap();
    }
  },
  mounted() {
    this.displayNormalMap();
  },
  methods: {
    displayNormalMap: function() {
      let self = this;
      if(isNullUndefEmpty(self.map)) self.map = new BMap.Map("divContainer"); // 创建Map实例
      
      // 百度地图API功能
      if (self.baiduMapVal.displayType === "messageBox") {
        self.map = new BMap.Map("divContainer"); // 创建Map实例
        if (this.latitude != null && this.longtitude != null) {
          // 注释人：向浩
          // 注释时间：2018-07-12
          // 注释原因：添加纯文字的信息窗口
          var point = new BMap.Point(this.longtitude, this.latitude);
          // var point = new BMap.Point(114.502461, 38.045474);
          var marker = new BMap.Marker(point); // 创建标注
          self.map.addOverlay(marker); // 将标注添加到地图中
          self.map.centerAndZoom(point, 11);
          var opts = {
            width: 500, // 信息窗口宽度
            height: 200, // 信息窗口高度
            title: self.baiduMapVal.textObj.title, // 信息窗口标题
            enableMessage: true, //设置允许信息窗发送短息
            message: "No Message Here."
          };
          var infoWindow = new BMap.InfoWindow(
            self.baiduMapVal.textObj.message,
            opts
          ); // 创建信息窗口对象
          marker.addEventListener("click", function() {
            self.map.openInfoWindow(infoWindow, point); //开启信息窗口
          });
          if(this.latitude != 38.045474 && this.longtitude != 114.502461) self.map.openInfoWindow(infoWindow, point); //自己打开窗口开启信息窗口
        } else {
          self.$message.error("目前还没有该车辆的最新定位");
        }
      } else if (self.baiduMapVal.displayType === "historyRoute") {
        // 参考博客：https://blog.csdn.net/hzw2312/article/details/53671228， 这里采用方案二，自定义线路
        self.map = new BMap.Map("divContainer"); // 创建Map实例
        // Start - 显示历史轨迹
        const pointArr = self.seriesPointsVal;
        self.map.enableScrollWheelZoom();
        self.map.centerAndZoom(
          new BMap.Point(pointArr[0].longitude, pointArr[0].latitude),
          13
        );
        //方案一
        // let driving;
        // for (let item in pointArr) {
        //   if (item == 0) {
        //     new BMap.Point(pointArr[item].longitude, pointArr[item].latitude);
        //     continue;
        //   }
        //   driving = new BMap.DrivingRoute(self.map, {
        //     renderOptions: { map: self.map, autoViewport: false },
        //     onMarkersSet: function(routes) {
        //       self.map.removeOverlay(routes[0].marker); //删除API自带起点
        //       self.map.removeOverlay(routes[1].marker); //删除API自带终点
        //     }
        //   });
        //   driving.search(
        //     new BMap.Point(
        //       pointArr[item - 1].longitude,
        //       pointArr[item - 1].latitude
        //     ),
        //     new BMap.Point(pointArr[item].longitude, pointArr[item].latitude)
        //   );
        // }
        //方案二
        let arrPois = [],i = 0;
        /**添加终点和起点的标记**/
        this.addMarker(new BMap.Point(pointArr[0].longitude, pointArr[0].latitude),'起点',self.map);
        this.addMarker(new BMap.Point(pointArr[pointArr.length-1].longitude,pointArr[pointArr.length-1].latitude),'终点',self.map);
        let interval = setInterval(()=>{
        arrPois.push(new BMap.Point(pointArr[i].longitude, pointArr[i].latitude));
        i++;
        //创建线路
        let polyline = new BMap.Polyline(
          arrPois,//所有的GPS坐标点
          {
          strokeColor : "#009933", //线路颜色
          strokeWeight : 4,//线路大小
          //线路类型(虚线(dashed),点线(dotted),实线(solid)
          strokeStyle : "dashed"});
          //绘制线路
          self.map.addOverlay(polyline);
        },0);
      }
      // 车辆监管的跟踪
      else if (self.baiduMapVal.displayType === "monitorTrack") {
        // 百度地图-信息窗口示例-给多个点添加信息窗口
        // 直接点击页面上的坐标点
        if(self.monitorTrackRsltVal.length > 0){
          if(self.isMonitorTracked){
            self.map.centerAndZoom(new BMap.Point(self.monitorTrackRsltVal[0][0].model.Longitude / 1000000, self.monitorTrackRsltVal[0][0].model.Latitude / 1000000), 11);
            self.isMonitorTracked = false;
          }
          const data_info = [];
          for (let tabCtntItem of self.monitorTrackRsltVal) {
            const data_info_temp = [];
            const textObj = {
              title: tabCtntItem[0].model.PlateNum + "(" + tabCtntItem[0].model.PlateColor + ")",
              message:
                "<div class='supervise-msg-box-left'>所属企业：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem[0].model.UnitName + "</div>"+
                "<div class='supervise-msg-box-left'>地址：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem[0].model.Address + "</div>"+
                "<div class='supervise-msg-box-left'>速度/限速值：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem[0].model.Speed + "/" + tabCtntItem[0].model.SpeedLimit + " km/h</div>"+
                "<div class='supervise-msg-box-left'>定位时间：</div>" + "<div class='supervise-msg-box-right'>" + formatYMD(tabCtntItem[0].model.GPSDate)  + " " + formatHHmmss(tabCtntItem[0].model.GPSTime) + "</div>"+
                "<div class='supervise-msg-box-left'>接收时间：</div>" + "<div class='supervise-msg-box-right'>" + formatYMD(tabCtntItem[0].model.RecvDate) + " " + formatHHmmss(tabCtntItem[0].model.RecvTime) + "</div>"
            };
            data_info_temp.push(
              tabCtntItem[0].model.Longitude / 1000000,
              tabCtntItem[0].model.Latitude / 1000000,
              textObj
            );
            data_info.push(data_info_temp);
          }
          for (var i = 0; i < data_info.length; i++) {
            var marker = new BMap.Marker(
              new BMap.Point(data_info[i][0], data_info[i][1])
            ); // 创建标注
            var content = data_info[i][2];
            self.map.addOverlay(marker); // 将标注添加到地图中
            // map.centerAndZoom(point, 11);
            self.addClickHandler(content, marker, self.map);
          }
        } else { //取消追踪后，清除地图上的所有点，并定位到石家庄
          self.map = new BMap.Map("divContainer"); // 创建Map实例
          let point = new BMap.Point(114.502461, 38.045474);
          self.isMonitorTracked = true;
          self.map.centerAndZoom(point, 11);
        }
      } else {
        // 直接点击页面上的坐标点
        self.map = new BMap.Map("divContainer"); // 创建Map实例
        if(self.tabCtntList.TabCtnt.length > 0){
          self.map.centerAndZoom(new BMap.Point(self.tabCtntList.TabCtnt[0].eLongtitude, self.tabCtntList.TabCtnt[0].eLatitude), 11);
          const data_info = [];
          for (let tabCtntItem of self.tabCtntList.TabCtnt) {
            const data_info_temp = [];
            const textObj = {
              title: tabCtntItem.plate,
              message:
                "<div class='supervise-msg-box-left'>所属企业：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem.unitName + "</div>"+
                "<div class='supervise-msg-box-left'>所属接入平台：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem.platformName + "</div>"+
                "<div class='supervise-msg-box-left'>地址：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem.bAddress + " km/h</div>"+
                "<div class='supervise-msg-box-left'>速度/限速值：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem.topSpeed / tabCtntItem.speedLimit + "</div>"+
                "<div class='supervise-msg-box-left'>报警类别：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem.alarmTypeName + "</div>"+
                "<div class='supervise-msg-box-left'>报警时间：</div>" + "<div class='supervise-msg-box-right'>" + tabCtntItem.startTime + "</div>"
            };
            data_info_temp.push(
              tabCtntItem.eLongtitude,
              tabCtntItem.eLatitude,
              textObj
            );
            data_info.push(data_info_temp);
          }
          for (var i = 0; i < data_info.length; i++) {
            var marker = new BMap.Marker(
              new BMap.Point(data_info[i][0], data_info[i][1])
            ); // 创建标注
            var content = data_info[i][2];
            self.map.addOverlay(marker); // 将标注添加到地图中
            // self.map.centerAndZoom(point, 11);
            self.addClickHandler(content, marker, self.map);
          }
        } else {
          let point = new BMap.Point(114.502461, 38.045474);
          self.map.centerAndZoom(point, 11);
        }
      }
      // End - 显示历史轨迹
      // self.map.centerAndZoom(new BMap.Point(114.502461, 38.045474), 11); // 初始化地图,设置中心点坐标(长沙经纬度坐标（112.982279,28.19409）)和地图级别(11)
      // //添加地图类型控件
      // self.map.addControl(
      //   new BMap.MapTypeControl({
      //     mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
      //   })
      // );
      // self.map.setCurrentCity("石家庄"); // 设置地图显示的城市 此项是必须设置的
      self.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    },
    addClickHandler(content, marker, map) {
      const self = this;
      marker.addEventListener("click", function(e) {
        self.openInfo(content, map, e);
      });
    },
    openInfo(content, map, e) {
      var p = e.target;
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var opts = {
        width: 530, // 信息窗口宽度
        height: 200, // 信息窗口高度
        title: content.title, // 信息窗口标题
        enableMessage: true, //设置允许信息窗发送短息
        message: "No Message Here."
      };
      var infoWindow = new BMap.InfoWindow(content.message, opts); // 创建信息窗口对象
      map.openInfoWindow(infoWindow, point); //开启信息窗口
    },
    /**
     * 标记
     * @param {Object} point
     */
    addMarker(point,name, map){
      var marker = new BMap.Marker(point);
      var label = new BMap.Label(name, {
        offset : new BMap.Size(20, -10)
      });
      marker.setLabel(label);
      map.addOverlay(marker);
    },
    // 处理鼠标mouseOver事件
    handleMouseOver: function(actionType){
      switch(actionType){
        case 'historyRoute':
        this.$emit('handleMouseOver', 'historyRoute');
        break;
        case "monitorTrack":
        this.$emit('handleMouseOver', 'monitorTrack');
      }
    },
    // 处理鼠标mouseOut事件
    handleMouseOut: function(actionType){
      switch(actionType){
        case 'historyRoute':
        this.$emit('handleMouseOut', 'historyRoute');
        break;
        case "monitorTrack":
        this.$emit('handleMouseOut', 'monitorTrack');
      }
    },
    // 处理在地图上点击的类型事件
    handleAction: function(actionType){
      const infoTemp = {
        actionType,
        vehicleData: this.vehicleData
      }
      switch(actionType){
        case 'historyRoute':
        this.historyRouteInfoConfig.visible = !this.historyRouteInfoConfig.visible;
        this.$emit('handleActionClick', infoTemp);
        break;
        case "monitorTrack":
        this.$emit('handleActionClick', infoTemp);
      }
    },
    // 处理点击事件
    handleBtnClick: function(btnId) {
      const startEndTemp = this.historyRouteInfoConfig.startTime.compVal;
      const emitTemp = {
        actionType: btnId,
        emitData: {
          VehicleId: this.vehicleData.Id,
          StartDate: startEndTemp[0].substr(0,8),
          EndDate: startEndTemp[1].substr(0,8),
          StartTime: parseInt(startEndTemp[0].substr(8,2)*3600) + parseInt(startEndTemp[0].substr(10,2)*60) + parseInt(startEndTemp[0].substr(12)),
          EndTime:parseInt(startEndTemp[1].substr(8,2)*3600) + parseInt(startEndTemp[1].substr(10,2)*60) + parseInt(startEndTemp[1].substr(12)),
        }
      }
      this.$emit('handleHistoryAction', emitTemp);
    },
    // 处理datePicker子组件传递上来的最新值
    fromToTimePickerChange: function(msg) {
      this.historyRouteInfoConfig.startTime.compVal = msg.compVal;
    },
  }
};
</script>
