<template>
  <div class="business">
    <el-form ref="form" :model="form" :rules="rules" label-width="10rem" class="demo-ruleForm">
      <el-form-item label="商户类型" prop="storeType">
        <el-select v-model="form.storeType" placeholder="请选择商户类型" style="width: 50%">
          <el-option
            v-for="storeType in storeTypes"
            :key="storeType.typeId"
            :label="storeType.typeName"
            :value="storeType.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商户名称" prop="storeName">
        <el-input v-model="form.storeName"></el-input>
      </el-form-item>
      <el-form-item label="负责人姓名" prop="fullName">
        <el-input v-model="form.fullName"></el-input>
      </el-form-item>
      <el-form-item label="负责人手机号" prop="mobile">
        <el-input v-model="form.mobile" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="营业时间" required>
        <el-col :span="11">
          <el-form-item prop="startTime">
            <el-time-picker
              v-model="form.startTime"
              placeholder="选择时间"
              value-format="HH:mm:ss"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center">-</el-col>
        <el-col :span="11">
          <el-form-item prop="endTime">
            <el-time-picker
              v-model="form.endTime"
              placeholder="选择时间"
              value-format="HH:mm:ss"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="联系电话" prop="contactTel">
        <el-input v-model="form.contactTel" maxlength="18"></el-input>
      </el-form-item>
      <el-form-item label="商户地址" prop="location">
        <el-input v-model="form.location" placeholder="请输入省/市/县区"></el-input>
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 地图 -->
        <div id="map" class="map"></div>
      </el-form-item>
      <el-form-item label="商户图片" prop="resList">
        <upload
          ref="upload"
          v-model="form.resList"
          :limit="9"
          type="content"
          :multiple="true"
          :auto-upload="false"
          type-name="image"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="handleAddOrEdit"
        >立即创建</el-button>
        <el-button :disabled="loading" :loading="loading" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { allStoreType } from '@/api/store/storeType'
import { addStore, findStore } from '@/api/store/store'
import upload from '@/components/Upload-File/upload.vue'
import maps from 'qqmap'
import { getQueryString } from '@/util/util'
export default {
  components: {
    upload
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  data() {
    return {
      storeTypes: [],
      map: {},
      form: {
        address: undefined,
        contactTel: undefined,
        endTime: undefined,
        fullName: undefined,
        lat: undefined,
        lng: undefined,
        location: undefined,
        mainImage: undefined,
        mobile: undefined,
        resList: [],
        startTime: undefined,
        status: undefined,
        storeName: undefined,
        storeType: undefined
      },
      loading: false,
      rules: {
        storeType: [
          { required: true, message: '请选择商户类型', trigger: 'blur' }
        ],
        storeName: [
          { required: true, message: '请输入商户名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 30 个字符',
            trigger: 'blur'
          }
        ],
        fullName: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择时间',
            trigger: 'blur'
          }
        ],
        contactTel: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          }
        ],
        location: [
          { required: true, message: '请选择省市区', trigger: 'blur' }
        ],
        address: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    allStoreType().then((res) => {
      this.storeTypes = res.data.data
    })
    this.initMap()
    const url = window.location.href.replace('#/business/compile', '')
    const id = getQueryString(url, 'id')
    if (id) {
      this.getStoreDetail(id)
    }
  },
  methods: {
    getStoreDetail(id) {
      findStore(id).then((res) => {
        this.form = res.data.data
      })
    },
    initMap() {
      maps.init('GWRBZ-UQ2EQ-OE657-GLWIM-3Q7N5-C6BQ4', () => {
        var center = new maps.LatLng(39.92, 116.46) // 默认定位北京

        // //这个是标记
        var map = new maps.Map(document.getElementById('map'), {
          center: center,
          zoom: 13
        })

        //这个是动态图标
        var anchor = new maps.Point(6, 6),
          size = new maps.Size(24, 24),
          origin = new maps.Point(0, 0),
          icon = new maps.MarkerImage(
            'https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/center.gif',
            size,
            origin,
            anchor
          )
        this.marker = new maps.Marker({
          icon: icon,
          map: map,
          position: map.getCenter()
        })
      })
    },
    handleAddOrEdit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.upload.getContentUploadParam()
          if (this.form.resList.length === 0) {
            return this.$message.warning('图片不能为空')
          }
          if (this.storeId) {
            this.handleEdit()
          } else {
            this.handleAdd()
          }
        }
      })
    },
    handleAdd() {
      addStore(this.form).then((res) => {
        this.$message.success('添加成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      })
    },
    handleEdit() {
      editStore(this.form).then((res) => {
        this.$message.success('编辑成功')
        setTimeout(() => {
          this.$router.go(-1)
        })
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.form = {
        address: undefined,
        contactTel: undefined,
        endTime: undefined,
        fullName: undefined,
        lat: undefined,
        lng: undefined,
        location: undefined,
        mainImage: undefined,
        mobile: undefined,
        resList: [],
        startTime: undefined,
        status: undefined,
        storeName: undefined,
        storeType: undefined
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
  .map {
    width: 100%;
    height: 300px;
    background-color: #000;
  }
}
</style>
