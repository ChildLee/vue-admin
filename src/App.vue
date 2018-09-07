<template>
  <transition name="fade" mode="out-in">
    <router-view/>
  </transition>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="scss">
  @import "scss/icon";

  html, body {
    margin: 0;
    height: 100%;
    min-width: 1200px;
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
