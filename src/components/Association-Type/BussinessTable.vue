<template>
  <div>
    <el-table
      :data="businessData"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column label="所在城市" prop="locationName"></el-table-column>
      <el-table-column label="商圈名称" prop="districtName"></el-table-column>
      <el-table-column
        label="商圈地址"
        prop="address"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="商圈简介"
        prop="districtDesc"
        show-overflow-tooltip
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
import { getActivityPageBusiness } from '@/api/operate/discount'
import {getCouponDistrictPage} from '@/api/coupon/coupon'
import TablePagination from '@/components/table-pagination'
export default {
  name: 'ActivityPageBusiness',
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
      businessData: [],
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      }
    }
  },
  created() {
    this._getActivityPageBusiness()
  },
  methods: {
    getSearch(){
      this._getActivityPageBusiness()
    },
    // 查询商圈信息
    _getActivityPageBusiness() {
      const query = {
        id: this.id,
        size:this.pagination.size,
        current:this.pagination.current
      }
      if(this.isCounpon){
        getCouponDistrictPage(query).then(res=>{
          this.businessData = res.data.data.records
        })
      }else{
        getActivityPageBusiness(query).then(res => {
          this.businessData = res.data.data.records
        })
      }
      
    },
  }
}
</script>
