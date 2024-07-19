<template>
  <div class="main-content circle">
    <!-- 表单 -->
    <el-form
      :inline="true"
      :model="formInline"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <!-- 圈子名称-->
      <el-form-item label="圈子名称：">
        <el-input
          v-model="formInline.circleName"
          style="width: 200px"
          :placeholder="$t('message.search_keyword')"
        ></el-input>
      </el-form-item>
      <!-- 圈子类型 -->
      <el-form-item label="圈子分类：" prop="circleType">
        <el-select v-model="formInline.circleType" placeholder="请选择">
          <el-option
            v-for="(item, index) in cirleTypeList"
            :key="index"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 加入方式 -->
      <el-form-item v-show="!bannedShow" label="加入方式：">
        <el-select
          v-model="formInline.joinType"
          :placeholder="$t('message.please_select')"
        >
          <el-option
            v-for="type in joinTypes"
            :key="type.itemId"
            :label="type.itemLabel"
            :value="type.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 创建时间 -->
      <el-form-item label="创建时间：">
        <el-date-picker
          v-model="createTimeArray"
          type="daterange"
          range-separator="至"
          :start-placeholder="$t('message.start_date')"
          :end-placeholder="$t('message.end_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="createTime"
        ></el-date-picker>
      </el-form-item>
      <!-- 搜索 重置按钮 -->
      <el-form-item class="btn">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="fetList('search')"
        >
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" @click="reset"> 重置 </el-button>
      </el-form-item>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.circle_add"
        type="primary"
        @click="handleCreate"
        >{{ $t('circle.circle_add') }}</el-button
      >
    </div>

    <!-- 表格 分页 -->
    <div class="circleContent">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 启用表格分页 -->
        <el-tab-pane label="正常" name="normal"></el-tab-pane>
        <!-- 表格 -->
        <el-table
          v-loading="tableLoading"
          :empty-text="$t('message.table_empty_text')"
          border
          :data="list"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          style="width: 100%"
          :height="tableHeight"
        >
          <el-table-column
            :label="$t('circle.circle_ID')"
            prop="circleId"
          ></el-table-column>
          <el-table-column
            prop="circleName"
            :label="$t('circle.circle_information')"
            width="250"
          >
            <template slot-scope="scope">
              <div class="user-wrap">
                <el-image
                  class="avatar"
                  :src="
                    scope.row.circleLogo
                      ? scope.row.circleLogo
                      : './img/avatar.png'
                  "
                />
                <div class="user-base">
                  <div class="oneline">名称：{{ scope.row.circleName }}</div>
                  <div class="oneline">介绍：{{ scope.row.circleDesc }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="circleTypeName"
            :label="$t('circle.circle_classify')"
          ></el-table-column>
          <el-table-column prop :label="$t('circle.processing_method')">
            <template slot-scope="scope">
              <span v-if="scope.row.joinType === 'free'">
                {{ scope.row.joinTypeName }}
              </span>
              <span v-else>
                {{ scope.row.joinTypeName }} ({{ scope.row.joinAmount }})
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('circle.creator')">
            <template slot-scope="scope">
              <span>{{ scope.row.user.username }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            :label="$t('feed.gift.create_time')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | ndateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('circle.number_member')">
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.row.circleUserCount) }}</span>
            </template>
          </el-table-column>
          <!-- 热度 -->
          <el-table-column :label="$t('circle.heat')">
            <template slot-scope="scope">
              <span>{{ formatNumber(scope.row.circleHeatIndex) }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="toEdit(scope.row)"
                >编辑</el-button
              >
              <el-button size="mini" type="text" @click="toDetail(scope.row)"
                >详情</el-button
              >
              <!-- <el-button size="mini" type="danger" @click="toClearOut(scope.row)">封禁</el-button> -->
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
      </el-tabs>
    </div>
    <!-- 封禁操作弹出框 -->
    <el-dialog
      :title="$t('message.banned_operation')"
      class="dialog banneddialog"
      :visible.sync="dialogBanned"
      width="45%"
    >
      <el-form
        ref="createForm"
        :model="bannedForm"
        :rules="rules"
        label-width="100px"
      >
        <!-- 封禁类型 -->
        <el-form-item :label="$t('message.banned_type')" class="usernumber">
          <el-select v-model="bannedForm.amountWwork" placeholder="--请选择--">
            <el-option label="内容涉黄" value="≤10"></el-option>
            <el-option label="政治敏感" value="51-100"></el-option>
          </el-select>
        </el-form-item>
        <!-- 封禁期限 -->
        <el-form-item
          :label="$t('user.ban_period')"
          class="ban-period"
          prop="way"
        >
          <el-radio-group v-model="bannedForm.way">
            <el-radio :label="1">7天</el-radio>
            <el-radio :label="2">14天</el-radio>
            <el-radio :label="2">30天</el-radio>
            <el-radio :label="2">永久封禁</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 个人介绍 -->
        <el-form-item :label="$t('message.cause')" prop="name">
          <el-input
            v-model="bannedForm.textarea"
            type="textarea"
            :rows="6"
            placeholder="请填写禁用该圈子的原因的原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('createForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('createForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加圈子 -->
    <el-dialog
      title="添加圈子"
      class="dialog"
      :visible.sync="dialogAddCircle"
      width="50%"
    >
      <el-form
        ref="addCircle"
        :model="circleReq"
        :rules="addrules"
        label-width="100px"
      >
        <!-- 圈子名称 -->
        <el-form-item label="圈子名称：" prop="circleName">
          <el-input
            v-model="circleReq.circleName"
            style="width: 400px"
            type="text"
            placeholder="请输入圈子名称    最多支持输入20个字符~"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <!-- 圈子介绍 -->
        <el-form-item label="圈子介绍：" class="ban-period" prop="circleDesc">
          <el-input
            v-model="circleReq.circleDesc"
            type="textarea"
            :rows="4"
            placeholder="最多支持输入200个字~"
            maxlength="200"
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <!-- 圈子分类 -->
        <el-form-item label="圈子分类：" prop="circleType">
          <el-select v-model="circleReq.circleType" placeholder="请选择">
            <el-option
              v-for="(item, index) in cirleTypeList"
              :key="index"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 圈子LOGO -->
        <el-form-item label="圈子logo：" prop="circleLogo">
          <upload-file
            ref="upload"
            v-model="circleReq.circleLogo"
            type="content"
            :limit="1"
            :multiple="true"
            :auto-upload="false"
            v-if="dialogAddCircle"
            type-name="conten"
          />
        </el-form-item>
        <!-- 圈子背景图 -->
        <el-form-item
          label="圈子背景图："
          class="usernumber"
          prop="circleBackground"
        >
          <upload-file
            ref="upload2"
            v-model="circleReq.circleBackground"
            type="content"
            :limit="1"
            :multiple="true"
            :auto-upload="false"
            v-if="dialogAddCircle"
            type-name="conten"
          />
        </el-form-item>
        <!-- 加入方式 -->
        <el-form-item label="加入方式：" prop="joinType">
          <el-select v-model="circleReq.joinType" placeholder="请选择">
            <el-option
              v-for="type in joinTypes"
              :key="type.itemId"
              :label="type.itemLabel"
              :value="type.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 费用 -->
        <el-form-item label="费用：">
          <el-input
            v-model="circleReq.joinAmount"
            type="number"
            placeholder="请输入加入圈子的费用"
            style="width: 50%"
          ></el-input>
          <span>元</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddCircle">取 消</el-button>
        <el-button
          type="primary"
          @click="submitAddCircle()"
          :loading="dialogLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'
import { getCircleList, addObj, updateCircle } from '@/api/circle/circle'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { remote } from '@/api/system/dict'
import { typeList } from '@/api/circle/type.js'

// 图片上传组件
import UploadFile from '@/components/Upload-File/upload'

export default {
  components: {
    UploadFile,
    TablePagination
  },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      // 表单加载状态
      tableLoading: false,
      // 弹框状态
      dialogLoading: false,
      formInline: {
        //表单
        circleName: undefined, // 圈子名称
        circleType: undefined,
        joinType: undefined, //兑换方式
        startCreateTime: undefined,
        endCreateTime: undefined,
        status: 'normal'
      },
      joinTypes: [], // 加入分类字典项
      circleTypes: [], // 圈子分类 懒加载方式
      createTimeArray: [], //搜索查询条件
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
      //创建表单验证
      rules: {
        name: [
          //required 最左边红色**
          { required: true, message: '名字不能为空', trigger: 'blur' }
        ],
        way: [
          //required 最左边红色**
          {
            required: true,
            message: '请至少选择一个选项',
            trigger: 'change'
          }
        ],
        money: [
          //required 最左边红色**
          { required: true, message: '兑换金额不能为空', trigger: 'blur' }
        ],
        synchronization: [
          //required 最左边红色**
          {
            required: true,
            message: '请至少选择一个选项',
            trigger: 'change'
          }
        ]
      },
      //添加圈子表单验证
      addrules: {
        circleName: [
          { required: true, message: '圈子名称不能为空', trigger: 'blur' }
        ],
        circleDesc: [
          {
            required: true,
            message: '圈子介绍不能为空',
            trigger: 'change'
          }
        ],
        circleType: [
          {
            required: true,
            message: '圈子分类不能为空',
            trigger: 'change'
          }
        ],
        circleLogo: [
          { required: true, message: '圈子LOGO不能为空', trigger: 'blur' }
        ],
        circleBackground: [
          { required: true, message: '圈子背景图不能为空', trigger: 'blur' }
        ],
        joinType: [
          { required: true, message: '加入类型不能为空', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      list: [], //启用表格数据
      bannedlList: [], //禁用表格数据
      bannedForm: {}, //封禁操作弹出框表单
      listLoading: false, //加载
      activeName: 'normal', //导航选项卡默认选择
      dialogVisible: false, //加载弹出框
      status: 'normal', //默认启用
      bannedShow: false, //点击封禁显示input
      dialogBanned: false, //封禁操作弹出框
      dialogAddCircle: false, //添加圈子弹出框
      cirleTypeList: [], //圈子分类
      circleId: undefined,
      //添加圈子表单
      circleReq: {
        circleBackground: '',
        circleDesc: '',
        circleLogo: '',
        circleName: '',
        circleType: '',
        joinAmount: 0,
        joinType: ''
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.fetList()
    this.getJoinTypes()
    this.getTypeList()
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
    getList() {
      this.fetList()
    },
    fetList(type) {
      this.tableLoading = true
      if (type === 'search') {
        this.pagination.current = 1
      }
      const query = Object.assign({}, this.formInline)
      query.current = this.pagination.current
      query.size = this.pagination.size
      getCircleList(query)
        .then(response => {
          const result = response.data.data
          this.list = result.records
          this.pagination.total = result.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    // 加入类型查询
    getJoinTypes() {
      if (this.joinTypes.length === 0) {
        remote('circle_join_type').then(res => {
          this.joinTypes = res.data.data
        })
      }
    },
    // 获取圈子类型
    getTypeList() {
      const query = {}
      typeList(query).then(res => {
        this.cirleTypeList = res.data.data
      })
    },
    //创建日期时间触发
    createTime(dateArray) {
      const [startCreateTime, endCreateTime] = dateArray
      this.formInline.startCreateTime = startCreateTime
      this.formInline.endCreateTime = endCreateTime
    },
    //弹出框确认按钮
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
    //弹出框取消按钮
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    //重置
    reset() {
      this.formInline = {
        //表单
        circleName: undefined, // 圈子名称
        circleType: undefined,
        joinType: undefined, //兑换方式
        startCreateTime: undefined,
        endCreateTime: undefined,
        status: 'normal'
      }
      this.fetList('search')
    },
    //tap切换
    handleClick() {
      this.formInline.status = this.activeName
      this.pagination = {
        total: 0,
        current: 1,
        size: 20
      }
      this.fetList('search')
    },
    //修改按钮
    handleUpdate(rowContent) {
      console.log(rowContent)
    },
    // 新建圈子
    handleCreate() {
      this.dialogAddCircle = true
    },
    //  编辑圈子
    toEdit(val) {
      console.debug('val', val)
      setTimeout(() => {
        let circleLogo = [val.circleLogo]
        let circleBackground = [val.circleBackground]
        this.$refs.upload.loadImg(circleLogo)
        this.$refs.upload2.loadImg(circleBackground)
      }, 500)

      this.circleId = val.circleId
      this.circleReq = {
        circleBackground: val.circleBackground,
        circleDesc: val.circleDesc,
        circleLogo: val.circleLogo,
        circleName: val.circleName,
        circleType: val.circleType,
        joinAmount: val.joinAmount,
        joinType: val.joinType
      }
      this.dialogAddCircle = true
    },
    // 圈子详情
    toDetail(val) {
      this.$router.push(`/circle/details/${val.circleId}`)
    },
    // 关闭添加圈子按钮
    cancelAddCircle() {
      this.$refs.addCircle.resetFields()
      this.circleReq = {
        circleBackground: '',
        circleDesc: '',
        circleLogo: '',
        circleName: '',
        circleType: '',
        joinAmount: 0,
        joinType: ''
      }
      this.dialogAddCircle = false
    },
    // 提交添加圈子
    async submitAddCircle() {
      const _this = this
      // 打开loading
      _this.dialogLoading = true
      // 上传图片拿到imageURL(圈子logo)
      const uploadParams = _this.$refs.upload.imgURL
      uploadParams.forEach(item => {
        _this.circleReq.circleLogo = item
      })

      // 上传图片拿到imageURL(圈子背景图)
      const upload2 = _this.$refs.upload2.imgURL
      upload2.forEach(item => {
        _this.circleReq.circleBackground = item
      })

      _this.$refs.addCircle.validate(valid => {
        if (valid) {
          if (_this.circleId) {
            _this.circleReq.circleId = this.circleId
            updateCircle(_this.circleReq)
              .then(() => {
                _this.$message.success('修改成功')
                _this.dialogAddCircle = false
                _this.dialogLoading = false
                _this.fetList('search')
              })
              .catch(() => {
                console.debug('修改成功')
                _this.dialogAddCircle = false
                _this.dialogLoading = false
              })
          } else {
            addObj(_this.circleReq)
              .then(() => {
                _this.$message.success('添加成功')
                _this.dialogAddCircle = false
                _this.dialogLoading = false
                _this.fetList('search')
              })
              .catch(() => {
                console.debug('添加失败')
                _this.dialogAddCircle = false
                _this.dialogLoading = false
              })
          }
        } else {
          // 打开loading
          _this.dialogAddCircle = false
          _this.dialogLoading = false
        }
      })
    },
    // 将数据装换成k 或者w
    formatNumber(num) {
      return num >= 1e3 && num < 1e4
        ? (num / 1e3).toFixed(1) + 'k'
        : num >= 1e4
        ? (num / 1e4).toFixed(1) + 'w'
        : num
    }
  }
}
</script>

<style lang="scss" scoped>
.user-wrap {
  display: flex;
  justify-content: space-around;
  text-align: center;
  .avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  .user-base {
    width: 180px;
  }
}
.circle-base {
  margin-left: 1rem;
  .desc {
    text-align: left;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
.circleBox {
  // width: 1450px;
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  //日期选择器
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 260px;
    margin-right: 20px;
  }
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
  .marginLeft {
    margin-left: 50px;
  }
  //搜索重置按钮
  .el-form-item.btn.el-form-item--medium {
    margin: 0px 0 0 60px;
    .el-button {
      margin-right: 10px;
      span {
        margin: 0;
      }
    }
  }
  //表单内容
  .circleContent {
    .el-tabs.el-tabs--card.el-tabs--top {
      margin-top: 20px;
      .el-tabs__item.is-top {
        padding: 0 50px;
        color: #606266;
      }
    }
  }

  /* 对话框头部 */
  .el-dialog {
    .el-dialog__body {
      padding: 30px 0;
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
      margin-left: 140px;
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
  //封禁弹出框
  .ban-period {
    .el-form-item__content {
      width: 450px;
    }
  }
  .el-table__header {
    tr {
      th {
        div {
          text-align: center;
        }
      }
    }
  }
  .el-table__row {
    td {
      .cell {
        text-align: center;
      }
    }
  }
}
</style>
