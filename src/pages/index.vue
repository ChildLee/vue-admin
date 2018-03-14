<template>
  <el-container>
    <el-aside>

      <!--导航-->
      <el-menu default-active="/home"
               :router="true"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b"
               :collapse="isCollapse">

        <template v-for="item in menuList">

          <!--type为0直接生成根菜单-->
          <template v-if="item.type===0" v-for="access in item.accesses">
            <!--主菜单-->
            <el-menu-item :index="access.url">
              <i class="el-icon-menu"></i>
              <span slot="title">{{access.name}}</span>
            </el-menu-item>
          </template>

          <!--type不为0的生成子菜单访问-->
          <template v-else>
            <!--子菜单-->
            <el-submenu :index="String(item.id)">
              <template slot="title">
                <i class="el-icon-location"></i>
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
        // 菜单列表
        menuList: [{accesses: []}],
        // 是否折叠菜单
        isCollapse: false
      }
    },
    async mounted() {
      //初始化菜单
      await this.api.admin.getMenu().then(res => {
        if (res.code === 0) {
          this.menuList = res.data
        }
      })
    },
    methods: {
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

    /*内容*/
    .el-main {

    }

  }
</style>
