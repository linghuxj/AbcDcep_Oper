<template>
  <dv-border-box-12 class="home-left-bottom-bg">
    <div class="home-left-count-title">
      <dv-decoration-7
        :color="['#0470a8', '#0470a8']"
        style="font-size:26px;margin:10px"
      >创客用户转化漏斗</dv-decoration-7
      >
    </div>
    <div class="home-left-user-main">
      <div id="funnel" class="funnel"></div>
    </div>
  </dv-border-box-12>
  
</template>

<script>
import echarts from 'echarts'
const OPTIONS = require('../config/options')

import { getGovBecome } from '@/api/home/wel'
export default {
  data() {
    return {
      funnelChart: null,
      funnelData: [
        { value: 0, name: '注册创客人数' },
        { value: 0, name: '创客认证人数' },
        { value: 0, name: '参与任务人数' }
      ],
      timer: null
    }
  },
  // 监控数据变化，更新图表
  watch: {
    funnelData: {
      handler(options) {
        // 设置true清空echart缓存
        this.funnelChart.setOption(OPTIONS.funnel(options), true)
      },
      deep: true
    }
  },
  mounted() {
    const _this = this
    _this.initChart()
    _this.timer = setInterval(() => {
      _this.initFunnel()
    }, 3000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    initChart() {
      // 初始化echart
      this.funnelChart = echarts.init(document.getElementById('funnel'))
      this.funnelChart.setOption(OPTIONS.funnel(this.funnelData), true)
    },
    initFunnel() {
      const _this = this
      getGovBecome().then(res => {
        const response = res.data.data
        _this.funnelData = [
          { value: response.registerDistributorNum, name: '创客注册人数' },
          { value: response.authDistributorNum, name: '创客认证人数' },
          { value: response.takePartTaskNum, name: '参与任务人数' }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-left-bottom-bg {
  width: 100%;
  height: 465px;
  padding: 20px 0;
  .home-left-count-title {
    font-size: 26px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #00F2F1;
    line-height: 31px;
    text-align: center;
    font-size: 14px;
  }
}

.home-left-user-main {
  width: 100%;
  height: 425px;
  .funnel {
    width: 100%;
    height: 100%;
  }
}
</style>
