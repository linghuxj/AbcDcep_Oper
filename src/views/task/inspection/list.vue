<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      class="demo-form-inline"
      id="demo-form-inline"
    >
      <el-form-item label="POS机状态：" class="demo-from-item">
        <el-select v-model="search.posStatus" placeholder="请选择POS机状态">
          <el-option
            v-for="(item, index) in machinesStatus"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="聚合码状态：" class="demo-from-item">
        <el-select
          v-model="search.paymentCodeStatus"
          placeholder="请选择聚合码状态："
        >
          <el-option
            v-for="(item, index) in machinesStatus"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺信息搜索：" class="demo-from-item">
        <el-input
          v-model="search.keyword"
          placeholder="请输入店铺名/负责人搜索"
          class="input-with-select"
          style="width: 100%"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="店铺类型：" class="demo-from-item">
        <el-select
          v-model="search.storeType"
          :placeholder="$t('business.type')"
        >
          <el-option
            v-for="item in typeArr"
            :key="item.typeId"
            :label="item.typeName"
            :value="item.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区：" prop="location">
        <el-cascader
          ref="cascader"
          v-model="search.location"
          :props="locationNameList"
          :show-all-levels="false"
          placeholder="请选择省市"
          clearable
        ></el-cascader>
      </el-form-item>
      <div>
        <el-button icon="el-icon-search" type="primary" @click="to_search"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="to_reset">重置</el-button>
      </div>
    </el-form>
    <div id="tableBtn">
      <el-button
        type="primary"
        @click="open_dailypPatrolInspection"
        v-if="permissions.task_inspection_normal"
      >
        新增日常巡检店铺
      </el-button>
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
      ref="multipleTable"
    >
      <template v-if="!interactive.tableLoading">
        <el-table-column label="店铺编号" prop="storeNo"></el-table-column>
        <el-table-column label="店铺名称">
          <template slot-scope="scope">
            <span>{{ scope.row.storeName ? scope.row.storeName : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="店铺类型">
          <template slot-scope="scope">
            <span>{{
              scope.row.storeTypeName ? scope.row.storeTypeName : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人姓名" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.fullName ? scope.row.fullName : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡检类型" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.subType === 'payment_code'">聚合码</span>
            <span v-else-if="scope.row.subType === 'pos'">pos机</span>
            <span v-else>聚合码、pos机</span>
          </template>
        </el-table-column>
        <el-table-column label="巡检状态">
          <template slot-scope="scope">
            <span>{{
              scope.row.inspectionStatusName
                ? scope.row.inspectionStatusName
                : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡检时间">
          <template slot-scope="scope">
            <span>{{
              scope.row.lastInspectionTime ? scope.row.lastInspectionTime : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="POS机状态" width="120">
          <template slot-scope="scope">
            <span>{{
              scope.row.posStatusName ? scope.row.posStatusName : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="聚合码状态" width="120">
          <template slot-scope="scope">
            <span>{{
              scope.row.paymentCodeStatusName
                ? scope.row.paymentCodeStatusName
                : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="巡检单价"
          prop="taskUnitPrice"
        ></el-table-column>
        <el-table-column label="任务周期" prop="taskCycle"></el-table-column>
        <el-table-column
          label="巡检周期"
          prop="inspectionCycleUnion"
        ></el-table-column>
        <el-table-column label="领取超时时间(小时)">
          <template slot-scope="scope">
            {{
              scope.row.cancelReceiveType === "unlimited"
                ? "无限制"
                : scope.row.cancelReceivePeriod
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="to_set(scope.row)">设置</el-button>
            <el-button type="text" @click="to_delete(scope.row.inspectionId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getListAll"
    />
    <!-- 巡检 -->
    <inspection
      ref="inspection"
      @getList="getList"
      @closeDialog="closeDialog"
      :selectStoreIds="selectStoreIds"
      :inspectionObj="inspectionObj"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getMachinesStatus } from "@/api/store/store";
import { deleteInspection } from "@/api/task/inspection";
import { getAreaNationwideTree } from "@/api/area";
import { reqInspectionPage } from "@/api/task/inspection";
import TablePagination from "@/components/table-pagination";
import inspection from "../components/Inspection";
export default {
  components: { TablePagination, inspection },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            const query = {
              parentId: parentId,
              lazy: true,
            };
            getAreaNationwideTree(query).then((res) => {
              const areaList = res.data.data;

              const list = areaList.filter((iten) => {
                return iten.id !== 100000;
              });

              const nodes = Array.from(list).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 1,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      search: {
        posStatus: null,
        paymentCodeStatus: null,
        storeType: null,
        location: null,
        keyword: null,
      },
      typeArr: [],
      machinesStatus: [],
      tableData: [],
      interactive: {
        dialogFormVisible: false,
        tableLoading: false,
        sureLoading: false,
      },
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      },
      selectStoreIds: [],
      inspectionObj: {},
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this._getMachinesStatus();
    this._getInspectionPage();
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
    // 获取日常巡检列表
    _getInspectionPage() {
      let location = null;
      console.debug(
        "this.search.location",
        this.search.location,
        typeof this.search.location
      );
      if (this.search.location && typeof this.search.location === "object") {
        location = this.search.location.join(",");
      } else {
        location = this.search.location;
      }
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        paymentCodeStatus: this.search.paymentCodeStatus,
        posStatus: this.search.posStatus,
        keyword: this.search.keyword,
        storeType: this.search.storeType,
        location: location,
      };
      reqInspectionPage(data).then((res) => {
        console.debug("reqInspectionPage", res);
        this.tableData = res.data.data.records;
        this.pagination.size = res.data.data.size;
        this.pagination.current = res.data.data.current;
        this.pagination.total = res.data.data.total;
      });
    },
    getList() {
      this._getInspectionPage();
    },
    getListAll() {
      this._getInspectionPage();
    },
    // 获取机具状态
    _getMachinesStatus() {
      getMachinesStatus().then((res) => {
        console.debug("res", res);
        this.machinesStatus = res.data.data;
      });
    },
    // 打开日常巡检弹框
    open_dailypPatrolInspection() {
      // if (this.selectStoreIds.length === 0) {
      //   this.$message("请先选择店铺");
      //   return;
      // }
      this.$refs.inspection.openDailyInspection();
    },
    to_search() {
      this._getInspectionPage();
    },
    // 重置
    to_reset() {
      this.search = {
        posStatus: null,
        paymentCodeStatus: null,
        storeType: null,
        location: null,
        keyword: null,
      };
      this._getInspectionPage();
    },
    // 删除
    to_delete(inspectionId) {
      this.$confirm("确定要删除嘛", "删除提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          deleteInspection(inspectionId).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this._getInspectionPage();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 设置
    to_set(item) {
      this.inspectionObj = item;
      this.$refs.inspection.editDailyInspection();
    },
    // 关闭组件弹框
    closeDialog() {
      this.$refs.multipleTable.clearSelection();
    },
    // 多选
    // handleSelectionChange(val) {
    //   console.debug("val", val);
    //   let arr = [];
    //   for (let i in val) {
    //     arr.push(val[i].storeId);
    //   }
    //   this.selectStoreIds = arr;
    // },
  },
};
</script>
<style scoped></style>
