<template>
  <el-dialog title="安全检查单-2017120301" :visible.sync="viewOptionDialogVisible" :width="width" :before-close="handleClose" class="view-option-detail" center>
    <el-row class="viewtitle">
      <img src="../../assets/Views/SendCheckList/viewtitle.png">
      <label>查看检查记录</label>
    </el-row>
    <el-row class="viewprint">
      <img src="../../assets/Views/SendCheckList/viewprint.png">
      <label>整改通知书</label>
    </el-row>
    <el-row>
      <el-col :span="8">
        <p>检查时间：2017-12-12</p>
        <p>本次抽查项目项目--<b>治安消防/冬季安全/操作规程</b></p>
      </el-col>
      <el-col :span="8">
        <p><b>受检单位：河北健芯运输有限公司</b></p>
      </el-col>
      <el-col :span="8">
        <p style="display:inline-block;">检查组长：
          <font color="#0083D3">詹开平</font>
        </p>
        <p style="display:inline-block;margin:auto 24px;">副组长：
          <font color="#0083D3">张小二</font>
        </p>
        <p>检查成员：
          <font color="#0083D3">吴延兴、胡公维、孙艳、冯德牛</font>
        </p>
      </el-col>
    </el-row>
    <el-row class="view-option-body-content">
      <el-col :span="16" class="view-option-body-left">
        <el-row>
          <p>检查信息</p>
          <select-component :options="checkInfoItem.options" :labelName="checkInfoItem.labelName" :compVal="checkInfoItem.compVal" :labelId="checkInfoItem.labelId" v-if="checkInfoItem.searchType === searchType.select" v-for="(checkInfoItem, checkInfoKey) of checkInfo"
            :key="checkInfoKey"></select-component>
          <input-component :labelName="checkInfoItem.labelName" :compVal="checkInfoItem.compVal" :compId="checkInfoItem.compId" :labelId="checkInfoItem.labelId" v-else-if="checkInfoItem.searchType === searchType.input"></input-component>
          <input-text-area-component :labelName="checkInfoItem.labelName" :compVal="checkInfoItem.compVal" :labelId="checkInfoItem.labelId" v-else-if="checkInfoItem.searchType === searchType.textarea"></input-text-area-component>
        </el-row>
      </el-col>
      <el-col :span="8" class="view-option-body-right">
        <p>附件上传</p>
        <el-row class="email-config-btngrp">
          <el-button :type="btnItem.btnType" :icon="btnItem.iconName" v-for="(btnItem, btnKey) of fileUpload.btnEvents" :key="btnKey" @click="handleBtnClick(btnItem.btnId)" class="btn-com">{{btnItem.btnName}}</el-button>
        </el-row>
        <el-row>
          <el-col :span="8" v-for="(imgItem, imgKey) of fileUpload.imgResource" :key="imgKey">
            <img :src="imgItem.imgSrc">
            <p>{{imgItem.imgName}}</p>
          </el-col>
        </el-row>
        <p class="comment-note">{{fileUpload.commentNotes}}</p>
      </el-col>
    </el-row>
    <el-row>
      <el-button class="sendchecklist-view-bottom sendchecklist-view-basic" @click="handleBtnClick('sendchecklist_view_bottom')">
        <img src="../../assets/Views/SendCheckList/viewpoint.png">
        <label>检查人员手机推送</label>
      </el-button>
      <el-button class="sendchecklist-view-save sendchecklist-view-basic" @click="handleBtnClick('sendchecklist_view_save')">
        <img src="../../assets/Views/SendCheckList/viewright.png">
        <label>提交本次检查结果</label>
      </el-button>
    </el-row>
  </el-dialog>
</template>

<style src="./viewOptionDetail.css" type="text/css">
</style>

