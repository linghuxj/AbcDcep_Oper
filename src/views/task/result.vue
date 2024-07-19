<template>
  <div class="main-content task-list">
    <el-form ref="searchForm" :inline="true" :model="parameter" id="demo-form-inline">
      <el-form-item label="任务名称：">
        <el-input v-model="parameter.taskName" placeholder="请输入任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务类型：">
        <el-select v-model="parameter.typeCode">
          <el-option v-for="level in taskTypeAll" :key="level.dictValue" :label="level.dictName"
            :value="level.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="子任务类型：">
        <el-select v-model="parameter.subTypeCode">
          <el-option v-for="level in taskSubTypeAll" :key="level.dictValue" :label="level.dictName"
            :value="level.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创客搜索：">
        <el-input v-model="search.searchValue" style="width: 100%" placeholder="请输入内容" class="input-with-select">
          <el-select v-model="search.searchType" placeholder="请选择" slot="prepend">
            <el-option label="创客昵称" value="username"></el-option>
            <el-option label="创客姓名" value="fullName"></el-option>
            <el-option label="创客手机号" value="mobile"></el-option> </el-select></el-input>
      </el-form-item>
      <el-form-item label="地区：" prop="location">
        <el-cascader ref="cascader" v-model="parameter.location" :props="locationNameList" :show-all-levels="false"
          placeholder="请选择省市" clearable></el-cascader>
      </el-form-item>
      <!-- 注册时间 -->
      <el-form-item label="时间段：">
        <el-date-picker v-model="parameter.registerDate" type="daterange" range-separator="-" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable="false"
          @change="createTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="to_search">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="to_reset()">重置</el-button>
        <el-button type="primary" @click="to_downloadResult">导出任务结果</el-button>
      </el-form-item>
    </el-form>
    <!-- 统计数量展示 -->
    <div class="statistical-data" id="statistical">
      <div class="statistical-item">
        <div class="statistical-item-title">商户数</div>
        <div class="statistical-item-num">
          <span class="green-text">
            {{ statisticalData.storeNum ? statisticalData.storeNum : "0" }}
          </span>
        </div>
      </div>
      <div class="statistical-item">
        <div class="statistical-item-title">任务商户</div>
        <div class="statistical-item-num">
          <span class="green-text">
            {{ statisticalData.taskStoreNum ? statisticalData.taskStoreNum : "0" }}
          </span>
        </div>
      </div>
      <div class="statistical-item">
        <div class="statistical-item-title">任务结果数</div>
        <div class="statistical-item-num">
          <span class="green-text">
            {{ statisticalData.resultNum ? statisticalData.resultNum : "0" }}
          </span>
        </div>
      </div>
      <div class="statistical-item">
        <div class="statistical-item-title">任务结果数(去重)</div>
        <div class="statistical-item-num">
          <span class="green-text">
            {{ statisticalData.taskNum ? statisticalData.taskNum : "0" }}
          </span>
        </div>
      </div>
    </div>
    <el-table v-loading="listLoading" :empty-text="$t('message.table_empty_text')" :data="list" border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :height="tableHeight">
      <el-table-column label="任务名称" prop="taskName"></el-table-column>
      <el-table-column label="任务类型" width="150">
        <template slot-scope="scope">
          <span>
            {{ scope.row.typeCodeName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="任务子类型" width="100">
        <template slot-scope="scope">
          <span>
            {{ scope.row.subTypeCodeName ? scope.row.subTypeCodeName : "--" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="所在地区" prop="locationName"></el-table-column>
      <el-table-column label="业务员信息" prop="busId" width="180">
        <template slot-scope="scope">
          <div>
            昵称：
            {{
              scope.row.bus
                ? scope.row.bus.username
                  ? scope.row.bus.username
                  : "--"
                : "--"
            }}
          </div>
          <div>
            姓名：
            {{
              scope.row.bus
                ? scope.row.bus.fullName
                  ? scope.row.bus.fullName
                  : "--"
                : "--"
            }}
          </div>
          <div>
            联系方式：{{
              scope.row.bus
                ? scope.row.bus.mobile
                  ? scope.row.bus.mobile
                  : "--"
                : "--"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创客信息" prop="userId" width="180">
        <template slot-scope="scope">
          <div>
            昵称：
            {{
              scope.row.user
                ? scope.row.user.username
                  ? scope.row.user.username
                  : "--"
                : "--"
            }}
          </div>
          <div>
            姓名：
            {{
              scope.row.user
                ? scope.row.user.fullName
                  ? scope.row.user.fullName
                  : "--"
                : "--"
            }}
          </div>
          <div>
            联系方式：{{
              scope.row.user
                ? scope.row.user.mobile
                  ? scope.row.user.mobile
                  : "--"
                : "--"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结果状态" prop="statusName" width="150"></el-table-column>
      <el-table-column label="提交时间" prop="createTime" width="150"></el-table-column>
      <el-table-column label="操作" prop="userId" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="to_audit(scope.row)"
            v-if="permissions.task_result_audit && scope.row.status === 'audit'">审核</el-button>
          <el-button type="text" @click="to_detail(scope.row.taskId, 'result')">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination :total="pagination.total" :page.sync="pagination.current" :limit.sync="pagination.size"
      @pagination="getList" />
    <!-- 审核结果弹框 -->
    <ResultAudit ref="auditDialog" :auditItem="auditItem" />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import ResultAudit from "./components/result-audit";
import {
  reqTaskResultPage,
  auditTaskResult,
  reqResultCount,
} from "@/api/task/list";
import { getAreaNationwideTree } from "@/api/area";
import { getTaskTypeAll, getTaskSubTypeAll } from "@/api/task/type";
import { downloadResult } from "@/api/task/list";
export default {
  components: {
    TablePagination,
    ResultAudit,
  },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      // 省市区联动
      locationNameList: {
        checkStrictly: true,
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
                leaf: level >= 2,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      listLoading: false,
      dialogFormVisible: false,
      parameter: {
        taskName: null,
        location: null,
        registerDate: [],
        startTime: null,
        endTime: null,
        fullName: null,
        mobile: null,
        typeCode: null,
      },
      search: {
        searchType: undefined,
        searchValue: undefined,
      },
      taskTypeAll: [],
      taskSubTypeAll: [],
      list: [],
      auditItem: null,
      statisticalData: {},
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //总条数
        total: 0,
      },
      formData: null,
    };
  },
  created() {
    this._getReqTaskResultPage();
    this._initTaskTypeAll();
    this._initTaskSubTypeAll();
    this._getreqResultCount();
  },
  computed: {
    ...mapGetters(["permissions"]),
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
      let dataHeight = document.getElementById("statistical");
      this.tableHeight = `calc(100vh - ${(demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        (dataHeight ? dataHeight.offsetHeight + 50 : 0) +
        190
        }px)`;
    },
    //创建日期时间触发
    createTime(val) {
      const [startDate, endDate] = val;
      this.parameter.startTime = startDate;
      this.parameter.endTime = endDate;
    },
    _initTaskTypeAll() {
      getTaskTypeAll().then((resp) => {
        const page = resp.data.data;
        this.taskTypeAll = page;
      });
    },
    _initTaskSubTypeAll() {
      getTaskSubTypeAll().then((resp) => {
        const page = resp.data.data;
        this.taskSubTypeAll = page;
      });
    },
    getList() {
      this._getReqTaskResultPage();
    },
    // 获取数据
    _getreqResultCount() {
      reqResultCount(this.parameter).then((res) => {
        this.statisticalData = res.data.data;
        console.debug("res", this.statisticalData);
      });
    },
    // 任务列表
    _getReqTaskResultPage() {
      let location = null;
      if (this.parameter.location) {
        location = this.parameter.location.join(",");
      }
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        taskName: this.parameter.taskName,
        location: location,
        startTime: this.parameter.startTime,
        endTime: this.parameter.endTime,
        typeCode: this.parameter.typeCode,
        subTypeCode: this.parameter.typeCode == 'inspection' ? this.parameter.subTypeCode : '',
      };
      if (this.search.searchType) {
        data[this.search.searchType] = this.search.searchValue;
      }
      console.debug("aa", data, this.search.searchType);
      this.listLoading = true;
      this.formData = data;
      reqTaskResultPage(data)
        .then((res) => {
          console.debug("res", res);
          this.list = res.data.data.records;
          this.pagination.total = res.data.data.total;
          this.pagination.current = res.data.data.current;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 打开审核
    to_audit(val) {
      this.auditItem = val;
      // this.dialogFormVisible = true;
      setTimeout(() => {
        this.$refs.auditDialog.show();
      }, 200);
    },
    handleClose() {
      this.dialogFormVisible = false;
    },
    to_detail(val, type) {
      this.$router.push(`/task/details/${val}?type=${type}`);
    },
    // 搜索
    to_search() {
      this._getReqTaskResultPage();
      this._getreqResultCount();
      this.pagination.current = 1;
    },
    // 导出功能
    to_downloadResult() {
      downloadResult(this.formData).then((res) => {
        console.debug("导出成功");
        //定义文件名
        // const xlsx = "application/vnd.ms-excel";
        // let blob = new Blob([res.data], { type: "application/vnd.ms-excel" }); //转换数据类型
        // // 转换完成，创建一个a标签用于下载
        // const link = document.createElement("a");
        // //URL.createObjectURL() 静态方法会创建一个 DOMString，
        // link.href = URL.createObjectURL(blob);
        // link.download = "任务结果列表" + new Date().getTime() + ".xlsx"; //下载的文件名
        // // link(a)是一个dom元素（一个标签），向body中插入了一个dom(a)元素。
        // document.body.appendChild(link);
        // link.click();
        // // 释放内存
        // a.remove();
      });
    },
    // 重置
    to_reset() {
      this.parameter = {
        taskName: null,
        location: null,
        registerDate: [],
        startTime: null,
        endTime: null,
        typeCode: null,
      };
      this.search = {
        searchType: null,
        searchValue: null,
      };
      this._getReqTaskResultPage();
      this._getreqResultCount();
    },
  },
};
</script>
<style scoped>
.statistical-data {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
  margin-top: 10px;
}

.statistical-item {
  width: 240px;
  height: 80px;
  margin: 10px;
  /* background-color: rgb(232, 232, 232); */
  box-shadow: 12px 12px 20px 12px rgba(232, 232, 232, 0.5);
  border-radius: 8px;
}

.statistical-item-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.statistical-item-num {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.green-text {
  font-size: 16px;
  font-weight: bold;
  color: #1abc9c;
  margin: 0px 5px;
}
</style>
