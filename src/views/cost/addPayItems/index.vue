<template>
  <el-dialog
    :title="title"
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
          <el-form-item label="费用名称" prop="feeName">
            <el-input v-model="form.feeName" placeholder="请输入费用名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="费用代码" prop="feeCode" class="MytoUpper">
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
</template>
<script>
import { addCostsSet } from "@/api/basic/costsset";
import { removeSessionStorage } from "@/utils/sessionStorage";
import { getCorporateIdentify } from "@/utils/util";
import store from "@/store";

export default {
  name: "AddPayItems",
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        feeName: undefined,
        feeCode: undefined,
        currency: undefined
      },
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
  methods: {
    // 取消按钮
    cancel() {
      this.$emit("update:visible", false);
    },
    // 表单提交
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loadingBtn = true;
          this.form.feeCode = this.form.feeCode.toUpperCase();
          addCostsSet(this.form).then(response => {
            if (response.data.code === 200) {
              if (response.data.data === 1) {
                this.msgSuccess(response.data.msg);
                // 添加成功 删除缓存，重新拉取并存入缓存
                removeSessionStorage({ name: "costs_set" });
                const corporateIdentify = getCorporateIdentify();
                let obj = {
                  corporateIdentify: corporateIdentify,
                  state: 2
                };
                store.dispatch("GetConstant", obj).then(() => { });
                this.$emit("costs-success");
                this.$emit("update:visible", false);
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