<script>
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import InputComponent from "@/components/InputComponent/InputComponent";
import InputTextAreaComponent from "@/components/InputTextAreaComponent/InputTextAreaComponent";
import { commonConfig, searchType } from "@/config/commonConfig";
export default {
  name: "ViewOptionDetail",
  props: ["viewOptionVisible"],
  components: {
    SelectComponent,
    InputComponent,
    InputTextAreaComponent
  },
  data: function() {
    return {
      searchType: {
        input: "input",
        select: "select",
        checkbox: "checkbox",
        singleChkbox: "singleChkbox",
        singleDayPicker: "singleDayPicker", //单个选择天的日期组件
        singleDatePicker: "singleDatePicker", //单个年份，月份日期组件
        fromTodatePicker: "fromTodatePicker",
        treeCheckbox: "treeCheckbox",
        textarea: "textarea" //双随机抽查-查看选项详情-多行输入框
      },
      width: "70%",
      fileUpload: {
        btnEvents: [
          {
            btnName: "新增",
            iconName: "el-icon-circle-plus-outline",
            btnId: commonConfig.btnEventsId.add,
            btnType: "primary"
          },
          {
            btnName: "删除",
            iconName: "el-icon-remove-outline",
            btnId: commonConfig.btnEventsId.delete,
            btnType: "danger"
          }
        ],
        imgResource: [
          {
            imgSrc: "/static/viewtemp0.png",
            imgName: "展示图片1"
          },
          {
            imgSrc: "/static/viewtemp1.png",
            imgName: "展示图片2"
          },
          {
            imgSrc: "/static/viewtemp0.png",
            imgName: "展示图片3"
          }
        ],
        commentNotes: "3/10张"
      }
    };
  },
  computed: {
    viewOptionDialogVisible: {
      get: function() {
        return this.viewOptionVisible;
      },
      set: function(viewOptionVisible) {}
    },
    checkInfo: function() {
      return [
        {
          searchType: this.searchType.select,
          labelName: "检查状态",
          labelId: "checkStatus",
          compVal: "",
          options: [
            {
              label: "重大隐患",
              value: 0x01
            } //value为假数据，后期需要修改维护
          ]
        },
        {
          searchType: this.searchType.select,
          labelName: "整改难易度",
          labelId: "simpleHard",
          compVal: "",
          options: [
            {
              label: "一般",
              value: 0x01
            } //value为假数据，后期需要修改维护
          ]
        },
        {
          searchType: this.searchType.select,
          labelName: "整改时限",
          labelId: "times",
          compVal: "",
          options: [
            {
              label: "7天",
              value: 0x01
            } //value为假数据，后期需要修改维护
          ]
        },
        {
          searchType: this.searchType.select,
          labelName: "监督部门",
          labelId: "department",
          compVal: "",
          options: [
            {
              label: "重大隐患",
              value: 0x01
            } //value为假数据，后期需要修改维护
          ]
        },
        {
          searchType: searchType.input,
          labelName: "整改责任人",
          labelId: "responsibility",
          compVal: "贾敬业"
        },
        {
          searchType: searchType.textarea,
          labelName: "检查内容",
          labelId: "checkContent",
          compVal:
            "各项基础设备是否完好；是否按时检修更新；紧急出口是否畅通无阻"
        },
        {
          searchType: searchType.textarea,
          labelName: "检查结果",
          labelId: "checkResult",
          compVal:
            "1.例保安监室顶棚腐朽，存在安全隐患，要求限期整改；" +
            "2.候车大厅清洁间门坏，要求限期整改；" +
            "3.候车大厅清洁间正门未安装栅栏，存在安全隐患，要求限期整改；" +
            "4.候车大厅小卖部货箱堵塞消火栓，导致消防通道不畅通"
        },
        {
          searchType: this.searchType.textarea,
          labelName: "整改意见及要求",
          labelId: "opinionRequirement",
          compVal: "立即通知驾驶员更新安全锤，才给发班"
        }
      ];
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
          this.$emit("handleCloseEvent", false);
        })
        .catch(_ => {});
    },
    // handle form submit event,pass the props to parent component
    submitForm(argument) {
      this.$emit("handleCloseEvent", false);
    },
    handleBtnClick: function(btnId) {
      let btnName = "";
      switch (btnId) {
        case commonConfig.btnEventsId.add:
          btnName = "增加";
          break;
        case commonConfig.btnEventsId.delete:
          btnName = "删除";
          break;
        case commonConfig.btnEventsId.sendchecklist_view_bottom:
          btnName = "检查人员手机推送";
          break;
        case commonConfig.btnEventsId.sendchecklist_view_save:
          btnName = "提交本次检查结果";
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
  }
};
</script>
