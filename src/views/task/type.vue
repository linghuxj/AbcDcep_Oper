<template>
  <div class="main-content task-type">
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column label="任务业务类型" prop="typeName" />
      <el-table-column label="任务类型说明" prop="typeDesc" />
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="editTask(scope.row)"> 编辑 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改任务 -->
    <el-dialog title="分享任务" :visible.sync="taskVisible" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
      >
        <el-form-item label="任务类型名称：">
          {{ ruleForm.typeName }}
        </el-form-item>
        <el-form-item label="任务类型说明：" prop="typeDesc">
          <el-input type="textarea" v-model="ruleForm.typeDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upTaskType">确 认</el-button>
        <el-button @click="taskVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTaskTypePage, upTaskType } from '@/api/task/type'
export default {
  data() {
    return {
      rules: {
        typeDesc: [
          { required: true, message: '请输入任务类型说明', trigger: 'blur' }
        ]
      },
      tableLoading: false,
      tableData: [],
      taskVisible: false,
      ruleForm: {
        // 任务id
        typeId: '',
        // 任务类型名称
        typeName: '',
        // 描述
        typeDesc: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableLoading = true
      getTaskTypePage().then(res => {
        this.tableData = res.data.data.records
        this.tableLoading = false
      })
    },
    editTask(rowData) {
      this.ruleForm.typeId = rowData.typeId
      this.ruleForm.typeName = rowData.typeName
      this.ruleForm.typeDesc = rowData.typeDesc
      this.taskVisible = true
    },
    upTaskType() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          upTaskType(this.ruleForm).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.taskVisible = false
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
