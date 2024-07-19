/** * 保证金 */
<template>
  <div class="main-content">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="保证金状态">
        <span class="el-form-item-span">：</span>
        <el-select v-model="parameter.status">
          <el-option
            v-for="(item, index) in taskSuretyList"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="getList"
          >搜索</el-button
        >
      </div>
    </el-form>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column prop="userId" label="创客ID" />
      <el-table-column label="创客信息" width="300">
        <template slot-scope="scope">
          <div class="user-wrap">
            <el-image
              class="avatar"
              :src="scope.row.user ? scope.row.user.avatar : './img/avatar.png'"
              width="45px"
              height="45px"
            />
            <div class="user-base">
              <div class="oneline">
                昵称：{{
                  scope.row.user
                    ? scope.row.user.username
                      ? scope.row.user.username
                      : '--'
                    : '--'
                }}
              </div>
              <div class="oneline">
                姓名：{{
                  scope.row.user
                    ? scope.row.user.fullName
                      ? scope.row.user.fullName
                      : '--'
                    : '--'
                }}
              </div>
              <div class="oneline">
                手机号：{{
                  scope.row.user
                    ? scope.row.user.mobile
                      ? scope.row.user.mobile
                      : '--'
                    : '--'
                }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusName" label="保证金状态" />
      <el-table-column prop="suretyAmount" label="金额（元）" />

      <el-table-column prop="createTime" label="交易时间" />
      <el-table-column label="说明" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row ? '--' : '--' }}</span>
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
import { reqTaskSuretyList, reqTaskSuretyPage } from '@/api/task/list'
import TablePagination from '@/components/table-pagination'

export default {
  name: 'Bond',
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 保证金状态
      taskSuretyList: [],
      // 列表数据
      tableData: [],
      //表示参数类
      parameter: {
        status: undefined
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
      this.getTaskSuretyList()
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
    // 查询保证金状态
    getTaskSuretyList() {
      reqTaskSuretyList().then(resp => {
        const page = resp.data.data
        this.taskSuretyList = page
      })
    },
    // 查询列表
    getList() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      reqTaskSuretyPage(listQuery)
        .then(resp => {
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.interactive.tableLoading = false
        })
        .catch(() => {
          this.interactive.tableLoading = false
        })
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
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
    }
    .user-base {
      width: 180px;
    }
  }
}
</style>
