<template>
  <div class="business">
    <el-form ref="form" :model="form" :rules="rules" label-width="10rem" class="demo-ruleForm">
      <el-form-item label="嗨PRO卡封面：">
        <upload
          ref="upload"
          v-model="form.image"
          type="content"
          :limit="1"
          :multiple="true"
          :auto-upload="false"
          type-name="image"
        />
      </el-form-item>
      <el-form-item label="嗨PRO卡名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入嗨PRO卡名称" />
      </el-form-item>
      <el-form-item label="嗨卡类型" prop="typeId">
        <el-select v-model="form.typeId" placeholder="请选择嗨卡类型" style="width: 70%">
          <el-option
            v-for="type in cardTypeArr"
            :key="type.typeId"
            :label="type.typeName"
            :value="type.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期：" prop="expiryDate">
        <el-input v-model.number="form.expiryDate" placeholder="请输入有效期" style="width: 30%" />
        <el-select v-model="form.expiryDateType" placeholder="请选择有效期类型" style="width: 70%">
          <el-option
            v-for="type in expiryDateTypes"
            :key="type.itemId"
            :label="type.itemLabel"
            :value="type.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="售价（元）：" prop="price">
        <el-input v-model.number="form.price" placeholder="请输入售价（元）" maxlength="11" />
      </el-form-item>
      <el-form-item label="使用平台：" prop="platform">
        <el-select v-model="form.platform" placeholder="请选择使用平台" style="width: 100%">
          <el-option
            v-for="type in platLists"
            :key="type.itemId"
            :label="type.itemLabel"
            :value="type.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权益说明：" prop="cardDesc">
        <el-input v-model="form.cardDesc" type="textarea" placeholder="请输入个人简介，最多1000个字符；" maxlength="2000" />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isEdit"
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="handleAddOrEdit"
        >修改</el-button>
        <el-button
          v-else
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="handleAddOrEdit"
        >保存</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import upload from '@/components/Upload-File/upload'
import { mapGetters } from 'vuex'

// import { getUploadImageParams } from '@/api/upload'


import {
  addCard,
  editCard,
  getCardById,
  getTypeCard
} from '@/api/hipro/lists'

import { fetchItemList } from '@/api/system/dict'

export default {
  name: 'EditHiPro',
  components: {
    upload
  },
  // components: {
  //   VDistpicker
  // },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        cardDesc: undefined,
        expiryDate: undefined,
        expiryDateType: undefined,
        image: undefined,
        name: undefined,
        platform: undefined,
        price: undefined,
        id: undefined,
        typeId: undefined
      },
      cardTypeArr: [],
      platLists: [],
      expiryDateTypes: [],
      loading: false,
      rules: {
        expiryDateType: [
          { required: true, message: '请选择有效期类型', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入嗨PRO卡名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ],
        typeId: [{ required: true, message: '请输入嗨卡类型', trigger: 'blur' }],
        cardDesc: [
          {
            required: true,
            message: '请输入权益说明',
            trigger: 'blur'
          }
        ],
        expiryDate: [
          {
            required: true,
            message: '请输入有效时间',
            trigger: 'blur'
          }
        ],
        platform: [
          {
            required: true,
            message: '请选择使用平台',
            trigger: 'blur'
          }
        ],
        price: [
          {
            required: true,
            message: '请输入售卖金额',
            trigger: 'blur'
          }
        ]
      }
    }
  }, 
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.initPlatList()
    this.initTypeList()
    this.getTypeCardList()
    console.debug('----', this.$route.query.id)
    if (this.isEdit) {
      const id = this.$route.query && this.$route.query.id
      this.form.id = id
      this.$nextTick(() => {
        this.getHiProDetail(id)
      })
    }
  },
  mounted() {
  },
  methods: {
    // 查询平台类型
    initPlatList() {
      fetchItemList({ 'dictType': 'card_platform' }).then(resp => {
        const page = resp.data.data
        this.platLists = page.records
      }).catch(e => {
      })
    },
    // 查询有效期
    initTypeList() {
      fetchItemList({ 'dictType': 'card_date_type' }).then(resp => {
        const page = resp.data.data
        this.expiryDateTypes = page.records
      })
        .catch(e => {
        })
    },
    // 查询嗨卡类型列表
    getTypeCardList() {
      getTypeCard().then(res => {
        this.cardTypeArr = res.data.data.records
      })
    },
    // 查询详情
    getHiProDetail(id) {
      getCardById(id).then(res => {
        this.form = res.data.data
      })
    },

    // 立即创建点击事件
    async handleAddOrEdit() {
      const _this = this
      // _this.$refs.upload.getContentUploadParam()
      _this.loading = true
      const file = _this.$refs.upload.files
      if (file.length < 1) {
        this.$message.warning('请选择嗨PRO卡封面')
        return
      }
      _this.$refs.upload.getUploadParams()
      setTimeout(() => {
        this.$refs.form.validate((valid) => {
          console.debug('--', valid)
          if (valid) {
            // 上传图片拿到imageURL
            const uploadParams = _this.$refs.upload.uploadParams
            this.circleReq.circleLogo = uploadParams[0].imageURL
            console.debug('this.circleReq.circleLogo', this.circleReq.circleLogo)
            console.debug('this,form.id', _this.form.id)
            if (_this.form.id) {
              _this.handleEdit()
            } else {
              _this.handleAdd()
            }
          } else {
            _this.loading = false
          }
        })    
      }, 2000)
    },
    // 创建
    handleAdd() {
      console.debug('添加')
      addCard(this.form).then((res) => {
        this.$message.success('添加成功')
        this.loading = false
        setTimeout(() => {
          this.$router.go(-1)
        }, 100)
      })
    },
    // 修改
    handleEdit() {
      editCard(this.form).then((res) => {
        this.$message.success('编辑成功')
        this.loading = true
        setTimeout(() => {
          this.$router.go(-1)
        }, 100)
      })
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
      this.form = {
        cardDesc: undefined,
        expiryDate: undefined,
        expiryDateType: undefined,
        image: undefined,
        name: undefined,
        platform: undefined,
        price: undefined,
        id: undefined
      }
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
</style>
