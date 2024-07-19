<template>
  <div class="main-content">
    <!-- 表单 -->
    <!-- 筛选条件表单 -->
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <!-- 用户搜索 -->
      <el-form-item label="公会名称：">
        <el-input
          placeholder="请输入公会名称"
          v-model="search.unionName"
          maxlength="20"
        ></el-input>
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="服务范围：" class="giftSelect">
        <el-cascader
          ref="cascader"
          v-model="search.location"
          :props="locationNameList"
          placeholder="请选择省/市/县区"
          clearable
          style="width: 50%"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="会长信息：">
        <el-input
          v-model="search.keyword"
          style="width: 100%"
          placeholder="请输入姓名或手机号"
        >
        </el-input>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item label="状态：">
        <el-select v-model="search.status" placeholder="请选择">
          <el-option
            v-for="(type, index) in statusList"
            :key="index"
            :label="type.dictName"
            :value="type.dictValue"
          ></el-option>
        </el-select>
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
    <!-- 新增 -->
    <div id="tableBtn">
      <el-button type="primary" @click="to_add"> 新增 </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="list"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="公会id" prop="unionId" />
      <el-table-column label="公会名称" prop="unionName"></el-table-column>
      <el-table-column
        label="会长信息"
        width="160"
        prop=""
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div class="user-base">
            <div class="oneline">
              用户名：{{
                scope.row.leaderUser ? scope.row.leaderUser.username : "--"
              }}
            </div>
            <div class="oneline">
              姓名：{{
                scope.row.leaderUser ? scope.row.leaderUser.fullName : "--"
              }}
            </div>
            <div class="oneline">
              手机号：{{
                scope.row.leaderUser ? scope.row.leaderUser.mobile : "--"
              }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="服务范围">
        <template slot-scope="scope">
          <span>{{
            scope.row.locationName ? scope.row.locationName : "--"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公会技能">
        <template slot-scope="scope">
          <div v-if="scope.row.tagNameList && scope.row.tagNameList.length > 0">
            <span
              v-for="(item, index) in scope.row.tagNameList"
              :key="index"
              class="tagSpan"
            >
              {{ item.tagName }}
            </span>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <el-table-column label="范围审核">
        <template scope="scope">
          <el-switch
            v-model="scope.row.needAudit"
            active-value="enable"
            inactive-value="disabled"
            @change="toChangeAudit(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.statusName ? scope.row.statusName : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="审核原因">
        <template slot-scope="scope">
          {{ scope.row.remark ? scope.row.remark : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="createTime" width="130" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.status === 'audit'"
            @click="to_audit(scope.row.unionId)"
            >审核</el-button
          >
          <el-button v-else type="text" @click="to_edit(scope.row.unionId)"
            >编辑</el-button
          >
          <el-button type="text" @click="to_detail(scope.row.unionId)"
            >详情</el-button
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
    <!-- 审核弹框 -->
    <el-dialog
      title="审核"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div class="main-dialog">
        <el-form :model="form" :rules="dialogRule" ref="form">
          <el-form-item label="审核结果：" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio label="normal">通过</el-radio>
              <el-radio label="failed">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="原因："
            v-if="form.status === 'failed'"
            prop="remark"
          >
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入拒绝原因"
              maxlength="500"
              v-model="form.remark"
              style="width: 50%"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="sureDialog('form')"
          :loading="dialogLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqUnionPage,
  reqStatusPage,
  reqAuditUnion,
  updateAuditUnion,
} from "@/api/guild/list";
import TablePagination from "@/components/table-pagination";
// 引入地区查询接口
import { areas } from "@/api/area";
export default {
  components: {
    TablePagination,
  },
  data() {
    return {
      // 省市区联动
      locationNameList: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data;
              const nodes = Array.from(areaList).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 2,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      search: {
        //表单
        keyword: null,
        status: null,
        unionName: null,
        location: null,
        searchType: null,
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
      list: [],
      statusList: [],
      listLoading: false,
      dialogVisible: false,
      dialogLoading: false,
      form: {
        status: null,
        remark: null,
        unionId: null,
      },
      dialogRule: {
        status: [{ required: true, message: "请选择审核", trigger: "change" }],
        remark: [
          { required: true, message: "请输入审核不通过原因", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this._getUnionList();
    this._getStatusPage();
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
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`;
    },
    querySearchMobile(mobile, cb) {
      if (!mobile) {
        cb(this.searchRecords);
        return;
      }
      // // 搜索手机号码
      getUsersbyMobile(mobile).then((res) => {
        const users = res.data.data.records;
        console.debug("users", res.data.data.records);
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
      this.imageForm.userId = user.userId;
      const idx = this.searchRecords.indexOf(user);
      if (idx !== -1) {
        this.searchRecords.splice(idx, 1);
      }
      this.searchRecords.unshift(user);
      if (this.searchRecords.length >= 8) {
        this.searchRecords.pop();
      }
      window.sessionStorage.setItem(
        "mewooo-mobile-records",
        JSON.stringify(this.searchRecords)
      );
      // 搜索圈子名称
      // getCirlesByName({
      //   userId: this.imageForm.userId,
      // }).then((res) => {
      //   this.circleNameList = res.data.data;
      // });
    },
    // 打开审核
    to_audit(unionId) {
      this.form.unionId = unionId;
      this.dialogVisible = true;
    },
    // 关闭弹框
    handleClose() {
      this.form = {
        unionId: null,
        remark: null,
        status: null,
      };
      this.dialogVisible = false;
    },
    // 审核
    sureDialog(form) {
      let data = this.form;
      this.dialogLoading = true;
      this.$refs[form].validate((valid) => {
        if (valid) {
          reqAuditUnion(data)
            .then((res) => {
              console.debug("res", res);
              this.$message.success("审核成功");
              this.dialogVisible = false;
              this.dialogLoading = false;
            })
            .catch(() => {
              this.dialogLoading = false;
            });
        } else {
          this.dialogLoading = false;
        }
      });
    },
    getList() {
      this._getUnionList();
    },
    // 公会状态
    _getStatusPage() {
      reqStatusPage().then((res) => {
        console.debug("res", res);
        this.statusList = res.data.data;
      });
    },
    // 公会列表
    _getUnionList() {
      let location = null;
      if (this.search.location) {
        location = this.search.location.join(",");
      }
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        status: this.search.status,
        location: location,
        keyword: this.search.keyword,
        unionName: this.search.unionName,
      };
      this.listLoading = true;
      reqUnionPage(data)
        .then((res) => {
          console.debug("res", res);
          this.list = res.data.data.records;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    //范围审核
    toChangeAudit(item) {
      let data = {
        unionId: item.unionId,
        needAudit: item.needAudit,
      };
      updateAuditUnion(data).then((res) => {
        this.$message.success("审核成功");
      });
    },
    // 搜索
    to_search() {
      console.debug("location", this.search.location);
      this._getUnionList();
    },
    // 重置
    to_reset() {
      this.search = {
        status: null,
        location: null,
        keyword: null,
        unionName: null,
      };
      this._getUnionList();
    },
    // 去新增
    to_add() {
      this.$router.push("/guild/add");
    },
    // 去编辑
    to_edit(unionId) {
      this.$router.push(`/guild/edit/${unionId}`);
    },
    // 详情
    to_detail(id) {
      this.$router.push("/guild/detail?unionId=" + id);
    },
  },
};
</script>
<style scoped>
.tagSpan {
  margin: 0px 10px;
}
</style>
