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
      <el-form-item label="商户名称" prop="sellerName">
        <el-input v-model="form.sellerName"></el-input>
      </el-form-item>
      <el-form-item label="商户地址" prop="locationCode">
        <el-cascader
          ref="cascader"
          v-model="form.locationCode"
          :props="locationNameList"
          placeholder="请选择省/市/县区"
          clearable
          style="width:100%"
          @change="handleChange"
        ></el-cascader>
        <!-- <el-cascader
          v-if="isShowInfo"
          ref="cascader"
          v-model="form.locationCode"
          :options="optionsAreaList"
          :props="{ value: 'id', label: 'name' }"
          @change="handleChange"
          clearable
          style="width:100%"
        ></el-cascader>-->
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 地图 -->
        <div id="mapContainer" class="map"></div>
      </el-form-item>
      <el-alert title="商户联系信息" type="info" class="el-alert" :closable="false"></el-alert>
      <el-form-item label="负责人姓名" prop="fullName">
        <el-input v-model="form.fullName"></el-input>
      </el-form-item>
      <el-form-item label="负责人手机号" prop="mobile">
        <el-input v-model="form.mobile" maxlength="11"></el-input>
      </el-form-item>
      <el-alert title="商户平台登录账号" type="info" class="el-alert" :closable="false"></el-alert>
      <el-form-item label="登录账号" prop="mobiles">
        <el-input
          v-model="form.mobile"
          maxlength="11"
          :disabled="true"
          style="width: 80%;"
          placeholder="登录账号为手机号"
        ></el-input>
        <label style="margin-left:50px">默认密码是888888</label>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isEdit"
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="handleAddOrEdit"
        >立即修改</el-button>
        <el-button
          v-else
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
import maps from 'qqmap'
import { getQueryString } from '@/util/util'

// 引入地区查询接口
import { areaTree, areas } from '@/api/area'
// 引入门店新增、修改接口
import {
  addBusinessSeller,
  editBusinessSeller,
  getBusinessSellerById
} from '@/api/store/business'

export default {
  name: 'EditSeller',
  // components: {
  //   VDistpicker
  // },
  computed: {
    ...mapGetters(['permissions'])
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          const parentId = !node.value ? '-1' : node.value
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data
              // console.log('areaList', areaList)
              const nodes = Array.from(areaList).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 2
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            })
          }, 100)
        }
      },
      optionsAreaList: [],
      isShowInfo: true,
      // 经纬度 默认长沙市天心区
      latLngList: {
        lat: 28.1127,
        lng: 112.98991
      },
      marker: '',
      storeTypes: [],
      map: {},
      form: {
        address: undefined,
        fullName: undefined,
        lat: undefined,
        lng: undefined,
        location: undefined,
        locationCode: undefined,
        locationName: undefined,
        mobile: undefined,
        sellerName: undefined,
        storeType: undefined,
        mobiles: undefined,
        sellerId: undefined
      },
      loading: false,
      rules: {
        storeType: [
          { required: true, message: '请选择商户类型', trigger: 'blur' }
        ],
        sellerName: [
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
        locationCode: [{ required: true, message: '请选择省市区' }],
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
  created() {
    // this.getAreaTree()
    this.getAllStoreType()
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id

      this.$nextTick(() => {
        this.getStoreDetail(id)
      })
    } else {
      this.$nextTick(() => {
        this.initMap()
      })
    }
  },
  mounted() {
    // this.initMap()
    // const url = window.location.href.replace('#/business/seller/establish', '')
    // const id = getQueryString(url, 'id')
    // console.log(window.location.href)
    // if (id) {
    //   this.getStoreDetail(id)
    // }
  },
  methods: {
    // 查询区域
    // getAreaTree() {
    //   areaTree().then((res) => {
    //     this.optionsAreaList = res.data.data

    //     this.$nextTick(() => {
    //       console.log(this.form.locationCode)
    //       this.isShowInfo = false
    //       setTimeout(() => {
    //         this.isShowInfo = true
    //       }, 100)
    //     })
    //   })
    // },
    // 查询商户类型
    getAllStoreType() {
      allStoreType().then((res) => {
        this.storeTypes = res.data.data
      })
    },
    // 省市区选择事件
    handleChange(value) {
      this.form.locationName = this.$refs.cascader
        .getCheckedNodes()[0]
        .pathLabels.join('')
      this.form.location = this.form.locationCode.join()
      this.getAddressResolution(this.form.locationName)
    },
    // 根据id查询门店信息
    getStoreDetail(id) {
      const _this = this
      getBusinessSellerById(id).then((res) => {
        const latLngs = res.data.data.location
        _this.form = res.data.data
        _this.form.locationCode = latLngs.split(',').map(Number)
        _this.latLngList = {
          lat: res.data.data.lat,
          lng: res.data.data.lng
        }
        _this.initMap()
      })
    },
    // 腾讯地图加载
    initMap() {
      const _this = this
      maps.init('GWRBZ-UQ2EQ-OE657-GLWIM-3Q7N5-C6BQ4', () => {
        const latLon = new maps.LatLng(_this.latLngList.lat, _this.latLngList.lng) // 默认定位长沙
        //这个是标记
        const myOpts = {
          zoom: 14,
          center: latLon
        }

        const map = new maps.Map(document.getElementById('mapContainer'), myOpts)

        //这个是动态图标
        const anchor = new maps.Point(6, 6),
          size = new maps.Size(24, 24),
          origin = new maps.Point(0, 0),
          icon = new maps.MarkerImage(
            'https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/center.gif',
            size,
            origin,
            anchor
          )
        _this.marker = new maps.Marker({
          icon: icon,
          map: map,
          draggable: true,
          position: map.getCenter()
        })
        // 添加点击事件
        maps.event.addListener(_this.marker, 'dragend', function(event) {
          if (!_this.marker) {
            _this.marker = new qq.maps.Marker({
              position: event.latLng,
              map: map
            })
            _this.form.lat = event.latLng.lat
            _this.form.lng = event.latLng.lng
            return
          }
          _this.marker.setPosition(event.latLng)
        })
      })
    },
    /**
     * 逆向解析坐标方法
     * @param map  map地图对象
     * @param level 地图级别 1：省级 2：市级 3：区县级
     */
    getAddressResolution(inputVal) {
      const _this = this
      //调用地址解析类
      const geocoder = new qq.maps.Geocoder({
        complete: function(result) {
          _this.latLngList = result.detail.location
          _this.form.lat = result.detail.location.lat
          _this.form.lng = result.detail.location.lng
          _this.initMap()
        }
      })
      const address = inputVal
      //通过getLocation();方法获取位置信息值
      // console.log('搜索地址：', address)
      geocoder.getLocation(address)
    },
    // 立即创建点击事件
    handleAddOrEdit() {
      const _this = this
      _this.$refs.form.validate((valid) => {
        if (valid) {
          if (_this.form.sellerId) {
            _this.handleEdit()
          } else {
            _this.handleAdd()
          }
        }
      })
    },
    // 创建
    handleAdd() {
      addBusinessSeller(this.form).then((res) => {
        this.$message.success('添加成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 100)
      })
    },
    // 修改
    handleEdit() {
      editBusinessSeller(this.form).then((res) => {
        this.$message.success('编辑成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 100)
      })
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
      this.form = {
        address: undefined,
        contactTel: undefined,
        fullName: undefined,
        lat: undefined,
        lng: undefined,
        location: undefined,
        locationCode: undefined,
        locationName: undefined,
        mobile: undefined,
        sellerName: undefined,
        storeType: undefined,
        sellerId: undefined
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
.el-alert {
  margin-bottom: 20px;
}
</style>
