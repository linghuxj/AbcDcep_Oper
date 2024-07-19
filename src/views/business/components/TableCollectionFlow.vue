<template>
  <div>
    <div class="store-search">
      <el-input v-model="parameter.keyword" placeholder="请输入搜索内容关键字">
        <el-button slot="append" type="primary" @click="getDetailsList"
          >搜索</el-button
        >
      </el-input>
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      style="width: 100%"
    >
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          <span>{{ scope.row.user ? scope.row.user.username : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.user ? scope.row.user.mobile : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo ? scope.row.orderNo : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应付金额(元)">
        <template slot-scope="scope">
          <span>{{
            scope.row.orderAmount ? scope.row.orderAmount : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应付米粒">
        <template slot-scope="scope">
          <span>{{
            scope.row.orderIntegralAmount ? scope.row.orderIntegralAmount : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收金额(元)">
        <template slot-scope="scope">
          <span>{{ scope.row.payAmount ? scope.row.payAmount : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收米粒">
        <template slot-scope="scope">
          <span>{{
            scope.row.payIntegralAmount ? scope.row.payIntegralAmount : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          <span>{{
            scope.row.payModeName ? scope.row.payModeName : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付时间">
        <template slot-scope="scope">
          <span>{{ scope.row.payTime ? scope.row.payTime : "--" }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      v-show="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getDetailsList"
    />
  </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import { reqFlowPage } from "@/api/store/product";

export default {
  components: { TablePagination },
  data() {
    return {
      //表示参数类
      parameter: {
        keyword: undefined,
        storeId: undefined,
      },
      // 操作类型
      interactive: {
        tableLoading: false,
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
      tableData: [],
    };
  },
  created() {
    if (this.$route.query.storeId) {
      this.parameter.storeId = this.$route.query.storeId;
      this.$nextTick(() => {
        this.getDetailsList();
      });
    }
  },
  methods: {
    getDetailsList() {
      this.interactive.tableLoading = true;
      const listQuery = Object.assign({}, this.parameter, this.pagination);
      reqFlowPage(listQuery)
        .then((resp) => {
          const page = resp.data.data;
          this.tableData = page.records;
          this.pagination.total = page.total;
          this.interactive.tableLoading = false;
        })
        .catch((e) => {
          console.debug("catch", e);
          this.interactive.tableLoading = false;
        });
    },
  },
};
</script>
<style scoped>
.store-search {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
.el-input-group {
  width: 260px;
}
.el-input__inner {
  width: 100px;
}
</style>
