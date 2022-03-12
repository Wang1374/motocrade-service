<template>
  <div style="padding-bottom: 20px;">
    <el-row :gutter="20">
      <!--客户数据-->
      <el-col :span="24" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="costsSetList" highlight-current-row height="440px">
          <el-table-column label="序号" type="index" width="50" />
          <el-table-column
            label="费用名称"
            align="center"
            prop="feeName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="费用代码"
            align="center"
            prop="feeCode"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="币种" align="center" prop="currency" :show-overflow-tooltip="true" />
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
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
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
      width="400px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="费用名称" prop="feeName">
              <el-input v-model="form.feeName" placeholder="请输入费用名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="费用代码" prop="feeCode">
              <el-input
                v-model="form.feeCode"
                placeholder="请输入费用代码"
                class="MytoUpper"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="币种" prop="currency">
              <el-select v-model="form.currency" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
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
  listCostsSet,
  addCostsSet,
  updateCostsSet,
  delCostsSet
} from "@/api/basic/costsset";
import { removeSessionStorage } from "@/utils/sessionStorage";
import { getCorporateIdentify } from "@/utils/util";
import store from "@/store";

export default {
  name: "CostsSet",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 费用表格数据
      costsSetList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        corporateIdentify: "",
        sort: "",
        order: ""
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      rules: {
        feeName: [
          { required: true, message: "费用名称不能为空", trigger: "blur" }
        ],
        feeCode: [
          { required: true, message: "费用代码不能为空", trigger: "blur" }
        ],
        currency: [{ required: true, message: "币种不能为空", trigger: "blur" }]
      },
      // 币种
      currencyOptions: [
        {
          value: "AUD",
          label: "AUD"
        },
        {
          value: "CNY",
          label: "CNY"
        },
        {
          value: "EUR",
          label: "EUR"
        },
        {
          value: "GBP",
          label: "GBP"
        },
        {
          value: "HKD",
          label: "HKD"
        },
        {
          value: "INR",
          label: "INR"
        },
        {
          value: "JPY",
          label: "JPY"
        },
        {
          value: "KRW",
          label: "KRW"
        },
        {
          value: "RUB",
          label: "RUB"
        },
        {
          value: "SGD",
          label: "SGD"
        },
        {
          value: "TWD",
          label: "TWD"
        },
        {
          value: "USD",
          label: "USD"
        }
      ],
      loadingBtn: false
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
      listCostsSet(this.queryParams).then(response => {
        this.costsSetList = response.data.list;
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
        feeName: undefined,
        feeCode: undefined,
        currency: undefined
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加费用";
    },
    /** 修改按钮操作 */
    updateDate(row) {
      this.form = Object.assign({}, row);
      this.open = true;
      this.title = "修改费用";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除费用名为"' + row.feeName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function () {
          return delCostsSet(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
          removeSessionStorage({ name: "costs_set" });
          const corporateIdentify = getCorporateIdentify();
          let obj = {
            corporateIdentify: corporateIdentify,
            state: 2
          };
          store.dispatch("GetConstant", obj).then(() => { });
        })
        .catch(function () { });
    },
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loadingBtn = true;
          this.form.feeCode = this.form.feeCode.toUpperCase();
          if (this.form.id != undefined) {
            updateCostsSet(this.form).then(response => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  this.open = false;
                  this.getList();
                  // 添加成功 删除缓存，重新拉取并存入缓存
                  removeSessionStorage({ name: "costs_set" });
                  const corporateIdentify = getCorporateIdentify();
                  let obj = {
                    corporateIdentify: corporateIdentify,
                    state: 2
                  };
                  store.dispatch("GetConstant", obj).then(() => { });
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + "：" + this.form.feeName,
                    type: "warning",
                  });
                }
              } else {
                this.msgError(response.data.msg);
              }
              this.loadingBtn = false;
            });
          } else {
            addCostsSet(this.form).then(response => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  this.open = false;
                  this.getList();
                  // 添加成功 删除缓存，重新拉取并存入缓存
                  removeSessionStorage({ name: "costs_set" });
                  const corporateIdentify = getCorporateIdentify();
                  let obj = {
                    corporateIdentify: corporateIdentify,
                    state: 2
                  };
                  store.dispatch("GetConstant", obj).then(() => { });
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + "：" + this.form.feeName,
                    type: "warning",
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
<style>
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>
