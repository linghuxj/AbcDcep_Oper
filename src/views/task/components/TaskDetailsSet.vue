/** 
* 分佣设置 
*/

<template>
  <div>
    <aside>分佣比例 
      <span v-if="permissions.task_commission_edit && (ruleForm.status !== 'over')" class="set-submit">
        <el-button type="primary" @click="editCommission">保存</el-button>
      </span>
    </aside>
    <div class="set-nav">
      <span>直推奖励：</span>
      <el-radio-group
        v-model="ruleForm.levelCommissionType"
        @change="feeProportion"
      >
        <el-radio label="ratio">
          比例返佣 每一笔任务的
          <el-input
            v-model="ruleForm.levelCommissionRatio"
            :disabled="levelCommissionRatio"
            style="width: 200px"
            @input="ruleForm.levelCommissionRatio = asynchronousValidation(ruleForm.levelCommissionRatio)"
          >
            <template slot="append">%</template>
          </el-input>
        </el-radio>
        <el-radio label="fixed">
          固定返佣
          <el-input
            v-model="ruleForm.levelCommissionFixed"
            min="0.00"
            :disabled="levelCommissionFixed"
            style="width: 200px"
            @input="ruleForm.levelCommissionFixed = asynchronousValidation(ruleForm.levelCommissionFixed)"
          >
            <template slot="append">元</template>
          </el-input>
        </el-radio>
      </el-radio-group>
    </div>
    <div class="set-nav">
      <span>间推奖励：</span>
      <el-radio-group
        v-model="ruleForm.indirectCommissionType"
        @change="indirectProportion"
      >
        <el-radio label="ratio">
          比例返佣 每一笔任务的
          <el-input
            v-model="ruleForm.indirectCommissionRatio"
            min="0.00"
            :disabled="indirectCommissionRatio"
            style="width: 200px"
            @input="ruleForm.indirectCommissionRatio = asynchronousValidation(ruleForm.indirectCommissionRatio)"
          >
            <template slot="append">%</template>
          </el-input>
        </el-radio>
        <el-radio label="fixed">
          固定返佣
          <el-input
            v-model="ruleForm.indirectCommissionFixed"
            min="0.00"
            :disabled="indirectCommissionFixed"
            style="width: 200px"
            @input="ruleForm.indirectCommissionFixed = asynchronousValidation(ruleForm.indirectCommissionFixed)"
          >
            <template slot="append">元</template>
          </el-input>
        </el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTaskById, upTaskCommissionById } from '@/api/task/list'



export default {
  name: 'TaskDetailsSet',
  data() {
    return {
      levelCommissionRatio: true,
      levelCommissionFixed: true,
      indirectCommissionFixed: true,
      indirectCommissionRatio: true,
      ruleForm: {
        indirectCommissionRatio: undefined,
        indirectCommissionFixed: undefined,
        indirectCommissionAmount: undefined,
        indirectCommissionType: undefined,
        levelCommissionAmount: undefined,
        levelCommissionType: undefined,
        status: undefined,
        taskId: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.$nextTick(() => {
      this.ruleForm.taskId = id
      this.getList(id)
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      return e
    },

    getList(id) {
      getTaskById(id).then(resp => {
        const parameter = resp.data.data
        this.ruleForm = Object.assign({}, this.ruleForm, parameter)
        if (this.ruleForm.indirectCommissionType === 'fixed') {
          this.ruleForm.indirectCommissionFixed = this.ruleForm.indirectCommissionAmount

          this.indirectCommissionFixed = false
          this.indirectCommissionRatio = true
        } else if (this.ruleForm.indirectCommissionType === 'ratio') {
          this.ruleForm.indirectCommissionRatio = this.ruleForm.indirectCommissionAmount

          this.indirectCommissionFixed = true
          this.indirectCommissionRatio = false
        }
        if (this.ruleForm.levelCommissionType === 'fixed') {
          this.ruleForm.levelCommissionFixed = this.ruleForm.levelCommissionAmount

          this.levelCommissionFixed = false
          this.levelCommissionRatio = true
        } else if (this.ruleForm.levelCommissionType === 'ratio') {
          this.ruleForm.levelCommissionRatio = this.ruleForm.levelCommissionAmount
          this.levelCommissionFixed = true
          this.levelCommissionRatio = false
        }
      }).catch(() => {
      })
    },
    // 修改
    editCommission() {
      const parameter = {
        indirectCommissionAmount: this.ruleForm.indirectCommissionType === 'fixed' ? this.ruleForm.indirectCommissionFixed : this.ruleForm.indirectCommissionRatio,
        indirectCommissionType: this.ruleForm.indirectCommissionType,
        levelCommissionAmount: this.ruleForm.levelCommissionType === 'fixed' ? this.ruleForm.levelCommissionFixed : this.ruleForm.levelCommissionRatio,
        levelCommissionType: this.ruleForm.levelCommissionType,

        taskId: this.ruleForm.taskId
      }
      upTaskCommissionById(parameter).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功！'
        })
      }).catch(() => {
      })
    },
    // 直推
    feeProportion(val) {
      if (val === 'ratio') {
        this.levelCommissionFixed = true
        this.levelCommissionRatio = false
        this.ruleForm.levelCommissionFixed = undefined
        this.ruleForm.levelCommissionRatio = this.ruleForm.levelCommissionAmount
      } else if (val === 'fixed') {
        this.ruleForm.levelCommissionRatio = undefined
        this.ruleForm.levelCommissionFixed = this.ruleForm.levelCommissionAmount
        this.levelCommissionFixed = false
        this.levelCommissionRatio = true
      }
    },
    // 间推
    indirectProportion(val) {
      if (val === 'ratio') {
        this.ruleForm.indirectCommissionFixed = undefined
        this.ruleForm.indirectCommissionRatio = this.ruleForm.indirectCommissionAmount
        this.indirectCommissionFixed = true
        this.indirectCommissionRatio = false
      } else if (val === 'fixed') {
        this.ruleForm.indirectCommissionRatio = undefined
        this.ruleForm.indirectCommissionFixed = this.ruleForm.indirectCommissionAmount
        this.indirectCommissionFixed = false
        this.indirectCommissionRatio = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
.set-submit {
  position: absolute;
  right: 10px;
}
.set-nav {
  margin: 10px 24px 20px;
}
</style>
