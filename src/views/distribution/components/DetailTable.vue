<template>
  <div class="tabs">
    <el-tabs v-model="activeTag" @tab-click="handleChangeTab">
      <el-tab-pane label="累计数据" name="statistical">
        <div class="statistical">
          <div class="statistical-item">
            <div class="statistical-item-div">
              邀请奖励
            </div>
            <div class="statistical-item-div">
              <div>累计分享人数</div>
              <div>
                {{ totalData.totalShareCount }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>累计邀请人数</div>
              <div>
                {{ totalData.totalInviteCount }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>累计分享次数</div>
              <div>
                {{ totalData.totalStoreShareCount }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>累计邀请店铺数</div>
              <div>
                {{ totalData.storeNum}}
              </div>
            </div>
          </div>
          <div class="statistical-item">
            <div class="statistical-item-div">
              消费数据
            </div>
            <div class="statistical-item-div">
              <div>累计消费金额</div>
              <div>
                {{ totalData.expenditureTotalAmount }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>累计消费次数</div>
              <div>
                {{ totalData.expenditureTotalNum }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>客单价</div>
              <div>
                {{ totalData.orderAveragePrice }}
              </div>
            </div>
          </div>
          <!-- 米粒数据 -->
          <div class="statistical-item">
            <div class="statistical-item-div">
              米粒数据
            </div>
            <div class="statistical-item-div">
              <div>可用米粒</div>
              <div>
                {{ totalData.integralBalance }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>累计米粒</div>
              <div>
                {{ totalData.totalIntegral }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>使用次数</div>
              <div>
                {{ totalData.integralUseNum }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>累计使用</div>
              <div>
                {{ totalData.totalUseIntegral }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>近期使用时间</div>
              <div>
                {{ totalData.integralRecentUseTime || '暂无' }}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'我的客户'+'('+totalData.customerNum+')'" name="customer">
        <el-table :data="customers" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="客户信息" width="150">
            <template slot-scope="scope">
              <div class="user">
                <div class="user-avatar">
                  <div>
                    <el-avatar
                      :size="50"
                      :src="scope.row.customer.avatar"
                    ></el-avatar>
                  </div>
                </div>
                <div class="user-base">
                  <div>{{ scope.row.customer.username?scope.row.customer.username:'--' }}</div>
                  <div>{{ scope.row.customer.fullName?scope.row.customer.fullName:'--' }}</div>
                  <div>{{ scope.row.customer.mobile?scope.row.customer.mobile:'--' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="钱包状态" prop="dcWallet">
            <template slot-scope="scope">
              <span>{{ scope.row.dcWallet?scope.row.dcWallet:'未申请' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="钱包开通时间">
            <template slot-scope="scope">
              <span>{{ scope.row.dcCreateTime?scope.row.dcCreateTime:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="绑定时间" prop="createTime">
            <template slot-scope="scope">
              <span>{{ scope.row.dcCreateTime?scope.row.dcCreateTime:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关系状态">
            <template slot-scope="scope">
              <span>{{ scope.row.statusName?scope.row.statusName:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <el-button type="text">详情</el-button>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 我的店铺 -->
      <el-tab-pane :label="'我的店铺'+'('+totalData.storeNum+')'" name="store">
        <div class="tabs-search">
          <div class="tabs-item">
            <el-input
              v-model="storeSearch"
              placeholder="请输入搜索内容关键字"
              style="width:200px" />
          </div>
          <div class="tabs-search-btn">
            <el-button type="primary" @click="toStoreSearch">搜索</el-button>
            <el-button @click="toStoreReset">重置</el-button>
          </div>
        </div>
        <el-table :data="storeArr" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="店铺编号" width="150" prop="storeNo">
          </el-table-column>
          <el-table-column label="店铺名称">
            <template slot-scope="scope">
              <span>{{ scope.row.storeName?scope.row.storeName:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="店铺类型">
            <template slot-scope="scope">
              <span>{{ scope.row.storeTypeName?scope.row.storeTypeName:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人姓名">
            <template slot-scope="scope">
              <span>{{ scope.row.fullName?scope.row.fullName:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="登录账号">
            <template slot-scope="scope">
              <span>{{ scope.row.loginMobile?scope.row.loginMobile:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开通时间">
            <template slot-scope="scope">
              <span>{{ scope.row.openTime?scope.row.openTime:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="店铺状态">
            <template slot-scope="scope">
              <span>{{ scope.row.statusName?scope.row.statusName:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="协议签署状态" prop="agreementStatusName">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
             <el-button type="text" @click="toStoreDetail(scope.row.storeId)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="'任务结果'+'('+totalData.taskResultNum+')'" name="taskResult">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <div style="margin-right:20px">
            <el-radio v-model="radio" label="all">全部</el-radio>
            <el-radio v-model="radio" label="audit">未审核</el-radio>
            <el-radio v-model="radio" label="normal">审核已通过</el-radio>
            <el-radio v-model="radio" label="failed">审核未通过</el-radio>
          </div>
          <el-form-item>
            <el-input v-model="taskResult_keyword" placeholder="请输入搜索内容关键字"></el-input>
            <el-button type="primary" @click="getTaskResult">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="taskResultList" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="任务单号" prop="userTaskId">
          </el-table-column>
          <el-table-column label="任务名称" prop="userTaskNo"></el-table-column>
          <el-table-column
            label="任务领取时间"
            prop="receiveTime"
          ></el-table-column>
          <el-table-column
            label="领取记录单号"
            prop="id"
          ></el-table-column>
          <el-table-column label="证明文件" prop="createTime">
            <template slot-scope="scope">
              <div>
                <el-image :src="scope.row.resUrls" style="width:50px;height:50px"></el-image>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="任务结果描述"
            prop="remark"
          ></el-table-column>
          <el-table-column
            label="状态"
            prop="statusName"
          ></el-table-column>
          <el-table-column
            label="提交时间"
            prop="createTime"
          ></el-table-column>
          <el-table-column
            label="审核时间"
            prop="auditTime"
          ></el-table-column>
          <el-table-column label="审核原因">
            <template slot-scope="scope">
              <span>{{ scope.row.reason?scope.row.reason:'--' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="userMes.userLevel==='leader'" :label="'我的团员'+'('+totalData.teamNum+')'" name="subordinate">
        <div class="tabs-search">
          <div class="tabs-item">
            <el-input
              v-model="teamSearch"
              placeholder="请输入搜索内容关键字"
              style="width:200px" />
          </div>
          <div class="tabs-search-btn">
            <el-button type="primary" @click="toTeamSearch">搜索</el-button>
            <el-button @click="toTeamReset">重置</el-button>
          </div>
        </div>
        <el-table :data="subLevelUses" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="创客ID" prop="user.userId"></el-table-column>
          <el-table-column label="创客信息" width="200">
            <template slot-scope="scope">
              <div class="user">
                <div class="user-avatar">
                  <el-avatar
                    :size="50"
                    :src="scope.row.user.avatar ? scope.row.user.avatar : './img/avatar.png'"
                  />
                </div>
                <div class="user-base">
                  <div>{{ scope.row.user.username?scope.row.user.username:'--' }}</div>
                  <div>{{ scope.row.user.fullName?scope.row.user.fullName:'--' }}</div>
                  <div>{{ scope.row.user.mobile?scope.row.user.mobile:'--' }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="认证状态">
            <template slot-scope="scope">
              <span>{{ scope.row.authStatus?scope.row.authStatus:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创客类型" prop="userLevelName"></el-table-column>
          <el-table-column label="所属角色" prop="userRoleName"></el-table-column>
          <el-table-column label="所属单位"></el-table-column>
          <el-table-column label="累计邀请店铺数(个)" prop="totalInviteStore"></el-table-column>
          <el-table-column label="累计邀请客户数(个)" prop="totalInviteCustomers"></el-table-column>
          <el-table-column label="招募时间" prop="createTime"></el-table-column>
          <el-table-column label="关系状态" prop="statusName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button type="text" @click="memberDetail(scope.row.user.userId)">详情</el-button> -->
              <el-button v-if="scope.row.status == 'normal' && permissions.remove_member" type="text" @click="delMember(scope.row.user.userId)">移除成员</el-button>
              <el-button v-if="scope.row.status == 'del' && permissions.rejoin_member" type="text" @click="rejoinMember(scope.row.user.userId)">重新加入</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 发布的任务 -->
      <el-tab-pane v-if="userMes.userRole==='publisher'" name="publishTask" :label="'发布的任务'+'('+totalData.taskNum+')'">
        <div class="tabs-search">
          <div class="tabs-item">
            <el-input
              v-model="taskSearch"
              placeholder="请输入搜索内容关键字"
              style="width:200px" />
          </div>
          <div class="tabs-search-btn">
            <el-button type="primary" @click="toTaskSearch">搜索</el-button>
            <el-button @click="toTaskReset">重置</el-button>
          </div>
        </div>
        <el-table :data="TaskArr" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="任务单号" prop="taskNo">
          </el-table-column>
          <el-table-column
            label="任务名称"
            prop="taskName"
          ></el-table-column>
          <el-table-column
            label="任务类型"
            prop="typeName"
          >
          </el-table-column>
          <el-table-column
            label="任务目标(个)"
            prop="taskTarget"
          ></el-table-column>
          <el-table-column
            label="参与人数(个)"
            prop="personNum"
          ></el-table-column>
          <el-table-column
            label="任务预算(元)"
            prop="budget"
          ></el-table-column>
          <el-table-column
            label="任务周期"
            prop="cycle"
          ></el-table-column>
          <el-table-column
            label="地域要求"
            prop="locationName"
          ></el-table-column>
          <el-table-column
            label="发布时间"
            prop="createTime"
          ></el-table-column>
          <el-table-column label="完成时间">
            <template slot-scope="scope">
              <span>{{ scope.row.completeTime?scope.row.completeTime:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间">
            <template slot-scope="scope">
              <span>{{ scope.row.closeTime?scope.row.closeTime:'--' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="任务状态"
            prop="statusName"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button 
                size="mini" 
                type="text"
                @click="handleTaskDetail(scope.row.taskId)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 关联的任务发布者 -->
      <el-tab-pane v-if="userMes.userRole==='stakeholder'" :label="'关联的任务发布者'+'('+totalData.publisherNum+')'" name="publisher">
        <div class="tabs-search">
          <div class="tabs-item">
            <el-input
              v-model="publisherSearch"
              placeholder="请输入搜索内容关键字"
              style="width:200px" />
          </div>
          <div class="tabs-search-btn">
            <el-button type="primary" @click="toPublisherSearch">搜索</el-button>
            <el-button @click="toPublisherSeset">重置</el-button>
          </div>
        </div>
        <el-table :data="publisherArr" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
          <el-table-column label="发布者信息">
            <template slot-scope="scope">
              <div class="user">
                <div class="user-avatar">
                  <el-avatar
                    :size="50"
                    :src="scope.row.avatar ? scope.row.avatar : './img/avatar.png'"
                  />
                </div>
                <div class="user-base">
                  <div>{{ scope.row.username }}</div>
                  <div>{{ scope.row.fullName }}</div>
                  <div>{{ scope.row.mobile }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="所属单位"
            prop="company"
          ></el-table-column>
          <el-table-column
            label="发布的任务数(个)"
            prop="taskNum"
          >
          </el-table-column>
          <el-table-column label="累计创客服务数(个)">

          </el-table-column>
          <el-table-column label="累计创客服务次数(次)">

          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- <el-button 
                type="text"
                size="mini" 
                @click="publisherDetail(scope.row.userId)">
                详情
              </el-button> -->
              <el-button v-if="permissions.distributor_publisher" type="text" @click="cancel_relation(scope.row)">解除关联</el-button>
            </template></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页 -->
    <div v-if="activeTag!='statistical'">
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
    </div>
  </div> 
</template>
<script>
import {
  publisherList,
  TaskList,
  subMembers,
  pageDistriCustomer,
  // disabledDistributorStatus,
  // upLevelDistributor,
  relieve,
  delTeamMember,
  rejoinTeamMember,
  getDistributorStates,
  getTaskResultList,
  getTotalData,
  getStoreList
} from '@/api/distribution/distribution'
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'
export default {
  components: { TablePagination },
  props: {
    userMes: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      customers: [],
      subLevelUses: [],
      publisherArr: [],
      TaskArr: [],
      taskResultList: [],
      storeArr:[],
      publisherSearch: null,
      taskSearch: null,
      teamSearch: null,
      storeSearch:null,
      activeTag: 'statistical',
      search: { status: undefined },
      radio: 'all',
      userId: null,
      relationStatus: true,
      taskResult_keyword: undefined,
      options: [{ dictName: '全部', dictValue: '' }],
      totalData: {},
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.userId = this.$route.params && this.$route.params.userId
    this.getTotal()
  },
  methods: {
    getList() {
      this.getTabChangeList()
    },
    // 表格切换事情
    handleChangeTab() {
      this.getTabChangeList()
    },
    // 
    getTabChangeList() {
      if (this.activeTag === 'customer') {
        this.getCustomers()
      } else if (this.activeTag === 'subordinate') {
        this.getSubLevelUsers()
      } else if (this.activeTag === 'statistical') {
        this.getUserDetail()
      } else if (this.activeTag === 'taskResult') {
        this.getTaskResult()
      } else if (this.activeTag === 'publishTask') {
        this.taskList()
      } else if (this.activeTag === 'publisher') {
        this.publisherTask()
      }else if(this.activeTag === 'store'){
        this.getStoreList()
      }
    },
    // 获取累计数据
    getTotal() {
      getTotalData(this.userId).then(res => {
        this.totalData = res.data.data
        console.debug('totalData', this.totalData)
      })
    },
    // 我的店铺信息
    getStoreList(){
      const params = {
        inviterUserId: this.userId,
        current: this.pagination.current,
        size: this.pagination.size,
        keyword:this.storeSearch,
      }
      getStoreList(params).then(res=>{
        console.debug('res',res)
        this.storeArr = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // 我的客户信息
    getCustomers() {
      const params = {
        userId: this.userId,
        current: this.pagination.current,
        size: this.pagination.size
      }
      pageDistriCustomer(params).then(res => {
        this.customers = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // 任务结果
    getTaskResult() {
      if (this.radio === 'all') {
        this.radio = undefined
      }
      const data = {
        userId: this.userId,
        keyword: this.taskResult_keyword,
        size: this.pagination.size,
        current: this.pagination.current,
        status: this.radio
      }
      getTaskResultList(data).then(res => {
        this.taskResultList = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // 我的团队信息
    getSubLevelUsers() {
      const query = Object.assign({}, this.search)
      query.size = this.pagination.size
      query.current = this.pagination.current
      query.userId = this.userId
      query.keyword = this.teamSearch
      subMembers(query).then(res => {
        this.subLevelUses = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // 移除团员
    delMember(memberId) {
      this.$confirm('确定将此成员移除吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTeamMember(memberId).then(res => {
          this.$message({
            type: 'success',
            message: '移除成功!'
          })
          this.getSubLevelUsers()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        })          
      })
    },
    // 重新加入成功
    rejoinMember(memberId) {
      this.$confirm('确定将此成员重新加入吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          memberId: memberId,
          userId: this.userId
        }
        rejoinTeamMember(data).then(res => {
          this.$message({
            type: 'success',
            message: '重新加入成功!'
          })
          this.getSubLevelUsers()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重新加入'
        })          
      })
    },
    // 去团员详情
    // memberDetail(userId) {
    //   this.$router.push(`/distribution/details/${userId}`)
    // },
    // 团队搜索
    toTeamSearch() {
      this.getSubLevelUsers()
    },
    // 团队重置
    toTeamReset() {
      this.teamSearch = null
      this.getSubLevelUsers()
    },
    // 去店铺详情
    toStoreDetail(storeId) {
      this.$router.push(`business/store/detail?storeId=${storeId}`)
    },
    // 店铺搜索
    toStoreSearch() {
      this.getStoreList()
    },
    // 店铺重置
    toStoreReset() {
      this.storeSearch = null
      this.getStoreList()
    },
    // 根据顶级收益者ID分页查询任务发布者列表(关联的)
    publisherTask() {
      const data = {
        userId: this.userMes.user.userId,
        relationStatus: this.relationStatus,
        current: this.pagination.current,
        size: this.pagination.size,
        keyword: this.publisherSearch
      }
      publisherList(data).then(res => {
        this.publisherArr = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    //关联任务发布者搜索 
    toPublisherSearch() {
      this.publisherTask()
    },
    //关联任务发布者重置
    toPublisherSeset() {
      this.publisherSearch = null
      this.publisherTask()
    },
    // 发布的任务
    taskList() {
      const data = {
        userId: this.userMes.user.userId,
        current: this.pagination.current,
        size: this.pagination.size,
        keyword: this.taskSearch
      }
      TaskList(data).then(res => {
        this.TaskArr = res.data.data.records
        this.pagination.total = res.data.data.total
        this.pagination.pages = res.data.data.pages
      })
    },
    // publisherDetail(val){
    //   this.$router.push(`/task/details/${val}`)
    // },
    // 解除关联
    cancel_relation(row) {
      this.$confirm('是否解除与“' + row.name + '”任务发布者的关联？解除后，将无法查看该任务发布者发布的所有任务数据。?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          publisherIds: this.publisherIds,
          userId: this.userId
        }
        relieve(data).then(res => {
          if (res.data.data) {
            this.$message({
              type: 'success',
              message: '解除关联成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解除关联'
        })          
      })
    },
    // 去任务详情
    handleTaskDetail(val) {
      this.$router.push(`/task/details/${val}`)
    },
    //发布的任务搜索
    toTaskSearch() {
      this.taskList()
    },
    //发布的任务重置
    toTaskReset() {
      this.taskSearch = null
      this.taskList()
    },
    // 查询分销员状态类型
    getDistributorStatesList() {
      getDistributorStates().then(res => {
        this.options = this.options.concat(res.data.data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px;
  }
  .tabs-select{
    text-align: right;
  }
  .statistical {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    flex-direction: column;
  }
  .statis-type {
    padding: 10px 0px;
  }
  .statistical-item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    margin-top: 20px;
    margin-bottom: 30px;
    .statistical-item-div {
      // width: 200px;
      margin-right: 50px;
    }
    .statistical-item:nth-of-type(1) {
      display: flex;
      flex-direction: column;
      height: 50px;
      justify-content: center;
      color: #000000;
      font-weight: bold;
    }
    .statistical-item-div:not(:nth-of-type(1)) {
      display: flex;
      flex-direction: column;
      height: 50px;
      justify-content: space-between;
      color: #838383;
    }
  }
  .statistical-item-item{
    margin: 5px 0px;
    div{
      color: #797979;
    }
  }
  .user {
    display: flex;
    justify-content: space-around;
    text-align: center;
    .user-avatar {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
    }
    .user-base {
      width: 180px;
    }
  }
  .tabs-search {
    display: flex;
    margin-bottom: 20px;
    justify-content: flex-end;
    .tabs-item {
      margin-right: 20px;
    }
    .tabs-search-btn {
      display: flex;
      div {
        width: 50px;
        height: 30px;
      }
    }
  }
</style>
