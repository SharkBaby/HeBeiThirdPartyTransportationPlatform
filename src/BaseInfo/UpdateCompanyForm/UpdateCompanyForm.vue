<template>
  <el-dialog
  :title="updatePwd"
  :visible.sync="usrFedbkdialog"
  width="25%"
  :before-close="handleClose"
  class="role-common-dialog-class">
    <el-form :model="ruleForm2" status-icon label-width="80px">
      <el-form-item :label="formItem.headerVal+ ':'" :prop="formItem.headerKey" v-for="(formItem, formKey) of formColumnNames" :key="formKey">
        <el-select v-model="formItem.compVal" filterable placeholder="请选择" v-if="formItem.columnType === 'select'">
          <el-option v-for="item in formItem.options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <input-component 
          labelName="" 
          :compVal="formItem.compVal"
          :compId="formItem.compId"
          :labelId="formItem.headerKey"
          v-else-if="formItem.columnType === 'preSearch'"
          v-on:inputChange="inputChange"></input-component>
        <el-input v-model="formItem.compVal" auto-complete="off" :placeholder="'请输入' + formItem.headerVal" 
        :disabled="formItem.isReadOnly && (updatePwd ==='修改角色管理信息' || updatePwd ==='修改用户管理信息')" v-else></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')" class="submitBtn">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style src="./updateCompanyForm.css" type="text/css">
</style>
<script>
import InputComponent from "@/components/InputComponent/InputComponent";
export default {
  name: 'UpdatePwd',
  props: ['updateCompanyFormVisible', 'formData', 'formTitle'],
  components: {
    InputComponent
  },
  data () {
    var checkOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'));
      }
    };
    return {
      updatePwd: this.formTitle,
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
      // 定义预搜索类型
      preSearchType: ["ZoneId", "UnitId", "VehicleId", "PlatformId"],
    }
  },
  computed: {
    usrFedbkdialog: {
      get: function(){
        return this.updateCompanyFormVisible
      },
      set: function(newusrFedbkdialog){
      }
    },
    formColumnNames: function(){
      return this.formData;
    }
  },
  methods:{
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          const updateFormData = {
            isVisible: false,
            actionType: 'Cancel',
            formColumnNames: []
          }
          this.$emit('handlUpdateForm', updateFormData);
        })
        .catch(_ => {});
    },
    // handle form submit event,pass the props to parent component
    submitForm(argument){
        const updateFormData = {
          isVisible: false,
          actionType: 'Submit',
          formColumnNames: this.formColumnNames
        }
        this.$emit('handlUpdateForm', updateFormData);
    },
    handleCancel: function(){
      const updateFormData = {
        isVisible: false,
        actionType: 'Cancel',
        formColumnNames: []
      }
      this.$emit('handlUpdateForm', false);
    },
    inputChange: function(msg) {
      this.mapNewToSourceData(msg);
    },
    // 将子组件传上来的最新值赋给对应的数据集封装为一个函数
    mapNewToSourceData: function(msg) {
      for (let columnItem of this.formColumnNames) {
        if (columnItem.headerKey === msg.labelId) {
          if (this.preSearchType.indexOf(msg.labelId) >= 0) {
            columnItem.compVal = msg.compVal;
            columnItem.compId = msg.compId;
          } else columnItem.compVal = msg.compVal;
          break;
        }
      }
    },
  }
}
</script>
