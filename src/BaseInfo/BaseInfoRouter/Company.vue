<template>
  <div class="company">
    <multi-level-no-tab-component
    :tabCtntList="tabCtntList" 
    class="company-multilevel" 
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"
    v-on:handleEditBtn="handleEditBtn"
    v-on:handleRowClick="handleRowClick"
    ></multi-level-no-tab-component>
    <update-company-form :updateCompanyFormVisible="updateCompanyFormVisible" v-on:handlUpdateForm="handlUpdateForm" :formData="formData" :formTitle="formTitle"></update-company-form>
  </div>
</template>

<style src="./baseInfoRouter.css" type="text/css">
</style>

<script>
import MultiLevelNoTabComponent from "@/components/MultiLevelNoTabComponent/MultiLevelNoTabComponent";
import UpdateCompanyForm from "@/BaseInfo/UpdateCompanyForm/UpdateCompanyForm";
import { axiosRequest, getLastMonth, getLastDay, storageOperation,handleErrorMsg } from "@/common/common";
import {
  commonConfig,
  reportLabelId,
  provinceVal
} from "@/config/commonConfig";
export default {
  name: "Company",
  components: {
    MultiLevelNoTabComponent,
    UpdateCompanyForm
  },
  data() {
    return {
      getUnitBaseInfoUrl:
        commonConfig.rootUrl + commonConfig.BaseInfoAPI.GetUnitBaseInfo,
      // 修改按钮需要的数据信息
      postObj: {
        params: {
          UnitId: "",
          Tel: "",
          Email: ""
        },
        postUrl:
          commonConfig.rootUrl + commonConfig.BaseInfoAPI.UpdateUnitBaseInfo
      },
      // 每一大列的满分得分
      columnFullScore: {
        rwl: 5,
        sxl: 10,
        wxpyl: 15,
        gjwzl: 40,
        sjhgl: 30,
        pjcscs: 0,
        pjpjsc: 0
      },
      // 每一列的类型，目前已经有纯文本和router-link
      columnType: {
        text: "text",
        router_link: "router_link"
      },
      // 存储每10行的数据
      vehicleSourceData: [],
      // 存储合计的数据
      countData: [],
      // 初始状态下隐藏修改运输企业管理
      updateCompanyFormVisible: false,
      // 标记选择了某一行的状态
      isSelectedRow: false,
      // 修改运输企业管理的表单
      formData: [
        {
          headerKey: "Tel",
          headerVal: "联系电话",
          compVal: ""
        },
        {
          headerKey: "Email",
          headerVal: "电子邮箱",
          compVal: ""
        }
      ],
      formTitle: '修改运输企业管理'
    };
  },
  computed: {
    tabCtntList: function() {
      return {
        currentPage: 1, //当前页数
        total: 0, //总条数
        loading: false,
        btnEvents: [
          {
            iconName: "el-icon-search",
            btnId: commonConfig.btnEventsId.search, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "查询",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_ysqygl_cx', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-edit",
            btnId: commonConfig.btnEventsId.edit, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "修改",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_ysqygl_xg', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          }
        ],
        searchCreteria: [
          {
            searchType: "input",
            labelName: "企业",
            labelId: reportLabelId.Name, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          },
          {
            searchType: "singleChkbox",
            labelName: "是否已删除",
            labelId: reportLabelId.Status, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          },
          {
            searchType: "input",
            labelName: "经营许可证号",
            labelId: reportLabelId.LicenseNumber, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          }
        ],
        tabHeader: [
          {
            headerKey: "sybid",
            headerVal: "序号",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "UnitName",
            headerVal: "企业",
            subHeaders: [],
            columnType: this.columnType.text,
            width:240
          },
          {
            headerKey: "OrgCA",
            headerVal: "组织机构代码",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "ZoneName",
            headerVal: "地区",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "UpUnitName",
            headerVal: "上级企业",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "LogicUnitName",
            headerVal: "运营机构",
            subHeaders: [],
            columnType: this.columnType.text,
            width:240
          },
          {
            headerKey: "BsName",
            headerVal: "行业类型",
            subHeaders: [],
            columnType: this.columnType.text,
            width:240
          },
          {
            headerKey: "Bs",
            headerVal: "经营范围",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "LicenseNumber",
            headerVal: "经营许可证号",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "Begin",
            headerVal: "经营许可证有效期起",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "End",
            headerVal: "经营许可证有效期止",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "CorpHead",
            headerVal: "单位法人",
            subHeaders: [],
            columnType: this.columnType.text
          },
          {
            headerKey: "Tel",
            headerVal: "联系电话",
            subHeaders: [],
            columnType: this.columnType.text,
            width:120
          },
          {
            headerKey: "Email",
            headerVal: "电子邮箱",
            subHeaders: [],
            columnType: this.columnType.text,
            width:180
          },
          {
            headerKey: "Address",
            headerVal: "单位地址",
            subHeaders: [],
            columnType: this.columnType.text,
            width:240
          },
          {
            headerKey: "GnssCenterName",
            headerVal: "接入平台",
            subHeaders: [],
            columnType: this.columnType.text,
            width:240
          }
        ],
        TabCtnt: []
      };
    }
  },
  methods: {
    //处理子组件触发的查询事件
    handleClickSearch: function(msg) {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_ysqygl_cx'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      this.isSelectedRow = false; //清除选中某一行的数据
      // 封装函数来组装每一页请求的参数
      const getUnitBaseInfoUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.isSplitPage
      );
      self.tabCtntList.loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.vehicleSourceData = [];
      axiosRequest.axiosGet(this.getUnitBaseInfoUrl, getUnitBaseInfoUrlParams)
        .then(function(response) {
          const vehicleRankTemp = response.data.DetailList;
          for (let vehicleItem of vehicleRankTemp) {
            self.vehicleSourceData.push(self.pushSourceData(vehicleItem));
          }
          // 加上合计这一行
          // self.countData = self.pushSourceData(response.data.TotalList);
          self.tabCtntList.TabCtnt = self.vehicleSourceData;
          // self.tabCtntList.TabCtnt.push(self.countData);
          self.tabCtntList.total = response.data.CountTotal;
          self.tabCtntList.loading = false;
          self.tabCtntList.btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
        })
        .catch(function(error) {
          self.$message.error(handleErrorMsg(error));
        });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(vehicleItem) {
      return {
        sybid: vehicleItem.sybid,
        UnitName: vehicleItem.UnitName,

        // 该字段是修改按钮需要使用
        UnitID: vehicleItem.UnitID,

        OrgCA: vehicleItem.OrgCA,
        ZoneName: vehicleItem.ZoneName,
        UpUnitName: vehicleItem.UpUnitName,
        LogicUnitName: vehicleItem.LogicUnitName,
        BsName: vehicleItem.BsName,
        Bs: vehicleItem.Bs,
        LicenseNumber: vehicleItem.LicenseNumber,
        Begin: vehicleItem.Begin,
        End: vehicleItem.End,
        CorpHead: vehicleItem.CorpHead,
        Tel: vehicleItem.Tel,
        Email: vehicleItem.Email,
        Address: vehicleItem.Address,
        GnssCenterName: vehicleItem.GnssCenterName
      };
    },
    // 注释人：向浩
    // 注释时间：2018-06-12
    // 注释原因：实现导出数据功能
    handleClickExpData: function(msg) {
      //处理子组件触发的导出数据事件
      const self = this;
      self.tabCtntList.loading = true; //下载数据的时候，显示正在下载数据的logo
      // 封装函数来组装每一页请求的参数
      const GetCheckManageByZoneParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.isSplitPage //是否分页 - 导出数据
      );
      axiosRequest.axiosGet(this.exportCheckManageDataUrl, GetCheckManageByZoneParams)
        .then(function(response) {
          self.downloadServerFile(decodeURIComponent(response.data));
          // 下载完成后，隐藏正在下载的logo
          self.tabCtntList.loading = false;
        })
        .catch(function(error) {
          self.$message.error(handleErrorMsg(error));
        });
    },
    formPageParams: function(msg, pageIndex, isSplitPage) {
      let status = "",
        name = "",
        licenseNumber = "",
        pageSize = 10,
        readPage = "";
      //统一为每一种类型赋值，而不需要单独判断
      for (let msgItem of msg) {
        switch (msgItem.labelId) {
          case reportLabelId.Status:
            status = msgItem.compVal;
            break;
          case reportLabelId.Name:
            name = msgItem.compVal;
            break;
          case reportLabelId.LicenseNumber:
            licenseNumber = msgItem.compVal;
            break;
          default:
        }
      }
      return {
        status,
        name,
        licenseNumber,
        pageSize,
        pageIndex,
        isSplitPage,
        readPage
      };
    },
    // 处理子组件出发的换页数据加载
    handleCurrentChange: function(msg) {
      this.handleClickSearch(msg);
    },
    // 封装函数来通过HTML5的a标签来下载服务器生成的报表文件
    downloadServerFile: function(url) {
      // 使用HTML5的 <a download></a>来下载服务器文件
      let a = document.createElement("a");
      a.href = url;
      a.click();
    },
    handleEditBtn: function(msg) {
      if (this.isSelectedRow) this.updateCompanyFormVisible = msg;
      else this.$message.error("请选择一行数据");
    },
    handleRowClick: function(msg) {
      this.isSelectedRow = true;
      this.postObj.params.UnitId = msg.UnitID;
      // 设置修改信息的默认值
      for (let forDataItem of this.formData) {
        if (forDataItem.headerKey === "Tel") forDataItem.compVal = msg.Tel;
        else if (forDataItem.headerKey === "Email") forDataItem.compVal = msg.Email;
      }
    },
    // 处理子组件提交的修改数据的请求
    handlUpdateForm: function(msg) {
      this.updateCompanyFormVisible = msg.isVisible;
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_ysqygl_xg'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      if (msg.actionType === "Submit") {
        for (let msgItem of msg.formColumnNames) {
          if (msgItem.headerKey === "Tel") self.postObj.params.Tel = msgItem.compVal;
          else if (msgItem.headerKey === "Email")
            self.postObj.params.Email = msgItem.compVal;
        }
        axiosRequest
          .axiosPost(self.postObj)
          .then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，修改信息成功",
                type: "success"
              });
              self.updateCompanyFormVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              });
              // 将页码设置为1
              self.tabCtntList.currentPage = 1;
            } else this.$message.error("错了哦，修改信息失败");
          })
          .catch(function(error) {
            self.$message.error(handleErrorMsg(error));
          });
      }
    }
  },
  beforeMount: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
