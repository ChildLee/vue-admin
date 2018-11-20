<template>
  <el-container>

    <el-aside>
      <!--导航菜单-->
      <el-menu :router="true"
               :collapse="isCollapse"
               :default-active="currentRoute"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b">

        <template v-for="item in menuList">

          <!--主菜单有子项-->
          <template v-if="item.menus.length>0">

            <el-submenu :index="String(item.url)">

              <!--主菜单名-->
              <template slot="title">
                <i class="icon" :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
              </template>

              <!--一级菜单-->
              <template v-for="menu1 in item.menus">
                <!--一级菜单有子项-->
                <template v-if="menu1.menus.length>0">
                  <el-submenu :index="String(menu1.url)">
                    <span slot="title">{{menu1.name}}</span>

                    <!--二级菜单-->
                    <template v-for="menu2 in menu1.menus">
                      <el-menu-item :index="String(menu2.url)">{{menu2.name}}</el-menu-item>
                    </template>

                  </el-submenu>
                </template>

                <!--一级菜单没子项-->
                <template v-else>
                  <el-menu-item :index="String(menu1.url)">{{menu1.name}}</el-menu-item>
                </template>

              </template>

            </el-submenu>

          </template>

          <!--主菜单无子项-->
          <template v-else>
            <el-menu-item :index="String(item.url)">
              <i class="icon" :class="item.icon"></i>
              <span slot="title">{{item.name}}</span>
            </el-menu-item>
          </template>

        </template>

      </el-menu>
    </el-aside>

    <el-container>

      <!--头部-->
      <el-header>
        <i class="menu-btn el-icon-menu" @click="menuClick"></i>

        <el-dropdown trigger="click">
          <div>
            <span>个人中心</span>
            <i class="el-icon-setting"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updatePasswordDialog=true">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="sign_out">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <!--内容-->
      <el-main>
        <router-view/>
      </el-main>

    </el-container>

    <!--修改密码对话框-->
    <el-dialog title="修改密码" width="500px" center
               :before-close="done=>resetForm('updateForm',done)"
               :visible.sync="updatePasswordDialog">
      <el-form ref="updateForm" :model="dataForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="原密码" prop="rawPassword">
          <el-input maxlength="50" placeholder="请输入原密码" v-model="dataForm.rawPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input maxlength="50" placeholder="请输入新密码" v-model="dataForm.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input maxlength="50" placeholder="请再次输入密码" v-model="dataForm.rePassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('updateForm')">取 消</el-button>
        <el-button type="primary" @click="updatePassword('updateForm')">确 定</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        // 当前路由
        currentRoute: '',
        // 菜单列表
        menuList: [],
        // 是否折叠菜单
        isCollapse: false,
        // 修改密码对话框
        updatePasswordDialog: false,
        // 表单
        dataForm: {
          rawPassword: '',
          newPassword: '',
          rePassword: '',
        },
        // 表单验证
        rules: {
          rawPassword: [{required: true, message: '请输入原密码'}],
          newPassword: [{required: true, message: '请输入新密码'}],
          rePassword: [{required: true, message: '请再次输入密码'}],
        },
      }
    },
    watch: {
      // 监听路由变动
      '$route': 'fetchRoute',
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.currentRoute = this.$route.path
        //初始化菜单(改)
        this.api.menu.getUserMenu({id: this.$store.getters.getUserId}).then(res => {
          if (res && res.code === 0) this.menuList = res.data
        })
      },
      fetchRoute() {
        // 设置菜单默认路由
        this.currentRoute = this.$route.path
      },
      menuClick() {
        this.isCollapse = !this.isCollapse
      },
      // 退出登录
      sign_out() {
        this.api.login.sign_out().then(res => {
          if (res && res.code === 0) {
            this.$store.commit('setUserId', null)
            this.$store.commit('setToken', null)
            this.$router.push({path: '/'})
          }
        })
      },
      // 修改密码
      updatePassword(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const newPassword = this.dataForm.newPassword
            const rePassword = this.dataForm.rePassword
            if (newPassword !== rePassword) return this.$message({message: `两次输入的密码不一致`, type: 'error'})

            this.api.login.updatePassword({
              id: this.$store.getters.getUserId,
              rawPassword: this.dataForm.rawPassword,
              newPassword: this.dataForm.newPassword,
            }).then(res => {
              if (res && res.code === 0) {
                this.updatePasswordDialog = false
                this.$refs[formName].resetFields()
                this.dataForm = {}
                this.$store.commit('setUserId', null)
                this.$store.commit('setToken', null)
                this.$router.push({path: '/'})
                this.$message({message: '密码修改成功,请重新登录!', type: 'success'})
              }
            })
          }
        })
      },
      // 重置表单
      resetForm(formName, done) {
        if (done) done()
        this.updatePasswordDialog = false
        this.$refs[formName].resetFields()
        this.dataForm = {}
      },
    },
  }
</script>

<style scoped lang="scss">
  .el-container {
    height: 100%;
    /*侧边栏菜单*/
    .el-aside {
      width: auto !important;

      .el-menu {
        height: 100%;

        &:not(.el-menu--collapse) {
          width: 250px;
        }
      }
    }

    /*头部*/
    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #545c64;

      .menu-btn {
        color: #fff;
        cursor: pointer;
        font-size: 30px;
      }

      .el-dropdown {
        color: #fff;
        cursor: pointer;
      }
    }
  }
</style>
