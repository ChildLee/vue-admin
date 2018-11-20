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
        <el-input maxlength="50" v-model="loginForm.password" type="password"
                  @keyup.enter.native="submitForm('ruleForm')"></el-input>
      </el-form-item>

      <el-form-item label="验证码" prop="captcha">
        <div class="login-captcha">
          <el-input maxlength="4" v-model="loginForm.captcha"
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
          <div class="captcha" v-html="captcha" @click="getCaptcha('ruleForm')"></div>
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
      this.init()
    },
    methods: {
      init() {
        if (this.$store.getters.getUserId) {
          this.$router.push({path: '/home'})
        } else {
          this.getCaptcha()
        }
      },
      // 获取验证码
      getCaptcha(formName) {
        return this.api.user.captcha({key: this.loginForm.key}).then(res => {
          if (res && res.code === 0) {
            this.loginForm.key = res.data.key
            this.captcha = res.data.data
            if (formName) {
              this.$refs[formName].fields.forEach(function (e) {
                if (e.prop === 'captcha') e.resetField()
              })
            }
          }
        })
      },
      // 登录
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.api.user.login(this.loginForm).then(res => {
              if (res && res.code === 0) {
                this.$store.commit('setUserId', res.data.id)
                this.$store.commit('setToken', res.data.token)
                this.$router.push({path: '/home'})
                this.$message.success('登录成功')
              } else {
                this.getCaptcha(formName)
              }
            })
          }
        })
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
        this.getCaptcha()
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
