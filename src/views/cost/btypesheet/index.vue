<template>
  <div class="app-container">
    <!--输入搜索框-->
    <el-form :inline="true" :v-model="queryParams" class="demo-form-inline" @submit.native.prevent>
      <el-form-item prop="customerName">
        <el-select
          ref="customer"
          style="width: 100%"
          clearable
          v-model="queryParams.customerName"
          @change="customerNameQuery"
          filterable
          no-data-text="无匹配数据"
          placeholder="全部往来单位"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchCaseNumber" type="primary" size="small" icon="el-icon-search">搜索</el-button>
        <el-popover width="380" popper-class="myPopover" v-model="searchVisible">
          <advanced-search :searchVisible.sync="searchVisible" @search-success="onSearchSuccess"></advanced-search>
        </el-popover>
      </el-form-item>
    </el-form>

    <el-table
      border
      ref="multipleTable"
      :data="profitData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      height="450px"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="btype" label="客户名称" width="120" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="achieve" label="应收" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ Number(scope.row.achieve).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realisticAchieve" label="实收" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ Number(scope.row.realisticAchieve).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pay" align="center" label="应付" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ Number(scope.row.pay).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realisticPay" align="center" label="实付" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ Number(scope.row.realisticPay).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="extraAchieve" label="其它应收" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ Number(scope.row.extraAchieve).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="realisticExtraAchieve"
        label="其它实收"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ Number(scope.row.realisticExtraAchieve).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="extraPay" align="center" label="其它应付" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ Number(scope.row.extraPay).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realisticExtraPay" label="其它实付" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ Number(scope.row.realisticExtraPay).toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getProfitList"
    />
  </div>
</template>

<script>
import store from "@/store";
import { getCorporateIdentify } from "@/utils/util";
import { getbtypeProfitList } from "@/api/cost/costMgt.js";
import { Subtr, addNum } from "@/utils/ruoyi";
import AdvancedSearch from "../analysicSearch/index.vue";
import ItemVue from "../../../layout/components/Sidebar/Item.vue";

export default {
  name: "BtypeSheet",
  components: {
    "advanced-search": AdvancedSearch,
  },
  data() {
    return {
      formData: null,
      //表格数据
      profitData: [],
      //查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sort: "",
        order: "",
        belongCompaniesId: getCorporateIdentify(),
        // vehicleOwnership: 1,
        // blNos: "",
      },
      //选中的数据
      multipleSelection: [],
      showCostType: 0,
      total: 0,
      searchVisible: false,
      //车辆归属
      vehicleBelongOptions: [
        {
          value: 0,
          label: "全部车辆",
        },
        {
          value: 1,
          label: "公司车辆",
        },
        {
          value: 2,
          label: "外部车辆",
        },
      ],
    };
  },
  filters: {
    orderTypeFiter: function (value) {
      const statusMap = {
        1: "海运出口",
        2: "海运进口",
        3: "空运出口",
        4: "空运进口",
      };
      return statusMap[value];
    },
  },
  created() {
    this.getProfitList();
    this.customerOptions = store.getters.customer; // 获取客户信息
  },
  methods: {
    //表格中车辆状态的校验
    clfFiters(row, column) {
      return row.vehicleOwnership == 1
        ? "公司车辆"
        : row.vehicleOwnership == 2
          ? "外部车辆"
          : "";
    },
    customerNameQuery(res) {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        sort: "create_date",
        order: "desc",
        belongCompaniesId: getCorporateIdentify(),
        vehicleOwnership: "1",
        customerName: res,
      };
      this.getProfitList();
    },
    //获取 往来报表 列表
    getProfitList() {
      getbtypeProfitList(this.queryParams).then((response) => {
        this.total = response.data.total;
        this.profitData = response.data.list;
      });
    },
    searchCaseNumber() {
      this.getProfitList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //高级搜索
    onSearchSuccess(res) {
      var params = {
        pageNum: 1,
        pageSize: 10,
        sort: "create_date",
        order: "desc",
        belongCompaniesId: getCorporateIdentify(),
        orderType: res.orderType,
        customerName: res.customerName,
        vehicle: res.vehicle,
        orderNumber: res.orderNumber,
        beginTime: res.beginTime,
        endTime: res.endTime,
        otEndTime: res.otEndTime,
        otBeginTime: res.otBeginTime,
      };
      Object.assign(this.queryParams, params);
      this.getProfitList();
    },
  },
};
</script>
<style scoped>
.el-popover.myPopover {
  padding: 0px;
}
</style>