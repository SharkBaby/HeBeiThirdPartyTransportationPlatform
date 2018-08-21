const commonConfig = {
  // rootUrl: 'http://10.50.75.111:8111',
  // rootUrl: 'http://10.50.75.111:23407',
  // production:
  // rootUrl: 'http://www.jtaqjc.com/api',
  rootUrl: 'http://121.28.153.131:8080',
  // webSocketUrl: 'ws://10.50.75.109:1819',
  // production
  webSocketUrl: 'ws://121.28.153.131:10000',  
  UserLogin: '/api/User/Login',
  UserLoginOut: '/api/User/LoginOut',
  UserUpdatePassword: '/api/User/UpdatePassword',
  UserAPI: {
    GetUserData: '/api/User/GetUserData', //获取用户对应角色的权限
  },
  HomeAPI: { //首页
    GetCompanyCount: '/api/Home/GetCompanyCount', //接入平台
    GetHomeCurrentOnlineData: '/api/Home/GetHomeCurrentOnlineData', //车辆监管
    GetCurrentOnlineData: '/api/Home/GetCurrentOnlineData', //安全监管 - 车辆在线情况
    GetSafeManageIllegalData: '/api/Home/GetSafeManageIllegalData', //安全监管 - 全省违章车辆
    GetAlarmDealData: '/api/Home/GetAlarmDealData', //安全监管 - 全省违章处理情况
    GetCarOnLine: '/api/Home/GetCarOnLine', //车辆分布
  },
  VehicleBreakRuleAPI: { //违章统计
    GetVehicleBreakRuleData: '/api/Statistics/GetVehicleBreakRuleData', //查询违章统计
    ExportVehicleBreakRuleData: '/api/Statistics/ExportVehicleBreakRuleData' //导出违章统计
  },
  ReportAPI: { //统计分析
    GetVehicleInstallData: '/api/Statistics/GetVehicleInstallData', //查询车辆安装数
    ExportVehicleInstallData: '/api/Statistics/ExportVehicleInstallData', //导出车辆安装数

    GetVehicleOnlineData: '/api/Statistics/GetVehicleOnlineData', //查询车辆在线率
    ExportVehicleOnlineData: '/api/Statistics/ExportVehicleOnlineData', //导出车辆在线率

    GetVehicleUplineData: '/api/Statistics/GetVehicleUplineData', //查询车辆上线统计
    ExportVehicleUplineData: '/api/Statistics/ExportVehicleUplineData', //导出车辆上线统计

    GetCurrentOnlineData: '/api/Statistics/GetCurrentOnlineData', //查询车辆实时在线情况
    ExportCurrentOnlineData: '/api/Statistics/ExportCurrentOnlineData', //导出车辆实时在线情况

    GetVehicleQualificationData: '/api/Statistics/GetVehicleQualificationData', //查询车辆资质统计
    ExportVehicleQualificationData: '/api/Statistics/ExportVehicleQualificationData', //导出车辆资质统计

    GetVehicleInspectData: '/api/Statistics/GetVehicleInspectData', //查询巡检报表
    ExportVehicleInspectData: '/api/Statistics/ExportVehicleInspectData', //导出巡检报表

    GetAlarmSupervisionData: '/api/Statistics/GetAlarmSupervisionData', //车辆报警督办统计
    ExportAlarmSupervisionData: '/api/Statistics/ExportAlarmSupervisionData', //导出车辆报警督办统计

    GetAlarmDealReports: '/api/Statistics/GetAlarmDealReports', //车辆违章处理统计
    ExportAlarmDealReports: '/api/Statistics/ExportAlarmDealReports', //导出车辆违章处理统计

    GetTerminalAlarmRemind: '/api/Statistics/GetTerminalAlarmRemind', //警情推送统计
    ExportTerminalAlarmRemind: '/api/Statistics/ExportTerminalAlarmRemind', //导出警情推送统计
  },
  BaseInfoAPI: { //基本信息
    GetBaseVehInfoData: '/api/BaseInfo/GetBaseVehInfoData', //车辆管理
    GetUnitBaseInfo: '/api/BaseInfo/GetUnitBaseInfo', //运输企业管理
      UpdateUnitBaseInfo: '/api/BaseInfo/UpdateUnitBaseInfo', //运输企业管理 - 更新运输企业
    GetUserBaseInfo: '/api/BaseInfo/GetUserBaseInfo', //用户管理
      AddUserInfo: '/api/BaseInfo/AddUserInfo', //用户管理 - 角色配置
      UpdateUserInfo: '/api/BaseInfo/UpdateUserInfo', //用户管理 - 修改用户基本信息
      updateUserLoginPass: '/api/BaseInfo/updateUserLoginPass', //用户管理 - 重置密码
      DeleteUser: '/api/BaseInfo/DeleteUser', //用户管理 - 删除
      GetRoleToUserData: '/api/BaseInfo/GetRoleToUserData', //用户管理 - 获取角色配置
      SaveRoleToUserData: '/api/BaseInfo/SaveRoleToUserData', //用户管理 - 保存角色配置
    GetDriverData: '/api/BaseInfo/GetDriverData', //驾驶员管理
    GetRoleInfo: '/api/BaseInfo/GetRoleInfo', //角色管理
      AddRoleInfo: '/api/BaseInfo/AddRoleInfo', //角色管理 - 添加角色
      UpdateRoleInfo: '/api/BaseInfo/UpdateRoleInfo', //角色管理 - 修改角色信息
      DeleteRoleInfo: '/api/BaseInfo/DeleteRoleInfo', //角色管理 - 删除角色
      GetMenuTreeData: '/api/BaseInfo/GetMenuTreeData', //角色管理 - 权限配置
      SaveRightData: '/api/BaseInfo/SaveRightData', //角色管理 - 保存权限配置
  },
  MonitorAPI: { //车辆监管
    MTGetQueryNode: '/api/Monitor/MTGetQueryNode', //获取企业列表
    MTQueryDataByName: '/api/Monitor/MTQueryDataByName', //查询车辆
    GetHistoryInfo: '/api/Monitor/GetHistoryInfo', //获取车辆历史轨迹 / 分级预警页面的获取车辆历史轨迹
    GetTpVehPosition: '/api/Monitor/GetTpVehPosition', //获取车辆最新定位
    SaveGOVAlarmSupervise: '/api/Monitor/SaveGOVAlarmSupervise', //分级预警电话类型和督办类型
  },
  VehicleDistributionAPI: { //车辆分布
    GetVehicleSpreadData: '/api/Home/GetVehicleSpreadData', //车辆分布 - 左边地图和对应的元饼图
    GetVehicleList: '/api/Home/GetVehicleList', //车辆分布 - 右边重点车辆
    GetVehicleDetail: '/api/Home/GetVehicleDetail',  //车辆分布 - 右边重点车辆
  },
  // 天气预报接口
  weatherUrl: 'http://api.map.baidu.com/telematics/v3/weather?location=',
  // 通用接口 - 获取当前用户地区树
  GetZoneToUserID: '/api/Common/GetZoneToUserID',
  // 通用接口 - 预搜索
  GetAutoDataList: '/api/Common/GetAutoDataList', // type:(1:地区，2：企业，3：车辆，4：接入平台),text,zoneId,queryType


  // 注释人：向浩
  // 注释时间：2018-07-06
  // 注释原因：下面的所有配置数据展示没有在河北省道路运输第三方安全监测平台 中使用，这些数据展示只有在新版湖南政府平台使用
  GetIndustryRegulation: '/api/Home/GetIndustryRegulation', //运营机构监管
  // 运营机构监管子页面
  GetLevelPlatDataDetail: '/api/Home/GetLevelPlatDataDetail',
  GetLevelPlatDataDetailParams: {
    zoneID: ''
  },
  
  GetAccessPlatformRegulation: '/api/Home/GetAccessPlatformRegulation', //接入监管平台
  // 接入平台监管子页面 - 接入平台链接情况->左部分数据
  GetPlatformList: '/api/Home/GetPlatformList',
  // 接入平台监管子页面 - 接入平台链接情况->右部分数据
  GetPlatformLinkTotal: '/api/Home/GetPlatformLinkTotal',
  // 接入平台监管子页面 - 接入平台报警与定位
  GetPlatformAlarmLinePie: '/api/Home/GetPlatformAlarmLinePie',
  // 接入平台监管子页面 - 接入平台基本信息
  GetPlatformBaseInfo: '/api/Home/GetPlatformBaseInfo',
  // 接入平台监管子页面 - 接入平台定位数据
  GetPlatformLocation: '/api/Home/GetPlatformLocation',
  SessionPlatformLocation: 'platformLocation',
  // 接入平台监管子页面 - 接入平台数据传输质量
  GetPlatformTransfer: '/api/Home/GetPlatformTransfer',
  GetCurrentOnlineData: '/api/Home/GetCurrentOnlineData', //车辆实时在线情况
  GetVehicleBreakData: '/api/Home/GetVehicleBreakData', //车辆违章情况
  GetSecurityAlarmPoint: '/api/Home/GetSecurityAlarmPoint', //安全监管报警热点
  
  // 考核通报 - 地区考核排名
  GetCheckManageByZone: '/api/CheckManage/GetCheckManageData',
  // 考核通报 - 获取地区考核明细
  GetProviderCheckDetailData: '/api/CheckManage/GetProviderCheckDetailData',
  // 考核通报 - 导出考核排名
  ExportCheckManageData: '/api/CheckManage/ExportCheckManageData',
  // 考核通报 - 导出考核明细
  ExportProviderCheckDetailData: '/api/CheckManage/ExportProviderCheckDetailData',
  // 统计分析下面所有后端接口
  StatisticConst: {
    GetVehicleInstallData: '/api/Statistics/GetVehicleInstallData', //车辆入网数
    ExportVehicleInstallData: '/api/Statistics/ExportVehicleInstallData', //导出车辆入网数
    GetVehicleUplineData: '/api/Statistics/GetVehicleUplineData', //车辆上线统计
    ExportVehicleUplineData: '/api/Statistics/ExportVehicleUplineData', //导出车辆上线统计
    GetVehicleSpotCheckData: '/api/Statistics/GetVehicleSpotCheckData', //车辆抽查统计
    ExportVehicleSpotCheckData: '/api/Statistics/ExportVehicleSpotCheckData', //导出车辆抽查统计
    GetChangeDetailData: '/api/Statistics/GetChangeDetailData', //变更明细统计
    ExportChangeDetailData: '/api/Statistics/ExportChangeDetailData', //变更明细统计
    GetVehicleVedioData: '/api/Statistics/GetVehicleVedioData', //车辆视频
  },
  // 按钮事件的区分
  btnEventsId: {
    search: 'search',
    export_data: 'export_data', //双随机抽查使用到“导出数据”按钮
    print: 'print', //打印页面需要使用
    add: 'add', //检查回执单页面使用到“增加”按钮
    edit: 'edit', //基本信息页面使用到“修改”按钮
    delete: 'delete', //用户管理页面使用到“删除”按钮、//双随机抽查使用到“删除选项”按钮
    initpwd: 'initpwd', //用户管理页面使用到“初始化密码”按钮
    rolemgmnt: 'rolemgmnt', //用户管理页面使用到“角色管理”按钮
    accessmgmnt: 'accessmgmnt', //角色管理页面使用到“权限管理”按钮
    confirm: 'confirm', //系统配置页面-随机抽查配置使用到“确认”按钮
    cancel: 'cancel', //系统配置页面-随机抽查配置使用到“取消”按钮
    save: 'save', //系统配置页面-邮件推送配置使用到“保存”按钮
    sendRightNow: 'sendRightNow', //系统配置页面-邮件推送配置使用到“一键发送”按钮
    viewOptionDetail: 'viewOptionDetail', //双随机抽查使用到“查看选项详情”按钮
    getNewChoucha: 'getNewChoucha', //双随机抽查使用到“获取新抽查”按钮
    sendchecklist_view_bottom: 'sendchecklist_view_bottom', //双随机抽查使用到“检查人员手机推送”按钮
    sendchecklist_view_save: 'sendchecklist_view_save' //双随机抽查使用到“提交本次检查结果”按钮
  },
  GetSecurityAlarmPointParams: {
    beginDate: '',
    endDate: '',
    alarmType: '',
  },
  UserID: 'UserID', //存储到sessionStorage的key
  Token: 'Token', //存储到sessionStorage的key
  LoginID: 'LoginID', //存储到sessionStorage的key,
  OrgOnCheckInterval: 'OrgOnCheckInterval', //关于运管机构监管清楚动画的定时器,存储到sessionStorage的key,
  ctrlId: 'ctrlId', //存储到sessionStorage的权限管理的ctrlId,
  token: 'token',
  Password: 'Password',
  // Logout 字段
  UpdatePwd: {
    UserID: 'UserID',
    OldPassword: 'OldPassword',
    NewPassword: 'NewPassword',
  },
  // 路由常量定义
  routerConst: {
    LoginRouter: '/Login',
    DashboardRouter: '/Home/Dashboard',
    // ProviderCheckDetail: '/Home/CheckManage/ProviderCheckDetail'
    ProviderCheckDetail: '' , //目前现在的报表里面的超链接指向这个地址，跳转功能暂未实现
  }
};
// 注释人：向浩
// 注释时间：2018-06-13
// 注释原因：车辆类型的种类太多，将这些参数抽象出来，通过模块导入的方式进行使用
const carTypeOptions = [{
  id: "1",
  label: "所有车辆",
  children: [{
      id: "1-1",
      label: "重点营运车辆",
      children: [{
          id: "1-1-1",
          label: "两客一危",
          children: [{
              id: "1-1-1-1",
              label: "三类以上班线客车",
              children: [{
                  id: "1-1-1-1-1",
                  value: 0x1000,
                  label: "高速客车"
                },
                {
                  id: "1-1-1-1-2",
                  value: 0x0002,
                  label: "超长客车"
                },
                {
                  id: "1-1-1-1-3",
                  value: 0x0001,
                  label: "三类以上班线客车（除高速，超长）"
                }
              ]
            },
            {
              id: "1-1-1-2",
              label: "旅游包车",
              children: [{
                  id: "1-1-1-2-1",
                  value: 0x0004,
                  label: "旅游客车"
                },
                {
                  id: "1-1-1-2-2",
                  value: 0x100000,
                  label: "包车客车"
                },
                {
                  id: "1-1-1-1-3",
                  value: 0x0001,
                  label: "三类以上班线客车（除高速，超长）"
                }
              ]
            },
            {
              id: "1-1-1-3",
              value: 0x0080,
              label: "危险品运输车"
            }
          ]
        },
        {
          id: "1-1-2",
          label: "重货车辆",
          children: [{
              id: "1-1-2-1",
              value: 0x0010,
              label: "重型货物运输车"
            },
            {
              id: "1-1-2-2",
              value: 0x0020,
              label: "半挂牵引车"
            }
          ]
        }
      ]
    },
    {
      id: "1-2",
      label: "非重点营运车辆",
      children: [{
          id: "1-2-1",
          value: 0x8000,
          label: "普通货运"
        },
        {
          id: "1-2-2",
          value: 0x2000,
          label: "农村客运"
        },
        {
          id: "1-2-3",
          value: 0x10000,
          label: "驾培车"
        },
        {
          id: "1-2-4",
          value: 0x4000,
          label: "出租车"
        },
        {
          id: "1-2-5",
          value: 0x20000,
          label: "公交车"
        },
        {
          id: "1-2-6",
          value: 2097152,
          label: "租赁客车"
        },
        {
          id: "1-2-7",
          value: 0x40000,
          label: "校园车辆"
        },
        {
          id: "1-2-8",
          value: 0x80000,
          label: "其他车"
        }
      ]
    }
  ]
}];
// 注释人：向浩
// 注释时间：2018-06-15
// 注释原因：将所有报表涉及的类型统一管理，这样就可以在后面的模块里面统一处理
const reportLabelId = {
  ZoneId: 'ZoneId', //河北第三方-违章统计-地区
  PlatformId: 'PlatformId', //河北第三方-违章统计-接入平台
  BeginDate: 'BeginDate', //河北第三方-违章统计-开始时间
  EndDate: 'EndDate', //河北第三方-违章统计-结束时间
  CarType: 'CarType', //河北第三方-违章统计-车辆类型
  BreakRuleType: 'BreakRuleType', //河北第三方-违章统计-违章类型
  GovStatus: 'GovStatus', //河北第三方-违章统计-车辆状态
  FuncVtype: 'FuncVtype', //河北第三方-违章统计
  PlatformType: 'PlatformType', //河北第三方-违章统计
  UnitId: 'UnitId', //河北第三方-违章统计-企业汇总-运输企业
  VehicleId: 'VehicleId', ///河北第三方-违章统计-企业汇总-车牌号
  DayOrNight: 'DayOrNight', ///河北第三方-违章统计-超速-报警时段
  OverSpeedRate: 'OverSpeedRate', //河北第三方-违章统计-超速-超速率
  MisconductType: 'MisconductType', //河北第三方-违章统计-不良驾驶行为明细-不良行为类型
  fromTodatePicker: 'fromTodatePicker', //河北第三方-统计分析-车辆安装数-时间起 - 时间至
  DeviceID: 'DeviceID', //河北第三方-统计分析-车辆安装数-车载终端配置
  InstallID: 'InstallID', //河北第三方-统计分析-车辆安装数-GPS安装情况
  singleDatePicker: 'singleDatePicker', //河北第三方-统计分析-车辆在线率-月份
  UplineFlag: 'UplineFlag', //河北第三方-统计分析-车辆上线率-上线情况
  Status: 'Status', //河北第三方-车辆实时在线情况-车辆在线情况
  fromToTimePickerChange: 'fromToTimePickerChange', //河北第三方-统计分析-巡检报表引入开始时间-结束时间选择器
  isSupervise: 'isSupervise', //河北第三方-统计分析-车辆报警督办统计-车辆报警督办明细-是否督办
  // AccountNumber: 'AccountNumber', //河北第三方-统计分析-车辆报警督办统计-车辆报警督办明细-账号
  AlarmType: 'AlarmType', ////河北第三方-统计分析-车辆报警督办统计-警情推送统计-报警类型
  GPSInstalled: 'GPSInstalled', //河北第三方-基本信息-车辆管理 - 已安装GPS
  Name: 'Name', //河北第三方-基本信息-Company/DriverInfo
  LicenseNumber: 'LicenseNumber', //河北第三方-基本信息-Company
  LoginCode: 'LoginCode', //河北第三方-基本信息-UserInfo
  RoleName: 'RoleName', //河北第三方-基本信息-Role(角色管理)
  RoleCode: 'RoleCode', //河北第三方-基本信息-Role(角色管理)
  Licenseplat: 'Licenseplat', //河北第三方-基本信息-Vehicle(车辆管理)


  


  // 注释人：向浩
  // 注释时间：2018-07-06
  // 注释原因：下面的所有配置数据展示没有在河北省道路运输第三方安全监测平台 中使用，这些数据展示只有在新版湖南政府平台使用
  AlarmConfig: 'AlarmConfig', //河北第三方-违章统计
  IsIncludeLower: 'IsIncludeLower', //河北第三方-违章统计-是否包含下级
  Filter: 'Filter', //河北第三方-违章统计
  IsIpline: 'IsIpline', //河北第三方-统计分析-巡检报表-是否上线

  

  
  

  CheckUnitID: 'CheckUnitID',
  CheckType: 'CheckType',
  IsOnGuard: 'IsOnGuard',
  TargetUserId: 'TargetUserId',
  
  ChangeSourceType: 'ChangeSourceType', //变更来源类型
  OperationType: 'OperationType', //操作类型
  PlateColor: 'PlateColor', //车牌颜色
  Area: 'Area', //区域
  UnitName: 'UnitName', //单位名称

  
  OrderCode: 'OrderCode', //单号
  CheckState: 'CheckState', //检查状态
  DriverName: 'DriverName', //河北第三方 - 统计分析 - SafeLearn
  DriverNumber: 'DriverNumber', //河北第三方 - 统计分析 - SafeLearn
  AccidentType: 'AccidentType', //河北第三方 - 统计分析 - AccidentReport
}
// 注释人：向浩
// 注释时间：2018-06-26
// 注释原因：将所有页面的输入框包括报表内的输入框统一管理，这样就可以在后面的模块里面统一处理
const searchType = {
  input: "input",
  select: "select",
  checkbox: "checkbox",
  singleChkbox: "singleChkbox",
  singleDayPicker: "singleDayPicker", //单个选择天的日期组件
  singleDatePicker: "singleDatePicker", //单个年份，月份日期组件
  fromTodatePicker: "fromTodatePicker",
  treeCheckbox: "treeCheckbox", 
  textarea: 'textarea', //双随机抽查-查看选项详情-多行输入框
}
// 注释人：向浩
// 注释时间：2018-06-22
// 注释原因：将省份的名称和Id值常量化，方便管理
const provinceVal = {
  provinceName: '河北省',
  provinceId: '13000000',
  // 临时使用新疆Id
  // provinceId: '65000000',
  titleName: '河北省道路运输第三方安全监测平台',
  // 地图默认石家庄经纬度
  longtitude: 114.502461, //经度
  latitude: 38.045474, //维度
}
const wshost = "ws://10.50.75.109:1819"
//ES6 语法声明一个模块
export {
  commonConfig,
  carTypeOptions,
  reportLabelId,
  provinceVal,
  searchType,
  wshost
};
