<template>
  <el-dialog title="关联店铺" :visible.sync="visible" @close="closeFun">
    <template v-if="!isEdit">
      <el-form :inline="true" :model="search">
        <el-form-item label="城市名：">
          <el-cascader
            ref="cascader"
            v-model="search.locationCode"
            :props="locationNameList"
            placeholder="请选择省/市/县区"
            clearable
            style="width: 100%"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="店铺名称：">
          <el-input
            v-model="search.keyword"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="table-search">
        <el-button type="primary" @click="onAssocStore">确定关联</el-button>
      </div>
    </template>
    <div v-if="interactive.isEdit">
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="empty_text"
        :data="tableData"
        :row-key="getRowKeys"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @select-all="selectDeptAll"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          v-if="!isEdit"
          width="55"
        />
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column v-if="!isEdit" prop="storeId" label="店铺编号"></el-table-column>
        <el-table-column prop="storeName" label="店铺名称"></el-table-column>
        <el-table-column v-if="!isEdit" prop="productNum" label="商品数量"></el-table-column>
        <el-table-column
          v-if="isEdit && permissions.district_hot_cancel_relation"
          label="操作"
          width="100"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="cancelRelation(scope.row)">
              取消关联
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        v-if="!isEdit"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'

import { areas } from '@/api/area'

import { postHotRelation } from '@/api/commerce/hot'
import { cancelRelation, getHotDetail } from '@/api/commerce/commerce'

import { getHotNoRelationPage } from '@/api/commerce/hot'

export default {
  name: 'AssocStoreForm',
  components: { TablePagination },
  props: {
    // 请求操作类型
    reqType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isEdit: false,
      // 是否显示弹出层
      visible: false,
      //表示参数类
      search: {
        locationCode: undefined,
        location: undefined,
        keyword: undefined
      },
      tableData: [],
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogFormVisible: false,
        isEdit: false
      },
      // 数据列表
      exportList: [],

      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          const parentId = !node.value ? '-1' : node.value
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then(res => {
              const areaList = res.data.data
              const nodes = Array.from(areaList).map(item => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 1
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            })
          }, 100)
        }
      },
      // 是否显示操作栏
      operationType: false,
      empty_text: '请先选择省市区'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    init(isEdit, id) {
      this.isEdit = isEdit
      this.interactive.isEdit = true
      this.search.location = id
      this.visible = true
      if (isEdit) {
        this.empty_text = '暂无数据'
        this.getHotDetail()
      }
      // this.getList()
    },
    // 查询列表
    getList() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.search, this.pagination)
      getHotNoRelationPage(listQuery).then(resp => {
        const page = resp.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.interactive.tableLoading = false
        if (this.tableData.length===0) {
          this.empty_text = '暂无数据'
        }
      }).catch(() => {
        this.interactive.tableLoading = false
      })
    },
    // 关联
    onAssocStore() {
      if (this.exportList.length < 1) {
        return
      }
      const data = {
        relationList: [
          {
            areaCode: this.search.location,
            relationIds: this.exportList
          }
        ],
        type: 'store_hot'
      }
      postHotRelation(data).then(() => {
        this.$message.success('关联成功')
        this.visible = false
        this.$emit('refreshList')
      }).catch(e=>{
        this.$message.error(e)
      })
    },
    // 多选功能
    handleSelectionChange(val) {
      this.exportList = []
      this.deptSelectItem(val)
    },
    /**
     * 全选
     */
    selectDeptAll(val) {
      this.exportList = []
      this.deptSelectItem(val)
    },
    // 处理数据id
    deptSelectItem(data) {
      const arr = data.map(item => {
        return item.storeId
      })
      this.exportList = arr.sort()
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKeys(row) {
      return row.storeId
    },
    // 省市区选择事件
    handleChange(value) {
      this.search.location = value.toString()
      this.interactive.isEdit = true
      this.getList()
    },
    // 获取关联数据
    getHotDetail() {
      getHotDetail({
        areaCode: this.search.location,
        type: this.reqType,
      })
        .then(res => {
          this.tableData = res.data.data.map(item => {
            return {
              ...item,
              storeName: item.relationName
            }
          })
          this.interactive.tableLoading = false
        })
        .catch(() => {
          this.interactive.tableLoading = false
        })
    },
    // 取消关联
    cancelRelation(rowData) {
      this.$confirm('确定要取消该商圈的关联？', '取消关联', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        cancelRelation(rowData.id).then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.getHotDetail()
          } else {
            this.$message.error('操作失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })          
      })
    },
    closeFun() {
      this.operationType = false
      this.$emit('refreshList')
    }
  }
}
</script>
<style lang="scss" scoped>
.table-search {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
</style>
