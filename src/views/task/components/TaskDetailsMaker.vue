<template>
  <div>
    <div class="task-details-nav">
      <div v-if="permissions.task_confirm_profit" class="nav-item">
        <el-button type="primary" @click="confirmProfit"
          >一键确认收益</el-button
        >
      </div>
      <div class="nav-item">
        <el-input
          v-model="parameter.keyword"
          placeholder="请输入搜索内容关键字"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="getList"
            >搜索</el-button
          >
        </el-input>
      </div>
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :data="tableData"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      style="width: 100%"
    >
      <el-table-column prop="userId" label="创客ID" width="180">
      </el-table-column>
      <el-table-column label="创客信息" width="150">
        <template slot-scope="scope">
          <div>
            姓名：{{ scope.row.user.fullName ? scope.row.user.fullName : "--" }}
          </div>
          <div>
            手机号：{{ scope.row.user.mobile ? scope.row.user.mobile : "--" }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="userLevelName"
        label="创客类型"
        width="80"
      ></el-table-column>
      <el-table-column prop="userGrade" label="创客等级" width="80">
      </el-table-column>
      <el-table-column prop="praiseRate" label="好评率（%）" width="100">
      </el-table-column>
      <el-table-column prop="userTaskNum" label="任务领取次数(次)" width="130">
      </el-table-column>
      <el-table-column prop="createTime" label="最近领取时间" width="170">
      </el-table-column>
      <el-table-column prop="cancelTime" label="最近放弃时间" width="170">
      </el-table-column> -->
      <el-table-column width="200">
        <template slot="header">
          <div>总提交任务数</div>
          <div>(待审核/审核未通过/审核已通过)</div>
        </template>
        <template slot-scope="scope">
          <span
            >{{ scope.row.auditResultNum ? scope.row.auditResultNum : 0 }}/{{
              scope.row.failedResultNum ? scope.row.failedResultNum : 0
            }}/{{
              scope.row.normalResultNum ? scope.row.normalResultNum : 0
            }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="expectedIncome" label="总预计收益(元)" width="120">
      </el-table-column>
      <el-table-column prop="waitSettleAmount" label="待结算">
      </el-table-column>
      <el-table-column prop="settleAmount" label="已结算"> </el-table-column>
      <el-table-column prop="actualIncome" label="总实际收益（元）" width="120">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="210">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.task_profit_upd"
            type="text"
            size="mini"
            @click="settlementProfit(scope.row)"
            >结算收益</el-button
          >
          <!-- <el-button
            v-if="permissions.task_profit_upd"
            type="text"
            size="mini"
            @click="correctProfit(scope.row)"
            >纠正收益</el-button
          > -->
          <el-button type="text" size="mini" @click="browseRecord(scope.row)"
            >任务领取记录</el-button
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
    <el-dialog
      title="结算收益"
      :visible.sync="interactive.dialogSettlementVisible"
      width="30%"
    >
      <el-form ref="dataForm" :model="temp" label-position="left">
        <el-form-item label="预计收益：">
          {{ temp.expectedIncome ? temp.expectedIncome : 0 }}元
        </el-form-item>
        <el-form-item label="请填写你实际结算的收益：">
          <el-input
            v-model="temp.changeAmount"
            placeholder="请输入实际结算金额"
            @input="
              temp.changeAmount = asynchronousValidation(temp.changeAmount)
            "
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogSettlementVisible = false">
          取消
        </el-button>
        <el-button
          v-if="permissions.task_settlement_add"
          type="primary"
          @click="settlementTaskProfit"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog
      title="纠正收益"
      :visible.sync="interactive.dialogFormVisible"
      width="30%"
    >
      <el-form ref="dataForm" :model="temp" label-position="left">
        <el-form-item label="预计收益：">
          {{ temp.expectedIncome }}元
        </el-form-item>
        <el-form-item label="请填写你确认后的创客实际收益：">
          <el-input v-model="temp.profitAmount" placeholder="请输入名称">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          v-if="permissions.task_profit_upd"
          type="primary"
          @click="correctTaskProfit"
        >
          确定
        </el-button>
      </div>
    </el-dialog> -->

    <el-dialog
      title="任务领取记录"
      :visible.sync="interactive.dialogTableVisible"
      width="60%"
    >
      <el-table
        v-loading="interactive.browseLoading"
        :data="browseData"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        style="width: 100%"
      >
        <el-table-column prop="userTaskNo" label="领取记录单号" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="领取时间"> </el-table-column>
        <el-table-column prop="cancelTime" label="放弃时间"> </el-table-column>
        <el-table-column width="200">
          <template slot="header">
            <div>总提交任务数</div>
            <div>(待审核/审核未通过/审核已通过)</div>
          </template>
          <template slot-scope="scope">
            <span
              >{{
                scope.row.auditResultNum ? scope.row.auditResultNum : "---"
              }}/{{
                scope.row.failedResultNum ? scope.row.failedResultNum : "--"
              }}/{{
                scope.row.normalResultNum ? scope.row.normalResultNum : "--"
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="expectedIncome" label="预计收益">
        </el-table-column>
        <el-table-column prop="actualIncome" label="实际收益">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import {
  reqTaskReceiveUser,
  confirmTaskProfit,
  correctTaskSettlement,
  correctTaskProfit,
  reqTaskAll,
} from "@/api/task/list";

export default {
  name: "TaskDetailsMaker",
  components: { TablePagination },
  data() {
    return {
      tableData: [],
      browseData: [],
      temp: {
        // 结算金额
        changeAmount: undefined,
        userTaskId: undefined,
      },
      //表示参数类
      parameter: {
        taskId: undefined,
        keyword: undefined,
      },
      // 操作类型
      interactive: {
        browseLoading: false,
        tableLoading: false,
        // 结算任务收益弹窗
        dialogSettlementVisible: false,
        dialogFormVisible: false,
        dialogTableVisible: false,
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.$nextTick(() => {
      this.parameter.taskId = id;
      this.getList();
    });
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      return e;
    },
    getList() {
      this.interactive.tableLoading = true;
      const listQuery = Object.assign({}, this.parameter, this.pagination);
      reqTaskReceiveUser(listQuery)
        .then((resp) => {
          const page = resp.data.data;
          this.tableData = page.records;
          this.pagination.total = page.total;
          this.pagination.pages = page.pages;
          this.interactive.tableLoading = false;
        })
        .catch(() => {
          this.interactive.tableLoading = false;
        });
    },
    // 结算收益
    settlementProfit(val) {
      this.temp = {
        expectedIncome: val.expectedIncome,
        userTaskId: val.userTaskId,
      };
      this.interactive.dialogSettlementVisible = true;
    },
    // 结算收益提交
    settlementTaskProfit() {
      correctTaskSettlement({
        changeAmount: this.temp.changeAmount,
        userTaskId: this.temp.userTaskId,
      }).then((res) => {
        if (res.data.data) {
          this.$message.success("操作成功");
          this.interactive.dialogSettlementVisible = false;
          this.getList();
        }
      });
    },
    // 纠正收益
    correctProfit(val) {
      // console.log(val)
      this.temp = Object.assign({}, this.temp, val, this.parameter);
      this.interactive.dialogFormVisible = true;
    },
    correctTaskProfit() {
      correctTaskProfit(this.temp)
        .then(() => {
          this.$notify({
            title: "成功",
            message: "纠正收益操作成功！",
            type: "success",
            duration: 2000,
          });
          this.interactive.dialogFormVisible = false;
          this.getSearch();
        })
        .catch(() => {
          // console.error(e)
        });
    },
    // 浏览任务领取记录
    browseRecord(val) {
      console.log(val);
      this.interactive.browseLoading = true;
      const query = {
        taskId: this.parameter.taskId,
        userId: val.userId,
      };
      reqTaskAll(query)
        .then((res) => {
          const page = res.data.data;
          this.browseData = page;
          this.interactive.browseLoading = false;
        })
        .catch(() => {
          this.interactive.browseLoading = false;
        });
      this.interactive.dialogTableVisible = true;
    },
    // 一键确认收益
    confirmProfit() {
      const _this = this;
      _this
        .$confirm(
          "你对所有创客任务完成量和收益无异议，请点击【确认】按钮，确认后将自动履行智能合约完成支付。",
          "一键确认收益",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(() => {
          confirmTaskProfit(this.parameter)
            .then(() => {
              _this.$notify({
                title: "成功",
                message: "一键确认收益操作成功！",
                type: "success",
                duration: 2000,
              });
              this.getSearch();
            })
            .catch(() => {
              // console.error(e)
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column);
      if (columnIndex === 6 || columnIndex === 7) {
        if (rowIndex % this.browseData.length === 0) {
          return {
            rowspan: this.browseData.length,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.task-details-nav {
  margin-bottom: 10px;

  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
  .nav-item {
    font-size: 24px;
    font-weight: 600;
  }
}
</style>
