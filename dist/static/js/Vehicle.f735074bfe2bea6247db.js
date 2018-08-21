webpackJsonp([27],{"0MTA":function(e,a){},OTbN:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var l=t("BO1k"),r=t.n(l),n=t("HGcE"),o=t("F+jZ"),c=t("L2rX"),s={name:"Vehicle",components:{MultiLevelNoTabComponent:n.a},data:function(){return{getBaseVehInfoDataUrl:c.b.rootUrl+c.b.BaseInfoAPI.GetBaseVehInfoData,exportCheckManageDataUrl:c.b.rootUrl+c.b.ExportCheckManageData,columnFullScore:{rwl:5,sxl:10,wxpyl:15,gjwzl:40,sjhgl:30,pjcscs:0,pjpjsc:0},columnType:{text:"text",router_link:"router_link"},vehicleSourceData:[],countData:[]}},computed:{tabCtntList:function(){return{currentPage:1,total:0,loading:!1,btnEvents:[{iconName:"el-icon-search",btnId:c.b.btnEventsId.search,btnName:"查询",isDisabled:!1,ctrlId:"jbxx_clgl_cx"}],searchCreteria:[{searchType:"input",labelName:"车牌号",labelId:c.d.Licenseplat,compVal:"",compId:""},{searchType:"input",labelName:"所属地区",labelId:c.d.ZoneId,compVal:c.c.provinceName,compId:c.c.provinceId},{searchType:"input",labelName:"所属单位",labelId:c.d.UnitId,compVal:"",compId:""},{searchType:"input",labelName:"接入平台",labelId:c.d.PlatformId,compVal:"",compId:""},{searchType:"checkbox",labelName:"车辆类型",labelId:c.d.CarType,compVal:[],options:[{value:1,label:"三类以上班线客车"},{value:4096,label:"高速客运车"},{value:4,label:"旅游包车"},{value:2,label:"超长客运"},{value:128,label:"危险品运输车"},{value:16,label:"重型货运车"},{value:32,label:"牵引车"},{value:1048576,label:"包车客车"}]},{searchType:"select",labelName:"已安装GPS",labelId:c.d.GPSInstalled,compVal:-1,options:[{value:-1,label:"全部"},{value:1,label:"已安装"},{value:0,label:"未安装"}]},{searchType:"singleChkbox",labelName:"是否已删除",labelId:c.d.Status,compVal:""},{searchType:"checkbox",labelName:"状态",labelId:c.d.GovStatus,compVal:[],options:[{value:2,label:"营运"},{value:1,label:"报废"},{value:4,label:"停运"},{value:8,label:"注销"},{value:16,label:"转出"},{value:32,label:"挂失"},{value:64,label:"歇业"},{value:256,label:"锁定"},{value:128,label:"删除"}]}],tabHeader:[{headerKey:"sybid",headerVal:"序号",subHeaders:[],columnType:this.columnType.text},{headerKey:"Licenseplat",headerVal:"车牌号",subHeaders:[],columnType:this.columnType.text},{headerKey:"Platecolor",headerVal:"车牌颜色",subHeaders:[],columnType:this.columnType.text},{headerKey:"UnitName",headerVal:"所属企业",subHeaders:[],columnType:this.columnType.text},{headerKey:"LogicUnitName",headerVal:"运营机构",subHeaders:[],columnType:this.columnType.text},{headerKey:"GnssCenterName",headerVal:"接入平台",subHeaders:[],columnType:this.columnType.text},{headerKey:"VehicleType",headerVal:"车辆类型",subHeaders:[],columnType:this.columnType.text},{headerKey:"Bs",headerVal:"经营范围",subHeaders:[],columnType:this.columnType.text},{headerKey:"Owner",headerVal:"车主姓名",subHeaders:[],columnType:this.columnType.text},{headerKey:"OwnerTel",headerVal:"车主电话",subHeaders:[],columnType:this.columnType.text},{headerKey:"ZoneName",headerVal:"车辆籍贯地",subHeaders:[],columnType:this.columnType.text},{headerKey:"TransportNo",headerVal:"道路运输证号",subHeaders:[],columnType:this.columnType.text},{headerKey:"BEGIN",headerVal:"道路运输证时间起",subHeaders:[],columnType:this.columnType.text},{headerKey:"END",headerVal:"道路运输证时间止",subHeaders:[],columnType:this.columnType.text},{headerKey:"SeatTon",headerVal:"座位或吨位",subHeaders:[],columnType:this.columnType.text},{headerKey:"Optional",headerVal:"车台配置参数",subHeaders:[],columnType:this.columnType.text},{headerKey:"Gpspa",headerVal:"拍照参数",subHeaders:[],columnType:this.columnType.text},{headerKey:"Vediopa",headerVal:"视频参数",subHeaders:[],columnType:this.columnType.text},{headerKey:"GpsInstalled",headerVal:"GPS安装",subHeaders:[],columnType:this.columnType.text},{headerKey:"GPSLastDate",headerVal:"最后一次定位",subHeaders:[],columnType:this.columnType.text}],TabCtnt:[]}}},methods:{handleClickSearch:function(e){var a=this;o.q.setItem(c.b.ctrlId,"jbxx_clgl_cx");var t=a.formPageParams(e.searchCreteria,e.currentPage,e.isSplitPage);a.tabCtntList.loading=!0,a.vehicleSourceData=[],o.a.axiosGet(this.getBaseVehInfoDataUrl,t).then(function(e){var t=e.data.DetailList,l=!0,n=!1,o=void 0;try{for(var c,s=r()(t);!(l=(c=s.next()).done);l=!0){var i=c.value;a.vehicleSourceData.push(a.pushSourceData(i))}}catch(e){n=!0,o=e}finally{try{!l&&s.return&&s.return()}finally{if(n)throw o}}a.tabCtntList.TabCtnt=a.vehicleSourceData,a.tabCtntList.total=e.data.CountTotal,a.tabCtntList.loading=!1}).catch(function(e){a.$message.error(Object(o.l)(e))})},pushSourceData:function(e){return{sybid:e.sybid,Licenseplat:e.Licenseplat,Platecolor:e.Platecolor,UnitName:e.UnitName,LogicUnitName:e.LogicUnitName,GnssCenterName:e.GnssCenterName,VehicleType:e.VehicleType,Bs:e.Bs,Owner:e.Owner,OwnerTel:e.OwnerTel,ZoneName:e.ZoneName,TransportNo:e.TransportNo,BEGIN:e.BEGIN,END:e.END,SeatTon:e.SeatTon,Optional:e.Optional,Gpspa:e.Gpspa,Vediopa:e.Vediopa,GpsInstalled:e.GpsInstalled,GPSLastDate:e.GPSLastDate}},handleClickExpData:function(e){var a=this;a.tabCtntList.loading=!0;var t=a.formPageParams(e.searchCreteria,e.currentPage,e.isSplitPage);o.a.axiosGet(this.exportCheckManageDataUrl,t).then(function(e){a.downloadServerFile(decodeURIComponent(e.data)),a.tabCtntList.loading=!1}).catch(function(e){a.$message.error(Object(o.l)(e))})},formPageParams:function(e,a,t){var l="",n="",o="",s="",i=0,d="",u=0,h="",p=!0,m=!1,b=void 0;try{for(var y,T=r()(e);!(p=(y=T.next()).done);p=!0){var v=y.value;switch(v.labelId){case c.d.ZoneId:l=v.compId;break;case c.d.UnitId:n=v.compId;break;case c.d.Licenseplat:o=v.compVal;break;case c.d.PlatformId:s=v.compId;break;case c.d.CarType:var I=!0,f=!1,x=void 0;try{for(var V,C=r()(v.compVal);!(I=(V=C.next()).done);I=!0){i+=V.value}}catch(e){f=!0,x=e}finally{try{!I&&C.return&&C.return()}finally{if(f)throw x}}break;case c.d.GPSInstalled:d=v.compVal;break;case c.d.GovStatus:var g=!0,N=!1,S=void 0;try{for(var P,k=r()(v.compVal);!(g=(P=k.next()).done);g=!0){u+=P.value}}catch(e){N=!0,S=e}finally{try{!g&&k.return&&k.return()}finally{if(N)throw S}}break;case c.d.Status:h=v.compVal}}}catch(e){m=!0,b=e}finally{try{!p&&T.return&&T.return()}finally{if(m)throw b}}return{zoneId:l,unitId:n,licenseplat:o,platformId:s,carType:i,gPSInstalled:d,govStatus:u,status:h,pageSize:10,pageIndex:a,isSplitPage:t,readPage:""}},handleCurrentChange:function(e){this.handleClickSearch(e)},downloadServerFile:function(e){var a=document.createElement("a");a.href=e,a.click()}},beforeMount:function(){var e=JSON.parse(o.q.getItem("breadNavs"));this.$emit("viewIn",e)}},i={render:function(){var e=this.$createElement,a=this._self._c||e;return a("div",{staticClass:"vehicle"},[a("multi-level-no-tab-component",{staticClass:"vehicle-multilevel",attrs:{tabCtntList:this.tabCtntList},on:{handleClickSearch:this.handleClickSearch,handleClickExpData:this.handleClickExpData,handleCurrentChange:this.handleCurrentChange}})],1)},staticRenderFns:[]};var d=t("VU/8")(s,i,!1,function(e){t("0MTA")},null,null);a.default=d.exports}});
//# sourceMappingURL=Vehicle.f735074bfe2bea6247db.js.map