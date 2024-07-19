<template>
  <div class="main-content">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
    >
      <el-form-item label="活动名称：">
        <el-input
          v-model="parameter.actName"
          placeholder="请输入活动名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动状态：">
        <el-select v-model="parameter.status">
          <el-option
            v-for="(status, index) in statusArr"
            :key="index"
            :label="status.dictName"
            :value="status.dictValue"
          ></el-option>
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
        <el-button type="primary" icon="el-icon-search" @click="getSearch()"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </div>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.discount_add"
        type="primary"
        @click="handleAdd()"
        >新增活动</el-button
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
      <el-table-column
        label="活动ID"
        prop="id"
        width="75"
      ></el-table-column>
      <el-table-column label="活动名称">
        <template slot-scope="scope">
          <span>{{ scope.row.actName ? scope.row.actName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用平台" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.platform ? scope.row.platform : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" width="160">
        <template slot-scope="scope">
          <span>
            {{ scope.row.statusName ? scope.row.statusName : '--' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="活动时间" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime ? scope.row.startTime : '--' }}</span>
          <span style="text-align: center; width: 20px">至</span>
          <span>{{ scope.row.endTime ? scope.row.endTime : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动类型" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.discountTypeName ? scope.row.discountTypeName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="
              scope.row.status !== 'finish' &&
              permissions.discount_status
            "
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleOver(scope.row.id)"
            >关闭</el-button
          >
          <el-button
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleDetails(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-show="
              scope.row.status === 'not_started' &&
              permissions.discount_edit
            "
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleUpdate(scope.row.id)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
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
  getDiscountActivityPage,
  getDiscountActivityState,
  finishActivityById
} from '@/api/operate/discount'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableData: [],
      datetime: [],
      //表示参数类
      parameter: {
        actName: undefined,
        startBeginTime: undefined,
        startEndTime: undefined,
        status: undefined
      },
      // 操作类型
      interactive: {
        activeName: 'first',
        tableLoading: false,
        dialogFormVisible: false,
        loading: false
      },
      statusArr: [],
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
      this.getState()
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
    // 获取活动状态列表
    getState() {
      getDiscountActivityState().then(res => {
        this.statusArr = res.data.data
      })
    },
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
      listQuery.status = this.parameter.status
      this.interactive.tableLoading = true
      getDiscountActivityPage(listQuery)
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
      this.$router.push(`/operate/discount/establish`)
    },
    // 编辑
    handleUpdate(val) {
      this.$router.push(`/operate/discount/compile/${val}`)
    },
    // 查看
    handleDetails(val) {
      this.$router.push(`/operate/discount/detail/${val}`)
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
          finishActivityById(val)
            .then(() => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getSearch()
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: e
              })
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
        startBeginTime: undefined,
        startEndTime: undefined
      }
      this.pagination = {
        total: 0,
        current: 1,
        size: 20
      }
      this.getSearch()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
