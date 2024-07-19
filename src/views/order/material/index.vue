<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="订单编号：">
        <el-input
          v-model="parameter.orderNo"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="收货人搜索：">
        <el-input
          v-model="search.searchValue"
          style="width: 100%"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-select
            v-model="search.searchType"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option label="姓名" value="fullName"></el-option>
            <el-option label="联系电话" value="mobile"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="getList"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>

    <el-tabs v-model="interactive.activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="待付款" name="wait_pay"></el-tab-pane>
      <el-tab-pane label="待发货" name="wait_send"></el-tab-pane>
      <el-tab-pane label="已发货" name="wait_receive"></el-tab-pane>
      <el-tab-pane label="已完成" name="finished"></el-tab-pane>
      <el-tab-pane label="已关闭" name="canceled"></el-tab-pane>
    </el-tabs>
    <el-table
      v-loading="interactive.tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column label="订单编号">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo ? scope.row.orderNo : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收货人信息" width="120">
        <template slot-scope="scope">
          <div>{{ fullNameFilter(scope.row.express) }}</div>
          <div>{{ mobileFilter(scope.row.express) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="商品总数量" width="100">
        <template slot-scope="scope">
          <span>{{
            scope.row.totalQuantity ? scope.row.totalQuantity : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品总售价(元)" width="120">
        <template slot-scope="scope">
          <span>{{
            scope.row.orderAmount ? scope.row.orderAmount : "--"
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="总商品会员价(元)" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.orderAmount?scope.row.orderAmount:'--' }}</span>
          </template>
        </el-table-column> -->
      <el-table-column label="总商品米粒" width="100">
        <template slot-scope="scope">
          <span>{{
            scope.row.payIntegralAmount ? scope.row.payIntegralAmount : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="入账米粒">
        <template slot-scope="scope">
          <span>{{
            scope.row.incomeIntegral ? scope.row.incomeIntegral : "0"
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
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span>{{ scope.row.statusName ? scope.row.statusName : "--" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toOrderDetail(scope.row.orderId)"
            >详情</el-button
          >
          <el-button
            v-if="permissions.order_cancel && scope.row.status === 'wait_pay'"
            type="text"
            @click="toCancelOrder(scope.row)"
            >取消订单</el-button
          >
          <el-button
            v-if="permissions.order_deliver && scope.row.status === 'wait_send'"
            type="text"
            @click="toDeliverGoods(scope.row)"
            >发货</el-button
          >
          <el-button
            v-if="
              permissions.order_affirm_finished &&
              scope.row.status === 'wait_receive'
            "
            type="text"
            @click="toSureReceiving(scope.row)"
            >确认收货</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getList"
    />
    <!-- 取消订单 -->
    <el-dialog
      title="取消订单"
      :visible.sync="interactive.dialogFormVisible_cancelOrder"
      width="35%"
    >
      <el-form :model="cancelTemp">
        <el-form-item label="理由：">
          <el-input
            v-model="cancelTemp.cancelReason"
            style="width: 80%"
            autocomplete="off"
            placeholder="请填写取消订单的理由"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogFormVisible_cancelOrder = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="onCancelOrder">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 订单发货 -->
    <el-dialog
      title="订单发货"
      :visible.sync="interactive.dialogFormVisible_deliverGoods"
      width="50%"
    >
      <el-table :data="deliverTempTabel">
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsName ? scope.row.goodsName : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品规格">
          <template slot-scope="scope">
            <span>{{ scope.row.specName ? scope.row.specName : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品数量">
          <template slot-scope="scope">
            <span>{{ scope.row.quantity ? scope.row.quantity : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品状态">
          <template slot-scope="scope">
            <span>{{
              scope.row.statusName ? scope.row.statusName : "--"
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-form :model="deliverTemp">
        <el-form-item label="收货人信息：">
          <span>{{ deliverTemp.fullName }}（{{ deliverTemp.mobile }}）</span>
        </el-form-item>
        <el-form-item label="收货地址：">
          <span>{{ deliverTemp.locationName }} {{ deliverTemp.address }}</span>
        </el-form-item>
        <el-form-item label="物流公司：">
          <el-input
            v-model="deliverTemp.expressCompany"
            style="width: 80%"
            autocomplete="off"
            placeholder="请选择物流公司"
          ></el-input>
        </el-form-item>
        <el-form-item label="物流单号：">
          <el-input
            v-model="deliverTemp.expressNum"
            style="width: 80%"
            autocomplete="off"
            placeholder="请填写物流单号"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogFormVisible_deliverGoods = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="onDeliverGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import {
  getOrderGoodsPage,
  confirmOrderFinished,
  cancelOrder,
  deliverOrder,
} from "@/api/order/card";
import { mapGetters } from "vuex";

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      tableData: [],
      search: {
        searchType: undefined,
        searchValue: undefined,
      },
      //表示参数类
      parameter: {
        orderNo: undefined,
        status: undefined,
      },
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogFormVisible_cancelOrder: false,
        dialogFormVisible_deliverGoods: false,
        activeName: "all",
      },

      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
      // 取消订单
      cancelTemp: {
        cancelReason: "",
        orderId: undefined,
      },
      // 发货信息
      deliverTemp: {
        expressCompany: "",
        expressNum: "",
        orderId: undefined,
      },
      deliverTempTabel: [],
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.$nextTick(() => {
      this.getList();
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight();
      this.watchWidth();
    });
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
      let tabs = 55;
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        190
      }px)`;
    },
    getList() {
      this.interactive.tableLoading = true;
      const listQuery = Object.assign({}, this.parameter, this.pagination);
      if (this.search.searchType) {
        listQuery[this.search.searchType] = this.search.searchValue;
      }
      getOrderGoodsPage(listQuery).then((response) => {
        this.tableData = response.data.data.records;
        this.pagination.total = response.data.data.total;
        setTimeout(() => {
          this.interactive.tableLoading = false;
        }, 0.1 * 1000);
      });
    },
    // toUserAddressDetail(row) {
    //   this.$router.push('/address/user/detail')
    // },
    // 取消订单
    toCancelOrder(val) {
      this.cancelTemp.orderId = val.orderId;
      this.cancelTemp.cancelReason = undefined;
      this.interactive.dialogFormVisible_cancelOrder = true;
    },
    onCancelOrder() {
      cancelOrder(this.cancelTemp)
        .then(() => {
          this.$message({
            type: "success",
            message: "订单已取消!",
          });
          setTimeout(() => {
            this.interactive.dialogFormVisible_cancelOrder = false;
            this.getList();
          }, 0.1 * 1000);
        })
        .catch(() => {
          this.interactive.dialogFormVisible_cancelOrder = false;
        });
    },
    // 发货
    toDeliverGoods(val) {
      const temp = {
        orderId: val.orderId,
      };
      this.deliverTemp = Object.assign({}, temp, val.express);
      // 处理列表中需要的状态数据
      const tempTabel = val.orderItems;
      for (let index = 0; index < tempTabel.length; index++) {
        const element = tempTabel[index];
        element.statusName = val.statusName;
      }
      this.deliverTempTabel = tempTabel;
      this.interactive.dialogFormVisible_deliverGoods = true;
    },
    onDeliverGoods() {
      deliverOrder(this.deliverTemp)
        .then(() => {
          this.$message({
            type: "success",
            message: "订单已发货!",
          });
          this.getList();
          this.interactive.dialogFormVisible_deliverGoods = false;
        })
        .catch(() => {
          this.interactive.dialogFormVisible_deliverGoods = false;
        });
    },
    // 确定收货
    toSureReceiving(val) {
      this.$confirm("确认该订单退回商品已收货？", "收货提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const temp = {
            orderId: val.orderId,
            userId: val.user.userId,
          };
          confirmOrderFinished(temp).then(() => {
            this.$message({
              type: "success",
              message: "确定收货成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消确定收货",
          });
        });
    },
    //去实物订单详情
    toOrderDetail(val) {
      this.$router.push(`/order/material/detail/${val}`);
    },
    //标签切换
    handleClick() {
      if (this.interactive.activeName === "all") {
        this.parameter.status = undefined;
      } else {
        this.parameter.status = this.interactive.activeName;
      }
      this.pagination = {
        total: 0,
        current: 1,
        size: 20,
      };
      this.getList();
    },
    // 重置
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
      };
      //表示参数类
      this.parameter = {
        orderNo: undefined,
        status: undefined,
      };
      this.getList();
    },
    fullNameFilter(val) {
      if (!val) {
        return "--";
      }

      if (val.fullName) {
        return val.fullName;
      }
      return "--";
    },
    mobileFilter(val) {
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
<style scoped>
.center_deliverGoods {
  margin-top: 10px;
}
</style>
