webpackJsonp([29],{Brx4:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var r=t("BO1k"),n=t.n(r),l=t("lP3S"),i=t("F+jZ"),c=t("L2rX"),d=t("KXKr"),o={name:"CompanyCheckRank",components:{MultiLevelTableComponent:l.a},data:function(){return{activeName:"report_alarmpush_alarmpush_table",activeNameIndex:0,curNameIndex:0,getTerminalAlarmRemindUrl:c.b.rootUrl+c.b.ReportAPI.GetTerminalAlarmRemind,exportTerminalAlarmRemindUrl:c.b.rootUrl+c.b.ReportAPI.ExportTerminalAlarmRemind,columnType:{text:"text",router_link:"router_link"},zoneCheckSourceData:[],countData:[],tabNameObj:{firTab:{tabLabel:"终端警情提醒统计",tabName:"report_alarmpush_alarmpush_table",nType:1,ctrlId:"tjfx_jqtstj_jqtstj"}},tabCtntList:[],isDisabled:!1}},methods:{handleClickSearch:function(e){var a=this;a.curNameIndex=a.activeNameIndex,i.q.setItem(c.b.ctrlId,e.ctrlId);var t=a.formPageParams(e.searchCreteria,e.currentPage,e.activeName,e.isSplitPage);a.tabCtntList[a.curNameIndex].loading=!0,a.alarmPushSourceData=[],i.a.axiosGet(this.getTerminalAlarmRemindUrl,t).then(function(t){a.isDisabled=!1;var r=t.data.DetailList,l=!0,c=!1,d=void 0;try{for(var o,m=n()(r);!(l=(o=m.next()).done);l=!0){var s=o.value;a.alarmPushSourceData.push(a.pushSourceData(s,e.activeName,"DetailList"))}}catch(e){c=!0,d=e}finally{try{!l&&m.return&&m.return()}finally{if(c)throw d}}a.tabCtntList[a.curNameIndex].TabCtnt=a.alarmPushSourceData,a.tabCtntList[a.curNameIndex].total=t.data.CountTotal,a.tabCtntList[a.curNameIndex].loading=!1,a.tabCtntList[a.curNameIndex].btnEvents[1].isDisabled=!1,Object(i.o)(t.data.TotalList)||a.tabCtntList[a.curNameIndex].TabCtnt.push(a.pushSourceData(t.data.TotalList,e.activeName,"TotalList"))}).catch(function(e){a.$message({type:"warning",message:Object(i.l)(e)}),a.tabCtntList[a.curNameIndex].loading=!1})},pushSourceData:function(e,a,t){switch(a){case this.tabNameObj.firTab.tabName:return{sybid:e.sybid,LicensePlat:e.LicensePlat,PlateColor:e.PlateColor,VehicleType:e.VehicleType,ZoneName:e.ZoneName,UnitName:e.UnitName,PlatformName:e.PlatformName,AlarmType:e.AlarmType,RemindDate:e.RemindDate,RemindContext:e.RemindContext,RemindState:e.RemindState}}},handleClickExpData:function(e){var a=this;a.curNameIndex=a.activeNameIndex,i.q.setItem(c.b.ctrlId,e.ctrlId);var t=a.formPageParams(e.searchCreteria,e.currentPage,e.activeName,e.isSplitPage);a.tabCtntList[a.curNameIndex].loading=!0,i.a.axiosGet(this.exportTerminalAlarmRemindUrl,t).then(function(e){a.isDisabled=!1,a.downloadServerFile(decodeURIComponent(e.data)),a.tabCtntList[a.curNameIndex].loading=!1}).catch(function(e){a.$message({type:"warning",message:Object(i.l)(e)}),a.tabCtntList[a.curNameIndex].loading=!1})},formPageParams:function(e,a,t,r){var l=0,i="",d="",o="",m="",s="",u="",h=0,b="",p=!0,y=!1,I=void 0;try{for(var v,N=n()(this.tabCtntList);!(p=(v=N.next()).done);p=!0){var T=v.value;T.tabName===t&&(this.activeNameIndex=T.indexNumber,l=T.nType)}}catch(e){y=!0,I=e}finally{try{!p&&N.return&&N.return()}finally{if(y)throw I}}var x=!0,f=!1,C=void 0;try{for(var g,P=n()(e);!(x=(g=P.next()).done);x=!0){var k=g.value;switch(k.labelId){case c.d.VehicleId:i=k.compId;break;case c.d.ZoneId:d=k.compId;break;case c.d.UnitId:o=k.compId;break;case c.d.PlatformId:m=k.compId;break;case c.d.fromTodatePicker:s=k.compVal[0],u=k.compVal[1];break;case c.d.CarType:h=k.compVal;break;case c.d.AlarmType:b=k.compVal}}}catch(e){f=!0,C=e}finally{try{!x&&P.return&&P.return()}finally{if(f)throw C}}return{nType:l,vehicleId:i,zoneId:d,unitId:o,platformId:m,beginDate:s,endDate:u,carType:h,alarmType:b,pageSize:10,pageIndex:a,isSplitPage:r,readPage:""}},handleCurrentChange:function(e){this.handleClickSearch(e)},downloadServerFile:function(e){var a=document.createElement("a");a.href=e,a.click()},loadAccess:function(){var e=JSON.parse(i.q.getItem("accessList")),a=[{tabLabel:this.tabNameObj.firTab.tabLabel,tabName:this.tabNameObj.firTab.tabName,ctrlId:this.tabNameObj.firTab.ctrlId,indexNumber:"",nType:this.tabNameObj.firTab.nType,currentPage:1,total:0,loading:!1,btnEvents:[{iconName:"el-icon-search",btnId:"search",btnName:"查询",isDisabled:!1,ctrlId:"tjfx_jqtstj_jqtstj_cx"},{iconName:"el-icon-download",btnId:"export_data",btnName:"导出数据",isDisabled:!0,ctrlId:"tjfx_jqtstj_jqtstj_dc"}],searchCreteria:[{searchType:"input",labelName:"车牌号",labelId:c.d.VehicleId,compVal:"",compId:""},{searchType:"input",labelName:"所属地区",labelId:c.d.ZoneId,compVal:c.c.provinceName,compId:c.c.provinceId},{searchType:"input",labelName:"运输企业",labelId:c.d.UnitId,compVal:"",compId:""},{searchType:"input",labelName:"接入平台",labelId:c.d.PlatformId,compVal:"",compId:""},{searchType:"fromTodatePicker",labelName:"时间起 - 时间至",labelId:c.d.fromTodatePicker,compVal:[((new Date).format("yyyyMMdd")-1).toString(),((new Date).format("yyyyMMdd")-1).toString()]},{searchType:"treeCheckbox",labelName:"车辆类型",labelId:c.d.CarType,compVal:"",treeOps:c.a,treeChkboxProps:{label:"label",chidlren:"children"}},{searchType:"select",labelName:"报警类型",labelId:c.d.AlarmType,compVal:0,options:[{value:0,label:"全部"},{value:1,label:"超速"},{value:2,label:"凌晨2-5报警运行"},{value:3,label:"疲劳驾驶"}]}],tabHeader:[{headerKey:"sybid",headerVal:"序号",subHeaders:[],columnType:this.columnType.text},{headerKey:"LicensePlat",headerVal:"车牌号",subHeaders:[],columnType:this.columnType.text},{headerKey:"PlateColor",headerVal:"车牌颜色",subHeaders:[],columnType:this.columnType.text},{headerKey:"VehicleType",headerVal:"车辆类型",subHeaders:[],columnType:this.columnType.text},{headerKey:"ZoneName",headerVal:"所属地区",subHeaders:[],columnType:this.columnType.text},{headerKey:"UnitName",headerVal:"所属企业",subHeaders:[],columnType:this.columnType.text},{headerKey:"PlatformName",headerVal:"所属接入平台",subHeaders:[],columnType:this.columnType.text},{headerKey:"AlarmType",headerVal:"报警类型",subHeaders:[],columnType:this.columnType.text},{headerKey:"RemindDate",headerVal:"提示时间",subHeaders:[],columnType:this.columnType.text},{headerKey:"RemindState",headerVal:"发送状态",subHeaders:[],columnType:this.columnType.text}],TabCtnt:[]}],t=0,r=!0,l=!1,o=void 0;try{for(var m,s=n()(a);!(r=(m=s.next()).done);r=!0){var u=m.value;Object(d.a)(u.ctrlId,e)&&(u.indexNumber=t,this.tabCtntList.push(u),t++)}}catch(e){l=!0,o=e}finally{try{!r&&s.return&&s.return()}finally{if(l)throw o}}},handleCurActiveIndex:function(e){this.activeNameIndex=e}},created:function(){this.loadAccess()},beforeMount:function(){var e=JSON.parse(i.q.getItem("breadNavs"));this.$emit("viewIn",e)}},m={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"CompanyCheckRank"},[t("multi-level-table-component",{staticClass:"zone-check-multilevel",attrs:{activeName:e.activeName,tabCtntList:e.tabCtntList},on:{handleClickSearch:e.handleClickSearch,handleClickExpData:e.handleClickExpData,handleCurrentChange:e.handleCurrentChange,handleCurActiveIndex:e.handleCurActiveIndex}}),e._v(" "),t("p",{directives:[{name:"show",rawName:"v-show",value:0==e.activeNameIndex||1==e.activeNameIndex|2==e.activeNameIndex,expression:"activeNameIndex == 0 || activeNameIndex == 1 | activeNameIndex == 2"}],staticClass:"check-footer-p"},[e._v("\n    说明: 1.查询日期值得是警情提示时间\n          2.数据库之前应该有记录先终端发送警情提醒\n  ")])],1)},staticRenderFns:[]};var s=t("VU/8")(o,m,!1,function(e){t("MSeU")},null,null);a.default=s.exports},MSeU:function(e,a){}});
//# sourceMappingURL=AlarmPush.3362f3ee26776a79f334.js.map