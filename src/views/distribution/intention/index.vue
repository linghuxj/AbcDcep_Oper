<template>
  <div class="main-content intention">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="客户搜索：">
        <el-input
          v-model="search.searchValue"
          style="width: 100%"
          placeholder="请输入内容"
          class="input-with-select"
        >
          <el-select
            v-model="search.searchType"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option label="客户姓名" value="fullName"></el-option>
            <el-option label="客户手机号码" value="mobile"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item label="跟进状态：">
        <el-select v-model="parameter.status" placeholder="请选择跟进状态">
          <el-option
            v-for="item in statusList"
            :key="item.dictValue"
            :label="item.dictName"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商户类型：">
        <el-select v-model="parameter.storeType" placeholder="请选择商户类型">
          <el-option
            v-for="item in storeTypeList"
            :key="item.dictValue"
            :label="item.dictName"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网点支行/工作人员：">
        <el-input
          v-model="parameter.dockingStaff"
          style="width: 200px"
          placeholder="请输入网点名称和姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="推广人：">
        <el-input
          v-model="parameter.promoter"
          style="width: 200px"
          placeholder="请输入推广人姓名"
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
    <div id="tableBtn">
      <el-button type="primary" @click="potentialExport">导出报表</el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
        :width="item.width ? item.width : ''"
      >
        <template slot-scope="scope">
          <template v-if="item.tableType === 'img'">
            <!-- <el-avatar
                style="float: left"
                :size="50"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar> -->
            <div class="imgText">
              <span>
                {{ scope.row['fullName'] }}
              </span>
              <span>
                {{ scope.row['mobile'] }}
              </span>
            </div>
          </template>
          <template v-else-if="item.value == 'accounts'">
            <div v-for="(aItem, aIdx) in scope.row[item.value]" :key="aIdx">
              <span>
                {{ `${aItem.openBankName}：${aItem.walletNo}` }}
              </span>
            </div>
          </template>
          <span v-else-if="item.level == 2">
            {{ scope.row[item.value[0]][item.value[1]] }}
          </span>
          <span v-else-if="item.value == 'address'">
            {{ scope.row.locationName + scope.row[item.value] }}
          </span>
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="btnClick(scope.row)"> 详情 </el-button>
          <el-button
            v-if="scope.row.businessLicenseImage"
            type="text"
            @click="enclosure(scope.row)"
          >
            附件
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
    <!-- 意向客户详情弹窗 -->
    <el-dialog
      title="意向商户详情"
      :visible.sync="detailVisible"
      width="75%"
      class="detail"
    >
      <div class="content">
        <el-form
          ref="detailForm"
          :model="detailForm"
          label-width="150px"
          label-position="right"
        >
          <el-form-item label="客户信息：">
            {{ `${detailForm.fullName}(${detailForm.mobile})` }}
          </el-form-item>
          <el-form-item label="商家名称：">
            {{ detailForm.storeName }}
          </el-form-item>
          <el-form-item label="商家地址：">
            {{ detailForm.locationName + detailForm.address }}
          </el-form-item>
          <el-form-item label="营业执照名称：">
            {{ detailForm.businessLicense }}
          </el-form-item>
          <el-form-item label="编号：">
            {{ detailForm.businessLicenseNo }}
          </el-form-item>
          <el-form-item>
            <img
              :src="detailForm.businessLicenseImage"
              style="width: 80px; height: 80px"
            />
          </el-form-item>
          <el-form-item label="银行卡：">
            <div v-for="(aItem, aIdx) in detailForm.accounts" :key="aIdx">
              <span>
                {{ `${aItem.openBankName}：${aItem.walletNo}` }}
              </span>
            </div>
          </el-form-item>
          <el-form-item label="商户类型：">
            {{ detailForm.storeTypeName }}
          </el-form-item>
          <el-form-item label="推广人：">
            {{ detailForm.promoter }}
          </el-form-item>
          <el-form-item label="网点支行/工作人员：">
            {{ detailForm.dockingStaff }}
          </el-form-item>
        </el-form>
      </div>
      <div class="content">
        <el-steps finish-status="success" :active="activeStep" align-center>
          <el-step title="待审核"></el-step>
          <el-step title="待激活"></el-step>
          <el-step title="已激活"></el-step>
        </el-steps>
        <div class="realtimeState">
          <p>实时跟进状态：</p>
          <span v-if="!detailForm.logs || detailForm.logs.length < 1">
            暂无内容
          </span>
          <el-steps
            v-else
            :space="60"
            finish-status="process"
            :active="detailForm.logs ? detailForm.logs.length : 1"
            direction="vertical"
            align-center
          >
            <el-step
              v-for="(dItem, dIdx) in detailForm.logs"
              :key="dIdx"
              :description="dItem.remark"
            >
              <template slot="title">
                <span>{{ dItem.statusName }}</span>
                <span style="margin-left: 10px; font-weight: normal">{{
                  dItem.statusTime
                }}</span>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="附件"
      :visible.sync="enclosureVisible"
      width="50%"
      class="enclosureDialog"
    >
      <img :src="enclosureUrl" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="enclosureVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import {
  potentialClientList,
  potentialStatusList,
  storeTypeList,
  potentialExport,
  getClientById
} from '@/api/store/intention'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表格列配置
      tableArr: [
        {
          label: '客户信息',
          value: 'payAmount',
          tableType: 'img',
          width: 120
        },
        {
          label: '商家名称',
          value: 'storeName'
        },
        {
          label: '商家地址',
          value: 'address',
          width: 240
        },
        {
          label: '营业执照名称',
          value: 'businessLicense',
          width: 240
        },
        {
          label: '银行卡',
          value: 'accounts',
          width: 240
        },
        {
          label: '商户类型',
          value: 'storeTypeName'
        },
        {
          label: '推广人',
          value: 'promoter'
        },
        {
          label: '对接网点支行/工作人员',
          value: 'dockingStaff',
          width: 160
        },
        {
          label: '跟进状态',
          value: 'statusName'
        }
      ],
      search: {
        searchType: undefined,
        searchValue: undefined
      },
      statusList: [],
      // 商户状态列表
      storeTypeList: [],
      // 表格数据
      tableData: [],
      // 表格选中项
      multipleSelection: [],
      //表示参数类
      parameter: {
        status: undefined,
        storeType: undefined,
        dockingStaff: undefined,
        promoter: undefined,
      },
      // 加载状态
      tableLoading: false,
      // 详情弹窗
      detailVisible: false,
      // 附件弹窗
      enclosureVisible: false,
      // 附件URL
      enclosureUrl: '',
      // 详情内容
      detailForm: {},
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      }
    }
  },
  computed: {
    activeStep() {
      let stepNum = 1
      if (this.detailForm && this.detailForm.statusName) {
        if (this.detailForm.statusName.includes('待激活')) {
          stepNum = 2
        } else if (this.detailForm.statusName.includes('已激活')) {
          stepNum = 3
        } else {
          stepNum = 1
        }
      }
      return stepNum
    }
  },
  created() {
    this.getList()
    // 获取状态列表
    potentialStatusList().then(res => {
      this.statusList = res.data.data
    })
    storeTypeList().then(res => {
      this.storeTypeList = res.data.data
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
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`
    },
    getList(type) {
      this.tableLoading = true
      if (type === 'search') {
        this.pagination.current = 1
      }
      // 拼接请求参数
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      if (this.search.searchType) {
        listQuery[this.search.searchType] = this.search.searchValue
      }
      potentialClientList(listQuery).then(response => {
        this.tableData = response.data.data.records
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.tableLoading = false
        }, 0.1 * 1000)
      })
    },
    // 重置
    reset() {
      this.search = {
        searchType: undefined,
        searchValue: undefined
      }
      //表示参数类
      this.parameter = {
        status: undefined,
        storeType: undefined,
        dockingStaff: undefined,
        promoter: undefined,
      }
      this.getList('search')
    },
    btnClick(rowData) {
      this.detailVisible = true
      getClientById(rowData.potentialId).then(res => {
        this.detailForm = res.data.data
        console.log(this.detailForm)
      })
    },
    enclosure(rowData) {
      this.enclosureVisible = true
      this.enclosureUrl = rowData.businessLicenseImage
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection, 'this.multipleSelection')
    },
    // 导出报表按钮事件
    potentialExport() {
      this.$confirm('确认将勾选的商户信息导出？', '导出报表', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const listQuery = Object.assign({}, this.parameter)
          // 处理客户搜索数据
          if (this.search.searchType) {
            listQuery[this.search.searchType] = this.search.searchValue
          }
          listQuery.potentialIds = this.multipleSelection.map(item => {
            return item.potentialId
          })
          potentialExport(listQuery).then(resp => {
            this.downloadExcel(resp, '商户统计表.xls')
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
  }
}
</script>
<style lang="scss" scoped>
.imgText {
  float: left;
  span {
    display: block;
    text-align: left;
    height: 20px;
    line-height: 20px;
  }
}
::v-deep .detail {
  .content {
    float: left;
    box-sizing: border-box;
    width: 50%;
    &:last-of-type {
      border-left: 1px solid #ccc;
      text-align: center;
    }
    .realtimeState {
      text-align: left;
      margin-left: 4vw;
      .el-step__title {
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
::v-deep .enclosureDialog {
  .el-dialog__body {
    text-align: center;
  }
}
.center_deliverGoods {
  margin-top: 10px;
}
.enclosureDialog {
  img {
    max-width: 100%;
  }
}
</style>
