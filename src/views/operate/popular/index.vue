<template>
  <div class="main-content">
    <el-form :inline="true" :model="parameter" class="demo-form-inline">
      <el-form-item label="商品名称：">
        <el-input
          v-model="parameter.productName"
          style="width: 200px"
          placeholder="请输入内容商品名称"
        />
      </el-form-item>
      <el-form-item label="活动状态：">
        <el-select v-model="parameter.status" placeholder="请选择">
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
          type="daterange"
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

    <el-button
      v-if="permissions.hot_goods_activity_add"
      type="primary"
      @click="addActivity"
      >新增活动</el-button
    >

    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :data="tableData"
        border
        :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
        style="width: 100%"
      >
        <el-table-column
          v-for="(item, idx) in tableArr"
          :key="idx"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <span v-if="item.value == 'time'">
              {{ scope.row.startTime + '至' + scope.row.endTime }}
            </span>
            <span v-else>
              {{ scope.row[item.value] }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button
              v-if="
                permissions.hot_goods_activity_edit &&
                scope.row.status == 'not_started'
              "
              type="text"
              @click="editFun(scope.row)"
            >
              修改
            </el-button>
            <el-button type="text" @click="closeFun(scope.row)">
              关闭
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

    <!-- 新增/编辑活动 -->
    <el-dialog
      :title="interactive.activeDialogTitle"
      :visible.sync="interactive.activeVisible"
      :close-on-click-modal="false"
      width="75%"
      class="detail"
    >
      <el-form
        ref="activeForm"
        :model="activeForm"
        label-width="25%"
        :rules="activeFormRules"
      >
        <div class="buleTitle">基础信息</div>
        <el-form-item label="活动时间：" prop="time">
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
        <el-form-item label="生命周期：">
          <el-radio-group v-model="activeForm.lifeCycleType">
            <el-radio label="everyday">每天</el-radio>
            <el-radio label="schedule">指定周期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="activeForm.lifeCycleType == 'schedule'"
          prop="lifeCycleList"
        >
          <el-checkbox-group v-model="activeForm.lifeCycleList">
            <el-checkbox
              v-for="item in weekList"
              :key="item.dictValue"
              :label="item.dictValue"
              >{{ item.dictName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="生效时段：">
          <el-radio-group v-model="activeForm.timeFrameType">
            <el-radio label="daylong">全天</el-radio>
            <el-radio label="schedule">指定时段</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="timeFrameList">
          <template v-if="activeForm.timeFrameType == 'schedule'">
            <el-form-item>
              <el-button
                type="danger"
                icon="el-icon-plus"
                circle
                @click="addTimeFrame"
              >
              </el-button>
              <span class="redText">{{
                `增加时段${activeForm.timeFrameList.length}/3   每个时段之间不允许重合`
              }}</span>
            </el-form-item>
            <el-form-item
              v-for="(item, idx) in activeForm.timeFrameList"
              :key="idx"
              :prop="`timeFrameList.${idx}`"
              :rules="activeFormRules.timeFrameItme"
            >
              时段{{ idx + 1 }}：
              <el-time-picker
                is-range
                v-model="activeForm.timeFrameList[idx]"
                value-format="HH:mm:ss"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
              <el-button
                type="danger"
                icon="el-icon-close"
                circle
                style="margin-left: 10px"
                @click="deleteTimeFrame(idx)"
              >
              </el-button>
            </el-form-item>
          </template>
        </el-form-item>
        <el-form-item label="每单限购：" prop="limitBuyNum">
          <el-radio-group
            v-model="activeForm.limitBuyRadio"
            @change="radioChange($event, 'limitBuyNum')"
            @visible-change="$forceUpdate()"
          >
            <el-radio :label="-1">不限</el-radio>
            <el-radio :label="1">
              自定义
              <el-input
                placeholder="请输入正整数"
                v-model="activeForm.limitBuyNum"
                :disabled="activeForm.limitBuyRadio == 1 ? false : true"
              />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当日活动库存：" prop="stock">
          <el-radio-group
            v-model="activeForm.stockRadio"
            @change="radioChange($event, 'stock')"
            @visible-change="$forceUpdate()"
          >
            <el-radio :label="-1">不限</el-radio>
            <el-radio :label="1">
              自定义
              <el-input
                placeholder="请输入正整数"
                v-model="activeForm.stock"
                :disabled="activeForm.stockRadio == 1 ? false : true"
              />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="折扣方式：">
          <el-radio-group
            v-model="activeForm.discountType"
            @change="discountTypeChange"
          >
            <el-radio label="discount">按折扣</el-radio>
            <el-radio label="price">按活动价格</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="buleTitle">商品信息</div>

        <el-form-item label="活动商品：">
          <el-button
            style="margin-bottom: 10px"
            type="primary"
            @click="showStoreList"
          >
            关联商品
          </el-button>
          <template v-if="activeForm.goodsPriceList.length > 0">
            <el-table
              border
              :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
              style="width: 60%"
              tooltip-effect="light"
              :data="activeForm.goodsPriceList"
              empty-text="暂未关联商品"
            >
              <el-table-column label="商品名称" show-overflow-tooltip>
                <template slot-scope="scope">{{
                  scope.row.productName
                }}</template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <el-button type="text" @click="tableDeleteFun">
                  删除
                </el-button>
              </el-table-column>
            </el-table>
          </template>
        </el-form-item>

        <!-- <el-form-item> -->
        <template v-if="activeForm.goodsPriceList.length > 0">
          <el-table
            border
            :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
            tooltip-effect="light"
            :data="activeForm.skuList"
            empty-text="暂无规格"
          >
            <el-table-column label="SKU" show-overflow-tooltip prop="specName">
            </el-table-column>
            <el-table-column
              label="原价（元）"
              show-overflow-tooltip
              prop="salePrice"
            >
            </el-table-column>
            <el-table-column label="活动价（元）" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-form-item
                  :prop="`skuList.${scope.$index}.salePrice2`"
                  :rules="activeFormRules.discount"
                >
                  <el-input
                    :disabled="
                      activeForm.discountType == 'discount' ? true : false
                    "
                    placeholder="请输入活动价"
                    v-model="scope.row.salePrice2"
                    @visible-change="$forceUpdate()"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="折扣" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-form-item
                  :prop="`skuList.${scope.$index}.discountRate`"
                  :rules="activeFormRules.discountRate"
                >
                  <el-input
                    :disabled="
                      activeForm.discountType == 'discount' ? false : true
                    "
                    placeholder="请输入折扣值"
                    v-model="scope.row.discountRate"
                    @input="discountChange($event, scope.$index)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="interactive.activeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFun">确 定</el-button>
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
      >
        <el-table-column label="商品名称" prop="productName"> </el-table-column>
        <el-table-column label="店铺名称" prop="storeName"> </el-table-column>
        <el-table-column label="库存" prop="stock"> </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="addProduct(scope.row)">
              关联
            </el-button>
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
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
import { getDiscountActivityState } from '@/api/operate/discount'
import {
  getHotGoodsList,
  getHotProductList,
  getGoodsList,
  addHotGood,
  closeHotActivity,
  detailHotActivity,
  updateHotGood,
  getHotWeek
} from '@/api/operate/index'

export default {
  components: { TablePagination },
  data() {
    var limitBuyRule = (rule, value, callback) => {
      // 记录数据类型
      var handle = typeof (value * 1)
      // 判断数值是否为NaN
      var type = isNaN(value * 1) ? false : handle
      if (this.activeForm.limitBuyRadio == -1) {
        callback()
      } else if (!value || value === '') {
        callback(new Error('请输入限购数量'))
      } else if (type !== 'number' || value <= 0) {
        callback(new Error('输入的需要是大于0的数值哦'))
      } else {
        callback()
      }
    }
    var stockRule = (rule, value, callback) => {
      var handle = typeof (value * 1)
      var type = isNaN(value * 1) ? false : handle
      if (this.activeForm.stockRadio == -1) {
        callback()
      } else if (!value || value === '') {
        callback(new Error('请输入库存数量'))
      } else if (type !== 'number' || value <= 0) {
        callback(new Error('输入的需要是大于0的数值哦'))
      } else {
        callback()
      }
    }
    var discountRule = (rule, value, callback, itemString) => {
      var handle = typeof (value * 1)
      var type = isNaN(value * 1) ? false : handle
      var itemIndex = Object.entries(itemString)[0][0].split('.')[1]
      // console.log(itemIndex, 'itemIndex')
      if (this.activeForm.discountType == 'discount') {
        callback()
      } else if (!value || value === '') {
        callback(new Error('请输入活动价'))
      } else if (type !== 'number' || value <= 0) {
        callback(new Error('输入的需要是大于0的数值哦'))
      } else if (this.activeForm.skuList[itemIndex].salePrice < value) {
        callback(new Error('活动价不能大于原价哦'))
      } else {
        callback()
      }
    }
    var discountRateRule = (rule, value, callback) => {
      var handle = typeof (value * 1)
      var type = isNaN(value * 1) ? false : handle
      if (this.activeForm.discountType != 'discount') {
        callback()
      } else if (!value || value === '') {
        callback(new Error('请输入折扣值'))
      } else if (type !== 'number' || value <= 0) {
        callback(new Error('输入的需要是大于0的数值哦'))
      } else if (value > 10) {
        callback(new Error('折扣数值不能大于10哦'))
      } else {
        callback()
      }
    }
    var timeFrameRule = (rule, value, callback) => {
      // console.log(value, this.activeForm.timeFrameType, 111)
      if (this.activeForm.timeFrameType == 'daylong') {
        callback()
      } else if (!value || value === '') {
        callback(new Error('请选择时段'))
      } else {
        callback()
      }
    }
    var timeFrameListRule = (rule, value, callback) => {
      if (this.activeForm.timeFrameType == 'daylong') {
        callback()
      } else if (this.activeForm.timeFrameList.length <= 0) {
        callback(new Error('请至少配置一个时段'))
      } else {
        callback()
      }
    }
    return {
      // 表格列配置
      tableArr: [
        {
          label: '商品名称',
          value: 'productName'
        },
        {
          label: '原价（元）',
          value: 'minCostPrice',
          width: 100
        },
        {
          label: '活动价（元）',
          value: 'minSalePrice',
          width: 100
        },
        {
          label: '活动日期',
          value: 'time'
        },
        {
          label: '生效周期',
          value: 'couponAmountText'
        },
        {
          label: '生效时段',
          value: 'payAmountText'
        },
        {
          label: '活动状态',
          value: 'statusName',
          width: 100
        }
      ],
      activeFormRules: {
        time: [{ required: true, message: '请输入活动时间', trigger: 'blur' }],
        lifeCycleList: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一天',
            trigger: 'change'
          }
        ],
        timeFrameItme: [
          {
            type: 'array',
            required: true,
            validator: timeFrameRule,
            trigger: ['blur', 'change']
          }
        ],
        timeFrameList: [
          {
            type: 'array',
            required: true,
            validator: timeFrameListRule,
            trigger: ['blur', 'change']
          }
        ],
        limitBuyNum: [
          {
            required: true,
            validator: limitBuyRule,
            trigger: ['blur', 'change']
          }
        ],
        stock: [
          {
            required: true,
            validator: stockRule,
            trigger: ['blur', 'change']
          }
        ],
        discount: {
          required: true,
          validator: discountRule,
          trigger: ['blur', 'change']
        },
        discountRate: {
          required: true,
          validator: discountRateRule,
          trigger: ['blur', 'change']
        }
      },
      // 活动状态
      statusList: [],
      // 表格数据
      tableData: [],
      // 星期类型数据
      weekList: [],
      //表示参数类
      parameter: {
        productName: undefined,
        status: undefined,
        time: undefined
      },
      // 操作类型
      interactive: {
        // 表格加载状态
        tableLoading: false,
        // 活动编辑窗口显示
        activeVisible: false,
        // 弹窗标题
        activeDialogTitle: '新增活动',
        // 店铺列表弹窗显示
        storeListVisible: false,
        // 商家表格加载状态
        storeTableLoading: false
      },
      // 活动相关表单
      activeForm: {
        // 商品价格信息
        goodsPriceList: [],
        // 生命周期信息
        lifeCycleList: [],
        // 生命周期类型
        lifeCycleType: 'everyday',
        // 生效时段类型
        timeFrameType: 'daylong',
        // 商品生效时段信息
        timeFrameList: [],
        // 限购单选值
        limitBuyRadio: -1,
        // 限购数量
        limitBuyNum: 0,
        // 库存单选值
        stockRadio: -1,
        // 活动商品库存
        stock: 0,
        // 折扣方式
        discountType: 'discount',
        skuList: [],
        // 产品id
        productId: undefined
      },
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      storeTableData: [],
      // 店铺搜索
      search: {
        keyword: undefined
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
      getDiscountActivityState().then(res => {
        this.statusList = res.data.data
      })
      getHotWeek().then(res => {
        this.weekList = res.data.data
      })
      this.getList()
    })
  },
  methods: {
    getList(type) {
      this.interactive.tableLoading = true
      if (type === 'search') {
        this.pagination.current = 1
      }
      // 处理时间
      if (this.parameter.time && this.parameter.time.length > 0) {
        this.parameter.startTime = this.parameter.time[0]
        this.parameter.endTime = this.parameter.time[1]
      }
      // 拼接请求参数
      const listQuery = Object.assign({}, this.parameter, this.pagination)
      getHotGoodsList(listQuery).then(response => {
        this.tableData = response.data.data.records
        this.getMinPrice(this.tableData)
        this.pagination.total = response.data.data.total
        setTimeout(() => {
          this.interactive.tableLoading = false
        }, 0.1 * 1000)
      })
    },
    // 新建活动
    addActivity() {
      this.interactive.activeDialogTitle = '新增活动'
      this.interactive.activeVisible = true
    },
    // 修改
    editFun(rowData) {
      this.interactive.activeDialogTitle = '修改活动'
      detailHotActivity(rowData.actId).then(res => {
        this.activeForm = {
          ...this.activeForm,
          ...res.data.data
        }
        // 回显时间
        this.activeForm.time = [
          this.activeForm.startTime,
          this.activeForm.endTime
        ]
        // 回显单选
        if (this.activeForm.limitBuyNum == -1) {
          this.activeForm.limitBuyRadio = -1
        } else {
          this.activeForm.limitBuyRadio = 1
        }
        if (this.activeForm.stock == -1) {
          this.activeForm.stockRadio = -1
        } else {
          this.activeForm.stockRadio = 1
        }
        // 分离sku
        this.activeForm.skuList = this.activeForm.goodsPriceList.map(item => {
          return {
            specName: item.specName,
            salePrice: item.costPrice,
            salePrice2: item.salePrice,
            discountRate: item.discountRate,
            goodsId: item.goodsId
          }
        })
        // 回显商品表
        this.activeForm.goodsPriceList = [
          {
            productName: this.activeForm.goodsPriceList[0].goodsName,
            productId: this.activeForm.productId
          }
        ]
        // 回显生效时段
        this.activeForm.timeFrameList = this.activeForm.timeFrameList.map(
          item => {
            return [item.startTime, item.endTime]
          }
        )
      })
      this.interactive.activeVisible = true
    },
    // 关闭活动
    closeFun(rowData) {
      this.$confirm('确认关闭该活动？', '关闭活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          closeHotActivity(rowData.actId).then(res => {
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
    // 处理tableData中goodsPriceList的数据
    getMinPrice(needArr) {
      needArr.forEach(item => {
        var costPriceArr = item.goodsPriceList.map(citem => {
          return citem.costPrice
        })
        var salePriceArr = item.goodsPriceList.map(citem => {
          return citem.salePrice
        })
        item.productName = item.goodsPriceList[0].goodsName
        item.minCostPrice = Math.min(...costPriceArr) + ' 起'
        item.minSalePrice = Math.min(...salePriceArr) + ' 起'
      })
      this.tableData.forEach(item => {
        if (item.lifeCycleType == 'everyday') {
          item.couponAmountText = '每天'
        } else {
          // 将返回的生效周期转换为展示的格式
          const weekArr = []
          item.lifeCycleList.forEach(aitem => {
            let weekItem = this.weekList.filter(bitem => {
              if (bitem.dictValue == aitem || bitem.dictName == aitem) {
                return bitem.dictName
              }
            })
            // console.log(weekItem, 'weekItem')
            weekArr.push(weekItem[0].dictName)
          })
          item.couponAmountText = weekArr.join(';')
        }
        if (item.timeFrameType == 'daylong') {
          item.payAmountText = '全天'
        } else {
          item.payAmountText = ''
          item.timeFrameList.forEach(citem => {
            item.payAmountText += `${citem.startTime}-${citem.endTime};  `
          })
        }
      })
      // console.log(needArr, this.tableData, 'needArr')
    },
    submitFun() {
      this.$refs['activeForm'].validate(valid => {
        if (valid) {
          if (this.activeForm.goodsPriceList.length <= 0) {
            this.$message.error('请关联商品')
            return
          }
          let reqData = { ...this.activeForm }
          // 请求参数数据处理
          if (reqData.limitBuyRadio == -1) {
            reqData.limitBuyNum = -1
          }
          if (reqData.stockRadio == -1) {
            reqData.stock = -1
          }
          // 处理时间
          if (reqData.time && reqData.time.length > 0) {
            reqData.startTime = reqData.time[0]
            reqData.endTime = reqData.time[1]
          }
          // 处理时段
          reqData.timeFrameList = this.activeForm.timeFrameList.map(item => {
            return {
              startTime: item[0],
              endTime: item[1]
            }
          })
          reqData.goodsPriceList = reqData.skuList.map(sitme => {
            return {
              costPrice: sitme.salePrice,
              discountRate: sitme.discountRate,
              goodsId: sitme.goodsId,
              salePrice: sitme.salePrice2
            }
          })
          reqData.productId = this.activeForm.goodsPriceList[0].productId
          if (this.interactive.activeDialogTitle == '新增活动') {
            addHotGood(reqData).then(res => {
              if (res.data.data == true) {
                this.$message.success('新增活动成功')
                this.reset()
                this.interactive.activeVisible = false
              }
            })
          } else {
            updateHotGood(reqData).then(res => {
              if (res.data.data == true) {
                this.$message.success('修改活动成功')
                this.reset()
                this.interactive.activeVisible = false
              }
            })
          }
        }
      })
    },
    // 删除关联的商品
    tableDeleteFun() {
      this.activeForm.goodsPriceList = []
      this.activeForm.skuList = []
    },
    // 添加时段
    addTimeFrame() {
      if (this.activeForm.timeFrameList.length < 3) {
        this.activeForm.timeFrameList.push(undefined)
      }
    },
    // 删除时段
    deleteTimeFrame(idx) {
      this.activeForm.timeFrameList.splice(idx, 1)
    },
    showStoreList() {
      this.getStoreList()
      this.interactive.storeListVisible = true
    },
    addProduct(rowData) {
      this.activeForm.goodsPriceList = [rowData]
      getGoodsList(rowData.productId).then(res => {
        this.activeForm.skuList = res.data.data
        this.interactive.storeListVisible = false
      })
    },
    // 关联商品
    getStoreList(type) {
      this.interactive.storeTableLoading = true
      if (type === 'search') {
        this.storePagination.current = 1
      }
      // 拼接请求参数
      const listQuery = Object.assign({}, this.search, this.storePagination)
      getHotProductList(listQuery).then(response => {
        this.storeTableData = response.data.data.records
        this.storePagination.total = response.data.data.total
        setTimeout(() => {
          this.interactive.storeTableLoading = false
        }, 0.1 * 1000)
      })
    },
    // 折扣方式类型更变
    discountTypeChange(type) {
      if (type == 'discount') {
        this.activeForm.skuList.forEach(item => {
          item.salePrice2 = undefined
        })
      } else if (type == 'price') {
        this.activeForm.skuList.forEach(item => {
          item.discountRate = undefined
        })
      }
    },
    // 数量限制更变
    radioChange(type, val) {
      if (val && type == -1) {
        this.activeForm[val] = 0
      }
    },
    // 根据折扣计算活动价
    discountChange(val, idx) {
      this.activeForm.skuList[idx].salePrice2 =
        this.activeForm.skuList[idx].salePrice * (val / 10)
      if (
        !this.activeForm.skuList[idx].salePrice2 ||
        isNaN(this.activeForm.skuList[idx].salePrice2)
      ) {
        this.activeForm.skuList[idx].salePrice2 = 0
      } else {
        this.activeForm.skuList[idx].salePrice2 =
          this.activeForm.skuList[idx].salePrice2.toFixed(2)
      }
    },
    // 重置
    reset() {
      //表示参数类
      this.parameter = {
        productName: undefined,
        status: undefined,
        time: undefined
      }
      // 活动相关表单
      this.activeForm = {
        // 商品价格信息
        goodsPriceList: [],
        // 生命周期信息
        lifeCycleList: [],
        // 生命周期类型
        lifeCycleType: 'everyday',
        // 生效时段类型
        timeFrameType: 'daylong',
        // 商品生效时段信息
        timeFrameList: [],
        // 限购单选值
        limitBuyRadio: -1,
        // 限购数量
        limitBuyNum: 0,
        // 库存单选值
        stockRadio: -1,
        // 活动商品库存
        stock: 0,
        // 折扣方式
        discountType: 'discount',
        skuList: [],
        // 产品id
        productId: undefined
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
.tableContainer {
  width: 45%;
  margin: auto;
  .el-table {
    margin: 18px 0;
  }
}
.redText {
  margin-left: 10px;
  font-size: 12px;
  color: red;
}
</style>
