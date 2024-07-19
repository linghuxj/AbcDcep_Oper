<template>
  <div class="main-content">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="创客搜索">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.searchType" placeholder="请选择" style="width: 30%">
          <el-option label="创客ID" value="userId"></el-option>
          <el-option label="创客微信昵称" value="username"></el-option>
          <el-option label="创客真实姓名" value="fullName"></el-option>
          <el-option label="创客手机号" value="mobile"></el-option>
        </el-select>
        <el-input v-model="search.searchValue" placeholder="请输入内容" style="width: 30%"></el-input>
      </el-form-item>
      <el-form-item label="单位搜索">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.companyType" placeholder="请选择" style="width: 30%">
          <el-option label="所属单位编号" value="company"></el-option>
          <el-option label="所属单位名称" value="companyNo"></el-option>
        </el-select>
        <el-input v-model="search.companyValue" placeholder="请输入内容" style="width: 30%"></el-input>
      </el-form-item>
      <el-form-item label="认证状态">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.authStatus">
          <el-option label="已认证" value="true"></el-option>
          <el-option label="未认证" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开通时间">
        <span class="el-form-item-span">：</span>
        <el-date-picker v-model="search.date" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="创客类型">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.userLevel">
          <el-option v-for="item in levels" :key="item.index" :label="item.dictName" :value="item.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创客状态">
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
    <div>
      <el-button v-if="permissions.distributor_add" type="primary" icon="el-icon-plus" @click="addMakers">新增任务发布者</el-button>
      <el-button v-if="permissions.official_add" type="primary" @click="setOfficialMaker">设为官方创客</el-button>
      <!-- <el-button type="success">导出报表</el-button> -->
    </div>
    <div class="businesstab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="任务发布者列表" name="third">
          <el-table
            v-loading="tableLoading"
            border
            :data="tableData" 
            :empty-text="$t('message.table_empty_text')"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="user.userId" label="创客ID" width="55"></el-table-column>
            <el-table-column label="创客信息" width="120px">
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
                <el-button v-if="scope.row.authStatus" type="danger" size="mini" plain disabled> {{ scope.row.authStatus?'已实名':'未实名' }} </el-button>
                <el-button v-else type="success" size="mini" plain disabled> {{ scope.row.authStatus?'已实名':'未实名' }} </el-button>
              </template>
            </el-table-column>
            <el-table-column label="所属机构">
              <template slot-scope="scope">
                <span>{{ scope.row.orgName?scope.row.orgName:'--' }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column width="100px" label="账号余额(元)" prop="totalBalance" />
            <el-table-column label="保证金(元)" prop="taskSuretyAmount"></el-table-column> -->
            <el-table-column label="发布的任务数(个)" align="center">
              <template slot-scope="{row}">
                <!-- <router-link :to="'/business/store/index?id='+row.sellerId" class="link-type"> -->
                <router-link :to="`/distribution/details/${row.user.userId}`" class="link-type"> 
                  <span class="link-type">{{ row.taskNum }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="statusName" width="100px" label="创客状态">
              <template slot-scope="scope">
                <el-button v-if="scope.row.statusName=='正常'" type="danger" size="mini" plain disabled> {{ scope.row.statusName }} </el-button>
                <el-button v-else type="success" size="mini" plain disabled> {{ scope.row.statusName }} </el-button>
              </template>
            </el-table-column>
            <el-table-column width="100px" label="创客标识">
              <template slot-scope="scope">
                <span>{{ scope.row.official?'官方':'认证' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="开通时间"></el-table-column>
            <el-table-column label="操作" width="260" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="permissions.distributor_org" type="text" @click="toRelationOrganize(scope.row)">关联机构</el-button>
                <el-button type="text" @click="toDetail(scope.row.user.userId)">详情</el-button>
                <el-button v-if="scope.row.status === 'normal' && permissions.distributor_status" type="text" @click="toDisabled(scope.row.user)">冻结</el-button>
                <el-button v-if="scope.row.status === 'disabled' && permissions.distributor_status" type="text" @click="toNormal(scope.row.user)">解冻</el-button>
                <el-button v-if="permissions.distributor_edit" type="text" @click="toEdit(scope.row.user.userId)">编辑</el-button>
                <el-button v-if="scope.row.official && permissions.official_del" type="text" @click="cancelOfficial(scope.row.user)">取消官方标识</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div style="margin-top: 10px">
      <!-- 分页 -->
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
    </div>

    <el-dialog title="清退操作" :visible.sync="centerDialogVisible" width="30%">
      <span>冻结此创客后，将无法再次登录创客plus。</span>
      <el-input v-model="remark" type="textarea" rows="5" class="disable-input" maxlength="100"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelClearout">取 消</el-button>
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
        <el-form-item label="所属单位：" prop="company">
          <el-input v-model="relevance.company" autocomplete="off" placeholder="请输入所属单位"></el-input>
        </el-form-item>
        <el-form-item label="所属单位编号：" prop="companyNo">
          <el-input v-model="relevance.companyNo" autocomplete="off" placeholder="请输入单位编号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="relevanceDialog = false">取 消</el-button>
          <el-button type="primary" @click="roleSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--去关联机构  -->
    <el-dialog
      title="关联机构"
      :visible.sync="relationOrganizeDialogVisible"
      width="30%"
      :before-close="relationOrganizeClose">
      <el-form>
        <el-form-item label="关联机构：" prop="organize">
          <el-select v-model="relation_orgId" placeholder="请选择所属机构">
            <el-option v-for="item in organizList" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relationOrganizeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureRelationOrg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'
import {
  getDistributionLevel,
  getDistributorStates,
  disabledDistributorStatus,
  normalDistributionStatus,
  updateRole,
  publisher,
  cancelOfficial,
  addAfficial,
  toRelationOrg,
  toUpdateRelationOrg
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
        authStatus: undefined, //认证状态
        companyType: undefined, //邀请类型
        companyValue: undefined //邀请值
      },
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
      centerDialogVisible: false,
      activeName: 'third',
      relevanceDialog: false,
      relation_orgId: undefined,
      orgStatus: 'Add',
      organizList: [],
      relationOrganizeDialogVisible: false,
      relevance: {
        userRole: '',
        company: '',
        companyNo: '',
        userId: ''
      },
      rules: {
        userRole: [
          {
            required: true,
            message: '关联角色为必选项',
            trigger: 'blur'
          }
        ],
        company: [
          {
            required: true,
            message: '所属单位为必填项',
            trigger: 'blur'
          }
        ],
        companyNo: [
          {
            required: true,
            message: '所属单位编号为必填项',
            trigger: 'blur'
          }
        ]
      },
      value: '',
      roleArr: [],
      selectionArr: [],
      organizeArr: [
        { name: '中国农业银行', value: 'NH' }
      ],
      organize: null
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getDistributors()
    this.getLevels()
    this.getStates()
  },
  methods: {
    getList() {
      this.getDistributors()
    },
    
    // 获取创客列表
    getDistributors() {
      const [startCreateTime, endCreateTime] = this.search.date
      const companyType = this.search.companyType
      const searchType = this.search.searchType
      const params = {
        startCreateTime,
        endCreateTime,
        status: this.search.status,
        userLevel: this.search.userLevel,
        inviteUsername: this.search.inviter,
        [companyType]: this.search.companyValue,
        [searchType]: this.search.searchValue,
        authStatus: this.search.authStatus, //认证状态
        size: this.pagination.size,
        current: this.pagination.current
      }
      this.tableLoading = true
      publisher(params)
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
    // 打开关联机构弹框
    toRelationOrganize(row) {
      this.userId = row.user.userId
      if (row.orgId) {
        this.orgStatus = 'Edit'
      } else {
        this.orgStatus = 'Add'
      }
      this.relation_orgId = row.orgId
      this.getOrganizationList()
      this.relationOrganizeDialogVisible = true
    },
    // 关闭关联机构弹框
    relationOrganizeClose() {
      this.relationOrganizeDialogVisible = false
    },
    // 去关联机构
    sureRelationOrg() {
      if (this.orgStatus === 'Add') {
        const arr = []
        arr.push(this.userId)
        const data = {
          orgId: this.relation_orgId,
          userIds: arr
        }
        toRelationOrg(data).then(res => {
          this.$message.success('关联成功')
          this.relationOrganizeDialogVisible = false
          this.getDistributors()
        }).catch((res) => {
          this.$message.success(res)
        })
      } else {
        const data = {
          orgId: this.relation_orgId,
          userId: this.userId
        }
        toUpdateRelationOrg(data).then(res => {
          this.$message.success('关联成功')
          this.relationOrganizeDialogVisible = false
          this.getDistributors()
        }).catch((res) => {
          this.$message.success(res)
        })
      }
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
      updateRole(this.relevance).then(res => {
        console.log('修改成功', res)
        this.relevanceDialog = false
      })
    },
    handleSelectionChange(val) {
      console.debug('val', val)
      this.selectionArr = val
    },
    // 设为官方创客
    setOfficialMaker(row) {
      console.log('row', this.selectionArr)
      const userIds = []
      const userNames = []
      for (const i in this.selectionArr) {
        console.debug('i', i)
        userIds.push(this.selectionArr[i].user.userId)
        userNames.push(this.selectionArr[i].user.fullName)
      }
      console.debug('userIds+userNames', userNames, userIds)
      this.$confirm('是否设置“' + userNames + '”为官方创客?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        addAfficial({ userIds: userIds }).then(res => {
          this.$message({
            type: 'success',
            message: '设置成功!'
          })
          this.getDistributors()
        })  
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消设置'
        })          
      })
    },
    // 取消官方标识
    cancelOfficial(row) {
      this.$confirm('是否取消“' + row.fullName + '”的官方标识?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        cancelOfficial(row.userId).then(res => {
          this.$message({
            type: 'success',
            message: '取消成功!'
          })
          this.getDistributors()
        })  
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消设置'
        })          
      })
    },
    getLevels() {
      getDistributionLevel().then(res => {
        this.levels = res.data.data
      })
    },
    getStates() {
      getDistributorStates().then(res => {
        this.states = res.data.data
      })
    },
    toEdit(userId) {
      this.$router.push({ path: '/distribution/makers/establish', query: { userId: userId }})
    },
    toDetail(userId) {
      this.$router.push(`/distribution/details/${userId}`)
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
        date: [],
        authStatus: undefined, //认证状态
        companyType: undefined, //邀请类型
        companyValue: undefined //邀请值
      }
      this.getDistributors()
    },
    // 打开冻结用户弹框
    toDisabled(row) {
      this.clearUser = Object.assign({}, row)
      console.debug('clearUser', this.clearUser)
      this.centerDialogVisible = true
    },
    // 冻结确定
    handleConfirm() {
      if (!this.remark) {
        this.$message.warning('请填写清退用户原因')
        return
      }
      const data = {
        userId: this.clearUser.userId,
        remark: this.remark
      }
      console.log('data', data)
      disabledDistributorStatus(data).then(
        res => {
          this.$message.success('清退成功')
          this.getDistributors()
        }
      )
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
      const userRole = 'publisher'
      this.$router.push({ path: '/distribution/makers/establish', query: { userRole: userRole }})
    },
    // 关联角色
    toAssociatedRoles(vle) {
      if (vle.user) {
        this.relevance.userId = vle.user.userId
      }
      this._role()
      this.relevanceDialog = true
    },
    // tab切换
    handleClick(tab, event) {
      if (tab.name === 'first') {
        this.search.status = 'normal'
      } else if (tab.name === 'second') {
        this.search.status = 'audit'
      } else if (tab.name === 'third') {
        this.search.status = 'disabled'
      } else if (tab.name === 'fourth') {
        this.search.status = 'disabled'
      }
      // this.initPageStore()
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
