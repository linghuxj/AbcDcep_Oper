<template>
  <div class="main-content">
    <div class="main-item">
      <label>姓名：</label>
      <span>{{ staffMes.username }}</span>
    </div>
    <div class="main-item">
      <label>手机号码：</label>
      <span>{{ staffMes.mobile }}</span>
    </div>
    <div class="main-item">
      <label>所属银行：</label>
      <span>{{ staffMes.unitName }}</span>
    </div>
    <div class="main-item">
      <label>上级银行：</label>
      <span>{{ staffMes.parentUnitName }}</span>
    </div>
    <div class="main-item">
      <label>岗位：</label>
      <span>{{ staffMes.jobTitle }}</span>
    </div>
    <div class="main-item">
      <label>状态：</label>
      <span>{{ staffMes.statusName }}</span>
    </div>
    <!-- <div class="main-item">
      <label>角色权限：</label>
      <span>{{ staffMes.roleName }}</span>
    </div> -->
    <div class="main-item">
      <label>功能权限：</label>
      <span>
        <el-radio-group v-model="staffMes.unitPermission" disabled>
          <el-radio :label="true">查看网点信息</el-radio>
          <el-radio :label="false">可以发布任务</el-radio>
        </el-radio-group>
      </span>
    </div>
    <div class="main-item">
      <label>用户默认密码为：</label>
      <span>yh123456</span>
    </div>
    <div style="text-align: center" @click="to_cancel()">
      <el-button>关闭</el-button>
    </div>
  </div>
</template>
<script>
import { getDetailById } from "@/api/bankers/staff.js";
export default {
  data() {
    return {
      staffMes: [],
      userId: undefined,
    };
  },
  created() {
    this.userId = this.$route.query.userId;
    this.getDetailById();
  },
  methods: {
    // 查看详情
    getDetailById() {
      getDetailById(this.userId).then((res) => {
        this.staffMes = res.data.data;
      });
    },
    //去关闭
    to_cancel() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped lang="scss">
.main-item {
  margin-bottom: 20px;
  font-size: 14px;
}
</style>
