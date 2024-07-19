<!-- 米粒提现设置 -->
<!-- @author：yangjq -->
<!-- @date：2022-02-17 -->
<template>
  <div class="main-content">
    <div class="set-content">
      <aside>提现设置</aside>
      <div class="set-nav">
        <el-checkbox v-model="confForm.auditStatus"> 提现需审核 </el-checkbox>
        <span class="set-tip">
          勾选后，商户提交提现申请需要在审核后，提现金额才会到账。
        </span>
      </div>
      <div class="set-nav">
        <span class="set-nav-tips">*</span>
        <span>每周累计提现次数不超过</span>
        <el-input
          v-model.number="confForm.numPerWeek"
          min="0"
          style="width: 120px"
        >
          <template slot="append"> 次</template>
        </el-input>
        <span class="set-tip"
          >提现失败不计数(不填表示不限制(-1)，最高值不限制)</span
        >
      </div>
      <aside>金额设置</aside>
      <div class="set-nav">
        <span class="set-nav-tips">*</span>
        <span>最小提现金额：</span>
        <el-input
          v-model="confForm.minAmount"
          min="0.00"
          style="width: 200px"
          @input="
            confForm.minAmount = asynchronousValidation(confForm.minAmount)
          "
        >
          <template slot="append">米粒</template>
        </el-input>
      </div>
      <div class="set-nav">
        <span class="set-nav-tips">*</span>
        <span>最大提现金额：</span>
        <el-input
          v-model="confForm.maxAmount"
          min="0.00"
          style="width: 200px"
          @input="
            confForm.maxAmount = asynchronousValidation(confForm.maxAmount)
          "
        >
          <template slot="append">米粒</template>
        </el-input>
      </div>
      <aside>手续费设置</aside>
      <div class="set-nav">
        <span class="set-nav-tips">*</span>
        <span>提现手续费：</span>
        <el-radio-group
          v-model="confForm.commissionType"
          @change="commissionType"
        >
          <el-radio label="ratio">
            <span>比例收费 每一笔扣</span>
            <el-input
              v-model="confForm.commissionRatio"
              :disabled="confForm.commissionType === 'fixed'"
              min="0.00"
              @input="
                confForm.commissionRatio = asynchronousValidation(
                  confForm.commissionRatio
                )
              "
              style="width: 200px"
            >
              <template slot="append">%</template>
            </el-input>
          </el-radio>
          <el-radio label="fixed">
            <span>固定收费</span>
            <el-input
              v-model="confForm.commissionFixed"
              min="0.00"
              :disabled="confForm.commissionType === 'ratio'"
              @input="
                confForm.commissionFixed = asynchronousValidation(
                  confForm.commissionFixed
                )
              "
              style="width: 200px"
            >
              <template slot="append">米粒</template>
            </el-input>
            <span class="set-tip"> 设为0，则不扣除手续费 </span>
          </el-radio>
        </el-radio-group>
      </div>

      <aside>提现规则设置</aside>
      <div class="set-nav">
        <el-input
          v-model="confForm.rule"
          type="textarea"
          autosize
          placeholder="请输入内容"
          maxlength="500"
          show-word-limit
        >
        </el-input>
      </div>
      <div class="set-nav">
        <el-button type="primary" :loading="loading" @click="onSubmit"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfStore, updateConf } from '@/api/finance/store-set'

export default {
  data() {
    return {
      confForm: {
        auditStatus: 0,
        commissionFixed: 0,
        commissionRatio: 0,
        commissionType: '',
        maxAmount: 0,
        minAmount: 0,
        numPerWeek: 0,
        rule: undefined
      },
      loading: false,
      radio: 3
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      // 保证金提现设置
      this.getBondConf()
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null
      return e
    },
    // 查询米粒基本配置信息
    getBondConf() {
      getConfStore().then(response => {
        const res = response.data.data
        res.auditStatus = res.auditStatus === 1 ? true : false
        if (res.commissionType === 'fixed') {
          res.commissionRatio = undefined
        } else if (res.commissionType === 'ratio') {
          res.commissionFixed = undefined
        }
        this.confForm = res
        console.debug('this.conForm', this.confForm)
      })
    },
    // 提现手续费变化时
    commissionType(val) {
      if (val === 'fixed') {
        this.confForm.commissionFixed = undefined
        this.confForm.commissionRatio = undefined
      } else if (val === 'ratio') {
        this.confForm.commissionRatio = undefined
        this.confForm.commissionFixed = undefined
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    // 提交
    onSubmit() {
      if (!this.confForm.numPerWeek) {
        this.$message.error('提现次数不能为0，必须正整数!')
        return false
      }

      if (!this.confForm.minAmount && this.confForm.minAmount !== 0) {
        this.$message.error('最小提现金额不能为空!')
        return false
      }
      if (!this.confForm.maxAmount) {
        this.$message.error('最大提现金额不能为空!')
        return false
      }

      if (Number(this.confForm.maxAmount) < Number(this.confForm.minAmount)) {
        this.$message.error('最大提现金额不能小于最小提现金额!')
        return false
      }

      if (this.confForm.commissionType === 'fixed') {
        if (!this.confForm.commissionFixed) {
          this.$message.error('固定收费不能为空!')
          return false
        }
      } else if (this.confForm.commissionType === 'ratio') {
        if (this.confForm.commissionFixed >= 100) {
          this.$message.error('比例收费不能大于等于100!')
          return false
        }
      } else {
        this.$message.error('请选择提现手续费的类型!')
        return false
      }
      console.debug('his.confForm.maxAmount,', this.confForm.maxAmount)
      const parameter = {
        auditStatus: this.confForm.auditStatus ? 1 : 0,
        commissionFixed: this.confForm.commissionFixed
          ? this.confForm.commissionFixed
          : 0,
        commissionRatio: this.confForm.commissionRatio
          ? this.confForm.commissionRatio
          : 0,
        commissionType: this.confForm.commissionType,
        maxAmount: this.confForm.maxAmount,
        minAmount: this.confForm.minAmount,
        numPerWeek: this.confForm.numPerWeek,
        rule: this.confForm.rule
      }
      this.loading = true
      updateConf(parameter)
        .then(() => {
          this.$message({
            type: 'success',
            message: '提交保存！'
          })
          this.loading = false
          this.getBondConf()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-radio {
  width: -webkit-fill-available;
  margin: 10px auto;
}
.main-content {
  aside {
    background: #eef1f6;
    padding: 8px 24px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .set-content {
    .set-nav {
      margin: 10px 24px 20px;
      .set-nav-tips {
        color: red;
      }
    }
    .set-tip {
      margin: 10px 24px 20px;
      font-size: 14px;
      color: #c0c4cc;
    }
  }
}
</style>
