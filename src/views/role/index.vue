<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="roleList">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200" label="角色">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <!-- 作用于插槽 用在template上 -->
          <template v-slot="{ row }">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state ? '已启用' : '未启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- template 作用于插槽 可以获取数据 -->
          <template v-slot="{row}">
            <template v-if="row.isEdit">
              <el-button size="mini" type="primary" @click="btnRowOk(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="text" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="mini" type="text" @click="btnEditRow(row)">编辑</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" size="mini" type="text" class="del">删除</el-button>
              </el-popconfirm>

            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <el-dialog width="500px" title="新增角色" :visible.sync="showDialog" @close="btnCancel">
      <!-- 表单内容 -->
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOk">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 放置权限弹层 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <!-- 放置权限数据 -->
      <el-tree
        ref="permTree"
        node-key="id"
        :data="permissionData"
        :props="{ label: 'name' }"
        show-checkbox
        default-expand-all
        :default-checked-keys="permIds"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="btnPermissionOK">确定</el-button>
          <el-button size="mini" @click="showPermissionDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList } from '@/api/permission'
import { getRoleList, addRole, updateRole, delRole, getRoleDetail, assignPerm } from '@/api/role'
import { transListToTreeData } from '@/utils'

export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条
        total: 0
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: '',
        state: 0 // 默认未1启用 关闭 0 打开1
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      showPermissionDialog: false,
      permissionData: [],
      currentRoleId: null,
      permIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const res = await getRoleList(this.pageParams)
      this.roleList = res.data.data.rows
      this.pageParams.total = res.data.data.total
      // 给每个数据添加一个isEdit
      this.roleList.forEach(item => {
        // 这里自己赋值 会失去响应式，
        // item.isEdit = false
        // this.$set(对象,'添加的',值)
        this.$set(item, 'isEdit', false)
        // 再加一个editRow 缓存数据
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    changePage(newPage) {
      // alert(newPage)
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnOk() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
    })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 编辑按钮
    btnEditRow(row) {
      row.isEdit = true
      // 重新点击编辑，没有更改，就给回原值
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async btnRowOk(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('修改成功')
        // 更新显示数据  退出编辑状态
        // row.name = row.editRow.name // eslint的一校验 误判
        // Object.assign(target, source)
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })
        // 规避eslint的误判
      } else {
        this.$message.warning('必填项不能为空！')
      }
    },
    async confirmDel(id) {
      await delRole(id) // 后端删除
      this.$message.success('删除角色成功')
      // 删除的如果是最后一个
      if (this.list.length === 1) this.pageParams.page--
      this.getRoleList()
    },
    async  btnPermission(id) {
      this.currentRoleId = id
      const res = await getPermissionList()
      this.permissionData = transListToTreeData(res.data.data, 0)
      const resd = await getRoleDetail(id)
      const { permIds } = resd.data.data
      this.permIds = permIds
      this.showPermissionDialog = true
    },
    async  btnPermissionOK() {
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('角色分配权限成功')
      this.showPermissionDialog = false
    }

  }
}
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
.del{
  margin-left: 10px;
}
</style>
