<template>
  <el-table :data="roleList">
    <el-table-column prop="id" label="ID" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="createdAt" label="创建时间"></el-table-column>
    <el-table-column prop="updatedAt" label="更新时间"></el-table-column>
  </el-table>
</template>

<script>

  export default {
    name: 'role',
    data() {
      return {
        // 角色列表
        roleList: []
      }
    },
    mounted() {
      this.api.admin.getRole().then(res => {
        if (res.code === 0) {
          const list = res.data
          for (let i = 0; i < list.length; i++) {
            list[i].createdAt = this.dateformat(list[i].createdAt, 'yyyy-mm-dd hh:MM:ss')
            list[i].updatedAt = this.dateformat(list[i].updatedAt, 'yyyy-mm-dd hh:MM:ss')
          }
          this.roleList = list
        }
      })
    }
  }
</script>

<style scoped>

</style>
