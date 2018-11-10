<template>
  <section>
    <el-button class="menu-sort" icon="el-icon-sort" @click="menuSortButton">菜单管理</el-button>
    <el-table :data="accessList" border>
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" prop="name" label="资源" width="300"></el-table-column>
      <el-table-column header-align="center" label="权限">
        <template slot-scope="scope">
          <div class="access-list">
            <el-checkbox class="item-all" v-model="scope.row.checkAll"
                         :indeterminate="scope.row.isIndeterminate"
                         @change="checked=>checkAllChange(checked,scope.row)">全选
            </el-checkbox>
            <el-checkbox-group v-model="checkList">
              <template v-for="item in scope.row.permission">
                <el-checkbox :label="item.id" @change="checked=>checkChange(checked,scope.row)">
                  {{item.name}}
                </el-checkbox>
              </template>
            </el-checkbox-group>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="菜单管理" width="600px" center :visible.sync="dialog.menuSortDialog">
      <el-table :data="sortList" border>
        <el-table-column align="center" prop="name" label="图标" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.icon"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="菜单" width="200"></el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.up" icon="el-icon-arrow-up" circle
                       @click="menuSort('up',scope.$index,scope.row)"></el-button>
            <el-button :disabled="scope.row.down" icon="el-icon-arrow-down" circle
                       @click="menuSort('down',scope.$index,scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.menuSortDialog=false">取 消</el-button>
        <el-button type="primary" @click="menuSortSave">保存</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  export default {
    name: 'access',
    data() {
      return {
        // 权限列表
        accessList: [{checkAll: false, isIndeterminate: false}],
        // 存放选中的权限
        checkList: [],
        sortList: [],
        dialog: {
          menuSortDialog: false,
        },
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
      // 打开排序对话框
      menuSortButton() {
        this.sortList = [...this.accessList]
        for (let i = 0; i < this.sortList.length; i++) {
          this.sortList[i].up = false
          this.sortList[i].down = false
        }
        this.sortList[0].up = true
        this.sortList[this.sortList.length - 1].down = true
        this.dialog.menuSortDialog = true
      },
      // 菜单排序
      menuSort(sort, index, row) {
        const list = this.sortList
        row.up = false
        row.down = false
        if (sort === 'up') {
          list[index] = list[index - 1]
          list[index - 1] = row
        } else if (sort === 'down') {
          list[index] = list[index + 1]
          list[index + 1] = row
        }
        list[index].up = false
        list[index].down = false

        list[0].up = true
        list[this.sortList.length - 1].down = true

        this.sortList = [...list]
      },
      // 保存排序
      menuSortSave() {
        const sort = []
        for (let i = 0; i < this.sortList.length; i++) {
          sort.push({id: this.sortList[i].id, order: i, icon: this.sortList[i].icon})
        }
        this.api.admin.menuSort({sort}).then(res => {
          if (res.code === 0) {
            this.accessList = [...this.sortList]
            this.dialog.menuSortDialog = false
            this.$message({message: '菜单保存成功!', type: 'success'})
          }
        })
      },
      // 权限全选
      checkAllChange(check, row) {
        for (let i = 0; i < row.permission.length; i++) {
          const index = this.checkList.indexOf(row.permission[i].id)
          if (check && index === -1) {
            this.checkList.push(row.permission[i].id)
            row.checkAll = true
            row.isIndeterminate = false
          } else if (!check && index !== -1) {
            this.checkList.splice(index, 1)
            row.checkAll = false
            row.isIndeterminate = false
          }
        }
      },
      // 权限单选
      checkChange(check, row) {
        let count = 0
        const len = row.permission.length
        for (let i = 0; i < len; i++) {
          const bool = this.checkList.includes(row.permission[i].id)
          if (bool) {
            ++count
          }
        }
        if (count === 0) {
          row.checkAll = false
          row.isIndeterminate = false
        } else if (count === len) {
          row.checkAll = true
          row.isIndeterminate = false
        } else {
          row.checkAll = false
          row.isIndeterminate = true
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .menu-sort {
    margin-bottom: 20px;
  }

  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    .el-checkbox {
      margin-left: 0;
      margin-right: 20px;
    }
  }

  .access-list {
    display: flex;
    .item-all {
      margin-right: 20px;
    }
  }
</style>
