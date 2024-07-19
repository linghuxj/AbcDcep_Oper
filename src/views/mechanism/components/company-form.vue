<template>
  <!-- 添加或修改菜单对话框 -->
  <div>
    <el-dialog :title="title" :visible.sync="visible">
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="下级单位：" v-if="isTitle" prop="sonId">
          <el-select v-model="form.sonId" placeholder="请选择下级单位">
            <el-option
              v-for="(item, index) in unitList"
              :key="index"
              :label="item.unitName"
              :value="item.unitId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="单位名称：" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入单位名称" />
        </el-form-item>
        <el-form-item label="单位地址：" prop="location">
          <el-cascader
            ref="cascader"
            v-model="form.location"
            :props="locationNameList"
            placeholder="请选择省/市/县区"
            clearable
            style="width: 100%"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item prop="address">
          <el-input
            v-model="form.address"
            placeholder="请输入详情地址"
            maxlength="50"
            @change="handleAddress"
          />
        </el-form-item>
        <el-col :span="12">
          <el-form-item label="纬度：" prop="lat">
            <el-input v-model="form.lat" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度：" prop="lng">
            <el-input v-model="form.lng" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-form-item>
          <!-- 地图 -->
          <div id="mapContainer" class="map"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="b_loading" @click="dataFormSubmit">
          保存
        </el-button>
        <el-button @click="visible = false"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addUnit,
  getUnit,
  editUnit,
  getUnitById,
} from "@/api/mechanism/company";

import { mapGetters } from "vuex";

// 引入地区查询接口
import { areas } from "@/api/area";

