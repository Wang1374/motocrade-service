<template>
  <div>
    <div style="height: 20px"></div>
    <el-form
      ref="searchForm"
      :model="searchForm"
      status-icon
      label-width="90px"
      style="overflow: auto; height: 250px; padding-right: 20px"
    >
      <el-form-item label="业务类型" prop="orderType">
        <el-select v-model="searchForm.orderType" style="width: 100%" placeholder="请选择">
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号" prop="vehicle" class="MytoUpper">
        <el-select
          ref="vehicle"
          filterable
          multiple
          allow-create
          style="width: 100%"
          v-model="searchForm.vehicle"
          no-data-text="无匹配数据"
          placeholder="请选择"
        >
          <el-option
            v-for="item in vehicleOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNumber" class="MytoUpper">
        <el-input v-model.trim="searchForm.orderNumber" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item label="做箱时间" prop="creatDate">
        <el-date-picker
          v-model="searchForm.packingTime"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="接单日期" prop="orderTime">
        <el-date-picker
          v-model="searchForm.orderTime"
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
import store from '@/store';
import { formatDate } from '@/utils/ruoyi';
export default {
  name: 'AdvancedSearch',
  data() {
    return {
      // 订单类型
      orderTypeOptions: [
        {
          value: 0,
          label: '所有类型'
        },
        {
          value: 1,
          label: '海运出口'
        },
        {
          value: 2,
          label: '海运进口'
        }
      ],
      //车辆数组
      vehicleOptions: [],
      searchForm: {
        orderType: 0,
        customerName: undefined,
        vehicle: undefined,
        orderNumber: undefined
      }
    };
  },
  created() {
    this.vehicleOptions = store.getters.vehicle.filter((item) => {
      return item.vehicleBelongState == 1;
    });
  },

  methods: {
    // 取消
    cancel() {
      this.reset();
      this.$emit('update:searchVisible', false);
    },
    //重置
    reset() {
      this.searchForm = {
        orderType: 0,
        customerName: undefined,
        vehicle: undefined,
        orderNumber: undefined,
        packingTime: null,
        orderTime: null
      };
    },
    // 查询
    search() {
      if (this.searchForm.packingTime != null) {
        this.searchForm.beginTime = formatDate(
          this.searchForm.packingTime[0],
          'yyyy-MM-dd hh:mm'
        );
        this.searchForm.endTime = formatDate(
          this.searchForm.packingTime[1],
          'yyyy-MM-dd hh:mm'
        );
      }
      if (this.searchForm.orderTime != null) {
        this.searchForm.otBeginTime = formatDate(
          this.searchForm.orderTime[0],
          'yyyy-MM-dd hh:mm'
        );
        this.searchForm.otEndTime = formatDate(
          this.searchForm.orderTime[1],
          'yyyy-MM-dd hh:mm'
        );
      }
      this.$emit('search-success', this.searchForm);
      this.$emit('update:searchVisible', false);
    }
  }
};
</script>
<style scoped>
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
</style>
