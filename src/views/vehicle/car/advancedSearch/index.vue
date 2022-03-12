<template>
  <div>
    <div style="height: 20px"></div>
    <el-form
      ref="searchForm"
      :model="searchForm"
      status-icon
      label-width="100px"
      style="overflow: auto; height: 400px; padding-right: 20px"
    >
      <el-form-item label="车辆状态" prop="vehicleState">
        <el-select v-model="searchForm.vehicleState" style="width: 100%">
          <el-option label="使用中" value="1"></el-option>
          <el-option label="未使用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行驶证有效期" prop="drivingLicenseDate">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          style="width: 100%"
          v-model="searchForm.drivingLicenseDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="挂牌号" prop="listingNumber" class="MytoUpper">
        <el-input v-model.trim="searchForm.listingNumber" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="车架号" prop="frameNumber">
        <el-input v-model.trim="searchForm.frameNumber" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="发动机号" prop="engineNumber">
        <el-input v-model.trim="searchForm.engineNumber" placeholder="请输入"></el-input>
      </el-form-item>
      <!-- <el-form-item label="默认司机" prop="driverName">
        <el-select
          ref="contacts"
          style="width: 100%"
          @change="driverChange"
          v-model="searchForm.driverName"
          filterable
          no-data-text="无匹配数据"
          placeholder="请选择"
        >
          <el-option
            v-for="item in contactsOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="司机电话" prop="driverPhone">
        <el-input v-model.trim="searchForm.driverPhone" placeholder="请输入"></el-input>
      </el-form-item>-->
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
import { mapState } from 'vuex';
export default {
  name: 'AdvancedSearch',

  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  created() {
    if (this.userInfo.identifier != 'admin') {
      this.contactsOptions = store.getters.driver;
    }
  },
  data() {
    return {
      searchForm: {},
      contactsOptions: []
    };
  },
  methods: {
    // driverChange(val) {
    //   let arr = {};
    //   //find为js数组实例方法,find,map,filter,forEach
    //   arr = this.contactsOptions.find((item) => {
    //     return item.value === val;
    //   });
    //   this.searchForm.driverPhone = arr.phone;
    // },

    // 取消
    cancel() {
      this.searchForm = {
        // driverName: '',
        // driverPhone: '',
        drivingLicenseDate: null,
        engineNumber: '',
        frameNumber: '',
        listingNumber: '',
        vehicleBelongState: '',
        vehicleState: ''
      };
      this.$emit('update:searchVisible', false);
    },
    //重置
    reset() {
      this.searchForm = {
        // driverName: '',
        // driverPhone: '',
        drivingLicenseDate: null,
        engineNumber: '',
        frameNumber: '',
        listingNumber: '',
        vehicleBelongState: '',
        vehicleState: ''
      };
    },
    // 查询
    search() {
      this.searchForm.drivingLicenseDate = formatDate(
        this.searchForm.drivingLicenseDate,
        'yyyy-MM-dd'
      );

      if (this.searchForm.listingNumber != undefined) {
        this.searchForm.listingNumber =
          this.searchForm.listingNumber.toUpperCase();
      }
      this.$emit('search-success', this.searchForm);
      this.$emit('update:searchVisible', false);
    }
  }
};
</script>
<style >
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>
