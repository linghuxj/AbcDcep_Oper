<template>
  <div class="main-content">
    <div class="set-content">
      <aside>邀请下级上限</aside>
      <div class="set-nav">
        <el-checkbox v-model="firstForm.autoUpgradeLeader" disabled>团员/普通创客触发分享机制后，系统自动升级为团长</el-checkbox>
      </div>
      <div class="set-nav">
        <span class="nav-item-label-left">团长最多可邀请</span>
        <el-input
          v-model="firstForm.leaderInvitedMemberNum"
          :disabled="!permissions.app_share_conf"
          style="width: 100px;"
          @input="firstForm.leaderInvitedMemberNum = asynchronousValidation(firstForm.leaderInvitedMemberNum)"
        />
        <span class="nav-item-label-right"> 个下级成员</span>
      </div>
    </div>
    <div class="set-content">
      <aside>额外名额获取</aside>
      <div class="set-nav">
        <span class="nav-item-label-left">有效任务结果达到</span>
        <el-input
          v-model="firstForm.taskResultNum"
          min="0.00"
          :disabled="!permissions.app_share_conf || tableLoading"
          style="width: 100px;"
          @input="firstForm.taskResultNum = asynchronousValidation(firstForm.taskResultNum)"
        />
        <span class="nav-item-label-center"> 个，获得</span>
        <el-input
          v-model="firstForm.taskResultExtraInvitedNum"
          min="0.00"
          :disabled="!permissions.app_share_conf || tableLoading"
          style="width: 100px;"
          @input="firstForm.taskResultExtraInvitedNum = asynchronousValidation(firstForm.taskResultExtraInvitedNum)"
        />
        <span class="nav-item-label-right"> 个邀请名额</span>
      </div>
      <div class="set-nav">
        <span class="nav-item-label-left">消费金额达到</span>
        <el-input
          v-model="firstForm.expenditureAmount"
          min="0.00"
          :disabled="!permissions.app_share_conf || tableLoading"
          style="width: 100px;"
          @input="firstForm.expenditureAmount = asynchronous(firstForm.expenditureAmount)"
        />
        <span class="nav-item-label-center"> 元，获得</span>
        <el-input
          v-model="firstForm.expenditureExtraInvitedNum"
          min="0.00"
          :disabled="!permissions.app_share_conf || tableLoading"
          style="width: 100px;"
          @input="firstForm.expenditureExtraInvitedNum = asynchronousValidation(firstForm.expenditureExtraInvitedNum)"
        />
        <span class="nav-item-label-right"> 个邀请名额</span>
      </div>
      <div class="set-nav">
        <span class="nav-item-label-left">总有效任务结果达到</span>
        <el-input
          v-model="firstForm.totalTaskResultNum"
          min="0.00"
          :disabled="!permissions.app_share_conf || tableLoading"
          style="width: 100px;"
          @input="firstForm.totalTaskResultNum = asynchronousValidation(firstForm.totalTaskResultNum)"
        />
        <span class="nav-item-label-center"> 个，获得</span>
        <el-input
          v-model="firstForm.totalTaskResultExtraInvitedNum"
          min="0.00"
          :disabled="!permissions.app_share_conf || tableLoading"
          style="width: 100px;"
          @input="firstForm.totalTaskResultExtraInvitedNum = asynchronousValidation(firstForm.totalTaskResultExtraInvitedNum)"
        />
        <span class="nav-item-label-right"> 个邀请名额</span>
      </div>
      <div class="set-nav">
        <span class="nav-item-label-left">总消费金额达到</span>
        <el-input
          v-model="firstForm.totalExpenditureAmount"
          min="0.00"
          :disabled="!permissions.app_share_conf || tableLoading"
          style="width: 100px;"
          @input="firstForm.totalExpenditureAmount = asynchronous(firstForm.totalExpenditureAmount)"
        />
        <span class="nav-item-label-center"> 元，获得</span>
        <el-input
          v-model="firstForm.totalExpenditureExtraInvitedNum"
          min="0.00"
          :disabled="!permissions.app_share_conf || tableLoading"
          style="width: 100px;"
          @input="firstForm.totalExpenditureExtraInvitedNum = asynchronousValidation(firstForm.totalExpenditureExtraInvitedNum)"
        />
        <span class="nav-item-label-right"> 个邀请名额</span>
      </div>
      <div class="set-tip">1、总有效任务指下级成员完成的有效任务总数，即邀请的团队成员完成的有效任务总数</div>
      <div class="set-tip">2、总消费金额指下级成员消费的金额总数，即邀请的团队成员消费的金额总数</div>
    </div>
    <div v-if="permissions.app_share_conf" class="set-content">
      <el-button type="primary" size="medium" @click="cancel">取消</el-button>
      <el-button
        type="warning"
        size="medium"
        :disabled="loading"
        :loading="loading"
        @click="conserve"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import { reqShareConf, upShareConf } from '@/api/share/index'
import { mapGetters } from 'vuex'

export default {
  name: 'SetUp',
  data() {
    return {
      input: undefined,
      radio: 3,
      value: '',
      loading: false,
      tableLoading: false,
      firstForm: {}
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  watch: {
    'firstForm.leaderInvitedMemberNum'(val) {
      if (val === 0) {
        this.tableLoading = false
        return
      }
      if (val === undefined || val === null || val === '') {
        this.tableLoading = true
        return
      }
      
      this.tableLoading = false
      return
    }
  },
  created() {
    this.$nextTick(() => {
      this.reqShareConf()
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      if (e) {
        e = (e.match(/^\d*/g)[0]) || null
      }
      return e
    },
    asynchronous(e) {
      e = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      return e
    },
    cancel() {
      this.firstForm = {}
      this.reqShareConf()
      this.tableLoading = false
    },
    conserve() {
      this.loading = true
      this.firstForm.leaderInvitedMemberNum = (!this.firstForm.leaderInvitedMemberNum ? undefined : this.firstForm.leaderInvitedMemberNum)
      this.firstForm.autoUpgradeLeader = this.firstForm.autoUpgradeLeader === true ? 1 : 0
      upShareConf(this.firstForm).then(res => {
        this.loading = false
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.reqShareConf()
      }).catch((e) => {
        this.loading = false
      })
    },
    // 查询基本配置信息
    reqShareConf() {
      reqShareConf().then(response => {
        const confForm = response.data.data
        this.firstForm = confForm
        this.firstForm.autoUpgradeLeader = confForm.autoUpgradeLeader === 1 ? true : false
        this.tableLoading = true
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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .set-content {
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
      color: #C0C4CC;
    }
  }
}
.nav-item-label-right {
  margin-left: 8px;
  font-size: 14px;
}
.nav-item-label-center {
  margin-left: 8px;
  margin-right: 8px;
  font-size: 14px;
}
.nav-item-label-left {
  margin-right: 8px;
  font-size: 14px;
}
</style>
