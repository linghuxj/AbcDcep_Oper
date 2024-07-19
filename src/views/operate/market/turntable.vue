<template>
  <div class="main-content">
    <el-form ref="searchForm" :inline="true" :model="parameter">
      <el-form-item label="活动名称：">
        <el-input v-model="parameter.lotteryName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="活动时间：" class="search-form-item">
        <el-date-picker
          v-model="datetime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="search-form-item">
        <el-button type="primary" icon="el-icon-search" @click="getSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <div v-if="permissions.lottery_add">
      <el-button type="primary" @click="handleAdd">新增幸运大抽奖</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column label="活动名称" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.lotteryName?scope.row.lotteryName:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动类型">
          <template slot-scope="scope">
            <span>{{ scope.row.lotteryTypeName?scope.row.lotteryTypeName:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="参与次数">
          <template slot-scope="scope">
            <span>
              {{ scope.row.partNumTypeName?scope.row.partNumTypeName:'--' }}
              {{ scope.row.partNum?scope.row.partNum:'0' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.statusName?scope.row.statusName:'--' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="抽奖次数" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.lotteryNum?scope.row.lotteryNum:0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="活动时间" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime?scope.row.startTime:'--' }}</span>
            <span style="text-align: center;width: 20px;">至</span>
            <span>{{ scope.row.endTime?scope.row.endTime:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <!-- <san>{{ scope.row.status }}</span> -->
            <el-button
              v-show="scope.row.status !== 'no_start'"
              type="text"
              size="mini"
              style="color:#409eff"
              @click="handleDetails(scope.row.lotteryId)">详情</el-button>
            <el-button 
              v-show="scope.row.status === 'no_start'"
              type="text"
              size="mini"
              style="color:#409eff"
              @click="handleUpdate(scope.row.lotteryId)">编辑</el-button>
            <!-- no_start 未开始  progress 进行中  over 已结束 -->
            <el-button 
              v-if="scope.row.status !== 'over' && permissions.lottery_over"
              type="text"
              size="mini"
              style="color:#409eff"
              @click="handleOver(scope.row.lotteryId)">结束</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        v-show="pagination.total>0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getSearch" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { getlotteryPage, overLottery } from '@/api/operate/lottery.js'

export default {
  components: { TablePagination },
  data() {
    return {
      tableData: [],
      datetime: [],
      //表示参数类
      parameter: {
        lotteryName: undefined,
        startTime: undefined,
        endTime: undefined
      },
      // 操作类型
      interactive: {
        activeName: 'first',
        tableLoading: false,
        dialogFormVisible: false,
        loading: false
      },
      
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      this.getSearch()
    })
    
  },
  methods: {
    // 查询列表
    getSearch() {
      const listQuery = Object.assign({}, this.parameter)
      if (this.datetime) {
        const [startTime, endTime] = this.datetime
        listQuery.startTime = startTime
        listQuery.endTime = endTime
      }
      listQuery.size = this.pagination.size
      listQuery.current = this.pagination.current
      this.interactive.tableLoading = true
      getlotteryPage(listQuery).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
      }).catch(e => {
        this.interactive.tableLoading = false
      })
    },
    // 新增
    handleAdd() {
      this.$router.push(`/operate/turn/establish`)
    },
    // 编辑
    handleUpdate(val) {
      this.$router.push(`/operate/turn/compile/${val}`)
    },
    // 查看
    handleDetails(val) {
      this.$router.push(`/operate/turn/details/${val}`)
    },
    // 结束
    handleOver(val) {
      this.$confirm('活动结束后，前端用户将不能参与该活动，是否确认结束？', '结束提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        overLottery(val).then(res => {
          console.debug('--')
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getSearch()
        }) 
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })          
      })
    },
    
    // 重置
    resetForm() {
      this.datetime = ''
      //表示参数类
      this.parameter = {
        activeName: undefined,
        startTime: undefined,
        endTime: undefined
      }
      // this.pagination = {
      //   total: 0,
      //   current: 1,
      //   size: 20
      // }
      this.getSearch()
    }
  }
}
</script>

<style scoped lang="scss">
.content-wrap {
  display: flex;
  height: 60px;
  line-height: 60px;
}
.search-form-item {
  margin-left: 20px;
}
</style>
