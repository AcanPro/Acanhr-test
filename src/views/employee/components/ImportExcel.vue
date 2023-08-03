<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadChange"
        >
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="getExportTemplate">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="handleUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { getExportTemplate, uploadExcel } from '@/api/employee'
import FileSaver from 'file-saver'

export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getExportTemplate() {
      const res = await getExportTemplate()
      FileSaver.saveAs(res.data, '员工导入模板.xlsx')
    },
    handleUpload() {
      // 调出文件窗口
      this.$refs['excel-upload-input'].click()
    },
    async uploadChange(event) {
      console.log(event.target.files)
      // b判断
      const files = event.target.files
      if (files.length > 0) {
        const data = new FormData()
        data.append('file', files[0])
        try {
          await uploadExcel(data)
          // 通知父组件上传完成，重新调用
          this.$emit('uploadSuccess')
          // 关闭弹窗
          this.$emit('update:showExcelDialog', false)
          this.$message.success('上传成功')
        } catch (err) {
          // clg
          console.log(err)
          this.$emit('update:showExcelDialog', false)
          this.$message.error('请重新上传')
          // this.$emit('uploadSuccess')
        } finally {
          this.$refs['excel-upload-input'].values = ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .upload-excel {
      display: flex;
      justify-content: center;
      margin: 20px;
      width: 360px;
      height: 180px;
      align-items: center;
      color: #697086;
      .excel-upload-input {
        display: none;
        z-index: -9999;
      }
      .btn-upload,
      .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .drop {
        line-height: 40px;
        color: #bbb;
        i {
          font-size: 60px;
          display: block;
          color: #c0c4cc;
        }
      }
    }
</style>

