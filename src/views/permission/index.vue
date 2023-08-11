<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary" @click="showDialog = true">添加权限</el-button>
      <el-table :data="list" default-expand-all row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" size="mini" type="text" @click="addpermission(row,2)">添加</el-button>
            <el-button size="mini" type="text" @click="editpermission(row.id)">编辑</el-button>
            <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmDel(row.id)">
              <el-button slot="reference" size="mini" type="text" class="del">删除</el-button>
            </el-popconfirm>
          </template>

        </el-table-column>
      </el-table>
    </div>
    <add-permission ref="addpm" :data="data" :form="form" :show-dialog.sync="showDialog" @updateList="getPermissionList" />
  </div>
</template>
<script>
import { getPermissionList, deletePermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'
import AddPermission from './components/AddPermission'

export default {
  name: 'Permission',
  components: {
    AddPermission
  },
  data() {
    return {
      list: [],
      showDialog: false,
      data: {
        id: null,
        type: null,
        pid: null
      },
      form: {}
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = transListToTreeData(res.data.data, 0)
    },
    addpermission(row, type) {
      this.showDialog = true
      this.data.pid = row.id
      this.data.type = type
    },
    async editpermission(id) {
      this.data.id = id
      this.showDialog = true
      this.$nextTick(() => {
        this.$refs.addpm.getPermissionDetail()
      })
    },
    async confirmDel(id) {
      await deletePermission(id)
      this.$message.success('删除成功')
      this.getPermissionList()
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
.del{
  margin-left: 10px;
}
</style>
