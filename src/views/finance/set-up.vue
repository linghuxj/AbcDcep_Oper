<template>
  <div class="main-content set-content">
    <el-form
      :inline="true"
      :model="parameterForm"
      :rules="rules"
      ref="parameterForm"
      class="demo-form-inline"
      label-width="120px"
    >
      <div class="typeTitle">渠道维护</div>
      <el-form-item style="width: 45%" label="结算渠道：" prop="payChannelType">
        <el-select
          v-model="parameterForm.payChannelType"
          placeholder="请选择结算渠道"
        >
          <el-option
            v-for="item in payTypes"
            :key="item.dictValue"
            :label="item.dictName"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        style="width: 50%"
        label="打款服务费："
        prop="payServiceFeeRatio"
      >
        <el-input v-model.number.trim="parameterForm.payServiceFeeRatio">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div v-if="permissions.finance_conf" class="set-nav">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfWallet, updateWallet, getpayTypes } from '@/api/finance/set'
import { findTag } from '@/util/deltag'

export default {
  name: 'SetUp',
  data() {
    return {
      rules: {
        payChannelType: [
          { required: true, message: '请选择结算渠道', trigger: 'change' }
        ],
        payServiceFeeRatio: [
          {
            required: true,
            message: '请输入服务费比例',
            trigger: 'blur'
          }
        ]
      },
      parameterForm: {
        // 结算渠道类型
        payChannelType: '',
        // 结算渠道服务费比例
        payServiceFeeRatio: 0
      },
      payTypes: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      this.getTaskConf()
      getpayTypes().then(res => {
        this.payTypes = res.data.data
        console.log(res, 123)
      })
    })
  },
  methods: {
    // 取消
    cancel() {
      this.$router.go(-1)
    },
    // 查询基本配置信息
    getTaskConf() {
      getConfWallet().then(response => {
        const parameter = response.data.data
        this.parameterForm = {
          payChannelType: parameter.payChannelType,
          payServiceFeeRatio: parameter.payServiceFeeRatio || 0
        }
      })
    },
    // 提交
    onSubmit() {
      updateWallet(this.parameterForm).then(() => {
        this.$message({
          type: 'success',
          message: '提交保存！'
        })
        setTimeout(() => {
          let value = this.$route.fullPath

          let { tag } = findTag(value)

          this.$store.commit('DEL_TAG', tag)
          this.$router.go(-1)
        }, 100)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.set-content {
  box-sizing: border-box;
  position: relative;
  padding-bottom: 55px;
  border-radius: 0 0 8px 8px;
  div {
    box-sizing: border-box;
  }
  .typeTitle {
    background: #eef1f6;
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .set-nav {
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 1px;
    width: 100%;
    height: 50px;
    line-height: 46px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    .el-button {
      width: 100px;
      height: 36px;
      padding: 0;
    }
  }
}
</style>
