<template>
  <div>
    <div v-if="false" class="home">
      <format-time />
      <!-- 数据看板主视图区 -->
      <div class="home-content">
        <el-row>
          <!-- 左侧 -->
          <el-col :span="8">
            <!-- 总况 -->
            <general-situation />
            <!-- 用户漏斗 -->
            <funnel-transformation />
          </el-col>
          <!-- 中间 -->
          <el-col :span="8">
            <!-- 地图数据 -->
            <area-map />
            <!-- 中下 -->
            <dv-border-box-12 class="home-center-bottom-bg">
              <div class="home-center-count">
                <circular-distribution />
                <line-marker />
              </div>
            </dv-border-box-12>
          </el-col>
          <!-- 右侧 -->
          <el-col :span="8">
            <!-- 今日商圈 -->
            <business-district />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GeneralSituation from './components/GeneralSituation.vue'
import FunnelTransformation from './components/FunnelTransformation.vue'
import CircularDistribution from './components/CircularDistribution.vue'
import LineMarker from './components/LineMarker.vue'
import FormatTime from './components/FormatTime.vue'
import BusinessDistrict from './components/BusinessDistrict.vue'
import AreaMap from './components/AreaMap.vue'

export default {
  name: 'Wel',
  components: {
    GeneralSituation,
    FunnelTransformation,
    CircularDistribution,
    LineMarker,
    FormatTime,
    BusinessDistrict,
    AreaMap
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      DATA: [],
      text: '',
      actor: '',
      count: 0,
      isText: false
    }
  },
  computed: {
    ...mapGetters(['website'])
  },
  methods: {
    getData() {
      if (this.count < this.DATA.length - 1) {
        this.count++
      } else {
        this.count = 0
      }
      this.isText = true
      this.actor = this.DATA[this.count]
    },
    setData() {
      let num = 0
      let count = 0
      let active = false
      const timeoutstart = 5000
      const timeoutend = 1000
      const timespeed = 10
      setInterval(() => {
        if (this.isText) {
          if (count === this.actor.length) {
            active = true
          } else {
            active = false
          }
          if (active) {
            num--
            this.text = this.actor.substr(0, num)
            if (num === 0) {
              this.isText = false
              setTimeout(() => {
                count = 0
                this.getData()
              }, timeoutend)
            }
          } else {
            num++
            this.text = this.actor.substr(0, num)
            if (num === this.actor.length) {
              this.isText = false
              setTimeout(() => {
                this.isText = true
                count = this.actor.length
              }, timeoutstart)
            }
          }
        }
      }, timespeed)
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.wel-contailer {
  position: relative;
}

.banner-text {
  position: relative;
  padding: 0 20px;
  font-size: 20px;
  text-align: center;
}

.banner-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  display: none;
}

.actor {
  height: 250px;
  overflow: hidden;
  font-size: 18px;
  color: #333;
}

.actor:after {
  content: '';
  width: 3px;
  height: 25px;
  vertical-align: -5px;
  margin-left: 5px;
  background-color: #333;
  display: inline-block;
  animation: blink 0.4s infinite alternate;
}

.typeing:after {
  animation: none;
}

@keyframes blink {
  to {
    opacity: 0;
  }
}

.home {
  width: 100%;
  // height: 100%;
  background-image: url('../assets/bg_bot.png');
  // background-size: 100% 100%;
  background-color: #333;
}

.vistor {
  width: 96%;
  height: 252px;
}
.host-body {
  width: 100%;
  display: flex;
  justify-content: center;
}
.host-body-content {
  width: 100%;
  display: flex;
  margin-top: 20px;
}
.host-body-main {
  display: flex;
  align-items: center;
  width: 40%;
  justify-content: space-around;
  margin-top: 10px;
}
.title {
  position: relative;
  width: 300px;
  text-align: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.home-center-bottom-bg {
  width: 100%;
  height: 505px;
  .home-center-count {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
  }
}
</style>
