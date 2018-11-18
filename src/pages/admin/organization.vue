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
          <el-button size="mini" type="primary" @click="addAccessDialog(scope.row)">角色</el-button>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="addOrganization('addForm')">确 定</el-button>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('updateForm')">取 消</el-button>
        <el-button type="primary" @click="updateRole('updateForm')">确 定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  export default {
    // 组织管理
    name: 'organization',
    data() {
      return {
        list: [],
        dataRow: {},
        dialog: {
          // 添加对话框
          addShow: false,
          // 修改对话框
          updateShow: false,
        },
        // 组织名
        dataForm: {
          name: '',
        },
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
      this.getOrganizationAll()
    },
    methods: {
      // 查询组织
      getOrganizationAll(page = 1, limit = 10) {
        this.api.organization.getOrganizationAll({page, limit}).then(res => {
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
      addOrganization(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.api.organization.addOrganization({name: this.dataForm.name}).then(res => {
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
          this.api.organization.delOrganization({id: row.id}).then(res => {
            if (res && res.code === 0) {
              this.list.splice(index, 1)
              this.$message({message: `删除${row.name}成功!`, type: 'success'})
            }
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
      updateRole(formName) {
        this.$refs[formName].validate((valid) => {
          const name = this.dataForm.name
          if (valid) {
            this.api.organization.updateOrganization({
              id: this.dataRow.id,
              name: name,
            }).then(res => {
              if (res && res.code === 0) {
                this.dataRow.name = name
                this.dialog.updateShow = false
                this.$refs[formName].resetFields()
                this.dataForm.name = ''
                this.$message({message: '角色名修改成功!', type: 'success'})
              }
            })
          }
        })
      },
      // 分页每页条数
      handleSizeChange(limit) {
        this.limit = limit
        this.getOrganizationAll(this.page = 1, limit)
      },
      // 分页当前第几页
      handleCurrentChange(page) {
        this.page = page
        this.getOrganizationAll(page, this.limit)
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
</style>
