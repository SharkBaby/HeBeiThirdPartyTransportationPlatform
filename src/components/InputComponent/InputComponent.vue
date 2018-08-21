<template>
  <div class="input-text noprint">
    <span class="label-name">{{labelName}}</span>
    <!-- 普通输入框 -->
    <el-input v-model="inputCtnt.inputVal" :placeholder="phInput" @blur="emitInputValue(inputCtnt.inputVal)" v-if="typeNumber === 0"></el-input>
    <!-- 远程预搜索 -->
    <el-autocomplete
    v-model="inputCtnt.inputVal"
    :fetch-suggestions="querySearchAsync"
    :placeholder="phInput"
    @select="handleSelect"
    @blur="needClearInput()"
    v-else></el-autocomplete>
  </div>
</template>

<style src="./inputComponent.css" type="text/css">
</style>

<script>
import {
  axiosRequest,
  isNullUndefEmpty,
  storageOperation,
  handleErrorMsg
} from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "InputComponent",
  props: ["labelName", "compVal", "compId", "labelId"],
  data() {
    return {
      getAutoDataListUrl: commonConfig.rootUrl + commonConfig.GetAutoDataList, // 通用接口 - 预搜索
      isPreSearchSelected: true, //判断是否选择了预选框
      typeNumber: 0, //0:普通输入框，1：远程预搜索功能
      // 定义预搜索类型
      preSearchType: [
        {
          labelId: "ZoneId", //1: 地区预搜索
          type: 1
        },
        {
          labelId: "UnitId", //2: 企业预搜索
          type: 2
        },
        {
          labelId: "VehicleId", //3: 车牌号预搜索
          type: 3
        },
        {
          labelId: "PlatformId", //4: 接入平台预搜索
          type: 4
        }
      ],
      inputCtnt: {
        inputVal: this.compVal, //不能在子组件内直接改变传过来的props
        inputId: this.compId
      }
    };
  },
  computed: {
    phInput: function() {
      return "请输入" + this.labelName;
    }
  },
  watch: {
    compVal: function(newVal) {
      this.inputCtnt.inputVal = newVal;
    }
  },
  methods: {
    // Multil-Level预搜索功能
    querySearchAsync(queryString, cb) {
      if(queryString.length <= 0) return ;
      const self = this;
      //2. 设置选择了预选框里面的一条数据的标记位
      this.isPreSearchSelected = false;
      axiosRequest
        .axiosGet(this.getAutoDataListUrl, {
          type: this.typeNumber, // 参数详细设置请参考commonConfig.js的说明
          text: queryString.toString(),
          zoneId: 0,
          queryType: 0
        })
        .then(function(response) {
          const preSearchTemp = [];
          for (let preSearchItem of response.data) {
            preSearchTemp.push({
              value: preSearchItem.Name,
              Id: preSearchItem.Id
            });
          }
          cb(preSearchTemp);
        })
        .catch(function(error) {
          self.$message({
            type: "warning",
            message: handleErrorMsg(error)
          });
        });
    },
    //从预搜索中选择结果
    handleSelect: function(selectedItem) {
      //1. 设置选择了预选框里面的一条数据的标记位
      this.isPreSearchSelected = true;
      //3. 填充到当前输入框
      this.inputCtnt.inputVal = selectedItem.value;
      this.inputCtnt.inputId = selectedItem.Id;
      const preInputValTemp = {
        compId: this.inputCtnt.inputId,
        compVal: this.inputCtnt.inputVal,
        labelId: this.labelId
      };
      this.$emit("inputChange", preInputValTemp); //从预选框里面选取值，然后通知上级组件，不然的话，但输入框失去焦点直接清空当前值
    },
    // 普通输入框-当失去焦点的时候，将输入框中的值提交给父组件，以便于进行查询的条件
    emitInputValue: function(inputVal) {
      const inputValTemp = {
        compId: "",
        compVal: inputVal,
        labelId: this.labelId
      };
      this.$emit("inputChange", inputValTemp);
    },
    needClearInput: function() {
      if (!this.isPreSearchSelected) {
        this.inputCtnt.inputVal = "";
        this.inputCtnt.inputId = "";
        const preInputValTemp = {
          compId: this.inputCtnt.inputId,
          compVal: this.inputCtnt.inputVal,
          labelId: this.labelId
        };
        this.$emit("inputChange", preInputValTemp); //从预选框里面选取值，然后通知上级组件，不然的话，但输入框失去焦点直接清空当前值
      }
    }
  },
  // 判断是普通搜索还是预搜索
  created: function() {
    for (let preSearchItem of this.preSearchType) {
      if (this.labelId === preSearchItem.labelId) {
        this.typeNumber = preSearchItem.type;
        break;
      }
    }
  }
};
</script>

