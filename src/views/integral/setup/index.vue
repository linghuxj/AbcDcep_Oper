<template>
  <div class="main-content">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="米粒基本设置" name="first">
        <div class="set-content">
          <aside>
            消费类米粒上限
            <span class="set-aside-switch">
              <el-switch
                v-model="firstForm.expenditureGetUpStatus"
                active-value="normal"
                inactive-value="disabled"
                active-text="开启"
                inactive-text="关闭"
              >
              </el-switch>
            </span>
          </aside>
          <div class="set-nav">
            <span>每个用户每天通过消费最多获取：</span>
            <el-input
              v-model="firstForm.expenditureGetUp"
              min="0.00"
              :disabled="firstForm.expenditureGetUpStatus === 'disabled'"
              style="width: 200px"
              @input="
                firstForm.expenditureGetUp = asynchronousValidation(
                  firstForm.expenditureGetUp
                )
              "
            />
            <span class="nav-item-label-right"> 米粒</span>
          </div>
          <div class="set-tip">仅针对每成功购买商品所赠送的米粒有效</div>
        </div>
        <div class="set-content">
          <aside>
            行为类米粒上限
            <span class="set-aside-switch">
              <el-switch
                v-model="firstForm.behaviorGetUpStatus"
                active-value="normal"
                inactive-value="disabled"
                active-text="开启"
                inactive-text="关闭"
              >
              </el-switch>
            </span>
          </aside>
          <div class="set-nav">
            <span>每个用户每天通过用户行为最多获取：</span>
            <el-input
              v-model="firstForm.behaviorGetUp"
              min="0.00"
              :disabled="firstForm.behaviorGetUpStatus === 'disabled'"
              style="width: 200px"
              @input="
                firstForm.behaviorGetUp = asynchronousValidation(
                  firstForm.behaviorGetUp
                )
              "
            />
            <span class="nav-item-label-right"> 米粒</span>
          </div>
          <div class="set-tip">仅针对每成功购买商品所赠送的米粒有效</div>
        </div>
        <div class="bottom-btn" style="text-align: center">
          <el-button type="primary" size="medium" @click="cancel"
            >取消</el-button
          >
          <el-button
            type="warning"
            size="medium"
            :disabled="loading"
            :loading="loading"
            @click="conserve"
            >保存</el-button
          >
        </div>
      </el-tab-pane>
      <el-tab-pane label="米粒生成" name="second">
        <div class="set-content">
          <aside>消费送米粒</aside>
          <div class="set-nav">
            <span>实付金额返米粒：</span>
            <el-radio-group v-model="secondForm.payAmountRebateType">
              <el-radio label="fixed">
                <span class="set-item-label-left">定额 购买一件商品返</span>
                <el-input
                  v-model="secondForm.payAmountRebateFixed"
                  min="0.00"
                  :disabled="secondForm.payAmountRebateType !== 'fixed'"
                  style="width: 200px"
                  @input="
                    secondForm.payAmountRebateFixed = asynchronousValidation(
                      secondForm.payAmountRebateFixed
                    )
                  "
                >
                  <span slot="suffix" class="el-input__icon">米粒</span>
                </el-input>
              </el-radio>
              <el-radio label="ratio">
                <span class="set-item-label-left">比例 返商品售价的</span>
                <el-input
                  v-model="secondForm.payAmountRebateRatio"
                  min="0.00"
                  :disabled="secondForm.payAmountRebateType !== 'ratio'"
                  style="width: 200px"
                  @input="
                    secondForm.payAmountRebateRatio = asynchronousValidation(
                      secondForm.payAmountRebateRatio
                    )
                  "
                >
                  <span slot="suffix" class="el-input__icon">%</span>
                </el-input>
              </el-radio>
            </el-radio-group>
          </div>
          <div class="set-nav">
            <span>实付米粒返米粒：</span>
            <el-radio-group v-model="secondForm.payIntegralRebateType">
              <el-radio label="fixed">
                <span class="set-item-label-left">定额 购买一件商品返</span>
                <el-input
                  v-model="secondForm.payIntegralRebateFixed"
                  min="0.00"
                  :disabled="secondForm.payIntegralRebateType !== 'fixed'"
                  style="width: 200px"
                  @input="
                    secondForm.payIntegralRebateFixed = asynchronousValidation(
                      secondForm.payIntegralRebateFixed
                    )
                  "
                >
                  <span slot="suffix" class="el-input__icon">米粒</span>
                </el-input>
              </el-radio>
              <el-radio label="ratio">
                <span class="set-item-label-left">比例 返商品售价的</span>
                <el-input
                  v-model="secondForm.payIntegralRebateRatio"
                  min="0.00"
                  :disabled="secondForm.payIntegralRebateType !== 'ratio'"
                  style="width: 200px"
                  @input="
                    secondForm.payIntegralRebateRatio = asynchronousValidation(
                      secondForm.payIntegralRebateRatio
                    )
                  "
                >
                  <span slot="suffix" class="el-input__icon">%</span>
                </el-input>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="set-content">
          <aside>完成任务送米粒</aside>
          <div class="set-nav">
            <span>做任务返米粒：</span>
            <el-radio-group v-model="secondForm.taskRebateType">
              <el-radio label="fixed">
                <span class="set-item-label-left">定额 做任务返</span>
                <el-input
                  v-model="secondForm.taskRebateFixed"
                  min="0.00"
                  :disabled="secondForm.taskRebateType !== 'fixed'"
                  style="width: 200px"
                  @input="
                    secondForm.taskRebateFixed = asynchronousValidation(
                      secondForm.taskRebateFixed
                    )
                  "
                >
                  <span slot="suffix" class="el-input__icon">米粒</span>
                </el-input>
              </el-radio>
              <el-radio label="ratio">
                <span class="set-item-label-left">比例 返实际收益的</span>
                <el-input
                  v-model="secondForm.taskRebateRatio"
                  min="0.00"
                  :disabled="secondForm.taskRebateType !== 'ratio'"
                  style="width: 200px"
                  @input="
                    secondForm.taskRebateRatio = asynchronousValidation(
                      secondForm.taskRebateRatio
                    )
                  "
                >
                  <span slot="suffix" class="el-input__icon">%</span>
                </el-input>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="set-content">
          <aside>会员额外米粒</aside>
          <div class="set-nav">
            <span>会员返米粒规则：</span>
            <el-radio-group v-model="secondForm.vipPayRebateType">
              <el-radio label="fixed">
                <span class="set-item-label-left">定额 购买一件商品返</span>
                <el-input
                  v-model="secondForm.vipPayRebateFixed"
                  min="0.00"
                  :disabled="secondForm.vipPayRebateType !== 'fixed'"
                  style="width: 200px"
                  @input="
                    secondForm.vipPayRebateFixed = asynchronousValidation(
                      secondForm.vipPayRebateFixed
                    )
                  "
                >
                  <span slot="suffix" class="el-input__icon">米粒</span>
                </el-input>
              </el-radio>
              <el-radio label="ratio">
                <span class="set-item-label-left">比例 返商品售价的</span>
                <el-input
                  v-model="secondForm.vipPayRebateRatio"
                  min="0.00"
                  :disabled="secondForm.vipPayRebateType !== 'ratio'"
                  style="width: 200px"
                  @input="
                    secondForm.vipPayRebateRatio = asynchronousValidation(
                      secondForm.vipPayRebateRatio
                    )
                  "
                >
                  <span slot="suffix" class="el-input__icon">%</span>
                </el-input>
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="bottom-btn" style="text-align: center">
          <el-button type="primary" size="medium" @click="cancel"
            >取消</el-button
          >
          <el-button
            v-if="permissions.integral_conf"
            type="warning"
            size="medium"
            :disabled="loading"
            :loading="loading"
            @click="conserveConf"
            >保存</el-button
          >
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getIntegralConf,
  upIntegral,
  upIntegralGenerateConf
} from '@/api/integral/index'
import { mapGetters } from 'vuex'

