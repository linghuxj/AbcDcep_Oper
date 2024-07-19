<template>
  <div>
    <div class="store-search">
      <div>
        <div style="display:inline-block">
          <el-checkbox-group v-model="parameter.saleStatusList" @change="getDetailsList">
            <el-checkbox label="on_sale">销售中</el-checkbox>
            <el-checkbox label="sold_out">已售完</el-checkbox>
          </el-checkbox-group>
        </div>
        <div style="display:inline-block;margin-left:25px;">
          <el-checkbox-group v-model="parameter.saleChannel" @change="getDetailsList">
            <el-checkbox label="offline">本地商品</el-checkbox>
            <el-checkbox label="online">网店商品</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <el-input v-model="parameter.keyword" placeholder="请输入搜索内容关键字">
        <el-button slot="append" type="primary" @click="getDetailsList">搜索</el-button>
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
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.$index+(pagination.current - 1) * pagination.size + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品信息">
        <template slot-scope="scope">
          <span>{{ scope.row.productName?scope.row.productName:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品类型">
        <template slot-scope="scope">
          <span>{{ scope.row.catePathName?scope.row.catePathName:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌名称">
        <template slot-scope="scope">
          <span>{{ scope.row.brandName?scope.row.brandName:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品条形编号">
        <template slot-scope="scope">
          <span>{{ scope.row.productCode?scope.row.productCode:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总销量">
        <template slot-scope="scope">
          <span>{{ scope.row.totalSales?scope.row.totalSales:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销售状态">
        <template slot-scope="scope">
          <span>{{ scope.row.saleStatus?scope.row.saleStatus:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态">
        <template slot-scope="scope">
          <span>{{ scope.row.statusName?scope.row.statusName:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime?scope.row.updateTime:'--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="permissions.store_product_stock_edit" type="text" @click="toUpdate(scope.row)">修改库存</el-button>
          <el-button v-if="permissions.product_add" type="text" @click="toEdit(scope.row.productId)">编辑</el-button>
          <el-button v-if="permissions.store_product_status_edit&&scope.row.status==='normal'" type="text" @click="toDisable(scope.row)">下架</el-button>
          <el-button v-if="permissions.store_product_status_edit&&scope.row.status==='disabled'" type="text" @click="toNormal(scope.row)">上架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      v-show="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getDetailsList" />
    
    <!-- 修改库存弹框 -->
    <el-dialog title="修改库存" :visible.sync="interactive.dialogFormVisible">
      <el-table 
        v-loading="interactive.tableStockLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="inventoryData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%">
        <el-table-column label="sku规格" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.specName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可售库存" width="240" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改库存" width="240" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.newStock" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editStock">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { getProductPage } from '@/api/store/store'
import { mapGetters } from 'vuex'

import { getProductStockById, editProductStock, editProductStockStatus } from '@/api/store/product'

export default {
  components: { TablePagination },
  data() {
    return {
      //表示参数类
      parameter: {
        keyword: undefined,
        // 商品销售状态（销售中-on_sale，已售完-sold_out）: 支持复选
        saleStatusList: [],
        saleChannel: [],
        storeId: undefined
      },
      // 操作类型
      interactive: {
        tableLoading: false,
        tableStockLoading: false,
        dialogFormVisible: false
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      tableLoading: false,
      tableData: [],
      // 库存列表
      inventoryData: [],
      radio: '2',
      formLabelWidth: '120px'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    if (this.$route.query.storeId) {
      this.parameter.storeId = this.$route.query.storeId
      this.$nextTick(() => {
        this.getDetailsList()
      })
    }
  },
  methods: {

    getDetailsList() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      getProductPage(listQuery).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
      }).catch(e => {
        this.interactive.tableLoading = false
      })
    },
    // 下架
    toDisable(val) {
      const fullName = val.productName
      this.$confirm('是否要下架“' + fullName + '”商品吗?', '下架提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        const data = {
          productId: val.productId,
          status: 'disabled',
          storeId: this.parameter.storeId
        }
        editProductStockStatus(data).then(res => {
          this.$message({
            type: 'success',
            message: '下架成功!'
          })
          this.getDetailsList()
        })
          
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        })          
      })
    },
    //上架
    toNormal(val) {
      const fullName = val.productName
      this.$confirm('是否要上架“' + fullName + '”商品吗?', '上架提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        const data = {
          productId: val.productId,
          status: 'normal',
          storeId: this.parameter.storeId
        }
        editProductStockStatus(data).then(res => {
          this.$message({
            type: 'success',
            message: '上架成功!'
          })
          this.getDetailsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架'
        })          
      })
    }, 
    // 修改库存
    toUpdate(val) {
      this.interactive.dialogFormVisible = true
      this.interactive.tableStockLoading = true
      getProductStockById(val.productId).then(res => {
        this.inventoryData = res.data.data
        this.interactive.tableStockLoading = false
      })
    },
    editStock() {
      const newarr = this.inventoryData.map((item) => {
        const obj = {
          goodsId: item.goodsId,
          stock: item.newStock ? Number(item.newStock) : Number(item.stock)
        }
        return obj
      })
      editProductStock(newarr).then(res => {
        this.interactive.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '库存修改成功!'
        })
        this.getDetailsList()
      }).catch(() => {
        this.interactive.dialogFormVisible = false
      })
      
    },
    // 编辑
    toEdit(val) {
      this.$router.push(`/business/product/${val}`)
    }
  }
}
</script>
<style scoped>
.store-search {
  margin-bottom: 10px;
  display: flex;
  justify-content:space-between;
}
.el-input-group{
  width: 260px;
}
.el-input__inner {
  width: 100px;
}
</style>
