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
          v-model="params.oilDate"
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
          @keyup.enter.native="searchOilCard"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchOilCard">搜索</el-button>
        <el-button type="primary" icon="el-icon-upload2" size="small" @click="handleImport">导入</el-button>
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
      <!-- <el-col :span="1.5" class="el-delete">
        <el-button
          type="danger"
          @click="deleteAll"
          style="margin-bottom: 10px"
          size="mini"
          icon="el-icon-delete"
          >删除</el-button
        >
      </el-col>-->
    </el-row>

    <!-- 邮费记录列表 @row-dblclick="handleEdit" v-loading="loading" -->
    <template>
      <el-table
        border
        :summary-method="getSummaries"
        :show-summary="true"
        ref="multipleTable"
        :data="oilxtList"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
      >
        <!--多选框-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="车牌号" align="center" prop="vehicle" width="90" fixed="left"></el-table-column>
        <!-- <el-table-column label="司机姓名" align="center" prop="driverName" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="司机手机号"
          align="center"
          prop="driverPhone"
          show-overflow-tooltip
          width="120"
        ></el-table-column>-->
        <el-table-column
          label="加油地点"
          align="center"
          prop="oilAddress"
          show-overflow-tooltip
          width="120"
        ></el-table-column>
        <el-table-column label="用油类型" align="center" prop="oilType" :formatter="clfFiters"></el-table-column>
        <el-table-column prop="oilCapacity" align="center" label="加油量(L)" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="oilPrice"
          label="单价(元/L)"
          align="center"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column
          prop="oilTotalPrice"
          label="订单金额(元)"
          align="center"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
        <el-table-column label="服务日期" align="center" prop="oilDate" width="150" sortable>
          <template v-slot="{ row }">
            {{
            formatTiem(row.oilDate, "yyyy/MM/dd HH:mm")
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="status"
          label="订单状态"
          align="center"
          :formatter="orderStatus"
        ></el-table-column>-->
        <el-table-column
          prop="invoiceNum"
          label="发票号"
          align="center"
          show-overflow-tooltip
          width="100"
        ></el-table-column>
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
        <el-table-column
          label="操作"
          style="text-align: center"
          align="center"
          width="130"
          fixed="right"
        >
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
        @pagination="getOilxtList"
      />
    </template>
    <add-oilRecord
      ref="oilRecord"
      :dialogVisible.sync="dialogVisible"
      v-if="dialogVisible"
      :temp="temp"
      :contactsOptions="contactsOptions"
      :vehicleOptions="vehicleOptions"
    ></add-oilRecord>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?belongCompaniesId=' + upload.belongCompaniesId"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载油费记录导入模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="isUpload" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exportExcel } from '@/utils/util';
import store from '@/store';
import { mapState } from 'vuex';
import {
  getOilxtCardList,
  deleteOilById,
  editOilCard,
  exportOil
} from '@/api/basic/carOilCard';
import { getCorporateIdentify } from '@/utils/util';
import Addoilrecord from '../oildetail/index';
import { validatenull } from '@/utils/ruoyi';
import { getToken } from '@/utils/auth';
export default {
  name: 'Oilxtward',
  components: {
    'add-oilRecord': Addoilrecord
  },
  data() {
    return {
      //0921
      oilxtList: [],
      total: 0,
      dialogVisible: false,
      temp: null,
      queryParams: {
        pageName: 1,
        pageSize: 10,
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc'
      },
      //车辆数组
      vehicleOptions: [],
      //司机
      contactsOptions: [],
      //车牌号数组
      vehicleOptions: [],
      params: {},
      // 邮费记录导入参数
      upload: {
        // 是否显示弹出层（邮费导入）
        open: false,
        // 弹出层标题（邮费导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的邮费数据
        belongCompaniesId: getCorporateIdentify(),
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: '/api/order/v1/oilCard/importOil'
      },
      isUpload: false
    };
  },
  created() {
    this.getOilxtList();
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
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '油费导入';
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.getOilxtList();
        this.msgSuccess('导入成功');
        this.upload.open = false;
        this.isUpload = false;
      }
      // this.upload.open = false;
    },
    // 提交上传文件
    submitFileForm() {
      this.isUpload = true;
      this.$refs.upload.submit();
    },
    //下载油费记录模板
    importTemplate() {
      exportOil('1').then((response) => {
        exportExcel(response);
      });
      this.dialogVisible = false;
    },
    //车牌号搜索框
    vehicleNameQuery() {
      this.getOilxtList();
    },
    //表格中用油状态的校验
    clfFiters(row, column) {
      if (row.oilType == '0') {
        return '92# 汽油';
      } else if (row.oilType == '1') {
        return '95# 汽油';
      } else if (row.oilType == '2') {
        return '98# 汽油';
      } else if (row.oilType == '3') {
        return '0# 柴油';
      } else if (row.oilType == '4') {
        return '-10# 柴油';
      } else {
        return '';
      }
    },
    handleEdit(row) {
      this.temp = Object.assign({}, row);
      this.dialogVisible = true;
    },
    //删除按钮
    handleDelete(row) {
      //根据id删除记录
      //执行删除
      this.$confirm('是否要删除数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteOilById(row.id);
        })
        .then(() => {
          this.getOilxtList();
          this.msgSuccess('删除成功');
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //搜索按钮
    searchOilCard() {
      this.getOilxtList();
    },
    switchInvoice(row) {
      //修改
      editOilCard(row).then((response) => {
        if (response.data.code === 200) {
          this.msgSuccess('修改成功');
          this.getOilxtList();
        }
      });
    },
    getOilxtList() {
      this.queryParams.corporateIdentify = getCorporateIdentify();
      if (!validatenull(this.params.oilDate)) {
        this.queryParams.beginTime = this.params.oilDate[0];
        this.queryParams.endTime = this.params.oilDate[1];
      } else {
        this.queryParams.beginTime = undefined;
        this.queryParams.endTime = undefined;
      }
      this.queryParams.vehicle = this.params.vehicle;
      this.queryParams.invoiceNum = this.params.invoiceNum;
      getOilxtCardList(this.queryParams).then((response) => {
        this.oilxtList = response.data.list;
        this.total = response.data.total;
      });
    },

    formatTiem(value, format) {
      return this.$utils.toDateString(value, format);
    },
    //新增邮费按钮
    handleAdd() {
      this.temp = {};
      this.dialogVisible = true;
    },
    //删除按钮
    deleteAll() {},
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
        if (column.property == 'oilTotalPrice') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(3);
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
<style  scoped>
.el-delete {
  margin-left: 10px;
}
.dialog-footer >>> .el-dialog__footer {
  text-align: center;
}
</style>