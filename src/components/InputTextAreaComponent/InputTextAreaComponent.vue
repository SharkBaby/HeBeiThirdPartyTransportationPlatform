<template>
  <el-row class="input-textarea noprint">
    <el-col :span="3" class="textarea-label-row">
      <span class="textarea-label-name">{{labelName}}</span>
    </el-col>
    <el-col :span="21">
      <el-input type="textarea" :rows="3" v-model="inputCtnt.inputVal" :placeholder="phInput"></el-input>
    </el-col>
  </el-row>
</template>

<style src="./inputTextAreaComponent.css" type="text/css">
</style>

<script>
export default {
  name: "InputComponent",
  props: ["labelName", "compVal", "labelId"],
  data() {
    return {};
  },
  computed: {
    phInput: function() {
      return "请输入" + this.labelName;
    },
    inputCtnt: function() {
      return {
        inputVal: this.compVal //不能在子组件内直接改变传过来的props
      };
    }
  }
};
</script>

