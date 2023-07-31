<template>
  <div class="container">
    <div class="app-container">

      <el-tree :expand-on-click-node="false" :data="depts" :props="defaultProps" default-expand-all>
        <!-- 节点结构 -->
        <template v-slot="props">
          <el-row style="width: 100%;height: 40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ props.data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ props.data.managerName }}</span>
              <el-dropdown @command="operateDept">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除部门</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- .sync 就是接受子组件的update：变量  ，这里showDialog就会 更新 接收传出来的值  -->
    <add-dept :show-dialog.sync="showDialog" />
  </div>
</template>
<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils/index'
import AddDept from '@/views/department/components/AddDept.vue'

export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      showDialog: false,
      depts: [

      ],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartment()
      console.log(res.data.data)
      this.depts = transListToTreeData(res.data.data, 0)
    },
    operateDept(command) {
      if (command === 'add') {
        // 跳出弹窗
        this.showDialog = true
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}

.tree-manager {
  width: 50px;
  display: inline-block;
  margin: 10px 10px 0 10px;
}
</style>
