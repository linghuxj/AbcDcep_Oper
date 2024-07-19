<template>
  <div class="main-content">
    <el-form
      ref="rbForm"
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="创客搜索：">
        <el-input
          v-model="parameter.value"
          placeholder="请输入内容"
          style="width: 100%"
        >
          <el-select
            slot="prepend"
            v-model="parameter.select"
            placeholder="请选择"
          >
            <el-option label="创客姓名" value="fullName"></el-option>
            <el-option label="创客手机号" value="mobile"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="收支类型：">
        <el-select v-model="parameter.type" placeholder="请选择">
          <el-option label="收入" value="income"></el-option>
          <el-option label="支出" value="expenditure"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间：">
        <el-date-picker
          v-model="parameter.datetime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="on_search"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </div>
    </el-form>
    <el-tabs v-model="parameter.billType" @tab-click="tabview">
      <template v-for="(item, index) in billTypeList">
        <el-tab-pane
          v-if="item.dictValue != 'disabled'"
          :key="index"
          :label="item.name"
          :name="item.value"
        >
        </el-tab-pane>
      </template>
    </el-tabs>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="list"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{
            scope.$index + (pagination.current - 1) * pagination.size + 1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户信息">
        <template slot-scope="scope">
          <div>{{ scope.row.user ? scope.row.user.fullName : '--' }}</div>
          <div>{{ scope.row.user ? scope.row.user.mobile : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账单类型" width="200">
        <template slot-scope="scope">
          <span>{{
            scope.row.billTypeName ? scope.row.billTypeName : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出处">
        <template slot-scope="scope">
          <span>{{ scope.row.source ? scope.row.source : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收支类型" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName ? scope.row.typeName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额（元）" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.amount ? scope.row.amount : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易单号">
        <template slot-scope="scope">
          <span>{{ scope.row.relationId ? scope.row.relationId : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime ? scope.row.createTime : '--' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="margin-top: 10px">
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { getAccountPage } from '@/api/finance/revenue-branch'
import TablePagination from '@/components/table-pagination'

export default {
  name: 'RevenueBranch',
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      parameter: {
        billType: 'all',
        endTime: undefined,
        fullName: undefined,
        mobile: undefined,
        startTime: undefined,
        value: undefined,
        select: undefined,
        datetime: [],
        type: undefined
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      // 列表数据
      list: [],

      // 类型
      billTypeList: [
        { value: 'all', name: '全部' },
        { value: 'task_revenue_expenditure', name: '任务收支明细' },
        { value: 'consume_revenue_expenditure', name: '消费收支明细' },
        { value: 'bond_revenue_expenditure', name: '保证金收支明细' }
      ],
      interactive: {
        tableLoading: false
      }
    }
  },
  created() {
    this.initPageRB()
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
      let tabs = 55
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        190
      }px)`
    },
    // 搜索
    on_search() {
      this.initPageRB()
    },
    // 重置
    resetForm() {
      // 表格高度
      this.tableHeight = 'calc(100vh - 335px)'
      this.parameter = {
        billType: this.parameter.billType,
        endTime: undefined,
        fullName: undefined,
        mobile: undefined,
        startTime: undefined,
        value: undefined,
        select: undefined,
        datetime: []
      }
      this.initPageRB()
      setTimeout(() => {
        this.countHeight()
      }, 500)
    },

    // tab切换
    tabview() {
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      this.list = []
      this.initPageRB()
    },

    // 分页查询
    initPageRB() {
      const [startTime, endTime] = this.parameter.datetime
      const params = {
        billType:
          this.parameter.billType === 'all'
            ? undefined
            : this.parameter.billType,
        startTime: startTime,
        endTime: endTime,
        size: this.pagination.size,
        current: this.pagination.current,
        type: this.parameter.type
      }

      if (this.parameter.value) {
        params[this.parameter.select] = this.parameter.value
      }
      this.interactive.tableLoading = true
      getAccountPage(params)
        .then(res => {
          this.list = res.data.data.records
          this.pagination.total = res.data.data.total
          this.pagination.pages = res.data.data.pages
          this.interactive.tableLoading = false
        })
        .catch(() => {
          this.interactive.tableLoading = false
        })
    },

    // 分页
    getList() {
      this.initPageRB()
    }
  }
}
</script>

<style lang="scss" scoped></style>
