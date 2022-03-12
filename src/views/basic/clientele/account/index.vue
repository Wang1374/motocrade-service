<template>
  <el-row :gutter="10" style="margin-left: 36px">
    <el-col :span="8" v-for="(item, index) in accountList" :key="index" style="padding-bottom: 5px">
      <el-card :body-style="{ padding: '0px 10px 0px 0px', height: '170px' }" shadow="never">
        <!-- <i class="el-icon-edit" @click="updateDate(item)" ></i> -->
        <el-button
          :disabled="belongCompaniesId=='0'"
          @click="updateDate(item)"
          type="text"
          class="button"
          icon="el-icon-edit"
        ></el-button>
        <el-button
          :disabled="belongCompaniesId=='0'"
          @click="deleteData(item)"
          type="text"
          class="button"
          icon="el-icon-delete"
          style="color: red;margin-left:20px"
        ></el-button>

        <div style="padding: 1px 0 0 10px">
          <div>
            发票抬头：
            <span class="span_sty">{{ item.invoiceTitle }}</span>
          </div>
          <div>
            发票类型：
            <span class="span_sty">{{ item.invoiceType }}</span>
          </div>
          <div>
            社会统一信用代码：
            <span class="span_sty">{{ item.uscc }}</span>
          </div>
          <div>
            地址:
            <span
              class="span_sty"
            >{{item.province}} {{item.city}} {{item.area}} {{ item.accountAddress }}</span>
          </div>
          <div>
            电话:
            <span class="span_sty">{{ item.accountPhone }}</span>
          </div>
          <div>
            人民币开户行：
            <span class="span_sty">{{ item.rmbBank }}</span>
          </div>
          <div>
            人民币账号：
            <span class="span_sty">{{ item.rmbAccount }}</span>
          </div>
          <div>
            美金开户行：
            <span class="span_sty">{{ item.usdBank }}</span>
          </div>
          <div>
            美金账号：
            <span class="span_sty">{{ item.usdAccount }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" style="padding-bottom: 5px">
      <el-card
        :body-style="{
          padding: '0px 10px 0px 0px',
          height: '170px',
          background: 'aliceblue',
        }"
        shadow="never"
      >
        <div style="text-align: center">
          <el-link
            @click="addDate"
            style="font-size: 100px; padding-top: 10px"
            icon="el-icon-circle-plus-outline"
            :underline="false"
          ></el-link>
          <div style="color: #409eff">添加账号</div>
        </div>
      </el-card>
    </el-col>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      center
      v-if="open"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="125px">
        <el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票抬头" prop="invoiceTitle">
                <el-input v-model.trim="form.invoiceTitle" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票类型" prop="invoiceTitle">
                <el-input v-model.trim="form.invoiceType" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="社会统一信用代码" prop="uscc">
                <el-input v-model.trim="form.uscc" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="accountPhone">
                <el-input v-model.trim="form.accountPhone" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="人民币开户行" prop="rmbBank">
                <el-input v-model.trim="form.rmbBank" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="人民币账号" prop="rmbAccount">
                <el-input v-model.trim="form.rmbAccount" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="美金开户行" prop="usdBank">
                <el-input v-model.trim="form.usdBank" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="美金账号" prop="usdAccount">
                <el-input v-model.trim="form.usdAccount" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24">
            <el-form-item label="地址" prop="accountAddress">
              <v-distpicker
                @selected="onSelected"
                :province="form.province"
                :city="form.city"
                :area="form.area"
                style="display: inline-block;"
              ></v-distpicker>
              <el-input style="padding-top: 5px;" v-model="form.accountAddress" placeholder="详细地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loadingBtn" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import {
  listAccount,
  addAccount,
  updateAccount,
  deleteAccount
} from '@/api/basic/account';
import { getCorporateIdentify } from '@/utils/util';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Account',
  props: {
    customerId: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    uscc: {
      type: String,
      default: ''
    },
    belongCompaniesId: {
      type: String
    },
    temp: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 客户账户数据
      accountList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      form: {},
      // 表单校验
      rules: {
        invoiceTitle: [{ required: true, message: '发票抬头', trigger: 'blur' }]
      },
      loadingBtn: false
    };
  },
  created() {
    this.getList(this.customerId);
  },
  methods: {
    onSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
    },
    /** 查询客户账户列表 */
    getList(customerId) {
      // 通过客户id查询客户账户列表
      listAccount(customerId).then((response) => {
        this.accountList = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        customerId: this.customerId,
        invoiceTitle: this.companyName,
        uscc: this.uscc,
        rmbBank: undefined,
        rmbAccount: undefined,
        usdBank: undefined,
        usdAccount: undefined
      };
      this.resetForm('form');
    },
    addDate() {
      this.reset();
      this.$set(this.form, 'province', this.temp.province);
      this.$set(this.form, 'city', this.temp.city);
      this.$set(this.form, 'area', this.temp.area);
      this.$set(this.form, 'accountAddress', this.temp.chineseAddress);
      this.open = true;
      this.title = '账户信息';
    },
    updateDate(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.open = true;
      this.title = '账户信息';
    },
    //删除数据
    deleteData(data) {
      this.$confirm(
        '是否确认删除客户为"' + data.invoiceTitle + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return deleteAccount(data.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        })
        .catch(function () {});
    },
    submitForm: function () {
      this.form.belongCompaniesId = getCorporateIdentify();
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          if (!validatenull(this.form.id)) {
            updateAccount(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess('修改成功');
                  this.open = false;
                  this.getList(this.customerId);
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.invoiceTitle,
                    type: 'warning'
                  });
                } else if (response.data.data === -1) {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              } else {
                this.msgError(response.data.msg);
              }
              this.loadingBtn = false;
            });
          } else {
            addAccount(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess('新增成功');
                  this.open = false;
                  this.getList(this.customerId);
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.invoiceTitle,
                    type: 'warning'
                  });
                } else if (response.data.data === -1) {
                  this.$message({
                    message: response.data.msg,
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
<style>
.span_sty {
  font-weight: bold;
}
.button {
  padding: 0;
  float: right;
}
</style>
