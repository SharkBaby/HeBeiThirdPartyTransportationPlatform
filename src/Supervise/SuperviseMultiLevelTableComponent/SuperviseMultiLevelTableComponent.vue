<template>
  <el-tabs @tab-click="handleClick" v-model="multiLevelActiveName" class="supervise-multi-level">
    <el-tab-pane :label="tabCtntItem.tabLabel" :name="tabCtntItem.tabName" v-for="(tabCtntItem,tabKey) in multiLevelSourceData" :key="tabKey">
      <el-table 
      ref="singleTable"
      :data="tabCtntItem.TabCtnt"
      highlight-current-row
      @current-change="handleRowChange"
      max-height="420"
      style="width: 100%" 
      :default-sort="{prop: 'date', order: 'descending'}"
      row-class-name="table-body-row-class-name"
      header-cell-class-name="table-cell-class-name"
      class="multi-level-table"
      v-loading="tabCtntItem.loading"
      @row-dblclick="rowDblClick"
      @row-click="handleRowClick">
        <el-table-column
          fixed="left"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          fixed="left"
          label="操作"
          align="center" header-align="center"
          width="270">
          <template slot-scope="scope">
            <a href="#" title="督办" class="supervise-btn supervise-operation-a" @click="handleSuperviseClick(scope.row)"></a>
            <!-- <a href="#" title="定位" class="supervise-location supervise-operation-a"></a> -->
            <el-select v-model="scope.row.callValue" placeholder="请选择拨打电话行为" class="supervise-call" @change="hanldeCallChange(scope.row)">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <!--注释人：向浩
        注释时间：2018-07-17
        注释原因：去掉排序字段
        -->
        <!-- sortable width="100" -->
        <el-table-column 
        :prop="tabHeaderItem.headerKey" 
        :label="tabHeaderItem.headerVal" 
        v-if="tabHeaderItem.subHeaders.length == 0" 
        v-for="(tabHeaderItem,tabHeaderKey) in tabCtntItem.tabHeader" 
        :key="tabHeaderKey" 
        align="center" 
        header-align="center"
        :fixed="['alarmStatus','tel'].indexOf(tabHeaderItem.headerKey)>=0?'left':false">
          <!--注释人：向浩
          注释时间：2018-06-15
          注释原因：统计分析-车辆入网数地区汇总等报表单行表头的数据带有链接
          -->
          <template slot-scope="scope"> 
            <router-link :to="tabHeaderItem.router_link" v-if="tabHeaderItem.columnType === columnType.router_link" class="table-router-link">{{scope.row[tabHeaderItem.headerKey]}}</router-link>
            <p v-else>{{scope.row[tabHeaderItem.headerKey]}}</p>
          </template>
        </el-table-column>
        <!--注释人：向浩
        注释时间：2018-06-06
        注释原因：由于在绑定数据时候，某些列是带有路由跳转，所以需要修改
        -->
        <!-- <el-table-column :label="tabHeaderItem.labelName" v-else-if="tabHeaderItem.subHeaders.length > 0">
          <el-table-column :label="subHeaderItem.slabelName" v-for="(subHeaderItem, subHeaderKey) of tabHeaderItem.subHeaders" :key="subHeaderKey">
            <el-table-column :prop="ssubHeaderKey" :label="ssubHeaderItem" v-for="(ssubHeaderItem, ssubHeaderKey) of subHeaderItem.subHeaders" :key="ssubHeaderKey">
            </el-table-column>
          </el-table-column>
        </el-table-column> -->
        <el-table-column :label="tabHeaderItem.labelName" v-else-if="tabHeaderItem.subHeaders.length > 0" align="center" header-align="center">
          <el-table-column :prop="subHeaderItem.headerKey" :label="subHeaderItem.headerVal" v-if="subHeaderItem.slabelName == undefined" v-for="(subHeaderItem, subHeaderKey) of tabHeaderItem.subHeaders" :key="subHeaderKey" align="center" header-align="center">
            <template slot-scope="scope"> 
              <router-link :to="subHeaderItem.router_link" v-if="subHeaderItem.columnType === columnType.router_link" class="table-router-link">{{scope.row[subHeaderItem.headerKey]}}</router-link>
              <p v-else-if="subHeaderItem.columnType === columnType.text">{{scope.row[subHeaderItem.headerKey]}}</p>
            </template>
          </el-table-column>
          <!-- 加入三级表头（加入原因是统计分析->车辆入网数->地区汇总）-->
          <el-table-column :label="subHeaderItem.slabelName" v-else-if="subHeaderItem.slabelName !== undefined" align="center" header-align="center">
            <el-table-column :prop="ssubHeaderItem.headerKey" :label="ssubHeaderItem.headerVal" v-for="(ssubHeaderItem, ssubHeaderKey) of subHeaderItem.ssubHeaders" :key="ssubHeaderKey" align="center" header-align="center">
              <!--注释人：向浩
              注释时间：2018-06-15
              注释原因：统计分析-车辆入网数地区汇总等报表三行表头的数据带有链接
              -->
              <template slot-scope="scope"> 
                <router-link :to="ssubHeaderItem.router_link" v-if="ssubHeaderItem.columnType === columnType.router_link" class="table-router-link">{{scope.row[ssubHeaderItem.headerKey]}}</router-link>
                <p v-else>{{scope.row[ssubHeaderItem.headerKey]}}</p>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<style src="./superviseMultiLevelTableComponent.css" type="text/css">
