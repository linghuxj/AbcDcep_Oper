<template>
  <div class="business">
    <!-- 右上角状态标签 -->
    <div
      v-if="detail.status"
      :class="detail.status !== 'finish' ? 'status' : 'status red'"
    >
      {{ detail.statusName }}
    </div>
    <div class="coupon-message">
      <div class="coupon-message-item">
        <div class="coupon-name">{{ detail.couponName }}</div>
        <div>优惠内容：{{ detail | preferentialContent }}</div>
        <div>发行量：{{ detail.quota === -1 ? '无限制' : detail.quota }}</div>
        <div>
          已使用：{{ statisticsData.usedCount ? statisticsData.usedCount : 0 }}
        </div>
      </div>
      <div class="coupon-message-item">
        <div>
          适用渠道：{{
            detail.relationTypeName ? detail.relationTypeName : '--'
          }}
        </div>
        <div>
          有效期：{{
            detail.validDays
              ? `领取之后${detail.validDays}天内有效`
              : `${detail.validStartTime}--${detail.validEndTime}`
          }}
        </div>
        <div>
          待领取：{{
            statisticsData.unclaimedCount === -1
              ? '无限制'
              : statisticsData.unclaimedCount
              ? statisticsData.unclaimedCount
              : 0
          }}
        </div>
        <div>
          未使用：{{
            statisticsData.unusedCount === -1
              ? '无限制'
              : statisticsData.unusedCount
              ? statisticsData.unusedCount
              : 0
          }}
        </div>
      </div>
      <div class="coupon-message-item">
        <div>
          使用平台：{{ detail.platformName ? detail.platformName : '--' }}
        </div>
        <div v-if="detail.startTime && detail.endTime">
          领劵周期：{{ detail.startTime }}--{{ detail.endTime }}
        </div>
        <div v-else>领取之后{{ detail.validDays }}天内有效</div>
        <div>已领取：{{ statisticsData.receivedCount }}</div>
      </div>
    </div>
    <div class="rule">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="规则说明" name="1">
          <div>{{ detail.couponDesc }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div v-if="detail.relationType" class="table-content">
      <detail-table
        :coupon-id="couponId"
        :coupon-type="detail.relationType"
        :act-id="detail.couponId"
        :statisticsData="statisticsData"
      />
    </div>
  </div>
</template>
<script>
import {
  getCouponDetailById,
  getTypes,
  getStatisticsData
} from '@/api/coupon/coupon'
import DetailTable from './components/DetailTable'
export default {
  name: 'Details',
  components: { DetailTable },
  data() {
    return {
      detail: {},
      types: [],
      activeNames: '',
      couponId: undefined,
      statisticsData: {}
    }
  },
  created() {
    this.couponId = this.$route.params.couponId
    if (this.couponId) {
      this.$nextTick(() => {
        this.getCouponDetail()
        this.getCouponTypes()
        this.getStatisticsData()
      })
    }
  },
  methods: {
    // 获取累计数据
    getStatisticsData() {
      getStatisticsData(this.couponId).then(res => {
        this.statisticsData = res.data.data
      })
    },
    // 获取优惠劵详情
    getCouponDetail() {
      const couponId = this.couponId
      getCouponDetailById(couponId).then(res => {
        this.detail = res.data.data
      })
    },
    // 优惠劵领取的方式
    getCouponTypes() {
      getTypes().then(res => {
        this.types = res.data.data
      })
    },
    // 规则折叠框
    handleChange() {}
  }
}
</script>
<style lang="scss" scoped>
.business {
  // background-color: white;
  position: relative;
  margin: 10px 20px;
  // padding: 30px;
  .status {
    position: absolute;
    top: 20px;
    right: 30px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #409eff;
    color: #fff;
    font-size: 13px;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -10px;
      width: 0;
      height: 0;
      border-top: 15px solid transparent;
      border-right: 0px solid transparent;
      border-bottom: 15px solid transparent;
      border-left: 10px solid #409eff;
    }
  }
  .status.red {
    background-color: red;
    &::after {
      border-left: 10px solid red;
    }
  }
}
.qrcode {
  display: inline-block;
  width: 100px;
  height: 100px;
  img {
    width: 100px;
    height: 100px;
    background-color: #fff; //设置白色背景色
    padding: 6px; // 利用padding的特性，挤出白边
    box-sizing: border-box;
  }
}
.rule {
  background-color: white;
  padding: 0px 30px;
  margin-bottom: 10px;
}
.coupon-message {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  padding: 30px;
  margin-bottom: 10px;
}
.coupon-message-item {
  font-size: 12px;
  color: black;
  font-weight: 400px;
  div:last-child {
    margin-bottom: 0px;
  }
}
.coupon-message-item div {
  margin-bottom: 10px;
  line-height: 24px;
}
.table-content {
  background-color: white;
  padding: 0px 30px;
}
.coupon-name {
  font-weight: bold;
  font-size: 16px;
}
</style>
