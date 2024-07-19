<template>
  <div>
    <el-dialog title="关联规格" :visible.sync="interactive.specForm" width="30%" :before-close="isclose">
      <el-table
        ref="skuTable"
        border
        :data="specTableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column v-if="!interactive.isHistory" type="selection" width="55">
        </el-table-column>
        <el-table-column label="SKU规格">
          <template slot-scope="scope">{{ scope.row.specName }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" />
      </el-table>
      <span v-if="!interactive.isHistory" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpdateSku">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SpecForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // sku  table
      specTableData: [],
      // 操作类型
      interactive: { 
        specForm: false,
        isHistory: false
      }
    }
  },
  methods: {
    init(isNo, val, isHistory) {
      this.interactive.specForm = isNo
      this.interactive.isHistory = isHistory
      this.specTableData = val.goodsStockList
      // sku数据缓存
      const skuSpecCache = val.skuLists

      // 判定sku缓存是否为空
      if (skuSpecCache.length > 0) {
        skuSpecCache.forEach(row => {
          this.findSelectedDataSku(this.specTableData, row)
        })
      }
    },
    
    // 规格默认选中
    findSelectedDataSku(data, item) {
      const _this = this
      _this.$nextTick().then(function() {
        data.some(element => {
          if (element.goodsId === item.goodsId) {
            _this.$refs.skuTable.toggleRowSelection(element, true)
            return true
          }
        })
      })
      
    },
    
    // 规格弹窗确认操作
    handleUpdateSku() {
      const selecteds = this.$refs.skuTable.selection
      if (selecteds.length === 0) {
        this.$message.error('请选择规格！')
        return 
      }
      let stocks = 0
      selecteds.forEach(item => {
        stocks += item.stock
      })
      this.$emit('refreshRelatedSpecData', selecteds, stocks)
      
      this.isclose()
    },
    //注：Drawer绑定要关闭事件，否则关闭后再打开Drawer后table选中会有问题**
    isclose() {
      //console.log('你清空了选中')
      this.interactive.specForm = false
      this.$refs.skuTable.clearSelection()//清空table的选中
    }
  }

}
</script>

<style>

</style>
