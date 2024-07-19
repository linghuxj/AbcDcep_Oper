<template>
  <!-- 用户列表 -->
  <div class="main-content user">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="注册来源：">
        <el-select v-model="search.platform">
          <el-option
            v-for="(item, index) in platformList"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户搜索：">
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
            <el-option label="用户ID" value="userId" />
            <el-option label="用户手机号" value="mobile" />
            <el-option label="用户昵称" value="username" />
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="注册时间：">
        <el-date-picker
          v-model="timeArr"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="timeChange"
        ></el-date-picker>
      </el-form-item>
      <div>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getList('search')"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>
    <el-tabs v-model="status" @tab-click="tabChange">
      <el-tab-pane label="正常用户" name="normal" />
      <el-tab-pane label="已冻结用户" name="disabled" />
    </el-tabs>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.tableType === 'userMes'">
            <div class="imgText">
              <span> 昵称：{{ scope.row["username"] }} </span>
              <span> 手机号：{{ scope.row["mobile"] }} </span>
            </div>
          </template>
          <div v-else-if="item.tableType === 'img'">
            <el-avatar :size="50" :src="scope.row.avatar"></el-avatar>
          </div>
          <span v-else-if="item.level == 2">
            {{ scope.row[item.value[0]][item.value[1]] }}
          </span>
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row.userId)">
            查看详情
          </el-button>
          <el-button
            v-if="scope.row.status == 'normal' && permissions.user_status_edit"
            type="text"
            @click="editSubscriberStatus(scope.row, 'disabled')"
          >
            冻结
          </el-button>
          <el-button
            v-else-if="
              scope.row.status == 'disabled' && permissions.user_status_edit
            "
            type="text"
            @click="editSubscriberStatus(scope.row, 'normal')"
          >
            解冻
          </el-button>
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import {
  getSubscriberPage,
  editSubscriberStatus,
} from "@/api/customer/subscriber";
import { reqPlatformTypes } from "@/api/user/user";
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      // 表格列配置
      tableArr: [
        {
          label: "用户信息",
          value: "payAmount",
          tableType: "userMes",
          width: 150,
        },
        {
          label: "用户头像",
          value: "avatar",
          tableType: "img",
          width: 150,
        },
        {
          label: "当前余额（人民币）",
          value: "walletBalance",
        },
        {
          label: "当前余额（米粒）",
          value: "integralBalance",
        },
        {
          label: "收益总金额",
          value: "taskIncomeAmount",
        },
        {
          label: "消费总金额",
          value: "expenditureTotalAmount",
        },
        {
          label: "注册来源",
          value: "platformName",
        },
        {
          label: "注册时间",
          value: "createTime",
        },
      ],
      timeArr: [],
      // 加载状态
      tableLoading: false,
      // 表格数据
      tableData: [],
      search: {
        searchType: undefined,
        searchValue: undefined,
        platform: null,
        startCreateTime: null,
        endCreateTime: null,
      },
      status: "normal",
      platformList: [],
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
    this.getList();
    this._getPlatformTypes();
  },
  mounted() {
    this.countHeight();
    this.watchWidth();
  },
  methods: {
    getList(type) {
      this.tableLoading = true;
      if (type === "search") {
        this.pagination.current = 1;
      }
      // 拼接请求参数
      const listQuery = Object.assign({}, this.search, this.pagination);
      if (this.search.searchType) {
        listQuery[this.search.searchType] = this.search.searchValue;
      }
      listQuery.status = this.status;
      console.debug("listQuery", listQuery);
      getSubscriberPage(listQuery).then((response) => {
        this.tableData = response.data.data.records;
        this.pagination.total = response.data.data.total;
        setTimeout(() => {
          this.tableLoading = false;
        }, 0.1 * 1000);
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
    // 时间选择切换触发
    timeChange(val) {
      const [startDate, endDate] = val;
      this.search.startCreateTime = startDate;
      this.search.endCreateTime = endDate;
    },
    tabChange() {
      this.getList("search");
    },
    editSubscriberStatus(rowData, status) {
      this.$confirm(
        `正在执行${status == "disabled" ? "冻结" : "解冻"}操作，请确认...`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          editSubscriberStatus({
            status,
            userId: rowData.userId,
          }).then((res) => {
            if (res) {
              this.$message.success("操作成功");
              this.getList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //重置
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
        platform: null,
        startCreateTime: null,
        endCreateTime: null,
      };
      this.timeArr = [];
      this.getList("search");
    },
    // 去详情
    toDetail(userId) {
      console.debug("11");
      this.$router.push(`/user/details/${userId}`);
    },
    // 获取注册来源列表
    _getPlatformTypes() {
      reqPlatformTypes().then((res) => {
        this.platformList = res.data.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.imgText {
  float: left;
  span {
    display: block;
    text-align: left;
    height: 20px;
    line-height: 20px;
  }
}
</style>
