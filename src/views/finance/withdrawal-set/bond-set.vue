<template>
  <div class="main-content">
    <div class="set-content">
      <aside>提现设置</aside>
      <div class="set-nav">
        <el-checkbox v-model="confForm.taskSuretyWithdrawAuditStatus"
          >提现需审核</el-checkbox
        >
        <span class="set-tip"
          >勾选后，创客提交提现申请需要在审核后，提现金额才会到账。</span
        >
      </div>
      <div class="set-nav">
        <span class="set-nav-tips">*</span>
        <span>当日累计提现次数不超过</span>
        <el-input
          v-model.number="confForm.taskSuretyWithdrawNumPerDay"
          min="0"
          style="width: 120px"
        >
          <template slot="append"> 次</template>
        </el-input>
      </div>
      <aside>金额设置</aside>
      <div class="set-nav">
        <span class="set-nav-tips">*</span>
        <span>最小提现金额：</span>
        <el-input
          v-model="confForm.taskSuretyWithdrawMinAmount"
          min="0.00"
          style="width: 200px"
          @input="
            confForm.taskSuretyWithdrawMinAmount = asynchronousValidation(
              confForm.taskSuretyWithdrawMinAmount
            )
          "
        >
          <template slot="append">元</template>
        </el-input>
      </div>
      <div class="set-nav">
        <span class="set-nav-tips">*</span>
        <span>最大提现金额：</span>
        <el-input
          v-model="confForm.taskSuretyWithdrawMaxAmount"
          min="0.00"
          style="width: 200px"
          @input="
            confForm.taskSuretyWithdrawMaxAmount = asynchronousValidation(
              confForm.taskSuretyWithdrawMaxAmount
            )
          "
        >
          <template slot="append">元</template>
        </el-input>
      </div>
      <aside>手续费设置</aside>
      <div class="set-nav">
        <span class="set-nav-tips">*</span>
        <span>提现手续费：</span>
        <el-radio-group
          v-model="confForm.taskSuretyWithdrawCommissionStatus"
          @change="commissionStatus"
        >
          <el-radio label="ratio">
            <span>比例收费 每一笔扣</span>
            <el-input
              v-model="confForm.taskSuretyWithdrawCommissionRatio"
              :disabled="confForm.taskSuretyWithdrawCommissionStatus === 'fixed'"
              min="0.00"
                @input="
                confForm.taskSuretyWithdrawCommissionRatio = asynchronousValidation(
                  confForm.taskSuretyWithdrawCommissionRatio
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
              v-model="confForm.taskSuretyWithdrawCommissionFixed"
              min="0.00"
              :disabled="confForm.taskSuretyWithdrawCommissionStatus === 'ratio'"
              @input="
                confForm.taskSuretyWithdrawCommissionFixed = asynchronousValidation(
                  confForm.taskSuretyWithdrawCommissionFixed
                )
              " 
              style="width: 200px"
              
            >
              <template slot="append">元</template>
            </el-input>
          </el-radio>
        </el-radio-group>
      </div>

      <aside>提现规则设置</aside>
      <div class="set-nav">
        <el-input
          v-model="confForm.taskSuretyWithdrawRule"
          type="textarea"
          autosize
          placeholder="请输入内容"
          maxlength="500"
          show-word-limit
        >
        </el-input>
      </div>
      <div v-if="permissions.withdraw_conf" class="set-nav">
        <el-button
          type="primary"
          :loading="loading"
          @click="onSubmit"
          v-if="permissions.withdraw_conf"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getWithdrawConf,
  upWithdrawConf,
  getSuretyonf,
  updateSuretyonf,
} from "@/api/finance/withdraw";

