<template>
  <dv-border-box-12 class="general-situation">
    <div class="home-left-count">
      <div class="home-left-count-title">
        <dv-decoration-7
          :color="['#0470a8', '#0470a8']"
          style="width:150px;height:5px;font-size:26px;margin:10px"
          class="title-item"
        >&nbsp;总况&nbsp;</dv-decoration-7
        >
      </div>
      <div class="home-left-count-main">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="item-text">
              今日+
              <label>
                {{ newArrivalsToday }}
              </label>
            </div>
            <div class="item-image">
              <dv-decoration-9
                :color="['#55f2f6', '#55f2f6']"
                class="dv-decoration-link"
              >
                {{ subscribes }}
              </dv-decoration-9>
            </div>
            <div class="item-label1">预约申请总人数</div>
          </el-col>
          <el-col :span="8">
            <div class="item-text2">
              今日+
              <label>
                {{ newMerchantsToday }}
              </label>
            </div>
            <div class="item-image2">
              <dv-decoration-9
                :color="['#ffd42b', '#ffd42b']"
                class="dv-decoration-link"
              >
                {{ merchants }}
              </dv-decoration-9>
            </div>
            <div class="item-label2">签约商户总数</div>
          </el-col>
          <el-col :span="8">
            <div class="item-text3">
              今日+
              <label>
                {{ newmakersToday }}
              </label>
            </div>
            <div class="item-image3">
              <dv-decoration-9
                :color="['#008aff', '#008aff']"
                class="dv-decoration-link"
              >
                {{ makers }}
              </dv-decoration-9>
            </div>
            <div class="item-label3">创客认证总人数</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </dv-border-box-12>
</template>

<script>
import { getGovTotalCase } from '@/api/home/wel'
export default {
  data() {
    return {

      // 预约今日新增人数
      newArrivalsToday: 0,
      // 预约总人数
      subscribes: 0,
      // 商户今日新增人数
      newMerchantsToday: 0,
      // 商户今日新增人数
      merchants: 0,
      // 创客今日新增人数
      newmakersToday: 0,
      // 创客今日新增人数
      makers: 0,

      // 定时器
      timer: null
    }
  },
  mounted() {
    this.changeTiming()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    changeTiming() {
      this.timer = setInterval(() => {
        this.changeNumber()
      }, 3000)
    },
    changeNumber() {
      const _this = this
      getGovTotalCase().then(res => {
        const response = res.data.data
        _this.newArrivalsToday = response.reservaTodayNum
        _this.subscribes = response.reservaNum
        _this.newMerchantsToday = response.storeTodayNum
        _this.merchants = response.storeNum
        _this.newmakersToday = response.authTodayNum
        _this.makers = response.authNum
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.general-situation {
  width: 100%;
  height: 385px;
  .home-left-count {
    width:100%;
    height: 385px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    .home-left-count-title {
      font-size: 26px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #00F2F1;
      line-height: 31px;
      margin-top: 39px;
      text-align: center;
      font-size: 14px;
    }
    .home-left-count-main {
      display: flex;
      margin: 0px 16px;
      margin-top: 40px;
      text-align: center;
      .dv-decoration-link {
        width:145px;
        height:145px;
      }
      .item-text {
        color: #69FFFF;
      }
      .item-text2 {
        color: #FFE685;
      }
      .item-text3 {
        color: #71BDFE;
      }

      .item-image{
        margin-top: 10px;
        font-size: 25px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #69FFFF;
      }

      .item-image2{
        margin-top: 10px;
        font-size: 25px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFE685;
      }
      .item-image3{
        margin-top: 10px;
        font-size: 25px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #71BDFE;
      }

      .item-label1{
        margin-top: 10px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #69FFFF;
      }

      .item-label2{
        margin-top: 10px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #FFE685;
      }
      .item-label3{
        margin-top: 10px;
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #71BDFE;
      }

    }
  }
}
</style>
