<template>
  <div class="main-content">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="活动名称：">
        <el-input
          v-model="parameter.actName"
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="parameter.status" placeholder="请输入品牌名称">
          <el-option
            v-for="(item, index) in brandAll"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="活动时间：">
        <el-date-picker
          v-model="datetime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="getSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </div>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.new_user_active_add"
        type="primary"
        @click="handleAdd"
        >新增新人礼</el-button
      >
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="活动名称">
        <template slot-scope="scope">
          <span>{{ scope.row.actName ? scope.row.actName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动图片" width="100">
        <template slot-scope="scope">
          <div class="content-wrap">
            <el-image
              style="width: 80px; height: 60px"
              :src="scope.row.image"
              fit="contain"
              :preview-src-list="[scope.row.image]"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type ? scope.row.type : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖励内容">
        <template slot-scope="scope">
          <span>{{ scope.row.amount ? scope.row.amount : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag>{{
            scope.row.statusName ? scope.row.statusName : '--'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已领取数（份）" width="120">
        <template slot-scope="scope">
          <span>{{
            scope.row.receivedCount ? scope.row.receivedCount : 0
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="活动时间" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime ? scope.row.startTime : '--' }}</span>
          <span style="text-align: center; width: 20px">至</span>
          <span>{{ scope.row.endTime ? scope.row.endTime : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status !== 'not_started'"
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleDetails(scope.row.id)"
            >详情</el-button
          >
          <el-button
            v-if="
              scope.row.status === 'not_started' &&
              permissions.new_user_active_edit
            "
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleUpdate(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            v-if="
              scope.row.status !== 'finish' && permissions.new_user_active_status
            "
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleOver(scope.row.id)"
            >结束</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      v-show="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getSearch"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import {
  reqDistMarketPage,
  reqDistMarketType,
  overDistMarket
} from '@/api/operate/market'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableData: [],
      brandAll: [],
      datetime: [],
      //表示参数类
      parameter: {
        actName: undefined,
        status: undefined
      },
      // 操作类型
      interactive: {
        actName: 'first',
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
    this.querySearchType()
    this.$nextTick(() => {
      this.getSearch()
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
    // 状态
    querySearchType() {
      reqDistMarketType()
        .then(res => {
          const users = res.data.data
          this.brandAll = users
        })
        .catch(() => {
          this.brandAll = []
        })
    },

    // 查询列表
    getSearch() {
      const [startTime, endTime] = this.datetime
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      this.interactive.tableLoading = true
      listQuery.startTime = startTime
      listQuery.endTime = endTime

      reqDistMarketPage(listQuery)
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
    // 新增
    handleAdd() {
      this.$router.push(`/operate/gift/establish`)
    },
    // 编辑
    handleUpdate(val) {
      this.$router.push(`/operate/gift/compile/${val}`)
    },
    // 查看
    handleDetails(val) {
      this.$router.push(`/operate/gift/details/${val}`)
    },
    // 结束
    handleOver(val) {
      this.$confirm(
        '活动结束后，前端用户将不能参与该活动，是否确认结束？',
        '结束提示',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }
      )
        .then(() => {
          overDistMarket(val).then(() => {
            this.$message({
              type: 'success',
              message: '新人礼活动已结束!'
            })
            this.getSearch()
          })
        })
        .catch(() => {
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
        actName: undefined,
        status: undefined
      }
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
</style>
