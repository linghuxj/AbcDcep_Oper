<template>
  <div class="main-content">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
    >
      <el-form-item label="商品名称：">
        <el-input
          v-model="parameter.productName"
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌名称：">
        <el-select
          v-model="parameter.brandId"
          filterable
          remote
          placeholder="请输入品牌名称"
          :remote-method="querySearchMobile"
          :loading="interactive.loading"
        >
          <el-option
            v-for="(item, index) in brandAll"
            :key="index"
            :label="item.brandName"
            :value="item.brandId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品类型：">
        <el-cascader
          v-model="parameter.cateId"
          :options="cateTreeAll"
          :props="{ checkStrictly: true, value: 'cateId', label: 'cateName' }"
        />
      </el-form-item>
      <el-form-item label="商品状态：">
        <el-select v-model="parameter.status" placeholder="请选择">
          <el-option label="上架" value="normal" />
          <el-option label="下架" value="disabled" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="tableBtn" v-if="permissions.product_add">
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增商品</el-button
      >
    </div>
    <el-tabs v-model="interactive.activeName" @tab-click="handleClick">
      <el-tab-pane label="商品库商品" name="first">
        <el-table
          v-loading="interactive.tableLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="tableData"
          border
          fit
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :height="tableHeight"
        >
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{
                scope.$index + (pagination.current - 1) * pagination.size + 1
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="商品信息" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="content-wrap">
                <el-image
                  style="width: 80px; height: 60px"
                  :src="scope.row.image"
                  fit="contain"
                  :preview-src-list="[scope.row.image]"
                />
                <div>
                  {{ scope.row.productName ? scope.row.productName : '--' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品类型">
            <template slot-scope="scope">
              <span>{{
                scope.row.catePathName ? scope.row.catePathName : '--'
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="品牌名称">
            <template slot-scope="scope">
              <span>{{
                scope.row.brandName ? scope.row.brandName : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品条码编号">
            <template slot-scope="scope">
              <span>{{
                scope.row.productCode ? scope.row.productCode : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="在售店铺数（个）" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.storeNum ? scope.row.storeNum : '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品状态" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 'normal' ? 'success' : 'info'"
                >{{
                  scope.row.statusName ? scope.row.statusName : '--'
                }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="160">
            <template slot-scope="scope">
              <span>{{
                scope.row.createTime ? scope.row.createTime : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleDetails(scope.row.productId)"
                >查看</el-button
              >
              <el-button
                v-if="permissions.product_add"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUpdate(scope.row.productId)"
                >编辑</el-button
              >
              <el-button
                v-if="
                  scope.row.status === 'normal' &&
                  permissions.product_status_edit
                "
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUpdateStatus(scope.row.productId, 'disabled')"
                >下架</el-button
              >
              <el-button
                v-else-if="permissions.product_status_edit"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUpdateStatus(scope.row.productId, 'normal')"
                >上架</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="门店商品" name="store">
        <el-table
          v-loading="interactive.tableLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="tableData"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :height="tableHeight"
        >
          <el-table-column label="序号" align="center" width="60">
            <template slot-scope="scope">
              <span>{{
                scope.$index + (pagination.current - 1) * pagination.size + 1
              }}</span>
            </template>
          </el-table-column>

          <el-table-column label="商品信息" width="200">
            <template slot-scope="scope">
              <div class="content-wrap">
                <el-image
                  style="width: 80px; height: 60px"
                  :src="scope.row.image"
                  fit="contain"
                  :preview-src-list="[scope.row.image]"
                />
                <div>
                  {{ scope.row.productName ? scope.row.productName : '--' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品类型">
            <template slot-scope="scope">
              <span>{{ scope.row.cateName ? scope.row.cateName : '--' }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="time" label="品牌名称">
            <template slot-scope="scope">
              <span>{{
                scope.row.brandName ? scope.row.brandName : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="商品条码编号">
            <template slot-scope="scope">
              <span>{{
                scope.row.productCode ? scope.row.productCode : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="在售店铺数（个）" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.storeNum ? scope.row.storeNum : '--' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="商品状态" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 'normal' ? 'success' : 'info'"
                >{{
                  scope.row.statusName ? scope.row.statusName : '--'
                }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="time" label="创建时间" width="160">
            <template slot-scope="scope">
              <span>{{
                scope.row.createTime ? scope.row.createTime : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleDetails(scope.row.productId)"
                >查看</el-button
              >
              <el-button
                v-if="permissions.product_add"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUpdate(scope.row.productId)"
                >编辑</el-button
              >
              <el-button
                v-if="
                  scope.row.status === 'normal' &&
                  permissions.product_status_edit
                "
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUpdateStatus(scope.row.productId, 'disabled')"
                >下架</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getSearch"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { reqCateTree } from '@/api/product/classify'
import { reqProductPage, upProductStatus } from '@/api/product/wares'
import { reqBrandByName } from '@/api/product/brand'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableData: [],
      brandAll: [],
      // 查询商品分类
      cateTreeAll: [],
      //表示参数类
      parameter: {
        productName: undefined,
        status: undefined,
        cateId: [],
        catePath: undefined,
        type: undefined,
        brandId: undefined
      },
      // 操作类型
      interactive: {
        activeName: 'first',
        tableLoading: false,
        dialogFormVisible: false,
        loading: false
      },

      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      this.getCateTree()
      this.getSearch()
    })
  },
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
    // 远程查询品牌
    querySearchMobile(val) {
      if (val !== '') {
        this.interactive.loading = true
        reqBrandByName(val).then(res => {
          const users = res.data.data
          this.brandAll = users
          this.interactive.loading = false
        })
      } else {
        this.brandAll = []
      }
    },
    // 查询商品类目
    getCateTree() {
      reqCateTree().then(resp => {
        const nodes = resp.data.data
        this.cateTreeAll = nodes
      })
    },

    // 查询列表
    getSearch() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      if (listQuery.cateId.length > 0) {
        listQuery.catePath = listQuery.cateId.toString()
      }

      reqProductPage(listQuery)
        .then(resp => {
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.interactive.tableLoading = false
        })
        .catch(() => {
          this.interactive.tableLoading = false
        })
    },
    // 新增
    handleAdd() {
      this.$router.push(`/wares/establish`)
    },
    // 编辑
    handleUpdate(val) {
      this.$router.push(`/wares/compile/${val}`)
    },
    // 查看
    handleDetails(val) {
      this.$router.push(`/wares/details/${val}`)
    },
    // tabs切换
    handleClick(tab) {
      // 表格高度
      this.tableHeight = 'calc(100vh - 335px)'
      this.pagination = {
        total: 0,
        current: 1,
        size: 20
      }
      if (tab.name === 'first') {
        this.parameter.type = undefined
      } else if (tab.name === 'store') {
        this.parameter.type = 'store'
      }
      this.getSearch()
      setTimeout(() => {
        this.countHeight()
      }, 500)
    },

    // 上架/下架
    handleUpdateStatus(val, va) {
      const tempData = {
        productId: val,
        status: va
      }
      upProductStatus(tempData).then(() => {
        if (va === 'disabled') {
          this.$message({
            message: '下架商品成功！',
            type: 'success'
          })
        } else if (va === 'normal') {
          this.$message({
            message: '上架商品成功！',
            type: 'success'
          })
        }
        this.$nextTick(() => {
          this.getSearch()
        })
      })
    },
    // 重置
    resetForm() {
      this.parameter = {
        productName: undefined,
        status: undefined,
        cateId: [],
        catePath: undefined,
        brandId: undefined
      }
      this.getSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
.content-wrap {
  display: flex;
  height: 60px;
  line-height: 60px;
}
</style>
