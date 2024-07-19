<template>
  <div>
    <div class="task-details-nav">
      <el-button type="primary" @click="to_downloadResult"
        >导出任务结果</el-button
      >
      <div class="nav-item">
        <el-radio-group v-model="parameter.status" @change="getList">
          <el-radio>全部</el-radio>
          <el-radio label="audit">未审核</el-radio>
          <el-radio label="normal">审核已通过</el-radio>
          <el-radio label="failed">审核未通过</el-radio>
        </el-radio-group>
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
      <el-table-column label="创客ID" prop="auditUser.userId" width="180">
      </el-table-column>
      <el-table-column label="创客信息" width="180">
        <template slot-scope="scope">
          <div>姓名：{{ scope.row.user ? scope.row.user.fullName : "--" }}</div>
          <div>
            联系方式：{{ scope.row.user ? scope.row.user.mobile : "--" }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="领取记录单号" prop="userTaskId" width="100" />
      <el-table-column label="任务领取时间" prop="receiveTime" width="100" /> -->
      <el-table-column label="意向店铺名称" prop="storeName" width="100" />
      <el-table-column
        label="证明文件"
        width="275"
        :show-overflow-tooltip="true"
      >
        <template
          slot-scope="scope"
          v-if="scope.row.auditResUrls && scope.row.auditResUrls.length > 0"
        >
          <el-image
            v-for="(item, idx) in scope.row.auditResUrls"
            :key="idx"
            style="width: 80px; height: 80px; margin-left: 3px"
            :src="item"
            fit="cover"
            :preview-src-list="scope.row.auditResUrls"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="任务结果描述"
        prop="resultDesc"
        :show-overflow-tooltip="true"
        width="100"
      ></el-table-column>
      <el-table-column
        label="凭证结果图"
        width="275"
        :show-overflow-tooltip="true"
      >
        <template
          slot-scope="scope"
          v-if="scope.row.resUrls && scope.row.resUrls.length > 0"
        >
          <el-image
            v-for="(item, idx) in scope.row.resUrls"
            :key="idx"
            style="width: 80px; height: 80px; margin-left: 3px"
            :src="item"
            fit="cover"
            :preview-src-list="scope.row.resUrls"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" prop="statusName"></el-table-column>
      <el-table-column label="提交时间" prop="createTime"></el-table-column>
      <el-table-column label="审核时间" prop="auditTime"></el-table-column>
      <el-table-column label="审核原因" prop="reason"></el-table-column>
      <el-table-column label="结果审核" fixed="right" width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'audit'">
            <el-button
              v-if="permissions.task_result_audit"
              type="text"
              size="mini"
              @click="toExamine(scope.row)"
              >结果审核</el-button
            >
            <el-button
              v-if="permissions.task_result_assign"
              type="text"
              size="mini"
              @click="assignExamine(scope.row)"
              >结果指派</el-button
            >
          </span>
          <span v-else>--</span>
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
    <!-- 结果审核 -->
    <ResultAudit ref="auditDialog" :auditItem="auditItem" />
    <!-- 审核指派" -->
    <el-dialog
      title="审核指派"
      :visible.sync="interactive.dialogVisible"
      width="20%"
    >
      <el-form ref="itemForm" :model="temps" label-position="left">
        <el-form-item label="指派审核人">
          <el-select
            v-model="temps.auditUserId"
            filterable
            remote
            placeholder="请输入手机号"
            :remote-method="remoteMethod"
            :loading="interactive.loading"
          >
            <el-option
              v-for="(item, index) in userInfo"
              :key="index"
              :label="item.mobile + '（' + item.username + ')'"
              :value="item.userId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisible = false"> 取消 </el-button>
        <el-button
          v-if="permissions.task_result_assign"
          type="primary"
          @click="assignExamineTask"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import ResultAudit from "./result-audit";
import {
  reqTaskResultPage,
  auditTaskResult,
  getTaskByMobile,
  assignTaskResult,
  downloadResult,
} from "@/api/task/list";

export default {
  name: "TaskDetailsResult",
  components: { TablePagination, ResultAudit },
  data() {
    return {
      tableData: [],
      userInfo: [],
      //表示参数类
      parameter: {
        taskId: undefined,
        keyword: undefined,
        status: undefined,
      },
      // 审核
      temp: {
        reason: "",
        status: "normal",
        id: undefined,
        resUrls: [],
      },
      temps: {
        auditUserId: undefined,
        taskResultId: undefined,
      },
      // 操作类型
      interactive: {
        loading: false,
        tableLoading: false,
        dialogFormVisible: false,
        dialogVisible: false,
      },
      auditItem: null,
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
    // 查询列表
    getList() {
      this.tableLoading = true;
      const listQuery = Object.assign({}, this.parameter, this.pagination);
      reqTaskResultPage(listQuery)
        .then((resp) => {
          const page = resp.data.data;
          this.tableData = page.records;
          this.tableData.forEach((item) => {
            item.resUrls = [];
            // 如果有任务结果详细内容信息 遍历
            if (Array.isArray(item.items) && item.items.length > 0) {
              item.items.forEach((citem) => {
                // 如果存在凭证图片 将图片存入最外层resUrls
                if (Array.isArray(citem.resUrls) && citem.resUrls.length > 0) {
                  item.resUrls = [...item.resUrls, ...citem.resUrls];
                }
                // 如果结果类型为potential_store 获取对应items的意向店铺名称  类型为task_result_image 则获取对应描述
                if (citem.relationType == "potential_store") {
                  item.storeName = citem.potentialStore.storeName || "--";
                } else if (citem.relationType == "task_result_image") {
                  item.resultDesc = citem.resultDesc || "--";
                }
              });
            }
          });
          console.log(this.tableData);
          this.pagination.total = page.total;
          this.pagination.pages = page.pages;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 导出任务结果列表
    to_downloadResult() {
      let data = {
        current: this.pagination.current,
        size: this.pagination.size,
        keyword: this.parameter.keyword,
        taskId: this.parameter.taskId,
        status: this.parameter.status,
      };
      downloadResult(data).then((res) => {
        console.debug("导出成功", res);
        //定义文件名
        const xlsx = "application/vnd.ms-excel";
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" }); //转换数据类型
        // 转换完成，创建一个a标签用于下载
        const link = document.createElement("a");
        //URL.createObjectURL() 静态方法会创建一个 DOMString，
        link.href = URL.createObjectURL(blob);
        link.download = "任务结果列表" + new Date().getTime() + ".xlsx"; //下载的文件名
        // link(a)是一个dom元素（一个标签），向body中插入了一个dom(a)元素。
        document.body.appendChild(link);
        link.click();
        // 释放内存
        a.remove();
      });
    },
    // 审核
    toExamine(val) {
      // this.temp = {
      //   reason: "",
      //   status: "normal",
      //   id: undefined,
      //   resUrls: [],
      // };
      // this.temp.id = val.id;
      // this.temp.taskId = val.taskId;
      // this.temp.resultId = val.resultId;
      // this.interactive.dialogFormVisible = true;
      this.auditItem = val;
      setTimeout(() => {
        this.$refs.auditDialog.show();
      }, 200);
    },
    toExamineTask() {
      // 获取参考图片
      const uploadParams = this.$refs.uploadExplain.imgURL;

      uploadParams.forEach((item, indexs) => {
        this.temp.resUrls[indexs] = item;
      });
      auditTaskResult(this.temp)
        .then(() => {
          this.$notify({
            title: "成功",
            message: "审核成功！",
            type: "success",
            duration: 2000,
          });
          this.interactive.dialogFormVisible = false;
          this.getList();
        })
        .catch(() => {
          this.interactive.dialogFormVisible = false;
        });
    },
    // 指派审核
    assignExamine(val) {
      this.temps = {
        auditUserId: undefined,
        taskResultId: undefined,
      };
      this.temps.taskResultId = val.id;
      this.interactive.dialogVisible = true;
    },
    assignExamineTask() {
      assignTaskResult(this.temps)
        .then(() => {
          this.$notify({
            title: "成功",
            message: "指派成功！",
            type: "success",
            duration: 2000,
          });
          this.interactive.dialogVisible = false;
          this.getList();
        })
        .catch(() => {
          this.interactive.dialogVisible = false;
        });
    },
    // 远程搜索
    remoteMethod(mobile) {
      if (mobile !== "") {
        this.qloading = true;
        // 搜索手机号码
        getTaskByMobile(mobile).then((res) => {
          const users = res.data.data;
          this.userInfo = users;
          this.qloading = false;
        });
      } else {
        this.userInfo = [];
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
.content-wrap {
  display: flex;
  height: 100px;
  line-height: 100px;
  flex-direction: column;
  justify-content: center;
}
</style>
