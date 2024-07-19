<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="优惠券名称：">
        <el-input
          v-model="search.couponName"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="适用渠道：">
        <el-select v-model="search.couponTypeId" placeholder="请选择适用渠道">
          <el-option
            v-for="type in couponTypes"
            :key="type.typeId"
            :label="type.typeName"
            :value="type.typeId"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="优惠券类型：">
        <el-select v-model="search.discountType" placeholder="请选择类型">
          <el-option
            v-for="item in couponTypeList"
            :key="item.typeId"
            :label="item.typeName"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="search.status" placeholder="请选择状态">
          <el-option
            v-for="(type, typeIndex) in couponStatus"
            :key="typeIndex"
            :label="type.dictName"
            :value="type.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initPageCoupon">搜索</el-button>
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <div id="tableBtn">
      <el-button type="primary" @click="addcompile('reduction')"
        >新增满减券</el-button
      >
      <el-button type="primary" @click="addcompile('discount')"
        >新增折扣券</el-button
      >
    </div>
    <el-table
      v-loading="tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="tableData"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="couponName" label="优惠券名称" width="100">
      </el-table-column>
      <!-- <el-table-column prop="couponTypeName" label="适用渠道" width="100">
        </el-table-column> -->
      <el-table-column prop="discountTypeName" label="优惠券类型" width="100">
      </el-table-column>
      <el-table-column prop="withAmount" label="优惠内容" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row | preferentialContent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领劵周期" width="200px">
        <template slot-scope="scope">
          <div v-if="scope.row.startTime && scope.row.endTime">
            {{ scope.row.startTime ? scope.row.startTime : '--' }}至{{
              scope.row.endTime ? scope.row.endTime : '--'
            }}
          </div>
          <div v-else>领取之后{{ scope.row.validDays }}天内有效</div>
        </template>
      </el-table-column>
      <el-table-column label="使用有效期" width="200px">
        <template slot-scope="scope">
          <div>
            {{
              scope.row.validDays
                ? `领取之后${scope.row.validDays}天内有效`
                : `${scope.row.validStartTime}--${scope.row.validEndTime}`
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div>{{ scope.row.statusName ? scope.row.statusName : '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <!-- (进行中:in_progress未开始:not_started已过期:expired已作废:finish) -->
          <el-button
            type="text"
            size="mini"
            @click="handleLookCoupon(scope.row.couponId)"
            >查看</el-button
          >
          <el-button
            v-if="scope.row.status === 'not_started'"
            key="edit"
            type="text"
            size="mini"
            @click="handleEdit(scope.row.couponId)"
            >编辑</el-button
          >
          <el-button
            v-if="
              (scope.row.status === 'in_progress' ||
                scope.row.status === 'not_started') &&
              scope.row.quota != -1
            "
            key="add"
            type="text"
            size="mini"
            @click="handleAdd(scope.row)"
          >
            增发
          </el-button>
          <el-button
            v-if="
              scope.row.status === 'in_progress' ||
              scope.row.status === 'not_started'
            "
            key="finish"
            size="mini"
            type="text"
            @click="to_finish(scope.row.couponId)"
          >
            结束
          </el-button>
        </template>
      </el-table-column> </el-table
    ><!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getList"
    />
    <!--增发  -->
    <el-dialog
      title="增发优惠劵"
      :visible.sync="addDialog"
      width="30%"
      :before-close="handleClose"
    >
      <div class="dialog-content">
        <el-form label-width="150px" :form="form">
          <el-form-item label="当前总发行量：">
            <label>{{ form.quota }}张</label>
          </el-form-item>
          <el-form-item label="新增发行量：">
            <div>
              +<el-input
                v-model="form.newQuota"
                type="number"
                style="width: 90px"
              ></el-input
              >张
            </div>
          </el-form-item>
          <el-form-item label="更新后总发行量：">
            <label>{{ form.updateQuota }}张</label>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="to_increase()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  pageCoupons,
  getStates,
  updateCouponStatus,
  increaseCoupon
} from '@/api/coupon/coupon'
import { allCouponTypes } from '@/api/coupon/couponType'
import TablePagination from '@/components/table-pagination'
// import turnCompileVue from '../operate/market/turn-compile.vue'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      tableLoading: false,
      addDialog: false,
      search: {
        couponTypeId: undefined,
        couponName: undefined,
        status: undefined,
        discountType: undefined
      },
      // 表单绑定值
      form: {
        quota: undefined,
        couponId: undefined,
        newQuota: undefined,
        updateQuota: undefined
      },
      // 优惠券适用渠道
      couponTypes: [],
      // 优惠券类型
      couponTypeList: [],
      tableData: [],
      couponStatus: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0
      }
    }
  },
  watch: {
    'form.newQuota'(val) {
      console.log(val)
      this.form.updateQuota =
        parseInt(this.form.newQuota) + parseInt(this.form.quota)
    }
  },
  created() {
    this.initPageCoupon()
    this.getCouponTypes()
    this.getStates()
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
    getList() {
      this.initPageCoupon()
    },
    // 查询优惠券列表
    initPageCoupon() {
      const query = Object.assign({}, this.search)
      query.size = this.pagination.size
      query.current = this.pagination.current
      console.log(query)
      this.tableLoading = true
      pageCoupons(query)
        .then(resp => {
          this.tableLoading = false
          const page = resp.data.data
          this.tableData = page.records
          this.pagination.total = page.total
          this.pagination.pages = page.pages
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 增发提交
    to_increase() {
      if (!this.form.newQuota) {
        this.addDialog = false
        return
      }
      const data = {
        couponId: this.form.couponId,
        quota: this.form.newQuota
      }
      increaseCoupon(data).then(res => {
        console.log(res)
        this.$message.success('成功')
        this.addDialog = false
        this.initPageCoupon()
      })
    },

    //打开 增发
    handleAdd(row) {
      this.form = {
        quota: row.quota,
        couponId: row.couponId,
        newQuota: undefined,
        updateQuota: row.quota
      }
      this.addDialog = true
    },
    // 优惠劵类型
    getCouponTypes() {
      // 获取优惠券类型
      allCouponTypes().then(res => {
        this.couponTypeList = res.data.data
      })
    },
    //状态
    getStates() {
      getStates().then(res => {
        this.couponStatus = res.data.data
      })
    },
    // 重置
    reset() {
      this.search = {
        couponTypeId: undefined,
        couponName: undefined,
        status: undefined,
        discountType: undefined
      }
      this.initPageCoupon()
    },
    // 去结束
    to_finish(id) {
      console.debug('id', id)
      this.$confirm(
        '确认结束后，将停止发行该券，已领取的优惠券可继续使用。',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const data = {
            couponId: id,
            // (进行中:in_progress未开始:not_started已过期:expired已作废:finish)
            status: 'finish'
          }
          updateCouponStatus(data).then(res => {
            console.log(res)
            this.$message.success('修改成功')
            this.initPageCoupon()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消结束'
          })
        })
    },
    handleClose() {
      this.form = {
        quota: undefined,
        couponId: undefined,
        newQuota: undefined,
        updateQuota: undefined
      }
      this.addDialog = false
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleLookCoupon(couponId) {
      this.$router.push(`/coupon/details/${couponId}`)
    },
    handleEdit(couponId) {
      this.$router.push(`/coupon/editCoupon/${couponId}`)
    },
    // 添加
    addcompile(discountType) {
      this.$router.push({ path: '/coupon/addcoupon', query: { discountType } })
    }
  }
}
</script>
<style lang="scss">
.business {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
}
</style>
