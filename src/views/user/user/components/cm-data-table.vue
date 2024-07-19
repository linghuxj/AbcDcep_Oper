<template>
  <div>
    <el-form
      :model="form"
      id="demo-form-inline"
      class="demo-form-inline"
      :inline="true"
    >
      <el-form-item label="类型：">
        <el-select v-model="form.typeCode" placeholder="请选择任务类型">
          <el-option
            v-for="(type, typeIndex) in typeList"
            :key="typeIndex"
            :label="type.dictName"
            :value="type.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option
            v-for="(status, statusIndex) in statusList"
            :key="statusIndex"
            :label="status.dictName"
            :value="status.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="任务信息搜索：">
        <el-input
          v-model="form.taskKeyword"
          placeholder="请输入任务单号/发布者信息/金额搜索"
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
      <el-table-column label="任务单号">
        <template slot-scope="scope">
          {{ scope.row.taskNo ? scope.row.taskNo : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="发布者信息" width="120">
        <template scope="scope">
          <div>
            姓名：{{
              scope.row.publisher ? scope.row.publisher.fullName : "--"
            }}
          </div>
          <div>
            手机号：{{
              scope.row.publisher ? scope.row.publisher.mobile : "-- "
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" prop="taskName"> </el-table-column>
      <el-table-column label="任务类型">
        <template slot-scope="scope">
          {{ scope.row.typeName ? scope.row.typeName : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="任务单价(元+米粒)" width="140" prop="unitPrice">
        <template slot-scope="scope">
          {{ scope.row.unitPrice
          }}{{ scope.row.unitIntegral > 0 ? "+" + scope.row.unitIntegral : "" }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态" width="90">
        <template slot-scope="scope">
          {{ scope.row.statusName ? scope.row.statusName : "--" }}
        </template>
      </el-table-column>
      <el-table-column
        label="领取任务时间"
        width="150"
        prop="receivedTime"
      ></el-table-column>
      <el-table-column label="完成任务时间" width="150" prop="completeTime">
        <template slot-scope="scope">
          {{ scope.row.completeTime ? scope.row.completeTime : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="to_detail(scope.row.taskId)"
            >查看任务</el-button
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
import { reqTaskReceived, reqTaskStatusTypes } from "@/api/user/detail";
import { getTaskTypeAll } from "@/api/task/type";
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
        taskKeyword: null,
        typeCode: null,
        userId: null,
        status: null,
      },
      list: [],
      statusList: [],
      typeList: [],
      addForm: {
        userId: null,
      },
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
    console.debug("this.$route.params.userId", this.$route.params.userId);
    this.form.userId = this.$route.params.userId;
    this._getTaskReceived();
    this._getTaskStatusTypes();
    this._getTaskTypeList();
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
      this._getTaskReceived();
    },
    // 列表
    _getTaskReceived() {
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        userId: this.form.userId,
        taskKeyword: this.form.taskKeyword,
        typeCode: this.form.typeCode,
        status: this.form.status,
      };
      this.interactive.listLoading = true;
      reqTaskReceived(data)
        .then((res) => {
          this.list = res.data.data.records;
          this.pagination.size = res.data.data.size;
          this.pagination.current = res.data.data.current;
          this.pagination.total = res.data.data.total;
          this.interactive.listLoading = false;
        })
        .catch(() => {
          this.interactive.listLoading = false;
        });
    },
    // 任务状态
    _getTaskStatusTypes() {
      reqTaskStatusTypes().then((res) => {
        this.statusList = res.data.data;
      });
    },
    // 任务类型
    _getTaskTypeList() {
      getTaskTypeAll().then((res) => {
        this.typeList = res.data.data;
      });
    },
    // 查看会员详情
    to_detail(taskId) {
      this.$router.push(`/task/details/${taskId}`);
    },
    // 去移除
    to_move() {},
    to_search() {
      this._getTaskReceived();
    },
    to_reset() {
      this.form = {
        taskKeyword: null,
        typeCode: null,
        status: null,
        userId: this.form.userId,
      };
      this._getTaskReceived();
    },
  },
};
</script>
<style scoped></style>
