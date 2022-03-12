<template>
  <div>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      title="新增门点"
      :visible.sync="visibleDoor"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleClose"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="门点简称" prop="doorAs">
              <el-input v-model.trim="form.doorAs" placeholder="请输入门点简称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="门点全称" prop="doorFullName">
              <el-input v-model.trim="form.doorFullName" placeholder="请输入门点全称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
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
          <el-col :span="24">
            <el-form-item label="联系人" prop="contacts">
              <el-input v-model.trim="form.contacts" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model.trim="form.contactNumber" placeholder="请输入联系电话" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addDoors } from "@/api/distribute/clientdoors/";
import { getCorporateIdentify } from "@/utils/util";
export default {
  name: "AddDoor",
  props: {
    visibleDoor: {
      type: Boolean,
    },
  },
  data() {
    return {
      form: {},
      rules: {
        doorAs: [
          { required: true, message: "门点简称不能为空", trigger: "blur" },
        ],
        doorFullName: [
          { required: true, message: "门点全称不能为空", trigger: "blur" },
        ],
        address: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    onSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
    },
    // 取消按钮
    cancel() {
      this.$emit("update:visibleDoor", false);
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        doorAs: undefined,
        doorFullName: undefined,
        contacts: undefined,
        contactNumber: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    //关闭dialog
    handleClose() {
      this.$emit("update:visibleDoor", false);
    },
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.belongCompaniesId = getCorporateIdentify();
          addDoors(this.form).then((response) => {
            if (response.data.code === 200) {
              if (response.data.data === 1) {
                this.msgSuccess(response.data.msg);
                this.$emit("update:visibleDoor", false);
                this.$emit("door-success", this.form);
                this.reset();
              } else if (response.data.data === 0) {
                this.$message({
                  message: response.data.msg + "：" + this.form.doorAs,
                  type: "warning",
                });
              }
            } else {
              this.msgError(response.data.msg);
            }
          });
        }
      });
    },
  },
};
</script>