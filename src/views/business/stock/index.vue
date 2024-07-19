<template>
  <div class="main-content">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="店铺名称">
        <span class="el-form-item-span">：</span>
        <el-input v-model="search.storeName" placeholder="请输入店铺名称"></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <span class="el-form-item-span">：</span>
        <el-input v-model="search.goodsName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品编码">
        <span class="el-form-item-span">：</span>
        <el-input v-model="search.goodsCode" placeholder="请输入商品编码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="单位">
        <span class="el-form-item-span">：</span>
        <el-select v-model="search.searchType" placeholder="请选择">
          <el-option label="全部" value="userId"></el-option>
          <el-option label="袋" value="userId"></el-option>
          <el-option label="盒" value="username"></el-option>
        </el-select>
      </el-form-item> -->
      <div>
        <el-button icon="el-icon-search" type="primary" @click="to_search">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="to_reset">重置</el-button>
      </div>
    </el-form>
    
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        :header-cell-style="{background:'#f1f1f1',color:'#555555'}"
        style="width: 100%"
      >
        <el-table-column prop="storeName" label="店铺名称">
          <template slot-scope="scope">
            <span>{{ scope.row.storeName?scope.row.storeName:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column prop="catePathName" label="商品分类" width="100"></el-table-column>
        <el-table-column prop="goodsCode" label="商品编码" width="120"></el-table-column>
        <el-table-column prop="specName" label="商品规格" width="100"></el-table-column>
        <el-table-column prop="actualStock" label="实际库存"></el-table-column>
        <el-table-column prop="occupyStock" label="占用库存"></el-table-column>
        <el-table-column prop="onWayStock" label="在途库存"></el-table-column>
        <el-table-column prop="canSaleStock" label="可售库存"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="toCheckRecords(scope.row)">查看记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 10px">
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </div>
    </div>
    <!-- 取消订单 -->
    <el-dialog title="取消订单" :visible.sync="dialogFormVisible_cancelOrder" width="35%">
      <el-form :model="cancelOrder_form">
        <el-form-item label="理由：" :label-width="formLabelWidth">
          <el-input v-model="cancelOrder_form.remark" autocomplete="off" placeholder="请填写取消订单的理由"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_cancelOrder = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible_cancelOrder = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 订单发货 -->
    <el-dialog title="订单发货" :visible.sync="dialogFormVisible_deliverGoods" width="35%">
      <el-table :data="tableData">
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品规格" prop="name"></el-table-column>
        <el-table-column label="商品数量" prop="name"></el-table-column>
        <el-table-column label="商品状态" prop="name"></el-table-column>
      </el-table>
      <div class="center_deliverGoods">
        <div>收货人信息:姓名(电话)</div>
        <div>收货地址</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_deliverGoods = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible_deliverGoods = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import {
  getStockPage
} from '@/api/store/stock'
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      tableData: [
        { name: '11' }
      ],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      search: {
        goodsCode: undefined,
        goodsName: undefined,
        storeName: undefined
      },
      activeName: 'first',
      dialogFormVisible_cancelOrder: false,
      dialogFormVisible_deliverGoods: false,
      cancelOrder_form: {
        remark: undefined
      },
      formLabelWidth: '120px'
    }
  },
  created() {
    this.getStockPageList()
  },
  methods: {
    getList() {
      this.getStockPageList()
    },
    // 获取库存明细列表
    getStockPageList() {
      const params = {
        size: this.pagination.size,
        current: this.pagination.current,
        goodsCode: this.search.goodsCode,
        goodsName: this.search.goodsName,
        storeName: this.search.storeName
      }
      this.tableLoading = true
      getStockPage(params).then(res => {
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
      this.getStockPageList()
    },
    // 去重置
    to_reset() {
      this.search = {
        goodsCode: undefined,
        goodsName: undefined,
        storeName: undefined
      }
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
      this.getStockPageList()
    },
    // 去库存详情
    toCheckRecords(row) {
      this.$router.push({
        path: '/business/stock/detail',
        query: { 
          goodsId: row.goodsId,
          storeName: row.storeName,
          goodsName: row.goodsName,
          goodsCode: row.goodsCode,
          specName: row.specName 
        }})
    },
    //标签切换 
    handleClick() {}
  }
}
</script>
<style scoped>
.center_deliverGoods {
  margin-top: 10px;
}
</style>
