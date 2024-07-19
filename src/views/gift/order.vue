<template>
  <div class="main-content">
    <el-form :inline="true" :model="search">
      <el-form-item label="收货人搜索">
        <el-select
          v-model="search.searchType"
          placeholder="请选择"
          style="width: 30%"
        >
          <el-option label="姓名" value="fullName"></el-option>
          <el-option label="手机号" value="mobile"></el-option>
          <el-option label="收货地址" value="address"></el-option>
        </el-select>
        <el-input
          v-model="search.searchValue"
          placeholder="请输入内容"
          style="width: 70%"
        ></el-input>
      </el-form-item>
      <el-form-item label="导出状态">
        <el-select v-model="search.exportFlag" placeholder="请选择">
          <el-option label="已导出" value="1"></el-option>
          <el-option label="未导出" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="领取时间">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div v-if="permissions.receive_gift_export">
      <el-button type="primary" @click="exportReport">导出报表</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select-all="selectDeptAll"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="用户ID" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.user? scope.row.user.userId:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" width="200">
          <template slot-scope="scope">
            <div class="user-wrap">
              <img
                class="avatar"
                :src="scope.row.user ? scope.row.user.avatar : './img/avatar.png'"
              />
              <div class="user-base">
                <div class="oneline">{{ scope.row.user.username?scope.row.user.username:'--' }}</div>
                <div class="oneline">{{ scope.row.user.mobile?scope.row.user.mobile:'--' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fullName" label="收货人姓名" width="120" />
        <el-table-column prop="mobile" label="收货人手机号" width="130" />
        <el-table-column prop="address" label="收货地址" />
        <el-table-column label="领取状态" width="100">
          <template slot-scope="scope">
            <span>
              <el-tag v-if="scope.row.exportFlag ===true" type="success">已导出</el-tag>
              <el-tag v-else type="warning">未导出</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="领取时间" width="160" />
        <el-table-column prop="exportTime" label="导出时间" width="160" />
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
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { reqReceiveGiftPage, reqReceiveGiftExport } from '@/api/gift/gift'

// import { urlEncode } from '@/util/request'

export default {
  name: 'GiftOrder',
  components: { TablePagination },
  data() {
    return {
      //表示参数类
      search: {
        searchType: undefined,
        searchValue: undefined,
        date: [],
        exportFlag: undefined
      },
      tableData: [],
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogFormVisible: false
      },
      // 导出数据列表
      exportList: [],
      
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
    this.getList()
  },
  methods: {
    // 查询列表
    getList() {
      const [startCreateTime, endCreateTime] = this.search.date
      const parameter = {
        startCreateTime,
        endCreateTime,
        exportFlag: this.search.exportFlag
      }
      if (this.search.searchType) {
        parameter[this.search.searchType] = this.search.searchValue
      }
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, parameter, this.pagination)
      reqReceiveGiftPage(listQuery).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
      }).catch(e => {
        this.interactive.tableLoading = false
      })
    },
    // 导出报表
    exportReport() {
      if (this.exportList.length > 0) {
        this.$confirm(
          '确认将勾选的收货人信息导出？',
          '导出报表',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          const [startCreateTime, endCreateTime] = this.search.date
          const parameter = {
            startCreateTime,
            endCreateTime,
            exportFlag: this.search.exportFlag,
            ids: this.exportList
          }
          if (this.search.searchType) {
            parameter[this.search.searchType] = this.search.searchValue
          }
          const listQuery = Object.assign({}, parameter)
          reqReceiveGiftExport(listQuery).then(resp => {
            this.downloadExcel(resp, '礼物订单记录表.xls')
          }).catch(e => {
            this.interactive.tableLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      } else {
        // this.$message({
        //   type: 'info',
        //   message: '请勾选需要项'
        // })
        this.$confirm(
          '确认将所有收货人信息导出？',
          '导出报表',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          const [startCreateTime, endCreateTime] = this.search.date
          const parameter = {
            startCreateTime,
            endCreateTime,
            exportFlag: this.search.exportFlag,
            ids: this.exportList
          }
          if (this.search.searchType) {
            parameter[this.search.searchType] = this.search.searchValue
          }
          const listQuery = Object.assign({}, parameter)
          reqReceiveGiftExport(listQuery).then(resp => {
            this.downloadExcel(resp, '礼物订单记录表.xls')
          }).catch(e => {
            this.interactive.tableLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    },
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
        storeType: undefined,
        address: undefined,
        date: []
      }
      this.getList()
    },
    // 多选功能
    handleSelectionChange(val) {
      this.exportList = []
      this.deptSelectItem(val)
    },
    /**
     * 全选
     */
    selectDeptAll(val) {
      this.exportList = []
      this.deptSelectItem(val)
    },
    // 处理数据id
    deptSelectItem(data) {

      const arr = data.map((item, index, arr) => {
        return item.id
      })

      this.exportList = arr.sort()
    },
    downloadExcel(res, fileName = '未命名.xls') {
      // debugger
      const a = document.createElement('a')
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      a.setAttribute('href', url)
      a.setAttribute('download', fileName)
      a.click()
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  .user-wrap {
    display: flex;
    justify-content: space-around;
    text-align: center;
    .avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
    .user-base {
      width: 130px;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  }
}
</style>
