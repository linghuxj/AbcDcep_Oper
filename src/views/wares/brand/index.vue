<template>
  <div class="main-content">
    <div id="tableBtn" v-if="permissions.brand_add">
      <el-button type="primary" @click="handleAdd">新增品牌</el-button>
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">
          <span>{{
            scope.$index + (pagination.current - 1) * pagination.size + 1
          }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="brandName" label="品牌名称" />
      <el-table-column label="停用/启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="停用"
            active-value="normal"
            inactive-value="disabled"
            :disabled="!permissions.brand_status_edit"
            @change="handleSwitch($event, scope.row.brandId)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.brand_edit"
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getSearch"
    />
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="interactive.dialogFormVisible"
      width="40%"
    >
      <el-form
        ref="dataForm"
        :model="temp"
        :rules="rules"
        label-position="left"
        label-width="110px"
      >
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="temp.brandName" placeholder="请输入品牌名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'

import {
  reqBrandPage,
  addBrand,
  upBrand,
  upBrandStatus
} from '@/api/product/brand'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableData: [],
      dialogStatus: '',
      textMap: {
        update: '修改品牌',
        create: '新增品牌'
      },
      temp: {
        brandId: undefined,
        brandName: ''
      },
      //表示参数类
      parameter: {
        brandName: undefined,
        status: undefined
      },
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogFormVisible: false
      },

      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      rules: {
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getSearch()
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
    })
  },
  methods: {
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.countHeight()
      }
    },
    // 计算表格高度
    countHeight() {
      // 监听视口宽度变化
      let demoForm = document.getElementById('demo-form-inline')
      let tableBtn = document.getElementById('tableBtn')
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`
    },
    // 查询列表
    getSearch() {
      this.interactive.tableLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      reqBrandPage(listQuery)
        .then(resp => {
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.interactive.tableLoading = false
        })
        .catch(() => {
          this.interactive.tableLoading = false
        })
    },
    // 新增类型
    resetTemp() {
      this.temp = {
        brandId: undefined,
        brandName: ''
      }
    },
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.interactive.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    async createData() {
      // await this.$refs.upload.getUploadParams()
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addBrand(this.temp)
            .then(() => {
              this.getSearch()
              this.interactive.dialogFormVisible = false
              this.$message({
                message: '新增品牌名称 “' + this.temp.brandName + '” 成功',
                type: 'success'
              })
            })
            .catch(e => {
              console.error(e)
            })
        }
      })
    },
    // 编辑弹窗
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.interactive.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          upBrand(tempData).then(() => {
            this.getSearch()
            this.interactive.dialogFormVisible = false
            this.$message({
              message: '商品品牌修改为 “' + this.temp.brandName + '” 成功',
              type: 'success'
            })
          })
        }
      })
    },
    // 开启/关闭精选
    handleSwitch(val, va) {
      const data = {
        brandId: va,
        status: val
      }
      upBrandStatus(data)
        .then(() => {
          this.getSearch()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        })
        .catch(e => {
          console.error(e)
          this.getSearch()
        })
    }
  }
}
</script>

<style scoped lang="scss">
.content-wrap {
  display: flex;
  height: 100px;
  line-height: 100px;
  flex-direction: column;
  justify-content: center;
}
</style>
