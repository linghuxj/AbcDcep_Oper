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
            v-for="(type, index) in memberStatus"
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
      <el-form-item label="入会时间：">
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
      <el-button type="primary" @click="to_addMember"> 新增会员 </el-button>
      <el-button type="danger" @click="to_batchDelete"> 批量删除 </el-button>
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
      <el-table-column label="会员信息" width="150">
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
      <el-table-column label="服务范围">
        <template scope="scope">
          <span v-if="scope.row.serviceArea"
            >{{ scope.row.serviceArea.province }}{{ scope.row.serviceArea.city
            }}{{ scope.row.serviceArea.area }}</span
          ></template
        >
      </el-table-column>
      <!-- <el-table-column label="修改服务范围" width="180">
        <template scope="scope">
          <span v-if="scope.row.modifyServiceArea"
            >{{ scope.row.modifyServiceArea.province
            }}{{ scope.row.modifyServiceArea.city
            }}{{ scope.row.modifyServiceArea.area }}</span
          ></template
        >
      </el-table-column> -->
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
      <el-table-column label="服务范围审核状态">
        <template slot-scope="scope">
          {{
            scope.row.serviceLocationStatusName
              ? scope.row.serviceLocationStatusName
              : "--"
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="入会时间"
        width="150"
        prop="createTime"
      ></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="to_examine(scope.row.user.userId)"
            v-if="scope.row.serviceLocationStatus === 'audit'"
            >服务范围审核</el-button
          >
          <el-button type="text" @click="to_detail(scope.row.user.userId)"
            >查看详情</el-button
          >
          <el-button
            type="text"
            @click="to_move(scope.row.user.userId)"
            v-if="scope.row.status !== 'del'"
            >移除</el-button
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
    <!-- 新增会员 -->
    <el-dialog
      title="新增会员"
      :visible.sync="interactive.dialogVisibleAdd"
      width="50%"
      :before-close="handleCloseAdd"
    >
      <el-form :model="addForm">
        <el-form-item label="选择用户：">
          <el-autocomplete
            v-model="addForm.tel"
            popper-class="select-option"
            style="width: 50%"
            :fetch-suggestions="querySearchMobile"
            placeholder="请输入手机号码"
            @select="handleSelectUser"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisibleAdd = false"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="dialogAddMember"
          :loading="interactive.dialogLoading"
          >确定新增</el-button
        >
      </span>
    </el-dialog>
    <!-- 服务范围审核 -->
    <el-dialog
      title="服务范围审核"
      :visible.sync="interactive.dialogServiceArea"
      width="50%"
      :before-close="handleCloseServiceArea"
      :rules="rules"
    >
      <el-form :model="serviceForm" ref="ruleService">
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="serviceForm.status">
            <el-radio label="normal">审核通过</el-radio>
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
  reqMemberPage,
  reqMemberStatus,
  addMemberUnion,
  delMemberUnion,
  auditMemberLocation,
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
        dialogVisibleAdd: false,
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
      unionId: null,
      memberList: [],
      memberStatus: [],
      userIds: [],
      rules: {
        state: [{ required: true, message: "请选择状态", trigger: "change" }],
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
      },
    };
  },
  created() {
    this.unionId = this.$route.query.unionId;
    this._getMemberPage();
    this._getMemberStatus();
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
      this._getMemberPage();
    },
    // 获取会员列表
    _getMemberPage() {
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        unionId: this.unionId,
        keyword: this.form.keyword,
        beginJoinDate: this.form.joinDate[0],
        endJoinDate: this.form.joinDate[1],
        status: this.form.status,
      };
      reqMemberPage(data).then((res) => {
        this.memberList = res.data.data.records;
        console.debug("res", res);
      });
    },
    // 公会状态
    _getStatusPage() {
      reqStatusPage().then((res) => {
        console.debug("res", res);
        this.statusList = res.data.data;
      });
    },
    MembershipTime() {},
    // 查看会员详情
    to_detail(userId) {
      this.$router.push(`/member/detail/${userId}?unionId=${this.unionId}`);
    },
    // 去移除
    to_move(userId) {
      this.$confirm("是否要移除", "移除提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          let arr = [];
          arr.push(userId);
          this.userIds = arr;
          this._getDelMember();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消移除",
          });
        });
    },
    // 移除
    _getDelMember() {
      let data = {
        unionId: this.unionId,
        userIds: this.userIds,
      };
      delMemberUnion(data).then(() => {
        this.$message({
          type: "success",
          message: "确定移除成功!",
        });
        this._getMemberPage();
      });
    },
    to_search() {
      this._getMemberPage();
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
      this._getMemberPage();
    },
    // 新增会员
    to_addMember() {
      this.addForm.tel = null;
      this.interactive.dialogVisibleAdd = true;
    },
    // 公会成员状态字典
    _getMemberStatus() {
      reqMemberStatus().then((res) => {
        console.debug("res", res);
        this.memberStatus = res.data.data;
      });
    },
    // 确定新增
    dialogAddMember() {
      let data = {
        unionId: this.unionId,
        userId: this.addForm.userId,
      };
      this.interactive.dialogLoading = true;
      addMemberUnion(data)
        .then((res) => {
          console.debug("res", res);
          this.$message.success("新增成功");
          this.interactive.dialogLoading = false;
          this.interactive.dialogVisibleAdd = false;
          this._getMemberPage();
        })
        .catch(() => {
          this.interactive.dialogLoading = false;
        });
    },
    // 关闭新增弹框
    handleCloseAdd() {
      this.interactive.dialogVisibleAdd = false;
    },
    // 搜索会员
    querySearchMobile(mobile, cb) {
      console.debug("mobile", mobile);
      if (!mobile) {
        cb(this.searchRecords);
        return;
      }
      // // 搜索手机号码
      getUsersbyMobile(mobile).then((res) => {
        const users = res.data.data.records;
        cb(
          users.map((user) => {
            return {
              value: user.mobile + `(${user.username})`,
              userId: user.userId,
            };
          })
        );
      });
    },
    handleSelectUser(user) {
      console.debug("user", user);
      this.addForm.userId = user.userId;
      this.addForm.tel = user.value;
    },
    // 批量删除
    to_batchDelete() {
      this._getDelMember();
    },
    // 批量选中
    handleSelectTable(val) {
      let arr = [];
      console.debug("val", val);
      val.map((item) => {
        arr.push(item.user.userId);
      });
      this.userIds = arr;
    },
    // 审核
    dialogAudit(ruleService) {
      this.$refs[ruleService].validate((valid) => {
        if (valid) {
          auditMemberLocation(this.serviceForm)
            .then((res) => {
              this.$message.success("审核成功");
              this.interactive.dialogServiceArea = false;
            })
            .catch(() => {
              this.interactive.dialogServiceArea = false;
            });
        }
      });
    },
    // 去打开审核服务范围
    to_examine(userId) {
      this.serviceForm.userId = userId;
      this.interactive.dialogServiceArea = true;
    },
    handleCloseServiceArea() {
      this.interactive.dialogServiceArea = false;
    },
  },
};
</script>
<style scoped></style>
