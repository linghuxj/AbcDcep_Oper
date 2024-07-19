<template>
  <div class="kolUserBox">
    <!-- 表单 -->

    <!-- 表格 分页 -->
    <div class="userContent">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- 正常用户 -->
        <el-tab-pane :label="$t('user.normal_users')" name="first">
          <!-- 筛选条件表单 -->
          <el-form :inline="true" :model="search" class="demo-form-inline">
            <!-- 用户搜索 -->
            <el-form-item :label="$t('user.users_search')" class="certSelect">
              <span>:</span>
              <el-select
                v-model="searchType"
                :placeholder="$t('message.please_select')"
                class="userSelection userWaysSelect"
              >
                <el-option
                  :label="$t('user.uesrid')"
                  value="userId"
                ></el-option>
                <el-option :label="$t('user.email')" value="email"></el-option>
                <el-option
                  :label="$t('user.mobile')"
                  value="mobile"
                ></el-option>
                <el-option
                  :label="$t('user.username')"
                  value="username"
                ></el-option>
              </el-select>
              <el-input
                v-model="search.keyword"
                class="userInputWidth"
                :placeholder="$t('message.search_keyword')"
              ></el-input>
            </el-form-item>
            <!-- 作品量 -->
            <!-- <el-form-item :label="$t('user.amount_work')" class="certSelect">
              <span>:</span>
              <el-select
                v-model="search.sex"
                placeholder="--请选择--"
                class="userWaysSelect"
              >
                <el-option
                  :label="type.itemLabel"
                  :value="type.itemValue"
                  v-for="type in userSexTypes"
                  :key="type.itemId"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <!-- 粉丝数 -->
            <!-- <el-form-item :label="$t('user.amount_fans')" class="certSelect">
              <span>:</span>
              <el-select
                v-model="search.sex"
                placeholder="--请选择--"
                class="userWaysSelect"
              >
                <el-option
                  :label="type.itemLabel"
                  :value="type.itemValue"
                  v-for="type in userSexTypes"
                  :key="type.itemId"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <!-- 性别 -->
            <el-form-item :label="$t('user.sex')" class="certSelect">
              <span>:</span>
              <el-select
                v-model="search.sex"
                :placeholder="$t('message.please_select')"
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
            <el-form-item :label="$t('user.registration_date')">
              <span>:</span>
              <el-date-picker
                v-model="registerDate"
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

            <!-- 用户类型 -->
            <el-form-item :label="$t('user.user_type')" class="certSelect">
              <span>:</span>
              <el-select
                v-model="search.kolUserType"
                :placeholder="$t('message.please_select')"
                class="userWaysSelect"
              >
                <el-option
                  v-for="type in userTypes"
                  :key="type.itemId"
                  :label="type.itemLabel"
                  :value="type.itemValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="userBtn">
              <el-button type="primary" @click="handleSearch">
                {{ $t("feed.gift.search") }}
              </el-button>
              <el-button type="primary" class="reset" @click="resetSearch">
                {{ $t("feed.gift.reset") }}
              </el-button>
            </el-form-item>
          </el-form>
          <!-- <el-button
            type="primary"
            class="createUser"
            v-if="permissions.user_add"
            @click="handleCreateUser"
            >{{ $t("user.create_account") }}</el-button
          > -->

          <!-- 表格 -->
          <el-table
            v-loading="listLoading"
            :empty-text="$t('message.table_empty_text')"
            border
            :data="list"
          >
            <el-table-column
              :label="$t('message.serial_number')"
              type="index"
              width="70"
            ></el-table-column>
            <!-- 用户信息 -->
            <el-table-column :label="$t('user.userinfo')" prop="" width="220">
              <template slot-scope="scope">
                <div class="user-wrap">
                  <img
                    class="avatar"
                    :src="
                      scope.row.avatar ? scope.row.avatar : './img/avatar.png'
                    "
                    alt="avatar"
                  />
                  <div class="user-base">
                    <div>{{ scope.row.username }}</div>
                    <div>{{ scope.row.ncode }}-{{ scope.row.mobile }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <!-- 用户类型 -->
            <el-table-column
              :label="$t('user.user_type')"
              prop="kolUserTypeName"
            ></el-table-column>
            <!-- 动态总数 -->
            <el-table-column
              :label="$t('user.dynamic_total')"
              prop="noteCount"
            ></el-table-column>
            <!-- 粉丝数 -->
            <el-table-column
              :label="$t('user.amount_fans')"
              prop="fansCount"
            ></el-table-column>
            <!-- 点赞量 -->
            <el-table-column
              :label="$t('feed.video.thumb_quantity')"
              prop="likedCount"
            ></el-table-column>
            <!-- 累计礼物数 -->
            <el-table-column
              :label="$t('user.certification.cumulative_gifts')"
              prop="giftCount"
            ></el-table-column>
            <!-- 打赏总额 -->
            <el-table-column
              :label="$t('user.certification.exceptional_total')"
              prop="rewardAmount"
            ></el-table-column>
            <!-- 账户余额 -->
            <el-table-column
              :label="$t('user.certification.account_balance')"
              prop="amount"
            ></el-table-column>
            <!-- 最後一次动态发布时间 -->
            <el-table-column
              :label="$t('user.certification.last_time')"
              prop="lastPublishTime"
            ></el-table-column>
            <!-- 注册时间 -->
            <el-table-column
              :label="$t('user.registration_date')"
              prop="createTime"
              width="110"
            >
              <template
                slot-scope="scope"
              ><span>{{ scope.row.createTime | ndateFormat }}</span></template
              >
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              :label="$t('message.operate')"
              width="180"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="handleUserDetail(scope.row.userId)"
                >{{ $t("message.details") }}</el-button
                >
                <!-- <el-button
                  type="text"
                  size="mini"
                  @click="handlebanned(scope.row)"
                  >{{ $t("message.banned") }}</el-button
                > -->
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            background
            :page-count="pagination.pages"
            :current-page="pagination.current"
            :page-sizes="pagination.pageSize"
            :page-size="pagination.size"
            layout="sizes, prev, pager, next"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @prev-click="handleCurrentChange"
            @next-click="handleCurrentChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </el-tab-pane>

        <!-- 禁用按钮 -->

        <!-- <el-tab-pane :label="$t('user.banned_users')" name="second">
          <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item :label="$t('user.users_search')" class="certSelect">
              <span>:</span>
              <el-select
                v-model="search.usersSearch"
                placeholder="请选择"
                class="userSelection userWaysSelect"
              >
                <el-option label="请选择" value="请选择"></el-option>
                <el-option label="用户ID" value="用户ID"></el-option>
                <el-option label="用户邮箱" value="用户邮箱"></el-option>
                <el-option label="用户手机号" value="用户手机号"></el-option>
                <el-option label="用户昵称" value="用户昵称"></el-option>
              </el-select>
              <el-input
                v-model="search.searchName"
                class="userInputWidth"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('user.ban_period')" class="certSelect">
              <span>:</span>
              <el-select
                v-model="search.banPeriod"
                placeholder="请选择..."
                class="userWaysSelect"
              >
                <el-option label="--全部--" value="1"></el-option>
                <el-option label="7天" value="2"></el-option>
                <el-option label="14天" value="3"></el-option>
                <el-option label="30天" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.banned_type')" class="certSelect">
              <span>:</span>
              <el-select
                v-model="search.amountWwork"
                placeholder="--全部--"
                class="userWaysSelect"
              >
                <el-option label="政治敏感" value="--全部--"></el-option>
                <el-option label="内容涉黄" value="≤10"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="bannedbtn">
              <el-button type="primary" @click="search">
                {{ $t("feed.gift.search") }}
              </el-button>
              <el-button type="primary" @click="reset" class="reset">
                {{ $t("feed.gift.reset") }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-table
            :empty-text="$t('message.table_empty_text')"
            border
            :data="bannedList"
            v-loading="listLoading"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              :label="$t('user.uesrid')"
              prop="giftIcon"
            ></el-table-column>
            <el-table-column
              :label="$t('user.userinfo')"
              prop="giftIcon"
            ></el-table-column>
            <el-table-column
              :label="$t('user.user_type')"
              prop="giftIcon"
            ></el-table-column>
            <el-table-column
              :label="$t('user.banned_reason')"
              prop="giftIcon"
            ></el-table-column>
            <el-table-column
              :label="$t('user.ban_period')"
              prop="giftIcon"
            ></el-table-column>
            <el-table-column
              :label="$t('user.operation_lockoutTime')"
              prop="giftIcon"
            ></el-table-column>
            <el-table-column
              :label="$t('feed.gift.operator')"
              prop="giftIcon"
            ></el-table-column>
            <el-table-column
              :label="$t('message.operate')"
              width="180"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="handleUpdate(scope.row)"
                  >{{ $t("message.cause") }}</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  @click="handleStatus(scope.row)"
                  >{{ $t("message.details") }}</el-button
                >
                <el-button
                  type="text"
                  size="mini"
                  @click="handleDelete(scope.row)"
                  >{{ $t("message.Lift_ban") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.current"
            :page-sizes="pagination.pageSize"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total"
          ></el-pagination>
        </el-tab-pane> -->
      </el-tabs>
    </div>

    <!-- 封禁操作弹出框 -->
    <!-- <el-dialog :title="$t('message.banned_operation')" class="dialog banneddialog" :visible.sync="dialogBanned" width="38%">
      <el-form
        :model="forbbidForm"
        :rules="rules"
        ref="forbbidForm"
        label-width="100px"
      >
        <el-form-item :label="$t('message.banned_type')" class="usernumber">
          <el-select
            v-model="search.amountWwork"
            placeholder="--请选择--"
            class="international"
          >
            <el-option label="内容涉黄" value="≤10"></el-option>
            <el-option label="政治敏感" value="51-100"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('user.ban_period')"
          :label-width="formLabelWidth"
          class="ban-period"
          prop="way"
        >
          <el-radio-group v-model="createForm.way">
            <el-radio :label="1">免费兑换</el-radio>
            <el-radio :label="2">付费兑换</el-radio>
            <el-radio :label="2">付费兑换</el-radio>
            <el-radio :label="2">付费兑换</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('message.cause')"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请填写禁用用户的原因"
            v-model="textarea"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('user.birthday')" class="usernumber">
          <el-date-picker
            v-model="search.registerDate"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="createTime"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('createForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('createForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->

    <!-- 封禁原因弹出框 -->
    <!-- <el-dialog :title="$t('user.banned_reason')" class="dialog dialogReason" :visible.sync="dialogReason" width="38%">
      <el-form
        :model="createForm"
        :rules="rules"
        ref="createForm"
        label-width="100px"
      >
        <el-form-item :label="$t('message.banned_type')" class="usernumber">
          <span>政治敏感</span>
        </el-form-item>
        <el-form-item
          :label="$t('user.ban_period')"
          :label-width="formLabelWidth"
          class="ban-period"
          prop="way"
        >
          <el-radio-group v-model="createForm.way">
            <el-radio :label="1">7天</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('message.cause')"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请填写禁用用户的原因"
            v-model="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { remote } from '@/api/system/dict'
import { deptRoleList } from '@/api/user/role'
import { countries } from '@/config/country_banner'
import upload from '@/components/Upload-File/upload.vue'
import { encryption } from '@/util/util'
export default {
  components: {
    upload
  },
  data() {
    return {
      list: [],
      countries: countries,
      search: {
        //表单
        keyword: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined,
        status: undefined,
        userType: undefined
      },
      registerDate: '', // 注册日期
      searchType: '',
      userTypes: [], // 用户类型
      userStates: [], // 用户状态
      userSexTypes: [], // 用户性别
      //分页
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
      roles: [], // 角色列表
      listLoading: false,
      b_loading: false, // 按钮loading
      activeName: 'first', //导航选项卡默认选择
      status: 'normal'
    }
  },
  mounted() {
    this.getUserList()
    this.getUserTypes()
    this.getUserStatus()
    this.getUserSexTypes()
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    /* //新增用户按钮
    handleUpdate() {
      this.$router.push("/user/details");
    }, */
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
    },
    getUserTypes() {
      if (this.userTypes.length === 0) {
        remote('kol_user_type').then(response => {
          this.userTypes = response.data.data
        })
      }
    },
    getUserStatus() {
      if (this.userStates.length === 0) {
        remote('user_status_type').then(response => {
          this.userStates = response.data.data
        })
      }
    },
    getUserSexTypes() {
      if (this.userSexTypes.length === 0) {
        remote('user_sex_type').then(response => {
          this.userSexTypes = response.data.data
        })
      }
    },
    handleSearch() {
      this.pagination.current = 0
      this.getUserList()
    },
    handleUserDetail(userId) {
      this.$router.push({ path: `/user/koldetail/${userId}` })
    },
    handleUpdate(user) {
      this.userForm = Object.assign({}, user)
      this.dialogVisible = true
    },
    handleCreateUser() {
      this.dialogVisible = true
      if (this.roles.length === 0) {
        deptRoleList().then(response => {
          this.roles = response.data.data
        })
      }
    },
    createUser() {
      console.log(222)
      this.$refs.createUser.validate(valid => {
        console.log(valid, 'valid')
        if (valid) {
          let form = Object.assign({}, this.userForm)
          // 密码加密
          form = encryption({
            data: form,
            key: 'software12345678',
            param: ['password']
          })
          this.b_loading = true
          addObj(form)
            .then(response => {
              this.b_loading = false
              this.dialogVisible = false
              this.$refs.createUser.resetFields()
              this.$message.success(this.$t('message.add_success'))
            })
            .catch(() => {
              this.b_loading = false
            })
        }
      })
    },
    //创建日期时间触发
    createTime(val) {
      console.log(val, 'val')
      const [startDate, endDate] = val
      console.log([startDate, endDate], 'date')
      this.search.startCreateTime = val[0]
      this.search.endCreateTime = val[1]
    },
    //修改日期触发
    updateTime(val) {
      const [startDate, endDate] = val
      this.search.startCreateTime = startDate
      this.search.endCreateTime = endDate
    },
    //弹出框取消按钮
    handleCancel(form) {
      this.$refs[form].resetFields()
      this.dialogVisible = false
    },

    //重置
    resetSearch() {
      this.registerDate = []
      this.search = {
        //表单
        keyword: undefined,
        endCreateTime: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined,
        status: undefined,
        kolUserType: undefined
      }
      this.searchType = ''
      this.getUserList()
    },
    //tap切换
    handleClick(tab, event) {},
    //禁用启用按钮
    //页容量改变
    handleSizeChange(val) {
      this.pagination.size = val
      this.getUserList()
    },
    //页码改变
    handleCurrentChange(val) {
      this.pagination.current = val
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
.kolUserBox {
  .user-wrap {
    display: flex;
    justify-content: space-around;
    text-align: center;
    .avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
  }
  //   width: 1450px;
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
  .el-form-item.certSelect {
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
    .userInputWidth {
      input {
        width: 250px;
        border-radius: 5px;
        padding-left: 10px;
      }
    }
    .userWaysSelect {
      .el-input {
        .el-input__inner {
          padding: 10px;
          width: 170px;
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
  .el-form-item.userBtn.el-form-item--medium {
    // margin: 3px 0 0 1100px;
    .el-button {
      margin-right: 10px;
      span {
        margin: 0;
      }
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
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 260px;
    margin-right: 20px;
  }
  .createUser {
    margin: -30px 0 10px 0;
  }
  .userSelection {
    width: 105px;
    .el-input__inner {
      width: 105px !important;
    }
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
    .usernumber {
      margin-left: 20px;
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
</style>
