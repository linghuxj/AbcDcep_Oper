<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="活动名称：">
        <el-input
          v-model="parameter.actName"
          style="width: 200px"
          placeholder="请输入内容商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动状态：">
        <el-select v-model="parameter.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.dictValue"
            :label="item.dictName"
            :value="item.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间：">
        <el-date-picker
          v-model="parameter.time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
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
    <div id="tableBtn">
      <el-button
        v-if="permissions.consume_add"
        type="primary"
        @click="openAddDialog"
        >新增活动</el-button
      >
    </div>
    <el-table
      v-loading="interactive.tableLoading"
      :data="tableData"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column
        v-for="(item, idx) in tableArr"
        :key="idx"
        :label="item.label"
        :width="item.width"
      >
        <template slot-scope="scope">
          <span v-if="item.value == 'stores'">
            {{ scope.row.stores.length > 0 ? scope.row.stores.length : 0 }}
          </span>
          <span v-else>
            {{ scope.row[item.value] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.consume_edit && scope.row.status == 'not_started'"
            type="text"
            @click="updateActivity(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="permissions.consume_finish && scope.row.status != 'finish'"
            type="text"
            @click="closeFun(scope.row)"
          >
            关闭
          </el-button>
          <el-button type="text" @click="detailFun(scope.row)">
            查看
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
    <!-- 新增/编辑活动 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="interactive.activeVisible"
      :close-on-click-modal="false"
      width="75%"
      class="detail"
    >
      <el-form
        ref="activeForm"
        label-position="left"
        :model="activeForm"
        :rules="activeFormRules"
      >
        <div class="buleTitle">基础信息</div>
        <el-form-item
          class="form-inline-item"
          label="活动名称："
          prop="actName"
        >
          <el-input
            v-model="activeForm.actName"
            style="width: 200px"
            placeholder="请输入活动名称"
          ></el-input>
        </el-form-item>
        <el-form-item class="form-inline-item" label="活动时间：" prop="time">
          <el-date-picker
            v-model="activeForm.time"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>
        <div class="buleTitle">优惠设置</div>
        <div class="tableContainer">
          <el-form-item prop="threshold">
            <el-radio-group
              v-model="activeForm.threshold"
              @change="
                activeForm.threshold == 0
                  ? (activeForm.conditionAmount = -1)
                  : (activeForm.conditionAmount = 0)
              "
            >
              <el-radio :label="0">无门槛</el-radio>
              <el-radio :label="1">有门槛</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-table
            border
            :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
            :data="[1]"
          >
            <el-table-column label="满足条件">
              <template v-if="activeForm.threshold == 0"> 无门槛 </template>
              <el-form-item v-else prop="conditionAmount">
                <el-input
                  placeholder="请输入"
                  v-model="activeForm.conditionAmount"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-table-column>
            <el-table-column label="满减额度">
              <el-form-item prop="discountAmount">
                <el-input
                  placeholder="请输入"
                  v-model="activeForm.discountAmount"
                >
                  <template slot="append">折</template>
                </el-input>
              </el-form-item>
            </el-table-column>
          </el-table>
          <el-checkbox-group
            v-model="activeForm.type"
            @change="activeCheckbox"
            @visible-change="$forceUpdate()"
          >
            <el-checkbox label="discountUsable" disabled
              >与满减活动互斥</el-checkbox
            >
            <el-checkbox label="couponUsable" disabled
              >与优惠券互斥</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <div class="buleTitle">关联信息</div>
        <el-button
          v-if="this.dialogTitle == '新增活动'"
          style="margin: 10px 0"
          type="primary"
          @click="addStore"
        >
          新增店铺
        </el-button>
        <el-table
          :data="activeForm.relationIdData"
          border
          :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
          style="width: 100%"
          empty-text="暂未选择门店"
        >
          <el-table-column
            v-for="(item, idx) in storeTableArr"
            :key="idx"
            :label="item.label"
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row[item.value] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="this.dialogTitle == '新增活动'"
            label="操作"
            width="100"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="tableDeleteFun(scope.$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.activeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addActivity">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 关联店铺 -->
    <el-dialog
      title="关联店铺"
      :visible.sync="interactive.storeListVisible"
      :close-on-click-modal="false"
      width="50%"
      class="detail relation"
    >
      <el-form :inline="true" :model="search">
        <el-form-item label="城市名：">
          <el-cascader
            ref="cascader"
            v-model="search.location"
            :props="locationNameList"
            placeholder="请选择省/市"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="请输入内容" v-model="search.keyword">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getStoreList('search')"
              >搜索</el-button
            >
          </el-input>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="interactive.storeTableLoading"
        :data="storeTableData"
        border
        :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
        style="width: 100%"
        @selection-change="handleSelectionChange($event)"
      >
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column
          v-for="(item, idx) in storeTableArr"
          :key="idx"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row[item.value] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        v-show="storePagination.total > 0"
        :total="storePagination.total"
        :page.sync="storePagination.current"
        :limit.sync="storePagination.size"
        layout="total, prev, pager, next"
        @pagination="getStoreList"
        style="text-align: center"
      />
      <span slot="footer">
        <el-button type="primary" @click="relationFun">确定关联</el-button>
      </span>
    </el-dialog>

    <!-- 查看活动详情 -->
    <el-dialog
      title="活动详情"
      :visible.sync="interactive.detailVisible"
      :close-on-click-modal="false"
      width="75%"
      class="detail"
    >
      <el-form
        label-position="left"
        :model="detailData"
        v-loading="interactive.detailLoading"
      >
        <div class="buleTitle">基础信息</div>
        <div class="tableContainer">
          <el-form-item label="活动名称：">
            {{ detailData.actName }}
          </el-form-item>
          <el-form-item label="活动时间：">
            {{ detailData.startTime + '--' + detailData.endTime }}
          </el-form-item>
        </div>
        <div class="buleTitle">优惠设置</div>
        <div class="tableContainer">
          <el-table
            border
            :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
            :data="[1]"
          >
            <el-table-column label="满足条件">
              <template v-if="detailData.conditionAmount == -1">
                无门槛
              </template>
              <template v-else> {{ detailData.conditionAmount }}元 </template>
            </el-table-column>
            <el-table-column label="满减额度">
              {{ detailData.discountAmount }}折
            </el-table-column>
          </el-table>
        </div>
        <div class="buleTitle">关联信息</div>
        <el-table
          :data="detailData.stores"
          border
          :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
          style="width: 100%; margin-top: 10px"
          empty-text="暂未关联门店"
        >
          <el-table-column
            v-for="(item, idx) in storeTableArr"
            :key="idx"
            :label="item.label"
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row[item.value] }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.detailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import {
  getConsumeActivityPage,
  getStoreConsumeList,
  addActivity,
  closeActivity,
  detailActivity,
  updateActivity,
  getConsumeStatus
} from '@/api/operate/index'
import { areas } from '@/api/area'

export default {
  components: { TablePagination },
  data() {
    var discountRule = (rule, value, callback) => {
      var handle = typeof (value * 1)
      var type = isNaN(value * 1) ? false : handle
      console.log(value, value * 1, handle)
      if (!value || value === '') {
        callback(new Error('请输入'))
      } else if (type !== 'number' || value <= 0) {
        callback(new Error('输入的需要是大于0数值哦'))
      } else {
        callback()
      }
    }
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 省市区联动
      locationNameList: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level } = node
          const parentId = !node.value ? '-1' : node.value
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then(res => {
              const areaList = res.data.data
              const nodes = Array.from(areaList).map(item => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 1
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            })
          }, 100)
        }
      },
      // 表格列配置
      activeFormRules: {
        actName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          {
            max: 15,
            message: '活动名称不可超过15个字符',
            trigger: ['change', 'blur']
          }
        ],
        time: [{ required: true, message: '请输入活动时间', trigger: 'blur' }],
        threshold: [{ required: true, message: '请选择', trigger: 'change' }],
        conditionAmount: [{ validator: discountRule, trigger: 'blur' }],
        discountAmount: [{ validator: discountRule, trigger: 'blur' }]
      },
      dialogTitle: '新增活动',
      tableArr: [
        {
          label: '活动名称',
          value: 'actName'
        },
        {
          label: '活动状态',
          value: 'statusName'
        },
        {
          label: '开始时间',
          value: 'startTime',
          width: 135
        },
        {
          label: '结束时间',
          value: 'endTime',
          width: 135
        },
        {
          label: '商家数量',
          value: 'stores'
        },
        {
          label: '折扣',
          value: 'discountName'
        }
      ],
      // 店铺表格配置
      storeTableArr: [
        {
          label: '店铺名称',
          value: 'storeName'
        },
        {
          label: '类型',
          value: 'storeTypeName'
        },
        {
          label: '地址',
          value: 'address'
        },
        {
          label: '商户电话',
          value: 'contactTel'
        }
      ],
      // 活动状态
      statusList: [],
      // 表格数据
      tableData: [],
      //表示参数类
      parameter: {
        actName: undefined,
        status: undefined,
        time: undefined
      },
      // 操作类型
      interactive: {
        // 表格加载状态
        tableLoading: false,
        // 活动编辑弹窗显示
        activeVisible: false,
        // 店铺列表弹窗显示
        storeListVisible: false,
        // 商家表格加载状态
        storeTableLoading: false,
        // 活动详情弹窗显示
        detailVisible: false,
        // 详情加载状态
        detailLoading: false
      },
      // 活动相关表单
      activeForm: {
        // 活动名称
        actName: undefined,
        // 时间
        time: undefined,
        // 门槛
        threshold: 0,
        // 满减条件
        conditionAmount: -1,
        // 满减额度
        discountAmount: undefined,
        // 与满减活动互斥
        discountUsable: true,
        // 与优惠券互斥
        couponUsable: true,
        type: ['discountUsable', 'couponUsable'],
        // 选择的表格数据
        relationIdData: [],
        // 需要的参数id集合
        relationIds: []
      },
      // 店铺搜索
      search: {
        location: undefined,
        keyword: undefined
      },
      // 店铺列表
      storeTableData: [],
      // 所选店铺数据
      multipleSelection: [],
      // 详情数据
      detailData: {},
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      // 店铺列表弹窗分页
      storePagination: {
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
      getConsumeStatus().then(res => {
        this.statusList = res.data.data
      })
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
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`
    },
    getList(type) {
      this.interactive.tableLoading = true
      if (type === 'search') {
        this.pagination.current = 1
      }
      // 处理时间
      if (this.parameter.time && this.parameter.time.length > 0) {
        this.parameter.startTime = this.parameter.time[0]
        this.parameter.endTime = this.parameter.time[1]
      } else {
        this.parameter.startTime = undefined
        this.parameter.endTime = undefined
      }
      // 拼接请求参数
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      getConsumeActivityPage(listQuery).then(response => {
        console.debug('res', response)
        this.tableData = response.data.data.records
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.interactive.tableLoading = false
        }, 0.1 * 1000)
      })
    },
    activeCheckbox(checkArr) {
      if (checkArr.includes('discountUsable')) {
        this.activeForm.discountUsable = true
      } else {
        this.activeForm.discountUsable = false
      }
      if (checkArr.includes('couponUsable')) {
        this.activeForm.couponUsable = true
      } else {
        this.activeForm.couponUsable = false
      }
    },
    // 新建活动
    addActivity() {
      // 处理时间
      this.$refs['activeForm'].validate(valid => {
        if (valid) {
          if (this.activeForm.relationIdData.length <= 0) {
            this.$message.error('请至少关联一个店铺')
            return
          }
          if (this.activeForm.time && this.activeForm.time.length > 0) {
            this.activeForm.startTime = this.activeForm.time[0]
            this.activeForm.endTime = this.activeForm.time[1]
          }
          this.activeForm.relationIds = this.activeForm.relationIdData.map(
            item => {
              return item.storeId
            }
          )
          if (this.dialogTitle == '新增活动') {
            addActivity(this.activeForm).then(res => {
              if (res.data.data == true) {
                this.$message.success('新增活动成功')
                this.reset()
                this.interactive.activeVisible = false
              }
              console.log(res, '新增活动')
            })
          } else {
            updateActivity(this.activeForm).then(res => {
              if (res.data.data == true) {
                this.$message.success('编辑活动成功')
                this.reset()
                this.interactive.activeVisible = false
              }
              console.log(res, '编辑活动')
            })
          }
        }
      })
      console.log(this.activeForm)
      // this.interactive.activeVisible = false
    },
    // 关联
    relationFun() {
      this.activeForm.relationIdData = this.multipleSelection
      this.interactive.storeListVisible = false
    },
    // 编辑活动
    updateActivity(rowData) {
      this.interactive.storeTableLoading = true
      this.dialogTitle = '编辑活动'
      detailActivity(rowData.id).then(res => {
        this.activeForm = {
          ...this.activeForm,
          ...res.data.data
        }

        this.activeForm.time = [
          this.activeForm.startTime,
          this.activeForm.endTime
        ]
        this.activeForm.type = [
          this.activeForm.couponUsable ? 'couponUsable' : false,
          this.activeForm.discountUsable ? 'discountUsable' : false
        ]
        this.activeForm.relationIdData = this.activeForm.stores
        if (this.activeForm.conditionAmount <= 0) {
          this.activeForm.threshold = 0
        } else {
          this.activeForm.threshold = 1
        }
        setTimeout(() => {
          this.interactive.storeTableLoading = false
        }, 100)
      })
      this.interactive.activeVisible = true
    },
    // 查看详情
    detailFun(rowData) {
      this.interactive.detailLoading = true
      detailActivity(rowData.id).then(res => {
        this.detailData = res.data.data
        setTimeout(() => {
          this.interactive.detailLoading = false
        }, 100)
      })
      this.interactive.detailVisible = true
    },
    // 删除
    closeFun(rowData) {
      this.$confirm('确认关闭该活动？', '关闭活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          closeActivity(rowData.id).then(res => {
            if (res.data.data == true) {
              this.$message.success('关闭活动成功')
              this.getList('search')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 新增店铺
    addStore() {
      this.getStoreList()
      this.interactive.storeListVisible = true
    },
    openAddDialog() {
      this.reset()
      this.dialogTitle = '新增活动'
      this.interactive.activeVisible = true
    },
    // 删除关联的店铺
    tableDeleteFun(idx) {
      this.activeForm.relationIdData.splice(idx, 1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取店铺列表
    getStoreList(type) {
      this.interactive.storeTableLoading = true
      if (type === 'search') {
        this.storePagination.current = 1
      }
      // 拼接请求参数
      const listQuery = Object.assign({}, this.search, this.storePagination)
      getStoreConsumeList(listQuery).then(response => {
        this.storeTableData = response.data.data.records
        this.storePagination.total = response.data.data.total
        setTimeout(() => {
          this.interactive.storeTableLoading = false
        }, 0.1 * 1000)
      })
    },
    // 重置
    reset() {
      //表示参数类
      this.parameter = {
        actName: undefined,
        status: undefined,
        time: undefined
      }
      this.activeForm = {
        // 活动名称
        actName: undefined,
        // 时间
        time: undefined,
        // 门槛
        threshold: 0,
        // 满减条件
        conditionAmount: -1,
        // 满减额度
        discountAmount: undefined,
        // 与满减活动互斥
        discountUsable: true,
        // 与优惠券互斥
        couponUsable: true,
        type: ['discountUsable', 'couponUsable'],
        // 关联的店铺数据
        relationIdData: []
      }
      this.getList('search')
    }
  }
}
</script>
<style lang="scss" scoped>
.buleTitle {
  height: 40px;
  line-height: 40px;
  border-left: 5px solid #1e90ff;
  font-weight: 700;
  padding-left: 5px;
}
.form-inline-item {
  display: inline-block;
  width: 50%;
}
.tableContainer {
  width: 45%;
  margin: auto;
  .el-table {
    margin: 18px 0;
  }
}
::v-deep .el-input-group__append {
  padding: 0 10px !important;
}
::v-deep .relation {
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
