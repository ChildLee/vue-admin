<template>
  <section>

    <el-button @click="dialog.addRoleShow = true">添加角色</el-button>

    <el-table :data="roleList">
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" prop="name" label="角色名"></el-table-column>
      <el-table-column align="center" prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updatedAt" label="更新时间"></el-table-column>
      <el-table-column align="center" label="操作" width="290">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="addAccessDialog(scope.row)">权限</el-button>
          <el-button size="mini" type="success" @click="addMenuDialog(scope.row)">菜单</el-button>
          <el-button size="mini" @click="updateRoleDialog(scope.$index, scope.row)">编辑</el-button>
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
      <el-form ref="addRoleForm" :model="roleForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input placeholder="请输入角色名" v-model="roleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addRoleForm')">取 消</el-button>
        <el-button type="primary" @click="addRole('addRoleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑角色对话框-->
    <el-dialog title="修改角色" width="500px" center
               :before-close="done=>resetForm('updateRoleForm',done)"
               :visible.sync="dialog.updateRoleShow">
      <el-form ref="updateRoleForm" :model="roleForm" :rules="rules" label-position="left"
               label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input placeholder="请输入角色名" v-model="roleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateRoleForm')">取 消</el-button>
        <el-button type="primary" @click="updateRole('updateRoleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改权限对话框-->
    <el-dialog :title="`${current.accessRow.name}-权限列表`" width="1000px" center :visible.sync="dialog.accessShow">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.accessShow = false">取 消</el-button>
        <el-button type="primary" @click="roleAddAccess">确 定</el-button>
      </div>
    </el-dialog>

    <!--角色显示菜单设置-->
    <el-dialog :title="`${current.accessRow.name}-菜单列表`" width="600px" :visible.sync="dialog.menuShow">

      <el-tree :data="menuList" :props="{label:'name',children:'menus'}" node-key="id"
               show-checkbox :default-expand-all="true" ref="tree"></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.menuShow = false">取 消</el-button>
        <el-button type="primary" @click="roleAddMenu">确 定</el-button>
      </div>

    </el-dialog>

  </section>
</template>

<script>

  export default {
    name: 'role',
    data() {
      return {
        // 角色列表
        roleList: [],
        // 权限列表
        accessList: [{checkAll: false, isIndeterminate: false}],
        // 菜单列表
        menuList: [],
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
        },
        // 当前参数
        current: {
          // 删除角色下标
          delRoleIndex: 0,
          // 删除角色项
          delRoleRow: {},
          // 修改角色下标
          updateRoleIndex: 0,
          // 修改角色项
          updateRoleRow: {},
          // 角色信息
          accessRow: {},
        },
        // 输入的角色名
        roleForm: {
          name: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入角色名', trigger: 'blur'},
          ],
        },
        page: 0,
        limit: 10,
        total: 0,
      }
    },
    mounted() {
      this.getRole()
      this.getAccess()
      this.getMenu()
    },
    methods: {
      // 重置表单
      resetForm(formName, done) {
        if (done) done()
        this.dialog.addRoleShow = false
        this.dialog.updateRoleShow = false
        this.$refs[formName].resetFields()
        this.roleForm.name = ''
      },
      // 查询角色
      getRole(page = 1, limit = 10) {
        this.api.admin.getRole({page, limit}).then(res => {
          if (res.code === 0) {
            this.roleList = res.data.list
            this.total = res.data.total
          }
        })
      },
      // 查询权限
      getAccess() {
        this.api.admin.getAccess().then(res => {
          if (res.code === 0) {
            this.accessList = res.data
          }
        })
      },
      // 查询所有菜单
      getMenu() {
        this.api.admin.getMenu().then(res => {
          if (res.code === 0) {
            this.menuList = res.data
          }
        })
      },
      // 添加角色
      addRole(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.api.admin.addRole({name: this.roleForm.name}).then(res => {
              if (res.code === 0) {
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
        this.$confirm(`是否删除角色:${row.name}`, '提示', {
          center: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.api.admin.delRole({id: row.id}).then(res => {
            if (res.code === 0) {
              this.roleList.splice(index, 1)
              this.$message({message: `删除${row.name}成功!`, type: 'success'})
            }
          })
        })
      },
      // 修改角色弹窗
      updateRoleDialog(index, row) {
        this.dialog.updateRoleShow = true
        this.current.updateRoleIndex = index
        this.current.updateRoleRow = row
        this.roleForm.name = row.name
      },
      // 修改角色确定
      updateRole(formName) {
        this.$refs[formName].validate((valid) => {
          const name = this.roleForm.name
          if (valid) {
            this.api.admin.updateRole({
              id: this.current.updateRoleRow.id,
              name: name,
            }).then(res => {
              if (res.code === 0) {
                this.current.updateRoleRow.name = name
                this.dialog.updateRoleShow = false
                this.$refs[formName].resetFields()
                this.roleForm.name = ''
                this.$message({message: '角色名修改成功!', type: 'success'})
              }
            })
          }
        })
      },
      // 添加权限弹窗
      addAccessDialog(row) {
        this.current.accessRow = row
        // 查询角色已有权限
        this.api.admin.getRoleAccess({role_id: row.id}).then(res => {
          if (res.code === 0) {
            this.checkList = res.data
            for (let i = 0; i < this.accessList.length; i++) {
              const permission = this.accessList[i].permission
              let count = 0
              // 循环判断该菜单里面有几个权限选中
              for (let j = 0; j < permission.length; j++) {
                const bool = this.checkList.includes(permission[j].id)
                if (bool) {
                  ++count
                }
              }
              // 根据选中权限的数量给出相应的样式展示
              if (count === 0) {
                this.accessList[i].checkAll = false
                this.accessList[i].isIndeterminate = false
              } else if (count === permission.length) {
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
        this.api.admin.roleAddAccess({role_id: this.current.accessRow.id, permission: this.checkList}).then(res => {
          if (res.code === 0) {
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
        for (let i = 0; i < row.permission.length; i++) {
          const index = this.checkList.indexOf(row.permission[i].id)
          if (check && index === -1) {
            this.checkList.push(row.permission[i].id)
          } else if (!check && index !== -1) {
            this.checkList.splice(index, 1)
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
      // 角色菜单弹窗
      addMenuDialog(row) {
        this.current.accessRow = row
        // 查询角色已有菜单

        this.dialog.menuShow = true
      },
      // 角色添加菜单
      roleAddMenu() {
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
        const keys = checkedKeys.concat(halfCheckedKeys)

        this.api.admin.roleAddMenu({role_id: this.current.accessRow.id, menus: keys}).then(res => {
          if (res.code === 0) {
            this.$message({message: '角色菜单修改成功!', type: 'success'})
            this.dialog.menuShow = false
          }
        })

      },
      // 分页每页条数
      handleSizeChange(limit) {
        this.limit = limit
        this.getRole(this.page = 1, limit)
      },
      // 分页当前第几页
      handleCurrentChange(page) {
        this.page = page
        this.getRole(page, this.limit)
      },
    },
  }
</script>

<style scoped lang="scss">
  .dialog-content {
    display: flex;
    justify-content: center;
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
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
