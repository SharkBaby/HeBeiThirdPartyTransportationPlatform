<template>
  <el-row class="email-config">
    <bread-crumb-component :breadNavs="breadNavs"></bread-crumb-component>
    <hr>
    <el-col :span="12" class="email-config-item-box">
      <el-row class="platform-check-sentry-time" v-for="(randomChkItem, randomChkKey) of randomChkItems" :key="randomChkKey" v-if="randomChkItem.itemType === settingType.automatically">
        <label class="label-name">{{randomChkItem.itemName}}</label>
        <el-row v-for="(chkSeqItem, chkSeqKey) of randomChkItem.sequence" :key="chkSeqKey" class="config-reminder-item-subitem">
          <el-radio :label="chkSeqItem.value" v-model="randomChkItem.sequenceSelected" class="email-config-radio">{{chkSeqItem.sequenceName}}</el-radio>
          <label class="label-name">{{chkSeqItem.preText}}</label>
          <input-number-component :inputNumber="chkSeqItem.times"></input-number-component>
          <label class="label-name">{{chkSeqItem.afterText}}</label>
        </el-row>
        <el-row class="email-config-btngrp">
          <el-button 
          :type="btnItem.btnType"
          :icon="btnItem.iconName" 
          v-for="(btnItem, btnKey) of randomChkItem.btnEvents" 
          :key="btnKey" 
          @click="handleBtnClick(btnItem.btnId)" 
          class="btn-com">{{btnItem.btnName}}</el-button>
        </el-row>
      </el-row>
      <el-row class="platform-check-sentry-time" v-else-if="randomChkItem.itemType === settingType.manualSendRightNow">
        <label class="label-name">{{randomChkItem.itemName}}</label>
        <el-row class="email-config-btngrp">
          <el-button 
          :type="btnItem.btnType"
          :icon="btnItem.iconName" 
          v-for="(btnItem, btnKey) of randomChkItem.btnEvents" 
          :key="btnKey" 
          @click="handleBtnClick(btnItem.btnId)" 
          class="btn-com">{{btnItem.btnName}}</el-button>
        </el-row>
      </el-row>
    </el-col>
  </el-row>
</template>

<style src="./systemConfigRouter.css" type="text/css">
</style>

<script>
import BreadCrumbComponent from "@/components/BreadCrumbComponent/BreadCrumbComponent";
import RadioComponent from "@/components/RadioComponent/RadioComponent";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import InputNumberComponent from "@/components/InputNumberComponent/InputNumberComponent";
import LabelInputNumber from "@/components/LabelInputNumber/LabelInputNumber";
import { storageOperation } from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "RandomCheckConfig",
  components: {
    BreadCrumbComponent,
    RadioComponent,
    ButtonComponent,
    InputNumberComponent,
    LabelInputNumber
  },
  data() {
    return {
      settingType: {
        automatically: "automatically",
        manualSendRightNow: "manualSendRightNow"
      },
      breadNavs: [
        {
          toNav: {
            path: "/Home/SystemConfig"
          },
          toName: "系统配置"
        },
        {
          toNav: {
            path: "/Home/SystemConfig/EmailSysconfig"
          },
          toName: "邮件推送配置"
        }
      ],
      sequenceSelected: "",
      randomChkItems: [
        {
          itemName: "自动发送配置",
          itemType: "automatically", //这种定义主要是未来扩展性考虑，如果有类似添加，可以直接配置
          sequence: [
            {
              value: "month",
              sequenceName: "按月",
              preText: "每月",
              times: 0,
              afterText: "号发送上月报表"
            },
            {
              value: "week",
              sequenceName: "按周",
              preText: "每周",
              times: 0,
              afterText: "号发送上周报表"
            }
          ],
          btnEvents: [
            {
              btnName: "保存",
              iconName: "el-icon-success",
              btnId: commonConfig.btnEventsId.save,
              btnType: "primary"
            }
          ]
        },
        {
          itemName: "手动立即发送",
          itemType: "manualSendRightNow", //这种定义主要是未来扩展性考虑，如果有类似添加，可以直接配置
          btnEvents: [
            {
              btnName: "一键发送",
              iconName: "el-icon-message",
              btnId: commonConfig.btnEventsId.sendRightNow,
              btnType: "primary"
            }
          ]
        }
      ]
    };
  },
  methods: {
    handleBtnClick: function(btnId) {
      let btnName = "";
      switch (btnId) {
        case commonConfig.btnEventsId.save:
          btnName = "保存";
          break;
        case commonConfig.btnEventsId.sendRightNow:
          btnName = "一键发送";
          break;
      }
      this.$message({
        message:
          "恭喜你，点击了" +
          btnName +
          "事件，目前该功能正在马不停蹄开发中，敬请期待",
        type: "warning"
      });
    }
  },
  beforeMount: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
