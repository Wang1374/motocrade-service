<template>
  <div class="login">
    <el-form
      v-if="visible === 1"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">LGL车队管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="space-between">
          <a style="color:#409EFF" @click="registerSub">没有账号？立即注册</a>
          <a href style="color:#409EFF" @click.prevent="openMsg">忘记密码</a>
        </el-row>
      </el-form-item>
    </el-form>

    <el-form
      v-else-if="visible === 2 || visible === 4"
      ref="regForm"
      :model="regForm"
      :rules="regRules"
      class="login-form"
    >
      <h3 class="title">LGL车队管理系统</h3>
      <el-form-item prop="phone">
        <el-input v-model="regForm.phone" type="text" auto-complete="off" placeholder="手机号" />
      </el-form-item>
      <el-form-item prop="graphCode">
        <el-row :gutter="20">
          <el-col :span="15">
            <el-input
              :maxlength="code.len"
              v-model="regForm.graphCode"
              size="small"
              auto-complete="off"
              placeholder="图形验证码"
            />
          </el-col>
          <el-col :span="7">
            <span
              v-if="code.type === 'text'"
              class="vali-code-img"
              @click="refreshCode"
            >{{ code.value }}</span>
            <img v-else :src="code.src" alt="验证码" class="vali-code-img" @click="refreshCode" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item prop="msgCode">
        <el-row :gutter="20">
          <el-col :span="15">
            <el-input
              v-model="regForm.msgCode"
              type="text"
              auto-complete="off"
              placeholder="手机验证码"
            />
          </el-col>
          <el-col :span="7">
            <el-button type="text" @click="getMsgCode" :disabled="disabled=!show">
              <span v-show="show">{{ msg }}</span>
              <span v-show="!show">{{ count }}{{ msg }}</span>
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="visible === 2">
        <el-checkbox v-model="checked">我已阅读并同意</el-checkbox>
        <a style="color: #E6A23C;">"注册协议"</a>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click="nextStep"
        >
          <span v-if="visible === 2">下一步</span>
          <span v-if="visible === 4">验证</span>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="space-between">
          <a style="color:#409EFF" @click="login">已有账号，我要登录</a>
        </el-row>
      </el-form-item>
    </el-form>

    <vxe-form
      v-else-if="visible === 3"
      ref="xForm"
      :data="accountForm"
      :rules="accountRules"
      @submit="searchEvent"
      size="medium"
      class="login-form"
    >
      <h3 class="title">LGL车队管理系统</h3>
      <vxe-form-item field="accountType" span="24">
        <template v-slot>
          <el-radio v-model="accountForm.accountType" :label="1" border size="small">车队</el-radio>
          <el-radio v-model="accountForm.accountType" :label="2" border size="small">货代/工厂</el-radio>
        </template>
      </vxe-form-item>
      <vxe-form-item field="companyName" span="24">
        <template v-slot="scope">
          <vxe-input
            v-model="accountForm.companyName"
            placeholder="请输入公司名"
            clearable
            @input="$refs.xForm.updateStatus(scope)"
          ></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item field="credential" span="24">
        <template v-slot>
          <vxe-input type="password" v-model="accountForm.credential" placeholder="密码"></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item field="confirm" span="24">
        <template v-slot>
          <vxe-input type="password" v-model="accountForm.confirm" placeholder="确认密码"></vxe-input>
        </template>
      </vxe-form-item>
      <vxe-form-item align="center" span="24">
        <template v-slot>
          <vxe-button :loading="loading" type="submit" status="primary">完成</vxe-button>
        </template>
      </vxe-form-item>
    </vxe-form>

    <el-form
      v-else-if="visible === 5"
      ref="forgetPwdForm"
      :model="forgetPwdForm"
      :rules="forgetPwdRules"
      class="login-form"
    >
      <h3 class="title">LGL车队管理系统</h3>
      <el-form-item prop="credential">
        <el-input placeholder="新密码" v-model="forgetPwdForm.credential" show-password />
      </el-form-item>
      <el-form-item prop="confirm">
        <el-input placeholder="确认密码" v-model="forgetPwdForm.confirm" show-password />
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click="changePwd"
        >
          <span>完成</span>
        </el-button>
      </el-form-item>
    </el-form>

    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2021-2022 All Rights Reserved.沪ICP备16052469号-1</span>
    </div>
  </div>
</template>

<script>
import { checkGraphCod, getSmsCode, checkSmsCode, register } from '@/api/login';
import { resetUserPwd } from '@/api/system/user';
import Cookies from 'js-cookie';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import { randomLenNum, encryption } from '@/utils/util';
import { validatenull, validaPass } from '@/utils/validate';

