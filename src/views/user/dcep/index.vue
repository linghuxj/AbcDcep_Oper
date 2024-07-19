<template>
  <div class="main-content userBox">
    <!-- 表格 分页 -->
    <div class="userContent">
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
            placeholder="请输入内容"
            class="input-with-select"
            style="width: 100%"
          >
            <el-select v-model="searchType" placeholder="请选择" slot="prepend">
              <el-option label="用户ID" value="userId"></el-option>
              <el-option label="用户手机号" value="mobile"></el-option>
              <el-option label="用户昵称" value="username"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <!-- 性别 -->
        <el-form-item label="性别：">
          <span>:</span>
          <el-select v-model="search.sex" placeholder="请选择">
            <el-option
              v-for="type in userSexTypes"
              :key="type.itemId"
              :label="type.itemLabel"
              :value="type.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间：">
          <span>:</span>
          <el-date-picker
            v-model="registerDate"
            type="daterange"
            range-separator="~"
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
          <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
        </div>
      </el-form>
      <div id="tableBtn">
        <el-button type="primary" @click="potentialExport">
          导出报表
        </el-button>
      </div>
      <!-- 表格 -->
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        :data="list"
        :height="tableHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" prop="user.userId" width="50" />
        <el-table-column
          label="用户ID"
          prop="user.userId"
          width="150"
        ></el-table-column>
        <el-table-column label="用户信息" width="160" prop="">
          <template slot-scope="scope">
            <div class="user-wrap">
              <img
                class="avatar"
                :src="
                  scope.row.user.avatar
                    ? scope.row.user.avatar
                    : './img/avatar.png'
                "
              />
              <div class="user-base">
                <div class="oneline">{{ scope.row.user.username }}</div>
                <div class="oneline">{{ scope.row.user.mobile }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="人员姓名" prop="personName"></el-table-column>
        <el-table-column label="网点号" prop="branchNo">
          <template slot-scope="scope">
            <span>{{ scope.row.branchNo ? scope.row.branchNo : '/' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="companyName">
          <template slot-scope="scope">
            <span>{{
              scope.row.companyName ? scope.row.companyName : '/'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号码"
          prop="mobile"
          width="150"
        ></el-table-column>
        <el-table-column label="特殊手机号码" prop="specialMobile">
          <template slot-scope="scope">
            <span>{{
              scope.row.specialMobile ? scope.row.specialMobile : '/'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户端类型" prop="clientType">
          <template slot-scope="scope">
            <span>{{ scope.row.clientType ? scope.row.clientType : '/' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="testflight接收邀请邮箱"
          prop="invite_email"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.invite_email ? scope.row.invite_email : '/'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="startCreateTime" />
        <!-- <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleUserDetail(scope.row.user.userId)"
              >详情</el-button
            >
            <el-button type="text" size="mini" @click="handlebanned(scope.row)"
              >审核</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
      <!-- 分页 -->
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getDcWalletList"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TablePagination from '@/components/table-pagination'
// 导入DC钱包相关接口
import { getDcWalletPage, potentialExport } from '@/api/user/decp'
import { remote } from '@/api/system/dict'

export default {
  name: 'DCEP',
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      list: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      search: {
        //表单
        keyword: undefined,
        sex: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined
      },
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //页面数组
        pageSize: [5, 10, 15, 20],
        //总条数
        total: 0,
        pages: 0
      },
      tableLoading: false,
      userSexTypes: [],
      registerDate: '', // 注册日期
      searchType: '',
      // 表格选中项
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        auditBtn: this.vaildData(this.permissions.dcep_audit, false)
      }
    }
  },
  created() {
    this.getDcWalletList()
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
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection, 'this.multipleSelection')
    },
    getDcWalletList() {
      const keyword = this.searchType
      const query = Object.assign({}, this.search)
      delete query.keyword
      delete query.registerDate
      query.size = this.pagination.size
      query.current = this.pagination.current
      query[keyword] = this.search.keyword
      this.listLoading = true
      query.status = this.activeName
      // console.log(query)
      getDcWalletPage(query)
        .then(response => {
          // console.log(response, 'response')
          this.listLoading = false
          const result = response.data.data
          this.list = result.records
          this.pagination.total = result.total
          this.pagination.pages = result.pages
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    getUserSexTypes() {
      if (this.userSexTypes.length === 0) {
        remote('user_sex_type').then(response => {
          this.userSexTypes = response.data.data
        })
      }
    },
    // 重置
    reset() {
      this.search = {
        keyword: undefined,
        sex: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined
      }
      this.searchType = ''
      this.registerDate = ''
      this.pagination.current = 1
      this.getDcWalletList()
    },
    handleSearch() {
      this.pagination.current = 1
      this.getDcWalletList()
    },
    // 日期触发器
    createTime(val) {
      const [startDate, endDate] = val
      this.search.startCreateTime = startDate
      this.search.endCreateTime = endDate
    },
    // 导出报表按钮事件
    potentialExport() {
      this.$confirm('确认将勾选的商户信息导出？', '导出报表', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const listQuery = Object.assign({}, this.search)
          // 处理客户搜索数据
          if (this.searchType) {
            listQuery[this.searchType] = this.search.keyword
          }
          listQuery.dcIds = this.multipleSelection.map(item => {
            return item.id
          })
          delete listQuery.keyword
          potentialExport(listQuery).then(resp => {
            this.downloadExcel(resp, '开通DC钱包记录表.xls')
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 详情
    handleUserDetail(userId) {
      console.log(userId)
    },
    //正常用户封禁按钮
    handlebanned(user) {
      console.log(user)
    }
  }
}
</script>
<style lang="scss" scoped>
.userBox {
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
  .bannedbtn {
    .el-button {
      margin-right: 10px;
      span {
        margin: 0;
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

  /* 对话框头部 */
  .el-dialog {
    .el-dialog__body {
      padding: 7px 0;
    }
    .el-form-item__content {
      display: flex;
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
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 260px;
    margin-right: 20px;
  }
  .createUser {
    margin: -30px 0 10px 0;
  }
  #pane-second,
  #pane-first {
    margin-top: 20px;
    .el-form .demo-form-inline .el-form--inline {
      margin-top: 40px;
    }
  }
  .reset {
    background-color: white;
    color: rgb(141, 140, 140);
    border: 1px solid rgb(116, 115, 115);
  }
  //新增弹出框
  .dialog {
    .el-dialog__body {
      margin: 20px;
    }
    .usernumber {
      .userInputWidth {
        input {
          width: 250px;
        }
      }
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .international {
      width: 150px;
      input {
        width: 150px;
      }
      span {
        margin-left: -120px;
      }
    }
  }
  //图片上传
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
  }
  .avatar {
    width: 138px;
    height: 138px;
    display: block;
  }
  //封禁弹出框
  .ban-period {
    .el-form-item__content {
      width: 600px;
    }
  }
  .el-table__header {
    tr {
      th {
        text-align: center;
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
.userBox .user-wrap .user-base {
  width: 90px;
}
</style>
