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
          v-model="search.orderNo"
          placeholder="请输入订单编号"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="退款状态：">
        <el-select v-model="search.status">
          <el-option v-for="(item,index) in auditStatusArr" :key="index" :label="item.dictName" :value="item.dictValue"></el-option>
        </el-select>
      </el-form-item> -->
      <div>
        <el-button type="primary" icon="el-icon-search" @click="to_search()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="to_reset()">重置</el-button>
      </div>
    </el-form>
    <el-tabs v-model="search.auditStatus" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="待处理" name="audit"></el-tab-pane>
      <el-tab-pane label="已同意" name="normal"></el-tab-pane>
      <el-tab-pane label="已拒绝" name="failed"></el-tab-pane>
    </el-tabs>
    <el-table
      v-loading="interactive.tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column label="原订单编号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo ? scope.row.orderNo : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="refundNo" label="退款单号"></el-table-column>
      <el-table-column prop="name" label="买家信息">
        <template slot-scope="scope">
          <div>
            {{ scope.row.user.username ? scope.row.user.username : '--' }}
          </div>
          <div>
            {{ scope.row.user.mobile ? scope.row.user.mobile : '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="退款信息">
        <template slot-scope="scope">
          <div>
            金额：{{ scope.row.refundAmount ? scope.row.refundAmount : '--' }}
          </div>
          <div>
            米粒：{{
              scope.row.refundIntegral ? scope.row.refundIntegral : '--'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusName" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.statusName ? scope.row.statusName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="outRefundNo" label="交易流水">
        <template slot-scope="scope">
          <span>{{
            scope.row.outRefundNo ? scope.row.outRefundNo : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="申请退款时间"
        width="150"
      ></el-table-column>
      <el-table-column prop="name" label="审核时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.auditTime ? scope.row.auditTime : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.auditStatus === 'audit' && permissions.refund_audit"
            type="text"
            @click="toExamine(scope.row)"
            >审核</el-button
          >
          <el-button type="text" @click="toUserAddressDetail(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { getRefundList } from '@/api/refund/index'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      interactive: {
        tableLoading: false
      },
      tableData: [],
      // auditStatusArr: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      search: {
        orderNo: undefined,
        status: undefined,
        auditStatus: 'all' //audit 待处理normal 已同意failed 已拒绝
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getRefundList()
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
    getList() {
      this.getRefundList()
    },
    // 去审核
    toExamine(row) {
      this.$router.push('/refund/examine?refundId=' + row.refundId)
    },
    // 去详情
    toUserAddressDetail(row) {
      this.$router.push('/refund/detail?refundId=' + row.refundId)
    },
    // 查询列表
    getRefundList() {
      let auditStatus = this.search.auditStatus
      auditStatus === 'all' ? (auditStatus = undefined) : auditStatus
      const data = {
        size: this.pagination.size,
        current: this.pagination.current,
        orderNo: this.search.orderNo,
        auditStatus: auditStatus
      }
      this.interactive.tableLoading = true
      getRefundList(data).then(res => {
        this.interactive.tableLoading = false
        const page = res.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.pagination.pages = page.pages
      })
    },
    // 查询审核状态
    // getAuditStatusList() {
    //   getAuditStatusList().then(res => {
    //     this.auditStatusArr = res.data.data
    //   })
    // },
    // 去搜索
    to_search() {
      this.getRefundList()
    },
    // 去重置
    to_reset() {
      this.search = {
        transactionId: undefined,
        status: undefined,
        auditStatus: 'all'
      }
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      this.getRefundList()
    },
    // tab切换
    handleClick() {
      this.getRefundList()
    }
  }
}
</script>
<style scoped></style>
