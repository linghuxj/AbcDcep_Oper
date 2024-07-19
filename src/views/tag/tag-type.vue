<template>
  <div class="main-content">
    <el-button
      v-if="permissions.user_tag_type_add"
      type="primary"
      @click="addFun"
      >新增标签类型</el-button
    >
    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :data="tableData"
        border
        :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="75">
        </el-table-column>
        <el-table-column
          v-for="(item, idx) in tableArr"
          :key="idx"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <el-switch
              v-if="item.type == 'status' && permissions.user_tag_type_status"
              v-model="scope.row[item.value]"
              active-text="启用"
              inactive-text="停用"
              @change="statusChange($event, scope.row)"
            >
            </el-switch>
            <span v-else>
              {{ scope.row[item.value] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="permissions.user_tag_type_edit"
              type="text"
              @click="editFun(scope.row)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="interactive.dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="ruleForm" ref="ruleForm">
        <el-form-item
          prop="typeName"
          :rules="[
            { required: true, message: '请输入标签类型名称', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="ruleForm.typeName"
            placeholder="请输入标签类型名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import {
  getTagTypeList,
  addTagType,
  editTagType,
  changeTypeStatus,
  getTagTypeContent
} from '@/api/tag/tag'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格列配置
      tableArr: [
        {
          label: '标签类型',
          value: 'typeName'
        },
        {
          label: '启用/停用',
          value: 'status',
          type: 'status',
          width: 180
        },
        {
          label: '操作人',
          value: 'createBy'
        },
        {
          label: '操作时间',
          value: 'createTime'
        }
      ],
      // 表格数据
      tableData: [],
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogVisible: false
      },
      // 弹窗标题
      dialogTitle: '新增标签类型',
      // 提交数据表单
      ruleForm: {
        typeName: undefined
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    getList() {
      this.interactive.tableLoading = true
      getTagTypeList(this.pagination).then(response => {
        this.tableData = response.data.data.records
        this.tableData.forEach(item => {
          if (item.status == 'normal') {
            item.status = true
          } else {
            item.status = false
          }
        })
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.interactive.tableLoading = false
        }, 0.1 * 1000)
      })
    },
    // 新增按钮触发
    addFun() {
      this.dialogTitle = '新增标签类型'
      this.ruleForm = {
        typeName: undefined
      }
      this.interactive.dialogVisible = true
    },
    // 编辑按钮触发
    editFun(rowData) {
      getTagTypeContent(rowData.typeId).then(res => {
        this.ruleForm = {
          typeId: res.data.data.typeId,
          typeName: res.data.data.typeName
        }
      })
      this.dialogTitle = '修改标签类型'
      this.interactive.dialogVisible = true
    },
    // 新增/修改方法
    submitFun() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.dialogTitle == '新增标签类型') {
            addTagType(this.ruleForm).then(res => {
              if (res.data.data == true) {
                this.$message.success('新增标签类型成功')
                this.getList()
                this.interactive.dialogVisible = false
              }
            })
          } else if (this.dialogTitle == '修改标签类型') {
            editTagType(this.ruleForm).then(res => {
              if (res.data.data == true) {
                this.$message.success('修改标签类型成功')
                this.getList()
                this.interactive.dialogVisible = false
              }
            })
          }
        }
      })
    },
    statusChange(val, rowData) {
      let status = 'normal'
      if (val) {
        status = 'normal'
      } else {
        status = 'disabled'
      }
      changeTypeStatus({ status, typeId: rowData.typeId }).then(res => {
        if (res.data.data == true) {
          this.$message.success('标签状态修改成功')
          this.getList()
        }
      })
    }
  }
}
</script>
<style scoped>
.center_deliverGoods {
  margin-top: 10px;
}
</style>
