<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.native.prevent>
      <el-form-item prop="vehicle">
        <el-select
          ref="vehicle"
          clearable
          allow-create
          style="width: 100%"
          v-model="params.vehicle"
          no-data-text="无匹配数据"
          placeholder="全部车辆"
          filterable
          @change="vehicleNameQuery"
        >
          <el-option
            v-for="item in vehicleOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="roadTime">
        <el-date-picker
          v-model="params.roadTime"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="params.searchParam"
          placeholder="发票号"
          clearable
          @keyup.enter.native="getList"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchCarRoadCost">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleAdd"
          style="margin-bottom: 10px"
          size="mini"
          icon="el-icon-plus"
        >新增</el-button>
      </el-col>
    </el-row>

    <template>
      <el-table
        border
        :summary-method="getSummaries"
        :show-summary="true"
        ref="multipleTable"
        :data="carRoadCostList"
        style="width: 100%"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column label="车牌号" align="center" prop="vehicle"></el-table-column>
        <el-table-column prop="roadExit" label="高速入口" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roadEntrance" label="高速出口" align="center" show-overflow-tooltip></el-table-column>

        <el-table-column prop="roadPrice" label="交易金额(CNY/L)" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="etcInvoice" label="发票号" align="center" show-overflow-tooltip></el-table-column>

        <el-table-column prop="roadStartDate" label="通行开始日期" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>
              {{
              formatDate(scope.row.roadStartDate, "yyyy-MM-dd hh:mm")
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="roadEndDate" label="通行截止日期" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>
              {{
              formatDate(scope.row.roadEndDate, "yyyy-MM-dd hh:mm")
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" style="text-align: center" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="text" size="mini" @click="handleEdit(scope.row)">修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <el-dialog
        title="过路费用记录"
        :visible.sync="dialogVisible"
        width="400px"
        :dialogVisible="dialogVisible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-form ref="form" :rules="rules" :model="form" label-width="110px">
          <el-form-item label="车牌号" class="MytoUpper" prop="vehicle">
            <el-select
              ref="vehicle"
              filterable
              allow-create
              style="width: 100%"
              v-model="form.vehicle"
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
          <el-form-item label="发票号" prop="etcInvoice">
            <el-input v-model="form.etcInvoice"></el-input>
          </el-form-item>
          <el-form-item label="交易金额" prop="roadPrice">
            <el-input-number controls-position="right" v-model.number="form.roadPrice"></el-input-number>
          </el-form-item>
          <el-form-item label="高速入口" prop="roadExit">
            <el-input v-model="form.roadExit"></el-input>
          </el-form-item>
          <el-form-item label="高速出口" prop="roadEntrance">
            <el-input v-model="form.roadEntrance"></el-input>
          </el-form-item>

          <el-form-item label="通行日期" prop="roadStartDate">
            <el-date-picker
              v-model="form.roadDate"
              style="width: 100%;"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>

          <!-- <el-form-item label="通行开始日期" prop="roadStartDate">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.roadStartDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="通行截止日期" prop="roadEndDate">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.roadEndDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancle">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import store from '@/store';
import { mapState } from 'vuex';
import {
  addCarRoadCost,
  getCarRoadCost,
  editCarRoadCost,
  deleteCarRoadCost
} from '@/api/basic/carRoadCost.js';
import { getCorporateIdentify } from '@/utils/util';
import { validatenull } from '@/utils/ruoyi';
export default {
  name: 'Accessroad',
  data() {
    return {
      corporateIdentify: '',
      addPoint: [{}],
      //路费费用列表
      carRoadCostList: [],
      queryParams: {
        pageName: 1,
        pageSize: 10,
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc',
        searchParam: ''
      },
      total: 0,
      dialogVisible: false,
      form: {},
      rules: {
        vehicle: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        roadDate: [
          { required: true, message: '日期不能为空', trigger: 'blur' }
        ],
        roadEndDate: [
          { required: true, message: '日期不能为空', trigger: 'blur' }
        ],
        roadPrice: [
          { required: true, message: '费用不能为空', trigger: 'blur' }
        ]
      },
      rowSpanArr: [],
      position: 0,
      loading: false,
      //车牌号数组
      vehicleOptions: [],
      params: {}
    };
  },
  created() {
    this.getList();
    this.vehicleOptions = store.getters.vehicle.filter((item) => {
      return item.vehicleBelongState == 1;
    });
    var array = [];
    array = this.vehicleOptions;
    var array1 = [];
    if (validatenull(this.userInfo.corporateIdentify)) {
      //不是管理员账号进行筛选
      if (this.userInfo.vehicles === '-1') {
        if (!validatenull(this.userInfo.vehicles)) {
          var carArray = this.userInfo.vehicles.split(',');
          for (var i = 0; i < carArray.length; i++) {
            array1.push(array.filter((item) => item.value == carArray[i])[0]);
          }
          this.vehicleOptions = array1;
        } else {
          this.vehicleOptions = [];
        }
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  methods: {
    //车牌号搜索框
    vehicleNameQuery() {
      this.getList();
    },
    getRowSpan() {
      this.rowSpanArr = [];
      this.carRepairList.forEach((item, index) => {
        if (index == 0) {
          this.rowSpanArr.push(1);
          this.position = 0;
        } else {
          if (
            this.carRepairList[index].vehicle ==
            this.carRepairList[index - 1].vehicle
          ) {
            this.rowSpanArr[this.position] += 1; //项目名称相同，合并到同一个数组中
            this.rowSpanArr.push(0);
            this.carRepairList[index].vehicle =
              this.carRepairList[index - 1].vehicle;
          } else {
            this.rowSpanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    //删除
    handleDelete(row) {
      this.$confirm('是否要删除数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteCarRoadCost(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //重置表单
    reset() {
      this.form = {
        belongCompaniesId: getCorporateIdentify(),
        vehicle: undefined,
        etcInvoice: undefined,
        roadPrice: undefined,
        roadStartDate: undefined,
        roadEndDate: undefined,
        roadExit: undefined,
        roadEntrance: undefined,
        roadDate: undefined
      };
      //清除校验
      this.resetForm('form');
    },
    setParams() {},
    //查询过路费用记录
    getList() {
      this.loading = true;
      this.queryParams.corporateIdentify = getCorporateIdentify();
      if (!validatenull(this.params.roadTime)) {
        this.queryParams.beginTime = this.dateToString(this.params.roadTime[0]);
        this.queryParams.endTime = this.dateToString(this.params.roadTime[1]);
      } else {
        this.queryParams.beginTime = undefined;
        this.queryParams.endTime = undefined;
      }
      this.queryParams.vehicle = this.params.vehicle;
      this.queryParams.searchParam = this.params.searchParam;
      getCarRoadCost(this.queryParams).then((response) => {
        this.total = response.data.total;
        this.carRoadCostList = response.data.list;
        this.loading = false;
      });
    },
    //关闭
    handleClose() {
      this.dialogVisible = false;
      this.reset();
    },
    //取消
    cancle() {
      this.dialogVisible = false;
      this.reset();
    },
    dateToString(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? '0' + d : d;
      var h = date.getHours();
      h = h < 10 ? '0' + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? '0' + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? '0' + second : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    //表单提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            //修改
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            this.form.roadStartDate = this.form.roadDate[0];
            this.form.roadEndDate = this.form.roadDate[1];
            editCarRoadCost(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('修改成功');
                this.dialogVisible = false;
                this.getList();
                this.reset();
              }
            });
          } else {
            //新增
            this.form.belongCompaniesId = getCorporateIdentify();
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            this.form.roadStartDate = this.form.roadDate[0];
            this.form.roadEndDate = this.form.roadDate[1];
            addCarRoadCost(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('新增成功');
                this.dialogVisible = false;
                this.getList();
                this.reset();
              }
            });
          }
        }
      });
    },
    //格式化日期
    formatTiem(value, format) {
      return this.$utils.toDateString(value, format);
    },
    //搜索
    searchCarRoadCost() {
      if (this.queryParams.roadTime == null) {
        this.queryParams.roadTime = [];
      }
      this.getList();
    },
    //新增
    handleAdd() {
      this.reset();
      this.dialogVisible = true;
    },
    //修改
    handleEdit(row) {
      this.dialogVisible = true;
      this.form = JSON.parse(JSON.stringify(row));
      var arr = [];
      arr[0] = this.form.roadStartDate;
      arr[1] = this.form.roadEndDate;
      this.$set(this.form, 'roadDate', arr);
    },

    //指定列求和
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property == 'roadPrice') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += " 元";
        }
      });
      return sums;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-delete {
  margin-left: 10px;
}
/deep/ .dialog-footer {
  text-align: center;
}
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
.el-input-number--medium {
  width: 250px;
}
</style>