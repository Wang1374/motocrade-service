<template>
  <el-row :gutter="10" style="margin-left: 36px">
    <el-col
      :span="8"
      v-for="(item, index) in contactwayList"
      :key="index"
      style="padding-bottom: 5px"
    >
      <el-card :body-style="{ padding: '0px 10px 0px 0px', height: '150px' }" shadow="never">
        <el-button
          @click="updateDate(item)"
          :disabled="belongCompaniesId=='0'"
          type="text"
          class="button"
          style="float: right"
          icon="el-icon-edit"
        ></el-button>
        <el-button
          @click="deleteDate(item)"
          :disabled="belongCompaniesId=='0'"
          type="text"
          class="button"
          style="float: right; color: red"
          icon="el-icon-delete"
        ></el-button>

        <div style="padding: 1px 0 0 10px">
          <div>
            联系人：
            <span class="span_sty">{{ item.contacts }}</span>
          </div>
          <div>
            手机号码：
            <span class="span_sty">{{ item.phone }}</span>
          </div>
          <div>
            座机号码：
            <span class="span_sty">{{ item.machineNumber }}</span>
          </div>
          <div>
            QQ：
            <span class="span_sty">{{ item.qq }}</span>
          </div>
          <div>
            邮箱：
            <span class="span_sty">{{ item.email }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" style="padding-bottom: 5px">
      <el-card
        :body-style="{
          padding: '0px 10px 0px 0px',
          height: '150px',
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
          <div style="color: #409eff">添加联系方式</div>
        </div>
      </el-card>
    </el-col>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="400px"
      center
      v-if="open"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-col :span="24">
            <el-form-item label="联系人" prop="contacts">
              <el-input v-model.trim="form.contacts" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model.trim="form.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="座机号码" prop="machineNumber">
              <el-input v-model.trim="form.machineNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="qq" prop="qq">
              <el-input v-model.trim="form.qq" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model.trim="form.email" />
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
  listContactway,
  addContactway,
  updateContactway,
  deleteContactway
} from '@/api/basic/contactway';
import { removeSessionStorage } from '@/utils/sessionStorage';
import { getCorporateIdentify } from '@/utils/util';
import store from '@/store';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Contactway',
  props: {
    customerId: {
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
      contactwayList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      form: {},
      // 表单校验
      rules: {
        contacts: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }]
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
      listContactway(customerId).then((response) => {
        this.contactwayList = response.data;
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
        contacts: undefined,
        phone: undefined,
        machineNumber: undefined,
        qq: undefined,
        email: undefined
      };
      this.resetForm('form');
    },
    addDate() {
      this.reset();
      this.open = true;
      this.title = '联系方式';
    },
    updateDate(data) {
      this.form = JSON.parse(JSON.stringify(data));
      this.open = true;
      this.title = '联系方式';
    },
    deleteDate(data) {
      this.$confirm(
        '是否确认删除联系人为"' + data.contacts + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return deleteContactway(data.id);
        })
        .then(() => {
          this.getList();
          // 添加成功 删除缓存，重新拉取并存入缓存
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
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          if (!validatenull(this.form.id)) {
            updateContactway(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
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
                    message:
                      response.data.msg +
                      '：' +
                      this.form.contacts +
                      this.form.phone,
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
            addContactway(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
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
                    message:
                      response.data.msg +
                      '：' +
                      this.form.contacts +
                      this.form.phone,
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