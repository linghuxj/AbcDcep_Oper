<template>
  <div>
    <el-form
      :model="form"
      id="demo-form-inline"
      class="demo-form-inline"
      :inline="true"
    >
      <el-form-item label="状态：">
        <el-select v-model="form.status" placeholder="请选择">
          <el-option
            v-for="(type, index) in statusList"
            :key="index"
            :label="type.dictName"
            :value="type.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会员信息：">
        <el-input
          v-model="form.keyword"
          placeholder="请输入昵称/手机号"
          class="input-with-select"
          style="width: 100%"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="申请时间：">
        <el-date-picker
          v-model="form.joinDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="to_search">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" class="reset" @click="to_reset">
          重置
        </el-button>
      </div>
    </el-form>
    <div id="tableBtn">
      <el-button type="primary" @click="to_pass"> 批量通过 </el-button>
      <el-button type="danger" @click="to_failed"> 批量不通过 </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="interactive.listLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="memberList"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
      @selection-change="handleSelectTable"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="用户信息" width="150">
        <template slot-scope="scope">
          <div>昵称：{{ scope.row.user ? scope.row.user.username : "--" }}</div>
          <div>手机号：{{ scope.row.user ? scope.row.user.mobile : "--" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="会员头像">
        <template scope="scope">
          <el-avatar
            :size="50"
            :src="scope.row.user ? scope.row.user.avatar : ''"
            shape="square"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="个人服务范围">
        <template scope="scope">
          <span v-if="scope.row.serviceArea"
            >{{ scope.row.serviceArea.province }}{{ scope.row.serviceArea.city
            }}{{ scope.row.serviceArea.area }}</span
          ></template
        >
      </el-table-column>
      <el-table-column label="最近一次完成任务时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.lastFinishTime ? scope.row.lastFinishTime : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.statusName ? scope.row.statusName : "--" }}
        </template>
      </el-table-column>
      <el-table-column
        label="审核时间"
        width="150"
        prop="createTime"
      ></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="to_updateStatus(scope.row)"
            >修改状态</el-button
          >
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
    <!-- 审核 -->
    <el-dialog
      title="审核"
      :visible.sync="interactive.dialogServiceArea"
      width="50%"
      :before-close="handleCloseServiceArea"
    >
      <el-form :model="serviceForm" ref="ruleService" :rules="rules">
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="serviceForm.status">
            <el-radio label="joined">审核通过</el-radio>
            <el-radio label="failed">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="备注："
          v-if="serviceForm.status === 'failed'"
          prop="remark"
        >
          <el-input
            type="textarea"
            placeholder="请输入不通过原因"
            v-model="serviceForm.remark"
            style="width: 400px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogServiceArea = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="dialogAudit('ruleService')"
          :loading="interactive.dialogLoading"
          >审核</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqApplyMemberList,
  auditMemberJoin,
  reqApplyStatusList,
} from "@/api/guild/detail";
import { getUsersbyMobile } from "@/api/user/user";
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
        dialogLoading: false,
        dialogServiceArea: false,
      },
      form: {
        searchStoreValue: null,
        searchStoreType: null,
        beginJoinDate: null,
        endJoinDate: null,
        joinDate: [],
        keyword: null,
        status: null,
      },
      statusList: [],
      addForm: {
        userId: null,
        tel: null,
      },
      serviceForm: {
        status: null,
        remark: null,
        userIds: null,
        unionId: null,
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
      unionId: null,
      memberList: [],
      memberStatus: [],
      userIds: [],
      rules: {
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
      },
    };
  },
  created() {
    this.unionId = this.$route.query.unionId;
    this._getApplyMemberList();
    this._getApplyStatus();
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
      this._getApplyMemberList();
    },
    // 获取申请入会列表
    _getApplyMemberList() {
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        unionId: this.unionId,
        keyword: this.form.keyword,
        beginJoinDate: this.form.joinDate[0],
        endJoinDate: this.form.joinDate[1],
        status: this.form.status,
      };
      reqApplyMemberList(data).then((res) => {
        this.memberList = res.data.data.records;
        this.pagination.current = res.data.data.current;
        this.pagination.total = res.data.data.total;
      });
    },
    // 公会状态
    _getApplyStatus() {
      reqApplyStatusList().then((res) => {
        console.debug("res", res);
        this.statusList = res.data.data;
      });
    },
    //修改打开状态
    to_updateStatus(val) {
      this.serviceForm.unionId = this.unionId;
      let arr = [];
      arr.push(val.user.userId);
      this.serviceForm.userIds = arr;
      this.interactive.dialogServiceArea = true;
    },
    // 批量通过
    to_pass() {
      console.debug("this.user", this.userIds);
      this.serviceForm.status = "joined";
      this._toAuditMemberJoin();
    },
    // 批量不通过
    to_failed() {
      this.serviceForm.status = "failed";
      this._toAuditMemberJoin();
    },
    to_search() {
      this._getApplyMemberList();
    },
    to_reset() {
      this.form = {
        searchStoreValue: null,
        searchStoreType: null,
        beginJoinDate: null,
        endJoinDate: null,
        joinDate: [],
        keyword: null,
        status: null,
      };
      this._getApplyMemberList();
    },
    // 批量选中
    handleSelectTable(val) {
      let arr = [];
      console.debug("val", val);
      val.map((item) => {
        arr.push(item.user.userId);
      });
      this.serviceForm.userIds = arr;
    },
    // 审核
    dialogAudit(ruleService) {
      this.$refs[ruleService].validate((valid) => {
        if (valid) {
          this._toAuditMemberJoin();
        }
      });
    },
    // 审核
    _toAuditMemberJoin() {
      console.debug("serviceForm", this.serviceForm);
      auditMemberJoin(this.serviceForm)
        .then((res) => {
          this.$message.success("成功");
          this.interactive.dialogServiceArea = false;
          this._getApplyMemberList();
        })
        .catch(() => {
          this.interactive.dialogServiceArea = false;
        });
    },
    handleCloseServiceArea() {
      this.interactive.dialogServiceArea = false;
    },
  },
};
</script>
<style scoped></style>
