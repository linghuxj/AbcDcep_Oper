<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="姓名：">
        <el-input v-model="search.fullName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input
          v-model="search.mobile"
          placeholder="请输入手机号"
          maxlength="11"
        ></el-input>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="to_search"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="to_reset">重置</el-button>
      </div>
    </el-form>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column prop="storeId" label="用户信息">
        <template slot-scope="scope">
          <div>
            {{ scope.row.user.fullName ? scope.row.user.fullName : '--' }}
          </div>
          <div>
            {{ scope.row.user.mobile ? scope.row.user.mobile : '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="addressCount" label="收货地址数"></el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="text" @click="to_UserAddressDetail(scope.row.user)"
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
import TablePagination from '@/components/table-pagination'
import { getAddressUserPages } from '@/api/address/user'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableLoading: false,
      tableData: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      search: {
        fullName: undefined,
        mobile: undefined
      }
    }
  },
  created() {
    this.getAddressUserList()
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
    getList() {
      this.getAddressUserList()
    },
    //用户地址列表
    getAddressUserList() {
      const data = {
        current: this.pagination.current,
        size: this.pagination.size,
        fullName: this.search.fullName,
        mobile: this.search.mobile
      }
      this.tableLoading = true
      getAddressUserPages(data).then(res => {
        this.tableLoading = false
        const page = res.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.pagination.pages = page.pages
      })
    },
    to_UserAddressDetail(user) {
      this.$router.push({
        path: '/address/user/detail',
        query: {
          userId: user.userId,
          fullName: user.fullName,
          mobile: user.mobile
        }
      })
    },
    // 去搜索
    to_search() {
      this.getAddressUserList()
    },
    // 去重置
    to_reset() {
      this.search = {
        fullName: undefined,
        mobile: undefined
      }
      this.getAddressUserList()
    }
  }
}
</script>
<style scoped>
.userMes {
  display: flex;
  flex-direction: column;
}
</style>
