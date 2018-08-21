import {
  storageOperation,
  isNullUndefEmpty,
  formatYMD,
  formatHHmmss
} from '@/common/common';
import {
  commonConfig
} from '@/config/commonConfig';
import {
  store
} from '@/vuex/store'
import {
  decodeFromGb2312
}
from '@/common/gb2312Convertion';
// 注释人：向浩
// 注释时间：2018-07-12/2018-07-18
// 注释原因：实时显示Websocket通信数据/由于是实时显示，目前这种方法不能做到实时显示，故放置在vuex中进行状态管理
// const superviseRslt = {
//   overspeed: [], //超速
//   overspeedLength: 0, //超速长度
//   abnormalmove: [], //凌晨2-5报警运行
//   abnormalmoveLength: 0, //凌晨2-5报警运行长度
//   over4hour: [], //疲劳驾驶
//   over4hourLength: 0, //疲劳驾驶长度
// };
// 分片段来执行websocket显示的操作
// 使用队列来进行缓存websocet的数据，以避免页面实时处理 页面卡死
let superviseTempRslt = {
  overspeed: [], //超速
  abnormalmove: [], //凌晨2-5报警运行
  over4hour: [], //疲劳驾驶
}
// 使用队列来进行缓存车辆监管跟踪的websocet的数据，以避免页面实时处理 页面卡死
let monitorTrackTempRslt = [],
  ismotorTracked = true; // 取消跟踪立即不再处理接收到的车辆跟踪的数据,主要是后台有一个响应的延时，可能在用户点击取消跟踪后，还是会受到几条车辆跟踪信息
let ws = '',
  lockReconnect = false; //避免ws重复连接;
// 登录成功后马上进行websocket握手连接handshake
function initSetupWebSocket(url) {
  try {
    ws = new WebSocket(commonConfig.webSocketUrl);
    ws.binaryType = 'arraybuffer';
    initEventHandle();
    getalarm_actual();
    console.log('开始连接websocket');
  } catch (e) {
    reConnectWebSocket(commonConfig.webSocketUrl);
    console.log(e);
  }
}
const initEventHandle = function () {
  ws.onopen = function () {
    // Web Socket 已连接上，使用 send() 方法发送数据
    var dataBag = new Object();
    dataBag = WSData.CreateDataBag(WSData.DataBag.Login);
    // dataBag.setName("shm"); //sessionStorage.getItem("LoginID")
    dataBag.setName(storageOperation.getItem("LoginID"));
    console.log('设置websocket用户名1')
    send(ws, dataBag);
    console.log('设置websocket用户名2')
    console.log(ws)
    console.log(dataBag)
  };
  ws.onmessage = function (evt) {
    console.log("已连接onMessage");
    var byteData = evt.data;
    var head = convertByteToStruct(byteData);
    var reader = new streamReader(byteData, '');
    reader.reset();
    reader.setFormat(head.getFormat());
    reader.readToEnd();
    // 按照子命令分别车辆报警类别， 分别添加到相应的数组： 324: 超速，325：疲驾， 326：异动，46：车辆跟踪 
    switch (head.subcmdH.value) {
      case 324:
      case 325:
      case 326:
        // 1 - websocket实时警情处理情况
        handleWebSocketSupervise(head, reader);
        break;
      case 46:
        // 2 - websocket车辆监管跟踪情况
        if (ismotorTracked) handleWebSocketMonitorTrack(head, reader);
        break;
      default:
        break;
    }
  };
  // 关闭websocket，2000ms将尝试重连
  ws.onclose = function () {
    reConnectWebSocket(commonConfig.webSocketUrl);
    console.log('关闭websocket，2000ms将尝试重连');
  };
  // 错误websocket，2000ms将尝试重连
  ws.onerror = function () {
    reConnectWebSocket(commonConfig.webSocketUrl);
    console.log('错误websocket，2000ms将尝试重连');
  }
}
// Start - 测试关闭websocket后会不会重连
// setTimeout(()=>{
//   ws.close(); // 测试关闭websocket后会不会重连
//   console.log('关闭websocket');
// },15000);
// End - 测试关闭websocket后会不会重连