export default {
  data() {
    return {
      confForm: {
        taskSuretyWithdrawAuditStatus: 0,
        taskSuretyWithdrawCommissionFixed: 0,
        taskSuretyWithdrawCommissionRatio: 0,
        taskSuretyWithdrawCommissionStatus: "",
        taskSuretyWithdrawMaxAmount: 0,
        taskSuretyWithdrawMinAmount: 0,
        taskSuretyWithdrawNumPerDay: 0,
        taskSuretyWithdrawRule: undefined,
      },
      loading: false,
      radio: 3,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.$nextTick(() => {
      // 保证金提现设置
      this.getBondConf();
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      return e;
    },
    // 查询保证金提现基本配置信息
    getBondConf() {
      getSuretyonf().then((response) => {
        const res = response.data.data;
        res.taskSuretyWithdrawAuditStatus = res.taskSuretyWithdrawAuditStatus === 1 ? true : false;
        if (res.taskSuretyWithdrawCommissionStatus === "fixed") {
          res.taskSuretyWithdrawCommissionRatio = undefined;
        } else if (res.taskSuretyWithdrawCommissionStatus === "ratio") {
          res.taskSuretyWithdrawCommissionFixed = undefined;
        }

        this.confForm = res;
        console.debug('this.conForm',this.confForm)
      });
    },
    // 提现手续费变化时
    commissionStatus(val) {
      if (val === "fixed") {
        this.confForm.taskSuretyWithdrawCommissionFixed = undefined;
        this.confForm.taskSuretyWithdrawCommissionRatio = undefined;
      } else if (val === "ratio") {
        this.confForm.taskSuretyWithdrawCommissionRatio = undefined;
        this.confForm.taskSuretyWithdrawCommissionFixed = undefined;
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    // 提交
    onSubmit() {

      if (!this.confForm.taskSuretyWithdrawNumPerDay) {
        this.$message.error("提现次数不能为0，必须正整数!");
        return false;
      }

      if (
        !this.confForm.taskSuretyWithdrawMinAmount &&
        this.confForm.taskSuretyWithdrawMinAmount !== 0
      ) {
        this.$message.error("最小提现金额不能为空!");
        return false;
      }
      if (!this.confForm.taskSuretyWithdrawMaxAmount) {
        this.$message.error("最大提现金额不能为空!");
        return false;
      }
      console.debug("最大提现金额", this.confForm.taskSuretyWithdrawMaxAmount);
      console.debug("最小提现金额", this.confForm.taskSuretyWithdrawMaxAmount);
      console.debug(
        "比较",
        typeof this.confForm.taskSuretyWithdrawMaxAmount,
        typeof this.confForm.taskSuretyWithdrawMinAmount
      );
      if (
        Number(this.confForm.taskSuretyWithdrawMaxAmount) <
        Number(this.confForm.taskSuretyWithdrawMinAmount)
      ) {
        this.$message.error("最大提现金额不能小于最小提现金额!");
        return false;
      }

      if (this.confForm.taskSuretyWithdrawCommissionStatus === "fixed") {
        if (!this.confForm.taskSuretyWithdrawCommissionFixed) {
          this.$message.error("固定收费不能为空!");
          return false;
        }
      } else if (this.confForm.taskSuretyWithdrawCommissionStatus === "ratio") {
        if (this.confForm.taskSuretyWithdrawCommissionFixed >= 100) {
          this.$message.error("比例收费不能大于等于100!");
          return false;
        }
      } else {
        this.$message.error("请选择提现手续费的类型!");
        return false;
      }
      console.debug('his.confForm.taskSuretyWithdrawMaxAmount,',this.confForm.taskSuretyWithdrawMaxAmount,)
      const parameter = {
        taskSuretyWithdrawAuditStatus: this.confForm.taskSuretyWithdrawAuditStatus ? 1 : 0,
        taskSuretyWithdrawCommissionFixed: this.confForm.taskSuretyWithdrawCommissionFixed
          ? this.confForm.taskSuretyWithdrawCommissionFixed
          : 0,
        taskSuretyWithdrawCommissionRatio: this.confForm.taskSuretyWithdrawCommissionRatio
          ? this.confForm.taskSuretyWithdrawCommissionRatio
          : 0,
        taskSuretyWithdrawCommissionStatus: this.confForm.taskSuretyWithdrawCommissionStatus,
        taskSuretyWithdrawMaxAmount: this.confForm.taskSuretyWithdrawMaxAmount,
        taskSuretyWithdrawMinAmount: this.confForm.taskSuretyWithdrawMinAmount,
        taskSuretyWithdrawNumPerDay: this.confForm.taskSuretyWithdrawNumPerDay,
        taskSuretyWithdrawRule: this.confForm.taskSuretyWithdrawRule,
      };
      this.loading = true;
      updateSuretyonf(parameter)
          .then((response) => {
            this.$message({
              type: "success",
              message: "提交保存！",
            });
            this.loading = false;
            this.getBondConf();
          })
          .catch(() => {
            this.loading = false;
          });
    },
  },
};
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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
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
