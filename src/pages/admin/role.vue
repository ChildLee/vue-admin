<template>
  <section>

    <el-button @click="dialog.addRoleShow = true">添加角色</el-button>
    <el-button icon="el-icon-sort" type="success" @click="menuSortButton">菜单管理</el-button>

    <el-table :data="roleList">
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" prop="name" label="角色名"></el-table-column>
      <el-table-column align="center" prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updatedAt" label="更新时间"></el-table-column>
      <el-table-column align="center" label="操作" width="290">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="addAccessDialog(scope.row)">权限</el-button>
          <el-button size="mini" type="success" @click="addMenuDialog(scope.row)">菜单</el-button>
          <el-button size="mini" @click="updateRoleDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delRoleDialog(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="page"
      :total="total">
    </el-pagination>

    <!--添加角色对话框-->
    <el-dialog title="添加角色" width="500px" center
               :before-close="done=>resetForm('addRoleForm',done)"
               :visible.sync="dialog.addRoleShow">
      <el-form ref="addRoleForm" :model="dataForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input maxlength="50" placeholder="请输入角色名" v-model="dataForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('addRoleForm')">取 消</el-button>
        <el-button type="primary" @click="addRole('addRoleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑角色对话框-->
    <el-dialog title="修改角色" width="500px" center
               :before-close="done=>resetForm('updateRoleForm',done)"
               :visible.sync="dialog.updateRoleShow">
      <el-form ref="updateRoleForm" :model="dataForm" :rules="rules" label-position="left"
               label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input maxlength="50" placeholder="请输入角色名" v-model="dataForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('updateRoleForm')">取 消</el-button>
        <el-button type="primary" @click="updateRole('updateRoleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改权限对话框-->
    <el-dialog :title="`${dataRow.name}-权限列表`" width="1000px" center :visible.sync="dialog.accessShow">
      <el-table :data="accessList" border>
        <el-table-column align="center" type="index" width="50"></el-table-column>
        <el-table-column align="center" prop="name" label="资源" width="200"></el-table-column>
        <el-table-column header-align="center" label="权限">
          <template slot-scope="scope">
            <div class="access-list">
              <el-checkbox class="item-all" v-model="scope.row.checkAll"
                           :indeterminate="scope.row.isIndeterminate"
                           @change="checked=>checkAllChange(checked,scope.row)">全选
              </el-checkbox>
              <el-checkbox-group v-model="checkList">
                <template v-for="item in scope.row.permissions">
                  <el-checkbox :label="item.id" @change="checked=>checkChange(checked,scope.row)">
                    {{item.name}}
                  </el-checkbox>
                </template>
              </el-checkbox-group>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="dialog.accessShow = false">取 消</el-button>
        <el-button type="primary" @click="roleAddAccess">确 定</el-button>
      </div>
    </el-dialog>

    <!--角色显示菜单设置-->
    <el-dialog :title="`${dataRow.name}-菜单列表`" width="600px" :visible.sync="dialog.menuShow">

      <el-tree :data="menuList" :props="{label:'name',children:'menus'}" node-key="id"
               show-checkbox :default-expand-all="true" ref="tree"></el-tree>

      <div slot="footer">
        <el-button @click="dialog.menuShow = false">取 消</el-button>
        <el-button type="primary" @click="roleAddMenu">确 定</el-button>
      </div>

    </el-dialog>

    <!--菜单管理-->
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
      <div slot="footer">
        <el-button @click="dialog.menuSortDialog=false">取 消</el-button>
        <el-button type="primary" @click="menuSortSave">保存</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>

  export default {
    // 角色管理
    name: 'role',
    data() {
      return {
        // 选中角色信息
        dataRow: {},
        // 角色列表
        roleList: [],
        // 菜单管理列表
        sortList: [],
        // 权限列表
        accessList: [{checkAll: false, isIndeterminate: false}],
        // 菜单列表
        menuList: [],
        // 含有子节点的节点ID
        nodeArr: [],
        // 存放选中的权限
        checkList: [],
        dialog: {
          // 添加对话框
          addRoleShow: false,
          // 修改对话框
          updateRoleShow: false,
          // 权限对话框
          accessShow: false,
          // 菜单对话框
          menuShow: false,
          // 菜单管理对话框
          menuSortDialog: false,
        },
        // 输入的角色名
        dataForm: {
          name: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入角色名'},
          ],
        },
        page: 0,
        limit: 10,
        total: 0,
      }
    },
    mounted() {
      this.getRoleAll()
      this.getAccessAll()
    },
    methods: {
      // 重置表单
      resetForm(formName, done) {
        if (done) done()
        this.dialog.addRoleShow = false
        this.dialog.updateRoleShow = false
        this.$refs[formName].resetFields()
        this.dataForm.name = ''
      },
      // 查询角色
      getRoleAll(page = 1, limit = 10) {
        this.api.role.getRoleAll({page, limit}).then(res => {
          if (res && res.code === 0) {
            this.roleList = res.data.list
            this.total = res.data.total
          }
        })
      },
      // 查询权限
      getAccessAll() {
        this.api.role.getAccessAll().then(res => {
          if (res && res.code === 0) {
            this.accessList = res.data
          }
        })
      },
      // 查询所有菜单
      async getMenuAll() {
        return this.api.menu.getMenuAll().then(res => {
          if (res && res.code === 0) {
            const menus = res.data
            this.menuList = menus

            const nodeArr = []
            // 遍历获取含有子节点的节点ID
            for (let i = 0; i < menus.length; i++) {
              const childMenus = menus[i].menus
              if (childMenus.length > 0) {
                nodeArr.push(menus[i].id)
                for (let j = 0; j < childMenus.length; j++) {
                  if (childMenus[j].menus.length > 0) {
                    nodeArr.push(childMenus[j].id)
                  }
                }
              }
            }
            this.nodeArr = nodeArr
          }
        })
      },
      // 添加角色
      addRole(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.api.role.addRole({name: this.dataForm.name}).then(res => {
              if (res && res.code === 0) {
                ++this.total
                this.$message({message: `角色添加成功!`, type: 'success'})
                this.$refs[formName].resetFields()
                this.dialog.addRoleShow = false
                this.roleList.push(res.data)
              }
            })
          }
        })
      },
      // 删除角色弹窗
      delRoleDialog(index, row) {
        this.$confirm(`是否删除角色：${row.name}`, '提示', {
          center: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.api.role.delRole({id: row.id}).then(res => {
            if (res && res.code === 0) {
              this.roleList.splice(index, 1)
              this.$message({message: `删除${row.name}成功!`, type: 'success'})
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      },
      // 修改角色弹窗
      updateRoleDialog(row) {
        this.dialog.updateRoleShow = true
        this.dataRow = row
        this.dataForm.name = row.name
      },
      // 修改角色确定
      updateRole(formName) {
        this.$refs[formName].validate((valid) => {
          const name = this.dataForm.name
          if (valid) {
            this.api.role.updateRole({
              id: this.dataRow.id,
              name: name,
            }).then(res => {
              if (res && res.code === 0) {
                this.dataRow.name = name
                this.dialog.updateRoleShow = false
                this.$refs[formName].resetFields()
                this.dataForm.name = ''
                this.$message({message: '角色名修改成功!', type: 'success'})
              }
            })
          }
        })
      },
      // 添加权限弹窗
      addAccessDialog(row) {
        this.dataRow = row
        // 查询角色已有权限
        this.api.role.getRoleAccess({role_id: row.id}).then(res => {
          if (res && res.code === 0) {
            this.checkList = res.data
            for (let i = 0; i < this.accessList.length; i++) {
              const permissions = this.accessList[i].permissions
              let count = 0
              // 循环判断该菜单里面有几个权限选中
              for (let j = 0; j < permissions.length; j++) {
                const bool = this.checkList.includes(permissions[j].id)
                if (bool) {
                  ++count
                }
              }
              // 根据选中权限的数量给出相应的样式展示
              if (count === 0) {
                this.accessList[i].checkAll = false
                this.accessList[i].isIndeterminate = false
              } else if (count === permissions.length) {
                this.accessList[i].checkAll = true
                this.accessList[i].isIndeterminate = false
              } else {
                this.accessList[i].checkAll = false
                this.accessList[i].isIndeterminate = true
              }
            }
            this.dialog.accessShow = true
          }
        })
      },
      // 角色添加权限
      roleAddAccess() {
        this.api.role.roleAddAccess({role_id: this.dataRow.id, permissions: this.checkList}).then(res => {
          if (res && res.code === 0) {
            this.$message({message: '角色权限修改成功!', type: 'success'})
            this.dialog.accessShow = false
          }
        })
      },
      // 权限全选
      checkAllChange(check, row) {
        if (check) {
          row.checkAll = true
          row.isIndeterminate = false
        } else {
          row.checkAll = false
          row.isIndeterminate = false
        }
        for (let i = 0; i < row.permissions.length; i++) {
          const index = this.checkList.indexOf(row.permissions[i].id)
          if (check && index === -1) {
            this.checkList.push(row.permissions[i].id)
          } else if (!check && index !== -1) {
            this.checkList.splice(index, 1)
          }
        }
      },
      // 权限单选
      checkChange(check, row) {
        let count = 0
        const len = row.permissions.length
        for (let i = 0; i < len; i++) {
          const bool = this.checkList.includes(row.permissions[i].id)
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
      // 角色菜单弹窗
      async addMenuDialog(row) {
        if (!this.menuList.length) {
          await this.getMenuAll()
        }
        this.dataRow = row
        // 查询角色已有菜单
        this.api.role.getRoleMenuKeys({role_id: row.id}).then(res => {
          if (res && res.code === 0) {
            const arr = []
            for (let i = 0; i < res.data.length; i++) {
              const menu_id = res.data[i].menu_id
              if (!this.nodeArr.includes(menu_id)) arr.push(menu_id)
            }
            this.dialog.menuShow = true
            // 处理首次加载菜单弹窗
            if (this.$refs.tree) {
              this.$refs.tree.setCheckedKeys(arr)
            } else {
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(arr)
              })
            }
          }
        })
      },
      // 角色添加菜单
      roleAddMenu() {
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
        const keys = checkedKeys.concat(halfCheckedKeys)

        this.api.role.roleAddMenu({role_id: this.dataRow.id, menus: keys}).then(res => {
          if (res && res.code === 0) {
            this.$message({message: '角色菜单修改成功!', type: 'success'})
            this.dialog.menuShow = false
          }
        })
      },
      // 打开菜单管理对话框
      async menuSortButton() {
        if (!this.menuList.length) {
          await this.getMenuAll()
        }
        this.sortList = [...this.menuList]
        if (this.sortList.length) {
          for (let i = 0; i < this.sortList.length; i++) {
            this.sortList[i].up = false
            this.sortList[i].down = false
          }
          this.sortList[0].up = true
          this.sortList[this.sortList.length - 1].down = true
        }
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
        this.api.menu.menuSort({sort}).then(res => {
          if (res && res.code === 0) {
            this.menuList = [...this.sortList]
            this.dialog.menuSortDialog = false
            this.$message({message: '菜单保存成功!', type: 'success'})
          }
        })
      },
      // 分页每页条数
      handleSizeChange(limit) {
        this.limit = limit
        this.getRoleAll(this.page = 1, limit)
      },
      // 分页当前第几页
      handleCurrentChange(page) {
        this.page = page
        this.getRoleAll(page, this.limit)
      },
    },
  }
</script>

<style scoped lang="scss">
  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .access-list {
    display: flex;

    .item-all {
      margin-right: 20px;
    }
  }
</style>
