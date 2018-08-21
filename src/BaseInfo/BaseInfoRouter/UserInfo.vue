<template>
  <div class="user-info">
    <multi-level-no-tab-component
    :tabCtntList="tabCtntList" 
    class="user-info-multilevel" 
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"
    v-on:handleEditBtn="handleEditBtn"
    v-on:handleAddEvent="handleAddEvent"
    v-on:handleRowClick="handleRowClick"
    v-on:handleDeleteBtn="handleDeleteBtn"
    v-on:handleInitpwdBtn="handleInitpwdBtn"
    v-on:handleRoleMgmtBtn="handleRoleMgmtBtn"
    ></multi-level-no-tab-component>
    <operation-user-info-form :updateCompanyFormVisible="addUserInfoVisible" v-on:handlUpdateForm="handleAddCancelSubmitEvent" :formData="formData" :formTitle="formTitle"></operation-user-info-form>
    <operation-user-info-form :updateCompanyFormVisible="updateUserInfoVisible" v-on:handlUpdateForm="handleUpdateCancelSubmitEvent" :formData="formData" :formTitle="formUpdateTitle"></operation-user-info-form>
    <operation-user-info-form :updateCompanyFormVisible="deleteUserInfoVisible" v-on:handlUpdateForm="handleDeleteCancelSubmitEvent" :formTitle="formDeleteTitle"></operation-user-info-form>
    <operation-user-info-form :updateCompanyFormVisible="resetUserInfoVisible" v-on:handlUpdateForm="handleResetCancelSubmitEvent" :formTitle="formResetTitle"></operation-user-info-form>
    <!-- 展示角色配置 -->
    <role-management-form 
    :roleMgmtVisible="roleMgmtVisible" 
    :formTitle="formRoleMgmtTitle"
    :currentUserId="currentUserId"
    :roleMgmtTabCtntList="roleMgmtTabCtntList"
    v-on:handlUpdateForm="handleRoleMgmtCancelSubmitEvent"
    :defaultCheckedRoles="defaultCheckedRoles"></role-management-form>
  </div>
</template>

<style src="./baseInfoRouter.css" type="text/css">
</style>

