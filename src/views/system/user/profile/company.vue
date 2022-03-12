<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="140px" :disabled="employeeId != -1">
    <el-form-item label="公司名称" prop="companyName">
      <el-input v-model="form.companyName" />
    </el-form-item>
    <el-form-item label="法人" prop="legalPerson">
      <el-input v-model="form.legalPerson" />
    </el-form-item>
    <el-form-item label="银行卡信息" prop="bankCard">
      <el-input v-model="form.bankCard" />
    </el-form-item>
    <el-form-item label="统一社会信用代码" prop="uscc">
      <el-input v-model="form.uscc" />
    </el-form-item>
    <!-- 找油网id -->
    <el-form-item v-if="form.accountType === 1" label="找油网客户ID" prop="zyCompanyId">
      <el-input disabled v-model="form.zyCompanyId" />
    </el-form-item>

    <el-row>
      <el-col :span="12">
        <el-form-item label="成立日期" prop="registerDate">
          <el-date-picker
            v-model="form.registerDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="营业期限" prop="termOfOperation">
          <el-date-picker
            v-model="form.termOfOperation"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="公司地址" prop="location">
      <el-input v-model="form.location" />
    </el-form-item>
    <el-form-item label="营业执照">
      <el-upload
        class="avatar-uploader"
        action="/api/user/v1/attachment/upload"
        :headers="headers"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
      >
        <img v-if="form.url" :src="form.url" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" :loading="loadingBtn" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getToken } from '@/utils/auth';
import { updateCompany } from '@/api/system/company';
import { getCorporateIdentify } from '@/utils/util';
import { removeSessionStorage } from '@/utils/sessionStorage';
import store from '@/store';

export default {
  name: 'Company',
  data() {
    return {
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      form: {},
      rules: {
        companyName: [
          { required: true, message: '公司名称不能为空', trigger: 'blur' }
        ],
        uscc: [
          {
            required: true,
            message: '统一社会信用代码不能为空',
            trigger: 'blur'
          }
        ]
      },
      employeeId: '',
      loadingBtn: false
    };
  },
  mounted() {
    // 获取 企业信息
    this.form = store.getters.company;
    this.employeeId = store.getters.userInfo.employeeId;
  },
  methods: {
    // 上传图片前
    beforeUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
      var arr = ['jpg', 'jpeg', 'png'];
      const extension = arr.indexOf(fileType) > -1;
      if (!extension) {
        this.$message({
          message: '上传文件只能是 jpg、jpeg、png、格式!',
          type: 'warning'
        });
      }
      const isLt10M = file.size / 1024 / 1024 < 5;
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 5MB!');
      }
      return extension && isLt10M;
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      this.form.url = res.data.previewUrl;
    },
    // 上传图片失败
    uploadError(res, err) {
      console.log(err);
      this.$message.error('上传图片失败!');
    },
    // 表单提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          updateCompany(this.form).then((response) => {
            if (response.data.code === 200) {
              // 添加成功 删除缓存，重新拉取并存入缓存
              removeSessionStorage({ name: 'company' });
              const corporateIdentify = getCorporateIdentify();
              let obj = {
                corporateIdentify: corporateIdentify,
                state: 3
              };
              store.dispatch('GetConstant', obj).then(() => {});
              this.msgSuccess('修改成功');
            } else {
              this.msgError(response.data.msg);
            }
            this.loadingBtn = false;
          });
        }
      });
    },
    // 关闭
    close() {
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.push({ path: '/index' });
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
