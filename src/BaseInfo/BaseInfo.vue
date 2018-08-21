<template>
  <div class="base-info">
    <vertical-menu :navMenu="navMenu" v-on:viewIn = "viewIn"></vertical-menu>
  </div>
</template>
<style src="./baseInfo.css" type="text/css"></style>
<script>
import VerticalMenu from "@/components/VerticalMenu/VerticalMenu";
import { storageOperation } from "@/common/common";
// 引入权限控制的文件
import { $_hasAccess } from "@/accessmanagement/accessmanagement";
export default {
  name: "BaseInfo",
  components: {
    VerticalMenu
  },
  data() {
    return {
      navMenu: [
        {
          navTitle: "基本信息",
          indexNumber: "base_info_list",
          ctrlId: 'jbxx', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          navItems: [
            {
              routerLink: "/Home/BaseInfo/Vehicle",
              linkName: "车辆管理",
              indexNumber: "jbxx_clgl",
              ctrlId: 'jbxx_clgl', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/BaseInfo/Company",
              linkName: "运输企业管理",
              indexNumber: "jbxx_ysqygl",
              ctrlId: 'jbxx_ysqygl', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/BaseInfo/UserInfo",
              linkName: "用户管理",
              indexNumber: "jbxx_yhgl",
              ctrlId: 'jbxx_yhgl', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/BaseInfo/DriverInfo",
              linkName: "驾驶员管理",
              indexNumber: "jbxx_jsygl",
              ctrlId: 'jbxx_jsygl', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/BaseInfo/Role",
              linkName: "角色管理",
              indexNumber: "jbxx_jsgl",
              ctrlId: 'jbxx_jsgl', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            }
          ]
        }
      ]
    };
  },
  methods: {
    viewIn: function(msg) {
      this.$emit("viewIn", msg);
    }
  },
  mounted: function() {
    const breadNavs = JSON.parse(storageOperation.getItem("breadNavs"));
    this.$emit("viewIn", breadNavs);
  }
};
</script>
