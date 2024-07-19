<template>
  <div class="main-content">
    <div class="set-content">
      <aside>提现设置</aside>
      <div class="set-nav">
        <el-checkbox v-model="confForm.withdrawAuditStatus"
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
          v-model.number="confForm.withdrawNumPerDay"
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
          v-model="confForm.withdrawMinAmount"
          min="0.00"
          style="width: 200px"
          @input="
            confForm.withdrawMinAmount = asynchronousValidation(
              confForm.withdrawMinAmount
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
          v-model="confForm.withdrawMaxAmount"
          min="0.00"
          style="width: 200px"
          @input="
            confForm.withdrawMaxAmount = asynchronousValidation(
              confForm.withdrawMaxAmount
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
          v-model="confForm.withdrawCommissionStatus"
          @change="commissionStatus"
        >
          <el-radio label="ratio">
            <span>比例收费 每一笔扣</span>
            <el-input
              v-model="confForm.withdrawCommissionRatio"
              
              
              style="width: 200px"
              
            >
            <!-- 
              :disabled="confForm.withdrawCommissionStatus === 'fixed'"
              min="0.00"
                @input="
                confForm.withdrawCommissionRatio = asynchronousValidation(
                  confForm.withdrawCommissionRatio
                )
               "
             -->
              <template slot="append">%</template>
            </el-input>
          </el-radio>
          <el-radio label="fixed">
            <span>固定收费</span>
            <el-input
              v-model="confForm.withdrawCommissionFixed"
              
              style="width: 200px"
              
            >
            <!-- 
              min="0.00"
              :disabled="confForm.withdrawCommissionStatus === 'ratio'"
              @input="
                confForm.withdrawCommissionFixed = asynchronousValidation(
                  confForm.withdrawCommissionFixed
                )
              " -->
              <template slot="append">元</template>
            </el-input>
          </el-radio>
        </el-radio-group>
      </div>

      <aside>提现规则设置</aside>
      <div class="set-nav">
        <el-input
          v-model="confForm.withdrawRule"
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
        withdrawAuditStatus: 0,
        withdrawCommissionFixed: 0,
        withdrawCommissionRatio: 0,
        withdrawCommissionStatus: "",
        withdrawMaxAmount: 0,
        withdrawMinAmount: 0,
        withdrawNumPerDay: 0,
        withdrawRule: undefined,
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
      // 余额提现设置
      this.getConf();
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      return e;
    },
    // 查询基本配置信息
    getConf() {
      getWithdrawConf().then((response) => {
        const res = response.data.data;
        res.withdrawAuditStatus = res.withdrawAuditStatus === 1 ? true : false;
        if (res.withdrawCommissionStatus === "fixed") {
          res.withdrawCommissionRatio = undefined;
        } else if (res.withdrawCommissionStatus === "ratio") {
          res.withdrawCommissionFixed = undefined;
        }
        this.confForm = res;
      });
    },
    // 查询保证金提现基本配置信息
    getBondConf() {
      getSuretyonf().then((response) => {
        const res = response.data.data;
        res.withdrawAuditStatus = res.withdrawAuditStatus === 1 ? true : false;
        if (res.withdrawCommissionStatus === "fixed") {
          res.withdrawCommissionRatio = undefined;
        } else if (res.withdrawCommissionStatus === "ratio") {
          res.withdrawCommissionFixed = undefined;
        }

        this.confForm = res;
      });
    },
    // 提现手续费变化时
    commissionStatus(val) {
      if (val === "fixed") {
        this.confForm.withdrawCommissionFixed = undefined;
        this.confForm.withdrawCommissionRatio = undefined;
      } else if (val === "ratio") {
        this.confForm.withdrawCommissionRatio = undefined;
        this.confForm.withdrawCommissionFixed = undefined;
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    // 提交
    onSubmit() {
      const parameter = {
        withdrawAuditStatus: this.confForm.withdrawAuditStatus ? 1 : 0,
        withdrawCommissionFixed: this.confForm.withdrawCommissionFixed
          ? this.confForm.withdrawCommissionFixed
          : 0,
        withdrawCommissionRatio: this.confForm.withdrawCommissionRatio
          ? this.confForm.withdrawCommissionRatio
          : 0,
        withdrawCommissionStatus: this.confForm.withdrawCommissionStatus,
        withdrawMaxAmount: this.confForm.withdrawMaxAmount,
        withdrawMinAmount: this.confForm.withdrawMinAmount,
        withdrawNumPerDay: this.confForm.withdrawNumPerDay,
        withdrawRule: this.confForm.withdrawRule,
      };

      if (!this.confForm.withdrawNumPerDay) {
        this.$message.error("提现次数不能为0，必须正整数!");
        return false;
      }

      if (
        !this.confForm.withdrawMinAmount &&
        this.confForm.withdrawMinAmount !== 0
      ) {
        this.$message.error("最小提现金额不能为空!");
        return false;
      }
      if (!this.confForm.withdrawMaxAmount) {
        this.$message.error("最大提现金额不能为空!");
        return false;
      }
      console.debug("最大提现金额", this.confForm.withdrawMaxAmount);
      console.debug("最小提现金额", this.confForm.withdrawMinAmount);
      console.debug(
        "比较",
        typeof this.confForm.withdrawMaxAmount,
        typeof this.confForm.withdrawMinAmount
      );
      if (
        Number(this.confForm.withdrawMaxAmount) <
        Number(this.confForm.withdrawMinAmount)
      ) {
        this.$message.error("最大提现金额不能小于最小提现金额!");
        return false;
      }

      if (this.confForm.withdrawCommissionStatus === "fixed") {
        if (!this.confForm.withdrawCommissionFixed) {
          this.$message.error("固定收费不能为空!");
          return false;
        }
      } else if (this.confForm.withdrawCommissionStatus === "ratio") {
        if (this.confForm.withdrawCommissionRatio >= 100) {
          this.$message.error("比例收费不能大于等于100!");
          return false;
        }
      } else {
        this.$message.error("请选择提现手续费的类型!");
        return false;
      }

      this.loading = true;
      upWithdrawConf(parameter)
          .then((response) => {
            this.$message({
              type: "success",
              message: "提交保存！",
            });
            this.loading = false;
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
