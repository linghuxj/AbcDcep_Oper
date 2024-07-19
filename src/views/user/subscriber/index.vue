/** * 平台用户管理 * @author yangjq * @date 2021-08-10 */
<template>
  <div class="main-content subscriber">
    <!-- 筛选栏 -->
    <el-form
      :inline="true"
      :model="parameter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="用户昵称：">
        <el-input v-model="parameter.username" placeholder="请输入用户昵称" />
      </el-form-item>
      <el-form-item label="用户电话：">
        <el-input v-model="parameter.mobile" placeholder="请输入用户电话" />
      </el-form-item>
      <el-form-item label="用户性别：">
        <el-select v-model="parameter.sex" placeholder="请选择用户性别">
          <el-option
            v-for="(item, index) in sexList"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态：">
        <el-select v-model="parameter.status" placeholder="请选择用户状态">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="getList"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </div>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.admin_user_add"
        type="primary"
        @click="addAdmin"
        >新增</el-button
      >
    </div>
    <!-- 列表栏 -->
    <el-table
      v-loading="interactive.listLoading"
      :data="list"
      border
      :header-cell-style="{ background: '#f1f1f1', color: '#555555' }"
      :height="tableHeight"
    >
      <el-table-column label="用户昵称" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.username ? scope.row.username : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="120">
        <template slot-scope="scope">
          <span
            >{{ scope.row.nCode ? scope.row.nCode + '-' : ''
            }}{{ scope.row.mobile ? scope.row.mobile : '--' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="性别" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sexName ? scope.row.sexName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="启用"
            inactive-text="停用"
            active-value="normal"
            inactive-value="disabled"
            :disabled="!permissions.admin_user_status_edit"
            @change="switchStatus($event, scope.row.userId)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{
            scope.row.roleName ? scope.row.roleName.join(',') : ''
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" show-overflow-tooltip align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime ? scope.row.createTime : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="permissions.admin_user_edit"
            type="text"
            size="mini"
            @click="editAdmin(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="permissions.admin_user_reset_password"
            type="text"
            size="mini"
            @click="resetAdminPassword(scope.row)"
          >
            重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-pagination
      id="s-pagination"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getList"
    />

    <!-- 弹出框 -->
    <el-dialog title="新增平台用户" :visible.sync="interactive.dialogVisible">
      <el-form
        ref="tempForm"
        :model="tempForm"
        :rules="rules"
        label-position="left"
        label-width="100px;"
      >
        <el-form-item label="用户账号" prop="loginName">
          <el-input v-model="tempForm.loginName" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="username">
          <el-input v-model="tempForm.username" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="用户手机号" prop="mobile">
          <el-input
            v-model="tempForm.mobile"
            placeholder="请输入用户手机号"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="tempForm.sex">
            <el-radio
              v-for="(item, index) in sexList"
              :key="index"
              :label="item.dictValue"
              >{{ item.dictName }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属角色" prop="roles">
          <el-checkbox-group v-model="tempForm.roles">
            <el-checkbox
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.roleId"
              >{{ item.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <span
          >用户默认密码为：<em style="color: red; font-weight: bold"
            >123456</em
          ></span
        >
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="createData('tempForm')">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑平台用户" :visible.sync="interactive.dialogEdit">
      <el-form
        ref="editForm"
        :model="tempForm"
        :rules="rules"
        label-position="left"
        label-width="100px;"
      >
        <!-- <el-form-item label="用户账号" prop="loginName">
          <el-input
            v-model="tempForm.loginName"
            disabled
            placeholder="请输入用户账号"
          />
        </el-form-item> -->
        <el-form-item label="用户昵称" prop="username">
          <el-input v-model="tempForm.username" placeholder="请输入用户昵称" />
        </el-form-item>
        <!-- <el-form-item label="用户手机号" prop="mobile">
          <el-input
            v-model="tempForm.mobile"
            disabled
            placeholder="请输入用户手机号"
          />
        </el-form-item> -->

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="tempForm.sex">
            <el-radio
              v-for="(item, index) in sexList"
              :key="index"
              :label="item.dictValue"
              >{{ item.dictName }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属角色" prop="roles">
          <el-checkbox-group v-model="tempForm.roles">
            <el-checkbox
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.roleId"
              >{{ item.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogEdit = false"> 取消 </el-button>
        <el-button type="primary" @click="editAdminInfo('editForm')">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TablePagination from '@/components/table-pagination'
import { deptRoleList } from '@/api/user/role'
import { encryption } from '@/util/util'
import {
  addAdmin,
  getAdminPage,
  upAdmin,
  upAdminStatus,
  resetAdminPassword,
  getAdminStatus,
  reqUserSex
} from '@/api/user/subscriber'

import { mapGetters } from 'vuex'
export default {
  components: { TablePagination },
  data() {
    var validateMobile = (rule, value, callback) => {
      var regex =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (value === '') {
        callback(new Error('请输入手机号!'))
      } else if (!regex.test(value)) {
        callback(new Error('手机号格式不正确！'))
      } else {
        callback()
      }
    }
    // 用户账号校验规则
    var validateLoginName = (rule, value, callback) => {
      var regex1 = /^[a-z0-9A-Z]{5,18}$/g
      if (!value || value === '') {
        callback(new Error('请输入用户账号'))
      } else if (!regex1.test(value)) {
        callback(
          new Error('用户账号不正确！（账号为5-18位，且只能由数字、字母构成）')
        )
      } else {
        callback()
      }
    }
    return {
      // 表格高度
      tableHeight: 'calc(100vh - 335px)',
      list: [],
      tempForm: {
        userId: undefined,
        mobile: undefined,
        roles: [],
        sex: undefined,
        username: undefined,
        loginName: undefined
      },
      create: '',

      roleList: [],
      sexList: [],
      statusList: [],
      //表示参数类
      parameter: {
        username: undefined,
        mobile: undefined,
        sex: undefined,
        status: undefined
      },
      // 操作类型
      interactive: {
        dialogVisible: false,
        listLoading: false,
        dialogEdit: false
      },
      // 其他
      other: {},
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20
      },
      rules: {
        mobile: [
          { required: true, validator: validateMobile, trigger: 'blur' }
        ],
        roles: [
          {
            type: 'array',
            required: true,
            message: '至少选择一项角色',
            trigger: 'blur'
          }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        loginName: [
          { required: true, validator: validateLoginName, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions', 'userInfo'])
  },
  created() {
    this.getStatus()
    this.getUserSex()
    this.getAdminStatus()
    this.getList()
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
    // 查询角色
    getStatus() {
      deptRoleList().then(response => {
        this.roleList = response.data.data
      })
    },
    // 查询性别
    getUserSex() {
      reqUserSex().then(response => {
        this.sexList = response.data.data
      })
    },
    // 查询用户状态
    getAdminStatus() {
      getAdminStatus().then(response => {
        this.statusList = response.data.data
      })
    },
    // 修改用户状态
    switchStatus(val, va) {
      const data = {
        status: val,
        userId: va
      }
      upAdminStatus(data)
        .then(() => {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        })
        .catch(e => {
          console.error(e)
        })
    },
    // 查询
    getList() {
      this.interactive.listLoading = true
      const listQuery = Object.assign({}, this.parameter, this.pagination)

      getAdminPage(listQuery)
        .then(response => {
          this.list = response.data.data.records
          this.pagination.total = response.data.data.total
          setTimeout(() => {
            this.interactive.listLoading = false
          }, 0.5 * 1000)
        })
        .catch(() => {
          this.interactive.listLoading = false
        })
    },
    // 新增
    createData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const user = encryption({
            data: this.tempForm,
            key: 'software12345678',
            param: ['password']
          })
          addAdmin(user)
            .then(() => {
              this.interactive.dialogVisible = false
              this.$message({
                type: 'success',
                message: '添加员工成功！'
              })
              this.resetForm()
            })
            .catch(() => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改
    editAdminInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const user = encryption({
            data: this.tempForm,
            key: 'software12345678',
            param: ['password']
          })
          upAdmin(user)
            .then(() => {
              this.interactive.dialogEdit = false
              this.$message({
                type: 'success',
                message: '更新员工成功！'
              })
              this.getList()
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    // 重置
    resetForm() {
      const parameter = {
        username: undefined,
        mobile: undefined,
        sex: undefined,
        status: undefined
      }

      this.$nextTick(() => {
        this.parameter = parameter
        this.getList()
      })
    },

    // 新增管理人员
    addAdmin() {
      const tempForm = {
        userId: undefined,
        mobile: undefined,
        roles: [],
        sex: undefined,
        username: undefined,
        loginName: undefined
      }
      this.tempForm = tempForm
      this.interactive.dialogVisible = true
    },
    // 修改
    editAdmin(val) {
      this.tempForm.roles = val.roleIds
      this.tempForm = Object.assign({}, this.tempForm, val)
      console.log(this.tempForm)
      this.interactive.dialogEdit = true
    },

    // 重置密码
    resetAdminPassword(val) {
      const _this = this
      _this
        .$confirm(
          '确定要将“' +
            val.username +
            '”员工的账号密码重置吗？重置后的密码为123456。',
          '重置密码',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }
        )
        .then(() => {
          resetAdminPassword(val.userId).then(() => {
            _this.$message({
              type: 'success',
              message: '“' + val.username + '”员工的账号密码重置成功！'
            })
            this.getList()
          })
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消重置操作！'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  .nav-text-span {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .see-tip {
    padding: 1px 10px;
    p {
      font-size: 14px;
      color: #f33c4b;
    }
  }
  .nav-item {
    display: grid;
    justify-items: left;
    grid-template-columns: 100px auto;
    grid-template-rows: 100% 100%;
    .nav-item-tit {
      width: 100%;
      text-align: right;
      padding: 5px;
      margin: 5px;
    }
    .nav-item-cen {
      margin: 5px;
      padding: 5px;
      div {
        padding: 2px;
      }
    }
  }
}
</style>
