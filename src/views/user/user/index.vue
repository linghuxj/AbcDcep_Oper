<template>
  <div class="main-content">
    <!-- 表单 -->
    <!-- 筛选条件表单 -->
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <!-- 用户搜索 -->
      <el-form-item label="用户搜索：">
        <el-input
          v-model="search.keyword"
          style="width: 100%"
          placeholder="请输入要搜索的关键字"
        >
          <el-select slot="prepend" v-model="searchType" placeholder="请选择">
            <el-option label="用户ID" value="userId"></el-option>
            <el-option label="手机号" value="mobile"></el-option>
            <el-option label="用户名" value="username"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item label="性别：" class="giftSelect">
        <el-select
          v-model="search.sex"
          placeholder="请选择"
          class="userWaysSelect"
        >
          <el-option
            v-for="type in userSexTypes"
            :key="type.itemId"
            :label="type.itemLabel"
            :value="type.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 注册时间 -->
      <el-form-item label="注册时间：">
        <el-date-picker
          v-model="registerDate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="createTime"
        ></el-date-picker>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" class="reset" @click="resetSearch">
          重置
        </el-button>
      </div>
    </el-form>
    <!-- 打标签 -->
    <!-- <div id="tableBtn">
      <el-button type="primary" @click="handleLabel"> 打标签 </el-button>
    </div> -->
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="list"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" prop="userId" width="50" />
      <el-table-column label="用户ID" prop="userId" width="150" />
      <el-table-column
        label="用户信息"
        width="160"
        prop=""
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div class="user-wrap">
            <img
              class="avatar"
              :src="scope.row.avatar ? scope.row.avatar : './img/avatar.png'"
            />
            <div class="user-base">
              <div class="oneline">{{ scope.row.username }}</div>
              <div class="oneline">{{ scope.row.mobile }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sexName"></el-table-column>
      <el-table-column label="DC钱包" prop="cWallet">
        <template slot-scope="dcWallet">
          <span>{{ dcWallet.row.dcWallet ? dcWallet.row.dcWallet : '/' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计消费金额（元）"
        prop="consumeAmount"
        width="135"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.expenditureTotalAmount
              ? scope.row.expenditureTotalAmount
              : '/'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计消费次数（次）"
        prop="consumeCount"
        width="135"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.expenditureTotalNum ? scope.row.expenditureTotalNum : '/'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单均价（元）" prop="orderAvgPrice" width="120">
        <template slot-scope="scope">
          <span>{{
            scope.row.orderAveragePrice ? scope.row.orderAveragePrice : '/'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最近消费时间"
        prop="latestConsumeTime"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.latestConsumeTime ? scope.row.latestConsumeTime : '/'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" prop="createTime" width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getUserList"
    />
    <!-- 封禁操作弹出框 -->
    <el-dialog
      :title="$t('message.banned_operation')"
      class="dialog banneddialog"
      :visible.sync="dialogBanned"
      width="40%"
    >
      <el-form ref="forbbidForm" :model="forbbidForm">
        <el-form-item :label="$t('message.banned_type')" class="usernumber">
          <el-select
            v-model="search.amountWwork"
            placeholder="--请选择--"
            class="international"
          >
            <el-option label="违规" value="1"></el-option>
            <el-option label="其他" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('user.ban_period')" class="ban-period">
          <el-radio-group v-model="forbbidForm.way">
            <el-radio :label="1">7天</el-radio>
            <el-radio :label="2">14天</el-radio>
            <el-radio :label="3">30天</el-radio>
            <el-radio :label="4">永久封禁</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('message.cause')">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请填写禁用用户的原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('forbbidForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('forbbidForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 选择标签操作弹出框 -->
    <el-dialog
      :title="$t('feed.tag.select_label')"
      class="dialog banneddialog"
      :visible.sync="dialogLabel"
      width="38%"
    >
      <tag-popup :user-id-list="userIdList" :close-tag="closeTag" />
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from '@/components/table-pagination'
import { mapGetters } from 'vuex'
import { remote } from '@/api/system/dict'
import { countries } from '@/config/country_banner'

// 添加基本用户接口
import { getSubscriberPage } from '@/api/customer/subscriber'

import TagPopup from './components/TagPopup'

export default {
  components: {
    TagPopup,
    TablePagination
  },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      list: [],
      countries: countries,
      search: {
        //表单
        keyword: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined,
        status: undefined,
        sex: undefined
      },
      registerDate: '', // 注册日期
      searchType: '',
      userStates: [], // 用户状态
      userSexTypes: [], // 用户性别
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //总条数
        total: 0
      },
      roles: [], // 角色列表
      forbbidForm: {},
      normalList: [], //正常用户表格数据
      bannedList: [], //封禁用户表格数据
      listLoading: false,
      b_loading: false, // 按钮loading
      activeName: 'normal', //导航选项卡默认选择
      dialogBanned: false, //封禁弹出框
      dialogReason: false, //封禁原因
      radio: 2, //兑换方式单选
      status: 'normal',
      dialogLabel: false, // 选择标签弹出框
      // 用于复选框存储用户的id
      userIdList: [],
      userRules: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.getUserList()
    this.getUserStatus()
    this.getUserSexTypes()
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
    //正常用户封禁按钮
    handlebanned() {
      this.dialogBanned = true
    },
    getUserList() {
      const keyword = this.searchType
      const query = Object.assign({}, this.search)
      delete query.keyword
      delete query.registerDate
      query.size = this.pagination.size
      query.current = this.pagination.current
      query[keyword] = this.search.keyword
      this.listLoading = true
      query.status = this.activeName
      getSubscriberPage(query)
        .then(response => {
          this.listLoading = false
          const result = response.data.data
          this.list = result.records
          this.pagination.total = result.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    getUserStatus() {
      if (this.userStates.length === 0) {
        remote('user_status_type').then(response => {
          this.userStates = response.data.data
        })
      }
    },
    // 获取性别列表
    getUserSexTypes() {
      if (this.userSexTypes.length === 0) {
        remote('user_sex_type').then(response => {
          this.userSexTypes = response.data.data
        })
      }
    },
    handleSearch() {
      this.pagination.current = 1
      this.getUserList()
    },
    // 用户标签
    handleLabel() {
      if (this.userIdList.length > 0) {
        this.dialogLabel = true
      } else {
        this.$message({
          message: '请先选择需要贴标签的用户~',
          type: 'warning'
        })
      }
    },
    // 关闭标签弹窗
    closeTag() {
      this.dialogLabel = false
    },
    //创建日期时间触发
    createTime(val) {
      const [startDate, endDate] = val
      this.search.startCreateTime = startDate
      this.search.endCreateTime = endDate
    },
    //修改日期触发
    updateTime(val) {
      const [startDate, endDate] = val
      this.search.startCreateTime = startDate
      this.search.endCreateTime = endDate
    },

    //重置
    resetSearch() {
      this.search = {
        //表单
        keyword: undefined,
        endCreateTime: undefined,
        startCreateTime: undefined,
        status: undefined
      }
      this.searchType = ''
      this.getUserList()
    },
    // 复选框点击事件
    handleSelectionChange(val) {
      if (val) {
        this.userIdList = [] // 这里一定要记得，每次点击的时候要清空，因为所有的数据都在一个数组val里
        for (var i in val) {
          this.userIdList[i] = val[i].userId
        }
      }
    },
    // 封禁取消
    resetForm() {
      this.dialogBanned = false
    },
    // 封禁确认
    submitForm() {
      this.dialogBanned = false
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
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
  .el-form-item.giftSelect {
    display: flex;
    margin-right: 45px;
    .el-input__inner {
      width: 100px;
      padding: 0;
      border-radius: 0;
    }
    .el-form-item__content {
      display: flex;
    }
    // .userInputWidth {
    //   input {
    //     width: 250px;
    //     border-radius: 5px;
    //     padding-left: 10px;
    //   }
    // }
    .userWaysSelect {
      .el-input {
        .el-input__inner {
          padding: 10px;
          width: 130px;
        }
      }
    }
  }
  //表单内容
  .userContent {
    .el-tabs.el-tabs--card.el-tabs--top {
      .el-tabs__item.is-top {
        padding: 0 50px;
        font-size: 16px;
      }
    }
  }
  //弹出框大小
  .dialog.banneddialog {
    .el-form-item__label {
      width: 100px;
    }
  }
  /* 对话框 */
  .el-dialog {
    // 对话框标题
    .el-dialog__header {
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
    // 对话框内容
    .el-dialog__body {
      padding: 7px 0;
      margin: 20px;
    }
    .el-form-item__content {
      display: flex;
      width: 70%;
      flex-wrap: wrap;
      margin-left: 20px !important;
      .el-radio-group {
        margin-top: 12px;
      }
      .el-radio {
        margin-bottom: 20px;
      }
    }
    .el-input.el-input--medium {
      width: 200px;
    }
    // 用户搜索类型框
    .usernumber {
      .userInputWidth {
        input {
          width: 250px;
        }
      }
      .international {
        width: 150px;
        input {
          width: 150px;
        }
      }
    }
  }
  // 时间框
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 260px;
    margin-right: 20px;
  }
}
</style>
