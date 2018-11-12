<template>
  <div class="login">
    <el-form class="login-form" label-width="60px"
             :model="loginForm" :rules="rules" ref="ruleForm"
             status-icon hide-required-asterisk>

      <h2 class="login-center">后台登录</h2>

      <el-form-item label="账号" prop="username">
        <el-input maxlength="50" v-model="loginForm.username"
                  @keyup.enter.native="submitForm('ruleForm')"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input maxlength="50" v-model="loginForm.password"
                  @keyup.enter.native="submitForm('ruleForm')"></el-input>
      </el-form-item>

      <el-form-item label="验证码" prop="captcha">
        <div class="login-captcha">
          <el-input maxlength="4" v-model="loginForm.captcha"
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
          <div class="captcha" v-html="captcha" @click="newCaptcha"></div>
        </div>
      </el-form-item>

      <div class="login-center">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        captcha: {},
        loginForm: {
          username: '',
          password: '',
          captcha: '',
          key: '',
        },
        rules: {
          username: [{required: true, message: '请输入账号'}],
          password: [{required: true, message: '请输入密码'}],
          captcha: [{required: true, message: '请输入验证码'}],
        },
      }
    },
    mounted() {
      this.getCaptcha()
    },
    methods: {
      // 获取验证码
      getCaptcha() {
        this.api.admin.captcha().then(res => {
          if (res.code === 0) {
            this.loginForm.key = res.data.key
            this.captcha = res.data.data
          }
        })
      },
      // 刷新验证码
      newCaptcha() {
        this.api.admin.newCaptcha({key: this.loginForm.key}).then(res => {
          if (res.code === 0) {
            this.captcha = res.data
          }
        })
      },
      // 登录
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.api.admin.login(this.loginForm).then(res => {
              if (res.code === 0) {
                this.$router.push({path: '/home'})
                this.$message.success('登录成功')
              }
            })
          }
        })
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
    },
  }
</script>

<style scoped lang="scss">
  .login {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/login-bg.png);
    .login-form {
      box-sizing: border-box;
      width: 400px;
      padding: 30px;
      border-radius: 5px;
      box-shadow: 0 0 25px #ccc;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -250px;
      margin-left: -200px;
      .login-center {
        text-align: center;
      }
      .login-captcha {
        display: flex;
        align-items: center;
        .captcha {
          cursor: pointer;
          height: 40px;
        }
      }
    }
  }
</style>
