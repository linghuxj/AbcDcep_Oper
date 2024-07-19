<template>
  <div class="main-content">
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-form-item label="人员搜索：">
        <el-select
          v-model="search.searchType"
          placeholder="请选择"
          style="width: 30%"
        >
          <el-option label="姓名" value="username"></el-option>
          <el-option label="手机号" value="mobile"></el-option>
        </el-select>
        <el-input
          v-model="search.searchValue"
          placeholder="请输入内容"
          style="width: 70%"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="type">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option
            v-for="(state, index) in states"
            :key="index"
            :label="state.dictName"
            :value="state.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属银行：" prop="type">
        <el-select v-model="search.unitId">
          <el-option
            v-for="level in unitArr"
            :key="level.unitId"
            :label="level.unitName"
            :value="level.unitId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="to_Search">搜索</el-button>
        <el-button @click="to_reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button
        type="primary"
        @click="toAdd()"
        v-if="permissions.unit_user_add"
        >新增人员</el-button
      >
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        border
        :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
        style="width: 100%"
      >
        <el-table-column label="姓名" width="180px">
          <template slot-scope="scope">
            <div>{{ scope.row.username }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="unitName" width="100px" label="所属银行" />
        <el-table-column prop="jobTitle" width="100px" label="岗位" />
        <el-table-column label="手机号码">
          <template slot-scope="scope">
            <div>{{ scope.row.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime"></el-table-column>
        <el-table-column prop="roleName" label="角色权限">
          <template slot-scope="scope">
            <div>{{ scope.row.roleName ? scope.row.roleName : "--" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="状态"></el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" @click="toDetail(scope.row)">详情</el-button>
            <el-button
              type="text"
              @click="toEdit(scope.row)"
              v-if="permissions.unit_user_edit"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleFrozen(scope.row)"
              v-if="permissions.unit_user_status"
            >
              {{ scope.row.status === "normal" ? "冻结" : "解冻" }}
            </el-button>
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import {
  getUnitPage,
  getUnitAll,
  getUnitStatus,
  normalUnit,
  disabledUnit,
} from "@/api/bankers/staff.js";
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      tableData: [],
      states: [],
      unitArr: [],
      search: {
        status: undefined,
        mobile: undefined,
        username: undefined,
        unitId: undefined,
        searchType: undefined,
      },
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.getStaffList();
    this.getUnitAll();
    this.getUnitStatus();
  },
  methods: {
    // 分页跳转
    getSearch() {
      this.getStaffList();
    },
    // 获取员工列表
    getStaffList() {
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        username: undefined,
        unitId: this.search.unitId,
        status:this.search.status,
      };
      if (this.search.searchType) {
        data[this.search.searchType] = this.search.searchValue;
      }
      getUnitPage(data).then((res) => {
        console.debug("res", res);
        this.tableData = res.data.data.records;
        this.pagination.size = res.data.data.size;
        this.pagination.total = res.data.data.total;
      });
    },
    // 获取所属单位列表
    getUnitAll() {
      getUnitAll().then((res) => {
        this.unitArr = res.data.data;
      });
    },
    // 获取状态
    getUnitStatus() {
      getUnitStatus().then((res) => {
        this.states = res.data.data;
      });
    },
    // 搜索
    to_Search() {
      this.getStaffList();
    },
    //重置
    to_reset() {
      this.search = {
        status: undefined,
        mobile: undefined,
        username: undefined,
        unitId: undefined,
        searchType: undefined,
      };
      (this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      }),
        this.getStaffList();
    },
    // 去编辑
    toEdit(row) {
      this.$router.push("/staff/edit?userId=" + row.userId);
    },
    // 去详情
    toDetail(row) {
      this.$router.push("/staff/detail?userId=" + row.userId);
    },
    // 新增员工
    toAdd() {
      this.$router.push("/staff/add");
    },
    //去冻结/解冻
    handleFrozen(row) {
      if (row.status === "normal") {
        this.to_Frozen(row);
      } else {
        this.to_Defrost(row);
      }
    },
    // 去冻结
    to_Frozen(row) {
      this.$confirm("确认冻结此人员信息嘛", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          disabledUnit(row.userId).then(() => {
            this.$message.success({
              message: "冻结成功",
            });
            this.getStaffList();
          });
        })
        .catch(() => {
          this.$message.fail({
            message: "冻结失败",
          });
        });
    },
    // 去解冻
    to_Defrost(row) {
      this.$confirm("确认解冻此人员信息嘛", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          normalUnit(row.userId).then(() => {
            this.$message.success({
              message: "解冻成功",
            });
            this.getStaffList();
          });
        })
        .catch(() => {
          this.$message.fail({
            message: "解冻失败",
          });
        });
    },
  },
};
</script>
<style scoped></style>
