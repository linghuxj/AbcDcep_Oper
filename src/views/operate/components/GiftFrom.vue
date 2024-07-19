<template>
  <basic-container>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
      class="demo-form"
    >
      <el-form-item label="活动名称：" prop="actName">
        <el-input
          v-model="ruleForm.actName"
          :disabled="isEdit"
          style="width: 500px"
        ></el-input>
      </el-form-item>

      <el-form-item label="活动时间：" required>
        <el-col style="width: 230px" :span="3">
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="ruleForm.startTime"
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
              v-model="ruleForm.endTime"
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
      <el-form-item label="活动奖励：" prop="amount">
        <el-input v-model.number="ruleForm.amount" style="width: 500px">
          <template slot="append">米粒</template>
        </el-input>
      </el-form-item>
      <el-form-item label="活动图片：" prop="image">
        <upload-file
          ref="uploadImage"
          v-model="ruleForm.image"
          type="content"
          :limit="1"
          :multiple="true"
          :auto-upload="false"
          type-name="image"
        />
      </el-form-item>
      <el-form-item
        v-if="
          permissions.new_user_active_add || permissions.new_user_active_edit
        "
      >
        <el-button
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import UploadFile from '@/components/Upload-File/upload'
import { getHour, getMinute, getSecond } from '@/util/date'
import {
  upDistMarket,
  addDistMarket,
  reqDistMarketDetailById
} from '@/api/operate/market'

export default {
  name: 'GiftFrom',
  components: {
    UploadFile
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      ruleForm: {
        amount: undefined,
        image: '',
        activeId: undefined,
        actName: '',
        type: 'integral',
        activeUnit: '米粒',
        endTime: '',
        startTime: ''
      },
      pickerOptionsStart: {
        disabledDate: time => {
          const endDateVal = this.ruleForm.endTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          } else {
            return time.getTime() < new Date(new Date().toLocaleDateString())
          }
        }
      },
      pickerOptionsEnd: {
        // 可通过箭头函数的方式访问到this
        disabledDate: time => {
          const beginDateVal = this.ruleForm.startTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            )
          }
        }
      },
      rules: {
        actName: [
          { required: true, message: '请输入商品名称', trigger: 'change' },
          {
            min: 1,
            max: 15,
            message: '长度在 1 到 15 个字符',
            trigger: 'change'
          }
        ],
        image: [
          { required: true, message: '活动图片不为空', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '活动开始时间不为空', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '活动结束时间不为空', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '活动奖励不为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },

  created() {
    this.$nextTick(() => {
      if (this.isEdit) {
        const id = this.$route.params && this.$route.params.id
        this.getList(id)
      }
    })
  },
  methods: {
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null
      return e
    },
    // 查询详情
    getList(id) {
      reqDistMarketDetailById(id).then(resp => {
        const page = resp.data.data
        page.datetime = [page.startTime, page.endTime]
        page.type = 'integral'
        page.activeUnit = '米粒'
        this.$refs.uploadImage.loadImg(page.image)
        this.ruleForm = page
      })
    },

    async submitForm(formName) {
      const _this = this
      _this.loading = true
      // 商品图
      this.ruleForm.image = this.$refs.uploadImage.imgURL[0]
      _this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isEdit) {
            _this._editSubmit(_this.ruleForm)
          } else {
            _this._addSubmit(_this.ruleForm)
          }
        } else {
          _this.loading = false
          return false
        }
      })
    },
    // 新增
    _addSubmit(data) {
      const _this = this
      addDistMarket(data)
        .then(() => {
          _this.loading = false
          _this.$message.success('保存成功')
          _this.resetForm()
        })
        .catch(() => {
          _this.loading = false
        })
    },
    // 提交
    _editSubmit(data) {
      const _this = this
      upDistMarket(data)
        .then(() => {
          _this.loading = false
          _this.$message.success('保存成功')
          _this.resetForm()
        })
        .catch(() => {
          _this.loading = false
        })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    },
    pickerTimeStart() {
      const time = getHour() + ':' + getMinute() + ':' + getSecond()
      return time
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-form {
  .el-form-item__content {
    .el-col {
      margin-bottom: 0;
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
}
</style>
