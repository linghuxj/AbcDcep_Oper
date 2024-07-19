<template>
  <div class="business">
    <div v-if="isEdit">
      <el-form ref="editForm" :model="editForm" :rules="editRules">
        <el-form-item label="优惠券名称：" prop="couponName">
          <el-input
            v-model="editForm.couponName"
            maxlength="64"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用有效期：" prop="period">
          <el-radio-group v-model="editForm.period" @change="changePeriod">
            <el-radio label="0" :disabled="editForm.period === '1'">
              日期范围
              <el-date-picker
                v-model="editForm.date"
                :disabled="editForm.period === '1'"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                :default-time="pickerTimeStart()"
              >
              </el-date-picker>
            </el-radio>
            <el-radio label="1" :disabled="editForm.period === '0'">
              固定天数<el-input
                v-model.number="editForm.validDays"
                :disabled="editForm.period === '0'"
                placeholder="领取后到期天数"
                maxlength="5"
              ></el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel()">取消</el-button>
          <el-button
            type="primary"
            :disabled="bLoading"
            :loading="bLoading"
            @click="handleEditCoupon"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div v-else>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <!-- <el-form-item label="优惠券类型：" prop="couponTypeId">
          <el-select
            v-model="form.couponTypeId"
            placeholder="请选择优惠券类型"
            style="width: 300px"
            @change="select_coupon()"
          >
            <el-option
              v-for="type in couponTypes"
              :key="type.typeId"
              :label="type.typeName"
              :value="type.typeId"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="关联类型：" prop="relationType">
          <el-select
            v-model="form.relationType"
            placeholder="请选择关联类型："
            style="width: 300px"
            @change="select_coupon()"
          >
            <el-option
              v-for="(type, index) in relationTypeList"
              :key="index"
              :label="type.dictName"
              :value="type.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称：" prop="couponName">
          <el-input
            v-model="form.couponName"
            maxlength="64"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用平台：" prop="platform">
          <el-select
            v-model="form.platform"
            placeholder="请选择平台"
            style="width: 100%"
          >
            <el-option
              v-for="platform in platforms"
              :key="platform.dictValue"
              :label="platform.dictName"
              :value="platform.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.discountType == 'reduction'"
          label="面额："
          prop="amount"
        >
          <el-input
            v-model="form.amount"
            placeholder="请输入面额"
            maxlength="8"
            oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
          ></el-input>
        </el-form-item>
        <el-form-item label="发行量：" prop="quotaStatus">
          <el-radio-group v-model="form.quotaStatus">
            <el-radio label="-1">无限制</el-radio>
            <el-radio label="0">
              <el-input
                v-model.number="form.quota"
                placeholder="大于等于0的正整数"
                :disabled="form.quotaStatus === '-1'"
              >
                <template slot="append">张</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="每人限领：" prop="limitPerPersonNumber">
          <div>
            总限制
            <el-input
              v-model.number="form.totalLimitNumber"
              placeholder="大于等于0的正整数，0为不限制"
              maxlength="5"
              style="width: 200px; margin-bottom: 18px"
            >
              <template slot="append">张</template>
            </el-input>
          </div>
          <div>
            每天限制
            <el-input
              v-model.number="form.limitPerPersonNumber"
              placeholder="大于等于0的正整数，0为不限制"
              maxlength="5"
              style="width: 200px"
            >
              <template slot="append">张</template>
            </el-input>
            <span>总限制数需要大于等于每天限制数</span>
          </div>
        </el-form-item>
        <el-form-item label="使用门槛：" prop="withAmountRadio">
          <el-radio-group v-model="form.withAmountRadio">
            <el-radio label="-1">无限制</el-radio>
            <el-radio label="0">
              满<el-input
                v-model="form.withAmount"
                :disabled="form.withAmountRadio === '-1'"
                maxlength="8"
                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              ></el-input
              >元可用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.discountType == 'discount'"
          label="优惠内容："
          prop="amount"
        >
          <el-input
            v-model="form.amount"
            placeholder="请输入正整数"
            style="width: 200px"
            oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
          >
            <template slot="append">折</template>
          </el-input>
        </el-form-item>
        <el-form-item label="领券周期：" prop="couponDate">
          <el-date-picker
            v-model="form.couponDate"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            :default-time="pickerTimeStart()"
            @change="couponDateChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用有效期：" prop="period">
          <el-radio-group v-model="form.period" @change="changePeriod">
            <el-radio label="0" style="margin-bottom: 18px">
              日期范围
              <el-date-picker
                v-model="form.date"
                :disabled="form.period === '1'"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                :default-time="pickerTimeStart()"
              >
              </el-date-picker>
            </el-radio>
            <el-radio label="1">
              固定天数<el-input
                v-model.number="form.validDays"
                :disabled="form.period === '0'"
                placeholder="领取后到期天数"
                maxlength="5"
              ></el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则说明：" prop="couponDesc">
          <el-input
            v-model="form.couponDesc"
            type="textarea"
            maxlength="1000"
            rows="5"
            show-word-limit
          ></el-input>
        </el-form-item>
        <aside>关联信息</aside>
        <!-- 
        platform 平台券
        store    商户券
        goods  商品券
        business 商圈券 -->
        <el-form-item
          v-if="form.relationType === 'platform'"
          label="区域限制："
        >
          <div>
            <el-cascader
              ref="cascader"
              v-model="form.areaCodeList"
              :props="locationNameList"
              placeholder="请选择省/市/县区"
              clearable
              style="width: 100%"
              @change="select_change"
            ></el-cascader>
          </div>
        </el-form-item>
        <!-- 商品 -->
        <discount-add-goods
          v-if="form.relationType === 'goods'"
          ref="goods"
        ></discount-add-goods>
        <!-- 门店 -->
        <discount-add-store
          v-if="form.relationType === 'store'"
          ref="store"
        ></discount-add-store>
        <!-- 商圈 -->
        <discount-add-bussiness
          v-if="form.relationType === 'business_district'"
          ref="business"
        ></discount-add-bussiness>
        <el-form-item style="margin-top: 10px">
          <el-button @click="cancel()">取消</el-button>
          <el-button
            type="primary"
            :disabled="bLoading"
            :loading="bLoading"
            @click="handleAddCoupon"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getHour, getMinute, getSecond } from "@/util/date";
