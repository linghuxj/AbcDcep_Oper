<template>
  <div>
    <el-table
      v-loading="tableLoading"
      :data="storeData"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      border
    >
      <el-table-column
        label="门店名称"
        prop="storeName"
        width="240"
      ></el-table-column>
      <el-table-column
        label="类型"
        prop="storeTypeName"
        width="120"
      ></el-table-column>
      <el-table-column label="地址" prop="address"></el-table-column>
      <el-table-column
        label="商户电话"
        prop="contactTel"
        width="200"
      ></el-table-column>
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
import { getActivityPageStore } from '@/api/operate/discount'
import {getCouponStorePage} from '@/api/coupon/coupon'
export default {
  name: 'ActivityPageStore',
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
      storeData: [],
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
      this._getActivityPageStore()
    })
  },
  methods: {
    getSearch() {
      this._getActivityPageStore()
    },
    // 查询店铺信息
    _getActivityPageStore() {
      this.tableLoading = true
      const query = {
        id: this.id,
        current: this.pagination.current,
        size: this.pagination.size
      }
      if(this.isCounpon){
        getCouponStorePage(query)
        .then(res => {
          const page = res.data.data

          this.storeData = page.records
          this.pagination.total = page.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
      }else{
        getActivityPageStore(query).then(res=>{
          console.debug('res',res)
          const page = res.data.data
          this.storeData = page.records
          this.pagination.total = page.total
          this.tableLoading = false
        }).catch(() => {
          this.tableLoading = false
        })
      }
      
       
    }
  }
}
</script>
