<template>
  <div class="role">
    <multi-level-no-tab-component
    :tabCtntList="tabCtntList" 
    class="role-multilevel" 
    v-on:handleClickSearch="handleClickSearch"
    v-on:handleClickExpData="handleClickExpData"
    v-on:handleCurrentChange="handleCurrentChange"
    v-on:handleEditBtn="handleEditBtn"
    v-on:handleAddEvent="handleAddEvent"
    v-on:handleRowClick="handleRowClick"
    v-on:handleDeleteBtn="handleDeleteBtn"
    v-on:handleAccessmgmntBtn="handleAccessmgmntBtn"></multi-level-no-tab-component>
    <operation-role-form :updateCompanyFormVisible="addRoleVisible" v-on:handlUpdateForm="handleAddCancelSubmitEvent" :formData="formData" :formTitle="formTitle"></operation-role-form>
    <operation-role-form :updateCompanyFormVisible="updateRoleVisible" v-on:handlUpdateForm="handleUpdateCancelSubmitEvent" :formData="formData" :formTitle="formUpdateTitle"></operation-role-form>
    <operation-role-form :updateCompanyFormVisible="deleteRoleVisible" v-on:handlUpdateForm="handleDeleteCancelSubmitEvent" :formTitle="formDeleteTitle"></operation-role-form>
    <!-- 展示权限配置 -->
    <access-management-form :accessMgmtVisible="accessMgmtVisible" v-on:handlUpdateForm="handleAccessMgmtSubmitEvent" :formTitle="formAccessmgmntTitle" :treeOps="treeOps" :treeChkboxProps="treeChkboxProps" :defaultCheckedKeys="defaultCheckedKeys" :currentRoleId="currentRoleId"></access-management-form>
  </div>
</template>

<style src="./baseInfoRouter.css" type="text/css">
</style>

