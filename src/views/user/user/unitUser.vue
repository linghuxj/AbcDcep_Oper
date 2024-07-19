<template>
  <!-- 单位用户列表 -->
  <div class="main-content unitUser">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
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
        <el-button type="primary" icon="el-icon-search" @click="getList">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>
    <el-tabs v-model="parameter.status" @tab-click="tabChange">
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
          <template v-if="item.tableType === 'img'">
            <div class="imgText">
              <span>
                {{ scope.row['fullName'] }}
              </span>
              <span>
                {{ scope.row['mobile'] }}
              </span>
            </div>
          </template>
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
          <el-button type="text" @click="btnClick(scope.row)"> 详情 </el-button>
          <el-button
            v-if="scope.row.businessLicenseImage"
            type="text"
            @click="enclosure(scope.row)"
          >
            附件
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
import TablePagination from '@/components/table-pagination'
import {} from '@/api/store/intention'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表格列配置
      tableArr: [
        {
          label: '用户信息',
          value: 'payAmount',
          tableType: 'img',
          width: 120
        },
        {
          label: '消费次数',
          value: 'storeName'
        },
        {
          label: '消费金额（元）',
          value: 'address',
          width: 240
        },
        {
          label: '订单均价（元）',
          value: 'businessLicense',
          width: 240
        }
      ],
      // 加载状态
      tableLoading: false,
      // 表格数据
      tableData: [],
      search: {
        searchType: undefined,
        searchValue: undefined
      },
      //表示参数类
      parameter: {
        // 用户状态
        status: 'normal',
        // 创建开始时间
        startCreateTime: undefined,
        // 创建结束时间
        endCreateTime: undefined
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      }
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
    })
  },
  methods: {
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.countHeight()
      }
    },
    // 计算表格高度
    countHeight() {
      // 监听视口宽度变化
      let demoForm = document.getElementById('demo-form-inline')
      let tableBtn = document.getElementById('tableBtn')
      let tabs = 55
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        190
      }px)`
    },
    getList() {},
    // 时间选择切换触发
    timeChange(val) {
      const [startDate, endDate] = val
      this.parameter.startCreateTime = startDate
      this.parameter.endCreateTime = endDate
    },
    tabChange() {},
    //重置
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined
      }
      //表示参数类
      this.parameter = {
        startCreateTime: undefined,
        endCreateTime: undefined
      }
      this.getList()
    }
  }
}
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
