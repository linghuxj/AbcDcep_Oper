<template>
  <div class="main-content">
    <div class="set-content">
      <aside>系统任务服务费配置</aside>
      <div class="set-nav">
        <el-checkbox v-model="confForm.taskServiceFeeStatus">是否收取服务费</el-checkbox>
        <!-- <span class="set-tip">勾选后，创客提交提现申请需要在审核后，提现金额才会到账。</span> -->
      </div>
      <div v-if="confForm.taskServiceFeeStatus" class="set-nav">
        <span>任务服务费收费比例：</span>
        <el-input
          v-model="confForm.taskServiceFeeRatio"
          min="0.00"
          style="width: 200px;"
          @input="confForm.taskServiceFeeRatio = asynchronousValidation(confForm.taskServiceFeeRatio)"
        >
          <template slot="append">%</template>
        </el-input>
      </div>

      <div v-if="permissions.system_conf" class="set-nav">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="getConf">取消</el-button>
      </div>
      <aside>库存设置</aside>
      <div class="set-nav">
        <el-checkbox v-model="checked">下订单减库存</el-checkbox>
      </div>
    </div>
    <div class="set-content">
      <aside>运费设置</aside>
      <div class="set-nav">
        <el-checkbox v-model="checked">全国统一包邮</el-checkbox>
      </div>
    </div>
    <div class="set-content">
      <el-button type="primary" size="medium" @click="cancel">取消</el-button>
      <el-button
        type="warning"
        size="medium"
        :disabled="loading"
        :loading="loading"
        @click="conserve"
      >保存</el-button
      >
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { reqSysCont, upSysCont } from '@/api/system/set'


export default {
  data() {
    return {
      confForm: {
        taskServiceFeeRatio: undefined,
        taskServiceFeeStatus: 0
      },
      checked: false,
      checked1: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      this.getConf()
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      return e
    },
    // 查询基本配置信息
    getConf() {
      reqSysCont().then(response => {
        const res = response.data.data
        res.taskServiceFeeStatus = (res.taskServiceFeeStatus === '1' ? true : false)
        this.confForm = res

      })
    },

    // 提交
    onSubmit() {
      const parameter = {
        taskServiceFeeStatus: this.confForm.taskServiceFeeStatus ? 1 : 0,
        taskServiceFeeRatio: this.confForm.taskServiceFeeRatio
      }
      if (parameter.taskServiceFeeRatio > 100) {
        this.$message.error('任务服务费收费比例不能大于100!')
        return false
      }
      upSysCont(parameter).then(response => {
        this.$message({
          type: 'success',
          message: '提交保存！'
        })
        this.$nextTick(() => {
          this.getConf()
        })
      })
    },

    cancel() {},
    conserve() {}
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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .set-content {
    aside {
      background: #eef1f6;
      padding: 8px 24px;
      margin-bottom: 20px;
      border-radius: 2px;
      display: block;
      line-height: 32px;
      font-size: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
      color: #2c3e50;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .set-nav {
      margin: 10px 24px 20px;
      .set-nav-tips {
        color: red;
      }
    }
    .set-tip {
      margin: 10px 24px 20px;
      font-size: 14px;
      color: #C0C4CC;
    }
  }
}
</style>
