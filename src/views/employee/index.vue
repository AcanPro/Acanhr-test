<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptsTree"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          node-key="id"
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template v-slot="{row}">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text">角色</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" size="mini" type="text" class="del">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :page-size="queryParams.pagesize"
            :current-page="queryParams.page"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { getEmployeeList, exportEmployee, deleteEmployee } from '@/api/employee'
import { transListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import ImportExcel from './components/ImportExcel'

export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
   data() {
    return {
      depts: [], // 组织数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      queryParams: {
        // 存储查询参数
        departmentId: null,
        page: 1,
        pagesize: 10,
        keyword: ''
      },
      total: 0,
      list: [],
      showExcelDialog: false
    }
   },
   created() {
    this.getDepartment()
   },
   methods: {
    async getDepartment() {
      // await getDepartment()
      const res = await getDepartment()
      this.depts = transListToTreeData(res.data.data, 0)
      this.queryParams.departmentId = this.depts[0].id
      // 因为树组件都是异步的
      this.$nextTick(() => {
        this.$refs.deptsTree.setCurrentKey(this.queryParams.departmentId)
      })
      // 这个时候已经选择到了 id
      this.getEmployeeList()
    },
    async getEmployeeList() {
      const res = await getEmployeeList(this.queryParams)
      this.list = res.data.data.rows
      this.total = res.data.data.total
    },
    selectNode(data) {
      this.queryParams.departmentId = data.id
      this.queryParams.page = 1 // 切换时赋初值
      this.getEmployeeList()
    },
    changePage(newPage) {
      this.queryParams.page = newPage
      this.getEmployeeList()
    },
    changeValue() {
      // 防抖
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 搜索到结果之后 定义为1
        this.queryParams.page = 1
        // 后端返回搜索结果
        this.getEmployeeList()
      }, 500)
    },
    async exportEmployee() {
     const res = await exportEmployee()
      // console.log(result) // 使用一个npm包 直接将blob文件下载到本地 file-saver
      // FileSaver.saveAs(blob对象,文件名称)
     FileSaver.saveAs(res.data, '员工信息表.xlsx')
    },
    async confirmDel(id) {
      await deleteEmployee(id)
      // 删除过后页码如果大于一，列表长度为空，就减一，再次刷新数据
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      this.getEmployeeList()
      this.$message.success('删除成功')
    }
   }

}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
