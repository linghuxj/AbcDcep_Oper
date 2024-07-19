<template>
  <div class="main-content">
    <el-form :inline="true" :model="parameter">
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
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
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
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" width="60">
          <template slot-scope="scope">
            <span>{{
              scope.$index + (pagination.current - 1) * pagination.size + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市">
          <template slot-scope="scope">
            <span>{{ scope.row.cityName ? scope.row.cityName : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商圈数">
          <template slot-scope="scope">
            <span>{{
              scope.row.relationNum ? scope.row.relationNum : '--'
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
import TablePagination from '@/components/table-pagination'
import BusinessTable from './components/businessTable.vue'
import { getAreaLists, getHotCityList } from '@/api/commerce/commerce'

export default {
  name: 'Influencer',
  components: {
    TablePagination,
    BusinessTable
  },
  data() {
    return {
      areaLists: [],
      // 表格数据
      tableData: [],
      //表示参数类
      parameter: {
        areaCode: undefined
      },
      // 操作类型
      interactive: {
        tableLoading: false,
        tableShow: false
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
      reqType: 'city_hot'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
    this.getAreaLists()
  },
  methods: {
    // 查询列表
    getList() {
      this.interactive.tableLoading = true
      const needData = Object.assign({}, this.parameter, this.pagination)
      getHotCityList(needData).then(res => {
        this.tableData = res.data.data.records
        this.pagination.total = res.data.data.total
        this.interactive.tableLoading = false
      })
    },
    reset() {
      this.interactive.tableShow = false
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
.main-content {
  .user-wrap {
    display: flex;
    justify-content: space-around;
    text-align: center;
    .avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
    .user-base {
      width: 130px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
