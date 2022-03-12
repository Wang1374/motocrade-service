<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--客户数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          @submit.native.prevent
          :inline="true"
          label-width="68px"
        >
          <el-form-item prop="name">
            <el-input
              v-model.trim="queryParams.searchParam"
              placeholder="堆场名称"
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
              v-hasPermi="['order:storageyard:add']"
            >新增</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="storageYardsList"
          @row-dblclick="updateDate"
          highlight-current-row
          height="450px"
        >
          <el-table-column label="堆场名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column
            label="地址"
            align="center"
            prop="address"
            :formatter="addressFiter"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="联系电话"
            align="center"
            prop="contactNumber"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="备注"
            align="center"
            prop="remark"
            min-width="110"
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
                @click="updateDate(scope.row)"
                v-hasPermi="['order:storageyard:edit']"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['order:storageyard:del']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="堆场名称" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入堆场名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model.trim="form.contactNumber" placeholder="请输入联系电话" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <v-distpicker
                @selected="onSelected"
                :province="form.province"
                :city="form.city"
                :area="form.area"
                style="display: inline-block;"
              ></v-distpicker>
              <el-input style="padding-top: 5px;" v-model.trim="form.address" placeholder="详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loadingBtn" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  listStorageYard,
  addStorageYard,
  updateStorageYard,
  delStorageYard
} from '@/api/basic/storageyard';
import { getCorporateIdentify } from '@/utils/util';
import VDistpicker from 'v-distpicker';

export default {
  name: 'Storageyard',
  components: {
    VDistpicker
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 客户表格数据
      storageYardsList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc'
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      rules: {
        name: [
          { required: true, message: '堆场名称不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ]
      },
      loadingBtn: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询堆场列表 */
    getList() {
      this.loading = true;
      this.queryParams.corporateIdentify = getCorporateIdentify();
      listStorageYard(this.queryParams).then((response) => {
        this.storageYardsList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        name: undefined,
        contactNumber: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined,
        remark: undefined
      };
      this.resetForm('form');
    },
    addressFiter(row, column) {
      if (row.area === undefined) {
        if (typeof row.address === undefined) {
          return '';
        } else {
          return row.address;
        }
      } else {
        return row.province + row.city + row.area + row.address;
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加堆场';
    },
    /** 修改按钮操作 */
    updateDate(row) {
      this.form = row;
      this.open = true;
      this.title = '修改堆场';
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除堆场为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delStorageYard(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        })
        .catch(function () {});
    },
    onSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
    },
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          if (this.form.id != undefined) {
            updateStorageYard(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  this.open = false;
                  this.getList();
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.name,
                    type: 'warning'
                  });
                }
              } else {
                this.msgError(response.data.msg);
              }
              this.loadingBtn = false;
            });
          } else {
            addStorageYard(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  this.open = false;
                  this.getList();
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.name,
                    type: 'warning'
                  });
                }
              } else {
                this.msgError(response.data.msg);
              }
              this.loadingBtn = false;
            });
          }
        }
      });
    }
  }
};
</script>
