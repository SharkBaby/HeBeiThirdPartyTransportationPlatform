<template>
  <div class="report">
    <vertical-menu :navMenu="navMenu" v-on:viewIn = "viewIn"></vertical-menu>
  </div>
</template>

<style src="./Report.css" type="text/css">
</style>

<script>
import VerticalMenu from "@/components/VerticalMenu/VerticalMenu";
import { storageOperation } from "@/common/common";
// 引入权限控制的文件
import { $_hasAccess } from "@/accessmanagement/accessmanagement";
export default {
  name: "Report",
  components: {
    VerticalMenu
  },
  data() {
    return {
      navMenu: [
        {
          navTitle: "车辆统计",
          indexNumber: "tjfx_cltj",
          ctrlId: "tjfx_cltj",
          navItems: [
            {
              routerLink: "/Home/Report/VehicleInstall",
              linkName: "车辆安装数",
              indexNumber: "tjfx_clazs",
              ctrlId: "tjfx_clazs" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/Report/VehicleOnline",
              linkName: "车辆在线率",
              indexNumber: "tjfx_clzxl",
              ctrlId: "tjfx_clzxl" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/Report/VehicleUplineRate",
              linkName: "车辆上线统计",
              indexNumber: "tjfx_clsxtj",
              ctrlId: "tjfx_clsxtj" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/Report/CurrentOnline",
              linkName: "车辆实时在线情况",
              indexNumber: "tjfx_clsszxqk",
              ctrlId: "tjfx_clsszxqk" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/Report/AlarmSupervision",
              linkName: "车辆报警督办统计",
              indexNumber: "tjfx_clbjdbtj",
              ctrlId: "tjfx_clbjdbtj" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            // {
            //   routerLink: "/Home/Report/VehicleQualification",
            //   linkName: "车辆资质统计",
            //   indexNumber: "tjfx_clzztj",
            //   ctrlId: "tjfx_clzztj" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            // },
            {
              routerLink: "/Home/Report/AlarmDeal",
              linkName: "违章处理统计",
              indexNumber: "tjfx_wzcltj",
              ctrlId: "tjfx_wzcltj" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            },
            {
              routerLink: "/Home/Report/AlarmPush",
              linkName: "警情推送统计",
              indexNumber: "tjfx_jqtstj",
              ctrlId: "tjfx_jqtstj" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
            }
            // {
            //   routerLink: "/Home/Report/VehicleInspect",
            //   linkName: "巡检报表",
            //   indexNumber: "VehicleInspect"
            // }
          ]
        },
        // {
        //   navTitle: "违章统计",
        //   indexNumber: "tjfx_wztj",
        //   // ctrlId: "tjfx_wztj",
        //   navItems: [
        //     {
        //       routerLink: "/Home/Report/AlarmDeal",
        //       linkName: "违章处理统计",
        //       indexNumber: "tjfx_wzcltj",
        //       // ctrlId: "tjfx_wzcltj" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
        //     },
        //     {
        //       routerLink: "/Home/Report/AlarmPush",
        //       linkName: "警情推送统计",
        //       indexNumber: "tjfx_jqtstj",
        //       // ctrlId: "tjfx_jqtstj" //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
        //     }
        //   ]
        // },
        // 注释人：向浩
        // 注释时间：2018-07-03
        // 注释原因：因为后台接口缺失，暂时屏蔽入口链接
        // {
        //   navTitle: "企业统计",
        //   indexNumber: "report_safe",
        //   navItems: [
        //     {
        //       routerLink: "/Home/Report/SafeMark",
        //       linkName: "安全标准分数统计",
        //       indexNumber: "SafeMark"
        //     },
        //     {
        //       routerLink: "/Home/Report/BreakRulesDeal",
        //       linkName: "违章处罚统计",
        //       indexNumber: "BreakRulesDeal"
        //     },
        //     {
        //       routerLink: "/Home/Report/PublicityEducation",
        //       linkName: "企业宣传教育统计",
        //       indexNumber: "PublicityEducation"
        //     },
        //     {
        //       routerLink: "/Home/Report/HiddenDanger",
        //       linkName: "企业隐患排查统计",
        //       indexNumber: "HiddenDanger"
        //     },
        //     {
        //       routerLink: "/Home/Report/AccidentReport",
        //       linkName: "企业事故报告统计",
        //       indexNumber: "AccidentReport"
        //     }
        //   ]
        // },
        // {
        //   navTitle: "客运站统计",
        //   indexNumber: "report_station",
        //   navItems: [
        //     {
        //       routerLink: "/Home/Report/SafeCheck",
        //       linkName: "客运站安全检查统计",
        //       indexNumber: "SafeCheck"
        //     }
        //   ]
        // },
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
