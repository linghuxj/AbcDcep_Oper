<template>
  <div>
    <el-button
      v-if="!isEdit"
      icon="el-icon-plus"
      type="primary"
      style="margin-bottom: 10px"
      @click="to_addGoods()"
      >新增商品</el-button
    >
    <el-table
      :data="goodsData"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :span-method="objectSpanMethod"
    >
      <!-- <el-table-column label="店铺名称" prop="storeName"></el-table-column> -->
      <el-table-column label="产品名称(spu)">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsName ? scope.row.goodsName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="sku信息">
        <template slot-scope="scope">
          <span>{{
            scope.row.specName
              ? scope.row.specName + ':' + scope.row.specValue
              : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品售价(元)">
        <template slot-scope="scope">
          <span>{{ scope.row.price ? scope.row.price.salePrice : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="米粒">
        <template slot-scope="scope">
          <span>{{ scope.row.price ? scope.row.price.integral : '--' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="interview.dialogVisible" title="关联商品">
      <div style="margin-bottom: 10px">
        <el-input
          v-model="filterText"
          placeholder="请输入搜索内容关键字"
        ></el-input>
      </div>
      <div>
        <el-tree
          ref="tree"
          :props="props"
          :load="loadNode"
          node-key="id"
          lazy
          show-checkbox
          :filter-node-method="filterNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span style="margin-right: 10px">{{ node.label }}</span>
            <el-tag v-if="data.saleChannel === 'offline'" size="mini"
              >自提</el-tag
            >
            <el-tag
              v-else-if="data.saleChannel === 'online'"
              size="mini"
              type="warning"
              >商城</el-tag
            >
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interview.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="on_relation">确定关联</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getStoreSimple } from '@/api/store/store'
import { reqProductById } from '@/api/store/product'
import { getGoodsSKUListById } from '@/api/store/goods'
import { getActivityPageSku } from '@/api/operate/discount'

export default {
  name: 'DiscountAddGoods',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      default: ''
    }
  },
  data() {
    return {
      goodsData: [],
      filterText: undefined,
      interview: {
        dialogVisible: false
      },
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 10000
      },
      // 因为最后提交给后台是所有的规格项id，所以需要单独存储选中的规格项，最后提交的是选中的规格项
      // 储存所有规格项
      specCache: [],
      // 储蓄所有选中的规格项
      cache: [],
      // 规格对象集合
      specCacheList: []
      // // 数据回显的时候需要用到所有的选中项
      // // 储存所有的选中项
      // cache: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    if (this.isEdit) {
      this.$nextTick(() => {
        this._getActivityPageSku()
      })
    }
  },
  methods: {
    // 表格合并sku列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex, 'table')
    },
    // 查询sku信息
    _getActivityPageSku() {
      const query = {
        id: this.id,
        current: 1,
        size: 1000
      }
      getActivityPageSku(query)
        .then(res => {
          const page = res.data.data
          this.goodsData = page.records
        })
        .catch(() => {})
    },
    to_addGoods() {
      this.interview.dialogVisible = true
    },
    // 懒加载
    loadNode(node, resolve) {
      const _this = this
      const query = {
        current: 1,
        size: 1000
      }
      if (node.level === 0) {
        getStoreSimple(query).then(res => {
          const data = []
          const array = res.data.data.records
          for (let index = 0; index < array.length; index++) {
            const element = array[index]
            const ele = {
              name: element.storeName,
              id: element.storeId
            }
            data.push(ele)
          }
          return resolve(data)
        })
      }
      if (node.level === 1) {
        reqProductById(node.key).then(res => {
          const data = []
          const array = res.data.data
          for (let index = 0; index < array.length; index++) {
            const element = array[index]
            const ele = {
              name: element.productName,
              id: element.productId,
              saleChannel: element.saleChannel,
              saleChannelName: element.saleChannelName
            }
            data.push(ele)
          }
          return resolve(data)
        })
      }
      if (node.level === 2) {
        getGoodsSKUListById(node.key).then(res => {
          const data = []
          const array = res.data.data
          for (let index = 0; index < array.length; index++) {
            const element = array[index]
            console.log(element, 'element')
            const ele = {
              name: element.goodsName,
              id: element.goodsId,
              leaf: true
            }
            _this.specCache.push(element.goodsId)
            _this.specCacheList.push(element)
            data.push(ele)
          }
          return resolve(data)
        })
      }
      if (node.level > 2) return resolve([])
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 关联
    on_relation() {
      const _this = this
      _this.goodsData = []
      _this.cache = []
      const arr = this.$refs.tree.getCheckedKeys()
      console.debug('arr', arr)
      // specCache
      // _this.cache = arr.filter(function(v) {
      //   return _this.specCache.indexOf(v) > -1
      // })
      console.debug('specCache', _this.cache)
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index]
        _this.specCacheList.forEach(ele => {
          if (element === ele.goodsId) {
            _this.cache.push(ele.goodsId)
            if (ele.saleSpecValues.length > 0) {
              ele.saleSpecValues.forEach(item => {
                console.log(item, 'item')
                _this.goodsData.push({ ...ele, ...item })
              })
            }
          }
        })
      }
      console.log(this.goodsData)
      _this.interview.dialogVisible = false
    }
  }
}
</script>
