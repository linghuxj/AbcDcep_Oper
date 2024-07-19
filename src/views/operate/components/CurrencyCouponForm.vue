<template>
  <div class="">
    <el-dialog
      :title="isEdit ? '查看消费券' : '新增消费劵'"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="form" label-width="200px" :rules="rules">
        <el-form-item label="活动名称：" prop="couponName">
          <el-input
            v-model="form.couponName"
            placeholder="请输入活动的名称"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动背景图：" prop="actImage">
          <upload
            ref="addUpload"
            v-model="form.actImage"
            type="content"
            :limit="1"
            :multiple="true"
            :auto-upload="false"
            type-name="conten"
          />
        </el-form-item>
        <el-form-item label="领劵周期：" required>
          <el-col style="width: 230px" :span="3">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="开始日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                :picker-options="pickerOptionsStart"
              />
            </el-form-item>
          </el-col>
          <el-col style="width: 40px; text-align: center" :span="1">至</el-col>
          <el-col style="width: 230px" :span="3">
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                :picker-options="pickerOptionsEnd"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="使用有效期：" prop="radioType">
          <el-radio-group v-model="form.radioType">
            <el-radio :label="1">
              <span>日期范围</span>
              <el-date-picker
                v-model="form.validStartTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                :disabled="form.radioType != 1"
                :picker-options="pickervalidStart"
                default-time="23:59:59"
              >
              </el-date-picker>
              <span>至</span>
              <el-date-picker
                v-model="form.validEndTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                :disabled="form.radioType != 1"
                :picker-options="pickervalidEnd"
                default-time="23:59:59"
              >
              </el-date-picker>
            </el-radio>
            <el-radio :label="0">
              <span>固定天数</span>
              <el-input
                placeholder="请输入内容"
                v-model="form.validDays"
                type="number"
                maxlength="10"
                :disabled="form.radioType != 0"
              >
                <template slot="append">天</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="互斥：" prop="marketingUsable">
          <el-radio-group v-model="form.marketingUsable">
            <el-radio :label="1">与营销活动互斥</el-radio>
            <el-radio :label="0">与营销活动不互斥</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则：" prop="couponDesc">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="最多1000字"
            v-model="form.couponDesc"
            maxlength="1000"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="to_save('ruleForm')">
          保存
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import upload from "@/components/Upload-File/upload";
import { addCoupon } from "@/api/operate/currencyCoupon";
import { getCouponDetailById, editCoupon } from "@/api/coupon/coupon";
import { getHour, getMinute, getSecond } from "@/util/date";
export default {
  components: { upload },
  data() {
    return {
      // 领劵周期开始时间
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.form.endTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          } else {
            return time.getTime() < new Date(new Date().toLocaleDateString());
          }
        },
      },
      // 领劵周期结束时间
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.form.startTime;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime();
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        },
      },
      // 使用有效期
      pickervalidStart: {
        disabledDate: (time) => {
          const endDateVal = this.form.validEndTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          } else {
            return time.getTime() < new Date(new Date().toLocaleDateString());
          }
        },
      },
      // 使用有效期
      pickervalidEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.form.validStartTime;
          const endTime = this.form.endTime;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime();
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        },
      },
      dialogVisible: false,
      isEdit: false,
      form: {
        couponName: null,
        actImage: null,
        startTime: null,
        endTime: null,
        validStartTime: null,
        validEndTime: null,
        validDays: null,
        marketingUsable: 1,
        radioType: 1,
      },
      radio: 1,
      couponId: null,
      rules: {
        couponName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        actImage: [
          { required: true, message: "请上传活动背景图", trigger: "change" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        radioType: [
          {
            required: true,
            message: "请至少选择一个使用有效期",
            trigger: "change",
          },
        ],
        marketingUsable: [
          { required: true, message: "请至少选择一个互斥", trigger: "change" },
        ],
        couponDesc: [
          { required: true, message: "请填写规则", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 新增
    open() {
      this.dialogVisible = true;
    },
    // 查看
    checklist(couponId) {
      (this.form = {
        couponName: null,
        actImage: null,
        startTime: null,
        endTime: null,
        validStartTime: null,
        validEndTime: null,
        validDays: null,
        marketingUsable: 1,
        radioType: 1,
      }),
        (this.isEdit = true);
      this.couponId = couponId;
      this.dialogVisible = true;
      getCouponDetailById(couponId).then((res) => {
        this.form = { ...res.data.data };
        this.$refs.addUpload.fileList = [];
        this.$refs.addUpload.loadImg(res.data.data.actImage);
        // 互斥
        if (res.data.data.marketingUsable) {
          this.form.marketingUsable = 1;
        } else {
          this.form.marketingUsable = 0;
        }
        // 对使用有效期进行处理
        if (res.data.data.validDays) {
          this.form.radioType = 0;
        } else {
          this.form.radioType = 1;
        }
      });
    },
    to_save(ruleForm) {
      if (this.isEdit) {
        this.dialogVisible = false;
        return;
      }
      if (this.form.actImage) {
        this.form.actImage = this.form.actImage.join("");
      }
      console.debug("this.form.actImage", this.form.actImage);
      if (this.form.radioType === 1) {
        if (!this.form.validStartTime) {
          this.$message.warning("使用有效期的开始时间未填写");
          return;
        }
        if (!this.form.validEndTime) {
          this.$message.warning("使用有效期的结束时间未填写");
          return;
        }
        this.form.validDays = null;
      } else if (this.form.radioType === 0) {
        if (!this.form.validDays) {
          this.$message.warning("请填写固定天数");
          return;
        }
        this.form.startTime = null;
        this.form.endTime = null;
      }
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          addCoupon(this.form)
            .then((res) => {
              console.debug("res", res);
              this.$message.success("添加成功");
              this.dialogVisible = false;
              this.$emit("getCouponList", true);
            })
            .catch((error) => {
              console.debug(error);
              this.dialogVisible = false;
            });
        }
        // if(this.couponId){
        //   this.form.couponId = this.couponId
        //   editCoupon(this.form)
        //   .then((res) => {
        //     console.debug("res", res);
        //     this.$message.success("修改成功");
        //     this.dialogVisible = false;
        //     this.$emit("getCouponList", true);
        //   })
        //   .catch((error) => {
        //     console.debug(error);
        //     this.dialogVisible = false;
        //   });
        //   }
        // }else{
        //   addCoupon(this.form)
        //   .then((res) => {
        //     console.debug("res", res);
        //     this.$message.success("添加成功");
        //     this.dialogVisible = false;
        //     this.$emit("getCouponList", true);
        //   })
        //   .catch((error) => {
        //     console.debug(error);
        //     this.dialogVisible = false;
        //   });
        //   }
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 时间
    pickerTimeStart() {
      const time = getHour() + ":" + getMinute() + ":" + getSecond();
      return time;
    },
  },
};
</script>
<style scoped>
::v-deep .el-radio {
  margin-bottom: 10px;
}
</style>
