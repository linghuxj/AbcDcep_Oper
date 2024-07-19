<template>
  <!-- 商圈标签/推荐词 -->
  <div class="main-content tag">
    <div v-if="permissions.tag_add" id="tableBtn">
      <el-button type="primary" @click="addTag">新增推荐词</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.tableType === 'img'">
            <el-image
              style="height: 50px"
              :src="scope.row[item.value]"
              fit="scale-down"
              :preview-src-list="[scope.row[item.value]]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </template>
          <span v-else-if="item.level == 2">
            {{ scope.row[item.value[0]][item.value[1]] }}
          </span>
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="editTag(scope.row)"> 编辑 </el-button>
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
    <!-- 弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="45%"
      :close-on-click-modal="false"
    >
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules">
        <el-form-item label="推荐词名称：" prop="tagName">
          <el-input
            v-model="ruleForm.tagName"
            placeholder="请输入推荐词名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="推荐词图标：" prop="tagImage">
          <upload-file
            v-if="dialogVisible"
            ref="upload"
            v-model="ruleForm.tagImage"
            :limit="1"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { tagPage, addTag, editTag, getTagDistrict } from '@/api/commerce/tag'
import UploadFile from '@/components/Upload-File/upload'
export default {
  components: { TablePagination, UploadFile },
  data() {
    return {
      // 校验规则
      rules: {
        tagName: [
          { required: true, message: '请输入推荐词名称', trigger: 'blur' }
        ],
        tagImage: [
          { required: true, message: '请上传推荐词图标', trigger: 'blur' }
        ]
      },
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表格列配置
      tableArr: [
        {
          label: '推荐词',
          value: 'tagName'
        },
        {
          label: '推荐图标',
          tableType: 'img',
          value: 'tagImage'
        },
        {
          label: '操作人',
          value: 'createUserName'
        },
        {
          label: '操作时间',
          value: 'createTime',
          width: 240
        }
      ],
      // 加载状态
      tableLoading: false,
      // 表格数据
      tableData: [],
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      // 弹窗展示控制
      dialogVisible: false,
      // 弹窗标题
      dialogTitle: '新增推荐词',
      // 提交数据表单
      ruleForm: {
        tagId: undefined,
        // 名称
        tagName: '',
        // 接口传参img路径
        tagImage: ''
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight()
      this.watchWidth()
    })
  },
  methods: {
    getList(type) {
      this.tableLoading = true
      if (type === 'search') {
        this.pagination.current = 1
      }
      // 拼接请求参数
      tagPage(this.pagination).then(response => {
        this.tableData = response.data.data.records
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.tableLoading = false
        }, 100)
      })
    },
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
      let tabs = 55
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight - 20 : 0) +
        tabs +
        190
      }px)`
    },
    // 新增按钮触发
    addTag() {
      this.dialogTitle = '新增推荐词'
      this.ruleForm = {
        tagId: undefined,
        tagName: '',
        tagImage: ''
      }
      this.dialogVisible = true
    },
    // 编辑按钮触发
    editTag(rowData) {
      getTagDistrict(rowData.tagId).then(res => {
        this.ruleForm = {
          tagId: res.data.data.tagId,
          tagName: res.data.data.tagName,
          tagImage: res.data.data.tagImage
        }
        this.$refs.upload.loadImg(this.ruleForm.tagImage)
      })
      this.dialogTitle = '修改推荐词'
      this.dialogVisible = true
    },
    submitFun() {
      this.ruleForm.tagImage = this.$refs.upload.imgURL[0]
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.dialogTitle == '新增推荐词') {
            addTag(this.ruleForm).then(res => {
              if (res.data.data == true) {
                this.$message.success('新增推荐词成功')
                this.getList()
                this.dialogVisible = false
              }
            })
          } else if (this.dialogTitle == '修改推荐词') {
            editTag(this.ruleForm).then(res => {
              if (res.data.data == true) {
                this.$message.success('修改推荐词成功')
                this.getList()
                this.dialogVisible = false
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
