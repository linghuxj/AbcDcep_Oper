<template>
  <el-dialog
    title="关联店铺"
    :visible.sync="visible"
  >
    <div class="table-search">
      <el-button type="primary" @click="onAssocStore">确定关联</el-button>
      <el-input v-model="search.keyword" placeholder="请输入内容" style="width:300px;">
        <el-button slot="append" @click="getList">搜索</el-button>
      </el-input>
    </div>
  </el-dialog>
</template>

<script>
import { reqReceiveGiftPage } from '@/api/gift/gift'
export default {
  name: 'AssocCircleTable',
  data() {
    return {
      // 是否显示弹出层
      visible: false,
      tableData: [],
      //表示参数类
      search: {
        keyword: undefined
      }
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    // 查询列表
    getList() {
      const listQuery = Object.assign({}, this.search)
      reqReceiveGiftPage(listQuery).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
      }).catch(e => {
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-search {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
</style>
