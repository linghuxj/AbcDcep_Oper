<template>
  <div>
    <div class="nav-item">
      <el-input v-model="parameter.keyword" placeholder="请输入搜索内容关键字">
        <el-button slot="append" icon="el-icon-search" @click="getList"
          >搜索</el-button
        >
      </el-input>
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :data="tableData"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      style="width: 100%"
    >
      <el-table-column label="创客ID" prop="userId"> </el-table-column>
      <el-table-column label="创客信息" width="200">
        <template slot-scope="scope">
          <div>姓名：{{ scope.row.user ? scope.row.user.fullName : '--' }}</div>
          <div>
            联系方式：{{ scope.row.user ? scope.row.user.mobile : '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="绑定人信息" width="200">
        <template slot-scope="scope">
          <div>姓名：{{ scope.row.personName ? scope.row.personName : '--' }}</div>
          <div>
            联系方式：{{ scope.row.mobile ? scope.row.mobile : '--' }}
          </div>
          <div>身份证号：{{ scope.row.idCard ? scope.row.idCard : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="托管钱包归属方"
        prop="openBankName"
      ></el-table-column>
      <el-table-column label="托管钱包编号" prop="walletNo"></el-table-column>
      <!-- <el-table-column label="钱包状态" prop="status"></el-table-column> -->
      <el-table-column label="托管时间" prop="createTime"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import TablePagination from '@/components/table-pagination'
import { reqTaskWalletById } from '@/api/task/list'
export default {
  name: 'TaskDetailsFinance',
  components: { TablePagination },
  data() {
    return {
      tableData: [],
      //表示参数类
      parameter: {
        taskId: undefined,
        keyword: undefined
      },
      // 操作类型
      interactive: {
        tableLoading: false
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      }
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.parameter.taskId = id
      this.getList()
    })
  },
  methods: {
    getList() {
      this.tableLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      reqTaskWalletById(listQuery)
        .then(resp => {
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.pagination.pages = page.pages
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-item {
  float: right;
  width: 240px;
  margin-bottom: 10px;
}
</style>
