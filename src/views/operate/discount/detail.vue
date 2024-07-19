<template>
  <div class="main-content">
    <aside>基本信息</aside>
    <div class="main-activeMes">
      <div class="main-item">
        <label>活动名称：</label>
        <span>{{ detailList.actName }}</span>
      </div>
      <div class="main-item">
        <label>活动时间：</label>
        <span>{{ detailList.startTime }} 至 {{ detailList.endTime }}</span>
      </div>
      <div class="main-item">
        <label>活动人群：</label>
        <span>全部</span>
      </div>
      <div class="main-item">
        <label>使用平台：</label>
        <span>{{ detailList.platformName }}</span>
      </div>
      <div class="main-item">
        <label>关联类型：</label>
        <span>{{ detailList.relationTypeName }}</span>
      </div>
    </div>
    <aside>优惠设置</aside>
    <div class="main-activeMes">
      <div class="main-item">
        <label>优惠设置：</label>
        <span>{{ detailList.discountTypeName }}</span>
      </div>
      <div style="margin-bottom: 10px">
        <el-table
          :data="detailList.rules"
          style="width: 50%"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column
            label="满N件/满N元"
            prop="conditionAmount"
          ></el-table-column>
          <el-table-column
            label="打N件/减N元"
            prop="discountAmount"
          ></el-table-column>
        </el-table>
      </div>
      <div class="main-item">
        <label>下单叠加规则：</label>
        <span
          >{{
            detailList.couponUsable ? '不可以使用优惠券' : '可以使用优惠券'
          }}、{{ detailList.memberUsable ? '会员不可用' : '会员可用' }}</span
        >
      </div>
    </div>
    <aside>关联信息</aside>
    <!-- 商圈-->
    <bussiness-table
      v-if="detailList.relationType === 'business_district'"
      :id="id"
    />
    <!-- 商品 -->
    <goods-table
      v-if="detailList.relationType === 'goods'"
      :id="id"
    />
    <!-- 店铺 -->
    <store-table
      v-if="detailList.relationType === 'store'"
      :id="id"
    />
  </div>
</template>
<script>
import GoodsTable from '@/components/Association-Type/GoodsTable.vue'
import BussinessTable from '@/components/Association-Type/BussinessTable.vue'
import StoreTable from '@/components/Association-Type/StoreTable.vue'

import { getActivityDetailById } from '@/api/operate/discount'
export default {
  components: { GoodsTable, BussinessTable, StoreTable },
  data() {
    return {
      // 活动id
      id: undefined,
      setData: [],
      detailList: []
    }
  },
  created() {
    this.$nextTick(() => {
      const id = this.$route.params && this.$route.params.id
      this.id = id
      this.getActivityDetail(id)
    })
  },
  methods: {
    getActivityDetail(id) {
      getActivityDetailById(id).then(res => {
        this.detailList = res.data.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
.main-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  aside {
    background: #eef1f6;
    padding: 8px 24px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
  }
  .main-activeMes {
    margin-left: 30px;
    margin-bottom: 10px;
    .main-item {
      font-size: 14px;
      font-weight: 400;
      color: #2c3e50;
      margin-bottom: 10px;
    }
  }
}
</style>
