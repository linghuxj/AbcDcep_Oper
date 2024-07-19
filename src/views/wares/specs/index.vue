/** * 规格管理 */
<template>
  <div class="main-content">
    <div id="tableBtn" v-if="permissions.spec_add">
      <el-button type="primary" @click="handleAdd">新增规格项</el-button>
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="序号" align="center" width="100">
        <template slot-scope="scope">
          <span>{{
            scope.$index + (pagination.current - 1) * pagination.size + 1
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="规格名称" width="300">
        <template slot-scope="scope">
          <span>{{ scope.row.specName ? scope.row.specName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格值" width="150">
        <template slot-scope="scope">
          <span>{{
            scope.row.valueDefault ? scope.row.valueDefault : '--'
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" width="150">
          <template slot-scope="scope">
            <el-button v-if="scope.$index !== 0" type="text" size="mini" icon="el-icon-top" style="color:#409eff" @click="handleUpdate(scope.row)"></el-button>
            <el-button v-if="(scope.$index+(pagination.current - 1) * pagination.size + 1) !== pagination.total" type="text" size="mini" icon="el-icon-bottom" style="color:#409eff" @click="handleUpdate(scope.row)"></el-button>
          </template>
        </el-table-column> -->
      <el-table-column prop="time" label="停用/启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="停用"
            active-value="normal"
            inactive-value="disabled"
            :disabled="!permissions.spec_status_edit"
            @change="switchStatus($event, scope.row.specId)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.spec_edit"
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
        label-width="80px"
      >
        <el-form-item label="规格名称" prop="specName">
          <el-input v-model="temp.specName" placeholder="请输入规格名称" />
        </el-form-item>
        <el-form-item label="规格值" required>
          <el-tag
            v-for="(item, index) in specValueArr"
            :key="index"
            closable
            style="margin-right: 10px"
            @close="delSpecTag(index)"
            >{{ item }}</el-tag
          >
          <el-input
            v-if="specValueArr.length < 10"
            v-model="temp.inputValue"
            style="width: 200px"
            placeholder="请输入单个规格值"
          >
            <el-button
              slot="append"
              type="primary"
              @click="addSpecTag(temp.inputValue)"
              >添加</el-button
            >
          </el-input>
          <!-- <el-input v-model="temp.valueDefault" placeholder="请输入规格值" />
          <span style="color: #C0C4CC;">每个规格值，通过符号<a style="color: red;">;</a>分隔，示例：L;M;ML</span> -->
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
  reqSpecsPage,
  addSpecs,
  upSpecs,
  upSpecStatus
} from '@/api/product/specs'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 规格值
      specValueArr: [],
      tableData: [],
      dialogStatus: '',
      textMap: {
        update: '修改规格',
        create: '新增规格'
      },
      temp: {
        specId: undefined,
        specName: '',
        valueDefault: '',
        inputValue: undefined
      },
      //表示参数类
      parameter: {
        specName: undefined,
        cateId: undefined,
        specType: undefined
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
        specName: [
          { required: true, message: '请输入规格名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        valueDefault: [
          { required: true, message: '请输入规格值', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
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
      reqSpecsPage(listQuery)
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
        specId: undefined,
        specName: '',
        valueDefault: '',
        inputValue: undefined
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
      this.temp.valueDefault = this.specValueArr.join(';')
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addSpecs(this.temp)
            .then(() => {
              this.getSearch()
              this.interactive.dialogFormVisible = false
              this.$message({
                message: '新增规格信息成功！',
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
      this.specValueArr = row.valueDefault.split(';')
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.interactive.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      this.temp.valueDefault = this.specValueArr.join(';')
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          upSpecs(tempData).then(() => {
            this.getSearch()
            this.interactive.dialogFormVisible = false
            this.$message({
              message: '修改规格信息成功！',
              type: 'success'
            })
          })
        }
      })
    },
    // 切换状态
    switchStatus(val, va) {
      const data = {
        specId: va,
        status: val
      }
      upSpecStatus(data)
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
    },
    // 规格处理
    // 删除规格属性
    delSpecTag(index) {
      this.specValueArr.splice(index, 1)
    },
    // 添加规格属性
    addSpecTag(val) {
      if (!val) {
        this.$message.error('名称不能为空，请注意填写')
        return
      }
      if (this.specValueArr.length > 9) {
        this.$message.error('规格值不能多于10项！')
        return
      }
      this.specValueArr.forEach(item => {
        if (item === val) {
          this.$message.error('该规格值已存在，请重新输入')
          return
        }
      })
      this.specValueArr.push(val)
      this.temp.inputValue = ''
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
