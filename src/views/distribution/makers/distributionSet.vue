<template>
  <div class="main-content">
    <aside>分佣比例</aside>
    <div class="set-nav">
      <span class="set-nav-i">*</span>
      <span>直推奖励：</span>
      <el-radio-group
        v-model="distributionFotm.levelCommissionType"
        @change="feeProportion"
      >
        <el-radio label="ratio">
          比例返佣 每一笔任务收益的
          <el-input
            v-model="distributionFotm.levelCommissionRatio"
            min="0.00"
            :disabled="distributionFotm.levelCommissionType === 'fixed'"
            style="width: 200px"
            @input="
              distributionFotm.levelCommissionRatio = asynchronousValidation(
                distributionFotm.levelCommissionRatio
              )
            "
          >
            <template slot="append">%</template>
          </el-input>
        </el-radio>
        <el-radio label="fixed">
          固定返佣
          <el-input
            v-model="distributionFotm.levelCommissionFixed"
            min="0.00"
            :disabled="distributionFotm.levelCommissionType === 'ratio'"
            style="width: 200px"
            @input="
              distributionFotm.levelCommissionFixed = asynchronousValidation(
                distributionFotm.levelCommissionFixed
              )
            "
          >
            <template slot="append">元</template>
          </el-input>
        </el-radio>
      </el-radio-group>
    </div>
    <div class="set-nav" label="">
      <span class="set-nav-i">*</span>
      <span>间推奖励：</span>
      <el-radio-group
        v-model="distributionFotm.indirectCommissionType"
        @change="indirectProportion"
      >
        <el-radio label="ratio">
          比例返佣 每一笔任务收益的
          <el-input
            v-model="distributionFotm.indirectCommissionRatio"
            min="0.00"
            :disabled="distributionFotm.indirectCommissionType === 'fixed'"
            style="width: 200px"
            @input="
              distributionFotm.indirectCommissionRatio = asynchronousValidation(
                distributionFotm.indirectCommissionRatio
              )
            "
          >
            <template slot="append">%</template>
          </el-input>
        </el-radio>
        <el-radio label="fixed">
          固定返佣
          <el-input
            v-model="distributionFotm.indirectCommissionFixed"
            min="0.00"
            :disabled="distributionFotm.indirectCommissionType === 'ratio'"
            style="width: 200px"
            @input="
              distributionFotm.indirectCommissionFixed = asynchronousValidation(
                distributionFotm.indirectCommissionFixed
              )
            "
          >
            <template slot="append">元</template>
          </el-input>
        </el-radio>
      </el-radio-group>
    </div>
    <aside>关系设置</aside>
    <div class="set-nav">
      <el-checkbox
        :checked="distributionFotm.upgradeLeader"
        v-model="distributionFotm.upgradeLeader"
        >允许团长将成员升级为分团队的团长</el-checkbox
      >
      <span class="set-nav-tips">勾选后，前端团长可升级团员为团队长</span>
    </div>
    <aside>层级设置</aside>
    <div class="set-nav">
      <span class="set-nav-i">*</span>
      <span>团队最大层级 </span>
      <el-input
        v-model="distributionFotm.teamMaxHierarchy"
        style="width: 200px; margin-right: 10px"
        oninput="value=value.replace(/[^1-3-]+/,'');"
        maxlength="1"
      />级
      <span class="set-nav-tips">
        只支持输入正整数，填写后代表团队可向下发展的最大层级数；默认为2级(最大3级)</span
      >
    </div>
    <div class="set-nav">
      <span class="set-nav-i">*</span>
      <span>数据统计最大层级 </span>
      <el-input
        v-model="distributionFotm.teamStatisticsMaxHierarchy"
        style="width: 200px; margin-right: 10px"
        oninput="value=value.replace(/[^1-3-]+/,'');"
        maxlength="1"
      />级
      <span class="set-nav-tips"
        >只支持输入正整数，填写后代表团队可向下发展的最大层级数；默认为2级(最大3级)</span
      >
    </div>
    <div v-if="permissions.distributor_conf" class="set-nav">
      <el-button @click="getList">取消</el-button>
      <el-button type="primary" @click="editDistributionCond">保存</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  reqDistributionCond,
  upDistributionCond
} from '@/api/distribution/distribution'

export default {
  data() {
    return {
      distributionFotm: {
        indirectCommissionFixed: 0,
        indirectCommissionRatio: 0,
        indirectCommissionType: '',
        levelCommissionFixed: 0,
        levelCommissionRatio: 0,
        levelCommissionType: '',
        teamMaxHierarchy: 0,
        teamStatisticsMaxHierarchy: 0,
        upgradeLeader: 0
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null
      return e
    },
    getList() {
      reqDistributionCond().then(resp => {
        const parameter = resp.data.data
        parameter.upgradeLeader = parameter.upgradeLeader === 1 ? true : false
        this.distributionFotm = Object.assign(
          {},
          this.distributionFotm,
          parameter
        )
      })
    },
    // 修改
    editDistributionCond() {
      const parameter = {
        indirectCommissionFixed: this.distributionFotm.indirectCommissionFixed
          ? this.distributionFotm.indirectCommissionFixed
          : 0,
        indirectCommissionRatio: this.distributionFotm.indirectCommissionRatio
          ? this.distributionFotm.indirectCommissionRatio
          : 0,
        indirectCommissionType: this.distributionFotm.indirectCommissionType,
        levelCommissionFixed: this.distributionFotm.levelCommissionFixed
          ? this.distributionFotm.levelCommissionFixed
          : 0,
        levelCommissionRatio: this.distributionFotm.levelCommissionRatio
          ? this.distributionFotm.levelCommissionRatio
          : 0,
        levelCommissionType: this.distributionFotm.levelCommissionType,
        teamMaxHierarchy: this.distributionFotm.teamMaxHierarchy,
        teamStatisticsMaxHierarchy:
          this.distributionFotm.teamStatisticsMaxHierarchy,
        upgradeLeader: this.distributionFotm.upgradeLeader === true ? 1 : 0
      }

      upDistributionCond(parameter).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功！'
        })
        this.$nextTick(() => {
          this.getList()
        })
      })
    },
    // 直推
    feeProportion(val) {
      if (val === 'fixed') {
        this.ruleForm.levelCommissionRatio = undefined
      } else if (val === 'ratio') {
        this.ruleForm.levelCommissionFixed = undefined
      }
    },
    // 间推
    indirectProportion(val) {
      if (val === 'fixed') {
        this.ruleForm.indirectCommissionRatio = undefined
      } else if (val === 'ratio') {
        this.ruleForm.indirectCommissionFixed = undefined
      }
    }
  }
}
</script>
<style scoped>
.set-nav {
  margin: 10px 24px 20px;
}
.set-nav-i {
  color: red;
}
.set-nav-tips {
  color: #c0c0c0;
  margin-left: 50px;
}
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
</style>
