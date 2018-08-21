<template>
  <div class="system-config">
    <vertical-menu :navMenu="navMenu" v-on:viewIn = "viewIn"></vertical-menu>
  </div>
</template>
<style src="./systemConfig.css" type="text/css"></style>
<script>
import VerticalMenu from "@/components/VerticalMenu/VerticalMenu";
import { storageOperation } from "@/common/common";
export default {
  name: "SystemConfig",
  components: {
    VerticalMenu
  },
  data() {
    return {
      navMenu: [
        {
          navTitle: "系统配置",
          indexNumber: "systemConfig",
          ctrlId: 'txsz_xtpz', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
          navItems: [
            {
              routerLink: "/Home/SystemConfig/RandomCheckConfig",
              linkName: "随机抽查配置",
              indexNumber: "sysConfig_randomCheckConfig",
              ctrlId: 'txsz_xtpz_sjccpz', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/SystemConfig/EmailSysconfig",
              linkName: "邮件推送配置",
              indexNumber: "sysConfig_emailSysconfig",
              ctrlId: 'txsz_xtpz_yjtspz', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/SystemConfig/AlarmWarnConfig",
              linkName: "警情提醒配置",
              indexNumber: "sysConfig_alarmWarnConfig",
              ctrlId: 'txsz_xtpz_jqtxpz', //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
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
