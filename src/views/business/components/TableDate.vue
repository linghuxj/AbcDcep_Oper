<template>
  <div>
    <div class="title">
      <div>经营数据</div>
      <div class="date">
        <el-date-picker
          v-model="datePicker"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="dayDateOption"
          @change="selectDatePicker">
        </el-date-picker>
      </div>
    </div>
    <div class="main-date">
      <div class="main-item">
        <div>实收全额</div>
        <div>￥{{ baseData.payAmount }}</div>
      </div>
      <div class="main-item">
        <div>订单数</div>
        <div>{{ baseData.payOrderNum }}</div>
      </div>
      <div class="main-item">
        <div>支付人数</div>
        <div>{{ baseData.payUserNum }}</div>
      </div>
      <div class="main-item">
        <div>客单价(元)</div>
        <div>￥{{ baseData.customerUnitPrice }}</div>
      </div>
      <div class="main-item">
        <div>退款金额(元)</div>
        <div>￥{{ baseData.refundAmount }}</div>
      </div>
    </div> 
  </div>
</template>
<script>
import { getBaseData } from '@/api/store/store'
// import ElQuarterPicker from '@/components/Quarter/Quarter-Picker'

export default {
  // components: { ElQuarterPicker },
  data() {
    return {
      //表示参数类
      parameter: {
        startTime: undefined,
        endTime: undefined,
        storeId: undefined
      },
      // 操作类型
      interactive: {
        tableLoading: false
      },
      dateStatus: undefined,
      value1: undefined,
      baseData: {},
      dateArr: [
        { name: '日', value: 1 },
        { name: '周', value: 2 },
        { name: '月', value: 3 },
        { name: '季度', value: 4 }
      ],
      datePicker: '',
      // 日
      dayDateOption: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  
  created() {
    if (this.$route.query.storeId) {
      this.parameter.storeId = this.$route.query.storeId
      this.$nextTick(() => {
        this.getBaseData()
      })
    }
  },
  methods: {
    getValue(res) {
      console.log(res)
    },
    getBaseData() {
      const listQuery = Object.assign({}, this.parameter)
      getBaseData(listQuery).then(res => {
        console.debug('res', res)
        this.baseData = res.data.data
      })
    },
    // 日期选择事件
    selectDatePicker(val) {
      const [startTime, endTime] = val 
      const params = {
        startTime,
        endTime
      }
      const listQuery = Object.assign({}, this.parameter, params)
      getBaseData(listQuery).then(res => {
        this.baseData = res.data.data
      })
    }
  }
}
</script>
<style scoped>
.store-search {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
.el-input-group{
  width: 260px;
}
/* .el-input__inner {
  width: 100px;
} */
.title {
  display: flex;
  justify-content: space-between;
  background-color: #d3d3d3;
  padding: 5px;
}
.title div:nth-of-type(1){
  margin-left: 10px;
}
.title div:nth-of-type(2){
  margin-right: 10px;
}
.main-date {
 display: flex;
 color: #333;
 width: 70%;
 justify-content: space-between;
 margin-top: 10px;
}

</style>
