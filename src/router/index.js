import Vue from 'vue'
import Router from 'vue-router'
// 把组件按组分块，在打包的时候可以分块加载，使用webpack的代码分离
// import Home from '@/Home/Home'
const Home = ()=>import(/* webpackChunkName: "Home" */ '@/Home/Home')
// import MsgCount from '@/MsgCount/MsgCountPage'
const MsgCount = () => import (/* webpackChunkName: "MsgCount" */ '@/MsgCount/MsgCountPage')
// import Login from '@/Login/LoginPage'
const Login = () => import ( /* webpackChunkName: "Login" */ '@/Login/LoginPage')
// import BodyContent from '@/Home/container/BodyContent/BodyContent'
const BodyContent = () => import ( /* webpackChunkName: "BodyContent" */ '@/Home/container/BodyContent/BodyContent')
// import ServerMonitor from '@/ServerMonitor/ServerMonitor'
const ServerMonitor = () =>
  import ( /* webpackChunkName: "ServerMonitor" */ '@/ServerMonitor/ServerMonitor')
// import LoginServer from '@/ServerMonitor/ServerMonitorRouter/LoginServer'
const LoginServer = () =>
  import ( /* webpackChunkName: "LoginServer" */ '@/ServerMonitor/ServerMonitorRouter/LoginServer')
// import AnalyseServer from '@/ServerMonitor/ServerMonitorRouter/AnalyseServer'
const AnalyseServer = () =>
  import ( /* webpackChunkName: "AnalyseServer" */ '@/ServerMonitor/ServerMonitorRouter/AnalyseServer')
// import CalcServer from '@/ServerMonitor/ServerMonitorRouter/CalcServer'
const CalcServer = () =>
  import ( /* webpackChunkName: "CalcServer" */ '@/ServerMonitor/ServerMonitorRouter/CalcServer')
// import PlatformCourse from '@/PlatformCourse/PlatformCourse'
const PlatformCourse = () =>
  import ( /* webpackChunkName: "PlatformCourse" */ '@/PlatformCourse/PlatformCourse')
// import BaseInfo from '@/BaseInfo/BaseInfo'
const BaseInfo = () =>
  import ( /* webpackChunkName: "BaseInfo" */ '@/BaseInfo/BaseInfo')
// import Vehicle from '@/BaseInfo/BaseInfoRouter/Vehicle'
const Vehicle = () =>
  import ( /* webpackChunkName: "Vehicle" */ '@/BaseInfo/BaseInfoRouter/Vehicle')
// import Company from '@/BaseInfo/BaseInfoRouter/Company'
const Company = () =>
  import ( /* webpackChunkName: "Company" */ '@/BaseInfo/BaseInfoRouter/Company')
// import UserInfo from '@/BaseInfo/BaseInfoRouter/UserInfo'
const UserInfo = () =>
  import ( /* webpackChunkName: "UserInfo" */ '@/BaseInfo/BaseInfoRouter/UserInfo')
// import DriverInfo from '@/BaseInfo/BaseInfoRouter/DriverInfo'
const DriverInfo = () =>
  import ( /* webpackChunkName: "DriverInfo" */ '@/BaseInfo/BaseInfoRouter/DriverInfo')
// import Role from '@/BaseInfo/BaseInfoRouter/Role'
const Role = () =>
  import ( /* webpackChunkName: "Role" */ '@/BaseInfo/BaseInfoRouter/Role')
// SystemConfig
// import SystemConfig from '@/SystemConfig/SystemConfig'
// import RandomCheckConfig from '@/SystemConfig/SystemConfigRouter/RandomCheckConfig'
// import EmailSysconfig from '@/SystemConfig/SystemConfigRouter/EmailSysconfig'
// import AlarmWarnConfig from '@/SystemConfig/SystemConfigRouter/AlarmWarnConfig'
// 对SystemConfig进行分组打包
const SystemConfig = () => import ( /* webpackChunkName: "SystemConfig" */ '@/SystemConfig/SystemConfig')
const RandomCheckConfig = () => import ( /* webpackChunkName: "SystemConfig" */ '@/SystemConfig/SystemConfigRouter/RandomCheckConfig')
const EmailSysconfig = () => import ( /* webpackChunkName: "SystemConfig" */ '@/SystemConfig/SystemConfigRouter/EmailSysconfig')
const AlarmWarnConfig = () => import ( /* webpackChunkName: "SystemConfig" */ '@/SystemConfig/SystemConfigRouter/AlarmWarnConfig')
// Monitor
// import Monitor from '@/Monitor/Monitor'
const Monitor = () => import ( /* webpackChunkName: "Monitor" */ '@/Monitor/Monitor')

