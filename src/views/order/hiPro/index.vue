<template>
  <div class="business">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="下单时间">
        <el-date-picker
          v-model="search.placeOrder"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="付款时间">
        <el-date-picker
          v-model="search.payments"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>

      <!-- <el-form-item label="订单状态" prop="type">
        <el-select v-model="search.orderStatus" placeholder="请选择订单状态">
          <el-option
            v-for="type in heiproTypes"
            :key="type.itemId"
            :label="type.itemLabel"
            :value="type.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input
          v-model="search.username"
          placeholder="请输入用户昵称"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户电话">
        <el-input
          v-model="search.mobile"
          placeholder="请输入用户电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="订单编号">
        <el-input
          v-model="search.orderNo"
          placeholder="请输入订单编号"
        ></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initPageCoupon">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column prop="orderId" label="订单编号" />
        <el-table-column label="嗨PRO卡编号" width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.card.cardId }}</div>
          </template>
        </el-table-column>
        <el-table-column label="嗨PRO卡名称" width="100">
          <template slot-scope="scope">
            <div>{{ scope.row.card.cardName }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          label="售卖金额（元）"
          width="120"
        />
        <el-table-column prop="createTime" label="下单时间" />
        <el-table-column prop="payModeName" label="支付方式" />
        <el-table-column prop="payAmount" label="实付款（元）" width="110" />
        <el-table-column label="支付时间" width="90">
          <template slot-scope="scope">
            <span>{{ scope.row.payTime?scope.row.payTime:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效时间" width="160">
          <template slot-scope="scope" width="180">
            <div v-if="scope.row.card.startTime && scope.row.card.endTime">
              {{ scope.row.card.startTime }}至{{
                scope.row.card.endTime
              }}
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleLookCoupon(scope.row)"
            >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        :page-count="pagination.pages"
        :current-page="pagination.current"
        :page-sizes="pagination.pageSize"
        :page-size="pagination.size"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @prev-click="handleCurrentChange"
        @next-click="handleCurrentChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="查看详情" :visible="visibleDialog" @close="closeAdvert">
      <el-row :gutter="20">
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">购买用户：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.user.username }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">用户手机号：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.user.mobile }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">嗨PRO卡名称：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.card.cardName }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">嗨PRO卡编号：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.card.cardId }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">嗨PRO卡类型：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.card.cardTypeName }} 卡</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">总价（元）：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.orderAmount }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">支付方式：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.payModeName }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">实付款（元）：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.payAmount }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">订单编号：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.orderId }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">订单状态：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.statusName }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">下单时间：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.createTime }}</label>
        </el-col>
        <el-col :span="12">
          <label class="dialog-item-label dialog-right">付款时间：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.payTime }}</label>
        </el-col>
        <el-col :span="24">
          <label class="dialog-item-label dialog-right">有效时间：</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.card.startTime }}</label>
          <label class="dialog-item-label">至</label>
          <label class="dialog-item-label">{{ hiproOrderDetails.card.endTime }}</label>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderCardPage } from '@/api/order/card'
import { fetchItemList } from '@/api/system/dict'

export default {
  data() {
    return {
      tableLoading: false,
      search: {
        username: undefined,
        orderStatus: undefined,
        // 下单时间
        placeOrder: [],
        // 付款时间
        payments: [],
        orderNo: undefined,
        mobile: undefined
      }, // 表单绑定值
      heiproTypes: [],
      tableData: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      visibleDialog: false,
      // 详情
      hiproOrderDetails: {
        card: {
          cardId: 0,
          cardName: '',
          cardType: '',
          cardTypeName: '',
          endTime: '',
          startTime: ''
        },
        cardNo: '',
        createTime: '',
        discount: '',
        orderAmount: 0,
        orderId: 0,
        orderItems: [
          {
            currentPrice: 0,
            discountAmount: 0,
            goodsId: 0,
            goodsImage: '',
            goodsName: '',
            originPrice: 0,
            quantity: 0,
            totalAmount: 0
          }
        ],
        payAmount: 0,
        payMode: '',
        payModeName: '',
        payTime: '',
        status: '',
        statusName: '',
        user: {
          mobile: '',
          userId: 0,
          username: ''
        }
      }
    }
  },
  mounted() {
    this.initFetchItemList()
    this.initPageCoupon()
  },
  methods: {
    // 查询类型
    initFetchItemList() {
      fetchItemList({ dictType: 'order_status' })
        .then(resp => {
          const page = resp.data.data
          this.heiproTypes = page.records
        })
        .catch(e => {})
    },
    // 查询列表
    initPageCoupon() {
      const [createStartTime, createEndTime] = this.search.placeOrder
      const [payStartTime, payEndTime] = this.search.payments

      const params = {
        createStartTime,
        createEndTime,
        payStartTime,
        payEndTime,
        size: this.pagination.size,
        current: this.pagination.current,
        username: this.search.username,
        orderStatus: this.search.orderStatus,
        orderNo: this.search.orderNo,
        mobile: this.search.mobile
      }

      this.tableLoading = true
      getOrderCardPage(params)
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
    resetForm() {
      this.search = {
        username: undefined,
        orderStatus: undefined,
        // 下单时间
        placeOrder: [],
        // 付款时间
        payments: [],
        orderNo: undefined,
        mobile: undefined
      }
      this.initPageCoupon()
      // this.$refs[formName].resetFields()
    },
    // 查看
    handleLookCoupon(val) {
      this.hiproOrderDetails = val
      this.visibleDialog = true
    },
    //  关闭弹框
    closeAdvert() {
      this.visibleDialog = false
    },
    //页容量改变
    handleSizeChange(val) {
      this.pagination.size = val
      this.initPageCoupon()
    },
    //页码改变
    handleCurrentChange(val) {
      this.pagination.current = val
      this.initPageCoupon()
    }
  }
}
</script>
<style lang="scss" scoped>
.business {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
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

// 弹出框样式
.dialog-right{
  width: 120px;
}
.dialog-item-label{
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
