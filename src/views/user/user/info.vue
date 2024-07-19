<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <el-tabs @tab-click="switchTab">
        <el-tab-pane :label="$t('user.info_management')" name="userManager" />
        <el-tab-pane
          :label="$t('user.password_management')"
          name="passwordManager"
        />
      </el-tabs>

      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form
              v-if="switchStatus === 'userManager'"
              ref="ruleForm2"
              :model="ruleForm2"
              :rules="rules2"
              label-width="10rem"
              class="demo-ruleForm"
            >
              <el-form-item :label="$t('user.username')" prop="username">
                <el-input
                  v-model="ruleForm2.username"
                  style="width: 20rem"
                  type="text"
                  disabled
                />
              </el-form-item>
              <el-form-item :label="$t('user.mobile')" prop="mobile">
                <el-input
                  v-model="ruleForm2.mobile"
                  style="width: 20rem"
                  :placeholder="$t('user.place_phone_code')"
                  disabled
                >
                  <el-select
                    slot="prepend"
                    v-model="ruleForm2.ncode"
                    style="width: 8rem"
                    :placeholder="$t('message.country_code')"
                    disabled
                  >
                    <template v-for="(country, index) in countries">
                      <el-option
                        :key="index"
                        :label="country.name"
                        :value="country.code"
                      >
                        <span style="float: left">{{ country.locale }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >{{ country.code }}</span
                        >
                      </el-option>
                    </template>
                  </el-select>
                </el-input>
              </el-form-item>
              <!-- <el-form-item :label="$t('user.avatar')">
                <upload
                  ref="upload"
                  v-model="ruleForm2.avatar"
                  :auto-upload="true"
                  :limit="1"
                  :is-cropper="true"
                  type="user"
                />
              </el-form-item> -->
              <!-- <el-form-item>
                <el-button
                  type="primary"
                  :loading="b_loading"
                  @click="submitForm('ruleForm2')"
                >{{ $t("message.confirm") }}
                </el-button>
                <el-button @click="resetForm('ruleForm2')">{{
                  $t("user.reset")
                }}</el-button>
              </el-form-item> -->
            </el-form>
            <el-form
              v-if="switchStatus === 'passwordManager'"
              ref="ruleForm2"
              :model="passForm"
              :rules="rules2"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item
                :label="$t('user.old_password')"
                prop="originPassword"
              >
                <el-input
                  v-model="passForm.originPassword"
                  :disabled="disabled"
                  type="password"
                  auto-complete="off"
                />
                <!-- <el-checkbox v-model="no_pass" @change="handleHasPass">无密码</el-checkbox> -->
              </el-form-item>
              <el-form-item :label="$t('user.password')" prop="newPassword">
                <el-input
                  v-model="passForm.newPassword"
                  type="password"
                  auto-complete="off"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changePassword"
                  >{{ $t('message.confirm') }}
                </el-button>
                <el-button @click="resetPassForm">{{
                  $t('user.reset')
                }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import { getStore, setStore } from '@/util/store'
import { updateUser } from '@/api/user/user'
import { encryption } from '@/util/util'
import { countries } from '@/config/country_banner'
// import upload from '@/components/upload'
import { upAdminPassword } from '@/api/user/subscriber'

export default {
  // components: {
  //   upload
  // },
  data() {
    var validatePassword = (rule, value, callback) => {
      var regex1 = /[\u4e00-\u9fa5]|[\s]/g
      var regex2 = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,18}$/g
      if (!value || value === '') {
        callback(new Error('请输入密码'))
      } else if (regex1.test(value) || !regex2.test(value)) {
        callback(new Error('密码格式不正确！'))
      } else {
        callback()
      }
    }
    return {
      no_pass: false,
      switchStatus: 'userManager',
      avatarUrl: '',
      show: false,
      countries: countries,
      headers: {
        Authorization: 'Bearer ' + store.getters.access_token
      },
      ruleForm2: {
        username: '',
        avatar: '',
        mobile: '',
        ncode: '86'
      },
      disabled: false, // 密码为空不可填写
      b_loading: false,
      passForm: {
        originPassword: '',
        newPassword: ''
      },
      rule: {
        avatar: [
          {
            required: false,
            message: this.$t('user.valid.valid_avatar'),
            trigger: 'blurÏ'
          }
        ]
      },
      rules2: {
        originPassword: [
          {
            required: true,
            min: 6,
            message: this.$t('user.valid.valid_password_limit'),
            trigger: 'change'
          }
        ],
        newPassword: [
          {
            required: true,
            validator: validatePassword,
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    this.resetForm()
  },
  methods: {
    switchTab(tab) {
      this.switchStatus = tab.name
    },
    handleHasPass(hasPass) {
      if (hasPass) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    changePassword() {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          // if (!this.passForm.originPassword && !this.no_pass) {
          //   return this.$message.error(
          //     this.$t('user.valid.valid_pass_required')
          //   )
          // }
          const passObj = Object.assign({}, this.passForm)
          // if (this.no_pass) {
          //   passObj.originPassword = '000000'
          // }
          const originPassword = encryption({
            data: passObj,
            key: 'software12345678',
            param: ['originPassword']
          })
          const newPassword = encryption({
            data: passObj,
            key: 'software12345678',
            param: ['newPassword']
          })
          const form = {
            newPassword: newPassword.newPassword,
            originPassword: originPassword.originPassword
          }
          this.b_loading = true
          upAdminPassword(form)
            .then(() => {
              this.b_loading = false
              this.$notify.success(this.$t('message.edit_success'))
              // 修改密码之后强制重新登录
              if (this.switchStatus === 'passwordManager') {
                this.$store.dispatch('LogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                })
              }
            })
            .catch(() => {
              this.b_loading = false
            })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.b_loading = true
        const form = Object.assign({}, this.ruleForm2)
        updateUser(form)
          .then(response => {
            console.log(response, 'res')
            this.handleLocalData(this.ruleForm2)
            this.$notify.success(this.$t('message.edit_success'))
            this.b_loading = false
          })
          .catch(error => {
            console.log(error, 'e')
            this.b_loading = false
          })
      })
    },
    resetForm() {
      this.ruleForm2.username = this.userInfo.username
      this.ruleForm2.mobile = this.userInfo.mobile
      this.ruleForm2.avatar = this.userInfo.avatar
      this.ruleForm2.ncode = this.userInfo.ncode
    },
    resetPassForm() {
      this.passForm.newPassword = undefined
      this.passForm.originPassword = undefined
    },
    // 处理本地数据，避免刷新不同步
    handleLocalData(form) {
      const userInfo = getStore({ name: 'userInfo' })
      if (userInfo) {
        userInfo.avatar =
          form.avatar && form.avatar.indexOf('http') === -1
            ? userInfo.avatar
              ? userInfo.avatar.split('image')[0] + form.avatar
              : form.avatar
            : form.avatar
        userInfo.mobile = form.mobile
        setStore({
          name: 'userInfo',
          content: userInfo,
          type: 'session'
        })
      }
    }
  }
}
</script>
<style scoped>
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
  font-size: 28px !important;
  color: #8c939d !important;
  width: 178px !important;
  height: 178px !important;
  line-height: 178px !important;
  text-align: center !important;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
