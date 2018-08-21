<template>
  <el-row class="random-check-config">
    <bread-crumb-component :breadNavs="breadNavs"></bread-crumb-component>
    <hr>
    <el-col :span="10" class="email-config-item-box">
      <el-row class="platform-check-sentry-time" v-for="(randomChkItem, randomChkKey) of randomChkItems" :key="randomChkKey" v-if="randomChkItem.itemType === 'checkSequence'">
        <label class="label-name">{{randomChkItem.itemName}}</label>
        <el-row v-for="(chkSeqItem, chkSeqKey) of randomChkItem.sequence" :key="chkSeqKey" class="config-reminder-item-subitem">
          <el-radio :label="chkSeqItem.value" v-model="randomChkItem.sequenceSelected" class="random-check-config-radio">{{chkSeqItem.sequenceName}}</el-radio>
          <label class="label-name">{{chkSeqItem.preText}}</label>
          <input-number-component :inputNumber="chkSeqItem.times"></input-number-component>
          <label class="label-name">{{chkSeqItem.afterText}}</label>
        </el-row>
      </el-row>
      <el-row class="platform-check-sentry-time" v-else-if="randomChkItem.itemType === 'checkProjectCustomize'">
        <label class="label-name">{{randomChkItem.itemName}}</label>
        <el-row class="random-check-config-btngrp">
          <el-button 
          :type="btnItem.btnType"
          :icon="btnItem.iconName" 
          v-for="(btnItem, btnKey) of randomChkItem.btnEvents" 
          :key="btnKey" 
          @click="handleBtnClick(btnItem.btnId)" 
          class="btn-com">{{btnItem.btnName}}</el-button>
        </el-row>
        <el-input v-model="randomChkItem.newItem" placeholder="目前不清楚该输入框的作用，待确认"></el-input>
      </el-row>
      <el-row class="random-check-config-btngrp">
        <el-button 
        :type="btnItem.btnType"
        :icon="btnItem.iconName" 
        v-for="(btnItem, btnKey) of btnEvents"
        :key="btnKey" 
        @click="handleBtnClick(btnItem.btnId)" 
        class="btn-com">{{btnItem.btnName}}</el-button>
      </el-row>
    </el-col>
    <el-col :span="8" class="email-config-item-box">
      <el-row class="system-randomCheckConfig-item-box">
        <el-row v-for="(systemItem, systemKey) of systemItems" :key="systemKey">
          <label class="label-name">{{systemItem.systemName}}</label>
        </el-row>
      </el-row>
      <el-row class="system-randomCheckConfig-explain">
        <p>类型名称：企业数据\11.隐患排查与治理\隐患排查检查项目（021102）</p>
        <p>数值类型：字符（最大长度20）</p>
        <p>备注说明：隐患排查检查项目</p>
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
        allCity: "allCity",
        customizeCounty: "customizeCounty"
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
            path: "/Home/SystemConfig/RandomCheckConfig"
          },
          toName: "随机抽查配置"
        }
      ],
      sequenceSelected: "",
      randomChkItems: [
        {
          itemName: "抽查频次",
          itemType: "checkSequence", //这种定义主要是未来扩展性考虑，如果有类似添加，可以直接配置
          sequence: [
            {
              value: "month",
              sequenceName: "按月",
              preText: "每月",
              times: 4,
              afterText: "次"
            },
            {
              value: "week",
              sequenceName: "按周",
              preText: "每周",
              times: 4,
              afterText: "次"
            }
          ]
        },
        {
          itemName: "检查项目自定义",
          itemType: "checkProjectCustomize", //这种定义主要是未来扩展性考虑，如果有类似添加，可以直接配置
          btnEvents: [
            {
              btnName: "新增",
              iconName: "el-icon-circle-plus-outline",
              btnId: commonConfig.btnEventsId.add,
              btnType: "primary"
            },
            {
              btnName: "修改",
              iconName: "el-icon-edit",
              btnId: commonConfig.btnEventsId.edit,
              btnType: "info"
            },
            {
              btnName: "删除",
              iconName: "el-icon-remove-outline",
              btnId: commonConfig.btnEventsId.delete,
              btnType: "danger"
            }
          ],
          newItem: 4
        }
      ],
      btnEvents: [
        {
          iconName: "",
          btnName: "确认",
          btnId: commonConfig.btnEventsId.confirm,
          btnType: "primary"
        },
        {
          iconName: "",
          btnName: "取消",
          btnId: commonConfig.btnEventsId.cancel,
          btnType: "info"
        }
      ],
      systemItems: [{
        systemName: '综合安全' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '文件贯彻' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '制度落实' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '责任落实' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '派车制度' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '例检制度' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '报班制度' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '出站制度' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '危货安全' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '工业安全' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '操作规程' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '后勤物业' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '治安消防' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '营运客车事故例查' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（客运）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（客运站）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（危货）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（普货）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（公交）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（出租）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（工业）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（监测）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（驾校）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（消防治安）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '春运安全（后勤物业）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（客运）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（客运站）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（危货）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（普货）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（公交）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（出租）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（工业）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（监测）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（驾校）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（消防治安）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '五一安全（后勤物业）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（客运）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（客运站）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（危货）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（普货）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（公交）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（出租）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（工业）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（监测）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（驾校）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（消防治安）' //先保留这种格式，后期可以根据需要加上其他的属性
      },{
        systemName: '十一安全（后勤物业）' //先保留这种格式，后期可以根据需要加上其他的属性
      }]
    };
  },
  methods: {
    handleBtnClick: function(btnId) {
      let btnName = "";
      switch (btnId) {
        case commonConfig.btnEventsId.add:
          btnName = "新增";
          break;
        case commonConfig.btnEventsId.edit:
          btnName = "修改";
          break;
        case commonConfig.btnEventsId.delete:
          btnName = "删除";
          break;
        case commonConfig.btnEventsId.confirm:
          btnName = "确认";
          break;
        case commonConfig.btnEventsId.cancel:
          btnName = "取消";
          break;
        default:
          btnName = "Nothing";
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
