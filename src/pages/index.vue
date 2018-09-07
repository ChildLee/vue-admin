<template>
  <el-container>

    <el-aside>
      <!--导航-->
      <el-menu :router="true"
               :collapse="isCollapse"
               :default-active="currentRoute"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b">
        <template v-for="item in menuList">
          <template v-if="item.accesses.length===1">
            <!--主菜单-->
            <el-menu-item :index="item.accesses[0].url">
              <i class="icon" :class="item.icon"></i>
              <span slot="title">{{item.accesses[0].name}}</span>
            </el-menu-item>
          </template>
          <template v-else>
            <!--子菜单-->
            <el-submenu :index="String(item.id)">
              <template slot="title">
                <i class="icon" :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
              </template>
              <!--遍历子菜单项-->
              <template v-for="access in item.accesses">
                <el-menu-item :index="access.url">{{access.name}}</el-menu-item>
              </template>
            </el-submenu>
          </template>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <!--头部-->
      <el-header>
        <i class="menu-btn el-icon-menu" @click="menuClick"></i>
        <i class="icon icon-null"></i>
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
        menuList: [{accesses: []}],
        // 是否折叠菜单
        isCollapse: false
      }
    },
    watch: {
      // 监听路由变动
      '$route': 'fetchRoute'
    },
    async mounted() {
      this.currentRoute = this.$route.path
      //初始化菜单
      await this.api.admin.getMenu().then(res => {
        if (res.code === 0) {
          this.menuList = res.data
        }
      })
    },
    methods: {
      fetchRoute() {
        // 设置菜单默认路由
        this.currentRoute = this.$route.path
      },
      menuClick() {
        this.isCollapse = !this.isCollapse
      }
    }
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
      align-items: center;
      background-color: #545c64;
      .menu-btn {
        color: #fff;
        cursor: pointer;
        font-size: 30px;
      }
    }
  }
</style>
