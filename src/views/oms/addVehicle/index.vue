<template>
  <el-dialog
    title="添加车辆"
    :visible.sync="visible"
    width="400px"
    :close-on-click-modal="false"
    :before-close="cancel"
    center
    append-to-body
    :destroy-on-close="true"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="车牌号" prop="licensePlateNumber" class="MytoUpper">
            <el-input v-model.trim="form.licensePlateNumber" placeholder="请输入车牌号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="车辆归属" prop="vehicleBelongState">
            <el-select v-model.trim="form.vehicleBelongState" style="width: 100%">
              <el-option label="公司车辆" value="1"></el-option>
              <el-option label="外部车辆" value="2"></el-option>
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
import store from '@/store';
import { addVehicle } from '@/api/basic/vehicle';
import { getCorporateIdentify } from '@/utils/util';
import { removeSessionStorage } from '@/utils/sessionStorage';
export default {
  name: 'AddVehicle',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 添加司机表单参数
      form: {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        vehicleState: 1,
        licensePlateNumber: undefined,
        vehicleBelongState: '2'
      },
      // 表单校验
      rules: {
        licensePlateNumber: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        vehicleBelongState: [
          { required: true, message: '车辆归属不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },
    // 表单提交
    submitForm: function () {
      //车牌号，将车牌号字母转成大写
      this.form.licensePlateNumber = this.form.licensePlateNumber.toUpperCase();
      this.$refs['form'].validate((valid) => {
        if (valid) {
          addVehicle(this.form).then((response) => {
            if (response.data.data == 1) {
              this.msgSuccess('新增成功');
              //添加成功，删除缓存，重新拉取，并存入缓存
              removeSessionStorage({ name: 'vehicle' });
              const corporateIdentify = getCorporateIdentify();
              let obj = {
                corporateIdentify: corporateIdentify,
                state: 4
              };
              store.dispatch('GetConstant', obj).then(() => {});
              this.$emit('vehicle-success', this.form);
              this.$emit('update:visible', false);
            } else if (response.data.data === 0) {
              this.$message({
                message:
                  response.data.msg + '：' + this.form.licensePlateNumber,
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
<style>
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
</style>