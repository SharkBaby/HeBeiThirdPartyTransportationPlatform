<template>
  <el-dialog
  :title="dialogFormTitle"
  :visible.sync="isShowDialog"
  :before-close="handleClose"
  class="role-management-dialog-class">
  <el-table 
    ref="checkboxRoleTable"
    :data="roleMgmtTabCtntList.TabCtnt"
    tooltip-effect="dark"
    style="width: 100%" 
    :default-sort="{prop: 'date', order: 'descending'}"
    height="400"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column :prop="tabHeaderItem.headerKey" :label="tabHeaderItem.headerVal" sortable v-for="(tabHeaderItem,tabHeaderKey) in roleMgmtTabCtntList.tabHeader" :key="tabHeaderKey">
    </el-table-column>
  </el-table>
  <div class="role-management-dialog-btn">
    <el-button @click="handleCancel">取 消</el-button>
    <el-button type="primary" @click="submitForm()" class="submitBtn">提交</el-button>
  </div>
  </el-dialog>
</template>
<style src="./roleManagementForm.css" type="text/css">
</style>
<script>
export default {
  name: 'RoleManagementForm',
  props: ['roleMgmtVisible', 'formTitle', 'roleMgmtTabCtntList', 'currentUserId', 'defaultCheckedRoles'],
  data () {
    return {
      checkedAccessArr: [],
    }
  },
  computed: {
    isShowDialog: {
      get: function(){
        return this.roleMgmtVisible
      },
      set: function(isShowDialog){
      }
    },
    dialogFormTitle: {
      get: function(){
        return this.formTitle
      },
      set: function(dialogFormTitle){
      }
    }
  },
  watch: {
    defaultCheckedRoles: function(val){
      let self = this;
      // 经过一个上午的艰苦尝试，终于通过以下方式来将默认选项勾选上，
      // 设计思路：需要将table加载完成再去勾选默认选项
      setTimeout(()=>{
        val.forEach(rowItem => {
          this.$refs.checkboxRoleTable.toggleRowSelection(rowItem, true);
        });
      }, 500)
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
          checkedAccessArr: this.checkedAccessArr
        }
        this.$emit('handlUpdateForm', updateFormData);
    },
    handleCancel: function(){
      const updateFormData = {
        isVisible: false,
        actionType: 'Cancel',
        checkedAccessArr: []
      }
      this.$emit('handlUpdateForm', false);
    },
    // 每一次勾选都会触发这个函数，返回的是最新的所有勾选的函数
    handleSelectionChange(val) {
      /**
       * Code: roleResponse.Code,
        Name: roleResponse.Name,
        Role: roleResponse.Role,
        RoleId: roleResponse.RoleId,
        State: roleResponse.State
       */
      this.checkedAccessArr = [];
     for(let checkedRowItem of val){
       this.checkedAccessArr.push({
          UserId: this.currentUserId,
          RoleId: checkedRowItem.RoleId
       });
     }
    },
    isSelectedRole: function(row, index){
      return row.isSelectedRole;
    }
  }
}
</script>
