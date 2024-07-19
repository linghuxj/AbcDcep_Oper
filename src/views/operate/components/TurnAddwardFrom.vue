<template>
  <div>
    <el-dialog
      title="添加奖品"
      :visible.sync="interactive.addWard_dialogVisible"
      width="40%">
      <el-form ref="ruleForm" :model="ruleForm" :rules="addWard_rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名称：" prop="prizeName">
          <el-input v-model="ruleForm.prizeName" placeholder="请输入名称" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="图片：">
          <upload
            ref="addUpload"
            v-model="ruleForm.prizeImage"
            type="content"
            :limit="1"
            :multiple="true"
            :auto-upload="false"
            type-name="image"
          />
          <label>建议尺寸150X150像素，支持JPG、PNG、JPEG格式</label>
        </el-form-item>
        <el-form-item label="奖品：" prop="prizeType">
          <div style="display:flex;flex-direction: column;">
            <el-radio v-model="ruleForm.prizeType" label="cash">现金 
              <el-input v-model="cashAmount" style="width:60%" maxlength="10" :disabled="ruleForm.prizeType!='cash'">
                <template slot="append">元</template>
              </el-input>
            </el-radio>
            <el-radio v-model="ruleForm.prizeType" label="integral">米粒
              <el-input v-model="integralAmount" style="width:60%" maxlength="10" :disabled="ruleForm.prizeType!='integral'">
                <template slot="append">米粒</template>
              </el-input>
            </el-radio>
            <el-radio v-model="ruleForm.prizeType" label="goods">物品</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="数量：" prop="totalNum">
          <el-input v-model="ruleForm.totalNum" placeholder="请输入数量" style="width:60%" maxlength="10"><template slot="append">份</template></el-input>
        </el-form-item>
        <el-form-item label="中奖概率：" prop="winRatio">
          <el-input v-model="ruleForm.winRatio" placeholder="请输入中奖概率" style="width:60%" oninput="value=value.replace(/[^0-9.]/g,'')" maxlength="6"><template slot="append">%</template></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="to_cancelAddward()">取 消</el-button>
        <el-button type="primary" :loading="interactive.add_loading" @click="to_addWardSubmit()">确 定</el-button>
      </span>
    </el-dialog> 
  </div>
</template>
<script>
import upload from '@/components/Upload-File/upload'
export default {
  name: 'TurnAddwardFrom',
  components: {
    upload
  },
  props: {
    againChecked: {
      type: Boolean,
      default: false
    },
    recurPrize: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var getWinRatio = (rule, value, callback) => {
      if (!value) {
        callback('请输入概率')
      } else if (value === 0) {
        callback('概率不能小于0')
      }
      callback()
    }
    return {
      interactive: {
        addWard_dialogVisible: false,
        add_loading: false
      },
      // 添加奖品信息
      ruleForm: {
        prizeName: undefined,
        prizeType: undefined,
        prizeImage: undefined,
        totalNum: 0,
        winRatio: 0,
        prizeAmount: 0
      },
      prizeId: undefined,
      // 添加奖品时金额数量
      cashAmount: undefined,
      // 添加奖品时米粒数量
      integralAmount: undefined,
      tableData: [],
      addWard_rules: {
        prizeName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        prizeType: [
          { type: 'string', required: true, message: '请至少选择一个奖品', trigger: 'change' }
        ],
        totalNum: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        winRatio: [
          { required: true, validator: getWinRatio, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    // 提交奖品
    to_addWardSubmit() {
      // 上传奖品图片凭证
      this.$refs.addUpload.getUploadParams()
      this.interactive.add_loading = true
      setTimeout(() => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // 获取奖品图片路径
            const uploadParams = this.$refs.addUpload.uploadParams
            this.ruleForm.prizeImage = uploadParams[0].imageURL
            let prizeAmount = 0
            switch (this.ruleForm.prizeType) {
              case ('cash'):
                prizeAmount = this.cashAmount
                break
              case ('integral'):
                prizeAmount = this.integralAmount
                break
              default:
                prizeAmount = 0
                break
            }
            this.ruleForm.prizeAmount = Number(prizeAmount)
            this.ruleForm.totalNum = parseInt(this.ruleForm.totalNum)
            this.ruleForm.winRatio = Number(this.ruleForm.winRatio)
            // 判断概率
            let winRatio = this.ruleForm.winRatio
            for (const i in this.tableData) {
              // 编辑计算中奖概率
              if (this.prizeId) {
                if (parseInt(this.prizeId - 1) !== parseInt(i)) {
                  winRatio = parseFloat(winRatio) + parseFloat(this.tableData[i].winRatio)
                }
              } else {
                winRatio = winRatio + this.tableData[i].winRatio
              }
            }
            if (this.againChecked) {
              winRatio = parseFloat(winRatio) + parseFloat(this.recurPrize.winRatio)
            }
            console.debug('winRatio', winRatio)
            if (winRatio > 100) {
              this.$message.warning('奖品中奖概率总和不能大于100%')
              this.interactive.add_loading = false
              return
            }
            // 编辑奖品
            if (this.prizeId) {
              this.tableData.splice(this.prizeId - 1, 1, this.ruleForm)
              this.$emit('funTable', this.tableData)
              this.interactive.addWard_dialogVisible = false
            } else {
              this.tableData.push(this.ruleForm)
              this.$emit('funTable', this.tableData) 
              this.interactive.addWard_dialogVisible = false
            }
            this.prizesNum = this.againChecked ? this.tableData.length + 2 : this.tableData.length + 1
            this.interactive.add_loading = false
            // 清空上传图片组件
            this.$refs.addUpload.clearFiles()
          } else {
            this.interactive.add_loading = false
          }
        })
        
      }, 2000)
    },
    // 去打开弹框
    openAddWard() {
      // 添加奖品时米粒数量
      this.integralAmount = undefined
      this.cashAmount = undefined
      this.prizeId = undefined
      this.ruleForm = {
        prizeName: undefined,
        prizeType: undefined,
        prizeImage: undefined,
        totalNum: undefined,
        winRatio: undefined,
        prizeAmount: undefined
      }
      this.interactive.addWard_dialogVisible = true
    },
    // 去取消
    to_cancelAddward() {
      this.$emit('funDialog', false)
      // 清空图片
      this.$refs.addUpload.clearFiles()
      this.interactive.addWard_dialogVisible = false
      
      this.cashAmount = undefined
      // 添加奖品时米粒数量
      this.integralAmount = undefined
      this.prizeId = undefined
      this.ruleForm = {
        prizeName: undefined,
        prizeType: undefined,
        prizeImage: undefined,
        totalNum: undefined,
        winRatio: undefined,
        prizeAmount: undefined
      }
    },
    // 去编辑奖品
    editAddWard(index) {
      if (this.tableData[index].prizeType === 'cash') {
        this.cashAmount = this.tableData[index].prizeAmount
      } else if (this.tableData[index].prizeType === 'integral') {
        this.integralAmount = this.tableData[index].prizeAmount
      }
      this.prizeId = index + 1
      this.ruleForm = {
        prizeName: this.tableData[index].prizeName,
        prizeType: this.tableData[index].prizeType,
        prizeImage: this.tableData[index].prizeImage,
        totalNum: this.tableData[index].totalNum,
        winRatio: this.tableData[index].winRatio,
        prizeAmount: this.tableData[index].prizeAmount
      }
      this.interactive.addWard_dialogVisible = true 
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
        this.$refs.addUpload.uploadImg([this.tableData[index].prizeImage])
      })
    },
    //去删除奖品
    to_deleteWard(index) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>
<style scoped>

</style>
