<template>
  <div class="storeDetail-content">
    <div class="main-top">
      <h2>{{ storeMes.actName ? storeMes.actName : '--' }}</h2>
      <div class="main-top-item">
        <div class="item">类型：{{ storeMes.type ? storeMes.type : '--' }}</div>
        <div class="item">
          优惠内容：赠
          {{ storeMes.amount ? storeMes.amount : '--' }}
          {{ storeMes.type == '米粒奖励' ? '米粒' : '元' }}
        </div>
        <div class="item">
          活动时间：{{ storeMes.startTime ? storeMes.startTime : '--' }} 至
          {{ storeMes.endTime ? storeMes.endTime : '--' }}
        </div>
      </div>
      <div class="status">
        <wel-tag :type="type">{{ handleStatus(storeMes.status) }}</wel-tag>
      </div>
    </div>
    <div class="main-bottom">
      <el-tabs>
        <el-tab-pane label="已领用户">
          <div class="store-search">
            <el-input
              v-model="parameter.keyword"
              placeholder="请输入搜索内容关键字"
            >
              <el-button slot="append" type="primary" @click="getSearch"
                >搜索</el-button
              >
            </el-input>
          </div>
          <el-table
            v-loading="interactive.tableLoading"
            :empty-text="$t('message.table_empty_text')"
            :data="tableData"
            border
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            style="width: 100%"
          >
            <el-table-column label="序号" align="center" width="50">
              <template slot-scope="scope">
                <span>{{
                  scope.$index + (pagination.current - 1) * pagination.size + 1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户ID" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.userId ? scope.row.userId : '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column label="手机号" align="center">
              <template slot-scope="scope">
                <span>{{
                  scope.row.user.mobile ? scope.row.user.mobile : '--'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="领取时间" align="center">
              <template slot-scope="scope">
                <span>{{
                  scope.row.createTime ? scope.row.createTime : '--'
                }}</span>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  reqDistMarketDetailById,
  reqDistMarketDetailPage
} from '@/api/operate/market'
import WelTag from '@/template/Wel-Tag/index.vue'
import TablePagination from '@/components/table-pagination'

export default {
  name: 'GiftDetails',
  components: { WelTag, TablePagination },
  data() {
    return {
      storeMes: {},
      // 右侧状态图形显示状态
      type: '',
      tableData: [],
      //表示参数类
      parameter: {
        keyword: undefined
      },
      parame: {
        id: undefined
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
    this.parame.id = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.findStore()
      this.getSearch()
    })
  },
  methods: {
    // 获取店铺详情
    findStore() {
      reqDistMarketDetailById(this.parame.id).then(res => {
        this.storeMes = res.data.data
      })
    },
    getSearch() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign(
        {},
        this.parameter,
        this.pagination,
        this.parame
      )
      reqDistMarketDetailPage(listQuery)
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
    // 编辑
    to_edit(row) {
      this.$router.push(`/business/store/compile/${row}`)
    },
    handleStatus(val) {
      if (val === 'progress') {
        this.type = 'primary'
        return '进行中'
      }

      if (val === 'no_start') {
        this.type = 'info'
        return '未开始'
      }

      this.type = ''
      return '已结束'
    }
  }
}
</script>
<style lang="scss" scoped>
.storeDetail-content {
  margin: 10px 20px;
  font-size: 14px;
}
.main-top {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 20px 30px;
  position: relative;
}
.main-top-item {
  display: flex;
  align-items: center;
  .item {
    flex: 2;
  }
}

.main-bottom {
  background-color: #fff;
  padding: 20px 30px;
}
.status {
  position: absolute;
  right: 35px;
  top: 15px;
}
.store-search {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
.el-input-group {
  width: 260px;
}
</style>
