webpackJsonp([8],{"/sj8":function(e,t){},"6vmb":function(e,t){},FFGj:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAIAAAAGHlpnAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABD0lEQVR42mNgaL5MKaKaEcK9V2M3Pao6+JxIVHngueLk6yhGVOx98ffff5LAmWffUIxwXXJ/1dUPO+9+JhLtuPu5ZPdzaoeF5ITrMRseF+96RiQq2vVMa+YtFCPStz199vn3h+9/iETvv/9Zf/MjihEhqx+cffnt3pffRKK7n38X731G7bDg67qqNeOW4Zw7RCKDOXfE+1HTRdjah1ff/nj54y+R6MX3PxNPv0Yxwn/1w5NPv917/5NIdPfdz7Zjr1CM4O26qj/rtvX8u0Qiq/l3RfuuUzs44zc+fvX1N54ccezxV6YWvEZkbnv6+NOvl19/40I33vxI3vyEQKQ6Lrkbuu4hLuS09B7tixxKEADEXTCjX2Y8+QAAAABJRU5ErkJggg=="},P9Fz:function(e,t){},XX3V:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAUCAIAAADp3DFZAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABP0lEQVR42mNgaL5MBYQppDjlOh7E2X6FsCka0298+/0XD4rf9Iil9QoBU7Rm3PiPFyRvfsRK0BS5SdefffqFB8VseIjPFJ7OK4ZzbpvPvzP19Cs8KGnLI6sFdwR7rmIxhbfzatmep0cefzn9/BsxaMHFdyK9V9FNCVz14O67H/+JBn/+/pt97g26KQV7nn/6/fc/KeDU02/optQfeAE0npqmAOm33/48/vQLDb38+vvnn3/EmvLp59++k6/9Vz9AQ3m7nl559Z1YU958+xO54RFmMleZdnP7vc+0N0V16g2PZXeBKHfPM/ymTDn31mflPaBKy/m38eUjoClRGx8xtlxGQ6rTQaYQlY+Apnz5+XfhxTcl+5+joaajLy+9+k6UKTITr+24+wkPclt6j7mViFJKtO8aHsTWdoWoso4MBAB/EIHR5Gv7MAAAAABJRU5ErkJggg=="},bhVl:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAIAAAA2bnI+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABg0lEQVR42mNwIhcw0Fynl6fXrOnTb9x9SKxOZ2dnLy+vrMz0oydO/v7z59rN20TpdHNzy8xI37hh3dv3H/7+/ff////d+w8S0Onm6padmTlt6pSb1699/Pjh0dPn3378BOqcN2cOPp1BQQE9Pb3Xrl75/fvX+3fv9u8/cuP2XaBTgTrz8jKx6/Tw8Cgtq9h/4ODbt2///fv39evn+fMWbtm869v3H//BIDg4EIvO0OCQrZs2vn375g/Y+B8/vvX3T1i0aOF3mLZHT565urii6+zp7v7+/StEBdC2ew8eZmUl5+XlAfX/h4ETZy8Agxpd54wZMx4+ePD586cfP36cP38+Oys7KSnl1buP/5HAts2bsegEgujo6GlTJi9ftjQ1JSU9NfXU2fP/UUF3dyeBNBQY4L9929bfv36h6SwszCWgMz42+uaN60ClJ48dO3jg+Oev34Hst+/eJyQkEKUTGJJxMbFBQcG5uTlAL+zduy8sLIyAzpCQkANHjufmpQ10LsMEAPhnwepwW+jDAAAAAElFTkSuQmCC"},cl2H:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("BO1k"),l=a.n(n),i=a("bOdI"),s=a.n(i),c=a("HGcE"),o=a("Bodc"),r=a("BO8i"),d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-row",{staticClass:"input-textarea noprint"},[a("el-col",{staticClass:"textarea-label-row",attrs:{span:3}},[a("span",{staticClass:"textarea-label-name"},[e._v(e._s(e.labelName))])]),e._v(" "),a("el-col",{attrs:{span:21}},[a("el-input",{attrs:{type:"textarea",rows:3,placeholder:e.phInput},model:{value:e.inputCtnt.inputVal,callback:function(t){e.$set(e.inputCtnt,"inputVal",t)},expression:"inputCtnt.inputVal"}})],1)],1)},staticRenderFns:[]};var p=a("VU/8")({name:"InputComponent",props:["labelName","compVal","labelId"],data:function(){return{}},computed:{phInput:function(){return"请输入"+this.labelName},inputCtnt:function(){return{inputVal:this.compVal}}}},d,!1,function(e){a("nwzc")},null,null).exports,m=a("L2rX"),b={name:"ViewOptionDetail",props:["viewOptionVisible"],components:{SelectComponent:o.a,InputComponent:r.a,InputTextAreaComponent:p},data:function(){return{searchType:{input:"input",select:"select",checkbox:"checkbox",singleChkbox:"singleChkbox",singleDayPicker:"singleDayPicker",singleDatePicker:"singleDatePicker",fromTodatePicker:"fromTodatePicker",treeCheckbox:"treeCheckbox",textarea:"textarea"},width:"70%",fileUpload:{btnEvents:[{btnName:"新增",iconName:"el-icon-circle-plus-outline",btnId:m.b.btnEventsId.add,btnType:"primary"},{btnName:"删除",iconName:"el-icon-remove-outline",btnId:m.b.btnEventsId.delete,btnType:"danger"}],imgResource:[{imgSrc:"/static/viewtemp0.png",imgName:"展示图片1"},{imgSrc:"/static/viewtemp1.png",imgName:"展示图片2"},{imgSrc:"/static/viewtemp0.png",imgName:"展示图片3"}],commentNotes:"3/10张"}}},computed:{viewOptionDialogVisible:{get:function(){return this.viewOptionVisible},set:function(e){}},checkInfo:function(){return[{searchType:this.searchType.select,labelName:"检查状态",labelId:"checkStatus",compVal:"",options:[{label:"重大隐患",value:1}]},{searchType:this.searchType.select,labelName:"整改难易度",labelId:"simpleHard",compVal:"",options:[{label:"一般",value:1}]},{searchType:this.searchType.select,labelName:"整改时限",labelId:"times",compVal:"",options:[{label:"7天",value:1}]},{searchType:this.searchType.select,labelName:"监督部门",labelId:"department",compVal:"",options:[{label:"重大隐患",value:1}]},{searchType:m.e.input,labelName:"整改责任人",labelId:"responsibility",compVal:"贾敬业"},{searchType:m.e.textarea,labelName:"检查内容",labelId:"checkContent",compVal:"各项基础设备是否完好；是否按时检修更新；紧急出口是否畅通无阻"},{searchType:m.e.textarea,labelName:"检查结果",labelId:"checkResult",compVal:"1.例保安监室顶棚腐朽，存在安全隐患，要求限期整改；2.候车大厅清洁间门坏，要求限期整改；3.候车大厅清洁间正门未安装栅栏，存在安全隐患，要求限期整改；4.候车大厅小卖部货箱堵塞消火栓，导致消防通道不畅通"},{searchType:this.searchType.textarea,labelName:"整改意见及要求",labelId:"opinionRequirement",compVal:"立即通知驾驶员更新安全锤，才给发班"}]}},methods:{handleClose:function(e){var t=this;this.$confirm("确认关闭？").then(function(a){e(),t.$emit("handleCloseEvent",!1)}).catch(function(e){})},submitForm:function(e){this.$emit("handleCloseEvent",!1)},handleBtnClick:function(e){var t="";switch(e){case m.b.btnEventsId.add:t="增加";break;case m.b.btnEventsId.delete:t="删除";break;case m.b.btnEventsId.sendchecklist_view_bottom:t="检查人员手机推送";break;case m.b.btnEventsId.sendchecklist_view_save:t="提交本次检查结果"}this.$message({message:"恭喜你，点击了"+t+"事件，目前该功能正在马不停蹄开发中，敬请期待",type:"warning"})}}},u={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-dialog",{staticClass:"view-option-detail",attrs:{title:"安全检查单-2017120301",visible:e.viewOptionDialogVisible,width:e.width,"before-close":e.handleClose,center:""},on:{"update:visible":function(t){e.viewOptionDialogVisible=t}}},[n("el-row",{staticClass:"viewtitle"},[n("img",{attrs:{src:a("FFGj")}}),e._v(" "),n("label",[e._v("查看检查记录")])]),e._v(" "),n("el-row",{staticClass:"viewprint"},[n("img",{attrs:{src:a("XX3V")}}),e._v(" "),n("label",[e._v("整改通知书")])]),e._v(" "),n("el-row",[n("el-col",{attrs:{span:8}},[n("p",[e._v("检查时间：2017-12-12")]),e._v(" "),n("p",[e._v("本次抽查项目项目--"),n("b",[e._v("治安消防/冬季安全/操作规程")])])]),e._v(" "),n("el-col",{attrs:{span:8}},[n("p",[n("b",[e._v("受检单位：河北健芯运输有限公司")])])]),e._v(" "),n("el-col",{attrs:{span:8}},[n("p",{staticStyle:{display:"inline-block"}},[e._v("检查组长：\n        "),n("font",{attrs:{color:"#0083D3"}},[e._v("詹开平")])],1),e._v(" "),n("p",{staticStyle:{display:"inline-block",margin:"auto 24px"}},[e._v("副组长：\n        "),n("font",{attrs:{color:"#0083D3"}},[e._v("张小二")])],1),e._v(" "),n("p",[e._v("检查成员：\n        "),n("font",{attrs:{color:"#0083D3"}},[e._v("吴延兴、胡公维、孙艳、冯德牛")])],1)])],1),e._v(" "),n("el-row",{staticClass:"view-option-body-content"},[n("el-col",{staticClass:"view-option-body-left",attrs:{span:16}},[n("el-row",[n("p",[e._v("检查信息")]),e._v(" "),e._l(e.checkInfo,function(t,a){return t.searchType===e.searchType.select?n("select-component",{key:a,attrs:{options:t.options,labelName:t.labelName,compVal:t.compVal,labelId:t.labelId}}):t.searchType===e.searchType.input?n("input-component",{attrs:{labelName:t.labelName,compVal:t.compVal,compId:t.compId,labelId:t.labelId}}):t.searchType===e.searchType.textarea?n("input-text-area-component",{attrs:{labelName:t.labelName,compVal:t.compVal,labelId:t.labelId}}):e._e()})],2)],1),e._v(" "),n("el-col",{staticClass:"view-option-body-right",attrs:{span:8}},[n("p",[e._v("附件上传")]),e._v(" "),n("el-row",{staticClass:"email-config-btngrp"},e._l(e.fileUpload.btnEvents,function(t,a){return n("el-button",{key:a,staticClass:"btn-com",attrs:{type:t.btnType,icon:t.iconName},on:{click:function(a){e.handleBtnClick(t.btnId)}}},[e._v(e._s(t.btnName))])})),e._v(" "),n("el-row",e._l(e.fileUpload.imgResource,function(t,a){return n("el-col",{key:a,attrs:{span:8}},[n("img",{attrs:{src:t.imgSrc}}),e._v(" "),n("p",[e._v(e._s(t.imgName))])])})),e._v(" "),n("p",{staticClass:"comment-note"},[e._v(e._s(e.fileUpload.commentNotes))])],1)],1),e._v(" "),n("el-row",[n("el-button",{staticClass:"sendchecklist-view-bottom sendchecklist-view-basic",on:{click:function(t){e.handleBtnClick("sendchecklist_view_bottom")}}},[n("img",{attrs:{src:a("bhVl")}}),e._v(" "),n("label",[e._v("检查人员手机推送")])]),e._v(" "),n("el-button",{staticClass:"sendchecklist-view-save sendchecklist-view-basic",on:{click:function(t){e.handleBtnClick("sendchecklist_view_save")}}},[n("img",{attrs:{src:a("rgpQ")}}),e._v(" "),n("label",[e._v("提交本次检查结果")])])],1)],1)},staticRenderFns:[]};var h=a("VU/8")(b,u,!1,function(e){a("6vmb")},null,null).exports,v={name:"GetNewChoucha",props:["getNewChouchaVisible","columnName"],data:function(){return{updatePwd:"增加检查单",labelPosition:"right",ruleForm2:{oldpass:"",newpass:"",checkPass:""},rules2:{oldpass:[{validator:function(e,t,a){if(!t)return a(new Error("用户名不能为空"))},trigger:"blur"}]}}},computed:{getNewChouchaDialogVisible:{get:function(){return this.getNewChouchaVisible},set:function(e){}},formColumnNames:function(){return this.columnName}},methods:{handleClose:function(e){var t=this;this.$confirm("确认关闭？").then(function(a){e(),t.$emit("handleCloseEvent",!1)}).catch(function(e){})},submitForm:function(e){this.$emit("handleCloseEvent",!1)}}},A={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{staticClass:"get-new-choucha",attrs:{title:e.updatePwd,visible:e.getNewChouchaDialogVisible,width:"25%","before-close":e.handleClose},on:{"update:visible":function(t){e.getNewChouchaDialogVisible=t}}},[a("el-form",{attrs:{model:e.ruleForm2,"status-icon":"","label-width":"100px"}},[e._l(e.formColumnNames,function(t,n){return a("el-form-item",{key:n,attrs:{label:t.headerVal+":",prop:t.headerKey}},[a("el-input",{attrs:{"auto-complete":"off",placeholder:"请输入"+t.headerVal},model:{value:e.ruleForm2.oldpass,callback:function(t){e.$set(e.ruleForm2,"oldpass",t)},expression:"ruleForm2.oldpass"}})],1)}),e._v(" "),a("el-form-item",[a("el-button",{on:{click:function(t){e.submitForm("ruleForm2")}}},[e._v("取 消")]),e._v(" "),a("el-button",{staticClass:"submitBtn",attrs:{type:"primary"},on:{click:function(t){e.submitForm("ruleForm2")}}},[e._v("提交")])],1)],2)],1)},staticRenderFns:[]};var f=a("VU/8")(v,A,!1,function(e){a("P9Fz")},null,null).exports,g=a("F+jZ"),C={name:"Company",components:{MultiLevelNoTabComponent:c.a,ViewOptionDetail:h,GetNewChoucha:f},data:function(){return{getCheckManageByZoneUrl:m.b.rootUrl+m.b.GetCheckManageByZone,exportCheckManageDataUrl:m.b.rootUrl+m.b.ExportCheckManageData,columnFullScore:{rwl:5,sxl:10,wxpyl:15,gjwzl:40,sjhgl:30,pjcscs:0,pjpjsc:0},columnType:{text:"text",router_link:"router_link"},sendChkListItemSourceData:[],countData:[],viewOptionVisible:!1,getNewChouchaVisible:!1,tabHeader:[{headerKey:"OrderID",headerVal:"单号"},{headerKey:"LicensePlat",headerVal:"企业"},{headerKey:"User",headerVal:"安全检查人员"},{headerKey:"CheckState",headerVal:"检查状态"},{headerKey:"OrderDate",headerVal:"时间安排"}]}},computed:{tabCtntList:function(){return{currentPage:1,total:0,loading:!1,btnEvents:[{iconName:"el-icon-search",btnId:m.b.btnEventsId.search,btnName:"筛选",isDisabled:!1},{iconName:"",btnId:m.b.btnEventsId.viewOptionDetail,btnName:"查看选项详情",isDisabled:!1},{iconName:"",btnId:m.b.btnEventsId.getNewChoucha,btnName:"获取新抽查",isDisabled:!1},{iconName:"",btnId:m.b.btnEventsId.delete,btnName:"删除选项",isDisabled:!1},{iconName:"",btnId:m.b.btnEventsId.export_data,btnName:"导出数据",isDisabled:!1}],searchCreteria:[{searchType:"input",labelName:"单号",labelId:m.d.OrderCode,compVal:""},{searchType:"singleDayPicker",labelName:"日期",labelId:m.d.BeginDate,compVal:""},{searchType:"select",labelName:"检查状态:",labelId:m.d.CheckState,compVal:"",options:[{label:"待检查",value:1},{label:"待整改",value:2},{label:"已整改",value:4},{label:"已过期",value:8}]}],tabHeader:[{headerKey:"sybid",headerVal:"序号",subHeaders:[]},{headerKey:"OrderCode",headerVal:"单号",subHeaders:[]},{headerKey:"Unit",headerVal:"企业",subHeaders:[]},{headerKey:"User",headerVal:"安全检查人员",subHeaders:[]},{headerKey:"CheckState",headerVal:"检查状态",subHeaders:[]},{headerKey:"OrderDate",headerVal:"时间安排",subHeaders:[]}],TabCtnt:[{sybid:1,OrderCode:"2017100301",Unit:"石家庄市某某企业",User:"user0",CheckState:"待检查",OrderDate:"20171203"}]}}},methods:{handleClickSearch:function(e){this.$message({message:"恭喜你点击了双随机抽查-查询事件，目前该功能正在马不停蹄开发中，敬请期待",type:"warning"})},pushSourceData:function(e){return{sybid:e.sybid,OrderCode:e.OrderCode,Unit:e.Unit,User:e.User,CheckState:e.CheckState,OrderDate:e.OrderDate}},handleClickExpData:function(e){this.tabCtntList.loading=!1,this.$message({message:"恭喜你点击了双随机抽查-导出数据事件，目前该功能正在马不停蹄开发中，敬请期待",type:"warning"})},formPageParams:function(e,t,a){var n,i="",c="",o="",r=0,d=1,p="",b="",u="",h="",v="",A="",f="",g="",C="",w="",k="",V="",I="",y="",N="",_="",x="",D="",P="",T=!0,O=!1,E=void 0;try{for(var S,U=l()(e);!(T=(S=U.next()).done);T=!0){var B=S.value;switch(B.labelId){case m.d.ZoneId:o=B.compId;break;case m.d.PlatformId:b=B.compId;break;case m.d.fromTodatePicker:i=B.compVal[0],c=B.compVal[1];break;case m.d.CarType:r=B.compVal;break;case m.d.UnitId:g=B.compId;break;case m.d.IsIncludeLower:d=B.compVal;break;case m.d.VehicleId:p=B.compId;break;case m.d.InstallID:u=B.compVal;break;case m.d.UpLineFlag:h=B.compVal;break;case m.d.CheckUnitID:v=B.compVal;break;case m.d.CheckType:A=B.compVal;break;case m.d.IsOnGuard:f=B.compVal;break;case m.d.TargetUserId:C=B.compVal;break;case m.d.DeviceID:w=B.compVal;break;case m.d.GPSInstalled:k=B.compVal;break;case m.d.ChangeSourceType:V=B.compVal;break;case m.d.OperationType:I=B.compVal;break;case m.d.GovStatus:y=B.compVal;break;case m.d.Status:N=B.compVal;break;case m.d.Name:_=B.compVal;break;case m.d.LicenseNumber:x=B.compVal;break;case m.d.OrderCode:D=B.compVal;break;case m.d.BeginDate:i=B.compVal;break;case m.d.CheckState:P=B.compVal}}}catch(e){O=!0,E=e}finally{try{!T&&U.return&&U.return()}finally{if(O)throw E}}return n={nType:1,beginDate:i,endDate:c,zoneId:o,carType:r,isIncludeLower:d,sortName:"",sortOrder:"",vehicleId:p,platformId:b,installID:u,upLineFlag:h,checkUnitID:v,checkType:A,isOnGuard:f,unitId:g,targetUserId:C,deviceID:w,gPSInstalled:k,pageSize:10,pageIndex:t,isSplitPage:a,readPage:"",changeSourceType:V,operationType:I,govStatus:y,status:N,name:_,licenseNumber:x,orderCode:D},s()(n,"beginDate",i),s()(n,"checkState",P),n},handleCurrentChange:function(e){this.handleClickSearch(e)},downloadServerFile:function(e){var t=document.createElement("a");t.href=e,t.click()},handleEditBtn:function(e){this.$message({message:e,type:"warning"})},handleviewOptionDetail:function(e){this.viewOptionVisible=e},handlegetNewChoucha:function(e){this.getNewChouchaVisible=e}},created:function(){var e=JSON.parse(g.q.getItem("breadNavs"));this.$emit("viewIn",e)}},w={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"send-check-list"},[a("multi-level-no-tab-component",{staticClass:"company-multilevel",attrs:{tabCtntList:e.tabCtntList},on:{handleClickSearch:e.handleClickSearch,handleClickExpData:e.handleClickExpData,handleCurrentChange:e.handleCurrentChange,handleEditBtn:e.handleEditBtn,handleviewOptionDetail:e.handleviewOptionDetail,handlegetNewChoucha:e.handlegetNewChoucha}}),e._v(" "),a("view-option-detail",{attrs:{viewOptionVisible:e.viewOptionVisible},on:{handleCloseEvent:e.handleviewOptionDetail}}),e._v(" "),a("get-new-choucha",{attrs:{getNewChouchaVisible:e.getNewChouchaVisible,columnName:e.tabHeader},on:{handleCloseEvent:e.handlegetNewChoucha}})],1)},staticRenderFns:[]};var k=a("VU/8")(C,w,!1,function(e){a("/sj8")},null,null);t.default=k.exports},nwzc:function(e,t){},rgpQ:function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAARCAIAAAC95HDXAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABVklEQVR42mNgaL5MESJeKWPzZcUpN8PWP5SbdJ2xhXT9WjNubbv76e+/f4svvVWacgNqBJGaDWbf3nX/038w+PP33+RTr/m6rhKr32L+nX0PP/+HgY8//tQdeMHdgaqfq+OK3uxbYv3XsWh+8PnPv38QzZ9+/mk+/FKw+xqK/9nbriRvfvTs08+WY6/44XLNl43m3AbaDHQwRPPX33+7j7+C2gzXDwzY4DX3f/35A1FUc/glW9sVRnCA7b6PcPbPP/9mnnuLJf6YWi4vuvT+++9/cKW1h18az7mz/e4nuMi3339nnX+LM/7F+q4vvPjuy6+/cA3XXv+Asz/9/Nt38jWB9CM/6ca88yhGwEO75chLjvYrhNMf0AigK5A98vHnn8bDLwWQQpRA+hXtvb7m2gdIeAPd0nHsFTSdEJ/+gSG/995nYGhPO/uG/PwTv/kxlfMfTfQDAN/kXWweWaWkAAAAAElFTkSuQmCC"}});
//# sourceMappingURL=SendCheckList.bd5bb56c7bc3be5affbc.js.map