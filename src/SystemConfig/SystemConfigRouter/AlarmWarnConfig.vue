<template>
  <el-row class="email-config">
    <bread-crumb-component :breadNavs="breadNavs"></bread-crumb-component>
    <hr>
    <el-col :span="17" class="email-config-item-box">
      <el-row class="platform-check-sentry-time" v-for="(randomChkItem, randomChkKey) of randomChkItems" :key="randomChkKey" v-if="randomChkItem.itemType === settingType.alarmWarnConfig">
        <!-- 警情提醒配置 -->
        <label class="label-name">{{randomChkItem.itemName}}</label>
        <el-row v-for="(configReminderItem, configReminderKey) of randomChkItem.configReminders" :key="configReminderKey" class="config-reminder-item">
          <el-row>
            <!-- 车台提醒 -->
            <label class="label-name">{{configReminderItem.reminderName}}</label>
          </el-row>
          <el-row v-for="(reminderItem, reminderKey) of configReminderItem.reminderItems" :key="reminderKey" class="config-reminder-item-subitem">
            <!-- 高速/非高速 -->
            <label class="label-name">{{reminderItem.itemName}}</label>
            <label class="label-name">{{reminderItem.preText}} >=</label>
            <input-number-component :inputNumber="reminderItem.rateNumber"></input-number-component>
            <label class="label-name">{{reminderItem.afterText}}</label>
            <el-row class="reminder-item-duration">
              <label class="label-name">{{reminderItem.right_preText}} >=</label>
              <input-number-component :inputNumber="reminderItem.right_rateNumber"></input-number-component>
              <label class="label-name">{{reminderItem.right_afterText}}</label>
            </el-row>
          </el-row>
          <!-- 备注 -->
          <label class="label-name">{{configReminderItem.comment}}</label>
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
        alarmWarnConfig: "alarmWarnConfig"
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
            path: "/Home/SystemConfig/AlarmWarnConfig"
          },
          toName: "警情提醒配置"
        }
      ],
      sequenceSelected: "",
      randomChkItems: [
        {
          itemName: "警情提醒配置",
          itemType: "alarmWarnConfig", //这种定义主要是未来扩展性考虑，如果有类似添加，可以直接配置
          configReminders: [
            {
              reminderName: "车台提醒：",
              reminderItems: [
                {
                  itemName: "高速：",
                  preText: "超速率",
                  rateNumber: 0,
                  afterText: "%",
                  right_preText: "超速持续时长",
                  right_rateNumber: 0,
                  right_afterText: "秒"
                },
                {
                  itemName: "非高速：",
                  preText: "超速率",
                  rateNumber: 0,
                  afterText: "%",
                  right_preText: "超速持续时长",
                  right_rateNumber: 0,
                  right_afterText: "秒"
                }
              ],
              comment: '(注：当车辆超速达到以上条件后，会自动提醒到车台设备)'
            },
            {
              reminderName: "短信提醒：",
              reminderItems: [
                {
                  itemName: "高速：",
                  preText: "超速率",
                  rateNumber: 0,
                  afterText: "%",
                  right_preText: "超速持续时长",
                  right_rateNumber: 0,
                  right_afterText: "秒"
                },
                {
                  itemName: "非高速：",
                  preText: "超速率",
                  rateNumber: 0,
                  afterText: "%",
                  right_preText: "超速持续时长",
                  right_rateNumber: 0,
                  right_afterText: "秒"
                }
              ],
              comment: '(注：当车辆超速达到以上条件后，会自动下发短信给运输企业安管人员)'
            },
            {
              reminderName: "严重短信提醒：",
              reminderItems: [
                {
                  itemName: "高速：",
                  preText: "超速率",
                  rateNumber: 0,
                  afterText: "%",
                  right_preText: "超速持续时长",
                  right_rateNumber: 0,
                  right_afterText: "秒"
                },
                {
                  itemName: "非高速：",
                  preText: "超速率",
                  rateNumber: 0,
                  afterText: "%",
                  right_preText: "超速持续时长",
                  right_rateNumber: 0,
                  right_afterText: "秒"
                }
              ],
              comment: '(注：当车辆超速达到以上条件后，会自动下发短信给运输企业安管人员,并且推送给违章督办功能)'
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
        default:
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