// 考核通报
// import CheckManage from '@/CheckManage/CheckManage'
// import ZoneCheckRank from '@/CheckManage/CheckManageRouter/ZoneCheckRank'
// import ZoneCheckPrint from '@/CheckManage/CheckManageRouter/ZoneCheckPrint'
// import CompanyCheckRank from '@/CheckManage/CheckManageRouter/CompanyCheckRank'
// import CompanyCheckPrint from '@/CheckManage/CheckManageRouter/CompanyCheckPrint'
// import ProviderCheckRank from '@/CheckManage/CheckManageRouter/ProviderCheckRank'
// import ProviderCheckPrint from '@/CheckManage/CheckManageRouter/ProviderCheckPrint'
// import ProviderCheckDetail from '@/CheckManage/CheckManageRouter/ProviderCheckDetail'
// import TransportCheckRank from '@/CheckManage/CheckManageRouter/TransportCheckRank'
// 对考核通报进行分组打包
const CheckManage = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManage')
const ZoneCheckRank = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManageRouter/ZoneCheckRank')
const ZoneCheckPrint = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManageRouter/ZoneCheckPrint')
const CompanyCheckRank = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManageRouter/CompanyCheckRank')
const CompanyCheckPrint = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManageRouter/CompanyCheckPrint')
const ProviderCheckRank = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManageRouter/ProviderCheckRank')
const ProviderCheckPrint = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManageRouter/ProviderCheckPrint')
const ProviderCheckDetail = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManageRouter/ProviderCheckDetail')
const TransportCheckRank = () =>
  import ( /* webpackChunkName: "CheckManage" */ '@/CheckManage/CheckManageRouter/TransportCheckRank')
// 数据共享
// import DataShared from '@/DataShared/DataShared'
// const DataShared = () => import ('@/DataShared/DataShared')
const DataShared = () => import ( /* webpackChunkName: "DataShared" */ '@/DataShared/DataShared')

// 统计分析
// import Report from '@/Report/Report'
// // 统计分析 - 车辆统计
// import VehicleInstall from '@/Report/ReportRouter/VehicleInstall'
// import VehicleOnline from '@/Report/ReportRouter/VehicleOnline'
// import VehicleUplineRate from '@/Report/ReportRouter/VehicleUplineRate'
// import CurrentOnline from '@/Report/ReportRouter/CurrentOnline'
// import VehicleQualification from '@/Report/ReportRouter/VehicleQualification'
// import VehicleInspect from '@/Report/ReportRouter/VehicleInspect'
// // 统计分析 - 驾驶员统计
// import DriverQualification from '@/Report/ReportRouter/DriverQualification'
// import SafeLearn from '@/Report/ReportRouter/SafeLearn'
// // 统计分析 - 企业统计
// import SafeMark from '@/Report/ReportRouter/SafeMark'
// import BreakRulesDeal from '@/Report/ReportRouter/BreakRulesDeal'
// import PublicityEducation from '@/Report/ReportRouter/PublicityEducation'
// import HiddenDanger from '@/Report/ReportRouter/HiddenDanger'
// import AccidentReport from '@/Report/ReportRouter/AccidentReport'
// // 统计分析 - 客运站统计
// import SafeCheck from '@/Report/ReportRouter/SafeCheck'
// 对考核通报进行分组打包
const Report = () => import ( /* webpackChunkName: "Report" */ '@/Report/Report')
const VehicleInstall = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/VehicleInstall')
const VehicleOnline = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/VehicleOnline')
const VehicleUplineRate = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/VehicleUplineRate')
const CurrentOnline = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/CurrentOnline')
const VehicleQualification = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/VehicleQualification')
const AlarmDeal = () => import ( /* webpackChunkName: "AlarmDeal" */ '@/Report/ReportRouter/AlarmDeal')
const AlarmPush = () => import ( /* webpackChunkName: "AlarmPush" */ '@/Report/ReportRouter/AlarmPush')
const VehicleInspect = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/VehicleInspect')
const DriverQualification = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/DriverQualification')
const SafeLearn = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/SafeLearn')
const SafeMark = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/SafeMark')
const BreakRulesDeal = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/BreakRulesDeal')
const PublicityEducation = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/PublicityEducation')
const HiddenDanger = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/HiddenDanger')
const AccidentReport = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/AccidentReport')
const SafeCheck = () => import ( /* webpackChunkName: "Report" */ '@/Report/ReportRouter/SafeCheck')
const AlarmSupervision = ()=>import(/* webpackChunkName: "Report" */ '@/Report/ReportRouter/AlarmSupervision')
// 河北 - 违章统计
// import VehicleBreakRule from '@/VehicleBreakRule/VehicleBreakRule'
const VehicleBreakRule = () =>
  import ( /* webpackChunkName: "VehicleBreakRule" */ '@/VehicleBreakRule/VehicleBreakRule')
