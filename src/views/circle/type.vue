<template>
  <div class="main-content circleType">
    <div id="tableBtn">
      <el-button
        v-if="permissions.circle_type_add"
        type="primary"
        @click="handleCreate"
        >{{ $t("circle.type.new_classification") }}</el-button
      >
    </div>
    <!-- 表格 分页 -->
    <div class="circleContent">
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :empty-text="$t('message.table_empty_text')"
        border
        :data="list"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        style="width: 100%"
        :height="tableHeight"
      >
        <el-table-column
          :label="$t('circle.circle_ID')"
          prop="typeId"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          :label="$t('circle.type.classification_name')"
          width="150"
        ></el-table-column>
        <el-table-column prop="createUser" label="创建人" width="150">
          <template slot-scope="scope">
            <div>
              {{ scope.row.createUser ? scope.row.createUser.username : "--" }}
            </div>
            <div>
              {{ scope.row.createUser ? scope.row.createUser.mobile : "--" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="relateCircleCount"
          :label="$t('circle.type.incidence_number')"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="statusName"
          width="220"
          :label="$t('circle.type.enable_disable')"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="normal"
              inactive-value="disabled"
              active-text="启用"
              inactive-text="停用"
              :disabled="!permissions.circle_type_edit"
              @change="onSwutchStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('message.operate')"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-if="permissions.circle_type_edit"
              type="text"
              size="mini"
              @click="handleEdit(scope.row)"
              >{{ $t("message.edit") }}</el-button
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
    </div>
    <!-- 新增弹出框 -->
    <el-dialog
      :title="$t('circle.type.newCircle_classification')"
      class="dialog"
      :visible.sync="dialogCreat"
      width="45%"
    >
      <el-form
        ref="createForm"
        :model="typeForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="圈子类型名称："
          class="circleTypeSelect"
          prop="name"
        >
          <el-input
            v-model="typeForm.name"
            class="inputWidth"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('circle.type.enable_disable') + '：'"
          class="circleTypeSelect"
          prop="status"
        >
          <el-radio
            v-for="state in states"
            :key="state.dictName"
            v-model="typeForm.status"
            :label="state.dictValue"
            class="radio"
            >{{ state.dictName }}</el-radio
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">{{ $t("message.cancel") }}</el-button>
        <el-button
          v-if="isEdit"
          :disabled="b_loading"
          @click="handleEditType"
          type="primary"
          >{{ $t("message.confirm") }}</el-button
        >
        <el-button
          v-else
          type="primary"
          :disabled="b_loading"
          @click="handleCreateType"
          >{{ $t("message.confirm") }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import { mapGetters } from "vuex";
import { fetchList, addObj, postObj, getStates } from "@/api/circle/type";
export default {
  components: {
    TablePagination,
  },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      value1: "", //开关
      options: [],
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //页面数组
        pageSize: [5, 10, 15, 20],
        //总条数
        total: 0,
      },
      states: [],
      //创建内容表单
      typeForm: {
        name: undefined,
        parentId: -1,
        status: "normal",
      },
      origin: {},
      isEdit: false,
      //创建表单验证
      rules: {
        name: [
          {
            required: true,
            message: this.$t("circle.type.valid_name"),
            trigger: "blur",
          },
        ],
      },
      list: [], //启用表格数据
      listLoading: false, //加载
      b_loading: false,
      dialogCreat: false, //加载弹出框
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  mounted() {
    this.getTypeList();
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
    getList() {
      this.getTypeList();
    },
    // 分页查询圈子类型列表信息
    getTypeList() {
      this.listLoading = true;
      const query = {};
      query.current = this.pagination.current;
      query.size = this.pagination.size;
      fetchList(query)
        .then((response) => {
          this.listLoading = false;
          const result = response.data.data;
          this.list = result.records;
          this.pagination.total = result.total;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 查询圈子类型状态
    getTypeStates() {
      if (this.states.length === 0) {
        getStates().then((response) => {
          this.states = response.data.data;
        });
      }
    },
    // 创建分类
    async handleCreateType() {
      // 获取文件名发布动态
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.b_loading = true;
          addObj(this.typeForm)
            .then(() => {
              this.$refs.createForm.resetFields();
              this.b_loading = false;
              this.typeForm = {
                name: undefined,
                parentId: -1,
                status: "normal",
              };
              this.dialogCreat = false;
              this.$message.success(this.$t("message.add_success"));
              this.getTypeList();
            })
            .catch(() => {
              this.b_loading = false;
            });
        }
      });
    },
    // 打开新增分类弹框
    handleCreate() {
      this.dialogCreat = true;
      this.getTypeStates();
    },
    // 打开编辑分类弹框
    handleEdit(type) {
      this.typeForm = Object.assign(
        {},
        {
          typeId: type.typeId,
          parentId: type.parentId,
          name: type.name,
          status: type.status,
        }
      );
      this.origin = Object.assign({}, type);
      this.dialogCreat = true;
      this.isEdit = true;
      this.getTypeStates();
    },
    // 编辑分类
    handleEditType() {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.b_loading = true;
          postObj(this.typeForm)
            .then(() => {
              this.b_loading = false;
              this.$refs.createForm.resetFields();
              this.typeForm = {
                name: undefined,
                parentId: -1,
                status: "normal",
              };
              this.dialogCreat = false;
              this.getTypeList();
              this.$message.success(this.$t("message.edit_success"));
              this.isEdit = false;
            })
            .catch(() => {
              this.b_loading = false;
            });
        }
      });
    },

    //弹出框取消按钮
    resetForm() {
      this.$refs.createForm.resetFields();
      this.typeForm = {
        name: undefined,
        parentId: -1,
        status: "normal",
      };
      this.dialogCreat = false;
      this.isEdit = false;
    },
    // 圈子的启用和停用切换
    onSwutchStatus(res) {
      postObj(res)
        .then(() => {
          this.getTypeList();
          this.$message.success(this.$t("message.edit_success"));
        })
        .catch(() => {
          this.b_loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.circleType {
  background-color: white;
  .circle-wraps-logo {
    padding: 0 1rem;
    height: 5rem;
  }
  .demo-form-inline {
    display: flex;
    flex-wrap: wrap;
    span {
      margin-right: 10px;
    }
    .el-form-item__label {
      padding: 0;
    }
  }
  .el-form-item.circleTypeSelect {
    display: flex;
    margin-right: 70px;
    .el-input__inner {
      width: 100px;
      padding: 0;
      border-radius: 0;
    }
    .el-switch {
      margin: 8px 10px;
    }
    .el-form-item__content {
      display: flex;
      margin-left: 0 !important;
    }
    .radio {
      margin-top: 11px;
    }
    .inputWidth {
      input {
        width: 200px;
        border-radius: 5px;
        padding: 5px;
      }
      span {
        margin-right: 0;
      }
    }
    .waysSelect {
      .el-input {
        .el-input__inner {
          padding: 0 10px;
          width: 200px;
        }
      }
    }
  }
  .marginLeft {
    margin-left: 50px;
  }
  //搜索重置按钮
  .el-form-item.btn.el-form-item--medium {
    margin: 0px 0 0 60px;
    .el-button {
      margin-right: 10px;
      span {
        margin: 0;
      }
    }
  }
  //表单内容
  .circleContent {
    .el-tabs.el-tabs--card.el-tabs--top {
      margin-top: 20px;
      .el-tabs__item.is-top {
        padding: 0 50px;
        color: #606266;
      }
    }
  }
}
</style>
