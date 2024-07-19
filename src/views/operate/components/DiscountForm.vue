<template>
  <div class="main-content">
    <el-form
      ref="discountForm"
      :model="discountForm"
      :rules="rules"
      label-width="200px"
    >
      <aside>基本信息</aside>
      <el-form-item label="活动名称：" prop="actName">
        <el-input
          v-model="discountForm.actName"
          placeholder="请输入活动名称"
          maxlength="15"
          style="width: 50%"
        />
      </el-form-item>
      <el-form-item label="活动时间：" required>
        <el-row>
          <el-col :span="7">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="discountForm.startTime"
                type="datetime"
                placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                :picker-options="pickerOptionsStart"
                :default-time="pickerTimeStart()"
              />
            </el-form-item>
          </el-col>
          <el-col style="text-align: center" :span="2">至</el-col>
          <el-col :span="7">
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="discountForm.endTime"
                type="datetime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                :picker-options="pickerOptionsEnd"
                default-time="23:59:59"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="参与人群：" prop="applyUser">
        <el-select
          v-model="discountForm.applyUser"
          :disabled="isEdit"
          style="width: 50%"
        >
          <el-option label="全部" value="all"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用平台：" prop="platform">
        <el-select
          v-model="discountForm.platform"
          :disabled="isEdit"
          style="width: 50%"
        >
          <el-option
            v-for="(item, index) in platformArr"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联类型：" prop="relationType">
        <el-radio-group v-model="discountForm.relationType" :disabled="isEdit">
          <el-radio
            v-for="(item, index) in relativeArr"
            :key="index"
            :label="item.dictValue"
          >
            {{ item.dictName }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <aside>优惠设置</aside>
      <el-form-item
        label="优惠设置："
        prop="discountActivityConfCreateReq.discountType"
      >
        <el-radio-group
          v-model="discountForm.discountActivityConfCreateReq.discountType"
          :disabled="isEdit"
        >
          <el-radio
            v-for="(item, index) in setArr"
            :key="index"
            :label="item.dictValue"
          >
            {{ item.dictName }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div
        v-if="
          discountForm.discountActivityConfCreateReq.discountType ===
          'full_pieces_minus_discount'
        "
        class="set-table-data"
      >
        <el-table
          :data="setTableData1"
          style="width: 50%"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column label="满足条件">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.conditionAmount"
                :disabled="isEdit"
                placeholder="请输入正整数"
                @change="changeRule"
              >
                <template slot="append">件</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="折扣额度">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.discountAmount"
                :disabled="isEdit"
                placeholder="请输入1-10之间的数字"
                @change="changeRule($event, 'discount')"
              >
                <template slot="append">折</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="!isEdit" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="
                  setTableData1.length === scope.$index + 1 ||
                  setTableData1.length === 1
                "
                type="text"
                @click="add_set1(scope.row)"
              >
                新增
              </el-button>
              <el-button
                v-if="
                  setTableData1.length === scope.$index + 1 &&
                  setTableData1.length > 1
                "
                type="text"
                @click="to_delete1(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        v-if="
          discountForm.discountActivityConfCreateReq.discountType ===
          'full_money_minus_discount'
        "
        class="set-table-data"
      >
        <el-table
          :data="setTableData2"
          style="width: 50%"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column label="满足条件">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.conditionAmount"
                placeholder="请输入"
              >
                <template slot="append">元</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="折扣额度">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.discountAmount"
                placeholder="请输入1-10之间的数字"
                @change="changeRule($event, 'discount')"
              >
                <template slot="append">折</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="!isEdit" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="
                  setTableData2.length === scope.$index + 1 ||
                  setTableData2.length === 1
                "
                type="text"
                @click="add_set2(scope.row)"
              >
                新增
              </el-button>
              <el-button
                v-if="
                  setTableData2.length === scope.$index + 1 &&
                  setTableData2.length > 1
                "
                type="text"
                @click="to_delete2(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        v-if="
          discountForm.discountActivityConfCreateReq.discountType ===
          'full_pieces_minus_money'
        "
        class="set-table-data"
      >
        <el-table
          :data="setTableData3"
          style="width: 50%"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column label="满足条件">
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.conditionAmount"
                placeholder="请输入正整数"
                @change="changeRule"
              >
                <template slot="append">件</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="折扣额度">
            <template slot-scope="scope">
              <el-input v-model="scope.row.discountAmount" placeholder="请输入">
                <template slot="append">元</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="!isEdit" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="
                  setTableData3.length === scope.$index + 1 ||
                  setTableData3.length === 1
                "
                type="text"
                @click="add_set3(scope.row)"
              >
                新增
              </el-button>
              <el-button
                v-if="
                  setTableData3.length === scope.$index + 1 &&
                  setTableData3.length > 1
                "
                type="text"
                @click="to_delete3(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        v-if="
          discountForm.discountActivityConfCreateReq.discountType ===
          'full_money_minus_money'
        "
        class="set-table-data"
      >
        <el-table
          :data="setTableData4"
          style="width: 50%"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column label="满足条件">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.conditionAmount"
                placeholder="请输入"
              >
                <template slot="append">元</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="折扣额度">
            <template slot-scope="scope">
              <el-input v-model="scope.row.discountAmount" placeholder="请输入">
                <template slot="append">元</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column v-if="!isEdit" label="操作">
            <template slot-scope="scope">
              <el-button
                v-if="
                  setTableData4.length === scope.$index + 1 ||
                  setTableData4.length === 1
                "
                type="text"
                @click="add_set4(scope.row)"
              >
                新增
              </el-button>
              <el-button
                v-if="
                  setTableData4.length === scope.$index + 1 &&
                  setTableData4.length > 1
                "
                type="text"
                @click="to_delete4(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form-item label="下单叠加规则：">
        <el-checkbox
          v-model="discountForm.discountActivityConfCreateReq.memberUsable"
          :disabled="isEdit"
        >
          与会员优惠互斥
          <span class="superposition-item">
            默认勾选后，活动期间，商品下单与会员价互斥
          </span>
        </el-checkbox>
        <br />
        <el-checkbox
          v-model="discountForm.discountActivityConfCreateReq.couponUsable"
          :disabled="isEdit"
        >
          与优惠劵互斥
          <span class="superposition-item">
            设置活动期间，商品下单金额参与抵扣
          </span>
        </el-checkbox>
      </el-form-item>
      <aside>关联信息</aside>
      <!-- 商品 -->
      <discount-add-goods
        v-if="discountForm.relationType === 'goods'"
        ref="goods"
        :is-edit="isEdit"
        :id="id"
      ></discount-add-goods>
      <!-- 门店 -->
      <discount-add-store
        v-if="discountForm.relationType === 'store'"
        ref="store"
        :is-edit="isEdit"
        :id="id"
      ></discount-add-store>
      <!-- 商圈 -->
      <discount-add-bussiness
        v-if="discountForm.relationType === 'business_district'"
        ref="business"
        :is-edit="isEdit"
        :id="id"
      ></discount-add-bussiness>

      <div style="text-align: center; margin-top: 10px">
        <el-button @click="resetForm('discountForm')">取消</el-button>
        <el-button
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="onSubmit('discountForm')"
        >
          确定
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getHour, getMinute, getSecond } from '@/util/date'
import DiscountAddGoods from '@/components/Association-Type/Goods.vue'
import DiscountAddStore from '@/components/Association-Type/Store.vue'
import DiscountAddBussiness from '@/components/Association-Type/Bussiness.vue'

import {
  getDiscountType,
  getRelationType,
  getPlatformType,
  addDiscountActivity,
  upDiscountActivity,
  getActivityDetailById
} from '@/api/operate/discount'
export default {
  components: { DiscountAddGoods, DiscountAddStore, DiscountAddBussiness },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 活动id
      id: undefined,
      // 提交按钮的状态
      loading: false,
      // 开始时间
      pickerOptionsStart: {
        disabledDate: time => {
          const endDateVal = this.discountForm.endTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          } else {
            return time.getTime() < new Date(new Date().toLocaleDateString())
          }
        }
      },
      // 结束时间
      pickerOptionsEnd: {
        disabledDate: time => {
          const beginDateVal = this.discountForm.startTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            )
          }
        }
      },
      relativeArr: [],
      setArr: [],
      platformArr: [],
      setTableData1: [
        {
          conditionAmount: undefined,
          discountAmount: undefined
        }
      ],
      setTableData2: [
        {
          conditionAmount: undefined,
          discountAmount: undefined
        }
      ],
      setTableData3: [
        {
          conditionAmount: undefined,
          discountAmount: undefined
        }
      ],
      setTableData4: [
        {
          conditionAmount: undefined,
          discountAmount: undefined
        }
      ],
      discountForm: {
        actName: '',
        applyUser: '',
        startTime: '',
        discountActivityConfCreateReq: {
          couponUsable: false,
          discountType: undefined,
          memberUsable: false
        },
        rules: [
          {
            conditionAmount: 0,
            discountAmount: 0
          }
        ],
        endTime: '',
        platform: '',
        relationIds: [],
        relationType: '',
        usedPlatform: ''
      },
      rules: {
        actName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择活动开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择活动结束时间', trigger: 'change' }
        ],
        applyUser: [
          { required: true, message: '请选择参与人群', trigger: 'change' }
        ],
        platform: [
          { required: true, message: '请选择活动使用平台', trigger: 'change' }
        ],
        'discountActivityConfCreateReq.discountType': [
          { required: true, message: '请选择优惠设置', trigger: 'change' }
        ],
        relationType: [
          { required: true, message: '请选择关联类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this._getPlatformType()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.$nextTick(() => {
        this.id = id
        this.getActivityDetail(id)
      })
    }
  },
  methods: {
    // 查询详情
    getActivityDetail(id) {
      getActivityDetailById(id).then(res => {
        const list = res.data.data

        this.discountForm = {
          id: list.id,
          actName: list.actName,
          applyUser: 'all',
          startTime: list.startTime,
          discountActivityConfCreateReq: {
            couponUsable: list.couponUsable,
            discountType: list.discountType,
            memberUsable: list.memberUsable
          },
          rules: list.rules,
          endTime: list.endTime,
          platform: list.platform,
          relationIds: [],
          relationType: list.relationType,
          usedPlatform: ''
        }
        this.setTableData1 = list.discountActivityMinusRuleRespList
        this.setTableData2 = list.discountActivityMinusRuleRespList
        this.setTableData3 = list.discountActivityMinusRuleRespList
        this.setTableData4 = list.discountActivityMinusRuleRespList
      })
    },
    // 获取平台类型
    _getPlatformType() {
      getPlatformType().then(res => {
        this.platformArr = res.data.data
        this._getRelationType()
      })
    },
    // 查询活动关联类型
    _getRelationType() {
      getRelationType().then(res => {
        this.relativeArr = res.data.data
        this._getDiscountType()
      })
    },
    // 查询折扣活动具体类型
    _getDiscountType() {
      getDiscountType().then(res => {
        this.setArr = res.data.data
      })
    },
    //新增 满N件打N折
    add_set1(row) {
      if (!row.conditionAmount) {
        this.$message.warning('请先填写满足条件')
        return
      }
      if (!row.discountAmount) {
        this.$message.warning('请先填写折扣额度')
        return
      }
      if (this.setTableData1.length > 1) {
        const condition =
          this.setTableData1[this.setTableData1.length - 2].conditionAmount

        if (parseFloat(condition) >= parseFloat(row.conditionAmount)) {
          this.$message.warning('满足条件应大于上一行的值')
          return
        }

        const discount =
          this.setTableData1[this.setTableData1.length - 2].discountAmount

        if (parseFloat(row.discountAmount) >= parseFloat(discount)) {
          this.$message.warning('折扣额度应小于上一行的值')
          return
        }
      }
      const data = {
        conditionAmount: undefined,
        discountAmount: undefined
      }
      this.setTableData1.push(data)
    },
    //新增 满N元打N折
    add_set2(row) {
      if (!row.conditionAmount) {
        this.$message.warning('请先填写满足条件')
        return
      }
      if (!row.discountAmount) {
        this.$message.warning('请先填写折扣额度')
        return
      }
      if (this.setTableData2.length > 1) {
        const condition =
          this.setTableData2[this.setTableData2.length - 2].conditionAmount

        if (parseFloat(condition) >= parseFloat(row.conditionAmount)) {
          this.$message.warning('满足条件应大于上一行的值')
          return
        }

        const discount =
          this.setTableData2[this.setTableData2.length - 2].discountAmount

        if (parseFloat(row.discountAmount) >= parseFloat(discount)) {
          this.$message.warning('折扣额度应小于上一行的值')
          return
        }
      }
      const data = {
        conditionAmount: undefined,
        discountAmount: undefined
      }
      this.setTableData2.push(data)
    },
    //新增 满N元减N元
    add_set3(row) {
      if (!row.conditionAmount) {
        this.$message.warning('请先填写满足条件')
        return
      }
      if (!row.discountAmount) {
        this.$message.warning('请先填写折扣额度')
        return
      }
      if (this.setTableData3.length > 1) {
        const condition =
          this.setTableData3[this.setTableData3.length - 2].conditionAmount

        if (parseFloat(condition) >= parseFloat(row.conditionAmount)) {
          this.$message.warning('满足条件应大于上一行的值')
          return
        }

        const discount =
          this.setTableData3[this.setTableData3.length - 2].discountAmount

        if (parseFloat(discount) >= parseFloat(row.discountAmount)) {
          this.$message.warning('减免额度应大于上一行的值')
          return
        }
      }
      const data = {
        conditionAmount: undefined,
        discountAmount: undefined
      }
      this.setTableData3.push(data)
    },
    //新增 满N元打N折
    add_set4(row) {
      if (!row.conditionAmount) {
        this.$message.warning('请先填写满足条件')
        return
      }
      if (!row.discountAmount) {
        this.$message.warning('请先填写折扣额度')
        return
      }
      if (this.setTableData4.length > 1) {
        const condition =
          this.setTableData4[this.setTableData4.length - 2].conditionAmount

        if (parseFloat(condition) >= parseFloat(row.conditionAmount)) {
          this.$message.warning('满足条件应大于上一行的值')
          return
        }

        const discount =
          this.setTableData4[this.setTableData4.length - 2].discountAmount

        if (parseFloat(discount) >= parseFloat(row.discountAmount)) {
          this.$message.warning('减免额度应大于上一行的值')
          return
        }
      }
      const data = {
        conditionAmount: undefined,
        discountAmount: undefined
      }
      this.setTableData4.push(data)
    },
    // 切换优惠设置
    // change_set() {
    //   this.setTableData = []
    //   const data = {
    //     discountAmount: undefined,
    //     conditionAmount: undefined
    //   }
    //   this.setTableData.push(data)
    // },
    //删除
    to_delete1() {
      this.setTableData1.splice(this.setTableData1.length - 1, 1)
    },
    to_delete2() {
      this.setTableData2.splice(this.setTableData2.length - 1, 1)
    },
    to_delete3() {
      this.setTableData3.splice(this.setTableData3.length - 1, 1)
    },
    to_delete4() {
      this.setTableData4.splice(this.setTableData4.length - 1, 1)
    },
    // 时间
    pickerTimeStart() {
      const time = getHour() + ':' + getMinute() + ':' + getSecond()
      return time
    },

    // 提交
    onSubmit(form) {
      const _this = this
      _this.loading = true
      if (!_this.id) {
        if (_this.discountForm.relationType === 'goods') {
          const cache = _this.$refs.goods.cache
          _this.discountForm.relationIds = cache
        }
        if (_this.discountForm.relationType === 'store') {
          const cache = _this.$refs.store.selectStoreIds
          _this.discountForm.relationIds = cache
        }
        if (_this.discountForm.relationType === 'business_district') {
          const cache = _this.$refs.business.bussinessIDs
          _this.discountForm.relationIds = cache
        }

        if (
          _this.discountForm.discountActivityConfCreateReq.discountType ===
          'full_pieces_minus_discount'
        ) {
          _this.discountForm.rules = _this.setTableData1
        }
        if (
          _this.discountForm.discountActivityConfCreateReq.discountType ===
          'full_money_minus_discount'
        ) {
          _this.discountForm.rules = _this.setTableData2
        }

        if (
          _this.discountForm.discountActivityConfCreateReq.discountType ===
          'full_pieces_minus_money'
        ) {
          _this.discountForm.rules = _this.setTableData3
        }

        if (
          _this.discountForm.discountActivityConfCreateReq.discountType ===
          'full_money_minus_money'
        ) {
          _this.discountForm.rules = _this.setTableData4
        }
      }
      _this.$refs[form].validate(valid => {
        console.log(_this.discountForm.rules, 9999)
        if (
          _this.discountForm.rules[0].conditionAmount &&
          _this.discountForm.rules[0].discountAmount &&
          _this.discountForm.rules[0].conditionAmount !== '' &&
          _this.discountForm.rules[0].discountAmount !== ''
        ) {
          if (valid) {
            _this.discountForm = {
              ..._this.discountForm,
              ..._this.discountForm.discountActivityConfCreateReq
            }
            if (_this.id) {
              _this.handleEdit()
            } else {
              _this.handleAdd()
            }
          } else {
            _this.loading = false
            return false
          }
        } else {
          this.$message.error('请将优惠设置按要求填写完毕')
          _this.loading = false
          return false
        }
      })
    },

    // 新增
    handleAdd() {
      const _this = this
      addDiscountActivity(_this.discountForm)
        .then(() => {
          _this.loading = false
          _this.$message.success('添加成功')
          setTimeout(() => {
            _this.$router.go(-1)
          }, 100)
        })
        .catch(() => {
          _this.loading = false
        })
    },

    // 修改
    handleEdit() {
      const _this = this
      const query = {
        id: _this.discountForm.id,
        actName: _this.discountForm.actName,
        endTime: _this.discountForm.endTime,
        startTime: _this.discountForm.startTime
      }
      console.log(_this.discountForm)
      upDiscountActivity(query)
        .then(() => {
          _this.loading = false
          _this.$message.success('修改成功')
          setTimeout(() => {
            _this.$router.go(-1)
          }, 100)
        })
        .catch(() => {
          _this.loading = false
        })
    },

    // 取消
    resetForm(form) {
      this.$refs[form].resetFields()
    },
    changeRule(val, handleType) {
      var handle = typeof (val * 1)
      var type = isNaN(val * 1) ? false : handle
      // console.log(val, val * 1, type)
      if (
        (val <= 0 || val > 10) &&
        type === 'number' &&
        handleType === 'discount'
      ) {
        this.$message.error('请输入1-10之间的数字')
      } else if ((type !== 'number' && handleType !== 'discount') || val <= 0) {
        this.$message.error('请输入正整数')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.main-content {
  aside {
    background: #eef1f6;
    padding: 8px 24px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
  }
  .set-table-data {
    display: flex;
    justify-content: center;
    width: 75%;
    margin: 0 auto 15px;
  }
  label {
    margin-bottom: 10px;
  }
  .el-form-item__content .el-col {
    margin-bottom: 0;
    .el-form-item--mini.el-form-item {
      margin-bottom: 0;
    }
  }
  .superposition-item {
    margin-left: 15px;
    color: rgba(51, 51, 51, 0.498039215686275);
  }
  .el-button--mini {
    width: 100px;
  }
}
</style>
