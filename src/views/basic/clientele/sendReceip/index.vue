<template>
  <el-row :gutter="10" style="margin-left: 36px">
    <el-col :span="8" v-for="(item, index) in receipList" :key="index" style="padding-bottom: 5px">
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
            联系人：
            <span class="span_sty">{{ item.contacts }}</span>
          </div>
          <div>
            联系方式：
            <span class="span_sty">{{ item.contactWay}}</span>
          </div>
          <!-- <div>
            市:
            <span class="span_sty">{{ item.city }}</span>
          </div>
          <div>
            区：
            <span class="span_sty">{{ item.area }}</span>
          </div>-->
          <div>
            详细地址：
            <span class="span_sty">{{ item.province }} {{ item.city }} {{ item.address }}</span>
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
      width="600px"
      center
      v-if="open"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="contacts" label="联系人">
                <el-input v-model="form.contacts"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="contactWay" label="联系方式">
                <el-input v-model="form.contactWay"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24">
            <el-form-item prop="address">
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
  listReceip,
  addReceip,
  updateReceip,
  deleteReceip
} from '@/api/basic/sendReceip';
import { getCorporateIdentify } from '@/utils/util';
import { validatenull } from '@/utils/validate';
import { removeSessionStorage } from '@/utils/sessionStorage';
import store from '@/store';
export default {
  name: 'SendReceip',
  props: {
    customerId: {
      type: String,
      default: ''
    },
    companyName: {
      type: String,
      default: ''
    },
    belongCompaniesId: {
      type: String
    }
  },
  data() {
    return {
      // 客户账户数据
      receipList: [],
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
    /** 查询客户账户列表 */
    getList(customerId) {
      // 通过客户id查询客户账户列表
      listReceip(customerId).then((response) => {
        this.receipList = response.data;
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
        customerId: this.customerId
      };
      this.resetForm('form');
    },
    addDate() {
      this.reset();
      this.open = true;
      this.title = '寄单信息';
    },
    updateDate(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.open = true;
      this.title = '寄单信息';
    },
    onSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
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
          return deleteReceip(data.id);
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
            updateReceip(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess('修改成功');
                  this.open = false;
                  this.getList(this.customerId);
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
            addReceip(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess('新增成功');
                  this.open = false;
                  this.getList(this.customerId);
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
