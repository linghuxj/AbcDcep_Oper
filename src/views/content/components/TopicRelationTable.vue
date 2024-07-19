<template>
  <div>
    <span v-if="!isOver">
      <el-button
        v-if="permissions.topic_cancel && goodsTableData.length > 0"
        type="primary"
        @click="to_cancle()"
        >取消关联</el-button
      >
    </span>
    <el-table
      ref="multipleTable"
      v-loading="interactive.tableLoading"
      border
      :data="goodsTableData"
      tooltip-effect="dark"
      style="width: 100%; margin-top: 10px"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="!isOver" type="selection" width="55" />
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称">
        <template slot-scope="scope">{{ scope.row.productName }}</template>
      </el-table-column>
      <el-table-column label="产品分类">
        <template slot-scope="scope">{{ scope.row.catePathName }}</template>
      </el-table-column>
      <el-table-column label="库存数">
        <template slot-scope="scope">{{ scope.row.stockNum }}</template>
      </el-table-column>
      <el-table-column label="是否上架">
        <template slot-scope="scope">{{ scope.row.statusName }}</template>
      </el-table-column>
      <el-table-column label="栏内排序">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.sort"
            :disabled="isOver"
            @change="toSort(scope.row.sort, scope.row.productId)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="!isOver" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.topic_sku_update"
            size="small"
            type="text"
            @click="relatedSpec(scope.row)"
            >修改规格
          </el-button>
          <el-button
            v-if="permissions.topic_cancel"
            size="small"
            type="text"
            @click="relatedDelete(scope.row.productId)"
            >取消关联
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <spec-relation-table
      v-if="interactive.dialogSpecs"
      ref="specRelationTable"
      :topic-id="topicId"
      :column-id="columnId"
      :product-id="productId"
      :dialog-specs="interactive.dialogSpecs"
      @refreshRelatedGoodsData="refreshRelatedGoodsData"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { toSortTopic, toCacnelRelationTopic } from "@/api/content/special.js";
import SpecRelationTable from "./SpecRelationTable.vue";
export default {
  components: { SpecRelationTable },
  props: {
    goodsTableData: {
      type: Array,
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    columnId: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    isOver: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      productId: undefined,
      selectArr: [],
      interactive: {
        tableLoading: false,
        dialogSpecs: false,
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {},
  methods: {
    // 多选操作
    handleSelectionChange(row) {
      this.selectArr = row;
    },
    // 多选取消关联
    to_cancle() {
      if (this.selectArr.length === 0) {
        this.$message.warning("请选择要取消关联的产品");
        return;
      }
      const productIds = [];
      this.selectArr.forEach((element) => {
        productIds.push(element.productId);
      });
      this.relatedDelete(productIds);
    },
    // 取消关联
    relatedDelete(productIds) {
      const arr = [];
      // 如果是直接取消关联 需转换类型
      if (typeof productIds === "string") {
        arr.push(productIds);
      }
      this.$confirm("是否取消关联所选产品？", "取关提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          const data = {
            topicId: this.topicId,
            columnId: this.columnId,
            productIds: arr.length > 0 ? arr : productIds,
          };
          toCacnelRelationTopic(data).then((response) => {
            this.$message({
              type: "success",
              message: "确定取消关联成功!",
            });
            this.$emit("func", { funcValue: "relation" });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 去排序
    toSort(sort, productId) {
      if (sort > this.total) {
        this.$message.error("排序值不能大于" + this.total);
        return;
      }
      const data = {
        topicId: this.topicId,
        columnId: this.columnId,
        productId: productId,
        sort: sort,
      };
      toSortTopic(data).then((res) => {
        this.$message.success("排序成功");
        this.$emit("func", { funcValue: "sort" });
      });
    },
    // 关联规格
    relatedSpec(val) {
      this.productId = val.productId;
      this.interactive.dialogSpecs = true;
      this.$nextTick(() => {
        this.$refs.specRelationTable.init();
      });
    },
    refreshRelatedGoodsData(val) {
      this.interactive.dialogSpecs = val;
    },
  },
};
</script>
<style scoped></style>
