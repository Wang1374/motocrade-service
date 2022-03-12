<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--客户数据-->
      <el-col :span="24" :xs="24">
        <div v-show="showType === 0">
          <el-form
            :model="queryParams"
            ref="queryForm"
            @submit.native.prevent
            :inline="true"
            label-width="68px"
          >
            <el-form-item prop="searchParam">
              <el-input
                v-model.trim="queryParams.searchParam"
                placeholder="公司抬头/代码"
                clearable
                size="small"
                style="width: 200px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['order:clientele:add']"
              >新增</el-button>
            </el-col>
            <!-- <el-col :span="1.5">
              <el-button
                type="info"
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
              >导入客户信息</el-button>
            </el-col>-->
          </el-row>

          <el-table
            v-loading="loading"
            :data="clientList"
            highlight-current-row
            height="450px"
            :row-class-name="tableRowClassName"
          >
            <el-table-column
              label="公司抬头"
              prop="companyName"
              min-width="130"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="代码"
              align="center"
              prop="companyCode"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="性质"
              align="center"
              prop="nature"
              :formatter="natureFiter"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="地址"
              min-width="110"
              align="center"
              :formatter="addressFiter"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="账期" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{ scope.row.paymentDays + "天" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="结算方式"
              align="center"
              prop="clearingForm"
              :formatter="clfFiter"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="对账方式"
              align="center"
              prop="howToAccount"
              :formatter="htatFiter"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作人员"
              align="center"
              prop="operationStaff"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="操作"
              align="center"
              width="180"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="updateDate(scope.row, scope.$index)"
                  v-hasPermi="['order:clientele:edit']"
                >修改</el-button>
                <el-button
                  v-if="scope.row.userId !== 1"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  :disabled="scope.row.identifier === 'admin'"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['order:clientele:del']"
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
        </div>

        <div v-if="showType === 1">
          <el-page-header @back="goBack" content="详情信息"></el-page-header>
          <cp-details
            ref="detailsChild"
            :temp="temp"
            :natureType="natureType"
            v-on:typeChanged="typeChanged"
          ></cp-details>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
      
<script>
import { listClientele, delClientele } from '@/api/basic/clientele';
import { getToken } from '@/utils/auth';
import { getCorporateIdentify } from '@/utils/util';
import { removeSessionStorage } from '@/utils/sessionStorage';
import store from '@/store';
import Details from './details/index.vue';

export default {
  name: 'Clientele',
  components: {
    'cp-details': Details
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 客户表格数据
      clientList: [],
      // 客户导入参数
      upload: {
        // 是否显示弹出层（客户导入）
        open: false,
        // 弹出层标题（客户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的客户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        searchParam: '',
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc'
      },
      showType: 0,
      temp: null,
      natureType: 1,
      //修改当前行
      editRow: -1
    };
  },
  created() {
    this.getList();
  },

  methods: {
    /** 查询客户列表 */
    getList() {
      this.loading = true;
      this.queryParams.corporateIdentify = getCorporateIdentify();
      listClientele(this.queryParams).then((response) => {
        this.clientList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    natureFiter(row, column) {
      return row.nature == 1 ? '客户' : row.nature == 2 ? '供应商' : '';
    },
    addressFiter(row, column) {
      if (row.area === undefined) {
        if (typeof row.chineseAddress === undefined) {
          return '';
        } else {
          return row.chineseAddress;
        }
      } else {
        return row.province + row.city + row.area + row.chineseAddress;
      }
    },
    clfFiter(row, column) {
      return row.clearingForm == 1
        ? '票结'
        : row.clearingForm == 2
        ? '月结'
        : '';
    },
    htatFiter(row, column) {
      return row.howToAccount == 1
        ? '单票'
        : row.howToAccount == 2
        ? '多票'
        : '';
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.temp = {};
      this.showType = 1;
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '客户导入';
      this.upload.open = true;
    },
    /** 修改按钮操作 */
    updateDate(row, index) {
      this.editRow = index;
      this.temp = JSON.parse(JSON.stringify(row));
      this.showType = 1;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.editRow && this.editRow > -1) {
        return 'warning-row';
      }
      return '';
    },
    // 返回事件
    goBack() {
      //刷新列表
      this.getList();
      let chlidObj = this.$refs.detailsChild.form;
      if (JSON.stringify(this.temp) == JSON.stringify(chlidObj)) {
        this.showType = 0;
      } else {
        this.$confirm('详细信息尚未保存, 确定要离开吗?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 刷新列表
            this.getList();
            this.showType = 0;
          })
          .catch(() => {});
      }
    },
    // 成功回调事件
    typeChanged(data) {
      this.temp = JSON.parse(JSON.stringify(data));
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除客户为"' + row.companyName + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return delClientele(row.id);
        })
        .then(() => {
          this.getList();
          // 删除缓存，重新拉取并存入缓存
          removeSessionStorage({ name: 'customer' });
          const corporateIdentify = getCorporateIdentify();
          let obj = {
            corporateIdentify: corporateIdentify,
            state: 1
          };
          store.dispatch('GetConstant', obj).then(() => {});
          this.msgSuccess('删除成功');
        })
        .catch(function () {});
    }
  }
};
</script>
<style>
.el-divider--vertical {
  border-left: 3px solid #408eff;
}
.el-page-header__left .el-icon-back {
  color: #409eff;
}
.el-page-header__title {
  color: #409eff;
}
.bg {
  overflow: auto;
  min-width: 850px;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
