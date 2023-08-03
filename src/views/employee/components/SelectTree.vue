<template>
  <!-- element-ui级联组件 -->
  <!-- value值 动态绑定的 -->
  <el-cascader
    :value="value"
    size="mini"
    :options="treeData"
    :props="props"
    separator="-"
    @change="changeValue"
  />
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'

export default {
  // 父组件使用v-model 子组件接收值 props 的 value 值
  // 实现双向绑定
  props: {
    value: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      treeData: [], // 数据
      props: {
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const res = await getDepartment()
      this.treeData = transListToTreeData(res.data.data, 0)
    },
    changeValue(list) {
      if (list.length) {
        this.$emit('input', list[list.length - 1]) // 将最后一位的id取出来 传出去
      } else {
        this.$emit('input', null) // 如果长度为0 说明值为空
      }
    }
  }
}

</script>

<style  scoped>

</style>
