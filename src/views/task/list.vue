<template>
  <div class="main-content task-list">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
    >
      <el-form-item label="发布者搜索：">
        <el-input
          v-model="search.searchValue"
          style="width: 100%"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-select
            v-model="search.searchType"
            placeholder="请选择"
            slot="prepend"
          >
            <el-option label="发布者姓名" value="publisherName"></el-option>
            <el-option
              label="发布者手机号"
              value="publisherMobile"
            ></el-option> </el-select
        ></el-input>
      </el-form-item>
      <el-form-item label="任务名称：">
        <el-input
          v-model="parameter.taskName"
          placeholder="请输入任务名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="任务类型：">
        <el-select v-model="parameter.typeCode">
          <el-option
            v-for="level in taskTypeAll"
            :key="level.dictValue"
            :label="level.dictName"
            :value="level.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.task_add"
        type="primary"
        icon="el-icon-plus"
        @click="addCompile"
        >新增任务</el-button
      >
    </div>
    <el-tabs
      id="tabs"
      v-model="interactive.activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="审核通过"
        :disabled="interactive.tableLoading"
        name="first"
      >
        <el-table
          v-loading="interactive.tableLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="tableData"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :height="tableHeight"
          tooltip-effect="dark"
        >
          <el-table-column
            prop="taskNo"
            label="任务单号"
            width="130"
            align="center"
          />
          <el-table-column label="发布者信息" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>姓名：{{ numFilter(scope.row.publisher) }}</div>
              <div>
                手机号：{{
                  scope.row.publisher ? scope.row.publisher.mobile : "--"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="任务名称" align="center" />
          <el-table-column prop="typeName" label="任务类型" align="center" />
          <el-table-column
            prop="unitPrice"
            label="任务单价(元+米粒)"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.unitPrice ? scope.row.unitPrice + "元" : "" }}
              {{ scope.row.unitPrice && scope.row.unitIntegral ? "+" : "" }}
              {{
                scope.row.unitIntegral ? scope.row.unitIntegral + "米粒" : ""
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="已完成任务数/任务目标数"
            align="center"
            width="160"
          >
            <template slot-scope="scope">
              <span
                >{{ scope.row.resultNum ? scope.row.resultNum : "0" }}
                /
                {{
                  scope.row.taskTarget === 0 ? "不限" : scope.row.taskTarget
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="已领人数/领取人数" align="center" width="135">
            <template slot-scope="scope">
              <span
                >{{ scope.row.receiveNum ? scope.row.receiveNum : "0" }} /
                {{ scope.row.personNum ? scope.row.personNum : "不限" }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="closeTime"
            label="截止时间"
            align="center"
            width="135"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.deadlineTime ? scope.row.deadlineTime : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="statusName"
            label="任务状态"
            align="center"
            width="130"
          >
            <template slot-scope="scope" align="center">
              <el-button
                v-if="scope.row.statusName == '进行中'"
                type="success"
                plain
                disabled
                >{{ scope.row.statusName }}</el-button
              >
              <el-button v-else type="danger" plain disabled>{{
                scope.row.statusName
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="领取后超时时间(小时)" width="150">
            <template slot-scope="scope">
              {{
                scope.row.cancelReceiveType === "unlimited"
                  ? "不限制"
                  : scope.row.cancelReceiveType === "period_time"
                  ? scope.row.cancelReceivePeriod
                  : "--"
              }}
            </template>
          </el-table-column>
          <el-table-column label="审核时间" width="150" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.auditTime ? scope.row.auditTime : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            align="center"
            width="210"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="taskShare(scope.row.taskId, scope.row.taskName)"
                >分享</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="handleDetails(scope.row.taskId)"
                >详情</el-button
              >
              <el-button
                v-if="permissions.task_edit && scope.row.status == 'progress'"
                type="text"
                size="mini"
                style="color: red"
                @click="handleUpdate(scope.row.taskId)"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="distribute(scope.row.taskId)"
                >分发列表</el-button
              >
              <!-- <el-button
                v-if="scope.row.status === 'progress' && permissions.task_end"
                type="text"
                size="mini"
                @click="handleDelete(scope.row)"
                >结束</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        label="待审核"
        :disabled="interactive.tableLoading"
        name="second"
      >
        <el-table
          v-loading="interactive.tableLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="tableData"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :height="tableHeight"
          tooltip-effect="dark"
        >
          <el-table-column
            prop="taskNo"
            label="任务单号"
            width="130"
            align="center"
          />
          <el-table-column label="发布者信息" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>姓名：{{ numFilter(scope.row.publisher) }}</div>
              <div>
                手机号：{{
                  scope.row.publisher ? scope.row.publisher.mobile : "--"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="任务名称" align="center" />
          <el-table-column
            prop="unitPrice"
            label="任务单价(元)"
            align="center"
          />
          <el-table-column label="任务目标数" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.taskTarget === 0 ? "不限" : scope.row.taskTarget
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领取人数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.personNum ? scope.row.personNum : "0" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领取后超时时间(小时)" width="150">
            <template slot-scope="scope">
              {{
                scope.row.cancelReceiveType === "unlimited"
                  ? "不限制"
                  : scope.row.cancelReceiveType === "period_time"
                  ? scope.row.cancelReceivePeriod
                  : "--"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="cycle" label="任务周期（天）" align="center" />
          <el-table-column
            prop="createTime"
            label="发布时间"
            align="center"
            width="135"
          />
          <el-table-column
            v-if="permissions.task_audit"
            key="2"
            label="操作"
            fixed="right"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                v-if="permissions.task_audit"
                type="text"
                size="mini"
                @click="toExamine(scope.row.taskId)"
                >审核</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane
        label="审核不通过"
        :disabled="interactive.tableLoading"
        name="third"
      >
        <el-table
          v-loading="interactive.tableLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="tableData"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          tooltip-effect="dark"
          :height="tableHeight"
        >
          <el-table-column
            prop="taskNo"
            label="任务单号"
            width="130"
            align="center"
          />
          <el-table-column label="发布者信息" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>姓名：{{ numFilter(scope.row.publisher) }}</div>
              <div>
                手机号：{{
                  scope.row.publisher ? scope.row.publisher.mobile : "--"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="任务名称" align="center" />
          <el-table-column
            prop="unitPrice"
            label="任务单价(元)"
            align="center"
          />
          <el-table-column label="任务目标数" width="110" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.personNum === 0 ? "不限" : scope.row.personNum
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领取人数" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.personNum ? scope.row.personNum : "0" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领取后超时时间(小时)" width="150">
            <template slot-scope="scope">
              {{
                scope.row.cancelReceiveType === "unlimited"
                  ? "不限制"
                  : scope.row.cancelReceiveType === "period_time"
                  ? scope.row.cancelReceivePeriod
                  : "--"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="cycle" label="任务周期（天）" align="center" />
          <el-table-column
            prop="auditTime"
            label="审核时间"
            align="center"
            width="160"
          />

          <el-table-column label="操作" fixed="right" align="center" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleDetails(scope.row.taskId)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getSearch"
    />
    <!-- 分享任务 -->
    <el-dialog title="分享任务" :visible.sync="shareVisible" width="50%">
      <el-form label-width="100px">
        <el-form-item label="任务名称：">
          {{ shareTaskName }}
        </el-form-item>
        <el-form-item label="分享链接：">
          {{ taskLink }}
          <el-button type="primary" size="mini" round @click="copyLink"
            >复制链接</el-button
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shareVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 分发列表 -->
    <el-dialog
      title="任务分发列表"
      :visible.sync="distributeVisible"
      width="75%"
    >
      <el-table
        :data="distributeList"
        border
        :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      >
        <el-table-column label="分发人" prop="publisher.fullName">
        </el-table-column>
        <el-table-column label="任务名称" prop="taskName"> </el-table-column>
        <el-table-column label="领取人数" prop="receiveNum"> </el-table-column>
        <el-table-column label="有效结果数" prop="resultNum"> </el-table-column>
        <el-table-column label="预计总收益" prop="expectedIncome">
        </el-table-column>
        <el-table-column label="实际总收益" prop="actualIncome">
        </el-table-column>
        <el-table-column label="已结算收益" prop="settleAmount">
        </el-table-column>
        <el-table-column label="待结算收益" prop="unSettleAmount">
        </el-table-column>
        <el-table-column label="操作" width="75" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetails(scope.row.taskId)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        :total="d_pagination.total"
        :page.sync="d_pagination.current"
        :limit.sync="d_pagination.size"
        @pagination="getSearch"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getTaskPage,
  endTask,
  getDistributeList,
  getTaskLink,
} from "@/api/task/list";
import TablePagination from "@/components/table-pagination";

// import { fetchItemList } from '@/api/system/dict'
import { getTaskTypeAll } from "@/api/task/type";

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      tableData: [],
      taskStatus: [],
      taskTypeAll: [],
      //表示参数类
      parameter: {
        typeCode: undefined,
        taskName: undefined,
        auditStatus: ["passed"],
      },
      search: {
        searchType: undefined,
        searchValue: undefined,
      },
      // 操作类型
      interactive: {
        activeName: "first",
        tableLoading: false,
        dialogFormVisible: false,
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
      // 分享任务弹窗
      shareVisible: false,
      // 任务分发列表弹窗
      distributeVisible: false,
      // 分发列表数据
      distributeList: [],
      d_pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
      // 任务链接
      taskLink: "",
      // 任务名称
      shareTaskName: "",
    };
  },

  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    // this.initFetchItemList()
    this.initTaskTypeAll();
    this.getSearch();
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
        187
      }px)`;
    },
    // tabs切换
    handleClick(tab) {
      // 表格高度
      this.tableHeight = "calc(100vh - 335px)";
      if (tab.name === "second") {
        this.parameter.auditStatus = ["audit"];
      } else if (tab.name === "first") {
        this.parameter.auditStatus = ["passed"];
      } else if (tab.name === "third") {
        this.parameter.auditStatus = ["failed"];
      }
      this.getSearch();
      setTimeout(() => {
        this.countHeight();
      }, 500);
    },
    initTaskTypeAll() {
      getTaskTypeAll().then((resp) => {
        const page = resp.data.data;
        this.taskTypeAll = page;
      });
    },
    // 查询列表
    getSearch() {
      this.interactive.tableLoading = true;
      const listQuery = Object.assign({}, this.parameter, this.pagination);
      if (this.search.searchType) {
        listQuery[this.search.searchType] = this.search.searchValue;
      }
      getTaskPage(listQuery)
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
    resetForm() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
      };
      this.parameter = {
        typeCode: undefined,
        taskName: undefined,
        auditStatus: ["passed"],
      };
      this.search = {
        closeTime: undefined,
        location: undefined,
        status: undefined,
        taskName: undefined,
      };
      this.getSearch();
    },

    // 新增
    addCompile() {
      this.$router.push(`/task/compile`);
    },

    // 审核
    toExamine(val) {
      this.$router.push(`/task/examine/${val}`);
    },

    handleDetails(val) {
      this.$router.push(`/task/details/${val}`);
    },
    handleUpdate(val) {
      this.$router.push(`/task/establish/${val}`);
    },
    // 分享
    taskShare(taskId, taskName) {
      getTaskLink(taskId).then((res) => {
        this.taskLink = res.data.data;
      });
      this.shareTaskName = taskName;
      this.shareVisible = true;
    },
    // 分发列表
    distribute(taskId) {
      getDistributeList({ ...this.d_pagination, parentId: taskId }).then(
        (res) => {
          this.distributeList = res.data.data.records;
          this.d_pagination.total = res.data.data.total;
          this.distributeVisible = true;
          console.log(this.distributeList);
        }
      );
    },
    handleDelete(row) {
      const _this = this;
      _this
        .$confirm("是否要结束“" + row.taskName + "”任务？", "信息提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          endTask(row.taskId).then(() => {
            _this.$notify({
              title: "成功",
              message: "“" + row.taskName + "”任务已结束",
              type: "success",
              duration: 3000,
            });
            this.getSearch();
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 数据处理
    numFilter(val) {
      if (!val) {
        return "--";
      }

      if (val.fullName) {
        return val.fullName;
      }

      if (val.username) {
        return val.username;
      }
      return "--";
    },
    // 复制链接
    copyLink() {
      var input = document.createElement("input"); // js创建一个input输入框
      input.value = this.taskLink; // 将需要复制的文本赋值到创建的input输入框中
      document.body.appendChild(input); // 将输入框暂时创建到实例里面
      input.select(); // 选中输入框中的内容
      document.execCommand("Copy"); // 执行复制操作
      document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
      this.$message({
        message: "复制成功",
        type: "success",
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
