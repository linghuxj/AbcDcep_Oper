/**
* 分享记录
*/
<template>
  <div class="main-content">
    <el-form ref="searchForm" :inline="true" :model="parameter">
      <el-form-item label="用户搜索：">
        <el-input v-model="parameter.input3" placeholder="请输入内容" style="width: 17rem;">
          <el-select slot="prepend" v-model="parameter.sel" style="width:6rem;" placeholder="请选择">
            <el-option label="用户名" value="1"></el-option>
            <el-option label="手机号码" value="2"></el-option>
            <el-option label="用户ID" value="3"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="实名情况：">
        <el-select v-model="parameter.select" placeholder="请选择">
          <el-option label="餐厅名" value="1"></el-option>
          <el-option label="订单号" value="2"></el-option>
          <el-option label="用户电话" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-form-item">
        <el-button type="primary" icon="el-icon-search" @click="getSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>

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

        <el-table-column label="被邀请人" width="300">
          <template slot-scope="scope">
            <div>{{ scope.row.productName?scope.row.productName:'--' }}</div>
            <div>{{ scope.row.productName?scope.row.productName:'--' }}</div>
            <div>{{ scope.row.productName?scope.row.productName:'--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="邀请人">
          <template slot-scope="scope">
            <div>{{ scope.row.productName?scope.row.productName:'--' }}</div>
            <div>{{ scope.row.productName?scope.row.productName:'--' }}</div>
            <div>{{ scope.row.productName?scope.row.productName:'--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="实名情况">
          <template slot-scope="scope">
            <span>{{ scope.row.productName?scope.row.productName:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="打开时间">
          <template slot-scope="scope">
            <span>{{ scope.row.productName?scope.row.productName:'--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button v-if="permissions.plate_product_cancel" type="text" size="mini" style="color:#409eff" @click="handleUpdate(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <table-pagination
        v-show="pagination.total>0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getSearch" />
    </div>
    <el-dialog title="关联商品" :visible.sync="interactive.dialogFormVisible" width="50%">
      <tree-transfer
        :title="['未关联', '已关联']"
        :from_data="fromData"
        :to_data="toData"
        :default-props="{label:'label'}"
        :mode="mode"
        height="540px"
        filter
        pid="pid"
        open-all>
        <!-- @add-btn="add"
        @remove-btn="remove"> -->
      </tree-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="permissions.task_type_edit" type="primary" @click="createData">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { reqPlateProductPage, relationPlateProduct, selectPlateProductRelation } from '@/api/product/plate'
import TreeTransfer from 'el-tree-transfer'


export default {
  components: { TablePagination, TreeTransfer },
  data() {
    return {
      tableData: [],
      //表示参数类
      parameter: {
        productName: undefined,
        storeName: undefined,
        plateType: 'must_buy_list'
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
  
  methods: {
    // 查询列表
    getSearch() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      reqPlateProductPage(listQuery).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
      }).catch(e => {
        this.interactive.tableLoading = false
      })
    },
    // 查询未关联的商品
    resetTemp() {
      const temp = {
        keyword: undefined,
        plateType: 'must_buy_list'
      }
      selectPlateProductRelation(temp).then(resp => {
        const page = resp.data.data
        for (let index = 0; index < page.length; index++) {
          const element = page[index]
          element.pid = 0
        }
        this.fromData = page
      }).catch(e => {
        
      })
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
      relationPlateProduct('must_buy_list', arr).then(() => {
        this.getSearch()
        this.interactive.dialogFormVisible = false
        // 重置穿梭框数据
        this.fromData = []
        this.toData = []
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
      }).catch((e) => {
        console.error(e)
        this.interactive.dialogFormVisible = false
      })
    },

    // 详情
    handleUpdate(row) {
      // const _this = this
      // _this.$confirm(
      //   '是否要将必买清单列表中的“ ' + row.productName + '”商品取消关联？',
      //   '取关提示',
      //   {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }
      // ).then(() => {
      //   const tempData = {
      //     id: row.id,
      //     plateType: 'must_buy_list'
      //   }
      //   cancelPlateProductRelation(tempData).then((resp) => {
      //     _this.$notify({
      //       title: '成功',
      //       message: '“' + row.productName + '”取关成功！',
      //       type: 'success',
      //       duration: 3000
      //     })
      //     this.getSearch()
      //   }).catch((e) => {
      //     // console.error(e)
      //   })
      // }).catch(() => {
      //   _this.$message({
      //     type: 'info',
      //     message: '已取消'
      //   })
      // })
    },
    
    resetForm() {
      this.parameter = {
        productName: undefined,
        plateType: 'must_buy_list'
      }
      this.$nextTick(() => {
        this.getSearch()
      })
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
