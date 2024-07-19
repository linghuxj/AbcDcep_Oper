<template>
  <div class="tabs">
    <el-tabs v-model="activeTag" @tab-click="handleChangeTab">
      <el-tab-pane label="累计数据" name="statistical">
        <div class="statistical">
          <div class="statistical-item">
            <div class="statistical-item-div">领取数据</div>
            <div class="statistical-item-div">
              <div>领取率</div>
              <div>{{ statisticsData.receivedRatio }}%</div>
            </div>
            <div class="statistical-item-div">
              <div>使用率</div>
              <div>{{ statisticsData.usedRatio || '0' }}%</div>
            </div>
          </div>
          <div class="statistical-item">
            <div class="statistical-item-div">交易数据</div>
            <div class="statistical-item-div">
              <div>优惠总金额</div>
              <div>￥{{ statisticsData.orderDiscountAmount || '0' }}</div>
            </div>
            <div class="statistical-item-div">
              <div>用劵总成交额</div>
              <div>￥{{ statisticsData.orderPayAmount || '0' }}</div>
            </div>
            <div class="statistical-item-div">
              <div>优惠总付款订单总数</div>
              <div>
                {{ statisticsData.orderNum || '0' }}
              </div>
            </div>
            <div class="statistical-item-div">
              <div>费效比</div>
              <div>{{ statisticsData.costEfficiencyRatio || '0' }}%</div>
            </div>
            <div class="statistical-item-div">
              <div>用劵笔单价</div>
              <div>￥{{ statisticsData.usedUnitPrice || '0' }}</div>
            </div>
          </div>
          <!-- 米粒数据 -->
          <div class="statistical-item">
            <div class="statistical-item-div">拉新数据</div>
            <div class="statistical-item-div">
              <div>拉新数</div>
              <div>{{ statisticsData.addNewUserRatio || '0' }}%</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="领取用户" name="customer">
        <el-form :inline="true" :model="search" class="form_search">
          <el-form-item label="关键字：">
            <el-input
              v-model="search.keyword"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="to_search()">搜索</el-button>
            <el-button @click="to_reset()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="tableLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="users"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          border
          style="width: 100%"
        >
          <!-- <el-table-column prop="couponNo" label="优惠券码"> </el-table-column> -->
          <el-table-column type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column label="领取用户" width="150">
            <template slot-scope="scope" v-if="scope.row.user">
              <div>
                {{
                  scope.row.user
                    ? scope.row.user.username
                      ? scope.row.user.username
                      : '--'
                    : '--'
                }}
              </div>
              <div>
                {{
                  scope.row.user
                    ? scope.row.user.mobile
                      ? scope.row.user.mobile
                      : '--'
                    : '--'
                }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="分享用户">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.shareUser
                    ? scope.row.shareUser.username
                      ? scope.row.shareUser.username
                      : '--'
                    : '--'
                }}
              </div>
              <div>
                {{
                  scope.row.shareUser
                    ? scope.row.shareUser.mobile
                      ? scope.row.shareUser.mobile
                      : '--'
                    : '--'
                }}
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="实名状态">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.user
                    ? scope.row.user.authStatus
                      ? '已实名'
                      : '未实名'
                    : '--'
                }}
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="领取方式">
            <template slot-scope="scope">
              {{scope.row.receiveTypeName?scope.row.receiveTypeName:''}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="领取时间" width="150">
          </el-table-column>
          <el-table-column label="使用时间" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.usedTime ? scope.row.usedTime : '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="statusName" label="状态"> </el-table-column>
          <el-table-column label="使用方式">
              <template slot-scope="scope">
                  <!-- UNUSED("unused", "未使用"),
                  USED("used", "已使用"),
                  EXPIRED("expired", "已过期"); -->
                  <span v-if="scope.row.status==='used'">
                    {{scope.row.orderNo?'订单编号：'+scope.row.orderNo:(scope.row.storeName?'店铺名称：'+scope.row.storeName:'--')}}
                  </span>
                  <span v-else>--</span>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="openCode(scope.row.couponNo)"
                >二维码</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div v-if="activeTag != 'statistical'">
          <table-pagination
            :total="pagination.total"
            :page.sync="pagination.current"
            :limit.sync="pagination.size"
            @pagination="getList"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="relationTitle"
        :label="relationTitle"
        name="taskResult"
      >
        <!-- 商圈-->
        <bussiness-table v-if="couponType === 'business_district'" :id="couponId" :isCounpon="isCounpon"/>
        <!-- 商品 -->
        <goods-table v-if="couponType === 'goods'" :id="couponId" :isCounpon="isCounpon"/>
        <!-- 店铺 -->
        <store-table v-if="couponType === 'store'" :id="couponId" :isCounpon="isCounpon" />
      </el-tab-pane>
    </el-tabs>
    <!--弹框  -->
    <el-dialog
      v-loading="dialogLoading"
      title="二维码"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <div class="dialogQrcode">
        <div id="qrcode" ref="qrCodeUrl" class="qrcode"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { pageGotCoupon} from '@/api/coupon/coupon'
// import { getActivityPageStore } from '@/api/operate/discount'
import TablePagination from '@/components/table-pagination'
import QRCode from 'qrcodejs2'
import GoodsTable from '@/components/Association-Type/GoodsTable.vue'
import BussinessTable from '@/components/Association-Type/BussinessTable.vue'
import StoreTable from '@/components/Association-Type/StoreTable.vue'
export default {
  name: 'DetailTabel',
  components: { TablePagination, GoodsTable, BussinessTable, StoreTable },
  props: {
    couponId: {
      type: String,
      required: true
    },
    couponType: {
      type: String,
      required: true
    },
    actId: {
      type: String,
      required: true
    },
    statisticsData:{
      type:Object,
      required:true
    }
  },
  data() {
    return {
      activeTag: 'statistical',
      tableLoading: false,
      dialogLoading: false,
      centerDialogVisible: false,
      search: {
        keyword: undefined
      },
      users: [],
      // statisticsData: {},
      storeArr: [],
      relationTitle: undefined,
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      isCounpon:true
    }
  },
  created() {
    console.debug('actId',this.couponType)
    if (this.couponId) {
      this.$nextTick(() => {
        // this.getStatisticsData()
        this.getUsersByCoupon()
      })
    }

    if (this.couponType) {
      // console.debug('this.couponType', this.couponType)
      this.$nextTick(() => {
        if (this.couponType === 'goods') {
          this.relationTitle = '关联商品'
        } else if (this.couponType === 'store') {
          this.relationTitle = '关联店铺'
        } else if (this.couponType === 'business_district') {
          this.relationTitle = '关联商圈'
        }
      })
    }
    // this.getActivityPageStore()
  },
  methods: {
    // 获取用户领取列表
    getUsersByCoupon() {
      const couponId = this.couponId
      this.loading = true
      const query = Object.assign({}, this.search)
      query.size = this.pagination.size
      query.current = this.pagination.current
      const { current, size } = this.pagination
      const params = {
        current,
        size,
        couponId,
        ...this.search
      }
      pageGotCoupon(params).then(res => {
        this.loading = false
        const { records } = res.data.data
        this.users = records
        console.debug('this.users', this.users)
        const page = res.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.pagination.pages = page.pages
      })
    },
    to_search() {
      this.getUsersByCoupon()
    },
    to_reset() {
      this.search.keyword = undefined
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      this.getUsersByCoupon()
    },
    //打开二维码弹框
    openCode(couponNo) {
      if (document.getElementById('qrcode')) {
        document.getElementById('qrcode').innerHTML = ''
      }

      this.centerDialogVisible = true
      this.dialogLoading = true
      setTimeout(() => {
        this.creatQrCode(couponNo)
        this.dialogLoading = false
      }, 800)
    },
    // 生成二维码
    creatQrCode(couponNo) {
      var a = document.getElementById('qrcode')
      var qrcode = new QRCode(a, {
        text: couponNo, // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: '#000000',
        colorLight: '#ffffff',
        render: 'canvas',
        correctLevel: QRCode.CorrectLevel.H
      })
      console.debug(qrcode)
    },
    cancel() {
      this.centerDialogVisible = false
    },
    submit() {
      this.centerDialogVisible = false
    },
    // 获取累计数据
    // getStatisticsData() {
    //   getStatisticsData(this.couponId).then(res => {
    //     this.statisticsData = res.data.data
    //   })
    // },
    // 获取关联店铺
    // getActivityPageStore() {
    //   let data = {
    //     id:this.couponId
    //   }
    //   console.debug('获取关联店铺',data)
    //   getCouponStorePage(data).then(res => {
    //     this.storeArr = res.data.data
    //   })
    // },
    getList() {
      this.getUsersByCoupon()
    },
    handleChangeTab() {}
  }
}
</script>
<style lang="scss" scoped>
.tabs {
  margin: 0 !important;
  background-color: #fff;
  padding: 0 !important;
  text-align: right;
  .form_search {
    float: right;
    overflow: hidden;
  }
}
.tabs-select {
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
  .statistical-item-div:first-child {
    font-size: 16px;
  }
  .statistical-item-div {
    // width: 200px;
    font-size: 13px;
    margin-right: 50px;
    text-align-last: left;
    div:last-child {
      font-size: 14px;
      color: #000;
    }
  }
  .statistical-item:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    height: 50px;
    justify-content: center;
    color: #000;
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
.statistical-item-item {
  margin: 5px 0px;
  div {
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
// 二维码弹窗
.dialogQrcode .qrcode {
  width: 100px;
  margin: auto;
}
</style>
