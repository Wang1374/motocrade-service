<template>
  <div>
    <div style="height: 20px"></div>
    <el-form
      ref="searchForm"
      :model="searchForm"
      status-icon
      label-width="80px"
      style="overflow: auto; height: 280px; padding-right: 20px"
    >
      <el-form-item label="业务类型" prop="orderType">
        <el-select
          v-model="searchForm.orderType"
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="订单状态" prop="orderStatus">
        <el-select
          v-model="searchForm.orderStatus"
          style="width: 100%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in orderStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="下单编号" prop="placeOrderNumber">
        <el-input
          v-model.trim="searchForm.placeOrderNumber"
          placeholder="请输入提单号"
        ></el-input>
      </el-form-item>
      <el-form-item label="业务编号" prop="customerNum">
        <el-input
          v-model.trim="searchForm.customerNum"
          placeholder="请输入提单号"
        ></el-input>
      </el-form-item>
      <el-form-item label="下单时间" prop="placeOrderTime">
        <el-date-picker
          v-model="searchForm.placeOrderTime"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div style="padding: 20px; text-align: center">
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/ruoyi";
export default {
  name: "OrderAdvanced",
  data() {
    return {
      //订单状态
      orderStatusOptions: [
        {
          value: -1,
          label: "全部",
        },
        {
          value: 1,
          label: "待接单",
        },
        {
          value: 2,
          label: "已接单",
        },
        {
          value: 3,
          label: "已派单",
        },
        {
          value: 4,
          label: "已完结",
        },
        {
          value: 0,
          label: "已取消",
        },
      ],
      // 订单类型
      orderTypeOptions: [
        {
          value: 0,
          label: "所有类型",
        },
        {
          value: 1,
          label: "海运出口",
        },
        {
          value: 2,
          label: "海运进口",
        },
      ],
      // 表单
      searchForm: {
        orderType: 0,
        orderStatus: 0,
        placeOrderNumber: "",
        customerNum: "",
        placeOrderTime: null,
      },
    };
  },
  created(){
    this.searchForm.orderStatus = this.orderStatusOptions[0].value
  },
  methods: {
    // 取消
    cancel() {
      this.reset();
      this.$emit("update:searchVisible", false);
    },
    //重置
    reset() {
      this.searchForm = {
        orderType: 0,
        orderStatus: 0,
        placeOrderNumber: "",
        customerNum: "",
        placeOrderTime: null,
      };
    },
    // 查询
    search() {
      if (this.searchForm.placeOrderTime != null) {
        this.searchForm.beginTime = formatDate(
          this.searchForm.placeOrderTime[0],
          "yyyy-MM-dd hh:mm"
        );
        this.searchForm.endTime = formatDate(
          this.searchForm.placeOrderTime[1],
          "yyyy-MM-dd hh:mm"
        );
      }
      this.$emit("search-success", this.searchForm);
      this.$emit("update:searchVisible", false);
    },
  },
};
</script>