// 双随机抽查
// import SendCheckList from '@/SendCheckList/SendCheckList'
const SendCheckList = () =>
  import ( /* webpackChunkName: "SendCheckList" */ '@/SendCheckList/SendCheckList')
// 投诉管理
// import ReviewInfo from '@/ReviewInfo/ReviewInfo'
const ReviewInfo = () =>
  import ( /* webpackChunkName: "ReviewInfo" */ '@/ReviewInfo/ReviewInfo')
// 企业监管
// import CompanySupervise from '@/CompanySupervise/CompanySupervise'
// import SuperviseCheckSentry from '@/CompanySupervise/CompanySuperviseRouter/SuperviseCheckSentry'
// 对企业监管进行分组打包
const CompanySupervise = () => import ( /* webpackChunkName: "CompanySupervise" */ '@/CompanySupervise/CompanySupervise')
const SuperviseCheckSentry = () => import ( /* webpackChunkName: "CompanySupervise" */ '@/CompanySupervise/CompanySuperviseRouter/SuperviseCheckSentry')
// 运管机构监管
// import Regulation from '@/Industry/Regulation'
const Regulation = () => import ( /* webpackChunkName: "Regulation" */ '@/Industry/Regulation')
// 接入平台监管
// import Platform from '@/Platform/Index'
// import PlatformCheck from '@/Platform/PlatformRouter/PlatformCheck'
// 对接入平台监管进行分组打包
const Platform = () => import ( /* webpackChunkName: "Platform" */ '@/Platform/Index')
const PlatformCheck = () => import ( /* webpackChunkName: "Platform" */ '@/Platform/PlatformRouter/PlatformCheck')
// 车辆分布
// import VehicleDistribution from '@/VehicleDistribution/VehicleDistributionIndex'
const VehicleDistribution = () =>
  import ( /* webpackChunkName: "VehicleDistribution" */ '@/VehicleDistribution/VehicleDistributionIndex')
// 信息中心
// import MessageCenter from '@/MessageCenter/MessageCenter'
const MessageCenter = () =>
  import ( /* webpackChunkName: "MessageCenter" */ '@/MessageCenter/MessageCenter')
// 检查回执单
// import CheckFeedBack from '@/CheckFeedBack/CheckFeedBack'
const CheckFeedBack = () =>
  import ( /* webpackChunkName: "CheckFeedBack" */ '@/CheckFeedBack/CheckFeedBack')
// 实时报警
// import Supervise from '@/Supervise/Supervise'
const Supervise = () =>
  import ( /* webpackChunkName: "Supervise" */ '@/Supervise/Supervise')

