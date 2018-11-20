<template>
  <transition name="fade" mode="out-in">
    <router-view/>
  </transition>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

<style lang="scss">
  @import "scss/icon";

  html, body {
    margin: 0;
    height: 100%;
    min-width: 1200px;
  }

  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;

    .el-checkbox {
      margin-left: 0;
      margin-right: 20px;
    }
  }

  .el-transfer {
    .el-input {
      width: auto;
    }

    .el-checkbox-group {
      display: block;

      .el-checkbox {
        display: block;
      }
    }
  }

  /* 隐藏滚动条(IE无效) */
  ::-webkit-scrollbar {
    display: none;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