// Start - 网络问题导致webSocket重连机制
const reConnectWebSocket = function (url) {
  if (lockReconnect) return;
  lockReconnect = true;
  setTimeout(function () { //没连接上会一直重连，设置延迟避免请求过多
    console.log('开始重连websocket');
    initSetupWebSocket(url);
    lockReconnect = false;
  }, 5000); //如果websocket在中途断开连接2000ms后自动重连
}

// End - 网络问题导致webSocket重连机制
// 1 - websocket实时警情处理情况
const handleWebSocketSupervise = function (head, reader) {
  // var list = JSON.stringify(pushInAlarmType(head, reader));
  // storageOperation.setItem("list", list);
  // 注释人：向浩
  // 注释时间：2018-08-11
  // 注释原因：将vehicle_list设置为局部变量，以规范其作用域，不适用全局作用域来使得逻辑混乱
  // vehicle_list = []; //清空原来的值
  let webSocketRslt = pushInAlarmType(head, reader);
  console.log(webSocketRslt)
  for (let superviseItem of webSocketRslt) {
    switch (superviseItem.type) {
      case 'overspeed':
        superviseTempRslt.overspeed.push(bundleOverSpeedAbnormal4Hour(superviseItem));
        break;
      case 'abnormalmove':
        superviseTempRslt.abnormalmove.push(bundleOverSpeedAbnormal4Hour(superviseItem));
        break;
      case 'over4hour':
        superviseTempRslt.over4hour.push(bundleOverSpeedAbnormal4Hour(superviseItem));
        break;
      default:
    }
  }
}
// 2 - websocket车辆监管跟踪情况
const handleWebSocketMonitorTrack = function (head, reader) {
  let monitorTrackTemp = pushInAlarmType(head, reader);
  console.log(monitorTrackTemp);
  monitorTrackTempRslt.push(monitorTrackTemp); //先进行缓存
}
// 设置定时器来进行定时处理websocket传输过来的数据
let timer = setInterval(() => {
  if (!isNullUndefEmpty(superviseTempRslt.overspeed[0])) {
    store.commit('pushSuperviseRslt', superviseTempRslt.overspeed[0]);
    superviseTempRslt.overspeed.shift();
  }
  if (!isNullUndefEmpty(superviseTempRslt.abnormalmove[0])) {
    store.commit('pushSuperviseRsltAM', superviseTempRslt.abnormalmove[0]);
    superviseTempRslt.abnormalmove.shift();
  }
  if (!isNullUndefEmpty(superviseTempRslt.over4hour[0])) {
    store.commit('pushSuperviseRsltOH', superviseTempRslt.over4hour[0]);
    superviseTempRslt.over4hour.shift();
  }
  // 处理车辆监管-跟踪的缓存结果
  if (!isNullUndefEmpty(monitorTrackTempRslt[0])) {
    store.commit('updateMonitorTrackRslt', monitorTrackTempRslt[0]);
    monitorTrackTempRslt.shift(); //去除这条数据
  }
}, 2000); //每隔2000ms从缓存里面去一条数据进行处理
/**
 * 将发送websocket封装
 * */
var send = function (ws, struct) {
  var sw = new streamWriter();
  var data = struct.getData();
  sw.createBuffer(struct.getBufferLen());
  sw.writeBuffer(data.data, data.format);
  ws.send(sw.getBuffer());
}

/**
 * 解析二进制数据为字符串
 * */
var convertByteToStruct = function (byteData, bagName) {
  if (bagName == null) bagName = "Header";
  var obj = new WSData.DataBag[bagName].struct();
  var sr = new streamReader(byteData, obj.getFormat());
  obj.setData(sr.readToEnd());
  return obj;
  f
}

/****
 * 解析数据包头
 * 
 * */

var getResponseData = function (struct, head, reader) {
  var name = struct.toString();
  var retVal = null;

  if ((head.getCommandH() & WSData.Command.CMD_RECORDSETS) == WSData.Command.CMD_RECORDSETS) {
    retVal = [];
    var ds = new WSData.DataBag.DSHeader.struct();
    reader.setFormat(ds.getFormat());
    ds.setData(reader.readToEnd());

    reader.setFormat(struct.getFormat());
    for (var i = 0, len = ds.getRowCntS(); i < len; ++i) {
      retVal.push(getResponseData_Fill(reader, name));
    }
  } else {
    reader.setFormat(struct.getFormat());
    retVal = getResponseData_Fill(reader, name);
    if (head.getSubcmdH() == WSData.Subcmd.UP_WARN_MSG_ADPT_INFO) {
      retVal.plateId = head.getSourceH();
    }
  }
  return retVal;
}
/**
 * 
 * 解析数据包
 * */
