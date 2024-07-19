<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="订单编号：">
        <el-input
          v-model="parameter.orderNo"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="支付时间：">
        <el-date-picker
          v-model="parameter.time"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <div>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getList('search')"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>

    <el-table
      v-loading="interactive.tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
      >
        <template slot-scope="scope">
          <span v-if="item.level == 2">
            {{ scope.row[item.value[0]][item.value[1]] }}
          </span>
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
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
import { getExpenditurePage } from '@/api/order/card'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表格列配置
      tableArr: [
        {
          label: '订单编号',
          value: 'orderNo'
        },
        {
          label: '店铺名称',
          value: ['store', 'storeName'],
          level: 2
        },
        {
          label: '消费金额（元）',
          value: 'orderAmount'
        },
        {
          label: '买单优惠',
          value: 'consumeActivityAmount'
        },
        {
          label: '不参与优惠金额',
          value: 'notPartConsumeAmount'
        },
        {
          label: '活动优惠（元）',
          value: 'discountActivityAmount'
        },
        {
          label: '优惠券优惠（元）',
          value: 'couponAmount'
        },
        {
          label: '实付金额（元）',
          value: 'payAmount'
        },
        {
          label: '支付方式',
          value: 'payModeName'
        },
        {
          label: '支付时间',
          value: 'payTime'
        }
      ],
      search: {
        searchType: undefined,
        searchValue: undefined
      },
      // 表格数据
      tableData: [],
      //表示参数类
      parameter: {
        orderNo: undefined,
        time: undefined
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
    this.$nextTick(() => {
      this.getList()
    })
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
    getList(type) {
      this.interactive.tableLoading = true
      if (type === 'search') {
        this.pagination.current = 1
      }
      // 处理时间
      if (this.parameter.time && this.parameter.time.length > 0) {
        this.parameter.payStartTime = this.parameter.time[0]
        this.parameter.payEndTime = this.parameter.time[1]
      }
      // 拼接请求参数
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      getExpenditurePage(listQuery).then(response => {
        this.tableData = response.data.data.records
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.interactive.tableLoading = false
        }, 0.1 * 1000)
      })
    },
    // 重置
    reset() {
      //表示参数类
      this.parameter = {
        orderNo: undefined,
        time: undefined
      }
      this.getList('search')
    }
  }
}
</script>
<style scoped>
.center_deliverGoods {
  margin-top: 10px;
}
</style>