import {
  storageOperation,
  isNullUndefEmpty
} from '@/common/common';
import {
  commonConfig
}
from '@/config/commonConfig'
// 引入权限控制的文件
import { $_hasAccess } from '@/accessmanagement/accessmanagement'
Vue.use(Router)
const routes = [{
  path: '/Home',
  component: Home,
  name: '返回首页', //作为面包屑导航显示的路径名
  redirect: '/Home/Dashboard', //作为默认首页
  children: [{
    path: 'Dashboard',
    component: BodyContent,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    }
  }, {
    path: 'Regulation',
    component: Regulation,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    },
    name: '运管机构监管', //作为面包屑导航显示的路径名
  }, {
    path: 'Platform',
    component: Platform,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    },
    name: '接入平台监管', //作为面包屑导航显示的路径名
  }, {
    path: 'VehicleDistribution',
    component: VehicleDistribution,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      ctrlId: 'home_clfb', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
    },
    name: '车辆分布', //作为面包屑导航显示的路径名
  }, {
    path: 'ServerMonitor',
    component: ServerMonitor,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    name: '服务器监控', //作为面包屑导航显示的路径名
    children: [{
      path: 'LoginServer',
      component: LoginServer,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'AnalyseServer',
      component: AnalyseServer,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'CalcServer',
      component: CalcServer,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }]
  }, {
    path: 'PlatformCourse',
    component: PlatformCourse,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    },
    name: '平台历程', //作为面包屑导航显示的路径名
  }, {
    path: 'BaseInfo',
    component: BaseInfo,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      ctrlId: 'jbxx', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
    },
    name: '基本信息', //作为面包屑导航显示的路径名
    children: [{
      path: 'Vehicle',
      component: Vehicle,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        ctrlId: 'jbxx_clgl', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
      },
      name: '车辆管理', //作为面包屑导航显示的路径名
    }, {
      path: 'Company',
      component: Company,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        ctrlId: 'jbxx_ysqygl', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
      },
      name: '运输企业管理', //作为面包屑导航显示的路径名
    }, {
      path: 'UserInfo',
      component: UserInfo,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        ctrlId: 'jbxx_yhgl', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
      },
      name: '用户管理', //作为面包屑导航显示的路径名
    }, {
      path: 'DriverInfo',
      component: DriverInfo,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        ctrlId: 'jbxx_jsygl', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
      },
      name: '驾驶员管理', //作为面包屑导航显示的路径名
    }, {
      path: 'Role',
      component: Role,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        ctrlId: 'jbxx_jsgl', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
      },
      name: '角色管理', //作为面包屑导航显示的路径名
    }]
  }, {
    path: 'SystemConfig',
    component: SystemConfig,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      ctrlId: 'txsz_xtpz', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
    },
    name: '系统配置', //作为面包屑导航显示的路径名
    children: [{
      path: 'RandomCheckConfig',
      component: RandomCheckConfig,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        ctrlId: 'txsz_xtpz_sjccpz', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
      },
      name: '随机抽查配置', //作为面包屑导航显示的路径名
    }, {
      path: 'EmailSysconfig',
      component: EmailSysconfig,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        ctrlId: 'txsz_xtpz_yjtspz', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
      },
      name: '邮件推送配置', //作为面包屑导航显示的路径名
    }, {
      path: 'AlarmWarnConfig',
      component: AlarmWarnConfig,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        ctrlId: 'txsz_xtpz_jqtxpz', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
      },
      name: '警情提醒配置', //作为面包屑导航显示的路径名
    }]
  }, {
    path: 'Monitor',
    component: Monitor,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    },
    name: '车辆监管', //作为面包屑导航显示的路径名
  }, {
    path: 'CheckManage',
    component: CheckManage,
    name: '考核通报', //作为面包屑导航显示的路径名
    redirect: '/Home/CheckManage/ZoneCheckRank', //作为默认页面
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    },
    children: [{
      path: 'ZoneCheckRank',
      component: ZoneCheckRank,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'ZoneCheckPrint',
      component: ZoneCheckPrint,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'CompanyCheckRank',
      component: CompanyCheckRank,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'CompanyCheckPrint',
      component: CompanyCheckPrint,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'ProviderCheckRank',
      component: ProviderCheckRank,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'ProviderCheckPrint',
      component: ProviderCheckPrint,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'ProviderCheckDetail',
      component: ProviderCheckDetail,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }, {
      path: 'TransportCheckRank',
      component: TransportCheckRank,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
      }

    }]
  }, {
    path: 'DataShared',
    component: DataShared,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    },
    name: '数据共享', //作为面包屑导航显示的路径名
  }, {
    path: 'Report',
    component: Report,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
       ctrlId: 'tjfx', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
    },
    name: '统计分析', //作为面包屑导航显示的路径名
    children: [
      {
        path: 'VehicleInstall',
        component: VehicleInstall,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          ctrlId: 'tjfx_clazs', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
        },
        name: '车辆安装数', //作为面包屑导航显示的路径名
      },
      {
        path: 'VehicleOnline',
        component: VehicleOnline,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          ctrlId: 'tjfx_clzxl', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
        },
        name: '车辆在线率', //作为面包屑导航显示的路径名
      },
      {
        path: 'VehicleUplineRate',
        component: VehicleUplineRate,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          ctrlId: 'tjfx_clsxtj', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
        },
        name: '车辆上线统计', //作为面包屑导航显示的路径名
      },
      {
        path: 'CurrentOnline',
        component: CurrentOnline,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          ctrlId: 'tjfx_clsszxqk', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
        },
        name: '车辆实时在线情况', //作为面包屑导航显示的路径名
      },
      {
        path: 'VehicleQualification',
        component: VehicleQualification,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          ctrlId: 'tjfx_clzztj', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
        },
        name: '车辆资质统计', //作为面包屑导航显示的路径名
      },
      {
        path: 'VehicleInspect',
        component: VehicleInspect,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      },
      {
        path: 'DriverQualification',
        component: DriverQualification,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      }, {
        path: 'AlarmDeal',
        component: AlarmDeal,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          ctrlId: 'tjfx_wzcltj', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
        },
        name: '违章处理统计', //作为面包屑导航显示的路径名
      }, {
        path: 'AlarmPush',
        component: AlarmPush,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          ctrlId: 'tjfx_jqtstj', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
        },
        name: '警情推送统计', //作为面包屑导航显示的路径名
      }, {
        path: 'SafeLearn',
        component: SafeLearn,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      }, {
        path: 'SafeMark',
        component: SafeMark,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      }, {
        path: 'BreakRulesDeal',
        component: BreakRulesDeal,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      }, {
        path: 'PublicityEducation',
        component: PublicityEducation,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      }, {
        path: 'HiddenDanger',
        component: HiddenDanger,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      }, {
        path: 'AccidentReport',
        component: AccidentReport,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      }, {
        path: 'SafeCheck',
        component: SafeCheck,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        }
      }, {
        path: 'AlarmSupervision',
        component: AlarmSupervision,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
          ctrlId: 'tjfx_clbjdbtj', // 添加该字段，表示进入这个路由是需要权限访问的，这与后台对应的id要匹配
        },
        name: '车辆报警督办统计', //作为面包屑导航显示的路径名
      }
    ]
  }, {
    path: 'CompanySupervise',
    component: CompanySupervise,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    },
    name: '企业监管', //作为面包屑导航显示的路径名
  }, {
    path: 'SuperviseCheckSentry',
    component: SuperviseCheckSentry,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    }

  }, {
    path: 'PlatformCheck',
    component: PlatformCheck,
    name: '服务商查岗', //作为面包屑导航显示的路径名
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    }
  }, {
    path: 'MessageCenter',
    component: MessageCenter,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的 
      ctrlId: 'grzx_xxzx' //该值是和后面的权限管理挂钩的，所以这个值和后台的名字保持一致
    },
    name: '信息中心', //作为面包屑导航显示的路径名
    }, {
      path: 'SendCheckList',
      component: SendCheckList,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        ctrlId: 'ssjcc', //需要权限控制的情况下，需要制定id号
      },
      name: '双随机抽查', //作为面包屑导航显示的路径名
    }, {
      path: 'ReviewInfo',
      component: ReviewInfo,
      meta: {
        requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
        ctrlId: 'tsgl', //需要权限控制的情况下，需要制定id号
      },
      name: '投诉管理', //作为面包屑导航显示的路径名
    }, {
    path: 'CheckFeedBack',
    component: CheckFeedBack,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的  
    },
    name: '检查回执单', //作为面包屑导航显示的路径名
  }, {
    path: 'VehicleBreakRule',
    component: VehicleBreakRule,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      ctrlId: 'wztj', //需要权限控制的情况下，需要制定id号
    },
    name: '违章统计', //作为面包屑导航显示的路径名
  }, {
    path: 'Supervise',
    component: Supervise,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
      ctrlId: 'fjbj', //需要权限控制的情况下，需要制定id号
    },
    name: '实时报警', //作为面包屑导航显示的路径名
  }]
}, {
  path: '/Login',
  name: 'Login',
  component: Login
}, {
  path: '*',
  redirect: '/Login'
}];
const router = new Router({
  mode: 'history',
  routes
})

