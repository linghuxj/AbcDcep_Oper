<template>
  <div class="main-content">
    <div style="position:absolute;top:0px;right:40px">
      <wel-tag :type="type">
        {{ funStatus(refundDetail.auditStatus) }}
      </wel-tag>
    </div>
    <aside-tip content="退款信息" />
    <!-- <div style="display:flex"> -->
    <div class="main-item">
      <div>退款单号：{{ refundDetail.refundNo }}</div>
      <div>申请退款时间：{{ refundDetail.createTime }}</div>
    </div>
    <div class="main-item">
      <div>申请退款额度(金额+米粒)：{{ refundDetail.refundAmount }}+{{ refundDetail.refundIntegral }}</div>
      <div>退款原因：{{ refundDetail.reason?refundDetail.reason:'--' }}</div>
    </div>
    <aside-tip content="订单信息" />
    <div class="main-item">
      <div>订单编号：{{ refundDetail.orderNo?refundDetail.orderNo:'--' }}</div>
      <div>买家信息：{{ (refundDetail.user&&refundDetail.user.user)?refundDetail.user.username:'--' }}
        ({{ (refundDetail.user&&refundDetail.user.mobile)?refundDetail.user.mobile:'--' }})</div>
    </div>
    <div class="main-item">
      <div>下单时间：{{ refundDetail.createTime }}</div>
      <div>卖家信息：{{ (refundDetail.store && refundDetail.store.storeName)?refundDetail.store.storeName:'--' }}
        ({{ (refundDetail.store && refundDetail.store.mobile)?refundDetail.store.mobile:'--' }})</div>
    </div>
    <div class="main-item">
      <div>交易流水号：{{ refundDetail.transactionId }}</div>
    </div>
    <aside-tip content="商品信息" />
    <el-table
      v-loading="interactive.tableLoading"
      :data="refundDetail.orderItems"
      border
      :header-cell-style="{background:'#02a7f0',color:'#FFF'}"
      style="width: 100%;margin-bottom:10px"
    >
      <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      <el-table-column prop="specName" label="商品规格"></el-table-column>
      <el-table-column prop="currentPrice" label="单价(金额+米粒)"></el-table-column>
      <el-table-column prop="quantity" label="数量"></el-table-column>
      <el-table-column prop="totalAmount" label="小计(金额+米粒)"></el-table-column>
    </el-table>
    <!-- 详情不显示这个 -->
    <div v-if="isExamine">
      <aside-tip content="审核结果" />
      <div v-if="refundDetail.auditStatus==='audit'" class="examin_result">
        <div class="examin_result_item">
          <div class="examin_result_item_lable">审核结果：</div>
          <el-radio v-model="other.radio" label="normal">同意退款</el-radio>
          <el-radio v-model="other.radio" label="failed">拒绝退款</el-radio>
        </div>
        <div v-if="other.radio==='failed'"> 
          <div class="examin_result_item">
            <div class="examin_result_item_lable">常用语：</div>
            <el-select v-model="other.select_reason" placeholder="请选择" :disabled="other.enter_reason">
              <el-option v-for="item in reasonArr" :key="item.id" :label="item.reason" :value="item.reason"></el-option>
            </el-select>
          </div>
          <textarea 
            v-model="other.enter_reason"
            placeholder="请自定义拒绝退款的原因"
            :disabled="other.select_reason"
          >
          </textarea>
        </div>
      </div>
      <div v-else-if="refundDetail.auditStatus==='failed'">
        <div class="main-item">审核结果：{{ refundDetail.auditStatusName }}</div>
        <div class="main-item">拒绝原因：{{ refundDetail.remark?refundDetail.remark:'--' }}</div>
        <div class="main-item">审核时间：{{ refundDetail.auditTime }}</div>
      </div>
      <div v-else>
        <div class="main-item">审核结果：{{ refundDetail.auditStatusName }}</div>
        <div class="main-item">审核时间：{{ refundDetail.auditTime }}</div>
        <div class="main-item">退款时间：{{ refundDetail.createTime }}</div>
        <div class="main-item">交易流水号：{{ refundDetail.outRefundNo?refundDetail.outRefundNo:'--' }}</div>
      </div>
    </div>
    <div v-if="isExamine" class="btn">
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" :loading="interactive.loading" @click="to_submit()">保存</el-button>
    </div>
  </div>
</template>
<script>
import AsideTip from '@/template/aside/index'
import { getByIdrefund, auditRefund } from '@/api/refund/index'
import { getReasonAll } from '@/api/reason'
import WelTag from '@/template/Wel-Tag/index.vue'
export default {
  components: { AsideTip, WelTag },
  props: {
    isExamine: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      interactive: {
        tableLoading: false,
        loading: false
      },
      parameter: {
        refundId: undefined,
        auditStatus: undefined,
        remark: undefined
      },
      tableData: [],
      refundDetail: {},
      other: {
        radio: 'normal',
        select_reason: undefined,
        enter_reason: undefined
      },
      type: '',
      reasonArr: []
    }
  },
  created() {
    console.debug('isExamine', this.isExamine)
    if (this.$route.query.refundId) {
      this.parameter.refundId = this.$route.query.refundId
      this.$nextTick(() => {
        this.getDetail()
      })
    }
    this.getReasonAll()
  },
  methods: {
    // 查询详情
    getDetail() {
      getByIdrefund(this.parameter.refundId).then(res => {
        this.refundDetail = res.data.data
      })
    },
    // 查询审核不通过列表
    getReasonAll() {
      // 类型(任务审核:task、店铺审核：store、订单取消：order_cancel、订单拒绝退款：order_refuse_refund)
      getReasonAll('order_refuse_refund').then(res => {
        this.reasonArr = res.data.data
      })
    },
    // 去保存审核
    to_submit() {
      if (!this.other.enter_reason && !this.other.select_reason && this.other.radio === 'failed') {
        this.$message.warning('请选择或输入审核不通过原因')
        return
      }
      this.paramter = {
        refundId: this.parameter.refundId,
        auditStatus: this.other.radio,
        remark: this.other.select_reason ? this.other.select_reason : this.other.enter_reason
      }
      this.interactive.loading = true
      auditRefund(this.paramter).then(res => {
        this.interactive.loading = false
        this.$message.success('提交成功')
        this.$router.go(-1)
      }).catch(() => {
        this.interactive.loading = false
      })
    },
    // 状态判断
    funStatus(val) {
      if (!val) {
        this.type = ''
        return ''
      }
      if (val === 'audit') {
        this.type = ''
        return '待处理'
      }
        
      if (val === 'failed') {
        this.type = 'danger'
        return '已拒绝'
      }
      
      if (val === 'normal') {
        this.type = 'primary'
        return '已同意'
      }
      
      this.type = ''
      return '待处理'
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content {
  font-size: 14px;
  color: #666;
  position: relative;
}
.main-item {
  display: flex;
  justify-content: space-between;
  margin: 0px 25px;
  margin-bottom:10px;
}
.examin_result {
  margin-left: 25px;
  div{
    margin-bottom: 10px;
  }
  .examin_result_item {
    display: flex;
  }
  .examin_result_item_lable{
    width: 70px;
  }
  textarea{
    margin-left: 70px;
  }
}
.btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
}
</style>
