<template>
  <dv-border-box-13 class="home-right-area-bg">
    <div class="home-right-area-content">
      <div class="home-right-area-title">
        <dv-decoration-7
          :color="['#0470a8', '#0470a8']"
          style="width: 300px; height: 30px"
        >
          今日商圈数据
        </dv-decoration-7>
      </div>
      <div class="home-right-area-main">
        <div
          v-for="(item, index) in areaArrs"
          :key="index"
        >
          <dv-border-box-8>
            <div class="home-right-area-item">
              <div class="area-item-left">
                <div class="item-left-image">
                  <img :src="item.businessImg" fit="cover" />
                </div>
                <div class="item-left-name">{{ item.businessName }}</div>
              </div>
              <div class="area-item-right">
                <div class="right-item">
                  <div>用户总数</div>
                  <span>{{ item.userNum }}</span>
                </div>
                <div class="right-item right-item-name">
                  <div>创客总数</div>
                  <span>{{ item.distributorNum }}</span>
                </div>
                <div class="right-item">
                  <div>商户总数</div>
                  <span>{{ item.storeNum }}</span>
                </div>
              </div>
            </div>
            
          </dv-border-box-8>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </dv-border-box-13>
</template>

<script>
import { getGovTotalBusiness } from '@/api/home/wel'
export default {
  data() {
    return {
      areaArrs: [],
      endId: 1,
      lessTimer: null
    }
  },
  mounted() {
    const _this = this
    if (this.areaArrs.length < 6) {
      _this.lessTimer = setInterval(() => {
        this.initVistor()
      }, 3000)
      _this.animate = true
      clearInterval(_this.timer)
    }
  },
  created() {
    this.initVistor()
  },
  beforeDestroy() {
    clearInterval(this.lessTimer)
  },
  methods: {
    initVistor() {
      const _this = this
      getGovTotalBusiness().then((res) => {
        const response = res.data.data
        for (let index = 0; index < response.length; index++) {
          const element = response[index]
          _this.areaArrs.splice(index, 1, element)
          if (index > _this.areaArrs.length - 1) {
            _this.areaArrs.push(response[index])
          } else {
            _this.areaArrs.splice(index, 1, element)
          }
        }
        if (response.length > 5) {
          _this.timer = setInterval(() => {
            _this.switchLists()
            _this.endId++
          }, 3000)
          // _this.animate = false
          clearInterval(_this.lessTimer)
        }
      })
    },
    switchLists() {
      const array = this.areaArrs
      array.push(array[0])
      array.shift()
      this.areaArrs = array
      if (this.endId === this.areaArrs.length) {
        // 循环结束之后加载一次后台数据
        this.endId = 1
        clearInterval(this.timer)
        this.initVistor()
      }
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.home-right-area-bg {
  width: 100%;
  height: 890px;
  .home-right-area-content {
    width: 94%;
    height: 94%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 20px;
    .home-right-area-title {
      font-size: 26px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #00f2f1;
      line-height: 30px;
      margin: 37px 0px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .home-right-area-main {
      flex-direction: column;
      width: 94%;
      align-items: center;
      height: 500px;
      overflow: hidden;
      padding: 10px 0px;
      .home-right-area-item {
        width: 100%;
        height: 140px;
        display: flex;
        flex-direction: row;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        position: relative;
      }
    }
  }
}

.area-item-left {
 display: flex;
 flex-direction: column;
 justify-content: center;
 /* margin-right: 25px; */
 align-items: center;
 width: 50%;
}
.item-left-image {
  width:150px; 
  height:80px;
}
.item-left-image img {
  width:150px; 
  height:80px;
}
.item-left-name {
  font-size: 16px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #FFFFFF;
  margin-top: 6px;
  text-align: center;
}
.area-item-right {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #FFE685;
  height: 100px;
  border-left: 1px dotted #6076AD;
  padding-left: 46px;
  width: 50%;
}
.area-item-right .right-item:nth-of-type(2) {
  margin: 14px 0px;
}
.right-item div {
  color: #69FFFF;
  width: 150px;
}
.right-item {
  display: flex;
}
</style>
