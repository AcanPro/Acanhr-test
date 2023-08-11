<template>
  <el-dialog title="添加权限" :visible="showDialog" @close="btnCancel">
    <el-form ref="addPermission" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model="formData.description" type="textarea" style="width: 80%;" size="mini" />
      </el-form-item>
      <el-form-item label="开启" prop="enVisible">
        <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
      </el-form-item>
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="btnIsOk">确认</el-button>
            <el-button size="mini" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: 1, // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: 0, // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: null // 默认关闭
      },
      rules: {
        name: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    btnIsOk() {
      this.$refs['addPermission'].validate(async valid => {
        if (valid) {
          if (this.data.type) {
            this.formData.pid = this.data.pid
            this.formData.type = this.data.type
            await addPermission(this.formData)
            // 用过之后把type置空，否则会影响判断
            this.data.type = ''
          } else if (this.formData.id) {
            await updatePermission(this.formData)
          } else {
            await addPermission(this.formData)
          }
          this.$emit('updateList')
          this.$message.success('更新成功')
          this.btnCancel()
        }
      })
    },
    async getPermissionDetail() {
      const res = await getPermissionDetail(this.data.id)
      this.formData = res.data.data
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: 1, // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: 0, // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: null // 默认关闭
      }
      this.$refs['addPermission'].resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}

</script>

<style  scoped>

</style>
