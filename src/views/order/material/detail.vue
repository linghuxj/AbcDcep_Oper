<template>
  <div class="orderDetail-content">
    <div class="orderDetail-main-top">
      <div class="main-title">
        <div></div>
        基本信息
      </div>
      <div class="order-status">
        <wel-tag :type="type">{{ handleStatus(detailForm.status) }}</wel-tag>
      </div>
      <div class="main-top-content">
        <div class="main-top-item">
          <div>
            订单编号：{{ detailForm.orderNo ? detailForm.orderNo : '--' }}
          </div>
          <div>
            运费：{{ detailForm.expressFee ? detailForm.expressFee : '--' }}
          </div>
          <div>
            实付金额+实付米粒：{{
              detailForm.payAmount ? detailForm.payAmount : '0.00'
            }}元 +
            {{
              detailForm.payIntegralAmount ? detailForm.payIntegralAmount : '0'
            }}
          </div>
          <div>
            物流公司：{{
              detailForm.express ? detailForm.express.expressCompany : '--'
            }}
          </div>
        </div>
        <div class="main-top-item">
          <div>
            下单时间：{{ detailForm.createTime ? detailForm.createTime : '--' }}
          </div>
          <div>
            支付时间：{{ detailForm.payTime ? detailForm.payTime : '--' }}
          </div>
          <div>
            支付方式：{{
              detailForm.payModeName ? detailForm.payModeName : '--'
            }}
          </div>
          <div>
            物流单号：{{
              detailForm.express ? detailForm.express.expressNum : '--'
            }}
          </div>
        </div>
        <div class="main-top-item">
          <div>
            收货人姓名：{{
              detailForm.express ? detailForm.express.fullName : '--'
            }}
          </div>
          <div>
            收货地址：{{
              detailForm.express ? detailForm.express.locationName : ''
            }}{{ detailForm.express ? detailForm.express.address : '--' }}
          </div>
          <div>
            交易流水号：{{
              detailForm.express ? detailForm.express.tradeNo : '--'
            }}
          </div>
        </div>
      </div>
    </div>
    <!-- 商品信息 -->
    <div class="main-item">
      <div class="main-title">
        <div></div>
        商品信息
      </div>
      <div class="main-table">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          class="el_table"
        >
          <el-table-column label="店铺名称">
            <template slot-scope="scope">
              <span>{{
                scope.row.storeName ? scope.row.storeName : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" width="200">
            <template slot-scope="scope">
              <div>{{ scope.row.goodsName ? scope.row.goodsName : '--' }}</div>
              <div>{{ scope.row.specName ? scope.row.specName : '--' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="单价(金额+米粒)">
            <template slot-scope="scope">
              <span
                >{{
                  scope.row.currentPrice ? scope.row.currentPrice : '0.00'
                }}
                +
                {{
                  scope.row.currentIntegral ? scope.row.currentIntegral : '0'
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <span>{{ scope.row.quantity ? scope.row.quantity : '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="活动优惠(元)">
            <template slot-scope="scope">
              <span>{{
                scope.row.discountAmount
                  ? scope.row.discountAmount
                  : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠券优惠(元)">
            <template slot-scope="scope">
              <span>{{
                scope.row.couponDiscountAmount ? scope.row.couponDiscountAmount : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="小计(金额+米粒)">
            <template slot-scope="scope">
              <span
                >{{ scope.row.totalAmount ? scope.row.totalAmount : '0.00' }} +
                {{
                  scope.row.totalIntegralAmount
                    ? scope.row.totalIntegralAmount
                    : '0'
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="入账米粒">
            <template slot-scope="scope">
              <span>{{
                scope.row.incomeIntegral ? scope.row.incomeIntegral : '0'
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 取消信息 -->
    <div v-if="detailForm.status === 'canceled'" class="main-item">
      <div class="main-title">
        <div></div>
        取消信息
      </div>
      <div class="main-item-content">
        <ul>
          <li>
            取消时间：{{ detailForm.cancelTime ? detailForm.cancelTime : '--' }}
          </li>
          <li>
            操作人：{{
              detailForm.cancelUser ? detailForm.cancelUser.username : '--'
            }}（{{
              detailForm.cancelUser ? detailForm.cancelUser.mobile : '--'
            }}）
          </li>
          <li>
            取消原因：{{
              detailForm.cancelReason ? detailForm.cancelReason : '--'
            }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 退款信息 -->
    <div v-if="detailForm.refund" class="main-item">
      <div class="main-title">
        <div></div>
        退款信息
      </div>
      <div class="main-item-content">
        <ul>
          <li>
            退款单号：{{
              detailForm.refund ? detailForm.refund.refundNo : '--'
            }}
          </li>
          <li>
            退款时间：{{
              detailForm.refund ? detailForm.refund.auditTime : '--'
            }}
          </li>
          <li>审核人：{{ refundAudit(detailForm.refund) }}</li>
          <li>
            审核时间：{{
              detailForm.refund ? detailForm.refund.auditTime : '--'
            }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getOrderById } from '@/api/order/card'
import WelTag from '@/template/Wel-Tag/index.vue'

export default {
  components: { WelTag },
  data() {
    return {
      type: '',
      detailForm: {},
      tableLoading: false,
      tableData: []
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.getDetail(id)
    })
  },
  methods: {
    getDetail(id) {
      getOrderById(id).then(res => {
        console.debug('res', res.data.data)
        this.detailForm = res.data.data
        this.tableData = this.detailForm.orderItems
        for (let index = 0; index < this.tableData.length; index++) {
          const element = this.tableData[index]
          if (this.detailForm.store) {
            element.storeName = this.detailForm.store.storeName
          }
        }
        console.log(this.tableData, 99)
      })
    },
    // 订单状态
    handleStatus(val) {
      if (!val) {
        this.type = ''
        return ''
      }

      if (val === 'canceled') {
        this.type = 'warning'
        return '已关闭'
      }

      if (val === 'wait_pay') {
        this.type = 'danger'
        return '待付款'
      }

      if (val === 'finished') {
        this.type = 'info'
        return '已完成'
      }

      if (val === 'wait_send') {
        this.type = 'primary'
        return '待发货'
      }
      this.type = 'wait_receive'
      return '已发货'
    },
    refundAudit(val) {
      // console.debug(val)
      if (!val) {
        return '--（--）'
      }
      const mobile = '--'
      let name = '--'
      if (!val.auditUser) {
        const user = name + '（' + mobile + '）'
        return user
      }
      if (val.auditUser.username) {
        name = val.auditUser.username
      } else {
        name = '--'
      }
      if (val.auditUser.mobile) {
        name = val.auditUser.mobile
      } else {
        name = '--'
      }
      const user = name + '（' + mobile + '）'
      return user
    }
  }
}
</script>
<style lang="scss" scoped>
.orderDetail-content {
  margin: 10px 20px;
}
.orderDetail-main-top {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px 30px;
  position: relative;
}
.main-top-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 10px 0px;
}
.main-title {
  display: flex;
  align-items: center;
  div {
    width: 3px;
    height: 10px;
    background-color: #1890ff;
    margin-right: 10px;
  }
}
.main-top-item {
  flex: 1;
  div {
    margin: 15px 0px;
  }
}
.main-table {
  margin-top: 10px;
  text-align: right;
}
.main-item {
  background-color: #fff;
  padding: 20px 30px;
  margin-bottom: 10px;
}
.main-item-content {
  ul {
    margin: 0px;
    padding: 0px;
    font-size: 13px;
  }
  li {
    list-style-type: none;
    margin: 10px;
  }
}
.order-status {
  position: absolute;
  right: 15px;
  top: 30px;
}
</style>
