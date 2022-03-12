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
      <el-form-item prop="costDate">
        <el-date-picker
          v-model="params.costDate"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="invoiceNum">
        <el-input
          v-model="params.invoiceNum"
          placeholder="请输入发票号"
          clearable
          @keyup.enter.native="searchExtraCost"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchExtraCost">搜索</el-button>
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

    <el-table
      border
      :summary-method="getSummaries"
      :show-summary="true"
      :data="extraCostList"
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="车牌号" align="center" prop="vehicle" sortable></el-table-column>
      <el-table-column label="日期" align="center" width="100" sortable prop="costDate">
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.costDate, "yyyy-MM-dd") }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="costProject" label="费用名目" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="extraCost" label="金额" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="invoiceNum" label="发票号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="payStatus" label="付款状态" align="center" show-overflow-tooltip>
        <template v-slot="{ row }">
          <vxe-switch
            v-model="row.payStatus"
            @change="switchInvoice(row)"
            on-label="是"
            off-label="否"
          ></vxe-switch>
        </template>
      </el-table-column>
      <el-table-column prop="payStatement" label="付款说明" align="center" show-overflow-tooltip></el-table-column>
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
      title="其它费用记录"
      :visible.sync="dialogVisible"
      width="600px"
      :dialogVisible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用名目" prop="kilometre">
              <el-input v-model="form.costProject"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="金额" prop="mainProject">
              <el-input-number controls-position="right" v-model.number="form.extraCost"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票号" prop="invoiceNum">
              <el-input v-model="form.invoiceNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="付款状态" prop="payStatus">
              <template>
                <vxe-switch v-model="form.payStatus" on-label="是" off-label="否"></vxe-switch>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款说明" prop="invoiceNum">
              <el-input v-model="form.payStatement"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="日期" prop="costDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.costDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store';
import { mapState } from 'vuex';
import {
  saveExtraCost,
  getExtraCost,
  editExtraCost,
  deleteExtraCost
} from '@/api/basic/carExtraCost';
import { getCorporateIdentify } from '@/utils/util';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Extracost',
  data() {
    return {
      corporateIdentify: '',
      //车辆数组
      vehicleOptions: [],
      extraCostList: [],
      //保养维修数据
      maintianList: [],
      queryParams: {
        pageName: 1,
        pageSize: 10,
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc'
      },
      total: 0,
      dialogVisible: false,
      form: {
        vehicle: undefined,
        mainDate: undefined,
        kilometre: undefined,
        mainProject: undefined,
        mainPrice: undefined,
        invoiceNum: undefined,
        remark: undefined
      },
      rules: {
        vehicle: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        costDate: [
          { required: true, message: '服务日期不能为空', trigger: 'blur' }
        ],
        extraCost: [
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

    //重置表单
    reset() {
      this.form = {
        belongCompaniesId: getCorporateIdentify(),
        vehicle: undefined,
        costDate: undefined,
        costProject: undefined,
        extraCost: undefined,
        invoiceNum: undefined,
        remark: undefined
      };
      //清除校验
      this.resetForm('form');
    },
    //取消
    cancle() {
      this.dialogVisible = false;
      this.reset();
    },
    //修改按钮操作
    handleEdit(row) {
      this.dialogVisible = true;
      this.form = row;
    },
    //删除
    handleDelete(row) {
      this.$confirm('是否要删除数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteExtraCost(row.id);
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
    formatTiem(value, format) {
      return this.$utils.toDateString(value, format);
    },
    //新增
    handleAdd() {
      this.reset();
      this.dialogVisible = true;
    },
    //搜索
    searchExtraCost() {
      this.getList();
    },
    //dialog关闭
    handleClose() {
      this.dialogVisible = false;
      this.reset();
    },
    //取消
    cancle() {
      this.dialogVisible = false;
    },
    switchInvoice(row) {
      //修改
      editExtraCost(row).then((response) => {
        if (response.data.code === 200) {
          this.msgSuccess('修改成功');
          this.getList();
        }
      });
    },
    //查询其它费用列表
    getList() {
      this.loading = true;
      this.queryParams.corporateIdentify = getCorporateIdentify();
      if (!validatenull(this.params.costDate)) {
        this.queryParams.beginTime = this.params.costDate[0];
        this.queryParams.endTime = this.params.costDate[1];
      } else {
        this.queryParams.beginTime = undefined;
        this.queryParams.endTime = undefined;
      }
      this.queryParams.vehicle = this.params.vehicle;
      this.queryParams.invoiceNum = this.params.invoiceNum;
      getExtraCost(this.queryParams).then((response) => {
        this.total = response.data.total;
        this.extraCostList = response.data.list;
        //this.getRowSpan();
        this.loading = false;
      });
    },
    //表单提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            //修改
            editExtraCost(this.form).then((response) => {
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
            saveExtraCost(this.form).then((response) => {
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property == 'extraCost') {
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
<style scoped>
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
.el-input-number--medium {
  width: 180px;
}
</style>