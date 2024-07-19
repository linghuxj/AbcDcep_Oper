<template>
  <div class="main-content">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="search"
        id="demo-form-inline"
        class="demo-form-inline"
      >
        <el-form-item label="创客搜索：">
          <el-input
            v-model="search.searchValue"
            placeholder="请输入内容"
            style="width: 100%"
          >
            <el-select
              slot="prepend"
              v-model="search.searchType"
              placeholder="请选择"
            >
              <el-option label="创客手机号" value="mobile"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="交易类型：">
          <el-select v-model="search.usedType" placeholder="请选择">
            <el-option
              v-for="(item, index) in userTypeArr"
              :label="item.dictName"
              :value="item.dictValue"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="完成时间：">
          <el-date-picker
            v-model="timeArr"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <div>
          <el-button type="primary" icon="el-icon-search" @click="getSearch()"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" @click="resetForm()"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="用户信息">
        <template slot-scope="scope">
          <div>昵称：{{ scopeUserName(scope.row.user) }}</div>
          <div>手机号：{{ scopeMobile(scope.row.user) }}</div>
          <div>用户id：{{ scopeUserId(scope.row.user) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="交易类型">
        <template slot-scope="scope">
          <span>{{ scope.row.remark ? scope.row.remark : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="米粒数量">
        <template slot-scope="scope">
          <span>
            {{ scope.row.changeAmount ? scope.row.changeAmount : "--" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="米粒余额">
        <template slot-scope="scope">
          <span>{{
            scope.row.currentBalance ? scope.row.currentBalance : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完成时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime ? scope.row.createTime : "--" }}</span>
        </template>
      </el-table-column>
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
import TablePagination from "@/components/table-pagination";
import { getIntegralPage, getUsedType } from "@/api/integral/index";

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      tableData: [],
      //表示参数类
      search: {
        searchType: undefined,
        searchValue: undefined,
        usedType: null,
      },
      timeArr: [],
      userTypeArr: [],
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
    };
  },
  created() {
    this.getSearch();
    this.getUsedType();
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight();
      this.watchWidth();
    });
  },
  methods: {
    // 获取类型
    getUsedType() {
      getUsedType().then((res) => {
        console.debug("类型", res);
        this.userTypeArr = res.data.data;
      });
    },
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
      let tabs = 55;
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        190
      }px)`;
    },
    // tabs切换
    handleClick() {
      this.tableHeight = "calc(100vh - 335px)";
      this.pagination = {
        total: 0,
        current: 1,
        size: 20,
      };
      this.getSearch();
      this.countHeight();
    },
    getSearch() {
      this.interactive.tableLoading = true;
      const listQuery = Object.assign({}, this.search, this.pagination);
      if (this.timeArr) {
        listQuery.beginTime = this.timeArr[0];
        listQuery.endTime = this.timeArr[1];
      }
      if (this.search.searchType) {
        listQuery[this.search.searchType] = this.search.searchValue;
      }
      this._getNormalPage(listQuery);
    },
    // 米粒入账
    _getNormalPage(listQuery) {
      getIntegralPage(listQuery).then((response) => {
        this.tableData = response.data.data.records;
        this.pagination.total = response.data.data.total;
        setTimeout(() => {
          this.interactive.tableLoading = false;
        }, 0.1 * 1000);
      });
    },

    resetForm() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
        userType: undefined,
      };
      this.timeArr = [];
      this.getSearch();
    },
    scopeUserId(val) {
      if (!val) {
        return "--";
      }
      if (val.userId) {
        return val.userId;
      }

      return "--";
    },
    scopeUserName(val) {
      if (!val) {
        return "--";
      }

      if (val.username) {
        return val.username;
      }

      return "--";
    },
    scopeMobile(val) {
      if (!val) {
        return "--";
      }

      if (val.mobile) {
        return val.mobile;
      }

      return "--";
    },
  },
};
</script>
<style lang="scss" scoped></style>
