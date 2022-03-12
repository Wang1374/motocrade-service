<template>
  <div class="app-container">
    <!--输入搜索框-->
    <el-form :inline="true" :v-model="queryParams" class="demo-form-inline" @submit.native.prevent>
      <el-form-item prop="vehicleBelongState">
        <el-select
          v-model="queryParams.vehicleBelongState"
          @change="vehicleBelongQuery"
          size="small"
          clearable
          placeholder="请选择车辆归属"
        >
          <el-option
            v-for="item in vehicleBelongOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model.trim="queryParams.licensePlateNumber"
          placeholder="车牌号"
          size="small"
          @keyup.enter.native="searchCars"
          class="MytoUpper"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchCars" type="primary" size="small" icon="el-icon-search">搜索</el-button>
        <el-popover width="380" popper-class="myPopover" v-model="searchVisible">
          <!-- 高级搜索 -->
          <advanced-search :searchVisible.sync="searchVisible" @search-success="onSearchSuccess"></advanced-search>
          <el-button type="primary" icon="el-icon-search" size="small" plain slot="reference">高级搜索</el-button>
        </el-popover>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col :span="1.5">
        <el-button
          type="primary"
          style="margin-bottom: 10px"
          size="mini"
          icon="el-icon-plus"
          @click="updateCar"
          v-hasPermi="['vehicle:car:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5" class="el-delete">
        <el-button
          type="danger"
          @click="deleteAll"
          style="margin-bottom: 10px"
          size="mini"
          icon="el-icon-delete"
          :disabled="disabled"
          v-hasPermi="['vehicle:car:del']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5" class="el-delete">
        <el-button size="mini">利润分析</el-button>
      </el-col>-->
    </el-row>
    <template>
      <el-table
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="carList"
        ref="multipleTable"
        tooltip-effect="dark"
        style="width: 100%"
        @row-dblclick="handleEdit"
        highlight-current-row
        height="450px"
      >
        <!--多选框-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="车辆状态" align="center" :formatter="clfFiter" prop="vehicleState"></el-table-column>
        <el-table-column
          label="车辆归属"
          align="center"
          :formatter="clfFiters"
          prop="vehicleBelongState"
        ></el-table-column>
        <el-table-column prop="licensePlateNumber" align="center" label="车牌号"></el-table-column>
        <el-table-column prop="listingNumber" label="挂板号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drivingLicenseDate" label="行驶证有效期" align="center">
          <template slot-scope="scope">
            <span>
              {{
              formatDate(scope.row.drivingLicenseDate, "yyyy-MM-dd")
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="driverName" label="司机" align="center"></el-table-column>
        <el-table-column prop="driverPhone" label="电话" align="center"></el-table-column>
        <el-table-column label="操作" style="text-align: center" align="center" width="200px">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="text"
              size="mini"
              @click="handleEdit(scope.row)"
              v-hasPermi="['vehicle:car:edit']"
            >修改</el-button>
            <!-- <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
            >删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getCarList"
      />
    </template>

    <cv-popup ref="child" :forms="forms" :show.sync="show" v-if="show"></cv-popup>
  </div>
</template>

<script>
import popup from './popup';
import { mapState } from 'vuex';
import { getCorporateIdentify } from '@/utils/util';
import { listCars, delCar, deleteAllByIds } from '@/api/basic/vehicle';
import AdvancedSearch from '@/views/vehicle/car/advancedSearch/index.vue';

export default {
  name: 'Car',
  components: {
    'cv-popup': popup,
    'advanced-search': AdvancedSearch
  },
  data() {
    return {
      //车辆信息
      carInfos: {},
      //是否显示
      visible: false,
      show: false,
      //表单参数
      forms: {},
      loading: true,
      //选中的表格行数据
      tableDataAmount: [],
      //车辆列表
      carList: [],
      //分页查询车辆列表参数
      queryParams: {
        pageName: 1,
        pageSize: 10,
        licensePlateNumber: '',
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc'
      },
      //总条数
      total: 0,
      //删除按钮是否禁用
      disabled: true,
      //高级搜索是否显示
      searchVisible: false,
      //车辆归属
      vehicleBelongOptions: [
        {
          value: 0,
          label: '全部车辆'
        },
        {
          value: 1,
          label: '公司车辆'
        },
        {
          value: 2,
          label: '外部车辆'
        }
      ]
    };
  },
  created() {
    this.getCarList();
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  methods: {
    vehicleBelongQuery(res) {
      this.queryParams = {
        pageNum: 1,
        pageSize: 20,
        sort: 'create_date',
        order: 'desc',
        belongCompaniesId: getCorporateIdentify(),
        vehicleBelongState: res
      };
      this.getCarList();
    },
    //高级搜索
    // advancedSearch() {
    //   this.searchVisible = true;
    // },
    onSearchSuccess(res) {
      var Params = {
        pageName: 1,
        pageSize: 10,
        // driverName: res.driverName,
        // driverPhone: res.driverPhone,
        drivingLicenseDate: res.drivingLicenseDate,
        engineNumber: res.engineNumber,
        frameNumber: res.frameNumber,
        listingNumber: res.listingNumber,
        // vehicleBelongState: res.vehicleBelongState,
        vehicleState: res.vehicleState,
        corporateIdentify: getCorporateIdentify(),
        sort: 'create_date',
        order: 'desc'
      };
      listCars(Params).then((response) => {
        this.total = response.data.total;
        this.carList = response.data.list;
        this.loading = false;
      });
    },
    //搜索框
    searchCars() {
      this.getCarList();
    },
    //查询车辆列表
    getCarList() {
      this.loading = true;
      this.queryParams.corporateIdentify = getCorporateIdentify();
      if (this.queryParams.licensePlateNumber != undefined) {
        this.queryParams.licensePlateNumber =
          this.queryParams.licensePlateNumber.toUpperCase();
      }
      listCars(this.queryParams).then((response) => {
        this.total = response.data.total;
        this.carList = response.data.list;
        this.loading = false;
      });
    },

    //新增的点击事件，
    updateCar() {
      this.forms = {};
      //调用方法,如果不是管理员账户就查询司机列表
      if (this.userInfo.identifier != 'admin') {
        //this.getDriverList(1);
      }
      this.show = true;
    },

    //表格中车辆状态的校验
    clfFiter(row, column) {
      return row.vehicleState == 1
        ? '使用中'
        : row.vehicleState == 2
        ? '未使用'
        : '';
    },
    //表格中车辆状态的校验
    clfFiters(row, column) {
      return row.vehicleBelongState == 1
        ? '公司车辆'
        : row.vehicleBelongState == 2
        ? '外部车辆'
        : '';
    },
    //编辑按钮操作
    handleEdit(row) {
      if (this.userInfo.identifier != 'admin') {
        //this.getDriverList(row.vehicleBelongState);
      }
      this.show = true;
      this.forms = row;
    },

    //删除按钮操作
    handleDelete(row) {
      //根据车辆id删除出车记录，保养记录，维修记录，油卡记录
      // this.$confirm(
      //   "是否删除车辆:" + row.licensePlateNumber + " 的数据",
      //   "警告",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   }
      // )
      //   .then(function() {
      //     return delCar(row.id);
      //   })
      //   .then(() => {
      //     this.getCarList();
      //     this.msgSuccess("删除成功");
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消删除"
      //     });
      //   });
    },
    //多选删除
    handleSelectionChange(data) {
      this.tableDataAmount = data;
      this.disabled = this.tableDataAmount.length === 0;
    },
    deleteAll() {
      var val = this.tableDataAmount;
      //获取选中的id值，返回一个新的数组ids
      const ids = val.map((item) => item.id);
      //执行删除
      this.$confirm('是否要删除选中的数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteAllByIds({ ids: ids });
        })
        .then(() => {
          this.getCarList();
          this.msgSuccess('删除成功');
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  }
};
</script>
<style scoped>
.el-delete {
  margin-left: 10px;
}
.vxe-modal--box .vxe-modal--body {
  padding-left: 0px;
}
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
</style>