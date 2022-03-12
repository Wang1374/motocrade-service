<template>
  <el-dialog
    :title="vehicleTitle"
    :visible.sync="guaranteeVisible"
    width="1000px"
    :before-close="handleClose"
    append-to-body
  >
    <template>
      <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.native.prevent>
        <el-form-item prop="creatDate">
          <el-date-picker
            v-model="queryParams.guaranteeTime"
            style="width: 100%"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="searchExtraCost">搜索</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template>
      <el-table
        ref="table"
        :data="carGuaranteeList"
        style="width: 100%"
        height="300"
        border
        :show-summary="true"
        :summary-method="getSummaries"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="policyNum" label="保单号" align="center" show-overflow-tooltip></el-table-column>

        <el-table-column prop="guaranteeType" label="保险种类" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="guaranteePrice"
          label="保险金额(CNY/L)"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="startPolicyDate" label="保险开始日期" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>
              {{
              formatDate(scope.row.startPolicyDate, "yyyy-MM-dd hh:mm")
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="endPolicyDate" label="保险截止始日期" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>
              {{
              formatDate(scope.row.endPolicyDate, "yyyy-MM-dd hh:mm")
              }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="params.pageNum"
        :limit.sync="params.pageSize"
        @pagination="getList"
      />
    </template>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getCarGuarantee } from '@/api/basic/carGuarantee';
import { formatDate } from '@/utils/ruoyi';
export default {
  name: 'Carguarantee',
  props: {
    guaranteeVisible: {
      type: Boolean
    },
    vehicleTitle: {
      type: String
    },
    vehicleInfo: {
      type: Object
    }
  },

  updated() {
    this.$nextTick(() => {
      this.$refs['table'].doLayout();
    });
  },

  created() {
    this.getCurrentTime();
    this.getList();
  },
  data() {
    return {
      total: 0,
      loading: true,
      //车辆保养列表
      carGuaranteeList: [],
      queryParams: {
        guaranteeTime: []
      },
      //参数设置
      params: {
        pageName: 1,
        pageSize: 5,
        sort: 'create_date',
        order: 'desc',
        corporateIdentify: this.vehicleInfo.belongCompaniesId
      }
    };
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property == 'guaranteePrice') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = ' ';
        }
      });

      return sums;
    },

    //获取当前年
    getCurrentTime() {
      var date1 = new Date();
      var year1 = date1.getFullYear();
      var firstMonth = year1 + '-' + '01' + '-' + '01';

      var month = date1.getMonth() + 1;
      var day = date1.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      var currentdate = year1 + '-' + month + '-' + day;
      this.queryParams.guaranteeTime[0] = firstMonth;
      this.queryParams.guaranteeTime[1] = currentdate;
    },
    //设置参数
    setParams() {
      (this.params.beginTime = this.queryParams.guaranteeTime[0]),
        (this.params.endTime = this.queryParams.guaranteeTime[1]),
        (this.params.vehicle = this.vehicleInfo.vehicle),
        (this.params.corporateIdentify = this.vehicleInfo.belongCompaniesId);
    },
    //根据企业标识和车辆查询保养记录
    getList() {
      this.setParams();
      getCarGuarantee(this.params).then((response) => {
        this.carGuaranteeList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    //取消
    submit() {
      this.$emit('update:guaranteeVisible', false);
    },
    //关闭
    handleClose() {
      this.$emit('update:guaranteeVisible', false);
    },

    //格式化日期
    formatTiem(value, format) {
      return this.$utils.toDateString(value, format);
    },
    //搜索
    searchExtraCost() {
      if (this.queryParams.guaranteeTime == null) {
        this.queryParams.guaranteeTime = [];
      }
      this.getList();
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-dialog__body {
  padding-top: 10px;
}
/deep/ .el-dialog__footer {
  padding-top: 5px;
  padding-bottom: 5px;
}
/deep/ .el-table__header {
  height: 50px;
}
</style>