<script>
import MultiLevelNoTabComponent from "@/components/MultiLevelNoTabComponent/MultiLevelNoTabComponent";
import OperationRoleForm from "@/BaseInfo/UpdateCompanyForm/UpdateCompanyForm";
import AccessManagementForm from '@/BaseInfo/AccessManagementForm/AccessManagementForm';
import { axiosRequest, getLastMonth, getLastDay, isNullUndefEmpty,formAccessMgmtData, storageOperation,handleErrorMsg } from "@/common/common";
import {
  commonConfig,
  reportLabelId,
  provinceVal
} from "@/config/commonConfig";
export default {
  name: "Role",
  components: {
    MultiLevelNoTabComponent,
    OperationRoleForm,
    AccessManagementForm
  },
  data() {
    return {
      getUserDataUrl: commonConfig.rootUrl + commonConfig.UserAPI.GetUserData, //获取当前用户的角色的权限列表
      getRoleInfoUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.GetRoleInfo, //角色管理
      getMenuTreeDataUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.GetMenuTreeData, //获取权限配置
      // 增加按钮需要的数据信息
      postAddObj: {
        //角色管理 - 添加角色
        params: {
          Name: "",
          Code: "",
          State: "",
          Comm: ""
        },
        postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.AddRoleInfo
      },
      //用户管理 - 修改用户基本信息
      postUpdateObj: {
        //角色管理 - 修改角色信息
        params: {
          RoleId: "",
          Name: "",
          Code: "",
          State: "",
          Comm: ""
        },
        postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.UpdateRoleInfo
      },
      postDeleteObj: {
        //角色管理 - 删除角色
        params: {
          roleId: ""
        },
        postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.DeleteRoleInfo
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
      roleSourceData: [],
      // 存储合计的数据
      countData: [],
      // 初始状态下隐藏增加角色管理信息
      addRoleVisible: false,
      // 初始状态下隐藏修改角色管理信息
      updateRoleVisible: false,
      // 初始状态下隐藏删除角色管理信息
      deleteRoleVisible: false,
      // 初始状态下隐藏权限管理信息
      accessMgmtVisible: false,
      // 增加角色管理信息表单
      formData: [
        {
          headerKey: "Name",
          headerVal: "角色名称",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'input',
          compVal: ""
        },
        {
          headerKey: "Code",
          headerVal: "角色代码",
          isReadOnly: true, //在修改情况下是不能修改的
          columnType: 'input',
          compVal: ""
        },
        {
          headerKey: "State",
          headerVal: "是否启用",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'select',
          compVal: 1,
          options: [
            {
              value: 1,
              label: "启用"
            },
            {
              value: 0,
              label: "禁用"
            }
          ]
        },
        {
          headerKey: "Comm",
          headerVal: "备注",
          isReadOnly: false, //在修改情况下是可以修改的
          columnType: 'input',
          compVal: ""
        }
      ],
      formTitle: "增加角色管理信息",
      formUpdateTitle: "修改角色管理信息", //该字段不能随意改动，因为修改的表单会通过这个字段进行识别当前表单是修改表单，某些字段是只读不能修改的
      formDeleteTitle: "你确定要删除该角色吗？",
      formAccessmgmntTitle: "权限配置",
      // 标记选择了某一行的状态
      isSelectedRow: false,
      // 记住当前选择的行的roleId为权限配置做准备
      currentRoleId: '',
      treeOps: [],
      defaultCheckedKeys: [],
      treeChkboxProps: {
        label: "Name",
        chidlren: "children"
      }
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
            ctrlId: 'jbxx_jsgl_cx', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-circle-plus-outline",
            btnId: commonConfig.btnEventsId.add, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "增加",
            isDisabled: false, //控制导出数据按钮初始状态为disabled
            ctrlId: 'jbxx_jsgl_zj', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-edit",
            btnId: commonConfig.btnEventsId.edit, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "修改",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_jsgl_xg', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-delete",
            btnId: commonConfig.btnEventsId.delete, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "删除",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_jsgl_sc', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          },
          {
            iconName: "el-icon-setting",
            btnId: commonConfig.btnEventsId.accessmgmnt, //该ID主要是用来判断在子组件中出发了哪一个按钮
            btnName: "权限配置",
            isDisabled: false, //控制查询数据按钮初始状态为enabled
            ctrlId: 'jbxx_jsgl_qxpz', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          }
        ],
        searchCreteria: [
          {
            searchType: "input",
            labelName: "角色名称",
            labelId: reportLabelId.RoleName, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          },
          {
            searchType: "input",
            labelName: "角色代码",
            labelId: reportLabelId.RoleCode, //该ID主要是用来判断在子组件中出发了哪一种个子组件
            compVal: ""
          }
        ],
        tabHeader: [
          {
            headerKey: "sybid",
            headerVal: "序号",
            subHeaders: []
          },
          {
            headerKey: "Name",
            headerVal: "角色名称",
            subHeaders: []
          },
          {
            headerKey: "Code",
            headerVal: "角色代码",
            subHeaders: []
          },
          {
            headerKey: "State",
            headerVal: "是否启用",
            subHeaders: []
          },
          {
            headerKey: "Comm",
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
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_jsgl_cx'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      // 封装函数来组装每一页请求的参数
      const getRoleInfoUrlParams = self.formPageParams(
        msg.searchCreteria,
        msg.currentPage,
        msg.isSplitPage
      );
      self.tabCtntList.loading = true; //加载数据的时候，显示加载数据的logo
      // 清空当前数据的集合
      self.roleSourceData = [];
      axiosRequest.axiosGet(this.getRoleInfoUrl, getRoleInfoUrlParams)
        .then(function(response) {
          if(!isNullUndefEmpty(response.data)){
            // const userInfoRankTemp = response.data.DetailList;
            const roleTemp = response.data;
            for (let roleItem in roleTemp) {
              self.roleSourceData.push(self.pushSourceData(parseInt(roleItem)+1, roleTemp[roleItem]));
            }
            // 加上合计这一行
            // self.countData = self.pushSourceData(response.data.TotalList);
            self.tabCtntList.loading = false;
            self.tabCtntList.TabCtnt = self.roleSourceData;
            // self.tabCtntList.TabCtnt.push(self.countData);
            self.tabCtntList.total = response.data.CountTotal;
            self.tabCtntList.btnEvents[1].isDisabled = false; //单击查询按钮后，使能导出数据、打印按钮
          }else {
            self.tabCtntList.TabCtnt = [];
            self.tabCtntList.loading = false;
          }
        })
        .catch(function(error) {
          self.$message.error(handleErrorMsg(error));
        });
    },
    // 将插入表的数据组装为一个函数
    pushSourceData: function(roleItem, roleTemp) {
      let stateTemp = '';
      if(roleTemp.State) stateTemp = '是';
      else stateTemp = '否';
      return {
        sybid: roleItem,
        Name: roleTemp.Name,
        // 该字段是修改按钮需要使用
        RoleId: roleTemp.RoleId,

        Code: roleTemp.Code,
        State: stateTemp,
        Comm: roleTemp.Comm
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
      axiosRequest
        .axiosGet(this.exportCheckManageDataUrl, GetCheckManageByZoneParams)
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
      let RoleName = "",
        RoleCode = "",
        pageSize = 10,
        readPage = "";
      //统一为每一种类型赋值，而不需要单独判断
      for (let msgItem of msg) {
        switch (msgItem.labelId) {
          case reportLabelId.RoleName:
            RoleName = msgItem.compVal;
            break;
          case reportLabelId.RoleCode:
            RoleCode = msgItem.compVal;
            break;
          default:
        }
      }
      return {
        RoleName,
        RoleCode,

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
    handleAddEvent: function(msg) {
      this.addRoleVisible = msg;
      for (let formDataItem of this.formData) {
        switch (formDataItem.headerKey) {
          case "Name":
            formDataItem.compVal = "";
            break;
          case "Code":
            formDataItem.compVal = "";
            break;
          case "State":
            formDataItem.compVal = "";
            break;
          case "Comm":
            formDataItem.compVal = "";
            break;
          default:
        }
      }
    },
    // 单击增加按钮事件处理
    handleEditBtn: function(msg) {
      if (this.isSelectedRow) this.updateRoleVisible = msg;
      else this.$message.error("请选择一行数据");
    },
    // 单击删除按钮事件处理
    handleDeleteBtn: function(msg) {
      if (this.isSelectedRow) this.deleteRoleVisible = msg;
      else this.$message.error("请选择一行数据");
    },
    handleAccessmgmntBtn: function(msg){
      let self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_jsgl_qxpz'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      if (this.isSelectedRow){
         const getMenuTreeDataUrlParams = {
           RoleId : this.currentRoleId,
         }
        axiosRequest.axiosGet(this.getMenuTreeDataUrl, getMenuTreeDataUrlParams)
        .then(function(response) {
          self.$store.commit('updateChkAccessMgmtceArr', []);
          self.treeOps = response.data;
          // 勾选默认选项
          formAccessMgmtData(self.treeOps);
          self.defaultCheckedKeys = self.$store.state.chkAccessMgmtceArr;
          console.log(self.defaultCheckedKeys)
        })
        .catch(function(error) {
          self.$message.error(handleErrorMsg(error));
        });
        this.accessMgmtVisible = msg;
      }
      else this.$message.error("请选择一行数据");
    },
    // 处理子组件增加的修改数据的请求
    handleAddCancelSubmitEvent: function(msg) {
      let self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_jsgl_zj'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      this.addRoleVisible = msg.isVisible;
      if (msg.actionType === "Submit") {
        for (let msgItem of msg.formColumnNames) {
          switch (msgItem.headerKey) {
            case "Name":
              self.postAddObj.params.Name = msgItem.compVal;
              break;
            case "Code":
              self.postAddObj.params.Code = msgItem.compVal;
              break;
            case "State":
              self.postAddObj.params.State = msgItem.compVal;
              break;
            case "Comm":
              self.postAddObj.params.Comm = msgItem.compVal;
              break;
            default:
          }
        }
        axiosRequest.axiosPost(self.postAddObj).then(function(response) {
            if (response.data === 0) {
              self.$message({
                message: "恭喜你，修改信息成功",
                type: "success"
              });
              self.addRoleVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              });
            } else if(response.data === -1){
              self.addRoleVisible = true;
              self.$message.error("角色已存在，请重新添加");
            } else {
              self.addRoleVisible = true;
              self.$message.error("错了哦，修改信息失败");
            }
          })
          .catch(function(error) {
            self.$message.error(handleErrorMsg(error));
          });
      }
    },
    handleUpdateCancelSubmitEvent: function(msg) {
      let self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_jsgl_xg'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      this.updateRoleVisible = msg.isVisible;
      if (msg.actionType === "Submit") {
        
        for (let msgItem of msg.formColumnNames) {
          switch (msgItem.headerKey) {
            case "Name":
              self.postUpdateObj.params.Name = msgItem.compVal;
              break;
            case "Code":
              self.postUpdateObj.params.Code = msgItem.compVal;
              break;
            case "State":
              self.postUpdateObj.params.State = msgItem.compVal;
              break;
            case "Comm":
              self.postUpdateObj.params.Comm = msgItem.compVal;
              break;
            default:
          }
        }
        axiosRequest.axiosPost(self.postUpdateObj).then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，修改信息成功",
                type: "success"
              });
              self.updateRoleVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              })
            } else self.$message.error("错了哦，修改信息失败");
          })
          .catch(function(error) {
            self.$message.error(handleErrorMsg(error));
          });
      }
    },
    handleDeleteCancelSubmitEvent: function(msg) {
      let self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_jsgl_sc'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      this.deleteRoleVisible = msg.isVisible;
      if (msg.actionType === "Submit") {
        axiosRequest
          .axiosPost(self.postDeleteObj)
          .then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，删除信息成功",
                type: "success"
              });
              self.deleteRoleVisible = false;
              self.handleClickSearch({
                currentPage: 1,
                searchCreteria: self.tabCtntList.searchCreteria,
                isSplitPage: true
              })
            } else self.$message.error("错了哦，删除信息失败");
          })
          .catch(function(error) {
            self.$message.error(handleErrorMsg(error));
          });
      }
    },
    handleAccessMgmtSubmitEvent: function(msg) {
      let self = this;
      this.accessMgmtVisible = msg.isVisible;
      storageOperation.setItem(commonConfig.ctrlId, 'jbxx_jsgl_qxpz_xg'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      if (msg.actionType === "Submit") {
        this.postSaveRightObj = {
          params: {
            menuList: JSON.stringify(msg.checkedAccessArr),
            roleId: this.currentRoleId,
            reList: JSON.stringify([])
          },
          postUrl: commonConfig.rootUrl + commonConfig.BaseInfoAPI.SaveRightData
        },
        axiosRequest.axiosPost(self.postSaveRightObj)
          .then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，修改权限配置信息成功",
                type: "success"
              });
              self.accessMgmtVisible = false;
              // 修改角色权限后将重新获取用户对应角色的权限列表
              self.getUserData();
            } else self.$message.error("错了哦，修改权限配置信息失败");
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
          case "Name":
            formDataItem.compVal = msg.Name;
            break;
          case "Code":
            formDataItem.compVal = msg.Code;
            break;
          case "State":
            formDataItem.compVal = msg.State;
            break;
          case "Comm":
            formDataItem.compVal = msg.Comm;
            break;
          default:
        }
      }
      // 由于下面的字段属于隐藏字段，需要单独为其赋值
      this.postUpdateObj.params.RoleId = msg.RoleId; //修改情况的RoleId
      this.postDeleteObj.params.roleId = msg.RoleId; //删除情况的RoleId
      this.currentRoleId = msg.RoleId;
    },
    // 获取用户对应角色的权限列表
    getUserData: function() {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      const getUserDataUrlParams = {
        loginCode: storageOperation.getItem(commonConfig.LoginID)
      };
      axiosRequest.axiosGet(this.getUserDataUrl, getUserDataUrlParams)
        .then(function(response) {
          self.$store.commit("updateUsrAccessManagement", response.data);
          // 由于在vue自定义指令中无法访问vuex中的state,所以再存取一个副本在sessionStorage中
          storageOperation.setItem("accessList", JSON.stringify(response.data));
        })
        .catch(function(error) {});
    }
  },
  beforeMount: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