var getResponseData_Fill = function (reader, structName) {
  var wsObj = (new WSData.Original[structName]()).getWSObject();
  // debugger
  // reader.setFormat(wsObj.getFormat());
  var row = reader.readToEnd();
  var j = 0;
  for (var item in wsObj) {
    if (row[j].toString().indexOf('%') >= 0) wsObj[item] = decodeFromGb2312(row[j]);
    else wsObj[item] = row[j];
    // wsObj[item] = decodeFromGb2312(row[j]);
    j++;
  }
  return wsObj;
}

/**
 * 将数据导入session
 * */
const pushInAlarmType = function (ret, reader) {
  const vehicle_list = [];
  let struct = '';
  const vehicle = {
    model: 123,
    type: type,
  }
  let type = ret.subcmdH.value;
  //324: 超速，325：疲驾， 326：异动，46：车辆跟踪
  switch (type) {
    case 324:
      type = "overspeed";
      struct = new WSData.Struct.WarnInfoOverSpeed();
      break;
    case 325:
      type = "abnormalmove";
      struct = new WSData.Struct.WarnInfoNightAbnormal();
      break;
    case 326:
      type = "over4hour";
      struct = new WSData.Struct.WarnInfoFourHours();
      break;
    case 46:
      type = "monitortrack";
      struct = new WSData.Struct.VehicleTrack_R();
      break;
    default:
      break;
  }
  const data = {
    type: 1,
    data: getResponseData(struct, ret, reader)
  }
  vehicle.type = type;
  vehicle.model = data.data;
  vehicle_list.push(vehicle);
  return vehicle_list;
}

/***
 * 
 * websocket获取实时报警数据
 * */
var getalarm_actual = function () {
  setTimeout(() => {
    var WarnInfoRequest_bag = WSData.CreateDataBag(WSData.DataBag.WarnInfoRequest);
    send(ws, WarnInfoRequest_bag);
    console.log('发送接收实时警情的websocket');
  }, 2000); //2000ms后开始接受实时警情的数据
}
/***
 * 
 * websocket获取跟踪数据
 * */
