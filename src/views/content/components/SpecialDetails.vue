<template>
  <div class="storeDetail-content">
    <div class="special-header">
      <el-row>
        <el-col :span="3">
          <el-image
            v-if="topicMes.topicImage"
            :src="topicMes.topicImage"
            style="width: 100%; height: 100px"
            fit="contain"
          >
          </el-image>
        </el-col>
        <el-col :span="18">
          <h2>{{ topicMes.topicName }}</h2>
          <el-row :gutter="20">
            <el-col :span="6" style="display: flex">
              <span>专题底色：</span>
              <div
                :style="[
                  {
                    background: topicMes.topicColor,
                    width: '30px',
                    height: '20px',
                  },
                ]"
              ></div>
              <span>{{ topicMes.topicColor }}</span>
            </el-col>
            <el-col :span="6">
              <span>关联产品数：</span>
              <span>{{ topicMes.relationProductNum }}</span>
            </el-col>
            <el-col :span="12">
              <span>活动时间：</span>
              <span
                >{{ topicMes.startTime ? topicMes.startTime : "--" }}至{{
                  topicMes.endTime ? topicMes.endTime : "--"
                }}</span
              >
            </el-col>
          </el-row>
          <div>
            所属城市：<span
              v-for="(item, index) in topicMes.areaNameList"
              :key="index"
              style="margin-right: 10px"
              >{{ item }}</span
            >
          </div>
          <!--修改专题信息  -->

          <span v-if="topicMes.status !== 'over'">
            <el-button
              v-if="permissions.goods_topic_add"
              icon="el-icon-edit"
              plain
              @click="to_updateTopic(topicMes.topicId)"
              >修改专题信息</el-button
            >
          </span>
        </el-col>
        <el-col :span="3">
          <div class="status">
            <wel-tag :type="type">{{ handleStatus(topicMes.status) }}</wel-tag>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="main-bottom">
      <el-tabs>
        <el-tab-pane label="已关联产品">
          <div v-if="topicMes.columnList && topicMes.columnList.length > 0">
            <el-collapse
              v-model="raltionValue"
              accordion
              @change="changeRelation()"
            >
              <el-collapse-item
                v-for="(item, index) in topicMes.columnList"
                :key="index"
                :name="index + 1"
              >
                <template slot="title">
                  <span>栏目一：{{ item.columnName }}</span>
                  <span style="margin-left: 50px"
                    >已选产品数：{{
                      item.relationProductNum ? item.relationProductNum : "0"
                    }}</span
                  >
                </template>
                <div>
                  <topic-relation-table
                    :goods-table-data="goodsTableData"
                    :topic-id="topicId"
                    :column-id="columnId"
                    :total="pagination.total"
                    :is-over="topicMes.status === 'over' ? true : false"
                    @func="refreshTable()"
                  />
                  <!-- 分页 -->
                  <div style="width: 100%; text-align: right">
                    <table-pagination
                      v-show="pagination.total > 0"
                      :total="pagination.total"
                      :page.sync="pagination.current"
                      :limit.sync="pagination.size"
                      @pagination="getSearch"
                    />
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-else>
            <topic-relation-table
              :goods-table-data="goodsTableData"
              :topic-id="topicId"
              :column-id="columnId"
              :total="pagination.total"
              :is-over="topicMes.status === 'over' ? true : false"
              @func="refreshTable()"
            />
            <!-- 分页 -->
            <div style="width: 100%; text-align: right; margin-top: 10px">
              <table-pagination
                v-show="pagination.total > 0"
                :total="pagination.total"
                :page.sync="pagination.current"
                :limit.sync="pagination.size"
                @pagination="getSearch"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import WelTag from "@/template/Wel-Tag/index.vue";
import TablePagination from "@/components/table-pagination";
import TopicRelationTable from "../components/TopicRelationTable";
import {
  getTopicDetailById,
  getTopicDetailRelation,
} from "@/api/content/special.js";
export default {
  name: "SpecialDetails",
  components: { WelTag, TablePagination, TopicRelationTable },
  data() {
    return {
      interactive: {
        tableLoading: false,
      },
      topicId: undefined,
      columnId: -1, //-1表示不区分栏目
      url: undefined,
      activeName: "baseData",
      status: "normal",
      topicMes: {},
      type: "",
      raltionValue: undefined,
      goodsTableData: [],
      selectArr: [], //选中的取消关联产品
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    if (this.$route.params.id) {
      this.topicId = this.$route.params.id;
      this.$nextTick(() => {
        this.getTopicDetailById();
      });
    }
  },
  methods: {
    // 获取专题详情
    getTopicDetailById() {
      getTopicDetailById(this.topicId).then((res) => {
        this.topicMes = res.data.data;
        if (
          this.topicMes.columnList.length === 0 ||
          !this.topicMes.columnList
        ) {
          this.getTopicDetailRelation();
        }
      });
    },
    // 根据栏目ID查询关联产品列表
    getTopicDetailRelation() {
      const data = {
        columnId: this.topicMes.columnList ? this.columnId : "-1",
        topicId: this.topicId,
      };
      this.interactive.tableLoading = true;
      getTopicDetailRelation(data).then((res) => {
        this.goodsTableData = res.data.data.records;
        this.pagination.total = res.data.data.total;
        this.interactive.tableLoading = false;
      });
    },
    // 监听栏目的点击
    changeRelation() {
      // raltionValue不存在 表示关闭折叠版
      if (!this.raltionValue) return;
      this.columnId = this.topicMes.columnList[this.raltionValue - 1].columnId;
      this.getTopicDetailRelation();
    },
    //分页跳转查询
    getSearch() {
      this.getTopicDetailRelation();
    },
    // 获取子组件传值
    refreshTable(data) {
      this.getTopicDetailRelation();
      this.getTopicDetailById();
    },
    // 跳转到修改专题页面
    to_updateTopic(topicId) {
      this.$router.push(`/content/special/edit/${topicId}`);
    },
    handleStatus(val) {
      if (!val) {
        this.type = "";
        return "";
      }
      if (val === "no_start") {
        this.type = "";
        return "未开始";
      }

      if (val === "progress") {
        this.type = "primary";
        return "进行中";
      }

      if (val === "over") {
        this.type = "info";
        return "已结束";
      }

      this.type = "";
      return "未开始";
    },
  },
};
</script>
<style scoped lang="scss">
.storeDetail-content {
  margin: 10px 20px;
  font-size: 14px;
}

.special-header {
  background-color: #fff;
  margin-bottom: 20px;
  padding: 20px 30px 12px;
}

.main-bottom {
  background-color: #fff;
  padding: 20px 30px;
  .goods-herder {
    background-color: #d3d3d3;
    padding: 5px;
    margin-bottom: 10px;
  }
}
.status {
  position: absolute;
  right: 35px;
}

.title {
  display: flex;
  flex-direction: row;
}

el-collapse .el-collapse-item__header {
  display: flex !important;
}
</style>
