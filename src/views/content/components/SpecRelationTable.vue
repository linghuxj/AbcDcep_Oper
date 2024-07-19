<template>
  <div>
    <el-dialog
      title="关联规格"
      :visible.sync="interactive.specForm"
      width="30%"
      :before-close="isclose"
    >
      <el-table
        ref="skuTable"
        border
        :data="specTableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="SKU规格">
          <template slot-scope="scope">{{ scope.row.specName }}</template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpdateSku">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTopicSkuList, upTopicSku } from "@/api/content/special";

export default {
  name: "SpecRelationTable",
  props: {
    topicId: {
      type: String,
      required: true,
    },
    columnId: {
      type: Number,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    dialogSpecs: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      // sku  table
      specTableData: [],
      // 操作类型
      interactive: {
        specForm: false,
        isHistory: false,
      },
    };
  },
  // created() {
  //   this.$nextTick(() => {
  //     this.init()
  //   })
  // },
  methods: {
    init() {
      const listQuery = {
        columnId: this.columnId,
        productId: this.productId,
        topicId: this.topicId,
      };
      this.interactive.specForm = this.dialogSpecs;
      getTopicSkuList(listQuery)
        .then((res) => {
          this.specTableData = res.data.data;
          return this.specTableData;
        })
        .then((spec) => {
          this.findSelectedDataSku(spec);
        });
    },

    // 规格默认选中
    findSelectedDataSku(data) {
      const _this = this;
      _this.$nextTick().then(function () {
        data.forEach((element) => {
          if (element.isRelation) {
            _this.$refs.skuTable.toggleRowSelection(element, true);
            return true;
          }
        });
      });
    },

    // 规格弹窗确认操作
    handleUpdateSku() {
      const selecteds = this.$refs.skuTable.selection;
      if (selecteds.length === 0) {
        this.$message.error("规格项不能为空！");
        return;
      }
      const topicDetailList = [];
      for (const iterator of selecteds) {
        const object = {
          goodsId: iterator.goodsId,
          productId: this.productId,
        };
        topicDetailList.push(object);
      }
      const list = {
        columnId: this.columnId,
        topicDetailList: topicDetailList,
        topicId: this.topicId,
      };
      upTopicSku(list).then(() => {
        this.$message.success("规格修改成功！");
        this.isclose();
      });
    },
    //注：Drawer绑定要关闭事件，否则关闭后再打开Drawer后table选中会有问题**
    isclose() {
      this.$emit("refreshRelatedGoodsData", false);
      this.interactive.specForm = false;
      this.$refs.skuTable.clearSelection(); //清空table的选中
    },
  },
};
</script>

<style></style>
