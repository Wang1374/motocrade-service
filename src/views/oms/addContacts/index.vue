<template>
  <el-dialog
    title="添加联系人"
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
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model.trim="form.contacts" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model.trim="form.phone" />
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
import { addContactway } from "@/api/basic/contactway";
import { removeSessionStorage } from "@/utils/sessionStorage";
import { getCorporateIdentify } from "@/utils/util";
import store from "@/store";

export default {
  name: "AddCustomer",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 添加客户表单参数
      form: {
        id: undefined,
        customerId: this.customerId,
        contacts: undefined,
        phone: undefined
      },
      // 表单校验
      rules: {
        contacts: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入电话号码", trigger: "blur" }]
      },
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
          addContactway(this.form).then(response => {
            if (response.data.code === 200) {
              if (response.data.data == 1) {
                this.msgSuccess(response.data.msg);
                // 添加成功 删除缓存，重新拉取并存入缓存
                removeSessionStorage({ name: "customer" });
                const corporateIdentify = getCorporateIdentify();
                let obj = {
                  corporateIdentify: corporateIdentify,
                  state: 1
                };
                store.dispatch("GetConstant", obj).then(() => { });
                this.$emit("contacts-success", this.form);
                this.$emit("update:visible", false);
              } else if (response.data.data === 0) {
                this.$message({
                  message: response.data.msg + "：" + this.form.contacts + this.form.phone,
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
