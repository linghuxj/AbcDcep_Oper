<template>
  <div class="main-content">
    <div class="title">会员信息</div>
    <div class="profit-content">
      <div class="profit-item">
        <div class="profit-item-title">今日收益(人民币)</div>
        <div class="profit-item-num">
          <span class="green-text"
            >{{
              memberDetail.todayProfit ? memberDetail.todayProfit : 0
            }}元</span
          >
        </div>
      </div>
      <div class="profit-item">
        <div class="profit-item-title">昨日收益(人民币)</div>
        <div class="profit-item-num">
          <span class="green-text"
            >{{
              memberDetail.yesterdayProfit ? memberDetail.yesterdayProfit : 0
            }}元</span
          >
        </div>
      </div>
      <div class="profit-item">
        <div class="profit-item-title">本月收益/总收益(人民币)</div>
        <div class="profit-item-num">
          <span class="green-text"
            >{{
              memberDetail.monthProfit ? memberDetail.monthProfit : 0
            }}元</span
          >
          <span class="blue-text"
            >{{
              memberDetail.totalProfit ? memberDetail.totalProfit : 0
            }}元</span
          >
        </div>
      </div>
      <!-- <div class="profit-item">
        <div class="profit-item-title">本月领取量/领取任务总量(人民币)</div>
        <div class="profit-item-num">
          <span class="green-text">{{ memberDetail }}元</span>
          <span class="blue-text">{{ memberDetail }}元</span>
        </div>
      </div> -->
      <div class="profit-item">
        <div class="profit-item-title">今日收益(米粒)</div>
        <div class="profit-item-num">
          <span class="blue-text">{{
            memberDetail.todayIntegral ? memberDetail.todayIntegral : 0
          }}</span>
        </div>
      </div>
      <div class="profit-item">
        <div class="profit-item-title">昨日收益</div>
        <div class="profit-item-num">
          <span class="blue-text">{{
            memberDetail.yesterdayIntegral ? memberDetail.yesterdayIntegral : 0
          }}</span>
        </div>
      </div>
      <div class="profit-item">
        <div class="profit-item-title">本月收益/总收益(米粒)</div>
        <div class="profit-item-num">
          <span class="green-text">{{
            memberDetail.monthIntegral ? memberDetail.monthIntegral : 0
          }}</span>
          <span class="blue-text">{{
            memberDetail.totalIntegral ? memberDetail.totalIntegral : 0
          }}</span>
        </div>
      </div>
      <!-- <div class="profit-item">
        <div class="profit-item-title">本月完成率/总完成率</div>
        <div class="profit-item-num">
          <span class="green-text">{{ memberDetail }}</span>
          <span class="blue-text">{{ memberDetail }}</span>
        </div>
      </div> -->
    </div>
    <!-- 表单 -->
    <el-form :model="form" label-width="100px" ref="form">
      <el-form-item label="用户昵称：">
        <el-input
          placeholder="请输入用户昵称"
          style="width: 50%"
          v-model="form.userName"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户手机号：">
        <el-input
          placeholder="请输入手机号"
          v-model="form.mobile"
          :disabled="true"
          style="width: 50%"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务范围：" prop="location">
        <div>
          <el-cascader
            ref="cascader"
            v-model="form.location"
            placeholder="请选择省/市/县区"
            clearable
            style="width: 50%"
            :props="locationNameList"
            :disabled="true"
          ></el-cascader>
        </div>
      </el-form-item>
      <el-form-item label="入会时间：">
        <el-input
          v-model="memberDetail.createTime"
          :disabled="true"
          style="width: 50%"
        ></el-input>
      </el-form-item>
      <el-form-item label="会员状态：">
        <el-select v-model="memberDetail.status">
          <el-option
            v-for="(type, index) in memberStatus"
            :key="index"
            :label="type.dictName"
            :value="type.dictValue"
            :disabled="true"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="form-btn">
      <el-button
        type="danger"
        @click="to_move()"
        v-if="memberDetail.status != 'del'"
        >移除公会</el-button
      >
    </div>
  </div>
</template>
<script>
import {
  reqMemberByUserId,
  reqMemberStatus,
  delMemberUnion,
} from "@/api/guild/detail";
import { getUsersbyMobile } from "@/api/user/user";
// 引入地区查询接口
import { areas } from "@/api/area";
export default {
  data() {
    return {
      // 省市区联动
      locationNameList: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data;
              const nodes = Array.from(areaList).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 2,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      memberDetail: {},
      memberStatus: [],
      userId: null,
      userIds: [],
      form: {
        userName: null,
        location: null,
        mobile: null,
        createTime: null,
        status: null,
      },
    };
  },
  created() {
    this.userId = this.$route.params.id;
    this.unionId = this.$route.query.unionId;
    this._getMemberDetail();
    this._getMemberStatus();
  },
  methods: {
    // 取消
    to_cancel() {
      this.$router.go(-1);
    },
    //获取详情
    _getMemberDetail() {
      reqMemberByUserId(this.userId).then((res) => {
        this.memberDetail = res.data.data;
        this.form.userName = res.data.data.user.username;
        this.form.mobile = res.data.data.user.mobile;
        this.form.location = res.data.data.serviceArea.location
          .split(",")
          .map(Number);
      });
    },
    // 公会成员状态字典
    _getMemberStatus() {
      reqMemberStatus().then((res) => {
        console.debug("res", res);
        this.memberStatus = res.data.data;
      });
    },
    to_move() {
      this.userIds.push(this.userId);
      this._getDelMember();
    },
    // 移除
    _getDelMember() {
      let data = {
        unionId: this.unionId,
        userIds: this.userIds,
      };
      delMemberUnion(data).then(() => {
        this.$message({
          type: "success",
          message: "确定移除成功!",
        });
        this.$router.go(-1);
      });
    },
  },
};
</script>
<style scoped>
.title {
  font-weight: bold;
  font-size: 20px;
}
.profit-content {
  display: flex;
  flex-wrap: wrap;
}
.profit-item {
  width: 220px;
  height: 80px;
  margin: 10px;
  background-color: #fff;
  box-shadow: 12px 12px 20px 12px rgba(232, 232, 232, 0.5);
  border-radius: 8px;
}
.profit-item-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.profit-item-num {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.blue-text {
  font-size: 16px;
  font-weight: bold;
  color: #3399ff;
  margin: 0px 20px;
}
.green-text {
  font-size: 16px;
  font-weight: bold;
  color: #1abc9c;
  margin: 0px 20px;
}
.form-btn {
  width: 100%;
  text-align: center;
}
</style>