import { allCouponTypes } from "@/api/coupon/couponType";
import { getTypesRelation } from "@/api/coupon/coupon";
import {
  getCouponPlatform,
  addCoupon,
  getCouponDetailById,
  editCoupon,
} from "@/api/coupon/coupon";
// 引入地区查询接口
import { areas } from "@/api/area";
// 组件
import DiscountAddGoods from "@/components/Association-Type/Goods.vue";
import DiscountAddStore from "@/components/Association-Type/Store.vue";
import DiscountAddBussiness from "@/components/Association-Type/Bussiness.vue";
import { findTag } from "@/util/deltag";
export default {
  components: { DiscountAddGoods, DiscountAddStore, DiscountAddBussiness },
  data() {
    return {
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          console.debug("level", level, node);
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data;
              console.log("areaList", areaList);
              const nodes = Array.from(areaList).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 1,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      form: {
        discountType: "reduction",
        // couponType: undefined,
        // couponTypeId: undefined,
        relationType: undefined,
        couponName: undefined,
        platform: undefined,
        amount: undefined,
        quota: undefined,
        quotaStatus: "-1", //发行量状态
        limitPerPersonNumber: 0,
        totalLimitNumber: 0,
        withAmountRadio: "-1", //门槛状态
        withAmount: 0,
        period: "0", // 有效期选择
        validDays: undefined,
        date: [],
        couponDate: [],
        couponDesc: undefined,
        areaCodeList: [],
        // 关联关系ID
        relationIds: [],
      },
      editForm: {
        couponName: undefined,
        period: "0", // 有效期选择
        validDays: undefined,
        date: [],
      },
      isEdit: false, //默认是添加
      storeRadio: "1",
      goodsRadio: "1",
      couponId: undefined,
      bLoading: false,
      couponTypes: [],
      platforms: [],
      // 关联类型列表
      relationTypeList: [],
      rules: {
        relationType: [
          {
            required: true,
            message: "优惠券关联类型不能为空",
            trigger: "change",
          },
        ],
        couponName: [
          { required: true, message: "优惠券名称", trigger: "blur" },
        ],
        platform: [
          { required: true, message: "请选择适用平台", trigger: "change" },
        ],
        amount: [
          {
            type: "String",
            required: true,
            validator: (rule, value, callback) => {
              if (this.form.discountType == "discount") {
                if (!value || value === "") {
                  callback(new Error("折扣值不能为空"));
                } else if (value >= 10) {
                  callback(new Error("折扣值需要小于10"));
                } else {
                  callback();
                }
              } else {
                if (!value || value === "") {
                  callback(new Error("面额不能为空"));
                } else if (
                  value.indexOf(".") != -1 &&
                  value.split(".").length > 2
                ) {
                  callback(new Error("请输入正确格式")); //防止输入多个小数点
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
        // 发行量
        quotaStatus: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请选择发行量方式"));
              } else if (value !== "-1") {
                if (!this.form.quota) {
                  callback(new Error("发行量不能为空"));
                } else if (!Number.isInteger(this.form.quota)) {
                  callback(new Error("请输入数字值"));
                } else if (parseInt(this.form.quota) <= 0) {
                  callback(new Error("需输入大于0的正整数"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        // 每人限领
        limitPerPersonNumber: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("每人限领限制值不能为空"));
              } else if (
                !Number.isInteger(value) ||
                !Number.isInteger(this.form.totalLimitNumber)
              ) {
                callback(new Error("请输入数字值"));
              } else if (
                !this.form.totalLimitNumber ||
                this.form.totalLimitNumber <= 0
              ) {
                callback(new Error("总限制值需大于0"));
              } else if (value <= 0) {
                callback(new Error("每人限领限制值需大于0"));
              } else if (this.form.totalLimitNumber < value) {
                callback(new Error("总限制值需大于等于每天限制数"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        // 适用门槛
        withAmountRadio: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请选择适用门槛方式"));
              } else if (value !== "-1") {
                console.debug(
                  "this.form.withAmount",
                  this.form.withAmount,
                  typeof this.form.withAmount
                );
                if (!this.form.withAmount) {
                  callback(new Error("适用门槛不能为空"));
                } else if (
                  this.form.withAmount.indexOf(".") != -1 &&
                  this.form.withAmount.split(".").length > 2
                ) {
                  callback(new Error("请输入正确格式")); //防止输入多个小数点
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        // 有效周期
        couponDate: [
          { required: true, message: "请选择时间", trigger: "change" },
        ],
        // 有效期
        period: [
          {
            required: true,
            validator: (rule, value, callback) => {
              console.log(this.form.couponDate, "有效时间");
              if (!value) {
                callback(new Error("请选择有效期方式"));
              } else if (value === "0") {
                if (!this.form.couponDate || this.form.couponDate.length < 2) {
                  this.form.date = [];
                  callback(new Error("请先选择领券周期"));
                } else if (!this.form.date || this.form.date.length < 2) {
                  callback(new Error("日期范围不能为空"));
                } else if (this.tiemCheck) {
                  callback(
                    new Error("有效期起止时间均不能小于领券周期起止时间")
                  );
                } else {
                  callback();
                }
              } else if (value === "1") {
                if (!this.form.validDays) {
                  callback(new Error("固定天数不能为空"));
                } else if (!Number.isInteger(this.form.validDays)) {
                  callback(new Error("请输入数字值"));
                } else if (this.form.validDays <= 0) {
                  callback(new Error("需输入大于0的正整数"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
        couponDesc: [
          { required: true, message: "规则说明不能为空", trigger: "blur" },
        ],
      },
      editRules: {
        couponName: [
          { required: true, message: "优惠券名称", trigger: "blur" },
        ],
        // 有效期
        period: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请选择有效期方式"));
              } else if (value === "0") {
                if (!this.editForm.date) {
                  callback(new Error("日期范围不能为空"));
                } else {
                  callback();
                }
              } else if (value === "1") {
                if (!this.editForm.validDays) {
                  callback(new Error("固定天数不能为空"));
                } else if (!Number.isInteger(this.editForm.validDays)) {
                  callback(new Error("请输入数字值"));
                } else if (this.editForm.validDays < 0) {
                  callback(new Error("只能输入正整数"));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        },
      },
    };
  },
  computed: {
    tiemCheck() {
      let checkState = true;
      // 获取有效周期时间戳
      let statime1 = new Date(this.form.date[0].replace(/-/g, "/"));
      let endtime1 = new Date(this.form.date[1].replace(/-/g, "/"));
      // 获取领券周期时间戳
      let statime2 = new Date(this.form.couponDate[0].replace(/-/g, "/"));
      let endtime2 = new Date(this.form.couponDate[1].replace(/-/g, "/"));
      if (
        statime1.getTime() < statime2.getTime() ||
        endtime1.getTime() < endtime2.getTime()
      ) {
        checkState = true;
      } else {
        checkState = false;
      }
      return checkState;
    },
  },
  created() {
    this.getCouponTypes();
    this.getPlatform();
    this.getTypesRelation();
    if (this.$route.params.couponId) {
      this.couponId = this.$route.params.couponId;
      this.isEdit = true;
      this.$nextTick(() => {
        this.getCouponDetail();
      });
    }
    if (this.$route.query.discountType) {
      this.form.discountType = this.$route.query.discountType;
    } else {
      this.form.discountType = "reduction";
    }
  },
  methods: {
    // 查询关联关联类型列表
    getTypesRelation() {
      getTypesRelation().then((res) => {
        this.relationTypeList = res.data.data;
        console.debug("relationTypeList", this.relationTypeList);
      });
    },
    select_change() {
      console.debug("select_change", this.form.areaCodeList);
    },
    // 切换周期
    changePeriod() {
      if (this.isEdit) {
        if (this.editForm.period === "1") {
          this.editForm.startTime = undefined;
          this.editForm.endTime = undefined;
          this.editForm.date = undefined;
        } else if (this.editForm.period === "0") {
          this.editForm.validDays = undefined;
        }
      } else {
        if (this.form.period === "1") {
          this.form.startTime = undefined;
          this.form.endTime = undefined;
          this.form.date = undefined;
        } else if (this.form.period === "0") {
          this.form.validDays = undefined;
        }
      }
    },
    // 获取优惠劵详情
    getCouponDetail() {
      console.debug("this.couponId", this.couponId);
      getCouponDetailById(this.couponId).then((res) => {
        this.form = res.data.data;
        let period;
        if (this.form.validDays) {
          period = "1";
        } else if (this.form.startTime && this.form.endTime) {
          period = "0";
        }
        this.editForm = {
          couponName: this.form.couponName,
          period: period, // 有效期选择
          validDays: this.form.validDays,
          date: [this.form.startTime, this.form.endTime],
        };
      });
    },
    // 添加优惠劵
    handleAddCoupon() {
      this.$refs.form.validate((valid) => {
        this.bLoading = true;
        if (valid) {
          // 发行量
          let quota;
          if (this.form.quotaStatus === "-1") {
            quota = -1;
          } else {
            quota = this.form.quota;
          }
          // 适用门槛
          let withAmount;
          if (this.form.withAmountRadio === "-1") {
            withAmount = -1;
          } else {
            if (
              this.form.withAmount * 1 < this.form.amount * 1 &&
              this.form.discountType == "reduction"
            ) {
              this.$message.warning("使用门槛必须大于等于面额");
              this.bLoading = false;
              return;
            }
            withAmount = this.form.withAmount;
          }
          const [startTime, endTime] = this.form.couponDate;
          // 有效期选择
          const params = {
            discountType: this.form.discountType,
            couponName: this.form.couponName,
            platform: this.form.platform,
            amount: this.form.amount,
            quota: quota,
            limitPerPersonNumber: this.form.limitPerPersonNumber,
            totalLimitNumber: this.form.totalLimitNumber,
            withAmount: withAmount,
            couponDesc: this.form.couponDesc,
            startTime: startTime,
            endTime: endTime,
            relationType: this.form.relationType,
          };
          // 有效期
          // console.debug('this.form.period', typeof this.form.period)
          if (this.form.period === "0") {
            const [startTime, endTime] = this.form.date;
            params.validStartTime = startTime;
            params.validEndTime = endTime;
          }
          if (this.form.period === "1") {
            params.validDays = this.form.validDays;
          }
          // 关联
          if (this.form.relationType === "goods") {
            this.form.relationIds = this.$refs.goods.cache;
          } else if (this.form.relationType === "store") {
            this.form.relationIds = this.$refs.store.selectStoreIds;
          } else if (this.form.relationType === "business_district") {
            this.form.relationIds = this.$refs.business.bussinessIDs;
          } else if (this.form.relationType === "platform") {
            const arr = [];
            arr.push(this.form.areaCodeList.toString());
            params.areaCodeList = arr;
          }
          // console.debug('relationIds', this.form.relationIds)
          if (this.form.relationType !== "platform") {
            if (this.form.relationIds.length <= 0) {
              this.$message.warning("请添加关联信息");
              this.bLoading = false;
              return;
            } else {
              params.relationIds = this.form.relationIds;
            }
          }
          addCoupon(params)
            .then(() => {
              setTimeout(() => {
                this.$message.success("添加成功");
                let value = this.$route.fullPath;
                let { tag } = findTag(value);
                this.$store.commit("DEL_TAG", tag);
                this.$router.go(-1);
                this.bLoading = false;
              }, 1000);
            })
            .catch(() => {
              this.bLoading = false;
            });
        } else {
          this.bLoading = false;
        }
      });
    },
    //去编辑
    handleEditCoupon() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.form.couponName = this.editForm.couponName;
          // 有效期
          console.debug("this.form.period", typeof this.form.period);
          if (this.editForm.period === "0") {
            const [validStartTime, validEndTime] = this.editForm.date;
            this.form.validStartTime = validStartTime;
            this.form.validEndTime = validEndTime;
          }
          if (this.editForm.period === "1") {
            this.form.validDays = this.editForm.validDays;
          }
          this.form.couponId = this.couponId;
          this.bLoading = true;
          editCoupon(this.form)
            .then(() => {
              setTimeout(() => {
                this.$message.success("编辑成功");
                this.$router.go(-1);
                this.bLoading = false;
              }, 1000);
            })
            .catch(() => {
              this.bLoading = false;
            });
        }
      });
    },
    // 优惠劵选择监听事件
    select_coupon() {
      console.debug("优惠劵选择监听事件", typeof this.form.couponTypeId);
      for (const i in this.couponTypes) {
        if (this.form.couponTypeId === this.couponTypes[i].typeId) {
          this.form.couponType = this.couponTypes[i].couponType;
        }
      }
      this.form.relationIds = [];
    },
    // 获取优惠劵类型
    getCouponTypes() {
      allCouponTypes().then((res) => {
        this.couponTypes = res.data.data;
      });
    },
    // 获取平台列表
    getPlatform() {
      getCouponPlatform().then((res) => {
        this.platforms = res.data.data;
      });
    },
    //去选择店铺
    to_selectStore() {
      this.$refs.storeRange.show();
    },
    //去选择商品
    to_selectGoods() {
      this.$refs.goodsRange.show();
    },
    // 去选择商圈
    to_selectBussiness() {
      this.$refs.bussinessRange.show();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    cancel() {
      this.$router.go(-1);
    },
    // 时间
    pickerTimeStart() {
      const time = getHour() + ":" + getMinute() + ":" + getSecond();
      return [time];
    },
    // 领券周期改变
    couponDateChange() {
      this.form.date = [];
    },
  },
};
</script>
<style lang="scss">
.business {
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  .el-form-item__content .el-input-group {
    vertical-align: inherit;
  }
  aside {
    background: #eef1f6;
    padding: 8px 24px;
    margin-bottom: 20px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
  }
  .map {
    width: 100%;
    height: 300px;
    background-color: #000;
  }
}
</style>
