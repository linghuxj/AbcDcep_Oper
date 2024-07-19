<template>
  <div class="storeDetail-content">
    <div class="main-top">
      
      <div class="main-top-item">
        <div class="item">
          <h2>{{ storeMes.lotteryName?storeMes.lotteryName:'--' }}</h2>
        </div>
        <div class="item">
          活动类型：{{ storeMes.lotteryTypeName?storeMes.lotteryTypeName:'--' }}
        </div>
        <div class="item">
          
        </div>
      </div>
      <div class="main-top-item">
        <div class="item">
          参与人范围：{{ storeMes.partUserTypeName?storeMes.partUserTypeName:'--' }}
        </div>
        <div class="item">
          参与次数：{{ luckyFun(storeMes) }}
        </div>
        <div class="item">
          活动时间：{{ storeMes.startTime?storeMes.startTime:'--' }} 至 {{ storeMes.endTime?storeMes.endTime:'--' }}
        </div>
      </div>
      <div class="status">
        <wel-tag :type="type">{{ handleStatus(storeMes.status) }}</wel-tag>
      </div>
      <el-collapse>
        <el-collapse-item title="活动规则" name="1">
          <div>{{ storeMes.lotteryDesc }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="main-bottom">
      <el-tabs v-model="interactive.activeName">
        <el-tab-pane label="奖项" name="first">
          <el-table
            v-loading="interactive.fTableLoading"
            :empty-text="$t('message.table_empty_text')"
            :data="fTableData"
            border
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width: 100%"
          >
            <el-table-column label="序号" align="center" width="80">
              <template slot-scope="scope">
                <span>{{ scope.$index+(pagination.current - 1) * pagination.size + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="图片" align="center">
              <template slot-scope="scope">
                <div class="content-wrap">
                  <el-image
                    :src="scope.row.prizeImage"
                    fit="cover"
                    :preview-src-list="[scope.row.prizeImage]"
                  />
                </div>
              </template>
            </el-table-column>
        
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.prizeName?scope.row.prizeName:'--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="奖品" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.prizeTypeName?scope.row.prizeTypeName:'--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.totalNum?scope.row.totalNum:'0' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="中奖概率（%）" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.winRatio?scope.row.winRatio:'0' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="中奖人数" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.logCount?scope.row.logCount:'0' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="抽奖记录" name="second">
          <div class="store-search">
            <el-input v-model="parameter.keyword" placeholder="请输入搜索内容关键字">
              <el-button slot="append" type="primary" @click="getSearch">搜索</el-button>
            </el-input>
          </div> 
          <el-table
            v-loading="interactive.tableLoading"
            :empty-text="$t('message.table_empty_text')"
            :data="tableData"
            border
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width: 100%"
          >
            <el-table-column label="序号" align="center" width="80">
              <template slot-scope="scope">
                <span>{{ scope.$index+(pagination.current - 1) * pagination.size + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户ID" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.userId?scope.row.userId:'--' }}</span>
              </template>
            </el-table-column>
        
            <el-table-column label="手机号" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.mobile?scope.row.mobile:'--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="抽奖时间" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime?scope.row.createTime:'--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="抽奖结果" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.prizeTypeName?scope.row.prizeTypeName:'--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.statusName?scope.row.statusName:'--' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.prizeType === 'goods'">
                  <el-button 
                    v-if="scope.row.status === 'wait_send' && permissions.lottery_deliver"
                    type="text"
                    size="mini"
                    style="color:#409eff"
                    @click="handleWaitSend(scope.row)">去发货</el-button>
                  <el-button 
                    v-else-if="scope.row.status === 'wait_receive' && permissions.lottery_affirm_finished"
                    type="text"
                    size="mini"
                    style="color:#409eff"
                    @click="handleWaitReceive(scope.row)">确认收货</el-button>
                  <el-button 
                    v-else-if="scope.row.status === 'has_change'"
                    type="text"
                    size="mini"
                    style="color:#409eff"
                    @click="handleNot(scope.row)">发货信息</el-button>
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <table-pagination
            v-show="pagination.total>0"
            :total="pagination.total"
            :page.sync="pagination.current"
            :limit.sync="pagination.size"
            @pagination="getSearch" />
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="interactive.WaitSendLoading" width="40%">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-image
              style="width: 100%; height: 80px"
              :src="temp.prizeImage"
              fit="contain" />
          </el-col>
          <el-col :span="18"><h2>{{ temp.prizeName }}</h2></el-col>
        </el-row>
        <el-form-item label="收货人信息：">
          <span>{{ temp.express?temp.express.fullName:'' }} （{{ temp.express?temp.express.mobile:'' }}）</span>
        </el-form-item>
        <el-form-item label="收货地址：">
          <span>{{ temp.express?temp.express.locationName:'' }}{{ temp.express?temp.express.address:'' }}</span>
        </el-form-item>
        <el-form-item label="抽奖时间：">
          <span>{{ temp.createTime }}</span>
        </el-form-item>
        <el-form-item label="兑换时间：">
          <span>{{ temp.changeTime }}</span>
        </el-form-item>
        <el-form-item label="物流公司：" prop="express.expressCompany">
          <el-input v-if="dialogStatus==='create'" v-model="temp.express.expressCompany" placeholder="请输入物流公司名称" />
          <span v-else>{{ temp.express?temp.express.expressCompany:'' }}</span>
        </el-form-item>
        <el-form-item label="物流单号：" prop="express.expressNum">
          <el-input v-if="dialogStatus==='create'" v-model="temp.express.expressNum" placeholder="请输入物流单号" />
          <span v-else>{{ temp.express?temp.express.expressNum:'' }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.WaitSendLoading=false">
          取消
        </el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getLotteryMesById, getLotteryPrizePage, getLotteryLogPage, deliverLottery, finishedLottery } from '@/api/operate/lottery'
import WelTag from '@/template/Wel-Tag/index.vue'
import TablePagination from '@/components/table-pagination'

export default {
  name: 'TurntableDetails',
  components: { WelTag, TablePagination },
  data() {
    return {
      storeMes: {},
      // 右侧状态图形显示状态
      type: '',
      tableData: [],
      fTableData: [],
      dialogStatus: '',
      textMap: {
        detail: '发货信息',
        create: '物品发货'
      },
      temp: {
        express: {
          address: '',
          createTime: '',
          expressCompany: '',
          expressNum: '',
          fullName: '',
          id: undefined,
          location: '',
          locationName: '',
          mobile: ''
        },
        userId: undefined
      },
      //表示参数类
      parameter: {
        keyword: undefined
      },
      parame: {
        lotteryId: undefined
      },
      // 操作类型
      interactive: {
        fTableLoading: false,
        tableLoading: false,
        activeName: 'first',
        WaitSendLoading: false
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      rules: {
        'express.expressCompany': [
          { required: true, message: '请输入物流公司名称', trigger: 'change' }
        ],
        'express.expressNum': [
          { required: true, message: '请输入物流单号', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.parame.lotteryId = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.findStore()
      this.getPrizePage()
      this.getSearch()
    })
  },
  methods: {
    // 获取店铺详情
    findStore() {
      getLotteryMesById(this.parame.lotteryId).then(res => {
        this.storeMes = res.data.data
      })
    },
    getPrizePage() {
      this.interactive.fTableLoading = true
      
      getLotteryPrizePage(this.parame.lotteryId).then(resp => {
        const page = resp.data.data
        this.fTableData = page
        this.interactive.fTableLoading = false
      }).catch(e => {
        this.interactive.fTableLoading = false
      })
    },
    getSearch() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination, this.parame)
      getLotteryLogPage(listQuery).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
      }).catch(e => {
        this.interactive.tableLoading = false
      })
    },
    // 编辑
    to_edit(row) {
      this.$router.push(`/business/store/compile/${row}`)
    },
    luckyFun(val) {
      if (!val) {
        return '--'
      }
      let name = ''
      if (val.partNumTypeName) {
        name = val.partNumTypeName
      } else {
        name = ''
      }
      let value = ''
      if (val.partNum) {
        value = val.partNum
      } else {
        value = '--'
      }
      return name + value + '次'
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
    },
    // 去发货
    handleWaitSend(val) {
      this.temp = Object.assign({}, this.temp, val)
      console.log(this.temp)
      this.dialogStatus = 'create'
      this.interactive.WaitSendLoading = true
    },
    // 提交发货信息
    createData() {
      const progress = {
        expressCompany: this.temp.express.expressCompany,
        expressNum: this.temp.express.expressNum,
        id: this.temp.express.id
      }
      deliverLottery(progress).then(resp => {
        this.$message({
          type: 'success',
          message: '提交成功!'
        })
        this.interactive.WaitSendLoading = false
        this.getSearch()
      }).catch(e => {
        this.interactive.WaitSendLoading = false
      })
    },
    // 确认收货
    handleWaitReceive(val) {
      this.$confirm('确定该商品已收货？', '收货提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const market = {
          logId: val.logId,
          userId: val.userId
        }
        finishedLottery(market, val.logId).then(res => {
          this.getSearch()
        }) 
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })          
      })
    },
    // 发货信息
    handleNot(val) {
      this.temp = Object.assign({}, this.temp, val)
      console.log(this.temp)
      this.dialogStatus = 'detail'
      this.interactive.WaitSendLoading = true
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
  background-color: #FFF;
  margin-bottom: 20px;
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
  background-color: #FFF;
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
.el-input-group{
  width: 260px;
}
.content-wrap {
  display: flex;
  height: 100px;
  line-height: 100px;
  flex-direction: column;
  justify-content: center;
}
</style>
