<template>
  <div class="business">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="分销员查询">
        <el-select v-model="search.searchType" placeholder="请选择" style="width: 30%">
          <!-- <el-option label="分销员昵称" value="username"></el-option> -->
          <el-option label="姓名" value="fullName"></el-option>
          <!-- <el-option label="手机号" value="mobile"></el-option> -->
        </el-select>
        <el-input v-model="search.searchValue" placeholder="请输入查询内容" style="width: 70%"></el-input>
      </el-form-item>
      <el-form-item label="分销员状态" prop="type">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option
            v-for="state in states"
            :key="state.dictValue"
            :label="state.dictName"
            :value="state.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邀请方">
        <el-input v-model="search.inviter" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="加入时间">
        <el-date-picker
          v-model="search.date"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="分销员等级" prop="type">
        <el-select v-model="search.userLevel">
          <el-option
            v-for="level in levels"
            :key="level.id"
            :label="level.dictName"
            :value="level.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDistributors">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <div>
      <el-button type="primary">导出报表</el-button>
    </div>-->
    <div class="businesstab">
      <span :class="[type == 0 ? 'tabitem actionts' : 'tabitem']" @click="tabview((type = 0))">分销员列表</span>
      <!-- <span
        :class="[type == 1 ? 'tabitem actionts' : 'tabitem']"
        @click="tabview((type = 1))"
        >分销员审核</span
      >
      <span
        :class="[type == 2 ? 'tabitem actionts' : 'tabitem']"
        @click="tabview((type = 2))"
        >招募设置</span
      >
      <span
        :class="[type == 3 ? 'tabitem actionts' : 'tabitem']"
        @click="tabview((type = 3))"
        >招募页模板</span
      >-->
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="分销员信息" width="180px">
          <template slot-scope="scope">
            <div class="user">
              <div class="user-avatar">
                <div>
                  <el-avatar :size="50" :src="scope.row.user.avatar"></el-avatar>
                </div>
              </div>
              <div class="user-base">
                <!-- <div>{{ scope.row.user.username }}</div> -->
                <div>{{ scope.row.user.fullName }}</div>
                <!-- <div>{{ scope.row.user.mobile }}</div> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userLevelName" width="100px" label="分销员等级" />
        <el-table-column prop="statusName" width="100px" label="分销员类型" />
        <el-table-column label="邀请方">
          <template v-if="scope.row.inviteUser" slot-scope="scope">
            <div>
              <div>{{ scope.row.inviteUser.username }}</div>
              <div>{{ scope.row.inviteUser.mobile }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="累计邀请店铺(个)">
          <template slot-scope="scope">
            <span>{{ scope.row.storeCount }}</span>
          </template>>
        </el-table-column>
        <el-table-column label="累计邀请客户">
          <template slot-scope="scope">
            <span>{{ scope.row.totalInviteCount }}</span>
          </template>>
        </el-table-column>
        <el-table-column prop="name" label="累计钱包申请客户">
          <template slot-scope="scope">
            <span>{{ scope.row.totalDcCount }}</span>
          </template>>
        </el-table-column>
        <el-table-column prop="leader" label="归属团长"></el-table-column>
        <el-table-column prop="createTime" label="加入时间"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <!-- <router-link :to="'/distribution/details/'+ scope.row.user.userId"> -->
            <!-- <el-button type="primary" size="mini"> -->
            <!-- 详情 -->
            <!-- </el-button> -->
            <!-- </router-link> -->
            <el-button size="mini" @click="toDetail(scope.row.user.userId)">详情</el-button>
            <el-button size="mini" type="danger" @click="handleClearOut(scope.row)">清退</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        :page-count="pagination.pages"
        :current-page="pagination.current"
        :page-sizes="pagination.pageSize"
        :page-size="pagination.size"
        layout="sizes, prev, pager, next"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @prev-click="handleCurrentChange"
        @next-click="handleCurrentChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <el-dialog title="清退操作" :visible.sync="centerDialogVisible" width="30%" center>
      <span>冻结此创客后，将无法再次登录创客plus。</span>
      <el-input v-model="remark" type="textarea" rows="5"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelClearout">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import {
  pageDistriUsers,
  getDistributionLevel,
  getDistributorStates,
  disabledDistributorStatus
} from '@/api/distribution/distribution'
export default {
  data() {
    return {
      tableLoading: false,
      search: {
        searchType: undefined,
        searchValue: undefined,
        status: undefined,
        userLevel: undefined,
        date: [],
        inviter: undefined
      }, // 表单绑定值
      levels: [],
      states: [],
      type: 0,
      tableData: [],
      remark: undefined,
      clearUser: {},
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      centerDialogVisible: false
    }
  },
  mounted() {
    this.getDistributors()
    this.getLevels()
    this.getStates()
  },
  methods: {
    getLevels() {
      getDistributionLevel().then((res) => {
        this.levels = res.data.data
      })
    },
    getStates() {
      getDistributorStates().then((res) => {
        this.states = res.data.data
      })
    },
    toDetail(userId) {
      this.$router.push(`/distribution/details/${userId}`)
    },
    // 获取分销员列表
    getDistributors() {
      const [startCreateTime, endCreateTime] = this.search.date
      const params = {
        startCreateTime,
        endCreateTime,
        status: this.search.status,
        userLevel: this.search.userLevel,
        size: this.pagination.size,
        current: this.pagination.current
      }
      if (this.search.searchType) {
        params[this.search.searchType] = this.search.searchValue
      }
      this.tableLoading = true
      pageDistriUsers(params)
        .then((resp) => {
          this.tableLoading = false
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.pagination.pages = page.pages
        })
        .catch((e) => {
          this.tableLoading = false
        })
    },
    handleCancelClearout() {
      this.centerDialogVisible = false
      this.remark = undefined
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.getDistributors()
    },
    handleCurrentChange(current) {
      this.pagination.current = current
      this.getDistributors()
    },
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
        status: undefined,
        userLevel: undefined,
        date: []
      }
      this.getDistributors()
    },
    handleClearOut(row) {
      this.clearUser = Object.assign({}, row)
      this.centerDialogVisible = true
    },
    handleConfirm() {
      if (!this.remark) {
        this.$message.warning('请填写清退用户原因')
        return
      }
      disabledDistributorStatus(this.clearUser.user.userId, this.remark).then(
        (res) => {
          this.$message.success('清退成功')
          this.getDistributors()
        }
      )
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 新增和编辑
    compile() {
      this.$router.push('/distribution/details')
    }
  }
}
</script>
<style lang="scss" scoped>
.business {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  .businesstab {
    margin-top: 20px;
    .tabitem {
      display: inline-block;
      width: 100px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      cursor: pointer;
    }
    .actionts {
      color: #0094ff;
      border-bottom: 2px solid #0094ff;
    }
  }
}
.user {
  display: flex;
}
</style>
