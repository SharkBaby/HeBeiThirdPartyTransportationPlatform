<template>
  <div class="login-part">
    <h1>
      <!-- <el-row class="loginheader-logo"></el-row> -->
      <el-row class="loginheader">{{ firHeaderTle }}<br>{{secHeaderTle}}</el-row>
    </h1>
    <el-form :model="ruleForm2" :label-position="labelPosition" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="login-Form" @submit.native.prevent>
      <el-form-item label="账号: " prop="usrname" class="labelName">
        <el-input v-model="ruleForm2.usrname" :disabled="ruleForm2.usrnameStatus" @keyup.enter.native="submitForm('ruleForm2')"></el-input>
      </el-form-item>
      <el-form-item label="密码: " prop="pass" class="labelName">
        <el-input type="password" v-model="ruleForm2.pass" :disabled="ruleForm2.passStatus" auto-complete="off" @keyup.enter.native="submitForm('ruleForm2')">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type='submit' @click="submitForm('ruleForm2')" class="submitBtn" :loading="submitBtn.loading">{{submitBtn.text}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style src="./login.css" type="text/css">
</style>

<script>
// 引入axios HTTP module to submit login form
import {
  isNull,
  axiosRequest,
  storageOperation,
  creatWS,
  handleErrorMsg
} from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "Login",
  data() {
    var validateUsrName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else {this.submitBtn.text = '登录';callback();}
    };
    var checkPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {this.submitBtn.text = '登录';callback();}
    };
    return {
      postUrl: commonConfig.rootUrl + commonConfig.UserLogin,
      getUserDataUrl: commonConfig.rootUrl + commonConfig.UserAPI.GetUserData,
      firHeaderTle: "河北省道路运输第三方",
      secHeaderTle: "安全监测平台",
      labelPosition: "right",
      ruleForm2: {
        usrname: "",
        usrnameStatus: false, //当点击登录的时候禁止再输入
        pass: "",
        passStatus: false, //当点击登录的时候禁止再输入
      },
      // 设置提交按钮的初始状态和初始状态
      submitBtn: {
        loading: false,
        text: '登录'
      },
      rules2: {
        usrname: [
          {
            validator: validateUsrName,
            trigger: "blur"
          }
        ],
        pass: [
          {
            validator: checkPass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      var self = this;
      storageOperation.setItem(commonConfig.ctrlId, ''); //将需要请求的ctrlId在每次请求的时候更新到sessionStorage中，以便于在发请求的时候需要带上
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 显示登录中状态
          self.submitBtn.loading = true;
          self.submitBtn.text = '登录中，请稍等...';
          self.ruleForm2.usrnameStatus = true;
          self.ruleForm2.passStatus = true;

          const LoginID = commonConfig.LoginID,
            Password = commonConfig.Password;
          const postObj = {
            params: {
              LoginID: this.ruleForm2.usrname,
              Password: this.ruleForm2.pass
            },
            postUrl: this.postUrl
          };
          axiosRequest.axiosPost(postObj)
            .then(function(response) {
              if (!isNull(response.data)) {
                // 显示登录成功
                self.submitBtn.loading = false;
                self.submitBtn.text = '登录成功';
                storageOperation.setItem(
                  commonConfig.Token,
                  response.data.Token
                );
                storageOperation.setItem(
                  commonConfig.UserID,
                  response.data.UserID
                );
                storageOperation.setItem(
                  commonConfig.LoginID,
                  self.ruleForm2.usrname
                );
                // 成功登陆后将获取用户对应角色的权限列表
                self.getUserData();
                // var login="login";
                // // creatWS(login);
                // storageOperation.setItem("wslist",login);
              } else {
                // 用户名或者密码失败
                // 显示登录失败
                self.submitBtn.loading = false;
                self.submitBtn.text = '登录失败';
                self.ruleForm2.usrnameStatus = false;
                self.ruleForm2.passStatus = false;

               self.$message({
                type: 'warning',
                message: handleErrorMsg(error)
                })
                self.$refs.ruleForm2.resetFields();
              }
            })
            .catch(function(error) {
              // 显示登录失败
              self.submitBtn.loading = false;
              self.submitBtn.text = '登录错误';
              self.ruleForm2.usrnameStatus = false;
              self.ruleForm2.passStatus = false;
              self.$message({
              type: 'warning',
              message: handleErrorMsg(error)
              })
            });
        } else {
          self.$message.error("请输入完整的用户名和密码");
          return false;
        }
      });
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
          self.$router.push(commonConfig.routerConst.DashboardRouter);
        })
        .catch(function(error) {
         self.$message({
          type: 'warning',
          message: handleErrorMsg(error)
          })
        });
    }
  }
};
</script>
