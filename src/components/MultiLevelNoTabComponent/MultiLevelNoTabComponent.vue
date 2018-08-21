<template>
      <el-row class="multi-level-no-table-comp">
        <el-row class="multi-level-search-creteria">
          <input-component 
          :labelName="searchItem.labelName" 
          :compVal="searchItem.compVal"
          :compId="searchItem.compId"
          :labelId="searchItem.labelId" 
          v-if="searchItem.searchType === searchType.input" 
          v-for="(searchItem, searchKey) of multiLevelSourceData.searchCreteria" 
          :key="searchKey"
          v-on:inputChange="inputChange"></input-component>
          <select-component 
          :options="searchItem.options" 
          :labelName="searchItem.labelName" 
          :compVal="searchItem.compVal" 
          :labelId="searchItem.labelId"
          v-else-if="searchItem.searchType === searchType.select"
          v-on:selectChange="selectChange"></select-component>
          <!--注释人：向浩
          注释时间：2018-06-13
          注释原因：封装年份，月份选择器
          -->
          <single-date-picker-component
          :labelName="searchItem.labelName" 
          :compVal="searchItem.compVal" 
          :labelId="searchItem.labelId"
          :type ="searchItem.type"
          :placeholder="searchItem.placeholder"
          :format="searchItem.format"
          :valueformat="searchItem.valueformat"
          v-else-if="searchItem.searchType === searchType.singleDatePicker"
          v-on:singleDatePickerChange="singleDatePickerChange"></single-date-picker-component>
          <!--注释人：向浩
          注释时间：2018-06-14
          注释原因：1.考核通报-考核明细-入网明细中需要单个日期选择器2.统计分析-车辆入网数-车辆入网明细中需要单个日期选择器
          -->
          <single-day-picker-component
          :labelName="searchItem.labelName" 
          :compVal="searchItem.compVal" 
          :labelId="searchItem.labelId"
          v-else-if="searchItem.searchType === searchType.singleDayPicker"
          v-on:singleDayPickerChange="singleDayPickerChange"></single-day-picker-component>
          <!-- Add from date to end date -->
          <date-picker-component 
          :labelName="searchItem.labelName" 
          :compVal="searchItem.compVal" 
          :labelId="searchItem.labelId"
          v-else-if="searchItem.searchType === searchType.fromTodatePicker"
          v-on:datePickerChange="datePickerChange"></date-picker-component>
          <checkbox-component 
          :options="searchItem.options" 
          :labelName="searchItem.labelName"
          :compVal="searchItem.compVal" 
          :labelId="searchItem.labelId" 
          v-else-if="searchItem.searchType === searchType.checkbox"
          v-on:checkboxChange="checkboxChange"></checkbox-component>
          <single-chkbox-component 
          :labelName="searchItem.labelName" 
          :compVal="searchItem.compVal" 
          :labelId="searchItem.labelId" 
          v-else-if="searchItem.searchType === searchType.singleChkbox"
          v-on:singleChkboxChange="singleChkboxChange"></single-chkbox-component>
          <!-- 加入树形多级选择（加入原因是统计分析->车辆入网数->地区汇总）-->
          <tree-checkbox-component 
          :labelName="searchItem.labelName" 
          :treeOps="searchItem.treeOps" 
          :treeChkboxProps="searchItem.treeChkboxProps" 
          :compVal="searchItem.compVal" 
          :labelId="searchItem.labelId" 
          v-else-if="searchItem.searchType === searchType.treeCheckbox"
          v-on:treeCheckboxChange="treeCheckboxChange"></tree-checkbox-component>
        </el-row>
        <el-row class="multi-level-no-table-button">
          <!--注释人：向浩
                注释时间：2018-06-05
                注释原因：由于不方便调用button单击事件，所以取消将button封装为一个组件
            -->
          <!-- <button-component :iconName="btnItem.iconName" :btnName="btnItem.btnName" v-for="(btnItem, btnKey) of multiLevelSourceData.btnEvents" :key="btnKey" @click="handleBtnClick(btnItem.btnId)"></button-component> -->
          <el-button 
          type="primary" 
          :icon="btnItem.iconName" 
          v-for="(btnItem, btnKey) of multiLevelSourceData.btnEvents" 
          :key="btnKey" 
          @click="handleBtnClick(btnItem.btnId, btnItem.ctrlId)" 
          class="btn-com" :disabled=btnItem.isDisabled
          v-hasAccess= "{accessId: btnItem.ctrlId}">{{btnItem.btnName}}</el-button>
          <!-- class="btn-com">{{btnItem.btnName}}</el-button> -->
        </el-row>
        <el-table 
          ref="singleTable"
          :data="multiLevelSourceData.TabCtnt"
          highlight-current-row
          @current-change="handleRowChange"
          max-height="690"
          style="width: 100%" 
          :default-sort="{prop: 'date', order: 'descending'}"
          row-class-name="table-body-row-class-name"
          header-cell-class-name="table-cell-class-name"
          class="multi-level-no-table"
          v-loading="multiLevelSourceData.loading"
          @row-dblclick="rowDblClick"
          @row-click="handleRowClick">
          <!--注释人：向浩
          注释时间：2018-07-17
          注释原因：去掉排序字段
          -->
          <!-- sortable -->
          <el-table-column 
          :prop="tabHeaderItem.headerKey" 
          :label="tabHeaderItem.headerVal" 
          v-if="tabHeaderItem.subHeaders.length == 0" 
          v-for="(tabHeaderItem,tabHeaderKey) in multiLevelSourceData.tabHeader" 
          :key="tabHeaderKey"
          align="center"
          header-align="center"
          :width="tabHeaderItem.width">
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
            <el-table-column 
            :prop="subHeaderItem.headerKey" 
            :label="subHeaderItem.headerVal" 
            v-if="subHeaderItem.slabelName == undefined" 
            v-for="(subHeaderItem, subHeaderKey) of tabHeaderItem.subHeaders" 
            :key="subHeaderKey" align="center" header-align="center"
            :width="subHeaderItem.width">
              <template slot-scope="scope"> 
                <router-link :to="subHeaderItem.router_link" v-if="subHeaderItem.columnType === columnType.router_link" class="table-router-link">{{scope.row[subHeaderItem.headerKey]}}</router-link>
                <p v-else-if="subHeaderItem.columnType === columnType.text">{{scope.row[subHeaderItem.headerKey]}}</p>
              </template>
            </el-table-column>
            <!-- 加入三级表头（加入原因是统计分析->车辆入网数->地区汇总）-->
            <el-table-column :label="subHeaderItem.slabelName" v-else-if="subHeaderItem.slabelName !== undefined" align="center" header-align="center">
              <el-table-column 
              :prop="ssubHeaderItem.headerKey" 
              :label="ssubHeaderItem.headerVal" 
              v-for="(ssubHeaderItem, ssubHeaderKey) of subHeaderItem.ssubHeaders" 
              :key="ssubHeaderKey" align="center" header-align="center"
               :width="ssubHeaderItem.width">
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
        <!--注释人：向浩
            注释时间：2018-06-06
            注释原因：添加分页组件来分页请求数据
            @prev-click = "prevClick"
          @next-click = "nextClick"
        -->
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="multiLevelSourceData.currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="multiLevelSourceData.total"
          class="multi-level-pagination"
          v-if="['驾驶员姓名:','角色名称:'].indexOf(multiLevelSourceData.searchCreteria[0].labelName) < 0">
        </el-pagination>
      </el-row>
