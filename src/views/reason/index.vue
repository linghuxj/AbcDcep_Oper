<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="paramter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="类型名称：">
        <el-input
          v-model="paramter.typeName"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="interactive.tableLoading"
      border
      :data="reasonList"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="typeName" label="类型"></el-table-column>
      <el-table-column label="原因数量" prop="reasonNum">
        <template slot="header">
          <span>原因数量</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="原因数量：当前正在展示的原因数。"
            placement="top-start"
          >
            <i class="iconfont icon-wenhao"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="to_detail(scope.row)">详情</el-button>
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
import { getReasonTypeAll } from '@/api/reason'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      interactive: {
        dialogVisible: false,
        relationAccountDialogVisible: false,
        tableLoading: false
      },
      paramter: {
        typeName: undefined
      },
      reasonList: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
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
    // 获取列表
    getList() {
      const data = {
        typeName: this.paramter.typeName,
        size: this.pagination.size,
        current: this.pagination.current
      }
      getReasonTypeAll(data).then(res => {
        this.reasonList = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    //去详情页面
    to_detail(item) {
      this.$router.push(
        '/reason/detail?type=' + item.typeEnum + '&typeName=' + item.typeName
      )
    },
    //搜索
    search() {
      this.getList()
    },
    //重置
    reset() {
      this.paramter.typeName = undefined
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      this.getList()
    }
  }
}
</script>
<style scoped>
.iconfont :hover {
  color: #fff;
}
</style>
