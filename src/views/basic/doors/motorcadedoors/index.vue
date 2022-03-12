<template>
  <div>
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
          <el-form-item prop="customerName">
            <el-select
              style="width: 100%"
              v-model="queryParams.customerName"
              filterable
              clearable
              @change="handleQuery"
              no-data-text="无匹配数据"
              placeholder="请选择"
            >
              <el-option
                v-for="item in optionsCustomer"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="searchParam">
            <el-input
              v-model.trim="queryParams.searchParam"
              placeholder="客户/门点简称/门点全称"
              clearable
              size="small"
              style="width: 200px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>

            <el-popover width="380" popper-class="myPopover" v-model="searchVisible">
              <!-- 高级搜索 -->
              <advanced-search
                :searchVisible.sync="searchVisible"
                @search-success="onSearchSuccess"
              ></advanced-search>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                plain
                slot="reference"
              >高级搜索</el-button>
            </el-popover>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['order:doors:add']"
            >新增</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="doorsList"
          @row-dblclick="updateDate"
          highlight-current-row
          height="450px"
        >
          <el-table-column
            label="客户"
            align="center"
            prop="customerName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="门点简称" align="center" prop="doorAs" :show-overflow-tooltip="true" />
          <el-table-column
            label="门点全称"
            align="center"
            prop="doorFullName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="联系人"
            align="center"
            prop="contacts"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="联系电话"
            align="center"
            prop="contactNumber"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="地址"
            align="center"
            prop="address"
            :formatter="addressFiter"
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
                v-hasPermi="['order:doors:edit']"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['order:doors:del']"
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
            <el-form-item label="客户名" prop="customerName">
              <el-select
                style="width: 100%"
                v-model="form.customerId"
                filterable
                @change="change"
                placeholder="输入搜索客户名"
              >
                <el-option
                  v-for="item in optionsCustomer"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="门点简称" prop="doorAs">
              <el-input v-model.trim="form.doorAs" placeholder="请输入门点简称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="门点全称" prop="doorFullName">
              <el-input v-model.trim="form.doorFullName" placeholder="请输入门点全称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <v-distpicker
                @selected="onSelected"
                :province="form.province"
                :city="form.city"
                :area="form.area"
                style="display: inline-block"
              ></v-distpicker>
              <el-input style="padding-top: 5px" v-model="form.address" placeholder="详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系人" prop="contacts">
              <el-input v-model.trim="form.contacts" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model.trim="form.contactNumber" placeholder="请输入联系电话" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
                maxlength="50"
                show-word-limit
              ></el-input>
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
import { validatenull } from '@/utils/validate';
import { listDoors, addDoors, updateDoors, delDoors } from '@/api/basic/doors';
import { removeSessionStorage } from '@/utils/sessionStorage';
import { getCorporateIdentify } from '@/utils/util';
import store from '@/store';
import VDistpicker from 'v-distpicker';
import AdvancedSearch from '@/views/basic/doors/advancedSearch/index.vue';
export default {
  name: 'MotorcadeDoors',
  components: {
    VDistpicker,
    'advanced-search': AdvancedSearch
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 客户表格数据
      doorsList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerName: '',
        searchParam: '',
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc',
        customerId: ''
      },
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      rules: {
        customerName: [
          { required: true, message: '客户名不能为空', trigger: 'blur' }
        ],
        doorAs: [
          { required: true, message: '门点简称不能为空', trigger: 'blur' }
        ],
        doorFullName: [
          { required: true, message: '门点全称不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ]
      },
      optionsCustomer: [],
      //高级搜索是否显示
      searchVisible: false,
      loadingBtn: false
    };
  },
  created() {
    this.getList();
    this.optionsCustomer = store.getters.customer;
  },
  methods: {
    /** 查询门点列表 */
    getList() {
      this.loading = true;
      this.queryParams.corporateIdentify = getCorporateIdentify();
      listDoors(this.queryParams).then((response) => {
        this.doorsList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        customerId: undefined,
        customerName: undefined,
        doorAs: undefined,
        doorFullName: undefined,
        contacts: undefined,
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
      if (row.area === null) {
        if (row.address === null) {
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
      if (!validatenull(this.queryParams.customerName)) {
        var item = this.optionsCustomer.filter((item) => {
          if (this.queryParams.customerName == item.value) {
            return item;
          }
        });
      } else {
        this.queryParams.customerId = undefined;
      }

      this.queryParams.page = 1;
      if (!validatenull(item)) {
        this.queryParams.customerId = item[0].id;
      }
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加门点';
    },
    onSearchSuccess(res) {
      var params = {
        pageName: 1,
        pageSize: 10,
        contacts: res.contacts,
        contactNumber: res.contactNumber,
        province: res.province,
        city: res.city,
        area: res.area,
        address: res.address,
        corporateIdentify: getCorporateIdentify(),
        sort: 'create_date',
        order: 'desc'
      };
      Object.assign(this.queryParams, params);
      // this.getList();
    },
    /** 修改按钮操作 */
    updateDate(row) {
      this.form = Object.assign({}, row);
      this.open = true;
      this.title = '修改门点';
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除门点为"' + row.doorAs + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delDoors(row.id);
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
    },
    change(val) {
      let obj = {};
      obj = this.optionsCustomer.find((item) => {
        return item.id === val;
      });
      this.form.customerName = obj.label;
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
            updateDoors(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  this.open = false;
                  this.getList();
                  // 添加成功 删除缓存，重新拉取并存入缓存
                  removeSessionStorage({ name: 'customer' });
                  const corporateIdentify = getCorporateIdentify();
                  let obj = {
                    corporateIdentify: corporateIdentify,
                    state: 1
                  };
                  store.dispatch('GetConstant', obj).then(() => {});
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.doorAs,
                    type: 'warning'
                  });
                }
              } else {
                this.msgError(response.data.msg);
              }
              this.loadingBtn = false;
            });
          } else {
            addDoors(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  this.open = false;
                  this.getList();
                  // 添加成功 删除缓存，重新拉取并存入缓存
                  removeSessionStorage({ name: 'customer' });
                  const corporateIdentify = getCorporateIdentify();
                  let obj = {
                    corporateIdentify: corporateIdentify,
                    state: 1
                  };
                  store.dispatch('GetConstant', obj).then(() => {});
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.doorAs,
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
