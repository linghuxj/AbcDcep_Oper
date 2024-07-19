<template>
  <div>
    <el-table
      v-loading="tableLoading"
      :data="goodsData"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      border
    >
      <el-table-column
        label="店铺名"
        prop="store.storeTypeName"
      ></el-table-column>
      <el-table-column label="产品名称(spu)" prop="goodsName"></el-table-column>
      <el-table-column label="sku信息">
        <template slot-scope="scope">
          <span>{{
            scope.row.specName
              ? scope.row.specName + ':' + scope.row.specValue
              : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品售价(元)" prop="price.salePrice"></el-table-column>
      <el-table-column label="米粒" prop="price.integral"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getSearch"
    />
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'

import { getActivityPageSku } from '@/api/operate/discount'
import {getCouponGoodsPage} from '@/api/coupon/coupon'
export default {
  name: 'ActivityPageSku',
  components: { TablePagination },
  props: {
    id: {
      default: ''
    },
    isCounpon:{
      type:Boolean,
      required:false
    }
  },
  data() {
    return {
      goodsData: [],
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      tableLoading: false
    }
  },
  created() {
    this.$nextTick(() => {
      this._getActivityPageSku()
    })
  },
  methods: {
    getSearch() {
      this._getActivityPageSku()
    },
    // 查询sku信息
    _getActivityPageSku() {
      this.tableLoading = true
      const query = {
        id: this.id,
        current: this.pagination.current,
        size: this.pagination.size
      }
      if(this.isCounpon){
        getCouponGoodsPage(query).then(res=>{
           res.data.data.records.forEach(item => {
            item.saleSpecValues.forEach(citem => {
              this.goodsData.push({ ...item, ...citem })
            })
          })
          console.log(this.goodsData, 666)
          this.pagination.total = res.data.data.total
          this.tableLoading = false
        }).catch(error=>{
          console.debug(error)
        })
      }else{
        getActivityPageSku(query)
        .then(res => {
          res.data.data.records.forEach(item => {
            item.saleSpecValues.forEach(citem => {
              this.goodsData.push({ ...item, ...citem })
            })
          })
          console.log(this.goodsData, 666)
          this.pagination.total = res.data.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
      }
      
    }
  }
}
</script>
