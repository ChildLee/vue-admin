<template>
  <section>
    <el-table :data="accessList" border>
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" prop="name" label="菜单" width="300"></el-table-column>
      <el-table-column header-align="center" label="权限">
        <template slot-scope="scope">

          <el-checkbox :indeterminate="isIndeterminate" @change="checked=>handleCheckAllChange(checked,scope.row)"
                       v-model="scope.row.checkAll">
            全选
          </el-checkbox>

          <el-checkbox-group v-model="checkList" @change="item=>handleCheckedCitiesChange(item,scope.row)">

            <template v-for="item in scope.row.accesses">
              <el-checkbox :label="item">
                {{item.name}}
              </el-checkbox>
            </template>

          </el-checkbox-group>

        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
  export default {
    name: 'access',
    data() {
      return {
        // 权限列表
        accessList: [],
        // 存放选中的选项
        checkList: [],
        checkAll: false,
        isIndeterminate: false
      }
    },
    mounted() {
      this.api.admin.getAccess().then(res => {
        if (res.code === 0) {
          this.accessList = res.data
        }
      })
    },
    methods: {
      // 全选
      handleCheckAllChange(check, row) {
        if (check) {
          this.checkList.push(...row.accesses)
        } else {
          for (let i = 0; i < row.accesses.length; i++) {
            const index = this.checkList.indexOf(row.accesses[i])
            if (index !== -1) {
              this.checkList.splice(index, 1)
            }
          }
        }
      },
      // 单选
      handleCheckedCitiesChange(item, row) {
        console.log(this.checkList)
        console.log(item)
        console.log(row)
        // if (check) {
        //   this.checkList.push(item)
        // } else {
        //   row.checkAll = false
        //   const index = this.checkList.indexOf(item)
        //   if (index !== -1) {
        //     this.checkList.splice(index, 1)
        //   }
        // }
      }
    }
  }
</script>

<style scoped>

</style>
