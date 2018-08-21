import axios from 'axios';
import jsonp from 'jsonp';
import {
  commonConfig
} from '@/config/commonConfig';
import qs from 'qs';
import {
  unescape
} from 'querystring';
// import {
//   WSData
// } from '@/common/webSocketUtils/WSData'
// import {
//   streamWriter
// } from '@/common/webSocketUtils/stream-writer'
import {
  store
} from '@/vuex/store'
var isNull = function (value) {
  if (value == null) return true;
  else return false;
}
const isNullUndefEmpty = function (value) {
  if (value === null || value === undefined || value === '')
    return true;
  else return false;
}
// 循环对象然后返回一个数组
let ObjToArray = function (obj) {
  let arrTemp = [];
  for (let item in obj) {
    arrTemp.push(obj[item]);
  }
  return arrTemp;
}
// 两个数组相除以后合并为以为数组
let twoArrayDivide = function (para1, para2) {
  // 包车：CBusInnetCount
  // 旅游客车：TourInnetCount
  // 三类班线：LineInnetCount
  // 危险品：DInnetCount
  // 重货：HeavyInnetCount
  // 半挂牵引车：TractorInnetCount
  let temp = [];
  // 包车、旅游客车
  temp.push(((para1.CBusInnetCount + para1.TourInnetCount) / ((para2.CBusTotalCount || 1) + (para2.TourTotalCount || 1)) * 100).toFixed(2));
  // 三类班线
  temp.push((para1.LineInnetCount / (para2.LineTotalCount || 1) * 100).toFixed(2));
  // 危险品
  temp.push((para1.DInnetCount / (para2.DTotalCount || 1) * 100).toFixed(2));
  // 重货
  temp.push((para1.HeavyInnetCount / (para2.HeavyTotalCount || 1) * 100).toFixed(2));
  return temp
}
// 入网车辆数
let innetCountNumber = function (para1) {
  // 包车：CBusInnetCount
  // 旅游客车：TourInnetCount
  // 三类班线：LineInnetCount
  // 危险品：DInnetCount
  // 重货：HeavyInnetCount
  // 半挂牵引车：TractorInnetCount
  let temp = [];
  // 包车、旅游客车
  temp.push(para1.CBusInnetCount + para1.TourInnetCount);
  // 三类班线
  temp.push(para1.LineInnetCount);
  // 危险品
  temp.push(para1.DInnetCount);
  // 重货
  temp.push(para1.HeavyInnetCount);
  return temp
}
// 规范显示的数据类型
function formatterNumber(num) {
  var str = "",
    fullstop = -1;
  num += "";
  fullstop = num.lastIndexOf(".");
  if (fullstop > 0) {
    str += num.substr(fullstop);
    num = num.substr(0, fullstop);
  }
  if (num.length > 4) {
    var count = Math.ceil(num.length / 4);
    for (var i = 0; i < count; i++) {
      if (i == 0) {
        str = num.substr(num.length - 4) + str;
      } else if (i == count - 1) {
        str = num + "," + str;
      } else {
        str = num.substr(num.length - 4) + "," + str;
      }
      num = num.substr(0, num.length - 4);
    }
  } else {
    str = num + str;
  }

  return str;
}
// 得到昨天到上一个月的昨天
var getFromLastDayToLastMonth = function (datetime) {
  datetime.setDate(datetime.getDate() - 1);
  let month = (datetime.getMonth() + 1) < 10 ? '0' + datetime.getMonth().toString() : datetime.getMonth().toString();
  let day = (datetime.getDate()) < 10 ? '0' + datetime.getDate().toString() : datetime.getDate().toString();
  const endDate = datetime.getFullYear().toString() + month + day;
  datetime.setMonth(datetime.getMonth() - 1);
  month = (datetime.getMonth() + 1) < 10 ? '0' + datetime.getMonth().toString() : datetime.getMonth().toString();
  day = (datetime.getDate()) < 10 ? '0' + datetime.getDate().toString() : datetime.getDate().toString();
  const startDate = datetime.getFullYear().toString() + month + day;
  return {
    startDate,
    endDate
  }
}
// 不满足三位的在前面补零
const setRegulationFormat = function (data) {
  let dataTemp = '';
  if (data < 10) {
    dataTemp = "00" + data;
  } else if (data >= 10 && data < 100) {
    dataTemp = "0" + data;
  } else dataTemp = data.toString();
  return dataTemp;
}
// Home运营机构监管的LED 数字显示
//行业监管
function getDigitsCss(num) {
  let numTemp = parseInt(num);
  switch (numTemp) {
    case 0:
      return "zero";
    case 1:
      return "one";
    case 2:
      return "two";
    case 3:
      return "three";
    case 4:
      return "four";
    case 5:
      return "five";
    case 6:
      return "six";
    case 7:
      return "seven";
    case 8:
      return "eight";
    default:
      return "nine";
  }
}
// 获取字符串的前n个字符
const getShortName = function (name, length) {
  if (name.length > length)
    name = name.substr(0, length);
  return name;
}
// PlatformComponentBottomleft - 获取数组start以后放在一个元素里面
function getSplitData(start, arr) {
  if (arr.length <= start) {
    return arr;
  }
  var reData = [],
    total = 0;
  reData = arr.slice(0, start);
  for (var i = start; i < arr.length; i++) {
    total += parseFloat(arr[i]);
  }
  reData.push(total);

  return reData;
}
// 封装通用地区树
const formSourceData = function (data) {
  const sourceArr = [];
  for (let sourceItem of data) {
    switch (sourceItem.Level) {
      case 1: //一级目录
        sourceArr.push({
          label: sourceItem.ZoneName,
          children: [],
          Id: sourceItem.Id,
          UpZoneId: sourceItem.UpZoneId
        });
        break;
      case 2: //二级目录
        for (let firstLevelItem of sourceArr) {
          if (firstLevelItem.Id === sourceItem.UpZoneId) {
            firstLevelItem.children.push({
              label: sourceItem.ZoneName,
              children: [],
              Id: sourceItem.Id,
              UpZoneId: sourceItem.UpZoneId
            });
          }
        }
        break;
      case 3: //三级目录
        for (let firstLevelItem of sourceArr) {
          for (let secondLevelItem of firstLevelItem.children) {
            if (secondLevelItem.Id === sourceItem.UpZoneId) {
              secondLevelItem.children.push({
                label: sourceItem.ZoneName,
                children: [],
                Id: sourceItem.Id,
                UpZoneId: sourceItem.UpZoneId
              });
            }
          }
        }
        break;
      default:
    }
  }
  return sourceArr;
}
// 封装通用权限配置树（目前基本信息-角色管理-权限配置中使用到）
let formAccessMgmtData = function (data) {
  for (let sourceItem of data) {
    _getChilds(sourceItem);
  }
}
let _getChilds = function (data) {
  if (!isNullUndefEmpty(data.IsSelected)) store.commit('pushChkAccessMgmtceArr', data.MenuId);
  if (data.children.length > 0) formAccessMgmtData(data.children);
}
const storageOperation = {
  // Save data to sessionStorage
  setItem: function (key, value) {
    sessionStorage.setItem(key, value);
  },
  // Get saved data from sessionStorage
  getItem: function (key) {
    return sessionStorage.getItem(key);
  },
  // Remove saved data from sessionStorage
  removeItem: function (key) {
    sessionStorage.removeItem(key);
  },
  // Remove all saved data from sessionStorage
  clear: function () {
    sessionStorage.clear();
  }
}
// 获取上一个月的月份
const getLastMonth = function () {
  var date = new Date().getDate();
  var y = new Date().getFullYear();
  var m = new Date().getMonth() + 1;
  if (m == 1) {
    y = y - 1;
    m = 12
  } else {
    m = m - 1
  }
  if (m < 10) {
    m = "0" + m;
  }
  // return y + "-" + m;
  return y + m;
}
// 获取某年某月的最后一天
function getLastDay(year, month) {
  var new_year = year; //取当前的年份   
  var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）   
  if (month > 12) //如果当前大于12月，则年份转到下一年   
  {
    new_month -= 12; //月份减   
    new_year++; //年份增   
  }
  var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天   
  return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期      
}
const axiosRequest = {
  axiosPost: function (postObj) {
    // let postInfo = new URLSearchParams();
    // for (var paramKey in postObj.params) {
    //   postInfo.append(paramKey, postObj.params[paramKey]);
    // }
    return new Promise((resolve, reject) => {
      //   axios.defaults.headers['token'] = 'fdsfadsfPerryXiang1';
      const token = storageOperation.getItem(commonConfig.Token) || '';
      const ctrlId = storageOperation.getItem(commonConfig.ctrlId) || '';
      axios.post(postObj.postUrl, qs.stringify(postObj.params), {
          headers: {
            'accept': 'application/json',
            // 'accept-language': 'en_US',
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Access-Control-Allow-Headers': 'token,Access-Control-Allow-Headers'
            // 'token': 'fdsfadsfPerryXiang2'
            'token': token, //Access-Control-Allow-Headers: Content-Type(后台需要在web.config里面添加允许的头部字段)
            'ctrlId': ctrlId
          }
        }).then(response => { //then 请求成功之后进行什么操作
          resolve(response); //把请求到的数据发到引用请求的地方
        })
        .catch(error => {
          console.log('请求异常信息：' + error);
          reject(error);
        });
    });
  },
  axiosGet: function (getUrl, params) {
    // let postInfo = new URLSearchParams();
    // for (var paramKey in postObj.params) {
    //   postInfo.append(paramKey, postObj.params[paramKey]);
    // }
    return new Promise((resolve, reject) => {
      //   axios.defaults.headers['token'] = 'fdsfadsfPerryXiang1';
      const token = storageOperation.getItem(commonConfig.Token) || '';
      const ctrlId = storageOperation.getItem(commonConfig.ctrlId) || '';
      axios.get(getUrl, {
          params: params,
          headers: {
            'accept': 'application/json',
            // 'accept-language': 'en_US',
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Access-Control-Allow-Headers': 'token,Access-Control-Allow-Headers'
            // 'token': 'fdsfadsfPerryXiang2'
            'token': token, //Access-Control-Allow-Headers: Content-Type(后台需要在web.config里面添加允许的头部字段)
            'ctrlId': ctrlId
          }
        }).then(response => { //then 请求成功之后进行什么操作
          resolve(response); //把请求到的数据发到引用请求的地方
        })
        .catch(error => {
          console.log('请求异常信息：' + error);
          reject(error);
        });
    });
  }
}
// 网络请求的错误处理
const handleErrorMsg = function (error) {
  console.log(error)
  switch (error.response.status) {
    case 0:
      return '错误码：0，错误信息：服务器错误'
    case 400:
      return '错误码：400，错误信息：请求无效'
    case 401:
      return error.response.data.Message;
    case 403:
      return '错误码：403，错误信息：禁止访问'
    case 404:
      return '错误码：404，错误信息：未找到页面'
    case 405:
      return '错误码：405，错误信息：方法不允许'
    case 406:
      return '错误码：406，错误信息：不可接受'
    case 408:
      return '错误码：408，错误信息：请求超时'
    case 410:
      return '错误码：410，错误信息：所请求的资源在服务器端永久不存在'
    case 413:
      return '错误码：413，错误信息：请求实体太大'
    case 414:
      return '错误码：414，错误信息：请求的URL太长'
    case 500:
      return '错误码：500，错误信息：Web服务器无法执行该请求'
    case 501:
      return '错误码：501，错误信息：由于服务器临时性超载或维护，服务器当前无法处理该请求'
    case 502:
      return '错误码：502，错误信息：为了完成该请求，该服务器访问上游服务器但收到无效响应'
    default:
      return '对不起，目前服务端出现异常，请联系管理员进行处理（未知类型错误）'
  }
}
// 注释人：向浩
// 注释时间：2018-06-27
// 注释原因：摘自网络上的日期格式扩展（http://liuxiang.github.io/2016/04/01/javaScript%20%E6%97%B6%E9%97%B4%E6%A0%BC%E5%BC%8F%E5%8C%96yyyy-mm-dd/）
Date.prototype.format = function (format) {
  var o = {
    'M+': this.getMonth() + 1, //month
    'd+': this.getDate(), //day
    'h+': this.getHours(), //hour
    'm+': this.getMinutes(), //minute
    's+': this.getSeconds(), //second
    'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
    'S': this.getMilliseconds() //millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ?
        o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return format;
}

//组装时分秒为规定的格式
let formatHHmmss = function (formathhmmssVal) {
  let hhmmssObj = {
    hour: '',
    minute: '',
    seconds: '',
  }
  hhmmssObj.hour = Math.floor(formathhmmssVal / 3600);
  hhmmssObj.minute = Math.floor((formathhmmssVal - hhmmssObj.hour * 3600) / 60);
  hhmmssObj.seconds = formathhmmssVal - hhmmssObj.hour * 3600 - hhmmssObj.minute * 60;

  if (hhmmssObj.hour < 10) hhmmssObj.hour = "0" + hhmmssObj.hour;
  if (hhmmssObj.minute < 10) hhmmssObj.minute = "0" + hhmmssObj.minute;
  if (hhmmssObj.seconds < 10) hhmmssObj.seconds = "0" + hhmmssObj.seconds;

  return hhmmssObj.hour + ":" + hhmmssObj.minute + ":" + hhmmssObj.seconds;
}
// 将yyyyMMdd转换为yyyy-MM-dd
let formatYMD = function (formatYMDVal) {
  return formatYMDVal.toString().substr(0, 4) + "-" + formatYMDVal.toString().substr(4, 2) + "-" + formatYMDVal.toString().substr(6, 2);
}
// 将百分数转换为小数
function toPoint(percent) {
  var str = percent.replace("%", "");
  str = (str / 100).toFixed(2);
  return str;
}
export {
  isNull,
  isNullUndefEmpty,
  axiosRequest,
  storageOperation,
  ObjToArray,
  twoArrayDivide,
  innetCountNumber,
  formatterNumber,
  getFromLastDayToLastMonth,
  setRegulationFormat,
  getDigitsCss,
  getShortName,
  getSplitData,
  formSourceData,
  formAccessMgmtData,
  getLastMonth,
  getLastDay,
  handleErrorMsg,
  toPoint,
  formatYMD,
  formatHHmmss,
}
