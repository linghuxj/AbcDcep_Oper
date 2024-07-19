<template>
  <div class="main-content">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="用户信息" name="user">
        <UserInfo v-if="activeName === 'user'" />
      </el-tab-pane>
      <el-tab-pane label="创米数据" name="cm">
        <CmDataTable v-if="activeName === 'cm'" />
      </el-tab-pane>
      <el-tab-pane label="创客Plus数据" name="ck">
        <CkDataTable v-if="activeName === 'ck'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CkDataTable from "./components/ck-data-table.vue";
import CmDataTable from "./components/cm-data-table.vue";
import UserInfo from "./components/user-info.vue";
export default {
  components: { CkDataTable, CmDataTable, UserInfo },
  data() {
    return {
      unionDetail: {},
      activeName: "user",
    };
  },
  created() {},
  methods: {
    handleClick() {},
  },
};
</script>
<style scoped>
.content-form {
  margin-top: 50px;
}
.el-form-item__label {
  color: black;
}
.unionLogo {
  width: 100px;
  height: 100px;
}
.tagSpan {
  margin-right: 10px;
}
</style>
