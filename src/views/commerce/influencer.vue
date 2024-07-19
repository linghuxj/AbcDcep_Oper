<template>
  <div class="main-content">
    <el-form :inline="true" :model="search">
      <el-form-item label="城市名：">
        <el-select
          v-model="search.areaCode"
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
      <el-form-item label="店铺名称：">
        <el-input
          v-model="search.keyword"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="assocStoreShow(false)">关联店铺</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column label="序号" align="center" width="60">
          <template slot-scope="scope">
            <span>{{ scope.$index+(pagination.current - 1) * pagination.size + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市">
          <template slot-scope="scope">
            <span>{{ scope.row.cityName? scope.row.cityName:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="店铺数">
          <template slot-scope="scope">
            <span>{{ scope.row.relationNum? scope.row.relationNum:'0' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="assocStoreShow(true,scope.row.areaCode)">详情</el-button>
            <!-- <el-button type="text">排序</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        v-show="pagination.total>0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList" />
    </div>
    <assoc-store-table
      ref="assocStore"
      v-if="interactive.assocShow"
      :req-type="reqType"
      @refreshList="getList" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import AssocStoreTable from './components/AssocStoreTable'
import { getHotStorePage } from '@/api/commerce/hot'
import { getAreaLists } from '@/api/commerce/commerce'

export default {
  name: 'Influencer',
  components: { 
    TablePagination, 
    AssocStoreTable
  },
  data() {
    return {
      areaLists: [],
      //表示参数类
      search: {
        areaCode: undefined,
        keyword: undefined
      },
      tableData: [],
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogFormVisible: false,
        assocShow: false
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      // 请求操作类型
      reqType: 'store_hot'
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
      this.interactive.assocShow = false
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.search, this.pagination)
      getHotStorePage(listQuery).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
      }).catch(() => {
        this.interactive.tableLoading = false
      })
    },
    // 关联店铺
    assocStoreShow(isEdit, id) {
      this.interactive.assocShow = true
      this.$nextTick(() => {
        this.$refs.assocStore.init(isEdit, id)
        this.$refs.assocStore.operationType = true
      })
    },
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
        storeType: undefined,
        address: undefined,
        date: []
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
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
  }
}
</style>
