<template>
  <el-dialog
    :title="operationType === 'relation' ? '关联商圈' : '详情'"
    :visible.sync="visible"
    @close="closeFun"
  >
    <el-form v-if="operationType === 'relation'" :inline="true" :model="search">
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
    </el-form>
    <div class="table-search">
      <el-button
        v-if="operationType === 'relation'"
        type="primary"
        @click="operationFun"
        >确定关联</el-button
      >
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
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
        v-if="operationType === 'relation'"
        :reserve-selection="true"
        width="55"
      />
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <el-table-column prop="districtName" label="商圈名称"></el-table-column>
      <el-table-column
        v-if="operationType === 'relation'"
        prop="address"
        label="商圈地址"
      ></el-table-column>
      <el-table-column
        v-if="
          operationType === 'unrelation' &&
          permissions.district_hot_cancel_relation
        "
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
  </el-dialog>
</template>
<script>
import { mapGetters } from "vuex";

import { areas } from "@/api/area";

import {
  getByCityCode,
  hotRelation,
  getHotDetail,
  cancelRelation,
} from "@/api/commerce/commerce";

export default {
  name: "BusinessTable",
  props: {
    // 操作类型 relation为关联
    operationType: {
      type: String,
      default: "relation",
    },
    // 请求操作类型
    reqType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 是否显示弹出层
      visible: false,
      //表示参数类
      search: {
        locationCode: undefined,
      },
      tableData: [],
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogFormVisible: false,
      },
      // 数据列表
      exportList: [],
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data;
              const nodes = Array.from(areaList).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 1,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      areaCode: "",
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  watch: {
    areaCode: {
      handler(n) {
        if (this.operationType === "unrelation" && n !== "") {
          getHotDetail({
            areaCode: n,
            type: this.reqType,
          }).then((res) => {
            this.tableData = res.data.data.map((item) => {
              return {
                districtId: item.id,
                districtName: item.relationName,
              };
            });
          });
        }
      },
    },
  },
  methods: {
    // 初始化
    init() {
      this.visible = true;
    },

    getRowKeys(row) {
      return row.districtId;
    },
    // 多选功能
    handleSelectionChange(val) {
      this.exportList = val;
    },
    /**
     * 全选
     */
    selectDeptAll(val) {
      this.exportList = val;
    },
    // 操作相关处理事件
    operationFun() {
      const relationIds = this.exportList.map((item) => item.districtId);
      if (relationIds.length < 1) {
        return;
      }
      const req = {
        relationList: [
          {
            areaCode:
              this.operationType === "relation"
                ? this.search.locationCode.toString()
                : this.areaCode,
            relationIds,
          },
        ],
        type: this.reqType,
      };
      if (this.operationType === "relation") {
        hotRelation(req).then((res) => {
          if (res.data.code === 200) {
            this.$message.success("关联成功");
            this.visible = false;
            this.$emit("refreshList");
          } else {
            this.$message.error("关联失败");
          }
          this.search.locationCode = undefined;
          this.exportList = [];
        });
      }
    },
    // 获取当前市正常的商圈
    handleChange(value) {
      if (value.toString() && value.toString() !== "") {
        getByCityCode({
          location: value.toString(),
          type: this.reqType,
        }).then((res) => {
          this.tableData = res.data.data.records;
        });
      } else {
        this.tableData = [];
      }
    },
    // 获取关联数据
    getHotDetail() {
      getHotDetail({
        areaCode: this.areaCode,
        type: this.reqType,
      }).then((res) => {
        this.tableData = res.data.data.map((item) => {
          return {
            districtId: item.id,
            districtName: item.relationName,
          };
        });
      });
    },
    // 取消关联
    cancelRelation(rowData) {
      this.$confirm("确定要取消该商圈的关联？", "取消关联", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          cancelRelation(rowData.districtId).then((res) => {
            if (res.data.code === 200) {
              this.$message.success("操作成功");
              this.getHotDetail();
            } else {
              this.$message.error("操作失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    closeFun() {
      this.areaCode = "";
      // this.search.locationCode = undefined
      this.exportList = [];
      this.$emit("refreshList");
    },
  },
};
</script>
<style lang="scss" scoped>
.table-search {
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
}
</style>
