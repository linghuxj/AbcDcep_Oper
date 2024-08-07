/** * 网红推荐 */
<template>
  <div class="main-content">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="商品名称：">
        <el-input
          v-model="parameter.productName"
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="店铺名称：">
        <el-input
          v-model="parameter.storeName"
          placeholder="请输入店铺名称"
        ></el-input>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="getSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </div>
    </el-form>
    <div id="tableBtn" v-if="permissions.plate_product_add">
      <el-button type="primary" @click="handleAdd">关联商品</el-button>
    </div>
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

      <el-table-column label="商品名称" width="300">
        <template slot-scope="scope">
          <span>{{
            scope.row.productName ? scope.row.productName : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺名称">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName ? scope.row.storeName : '--' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.$index !== 0" type="text" size="mini" icon="el-icon-top" style="color:#409eff"></el-button>
            <el-button v-if="(scope.$index+(pagination.current - 1) * pagination.size + 1) !== pagination.total" type="text" size="mini" icon="el-icon-bottom" style="color:#409eff"></el-button>
          </template>
        </el-table-column> -->
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.plate_product_cancel"
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleUpdate(scope.row)"
            >取消关联</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getSearch"
    />
    <el-dialog
      title="关联商品"
      :visible.sync="interactive.dialogFormVisible"
      width="50%"
    >
      <tree-transfer
        :title="['未关联', '已关联']"
        :from_data="fromData"
        :to_data="toData"
        :default-props="{ label: 'label' }"
        :mode="mode"
        height="540px"
        filter
        open-all
      >
      </tree-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          v-if="permissions.task_type_edit"
          type="primary"
          @click="createData"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import {
  reqPlateProductPage,
  relationPlateProduct,
  cancelPlateProductRelation,
  selectPlateProductRelation
} from '@/api/product/plate'
import TreeTransfer from 'el-tree-transfer'

export default {
  components: { TablePagination, TreeTransfer },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableData: [],
      //表示参数类
      parameter: {
        productName: undefined,
        storeName: undefined,
        plateType: 'net_recommend'
      },
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogFormVisible: false
      },

      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      mode: 'transfer', // transfer addressList
      fromData: [],
      toData: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getSearch()
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
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`
    },
    // 查询列表
    getSearch() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      reqPlateProductPage(listQuery)
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
    // 新增类型
    // 查询未关联的商品
    resetTemp() {
      const temp = {
        keyword: undefined,
        plateType: 'net_recommend'
      }
      selectPlateProductRelation(temp).then(resp => {
        const page = resp.data.data
        page.forEach(item => {
          item.pid = 0
        })
        this.fromData = page
      })
    },
    handleAdd() {
      this.resetTemp()
      this.interactive.dialogFormVisible = true
    },
    // 新增
    async createData() {
      const temp = this.toData
      const arr = []
      for (let index = 0; index < temp.length; index++) {
        const element = temp[index]
        const tempData = {
          productIds: [],
          storeId: element.id
        }
        if (element.children.length > 0) {
          element.children.forEach(item => {
            tempData.productIds.push(item.id)
          })
        }
        arr.push(tempData)
      }
      console.debug('arr', arr)
      // 判断没有选择商品的情况
      if (arr.length <= 0) {
        if (this.fromData.length === 0) {
          this.$message.warning('暂无关联商品可选择')
          return
        } else {
          this.$message.warning('请选择关联商品')
          return
        }
      }
      relationPlateProduct({ plateType: 'net_recommend', plateProducts: arr })
        .then(() => {
          this.getSearch()
          this.interactive.dialogFormVisible = false
          // 重置穿梭框数据
          this.fromData = []
          this.toData = []
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        })
        .catch(e => {
          this.interactive.dialogFormVisible = false
          console.error(e)
        })
    },

    // 取消关联
    handleUpdate(row) {
      const _this = this
      _this
        .$confirm(
          '是否要将网红推荐列表中的“ ' + row.productName + '”商品取消关联？',
          '取关提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        .then(() => {
          cancelPlateProductRelation(row.id).then(() => {
            _this.$notify({
              title: '成功',
              message: '“' + row.productName + '”取关成功！',
              type: 'success',
              duration: 3000
            })
            this.getSearch()
          })
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },

    resetForm() {
      this.parameter = {
        productName: undefined,
        storeName: undefined,
        plateType: 'net_recommend'
      }
      this.$nextTick(() => {
        this.getSearch()
      })
    },
    // 右侧列表元素变化时触发
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    }
  }
}
</script>

<style>
.wl-transfer .transfer-title {
  margin: 0 !important;
}
</style>
<style scoped lang="scss">
.search-form-item {
  margin-left: 20px;
}
</style>