</style>

<script>
import { axiosRequest, handleErrorMsg } from "@/common/common";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "SuperviseMultiLevelTableComponent",
  // props: ["btnEvents", "searchCreteria", "activeName", "tabCtntList"],
  props: ["activeName", "tabCtntList"],
  components: {},
  data() {
    return {
      searchType: {
        input: "input",
        select: "select",
        checkbox: "checkbox",
        singleChkbox: "singleChkbox",
        singleDayPicker: "singleDayPicker", //单个选择天的日期组件
        singleDatePicker: "singleDatePicker", //单个年份，月份日期组件
        fromTodatePicker: "fromTodatePicker",
        treeCheckbox: "treeCheckbox",
        fromToTimePickerChange: 'fromToTimePickerChange'
      },
      // 每一列的类型，目前已经有纯文本和router-link
      columnType: {
        text: "text",
        router_link: "router_link"
      },
      preSearchType: ["ZoneId", "UnitId", "VehicleId", "PlatformId"],
      selectType: {
        Year: "Year",
        Month: "Month",
        CheckType: "CheckType",
        DatePicker: "DatePicker"
      },
      multiLevelSourceData: this.tabCtntList,
      multiLevelActiveName: this.activeName,
      multiLevelActiveIndex: 0,
      // disabled: 'disabled' //禁用导出，打印按钮
      currentRow: null,
      // 是否拨打电话
      options: [{
        value: 0,
        label: '已电话通知'
      }, {
        value: 1,
        label: '电话未接通'
      }, {
        value: 2,
        label: '未拨打电话'
      }],
      callValue: '',
    };
  },
  watch: {
    tabCtntList: function(newVal){
      this.multiLevelSourceData = newVal;
    }
  },
  methods: {
    handleClick(tab, event) {
      this.multiLevelActiveIndex = tab.index;
      // 同步父组件和子组件的activeIndex
      this.$emit("handleCurActiveIndex", this.multiLevelActiveIndex);
    },
    //行双击事件目前只针对双随机抽查，后期需要加上其他的功能
    rowDblClick: function(row, event) {
      this.$emit("rowDblClick", row);
    },
    // 行单击事件处理，目前只针对基本信息-运输企业管理，后期需要加上其他的功能
    handleRowClick: function(row, event, column){
      // this.$refs.singleTable.setCurrentRow(row); //高亮当前行
      this.$emit("handleRowClick", row);
    },
    handleRowChange(val){
      this.currentRow = val;
    },
    // 电话通知的改变触发的事件
    hanldeCallChange: function(scopeRow){
      const self = this;
      // 设置AlarmType,和违章统计里面的违章类型Id保持一致
      let alarmType = '',
          callValue = '';
      switch(this.multiLevelActiveIndex){
        case 0:
        alarmType = 2;
        break;
        case 1:
        alarmType = 3;
        break;
        case 2:
        alarmType = 10;
        break;
        default:
      }
      switch(scopeRow.callValue){
        case 0:
        callValue = '已电话通知';
        break;
        case 1:
        callValue = '电话未接通';
        break;
        case 2:
        callValue = '未拨打电话';
        break;
        default:
      }
      const postSaveRightObj = {
          params: {
            VehicleID: scopeRow.vehicleId,
            VehicleType: scopeRow.vehicleTypeId,
            CompanyID: scopeRow.unitId,
            ZoneID: scopeRow.zoneId,
            PlatformID: scopeRow.platformID,
            AlarmType: alarmType,
            AlarmID: scopeRow.alarmId,
            SuperviseDate: scopeRow.sDate, //有问题
            SuperviseTime: scopeRow.sTime, //有问题
            // Level: scopeRow.levelStr,
            Level: 0, //只有超速的websocket可以传level字段，异动和疲驾都不会传，而且现在这个字段都被注释掉
            SuperviseType: scopeRow.callValue, //是否选择了拨打电话
            IsSupervise: 1, //督办：0，不督办：1
          },
          postUrl: commonConfig.rootUrl + commonConfig.MonitorAPI.SaveGOVAlarmSupervise,//分级预警电话类型和督办类型
        };
        axiosRequest.axiosPost(postSaveRightObj)
          .then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，成功设置为" + callValue,
                type: "success"
              });
            } else self.$message.error("错了哦，设置状态失败");
          })
          .catch(function(error) {
            self.$message({
              type: 'warning',
              message: handleErrorMsg(error)
            })
          });
    },
    // 督办按钮
    handleSuperviseClick: function(scopeRow){
      const self = this;
      if(scopeRow.callValue === ''){
        self.$message({
          type: 'warning',
          message: "请选择拨打电话行为"
        });
        return ;
      }
      // 设置AlarmType,和违章统计里面的违章类型Id保持一致
      let alarmType = '',
          callValue = '';
      switch(this.multiLevelActiveIndex){
        case 0:
        alarmType = 2;
        break;
        case 1:
        alarmType = 3;
        break;
        case 2:
        alarmType = 10;
        break;
        default:
      }
      switch(scopeRow.callValue){
        case 0:
        callValue = '已电话通知';
        break;
        case 1:
        callValue = '电话未接通';
        break;
        case 2:
        callValue = '未拨打电话';
        break;
        default:
      }
      const postSaveRightObj = {
          params: {
            VehicleID: scopeRow.vehicleId,
            VehicleType: scopeRow.vehicleType,
            CompanyID: scopeRow.unitId,
            ZoneID: scopeRow.zoneId,
            PlatformID: scopeRow.platformID,
            AlarmType: alarmType,//有问题
            AlarmID: scopeRow.alarmTypeName,
            SuperviseDate: scopeRow.sDate,
            SuperviseTime: scopeRow.sTime,
            Level: scopeRow.levelStr,
            SuperviseType: scopeRow.callValue,
            IsSupervise: 0,//督办：0，不督办：1
          },
          postUrl: commonConfig.rootUrl + commonConfig.MonitorAPI.SaveGOVAlarmSupervise,//分级预警电话类型和督办类型
        };
        axiosRequest.axiosPost(postSaveRightObj)
          .then(function(response) {
            if (response.data) {
              self.$message({
                message: "恭喜你，督办成功并移除该条记录",
                type: "success"
              });
              switch(self.multiLevelActiveIndex){
                case "0":
                self.$store.commit('deleteSuperviseRslt', scopeRow.alarmId); //督办超速成功后，将此条数据删除掉
                break;
                case "1":
                self.$store.commit('deleteSuperviseRsltAM', scopeRow.alarmId); //督办超速成功后，将此条数据删除掉
                break;
                case "2":
                self.$store.commit('deleteSuperviseRsltOH', scopeRow.alarmId); //督办超速成功后，将此条数据删除掉
                break;
                default:
              }
            } else self.$message.error("错了哦，督办失败");
          })
          .catch(function(error) {
            self.$message({
              type: 'warning',
              message: handleErrorMsg(error)
            })
          });
    },
  }
};
</script>