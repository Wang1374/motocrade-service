<template>
  <!-- 添加邮费记录 -->
  <el-dialog
    title="油费记录"
    :visible.sync="dialogVisible"
    width="600px"
    :dialogVisible="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    append-to-body
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="车牌号" class="MytoUpper" prop="vehicle">
            <el-select
              ref="vehicle"
              filterable
              allow-create
              style="width: 100%"
              v-model="form.vehicle"
              @change="vehicleChange"
              no-data-text="无匹配数据"
              placeholder="请选择"
            >
              <el-option
                v-for="item in vehicleOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用油类型" prop="oilType">
            <el-select v-model="form.oilType" size="small" placeholder="请选择加油类型">
              <el-option label="92# 汽油" value="0"></el-option>
              <el-option label="95# 汽油" value="1"></el-option>
              <el-option label="98# 汽油" value="2"></el-option>
              <el-option label="0# 柴油" value="3"></el-option>
              <el-option label="-10# 柴油" value="4"></el-option>

              <!-- <el-option
                v-for="item in oilTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>-->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="加油地点" prop="oilAddress">
            <el-input v-model="form.oilAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加油量(L)" prop="oilCapacity">
            <el-input v-model="form.oilCapacity" @input="caculate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单价(元/L)" prop="oilPrice">
            <el-input v-model="form.oilPrice" @input="caculate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单金额" prop="oilTotalPrice">
            <el-input v-model="form.oilTotalPrice"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="服务日期" prop="oilDate">
            <el-date-picker
              type="datetime"
              placeholder="选择日期"
              v-model="form.oilDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发票号" prop="invoiceNum">
            <el-input v-model="form.invoiceNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="付款状态" prop="payStatus">
            <template>
              <vxe-switch v-model="form.payStatus" on-label="是" off-label="否"></vxe-switch>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款说明" prop="invoiceNum">
            <el-input v-model="form.payStatement"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getCorporateIdentify, randomLenNum } from '@/utils/util';
import AddDrivers from '@/views/vehicle/car/addDriver/index';
import { Mul } from '@/utils/ruoyi.js';
import { selectBottomAction } from '@/utils/mixins.js';
import { addOilxtCard, editOilCard } from '@/api/basic/carOilCard';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Addoilrecord',
  mixins: [selectBottomAction],
  components: {
    'add-drivers': AddDrivers
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    temp: {
      type: Object,
      default: null
    },
    vehicleOptions: {
      type: Array
    },
    contactsOptions: {
      type: Array
    }
  },
  data() {
    return {
      rules: {
        vehicle: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        oilDate: [
          { required: true, message: '加油日期不能为空', trigger: 'blur' }
        ],
        oilTotalPrice: [
          { required: true, message: '订单金额不能为空', trigger: 'blur' }
        ]
      },
      form: {},
      //添加司机弹出层
      addContactsVisible: false
    };
  },

  created() {
    if (!validatenull(this.temp)) {
      this.form = this.temp;
    }
  },
  methods: {
    caculate() {
      if (
        this.form.oilPrice != undefined &&
        this.form.oilCapacity != undefined
      ) {
        this.form.oilTotalPrice = Mul(
          Number(this.form.oilPrice),
          Number(this.form.oilCapacity)
        );
      }
    },
    vehicleChange() {
      var arr = this.vehicleOptions.filter((res) => {
        return res.value == this.form.vehicle;
      });
      this.form.driverName = arr[0].driverName;
      this.form.driverPhone = arr[0].driverPhone;
    },
    //添加司机的点击事件
    addContactsClick() {
      //设置添加司机的弹出框为true
      this.addContactsVisible = true;
    },
    //添加司机成功回调
    onContactsSuccess(res) {
      let arry = {
        id: randomLenNum(6, true),
        value: res.driverName,
        phone: res.driverPhone
      };
      this.contactsOptions.push(arry);
    },
    //下拉框改变时触发的事件
    driverChange(val) {
      let arr = {};
      //find为js数组实例方法,find,map,filter,forEach
      arr = this.contactsOptions.find((item) => {
        return item.value === val;
      });
      this.form.driverPhone = arr.phone;
    },

    //重置表单
    reset() {
      this.form = {
        vehicle: undefined,
        driverName: undefined,
        driverPhone: undefined,
        oilAddress: undefined,
        oilType: undefined,
        oilPrice: undefined,
        oilCapacity: undefined,
        oilTotalPrice: undefined,
        oilDate: undefined,
        belongCompaniesId: getCorporateIdentify()
      };
      //清除校验
      this.resetForm('form');
    },
    //新增弹框关闭按钮
    handleClose() {
      this.reset();
      this.$emit('update:dialogVisible', false);
      //this.$parent.getOilList();
    },
    //取消
    cancle() {
      this.$emit('update:dialogVisible', false);
      //this.$parent.getOilList();
      this.reset();
    },
    //保存新增
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            //修改
            editOilCard(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('修改成功');
                this.$parent.getOilxtList();
                this.reset();
                this.$emit('update:dialogVisible', false);
              }
            });
          } else {
            //新增
            this.form.belongCompaniesId = getCorporateIdentify();
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            addOilxtCard(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('新增成功');
                this.$parent.getOilxtList();
                this.$emit('update:dialogVisible', false);
                this.reset();
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
.el-input-number--medium {
  width: 180px;
}
</style>