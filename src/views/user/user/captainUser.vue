<template>
  <!-- 合伙人列表 -->
  <div class="main-content captainUser">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="合伙人搜索：">
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
    <div id="tableBtn">
      <el-button
        v-if="permissions.relation_partner_add"
        type="primary"
        @click="showDialog"
        >绑定合伙人</el-button
      >
    </div>
    <el-tabs v-model="parameter.status" @tab-click="tabChange">
      <el-tab-pane label="正常合伙人" name="normal" />
      <el-tab-pane label="已冻结合伙人" name="disabled" />
    </el-tabs>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      tooltip-effect="dark"
      :height="tableHeight"
    >
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
        :width="item.width ? item.width : ''"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
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

    <!-- 绑定合伙人 -->
    <el-dialog title="绑定合伙人" :visible.sync="bindVisible" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
      >
        <el-form-item label="选择合伙人：" prop="partner">
          <el-autocomplete
            v-model="ruleForm.partner"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入合伙人姓名或手机号进行绑定"
            @select="handleSelect"
            style="width: 100%"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindFun">确 认</el-button>
        <el-button @click="bindVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import {
  leaderList,
  editDistributionStatus,
  relationPartner
} from '@/api/user/user'
import { getTaskByMobile } from '@/api/task/list'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表格列配置
      tableArr: [
        {
          label: '合伙人信息',
          value: 'payAmount',
          tableType: 'img',
          width: 180
        },
        {
          label: '已接任务数',
          value: 'taskReceiveCount'
        },
        {
          label: '已分发任务数',
          value: 'taskDistributeCount'
        },
        {
          label: '已结束任务数',
          value: 'taskOverCount'
        },
        {
          label: '直邀合伙人数量',
          value: 'inviteUserCount'
        },
        {
          label: '间邀合伙人数量',
          value: 'indirectInviteUserCount'
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
      },
      // 绑定弹窗显示
      bindVisible: false,
      rules: {
        partner: [
          {
            required: true,
            message: '请输入合伙人姓名或手机号进行绑定',
            trigger: 'change'
          }
        ]
      },
      // 合伙人绑定表单
      ruleForm: {
        // 合伙人
        partner: undefined
      },
      // 选中的合伙人
      selectedPartner: undefined
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
      leaderList(listQuery).then(response => {
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
      this.getList('search')
    },
    showDialog() {
      this.ruleForm = {
        partner: undefined
      }
      this.selectedPartner = undefined
      this.bindVisible = true
    },
    // 远程搜索用户 数据处理
    querySearchAsync(keyword, cb) {
      getTaskByMobile({ keyword: keyword }).then(res => {
        let needData = res.data.data.records.map(item => {
          return { ...item, item, value: item.username }
        })
        cb(needData)
      })
    },
    // 选择方法
    handleSelect(selectItem) {
      this.selectedPartner = selectItem
    },
    // 绑定
    bindFun() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          relationPartner({ userId: this.selectedPartner.userId }).then(res => {
            if (res) {
              this.$message.success('合伙人绑定成功')
              this.bindVisible = false
              this.getList()
            }
          })
        }
      })
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
