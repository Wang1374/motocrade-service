<template>
  <el-dialog
    title="添加车辆"
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
          <el-form-item label="车牌号" prop="driverName">
            <el-input v-model.trim="form.licensePlateNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="车辆归属" prop="driverBelongState">
            <el-select v-model="form.vehicleBelongState" style="width:100%">
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
import { addVehicle } from '@/api/basic/vehicle';
import { getCorporateIdentify } from '@/utils/util';
import { removeSessionStorage } from '@/utils/sessionStorage';
import store from '@/store';
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
      form: {},
      rules: {}
    };
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false);
    },
    submitForm() {
      this.form.belongCompaniesId = getCorporateIdentify();
      // 车辆状态
      this.form.vehicleState = 1;
      addVehicle(this.form).then((response) => {
        if (response.data.data === 1) {
          this.msgSuccess('新增成功');
          //添加成功，删除缓存，重新拉取，并存入缓存
          removeSessionStorage({ name: 'vehicle' });
          const corporateIdentify = getCorporateIdentify();
          let obj = {
            corporateIdentify: corporateIdentify,
            //vehicleBelongState: 1,
            state: 4
          };
          store.dispatch('GetConstant', obj).then(() => {});
          this.$emit('contacts-success', this.form);
          this.$emit('update:visible', false);
        } else if (response.data.data === 0) {
          this.$message({
            message: response.data.msg + '：' + this.form.licensePlateNumber,
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
  }
};
</script>