export default {
  name: 'SetUp',
  data() {
    return {
      activeName: 'first',
      input: undefined,
      radio: 3,
      value: '',
      loading: false,
      firstForm: {
        // 行为类米粒获取上限
        behaviorGetUp: undefined,
        // 行为类米粒获取上限状态 启用：normal、禁用：disabled
        behaviorGetUpStatus: undefined,
        // 消费类米粒获取上限
        expenditureGetUp: undefined,
        // 消费类米粒获取上限状态 启用：normal、禁用：disabled
        expenditureGetUpStatus: undefined
      },
      secondForm: {
        // 消费类米粒获取上限状态 启用：normal、禁用：disabled
        payAmountRebateType: undefined,
        // 实付金额返米粒-定额
        payAmountRebateFixed: undefined,
        // 实付金额返米粒-比例
        payAmountRebateRatio: undefined,
        // 实付米粒返米粒-当前使用类型(定额：fixed、比例：ratio)
        payIntegralRebateType: undefined,
        // 实付米粒返米粒-定额
        payIntegralRebateFixed: undefined,
        // 实付米粒返米粒-比例
        payIntegralRebateRatio: undefined,
        // 完成任务返米粒-当前使用类型(定额：fixed、比例：ratio)
        taskRebateType: undefined,
        // 完成任务返米粒-定额
        taskRebateFixed: undefined,
        // 完成任务返米粒-比例
        taskRebateRatio: undefined,
        // 会员额外返米粒-当前使用类型(定额：fixed、比例：ratio)
        vipPayRebateType: undefined,
        // 会员额外返米粒-定额
        vipPayRebateFixed: undefined,
        // 会员额外返米粒-比例
        vipPayRebateRatio: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      this.getIntegralConf()
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null
      return e
    },
    cancel() {
      this.getIntegralConf()
    },
    conserve() {
      this.loading = true
      upIntegral(this.firstForm)
        .then(() => {
          this.loading = false
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    conserveConf() {
      this.loading = true
      upIntegralGenerateConf(this.secondForm)
        .then(() => {
          this.loading = false
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 查询基本配置信息
    getIntegralConf() {
      getIntegralConf().then(response => {
        const confForm = response.data.data
        this.firstForm = {
          behaviorGetUp: confForm.behaviorGetUp,
          behaviorGetUpStatus: confForm.behaviorGetUpStatus,
          expenditureGetUp: confForm.expenditureGetUp,
          expenditureGetUpStatus: confForm.expenditureGetUpStatus
        }
        this.secondForm = {
          payAmountRebateType: confForm.payAmountRebateType,
          payAmountRebateFixed: confForm.payAmountRebateFixed,
          payAmountRebateRatio: confForm.payAmountRebateRatio,
          payIntegralRebateType: confForm.payIntegralRebateType,
          payIntegralRebateFixed: confForm.payIntegralRebateFixed,
          payIntegralRebateRatio: confForm.payIntegralRebateRatio,
          taskRebateType: confForm.taskRebateType,
          taskRebateFixed: confForm.taskRebateFixed,
          taskRebateRatio: confForm.taskRebateRatio,
          vipPayRebateType: confForm.vipPayRebateType,
          vipPayRebateFixed: confForm.vipPayRebateFixed,
          vipPayRebateRatio: confForm.vipPayRebateRatio
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
    width: 100%;
    border: 1px solid #eef1f6;
    .set-nav {
      margin: 10px 24px 20px;
    }
    .set-aside-switch {
      position: absolute;
      right: 20px;
    }
    .set-tip {
      margin: 10px 24px 20px;
      font-size: 14px;
      color: #c0c4cc;
    }
  }
  .bottom-btn {
    width: 100%;
    margin-top: 50px;
  }
}
.nav-item-label-right {
  margin-left: 8px;
  font-size: 14px;
}
.set-item-label-left {
  margin-right: 8px;
  font-size: 14px;
}
</style>
