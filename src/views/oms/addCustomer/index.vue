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
          <el-form-item label="公司抬头" prop="companyName">
            <el-input v-model.trim="form.companyName" placeholder="请输入公司抬头" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="合作伙伴" prop="partner">
            <el-select v-model="form.partner" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in partnerOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="this.nature == 2">
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in typeOptions"
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
import { addClientele } from "@/api/basic/clientele";
import { removeSessionStorage } from "@/utils/sessionStorage";
import { getCorporateIdentify } from "@/utils/util";
import store from "@/store";

export default {
  name: "AddCustomer",
  props: {
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    nature: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 添加客户表单参数
      form: {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        companyName: undefined,
        partner: 2,
        companyCode: undefined,
        uscc: undefined,
        nature: this.nature,
        type: 1,
        salesman: store.getters.company.companyName,
        operationStaff: undefined,
        howToAccount: 1,
        clearingForm: 1,
        settlementInterval: 1,
        paymentDays: 30,
        province: undefined,
        city: undefined,
        area: undefined,
        chineseAddress: undefined,
        englishName: undefined,
        englishAddress: undefined
      },
      rules: {
        companyName: [
          { required: true, message: "公司抬头不能为空", trigger: "blur" }
        ],
        partner: [
          { required: true, message: "合作伙伴不能为空", trigger: "blur" }
        ]
      },
      // 合作伙伴
      partnerOptions: [
        {
          value: 1,
          label: "固定"
        },
        {
          value: 2,
          label: "非固定"
        }
      ],
      // 类型状态
      typeOptions: [
        {
          value: 1,
          label: "公司"
        },
        {
          value: 2,
          label: "个人"
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
          addClientele(this.form).then(response => {
            if (response.data.code === 200) {
              if (response.data.data === 1) {
                this.msgSuccess(response.data.msg);
                this.$emit("customer-success");
                this.$emit("update:visible", false);
                // 添加成功 删除缓存，重新拉取并存入缓存
                removeSessionStorage({ name: "customer" });
                const corporateIdentify = getCorporateIdentify();
                let obj = {
                  corporateIdentify: corporateIdentify,
                  state: 1
                };
                store.dispatch("GetConstant", obj).then(() => { });
              } else if (response.data.data === 0) {
                this.$message({
                  message: response.data.msg + "：" + this.form.companyName,
                  type: "warning"
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
