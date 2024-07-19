<template>
  <div>
    <el-form
      ref="turnForm"
      :model="turnForm"
      :rules="turnRules"
      label-width="150px"
      class="demo-form"
    >
      <el-form-item label="活动名称：" prop="lotteryName">
        <el-input
          v-model="turnForm.lotteryName"
          style="width: 500px"
          placeholder="请输入活动名称"
          maxlength="15"
        ></el-input>
      </el-form-item>

      <el-form-item label="活动时间：" required>
        <el-col style="width: 230px" :span="3">
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="turnForm.startTime"
              type="datetime"
              placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerOptionsStart"
              :default-time="pickerTimeStart()"
            />
          </el-form-item>
        </el-col>
        <el-col style="width: 40px; text-align: center" :span="1">至</el-col>
        <el-col style="width: 230px" :span="3">
          <el-form-item prop="endTime">
            <el-date-picker
              v-model="turnForm.endTime"
              type="datetime"
              placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerOptionsEnd"
              default-time="23:59:59"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="参与人设置：" prop="partUserType">
        <el-radio-group v-model="turnForm.partUserType">
          <el-radio v-for="(item,index) in setPersonArr" :key="index" :label="item.dictValue">{{ item.dictName }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动类型：" prop="lotteryType">
        <el-radio-group v-model="turnForm.lotteryType">
          <el-radio label="free">免费抽奖</el-radio>
          <el-radio label="integral">米粒抽奖
            <el-form-item label="消耗米粒数：" prop="integral">
              <el-input v-model="turnForm.integral" style="width: 100px" :disabled="turnForm.lotteryType!='integral'" />米粒
            </el-form-item>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="参与次数：" prop="partNumType">
        <el-radio-group v-model="turnForm.partNumType">
          <el-radio label="day">一天N次 每人每天可抽 
            <el-form-item label="参与次数：" prop="dayPartNum">
              <el-input v-model="turnForm.dayPartNum" style="width: 100px" maxlength="10" :disabled="turnForm.partNumType!='day'" /> 次
            </el-form-item>
          </el-radio> 
          <el-radio label="person">一人N次 每人一共可抽 
            <el-form-item label="参与次数：" prop="countPartNum">
              <el-input v-model="turnForm.countPartNum" style="width: 100px" maxlength="10" :disabled="turnForm.partNumType!='person'" /> 次
            </el-form-item>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动规则：" prop="lotteryDesc">
        <el-input
          v-model="turnForm.lotteryDesc"
          type="textarea"
          :rows="2"
          placeholder="请输入活动规则"
          style="width: 500px"
          maxlength="1000"
        ></el-input>
      </el-form-item>
    </el-form>
    <div style="width:100%;text-align:center">
      <div>
        <el-button style="margin-top: 12px;" @click="to_cancel()">取消</el-button>
        <el-button style="margin-top: 12px;" type="primary" @click="to_next()">下一步</el-button>
      </div>
    </div> 
  </div>
</template>
<script>
import { getHour, getMinute, getSecond } from '@/util/date'
import { getTypeList, getLotteryMesById } from '@/api/operate/lottery.js'
export default {
  data() {
    var dayPartNum = (rule, value, callback) => {
      if (this.turnForm.partNumType === 'day') {
        if (!value) {
          callback('请输入每人每天输入次数')
        }
        callback()
      } else {
        callback()
      }
    }
    var countPartNum = (rule, value, callback) => {
      if (this.turnForm.partNumType === 'person') {
        if (!value) {
          callback('请输入每人每天总共输入次数')
        }
        callback()
      } else {
        callback()
      }
    }
    var integral = (rule, value, callback) => {
      if (this.turnForm.lotteryType === 'integral') {
        if (!value) {
          callback('请输入米粒抽奖消耗米粒数')
        }
        callback()
      } else {
        callback()
      }
    }
    return {
      // 开始时间
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.turnForm.endTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          } else {
            return time.getTime() < new Date(new Date().toLocaleDateString())
          }
        }
      },
      // 结束时间
      pickerOptionsEnd: {
        disabledDate: time => {
          const beginDateVal = this.turnForm.startTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()
          } else {
            return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          }
        }
      },
      // 可设置人群
      setPersonArr: [],
      //  抽奖活动信息
      turnForm: {
        lotteryName: undefined,
        lotteryDesc: undefined,
        startTime: undefined,
        endTime: undefined,
        partUserType: undefined,
        lotteryType: undefined, //(免费抽奖:free、米粒抽奖:integral)
        integral: undefined, //米粒消耗数
        partNumType: undefined, //(每人每天:day、每人一共:person)
        partNum: undefined,
        dayPartNum: undefined, //每人每天可抽
        countPartNum: undefined //每人总共可抽
      },
      turnRules: {
        lotteryName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        partUserType: [
          { required: true, message: '请选择参与人设置', trigger: 'change' }
        ],
        lotteryType: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        integral: [
          { required: true, validator: integral, trigger: 'blur' }
        ],
        partNumType: [
          { required: true, message: '请选择参与次数', trigger: 'change' }
        ],
        dayPartNum: [
          {
            required: true, validator: dayPartNum, trigger: 'blur'
          }
        ],
        countPartNum: [
          {
            required: true, validator: countPartNum, trigger: 'blur'
          }
        ],
        lotteryDesc: [
          { required: true, message: '请输入活动规则', trigger: 'blur' }
        ],
        lotteryId: undefined //抽奖ID
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.lotteryId = this.$route.params.id
      this.$nextTick(() => {
        this.getLotteryMesById(this.lotteryId)
      })
    }
    this.getTypeList()
  },
  methods: {
    // 去取消
    to_cancel() {
      this.$router.go(-1)
    },
    to_next() {
      // if (this.active === 1) {
      console.debug('valid--', this.$refs.turnForm)
      this.$refs.turnForm.validate((valid) => {
        if (valid) {
          this.turnForm.partNum = parseInt(this.turnForm.partNumType === 'day' ? this.turnForm.dayPartNum : this.turnForm.countPartNum) 
          this.$emit('func', this.turnForm)
        } else {
          return false
        }
      })
      // }  
    },
    //获取可设置人群
    getTypeList() {
      getTypeList().then(res => {
        this.setPersonArr = res.data.data
      })
    }, 
    // 根据Id查询抽奖活动信息
    getLotteryMesById(lotteryId) {
      getLotteryMesById(lotteryId).then(res => {
        const turnForm = res.data.data
        if (turnForm.partNumType === 'day') {
          turnForm.dayPartNum = turnForm.partNum
          this.turnForm = turnForm
        } else {
          turnForm.countPartNum = turnForm.partNum
          this.turnForm = turnForm
        }
      })
    },
    // 时间
    pickerTimeStart() {
      const time = getHour() + ':' + getMinute() + ':' + getSecond()
      return time
    }
  }
}
</script>
<style scoped lang="scss">
.el-radio-group {
  .el-radio {
    display: table;
    margin-top:5px ;
  }
}
</style>
