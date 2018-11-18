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
                <i class="" :class="item.icon"></i>
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
              <i class="" :class="item.icon"></i>
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
            <el-dropdown-item @click.native="sign_out">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <!--内容-->
      <el-main>
        <router-view/>
      </el-main>

    </el-container>

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
        menuList: [{menus: []}],
        // 是否折叠菜单
        isCollapse: false,
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
        this.api.user.sign_out().then(res => {
          if (res && res.code === 0) {
            this.$store.commit('setUserId', null)
            this.$store.commit('setToken', null)
            this.$router.push({path: '/'})
          }
        })
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