// 2018-06-01实现Vue-router的导航守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (!isNullUndefEmpty(storageOperation.getItem(commonConfig.Token))) { // 通过vuex state获取当前的token是否存在
      if (!isNullUndefEmpty(to.meta.ctrlId)) {
        const accessList = JSON.parse(storageOperation.getItem('accessList'));
        if ($_hasAccess(to.meta.ctrlId, accessList)) //该值和sessionStorage中的accessList是一致的，因为vue自定义指令无法访问vuex，所以才会出现sessionStorage的副本
          next();
        else {
          next({
            path: commonConfig.routerConst.LoginRouter
          })
        }
      } // 判断页面是否需要权限的访问
      else next();
      // 注释人：向浩
      // 注释时间：2018-06-19
      // 注释原因：由于导航栏是在最顶层，切换路由不会刷新导航栏，所以在切换路由的时候把地址存放在sessionStorage
      const breadNavs = [];
      for (let matchItem of to.matched) {
        breadNavs.push({
          toName: matchItem.name,
          toNav: {
            path: matchItem.path
          }
        })
      }
      storageOperation.setItem('breadNavs', JSON.stringify(breadNavs));
    } else {
      next({
        path: commonConfig.routerConst.LoginRouter
      })
    }
  } else {
    next();
  }
})
export default router;
