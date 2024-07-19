<template>
  <div class="main-content">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="公会信息" name="info">
        <GuildInfo />
      </el-tab-pane>
      <el-tab-pane label="会员详情" name="detail">
        <GuildDetail />
      </el-tab-pane>
      <el-tab-pane label="入会申请" name="application">
        <GuildApplication />
      </el-tab-pane>
    </el-tabs>
    <!-- <el-form label-width="100px" class="content-form">
      <el-form-item label="公会名称：">{{unionDetail.unionName}}</el-form-item>
      <el-form-item label="公会会长：">{{unionDetail.leaderUser?unionDetail.leaderUser.username:'--'}}</el-form-item>
      <el-form-item label="关联技能：">
        <span v-for="(item,index) in unionDetail.tagNames" :key="index" class="tagSpan">{{item}}</span>
      </el-form-item>
      <el-form-item label="公会头像：">
        <img :src="unionDetail.unionLogo" class="unionLogo"/>
      </el-form-item>
      <el-form-item label="服务范围：">{{unionDetail.locationName}}</el-form-item>
    </el-form> -->
  </div>
</template>
<script>
import GuildInfo from "./components/guild-info.vue";
import GuildDetail from "./components/guild-detail.vue";
import GuildApplication from "./components/guild-application.vue";
export default {
  components: { GuildInfo, GuildDetail, GuildApplication },
  data() {
    return {
      unionDetail: {},
      activeName: "application",
    };
  },
  created() {
    console.debug("id", this.$route.query);
  },
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
