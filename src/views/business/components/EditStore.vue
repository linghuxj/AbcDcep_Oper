<template>
  <div class="business">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="10rem"
      class="demo-ruleForm"
    >
      <aside-tip content="店铺基本信息" />
      <el-form-item
        v-if="permissions.store_status_edit"
        label="所属商圈："
        prop="districtId"
      >
        <el-select
          v-model="form.districtId"
          placeholder="请选择所属商圈"
          style="width: 50%"
          filterable
          remote
          reserve-keyword
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="(item, index) in businessArr"
            :key="index"
            :label="item.districtName"
            :value="item.districtId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺类型：" prop="storeType">
        <el-select
          v-model="form.storeType"
          placeholder="请选择店铺类型"
          style="width: 50%"
        >
          <el-option
            v-for="storeType in storeTypes"
            :key="storeType.typeId"
            :label="storeType.typeName"
            :value="storeType.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称：" prop="storeName">
        <el-input
          v-model="form.storeName"
          style="width: 50%"
          placeholder="请输入店铺名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="销售渠道：" prop="checkedCities">
        <el-checkbox-group v-model="form.checkedCities">
          <el-checkbox
            v-for="(item, index) in saleChannelLists"
            :key="index"
            :label="item.dictValue"
          >
            {{ item.dictName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="店铺编号：" prop="bankStoreNo">
        <el-input
          v-model="form.bankStoreNo"
          style="width: 50%"
          placeholder="请输入店铺编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="商户编号：" prop="bankMerchantNo">
        <el-input
          v-model="form.bankMerchantNo"
          style="width: 50%"
          placeholder="请输入商户编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="营业时间：" required>
        <el-col :span="5">
          <el-form-item prop="startTime">
            <el-time-select
              v-model="form.startTime"
              placeholder="开始时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00',
              }"
              style="width: 100%"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center">-</el-col>
        <el-col :span="5">
          <el-form-item prop="endTime">
            <el-time-select
              v-model="form.endTime"
              placeholder="结束时间"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '24:00',
                minTime: form.startTime,
              }"
              style="width: 100%"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="店铺联系电话：" required>
        <el-col :span="6">
          <el-form-item prop="contactTel">
            <el-col :span="8">
              <el-input
                v-model="form.phoneCode"
                placeholder="区号"
                maxlength="4"
              ></el-input>
            </el-col>
            <el-col :span="2" style="text-align: center">
              <span>-</span>
            </el-col>
            <el-col :span="14">
              <el-input
                v-model="form.contactTel"
                placeholder="电话号码"
                maxlength="11"
              />
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="1" style="text-align: center">
          <span>或</span>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              maxlength="11"
              placeholder="请选输入门店手机号"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="营业执照：" required>
        <el-col :span="12">
          <el-form-item prop="businessLicense">
            <el-input
              v-model="form.businessLicense"
              maxlength="20"
              placeholder="请选输入营业执照名称"
            />
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          style="padding-left: 30px"
          v-if="!form.businessLicenseImage"
        >
          <el-upload
            :file-list="files"
            :limit="1"
            :http-request="handleFileChange1"
            action="#"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
          <!-- <base-upload ref="upload" text="上传图片" @baseupload="baseupload" v-if="!form.businessLicenseImage" /> -->
        </el-col>
      </el-form-item>
      <el-form-item prop="businessLicenseNo">
        <el-input
          v-model="form.businessLicenseNo"
          maxlength="20"
          placeholder="请选输入营业执照编号"
          style="width: 50%"
        />
      </el-form-item>
      <!-- 图片 -->
      <el-form-item
        prop="businessLicenseImage"
        v-if="form.businessLicenseImage"
      >
        <el-image
          style="width: 300px"
          :src="form.businessLicenseImage"
        ></el-image>
        <div style="margin-left: 30px; display: inline-block">
          <el-upload
            :file-list="files"
            :limit="2"
            :http-request="handleFileChange2"
            action="#"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">重新上传</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="店铺地址：" prop="location">
        <el-cascader
          ref="cascader"
          v-model="form.location"
          :props="locationNameList"
          placeholder="请选择省/市/县区"
          clearable
          style="width: 50%"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="address">
        <el-autocomplete
          v-model="form.address"
          style="width: 50%"
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
      </el-form-item>
      <el-form-item>
        <!-- 地图 -->
        <baidu-map
          class="map"
          :center="mapData.center"
          :zoom="mapData.zoom"
          :scroll-wheel-zoom="true"
          @ready="onReady"
        />
      </el-form-item>
      <el-form-item label="店铺图片：">
        <span class="tips">最多九张图片</span>
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
      <el-form-item label="邀请人：">
        <el-select
          v-model="form.inviterUser"
          filterable
          remote
          :remote-method="userRemoteMethod"
          placeholder="请输入或选择邀请人"
          :disabled="isEdit"
        >
          <el-option
            v-for="item in inviterUserList"
            :key="item.userId"
            :label="item.username"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商户设立时间：" prop="registrationDate">
        <el-date-picker
          v-model="form.registrationDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="商户主营业务简介：" prop="businessScope">
        <el-input
          v-model="form.businessScope"
          placeholder="请填写主营业务简介"
          type="textarea"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>
      <!-- 机具使用状态 -->
      <aside-tip content="机具使用状态" />
      <el-form-item label="POS机：" prop="posStatus">
        <el-radio-group v-model="form.posStatus">
          <el-radio
            :label="item.dictValue"
            v-for="(item, index) in machinesStatus"
            :key="index"
            >{{ item.dictName }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="聚合码：" prop="paymentCodeStatus">
        <el-radio-group v-model="form.paymentCodeStatus">
          <el-radio
            :label="item.dictValue"
            v-for="(item, index) in machinesStatus"
            :key="index"
            >{{ item.dictName }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <!-- 银行卡信息 -->
      <aside-tip content="银行卡信息">
        <span slot="aleft">
          <el-button size="mini" @click="onIncreaseBank">添加</el-button>
        </span>
      </aside-tip>

      <el-form-item
        v-for="(domainMes, index2) in form.storeBankList"
        :key="domainMes.value"
      >
        <el-form
          ref="domainFormMes"
          :model="domainMes"
          :rules="domainsMes"
          label-width="10rem"
          class="rmb_account"
        >
          <triangle-label :content="'账户' + changeNumToHan(index2 + 1)">
            <span slot="triangle-left" />
          </triangle-label>
          <el-form-item label="银行卡信息：" prop="openBank">
            <el-select
              v-model="domainMes.openBank"
              placeholder="请选择银行卡信息"
              style="width: 100%"
            >
              <el-option
                v-for="openBank in openBanks"
                :key="openBank.dictValue"
                :label="openBank.dictName"
                :value="openBank.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行卡号：" prop="walletNo">
            <el-input
              v-model="domainMes.walletNo"
              placeholder="请输入银行卡号"
              minlength="12"
              maxlength="19"
              style="width: 100%"
            ></el-input>
          </el-form-item>
          <span style="margin-left: 20px">
            <i class="el-icon-delete" @click="to_deleteBank(index2)"></i>
          </span>
        </el-form>
      </el-form-item>
      <div v-if="interactive.startUpload">
        <el-progress
          v-for="(image, index3) in form.resImageLists"
          :key="index3"
          :percentage="percentates[index3]"
        >
          <span>{{ form.resImageLists }}</span>
        </el-progress>
      </div>
      <aside-tip content="店铺负责人信息" />
      <el-form-item label="负责人姓名：" prop="fullName">
        <el-input
          v-model="form.fullName"
          maxlength="20"
          style="width: 50%"
          placeholder="请输入负责人姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="负责人手机号：" prop="mobile">
        <el-input
          v-model="form.mobile"
          maxlength="11"
          style="width: 50%"
          placeholder="请输入负责人手机号"
        ></el-input>
      </el-form-item>
      <aside-tip content="店铺登录账号" />
      <el-form-item label="登录账号：" prop="loginMobile">
        <el-input
          v-model="form.loginMobile"
          maxlength="11"
          style="width: 50%"
          placeholder="登录账号为手机号"
        ></el-input>
        <label style="margin-left: 50px">默认密码是dp888888</label>
      </el-form-item>
      <aside-tip content="数字人民币收款账户信息">
        <span slot="aleft">
          <el-button size="mini" @click="onIncrease">添加</el-button>
        </span>
      </aside-tip>
      <el-form-item
        v-for="(domain, index4) in form.storeWalletDcList"
        :key="index4"
      >
        <el-form
          ref="domainForm"
          :model="domain"
          :rules="domains"
          label-width="10rem"
          class="rmb_account"
        >
          <triangle-label :content="'账户' + changeNumToHan(index4 + 1)">
            <span slot="triangle-left" />
          </triangle-label>
          <el-form-item label="开户行信息：" prop="openBank">
            <el-select
              v-model="domain.openBank"
              placeholder="请选择开户行"
              style="width: 100%"
            >
              <el-option
                v-for="openBank in openBanks"
                :key="openBank.dictValue"
                :label="openBank.dictName"
                :value="openBank.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="钱包编号：" prop="walletNo">
            <el-input
              v-model="domain.walletNo"
              placeholder="请输入开通的数字人民币钱包编号"
              maxlength="16"
              style="width: 100%"
            ></el-input>
          </el-form-item>
          <span style="margin-left: 20px">
            <i class="el-icon-delete" @click="to_deleteInfo(index4)"></i>
          </span>
        </el-form>
      </el-form-item>
      <div class="bottom_div">
        <el-button
          type="primary"
          :loading="interactive.loading"
          :disabled="interactive.loading"
          @click="to_EditOrAddStore()"
          >保存</el-button
        >
        <el-button @click="reset()">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import TriangleLabel from "@/template/triangleLabel/index";
import { mapGetters } from "vuex";
import { allStoreType } from "@/api/store/storeType";
import {
  findStore,
  getStoreOpenBank,
  editStore,
  addStore,
  getSaleChannel,
  getMachinesStatus,
} from "@/api/store/store";
import { getTaskByMobile } from "@/api/task/list";

import upload from "@/components/Upload-File/upload";
// import maps from 'qqmap'
// 引入地区查询接口
import { getAreaNationwideTree } from "@/api/area";
import { getDistrictList } from "@/api/commerce/commerce";
import AsideTip from "@/template/aside/index";

import { getLicense } from "@/api/upload";

import { getUploadImageParams } from "@/api/upload";

// import COS from 'cos-js-sdk-v5'
import { v4 as uuidv4 } from "uuid";

import { formatStartTime } from "@/util/date";

export default {
  components: {
    upload,
    AsideTip,
    TriangleLabel,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    // 固定电话号码验证
    var validateTel = (rule, value, callback) => {
      console.debug("固定电话号码验证", value, this.form.phone);
      const TEL_REG = /^(0\d{2,3})-?(\d{7,8})$/;
      if (!this.form.phone) {
        if (!this.form.phoneCode) {
          callback(new Error("请填写区号!"));
        }
        if (!value) {
          callback(new Error("电话号码不能为空！"));
        }
        const tel = this.form.phoneCode + "-" + value;
        if (!TEL_REG.test(tel)) {
          callback(new Error("电话号码格式错误！"));
        }
        callback();
      } else {
        callback();
      }
    };
    // 手机号验证
    var validatePhone = (rule, value, callback) => {
      console.debug("手机号验证", value, this.form.contactTel);
      const PHONO_REG =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!this.form.contactTel) {
        if (!value) {
          callback(new Error("手机号码不能为空！"));
        }
        if (!PHONO_REG.test(value)) {
          callback(new Error("手机号码格式错误！"));
        }
        callback();
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      const PHONO_REG =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!value) {
        callback(new Error("手机号码不能为空！"));
      }
      if (!PHONO_REG.test(value)) {
        callback(new Error("手机号码格式错误！"));
      }
      callback();
    };
    var validateLoginMobile = (rule, value, callback) => {
      const PHONO_REG =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!value) {
        callback(new Error("手机号码不能为空！"));
      }
      if (!PHONO_REG.test(value)) {
        callback(new Error("手机号码格式错误！"));
      }
      callback();
    };
    return {
      // 省市区联动
      locationNameList: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            const query = {
              parentId: parentId,
              lazy: true,
            };
            getAreaNationwideTree(query).then((res) => {
              const areaList = res.data.data;

              const list = areaList.filter((iten) => {
                return iten.id !== 100000;
              });

              const nodes = Array.from(list).map((item) => ({
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
      //地图数据
      mapData: {
        //中心坐标
        center: { lng: 0, lat: 0 },
        //缩放级别
        zoom: 14,
      },
      saleChannelLists: [],
      interactive: {
        startUpload: false,
        loading: false,
      },
      percentates: [],
      storeTypes: [],
      openBanks: [],
      resImgLists: [],
      resImageLists: [],
      BMap: null,
      map: null,
      mk: "",
      sellerName: "",
      phoneCode: undefined, //电话号码区号
      storeId: undefined,
      form: {
        districtId: undefined,
        address: undefined,
        contactTel: undefined, //门店联系电话（固定电话)
        businessLicense: undefined,
        businessLicenseImage: undefined,
        businessLicenseNo: undefined,
        endTime: undefined,
        fullName: undefined, //负责人姓名
        checkedCities: [],
        lat: 28.1127,
        lng: 112.98991,
        location: undefined,
        loginMobile: undefined, //店铺登录账号-手机号码
        // mainImage: undefined, //店铺主图URL
        mobile: undefined,
        phone: undefined, //门店联系手机号码
        resList: [], //店铺图片URL
        // sellerId: undefined,
        startTime: undefined,
        // status: undefined,
        // 商户设立时间
        registrationDate: "",
        // 商户主营业务简介
        businessScope: "",
        storeWalletDcList: [
          {
            openBank: undefined,
            walletNo: undefined,
          },
        ],
        storeBankList: [
          {
            openBank: undefined,
            walletNo: undefined,
          },
        ],
        storeName: undefined,
        storeType: undefined,
        posStatus: undefined,
        paymentCodeStatus: undefined,
      },
      parameter: {
        districtName: undefined,
      },
      businessArr: [],
      rules: {
        districtId: [
          { required: true, message: "请选择商圈", trigger: "change" },
        ],
        storeType: [
          { required: true, message: "请选择店铺类型", trigger: "blur" },
        ],
        storeName: [
          { required: true, message: "请输入店铺名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 30 个字符",
            trigger: "blur",
          },
        ],
        businessLicense: [
          { required: true, message: "请输入营业执照名称", trigger: "blur" },
        ],
        businessLicenseNo: [
          { required: true, message: "请输入营业执照编号", trigger: "blur" },
        ],
        checkedCities: [
          { required: true, message: "请选择销售渠道", trigger: "blur" },
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: "blur" },
        ],
        startTime: [{ required: true, message: "请选择时间", trigger: "blur" }],
        endTime: [{ required: true, message: "请选择时间", trigger: "change" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        location: [
          { required: true, message: "请选择省市区", trigger: "change" },
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        posStatus: {
          required: true,
          message: "请选择POS机状态",
          trigger: "blur",
        },
        paymentCodeStatus: {
          required: true,
          message: "请选择聚合码状态",
          trigger: "blur",
        },
        fullName: [
          { required: true, message: "请输入负责人姓名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 30 个字符",
            trigger: "blur",
          },
        ],
        loginMobile: [
          { required: true, validator: validateLoginMobile, trigger: "blur" },
        ],

        contactTel: [
          { required: true, validator: validateTel, trigger: "blur" },
        ],
        registrationDate: [
          { required: true, message: "请选择商户设立时间", trigger: "blur" },
        ],
        businessScope: [
          { required: true, message: "请填写主营业务简介", trigger: "blur" },
        ],
      },
      domains: {
        openBank: [
          { required: true, message: "请选择开户行信息", trigger: "change" },
        ],
        walletNo: [
          { required: true, message: "请输入钱包编号", trigger: "blur" },
        ],
      },
      domainsMes: {
        openBank: [
          { required: true, message: "请选择银行卡信息", trigger: "change" },
        ],
        walletNo: [
          { required: true, message: "请输入银行卡号", trigger: "blur" },
          {
            min: 12,
            max: 19,
            message: "长度在 12 到 19 个字符",
            trigger: "blur",
          },
        ],
      },
      files: [], // 文件列表
      fileTypes: ["image/jpeg", "image/webp", "image/png", "image/jpg"],
      showUpload: true,
      uploadParams: [],
      uploadParam: {},
      uploadCount: 0,
      // 邀请人列表
      inviterUserList: [],
      // 机具在状态列表
      machinesStatus: [],
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  async created() {
    this.getSaleChannel();
    if (this.$route.params.id) {
      this.storeId = this.$route.params.id;
      this.$nextTick(() => {
        this.getStoreDetail();
      });
    } else {
      // 如果为新增进入 获取邀请人列表
      getTaskByMobile({
        size: "50",
      }).then((res) => {
        this.inviterUserList = res.data.data.records;
      });
    }
    this.getDistrictList();
    this._getMachinesStatus();
  },
  mounted() {
    allStoreType().then((res) => {
      this.storeTypes = res.data.data;
    });
    getStoreOpenBank().then((res) => {
      this.openBanks = res.data.data;
    });
  },
  methods: {
    // 地图初始化回调
    async onReady({ BMap, map }) {
      // if (this.$route.params.id) {
      //   //可以在此处请求接口获取坐标数据
      //   await this.getStoreDetail()
      // }
      //保存百度地图类
      this.BMap = BMap;
      //保存地图对象
      this.map = map;
      //如果一开始坐标存在(编辑的时候)
      if (this.form.lng && this.form.lat) {
        //设置坐标
        this.mapData.center.lng = this.form.lng;
        this.mapData.center.lat = this.form.lat;
      } else {
        //如果坐标不存在则动态获取当前浏览器坐标（创建的时候）
        let geolocation = new BMap.Geolocation();
        //获取当前的坐标（使用promise 将异步转换为同步）
        await new Promise((resolve) => {
          geolocation.getCurrentPosition((r) => {
            this.mapData.center.lng = this.form.lng = r.point.lng;
            this.mapData.center.lat = this.form.lat = r.point.lat;
            resolve();
          });
        });
      }
      //创建定位标记
      let marker = new BMap.Marker(
        new BMap.Point(this.form.lng, this.form.lat)
      );
      //将标记添加到地图上
      map.addOverlay(marker);
    },

    toUpperCaseUUID(type) {
      let suffix = type.split("/").pop();
      return (
        "image/" +
        formatStartTime(new Date()) +
        "/" +
        new Date().getTime() +
        "_" +
        uuidv4().replace(/-/g, "").toUpperCase() +
        "." +
        suffix
      );
    },

    handleFileChange1(file) {
      this.handleFileChange(file);
    },
    handleFileChange2(file) {
      this.handleFileChange(file);
    },
    // 添加需要上传的文件
    async handleFileChange(file) {
      let _this = this;
      console.log(file);
      // 创建COS实例  获取签名
      //这里写你们后端提供的请求接口即可
      var COS = require("cos-js-sdk-v5");
      getUploadImageParams().then((res) => {
        const data = res.data.data;
        const cos = new COS({
          // 必选参数
          getAuthorization: (options, callback) => {
            const obj = {
              TmpSecretId: data.tmpSecretId,
              TmpSecretKey: data.tmpSecretKey,
              XCosSecurityToken: data.sessionToken,
              StartTime: data.startTime,
              ExpiredTime: data.expiredTime,
              expiration: data.expiration,
              requestId: data.requestId,
            };
            callback(obj);
          },
        });
        // 上传图片  其中Bucket 和 Region找你们负责人拿
        //key 在前面加上路径写法可以生成文件夹
        cos.putObject(
          {
            Bucket: data.bucket /* 必须 */,
            Region: data.region /* 存储桶所在地域，必须字段 */,
            Key: _this.toUpperCaseUUID(file.file.type) /* 必须 */,
            StorageClass: "STANDARD",
            Body: file.file, // 上传文件对象
            // 文件权限设置
            ACL: "public-read",
            onHashProgress: (progressData) => {
              console.log("校验中", JSON.stringify(progressData));
            },
            onProgress: (progressData) => {
              console.log("上传中", JSON.stringify(progressData));
            },
          },
          (err, data) => {
            if (data.statusCode == 200) {
              file.status = "success";
              let url = "https://" + data.Location;

              // _this.imgURL.push(url)
              // 将数据插入到文件中
              _this.files.push({ url: url, uid: file.file.uid });

              _this.showUpload = !(_this.files.length >= _this.limit);
              // 父组件获取imgURL值便可

              _this.form.businessLicenseImage = url;

              let query = {
                imageUrl: url,
              };
              getLicense(query)
                .then((response) => {
                  console.log("response", response.data.data);
                  _this.form.businessLicense = response.data.data.name;
                  _this.form.businessLicenseNo = response.data.data.regNum;
                  _this.files = [file];
                  _this.uploadCount = 0;
                })
                .catch((e) => {
                  console.error("=>", e);
                });
            }
          }
        );
      });
    },

    // 获取凭证
    async getUploadParams() {
      await getUploadImageParams(this.files.length).then((response) => {
        this.uploadParams = response.data.data;
        this.setFilesAndUpload();
      });
    },
    // 文件上传
    setFilesAndUpload() {
      this.files.forEach((file, index) => {
        const param = this.uploadParams[index];
        // 判断如果是网络图片则不获取凭证
        if (file.raw) {
          this.initSdkAndUpload(file.raw, param);
        } else {
          this.uploadParams[index].imageURL = file.url;
        }
      });
    },

    // 上传图片
    baseupload(file) {
      console.log("file", file.imageURL);
      if (file) {
        this.form.businessLicenseImage = file.imageURL;
        console.log("imageURL", file.imageURL);
        if (file.imageURL) {
          let query = {
            imageUrl: file.imageURL,
          };
          getLicense(query)
            .then((response) => {
              console.log("response", response.data.data);
              this.form.businessLicense = response.data.data.name;
              this.form.businessLicenseNo = response.data.data.regNum;
            })
            .catch((e) => {
              console.error("=>", e);
            });
        }
      }
    },
    // 查询销售渠道
    getSaleChannel() {
      getSaleChannel().then((res) => {
        this.saleChannelLists = res.data.data;
      });
    },
    // 获取店铺详情
    getStoreDetail() {
      console.debug("店铺详情");
      findStore(this.storeId).then((res) => {
        // 图片回显
        console.debug(res.data.data.resList, "res.data.data.resList");
        this.$refs.upload.loadImg(res.data.data.resList);
        const temp = res.data.data;
        let data = {};

        data = {
          districtId: temp.districtId,
          address: temp.address,
          contactTel: temp.contactTel, //门店联系电话（固定电话)
          businessLicense: temp.businessLicense,
          businessLicenseImage: temp.businessLicenseImage,
          businessLicenseNo: temp.businessLicenseNo,
          endTime: temp.endTime,
          fullName: temp.fullName, //负责人姓名
          lat: temp.lat,
          lng: temp.lng,
          loginMobile: temp.loginMobile, //店铺登录账号-手机号码
          // mainImage: undefined, //店铺主图URL
          mobile: temp.mobile,
          phone: temp.phone, //门店联系手机号码
          resList: temp.resList, //店铺图片URL
          // sellerId: undefined,
          startTime: temp.startTime,
          // status: undefined,
          // 商户设立时间
          registrationDate: temp.registrationDate,
          // 商户主营业务简介
          businessScope: temp.businessScope,
          storeBankList: temp.storeBankList,
          storeName: temp.storeName,
          storeType: temp.storeType,
          posStatus: temp.posStatus,
          paymentCodeStatus: temp.paymentCodeStatus,
        };
        data.location = temp.location.split(",").map(Number);
        data.checkedCities = temp.saleChannel.split(",");
        let storeWalletDcList = [];
        temp.storeWalletDcList.map((item) => {
          storeWalletDcList.push({
            openBank: item.openBank,
            walletNo: item.walletNo,
          });
        });
        data.storeWalletDcList = storeWalletDcList;
        // 获取邀请人列表 回显邀请人
        if (this.form.inviteUser && this.form.inviteUser.userId) {
          this.userRemoteMethod(this.form.inviteUser.username);
          this.form.inviterUser = this.form.inviteUser.userId;
        }
        // this.form = Object.assign({}, temp);
        this.form = data;
        console.debug("this.form", this.form);
      });
    },
    // 省市区选择事件
    handleChange() {
      this.form.locationName = this.$refs.cascader
        .getCheckedNodes()[0]
        .pathLabels.join("");
      if (this.form.locationCode) {
        this.form.location = this.form.locationCode.join();
      }
      // this.$refs.form.validateField("address");
      // this.getAddressResolution(this.form.locationName)
    },

    // 8-1、地址搜索
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
    // 8-2、选择地址
    handleAddress(item) {
      this.form.address = item.title;
      this.form.lat = item.point.lat;
      this.form.lng = item.point.lng;
      this.map.clearOverlays();
      this.mk = new this.BMap.Marker(item.point);
      this.map.addOverlay(this.mk);
      this.map.panTo(item.point);
    },

    // 去删除收款信息
    to_deleteInfo(index) {
      this.form.storeWalletDcList.splice(index, 1);
    },
    // 去删除银行卡信息
    to_deleteBank(index) {
      this.form.storeBankList.splice(index, 1);
    },
    // 去编辑
    to_EditStore() {
      this.form.resList = this.$refs.upload.imgURL;
      this.form.saleChannel = this.form.checkedCities.toString();
      this.form.storeId = this.storeId;
      editStore(this.form)
        .then(() => {
          this.interactive.loading = false;
          this.$message.success("修改成功");
          this.$router.go(-1);
        })
        .catch(() => {
          this.form.location = this.form.location.split(",").map(Number);
          this.interactive.loading = false;
        });
    },
    // 去添加
    to_AddStore() {
      this.form.resList = this.$refs.upload.imgURL;
      this.form.saleChannel = this.form.checkedCities.toString();
      console.debug("this.form", this.form);
      addStore(this.form)
        .then(() => {
          this.interactive.loading = false;
          this.$message.success("添加成功");
          this.$router.go(-1);
        })
        .catch(() => {
          this.form.location = this.form.location.split(",").map(Number);
          this.interactive.loading = false;
        });
    },
    // 去添加或编辑店铺
    async to_EditOrAddStore() {
      console.log(this.form);
      if (typeof this.form.location !== String && this.form.location) {
        this.form.location = this.form.location.join(",");
      }
      this.interactive.loading = true;
      // 数字钱包校验
      if (
        this.form.storeWalletDcList &&
        this.form.storeWalletDcList.length > 0
      ) {
        const arr = this.form.storeWalletDcList;
        for (let index = 0; index < arr.length; index++) {
          this.$refs.domainForm[index].validate((valid2) => {
            if (!valid2) {
              this.interactive.loading = false;
              return;
            }
          });
        }
      }
      if (this.form.storeBankList && this.form.storeBankList.length > 0) {
        // 银行卡校验
        const arr2 = this.form.storeBankList;
        for (let index = 0; index < arr2.length; index++) {
          this.$refs.domainFormMes[index].validate((valid3) => {
            if (!valid3) {
              this.interactive.loading = false;
              return;
            }
          });
        }
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          setTimeout(() => {
            // 数字人民币判断空
            for (let i in this.form.storeWalletDcList) {
              if (
                !this.form.storeWalletDcList[i].openBank ||
                !this.form.storeWalletDcList[i].walletNo
              ) {
                return;
              }
            }
            // 银行卡信息判断空
            for (let i in this.form.storeBankList) {
              if (
                !this.form.storeBankList[i].openBank ||
                !this.form.storeBankList[i].walletNo
              ) {
                return;
              }
            }
            if (this.isEdit) {
              this.to_EditStore();
            } else {
              this.to_AddStore();
            }
          }, 2000);
        } else {
          if (this.form.location) {
            this.form.location = this.form.location.split(",").map(Number);
            this.interactive.loading = false;
          }
        }
      });
    },
    // 重置
    reset() {
      this.$refs.form.resetFields();
      this.$router.go(-1);
    },
    // 获取商圈列表
    getDistrictList() {
      const data = {
        districtName: this.parameter.districtName,
      };
      getDistrictList(data).then((res) => {
        console.debug("res", res);
        this.businessArr = res.data.data;
      });
    },
    remoteMethod(e) {
      this.parameter.districtName = e;
      this.getDistrictList();
    },
    // 添加开户行
    onIncrease() {
      this.form.storeWalletDcList.push({
        openBank: undefined,
        walletNo: undefined,
        key: Date.now(),
      });
    },
    // 添加店铺银行卡
    onIncreaseBank() {
      this.form.storeBankList.push({
        openBank: undefined,
        walletNo: undefined,
        key: Date.now(),
      });
    },
    // 获取机具状态
    _getMachinesStatus() {
      getMachinesStatus().then((res) => {
        console.debug("res", res);
        this.machinesStatus = res.data.data;
      });
    },
    // 将数字转汉字显示
    changeNumToHan(num) {
      const arr1 = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var arr2 = ["", "十", "百", "千", "万", "十", "百", "千", "亿"]; //可继续追加更高位转换值
      if (!num || isNaN(num)) {
        return "零";
      }
      var english = num.toString().split("");
      var result = "";
      for (var i = 0; i < english.length; i++) {
        var des_i = english.length - 1 - i; //倒序排列设值
        result = arr2[i] + result;
        var arr1_index = english[des_i];
        result = arr1[arr1_index] + result;
      }
      //将【零千、零百】换成【零】 【十零】换成【十】
      result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十");
      //合并中间多个零为一个零
      result = result.replace(/零+/g, "零");
      //将【零亿】换成【亿】【零万】换成【万】
      result = result.replace(/零亿/g, "亿").replace(/零万/g, "万");
      //将【亿万】换成【亿】
      result = result.replace(/亿万/g, "亿");
      //移除末尾的零
      result = result.replace(/零+$/, "");
      //将【零一十】换成【零十】
      //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
      //将【一十】换成【十】
      result = result.replace(/^一十/g, "十");
      return result;
    },
    // 邀请人远程搜索
    userRemoteMethod(keyword) {
      getTaskByMobile({
        size: "50",
        keyword,
      }).then((res) => {
        this.inviterUserList = res.data.data.records;
      });
    },
  },
};
</script>
<style scoped lang="scss">
.business {
  background-color: white;
  overflow-y: auto;
  margin: 10px 20px;
  padding: 30px 10px 60px;
  .map {
    width: 100%;
    height: 300px;
    background-color: #000;
  }
}
.el-alert {
  margin-bottom: 20px;
}
.el-alert__title.is-bold {
  font-weight: 400;
}
.el-alert-right {
  position: absolute;
  top: 7px;
  right: 15px;
}
.tips {
  color: #80002a;
}
.bottom_div {
  position: fixed;
  bottom: 0px;
  width: 75%;
  height: 50px;
  /* left: 50%; */
  border: 1px solid #999;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo-ruleForm {
  margin-bottom: 100px;
}
.rmb_account {
  display: flex;
  margin-left: -8rem;
}
.el-form-item__content {
  .el-col {
    margin-bottom: 0;
    .el-form-item {
      margin-bottom: 0;
    }
  }
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
</style>
