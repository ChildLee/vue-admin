<template>
  <section>

    <el-button @click="dialog.addRoleShow = true">添加角色</el-button>

    <el-table :data="roleList">
      <el-table-column align="center" prop="id" label="ID" width="180"></el-table-column>
      <el-table-column align="center" prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column align="center" prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updatedAt" label="更新时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="addAccessDialog(scope.row)">权限</el-button>
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
    <el-dialog title="添加角色" width="500px" center :visible.sync="dialog.addRoleShow">
      <el-form ref="addRoleForm" :model="roleForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input placeholder="请输入角色名" autofocus v-model="roleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addRoleForm')">取 消</el-button>
        <el-button type="primary" @click="addRole('addRoleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--删除角色对话框-->
    <el-dialog title="提示" width="400px" center :visible.sync="dialog.delRoleShow">
      <div class="dialog-content">{{`是否删除${current.delRoleRow.name}`}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.delRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="delRole">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改角色对话框-->
    <el-dialog title="修改角色" width="500px" center :visible.sync="dialog.updateRoleShow">
      <el-form ref="updateRoleForm" :model="roleForm" :rules="rules" label-position="left"
               label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input placeholder="请输入角色名" autofocus v-model="roleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateRoleForm')">取 消</el-button>
        <el-button type="primary" @click="updateRole('updateRoleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改权限对话框-->
    <el-dialog title="权限列表" width="1000px" center :visible.sync="dialog.accessShow">
      <el-table :data="accessList" border>
        <el-table-column align="center" type="index" width="50"></el-table-column>
        <el-table-column align="center" prop="name" label="菜单" width="200"></el-table-column>
        <el-table-column header-align="center" label="权限">
          <template slot-scope="scope">
            <div class="access-list">
              <el-checkbox class="item-all" v-model="scope.row.checkAll"
                           :indeterminate="scope.row.isIndeterminate"
                           @change="checked=>checkAllChange(checked,scope.row)">全选
              </el-checkbox>
              <el-checkbox-group v-model="checkList">
                <template v-for="item in scope.row.accesses">
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
        <el-button type="primary" @click="addAccess">确 定</el-button>
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
        // 存放选中的权限
        checkList: [],
        dialog: {
          // 添加对话框
          addRoleShow: false,
          // 删除对话框
          delRoleShow: false,
          // 修改对话框
          updateRoleShow: false,
          // 权限对话框
          accessShow: false
        },
        current: {
          // 删除角色下标
          delRoleIndex: 0,
          // 删除角色项
          delRoleRow: {},
          // 修改角色下标
          updateRoleIndex: 0,
          // 修改角色项
          updateRoleRow: {},
          accessRow: {}
        },
        // 输入的角色名
        roleForm: {
          name: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入角色名', trigger: 'blur'}
          ]
        },
        page: 0,
        limit: 10,
        total: 0
      }
    },
    watch: {
      roleList(val) {
        for (let i = 0; i < val.length; i++) {
          val[i].createdAt = this.dateformat(val[i].createdAt, 'yyyy-mm-dd hh:MM:ss')
          val[i].updatedAt = this.dateformat(val[i].updatedAt, 'yyyy-mm-dd hh:MM:ss')
        }
      }
    },
    mounted() {
      this.getRole()
      this.getAccess()
    },
    methods: {
      // 重置表单
      resetForm(formName) {
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
      // 添加角色
      addRole(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.api.admin.addRole({name: this.roleForm.name}).then(res => {
              if (res.code === 0) {
                ++this.total
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
        this.current.delRoleIndex = index
        this.current.delRoleRow = row
        this.dialog.delRoleShow = true
      },
      // 删除角色确定
      delRole() {
        this.api.admin.delRole({id: this.current.delRoleRow.id}).then(res => {
          if (res.code === 0) {
            this.roleList.splice(this.current.delRoleIndex, 1)
            this.dialog.delRoleShow = false
          }
        })
      },
      // 修改角色弹窗
      updateRoleDialog(index, row) {
        this.current.updateRoleIndex = index
        this.current.updateRoleRow = row
        this.roleForm.name = row.name
        this.dialog.updateRoleShow = true
      },
      // 修改角色确定
      updateRole(formName) {
        this.$refs[formName].validate((valid) => {
          const name = this.roleForm.name
          if (valid) {
            this.api.admin.updateRole({
              id: this.current.updateRoleRow.id,
              name: name
            }).then(res => {
              if (res.code === 0) {
                this.current.updateRoleRow.name = name
                this.dialog.updateRoleShow = false
                this.$refs[formName].resetFields()
                this.roleForm.name = ''
              }
            })
          }
        })
      },
      // 添加权限弹窗
      addAccessDialog(row) {
        this.current.accessRow = row
        this.dialog.accessShow = true
      },
      // 添加权限
      addAccess() {
        console.log(666)
      },
      // 权限全选
      checkAllChange(check, row) {
        for (let i = 0; i < row.accesses.length; i++) {
          const index = this.checkList.indexOf(row.accesses[i].id)
          if (check && index === -1) {
            this.checkList.push(row.accesses[i].id)
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
        const len = row.accesses.length
        for (let i = 0; i < len; i++) {
          const index = this.checkList.indexOf(row.accesses[i].id)
          if (index !== -1) {
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
      // 分页每页条数
      handleSizeChange(limit) {
        this.limit = limit
        this.getRole(this.page = 1, limit)
      },
      // 分页当前第几页
      handleCurrentChange(page) {
        this.page = page
        this.getRole(page, this.limit)
      }
    }
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
