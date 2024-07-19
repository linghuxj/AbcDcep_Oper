<template>
  <div class="main-content guide">
    <el-form :inline="true" :model="parameter" class="demo-form-inline">
      <el-form-item label="城市名：">
        <el-select
          v-model="parameter.areaCode"
          class="width200"
          filterable
          remote
          :remote-method="remoteMethod"
          placeholder="请输入或选择城市名称"
        >
          <el-option
            v-for="item in areaLists"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="getList">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>
    <div>
      <el-button
        v-if="permissions.district_hot_relation"
        type="primary"
        @click="relationBusiness"
      >
        关联商圈
      </el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :data="tableData"
        border
        :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column
          v-for="(item, idx) in tableArr"
          :key="idx"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row[item.value] ? scope.row[item.value] : '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="getContent(scope.row)">
              详情
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
    <business-table
      ref="businessTable"
      v-if="interactive.tableShow"
      :operation-type="operationType"
      :req-type="reqType"
      @refreshList="reset"
    ></business-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getBusinessGuide, getAreaLists } from '@/api/commerce/commerce'
import TablePagination from '@/components/table-pagination'
import BusinessTable from './components/businessTable.vue'
export default {
  components: { TablePagination, BusinessTable },
  data() {
    return {
      areaLists: [],
      // 表格列配置
      tableArr: [
        {
          label: '城市',
          value: 'cityName'
        },
        {
          label: '商圈数',
          value: 'relationNum'
        }
      ],
      // 表格数据
      tableData: [],
      //表示参数类
      parameter: {
        areaCode: undefined
      },
      // 操作类型
      interactive: {
        tableLoading: false,
        tableShow:false
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      // 操作类型
      operationType: 'relation',
      // 请求操作类型
      reqType: 'front_page_hot'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      this.getList()
      this.getAreaLists()
    })
  },
  methods: {
    getList() {
      this.interactive.tableLoading = true
      const needData = Object.assign({}, this.parameter, this.pagination)
      getBusinessGuide(needData).then(res => {
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total
        this.interactive.tableLoading = false
      })
    },
    // 重置
    reset() {
      this.interactive.tableShow = false
      //表示参数类
      this.parameter = {
        areaCode: undefined
      }
      this.getList()
      this.getAreaLists()
    },
    // 获取城市列表
    getAreaLists(keyword) {
      getAreaLists({
        areaTypes: 'city',
        size: '50',
        keyword
      }).then(res => {
        this.areaLists = res.data.data
      })
    },
    // 远程搜索方法
    remoteMethod(keyword) {
      this.getAreaLists(keyword)
    },
    // 关联商圈
    relationBusiness() {
      this.operationType = 'relation'
      this.interactive.tableShow = true
      this.$nextTick(() => {
        this.$refs.businessTable.init()
      })
    },
    // 查看详情
    getContent(rowData) {
      this.operationType = 'unrelation'
      this.interactive.tableShow = true
      this.$nextTick(() => {
        this.$refs.businessTable.init()
        this.$refs.businessTable.areaCode = rowData.areaCode
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.guide  {
  .center_deliverGoods {
    margin-top: 10px;
  }
  .sortBusiness_list {
    display: flex;
    flex-direction: column;
    .sortBusiness_list_item {
      display: flex;
      justify-content: space-between;
      background-color: #1990ff;
      color: #fff;
      font-size: 14px;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      .sortBusiness_list_item div {
        margin: 0px 10px;
      }
    }
  }
  .width200 .el-input {
    width: 200px !important;
  }
}
</style>