var monitorTrack = function (monitorTrackTemp) {
  // 清空vuex里面的状态量
  store.commit('emptyMonitorTrackRslt');
  // 清空缓存里面的值
  ismotorTracked = true;
  monitorTrackTempRslt = [];
  var VehicleTrack_bag = WSData.CreateDataBag(WSData.DataBag.VehicleTrack);
  //Start - 地区跟踪
  /**
   * public enum PushMode {
        All = 0,
       Company = 1,
       Device = 2,
       MulitCompany = 3,
       MulitDevice = 4,
       Poly = 9,
       None = 100,
   }
   */
  /**
   * VehicleTrack_bag.setDeviceH(2); //企业Id,运管Id
    VehicleTrack_bag.setFeatureH(0); //多车跟踪、地区跟踪设置为0, 企业跟踪传1
   */
  //End - 地区跟踪
  //Start - 企业跟踪
  // VehicleTrack_bag.setDeviceH(Id); //企业Id,运管Id
  // VehicleTrack_bag.setFeatureH(1); //多车跟踪、地区跟踪设置为0, 企业跟踪传1
  //End - 企业跟踪

  //Start - 单车跟踪
  /**
   * VehicleTrack_bag.setDeviceH(21700); //Target: 多车:0 , 单车- 车辆ID(832)
   VehicleTrack_bag.setFeatureH(2); //Reserve: 多车跟踪 - 4，多车取消跟踪！4，  单车跟踪 - 2 ，单车取消跟踪  - ！2
   */
  //End - 单车跟踪
  //Start - 取消所有跟踪
  // VehicleTrack_bag.setDeviceH(0); //企业Id,运管Id
  // VehicleTrack_bag.setFeatureH(0); //多车跟踪、地区跟踪设置为0
  //End - 取消所有跟踪
  VehicleTrack_bag.setDeviceH(monitorTrackTemp.deviceH); //企业Id,运管Id
  VehicleTrack_bag.setFeatureH(monitorTrackTemp.featureH); //多车跟踪、地区跟踪设置为0
  send(ws, VehicleTrack_bag);
  console.log('开始跟踪车辆信息' + new Date());
  console.log(ws);
  console.log(VehicleTrack_bag);
}
// 注释人：向浩
// 注释时间：2018-08-11
// 注释原因：取消所有跟踪
const cancelMonitorTrack = function (monitorTrackTemp) {
  // 清空vuex里面的状态量
  store.commit('emptyMonitorTrackRslt');
  // 清空缓存里面的值
  ismotorTracked = false;
  monitorTrackTempRslt = [];
  var VehicleTrack_bag = WSData.CreateDataBag(WSData.DataBag.VehicleCancelTrack);
  VehicleTrack_bag.setDeviceH(monitorTrackTemp.deviceH); //企业Id,运管Id
  VehicleTrack_bag.setFeatureH(monitorTrackTemp.featureH); //多车跟踪、地区跟踪设置为0
  send(ws, VehicleTrack_bag);
  console.log('取消跟踪车辆信息' + new Date());
  console.log(ws);
  console.log(VehicleTrack_bag);
}
// 注释人：向浩
// 注释时间：2018-07-12
// 注释原因：绑定实时警情-超速/凌晨2-5报警运行/疲劳驾驶的数据

