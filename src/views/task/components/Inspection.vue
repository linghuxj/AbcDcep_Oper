<template>
  <div>
    <!-- 设置日常巡检 -->
    <el-dialog
      title="设置日常巡检"
      :visible.sync="dailyInspectionDialog"
      width="50%"
      :before-close="closeDailyInspection"
    >
      <el-form :model="daliyForm" :rules="daliyRules" ref="daliyForm">
        <el-form-item
          label="店铺名称："
          prop="storeName"
          v-if="selectStoreIds.length === 0"
        >
          <el-autocomplete
            v-model="daliyForm.storeName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
            :disabled="isEdit"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="">
          <el-radio-group v-model="daliyForm.subType">
            <el-radio-button label="pos">POS机</el-radio-button>
            <el-radio-button label="payment_code">聚合码</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="巡检单价：" prop="taskUnitPrice">
          <el-input
            style="width: 50%"
            v-model="daliyForm.taskUnitPrice"
            maxlength="10"
            placeholder="请输入巡检单价"
            @input="
              daliyForm.taskUnitPrice = asynchronousValidation(
                daliyForm.taskUnitPrice
              )
            "
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="任务周期：" prop="cycle">
          <el-input
            style="width: 50%"
            v-model="daliyForm.cycle"
            maxlength="10"
            placeholder="请输入任务周期"
            @input="daliyForm.cycle = asynchronousValidation(daliyForm.cycle)"
          >
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="巡检周期：" prop="inspectionCycleType">
          <div style="display: flex">
            <!-- String DAY = "day";
            String WEEK = "week";
            String MONTH = "month";
            String QUARTER = "quarter";
            String YEAR = "year"; -->
            <el-radio-group
              v-model="daliyForm.inspectionCycleType"
              @input="cycleTypeRadio"
            >
              <el-radio label="day">
                <el-input
                  style="width: 30%"
                  v-model="daliyForm.dayValue"
                  :disabled="daliyForm.inspectionCycleType != 'day'"
                  maxlength="10"
                  @input="
                    daliyForm.dayValue = asynchronousValidation(
                      daliyForm.dayValue
                    )
                  "
                ></el-input
                >天/次
              </el-radio>
              <el-radio label="week">
                <el-input
                  style="width: 30%"
                  v-model="daliyForm.weekValue"
                  maxlength="10"
                  :disabled="daliyForm.inspectionCycleType != 'week'"
                  @input="
                    daliyForm.weekValue = asynchronousValidation(
                      daliyForm.weekValue
                    )
                  "
                ></el-input
                >周/次
              </el-radio>
              <el-radio label="month">
                <el-input
                  style="width: 30%"
                  v-model="daliyForm.monthValue"
                  maxlength="10"
                  :disabled="daliyForm.inspectionCycleType != 'month'"
                  @input="
                    daliyForm.monthValue = asynchronousValidation(
                      daliyForm.monthValue
                    )
                  "
                ></el-input
                >月/次
              </el-radio>
              <el-radio label="year">
                <el-input
                  style="width: 30%"
                  maxlength="10"
                  v-model="daliyForm.yearValue"
                  :disabled="daliyForm.inspectionCycleType != 'year'"
                  @input="
                    daliyForm.yearValue = asynchronousValidation(
                      daliyForm.yearValue
                    )
                  "
                ></el-input
                >年/次
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item label="超时时间类型：" prop="cancelReceiveType">
          <el-radio-group v-model="daliyForm.cancelReceiveType">
            <el-radio label="unlimited">不限制</el-radio>
            <el-radio label="period_time">需要超时时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="超时时间："
          v-if="daliyForm.cancelReceiveType === 'period_time'"
          prop="cancelReceivePeriod"
        >
          <el-input
            placeholder="填写超时时间(小时)"
            style="width: 30%; margin-left: 10px"
            v-model="daliyForm.cancelReceivePeriod"
            @input="
              daliyForm.cancelReceivePeriod = asynchronousValidation(
                daliyForm.cancelReceivePeriod
              )
            "
            maxlength="8"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDailyInspection">取 消</el-button>
        <el-button
          type="primary"
          @click="sureDailyInspenction('daliyForm')"
          :loading="loading"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 发布巡检 -->
    <el-dialog
      title="发布巡检"
      :visible.sync="temporaryInspectionDialog"
      width="50%"
      :before-close="closeTemporaryInspection"
    >
      <el-form
        :model="temporaryForm"
        :rules="temporaryRules"
        ref="temporaryForm"
      >
        <el-form-item label="">
          <el-radio-group v-model="temporaryForm.subType">
            <el-radio-button label="pos">POS机</el-radio-button>
            <el-radio-button label="payment_code">聚合码</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="巡检单价" prop="unitPrice">
          <el-input
            style="width: 50%"
            v-model="temporaryForm.unitPrice"
            maxlength="10"
            placeholder="请输入巡检单价"
            @input="
              temporaryForm.unitPrice = asynchronousValidation(
                temporaryForm.unitPrice
              )
            "
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="任务周期" prop="cycle">
          <el-input
            style="width: 50%"
            v-model="temporaryForm.cycle"
            maxlength="10"
            placeholder="请输入任务周期"
            @input="
              temporaryForm.cycle = asynchronousValidation(temporaryForm.cycle)
            "
          >
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="超时时间类型：" prop="cancelReceiveType">
          <el-radio-group v-model="temporaryForm.cancelReceiveType">
            <el-radio label="unlimited">不限制</el-radio>
            <el-radio label="period_time">需要超时时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="超时时间："
          v-if="temporaryForm.cancelReceiveType === 'period_time'"
          prop="cancelReceivePeriod"
        >
          <el-input
            placeholder="填写超时时间(小时)"
            style="width: 30%; margin-left: 10px"
            v-model="temporaryForm.cancelReceivePeriod"
            maxlength="8"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeTemporaryInspection">取 消</el-button>
        <el-button
          type="primary"
          @click="sureTemporaryInspectionDialog('temporaryForm')"
          :loading="loading"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  AddTemporarylTnspectionTask,
  AddNormallTnspectionTask,
} from "@/api/store/store";
import { updateInspectionPage } from "@/api/task/inspection";
import { pageStores } from "@/api/store/store";
export default {
  props: {
    selectStoreIds: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      dailyInspectionDialog: false,
      temporaryInspectionDialog: false,
      loading: false,
      daliyForm: {
        taskUnitPrice: null,
        cycle: null,
        inspectionCycleType: "day",
        inspectionCycle: null,
        dayValue: null,
        weekValue: null,
        monthValue: null,
        yearValue: null,
        cancelReceiveType: null,
        cancelReceivePeriod: null,
        subType: "pos",
        storeId: null,
        storeName: null,
      },
      isEdit: false,
      daliyRules: {
        storeName: [
          { required: true, message: "请输入店铺名称", trigger: "change" },
        ],
        taskUnitPrice: [
          { required: true, message: "请输入巡检单价", trigger: "blur" },
        ],
        inspectionCycleType: [
          { required: true, message: "请选择巡检周期", trigger: "change" },
        ],
        cycle: [{ required: true, message: "请输入任务周期", trigger: "blur" }],
        cancelReceiveType: [
          {
            required: true,
            message: "请选择超时时间类型",
            trigger: "change",
          },
        ],
        cancelReceivePeriod: [
          { required: true, message: "请输入超时时间", trigger: "blur" },
        ],
      },
      temporaryForm: {
        cycle: null,
        unitPrice: null,
        cancelReceiveType: null,
        cancelReceivePeriod: null,
        subType: null,
      },
      temporaryRules: {
        unitPrice: [
          { required: true, message: "请输入巡检单价", trigger: "blur" },
        ],
        cycle: [{ required: true, message: "请输入任务周期", trigger: "blur" }],
        cancelReceiveType: [
          {
            required: true,
            message: "请选择超时时间类型",
            trigger: "change",
          },
        ],
        cancelReceivePeriod: [
          { required: true, message: "请输入超时时间", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 打开日常巡检
    openDailyInspection() {
      this.daliyForm = {
        taskUnitPrice: null,
        inspectionCycleType: "day",
        inspectionCycle: null,
        dayValue: null,
        weekValue: null,
        monthValue: null,
        yearValue: null,
        cancelReceiveType: "unlimited",
        cancelReceivePeriod: 0,
        subType: "pos",
        storeId: null,
        storeName: null,
      };
      this.isEdit = false;
      this.dailyInspectionDialog = true;
    },
    //编辑打开
    editDailyInspection() {
      console.debug("this.inspectionObj", this.$parent.inspectionObj);
      let inspectionObj = this.$parent.inspectionObj;
      this.isEdit = true;
      this.daliyForm = {
        taskUnitPrice: inspectionObj.taskUnitPrice,
        cycle: inspectionObj.taskCycle,
        inspectionCycleType: inspectionObj.inspectionCycleType,
        inspectionId: inspectionObj.inspectionId,
        subType: inspectionObj.subType,
        cancelReceiveType: inspectionObj.cancelReceiveType,
        cancelReceivePeriod: inspectionObj.cancelReceivePeriod,
        storeName: inspectionObj.storeName,
        storeId: inspectionObj.storeId,
      };
      if (this.daliyForm.inspectionCycleType === "day") {
        this.daliyForm.dayValue = inspectionObj.inspectionCycle;
      } else if (this.daliyForm.inspectionCycleType === "week") {
        this.daliyForm.weekValue = inspectionObj.inspectionCycle;
      } else if (this.daliyForm.inspectionCycleType === "month") {
        this.daliyForm.monthValue = inspectionObj.inspectionCycle;
      } else if (this.daliyForm.inspectionCycleType === "year") {
        this.daliyForm.yearValue = inspectionObj.inspectionCycle;
      }
      // this.$parent.inspectionObj;
      this.dailyInspectionDialog = true;
    },
    closeDailyInspection() {
      this.dailyInspectionDialog = false;
      this.$emit("closeDialog");
    },
    // 日常巡检发布
    sureDailyInspenction(formName) {
      console.debug("this.daliyForm", this.daliyForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let inspectionCycle;
          if (this.daliyForm.inspectionCycleType === "day") {
            if (!this.daliyForm.dayValue) {
              this.$message.warning("请填写巡检周期");
              return;
            } else {
              inspectionCycle = this.daliyForm.dayValue;
            }
          } else if (this.daliyForm.inspectionCycleType === "week") {
            if (!this.daliyForm.weekValue) {
              this.$message.warning("请填写巡检周期");
              return;
            } else {
              inspectionCycle = this.daliyForm.weekValue;
            }
          } else if (this.daliyForm.inspectionCycleType === "month") {
            if (!this.daliyForm.monthValue) {
              this.$message.warning("请填写巡检周期");
              return;
            } else {
              inspectionCycle = this.daliyForm.monthValue;
            }
          } else if (this.daliyForm.inspectionCycleType === "year") {
            if (!this.daliyForm.yearValue) {
              this.$message.warning("请填写巡检周期");
              return;
            } else {
              inspectionCycle = this.daliyForm.yearValue;
            }
          }
          if (this.daliyForm.cancelReceiveType === "unlimited") {
            this.daliyForm.cancelReceivePeriod = null;
          }
          let arr = [];
          if (this.selectStoreIds.length > 0) {
            arr = this.selectStoreIds;
          } else {
            arr.push(this.daliyForm.storeId);
          }

          let data = {
            taskUnitPrice: Number(this.daliyForm.taskUnitPrice),
            inspectionCycleType: this.daliyForm.inspectionCycleType,
            inspectionCycle: parseInt(inspectionCycle),
            cycle: this.daliyForm.cycle,
            subType: this.daliyForm.subType,
            cancelReceivePeriod: this.daliyForm.cancelReceivePeriod,
            inspectionId: this.daliyForm.inspectionId,
          };
          this.loading = true;
          if (this.daliyForm.inspectionId) {
            updateInspectionPage(data)
              .then((res) => {
                this.$message.success("发布成功");
                this.dailyInspectionDialog = false;
                this.loading = false;
                this.$emit("getList");
              })
              .catch((error) => {
                console.debug("error", error);
                this.loading = false;
              });
          } else {
            data.storeIds = arr;
            AddNormallTnspectionTask(data)
              .then((res) => {
                this.$message.success("发布成功");
                this.dailyInspectionDialog = false;
                this.loading = false;
                this.$emit("getList");
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          this.loading = false;
        }
      });
    },
    // 监听巡检周期radio切换
    cycleTypeRadio(e) {},
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      this.$forceUpdate();
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      return e;
    },
    // 打开发布巡检
    openTemporaryInspection() {
      this.temporaryForm = {
        cycle: null,
        unitPrice: null,
        subType: "pos",
        cancelReceivePeriod: null,
        cancelReceiveType: "unlimited",
      };
      this.temporaryInspectionDialog = true;
    },
    closeTemporaryInspection() {
      this.temporaryInspectionDialog = false;
      this.$emit("closeDialog");
    },
    sureTemporaryInspectionDialog(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.temporaryForm.cancelReceiveType === "unlimited") {
            this.temporaryForm.cancelReceivePeriod = null;
          }
          let data = {
            unitPrice: this.temporaryForm.unitPrice,
            storeIds: this.selectStoreIds,
            cycle: this.temporaryForm.cycle,
            subType: this.temporaryForm.subType,
            cancelReceiveType: this.temporaryForm.cancelReceiveType,
            cancelReceivePeriod: this.temporaryForm.cancelReceivePeriod,
          };
          AddTemporarylTnspectionTask(data)
            .then((res) => {
              this.$message.success("发布成功");
              this.temporaryInspectionDialog = false;
              this.loading = false;
              this.$emit("getList");
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
    },
    // 店铺搜索
    querySearchAsync(storeName, cb) {
      if (!storeName) {
        cb(this.searchRecords);
        return;
      }
      // // 搜索手机号码
      pageStores({ storeName: storeName }).then((res) => {
        const users = res.data.data.records;
        cb(
          users.map((user) => {
            return {
              value: user.storeName,
              storeId: user.storeId,
            };
          })
        );
      });
    },
    handleSelect(item) {
      console.log(item);
      this.daliyForm.storeId = item.storeId;
    },
  },
};
</script>
<style scoped>
.el-radio {
  margin-bottom: 10px;
}
</style>
