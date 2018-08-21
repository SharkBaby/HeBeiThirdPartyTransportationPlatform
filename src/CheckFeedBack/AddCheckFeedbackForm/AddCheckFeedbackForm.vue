<template>
  <el-dialog
  :title="updatePwd"
  :visible.sync="usrFedbkdialog"
  width="25%"
  :before-close="handleClose"
  class="dialog-class">
    <el-form :model="ruleForm2" status-icon label-width="80px">
      <el-form-item :label="formItem.headerVal+ ':'" :prop="formItem.headerKey" v-for="(formItem, formKey) of formColumnNames" :key="formKey">
        <el-input v-model="ruleForm2.oldpass" auto-complete="off" :placeholder="'请输入' + formItem.headerVal"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')" class="submitBtn">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style src="./addCheckFeedbackForm.css" type="text/css">
</style>
<script>
export default {
  name: 'UpdatePwd',
  props: ['addchkfdbkformVisible', 'columnName'],
  data () {
    var checkOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'));
      }
    };
    return {
      updatePwd: '新增检查回执单',
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
    usrFedbkdialog: {
      get: function(){
        return this.addchkfdbkformVisible
      },
      set: function(newusrFedbkdialog){
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
          this.$emit('handleAddEvent', false);
          done();
        })
        .catch(_ => {});
    },
    // handle form submit event,pass the props to parent component
    submitForm(argument){
        this.$emit('handleAddEvent', false);
    }
  }
}
</script>