<script>
import MultiLevelNoTabComponent from "@/components/MultiLevelNoTabComponent/MultiLevelNoTabComponent";
import OperationUserInfoForm from "@/BaseInfo/UpdateCompanyForm/UpdateCompanyForm";
import RoleManagementForm from '@/BaseInfo/RoleManagementForm/RoleManagementForm';
import { axiosRequest, getLastMonth, getLastDay,isNullUndefEmpty, storageOperation, handleErrorMsg } from "@/common/common";
import {
  commonConfig,
  reportLabelId,
  provinceVal
} from "@/config/commonConfig";
export default {
  name: "UserInfo",
  components: {
    MultiLevelNoTabComponent,
    OperationUserInfoForm,
    RoleManagementForm
  },
  data() {
    return {
      getUserBaseInfoUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.GetUserBaseInfo, //用户管理
      getRoleToUserDataUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.GetRoleToUserData, //获取权限配置
      // 增加按钮需要的数据信息
      postAddObj: {
        params: {
          LoginCode: "",
          NickName: "",
          UnitId: "",
          Tel: "",
          Fax: "",
          Email: "",
          Notes: ""
        },
        postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.AddUserInfo
      },
      //用户管理 - 修改用户基本信息
      postUpdateObj: {
        params: {
          LoginCode: "",
          NickName: "",
          UnitId: "",
          Tel: "",
          Fax: "",
          Email: "",
          Notes: "",
          UserID: "",
          LoginPass: "",
        },
        postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.UpdateUserInfo
      },
      postDeleteObj: { //用户管理 - 删除
        params: {
          userId: ""
        },
        postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.DeleteUser
      },
      postResetObj: { //用户管理 - 重置密码
        params: {
          userId: ""
        },
        postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.updateUserLoginPass
      },

      exportCheckManageDataUrl:
        commonConfig.rootUrl + commonConfig.ExportCheckManageData,
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
      userInfoSourceData: [],
      // 存储合计的数据
      countData: [],
      // 初始状态下隐藏增加用户管理信息
      addUserInfoVisible: false,
      // 初始状态下隐藏修改用户管理信息
      updateUserInfoVisible: false,
      // 初始状态下隐藏删除用户管理信息
      deleteUserInfoVisible: false,
      // 初始状态下隐藏重置用户管理信息
      resetUserInfoVisible: false,
      // 初始状态下隐藏角色配置信息
      roleMgmtVisible: false,
      // 增加用户管理信息表单
      formData: [
        {
          headerKey: "LoginCode",
          headerVal: "用户名",
          isReadOnly: true, //在修改情况下是可以修改的
          columnType: 'input',
          compVal: ""
        },
        {
          headerKey: "NickName",
          headerVal: "昵称",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'input',
          compVal: ""
        },
        {
          headerKey: "UnitId",
          headerVal: "运营机构",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'preSearch',
          compVal: "",
          compId: ""
        },
        {
          headerKey: "Tel",
          headerVal: "电话",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'input',
          compVal: ""
        },
        {
          headerKey: "Fax",
          headerVal: "传真",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'input',
          compVal: ""
        },
        {
          headerKey: "Email",
          headerVal: "邮件",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'input',
          compVal: ""
        },
        {
          headerKey: "Notes",
          headerVal: "备注",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'input',
          compVal: ""
        }
      ],
      formTitle: "增加用户管理信息",
      formUpdateTitle: "修改用户管理信息",//该字段不能随意改动，因为修改的表单会通过这个字段进行识别当前表单是修改表单，某些字段是只读不能修改的
      formDeleteTitle: '你确定要删除该用户吗？',
      formResetTitle: '你确定要为该用户初始化密码吗？',
      formRoleMgmtTitle: '角色配置: ',
      // 标记选择了某一行的状态
      isSelectedRow: false,
      roleMgmtTabCtntList: {
        tabHeader: [
          {
            headerKey: "Name",
            headerVal: "角色名称",
            subHeaders: []
          },
          {
            headerKey: "Code",
            headerVal: "角色代码",
            subHeaders: []
          }],
        TabCtnt: []
      },
      // 记住当前选择的行的userId为角色配置做准备
      currentUserId: '',
      // 默认已经勾选的角色
      defaultCheckedRoles: []
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
            ctrlId: 'jbxx_yhgl_cx', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-circle-plus-outline",
            btnId: commonConfig.btnEventsId.add, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "增加",
            isDisabled: false, //控制导出数据按钮初始状态为disabled
            ctrlId: 'jbxx_yhgl_zj', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-edit",
            btnId: commonConfig.btnEventsId.edit, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "修改",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_yhgl_xg', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-delete",
            btnId: commonConfig.btnEventsId.delete, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "删除",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_yhgl_sc', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-refresh",
            btnId: commonConfig.btnEventsId.initpwd, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "初始化密码",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_yhgl_cshmm', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-setting",
            btnId: commonConfig.btnEventsId.rolemgmnt, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "角色配置",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_yhgl_jspz', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          }
        ],
        searchCreteria: [
          {
            searchType: "input",
            labelName: "用户名",
            labelId: reportLabelId.Name, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          },
          {
            searchType: "input",
            labelName: "运营机构",
            labelId: reportLabelId.UnitId, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: "",
            compId: "" // 在需要使用预搜索的输入框需要compId字段
          }
        ],
        tabHeader: [
          {
            headerKey: "sybid",
            headerVal: "序号",
            subHeaders: []
          },
          {
            headerKey: "LoginCode",
            headerVal: "用户名",
            subHeaders: []
          },
          {
            headerKey: "NickName",
            headerVal: "昵称",
            subHeaders: []
          },
          {
            headerKey: "UnitName",
            headerVal: "运营机构",
            subHeaders: []
          },
          {
            headerKey: "Tel",
            headerVal: "电话",
            subHeaders: []
          },
          {
            headerKey: "Fax",
            headerVal: "传真",
            subHeaders: []
          },
          {
            headerKey: "Email",
            headerVal: "邮件",
            subHeaders: []
          },
          {
            headerKey: "Notes",
            headerVal: "备注",
            subHeaders: []
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
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_yhgl_cx'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      this.isSelectedRow = false; //清除选中某一行的数据
      // 封装函数来组装每一页请求的参数
      const getUserBaseInfoUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.isSplitPage
      );
      self.tabCtntList.loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.userInfoSourceData = [];
      axiosRequest.axiosGet(this.getUserBaseInfoUrl, getUserBaseInfoUrlParams)
        .then(function(response) {
          const userInfoRankTemp = response.data.DetailList;
          for (let userInfoItem of userInfoRankTemp) {
            self.userInfoSourceData.push(self.pushSourceData(userInfoItem));
          }
          // 加上合计这一行
          // self.countData = self.pushSourceData(response.data.TotalList);
          self.tabCtntList.TabCtnt = self.userInfoSourceData;
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
    pushSourceData: function(userInfoItem) {
      return {
        sybid: userInfoItem.sybid,
        LoginCode: userInfoItem.LoginCode,
        // 该字段是修改按钮需要使用
        UserID: userInfoItem.UserID,
        UnitID: userInfoItem.UnitID,
        LoginPass: userInfoItem.LoginPass,

        NickName: userInfoItem.NickName,
        UnitName: userInfoItem.UnitName,
        Tel: userInfoItem.Tel,
        Fax: userInfoItem.Fax,
        Email: userInfoItem.Email,
        Notes: userInfoItem.Notes
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
      let unitId = "",
        name = "",
        pageSize = 10,
        readPage = "";
      //统一为每一种类型赋值，而不需要单独判断
      for (let msgItem of msg) {
        switch (msgItem.labelId) {
          case reportLabelId.Name:
            name = msgItem.compVal || null;
            break;
          case reportLabelId.UnitId:
            unitId = msgItem.compId;
            break;
          default:
        }
      }
      return {
        name,
        unitId,

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
      if (this.isSelectedRow) this.updateUserInfoVisible = msg;
      else this.$message.error("请选择一行数据");
    },
    handleDeleteBtn: function(msg){
      if (this.isSelectedRow) this.deleteUserInfoVisible = msg;
      else this.$message.error("请选择一行数据");
    },
    handleInitpwdBtn: function(msg){
      if (this.isSelectedRow) this.resetUserInfoVisible = msg;
      else this.$message.error("请选择一行数据");
    },
    handleRoleMgmtBtn: function(msg){
      let self = this;
      if (this.isSelectedRow){
        storageOperation.setItem(commonConfig.ctrlId, 'jbxx_yhgl_jspz'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
        const getRoleToUserDataUrlParams = {
           userId : this.currentUserId,
         }
        axiosRequest.axiosGet(this.getRoleToUserDataUrl, getRoleToUserDataUrlParams)
        .then(function(response) {
          const roleResponse = response.data;
          self.roleMgmtTabCtntList.TabCtnt = [];
          self.defaultCheckedRoles = [];
          for(let roleItem in roleResponse){
            let isSelectedRole = false;
            if(!isNullUndefEmpty(roleResponse[roleItem].Role)) {
              isSelectedRole = true;
            }
            self.roleMgmtTabCtntList.TabCtnt.push({
              Code: roleResponse[roleItem].Code,
              Name: roleResponse[roleItem].Name,
              Role: roleResponse[roleItem].Role,
              RoleId: roleResponse[roleItem].RoleId,
              State: roleResponse[roleItem].State,
              // 是否勾选checkbox
              isSelectedRole: isSelectedRole
            })
            if(!isNullUndefEmpty(roleResponse[roleItem].Role)) self.defaultCheckedRoles.push(self.roleMgmtTabCtntList.TabCtnt[roleItem]);
          }
        })
        .catch(function(error) {
          self.$message.error(handleErrorMsg(error));
        });
        this.roleMgmtVisible = msg;
      }
      else this.$message.error("请选择一行数据");
    },
    handleAddEvent: function(msg) {
      this.addUserInfoVisible = msg;
      for (let formDataItem of this.formData) {
          switch(formDataItem.headerKey){
            case "LoginCode":
            formDataItem.compVal = "";
            break;
            case "NickName":
            formDataItem.compVal = "";
            break;
            case "UnitId":
            formDataItem.compVal = "";
            formDataItem.compId = ""; //注意还需要去掉这个下拉框的隐藏值
            break;
            case "Tel":
            formDataItem.compVal = "";
            break;
            case "Fax":
            formDataItem.compVal = "";
            break;
            case "Email":
            formDataItem.compVal = "";
            break;
            case "Notes":
            formDataItem.compVal = "";
            break;
            default:
          }
        }
        console.log(this.formData)
    },
    // 处理子组件提交的修改数据的请求
    handleAddCancelSubmitEvent: function(msg) {
      let self = this;
      this.addUserInfoVisible = msg.isVisible;
      if (msg.actionType === "Submit") {
        storageOperation.setItem(commonConfig.ctrlId, 'jbxx_yhgl_zj'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
        for (let msgItem of msg.formColumnNames) {
          switch (msgItem.headerKey) {
            case "LoginCode":
              self.postAddObj.params.LoginCode = msgItem.compVal;
              break;
            case "NickName":
              self.postAddObj.params.NickName = msgItem.compVal;
              break;
            case "UnitId":
              self.postAddObj.params.UnitId = msgItem.compId; //注：在增加用户信息的时候，运营机构需要使用Id值
              break;
            case "Tel":
              self.postAddObj.params.Tel = msgItem.compVal;
              break;
            case "Fax":
              self.postAddObj.params.Fax = msgItem.compVal;
              break;
            case "Email":
              self.postAddObj.params.Email = msgItem.compVal;
              break;
            case "Notes":
              self.postAddObj.params.Notes = msgItem.compVal;
              break;
            default:
          }
        }
        axiosRequest.axiosPost(self.postAddObj).then(function(response){
          if (response.data === 0) {
              self.$message({
                message: "恭喜你，增加用户信息成功",
                type: "success"
              });
              self.addUserInfoVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              });
              // 将页码设置为1
              self.tabCtntList.currentPage = 1;
            } else if(response.data === -1){
              self.addUserInfoVisible = true;
              self.$message.error("用户名已存在，请重新添加");
            }else {
              self.addUserInfoVisible = true;
              self.$message.error("错了哦，增加用户信息失败");
            }
        })
        .catch(function(error){
          self.$message.error(handleErrorMsg(error));
        });
      }
    },
    handleUpdateCancelSubmitEvent: function(msg) {
      let self = this;
      this.updateUserInfoVisible = msg.isVisible;
      if (msg.actionType === "Submit") {
        storageOperation.setItem(commonConfig.ctrlId, 'jbxx_yhgl_xg'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
        for (let msgItem of msg.formColumnNames) {
          switch (msgItem.headerKey) {
            case "LoginCode":
              self.postUpdateObj.params.LoginCode = msgItem.compVal;
              break;
            case "NickName":
              self.postUpdateObj.params.NickName = msgItem.compVal;
              break;
            case "UnitId":
              self.postUpdateObj.params.UnitId = msgItem.compId; //注：在修改用户信息的时候，运营机构需要使用Id值
              break;
            case "Tel":
              self.postUpdateObj.params.Tel = msgItem.compVal;
              break;
            case "Fax":
              self.postUpdateObj.params.Fax = msgItem.compVal;
              break;
            case "Email":
              self.postUpdateObj.params.Email = msgItem.compVal;
              break;
            case "Notes":
              self.postUpdateObj.params.Notes = msgItem.compVal;
              break;
            default:
          }
        }
        axiosRequest.axiosPost(self.postUpdateObj).then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，修改用户信息成功",
                type: "success"
              });
              self.updateUserInfoVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              });
              // 将页码设置为1
              self.tabCtntList.currentPage = 1;
            } else {
              self.updateUserInfoVisible = true;
              self.$message.error("错了哦，修改用户信息失败");
            }
          })
          .catch(function(error) {
            self.$message.error(handleErrorMsg(error));
          });
      }
    },
    handleDeleteCancelSubmitEvent: function(msg){
      let self = this;
      this.deleteUserInfoVisible = msg.isVisible;
      if (msg.actionType === "Submit") {
        storageOperation.setItem(commonConfig.ctrlId, 'jbxx_yhgl_sc'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
        axiosRequest.axiosPost(self.postDeleteObj)
          .then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，删除用户信息成功",
                type: "success"
              });
              self.deleteUserInfoVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              });
              // 将页码设置为1
              self.tabCtntList.currentPage = 1;
            } else {
              self.deleteUserInfoVisible =true;
              self.$message.error("错了哦，删除用户信息失败");
            }
          })
          .catch(function(error) {});
      }
    },
    handleResetCancelSubmitEvent: function(msg){
      let self = this;
      this.resetUserInfoVisible = msg.isVisible;
      if (msg.actionType === "Submit") {
        storageOperation.setItem(commonConfig.ctrlId, 'jbxx_yhgl_cshmm'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
        axiosRequest.axiosPost(self.postResetObj)
          .then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，重置信息成功",
                type: "success"
              });
              self.resetUserInfoVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              });
              // 将页码设置为1
              self.tabCtntList.currentPage = 1;
            } else {
              self.resetUserInfoVisible = true;
              self.$message.error("错了哦，重置信息失败");
            }
          })
          .catch(function(error) {
            self.$message.error(handleErrorMsg(error));
          });
      }
    },
    handleRoleMgmtCancelSubmitEvent: function(msg){
      let self = this;
      this.roleMgmtVisible = msg.isVisible;
      if (msg.actionType === "Submit") {
        storageOperation.setItem(commonConfig.ctrlId, 'jbxx_yhgl_jspz'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
        this.postRoleMgmtObj = {
          params: {
            list: JSON.stringify(msg.checkedAccessArr),
            userId: self.currentUserId
          },
          postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.SaveRoleToUserData
        },
        axiosRequest.axiosPost(self.postRoleMgmtObj)
          .then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，修改角色配置信息成功",
                type: "success"
              });
              self.roleMgmtVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              });
              // 将页码设置为1
              self.tabCtntList.currentPage = 1;
            } else {
              self.$message.error("错了哦，修改角色配置信息失败");
              self.roleMgmtVisible = true;
            }
          })
          .catch(function(error) {
            self.$message.error(handleErrorMsg(error));
          });
      }
    },
    handleRowClick: function(msg) {
      this.isSelectedRow = true;
      this.postUpdateObj.params.UnitId = msg.UnitID;
      // 设置修改信息的默认值
      for (let formDataItem of this.formData) {
        switch (formDataItem.headerKey) {
          case "LoginCode":
            formDataItem.compVal = msg.LoginCode;
            break;
          case "NickName":
            formDataItem.compVal = msg.NickName;
            break;
          case "UnitId":
            formDataItem.compVal = msg.UnitName;
            formDataItem.compId = msg.UnitID;
            break;
          case "Tel":
            formDataItem.compVal = msg.Tel;
            break;
          case "Fax":
            formDataItem.compVal = msg.Fax;
            break;
          case "Email":
            formDataItem.compVal = msg.Email;
            break;
          case "Notes":
            formDataItem.compVal = msg.Notes;
            break;
          default:
        }
      }
      // 由于下面的字段属于隐藏字段，需要单独为其赋值
      this.postUpdateObj.params.UserID = msg.UserID;
      this.postUpdateObj.params.LoginPass = msg.LoginPass;
      
      this.postDeleteObj.params.userId = msg.UserID; //删除情况的UserID
      this.postResetObj.params.userId = msg.UserID; //初始化密码的UserID
      // 为角色配置的表名增加用户名的名字
      this.formRoleMgmtTitle = '角色配置: ';
      this.formRoleMgmtTitle += msg.LoginCode;
      this.currentUserId = msg.UserID;
    },
  },
  beforeMount: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
