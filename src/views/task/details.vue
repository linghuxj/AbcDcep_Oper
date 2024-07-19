<template>
  <!-- <task-details /> -->
  <div class="main-content">
    <!-- 头部内容 -->
    <task-details-header />
    <div class="task-table">
      <el-tabs v-model="activeName">
        <el-tab-pane label="任务数据" name="first">
          <task-details-statistical />
        </el-tab-pane>
        <el-tab-pane label="创客列表" name="second">
          <task-details-maker />
        </el-tab-pane>
        <el-tab-pane label="任务结果" name="third">
          <task-details-result />
        </el-tab-pane>
        <el-tab-pane label="财务账号信息" name="fourth">
          <task-details-finance />
        </el-tab-pane>
        <el-tab-pane label="业务设置" name="fifth">
          <task-details-set />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TaskDetailsStatistical from "./components/TaskDetailsStatistical.vue";
import TaskDetailsHeader from "./components/TaskDetailsHeader.vue";
import TaskDetailsMaker from "./components/TaskDetailsMaker.vue";
import TaskDetailsResult from "./components/TaskDetailsResult.vue";
import TaskDetailsFinance from "./components/TaskDetailsFinance.vue";
import TaskDetailsSet from "./components/TaskDetailsSet.vue";

export default {
  name: "Details",
  components: {
    TaskDetailsHeader,
    TaskDetailsStatistical,
    TaskDetailsMaker,
    TaskDetailsResult,
    TaskDetailsFinance,
    TaskDetailsSet,
  },
  data() {
    return {
      activeName: "first",
    };
  },
  created() {
    if (this.$route.query.type === "result") {
      this.activeName = "third";
    }
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.main-content {
  font-size: 14px;
  .task-table {
    margin-top: 20px;
  }
}
</style>
