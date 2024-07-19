<template>
  <div class="main-content">
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
      <el-form-item label="单位搜索">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.companyType" placeholder="请选择">
          <el-option label="所属单位编号" value="company"></el-option>
          <el-option label="所属单位名称" value="companyNo"></el-option>
        </el-select>
        <el-input v-model="search.companyValue" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="认证状态">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.authStatus">
          <el-option label="已实名" value="true"></el-option>
          <el-option label="未实名" value="false"></el-option>
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
      <el-button v-if="permissions.distributor_add" type="primary" icon="el-icon-plus" @click="addMakers">
        新增顶层利益者
      </el-button>
      <!-- <el-button type="success">导出报表</el-button> -->
    </div>
    <div class="businesstab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="顶层利益者列表" name="third">
          <el-table v-loading="tableLoading" border :empty-text="$t('message.table_empty_text')" :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}" style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="user.userId" label="创客ID" width="70"></el-table-column>
            <el-table-column label="创客信息" width="120">
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
            <el-table-column label="认证状态" width="100px">
              <template slot-scope="scope">
                <el-button v-if="scope.row.authStatus" type="danger" size="mini" plain disabled> {{ scope.row.authStatus?'已实名':'未实名' }} </el-button>
                <el-button v-else type="success" size="mini" plain disabled> {{ scope.row.authStatus?'已实名':'未实名' }} </el-button>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="user.company" label="所属单位"></el-table-column>
            <el-table-column prop="user.companyNo" label="所属单位编号" width="120"></el-table-column> -->
            <el-table-column label="所属机构">
              <template slot-scope="scope">
                <span>{{ scope.row.orgName?scope.row.orgName:'--' }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="totalBalance" label="账户余额(元)" width="120" />
            <el-table-column prop="taskSuretyAmount" label="保证金(元)" /> -->
            <el-table-column label="关联发布者人数(个)" align="center">
              <template slot-scope="{row}">
                <router-link :to="`/distribution/details/${row.user.userId}`" class="link-type">
                  <span class="link-type">{{ row.relationPublisherNum }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="statusName" width="100px" label="创客状态">
              <template slot-scope="scope">
                <el-button v-if="scope.row.statusName" type="danger" size="mini" plain disabled> {{ scope.row.statusName }} </el-button>
                <el-button v-else type="success" size="mini" plain disabled> {{ scope.row.statusName }} </el-button>
              </template>
            </el-table-column> 
            <el-table-column prop="createTime" label="开通时间"></el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
              <template slot-scope="scope">
                <el-button v-if="permissions.distributor_org" type="text" @click="toRelationOrganize(scope.row)">关联机构</el-button>
                <el-button type="text" size="mini" @click="toDetail(scope.row.user.userId)">详情</el-button>
                <el-button v-if="permissions.distributor_publisher" type="text" size="mini" @click="toAssociatedPublisher(scope.row.user.userId)">关联任务发布者</el-button>
                <el-dropdown style="margin-left:10px">
                  <span class="el-dropdown-link">
                    <el-button type="text">更多</el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="permissions.distributor_edit" @click.native="handleEdit(scope.row.user.userId)">编辑</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.status==='normal' && permissions.distributor_status" @click.native="toDisabled(scope.row.user)">冻结</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.status==='disabled' && permissions.distributor_status" @click.native="toNormal(scope.row.user)">解冻</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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

    <el-dialog title="冻结操作" :visible.sync="centerDialogVisible" width="30%">
      <span>冻结此创客后，将无法再次登录创客plus。</span>
      <el-input v-model="remark" type="textarea" rows="5" class="disable-input" maxlength="100"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelClearout">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="关联任务发布者" :visible.sync="publisherDialog" width="70%">
      <div class="business-tab">
        <div>
          <span :class="[relationStatus == 0 ? 'tabitem actionts' : 'tabitem']" @click="tabview((relationStatus = 0))">未关联({{ notAssociatedNum }})</span>
          <span
            :class="[relationStatus == 1 ? 'tabitem actionts' : 'tabitem']"
            @click="tabview((relationStatus = 1))"
          >已关联({{ associatedNum }})</span
          >
        </div>
        <div class="relation-search">
          <el-input v-model="relation_keyword" placeholder="请输入搜索内容关键字" style="width:200px" @input="relation_input" />
          <el-button type="primary" @click="relation_search">搜索</el-button>
        </div>
      </div>
      <el-table :data="publishers" style="height:500px" height="500" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="任务发布者">
          <template slot-scope="scope">
            <span>{{ scope.row.fullName?scope.row.fullName:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column property="mobile" label="电话号码"></el-table-column>
        <!-- <el-table-column label="所属单位">
          <template slot-scope="scope">
            <span>{{ scope.row.company?scope.row.company:'--' }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="所属机构">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row.company?scope.row.company:'--' }}</span>
          </template> -->
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
      <div style="text-align:center"><el-button type="primary" @click="relation_sure">{{ relationStatus == 0?'确定关联':'确定取消关联' }}</el-button></div>
    </el-dialog>
    <!--去关联机构  -->
    <el-dialog
      title="关联机构"
      :visible.sync="relationOrganizeDialogVisible"
      width="30%"
      :before-close="relationOrganizeClose">
      <el-form>
        <el-form-item label="关联机构：">
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
  stakeholder,
  publisherList,
  relationCount,
  relation,
  relieve,
  toRelationOrg,
  toUpdateRelationOrg
} from '@/api/distribution/distribution'
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
        organize: null,
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
      publisherDialog: false,
      publishers: [],
      relation_keyword: '', //关联发布者搜索
      stakeholderList: [], //列表
      relationStatus: 0, // 1,已关联 0：未关联
      userId: undefined,
      associatedNum: 0, //已关联数
      notAssociatedNum: 0, //未关联数
      publisherIds: [], //任务ID
      selectArr: [], //选中的任务数组
      relation_current: 1,
      relation_size: 10,
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
      if (this.publisherDialog) {
        this._relationList
      } else {
        this.getDistributors()
      }
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
      stakeholder(params)
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
    // 查询关联的任务发布者列表
    _relationList() {
      const data = {
        relationStatus: this.relationStatus,
        userId: this.userId,
        keyword: this.relation_keyword,
        relation_current: this.relation_current,
        relation_size: this.relation_size
      }
      publisherList(data).then(res => {
        this.publishers = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // 搜索关联的任务发布者列表
    relation_search() {
      this._relationList()
    },
    relation_input(val) {
      if (val === '') {
        this.relation_keyword = val
        this._relationList()
      }
    },
    // 关联的数量查询
    relationCount() {
      relationCount(this.userId).then(res => {
        // console.log('关联的数量查询', res)
        const data = res.data.data
        this.associatedNum = data.associatedNum
        this.notAssociatedNum = data.notAssociatedNum
      })
    },
    //关联
    relation_sure() {
      //  relationStatus: 0, // 1,已关联 0：未关联
      // 未关联去关联 已关联去取消关联
      if (this.selectArr.length <= 0) {
        this.$message.warning('请选择' + this.relationStatus === 0 ? '' : '取消' + '关联对象')
        return
      } else {
        const arr = []
        for (const i of this.selectArr) {
          arr.push(i.userId)
          this.publisherIds = arr
        }
      }
      const data = {
        publisherIds: this.publisherIds,
        userId: this.userId
      }
      if (this.relationStatus === 0) {
        relation(data).then(res => {
          // console.log('关联', res)
          if (res.data.data) {
            this.$message.success('关联成功')
            this.publisherDialog = false
          }
        })
      } else if (this.relationStatus === 1) {
        relieve(data).then(res => {
          if (res.data.data) {
            this.$message.success('取消关联成功')
            this.publisherDialog = false
          }
        })
      }
    },
    handleSelectionChange(val) {
      // console.log('select', val)
      this.selectArr = val
    },
    // 跳转编辑
    handleEdit(userId) {
      this.$router.push({ path: '/distribution/makers/establish', query: { userId: userId }})
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
    toDetail(userId) {
      console.debug('userId', userId)
      this.$router.push(`/distribution/details/${userId}`)
    },
    // 取消冻结用户
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
    // 打开冻结用户框
    toDisabled(row) {
      this.clearUser = row
      this.centerDialogVisible = true
    },
    // 确认冻结该用户
    handleConfirm() {
      if (!this.remark) {
        this.$message.warning('请填写冻结用户原因')
        return
      }
      const data = {
        userId: this.clearUser.userId,
        remark: this.remark
      }
      disabledDistributorStatus(data).then(
        res => {
          this.$message.success('冻结创客' + this.clearUser.fullName + '成功')
          this.centerDialogVisible = false
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
      const userRole = 'stakeholder'
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
    // 关联发布者
    toAssociatedPublisher(vle) {
      this.userId = vle
      this._relationList()
      this.relationCount()
      this.publisherDialog = true
    },
    // tab切换
    handleClick(tab, event) {
    },
    tabview(val) {
      this.relationStatus = val
      this._relationList()
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
  .dialog-bottom {
    display: flex;
    justify-content: center;
  }
}
.user {
  display: flex;
}
.business-tab {
  display: flex;
  justify-content: row;
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
  .relation-search{
    display: flex;
    button {
      margin-left: 10px;
    }
  }
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
