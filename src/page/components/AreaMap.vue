<template>
  <dv-border-box-12 class="home-center-top-bg">
    <div class="home-left-count">
      <div class="home-center-map-title">累计开通数字人民币用户</div>
      <div class="home-center-map-num">
        <div v-for="item in lists" :key="item" class="main-item">
          {{ item }}
        </div>
      </div>
      <div class="num-add">
        <div>
          昨日新增
          <span>{{ totals }}</span>
        </div>
        <div>
          环比增长
          <span>{{ proportion }}</span>
        </div>
      </div>
      <div class="home-center-map-main">
        <div id="map" ref="mapCharts" class="bm-view"></div>
      </div>
    </div>
  </dv-border-box-12>
</template>

<script>
import { getGovOpenDcep, getGovTotalArea } from '@/api/home/wel'
import echarts from 'echarts'
const OPTIONS = require('../config/options')
import ct_full from '../echarts/hunanchangsha'

export default {
  data() {
    return {
      // 定时器
      timer: null,
      BMap: null,
      mapInstance: null,
      center: '长沙',
      zoom: 11,
      mapStyle: {
        style: 'midnight'
      },
      lists: [],
      totals: null,
      proportion: null,
      mapChart: '',
      mapLists: [
        {
          name: '芙蓉区',
          value: '430102',
          distributorNum: 1,
          storeNum: 1,
          userNum: 1
        },
        {
          name: '天心区',
          value: '430103',
          distributorNum: 2,
          storeNum: 2,
          userNum: 2
        },
        {
          name: '岳麓区',
          value: '430104',
          distributorNum: 3,
          storeNum: 3,
          userNum: 3
        },
        {
          name: '开福区',
          value: '430105',
          distributorNum: 4,
          storeNum: 4,
          userNum: 4
        },
        {
          name: '雨花区',
          value: '430111',
          distributorNum: 5,
          storeNum: 5,
          userNum: 5
        },
        {
          name: '望城区',
          value: '430112',
          distributorNum: 6,
          storeNum: 6,
          userNum: 6
        },
        {
          name: '长沙县',
          value: '430121',
          distributorNum: 7,
          storeNum: 7,
          userNum: 7
        },
        {
          name: '宁乡市',
          value: '430182',
          distributorNum: 8,
          storeNum: 8,
          userNum: 8
        },
        {
          name: '浏阳市',
          value: '430181',
          distributorNum: 9,
          storeNum: 9,
          userNum: 9
        }
      ]
    }
  },
  // 监控数据变化，更新图表
  watch: {
    mapLists: {
      handler(options) {
        // 设置true清空echart缓存
        this.$nextTick(() => {
          // 修改之后
          setTimeout(() => {
            this.mapChart.setOption(OPTIONS.areaMap(options), true)
          }, 1)
        })
        // 重新选择区域
        this.handleMapRandomSelect()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getGovTotalAreaByCode()
  },
  mounted() {
    this.changeNumber()
    this.initMap()
    this.timer = setInterval(() => {
      this.getGovTotalAreaByCode()
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    changeNumber() {
      // 数字转数组
      const converToArray = (number) =>
        [...`${number}`].map((el) => parseInt(el))
      const _this = this
      getGovOpenDcep().then((res) => {
        const response = res.data.data
        _this.lists = converToArray(response.totalNum)
        _this.totals = response.yesterdayNum
        _this.proportion = response.chainRatio
      })
    },
    initMap() {
      // 初始化echart
      this.mapChart = echarts.init(document.getElementById('map'))
      echarts.registerMap('CS', ct_full, {})
      this.mapChart.setOption(OPTIONS.areaMap(this.mapLists), true)
    },
    // 获取地区信息
    getGovTotalAreaByCode() {
      const _this = this
      getGovTotalArea().then((res) => {
        const response = res.data.data
        _this.mapLists = response
      })
    },
    // 开启定时器
    startInterval() {
      const _self = this
      // 应通过接口获取配置时间，暂时写死5s
      const time = 3000
      if (_self.intervalId !== null) {
        clearInterval(_self.intervalId)
      }
      _self.intervalId = setInterval(() => {
        _self.reSelectMapRandomArea()
      }, time)
    },
    // 重新随机选中地图区域
    reSelectMapRandomArea() {
      const length = 9
      const _this = this
      _this.$nextTick(() => {
        const map = _this.mapChart
        let index = Math.floor(Math.random() * length)
        while (index === _this.preSelectMapIndex || index >= length) {
          index = Math.floor(Math.random() * length)
        }
        map.dispatchAction({
          type: 'mapUnSelect',
          seriesIndex: 0,
          dataIndex: _this.preSelectMapIndex
        })
        map.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index
        })
        map.dispatchAction({
          type: 'mapSelect',
          seriesIndex: 0,
          dataIndex: index
        })
        _this.preSelectMapIndex = index
      })
    },
    handleMapRandomSelect() {
      const _this = this
      _this.$nextTick(() => {
        const map = _this.mapChart
        const _self = this
        setTimeout(() => {
          _self.reSelectMapRandomArea()
        }, 0)
        // 移入区域，清除定时器、取消之前选中并选中当前
        map.on('mouseover', function(params) {
          clearInterval(_self.intervalId)
          map.dispatchAction({
            type: 'mapUnSelect',
            seriesIndex: 0,
            dataIndex: _self.preSelectMapIndex
          })
          map.dispatchAction({
            type: 'mapSelect',
            seriesIndex: 0,
            dataIndex: params.dataIndex
          })
          _self.preSelectMapIndex = params.dataIndex
        })
        // 移出区域重新随机选中地图区域，并开启定时器
        map.on('globalout', function() {
          _self.reSelectMapRandomArea()
          _self.startInterval()
        })
        _this.startInterval()
      })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.home-center-top-bg {
  width: 100%;
  height: 385px;
  .home-left-count {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    .home-center-map-title {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      margin-top: 20px;
    }
    .home-center-map-num {
      display: flex;
      justify-content: center;
      margin: 10px 0px;
      .main-item {
        width: 30px;
        height: 35px;
        background-image: url("../../../src/assets/1.png");
        background-size: 100% 100%;
        font-size: 28px;
        font-family: Digiface;
        font-weight: bold;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0px 3px;
      }
    }
    .num-add {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      display: flex;
      justify-content: center;
    }

    .num-add span {
      margin-left: 10px;
    }
    .num-add div:nth-of-type(2) {
      margin-left: 10px;
    }
    .home-center-map-main {
      width: 100%;
      height: 215px;
      .bm-view {
        width: 100%;
        height: 215px;
      }
    }
  }
}
</style>
