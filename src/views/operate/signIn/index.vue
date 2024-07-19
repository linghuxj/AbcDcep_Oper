<template>
  <div class="giftBox">
    <!-- 表单 -->
    <!-- 表格 分页 -->
    <div class="giftContent">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="签到统计" name="normal">
          <div class="aside-tips">
            <p>数据概览</p>
          </div>
          <el-row type="flex" :gutter="20">
            <el-col :span="16">
              <div id="echarts" :style="{height:height,width:width}" />
            </el-col>
            <el-col :span="8">
              <div class="ele-col-nav">
                <div class="ele-col-item">总签到用户数 10010</div>
                <div class="ele-col-item">总签到用户数 10010</div>
                <div class="ele-col-item">总签到用户数 10010</div>
              </div>
            </el-col>
          </el-row>
          <div class="aside-tips">
            <p>周期数据</p>
          </div>
          <!-- 表格 -->
          <el-table
            v-loading="listLoading"
            border
            :empty-text="$t('message.table_empty_text')"
            :data="list"
          >
            <el-table-column label="周期" prop="giftIcon">
              <template slot-scope="scope">
                <el-image fit="scale-down" :src="scope.row.giftIcon" alt="icon" />
              </template>
            </el-table-column>
            <el-table-column prop="giftName" label="签到总次数"></el-table-column>
            <el-table-column prop="giftPrice" label="签到用户数"></el-table-column>
            <el-table-column prop="exchangeTypeName" label="新签到用户数"></el-table-column>
            <el-table-column prop="updateTime" label="新签到用户占比">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime | ndateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="statusName" label="奖励发放情况">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.statusName }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <!-- <el-pagination -->
          <!-- background -->
          <!-- @size-change="handleSizeChange" -->
          <!-- @current-change="handleCurrentChange" -->
          <!-- @prev-click="handleCurrentChange" -->
          <!-- @next-click="handleCurrentChange" -->
          <!-- :current-page="pagination.current" -->
          <!-- :page-sizes="pagination.pageSize" -->
          <!-- :page-size="pagination.size" -->
          <!-- layout="sizes, prev, pager, next" -->
          <!-- :total="pagination.total" -->
          <!-- ></el-pagination> -->
        </el-tab-pane>
        <!-- 禁用按钮 -->
        <el-tab-pane label="签到设置" name="disabled">
          <el-table
            v-loading="listLoading"
            :empty-text="$t('message.table_empty_text')"
            border
            :data="list"
          >
            <el-table-column
              fixed="left"
              type="index"
              :index="1"
              :label="$t('message.serial_number')"
            ></el-table-column>

            <el-table-column :label="$t('feed.gift.picture')" prop="giftIcon">
              <template slot-scope="scope">
                <el-image fit="scale-down" :src="scope.row.giftIcon" alt="icon" />
              </template>
            </el-table-column>
            <el-table-column prop="giftName" :label="$t('feed.gift.name')"></el-table-column>
            <el-table-column prop="giftPrice" :label="$t('feed.gift.change_amount')"></el-table-column>
            <!-- <el-table-column
              prop="exchangeType"
              :label="$t('feed.gift.ways_convert')"
            ></el-table-column>-->
            <el-table-column prop="createTime" :label="$t('feed.gift.create_time')">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | ndateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" :label="$t('feed.gift.modification_time')">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime | ndateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createBy" :label="$t('feed.gift.operator')"></el-table-column>
            <el-table-column :label="$t('message.operate')" width="180" fixed="right">
              <template slot-scope="scope">
                <el-button
                  v-if="permissions.reward_gift_edit"
                  type="text"
                  size="mini"
                  @click="handleView(scope.row)"
                >{{ $t("feed.gift.modification") }}</el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="handleTrans(scope.row)"
                >{{ $t("system.dict.trans") }}</el-button>
                <el-button
                  v-if="permissions.reward_gift_edit"
                  type="text"
                  size="mini"
                  @click="handleStatus(scope.row)"
                >{{ $t("message.status") }}</el-button>
                <el-button
                  v-if="permissions.reward_gift_del"
                  type="text"
                  size="mini"
                  @click="handleDelete(scope.row)"
                >{{ $t("message.delete") }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <!-- <el-pagination -->
          <!-- background -->
          <!-- @size-change="handleSizeChange" -->
          <!-- @current-change="handleCurrentChange" -->
          <!-- :current-page="pagination.current" -->
          <!-- :page-sizes="pagination.pageSize" -->
          <!-- :page-size="pagination.size" -->
          <!-- layout="total, sizes, prev, pager, next, jumper" -->
          <!-- :total="pagination.total" -->
          <!-- ></el-pagination> -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //页面数组
        pageSize: [5, 10, 15, 20],
        //总条数
        total: 0
      },
      list: [], //表格数据
      listLoading: false,
      activeName: 'normal', //导航选项卡默认选择
      xExpectedData: [
        '01/01',
        '01/02',
        '01/03',
        '01/04',
        '01/01',
        '01/05',
        '01/06'
      ],
      yExpectedData: [820, 932, 9010, 5934, 111290, 130030, 1320],
      chart: null
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.$nextTick(() => {
      this.chart = echarts.init(document.getElementById('echarts'))
      this.setOptions()
    })
  },
  methods: {
    setOptions() {
      this.chart.setOption({
        title: {
          text: '总签到用户数',
          left: 'center'
        },
        xAxis: {
          data: this.xExpectedData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 30,
          bottom: 20,
          top: 50,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          name: '人数',
          type: 'value',
          axisTick: {
            show: false
          }
        },
        // legend: {
        // data: ['expected'],
        // },
        series: [
          {
            name: '签到总人数',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: this.yExpectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    }
  }
}
</script>

<style scoped lang="scss">
.giftBox {
  width: 100%;
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  //表单内容
  .giftContent {
    .el-tabs.el-tabs--card.el-tabs--top {
      margin-top: 20px;
      .el-tabs__item.is-top {
        padding: 0 50px;
        font-size: 16px;
        color: #606266;
      }
    }
    .ele-col-nav {
      width: 100%;
      height: 100%;
      padding: 30px;
      box-sizing: border-box;
      background-color: #f2f2f2;
      .ele-col-item{
        height: 80px;
        line-height: 80px;
      }
    }
  }
}
</style>
