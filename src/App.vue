<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="stylus">
  body, html {
    height: 100%;
    width: 100%
    margin: 0;
  }

  #app {
    height: 100%;
    width: 100%
  }
</style>
