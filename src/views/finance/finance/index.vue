/**
* 用户财务信息
*/

<template>
  <div class="main-content">
    <el-form :inline="true" :model="search">
      <el-form-item label="用户搜索">
        <el-select
          v-model="search.searchType"
          placeholder="请选择"
          style="width: 30%"
        >
          <el-option label="姓名" value="fullName"></el-option>
          <el-option label="手机号" value="mobile"></el-option>
        </el-select>
        <el-input
          v-model="search.searchValue"
          placeholder="请输入内容"
          style="width: 70%"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    
    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index+(pagination.current - 1) * pagination.size + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户信息">
          <template slot-scope="scope">
            <div>{{ numFilter(scope.row.user) }}</div>
            <div>{{ numMobile(scope.row.user) }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="totalBalance" label="账户余额（元）" />
        <el-table-column prop="inWithdrawAmount" label="提现中（元）" />
        <el-table-column prop="totalWithdrawAmount" label="提现成功（元）" />
        <el-table-column prop="recordAmount" label="待入账金额（元）" />
        <el-table-column prop="earnestMoneyAmount" label="当前缴纳保证金（元）" />
        <el-table-column prop="brokerageChargeAmount" label="累计获取佣金（元）" />
        <!-- <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handle(scope.row.userId)">详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <table-pagination
        v-show="pagination.total>0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList" />
    </div>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { getUserWalletPage } from '@/api/finance/withdraw'


export default {
  name: 'Finance',
  components: { TablePagination },
  data() {
    return {
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
  methods: {
    // 查询列表
    getList() {
      const parameter = Object.assign({}, this.pagination)
      if (this.search.searchType) {
        parameter[this.search.searchType] = this.search.searchValue
      }
      this.interactive.tableLoading = true
      getUserWalletPage(parameter).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
      }).catch(e => {
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
    },

    // 详情
    handle(val) {

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
