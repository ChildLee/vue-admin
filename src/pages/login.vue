<template>
  <div class="login">
    <el-form class="login-form" label-width="100px"
             :model="loginForm" :rules="rules" ref="ruleForm"
             status-icon hide-required-asterisk>

      <h2 class="login-center">后台登录</h2>

      <el-form-item label="账号" prop="username" label-width="50px">
        <el-input maxlength="50" v-model="loginForm.username"
                  @keyup.enter.native="submitForm('ruleForm')"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password" label-width="50px">
        <el-input maxlength="50" v-model="loginForm.password"
                  @keyup.enter.native="submitForm('ruleForm')"></el-input>
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
        loginForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [{required: true, message: '请输入账号'}],
          password: [{required: true, message: '请输入密码'}],
        },
      }
    },
    mounted() {

    },
    methods: {
      // 登录
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.loginForm)
            this.api.admin.login(this.loginForm).then(res => {
              console.log(res)
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
      margin-top: -200px;
      margin-left: -200px;
      .login-center {
        text-align: center;
      }
    }
  }
</style>
