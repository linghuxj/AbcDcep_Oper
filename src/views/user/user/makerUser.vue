<template>
  <!-- 推广人列表 -->
  <div class="main-content makerUser">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="推广人搜索：">
        <el-input
          v-model="search.searchValue"
          style="width: 100%"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-select
            v-model="search.searchType"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option label="用户ID" value="userId" />
            <el-option label="真实姓名" value="fullName" />
            <el-option label="用户昵称" value="username" />
            <el-option label="用户手机号" value="mobile" />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="注册时间：">
        <el-date-picker
          v-model="timeArr"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="timeChange"
        ></el-date-picker>
      </el-form-item>
      <div>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getList('search')"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>
    <el-tabs v-model="parameter.status" @tab-click="tabChange">
      <el-tab-pane label="正常推广人" name="normal" />
      <el-tab-pane label="已冻结推广人" name="disabled" />
    </el-tabs>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.tableType === 'inviteUser'">
            <div class="imgText" v-if="scope.row.inviteUser">
              <span v-if="scope.row.inviteUser">
                用户名：{{ scope.row.inviteUser['username'] }}
              </span>
              <span> 姓名：{{ scope.row.inviteUser['fullName'] }} </span>
              <span> 手机号：{{ scope.row.inviteUser['mobile'] }} </span>
            </div>
            <span v-else> -- </span>
          </template>
          <template v-if="item.tableType === 'img'">
            <div class="imgText">
              <span> 用户名：{{ scope.row['username'] }} </span>
              <span> 姓名：{{ scope.row['fullName'] }} </span>
              <span> 手机号：{{ scope.row['mobile'] }} </span>
            </div>
          </template>
          <span v-else-if="item.level == 2">
            {{ scope.row[item.value[0]][item.value[1]] }}
          </span>
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="text" @click="btnClick(scope.row)"> 详情 </el-button> -->
          <el-button
            v-if="scope.row.status == 'normal' && permissions.user_status_edit"
            type="text"
            @click="editDistributionStatus(scope.row, 'disabled')"
          >
            冻结
          </el-button>
          <el-button
            v-else-if="
              scope.row.status == 'disabled' && permissions.user_status_edit
            "
            type="text"
            @click="editDistributionStatus(scope.row, 'normal')"
          >
            解冻
          </el-button>
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
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { makerList, editDistributionStatus } from '@/api/user/user'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表格列配置
      tableArr: [
        {
          label: '推广人信息',
          tableType: 'img',
          width: 150
        },
        {
          label: '邀请人',
          tableType: 'inviteUser',
          width: 150
        },
        // {
        //   label: '已接任务数',
        //   value: 'taskReceiveCount'
        // },
        {
          label: '直邀合伙人数量',
          value: 'inviteUserCount'
        },
        {
          label: '间邀合伙人数量',
          value: 'indirectInviteUserCount'
        },
        {
          label: '累计有效任务结果数',
          value: 'taskResultNormalCount'
        },
        {
          label: '注册时间',
          value: 'createTime',
          width: 120
        }
      ],
      timeArr: [],
      // 加载状态
      tableLoading: false,
      // 表格数据
      tableData: [],
      search: {
        searchType: undefined,
        searchValue: undefined
      },
      //表示参数类
      parameter: {
        // 用户状态
        status: 'normal',
        // 创建开始时间
        startCreateTime: undefined,
        // 创建结束时间
        endCreateTime: undefined
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
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
    })
  },
  methods: {
    getList(type) {
      this.tableLoading = true
      if (type === 'search') {
        this.pagination.current = 1
      }
      // 拼接请求参数
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      if (this.search.searchType) {
        listQuery[this.search.searchType] = this.search.searchValue
      }
      makerList(listQuery).then(response => {
        this.tableData = response.data.data.records
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.tableLoading = false
        }, 0.1 * 1000)
      })
    },
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
    // 时间选择切换触发
    timeChange(val) {
      const [startDate, endDate] = val
      this.parameter.startCreateTime = startDate
      this.parameter.endCreateTime = endDate
    },
    tabChange() {
      this.tableHeight = 'calc(100vh - 335px)'
      this.getList('search')
      setTimeout(() => {
        this.countHeight()
      }, 500)
    },
    editDistributionStatus(rowData, status) {
      this.$confirm(
        `正在执行${status == 'disabled' ? '冻结' : '解冻'}操作，请确认...`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          editDistributionStatus({
            status,
            userId: rowData.userId
          }).then(res => {
            if (res) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //重置
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined
      }
      //表示参数类
      this.parameter = {
        status: 'normal',
        startCreateTime: undefined,
        endCreateTime: undefined
      }
      this.timeArr = []
      this.getList('search')
    }
  }
}
</script>
<style lang="scss" scoped>
.imgText {
  float: left;
  span {
    display: block;
    text-align: left;
    height: 20px;
    line-height: 20px;
  }
}
</style>