</template>

<style src="./MultiLevelNoTabComponent.css" type="text/css">
</style>

<script>
import InputComponent from "@/components/InputComponent/InputComponent";
import SelectComponent from "@/components/SelectComponent/SelectComponent";
import DatePickerComponent from "@/components/DatePickerComponent/DatePickerComponent";
import SingleDatePickerComponent from "@/components/SingleDatePickerComponent/SingleDatePickerComponent";
import SingleDayPickerComponent from "@/components/SingleDayPickerComponent/SingleDayPickerComponent";
import CheckboxComponent from "@/components/CheckboxComponent/CheckboxComponent";
import SingleChkboxComponent from "@/components/SingleChkboxComponent/SingleChkboxComponent";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent";
import TreeCheckboxComponent from "@/components/TreeCheckboxComponent/TreeCheckboxComponent";
// 注释人：向浩
// 注释时间：2018-07-05
// 注释原因：因为河北第三方-统计分析-巡检报表引入时间选择器
import FromToTimePickerComponent from "@/components/FromToTimePickerComponent/FromToTimePickerComponent";
import { commonConfig } from "@/config/commonConfig";
export default {
  name: "MultiLevelTableComponent",
  props: ["tabCtntList"],
  components: {
    InputComponent,
    SelectComponent,
    DatePickerComponent,
    SingleDatePickerComponent,
    SingleDayPickerComponent,
    CheckboxComponent,
    SingleChkboxComponent,
    ButtonComponent,
    TreeCheckboxComponent
  },
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
        searchCtrlId: '',
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
      multiLevelActiveIndex: 0,
      // disabled: 'disabled' //禁用导出，打印按钮
      currentRow: null
    };
  },
  methods: {
    // 处理Input子组件传递上来的最新值
    inputChange: function(msg) {
      this.mapNewToSourceData(msg);
    },
    // 处理select子组件传递上来的最新值
    selectChange: function(msg) {
      this.mapNewToSourceData(msg);
      if (msg.labelId === this.selectType.CheckType) {
        //判断点击的单选框为考核类型
        for (let searchItem in this.multiLevelSourceData.searchCreteria) {
          let searchTemp = this.multiLevelSourceData.searchCreteria[searchItem];
          if (searchTemp.labelId === this.selectType.DatePicker) {
            //找到日期选择器的配置项singleDatePicker
            this.multiLevelSourceData.searchCreteria[searchItem] = this.searchCheckType(
              msg.compVal,
              msg.options
            );
            return;
          }
        }
      }
    },
    // 处理checkbox子组件传递上来的最新值
    checkboxChange: function(msg) {
      this.mapNewToSourceData(msg);
    },
    // 处理singlecheckbox子组件传递上来的最新值
    singleChkboxChange: function(msg) {
      this.mapNewToSourceData(msg);
    },
    // 封装查找选中的考核类型的函数
    searchCheckType: function(value, options) {
      for (let optItem of options) {
        if (optItem.value === value) {
          return optItem;
        }
      }
    },
    // 处理datePicker子组件传递上来的最新值
    datePickerChange: function(msg) {
      this.mapNewToSourceData(msg);
    },
    // 处理datePicker子组件传递上来的最新值
    singleDatePickerChange: function(msg) {
      this.mapNewToSourceData(msg);
    },
    // 处理树状下拉多选框（treeCheckbox）子组件传递上来的最新值
    treeCheckboxChange: function(msg) {
      this.mapNewToSourceData(msg);
    },
    // 处理单个日期选择器(singleDayPicker)子组件传递上来的最新值
    singleDayPickerChange: function(msg) {
      this.mapNewToSourceData(msg);
    },
    // 将子组件传上来的最新值赋给对应的数据集封装为一个函数
    mapNewToSourceData: function(msg) {
      for (let searchItem of this.multiLevelSourceData.searchCreteria) {
        let searchTemp = this.multiLevelSourceData.searchCreteria[searchItem];
        if (searchItem.labelId === msg.labelId) {
          if (this.preSearchType.indexOf(msg.labelId) >= 0) {
            searchItem.compVal = msg.compVal;
            searchItem.compId = msg.compId;
          } else searchItem.compVal = msg.compVal;
          break;
        }
      }
    },
    handleBtnClick: function(btnId, ctrlId) {
      switch (btnId) {
        case commonConfig.btnEventsId.search:
          this.searchCtrlId = ctrlId;
          const firstPageSearch = {
            currentPage: 1,
            searchCreteria: this.multiLevelSourceData.searchCreteria,
            isSplitPage: true,
            ctrlId
          };
          this.multiLevelSourceData.currentPage = 1; //注意当点击查询按钮的时候需要重置页码为1
          this.$emit("handleClickSearch", firstPageSearch);
          break;
        case commonConfig.btnEventsId.export_data:
          const firstPageExport = {
            currentPage: 1,
            searchCreteria: this.multiLevelSourceData.searchCreteria,
            isSplitPage: false,
            ctrlId
          };
          // 显示正在下载的按钮
          this.multiLevelSourceData.loading = true;
          this.$emit("handleClickExpData", firstPageExport);
          break;
        // 注释人：向浩
        // 注释时间：2018-06-22
        // 注释原因：增加河北项目中检查回执单页面的增加按钮事件相应
        case commonConfig.btnEventsId.add:
          this.$emit("handleAddEvent", true);
          break;
        case commonConfig.btnEventsId.edit:
          this.$emit("handleEditBtn",true);
          break;
        case commonConfig.btnEventsId.delete:
          this.$emit("handleDeleteBtn",true);
          break;
        case commonConfig.btnEventsId.initpwd:
          this.$emit("handleInitpwdBtn",true);
          break;
        case commonConfig.btnEventsId.rolemgmnt:
          this.$emit("handleRoleMgmtBtn",true);
          break;
          accessmgmnt;
        case commonConfig.btnEventsId.accessmgmnt:
          this.$emit("handleAccessmgmntBtn",true);
          break;
        case commonConfig.btnEventsId.viewOptionDetail:
          this.$emit("handleviewOptionDetail", true);
          break;
        case commonConfig.btnEventsId.getNewChoucha:
          this.$emit("handlegetNewChoucha", true);
          break;
        default:
      }
    },
    handleCurrentChange: function(currentPage) {
      const changePage = {
        currentPage,
        searchCreteria: this.multiLevelSourceData.searchCreteria,
        isSplitPage: true,
        ctrlId: this.searchCtrlId //将查询按钮的id号返回给翻页的组件
      };
      this.$emit("handleCurrentChange", changePage);
    },
    //行双击事件目前只针对双随机抽查，后期需要加上其他的功能
    rowDblClick: function() {
      this.$emit("handleviewOptionDetail", true);
    },
    // 行单击事件处理，目前只针对基本信息-运输企业管理，后期需要加上其他的功能
    handleRowClick: function(row, event, column){
      this.$refs.singleTable.setCurrentRow(row); //高亮当前行
      this.$emit("handleRowClick", row);
    },
    handleRowChange(val){
      this.currentRow = val;
    }
  }
};
</script>