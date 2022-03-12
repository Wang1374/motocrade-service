<template>
  <div>
    <div style="height: 20px"></div>
    <el-form
      ref="searchForm"
      :model="searchForm"
      status-icon
      label-width="80px"
      style="overflow: auto; height: 240px; padding-right: 20px"
    >
      <el-form-item label="业务类型" prop="orderType">
        <el-select
          :disabled="showType !== 0"
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
      <el-form-item label="客户名称" prop="customerName">
        <el-select
          ref="customer"
          style="width: 100%"
          v-model="searchForm.customerName"
          filterable
          no-data-text="无匹配数据"
          placeholder="请选择"
        >
          <template v-for="item in customerOptions">
            <el-option v-if="item.type == 1" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </template>
          <!-- <el-option
            v-for="item in customerOptions"
            v-if="item.type == 1"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />-->
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="提单号" prop="blNo" class="MytoUpper">
        <el-input v-model.trim="searchForm.blNo" placeholder="请输入提单号"></el-input>
      </el-form-item>-->
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
import { validatenull } from '@/utils/ruoyi';
export default {
  name: 'AdvancedSearch',
  props: {
    showType: {
      type: Number
    }
  },
  data() {
    return {
      // 客户信息
      customerOptions: [],
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
      // 表单
      searchForm: {
        orderType: this.showType,
        customerName: '',
        customerId: '',
        //blNo: '',
        orderTime: null
      }
    };
  },
  created() {
    this.customerOptions = store.getters.customer; // 获取客户信息
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
        orderType: this.showType,
        customerName: '',
        customerId: '',
        //blNo: '',
        orderTime: null
      };
    },
    // 查询
    search() {
      // if (this.searchForm.blNo != undefined) {
      //   this.searchForm.blNo = this.searchForm.blNo.toUpperCase();
      // }
      if (this.searchForm.orderTime != null) {
        this.searchForm.beginTime = formatDate(
          this.searchForm.orderTime[0],
          'yyyy-MM-dd hh:mm'
        );
        this.searchForm.endTime = formatDate(
          this.searchForm.orderTime[1],
          'yyyy-MM-dd hh:mm'
        );
      }
      if (!validatenull(this.searchForm.customerName)) {
        var item = this.customerOptions.filter((item) => {
          if (this.searchForm.customerName == item.value) {
            return item;
          }
        });
        this.searchForm.customerId = item[0].id;
      }
      this.$emit('search-success', this.searchForm);
      this.$emit('update:searchVisible', false);
    }
  }
};
</script>
<style scoped>
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>
