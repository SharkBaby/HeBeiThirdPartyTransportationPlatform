<template>
  <el-dialog
  :title="updatePwd"
  :visible.sync="isShowDialog"
  width="25%"
  :before-close="handleClose"
  class="access-management-dialog-class">
  <el-tree 
    :data="treeOptions" 
    show-checkbox 
    default-expand-all 
    node-key="MenuId"
    ref="tree" 
    highlight-current 
    :props="treeChkboxProps"
    :default-checked-keys="defCheckedKeys"
    @check="handleCheckChange"
    check-strictly></el-tree>
  <div class="access-management-dialog-btn">
    <el-button @click="handleCancel">取 消</el-button>
    <el-button type="primary" @click="submitForm()" class="submitBtn" v-hasAccess= "{accessId: 'jbxx_jsgl_qxpz'}">提交</el-button>
  </div>
  </el-dialog>
</template>
<style src="./accessManagementForm.css" type="text/css">
</style>
<script>
export default {
  name: 'UpdatePwd',
  props: ['accessMgmtVisible', 'treeOps', 'treeChkboxProps', 'formTitle', 'defaultCheckedKeys', 'currentRoleId'],
  data () {
    return {
      updatePwd: this.formTitle,
      treeOptions: this.treeOps,
      checkedAccessArr: [],
      defCheckedKeys: this.defaultCheckedKeys, //当勾选的默认选项改变后，需要子组件响应，重新渲染
    }
  },
  computed: {
    isShowDialog: {
      get: function(){
        return this.accessMgmtVisible
      },
      set: function(isShowDialog){
      }
    },
  },
  watch: {
    treeOps: function(val){
      this.treeOptions = val;
      // this.defaultCheckedKeys = ['2270000','2240000','3110000'];
    },
    //当勾选的默认选项改变后，需要子组件响应，重新渲染
    defaultCheckedKeys: function(val){
      this.defCheckedKeys = val;
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
    handleCheckChange() {
      // (leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点，默认值为 false
      const checkedNodes = this.$refs.tree.getCheckedNodes();//不仅包含子节点
      // const halfCheckedNodes = this.$refs.tree.getHalfCheckedNodes();//获取半勾状态的节点
      this.checkedAccessArr = this.recursiveNode(checkedNodes); //使用ES6的语法将两个数组合并为一个数组
    },
    // 递归查找某一个json对象有没有某一个子节点
    recursiveNode(nodes){
      const menu = [];
      for(let nodeItem of nodes){
        menu.push({
          RightId: 0,
          RoleId: this.currentRoleId.toString(),
          ResourceId: nodeItem.ResourceId.toString(),
          RightKind: 1,
          Comm: '',
          Type: 0,
        })
      }
      return menu;
    }
  }
}
</script>
