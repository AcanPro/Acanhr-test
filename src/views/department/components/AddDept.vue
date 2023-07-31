<template>
  <el-dialog title="新增部门" :visible="showDialog" @close="close">
    <el-form ref="addDept" label-width="120px" :model="formData" :rules="rules">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%;" size="mini">
          <!-- label 是显示的字段，，value则是它的id 存储字段 -->
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input
          v-model="formData.introduce"
          placeholder="1-100个字符"
          type="textarea"
          style="width: 80%;"
          size="mini"
          :rows="4"
        />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="btnOk">确定</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script >
import { getDepartment, getManagerList, addDepartment } from '@/api/department'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      managerList: [],
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人名字
        name: '', // 部门名称
        pid: '' // 部门父级部门id
      },
      rules: {
        code: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '该项长度为2-10个字符', trigger: 'blur' },
          { validator: this.confirmCode, trigger: 'blur' }
        ], // 部门编码
        introduce: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '该项长度为1-100个字符', trigger: 'blur' }
        ], // 部门介绍
        managerId: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ], // 部门负责人名字
        name: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '该项长度为2-10个字符', trigger: 'blur' },
          { validator: this.confirmName, trigger: 'blur' }
        ] // 部门名称
      }
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      this.$emit('update:showDialog', false)
      this.$refs.addDept.resetFields()
    },
    async confirmCode(rule, value, callback) {
      const res = await getDepartment()
      const data = res.data.data
      if (data.some(item => item.code === value)) {
        callback(new Error('该部门编码已存在'))
      } else {
        callback()
      }
    },
    async confirmName(rule, value, callback) {
      const res = await getDepartment()
      const data = res.data.data
      if (data.some(item => item.name === value)) {
        callback(new Error('该部门名称已存在'))
      } else {
        callback()
      }
    },
    async getManagerList() {
      const res = await getManagerList()
      this.managerList = res.data.data
    },
    btnOk() {
      this.$refs.addDept.validate(async valid => {
        if (valid) {
          // pid为空 所以展开之后，在后面给pid赋值，
          // this.formData.pid = this.currentId
          await addDepartment({
            ...this.formData,
            pid: this.currentId
          })
          // 通知父组件更新
          this.$emit('updateList')
          this.$message.success('添加成功')
          this.close()
        }
      })
    }
  }
}
</script>

<style scoped></style>
