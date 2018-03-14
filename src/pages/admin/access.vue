<template>
  <el-tree :data="accessList" :props="param"></el-tree>
</template>

<script>
  export default {
    name: 'access',
    data() {
      return {
        param: {
          label: 'name',
          children: 'accesses'
        },
        accessList: []
      }
    },
    mounted() {
      this.api.admin.getAccess().then(res => {
        if (res.code === 0) {
          this.accessList = res.data
        }
      })
    }
  }
</script>

<style scoped>

</style>
