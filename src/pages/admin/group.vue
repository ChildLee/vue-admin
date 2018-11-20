<template>
  <section>

    <el-button @click="dialog.addShow = true">添加组织</el-button>

    <el-table :data="list">
      <el-table-column align="center" type="index" width="50"></el-table-column>
      <el-table-column align="center" prop="name" label="组织名"></el-table-column>
      <el-table-column align="center" prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updatedAt" label="更新时间"></el-table-column>
      <el-table-column align="center" label="操作" width="290">
        <template slot-scope="scope">
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

    <!--添加组织对话框-->
    <el-dialog title="添加组织" width="500px" center
               :before-close="done=>resetForm('addForm',done)"
               :visible.sync="dialog.addShow">
      <el-form ref="addForm" :model="dataForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="组织名" prop="name">
          <el-input maxlength="50" placeholder="请输入组织名" v-model="dataForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="addGroup('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑组织对话框-->
    <el-dialog title="修改组织" width="500px" center
               :before-close="done=>resetForm('updateForm',done)"
               :visible.sync="dialog.updateShow">
      <el-form ref="updateForm" :model="dataForm" :rules="rules" label-position="left"
               label-width="80px">
        <el-form-item label="组织名" prop="name">
          <el-input maxlength="50" placeholder="请输入组织名" v-model="dataForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetForm('updateForm')">取 消</el-button>
        <el-button type="primary" @click="updateGroup('updateForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑组织角色对话框-->
    <el-dialog title="编辑组织角色" width="650px" center :visible.sync="dialog.addRoleShow">
      <div class="transfer-center">
        <el-transfer :data="transferData" v-model="selectedTransferData" filterable
                     :titles="['未选','已选']" :props="{key:'id',label:'name'}"></el-transfer>
      </div>
      <div slot="footer">
        <el-button @click="dialog.addRoleShow = false">取 消</el-button>
        <el-button type="primary" @click="saveTransferData">确 定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  export default {
    // 组织管理
    name: 'group',
    data() {
      return {
        // 组织列表
        list: [],
        // 穿梭框数据(角色列表)
        transferData: [],
        // 穿梭框已选数据
        selectedTransferData: [],
        // 组织列表选中行数据
        dataRow: {},
        // 对话框
        dialog: {
          // 添加对话框
          addShow: false,
          // 修改对话框
          updateShow: false,
          // 添加角色对话框
          addRoleShow: false,
        },
        // 表单
        dataForm: {
          name: '',
        },
        // 表单验证
        rules: {
          name: [
            {required: true, message: '请输入组织名'},
          ],
        },
        page: 0,
        limit: 10,
        total: 0,
      }
    },
    mounted() {
      this.getGroupAll()
    },
    methods: {
      // 查询角色
      getRoleAll() {
        this.api.role.getRoleAll({all: true}).then(res => {
          if (res && res.code === 0) {
            this.transferData = res.data
          }
        })
      },
      // 查询组织
      getGroupAll(page = 1, limit = 10) {
        this.api.group.getGroupAll({page, limit}).then(res => {
          if (res && res.code === 0) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      // 重置表单
      resetForm(formName, done) {
        if (done) done()
        this.dialog.addShow = false
        this.dialog.updateShow = false
        this.$refs[formName].resetFields()
        this.dataForm.name = ''
      },
      // 添加组织
      addGroup(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.api.group.addGroup({name: this.dataForm.name}).then(res => {
              if (res && res.code === 0) {
                ++this.total
                this.$message({message: `组织添加成功!`, type: 'success'})
                this.$refs[formName].resetFields()
                this.dialog.addShow = false
                this.list.push(res.data)
              }
            })
          }
        })
      },
      delDialog(index, row) {
        this.$confirm(`是否删除组织：${row.name}`, '提示', {
          center: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.api.group.delGroup({id: row.id}).then(res => {
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
      // 修改组织弹窗
      updateDialog(row) {
        this.dialog.updateShow = true
        this.dataRow = row
        this.dataForm.name = row.name
      },
      // 修改组织
      updateGroup(formName) {
        this.$refs[formName].validate((valid) => {
          const name = this.dataForm.name
          if (valid) {
            this.api.group.updateGroup({
              id: this.dataRow.id,
              name: name,
            }).then(res => {
              if (res && res.code === 0) {
                this.dataRow.name = name
                this.dialog.updateShow = false
                this.$refs[formName].resetFields()
                this.dataForm.name = ''
                this.$message({message: '组织名修改成功!', type: 'success'})
              }
            })
          }
        })
      },
      // 添加角色对话框
      async addRoleDialog(row) {
        if (!this.transferData.length) {
          await this.getRoleAll()
        }
        this.dataRow = row
        this.api.group.getGroupRoles({id: row.id}).then(res => {
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
      // 保存组织角色
      saveTransferData() {
        this.api.group.saveGroupRoles({
          group_id: this.dataRow.id,
          roles: this.selectedTransferData,
        }).then(res => {
          if (res && res.code === 0) {
            this.$message({message: '组织角色编辑成功!', type: 'success'})
            this.dialog.addRoleShow = false
          }
        })
      },
      // 分页每页条数
      handleSizeChange(limit) {
        this.limit = limit
        this.getGroupAll(this.page = 1, limit)
      },
      // 分页当前第几页
      handleCurrentChange(page) {
        this.page = page
        this.getGroupAll(page, this.limit)
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
</style>
