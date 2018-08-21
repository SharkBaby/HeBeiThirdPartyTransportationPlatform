import Vue from 'vue'
import Vuex from 'vuex'
import {
  formatYMD,
  formatHHmmss
} from "@/common/common";
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    superviseRslt: {
      overspeed: [], //超速
      abnormalmove: [], //凌晨2-5报警运行
      over4hour: [], //疲劳驾驶
    },
    // 下面的三个长度信息之所以没有放在上面的对象里面是因为vue监测不到对象的变化，无法触发watch实现监控更新
    overspeedLength: 0, //超速长度
    abnormalmoveLength: 0, //凌晨2-5报警运行长度
    over4hourLength: 0, //疲劳驾驶长度
    // 将用户角色权限管理信息放置在vuex中，便于多个页面进行访问
    usrAccessManagement: '',
    // 每一种角色默认勾选的权限，在common.js中需要将最新的值存放在vuex中，然后在基本信息-角色管理中使用
    chkAccessMgmtceArr: [],
    // 注释人：向浩
    // 注释时间：2018-08-11
    // 注释原因：将websocket传输过来的车辆监管-跟踪的数据存放在vuex中
    monitorTrackRslt: [],
  },
  mutations: { //根据Redux理论规定，需要通过mutations来commit
    //超速
    pushSuperviseRslt(state, newSuperviseRslt) {
      let isExisted = false; //设置初始状态为不存在
      for (let overSpeedItem of state.superviseRslt.overspeed) {
        if (overSpeedItem.alarmId === newSuperviseRslt.alarmId) {
          overSpeedItem.sDate = newSuperviseRslt.sDate, //开始日期
          overSpeedItem.eDate = newSuperviseRslt.eDate, //结束日期
          overSpeedItem.sTime = newSuperviseRslt.sTime, //开始时间
          overSpeedItem.eTime = newSuperviseRslt.eTime, //结束时间
          overSpeedItem.startTime = formatYMD(newSuperviseRslt.sDate) + " " + formatHHmmss(newSuperviseRslt.sTime),
          overSpeedItem.endTime = formatYMD(newSuperviseRslt.eDate) + " " + formatHHmmss(newSuperviseRslt.eTime),
          overSpeedItem.bAddress = newSuperviseRslt.bAddress,
          overSpeedItem.eAddress = newSuperviseRslt.eAddress,
          overSpeedItem.topSpeed = newSuperviseRslt.topSpeed,
          overSpeedItem.overSpeedRate = newSuperviseRslt.overSpeedRate,
          overSpeedItem.alarmStatus = newSuperviseRslt.alarmStatus, //违章状态
          isExisted = true;
        }
      }
      if (!isExisted) {
        state.superviseRslt.overspeed.push(newSuperviseRslt);
        state.overspeedLength++;
      }
    },
    // 在实时报警页面点击督办按钮成功后，会将此条数据移除掉
    deleteSuperviseRslt(state, alarmId){
      const overSpeedRslt = state.superviseRslt.overspeed;
      for (let overSpeedIndex in overSpeedRslt) {
        if (overSpeedRslt[overSpeedIndex].alarmId === alarmId) {
          state.superviseRslt.overspeed.splice(overSpeedIndex,1) //删除选中的数据行
          state.overspeedLength--;
        }
      }
    },
    //凌晨2-5报警运行
    pushSuperviseRsltAM(state, newSuperviseRsltAM) {
      let isExisted = false; //设置初始状态为不存在
      for (let abnormalMoveItem of state.superviseRslt.abnormalmove) {
        if (abnormalMoveItem.alarmId === newSuperviseRsltAM.alarmId) {
            abnormalMoveItem.sDate = newSuperviseRsltAM.sDate, //开始日期
            abnormalMoveItem.eDate = newSuperviseRsltAM.eDate, //结束日期
            abnormalMoveItem.sTime = newSuperviseRsltAM.sTime, //开始时间
            abnormalMoveItem.eTime = newSuperviseRsltAM.eTime, //结束时间
            abnormalMoveItem.startTime = formatYMD(newSuperviseRsltAM.sDate) + " " + formatHHmmss(newSuperviseRsltAM.sTime),
            abnormalMoveItem.endTime = formatYMD(newSuperviseRsltAM.eDate) + " " + formatHHmmss(newSuperviseRsltAM.eTime),
            abnormalMoveItem.bAddress = newSuperviseRsltAM.bAddress,
            abnormalMoveItem.eAddress = newSuperviseRsltAM.eAddress,
            abnormalMoveItem.topSpeed = newSuperviseRsltAM.topSpeed,
            abnormalMoveItem.alarmStatus = newSuperviseRsltAM.alarmStatus, //违章状态
            isExisted = true;
        }
      }
      if (!isExisted) {
        state.superviseRslt.abnormalmove.push(newSuperviseRsltAM);
        state.abnormalmoveLength++;
      }
    },
    // 在实时报警页面点击督办按钮成功后，会将此条数据移除掉
    deleteSuperviseRsltAM(state, alarmId) {
      const abnormalMoveRslt = state.superviseRslt.abnormalmove;
      for (let abnormalMoveIndex in abnormalMoveRslt) {
        if (abnormalMoveRslt[abnormalMoveIndex].alarmId === alarmId) {
          state.superviseRslt.abnormalmove.splice(abnormalMoveIndex, 1) //删除选中的数据行
          state.abnormalmoveLength--;
        }
      }
    },
    //疲劳驾驶
    pushSuperviseRsltOH(state, newSuperviseRsltAOH) {
      let isExisted = false; //设置初始状态为不存在
      for (let over4hourItem of state.superviseRslt.over4hour) {
        if (over4hourItem.alarmId === newSuperviseRsltAOH.alarmId) {
            over4hourItem.sDate = newSuperviseRsltAOH.sDate, //开始日期
            over4hourItem.eDate = newSuperviseRsltAOH.eDate, //结束日期
            over4hourItem.sTime = newSuperviseRsltAOH.sTime, //开始时间
            over4hourItem.eTime = newSuperviseRsltAOH.eTime, //结束时间
            over4hourItem.startTime = formatYMD(newSuperviseRsltAOH.sDate) + " " + formatHHmmss(newSuperviseRsltAOH.sTime),
            over4hourItem.endTime = formatYMD(newSuperviseRsltAOH.eDate) + " " + formatHHmmss(newSuperviseRsltAOH.eTime),
            over4hourItem.bAddress = newSuperviseRsltAOH.bAddress,
            over4hourItem.eAddress = newSuperviseRsltAOH.eAddress,
            over4hourItem.alarmStatus = newSuperviseRsltAOH.alarmStatus, //违章状态
            isExisted = true;
        }
      }
      if (!isExisted) {
        state.superviseRslt.over4hour.push(newSuperviseRsltAOH);
        state.over4hourLength++;
      }
    },
    // 在实时报警页面点击督办按钮成功后，会将此条数据移除掉
    deleteSuperviseRsltOH(state, alarmId) {
      const over4hourRslt = state.superviseRslt.over4hour;
      for (let over4hourIndex in over4hourRslt) {
        if (over4hourRslt[over4hourIndex].alarmId === alarmId) {
          state.superviseRslt.over4hour.splice(over4hourIndex, 1) //删除选中的数据行
          state.over4hourLength--;
        }
      }
    },
    updateUsrAccessManagement(state, newUsrAccessManagement) {
      state.usrAccessManagement = newUsrAccessManagement;
    },
    pushChkAccessMgmtceArr(state, newChkAccessMgmtceArr) {
      state.chkAccessMgmtceArr.push(newChkAccessMgmtceArr);
    },
    updateChkAccessMgmtceArr(state, newChkAccessMgmtceArr) {
      state.chkAccessMgmtceArr = newChkAccessMgmtceArr;
    },
    // 更新车辆跟踪的最新定位
    updateMonitorTrackRslt(state, newMonitorTrackRslt) {
      // 不管单车或者多车都需要进行处理
      let isExisted = false;
      for (let monitorTrackItem of state.monitorTrackRslt) {
        if (monitorTrackItem[0].model.DevideID === newMonitorTrackRslt[0].model.DevideID) { //已经存在的车辆
          monitorTrackItem[0].model.PlateNum = newMonitorTrackRslt[0].model.PlateNum; //更新纬度
          monitorTrackItem[0].model.PlateColor = newMonitorTrackRslt[0].model.PlateColor; //更新经度
          monitorTrackItem[0].model.UnitName = newMonitorTrackRslt[0].model.UnitName;
          monitorTrackItem[0].model.Longitude = newMonitorTrackRslt[0].model.Longitude;
          monitorTrackItem[0].model.Latitude = newMonitorTrackRslt[0].model.Latitude;
          monitorTrackItem[0].model.GPSDate = newMonitorTrackRslt[0].model.GPSDate;
          monitorTrackItem[0].model.GPSTime = newMonitorTrackRslt[0].model.GPSTime;
          monitorTrackItem[0].model.RecvDate = newMonitorTrackRslt[0].model.RecvDate;
          monitorTrackItem[0].model.RecvTime = newMonitorTrackRslt[0].model.RecvTime;
          monitorTrackItem[0].model.Speed = newMonitorTrackRslt[0].model.Speed;
          monitorTrackItem[0].model.SpeedLimit = newMonitorTrackRslt[0].model.SpeedLimit;
          monitorTrackItem[0].model.Address = newMonitorTrackRslt[0].model.Address;
          isExisted = true;
          break;
        }
      }
      if (!isExisted) { //不存在的话就需要新添加
        state.monitorTrackRslt.push(newMonitorTrackRslt);
      }
    },
    // 清空车辆跟踪的定位信息
    emptyMonitorTrackRslt(state) {
      state.monitorTrackRslt = [];
    }
  },
  getters: {
    overspeedLength: state => {
      return state.superviseRslt.overspeed.length;
    },
    abnormalmoveLength: state => {
      return state.superviseRslt.abnormalmove.length;
    },
    over4hourLength: state => {
      return state.superviseRslt.over4hour.length;
    },
    allLengths: state => {
      return state.superviseRslt.overspeed.length + state.superviseRslt.abnormalmove.length + state.superviseRslt.over4hour.length;
    }
  }
});
export {
  store
}
