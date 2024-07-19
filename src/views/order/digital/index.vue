<template>
   <div class="main-content">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="订单编号：">
        <el-input v-model="search.orderNo" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item label="用户手机号：">
        <el-input v-model="search.mobile" placeholder="请输入机号"></el-input>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="to_search()">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" class="reset" @click="to_reset()">
          重置
        </el-button>
      </div>
    </el-form>
     <!-- 表格 -->
    <el-table
      v-loading="interview.loading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="订单编号" prop="orderNo">
      </el-table-column>
      <el-table-column label="消费劵名称">
        <template slot-scope="scope">
          {{ scope.row.orderTypeName ? scope.row.orderTypeName : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="用户手机号">
        <template slot-scope="scope">
          {{scope.row.user?scope.row.user.mobile:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="面额" prop="unitNames">
        <template slot-scope="scope">
          {{scope.row.orderItems?scope.row.orderItems.currentPrice:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="售价">
        <template slot-scope="scope">
          {{scope.row.orderItems?scope.row.orderItems.currentPrice:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="商品总数量" prop="totalQuantity" />
      <el-table-column label="实付金额" prop="payAmount" />
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          {{scope.row.payModeName?scope.row.payModeName:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          {{scope.row.statusName?scope.row.statusName:'--'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="to_edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      v-if="pagination.total>0"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getUserList"
    />
   </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import {getDigitalOrder} from "@/api/order/card"
export default {
  components: {
    TablePagination,
  },
  data(){
    return{
      search:{
        orderNo:null,
        mobile:null,
      },
      interview: {
        loading: false,
        dialogShow: false,
        dialogLoading: false,
        isEdit: false,
      },
      tableData:[],
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //总条数
        total: 0,
      },
    }
  },
  created(){
    this.getDigitalOrder()
  },
  methods:{
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.countHeight();
      };
    },
    // 计算表格高度
    countHeight() {
      // 监听视口宽度变化
      let demoForm = document.getElementById("demo-form-inline");
      let tableBtn = document.getElementById("tableBtn");
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`;
    },
    getUserList() {},
    // 获取订单列表
    getDigitalOrder(){
      let data ={
        current:this.pagination.current,
        size:this.pagination.size,
        orderNo:this.search.orderNo,
        mobile:this.search.mobile
      }
      getDigitalOrder(data).then(res=>{
        console.debug('res',res)
        this.tableData = res.data.data.records
        this.pagination.current = res.data.data.current
        this.pagination.size = res.data.data.size
        this.pagination.total = res.data.data.total
      })
    },
    to_search(){
      this.getDigitalOrder()
    },
    to_reset(){
      this.search ={
        orderNo:null,
        tel:null,
      }
      this.getDigitalOrder()
    },
  }
}
</script>