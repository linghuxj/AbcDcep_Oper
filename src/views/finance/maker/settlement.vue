<template>
  <!-- 话题列表 -->
  <div class="main-content settlement">
    <el-form
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="用户搜索：">
        <el-input
          v-model="parameter.searchValue"
          placeholder="请输入内容"
          style="width: 100%"
        >
          <el-select
            v-model="parameter.searchType"
            placeholder="请选择"
            slot="prepend"
          >
            <el-option label="姓名" value="fullName"></el-option>
            <el-option label="手机号" value="mobile"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="推广业务名称：">
        <el-input
          v-model="parameter.taskName"
          style="width: 200px"
          placeholder="请输入推广业务名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="任务完成时间：">
        <el-date-picker
          v-model="datetime"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
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
    <el-tabs v-model="parameter.state" @tab-click="tabChange">
      <el-tab-pane label="待生成台账" name="generat" />
      <el-tab-pane label="已生成台账" name="generated" />
    </el-tabs>
    <div
      v-if="parameter.state == 'generat'"
      id="tableBtn"
      style="overflow: hidden; margin-top: 0"
    >
      <el-button style="float: right" type="warning" @click="getAccountList"
        >生成台账</el-button
      >
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
      :span-method="objectSpanMethod"
    >
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.tableType === 'img'">
            <div class="imgText">
              <span>
                推广人姓名：{{
                  scope.row.promoter ? scope.row.promoter['realName'] : '--'
                }}
              </span>
              <span>
                手机号：{{
                  scope.row.promoter ? scope.row.promoter['mobile'] : '--'
                }}
              </span>
              <span>
                推广人身份证号：{{
                  scope.row.promoter ? scope.row.promoter['idCard'] : '--'
                }}
              </span>
            </div>
          </template>
          <span v-else-if="item.level == 2">
            {{
              scope.row[item.value[0]]
                ? scope.row[item.value[0]][item.value[1]] || '--'
                : '--'
            }}
          </span>
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="parameter.state == 'generated'"
        label="操作"
        width="120"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row)">
            台账明细
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
    <!-- 台账生成弹窗 -->
    <el-dialog
      title="台账生成"
      :visible.sync="dialogVisible"
      width="75%"
      :close-on-click-modal="false"
      center
    >
      <el-form>
        <el-form-item label="任务完成时间：">
          <el-date-picker
            v-model="dialogTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="timeChange"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="tableLoading"
        :data="dialogTable"
        border
        :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
        tooltip-effect="dark"
      >
        <el-table-column
          v-for="(item, idx) in dialogTableArr"
          :key="idx"
          :label="item.label"
          :width="item.width ? item.width : ''"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.tableType === 'img'">
              <div class="imgText">
                <span>
                  推广人姓名：{{
                    scope.row.promoter ? scope.row.promoter['realName'] : '--'
                  }}
                </span>
                <span>
                  手机号：{{
                    scope.row.promoter ? scope.row.promoter['mobile'] : '--'
                  }}
                </span>
                <span>
                  推广人身份证号：{{
                    scope.row.promoter ? scope.row.promoter['idCard'] : '--'
                  }}
                </span>
              </div>
            </template>
            <span v-else-if="item.level == 2">
              {{
                scope.row[item.value[0]]
                  ? scope.row[item.value[0]][item.value[1]] || '--'
                  : '--'
              }}
            </span>
            <span v-else>
              {{ scope.row[item.value] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <p style="text-align: right" v-if="dialogTable.length > 0">
        总应付金额（元）：{{ dialogTable.amountSum }}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="generate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 台账明细弹窗 -->
    <el-dialog
      :title="(rowData.name || '') + '台账明细'"
      :visible.sync="isVisible"
      width="90%"
      :close-on-click-modal="false"
      center
    >
      <div
        v-if="tzDownloadList.length > 0"
        style="margin-bottom: 10px; text-align: right"
      >
        <el-button type="primary" @click="potentialExport">导出</el-button>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tzDownloadList"
        border
        :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
        tooltip-effect="dark"
      >
        <el-table-column
          v-for="(item, idx) in tzDownloadArr"
          :key="idx"
          :label="item.label"
          :width="item.width ? item.width : ''"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <template v-if="item.tableType === 'img'">
              <div class="imgText">
                <span>
                  推广人姓名：{{
                    scope.row.promoter ? scope.row.promoter['realName'] : '--'
                  }}
                </span>
                <span>
                  手机号：{{
                    scope.row.promoter ? scope.row.promoter['mobile'] : '--'
                  }}
                </span>
                <span>
                  推广人身份证号：{{
                    scope.row.promoter ? scope.row.promoter['idCard'] : '--'
                  }}
                </span>
              </div>
            </template>
            <template v-else-if="item.tableType === 'fullUser'">
              <div class="imgText">
                <span>
                  姓名：{{ scope.row.store ? scope.row.store.fullName : '--' }}
                </span>
                <span>
                  手机号：{{ scope.row.store ? scope.row.store.mobile : '--' }}
                </span>
              </div>
            </template>
            <span v-else-if="item.level == 2">
              {{
                scope.row[item.value[0]]
                  ? scope.row[item.value[0]][item.value[1]] || '--'
                  : '--'
              }}
            </span>
            <span v-else>
              {{ scope.row[item.value] || '--' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import {
  getAccountPage,
  getAccountList,
  generate,
  getBookPage,
  getRelationList,
  getDownloadRelation
} from '@/api/finance/maker'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表格列配置
      tableArr: [],
      generatArr: [
        {
          label: '推广人信息',
          tableType: 'img',
          width: 240
        },
        {
          label: '推广业务名称',
          value: 'workName'
        },
        {
          label: '审核人',
          level: 2,
          value: ['auditUser', 'username']
        },
        {
          label: '任务完成时间',
          value: 'createTime',
          width: 160
        },
        {
          label: '应付金额（元）',
          value: 'payAmount',
          width: 120
        }
      ],
      generatedArr: [
        { label: '台账名称', value: 'name', width: 100 },
        {
          label: '推广人信息',
          tableType: 'img',
          width: 240
        },
        {
          label: '推广业务名称',
          value: 'workName'
        },
        {
          label: '收款人姓名',
          value: 'realName'
        },
        {
          label: '收款人身份证号',
          value: 'idCard',
          width: 135
        },
        {
          label: '收款人银行卡号',
          value: 'walletNo',
          width: 135
        },
        {
          label: '收款人手机号',
          value: 'mobile',
          width: 120
        },
        {
          label: '付款状态',
          value: 'statusName'
        },
        {
          label: '付款金额（元）',
          value: 'payAmount',
          width: 120
        }
      ],
      // 加载状态
      tableLoading: false,
      // 表格数据
      tableData: [],
      //表示参数类
      parameter: {
        // 推广业务名称
        taskName: '',
        // 开始日期
        startCreateDate: '',
        // 结束日期
        endCreateDate: '',
        // 生成状态
        state: 'generat',
        searchType: '',
        searchValue: ''
      },
      datetime: [],
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      // 弹窗展示控制
      dialogVisible: false,
      // 弹窗表格数据
      dialogTable: [],
      // 台账生成时间查询条件
      dialogTime: [],
      // 台账生成弹窗表格配置
      dialogTableArr: [
        {
          label: '推广人信息',
          tableType: 'img',
          width: 240
        },
        {
          label: '推广业务名称',
          value: 'workName'
        },
        {
          label: '任务完成时间',
          value: 'createTime',
          width: 160
        },
        {
          label: '应付金额（元）',
          value: 'payAmount',
          width: 120
        }
      ],
      // 用于存放每一行记录的合并数
      spanArr: [],
      // 台账明细弹窗
      isVisible: false,
      // 台账明细列表数据
      tzDownloadList: [],
      // 台账表格配置项
      tzDownloadArr: [
        {
          label: '推广人信息',
          tableType: 'img',
          width: 240,
          fixed: 'left'
        },
        {
          label: '推广业务名称',
          value: 'workName'
        },
        {
          label: '推广开始日期',
          value: 'startDate',
          width: 160
        },
        {
          label: '推广结束日期',
          value: 'endDate',
          width: 160
        },
        {
          label: '推广进度',
          value: 'promoterStatusName'
        },
        {
          label: '是否已签三方协议',
          value: 'isSignAgreementName'
        },
        {
          label: '结算渠道',
          value: 'payChannel'
        },
        {
          label: '收款人姓名',
          value: 'realName'
        },
        {
          label: '收款人开户行',
          value: 'openBankName'
        },
        {
          label: '收款银行账号',
          value: 'walletNo'
        },
        {
          label: '已结算金额（元）',
          value: 'payAmount',
          width: 120
        },
        {
          label: '付款发起日期',
          value: 'createDate',
          width: 160
        },
        {
          label: '商户类型',
          level: 2,
          value: ['store', 'storeTypeName']
        },
        {
          label: '商户名称',
          level: 2,
          value: ['store', 'storeName']
        },
        {
          label: '商户负责人信息',
          tableType: 'fullUser',
          width: 135
        },
        {
          label: '商户联系地址',
          level: 2,
          value: ['store', 'address']
        },
        {
          label: '商户主营业务简介',
          level: 2,
          value: ['store', 'businessScope']
        },
        {
          label: '商户设立时间',
          level: 2,
          value: ['store', 'registrationDate']
        }
      ],
      // 当前台账明细数据
      rowData: []
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
      const [startCreateTime, endCreateTime] = this.datetime
      // 拼接请求参数
      const listQuery = {
        startCreateTime,
        endCreateTime,
        taskName: this.parameter.taskName,
        size: this.pagination.size,
        current: this.pagination.current
      }
      if (this.parameter.searchType) {
        listQuery[this.parameter.searchType] = this.parameter.searchValue
      }
      if (this.parameter.state == 'generated') {
        this.tableArr = this.generatedArr
        getBookPage(listQuery).then(response => {
          this.tableData = response.data.data.records || []
          // 获取每一行记录的合并数
          this.getSpanArr(this.tableData)
          this.pagination.total = response.data.data.total
          setTimeout(() => {
            this.tableLoading = false
          }, 0.1 * 1000)
        })
      } else {
        this.tableArr = this.generatArr
        getAccountPage(listQuery).then(response => {
          this.tableData = response.data.data.records
          this.pagination.total = response.data.data.total
          setTimeout(() => {
            this.tableLoading = false
          }, 0.1 * 1000)
        })
      }
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
        (tableBtn ? tableBtn.offsetHeight + 10 : 0) +
        tabs +
        190
      }px)`
    },
    tabChange() {
      // 表格高度
      this.tableHeight = 'calc(100vh - 335px)'
      this.getList('search')
      setTimeout(() => {
        this.countHeight()
      }, 500)
    },
    // 生成台账
    generate() {
      let reqData = {}
      if (this.dialogTime) {
        console.log(this.dialogTime)
        reqData = {
          startCreateDate: this.dialogTime[0],
          endCreateDate: this.dialogTime[1]
        }
      }
      if (this.dialogTable.length > 0) {
        generate(reqData).then(res => {
          this.$message.success('台账生成成功')
          this.reset()
          this.dialogVisible = false
        })
      } else {
        this.$message.warning('当前时段暂无可生成台账数据，请重新选择时段~')
      }
    },
    // 查询台账生成列表
    getAccountList(time) {
      this.tableLoading = true
      let reqData = {}
      if (time) {
        reqData = {
          startCreateDate: time[0],
          endCreateDate: time[1]
        }
      }
      getAccountList(reqData).then(res => {
        this.dialogTable = res.data.data
        this.dialogTable.amountSum = 0
        this.dialogTable.forEach(item => {
          this.dialogTable.amountSum += item.payAmount * 1000 || 0
        })
        this.dialogTable.amountSum = (
          this.dialogTable.amountSum / 1000
        ).toFixed(2)
        this.tableLoading = false
      })
      this.dialogVisible = true
    },
    // 处理数据 合并行
    getSpanArr(data) {
      // data就是我们从后台拿到的数据
      // pos是spanArr的索引。
      // 如果是第一条记录（索引为0），向数组中加入１，并设置索引位置
      // 如果不是第一条记录，则判断它与前一条记录是否相等，
      // 如果相等，则向spanArr中添入元素0，并将前一位元素＋１，表示合并行数＋１，
      // 以此往复，得到所有行的合并数，0即表示该行不显示
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].name === data[i - 1].name) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
        // console.log(this.spanArr)
      }
    },
    // 合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        (columnIndex === 0 || columnIndex === 9) &&
        this.parameter.state == 'generated'
      ) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        // console.log(`rowspan:${_row} colspan:${_col}`)
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    },
    timeChange(time) {
      this.getAccountList(time)
    },
    // 明细
    showDetail(rowData) {
      this.rowData = rowData
      console.log(rowData.name)
      getRelationList(rowData.bookId).then(res => {
        this.tzDownloadList = res.data.data
        this.isVisible = true
        console.log(this.tzDownloadList)
      })
    },
    // 导出
    potentialExport() {
      this.$confirm('确认将台账明细导出？', '导出台账明细', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          getDownloadRelation(this.rowData.bookId).then(res => {
            this.downloadExcel(res, (this.rowData.name || '') + '台账明细.xls')
            console.log(res)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    downloadExcel(res, fileName = '未命名.xls') {
      // debugger
      const a = document.createElement('a')
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      a.setAttribute('href', url)
      a.setAttribute('download', fileName)
      a.click()
    },
    //重置
    reset() {
      //表示参数类
      this.parameter = {
        taskName: '',
        startCreateDate: '',
        endCreateDate: '',
        state: 'generat',
        searchType: '',
        searchValue: ''
      }
      this.datetime = this.dialogTime = []
      this.tabChange()
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.settlement {
  #demo-form-inline .el-input--mini,
  .demo-form-inline .el-input--mini {
    width: 100px;
  }
  .el-dialog__body {
    p {
      margin: 10px 0 0;
    }
  }
  .imgText {
    float: left;
    span {
      display: block;
      text-align: left;
      height: 20px;
      line-height: 20px;
    }
  }
}
</style>
