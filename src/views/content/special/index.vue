/** * 专题列表 */
<template>
  <div class="main-content">
    <el-form ref="searchForm" :inline="true" :model="parameter">
      <el-form-item label="专题名称：">
        <el-input v-model="parameter.topicName" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="城市名：">
        <el-cascader
          ref="cascader"
          v-model="parameter.locationCode"
          :props="locationNameList"
          placeholder="请选择省/市/县区"
          clearable
          style="width: 100%"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="parameter.status" placeholder="请选择">
          <el-option
            v-for="(item, index) in topicStatusList"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-form-item">
        <el-button type="primary" @click="getSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>

    <div v-if="permissions.topic_add">
      <el-button type="primary" @click="handleAdd()">新增专题</el-button>
      <el-button type="primary" @click="handleAdd()">删除</el-button>
      <el-button type="primary" @click="handleAdd()">结束</el-button>
    </div>

    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" label="序号">
        </el-table-column>
        <el-table-column label="专题名称" width="300">
          <template slot-scope="scope">
            <div>{{ scope.row.topicName ? scope.row.topicName : "--" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="专题底色" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.topicColor ? scope.row.topicColor : "--" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="专题图片" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.topicImage">
              <el-image
                style="width: 100px; height: 80px"
                :src="scope.row.topicImage"
                fit="fill"
                :preview-src-list="[scope.row.topicImage]"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="绑定商品数" width="150">
          <template slot-scope="scope">
            <span>{{
              scope.row.relationProductNum ? scope.row.relationProductNum : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <span>{{
              scope.row.statusName ? scope.row.statusName : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生效时间">
          <template slot-scope="scope">
            <span
              >{{ scope.row.startTime ? scope.row.startTime : "--" }} 至
              {{ scope.row.endTime ? scope.row.endTime : "--" }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 'over'">
              <el-button
                v-if="permissions.topic_add"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUpdate(scope.row.topicId)"
                >预览</el-button
              >
              <el-button
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleDetails(scope.row.topicId)"
                >详情</el-button
              >
            </span>
            <span v-else>
              <el-button
                v-if="permissions.topic_add"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUpdate(scope.row.topicId)"
                >预览</el-button
              >
              <el-button
                v-if="permissions.topic_add"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUpdate(scope.row.topicId)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleDetails(scope.row.topicId)"
                >详情</el-button
              >
              <el-button
                v-if="permissions.topic_status"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleDelete(scope.row)"
                >结束</el-button
              >
              <el-button
                v-if="permissions.topic_status"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <table-pagination
        v-show="pagination.total > 0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getSearch"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import {
  getGoodsTopicStatus,
  getGoodsTopicPage,
  postGoodsToppicOver,
} from "@/api/content/special";

import {
  getByCityCode,
} from "@/api/commerce/commerce";

import { areas } from "@/api/area";

export default {
  components: { TablePagination },
  data() {
    return {
      tableData: [],
      // 状态
      topicStatusList: [],
      //表示参数类
      parameter: {
        status: undefined,
        topicName: undefined,
        locationCode:'',
      },
      // 操作类型
      interactive: {
        tableLoading: false,
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
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
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },

  created() {
    this._getGoodsTopicStatus();
    this.getSearch();
  },

  methods: {
    handleSelectionChange(value){
      console.log(value,'value')
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
    // 查询专题
    _getGoodsTopicStatus() {
      getGoodsTopicStatus().then((resp) => {
        this.topicStatusList = resp.data.data;
      });
    },
    // 查询列表
    getSearch() {
      this.interactive.tableLoading = true;
      const listQuery = Object.assign({}, this.parameter, this.pagination);
      getGoodsTopicPage(listQuery)
        .then((resp) => {
          const page = resp.data.data;
          this.tableData = page.records;
          this.pagination.total = page.total;
          this.interactive.tableLoading = false;
        })
        .catch((e) => {
          this.interactive.tableLoading = false;
        });
    },

    // 编辑
    handleUpdate(val) {
      this.$router.push(`/content/special/edit/${val}`);
    },
    // 详情
    handleDetails(val) {
      this.$router.push(`/content/special/details/${val}`);
    },
    handleDelete(row) {
      const _this = this;
      _this
        .$confirm(
          "是否提前结束“" +
            row.topicName +
            "”专题？结束后，该专题将不在前端展示。",
          "结束提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(() => {
          postGoodsToppicOver(row.topicId)
            .then((resp) => {
              _this.$notify({
                title: "成功",
                message: "结束“" + row.topicName + "”专题成功！",
                type: "success",
                duration: 3000,
              });
              this.getSearch();
            })
            .catch((e) => {
              // console.error(e)
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    resetForm() {
      this.parameter = {
        productName: undefined,
        plateType: "must_buy_list",
      };
      this.$nextTick(() => {
        this.getSearch();
      });
    },
    // 新增专题
    handleAdd() {
      this.$router.push(`/content/special/compile`);
    },
  },
};
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
