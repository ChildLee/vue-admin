<template>
  <main>
    <el-button @click="addRoleDialog = true">添加角色</el-button>

    <el-table :data="roleList">
      <el-table-column align="center" prop="id" label="ID" width="180"></el-table-column>
      <el-table-column align="center" prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column align="center" prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updatedAt" label="更新时间"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger" @click="delRole(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-pagination></el-pagination>


    <!--添加角色对话框-->
    <el-dialog title="添加角色" width="500px" :visible.sync="addRoleDialog">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input placeholder="请输入角色名" autofocus v-model="roleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('roleForm')">取 消</el-button>
        <el-button type="primary" @click="addRole('roleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--删除角色对话框-->
    <el-dialog title="提示" width="500px" center :visible.sync="delRoleDialog">
      <span>需要注意的是内容是默认不居中的</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="delRole">确 定</el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script>

  export default {
    name: 'role',
    data() {
      return {
        // 角色列表
        roleList: [],
        // 添加对话框
        addRoleDialog: false,
        // 删除对话框
        delRoleDialog: false,
        // 输入的角色名
        roleForm: {
          name: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入角色名', trigger: 'blur'}
          ]
        }
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
      this.api.admin.getRole().then(res => {
        if (res.code === 0) {
          this.roleList = res.data
        }
      })
    },
    methods: {
      // 添加角色
      addRole(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.api.admin.addRole({name: this.roleForm.name}).then(res => {
              if (res.code === 0) {
                this.$refs[formName].resetFields()
                this.addRoleDialog = false
                this.roleList.push(res.data)
              }
            })
          }
        })
      },
      // 删除角色
      delRole(index, row) {
        console.log(index)
        console.log(row)
      },
      // 重置表单
      resetForm(formName) {
        this.addRoleDialog = false
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
