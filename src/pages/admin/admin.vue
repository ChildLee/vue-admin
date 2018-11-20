<template>
  <section>

    <el-button @click="dialog.addShow = true">添加管理员</el-button>

    <el-table :data="list">
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" prop="name" label="昵称"></el-table-column>
      <el-table-column align="center" prop="username" label="账号"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope" v-if="scope.row.id!==1">
          <span class="admin-status" @click="adminStatusChange(scope.row)">
            <el-tag type="success" v-if="scope.row.status">正常</el-tag>
            <el-tag type="danger" v-else>锁定</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updatedAt" label="更新时间"></el-table-column>
      <el-table-column align="center" label="操作" width="290">
        <template slot-scope="scope" v-if="scope.row.id!==1">
          <el-button size="mini" type="primary" @click="addGroupShow(scope.row)">组织</el-button>
          <el-button size="mini" type="primary" @click="addRoleDialog(scope.row)">角色</el-button>
          <el-button size="mini" @click="updateDialog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delDialog(scope.$index, scope.row)">删除</el-button>
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

    <!--添加管理员对话框-->
    <el-dialog title="添加管理员" width="500px" center
               :before-close="done=>resetForm('addForm',done)"
               :visible.sync="dialog.addShow">
      <el-form ref="addForm" :model="dataForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="昵称" prop="name">
          <el-input maxlength="50" placeholder="请输入昵称" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input maxlength="50" placeholder="请输入账号" v-model="dataForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input maxlength="50" placeholder="请输入密码" v-model="dataForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input maxlength="50" placeholder="请再次输入密码" v-model="dataForm.rePassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="addAdmin('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑管理员对话框-->
    <el-dialog title="修改管理员" width="500px" center
               :before-close="done=>resetForm('updateForm',done)"
               :visible.sync="dialog.updateShow">
      <el-form ref="updateForm" :model="dataForm" :rules="rules" label-position="left"
               label-width="80px">
        <el-form-item label="昵称" prop="name">
          <el-input maxlength="50" placeholder="请输入昵称" v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input maxlength="50" placeholder="请输入昵称" v-model="dataForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input maxlength="50" placeholder="请输入密码" v-model="dataForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input maxlength="50" placeholder="请再次输入密码" v-model="dataForm.rePassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('updateForm')">取 消</el-button>
        <el-button type="primary" @click="updateAdmin('updateForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑组织对话框-->
    <el-dialog title="编辑组织" width="650px" center :visible.sync="dialog.addGroupShow">
      <div class="transfer-center">
        <el-transfer :data="transferGroupData" v-model="selectedTransferData" filterable
                     :titles="['未选','已选']" :props="{key:'id',label:'name'}"></el-transfer>
      </div>
      <div slot="footer">
        <el-button @click="dialog.addGroupShow = false">取 消</el-button>
        <el-button type="primary" @click="saveAdminGroups">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑角色对话框-->
    <el-dialog title="编辑组织" width="650px" center :visible.sync="dialog.addRoleShow">
      <div class="transfer-center">
        <el-transfer :data="transferRoleData" v-model="selectedTransferData" filterable
                     :titles="['未选','已选']" :props="{key:'id',label:'name'}"></el-transfer>
      </div>
      <div slot="footer">
        <el-button @click="dialog.addRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="saveAdminRoles">确 定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  export default {
    // 管理员管理
    name: 'admin',
    data() {
      return {
        list: [],
        // 穿梭框数据(组织列表)
        transferGroupData: [],
        // 穿梭框数据(角色列表)
        transferRoleData: [],
        // 穿梭框已选数据
        selectedTransferData: [],
        // 组织列表选中行数据
        dataRow: {},
        dialog: {
          // 添加对话框
          addShow: false,
          // 修改对话框
          updateShow: false,
          // 添加组织对话框
          addGroupShow: false,
          // 添加角色对话框
          addRoleShow: false,
        },
        // 表单
        dataForm: {
          name: '',
          username: '',
          password: '',
          rePassword: '',
        },
        // 表单验证
        rules: {
          name: [{required: true, message: '请输入昵称'}],
          username: [{required: true, message: '请输入账号'}],
          password: [{required: true, message: '请输入密码'}],
          rePassword: [{required: true, message: '请输入密码'}],
        },
        page: 0,
        limit: 10,
        total: 0,
      }
    },
    mounted() {
      this.getAdmins()
    },
    methods: {
      // 查询组织
      getGroupAll() {
        this.api.group.getGroupAll({all: true}).then(res => {
          if (res && res.code === 0) {
            this.transferGroupData = res.data
          }
        })
      },
      // 查询角色
      getRoleAll() {
        this.api.role.getRoleAll({all: true}).then(res => {
          if (res && res.code === 0) {
            this.transferRoleData = res.data
          }
        })
      },
      // 查询管理员
      getAdmins(page = 1, limit = 10) {
        this.api.admin.getAdmins({page, limit}).then(res => {
          if (res && res.code === 0) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      // 添加管理员
      addAdmin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const password = this.dataForm.password
            const rePassword = this.dataForm.rePassword
            if (password !== rePassword) return this.$message({message: `两次输入的密码不一致`, type: 'error'})

            this.api.admin.addAdmin(this.dataForm).then(res => {
              if (res && res.code === 0) {
                ++this.total
                this.$message({message: `管理员添加成功!`, type: 'success'})
                this.$refs[formName].resetFields()
                this.dialog.addShow = false
                this.list.push(res.data)
              }
            })
          }
        })
      },
      // 封号/解封
      adminStatusChange(row) {
        let prompt = row.status ? `是否锁定：${row.name}` : `是否解封：${row.name}`

        this.$confirm(prompt, '提示', {
          center: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.api.admin.adminStatus({id: row.id, status: !row.status}).then(res => {
            if (res && res.code === 0) {
              row.status = !row.status
            }
          })
        }).catch(() => {
        })
      },
      // 删除管理员
      delDialog(index, row) {
        this.$confirm(`是否删除管理员：${row.name}`, '提示', {
          center: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.api.admin.delAdmin({id: row.id}).then(res => {
            if (res && res.code === 0) {
              this.list.splice(index, 1)
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
      // 修改管理员弹窗
      updateDialog(row) {
        this.dialog.updateShow = true
        this.dataRow = row
        this.dataForm.name = row.name
        this.dataForm.username = row.username
      },
      // 修改管理员
      updateAdmin(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const password = this.dataForm.password
            const rePassword = this.dataForm.rePassword
            if (password !== rePassword) return this.$message({message: `两次输入的密码不一致`, type: 'error'})

            this.api.admin.updateAdmin({
              id: this.dataRow.id,
              name: this.dataForm.name,
              username: this.dataForm.username,
              password: this.dataForm.password,
            }).then(res => {
              if (res && res.code === 0) {
                this.dataRow.name = this.dataForm.name
                this.dataRow.username = this.dataForm.username
                this.dialog.updateShow = false
                this.$refs[formName].resetFields()
                this.dataForm = {}
                this.$message({message: '管理员修改成功!', type: 'success'})
              }
            })
          }
        })
      },
      // 添加组织对话框
      async addGroupShow(row) {
        if (!this.transferGroupData.length) {
          await this.getGroupAll()
        }
        this.dataRow = row
        this.api.admin.getAdminGroups({id: row.id}).then(res => {
          if (res && res.code === 0) {
            const list = res.data
            const arr = []
            for (let i = 0; i < list.length; i++) {
              arr.push(list[i].group_id)
            }
            this.selectedTransferData = arr
            this.dialog.addGroupShow = true
          }
        })
      },
      // 保存组织
      saveAdminGroups() {
        console.log(this.selectedTransferData)
        this.api.admin.saveAdminGroups({
          admin_id: this.dataRow.id,
          groups: this.selectedTransferData,
        }).then(res => {
          if (res && res.code === 0) {
            this.$message({message: '管理员组织编辑成功!', type: 'success'})
            this.dialog.addGroupShow = false
          }
        })
      },
      // 添加角色对话框
      async addRoleDialog(row) {
        if (!this.transferRoleData.length) {
          await this.getRoleAll()
        }
        this.dataRow = row
        this.api.admin.getAdminRoles({id: row.id}).then(res => {
          if (res && res.code === 0) {
            const list = res.data
            const arr = []
            for (let i = 0; i < list.length; i++) {
              arr.push(list[i].role_id)
            }
            this.selectedTransferData = arr
            this.dialog.addRoleShow = true
          }
        })
      },
      // 保存角色
      saveAdminRoles() {
        this.api.admin.saveAdminRoles({
          admin_id: this.dataRow.id,
          roles: this.selectedTransferData,
        }).then(res => {
          if (res && res.code === 0) {
            this.$message({message: '管理员角色编辑成功!', type: 'success'})
            this.dialog.addRoleShow = false
          }
        })
      },
      // 重置表单
      resetForm(formName, done) {
        if (done) done()
        this.dialog.addShow = false
        this.dialog.updateShow = false
        this.$refs[formName].resetFields()
        this.dataForm = {}
      },
      // 分页每页条数
      handleSizeChange(limit) {
        this.limit = limit
        this.getAdmins(this.page = 1, limit)
      },
      // 分页当前第几页
      handleCurrentChange(page) {
        this.page = page
        this.getAdmins(page, this.limit)
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

  .transfer-center {
    display: flex;
    justify-content: center;
  }

  .admin-status {
    cursor: pointer;
  }
</style>
