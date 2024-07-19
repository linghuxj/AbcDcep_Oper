<template>
  <div class="business">
    <el-form ref="form" :model="form" :rules="rules" label-width="10rem" class="demo-ruleForm">
      <el-form-item label="创客头像：">
        <upload
          ref="upload1"
          v-model="form.avatar"
          type="content"
          :limit="1"
          :multiple="true"
          :auto-upload="false"
          type-name="image"
        />
      </el-form-item>
      <el-form-item label="真实姓名：" prop="realName">
        <el-input v-model="form.realName" placeholder="请输入真实姓名" maxlength="20" style="width: 36%" :disabled="editShow" />
      </el-form-item>
      <el-form-item label="身份证号码：" prop="idNo">
        <el-input v-model="form.idNo" placeholder="请输入身份证号码" maxlength="18" style="width: 36%" :disabled="editShow" />
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio v-for="(item,index) in sexArr" :key="index" :label="item.dictName" :value="item.dictValue"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码：" prop="tel">
        <el-input v-model.number="form.mobile" placeholder="请输入手机号" maxlength="11" style="width: 36%" :disabled="editShow" />
      </el-form-item>
      <el-form-item label="关联角色：" prop="userRole">
        <el-select v-model="form.userRole" placeholder="请选择角色类型" style="width: 36%" disabled>
          <el-option
            v-for="role in roleArr"
            :key="role.dictName"
            :label="role.dictName"
            :value="role.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属单位：" prop="company">
        <el-input v-model="form.company" placeholder="请输入所属单位" style="width: 36%" maxlength="10" />
      </el-form-item>
      <el-form-item label="所属单位编号：" prop="companyNo">
        <el-input v-model="form.companyNo" placeholder="请输入所属单位编号" style="width: 36%" maxlength="20" />
      </el-form-item>
      <el-form-item label="所属机构：">
        <el-select v-model="form.orgId" placeholder="请选择所属机构">
          <el-option v-for="item in organizList" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="个人简介" prop="profile">
        <el-input v-model="form.profile" type="textarea" placeholder="请输入个人简介，最多100个字符；" maxlength="100" style="width: 36%" :disabled="editShow" />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="userId"
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="update"
        >修改</el-button>
        <el-button
          v-else
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="establish"
        >保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import upload from '@/components/upload'
import upload from '@/components/Upload-File/upload'
// 新增创客
import {
  addDistribution,
  role,
  sex,
  getMarkMes,
  updateMark
} from '@/api/distribution/establish'
import { getOrganization } from '@/api/mechanism/mechanism'
// import { findDistributorInfo } from '@/api/distribution/distribution'
export default {
  name: 'EditMakers',
  components: {
    upload
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        avatar: undefined,
        company: undefined, //所属单位
        companyNo: undefined, //所属编号
        idNo: undefined, //身份证号码
        profile: undefined, //个人简介
        realName: undefined, //真实姓名
        mobile: undefined, //手机号
        sex: undefined, //性别
        userRole: undefined, //关联角色
        orgId: undefined
        // tel:undefined,
      },
      loading: false,
      rules: {
        avatar: [{ required: true, message: '请选择头像', trigger: 'blur' }],
        company: [{ required: true, message: '请填写所属单位', trigger: 'blur' }],
        companyNo: [{ required: true, message: '请填写所属单位编号', trigger: 'blur' }],
        idNo: [{ required: true, message: '请填写身份证号码', trigger: 'blur' }],
        profile: [{ required: true, message: '请填写个人简介', trigger: 'blur' }],
        realName: [{ required: true, message: '请填写真实姓名', trigger: 'blur' }],
        mobile: [
          {
            required: true,
            message: '请输入登录账号',
            trigger: 'blur'
          }
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        userRole: [
          { required: true, message: '请选择关联角色', trigger: 'blur' }
        ]
      },
      roleArr: [],
      sexArr: [],
      editShow: false,
      userId: undefined,
      organizList: []
    }
  },
  created() {
    if (this.$route.query.userRole) {
      const form = this.form
      form.userRole = this.$route.query.userRole
    }
    if (this.$route.query && this.$route.query.userId) {
      this.userId = this.$route.query.userId
      this.editShow = true
      this.userDetail()
    }
    this._role()
    this._sex()
    this.getOrganizationList()
  },
  mounted() {
  },
  methods: {
    // 查询角色
    _role() {
      role().then(res => {
        this.roleArr = res.data.data
      })
    },
    _sex() {
      sex().then(res => {
        this.sexArr = res.data.data
      })
    },
    // 根据ID查询用户详情
    userDetail() {
      getMarkMes(this.userId).then(res => {
        this.form = Object.assign({}, res.data.data)
        this.$refs.upload1.uploadImg(res.data.data.avatar)
      })
    },
    // 增加创客
    establish() {
      const _this = this
      if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.form.mobile)) {
        _this.$message.success('填写正确的手机号码')
        return
      }
      const idCard = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/
      if (!idCard.test(this.form.idNo)) {
        _this.$message.success('填写正确的身份证号码')
        return
      }
      _this.loading = true
      _this.$refs.upload1.getUploadParams()
      setTimeout(() => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 上传图片拿到imageURL
            const uploadParams = _this.$refs.upload1.uploadParams
            _this.form.avatar = uploadParams[0].imageURL
            addDistribution(_this.form).then(res => {
              this.$router.go(-1)
              _this.loading = false
            }).catch(() => {
              _this.loading = false
            })
          } else {
            _this.loading = false
          }
        })    
      }, 2000)
    },
    // 修改创客
    update() {
      const _this = this
      if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.form.mobile)) {
        _this.$message.success('填写正确的手机号码')
        return
      }
      const idCard = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/
      if (!idCard.test(this.form.idNo)) {
        _this.$message.success('填写正确的身份证号码')
        return
      }
      _this.loading = true
      _this.$refs.upload1.getUploadParams()
      setTimeout(() => {
        _this.$refs.form.validate((valid) => {
          if (valid) {
            // 上传图片拿到imageURL
            const uploadParams = _this.$refs.upload1.uploadParams
            const data = {
              avatar: uploadParams[0].imageURL,
              userId: _this.userId,
              company: _this.form.company,
              companyNo: _this.form.companyNo,
              sex: _this.form.sex,
              userRole: _this.form.userRole,
              orgId: _this.form.orgId,
              profile: _this.form.profile
            }
            console.debug('data', data)
            updateMark(data).then(res => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$router.go(-1)
              _this.loading = false
            }).catch(() => {
              _this.loading = false
            })
          } else {
            _this.loading = false
          }
        })
      }, 2000)
    },
    // 查询机构列表
    getOrganizationList() {
      const data = {}
      getOrganization(data).then(res => {
        this.organizList = res.data.data.records
      })
    },
    // 重置
    reset() {
      this.$refs.upload1.clearFiles()
      this.$refs.form.resetFields()
      this.form = {
        avatar: undefined,
        company: undefined, //所属单位
        companyNo: undefined, //所属编号
        idImageBack: undefined, //身份证背面
        idImageFront: undefined, //身份证正面
        idNo: undefined, //身份证号码
        profile: undefined, //个人简介
        realName: undefined, //真实姓名
        mobile: undefined, //手机号
        sex: undefined, //性别
        userRole: undefined //关联角色
      }
    },
    // 取消
    cancle() {
      this.$router.go(-1)
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
.el-alert {
  margin-bottom: 20px;
}
.uploadCard {
  display: flex;
}
.uploadCard .uploadCard-item{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}
</style>
