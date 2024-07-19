<template>
  <div>
    <el-form
      :model="form"
      id="demo-form-inline"
      class="demo-form-inline"
      :inline="true"
    >
      <el-form-item label="消费类型：">
        <el-select v-model="form.orderType" placeholder="请选择消费类型">
          <el-option
            v-for="(type, index) in typesList"
            :key="index"
            :label="type.dictName"
            :value="type.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式：">
        <el-select v-model="form.payMode" placeholder="请选择支付方式">
          <el-option
            v-for="(type, index) in wayList"
            :key="index"
            :label="type.wayName"
            :value="type.wayCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模糊搜索：">
        <el-input
          v-model="form.keyword"
          placeholder="请输入店铺名称/金额/订单号搜索"
          class="input-with-select"
          style="width: 100%"
        >
        </el-input>
      </el-form-item>
      <div style="margin-bottom: 10px">
        <el-button type="primary" icon="el-icon-search" @click="to_search">
          查询
        </el-button>
        <el-button icon="el-icon-refresh" class="reset" @click="to_reset">
          重置
        </el-button>
      </div>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="interactive.listLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="list"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="消费类型">
        <template slot-scope="scope">
          {{ scope.row.orderTypeName ? scope.row.orderTypeName : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="店铺名称">
        <template scope="scope">
          <div>{{ scope.row.store ? scope.row.store.storeName : "--" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="消费金额">
        <template scope="scope">{{ scope.row.orderAmount }}</template>
      </el-table-column>
      <el-table-column label="支付金额">
        <template slot-scope="scope">
          <span>{{ scope.row.payAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单号"
        width="200"
        prop="orderNo"
      ></el-table-column>
      <el-table-column
        label="支付方式"
        width="150"
        prop="payModeName"
      ></el-table-column>
      <el-table-column
        label="消费时间"
        width="150"
        prop="createTime"
      ></el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="to_detail(scope.row.orderId)"
            >查看订单</el-button
          >
          <!-- <el-button type="text" @click="to_move(scope)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      v-if="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { reqUserPage, reqWayAll, reqTypesOrder } from "@/api/user/detail";
import TablePagination from "@/components/table-pagination";
export default {
  components: {
    TablePagination,
  },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      interactive: {
        listLoading: false,
      },
      form: {
        orderType: null,
        payMode: null,
        keyword: null,
      },
      list: [],
      statusList: [],
      addForm: {
        userId: null,
      },
      userId: null,
      wayList: [],
      typesList: [],
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //总条数
        total: 0,
      },
    };
  },
  created() {
    this.userId = this.$route.params.userId;
    console.debug("this.$router.params.id", this.$route.params.userId);
    this._getUserPage();
    this._getWayAll();
    this._getTypesOrder();
  },
  mounted() {
    this.countHeight();
    this.watchWidth();
  },
  methods: {
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
    getList() {
      this._getUserPage();
    },
    // 获取用户订单
    _getUserPage() {
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        userId: this.userId,
        keyword: this.form.keyword,
        orderType: this.form.orderType,
        payMode: this.form.payMode,
      };
      reqUserPage(data).then((res) => {
        console.debug("reqUserPage", res);
        this.list = res.data.data.records;
        this.pagination.size = res.data.data.size;
        this.pagination.current = res.data.data.current;
        this.pagination.total = res.data.data.total;
      });
    },
    // 获取支付方式
    _getWayAll() {
      reqWayAll().then((res) => {
        console.debug("res", res);
        this.wayList = res.data.data;
      });
    },
    // 公会状态
    _getTypesOrder() {
      reqTypesOrder().then((res) => {
        console.debug("res", res);
        this.typesList = res.data.data;
      });
    },
    // 查看订单详情
    to_detail(orderId) {
      this.$router.push(`order/mention/detail/${orderId}`);
    },
    // 搜索
    to_search() {
      this._getUserPage();
    },
    // 重置
    to_reset() {
      this.form = {
        keyword: this.form.keyword,
        orderType: this.form.orderType,
        payMode: this.form.payMode,
      };
      this._getUserPage();
    },
  },
};
</script>
<style scoped></style>
