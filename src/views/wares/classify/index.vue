/** * 商品分类 */
<template>
  <div class="main-content classify">
    <div id="tableBtn" v-if="permissions.cate_add">
      <el-button type="primary" @click="handleAdd">添加分类</el-button>
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :height="tableHeight"
    >
      <el-table-column prop="cateName" label="商品类型名称"> </el-table-column>
      <el-table-column label="停用/启用" align="center">
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.isSwitch === false"
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="停用"
            active-value="normal"
            inactive-value="disabled"
            :disabled="!permissions.cate_status_edit"
            @change="switchStatus($event, scope.row.cateId)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.cate_add && scope.row.parentId == '-1'"
            type="text"
            size="mini"
            style="color: #409eff"
            @click="createAdd(scope.row)"
            >添加子类</el-button
          >
          <el-button
            v-if="permissions.cate_edit"
            type="text"
            size="mini"
            style="color: #409eff"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
        <el-form-item label="类型名称" prop="cateName">
          <el-input v-model="temp.cateName" placeholder="请输入类型名称" />
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

import {
  reqCateTree,
  addCate,
  upCate,
  upCateStatus
} from '@/api/product/classify'

export default {
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableData: [],
      dialogStatus: '',
      textMap: {
        update: '修改商品分类',
        create: '新增商品分类'
      },
      temp: {
        cateImg: undefined,
        cateName: undefined,
        parentId: undefined,
        sort: undefined
      },
      //表示参数类
      parameter: {
        isLazy: undefined,
        parentId: undefined
      },
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogFormVisible: false
      },

      rules: {
        cateName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
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
        145
      }px)`
    },
    // 查询列表
    getSearch() {
      const _this = this
      _this.interactive.tableLoading = true
      const listQuery = Object.assign({}, _this.parameter)
      reqCateTree(listQuery)
        .then(resp => {
          const list = resp.data.data
          list.forEach(item => {
            // 处理本级
            item.isSwitch = false
            if (item.children && item.children.length > 0) {
              // 处理下级
              if (item.status === 'normal') {
                _this.findChildren(item.children, false)
              } else {
                _this.findChildren(item.children, true)
              }
            }
          })
          _this.tableData = list
          _this.interactive.tableLoading = false
        })
        .catch(() => {
          _this.interactive.tableLoading = false
        })
    },
    // 设置子级
    findChildren(list, checked) {
      list.forEach(child => {
        child.isSwitch = checked
        if (child.children && child.children.length > 0) {
          // 处理下级
          if (child.status === 'normal') {
            this.findChildren(child.children, false)
          } else {
            this.findChildren(child.children, true)
          }
          // this.findChildren(child.children, checked)
        }
      })
    },
    // 新增类型
    resetTemp() {
      this.temp = {
        cateImg: undefined,
        cateName: undefined,
        parentId: undefined,
        sort: undefined
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
    createAdd(row) {
      this.resetTemp()
      this.temp = {
        cateImg: undefined,
        cateName: undefined,
        parentId: row.id,
        sort: undefined
      }
      this.dialogStatus = 'create'
      this.interactive.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    async createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addCate(this.temp)
            .then(() => {
              this.getSearch()
              this.interactive.dialogFormVisible = false
              this.$message({
                message: '新增商品分类 “' + this.temp.cateName + '” 成功！',
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
      this.temp = {
        cateImg: row.cateImg,
        cateName: row.cateName,
        cateId: row.cateId,
        sort: row.sort
      }
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
          upCate(tempData).then(() => {
            this.getSearch()
            this.interactive.dialogFormVisible = false
            this.$message({
              message: '商品分类修改为 “' + this.temp.cateName + '” 成功！',
              type: 'success'
            })
          })
        }
      })
    },

    // 启用/停用
    switchStatus(val, va) {
      const data = {
        cateId: va,
        status: val
      }
      upCateStatus(data)
        .then(() => {
          this.getSearch()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        })
        .catch(() => {
          this.getSearch()
        })
    }
  }
}
</script>

<style scoped lang="scss"></style>
