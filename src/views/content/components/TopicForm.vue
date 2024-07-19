<template>
  <div name="TopicForm">
    <el-dialog
      :title="title"
      :visible.sync="interactive.goodsForm"
      width="50%"
      :before-close="isclose"
    >
      <span v-if="interactive.isHistory"
        >需对历史已关联的产品进行修改，请移步至专题详情页操作！</span
      >
      <div v-if="!interactive.isQuery" class="store-search">
        <el-input
          v-model="parameter.keyword"
          placeholder="请输入搜索内容关键字"
        >
          <el-button slot="append" type="primary" @click="getSearch"
            >搜索</el-button
          >
        </el-input>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="interactive.tableLoading"
        :header-cell-class-name="cellClass"
        class="multipleTable"
        border
        :data="goodsTableData"
        style="width: 100%"
        :row-key="getRowKeys"
        @select="handleSelection"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="!interactive.isHistory"
          type="selection"
          :reserve-selection="true"
          align="center"
          width="55"
        >
        </el-table-column>
        <el-table-column label="产品名称" align="left" width="220">
          <template slot-scope="scope">{{ scope.row.productName }}</template>
        </el-table-column>
        <el-table-column label="店铺名称">
          <template slot-scope="scope">
            <span>{{ scope.row.storeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" width="140">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.checkbox"
              type="text"
              @click="relatedSpec(scope.$index, scope.row)"
              >已关联规格（{{ scope.row.skuLists.length }}）</el-button
            >
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="stocks" width="100" label="库存" />
      </el-table>
      <!-- 分页 -->
      <div v-if="!interactive.isQuery" style="margin-top: 20px">
        <table-pagination
          v-show="pagination.total > 0"
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getPageSearch"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="!interactive.isHistory"
          type="primary"
          @click="updateGoods"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 关联商品 -->
    <goods-form
      v-if="interactive.dialogSpecs"
      ref="relatedGoods"
      @refreshRelatedSpecData="refreshRelatedSpecData"
    />
  </div>
</template>

<script>
import TablePagination from "@/components/table-pagination";
import { getGoodsToppicRelationSelect } from "@/api/content/special";
import GoodsForm from "./SpecForm";

export default {
  name: "TopicForm",
  components: { TablePagination, GoodsForm },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: "",
      // 记录当前是第几行的产品添加SKU
      skuId: undefined,
      // 商品table
      goodsTableData: [],
      // 记录每次父组件传过来的数据
      goodsCache: [],
      // 弹出层添加规格
      specForm: {},
      //表示参数类
      parameter: {
        // 操作类型：true-获取已关联商品，false-获取未关联商品
        isRelation: false,
        columnId: undefined,
        keyword: undefined,
        relationProductIds: undefined,
        topicId: undefined,
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
      // 操作类型
      interactive: {
        dialogForm: false,
        goodsForm: false,
        dialogSpecs: false,
        tableLoading: false,
        isEdit: false,
        isQuery: false,
        isHistory: false,
      },
    };
  },
  methods: {
    // 判定是不是表头
    cellClass(row) {
      if (row.columnIndex === 0) {
        return "DisableSelection";
      }
    },
    // 保存选中的数据id,row-key就是要指定一个key标识这一行的数据
    getRowKeys(row) {
      return row.productId;
    },
    // isEdit    是否修改专题
    // isNo      'history'历史关联数据 'update' 当前关联的数据 'add' 关联产品
    // isQuery   是否区分栏目
    // val       栏目的数据
    // isHistory 是否历史关联数据
    init(isEdit, isNo, val) {
      this.interactive.isEdit = isEdit;
      this.interactive.goodsForm = true;
      this.goodsCache = val.goodsTopicDetailReqList;
      if (isNo === "history") {
        this.title = "历史已关联产品";
        this.interactive.isQuery = false;
        this.interactive.isHistory = true;
        if (isEdit) {
          const id = this.$route.params && this.$route.params.id;
          this.parameter = {
            type: 1,
            columnId: val.columnId,
            keyword: undefined,
            topicId: id,
            isRelation: true,
          };
        }
        this.interactive.tableLoading = true;
        this._getGoodsToppicRelation();
      } else if (isNo === "update") {
        this.interactive.isQuery = true;
        this.title = "新增关联产品";
        this.goodsTableData = val.topicDetailList;
        if (val.topicDetailList.length === 0) return;
        const _this = this;
        console.debug("item", _this.goodsCache);
        _this.$nextTick(() => {
          _this.goodsCache.forEach((item) => {
            _this.findSelectedData(this.goodsTableData, item);
          });
        });
      } else if (isNo === "add") {
        this.interactive.isQuery = false;
        this.interactive.isHistory = false;
        this.title = "关联产品";
        if (isEdit) {
          const id = this.$route.params && this.$route.params.id;
          this.parameter = {
            type: 2,
            columnId: val.columnId,
            keyword: undefined,
            topicId: id,
            isRelation: false,
          };
        }
        this.interactive.tableLoading = true;
        this._getGoodsToppicRelation();
      }
    },

    // 查询未关联、已关联商品
    _getGoodsToppicRelation() {
      const _this = this;
      const listQuery = Object.assign({}, _this.parameter, _this.pagination);
      getGoodsToppicRelationSelect(listQuery)
        .then((resp) => {
          const page = resp.data.data;

          _this.goodsTableData = page.records.map((item) => {
            item.checkbox = false;
            item.skuLists = [];
            item.stocks = item.stockNum;
            return item;
          });
          _this.pagination.total = page.total;
          return _this.goodsTableData;
        })
        .then((response) => {
          _this.$nextTick(() => {
            if (this.interactive.isHistory) {
              _this.goodsTableData.forEach((element) => {
                element.checkbox = true;
                element.skuLists = element.goodsStockList;
                element.stocks = element.stockNum;
                _this.$refs.multipleTable.toggleRowSelection(element, true);
              });
            } else {
              _this.goodsCache.forEach((item) => {
                _this.findSelectedData(response, item);
              });
            }
          });
          _this.interactive.tableLoading = false;
        })
        .catch((e) => {
          this.interactive.tableLoading = false;
        });
    },
    // 复选框选中
    findSelectedData(data, item) {
      const _this = this;
      _this.$nextTick().then(function () {
        data.some((element) => {
          if (element.productId === item.productId) {
            element.checkbox = item.checkbox;
            element.skuLists = item.skuLists;
            element.stocks = item.stocks;
            _this.$refs.multipleTable.toggleRowSelection(element, true);
            return true;
          }
        });
      });
    },
    // 搜索
    getSearch() {
      this.pagination.current = 1;
      this._getGoodsToppicRelation();
    },
    // 分页查询
    getPageSearch() {
      this._getGoodsToppicRelation();
    },

    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 产品窗复选框选中
    handleSelection(selection, row) {
      const _this = this;
      row.stocks = row.stockNum;
      row.checkbox = false;
      selection.forEach((element) => {
        if (element.productId === row.productId) {
          row.stocks = 0;
          row.checkbox = true;
          if (row.skuLists.length > 0) {
            row.skuLists.forEach((item) => {
              row.stocks += item.stock;
            });
          }

          const index = _this.goodsTableData.findIndex(
            (v) => v.productId === element.productId
          );
          // 选中的时候打开规格的弹出窗
          _this.relatedSpec(index, row);
        }
      });
    },
    // 规格弹出窗
    relatedSpec(index, val) {
      this.skuId = index;
      this.interactive.dialogSpecs = true;
      this.$nextTick(() => {
        this.$refs.relatedGoods.init(
          this.interactive.dialogSpecs,
          val,
          this.interactive.isHistory
        );
      });
    },
    // 子组件确定按钮调用父组件的方法，改写父组件中的值
    refreshRelatedSpecData(val, number) {
      this.goodsTableData[this.skuId].skuLists = val;
      this.goodsTableData[this.skuId].stocks = number;
      this.interactive.dialogSpecs = false;
    },
    // 关联产品确认操作
    updateGoods() {
      const selecteds = this.$refs.multipleTable.selection;
      if (selecteds.length === 0) {
        this.$message.error("请选择产品！");
        return;
      }
      const a = selecteds.every((val) => {
        return val.skuLists.length > 0;
      });
      if (!a) {
        this.$message.error("存在未关联规格的商品，请关联规格！");
        return;
      }

      this.$emit("refreshRelatedGoodsData", selecteds);
      this.isclose();
    },
    //注：Drawer绑定要关闭事件，否则关闭后再打开Drawer后table选中会有问题**
    isclose() {
      this.interactive.goodsForm = false;
      this.$refs.multipleTable.clearSelection(); //清空table的选中
    },
  },
};
</script>

<style scoped lang="scss">
.store-search {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  .el-input-group {
    width: 260px;
  }
}
</style>
<style>
/* // 隐藏全选框 */
.multipleTable .DisableSelection > .cell {
  display: none !important;
}
</style>
