<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    class="login-form"
    status-icon
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        size="small"
        auto-complete="off"
        :placeholder="$t('login.valid_username')"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="icon-yonghu" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        :type="passwordType"
        size="small"
        auto-complete="off"
        :placeholder="$t('login.valid_pass')"
        @keyup.enter.native="handleLogin"
      >
        <i
          slot="suffix"
          class="el-icon-view el-input__icon"
          @click="showPassword"
        />
        <i slot="prefix" class="iconfont icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-row :span="24">
        <el-col :span="16">
          <el-input
            v-model="loginForm.code"
            :maxlength="code.len"
            size="small"
            auto-complete="off"
            :placeholder="$t('login.valid_code')"
            @keyup.enter.native="handleLogin"
          >
            <i slot="prefix" class="icon-yanzhengma" />
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="code.src" class="login-code-img" @click="refreshCode" />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        class="login-submit"
        style="margin-top: 2rem"
        @click.native.prevent="handleLogin"
        >{{ $t('login.login') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { randomLenNum } from '@/util/util'
import { mapGetters } from 'vuex'
import { getCode } from '@/api/code'

export default {
  name: 'Userlogin',
  data() {
    return {
      socialForm: {
        code: '',
        state: ''
      },
      loginForm: {
        username: '',
        password: '',
        language: window.localStorage.getItem('mewooo-language') || 'zh',
        code: '',
        randomStr: ''
      },
      checked: false,
      code: {
        src: undefined,
        len: 4
      },
      loginRules: {
        language: [
          {
            required: true,
            message: this.$t('login.select_language'),
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: this.$t('login.valid_username'),
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('login.valid_pass'),
            trigger: 'blur'
          },
          {
            min: 6,
            message: this.$t('login.valid_pass_limit'),
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: this.$t('login.valid_code'),
            trigger: 'blur'
          }
        ]
      },
      passwordType: 'password'
    }
  },
  created() {
    this.refreshCode()
    this.$i18n.location = window.localStorage.getItem('mewooo-language')
  },
  mounted() {},
  computed: {
    ...mapGetters(['tagWel', 'userId'])
  },
  props: [],
  methods: {
    switchLanguage(language) {
      window.localStorage.setItem('mewooo-language', language)
      window.location.reload()
    },
    refreshCode() {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      getCode({ randomStr: this.loginForm.randomStr }, this.code).catch(() => {
        this.$store.dispatch('FedLogOut')
      })
    },
    showPassword() {
      this.passwordType == ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          window.localStorage.setItem(
            'mewooo-language',
            this.loginForm.language
          )
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.$store
                .dispatch('GetMineInfo', this.userId)
                .then(() => {
                  this.$router.push({ path: this.tagWel.value })
                })
                .catch(error => {
                  console.error(error)
                })
            })
            .catch(e => {
              console.error(e)
              this.refreshCode()
            })
        }
      })
    }
  }
}
</script>

<style></style>
