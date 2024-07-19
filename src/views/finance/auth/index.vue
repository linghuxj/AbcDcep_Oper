/** * 用户实名认证 */
<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="创客搜索：">
        <el-input
          v-model="search.searchValue"
          placeholder="请输入内容"
          style="width: 100%"
          class="input-with-select"
        >
          <el-select
            v-model="search.searchType"
            placeholder="请选择"
            slot="prepend"
          >
            <el-option label="创客用户名" value="userName"></el-option>
            <el-option label="创客真实姓名" value="realName"></el-option>
            <el-option label="创客手机号" value="mobile"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="提交时间：">
        <el-date-picker
          v-model="search.time"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="timeChange"
        >
        </el-date-picker>
      </el-form-item>
      <div>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-form>

    <el-tabs v-model="parameter.activeName" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="audit"> </el-tab-pane>
      <el-tab-pane label="审核已通过" name="passed"> </el-tab-pane>
      <el-tab-pane label="审核未通过" name="failed"> </el-tab-pane>
    </el-tabs>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column label="用户信息">
        <template slot-scope="scope">
          <span>{{
            scope.row.user.username ? scope.row.user.username : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="认证信息">
        <template slot-scope="scope">
          <div>{{ scope.row.realName ? scope.row.realName : '--' }}</div>
          <div>{{ scope.row.idCard ? scope.row.idCard : '--' }}</div>
          <div>{{ scope.row.mobile ? scope.row.mobile : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="cardFront" label="人像页">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.cardFront"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="cardBack" label="国徽页">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.cardBack"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间" />
      <el-table-column
        v-if="parameter.activeName !== 'audit'"
        key="updateTime"
        label="审核时间"
      >
        <template slot-scope="scope">
          {{scope.row.updateTime?scope.row.updateTime:'--'}}
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-if="parameter.activeName === 'failed'"
        key="reason"
        prop="remark"
        label="原因"
      /> -->
      <el-table-column
        v-if="permissions.withdraw_status_edit"
        label="操作"
        width="100"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 'audit'"
            type="text"
            size="mini"
            @click="openToExaminePopup(scope.row)"
            >
            审核</el-button>
            <span v-else>--</span>
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
    <el-dialog
      title="实名认证审核"
      :visible.sync="interactive.dialogVisible"
      width="50%"
    >
      <el-form :model="temp" label-width="100px">
        <el-form-item label="认证信息：">
          <div>{{ temp.realName }}</div>
          <div>{{ temp.idNo }}</div>
          <div>{{ temp.mobile }}</div>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-radio-group v-model="temp.status">
            <el-radio label="passed">审核通过</el-radio>
            <el-radio label="failed">审核不通过</el-radio>
          </el-radio-group>
          <el-input
            v-if="temp.status === 'failed'"
            v-model="temp.remark"
            type="textarea"
            placeholder="填写审核不通过原因"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitToExamine()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { getAuthPage, updateAuditAuth } from '@/api/finance/auth.js'

export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      payStatusAll: [],
      //表示参数类
      search: {
        searchType: undefined,
        searchValue: undefined,
        time: []
      },
      parameter: {
        withdrawOrderId: undefined,
        payStatus: undefined,
        // audit-待审核  passed-审核通过   failed-审核未通过
        activeName: 'audit'
      },
      tableData: [],
      // 操作类型
      interactive: {
        tableLoading: false,
        dialogVisible: false
      },
      temp: {
        remark: undefined,
        status: undefined,
        id: undefined,
        mobile: undefined,
        realName: undefined,
        idNo: undefined
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
      let tabs = 55
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        190
      }px)`
    },
    // 查询列表
    getList() {
      const parameter = {}
      if (this.search.searchType) {
        parameter[this.search.searchType] = this.search.searchValue
      }
      if (this.search.time && this.search.time.length > 0) {
        parameter.startUpdateTime = this.search.time[0]
        parameter.endUpdateTime = this.search.time[1]
      }
      parameter.status = this.parameter.activeName
      parameter.size = this.pagination.size
      parameter.current = this.pagination.current
      this.interactive.tableLoading = true
      getAuthPage(parameter)
        .then(resp => {
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.interactive.tableLoading = false
        })
        .catch(e => {
          console.error(e)
          this.interactive.tableLoading = false
        })
    },
    timeChange(time) {
      if (!time) {
        this.parameter.startUpdateTime = undefined
        this.parameter.endUpdateTime = undefined
      }
    },
    // 重置
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined,
        time: []
      }
      this.parameter= {
        withdrawOrderId: undefined,
        payStatus: undefined,
        // audit-待审核  passed-审核通过   failed-审核未通过
      },
      this.getList()
    },
    // tab 切换
    handleClick() {
      this.tableHeight = 'calc(100vh - 335px)'
      this.getList()
      setTimeout(() => {
        this.countHeight()
      }, 500)
    },
    // 打开审核弹窗
    openToExaminePopup(val) {
      this.temp = {
        remark: undefined,
        status: undefined,
        id: val.id,
        mobile: val.mobile,
        realName: val.realName,
        idNo: val.idNo
      }
      this.interactive.dialogVisible = true
    },
    // 提交审核结果
    submitToExamine() {
      if (!this.temp.status) {
        this.$message.error('请选择审核结果!')
        return false
      }
      if (this.temp.status === 'failed') {
        if (!this.temp.remark) {
          this.$message.error('请填写审核不通过原因!')
          return false
        }
      }
      const data = {
        id: this.temp.id,
        remark: this.temp.remark,
        status: this.temp.status
      }
      updateAuditAuth(data).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功！'
        })
        this.interactive.dialogVisible = false
        this.getList()
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
