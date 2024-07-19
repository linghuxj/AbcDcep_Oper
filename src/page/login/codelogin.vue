<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    status-icon
    label-width="0"
  >
    <el-form-item prop="mobile">
      <el-input
        v-model="loginForm.mobile"
        size="small"
        :placeholder="$t('login.place_phone')"
        maxlength="11"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="el-icon-phone" />
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        v-model="loginForm.code"
        size="small"
        auto-complete="off"
        :placeholder="$t('login.place_code')"
        maxlength="6"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="icon-yanzhengma" />
        <template slot="append">
          <span
            :class="[{ display: msgKey }]"
            class="msg-text"
            @click="handleSend"
            >{{ msgText }}</span
          >
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        size="small"
        type="primary"
        class="login-submit"
        @click.native.prevent="handleLogin"
        >{{ $t('login.login') }}</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
// const MSGINIT = this.$t('send_code'),
// MSGSCUCCESS = this.$t('login.second_resend', {time: 9}),
const MSGTIME = 60
import { isvalidatemobile } from '@/util/validate'
import { mapGetters } from 'vuex'
import request from '@/router/axios'
export default {
  name: 'Codelogin',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length != 6) {
        callback(new Error(this.$t('login.valid_code_limit')))
      } else {
        callback()
      }
    }
    return {
      msgText: this.$t('login.send_code'),
      msgTime: MSGTIME,
      msgKey: false,
      loginForm: {
        mobile: '',
        code: ''
      },
      loginRules: {
        mobile: [
          {
            required: true,
            trigger: 'blur',
            // validator: validatePhone
          }
        ],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      }
    }
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(['tagWel'])
  },
  methods: {
    // 发送验证码
    handleSend() {
      if (this.msgKey) return
      if (!this.loginForm.mobile) {
        this.$message({
          message: this.$t('login.place_phone'),
          type: 'error',
          center: true
        })
        return
      }
      request({
        url: `/ope/mobile/login/${this.loginForm.mobile}`,
        method: 'get'
      }).then(response => {
        if (response.data.data) {
          this.$message.success(this.$t('login.send_code_success'))
        } else {
          this.$message.error(response.data.msg)
        }
      })

      this.msgText = this.$t('login.second_resend', { time: this.msgTime })
      this.msgKey = true
      const time = setInterval(() => {
        this.msgTime--
        this.msgText = this.$t('login.second_resend', { time: this.msgTime })
        if (this.msgTime === 0) {
          this.msgTime = MSGTIME
          this.msgText = this.$t('login.send_code')
          this.msgKey = false
          clearInterval(time)
        }
      }, 1000)
    },
    // 登陆
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loginForm.mobile = mobile;
          let form = {
            grant_type: 'mobile',
            mobile: this.loginForm.mobile,
            code: this.loginForm.code
          }
          this.$store.dispatch('LoginByPhone', form).then(() => {
            this.$router.push({ path: this.tagWel.value })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__prefix {
  font-size: 18px;
  line-height: 32px;
  i {
    color: #409eff;
  }
}
.msg-text {
  display: block;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
</style>