export default {
  name: "CompanyForm",

  data() {
    return {
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data;
              const nodes = Array.from(areaList).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 2,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      // 遮罩层
      loading: true,
      // 上级选项列表
      unitList: [],
      // 是否显示弹出层
      visible: false,
      // 是否编辑
      isEdit: false,
      b_loading: false,

      // 标题
      title: "插入单位",
      // 是否插入
      isTitle: true,

      transForm: {},

      // 经纬度 默认长沙市天心区
      latLngList: {
        lat: 28.1127,
        lng: 112.98991,
      },
      // 放大级别
      zoom: 14,
      form: {
        address: "",
        lat: undefined,
        lng: undefined,
        location: "",
        parentId: undefined,
        sonId: undefined,
        unitId: undefined,
        unitName: "",
        locationName: "",
      },
      // 表单校验
      rules: {
        address: [
          {
            required: true,
            message: "请输入详情信息",
            trigger: "blur",
          },
        ],
        location: [
          {
            required: true,
            message: "请选择省市区",
            trigger: "blur",
          },
        ],
        unitName: [
          {
            required: true,
            message: "请填写单位名称",
            trigger: "blur",
          },
        ],
        lat: [
          {
            required: true,
            message: "纬度不能为空",
            trigger: "blur",
          },
        ],
        lng: [
          {
            required: true,
            message: "经度不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    let _this = this;
    _this.getTreeselect();
    if (typeof qq == "object") {
      _this.$nextTick(() => {
        _this.initMap();
      });
    } else {
      _this.loadQQmap();
    }
    window.onMapFileLoad = function () {
      _this.$nextTick(() => {
        _this.initMap();
      });
    };
  },
  methods: {
    // 加载腾讯地图sdk
    loadQQmap() {
      let script = document.createElement("script");
      // 设置标签的type属性
      script.type = "text/javascript";
      // 设置标签的链接地址
      script.src =
        "https://map.qq.com/api/js?v=2.exp&callback=onMapFileLoad&key=GWRBZ-UQ2EQ-OE657-GLWIM-3Q7N5-C6BQ4";
      // 添加标签到dom
      document.body.appendChild(script);
    },
    // 腾讯地图加载
    initMap() {
      const _this = this;
      // eslint-disable-next-line no-undef
      const latLon = new qq.maps.LatLng(
        _this.latLngList.lat,
        _this.latLngList.lng
      ); // 默认定位长沙
      //这个是标记
      const myOpts = {
        zoom: this.zoom,
        center: latLon,
      };
      // eslint-disable-next-line no-undef
      const map = new qq.maps.Map(
        document.getElementById("mapContainer"),
        myOpts
      );

      //这个是动态图标
      // eslint-disable-next-line no-undef
      const anchor = new qq.maps.Point(6, 6),
        // eslint-disable-next-line no-undef
        size = new qq.maps.Size(24, 24),
        // eslint-disable-next-line no-undef
        origin = new qq.maps.Point(0, 0),
        // eslint-disable-next-line no-undef
        icon = new qq.maps.MarkerImage(
          "https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/center.gif",
          size,
          origin,
          anchor
        );
      // eslint-disable-next-line no-undef
      let marker = new qq.maps.Marker({
        icon: icon,
        map: map,
        draggable: true,
        position: map.getCenter(),
      });
      // 添加点击事件
      // eslint-disable-next-line no-undef
      qq.maps.event.addListener(marker, "dragend", function (event) {
        if (!marker) {
          // eslint-disable-next-line no-undef
          marker = new qq.maps.Marker({
            position: event.latLng,
            map: map,
          });
          _this.form.lat = event.latLng.lat;
          _this.form.lng = event.latLng.lng;
          return;
        }
        marker.setPosition(event.latLng);
      });
    },
    // 初始化
    init(isEdit, title, id) {
      if (title === "insert") {
        this.title = "插入单位";
        this.isTitle = true;
      } else if (title === "add") {
        this.title = "新建下级";
        this.isTitle = false;
      } else {
        this.title = "编辑";
        this.isTitle = false;
      }
      this.parentId = id;
      this.isEdit = isEdit;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (isEdit) {
          getUnitById(id).then((response) => {
            let unit = response.data.data;
            unit.location = unit.location.split(",").map(Number);
            this.latLngList.lat = unit.lat;
            this.latLngList.lng = unit.lng;
            this.initMap();
            this.form = unit;
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      if (this.form.location) {
        this.form.location = this.form.location.join();
      }
      this.b_loading = true;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            editUnit(this.form)
              .then(() => {
                this.$message.success("修改成功！");
                this.visible = false;
                this.b_loading = false;
                this.$emit("refreshDataList");
              })
              .catch(() => {
                this.form.location = this.form.location.split(",").map(Number);
                this.b_loading = false;
              });
          } else {
            this.form.parentId = this.parentId;
            addUnit(this.form)
              .then(() => {
                this.$message.success("添加成功！");
                this.visible = false;
                this.b_loading = false;
                this.$emit("refreshDataList");
              })
              .catch(() => {
                this.form.location = this.form.location.split(",").map(Number);
                this.b_loading = false;
              });
          }
        } else {
          this.form.location = this.form.location.split(",").map(Number);
          this.b_loading = false;
        }
      });
    },
    /** 查询下拉结构 */
    getTreeselect() {
      getUnit().then((response) => {
        this.unitList = [];
        this.unitList = response.data.data;
      });
    },

    // 省市区选择事件
    handleChange() {
      this.form.locationName = this.$refs.cascader
        .getCheckedNodes()[0]
        .pathLabels.join("");
      if (this.form.address) {
        this.$refs["dataForm"].validateField("address");
      }
    },

    // 查询经纬度
    handleAddress() {
      this.getAddressResolution(this.form.locationName + this.form.address);
    },
    /**
     * 逆向解析坐标方法
     * @param map  map地图对象
     * @param level 地图级别 1：省级 2：市级 3：区县级
     */
    getAddressResolution(inputVal) {
      const _this = this;
      //调用地址解析类

      // eslint-disable-next-line no-undef
      const geocoder = new qq.maps.Geocoder({
        complete: function (result) {
          _this.form.lat = result.detail.location.lat;
          _this.form.lng = result.detail.location.lng;
          _this.latLngList.lat = result.detail.location.lat;
          _this.latLngList.lng = result.detail.location.lng;
          _this.initMap();
        },
      });
      const address = inputVal;
      //通过getLocation();方法获取位置信息值
      geocoder.getLocation(address);
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 300px;
  background-color: #000;
}
</style>
