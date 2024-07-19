<template>
  <div class="main-content">
    <div class="title">类型： {{ typeName }}</div>
    <div id="tableBtn">
      <el-button v-if="permissions.reason_add" type="primary" icon="el-icon-plus" @click="addReason()">新增原因</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="55" />
        <el-table-column label="原因">
          <template slot-scope="scope">
            <span>{{ scope.row.reason ? scope.row.reason : '/' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="展示">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-text="启用"
              inactive-text="停用"
              active-value="normal"
              inactive-value="disabled"
              @change="statusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="editReason(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 10px">
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </div>
    </div>

    <!-- 编辑/添加商户类型弹出框 -->
    <el-dialog
      :title="titleStatus === 'create'? '添加原因' : '编辑原因'"
      class="dialog"
      :visible.sync="dialogType"
      width="40%"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入原因" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button
          type="primary"
          @click="titleStatus==='create' ? submitForm('form'): updateForm('form')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'
import { getReasonPage, addReason, updateReason, disabledStatus, normalStatus } from '@/api/reason'
export default {
  components: { TablePagination },
  data() {
    return {
      tableLoading: false,
      type: 0,
      tableData: [],
      titleStatus: '',
      pagination: {
        current: 1, //页码
        size: 10, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      dialogType: false,
      form: {
        id: undefined,
        reason: undefined,
        status: 'normal', //默认启用  disabled禁用
        type: undefined
      },
      typeName: undefined,
      rules: {
        reason: [
          { required: true, message: '审核不通过原因不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    console.debug('this.$router.query.typeName', this.$route.query)
    this.typeName = this.$route.query.typeName
    this.form.type = this.$route.query.type
  },
  mounted() {
    this.getReasonList()
  },
  methods: {
    getList() {
      this.getReasonList()
    },
    // 分页获取门店类型列表
    getReasonList() {
      const data = {
        size: this.pagination.size,
        current: this.pagination.current,
        type: this.form.type
      }
      this.tableLoading = true
      getReasonPage(data).then(res => {
        this.tableLoading = false
        const page = res.data.data
        this.tableData = page.records
        this.pagination.total = page.total
        this.pagination.pages = page.pages
      }).catch(() => {
        this.tableLoading = false
      })
    },
    //开启和停用监听
    statusChange(val) {
      console.debug('val', val)
      if (val.status === 'normal') {
        this.to_normalReason(val.id)
      } else if (val.status === 'disabled') {
        this.to_disabledReason(val.id)
      }
    },
    // 停用审核不通过原因
    to_disabledReason(id) {
      disabledStatus(id).then(() => {
        this.$message.success('停用成功')
        this.getReasonList()
      })
    },
    //启用审核不通过原因
    to_normalReason(id) {
      normalStatus(id).then(() => {
        this.$message.success('启用成功')
        this.getReasonList()
      })
    },
    // 添加提交
    submitForm(form) {
      console.debug('this.form', this.form)
      this.$refs[form].validate((valid) => {
        if (valid) {
          addReason(this.form)
            .then(() => {
              this.$message.success('添加成功')
              this.dialogType = false
              this.getReasonList()
            })
            .catch(() => {
              this.$message.error('添加失败')
            })
        } else {
          return false
        }
      })
    },
    // 编辑提交
    updateForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          updateReason(this.form)
            .then(() => {
              this.$message.success('编辑成功')
              this.dialogType = false
              this.getReasonList()
            })
            .catch(() => {
              this.$message.error('编辑失败')
              this.dialogType = false
              this.getReasonList()
            })
        } else {
          return false
        }
      })
    },
    // 取消弹窗
    resetForm(formName) {
      this.dialogType = false
      this.$refs[formName].resetFields()
    },
    // 添加店铺审核原因
    addReason() {
      this.dialogType = true
      this.form = {
        id: undefined,
        reason: undefined,
        status: 'normal',
        type: this.form.type
      }
      this.titleStatus = 'create'
    },
    // 编辑店铺审核原因
    editReason(row) {
      this.dialogType = true
      this.titleStatus = 'update'
      this.form = {
        id: row.id,
        reason: row.reason,
        status: row.status,
        type: this.form.type
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  .title {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .businesstab {
    margin-top: 20px;
    .tabitem {
      display: inline-block;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      cursor: pointer;
    }
    .actionts {
      color: #0094ff;
      border-bottom: 2px solid #0094ff;
    }
  }
}

</style>
