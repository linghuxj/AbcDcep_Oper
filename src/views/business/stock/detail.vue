<template>
  <div class="mechanism-content">
    <div class="main-top">
      <div class="main-top-item">
        <div>店铺名称：{{ storeMes.storeName?storeMes.storeName:'--' }}</div>
      </div>
      <div class="main-top-item">
        <div>商品名称：{{ storeMes.goodsName?storeMes.goodsName:'--' }}</div>
      </div>
      <div class="main-top-item">
        <div>商品条形编号：{{ storeMes.goodsCode?storeMes.goodsCode:'--' }}</div>
      </div>
      <div class="main-top-item">
        <div>商品规格：{{ storeMes.specName?storeMes.specName:'--' }}</div>
      </div>
    </div>
    <div class="main-bottom">
      <div class="main-bottom-search">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-form-item label="操作人：">
            <el-input v-model="search.operator" placeholder="请输入操作人姓名"></el-input>
          </el-form-item>
          <el-form-item label="订单编号：">
            <el-input v-model="search.orderNo" placeholder="请输入订单编号"></el-input>
          </el-form-item>
          <el-form-item label="来源：">
            <el-select v-model="search.type" placeholder="请选择">
              <el-option
                v-for="item in sourceArr"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="to_search()">搜索</el-button>
          <el-button @click="to_reset()">重置</el-button>
        </el-form>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}" 
        class="el_table">
        <el-table-column type="index" label="出入库" prop="name" width="100">
          <template slot-scope="scope">
            <!-- 	明细类型: 出库-out_stock，入库-in_stock -->
            <span>{{ scope.row.type==='out_stock'?'-':'+' }}{{ scope.row.changeNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="currentNum" label="剩余库存"></el-table-column>
        <el-table-column prop="typeName" label="来源"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column label="操作人">
          <template slot-scope="scope">
            <span>{{ scope.row.operator?scope.row.operator:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="text-align:right">
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import {
  getStockDetailList
} from '@/api/store/stock'
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      formLabelWidth: '120px',
      search: {
        operator: undefined,
        orderNo: undefined,
        type: undefined
      },
      sourceArr: [
        { name: '销售出库', value: 'out_stock' },
        { name: '采购入库', value: 'in_stock' }
      ],
      labelWidth: '120px'
      
    }
  },
  created() {
    if (this.$route.query) {
      this.storeMes = this.$route.query
      this.$nextTick(() => {
        this.getStockDetailList()
      })
    }
  },
  methods: {
    getList() {
      this.getStockDetailList()
    },
    // 获取库存明细列表
    getStockDetailList() {
      const params = {
        size: this.pagination.size,
        current: this.pagination.current,
        goodsId: this.storeMes.goodsId,
        operator: this.search.operator,
        orderNo: this.search.orderNo,
        type: this.search.type
      }
      this.tableLoading = true
      getStockDetailList(params).then(res => {
        this.tableLoading = false
        const page = res.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.pagination.pages = page.pages
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 去搜索
    to_search() {
      this.getStockDetailList()
    },
    // 去重置
    to_reset() {
      this.search = {
        operator: undefined,
        orderNo: undefined,
        type: undefined
      }
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      this.getStockDetailList()
    }
  }
}
</script>
<style scope>
.mechanism-content {
   margin: 10px 20px;
}
.main-top {
  /* height: 70px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF;
  margin-bottom: 20px;
  padding: 20px 30px;
  position: relative;
}
.main-bottom {
  background-color: #FFF;
   padding: 20px 30px;
}
</style>
