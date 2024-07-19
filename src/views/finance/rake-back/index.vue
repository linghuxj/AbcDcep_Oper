/** * 返佣记录 */
<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="创客搜索：">
        <el-input
          v-model="search.searchValue"
          placeholder="请输入内容"
          style="width: 100%"
          class="input-with-select"
        >
          <el-select
            v-model="search.searchType"
            placeholder="请选择"
            slot="prepend"
          >
            <el-option label="姓名" value="fullName"></el-option>
            <el-option label="手机号" value="mobile"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <div>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-form>

    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="创客信息">
        <template slot-scope="scope">
          <div>{{ numFilter(scope.row.user) }}</div>
          <div>{{ numMobile(scope.row.user) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="totalCommissionAmount" label="总推荐奖励（元）" />
      <el-table-column prop="levelCommissionAmount" label="直推奖励（元）" />
      <el-table-column prop="indirectCommissionAmount" label="间推奖励（元）" />
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
import { getWalletCommissionPage } from '@/api/finance/withdraw'

export default {
  name: 'RakeBack',
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      //表示参数类
      search: {
        searchType: undefined,
        searchValue: undefined
      },
      tableData: [],
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
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
    })
  },
  methods: {
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.countHeight()
      }
    },
    // 计算表格高度
    countHeight() {
      // 监听视口宽度变化
      let demoForm = document.getElementById('demo-form-inline')
      let tableBtn = document.getElementById('tableBtn')
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`
    },
    // 查询列表
    getList() {
      const parameter = Object.assign({}, this.pagination)
      if (this.search.searchType) {
        parameter[this.search.searchType] = this.search.searchValue
      }
      this.interactive.tableLoading = true
      getWalletCommissionPage(parameter)
        .then(resp => {
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.interactive.tableLoading = false
        })
        .catch(() => {
          this.interactive.tableLoading = false
        })
    },

    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined
      }
      this.getList()
    },

    // 数据处理
    numFilter(val) {
      if (!val) {
        return '--'
      }

      if (val.fullName) {
        return val.fullName
      }

      return '--'
    },
    numMobile(val) {
      if (!val) {
        return '--'
      }

      if (val.mobile) {
        return val.mobile
      } else {
        return '--'
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
