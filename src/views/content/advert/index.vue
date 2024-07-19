<template>
  <div class="main-content advert">
    <el-form :inline="true" :model="parameter" id="demo-form-inline"
      class="demo-form-inline">
      <el-form-item label="广告位：">
        <el-input v-model="parameter.keyword" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="search-form-item">
        <el-button type="primary" icon="el-icon-search" @click="getSearch()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="tableBtn">
      <el-button v-if="permissions.advert_add" type="primary" @click="handleAdd()">新增广告</el-button>
    </div>
    <el-tabs v-model="parameter.status" @tab-click="handleClick">
      <el-tab-pane :label="'已上架'+'('+normalCount+')'" name="normal"></el-tab-pane>
      <el-tab-pane :label="'已下架'+'('+disabledCount+')'" name="disabled"></el-tab-pane>
    </el-tabs>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column prop="name" label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="广告位"></el-table-column>
      <el-table-column prop="curCount" label="当前广告数"></el-table-column>
      <el-table-column v-if="parameter.status==='normal'" label="上架时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="parameter.status==='disabled'" label="下架时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-show="scope.row.status==='normal' && permissions.advert_position_disabled" type="text" size="mini" @click="to_down(scope.row)">下架</el-button>
          <el-button v-show="scope.row.status==='disabled' && permissions.advert_position_normal" type="text" size="mini" @click="to_up(scope.row)">上架</el-button>
          <el-button type="text" size="mini" @click="to_detail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getSearch" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { getAdvertPosition, disabledAdvertPosition, normalAdvertPosition, getAdvertPositionCount } from '@/api/content/advert'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      interactive: {
        tableLoading: false
      },
      tableData: [
        { name: '创客Plus首页banner' }
      ],
      parameter: {
        keyword: undefined,
        status: 'normal'
      },
      normalCount: 0,
      disabledCount: 0,
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
    this.getAdvertPosition()
    this.getAdvertPositionNormalCount()
    this.getAdvertPositionDisabledCount()
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
        tabs+
        190
      }px)`
    },
    getSearch() {
      this.getAdvertPosition()
    },
    // 查询广告位置列表
    getAdvertPosition() {
      const data = {
        current: this.pagination.current,
        size: this.pagination.size,
        keyword: this.parameter.keyword,
        status: this.parameter.status
      }
      getAdvertPosition(data).then(res => {
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.current = res.data.data.current
        this.pagination.size = res.data.data.size
      })
    },
    // 获取广告位置上架下架数量
    getAdvertPositionNormalCount() {
      getAdvertPositionCount('normal').then(res => {
        this.normalCount = res.data.data
      })
    },
    // 获取广告位置下架数量
    getAdvertPositionDisabledCount() {
      // 上架:normal、下架:disabled
      getAdvertPositionCount('disabled').then(res => {
        this.disabledCount = res.data.data
      })
    },
    // 去上架
    to_up(val) {
      this.$confirm('上架后，“' + val.positionName + '”广告位将能在前端展示，是否要上架？', '上架提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        normalAdvertPosition(val.positionId).then(() => {
          this.$message({
            type: 'success',
            message: '确定上架成功!'
          })
          this.getAdvertPosition()
          this.getAdvertPositionNormalCount()
          this.getAdvertPositionDisabledCount()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架'
        })          
      })
    },
    // 去下架
    to_down(val) {
      this.$confirm('下架后，“' + val.positionName + '”广告将不在前端展示，是否要下架？', '下架提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        disabledAdvertPosition(val.positionId).then(() => {
          this.$message({
            type: 'success',
            message: '确定下架成功!'
          })
          this.getAdvertPosition()
          this.getAdvertPositionNormalCount()
          this.getAdvertPositionDisabledCount()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        })          
      })
    },
    // 去详情
    to_detail(val) {
      this.$router.push(`/advert/detail?positionId=${val.id}&position=${val.position}&status=${val.status}&positionName=${val.name}`)
    },
    // tab标签切换
    handleClick() {
      this.getAdvertPosition()
    },
    //新增广告 
    handleAdd() {
      this.$router.push('/advert/establish')
    },
    // 重置
    resetForm() {
      this.parameter = {
        value: undefined,
        status: 'normal'
      }
      this.getAdvertPosition()
    }
  }
}
</script>
<style scoped>

</style>
