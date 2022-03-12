<template>
  <div>
    <div style="height: 20px"></div>
    <el-form
      ref="searchForm"
      :model="searchForm"
      status-icon
      label-width="80px"
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
      <el-form-item label="客户名称" prop="customerName" v-if="accountType!=0">
        <el-select
          ref="customerName"
          v-model="searchForm.customerName"
          filterable
          clearable
          @focus="carrierCompanyFocus"
          style="width: 100%;"
          placeholder="请选择"
          no-data-text="无匹配数据"
        >
          <template v-for="item in carrierCompanyOptions">
            <el-option :key="item.id" :label="item.label" :value="item.value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNumber" class="MytoUpper">
        <el-input v-model.trim="searchForm.orderNumber" placeholder="请输入订单编号" />
      </el-form-item>
      <el-form-item label="寄单状态" prop="sendReceipStatus">
        <el-select v-model="searchForm.sendReceipStatus" style="width: 100%;" placeholder="请选择">
          <el-option
            v-for="item in sendReceipStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="封号" prop="sealNumber" class="MytoUpper">
        <el-input v-model.trim="searchForm.sealNumber" placeholder="请输入封号"></el-input>
      </el-form-item>-->
      <!-- 合作伙伴 -->
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
      <el-form-item label="车牌号" prop="vehicle" class="MytoUpper" v-if="accountType!=0">
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
      <el-form-item label="司机" prop="driver" v-if="accountType!=0">
        <el-input v-model.trim="searchForm.driver" placeholder="请输入司机"></el-input>
      </el-form-item>
      <el-form-item label="门点简称" prop="door">
        <el-input v-model.trim="searchForm.door" placeholder="请输入门点简称"></el-input>
      </el-form-item>
      <el-form-item label="运输方式" prop="typeOfShipping">
        <el-select v-model="searchForm.typeOfShipping" style="width: 100%;" placeholder="请选择">
          <el-option
            v-for="item in typeOfShippingOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="承运公司" prop="carrierCompany" v-if="accountType!=0">
        <el-select
          ref="carrierCompany"
          v-model="searchForm.carrierCompany"
          filterable
          @focus="carrierCompanyFocus"
          style="width: 100%;"
          placeholder="请选择"
          no-data-text="无匹配数据"
        >
          <template v-for="item in carrierCompanyOptions">
            <el-option :key="item.id" :label="item.label" :value="item.value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <div v-if="accountType!=0">
        <el-form-item label="应收状态" prop="ysState">
          <el-select v-model="searchForm.ysState" style="width: 100%;" placeholder="请选择">
            <el-option
              v-for="item in ysStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应付状态" prop="yfState">
          <el-select v-model="searchForm.yfState" style="width: 100%;" placeholder="请选择">
            <el-option
              v-for="item in yfStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="应收状态" prop="ptysState">
          <el-select v-model="searchForm.ptysState" style="width: 100%;" placeholder="请选择">
            <el-option
              v-for="item in ysStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应付状态" prop="ysState">
          <el-select v-model="searchForm.ysState" style="width: 100%;" placeholder="请选择">
            <el-option
              v-for="item in yfStateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div style="padding: 20px;text-align: center;">
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
      sendReceipStatusOptions: [
        {
          value: 1,
          label: '待寄'
        },
        {
          value: 2,
          label: '不寄'
        },
        {
          value: 3,
          label: '已寄'
        }
      ],
      // 运输方式
      typeOfShippingOptions: [
        {
          value: 1,
          label: '自做'
        },
        {
          value: 2,
          label: '外发'
        }
      ],
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
      // 承运公司
      carrierCompanyOptions: [],
      ysStateOptions: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '应收未全'
        },
        {
          value: 1,
          label: '应收已全'
        }
      ],
      yfStateOptions: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '应付未全'
        },
        {
          value: 1,
          label: '应付已全'
        }
      ],
      // 表单
      searchForm: {
        orderType: 0,
        customerName: undefined,
        orderNumber: undefined,
        // sealNumber: undefined,
        //合作伙伴
        //partner: undefined,
        door: undefined,
        packingTime: null,
        vehicle: undefined,
        driver: undefined,
        typeOfShipping: undefined,
        carrierCompany: undefined,
        ysState: -1,
        yfState: -1,
        ptysState: -1
      },
      //车牌号数组
      vehicleOptions: [],
      accountType: 0
    };
  },
  created() {
    this.vehicleOptions = store.getters.vehicle;
    this.accountType = store.getters.company.accountType;
  },
  methods: {
    // 承运公司 鼠标移入事件
    carrierCompanyFocus(e) {
      if (this.carrierCompanyOptions.length == 0) {
        this.carrierCompanyOptions = store.getters.customer;
      }
    },
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
        orderNumber: undefined,
        //sealNumber: undefined,
        //合作伙伴
        // partner: undefined,
        packingTime: null,
        vehicle: undefined,
        driver: undefined,
        door: undefined,
        typeOfShipping: undefined,
        carrierCompany: undefined,
        ysState: -1,
        yfState: -1,
        ptysState: -1
      };
    },
    // 查询
    search() {
      if (this.searchForm.orderNumber != undefined) {
        this.searchForm.orderNumber = this.searchForm.orderNumber.toUpperCase();
      }

      // if (this.searchForm.sealNumber != undefined) {
      //   this.searchForm.sealNumber = this.searchForm.sealNumber.toUpperCase();
      // }
      if (this.searchForm.packingTime != null) {
        this.searchForm.beginTime = formatDate(
          this.searchForm.packingTime[0],
          'yyyy-MM-dd hh:mm'
        );
        this.searchForm.endTime = formatDate(
          this.searchForm.packingTime[1],
          'yyyy-MM-dd hh:mm'
        );
      } else {
        this.searchForm.beginTime = null;
        this.searchForm.endTime = null;
      }
      // if (this.searchForm.vehicle.length) {
      //   this.searchForm.vehicle = this.searchForm.vehicle.toUpperCase();
      // }
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
