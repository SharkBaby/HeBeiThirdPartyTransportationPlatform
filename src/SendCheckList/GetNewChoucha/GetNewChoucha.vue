<template>
  <el-dialog
  :title="updatePwd"
  :visible.sync="getNewChouchaDialogVisible"
  width="25%"
  :before-close="handleClose"
  class="get-new-choucha">
    <el-form :model="ruleForm2" status-icon label-width="100px">
      <el-form-item :label="formItem.headerVal+ ':'" :prop="formItem.headerKey" v-for="(formItem, formKey) of formColumnNames" :key="formKey">
        <el-input v-model="ruleForm2.oldpass" auto-complete="off" :placeholder="'请输入' + formItem.headerVal"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('ruleForm2')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')" class="submitBtn">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style src="./getNewChoucha.css" type="text/css">
</style>
<script>
export default {
  name: 'GetNewChoucha',
  props: ['getNewChouchaVisible', 'columnName'],
  data () {
    var checkOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'));
      }
    };
    return {
      updatePwd: '增加检查单',
      labelPosition: 'right',
      ruleForm2: {
        oldpass: '',
        newpass: '',
        checkPass: '',
      },
      rules2: {
        oldpass: [
            { validator: checkOldPass, trigger: 'blur'}
        ],
      },
    }
  },
  computed: {
    getNewChouchaDialogVisible: {
      get: function(){
        return this.getNewChouchaVisible
      },
      set: function(newgetNewChouchaVisible){
      }
    },
    formColumnNames: function(){
      return this.columnName;
    }
  },
  methods:{
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.$emit('handleCloseEvent', false);
        })
        .catch(_ => {});
    },
    // handle form submit event,pass the props to parent component
    submitForm(argument){
        this.$emit('handleCloseEvent', false);
    }
  }
}
</script>
