<template>
  <el-dialog
    title="添加司机"
    :visible.sync="visible"
    width="400px"
    :close-on-click-modal="false"
    :before-close="cancel"
    center
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="司机姓名" prop="driverName">
            <el-input v-model.trim="form.driverName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="电话号码" prop="driverPhone">
            <el-input v-model.trim="form.driverPhone" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="司机归属" prop="driverBelongState">
            <el-select v-model="form.driverBelongState">
              <el-option label="公司司机" value="1"></el-option>
              <el-option label="外部司机" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getCorporateIdentify } from '@/utils/util';
import { addDriver } from '@/api/basic/driver';
import { removeSessionStorage } from '@/utils/sessionStorage';
import store from '@/store';
export default {
  name: 'AddDriver',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 添加客户表单参数
      form: {
        id: undefined,
        driverName: undefined,
        driverPhone: undefined,
        driverBelongState: '2'
      },
      // 表单校验
      rules: {
        driverName: [
          { required: true, message: '请输入司机姓名', trigger: 'blur' }
        ],
        driverPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },

    //表单提交
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          //添加司机
          this.form.belongCompaniesId = getCorporateIdentify();
          addDriver(this.form).then((response) => {
            if (response.data.data === 1) {
              this.msgSuccess('新增成功');
              // 删除customer缓存，重新拉取并存入缓存
              removeSessionStorage({ name: 'customer' });
              const corporateIdentify = getCorporateIdentify();
              let objCustomer = {
                corporateIdentify: corporateIdentify,
                state: 1
              };
              store.dispatch('GetConstant', objCustomer).then(() => {});

              // 删除driver缓存，重新拉取并存入缓存
              removeSessionStorage({ name: 'driver' });
              let objDriver = {
                corporateIdentify: getCorporateIdentify(),
                state: 0
              };
              store.dispatch('GetConstant', objDriver).then(() => {});
              this.$emit('contacts-success', this.form);
              this.$emit('update:visible', false);
            } else if (response.data.data === 0) {
              this.$message({
                message: response.data.msg + '：' + this.form.driverName,
                type: 'warning'
              });
            } else if (response.data.data === -1) {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
          });
        }
      });
    }
  }
};
</script>
