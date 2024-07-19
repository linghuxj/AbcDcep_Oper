<template>
  <div>
    <div class="title">公会信息</div>
    <div class="profit-content">
      <div class="profit-content-top">
        <div class="profit-item">
          <div class="profit-item-title">今日收益(人民币)</div>
          <div class="profit-item-num">
            <span class="green-text"
              >{{
                unionDetail.todayProfit ? unionDetail.todayProfit : 0
              }}元</span
            >
          </div>
        </div>
        <div class="profit-item">
          <div class="profit-item-title">昨日收益(人民币)</div>
          <div class="profit-item-num">
            <span class="green-text"
              >{{
                unionDetail.yesterdayProfit ? unionDetail.yesterdayProfit : 0
              }}元</span
            >
          </div>
        </div>
        <div class="profit-item">
          <div class="profit-item-title">本月收益/总收益(人民币)</div>
          <div class="profit-item-num">
            <span class="green-text"
              >{{
                unionDetail.monthProfit ? unionDetail.monthProfit : 0
              }}元</span
            >
            <span class="blue-text"
              >{{
                unionDetail.totalProfit ? unionDetail.totalProfit : 0
              }}元</span
            >
          </div>
        </div>
      </div>
      <div class="profit-content-top">
        <div class="profit-item">
          <div class="profit-item-title">今日收益(米粒)</div>
          <div class="profit-item-num">
            <span class="blue-text">{{
              unionDetail.todayIntegral ? unionDetail.todayIntegral : 0
            }}</span>
          </div>
        </div>
        <div class="profit-item">
          <div class="profit-item-title">昨日收益(米粒)</div>
          <div class="profit-item-num">
            <span class="blue-text">{{
              unionDetail.yesterdayIntegral ? unionDetail.yesterdayIntegral : 0
            }}</span>
          </div>
        </div>
        <div class="profit-item">
          <div class="profit-item-title">本月收益/总收益(米粒)</div>
          <div class="profit-item-num">
            <span class="green-text">{{
              unionDetail.monthIntegral ? unionDetail.monthIntegral : 0
            }}</span>
            <span class="blue-text">{{
              unionDetail.totalIntegral ? unionDetail.totalIntegral : 0
            }}</span>
          </div>
        </div>
      </div>
      <!-- <div class="profit-item">
        <div class="profit-item-title">本月完成率/总完成率</div>
        <div class="profit-item-num">
          <span class="green-text">11</span>
          <span class="blue-text">11</span>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
import {
  reqUserUnionPage,
  reqUnionDetail,
  reqStatusPage,
  updateUnion,
} from "@/api/guild/list";
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
      userUnionList: [],
      unionDetail: {},
      statusList: [],
      unionId: null,
    };
  },
  created() {
    this.unionId = this.$route.query.unionId;
    this._getUnionDetail();
  },
  methods: {
    // 取消
    to_cancel() {
      this.$router.go(-1);
    },
    //获取详情
    _getUnionDetail() {
      reqUnionDetail(this.unionId).then((res) => {
        this.unionDetail = res.data.data;
        // this.form.tel = res.data.data.leaderUser.mobile;
        // this.form.leader = res.data.data.leaderUser.userId;
        // this.form.unionName = res.data.data.unionName;
        // this.form.status = res.data.data.status;
        // this.form.needAudit = res.data.data.needAudit;
        // this.form.unionLogo = res.data.data.unionLogo;
        // this.$refs.upload_logo.loadImg(res.data.data.unionLogo);
        // 处理地址
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
  flex-direction: column;
  max-width: 1000px;
}
.profit-content-top {
  display: flex;
  justify-content: space-between;
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
