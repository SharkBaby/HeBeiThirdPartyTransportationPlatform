<template>
  <el-menu :default-active="activeIndex2" class="personal-settings-menu el-menu-demo" mode="horizontal" background-color="#2C4257" text-color="#fff" active-text-color="#ffd04b">
    <el-submenu :index="value.indexNumber" v-if="value.TabItems.length > 0" v-for="(value, key) in personalToolArr" :key="key" v-hasAccess= "{accessId: value.ctrlId}">
      <template slot="title">{{value.TabName}}
      </template>
      <el-menu-item 
      :index="subValue.indexNumber" 
      v-for="(subValue, subKey)  in value.TabItems" 
      :key="subKey" 
      v-hasAccess= "{accessId: subValue.ctrlId}"
      class="personal-menu-item">
          <!-- for download -->
          <a :href="subValue.actionUrl" v-if="subValue.actionCategory == actionType.download" class="actionurl-name">{{subValue.actionName}}</a>
          <!-- for dialog -->
          <span v-else-if="subValue.actionCategory == actionType.dialog" @click="handleItemClick(subValue.indexNumber)" class="actionurl-name">{{subValue.actionName}}</span>
          <!-- for change theme -->
          <change-theme v-else-if="subValue.actionCategory == actionType.changeTheme" class="actionurl-name">{{subValue.actionName}}</change-theme>
          <router-link v-else-if="subValue.actionCategory == actionType.routerUrl" :to="subValue.routerUrl" class="actionurl-name">{{subValue.actionName}}</router-link>
      </el-menu-item>
  </el-submenu>
  <el-menu-item :index="value.indexNumber" v-else-if="value.TabItems.length == 0" :disabled="value.indexNumber=='loginName'">
      <router-link :to="value.routerUrl" class="router-link">{{value.TabName}}</router-link>
  </el-menu-item>
  <update-pwd :updPwddialogVisible="updPwddialogVisible" v-on:updpwdDialog="updPwdMethod"></update-pwd>
  <logout :logdialogVisible="logdialogVisible" v-on:logoutDialog="logoutMethod"></logout>
  <user-feedback :usrFedbkdialogVisible="usrFedbkdialogVisible" v-on:usrFedbkDialog="usrFedbkMethod"></user-feedback>
</el-menu>
</template>

<style type="text/css" src="./personalSettings.css"></style>

<script>
import UpdatePwd from "@/components/UpdatePwd/UpdatePwd";
import Logout from "@/components/Logout/Logout";
import UserFeedback from "@/components/UserFeedback/UserFeedback";
import ChangeTheme from "@/components/ChangeTheme/ChangeTheme";
import { axiosRequest, storageOperation } from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
// 引入权限控制的文件
import { $_hasAccess } from '@/accessmanagement/accessmanagement'
export default {
  name: "PersonalSettings",
  components: {
    UpdatePwd,
    Logout,
    UserFeedback,
    ChangeTheme
  },
  data() {
    return {
      activeIndex2: "",
      updPwddialogVisible: false,
      logdialogVisible: false,
      usrFedbkdialogVisible: false,
      actionType: {
        download: "download",
        dialog: "dialog",
        changeTheme: "changeTheme",
        routerUrl: "routerUrl"
      },
      personalToolArr: [
        {
          TabName: "欢迎您：" + storageOperation.getItem(commonConfig.LoginID),
          indexNumber: "loginName",
          routerUrl: "",
          TabItems: []
        },
        {
          TabName: "系统设置",
          indexNumber: "MyWorkStation",
          ctrlId: 'xtsz', //需要权限控制的情况下，需要制定id号
          TabItems: [
            // {
            //   indexNumber: "systemConfig",
            //   actionCategory: "routerUrl",
            //   actionName: "系统配置",
            //   routerUrl: "/Home/SystemConfig",
            //   ctrlId: 'txsz_xtpz', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            // },
            // {
            //   indexNumber: "baseInfo",
            //   actionCategory: "routerUrl",
            //   actionName: "基本信息",
            //   routerUrl: "/Home/BaseInfo",
            //   ctrlId: 'xtsz_jbxx', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            // },
            // {
            //   indexNumber: "CheckFeedBack",
            //   actionCategory: "routerUrl",
            //   actionName: "检查回执单",
            //   routerUrl: "/Home/CheckFeedBack",
            //   ctrlId: 'xtsz_jchzd', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            // },
            // 这是一个新增功能，目前由于产品不同意该功能，故隐藏此功能
            {
              indexNumber: "changeTheme",
              actionCategory: "changeTheme",
              actionName: "换肤",
              // ctrlId: 'xtsz_hf', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            }
          ]
        },
        {
          TabName: "个人中心",
          indexNumber: "PersonalCenter",
          ctrlId: 'grzx', //需要权限控制的情况下，需要制定id号
          TabItems: [
            {
              indexNumber: "updatePwd",
              actionCategory: "dialog",
              actionName: "修改密码",
              ctrlId: 'grzx_xgmm', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              indexNumber: "logout",
              actionCategory: "dialog",
              actionName: "注销登录",
              ctrlId: 'grzx_zxdl', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            // 注释人：向浩
            // 注释时间：2018-07-03
            // 注释原因：后端
            {
              indexNumber: "userFeedback",
              actionCategory: "dialog",
              actionName: "用户反馈",
              ctrlId: 'grzx_yhfk' //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              indexNumber: "messageCenter",
              actionCategory: "routerUrl",
              actionName: "信息中心",
              routerUrl: "/Home/MessageCenter",
              ctrlId: 'grzx_xxzx' //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            }
          ]
        }
      ],
      logoutUrl: commonConfig.rootUrl + commonConfig.UserLoginOut
    };
  },
  methods: {
    // item click in personal settings
    handleItemClick(subKey) {
      switch (subKey) {
        case "updatePwd":
          this.updPwddialogVisible = true;
          break;
        case "logout":
          this.logdialogVisible = true;
          break;
        case "userFeedback":
          this.usrFedbkdialogVisible = true;
          break;
      }
    },
    // Update by : Perry
    // Update Date: 2018-04-25
    // Update Reason: sychronize state in parent component when child component props is changed
    updPwdMethod(message) {
      const self = this;
      storageOperation.setItem(commonConfig.ctrlId, 'grzx_xgmm'); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      if (message.status !== "cancel") {
        axiosRequest.axiosPost(message)
          .then(function(response) {
            // 注释人：向浩
            // 注释时间：2018-07-03
            // 注释原因：当修改密码完成后，立即跳转到登录页面，不往history里面添加历史记录
            // self.$router.push(commonConfig.routerConst.LoginRouter);
            if (response.data) {
              self.updPwddialogVisible = false;
              self.$message({
                message: '恭喜你，修改密码成功，3s后请重新登录',
                type: 'success'
              });
              setTimeout(()=>{
                self.$router.replace(commonConfig.routerConst.LoginRouter);
              }, 2000);
            } else self.$message.error("修改密码失败，请输入正确的旧密码");
          })
          .catch(function(error) {});
      } else this.updPwddialogVisible = false;
    },
    logoutMethod(message) {
      this.logdialogVisible = false;
      const self = this;
      if (message == "submit") {
        storageOperation.clear();
        // 注释人：向浩
        // 注释时间：2018-07-03
        // 注释原因：当退出登录后，立即跳转到登录页面，不往history里面添加历史记录
        // self.$router.push(commonConfig.routerConstLoginRouter);
        self.$router.replace(commonConfig.routerConst.LoginRouter);
      }
    },
    usrFedbkMethod(message) {
      this.usrFedbkdialogVisible = message;
    }
  }
};
</script>