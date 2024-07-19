<template>
  <div class="main-content task-list">
    <el-form ref="searchForm" :inline="true" :model="parameter" id="demo-form-inline">
      <el-form-item label="银行名称：">
        <el-select v-model="parameter.bankType">
          <el-option label="广发银行" value="CGB"></el-option>
          <el-option label="浙商银行" value="CZBANK"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在地区：" prop="location">
        <el-cascader ref="cascader" v-model="parameter.location" :props="locationNameList" :show-all-levels="false"
          placeholder="请选择省市" clearable></el-cascader>
      </el-form-item>
      <el-form-item label="开通渠道：">
        <el-select v-model="parameter.openChannel">
          <el-option label="H5/小程序" value="h5"></el-option>
          <el-option label="APP" value="app"></el-option>
          <!-- <el-option v-for="level in taskTypeAll" :key="level.dictValue" :label="level.dictName"
            :value="level.dictValue"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="创客搜索：">
        <el-input v-model="search.searchValue" style="width: 100%" placeholder="请输入内容" class="input-with-select">
          <el-select v-model="search.searchType" placeholder="请选择" slot="prepend">
            <el-option label="创客昵称" value="username"></el-option>
            <el-option label="创客姓名" value="fullName"></el-option>
            <el-option label="创客手机号" value="mobile"></el-option> </el-select></el-input>
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
      </el-form-item>
    </el-form>
    <!-- 统计数量展示 -->
    <div class="statistical-data" id="statistical">
      <div class="statistical-item">
        <div class="statistical-item-title">开通总数</div>
        <div class="statistical-item-num">
          <span class="green-text">
            {{ statisticalData.openingNum ? statisticalData.openingNum : "0" }}
          </span>
        </div>
      </div>
      <div class="statistical-item">
        <div class="statistical-item-title">已开户数</div>
        <div class="statistical-item-num">
          <span class="green-text">
            {{ statisticalData.openedNum ? statisticalData.openedNum : "0" }}
          </span>
        </div>
      </div>
      <div class="statistical-item">
        <div class="statistical-item-title">异常数</div>
        <div class="statistical-item-num">
          <span class="green-text">
            {{ statisticalData.exceptionNum ? statisticalData.exceptionNum : "0" }}
          </span>
        </div>
      </div>
    </div>
    <el-table v-loading="listLoading" :empty-text="$t('message.table_empty_text')" :data="list" border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :height="tableHeight">
      <el-table-column label="银行名称" prop="bankName"></el-table-column>
      <el-table-column label="所在地区" prop="locationName"></el-table-column>
      <el-table-column label="开通渠道" prop="openChannelName"></el-table-column>
      <el-table-column label="养老金账户" width="180">
        <template slot-scope="scope">
          <span>
            {{ scope.row.pensionAccount }}
          </span>
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
      <el-table-column label="开户状态" prop="statusName" width="150"></el-table-column>
      <el-table-column label="开户时间" prop="createTime" width="150"></el-table-column>
      <el-table-column label="操作" prop="id" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="to_detail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination :total="pagination.total" :page.sync="pagination.current" :limit.sync="pagination.size"
      @pagination="getList" />
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import TablePagination from "@/components/table-pagination"
import {
  reqPensionPage,
  reqPensionCount,
} from "@/api/task/pension";
import { getAreaNationwideTree } from "@/api/area"
export default {
  components: {
    TablePagination,
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
      parameter: {
        bankType: null,
        location: null,
        registerDate: [],
        startTime: null,
        endTime: null,
        fullName: null,
        mobile: null,
        openChannel: null,
      },
      search: {
        searchType: undefined,
        searchValue: undefined,
      },
      list: [],
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
    this._getReqPensionPage();
    this._getReqPensionCount();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
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
        }px)`
    },
    //创建日期时间触发
    createTime(val) {
      const [startDate, endDate] = val
      this.parameter.startTime = startDate
      this.parameter.endTime = endDate
    },
    getList() {
      this._getReqPensionPage()
    },
    // 获取数据
    _getReqPensionCount() {
      reqPensionCount(this.parameter).then((res) => {
        this.statisticalData = res.data.data
      })
    },
    // 任务列表
    _getReqPensionPage() {
      let location = null
      if (this.parameter.location) {
        location = this.parameter.location.join(",");
      }
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        bankType: this.parameter.bankType,
        location: location,
        openChannel: this.parameter.openChannel,
        startTime: this.parameter.startTime,
        endTime: this.parameter.endTime
      }
      if (this.search.searchType) {
        data[this.search.searchType] = this.search.searchValue
      }
      this.listLoading = true
      this.formData = data
      reqPensionPage(data)
        .then((res) => {
          this.list = res.data.data.records
          this.pagination.total = res.data.data.total
          this.pagination.current = res.data.data.current
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    to_detail(val) {
    },
    // 搜索
    to_search() {
      this._getReqPensionPage()
      this._getReqPensionCount()
      this.pagination.current = 1
    },
    // 重置
    to_reset() {
      this.parameter = {
        bankType: null,
        location: null,
        openChannel: null,
        registerDate: [],
        startTime: null,
        endTime: null,
      };
      this.search = {
        searchType: null,
        searchValue: null,
      };
      this._getReqPensionPage()
      this._getReqPensionCount()
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
