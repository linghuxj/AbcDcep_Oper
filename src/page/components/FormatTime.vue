<template>
  <div class="formatTime">
    <div class="home-left-time">{{ date }} {{ week }}</div>
    <!-- <div class="home-right-screen">
      <img v-if="fullscreen" :src="signUrl" @click="screen" />
      <img v-else :src="screenUrl" @click="screen" />
    </div> -->
  </div>
</template>

<script>
// 使用日期工具类
import { format, DATE_TIME_FMT, getWeekDayChinese } from '@/util/date'
export default {
  data() {
    return {
      date: null,
      week: null,
      // screenUrl: screenUrl,
      // signUrl: signUrl,
      fullscreen: false
    }
  },
  mounted() {
    this.timeFn()
  },
  methods: {
    press(e) {
      console.log('e', e)
    },
    timeFn() {
      setInterval(() => {
        this.date = format(new Date(), DATE_TIME_FMT)
        this.week = getWeekDayChinese()
      }, 1000)
    },
    screen() {
      const element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.formatTime {
  display: flex;
  justify-content: space-between;
  .home-left-time {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #00deff;
    line-height: 24px;
    height: 24px;
    margin-left: 20px;
  }
}
</style>
