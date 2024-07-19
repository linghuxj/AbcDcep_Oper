<template>
  <div class="home-center-visit">
    <dv-border-box-8 class="home-center-visit-bg">
      <div id="lineMarker" class="line-marker"></div>
    </dv-border-box-8>
  </div>
</template>

<script>
import echarts from 'echarts'
const OPTIONS = require('../config/options')
import { getGovTotalHourUvs } from '@/api/home/wel'

export default {
  // components: {
  //   LineMarker
  // },
  data() {
    return {
      lineChart: null,
      yAxisLists: [],
      timer: null
    }
  },
  // 监控数据变化，更新图表
  watch: {
    yAxisLists: {
      handler(options) {
        // 设置true清空echart缓存
        this.lineChart.setOption(OPTIONS.vistor(options), true)
      },
      deep: true
    }
  },
  mounted() {
    const _this = this
    _this.initChart()
    _this.timer = setInterval(() => {
      _this.initVistor()
    }, 3000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    initVistor() {
      const _this = this
      _this.yAxisLists = []
      // for (let index = 0; index < 24; index++) {
      //   _this.yAxisLists.push(this.initChartCeil())
      // }
      getGovTotalHourUvs().then((response) => {
        _this.funnelData = response.data.data
      })
    },
    initChart() {
      // 初始化echart
      this.lineChart = echarts.init(document.getElementById('lineMarker'))
      this.lineChart.setOption(OPTIONS.vistor(this.yAxisLists), true)
    }
    // 随机数
    // initChartCeil() {
    //   return Math.ceil(Math.random() * 1000)
    // }
  }
}
</script>

<style scoped="scoped" lang="scss">
.home-center-visit {
  width: 96%;
  height: 245px;
  .home-center-visit-bg {
    padding: 10px;
    box-sizing: border-box;
    .line-marker {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
