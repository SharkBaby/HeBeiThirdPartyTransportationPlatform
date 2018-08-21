webpackJsonp([21],{QPrZ:function(t,e){},RE51:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var l=a("BO1k"),i=a.n(l),n=a("bOdI"),r=a.n(n),o=a("ZBWu"),c=a("7GoO"),h=a("Tc9D"),s=a("F+jZ"),u=a("L2rX"),m={name:"VehicleDistribution",components:{PieComponent:o.a,SecurityCtntMap:c.a,SingleChkboxComponent:h.a},data:function(){var t;return{getVehicleSpreadDataUrl:u.b.rootUrl+u.b.VehicleDistributionAPI.GetVehicleSpreadData,getVehicleListUrl:u.b.rootUrl+u.b.VehicleDistributionAPI.GetVehicleList,getGetVehicleDetailUrl:u.b.rootUrl+u.b.VehicleDistributionAPI.GetVehicleDetail,getAutoDataListUrl:u.b.rootUrl+u.b.GetAutoDataList,pieRslt:[],mapType:"河北",mapData:[],sourceData:[],allVehicleData:[],vhcleRslt:[{labelName:"包车客车",keyVal:["CBusTotalCount"],compVal:!0},{labelName:"旅游客车",keyVal:["TourTotalCount"],compVal:!0},{labelName:"三类以上班线客车",keyVal:["LineTotalCount"],compVal:!0},{labelName:"危险品车",keyVal:["DTotalCount"],compVal:!0},{labelName:"重货、半挂牵引车",keyVal:["HeavyTotalCount","TractorTotalCount"],compVal:!0}],VehicleAllCnt:0,tabCtnt:[],impVehicles:{operationStyle:"",detailStyle:"hide-important-part",inputCtnt:{inputName:"",vehicleId:""},preSearchItems:[],impItems:[],impVhcleDetail:(t={LicensePlat:"",PlateColor:"",VehicleType:""},r()(t,"VehicleType",""),r()(t,"UnitName",""),r()(t,"LogicUnitName",""),r()(t,"ProviderName",""),t)}}},computed:{pieEcharts:function(){return{routerLink:"",titleName:this.pieRslt.titleName,titleX:"50%",titleY:"center",idName:"platform-top-left",color:["#f8143a","#8effff","#3882ec","#0056c0","#F18F51"],data:[],legendOrient:"horizontal",legendX:"center",legendY:"top",seriesRadius:["45%","70%"],seriesName:"车辆分布",seriesdata:this.pieRslt.seriesdata}},mapItem:function(){return{chart_map:{data:this.mapData},seriesData:[{name:"车辆分布",type:"map",mapType:"河北",mapLocation:{y:"20"},itemStyle:{normal:{label:{show:!0,textStyle:{color:"#FFF",fontFamily:"Microsoft YaHei"},formatter:"{b}"},areaColor:"rgb(43,61,78)",borderColor:"rgb(228,230,231)",borderWidth:.5,areaStyle:{color:"rgb(43,61,78)"}},emphasis:{label:{show:!0,textStyle:{color:"#2FFFFF",fontFamily:"Microsoft YaHei"}},color:"#1A2C36",areaColor:"rgb(26,44,54)",borderColor:"#FFF",borderWidth:1}},hoverable:!0,data:this.sourceData}],mapType:"VehicleDistibution",allVehicleData:this.allVehicleData}},tabCtntList:function(){return{tabHeader:{ZName:"地区",Rate:"入网车辆占全省车辆比重",VhcleCount:"车辆总数"},TabCtnt:this.tabCtnt}}},mounted:function(){this.initVehicleDistribution()},methods:{initVehicleDistribution:function(){s.q.setItem(u.b.ctrlId,"home_clfb_qbcl");var t=this;s.a.axiosGet(this.getVehicleSpreadDataUrl,{zoneId:0,vehicleType:0}).then(function(e){t.allVehicleData=e.data;var a=[],l=!0,n=!1,r=void 0;try{for(var o,c=i()(e.data);!(l=(o=c.next()).done);l=!0){var h=o.value;a.push({name:h.ZoneName,value:h.VehicleCnt})}}catch(t){n=!0,r=t}finally{try{!l&&c.return&&c.return()}finally{if(n)throw r}}t.sourceData=a,0!==e.data[0].VehicleCnt&&(t.VehicleAllCnt=e.data[0].VehicleCnt);var s=!0,u=!1,m=void 0;try{for(var p,d=i()(e.data);!(s=(p=d.next()).done);s=!0){var C=p.value;t.mapData.push({name:C.ZoneName,value:C.VehicleCnt}),t.tabCtnt.push({ZName:C.ZoneName,Rate:0==t.VehicleAllCnt?"0.00":(C.VehicleCnt/t.VehicleAllCnt*100).toFixed(2)+"%",VhcleCount:C.VehicleCnt,CurrnetVhcleCount:C.VehicleCnt,CBusTotalCount:C.CBusTotalCount,TourTotalCount:C.TourTotalCount,LineTotalCount:C.LineTotalCount,DTotalCount:C.DTotalCount,HeavyTotalCount:C.HeavyTotalCount,TractorTotalCount:C.TractorTotalCount})}}catch(t){u=!0,m=t}finally{try{!s&&d.return&&d.return()}finally{if(u)throw m}}}).catch(function(t){})},handleVhcleLeft:function(t){this.pieRslt=t},handleVhcleRight:function(t){this.tabCtnt=t,this.VehicleAllCnt=this.tabCtnt[0].VhcleCount},handleVhcleType:function(t){if(this.vhcleRslt[t].compVal){var e=!0,a=!1,l=void 0;try{for(var n,r=i()(this.vhcleRslt[t].keyVal);!(e=(n=r.next()).done);e=!0){var o=n.value;this.VehicleAllCnt+=this.tabCtnt[0][o]}}catch(t){a=!0,l=t}finally{try{!e&&r.return&&r.return()}finally{if(a)throw l}}for(var c in this.tabCtnt){var h=0,s=!0,u=!1,m=void 0;try{for(var p,d=i()(this.vhcleRslt[t].keyVal);!(s=(p=d.next()).done);s=!0){var C=p.value;h+=this.tabCtnt[c][C]}}catch(t){u=!0,m=t}finally{try{!s&&d.return&&d.return()}finally{if(u)throw m}}this.tabCtnt[c].CurrnetVhcleCount=this.tabCtnt[c].CurrnetVhcleCount+h,this.tabCtnt[c].Rate=0==this.VehicleAllCnt?"0.00":(this.tabCtnt[c].CurrnetVhcleCount/this.VehicleAllCnt*100).toFixed(2)+"%"}}else{var V=!0,b=!1,f=void 0;try{for(var v,y=i()(this.vhcleRslt[t].keyVal);!(V=(v=y.next()).done);V=!0){var T=v.value;this.VehicleAllCnt-=this.tabCtnt[0][T]}}catch(t){b=!0,f=t}finally{try{!V&&y.return&&y.return()}finally{if(b)throw f}}for(var g in this.tabCtnt){var D=0,I=!0,x=!1,N=void 0;try{for(var L,S=i()(this.vhcleRslt[t].keyVal);!(I=(L=S.next()).done);I=!0){var k=L.value;D+=this.tabCtnt[g][k]}}catch(t){x=!0,N=t}finally{try{!I&&S.return&&S.return()}finally{if(x)throw N}}this.tabCtnt[g].CurrnetVhcleCount=this.tabCtnt[g].CurrnetVhcleCount-D,this.tabCtnt[g].Rate=0==this.VehicleAllCnt?"0.00":(this.tabCtnt[g].CurrnetVhcleCount/this.VehicleAllCnt*100).toFixed(2)+"%"}}},handleTabClick:function(t,e){1==t.index&&this.GetVehicleList()},GetVehicleList:function(){var t=this;s.q.setItem(u.b.ctrlId,"home_clfb_zdcl"),t.impVehicles.impItems=[],s.a.axiosGet(this.getVehicleListUrl,{zoneId:0,vehicleId:0}).then(function(e){var a=!0,l=!1,n=void 0;try{for(var r,o=i()(e.data);!(a=(r=o.next()).done);a=!0){var c=r.value;t.impVehicles.impItems.push({name:c.LicensePlat,VehicleID:c.DeviceID})}}catch(t){l=!0,n=t}finally{try{!a&&o.return&&o.return()}finally{if(l)throw n}}}).catch(function(e){t.$message({type:"warning",message:Object(s.l)(e)})})},handleImpClick:function(t){var e=this;s.q.setItem(u.b.ctrlId,""),e.impVehicles.operationStyle="hide-important-part",e.impVehicles.detailStyle="",s.a.axiosGet(this.getGetVehicleDetailUrl,{VehicleID:t}).then(function(t){var a=t.data;e.impVehicles.impVhcleDetail={LicensePlat:a.LicensePlat,PlateColor:a.PlateColor,VehicleType:a.VehicleType,UnitName:a.UnitName,LogicUnitName:a.LogicUnitName,ProviderName:a.ProviderName}}).catch(function(t){})},handleReturn:function(){this.impVehicles.operationStyle="",this.impVehicles.detailStyle="hide-important-part"},handleSynchronous:function(){this.$message({message:"服务未连接成功，此功能无法使用（注：重构项目中此功能还未开发）",type:"warning"})},changePreSearch:function(t){var e=this;s.q.setItem(u.b.ctrlId,""),this.impVehicles.preSearchItems=[],s.a.axiosGet(this.getAutoDataListUrl,{type:3,text:t.toString(),zoneId:0,queryType:0}).then(function(t){var a=!0,l=!1,n=void 0;try{for(var r,o=i()(t.data);!(a=(r=o.next()).done);a=!0){var c=r.value;e.impVehicles.preSearchItems.push({Name:c.Name,Value:c.Value})}}catch(t){l=!0,n=t}finally{try{!a&&o.return&&o.return()}finally{if(l)throw n}}}).catch(function(t){})},handlePreSearchSelect:function(t,e){this.impVehicles.preSearchItems=[],this.impVehicles.inputCtnt.inputName=e,this.impVehicles.inputCtnt.vehicleId=t},handleSearch:function(t){this.handleImpClick(t)}},created:function(){var t=JSON.parse(s.q.getItem("breadNavs"));this.$emit("viewIn",t)}},p={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-row",{staticClass:"vehicleDistribution"},[a("el-col",{staticClass:"vehicle-col-left",attrs:{xs:24,sm:12,md:4,lg:4,xl:4}},[a("el-row",{staticClass:"vehicle-col-left-pie"},[a("pie-component",{attrs:{pieEcharts:t.pieEcharts}})],1)],1),t._v(" "),a("el-col",{staticClass:"vehicle-col-center",attrs:{xs:24,sm:12,md:9,lg:9,xl:9}},[a("security-ctnt-map",{attrs:{mapType:t.mapType,mapItem:t.mapItem},on:{handleVhcleLeft:t.handleVhcleLeft,handleVhcleRight:t.handleVhcleRight}})],1),t._v(" "),a("el-col",{staticClass:"vehicle-col-right",attrs:{xs:24,sm:24,md:10,lg:10,xl:10}},[a("el-tabs",{attrs:{type:"border-card"},on:{"tab-click":t.handleTabClick}},[a("el-tab-pane",{directives:[{name:"hasAccess",rawName:"v-hasAccess",value:{accessId:"home_clfb_qbcl"},expression:"{accessId: 'home_clfb_qbcl'}"}],attrs:{label:"全部车辆"}},[a("el-row",{staticClass:"chkbox-all-vehicle"},t._l(t.vhcleRslt,function(e,l){return a("el-checkbox",{key:l,on:{change:function(e){t.handleVhcleType(l)}},model:{value:e.compVal,callback:function(a){t.$set(e,"compVal",a)},expression:"vhcleItem.compVal"}},[t._v(t._s(e.labelName))])})),t._v(" "),a("el-table",{ref:"singleTable",staticClass:"multi-level-no-table",staticStyle:{width:"100%"},attrs:{data:t.tabCtntList.TabCtnt,"highlight-current-row":"","max-height":"900","default-sort":{prop:"date",order:"descending"},"row-class-name":"table-body-row-class-name","header-cell-class-name":"table-cell-class-name"}},t._l(t.tabCtntList.tabHeader,function(t,e){return a("el-table-column",{key:e,attrs:{prop:e,label:t}})}))],1)],1)],1)],1)},staticRenderFns:[]};var d=a("VU/8")(m,p,!1,function(t){a("QPrZ")},null,null);e.default=d.exports}});
//# sourceMappingURL=VehicleDistribution.6b1d77e1ed62f5c87e6e.js.map