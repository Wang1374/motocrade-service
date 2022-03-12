<template>
  <div>
    <div style="height: 20px"></div>
    <el-form
      ref="searchForm"
      :model="searchForm"
      status-icon
      label-width="90px"
      style="overflow:auto;height:400px;padding-right: 20px;"
    >
      <el-form-item label="业务类型" prop="orderType">
        <el-select v-model="searchForm.orderType" style="width: 100%;" placeholder="请选择">
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNumber" class="MytoUpper">
        <el-input v-model.trim="searchForm.orderNumber" placeholder="请输入订单编号" />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerId" v-if="company.accountType != 0">
        <el-select
          ref="customer"
          style="width: 100%;"
          clearable
          v-model="searchForm.customerId"
          filterable
          no-data-text="无匹配数据"
          placeholder="请选择"
        >
          <template v-for="item in customerOptions">
            <el-option :key="item.id" :label="item.label" :value="item.id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="往来单位" prop="btypeId" class="MytoUpper">
        <el-select
          v-model="searchForm.btypeId"
          clearable
          filterable
          style="width: 100%;"
          no-data-text="无匹配数据"
          placeholder="请选择"
        >
          <el-option
            v-for="item in customerOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合作伙伴" prop="partner">
        <el-select v-model="searchForm.partner" clearable style="width: 100%;" placeholder="请选择">
          <el-option
            v-for="item in partnerOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提单号" prop="blNo" class="MytoUpper">
        <el-input v-model.trim="searchForm.blNo" placeholder="请输入提单号"></el-input>
      </el-form-item>
      <el-form-item label="费用名称" prop="payItems" class="MytoUpper">
        <!-- <el-input v-model.trim="searchForm.payItems" placeholder="请输入费用名称"></el-input> -->
        <el-select
          ref="payItems"
          filterable
          clearable
          allow-create
          style="width: 100%"
          v-model="searchForm.payItems"
          no-data-text="无匹配数据"
          placeholder="请选择"
        >
          <el-option
            v-for="item in chargesOptions"
            :key="item.id"
            :label="item.feeName"
            :value="item.feeName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票号" prop="invoiceNo">
        <el-input v-model.trim="searchForm.invoiceNo" placeholder="请输入发票号"></el-input>
      </el-form-item>
      <el-form-item label="车牌号" prop="vehicle" class="MytoUpper">
        <el-input v-model.trim="searchForm.vehicle" placeholder="请输入车牌号"></el-input>
      </el-form-item>
      <el-form-item label="接单时间" prop="orderTime">
        <el-date-picker
          v-model="searchForm.orderTime"
          style="width: 100%;"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="实际做箱" prop="packingTime">
        <el-date-picker
          v-model="searchForm.packingTime"
          style="width: 100%;"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div style="padding: 20px;text-align: center;">
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import store from '@/store';
import { formatDate } from '@/utils/ruoyi';
import { validatenull } from '@/utils/validate';
export default {
  name: 'MakeSearch',
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
      // 客户信息
      customerOptions: [],
      // 合作伙伴
      partnerOptions: [
        {
          value: 1,
          label: '固定'
        },
        {
          value: 2,
          label: '非固定'
        }
      ],
      // 表单
      searchForm: {
        orderType: 0,
        orderNumber: undefined,
        customerId: undefined,
        btypeId: undefined,
        partner: undefined,
        blNo: undefined,
        invoiceNo: undefined,
        vehicle: undefined,
        orderTime: null,
        packingTime: null,
        payItems: undefined
      },
      //费用名称
      chargesOptions: []
    };
  },
  computed: {
    ...mapState({
      company: (state) => state.constant.company
    })
  },
  created() {
    this.customerOptions = store.getters.customer; // 获取客户信息
    this.chargesOptions = store.getters.costs_set;
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
        orderNumber: undefined,
        customerId: undefined,
        btypeId: undefined,
        partner: undefined,
        blNo: undefined,
        invoiceNo: undefined,
        vehicle: undefined,
        orderTime: null,
        packingTime: null,
        payItems: undefined
      };
    },
    // 查询
    search() {
      if (this.searchForm.orderNumber != undefined) {
        this.searchForm.orderNumber = this.searchForm.orderNumber.toUpperCase();
      }
      if (this.searchForm.blNo != undefined) {
        this.searchForm.blNo = this.searchForm.blNo.toUpperCase();
      }
      if (this.searchForm.vehicle != undefined) {
        this.searchForm.vehicle = this.searchForm.vehicle.toUpperCase();
      }
      if (this.searchForm.orderTime != null) {
        this.searchForm.jdBeginTime = formatDate(
          this.searchForm.orderTime[0],
          'yyyy-MM-dd hh:mm'
        );
        this.searchForm.jdEndTime = formatDate(
          this.searchForm.orderTime[1],
          'yyyy-MM-dd hh:mm'
        );
      } else {
        this.searchForm.jdBeginTime = null;
        this.searchForm.jdEndTime = null;
      }
      if (this.searchForm.packingTime != null) {
        this.searchForm.zxBeginTime = formatDate(
          this.searchForm.packingTime[0],
          'yyyy-MM-dd hh:mm'
        );
        this.searchForm.zxEndTime = formatDate(
          this.searchForm.packingTime[1],
          'yyyy-MM-dd hh:mm'
        );
      } else {
        this.searchForm.zxBeginTime = null;
        this.searchForm.zxEndTime = null;
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
