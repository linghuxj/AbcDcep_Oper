<template>
  <div class="giftBox">
    <!-- 表单 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <!-- 礼物名称 -->
      <el-form-item :label="$t('feed.gift.name')" class="giftSelect">
        <span>:</span>
        <el-select v-model="keyword" :placeholder="$t('feed.gift.name')">
          <el-option :label="$t('feed.gift.name')" value="giftName"></el-option>
        </el-select>
        <el-input
          v-model="formInline.keyword"
          class="inputWidth"
          :placeholder="$t('message.search_keyword')"
        ></el-input>
      </el-form-item>
      <!-- 创建时间 -->
      <el-form-item :label="$t('feed.gift.create_time')">
        <span>:</span>
        <el-date-picker
          v-model="formInline.startCreateTimeArray"
          type="daterange"
          range-separator="~"
          :start-placeholder="$t('message.start_date')"
          :end-placeholder="$t('message.end_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="createTime"
        ></el-date-picker>
      </el-form-item>
      <!-- 修改时间 -->
      <el-form-item :label="$t('feed.gift.modification_time')">
        <span>:</span>
        <el-date-picker
          v-model="formInline.startUpdateTimeArray"
          type="daterange"
          range-separator="~"
          :start-placeholder="$t('message.start_date')"
          :end-placeholder="$t('message.end_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="updateTime"
        ></el-date-picker>
      </el-form-item>
      <!-- 兑换方式 -->
      <!-- <el-form-item :label="$t('feed.gift.Ways_convert')" class="giftSelect">
        <span>:</span>
        <el-select
          v-model="formInline.exchangeType"
          placeholder="请选择..."
          class="waysSelect"
        >
          <el-option :label="$t('feed.gift.free')" value="free"></el-option>
          <el-option :label="$t('feed.gift.pay')" value="pay"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- 礼物分组 -->
      <!-- <el-form-item :label="$t('feed.gift.gift_packet')" class="giftSelect">
        <span>:</span>
        <el-select
          v-model="formInline.grouping"
          placeholder="请选择..."
          class="waysSelect"
        >
          <el-option label="分组一" value="shanghai"></el-option>
          <el-option label="分组二" value="beijing"></el-option>
          <el-option label="分组三" value="beijing"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item class="btn">
        <el-button type="primary" @click="search">{{
          $t("feed.gift.search")
        }}</el-button>
        <el-button type="primary" @click="reset">{{
          $t("feed.gift.reset")
        }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 分页 -->
    <div class="giftContent">
      <el-button
        v-if="permissions.reward_gift_add"
        type="primary"
        @click="handleCreateDialog"
      >{{ $t("feed.gift.create_gift") }}</el-button
      >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('feed.gift.start_using')" name="normal">
          <!-- 表格 -->
          <el-table
            v-loading="listLoading"
            border
            :empty-text="$t('message.table_empty_text')"
            :data="list"
          >
            <el-table-column
              fixed="left"
              type="index"
              :index="1"
              :label="$t('message.serial_number')"
            ></el-table-column>

            <el-table-column :label="$t('feed.gift.picture')" prop="giftIcon">
              <template slot-scope="scope">
                <el-image
                  fit="scale-down"
                  :src="scope.row.giftIcon"
                  alt="icon"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="giftName"
              :label="$t('feed.gift.name')"
            ></el-table-column>
            <el-table-column
              prop="giftPrice"
              :label="$t('feed.gift.change_amount')"
            ></el-table-column>
            <el-table-column
              prop="exchangeTypeName"
              :label="$t('feed.gift.ways_convert')"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              :label="$t('feed.gift.create_time')"
            >
              <template
                slot-scope="scope"
              ><span>{{ scope.row.createTime | ndateFormat }}</span></template
              >
            </el-table-column>
            <el-table-column
              prop="updateTime"
              :label="$t('feed.gift.modification_time')"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime | ndateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="statusName" :label="$t('message.status')">
              <template slot-scope="scope">
                <el-tag>{{ scope.row.statusName }}</el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="createBy"
              :label="$t('feed.gift.operator')"
            ></el-table-column> -->
            <el-table-column
              :label="$t('message.operate')"
              width="180"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="permissions.reward_gift_edit"
                  type="text"
                  size="mini"
                  @click="handleUpdate(scope.row)"
                >{{ $t("feed.gift.modification") }}</el-button
                >
                <!-- 翻译按钮 -->
                <el-button
                  v-if="permissions.reward_gift_edit"
                  type="text"
                  size="mini"
                  @click="handleTrans(scope.row)"
                >{{ $t("system.dict.trans") }}</el-button
                >
                <el-button
                  v-if="permissions.reward_gift_edit"
                  type="text"
                  size="mini"
                  @click="handleStatus(scope.row)"
                >{{ $t("message.status") }}</el-button
                >
                <el-button
                  v-if="permissions.reward_gift_del"
                  type="text"
                  size="mini"
                  @click="handleDelete(scope.row)"
                >{{ $t("message.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            background
            :current-page="pagination.current"
            :page-sizes="pagination.pageSize"
            :page-size="pagination.size"
            layout="sizes, prev, pager, next"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="handleCurrentChange"
            @next-click="handleCurrentChange"
          ></el-pagination>
        </el-tab-pane>
        <!-- 禁用按钮 -->
        <el-tab-pane :label="$t('feed.gift.forbidden')" name="disabled">
          <el-table
            v-loading="listLoading"
            :empty-text="$t('message.table_empty_text')"
            border
            :data="list"
          >
            <el-table-column
              fixed="left"
              type="index"
              :index="1"
              :label="$t('message.serial_number')"
            ></el-table-column>

            <el-table-column :label="$t('feed.gift.picture')" prop="giftIcon">
              <template slot-scope="scope">
                <el-image
                  fit="scale-down"
                  :src="scope.row.giftIcon"
                  alt="icon"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="giftName"
              :label="$t('feed.gift.name')"
            ></el-table-column>
            <el-table-column
              prop="giftPrice"
              :label="$t('feed.gift.change_amount')"
            ></el-table-column>
            <!-- <el-table-column
              prop="exchangeType"
              :label="$t('feed.gift.ways_convert')"
            ></el-table-column> -->
            <el-table-column
              prop="createTime"
              :label="$t('feed.gift.create_time')"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | ndateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="updateTime"
              :label="$t('feed.gift.modification_time')"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime | ndateFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createBy"
              :label="$t('feed.gift.operator')"
            ></el-table-column>
            <el-table-column
              :label="$t('message.operate')"
              width="180"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-if="permissions.reward_gift_edit"
                  type="text"
                  size="mini"
                  @click="handleView(scope.row)"
                >{{ $t("feed.gift.modification") }}</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  @click="handleTrans(scope.row)"
                >
                  {{ $t("system.dict.trans") }}
                </el-button>
                <el-button
                  v-if="permissions.reward_gift_edit"
                  type="text"
                  size="mini"
                  @click="handleStatus(scope.row)"
                >{{ $t("message.status") }}</el-button
                >
                <el-button
                  v-if="permissions.reward_gift_del"
                  type="text"
                  size="mini"
                  @click="handleDelete(scope.row)"
                >{{ $t("message.delete") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            background
            :current-page="pagination.current"
            :page-sizes="pagination.pageSize"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      :title="isEdit ? $t('message.update') : $t('message.add')"
      class="dialog"
      :visible.sync="dialogVisible"
      width="35%"
    >
      <el-form
        ref="createForm"
        :model="createForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="$t('feed.gift.name')" prop="giftName">
          <el-input v-model="createForm.giftName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('feed.gift.icon')" prop="giftIcon">
          <upload
            v-if="dialogVisible"
            ref="icon"
            v-model="createForm.giftIcon"
            :limit="1"
            type-name="image"
          />
        </el-form-item>
        <el-form-item :label="$t('feed.gift.Ways_convert')" prop="way">
          <el-radio-group v-model="createForm.exchangeType">
            <el-radio
              v-for="way in ways"
              :key="way.itemId"
              :label="way.itemValue"
            >{{ way.itemValue }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('feed.gift.amount')"
          class="change-amount"
          prop="giftPrice"
        >
          <el-input
            v-model="createForm.giftPrice"
            autocomplete="off"
          ></el-input>
          <!-- <span class="dollar">美元</span> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('createForm')">{{
          $t("message.cancel")
        }}</el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          :disabled="b_loading"
          @click="handleUpdateGift"
        >{{ $t("message.confirm") }}</el-button
        >
        <el-button
          v-else
          type="primary"
          :disabled="b_loading"
          @click="handleCreateGift"
        >{{ $t("message.confirm") }}</el-button
        >
      </span>
    </el-dialog>

    <!-- 状态框 -->
    <el-dialog :title="$t('user.change_status')" :visible.sync="stateDialog">
      <el-form ref="stateForm" :model="stateForm">
        <el-form-item :label="$t('message.status')">
          <el-select
            v-model="stateForm.status"
            placeholder="请选择"
            prop="status"
          >
            <el-option
              v-for="state in states"
              :key="state.dictName"
              :label="state.dictName"
              :value="state.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCloseStateDialog">{{
            $t("message.cancel")
          }}</el-button>
          <el-button @click="handleState">{{
            $t("message.confirm")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 翻译框 -->
    <el-dialog
      :title="$t('system.dict.trans')"
      class="dialog"
      :visible.sync="transDialog"
      @close="handleCloseTransDialog"
    >
      <div style="margin-top:-1rem;" class="radio">
        <div style="color:#4d0000;">
          {{ $t("system.dict.tips") }}
        </div>
        <span>{{ $t("system.dict.trans") }}：</span>
        <el-radio
          v-for="dict in languageDicts"
          :key="dict.id"
          v-model="language"
          :label="dict.itemValue"
          @change="translate"
        >{{ dict.itemLabel }}</el-radio
        >
      </div>
      <el-form
        ref="transForm"
        :model="transForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="$t('feed.gift.name')" prop="giftName">
          <el-input v-model="transForm.giftName" disabled />
        </el-form-item>
        <el-form-item :label="$t('feed.gift.icon')" prop="giftIcon">
          <el-image :src="transForm.giftIcon" alt="" />
        </el-form-item>
        <el-form-item :label="$t('feed.gift.Ways_convert')" prop="way">
          <el-input v-model="transForm.exchangeType" disabled />
        </el-form-item>
        <el-form-item
          :label="$t('feed.gift.amount')"
          class="change-amount"
          prop="giftPrice"
        >
          <el-input v-model="transForm.giftPrice" disabled />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="permissions.dict_trans"
            type="primary"
            :disabled="b_loading"
            @click="transGift(transForm.giftId)"
          >
            {{ $t("message.trans") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="$t('user.change_status')" :visible.sync="stateDialog">
      <el-form ref="stateForm" :model="stateForm">
        <el-form-item :label="$t('message.status')">
          <el-select
            v-model="stateForm.status"
            :placeholder="$t('message.please_select')"
            prop="status"
          >
            <el-option
              v-for="state in states"
              :key="state.dictName"
              :label="state.dictName"
              :value="state.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCloseStateDialog">{{
            $t("message.cancel")
          }}</el-button>
          <el-button @click="handleState">{{
            $t("message.confirm")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  fetchList,
  addObj,
  postObj,
  deleteById,
  statusObj,
  getGiftStates,
  validByGiftname
} from '@/api/feeds/gift'
import { trans, transGet } from '@/api/feeds/gift'
import { remote } from '@/api/system/dict'
import upload from '@/components/Upload-File/upload.vue'
export default {
  components: {
    upload
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  data() {
    const validHasGiftName = async(rule, value, callback) => {
      if (value && value != this.origin.giftName) {
        await validByGiftname(value).then(res => {
          if (res.data.data) {
            return callback(
              new Error(this.$t('feed.gift.valid_has_gift_name'))
            )
          }
          return callback()
        })
      }
      return callback()
    }
    return {
      itemForm: {
        dictType: undefined,
        itemValue: undefined,
        itemLabel: undefined,
        description: undefined
      }, //查看弹出框
      keyword: undefined,
      formInline: {
        //表单
        keyword: undefined,
        startCreateTimeArray: [], //创建时间数组
        startUpdateTimeArray: [], //修改时间数组
        endCreateTime: undefined, //创建结束时间
        endUpdateTime: undefined, //修改结束时间
        startCreateTime: undefined, //创建时间
        startUpdateTime: undefined //修改时间
      },
      stateForm: {
        giftId: undefined,
        status: undefined
      },
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //页面数组
        pageSize: [5, 10, 15, 20],
        //总条数
        total: 0
      },
      b_loading: false,
      //创建内容表单
      createForm: {
        giftName: undefined,
        giftIcon: undefined,
        exchangeType: 'pay',
        giftPrice: 0,
        currency: 'usd'
      },
      origin: {},
      ways: [],
      states: [], // 状态列表
      stateDialog: false,
      transDialog: false,
      transForm: {},
      isEdit: false,
      //创建表单验证
      rules: {
        giftName: [
          //required 最左边红色**
          {
            required: true,
            message: this.$t('feed.gift.valid_name'),
            trigger: 'blur'
          },
          {
            validator: validHasGiftName,
            trigger: 'blur'
          }
        ],
        giftIcon: [
          {
            required: true,
            message: this.$t('feed.gift.valid_gift_icon'),
            trigger: 'blur'
          }
        ],
        giftPrice: [
          {
            required: true,
            message: this.$t('feed.gift.valid_amount'),
            trigger: 'blur'
          }
        ]
      },
      formLabelWidth: '120px',
      list: [], //表格数据
      listLoading: false,
      activeName: 'normal', //导航选项卡默认选择
      dialogVisible: false, //弹出框
      radio: 2, //兑换方式单选
      status: 'normal',
      viewVisible: false,
      languageDicts: [], //单选框
      language: window.localStorage.getItem('mewooo-language') || 'en'
    }
  },
  created() {
    this.listLoading = true
    this.getList()
  },
  methods: {
    transGift(id) {
      const obj = {
        id,
        language: this.language
      }
      this.b_loading = true
      trans(obj)
        .then(res => {
          this.transForm = res.data.data
          this.$message.success(this.$t('message.trans_success'))
          this.b_loading = false
        })
        .catch(() => {
          this.b_loading = false
        })
    },
    translate() {
      const obj = {
        id: this.transForm.giftId,
        language: this.language
      }
      transGet(obj).then(res => {
        console.log(res, 'res')
        this.transForm = res.data.data
      })
    },
    handleCloseTransDialog() {
      this.language = window.localStorage.getItem('mewooo-language') || 'en'
    },
    handleTrans(gift) {
      this.transDialog = true
      this.transForm = Object.assign({}, gift)
      if (this.languageDicts.length === 0) {
        remote('language').then(response => {
          this.languageDicts = response.data.data
        })
      }
    },
    //查看弹出框关闭
    handleViewItemCancel() {
      this.itemViewVisible = false
      this.itemForm = {
        dictType: undefined,
        itemValue: undefined,
        itemLabel: undefined,
        description: undefined
      }
    },
    //创建日期时间触发
    createTime(val) {
      const [startDate, endDate] = val
      this.formInline.startCreateTime = startDate
      this.formInline.endCreateTime = endDate
    },
    //修改日期触发
    updateTime(val) {
      const [startDate, endDate] = val
      this.formInline.startUpdateTime = startDate
      this.formInline.endUpdateTime = endDate
    },
    //弹出框取消按钮
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.createForm = {
        giftName: undefined,
        giftIcon: undefined,
        exchangeType: 'pay',
        giftPrice: 0,
        currency: 'usd'
      }
      this.dialogVisible = false
      this.isEdit = false
    },
    //查询礼物列表
    getList() {
      this.listLoading = true
      const query = Object.assign({}, this.formInline)
      if (this.keyword) {
        query[this.keyword] = query.keyword
        delete query.keyword
      }
      fetchList({
        status: this.status,
        size: this.pagination.size,
        current: this.pagination.current,
        ...query
      })
        .then(res => {
          // console.log(res);
          this.list = res.data.data.records
          this.pagination.total = res.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleCreateDialog() {
      this.dialogVisible = true
      if (this.ways.length === 0) {
        remote('gift_exchange_type').then(response => {
          this.ways = response.data.data
        })
      }
    },
    handleCreateGift() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.b_loading = true
          const form = Object.assign({}, this.createForm)
          addObj(form)
            .then(response => {
              this.dialogVisible = false
              this.b_loading = false
              this.$message.success(this.$t('message.add_success'))
              this.getList()
            })
            .catch(() => {
              this.b_loading = false
            })
        }
      })
    },
    handleUpdateGift() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          this.b_loading = true
          const form = Object.assign({}, this.createForm)
          postObj(form)
            .then(response => {
              this.dialogVisible = false
              this.createForm = {
                giftName: undefined,
                giftIcon: undefined,
                exchangeType: 'pay',
                giftPrice: 0,
                currency: 'usd'
              }
              this.b_loading = false
              this.$message.success(this.$t('message.edit_success'))
              this.getList()
            })
            .catch(() => {
              this.b_loading = false
            })
        }
      })
    },
    //重置
    reset() {
      this.keyword = undefined
      this.formInline = {
        //表单
        keyword: undefined,
        startCreateTime: [], //创建时间
        startUpdateTime: [],
        endCreateTime: '', //创建结束时间
        endUpdateTime: '', //修改结束时间
        startCreateTime: '', //创建时间
        startUpdateTime: '' //修改时间 //修改时间
      }
      this.getList()
    },
    //搜索
    search() {
      this.getList()
      // console.log(this.formInline);
    },
    //tap切换
    handleClick(tab, event) {
      this.status = tab.name
      this.getList()
    },
    //修改按钮
    handleUpdate(rowContent) {
      this.createForm = Object.assign({}, rowContent)
      this.origin = Object.assign({}, rowContent)
      if (this.ways.length === 0) {
        remote('gift_exchange_type').then(response => {
          this.ways = response.data.data
        })
      }
      this.dialogVisible = true
      this.isEdit = true
    },
    //禁用启用按钮
    handleStatus(gift) {
      this.stateForm = {
        giftId: gift.giftId,
        status: gift.status
      }
      this.stateDialog = true
      if (this.states.length === 0) {
        getGiftStates().then(response => {
          this.states = response.data.data
        })
      }
    },
    handleCloseStateDialog() {
      this.$refs.stateForm.resetFields()
      this.stateDialog = false
    },
    handleState() {
      this.b_loading = true
      statusObj(this.stateForm)
        .then(response => {
          this.stateDialog = false
          this.b_loading = false
          this.$message.success(this.$t('message.edit_success'))
          this.getList()
        })
        .catch(() => {
          this.b_loading = false
        })
    },
    //页容量改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.page = 1
      this.pagination.size = val
      this.getList()
    },
    //页码改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagination.current = val
      this.getList()
    },
    handleDelete(gift) {
      this.$confirm(
        this.$t('message.will_delete_data'),
        this.$t('message.tips'),
        {
          confirmButtonText: this.$t('message.confirm'),
          cancelButtonText: this.$t('message.cancel'),
          type: 'warning'
        }
      ).then(() => {
        deleteById(gift.giftId).then(response => {
          this.$message.success(this.$t('message.delete_success'))
          this.getList()
        })
      })
    }
    /* handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    } */
  }
}
</script>

<style lang="scss" scoped>
.giftBox {
  width: 100%;
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  .demo-form-inline {
    display: flex;
    flex-wrap: wrap;
    span {
      margin-right: 10px;
    }
    .el-form-item__label {
      padding: 0;
    }
    .el-select__caret.el-input__icon.el-icon-arrow-up {
      margin-right: -18px;
    }
  }
  .el-form-item.giftSelect {
    display: flex;
    .el-input__inner {
      width: 100px;
      padding: 0;
      border-radius: 0;
    }
    .el-form-item__content {
      display: flex;
    }
    .inputWidth {
      input {
        width: 200px;
        border-radius: 5px;
      }
    }
    .waysSelect {
      .el-input {
        .el-input__inner {
          padding: 20px;
          width: 250px;
          background-color: rgb(238, 241, 241);
        }
        input::-webkit-input-placeholder {
          color: black;
        }
        input::-moz-input-placeholder {
          color: black;
        }
        input::-ms-input-placeholder {
          color: black;
        }
      }
    }
  }
  //搜索重置按钮
  .el-form-item.btn.el-form-item--medium {
    margin: 10px 0 0 250px;
    .el-button {
      margin-right: 10px;
      span {
        margin: 0;
      }
    }
  }
  //表单内容
  .giftContent {
    .el-tabs.el-tabs--card.el-tabs--top {
      margin-top: 20px;
      .el-tabs__item.is-top {
        padding: 0 50px;
        font-size: 16px;
        color: #606266;
      }
    }
  }

  /* 对话框头部 */
  .el-dialog {
    .el-dialog__body {
      padding: 30px 10px;
    }
    .el-form-item__content {
      display: flex;
      width: 300px;
      margin-left: 20px !important;
      .el-radio-group {
        margin-top: 12px;
      }
    }
    .el-input.el-input--medium {
      width: 200px;
    }
    .change-amount {
      display: flex;
      text-align: left;
      // margin-left: 140px;
      width: 400px;
      .el-form-item__content {
        margin-left: 0 !important;
      }
      span {
        margin-right: 5px;
      }
      .dollar {
        display: inline-block;
        height: 36px;
        width: 40px;
        background-color: rgb(165, 164, 164);
        text-align: center;
        line-height: 36px;
      }
      .el-input__inner {
        border-radius: 4px 0 0 4px;
      }
    }
    .WhetherSyn {
      .el-form-item__content {
        width: 450px;
      }
    }
  }
  .dialog .el-dialog .el-dialog__header {
    width: 100%;
    height: 53px;
    padding: 0;
    line-height: 53px;
    border-bottom: 1px solid rgb(187, 186, 186);
    .el-dialog__title {
      margin-left: 20px;
      font-size: 18px;
    }
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cell {
    button {
      margin-left: 20px;
    }
  }
  .el-tabs__nav.is-top #tab-second {
    margin-left: 0;
  }
  .radio {
    margin: 30px 20px;
    font-size: 20px;
  }
}
</style>
