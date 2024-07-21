<template>
  <div class="wel-contailer">
    <el-card class="statistic">
      <h2 class="title1">基本信息</h2>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="statistic-card">
            <el-statistic :value="data1[0]" group-separator=",">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  商户总数
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="statistic-card">
            <el-statistic :value="data1[1]" group-separator=",">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  小微商户数量
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="statistic-card">
            <el-statistic :value="data1[2]" group-separator=",">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  普通商户数
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="statistic-card">
            <el-statistic :value="data1[3]" group-separator=",">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  创客数
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="statistic">
      <h2 class="title1">今日待办</h2>
      <el-row :gutter="12">
        <el-col :span="4">
          <div class="statistic-card">
            <el-statistic :value="data2[0]" group-separator=",">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  待巡检
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statistic-card">
            <el-statistic :value="data2[1]" group-separator=",">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  待审核商户
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statistic-card">
            <el-statistic :value="data2[2]" group-separator=",">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  待审核投诉
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statistic-card" group-separator=",">
            <el-statistic :value="data2[3]">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  待审核售后
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statistic-card">
            <el-statistic :value="data2[4]" group-separator="," :precision="2">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  待审核分销提现
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="statistic-card" group-separator=",">
            <el-statistic :value="data2[5]">
              <template #title>
                <div style="display: inline-flex; align-items: center">
                  待审核分账
                </div>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div class="chart1">
      <div id="lineMarker" class="line-marker"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import echarts from "echarts";
import NProgress from 'nprogress'

export default {
  name: "Wel",
  data() {
    return {
      activeNames: ["1", "2", "3", "4"],
      DATA: [],
      text: "",
      actor: "",
      count: 0,
      isText: false,
      lineChart: null,
      options: null,
      data1: [0, 0, 0, 0],
      data2: [0, 0, 0, 0, 0, 0],
    };
  },
  computed: {
    ...mapGetters(["website"]),
  },
  mounted() {
    const _this = this;
    _this.initChart();
    setTimeout(() => {
      this.options.series[0].data = [
        6351482.33, 5981245.1, 5712264.21, 4256887.23, 6741123.22, 5488791.45,
        7326407.36,
      ];
      this.lineChart.setOption(this.options, true);
      this.data1 = [736718, 129324, 607394, 35146];
      this.data2 = [42905, 37, 0, 0, 135982.0, 0];
    }, Math.floor(Math.random() * (4000 - 2500 + 1)) + 2500);
  },
  methods: {
    getData() {
      if (this.count < this.DATA.length - 1) {
        this.count++;
      } else {
        this.count = 0;
      }
      this.isText = true;
      this.actor = this.DATA[this.count];
    },
    setData() {
      let num = 0;
      let count = 0;
      let active = false;
      const timeoutstart = 5000;
      const timeoutend = 1000;
      const timespeed = 10;
      setInterval(() => {
        if (this.isText) {
          if (count === this.actor.length) {
            active = true;
          } else {
            active = false;
          }
          if (active) {
            num--;
            this.text = this.actor.substr(0, num);
            if (num === 0) {
              this.isText = false;
              setTimeout(() => {
                count = 0;
                this.getData();
              }, timeoutend);
            }
          } else {
            num++;
            this.text = this.actor.substr(0, num);
            if (num === this.actor.length) {
              this.isText = false;
              setTimeout(() => {
                this.isText = true;
                count = this.actor.length;
              }, timeoutstart);
            }
          }
        }
      }, timespeed);
    },
    initChart() {
      const line = document.getElementById("lineMarker");
      // 初始化echart
      this.lineChart = echarts.init(document.getElementById("lineMarker"));
      this.options = {
        title: {
          text: "交易趋势",
          textStyle: {
            fontSize: 16,
          },
        },
        xAxis: {
          type: "category",
          data: ["07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21"],
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            smooth: true,
            type: "line",
            label: {
              show: true,
            },
          },
        ],
      };
      this.lineChart.setOption(this.options, true);
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
.wel-contailer {
  position: relative;
}
:global(h2#card-usage ~) {
  background-color: var(--el-fill-color) !important;
}

.statistic {
  margin: 20px 32px;
}

.statistic2 {
  margin: 20px 32px;
  height: auto;
}

.title1 {
  font-size: 16px;
  color: var(--el-text-color-regular);
}

.content2 {
  font-size: 24px;
  color: rgb(200, 0, 125);
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: rgb(225, 225, 225);
}

.chart1 {
  width: auto;
  margin: 20px 32px;
  height: 285px;
  background-color: white;
  .line-marker {
    padding: 24px 12px;
    width: 100%;
    height: 100%;
  }
}
</style>
