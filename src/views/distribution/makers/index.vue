<template>
  <div class="main-content">
    <div class="businesstab">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="创客搜索">
          <span class="el-form-item-span">：</span>
          <el-select v-model="search.searchType" placeholder="请选择">
            <el-option label="创客ID" value="userId"></el-option>
            <el-option label="创客微信昵称" value="username"></el-option>
            <el-option label="创客真实姓名" value="fullName"></el-option>
            <el-option label="创客手机号" value="mobile"></el-option>
          </el-select>
          <el-input v-model="search.searchValue" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item v-if="activeName==='first'" label="认证状态">
          <span class="el-form-item-span">：</span>
          <el-select v-model="search.authStatus"> 
            <el-option label="已实名" value="true"></el-option>
            <el-option label="未实名" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邀请方搜索">
          <span class="el-form-item-span">：</span>
          <el-select v-model="search.inviteType" placeholder="请选择">
            <el-option label="邀请方微信昵称" value="inviteUsername"></el-option>
            <el-option label="邀请方真实姓名" value="inviteFullName"></el-option>
            <el-option label="邀请方手机号" value="inviteMobile"></el-option>
          </el-select>
          <el-input v-model="search.inviteValue" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="创客类型">
          <span class="el-form-item-span">：</span>
          <el-select v-model="search.userLevel"> 
            <el-option v-for="level in levels" :key="level.dictValue" :label="level.dictName" :value="level.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="归属团长">
          <span class="el-form-item-span">：</span>
          <el-input v-model="search.leaderName" placeholder="请输入团长名称"></el-input>
        </el-form-item>
        <el-form-item label="开通时间">
          <span class="el-form-item-span">：</span>
          <el-date-picker v-model="search.date" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="activeName==='first'" label="创客状态">
          <span class="el-form-item-span">：</span>
          <el-select v-model="search.status" placeholder="请选择">
            <el-option v-for="state in states" :key="state.dictValue" :label="state.dictName" :value="state.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getDistributors">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="创客列表" name="first">
          <div>
            <!-- <el-button type="success">导出报表</el-button> -->
          </div>
          <el-table v-loading="tableLoading" border :empty-text="$t('message.table_empty_text')" :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="user.userId" label="创客ID" width="100"></el-table-column>
            <el-table-column prop="date" label="创客信息" width="150px">
              <template slot-scope="scope">
                <div class="user">
                  <div class="user-avatar">
                    <div>
                      <el-avatar :size="50" :src="scope.row.user.avatar"></el-avatar>
                    </div>
                  </div>
                  <div class="user-base">
                    <div>{{ scope.row.user.username }}</div>
                    <div>{{ scope.row.user.fullName }}</div>
                    <div>{{ scope.row.user.mobile }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="认证状态" width="120">
              <template slot-scope="scope">
                <el-button v-if="scope.row.authStatus" type="success" size="mini" plain disabled>{{ scope.row.authStatus?'已实名':'未实名' }}</el-button>
                <el-button v-else type="danger" size="mini" plain disabled>{{ scope.row.authStatus?'已实名':'未实名  ' }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="归属团长">
              <template slot-scope="scope">
                <span>{{ scope.row.leader?scope.row.leader:'--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="邀请方">
              <template slot-scope="scope">
                <div>
                  <div>{{ scope.row.inviteUser?scope.row.inviteUser.username:'--' }}</div>
                  <div>{{ scope.row.inviteUser?scope.row.inviteUser.mobile:'--' }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="userLevelName" label="创客类型" />
            <!-- <el-table-column prop="totalBalance" label="账号余额" />
            <el-table-column prop="taskSuretyAmount" label="保证金(元)" /> -->
             <el-table-column label="累计邀请店铺(个)">
              <template slot-scope="scope">
                <span>{{ scope.row.storeCount }}</span>
              </template>>
            </el-table-column>
            <el-table-column label="累计邀请客户数(个)" width="130">
              <template slot-scope="scope">
                <span>{{
                  scope.row.totalInviteCount
                }}</span> </template>>
            </el-table-column>
            <el-table-column prop="progressTaskNum" label="进行中任务数(个)" width="130">
            </el-table-column>
            <el-table-column prop="finishedTaskNum" label="已完成任务数(个)" width="130">
            </el-table-column>
            <el-table-column prop="statusName" width="100px" label="创客状态">
              <template slot-scope="scope">
                <el-button v-if="scope.row.statusName=='正常'" type="danger" size="mini" plain disabled> {{ scope.row.statusName }} </el-button>
                <el-button v-else type="success" size="mini" plain disabled> {{ scope.row.statusName }} </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="开通时间" width="130"></el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="toDetail(scope.row.user.userId)">详情</el-button>
                <el-button v-if="scope.row.status === 'normal'" type="text" @click="toDisabled(scope.row.user)">冻结</el-button>
                <el-button v-if="scope.row.status === 'disabled'" type="text" @click="toNormal(scope.row.user)">解冻</el-button>
                <el-button v-if="permissions.distributor_user_role && scope.row.userRole ==='maker' && scope.row.authStatus" type="text" @click="toAssociatedRoles(scope.row)">关联角色</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="待审核创客" name="fourth">
          <el-table v-loading="tableLoading" :empty-text="$t('message.table_empty_text')" :data="waitCheckTableData" style="width: 100%" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="leader" label="创客ID"></el-table-column>
            <el-table-column prop="date" label="创客信息" width="180px">
              <template slot-scope="scope">
                <div class="user">
                  <div class="user-avatar">
                    <div>
                      <el-avatar :size="50" :src="scope.row.user.avatar"></el-avatar>
                    </div>
                  </div>
                  <div class="user-base">
                    <div>{{ scope.row.user.username }}</div>
                    <div>{{ scope.row.user.fullName }}</div>
                    <div>{{ scope.row.user.mobile }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="leader" label="归属团长"></el-table-column>
            <el-table-column prop="userLevelName" width="100px" label="邀请方" />
            <el-table-column label="创客类型" width="100px" align="center" prop=""></el-table-column>
            <el-table-column label="累计邀请客户数(个)">
              <template slot-scope="scope">
                <span>{{
                  scope.row.totalInviteCount
                }}</span> </template>>
            </el-table-column>
            <el-table-column prop="createTime" label="注册时间"></el-table-column>
            <el-table-column label="操作" width="260">
              <template slot-scope="scope">
                <el-button type="text" @click="toExamine(scope.row.user.userId)">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="招募设置" name="third">
        </el-tab-pane>
      </el-tabs>
    </div>-->
        <!-- 分页 -->
        <div style="margin-top: 10px">
          <table-pagination
            :total="pagination.total"
            :page.sync="pagination.current"
            :limit.sync="pagination.size"
            @pagination="getList"
          />
        </div></el-tabs></div>

    <el-dialog title="冻结操作" :visible.sync="centerDialogVisible" width="30%">
      <span>冻结此创客后，将无法再次登录创客plus。</span>
      <el-input v-model="remark" type="textarea" rows="5" class="disable-input" maxlength="100"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="关联角色" :visible.sync="relevanceDialog" width="30%">
      <el-form ref="relevanceForm" :model="relevance" label-width="120px" :rules="rules" label-position="right">
        <el-form-item label="关联角色：" prop="userRole">
          <el-select v-model="relevance.userRole" placeholder="请选择角色类型">
            <el-option
              v-for="role in roleArr"
              :key="role.dictName"
              :label="role.dictName"
              :value="role.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位：">
          <el-input v-model="relevance.company" placeholder="请输入所属单位" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="所属单位编号：">
          <el-input v-model="relevance.companyNo" placeholder="请输入所属单位编号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="所属机构：" prop="organize">
          <el-select v-model="relevance.orgId" placeholder="请选择所属机构">
            <el-option
              v-for="role in organizList"
              :key="role.orgId"
              :label="role.orgName"
              :value="role.orgId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="relevanceDialog = false">取 消</el-button>
          <el-button type="primary" @click="roleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--审核弹框  -->
    <el-dialog
      title="创客信息审核"
      :visible.sync="examineDialogVisible"
      width="40%"
      center>
      <el-form>
        <el-form-item label="审核结果：">
          <el-radio v-model="radio_check" label="1">审核通过</el-radio>
          <el-radio v-model="radio_check" label="2">审核未通过</el-radio>
        </el-form-item>
        <el-form-item label="原因：">
          <el-input v-model="reason_textarea" type="textarea" :rows="4" placeholder="请输入内容" style="width:400px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="examineDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'
import {
  pageDistriUsers,
  getDistributionLevel,
  getDistributorStates,
  disabledDistributorStatus,
  normalDistributionStatus,
  updateRole
} from '@/api/distribution/distribution'
import {
  role
} from '@/api/distribution/establish'
import { getOrganization } from '@/api/mechanism/mechanism'
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      search: {
        searchType: undefined,
        searchValue: undefined,
        status: undefined,
        userLevel: undefined,
        date: [],
        leaderName: undefined, //归属团长
        authStatus: undefined, //认证状态
        inviteType: undefined, //邀请类型
        inviteValue: undefined //邀请值
      }, 
      levels: [],
      states: [],
      type: 0,
      tableData: [],
      waitCheckTableData: [],
      remark: undefined,
      clearUser: {},
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      centerDialogVisible: false,
      activeName: 'first',
      relevanceDialog: false,
      // 创客审核弹框
      examineDialogVisible: false,
      relevance: {
        userRole: '',
        company: '',
        companyNo: '',
        orgId: '',
        userId: ''
      },
      rules: {
        userRole: [
          {
            required: true,
            message: '关联角色为必选项',
            trigger: 'blur'
          }
        ]
      },
      value: '',
      roleArr: [],
      organizeArr: [
        { name: '中国农业银行', value: 'NH' }
      ],
      radio_check: '1',
      reason_textarea: null,
      organizList: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getDistributors()
    this.getLevels()
    this.getStates()
    this.getOrganizationList()
  },
  mounted() {
    // this.getDistributors()
    // this.getLevels()
    // this.getStates()
    // this.getOrganizationList()
  },
  methods: {
    getList() {
      this.getDistributors()
    },
    // 获取创客列表
    getDistributors() {
      const [startCreateTime, endCreateTime] = this.search.date
      const inviteType = this.search.inviteType
      const searchType = this.search.searchType
      const params = {
        startCreateTime,
        endCreateTime,
        status: this.search.status,
        userLevel: this.search.userLevel,
        inviteUsername: this.search.inviter,
        leaderName: this.search.leaderName, //归属团长
        authStatus: this.search.authStatus, //认证状态
        [searchType]: this.search.searchValue,
        [inviteType]: this.search.inviteValue,
        size: this.pagination.size,
        current: this.pagination.current
      }
      console.log('params', params)
      if (this.search.searchType) {
        params[this.search.searchType] = this.search.searchValue
      }
      this.tableLoading = true
      pageDistriUsers(params)
        .then(resp => {
          this.tableLoading = false
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.pagination.pages = page.pages
        })
        .catch(e => {
          this.tableLoading = false
        })
    },
    // 查询机构列表
    getOrganizationList() {
      const data = {}
      getOrganization(data).then(res => {
        this.organizList = res.data.data.records
      })
    },
    // 查询角色
    _role() {
      role().then(res => {
        console.log('res', res)
        this.roleArr = res.data.data
      })
    },
    // 修改角色
    roleSubmit() {
      console.debug('this.relevance', this.relevance)
      updateRole(this.relevance).then(res => {
        this.$message({
          type: 'success',
          message: '关联成功!'
        })
        this.relevanceDialog = false
        this.getList()
      })
    },
    // 获取创客类型
    getLevels() {
      getDistributionLevel().then(res => {
        this.levels = res.data.data
      })
    },
    // 获取创客状态
    getStates() {
      getDistributorStates().then(res => {
        this.states = res.data.data
      })
    },
    // 去详情
    toDetail(userId) {
      this.$router.push(`/distribution/details/${userId}`)
    },
    //去审核 
    toExamine(userId) {
      this.examineDialogVisible = true
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
        date: [],
        leaderName: undefined, //归属团长
        authStatus: undefined, //认证状态
        inviteType: undefined, //邀请类型
        inviteValue: undefined //邀请值
      }
      this.getDistributors()
    },
    // 打开清退用户弹框
    toDisabled(row) {
      this.clearUser = Object.assign({}, row)
      this.remark = null
      this.centerDialogVisible = true
    },
    // 去解冻用户
    toNormal(row) {
      this.$confirm('确定将“' + row.fullName + '”创客解冻吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        normalDistributionStatus({ userId: row.userId }).then(res => {
          this.$message({
            type: 'success',
            message: '解冻成功!'
          })
          this.getDistributors()
        })
          
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解冻'
        })          
      })
    },
    // 清退确认
    handleConfirm() {
      if (!this.remark) {
        this.$message.warning('请填写冻结用户原因')
        return
      }
      const data = {
        userId: this.clearUser.userId,
        remark: this.remark
      }
      console.log('data', data)
      disabledDistributorStatus(data).then(
        res => {
          this.$message.success('冻结成功')
          this.centerDialogVisible = false
          this.getList()
        }
      )
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
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
    },
    // 新增创客
    addMakers() {
      this.$router.push('/distribution/makers/establish')
    },
    // 关联角色
    toAssociatedRoles(vle) {
      if (vle.user) {
        this.relevance.userId = vle.user.userId
      }
      this._role()
      this.relevanceDialog = true
    },
    // 关联发布者
    toAssociatedPublisher(vle) {
      this.publisherDialog = true
    },
    // tab切换
    handleClick(tab, event) {
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      if (tab.name === 'first') {
        // this.search.status = 'normal'
        this.activeName = 'first'
        this.getList()
      } else if (tab.name === 'fourth') {
        this.activeName = 'fourth'
      }
      
    },
    tabview(val) {
      if (val === 0) {
        console.log(1)
      } else if (val === 1) {
        console.log(2)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  .businesstab {
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
    .el-tabs.el-tabs--card.el-tabs--top {
      margin-top: 20px;
      .el-tabs__item.is-top {
        padding: 0 50px;
        color: #606266;
      }
    }
  }
  .business-tab {
    display: flex;
    justify-content: space-between;
    .tabitem {
      display: inline-block;
      width: 100px;
      height: 30px;
      line-height: 30px;
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
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: rgb(32, 160, 255);
  }
}
.disable-input {
  margin-top: 10px;
}
</style>
