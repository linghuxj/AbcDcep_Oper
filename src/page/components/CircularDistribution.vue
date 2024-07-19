<template>
  <div class="home-center-sex">
    <dv-border-box-8 class="home-center-sex-bg">
      <div id="gender" class="gender"></div>
    </dv-border-box-8>
  </div>
</template>

<script>
import echarts from 'echarts'
const OPTIONS = require('../config/options')

import { getGovSexRatios } from '@/api/home/wel'

export default {
  data() {
    return {
      genderChart: null,
      genderData: [
        { value: 0, name: '男' },
        { value: 0, name: '女' },
        { value: 0, name: '不限' }
      ],
      timer: null
    }
  },
  // 监控数据变化，更新图表
  watch: {
    genderData: {
      handler(options) {
        // 设置true清空echart缓存
        this.genderChart.setOption(OPTIONS.genderAge(options), true)
      },
      deep: true
    }
  },
  mounted() {
    const _this = this
    _this.initChart()
    this.timer = setInterval(() => {
      _this.initGender()
    }, 3000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    initGender() {
      const _this = this
      getGovSexRatios().then(res => {
        const response = res.data.data
        _this.genderData = [
          { value: response.maleNum, name: '男' },
          { value: response.femaleNum, name: '女' },
          { value: response.secretNum, name: '不限' }
        ]
      })
    },
    initChart() {
      // 初始化echart
      this.genderChart = echarts.init(document.getElementById('gender'))
      this.genderChart.setOption(OPTIONS.genderAge(this.genderData), true)
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.home-center-sex {
  margin-top: 10px;
  width: 96%;
  height: 225px;
  .home-center-sex-bg {
    padding: 10px;
    box-sizing: border-box;
    .gender {
      width: 96%;
      height: 100%;
    }
  }
}

</style>
