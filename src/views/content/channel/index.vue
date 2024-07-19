<template>

  <div class="main-content topic">
    <el-form
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="渠道id：">
        <el-input
          v-model="parameter.tagName"
          style="width: 200px"
          placeholder="请输入渠道id"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道名称：">
        <el-input
          v-model="parameter.username"
          style="width: 200px"
          placeholder="请输入渠道名称"
        ></el-input>
      </el-form-item>
      <div>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="getList('search')"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>
    <div
      v-if="permissions.tag_add"
      id="tableBtn"
    >
      <el-button type="primary" @click="dialogVisible = true"
        >新增渠道</el-button
      >
    </div>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <span >
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.topic_sku_update"
            size="small"
            type="text"
            @click="relatedSpec(scope.row)"
            >编辑
          </el-button>
          <el-button
            v-if="permissions.topic_cancel"
            size="small"
            type="text"
            @click="relatedDelete(scope.row.productId)"
            >删除
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
    <!-- 弹窗 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="ruleForm" ref="ruleForm">
        <el-form-item
          prop="tagName"
          :rules="[
            { required: true, message: '请输入话题名称', trigger: 'blur' }
          ]"
        >
          <el-input
            v-model="ruleForm.tagName"
            placeholder="请输入话题名称"
          ></el-input>
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
import { tagPage, addTag } from '@/api/topic/index'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表格列配置
      tableArr: [
        {
          label: '平台',
          value: 'tagName'
        },
        {
          label: '渠道',
          level: 2,
          value: 'tagName',
          width: 200
        },
        {
          label: '渠道id',
          value: 'createTime',
          width: 240
        },

      ],
      // 加载状态
      tableLoading: false,
      // 表格数据
      tableData: [],
      //表示参数类
      parameter: {
        // 渠道id
        channelId: '',
        // 渠道名称
        channelName: '',

      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      // 弹窗展示控制
      dialogVisible: false,
      // 提交数据表单
      ruleForm: {
        tagName: ''
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
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      tagPage(listQuery).then(response => {
        this.tableData = response.data.data.records
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.tableLoading = false
        }, 0.1 * 1000)
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
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        190
      }px)`
    },
    tabChange() {
      this.getList('search')
    },
    submitFun() {
      addTag(this.ruleForm).then(res => {
        if (res) {
          this.$message.success('新增主题话题成功')
          this.reset()
          this.dialogVisible = false
        }
        console.log(res)
      })
    },
    //重置
    reset() {
      //表示参数类
      this.parameter = {
        tagName: '',
        username: '',
        tagSource: 'platform'
      }
      this.getList('search')
    }
  }
}
</script>
<style lang="scss" scoped></style>
