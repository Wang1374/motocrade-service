<template>
  <el-dialog
    title="添加门点"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
    :before-close="cancel"
    center
    append-to-body
    :destroy-on-close="true"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col>
          <el-form-item label="客户名" prop="customerName">
            <el-select v-model="form.customerId" style="width: 100%;" disabled placeholder="输入搜索客户名">
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
          <el-form-item label="地址" prop="address">
            <v-distpicker
              @selected="onSelected"
              :province="form.province"
              :city="form.city"
              :area="form.area"
              style="display: inline-block;"
            ></v-distpicker>
            <el-input style="padding-top: 5px;" v-model="form.address" placeholder="详细地址" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loadingBtn" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addDoors } from "@/api/basic/doors";
import { getCorporateIdentify } from "@/utils/util";
import store from "@/store";
import VDistpicker from "v-distpicker";
import { removeSessionStorage } from "@/utils/sessionStorage";

export default {
  name: "AddDoors",
  components: {
    VDistpicker
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    ctId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 添加司机表单参数
      form: {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        customerId: undefined,
        customerName: undefined,
        doorAs: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined
      },
      optionsCustomer: [],
      // 表单校验
      rules: {
        customerName: [
          { required: true, message: "客户名不能为空", trigger: "blur" }
        ],
        doorAs: [
          { required: true, message: "门点简称不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" }
        ]
      },
      loadingBtn: false
    };
  },
  created() {
    this.optionsCustomer = store.getters.customer;
    this.form.customerId = this.ctId;
    let obj = {};
    obj = this.optionsCustomer.find(item => {
      return item.id === this.form.customerId;
    });
    this.form.customerName = obj.label;
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit("update:visible", false);
    },
    onSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
    },
    // 表单提交
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loadingBtn = true;
          addDoors(this.form).then(response => {
            if (response.data.code === 200) {
              if (response.data.data === 1) {
                this.msgSuccess(response.data.msg);
                // 添加成功 删除缓存，重新拉取并存入缓存
                removeSessionStorage({ name: "customer" });
                const corporateIdentify = getCorporateIdentify();
                let obj = {
                  corporateIdentify: corporateIdentify,
                  state: 1
                };
                store.dispatch("GetConstant", obj).then(() => { });
                this.$emit("doors-success", this.form);
                this.$emit("update:visible", false);
              } else if (response.data.data === 0) {
                this.$message({
                  message: response.data.msg + "：" + this.form.doorAs,
                  type: "warning",
                });
              }
            } else {
              this.msgError(response.data.msg);
            }
            this.loadingBtn = false;
          });
        }
      });
    }
  }
};
</script>
