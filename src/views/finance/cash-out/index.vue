/**
* 提现
*/

<template>
  <div class="main-content">
    <div v-if="permissions.withdraw_conf" style="margin-bottom:10px;">
      <el-button type="primary" @click="accountSetUp()">账户余额提现设置</el-button>
      <el-button type="primary" @click="bondSetUp()">保证金提现设置</el-button>
    </div>
    <el-form :inline="true" :model="search">
      <el-form-item label="创客搜索：">
        <el-select
          v-model="search.searchType"
          placeholder="请选择"
          style="width: 30%"
        >
          <el-option label="姓名" value="fullName"></el-option>
          <el-option label="手机号" value="mobile"></el-option>
        </el-select>
        <el-input
          v-model="search.searchValue"
          placeholder="请输入内容"
          style="width: 70%"
        ></el-input>
      </el-form-item>
      <el-form-item label="提现单号：">
        <el-input v-model="parameter.withdrawOrderId" placeholder="请输入提现单号"></el-input>
      </el-form-item>
      <el-form-item label="提现状态：">
        <el-select v-model="parameter.payStatus" placeholder="请选择">
          <el-option v-for="(item,index) in payStatusAll" :key="index" :label="item.dictName" :value="item.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item label="提现类型：">
        <el-select v-model="parameter.walletType" placeholder="请选择">
          <el-option v-for="(item,index) in walletTypeArr" :key="index" :label="item.dictName" :value="item.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    
    <div style="margin-top: 10px">
      <el-tabs v-model="interactive.activeName" @tab-click="handleClick">
        <el-tab-pane label="待审核" name="audit">
        </el-tab-pane>
        <el-tab-pane label="审核已通过" name="normal">
        </el-tab-pane>
        <el-tab-pane label="审核不通过" name="failed">
        </el-tab-pane>
      </el-tabs>
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column prop="withdrawOrderId" label="提现单号" />
        <el-table-column label="创客信息">
          <template slot-scope="scope">
            <div>{{ numFilter(scope.row.user) }}</div>
            <div>{{ numMobile(scope.row.user) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="提现类型" prop="walletTypeName"/>
        <el-table-column label="提现渠道">
          <template slot-scope="scope">
            <span>{{ scope.row.channelType?scope.row.channelType:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="withdrawAmount" label="提现金额（元）" />
        <el-table-column prop="withdrawFees" label="手续费（元）" />
        <el-table-column prop="createTime" label="申请时间" />
        <el-table-column v-if="interactive.activeName === 'normal'" key="status" prop="payStatusName" label="提现状态" />
        <!-- <el-table-column v-if="interactive.activeName === 'normal'" key="wId" prop="withdrawId" label="提现单号" /> -->
        <el-table-column v-if="interactive.activeName != 'audit'" label="审核人信息">
          <template slot-scope="scope">
            <div>{{ numFilter(scope.row.auditUser) }}</div>
            <div>{{ numMobile(scope.row.auditUser) }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="interactive.activeName != 'audit'" prop="auditTime" label="审核时间" />
        <el-table-column v-if="interactive.activeName === 'failed'" prop="remark" label="原因" />
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="interactive.activeName === 'audit'" type="text" @click="to_audit(scope.row)">审核</el-button>
            <!-- <el-button v-else type="text" @click="to_audit(scope.row)">详情</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        v-show="pagination.total>0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList" />
    </div>
    <el-dialog
      title="提现审核"
      :visible.sync="interactive.dialogVisible"
      width="30%">
      <el-form :model="temp">
        <el-form-item label="审核结果：">
          <el-radio-group v-model="temp.status">
            <el-radio label="normal">审核通过</el-radio>
            <el-radio label="failed">审核不通过</el-radio>
          </el-radio-group>
          <el-input
            v-if="temp.status==='failed'"
            v-model="temp.remark"
            type="textarea"
            placeholder="填写审核不通过原因"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5}"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitToExamine">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { getWithdrawPage, getWithdrawPayStatus, upWithdrawStatus, getWalletType } from '@/api/finance/withdraw'


export default {
  components: { TablePagination },
  data() {
    return {
      payStatusAll: [],
      //表示参数类
      search: {
        searchType: undefined,
        searchValue: undefined
      },
      parameter: { 
        withdrawOrderId: undefined,
        payStatus: undefined,
        // audit-待审核  normal-审核通过   failed-审核未通过
        status: 'audit',
        walletType: undefined
      },
      walletTypeArr: [],
      tableData: [],
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogVisible: false,
        activeName: 'audit'
      },
      temp: {
        remark: undefined,
        status: undefined,
        withdrawId: undefined
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
    this.getWithdrawPayStatus()
    this.getWalletType()
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    // 去审核
    to_audit(row) {
      this.temp = {
        remark: undefined,
        status: undefined,
        withdrawId: row.withdrawId
      }
      this.interactive.dialogVisible = true
    },
    //去账户余额提现设置页面
    accountSetUp() {
      this.$router.push(`/finance/withdrawal-set/account-set`)
    },
    //保证金提现设置页面
    bondSetUp() {
      this.$router.push(`/finance/withdrawal-set/bond-set`)
    },
   // 查询店铺类型
    getWalletType() {
      getWalletType().then(res => {
        console.debug('res', res)
        this.walletTypeArr = res.data.data
      })
    },
    // 查询提现状态
    getWithdrawPayStatus() {
      getWithdrawPayStatus().then(res => {
        this.payStatusAll = res.data.data
      })
    },
    // 查询列表
    getList() {
      const parameter = Object.assign({}, this.parameter, this.pagination)
      if (this.search.searchType) {
        parameter[this.search.searchType] = this.search.searchValue
      }
      parameter.status = this.interactive.activeName
      this.interactive.tableLoading = true
      getWithdrawPage(parameter).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
      }).catch(() => {
        this.interactive.tableLoading = false
      })
    },
    // 重置
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined
      }
      this.parameter = { 
        withdrawOrderId: undefined,
        payStatus: undefined,
        // audit-待审核  normal-审核通过   failed-审核未通过
        status: this.parameter.status
      }
      this.getList()
    },
    // tab 切换
    handleClick(tab) {
      if (tab.name === 'audit') {
        this.parameter.status = 'audit'
      } else if (tab.name === 'passed') {
        this.parameter.status = 'passed'
      } else if (tab.name === 'unpassed') {
        this.parameter.status = 'unpassed'
      }
      this.getList()
    },
    // 打开审核弹窗
    openToExaminePopup(val) {
      this.temp = {
        remark: undefined,
        status: undefined,
        withdrawId: val
      }
      this.interactive.dialogVisible = true
    },
    // 提交审核结果
    submitToExamine() {
      if (!this.temp.status) {
        this.$message.error('请选择审核结果!')
        return false
      } 
      if (this.temp.status === 'failed') {
        if (!this.temp.remark) {
          this.$message.error('请填写审核不通过原因!')
          return false
        }
      }
      upWithdrawStatus(this.temp).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功！'
        })
        this.interactive.dialogVisible = false
        this.getList()
      })
    },
    // 数据处理
    numFilter(val) {
      if (!val) {
        return '--'
      }

      if (val.fullName) {
        return val.fullName
      }

      if (val.username) {
        return val.username
      }

      return '--'
    },
    numMobile(val) {
      if (!val) {
        return '--'
      }

      if (val.mobile) {
        return val.mobile
      } else {
        return '--'
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