export default {
  name: 'Login',
  data() {
    var validateAcquaintance = (rule, value, callback) => {
      if (value.length === 11) {
        callback();
      } else if (value.length === 0) {
        callback(new Error('请输入手机号'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的手机号'));
        }
      }
    };
    const validateCredential = ({ itemValue, rule, rules, data, property }) => {
      if (itemValue === '') {
        return new Error('请输入密码');
      } else if (!validaPass(itemValue)) {
        return new Error(
          '密码长度为6~20个字符， 数字、大小写字母、及特殊符号至少包含2种'
        );
      }
    };
    const validateConfirm = ({ itemValue, rule, rules, data, property }) => {
      if (itemValue === '') {
        return new Error('请输入确认密码');
      } else if (!(itemValue === this.accountForm.credential)) {
        return new Error('两次输入的密码不一致');
      }
    };
    var validateConfirm_2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'));
      } else if (!(value === this.forgetPwdForm.credential)) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      redirect: undefined,
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      code: {
        src: '/user/v1/code',
        value: '',
        len: 4,
        type: 'image'
      },
      regForm: {
        phone: '',
        graphCode: '',
        msgCode: '',
        randomStr: ''
      },
      regRules: {
        phone: [{ validator: validateAcquaintance, trigger: 'change' }],
        graphCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        msgCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '验证码长度为6位', trigger: 'blur' }
        ]
      },
      accountForm: {
        accountType: null,
        identifier: '',
        companyName: '',
        credential: '',
        confirm: ''
      },
      accountRules: {
        accountType: [{ required: true, message: '请选择账户类型' }],
        companyName: [
          { required: true, message: '请输入公司名' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符' }
        ],
        credential: [{ required: true, validator: validateCredential }],
        confirm: [{ required: true, validator: validateConfirm }]
      },
      forgetPwdForm: {
        identifier: '',
        credential: '',
        confirm: ''
      },
      forgetPwdRules: {
        credential: [
          {
            required: true,
            validator: validateCredential,
            trigger: ['blur', 'change']
          }
        ],
        confirm: [
          {
            required: true,
            validator: validateConfirm_2,
            trigger: ['blur', 'change']
          }
        ]
      },
      checked: true,
      visible: 1,
      show: true,
      count: '',
      msg: '发送验证码'
    };
  },
  watch: {
    // 加载登录页后，直接获取，登录页地址栏的的redirect参数，赋值给this.redirect
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get('username');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 });
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30
            });
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove('username');
            Cookies.remove('password');
            Cookies.remove('rememberMe');
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 忘记密码
    openMsg() {
      this.visible = 4;
      this.refreshCode();
    },
    // 注册
    registerSub() {
      this.$refs.loginForm.clearValidate();
      this.visible = 2;
      this.refreshCode();
    },
    // 登录
    login() {
      this.visible = 1;
    },
    // 获取图形验证码
    refreshCode() {
      this.regForm.graphCode = '';
      this.regForm.randomStr = randomLenNum(this.code.len, true);
      this.code.type === 'text'
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `/api/user/v1/code/${this.regForm.randomStr}`);
    },
    // 获取短信验证码
    getMsgCode() {
      this.$refs['regForm'].validateField('phone', (phoneError) => {
        if (!phoneError) {
          this.$refs['regForm'].validateField('graphCode', (valiCodeError) => {
            if (!valiCodeError) {
              // 到后台效验 图形验证码是否正确
              checkGraphCod({
                randomStr: this.regForm.randomStr,
                code: this.regForm.graphCode
              }).then((response) => {
                if (response.data.code === 200) {
                  // 若正确，获取手机验证码，倒计时
                  getSmsCode(this.regForm.phone).then((response) => {
                    if (response.data.code === 200) {
                      const TIME_COUNT = 120; // 更改倒计时时间
                      if (!this.timer) {
                        this.msg = '秒后重新获取';
                        this.count = TIME_COUNT;
                        this.show = false;
                        this.timer = setInterval(() => {
                          if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                          } else {
                            this.msg = '发送验证码';
                            this.show = true;
                            clearInterval(this.timer); // 清除定时器
                            this.timer = null;
                          }
                        }, 1000);
                      }
                    } else {
                      this.msgError(response.data.msg);
                    }
                  });
                } else {
                  this.msgError(response.data.msg);
                }
              });
            }
          });
        }
      });
    },
    // 下一步
    nextStep() {
      this.$refs['regForm'].validate((valid) => {
        if (valid) {
          // 判断手机号是否注册，手机号验证码是否正确。若OK 显示设置页码
          checkSmsCode({
            phone: this.regForm.phone,
            code: this.regForm.msgCode,
            type: this.visible
          }).then((response) => {
            if (response.data.code === 200) {
              if (this.visible === 2) {
                this.visible = 3;
              } else {
                this.visible = 5;
              }
            } else {
              this.msgError(response.data.msg);
            }
          });
        }
      });
    },
    searchEvent() {
      this.loading = true;
      setTimeout(() => {
        this.accountForm.identifier = this.regForm.phone;
        // 密码加密
        const user = encryption({
          data: this.accountForm,
          key: '1234567887654321',
          param: ['credential']
        });
        register(user).then((response) => {
          if (response.data.code === 200) {
            this.loading = false;
            this.msgSuccess('注册，成功');
            this.visible = 1;
          } else {
            this.loading = false;
            this.msgError(response.data.msg);
          }
        });
      }, 1000);
    },
    changePwd: function () {
      this.$refs['forgetPwdForm'].validate((valid) => {
        if (valid) {
          this.forgetPwdForm.identifier = this.regForm.phone;
          resetUserPwd(this.forgetPwdForm).then((response) => {
            if (response.data.code === 200) {
              this.msgSuccess('修改密码成功');
              this.visible = 1;
            } else {
              this.msgError(response.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/image/login-background.jpg');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.vali-code-img {
  width: 120px;
  height: 40px;
  border-radius: 2px;
}
</style>
