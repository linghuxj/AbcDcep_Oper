<template>
  <div class="main-content">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      class="add-commerce"
      :rules="rules"
    >
      <el-form-item label="商圈名称：" prop="districtName">
        <el-input
          v-model="form.districtName"
          placeholder="请输入商圈名，最多20个字符"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="首页商圈图：" prop="districtLogo">
        <uploadImg
          ref="upload_logo"
          v-model="form.districtLogo"
          class="avatar-uploader"
          :show-file-list="false"
          :limit="1"
          type-name="conten"
        >
        </uploadImg>
      </el-form-item>
      <el-form-item label="商圈详情主图：" prop="detailImages">
        <uploadImg
          ref="upload_image"
          v-model="form.detailImages"
          class="avatar-uploader"
          :show-file-list="false"
          :limit="100"
          type-name="conten"
        >
        </uploadImg>
      </el-form-item>
      <el-form-item label="商圈简介：" prop="districtDesc">
        <el-input
          v-model="form.districtDesc"
          placeholder="请输入商圈简介，最多100个字符"
          maxlength="100"
        ></el-input>
      </el-form-item>
      <el-form-item label="推荐指数：" prop="recommendRate">
        <el-rate :allow-half="true" v-model="form.recommendRate"></el-rate>
      </el-form-item>
      <el-form-item label="推荐词：" prop="tagId">
        <el-select v-model="form.tagId" placeholder="请选择推荐词">
          <el-option
            v-for="item in tagList"
            :key="item.tagId"
            :label="item.tagName"
            :value="item.tagId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="历史文化：" prop="profile">
        <editor-bar v-model="form.profile" :is-clear="isClear"></editor-bar>
      </el-form-item>
      <el-form-item label="商圈地址：" prop="location">
        <div class="commerce-address">
          <!-- <div><el-input v-model="form.name" placeholder="请输入省/市/县区" maxlength="30"></el-input></div> -->
          <div>
            <el-cascader
              ref="cascader"
              v-model="form.location"
              :props="locationNameList"
              placeholder="请选择省/市/县区"
              clearable
              style="width: 100%"
            ></el-cascader>
          </div>
          <div class="search-search">
            <!-- <el-input
              v-model="form.address"
              placeholder="请输入详情地址"
              maxlength="50"
            ></el-input>
            <el-button @click="handleChange()">搜索地图</el-button> -->
            <el-autocomplete
              v-model="form.address"
              style="width: 100%"
              popper-class="autoAddressClass"
              :fetch-suggestions="querySearchAsync"
              :trigger-on-focus="false"
              placeholder="请输入详细地址,最多50个字符"
              clearable
              @select="handleAddress"
            >
              <template slot-scope="{ item }">
                <div style="overflow: hidden">
                  <div class="title">{{ item.title }}</div>
                  <span class="address ellipsis">{{ item.address }}</span>
                </div>
              </template>
            </el-autocomplete>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <!-- 地图 -->
        <!-- <div id="mapContainer" class="map"></div> -->
        <baidu-map
          class="map"
          :center="form.locationName ? 'form.locationName' : '长沙市天心区'"
          :zoom="14"
          :scroll-wheel-zoom="true"
          @ready="onReady"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="submit('form')"
          >保存</el-button
        >
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  addDistrict,
  detailBusiness,
  updateDistrict,
} from "@/api/commerce/commerce";
import { getTagAll } from "@/api/commerce/tag";
// 引入地区查询接口
import { areas } from "@/api/area";
// import maps from 'qqmap'
import EditorBar from "@/components/Rich-Text-Editor/Editor-Bar";
import uploadImg from "@/components/Upload-File/upload.vue";

