<template>
  <div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      style="width: 100%"
    >
      <el-table-column label="任务单号">
        <template slot-scope="scope">
          <span>{{ scope.row.taskNo ? scope.row.taskNo : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime ? scope.row.createTime : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检人">
        <template slot-scope="scope">
          <span>{{ scope.row.user ? scope.row.user.username : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.inspectionTypeName ? scope.row.inspectionTypeName : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="凭证图片">
        <template slot-scope="scope">
          <img
            :src="item"
            v-for="(item, index) in scope.row.resUrls"
            :key="index"
            class="tab-img"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注内容">
        <template slot-scope="scope">
          <span>{{ scope.row.payAmount ? scope.row.payAmount : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注内容">
        <template slot-scope="scope">
          <span>{{ scope.row.resultDesc ? scope.row.resultDesc : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核结果">
        <template slot-scope="scope">
          <span>{{ scope.row.statusName ? scope.row.statusName : "--" }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="text-align: right">
      <table-pagination
        v-show="pagination.total > 0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getDetailsList"
      />
    </div>
  </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import { reqInspectionPage } from "@/api/store/product";

export default {
  components: { TablePagination },
  data() {
    return {
      //表示参数类
      parameter: {
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
      reqInspectionPage(listQuery)
        .then((resp) => {
          const page = resp.data.data;
          this.tableData = page.records;
          console.debug("tableData", this.tableData);
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
.tab-img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>
