<template>
  <avue-crud
    :data="logsList"
    :option="option">
    <template slot="menuLeft">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-upload"
        @click="send">上传服务器</el-button>
      <el-button
        type="danger"
        size="mini"
        icon="el-icon-delete"
        @click="clear">清空本地日志</el-button>
    </template>
    <template
      slot="type"
      slot-scope="scope">
      <el-tag
        type="danger"
        size="mini">{{ scope.label }}</el-tag>
    </template>
    <template
      slot="expand"
      slot-scope="props">
      <pre class="code">
        {{ props.row.stack }}
      </pre>
    </template>
  </avue-crud>
</template>

<script>
import { mapGetters } from 'vuex'
import option from '@/const/logs/index'
export default {
  name: 'ErrLogs',
  data() {
    return {
      option: option
    }
  },
  computed: {
    ...mapGetters(['logsList'])
  },
  created() {

  },
  mounted() { },
  
  methods: {
    send() {
      this.$confirm('确定上传本地日志到服务器?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('SendLogs').then(() => {
          this.$parent.$parent.box = false
          this.$message.success('发送成功!')
        })
      }).catch(() => {

      })
    },
    clear() {
      this.$confirm('确定清空本地日志记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('CLEAR_LOGS')
        this.$parent.$parent.box = false
        this.$message.success('清空成功!')
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.code {
  font-size: 12px;
  display: block;
  font-family: monospace;
  white-space: pre;
  margin: 1em 0px;
}
</style>