import { findTag } from "@/util/deltag";
export default {
  components: {
    uploadImg,
    EditorBar,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
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
              // console.log('areaList', areaList)
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
      BMap: null,
      map: null,
      mk: "",
      form: {
        // lat: 0,
        // lng: 0,
        address: undefined,
        // 商圈地址：省市区区域编码 格式：xxx,xxx,xxx
        location: undefined,
        locationCode: undefined,
        // 商圈历史文化简介
        districtLogo: undefined,
        districtName: undefined,
        districtDesc: undefined, //商圈简介
        detailImages: undefined, //商圈详情主图
        profile: undefined,
        districtId: undefined,
      },
      latLng: undefined,
      isClear: false,
      loading: false,
      districtId: undefined,
      options: [],
      rules: {
        districtName: [
          { required: true, message: "请输入商圈名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        districtLogo: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请上传首页商圈图"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        detailImages: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请上传商圈详情主图"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        districtDesc: [
          { required: true, message: "请输入商圈简介", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        profile: [
          {
            required: true,
            message: "请填写商圈历史文化简介",
            trigger: "blur",
          },
        ],
        location: [
          { required: true, message: "请选择省市级联", trigger: "change" },
        ],
        recommendRate: [
          { required: true, message: "请选择推荐指数", trigger: "change" },
        ],
        tagId: [{ required: true, message: "请选择推荐词", trigger: "change" }],
      },
      // 商圈标签列
      tagList: [],
    };
  },
  created() {
    this.form.districtId = this.$route.query.districtId;
    getTagAll().then((res) => {
      this.tagList = res.data.data;
    });
    if (this.form.districtId) {
      this.getDetailBusiness();
    }
  },
  methods: {
    // 地图初始化回调
    onReady({ BMap, map }) {
      console.debug("初始化地图");
      this.BMap = BMap;
      this.map = map;
    },
    // 地址搜索
    querySearchAsync(str, cb) {
      var options = {
        onSearchComplete: function (res) {
          var s = [];
          // eslint-disable-next-line no-undef
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            for (var i = 0; i < res.getCurrentNumPois(); i++) {
              s.push(res.getPoi(i));
            }
            cb(s);
          } else {
            cb(s);
          }
        },
      };
      var local = new this.BMap.LocalSearch(this.map, options);
      local.search(str);
    },
    // 选择地址
    handleAddress(item) {
      this.form.address = item.title;
      this.form.lat = item.point.lat;
      this.form.lng = item.point.lng;
      this.map.clearOverlays();
      this.mk = new this.BMap.Marker(item.point);
      this.map.addOverlay(this.mk);
      this.map.panTo(item.point);
    },
    // 获取商圈详情
    getDetailBusiness() {
      detailBusiness(this.form.districtId).then((res) => {
        this.form = Object.assign({}, res.data.data);
        // 对省市区区号进行处理
        if (res.data.data.location) {
          const arr = res.data.data.location.split(",");
          const locationArr = [];
          for (const i in arr) {
            locationArr.push(Number(arr[i]));
          }
          this.form.location = locationArr;
        }
        if (res.data.data.tags && res.data.data.tags.length > 0) {
          this.form.tagId = res.data.data.tags[0].tagId;
        }
        let districtLogoArr = [res.data.data.districtLogo];
        let districtImageArr = res.data.data.detailImages;
        console.log(districtImageArr, "districtImageArr");
        this.$refs.upload_logo.loadImg(districtLogoArr);
        this.$refs.upload_image.loadImg(districtImageArr);
      });
    },
    //编辑商圈
    edit_submit() {
      this.$refs.form.validate((valid) => {
        this.loading = true;
        if (valid) {
          const data = {
            districtLogo: this.form.districtLogo,
            districtName: this.form.districtName,
            districtDesc: this.form.districtDesc, //商圈简介
            detailImages: this.form.detailImages, //商圈详情主图
            districtImage: this.form.detailImages[0],
            profile: this.form.profile,
            districtId: this.form.districtId,
            location: this.form.location.toString(),
            address: this.form.address,
            lat: this.form.lat,
            lng: this.form.lng,
            recommendRate: this.form.recommendRate,
            tagId: this.form.tagId,
          };
          console.debug("data编辑商圈", data);
          updateDistrict(data)
            .then(() => {
              this.$message.success("修改成功");
              setTimeout(() => {
                let value = this.$route.fullPath;

                let { tag } = findTag(value);

                this.$store.commit("DEL_TAG", tag);
                this.$router.go(-1);
              }, 100);
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    },
    // 新增商圈
    add_submit() {
      this.loading = true;
      if (this.form.location) {
        this.form.location = this.form.location.toString();
      }

      addDistrict(this.form)
        .then(() => {
          this.$message.success("新增成功");
          setTimeout(() => {
            let value = this.$route.fullPath;
            let { tag } = findTag(value);
            this.$store.commit("DEL_TAG", tag);
            this.$router.go(-1);
          }, 100);
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 保存
    async submit() {
      const _this = this;
      const params = _this.$refs.upload_logo.imgURL;
      const params2 = _this.$refs.upload_image.imgURL;
      _this.form.districtLogo = params[0];
      _this.form.detailImages = params2;
      _this.districtImage = this.form.detailImages[0];
      console.debug("_this.form.detailImages", _this.form.detailImages);
      this.loading = true;
      setTimeout(() => {
        _this.$refs["form"].validate((valid) => {
          if (valid) {
            if (_this.isEdit) {
              _this.edit_submit();
            } else {
              _this.add_submit();
            }
          } else {
            this.loading = false;
          }
        });
      }, 2000);
    },
    // 详细地址事件
    handleChange() {
      if (!this.form.address) {
        this.$message.warning("请输入详细地址");
        return;
      }
      const locationName =
        this.$refs.cascader.getCheckedNodes()[0].pathLabels.join("") +
        this.form.address;

      if (this.form.locationCode) {
        this.form.location = this.form.locationCode.join();
      } else {
        this.form.location = this.form.location.toString();
      }

      console.debug(
        "this.form.locationCode",
        this.form.locationCode,
        this.form.location
      );
      this.getAddressResolution(locationName);
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.form = {
      //   // lat: 0,
      //   // lng: 0,
      //   address: undefined,
      //   // 商圈地址：省市区区域编码 格式：xxx,xxx,xxx
      //   location: undefined,
      //   locationCode: undefined,
      //   // 商圈历史文化简介
      //   districtLogo: undefined,
      //   districtName: undefined,
      //   districtDesc: undefined, //商圈简介
      //   detailImages: undefined, //商圈详情主图
      //   profile: undefined,
      //   districtId: undefined
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.add-commerce .el-input {
  width: 400px;
}
.commerce-address {
  display: flex;
  flex-direction: column;
}
.search-search {
  display: flex;
  margin-top: 10px;
}
.map {
  width: 100%;
  height: 300px;
  background-color: #000;
}

.autoAddressClass {
  li {
    .title {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .address {
      line-height: 1;
      font-size: 12px;
      color: #b4b4b4;
      margin-bottom: 5px;
    }
  }
}

::v-deep .el-rate {
  height: 28px;
  line-height: 28px;
  .el-rate__item {
    vertical-align: -webkit-baseline-middle;
  }
}
</style>
