<template>
  <div class="main-content">
    <div class="top-title">
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px; width:70%;">
        <el-step title="基本信息"></el-step>
        <el-step title="奖项设置"></el-step>
      </el-steps>
    </div>
    <div v-show="active === 1" class="steps-content">
      <turn-mes-from @func="getTurnMes" />
    </div>
    <div v-show="active === 2" class="steps-content">
      <div style="margin-bottom:20px">
        <el-button :disabled="prizesNum=='8'" type="primary" @click="to_addWard()">添加奖品</el-button>
      </div>
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.prizeImage" width="50px" height="50px" />
          </template>
        </el-table-column>
        <el-table-column prop="prizeName" label="名称"></el-table-column>
        <el-table-column prop="prizeType" label="奖品">
          <template slot-scope="scope">
            <span>{{ scope.row.prizeType==='cash'?'现金':(scope.row.prizeType==='integra'?'米粒':'物品') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalNum" label="数量" maxlength="10"></el-table-column>
        <el-table-column prop="winRatio" label="中奖概率" oninput="value=value.replace(/[^0-9.]/g,'')"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" style="color:#409eff" @click="to_editAddWard(scope.$index)">编辑</el-button>
            <el-button type="text" size="mini" style="color:#409eff" @click="to_deleteWard(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--设置再来一次  -->
      <div class="noward-set">
        <el-form
          ref="recurPrize"
          label-position="right"
          label-width="100px" 
          :model="recurPrize"
          class="noward-set-form"
        >
          <div class="again-title"><el-checkbox v-model="againChecked">名称：再来一次</el-checkbox></div>
          <el-form-item label="图片：">
            <upload
              ref="againUpload"
              v-model="recurPrize.prizeImage"
              type="content"
              :limit="1"
              :multiple="true"
              :auto-upload="false"
              :disabled="!againChecked"
              type-name="image"
            />
            <span>建议尺寸150X150像素，支持JPG、PNG、JPEG格式</span>
          </el-form-item>
          <el-form-item label="数量：">
            <el-input v-model="recurPrize.totalNum" :disabled="!againChecked" style="width:60%" maxlength="10"><template slot="append">份</template></el-input>
          </el-form-item>
          <el-form-item label="中奖概率：">
            <el-input v-model="recurPrize.winRatio" :disabled="!againChecked" style="width:60%" oninput="value=value.replace(/[^0-9.]/g,'')"><template slot="append">%</template></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!--未中奖设置  -->
      <div class="noward-set">
        <el-form
          ref="nonePrize"
          label-position="right"
          label-width="80px" 
          :model="nonePrize"
          :rules="failedrules"
          class="noward-set-form"
        >
          <label>未中奖设置</label>
          <el-form-item label="名称：" prop="prizeName">
            <el-input v-model="nonePrize.prizeName" placeholder="请输入名称" maxlength="8" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="提示语：" prop="remark">
            <el-input v-model="nonePrize.remark" placeholder="请输入提示语" maxlength="20" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="图片：">
            <upload
              ref="failUpload"
              v-model="nonePrize.prizeImage"
              type="content"
              :limit="1"
              :multiple="true"
              :auto-upload="false"
              type-name="image"
            />
            <span>建议尺寸150X150像素，支持JPG、PNG、JPEG格式</span>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--底部按钮  -->
    <div style="width:100%;text-align:center">
      <div v-show="active === 2"> 
        <el-button style="margin-top: 12px;" @click="to_step()">上一步</el-button>
        <el-button :loading="interactive.loading" style="margin-top: 12px;" type="primary" @click="to_next_submit('nonePrize')">下一步</el-button>
      </div>   
    </div>
    <!--添加奖品弹框  -->
    <turn-addward-from
      ref="addward"
      :add-ward-dialog-visible="interactive.addWard_dialogVisible" 
      :recur-prize="recurPrize"
      :again-checked="againChecked"
      @funTable="funTable"
    />
  </div>
</template>

<script>
import upload from '@/components/Upload-File/upload'
import TurnMesFrom from '../components/TurnMesFrom'
import TurnAddwardFrom from '../components/TurnAddwardFrom'
import { addLottery, getPrizeTypeById, updateLottery } from '@/api/operate/lottery.js'
export default {
  name: 'TurntableFrom',
  components: {
    upload, TurnMesFrom, TurnAddwardFrom
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 1,
      interactive: {
        addWard_dialogVisible: false,
        tableLoading: false,
        add_loading: false,
        loading: false
      },
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
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      },
      // 抽奖活动信息
      turnForm: {},
      tableData: [],
      //再来一次奖品
      recurPrize: {
        prizeImage: undefined,
        prizeName: '再来一次',
        totalNum: 0,
        winRatio: 0
      },
      // 是否选中再来一次奖品
      againChecked: false,
      // 未中奖
      nonePrize: {
        prizeName: undefined,
        prizeImage: undefined,
        remark: undefined
      },
      failedrules: {
        prizeName: [
          { required: true, message: '请输入未中奖名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入未中奖的提示语', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      prizesNum: 0//奖品数
    }
  },
  created() {
    if (this.$route.params.id) {
      this.lotteryId = this.$route.params.id
      this.$nextTick(() => {
        this.getPrizeTypeById(this.lotteryId)
      })
    }
  },
  methods: {
    // 去编辑奖品
    to_editAddWard(index) {
      this.$refs.addward.openAddWard()
      this.$nextTick(() => {
        this.$refs.addward.editAddWard(index)
      })
    },
    //去删除奖品
    to_deleteWard(index) {
      this.tableData.splice(index, 1)
    },
    // 去添加奖品(打开弹框)
    to_addWard() {
      this.$refs.addward.openAddWard()
    },
    // 获取活动信息组件的值
    getTurnMes(data) {
      if (data) {
        this.turnForm = data
        this.active++
      }
    },
    // 获取添加奖品组件的值
    funTable(data) {
      this.tableData = data
    },
    // 去下一步提交
    to_next_submit(nonePrize) {
      // 选中了再来一次
      if (this.againChecked) {
        if (this.$refs.againUpload.files.length === 0) {
          this.$message.warning('请上传再来一次的图片')
          return
        }
        if (!this.recurPrize.totalNum) {
          this.$message.warning('请输入再来一次的数量')
          return
        }
        if (!this.recurPrize.winRatio) {
          this.$message.warning('请输入再来一次的中奖概率')
          return
        }
      }
      this.recurPrize.totalNum = parseInt(this.recurPrize.totalNum)
      this.recurPrize.winRatio = Number(this.recurPrize.winRatio)
      // 计算奖品数量
      this.prizesNum = this.againChecked ? this.tableData.length + 2 : this.tableData.length + 1
      if (this.prizesNum < 6 || this.prizesNum === 7) {
        this.$message.warning('大转盘项目数需为6项或者8项')
        return
      }
      this.$refs.againUpload.getUploadParams()
      this.$refs.failUpload.getUploadParams()
      this.interactive.loading = true
      setTimeout(() => {
        this.$refs[nonePrize].validate((valid) => {
          if (valid) {
            this.interactive.loading = false
            this.addLottery()
          } else {
            this.interactive.loading = false
          }
        })
      }, 2000)
    },
    // 添加抽奖活动
    addLottery() {
      const againUploadParams = this.$refs.againUpload.uploadParams
      const failUploadParams = this.$refs.failUpload.uploadParams

      this.nonePrize.prizeImage = failUploadParams[0].imageURL
      this.recurPrize.prizeImage = againUploadParams[0].imageURL

      // console.log('tableData', this.tableData)
      // console.log('nonePrize', this.nonePrize)
      // console.log('againUpload', this.recurPrize)
      const data = {}
      Object.assign(data, this.turnForm)
      data.prizes = this.tableData
      data.nonePrize = this.nonePrize
      data.recurPrize = this.recurPrize
      console.log('data', data)
       
      if (this.lotteryId) {
        updateLottery(data).then(res => {
          this.$message.success('修改成功')
          this.$router.go(-1)
        })
      } else {
        addLottery(data).then(res => {
          this.$message.success('添加成功')
          this.$router.go(-1)
        })
      } 
    },
    // 根据ID查询奖品分类
    getPrizeTypeById(lotteryId) {
      getPrizeTypeById(lotteryId).then(res => {
        const resp = res.data.data
        this.tableData = resp.prizes
        this.nonePrize = resp.nonePrize
        this.recurPrize = resp.recurPrize

        this.$refs.failUpload.uploadImg(this.nonePrize.prizeImage)
        // 判断再来一次有值则选中
        if (Object.keys(this.recurPrize).length !== 0) {
          this.againChecked = true
          this.$refs.againUpload.uploadImg(this.recurPrize.prizeImage)
        } 
      })
    },
    // 去取消
    to_cancel() {
      this.$router.go(-1)
    },
    // 去上一步
    to_step() {
      this.active = 1
    }
  }
}
</script>

<style lang="scss" scoped type="text/scss">
.steps-content {
  margin-top: 15px;
  .demo-form {
    .el-form-item__content {
      .el-col {
        margin-bottom: 0;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .el-radio-group {
        .el-radio {
          display: table;
          margin-top:5px ;
        }
      }
    }
  }
}
.top-title {
  display: flex;
  justify-content: center;
}
.again-title {

}
.noward-set {
    margin-top: 20px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    label{
      text-align: left;
      font-weight: bold;
    }
    .noward-set-form {
      width: 500px;
   }
}

</style>
