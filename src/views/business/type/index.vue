<template>
  <div class="main-content">
    <div id="tableBtn">
      <el-button type="primary" icon="el-icon-plus" @click="addBusinessType()"
        >新增店铺类型</el-button
      >
    </div>
    <el-table
      v-loading="tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="typeName" label="店铺类型名称">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName ? scope.row.typeName : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="停用/启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="停用"
            active-value="normal"
            inactive-value="disabled"
            :disabled="!permissions.store_type_status"
            @change="statusChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="typeDesc" label="商户类型说明">
          <template slot-scope="scope">
            <span>{{ scope.row.typeDesc ? scope.row.typeDesc : '/' }}</span>
          </template>
        </el-table-column> -->
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="editBusinessType(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getList"
    />

    <!-- 编辑/添加商户类型弹出框 -->
    <el-dialog
      :title="titleStatus === 'create' ? '添加店铺类型' : '编辑店铺类型'"
      class="dialog"
      :visible.sync="dialogType"
      width="40%"
    >
      <el-form
        ref="typeForm"
        :model="typeForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="typeForm.typeName" placeholder="请输入类型名称" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('typeForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="
            titleStatus === 'create'
              ? submitForm('typeForm')
              : updateForm('typeForm')
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'
import {
  getStoreTypePage,
  addStoreType,
  editStoreType,
  deleteStoreType,
  updateStoreTypeStatus
} from '@/api/store/storeType'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableLoading: false,
      type: 0,
      tableData: [],
      pagination: {
        current: 1, //页码
        size: 10, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      },
      dialogType: false,
      typeForm: {
        typeName: null,
        typeId: undefined
      },
      rules: {
        typeName: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ]
      },
      titleStatus: 'create'
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.initPageStore()
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
        187
      }px)`
    },
    getList() {
      this.initPageStore()
    },
    // 分页获取门店类型列表
    initPageStore() {
      const params = {
        size: this.pagination.size,
        current: this.pagination.current
      }
      this.tableLoading = true
      getStoreTypePage(params)
        .then(resp => {
          console.log(resp.data.data)
          this.tableLoading = false
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.pagination.pages = page.pages
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    //开启和停用监听(修改门店类型状态)
    statusChange(val) {
      const data = {
        typeId: val.typeId,
        status: val.status
      }
      let title = ''
      if (val.status === 'normal') {
        title = '启用成功'
      } else if (val.status === 'disabled') {
        title = '停用成功'
      }
      updateStoreTypeStatus(data).then(() => {
        this.$message.success(title)
        this.initPageStore()
      })
    },
    // 提交
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          addStoreType(_this.typeForm).then(() => {
            _this.$message({
              message: '添加成功',
              type: 'success'
            })
            _this.dialogType = false
            _this.initPageStore()
          })
        } else {
          return false
        }
      })
    },
    // 编辑提交
    updateForm(formName) {
      const _this = this
      _this.$refs[formName].validate(valid => {
        if (valid) {
          editStoreType(_this.typeForm).then(() => {
            _this.$message({
              message: '编辑成功',
              type: 'success'
            })
            _this.dialogType = false
            _this.initPageStore()
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
    // 添加商户类型
    addBusinessType() {
      if (this.$store.getters.permissions.store_type_add) {
        this.typeForm = {
          typeName: null,
          typeId: undefined
        }
        this.dialogType = true
        this.titleStatus = 'create'
      } else {
        const h = this.$createElement
        this.$message({
          showClose: true,
          message: h('p', null, [
            h('span', null, '抱歉，您尚未具备 '),
            h('i', { style: 'color: teal' }, '添加商户类型'),
            h('span', null, ' 的操作权限 ')
          ]),
          type: 'error'
        })
      }
    },
    // 编辑
    editBusinessType(val) {
      console.log(val)
      if (this.$store.getters.permissions.store_type_edit) {
        this.dialogType = true
        this.titleStatus = 'update'
        this.typeForm = {
          typeName: val.typeName,
          typeDesc: val.typeDesc,
          typeId: val.typeId
        }
      } else {
        const h = this.$createElement
        this.$message({
          showClose: true,
          message: h('p', null, [
            h('span', null, '抱歉，您尚未具备 '),
            h('i', { style: 'color: teal' }, '编辑商户类型'),
            h('span', null, ' 的操作权限 ')
          ]),
          type: 'error'
        })
      }
    },
    // 删除
    handleDelete(no, id) {
      const _this = this
      if (_this.$store.getters.permissions.store_type_del) {
        _this
          .$confirm('此操作将永久删除该商户类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            deleteStoreType(id)
              .then(() => {
                _this.$message({
                  type: 'success',
                  message: '删除成功!',
                  onClose: function () {
                    _this.initPageStore()
                  }
                })
              })
              .catch(e => {
                console.error(e)
              })
          })
          .catch(() => {
            _this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        const h = _this.$createElement
        _this.$message({
          showClose: true,
          message: h('p', null, [
            h('span', null, '抱歉，您尚未具备 '),
            h('i', { style: 'color: teal' }, '删除商户类型'),
            h('span', null, ' 的操作权限 ')
          ]),
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
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
  // 弹出框input框长度
  // .el-input__inner{
  //   width: 200px;
  // }
  // 弹出框文本域长度
  // .el-textarea__inner
  // {
  //   width: 250px;
  // }
}
</style>