const bundleOverSpeedAbnormal4Hour = function (superviseItem) {
  const superviseRow = superviseItem.model;
  switch (superviseItem.type) {
    case 'overspeed':
      return {
        sybid: '',
        plate: superviseRow.plate,
        plateColor: superviseRow.plateColor,
        vehicleType: superviseRow.vehicleType,
        vehicleTypeId: superviseRow.vehicleTypeId,
        zoneId: superviseRow.zoneId,
        zoneName: superviseRow.zoneName,
        unitId: superviseRow.unitId,
        unitName: superviseRow.unitName,
        platformID: superviseRow.platformID,
        platformName: superviseRow.platformName,
        alarmTypeName: superviseRow.alarmType,
        alarmId: superviseRow.alarmId, // 该字段需要在督办中使用
        startTime: formatYMD(superviseRow.sDate) + " " + formatHHmmss(superviseRow.sTime),
        endTime: formatYMD(superviseRow.eDate) + " " + formatHHmmss(superviseRow.eTime),
        bAddress: superviseRow.bAddress,

        eAddress: superviseRow.eAddress,
        roadLevel: superviseRow.roadLevel,
        dayType: superviseRow.dayType,
        topSpeed: superviseRow.topSpeed,
        overSpeedRate: superviseRow.overSpeedRate,
        speedLimit: superviseRow.speedLimit,
        levelStr: superviseRow.level,
        // source: superviseRow.source, //目前没有报警数据源字段
        // isSupervise: superviseRow.isSupervise,//目前没有时候督办字段

        eLatitude: superviseRow.eLatitude / 1000000, //单击事件需要使用经度
        eLongtitude: superviseRow.eLongtitude / 1000000, //单击事件需要使用维度
        vehicleId: superviseRow.vehicleId, //双击事件需要使用vehicleId
        sDate: superviseRow.sDate, //开始日期
        eDate: superviseRow.eDate, //结束日期
        sTime: superviseRow.sTime, //开始时间
        eTime: superviseRow.eTime, //结束时间
        // 是否拨打电话字段
        callValue: '',
        // 注释人：向浩
        // 注释时间：2018-08-09
        // 注释原因：根据需求新增两个字段违章状态和企业联系电话
        tel: superviseRow.tel, //企业联系电话
        alarmStatus: superviseRow.alarmStatus, //违章状态
      };
      break;
    case 'abnormalmove':
      return {
        // sybid: superviseRow.sybid,
        sybid: '',
        plate: superviseRow.plate,
        plateColor: superviseRow.plateColor,
        vehicleType: superviseRow.vehicleType,
        vehicleTypeId: superviseRow.vehicleTypeId, //在督办时候需要使用该字段
        zoneId: superviseRow.zoneId, //在督办时候需要使用该字段
        zoneName: superviseRow.zoneName,
        unitId: superviseRow.unitId, //在督办时候需要使用该字段
        unitName: superviseRow.unitName,
        platformName: superviseRow.platformName,
        platformID: superviseRow.platformID, //在督办时候需要使用该字段
        alarmTypeName: superviseRow.alarmType,
        alarmId: superviseRow.alarmId, // 该字段需要在督办中使用
        startTime: formatYMD(superviseRow.sDate) + " " + formatHHmmss(superviseRow.sTime),
        endTime: formatYMD(superviseRow.eDate) + " " + formatHHmmss(superviseRow.eTime),
        bAddress: superviseRow.bAddress,
        eAddress: superviseRow.eAddress,
        topSpeed: superviseRow.topSpeed,
        // source: superviseRow.source, //目前没有报警数据源字段
        // isSupervise: superviseRow.isSupervise,//目前没有时候督办字段
        eLatitude: superviseRow.eLatitude / 1000000, //单击事件需要使用经度
        eLongtitude: superviseRow.eLongtitude / 1000000, //单击事件需要使用维度
        vehicleId: superviseRow.vehicleId, //双击事件需要使用vehicleId
        sDate: superviseRow.sDate, //开始日期
        eDate: superviseRow.eDate, //结束日期
        sTime: superviseRow.sTime, //开始时间
        eTime: superviseRow.eTime, //结束时间
        // 是否拨打电话字段
        callValue: '',
        // 注释人：向浩
        // 注释时间：2018-08-09
        // 注释原因：根据需求新增两个字段违章状态和企业联系电话
        tel: superviseRow.tel, //企业联系电话
        alarmStatus: superviseRow.alarmStatus, //违章状态
      };
      break;
    case 'over4hour':
      return {
        // sybid: superviseRow.sybid,
        sybid: '',
        plate: superviseRow.plate,
        plateColor: superviseRow.plateColor,
        vehicleType: superviseRow.vehicleType,
        vehicleTypeId: superviseRow.vehicleTypeId, //在督办时候需要使用该字段
        zoneId: superviseRow.zoneId, //在督办时候需要使用该字段
        zoneName: superviseRow.zoneName,
        unitId: superviseRow.unitId, //在督办时候需要使用该字段
        unitName: superviseRow.unitName,
        platformName: superviseRow.platformName,
        platformID: superviseRow.platformID, //在督办时候需要使用该字段
        alarmTypeName: superviseRow.alarmType,
        alarmId: superviseRow.alarmId, // 该字段需要在督办中使用
        startTime: formatYMD(superviseRow.sDate) + " " + formatHHmmss(superviseRow.sTime),
        endTime: formatYMD(superviseRow.eDate) + " " + formatHHmmss(superviseRow.eTime),
        bAddress: superviseRow.bAddress,
        eAddress: superviseRow.eAddress,
        // source: superviseRow.source, //目前没有报警数据源字段
        // isSupervise: superviseRow.isSupervise,//目前没有时候督办字段
        eLatitude: superviseRow.eLatitude / 1000000, //单击事件需要使用经度
        eLongtitude: superviseRow.eLongtitude / 1000000, //单击事件需要使用维度
        vehicleId: superviseRow.vehicleId, //双击事件需要使用vehicleId
        sDate: superviseRow.sDate, //开始日期
        eDate: superviseRow.eDate, //结束日期
        sTime: superviseRow.sTime, //开始时间
        eTime: superviseRow.eTime, //结束时间
        // 是否拨打电话字段
        callValue: '',
        // 注释人：向浩
        // 注释时间：2018-08-09
        // 注释原因：根据需求新增两个字段违章状态和企业联系电话
        tel: superviseRow.tel, //企业联系电话
        alarmStatus: superviseRow.alarmStatus, //违章状态
      };
      break;
    default:
  }
}
export {
  initSetupWebSocket,
  getalarm_actual, //webosocket信息
  monitorTrack,
  cancelMonitorTrack,
}