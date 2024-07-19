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
        <el-form-item label="巡检单价：" prop="taskUnitPrice">
          <el-input
            style="width: 50%"
            v-model="daliyForm.taskUnitPrice"
            maxlength="10"
            placeholder="请输入巡检单价"
            @input="daliyForm.taskUnitPrice = asynchronousValidation(daliyForm.taskUnitPrice )"
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
            @input="daliyForm.cycle = asynchronousValidation(daliyForm.cycle )"
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
            <el-radio-group v-model="daliyForm.inspectionCycleType">
              <el-radio label="day">
                <el-input
                  style="width: 30%"
                  v-model="daliyForm.dayValue"
                  :disabled="daliyForm.inspectionCycleType != 'day'"
                  @input="daliyForm.dayValue = asynchronousValidation(daliyForm.dayValue )"
                ></el-input
                >天/次
              </el-radio>
              <el-radio label="week">
                <el-input
                  style="width: 30%"
                  v-model="daliyForm.weekValue"
                  :disabled="daliyForm.inspectionCycleType != 'week'"
                  @input="daliyForm.weekValue = asynchronousValidation(daliyForm.weekValue )"
                ></el-input
                >周/次
              </el-radio>
              <el-radio label="month">
                <el-input
                  style="width: 30%"
                  v-model="daliyForm.monthValue"
                  :disabled="daliyForm.inspectionCycleType != 'month'"
                  @input="daliyForm.monthValue = asynchronousValidation(daliyForm.monthValue )"
                ></el-input
                >月/次
              </el-radio>
              <el-radio label="year">
                <el-input
                  style="width: 30%"
                  v-model="daliyForm.yearValue"
                  :disabled="daliyForm.inspectionCycleType != 'year'"
                   @input="daliyForm.yearValue = asynchronousValidation(daliyForm.yearValue )"
                ></el-input
                >年/次
              </el-radio>
            </el-radio-group>
          </div>
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
        <el-form-item label="巡检单价" prop="unitPrice">
          <el-input
            style="width: 50%"
            v-model="temporaryForm.unitPrice"
            maxlength="10"
            placeholder="请输入巡检单价"
            @input="temporaryForm.unitPrice = asynchronousValidation(temporaryForm.unitPrice )"
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
            @input="temporaryForm.cycle = asynchronousValidation(temporaryForm.cycle )"
          >
            <template slot="append">天</template>
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
      },
      daliyRules: {
        taskUnitPrice: [
          { required: true, message: "请输入巡检单价", trigger: "blur" },
        ],
        inspectionCycleType: [
          { required: true, message: "请选择巡检周期", trigger: "change" },
        ],
        cycle: [{ required: true, message: "请输入任务周期", trigger: "blur" }],
      },
      temporaryForm: {
        cycle: null,
        unitPrice: null,
      },
      temporaryRules: {
        unitPrice: [
          { required: true, message: "请输入巡检单价", trigger: "blur" },
        ],
        cycle: [{ required: true, message: "请输入任务周期", trigger: "blur" }],
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
      };
      this.dailyInspectionDialog = true;
    },
    closeDailyInspection() {
      this.dailyInspectionDialog = false;
      this.$emit("closeDialog");
    },
    // 日常巡检发布
    sureDailyInspenction(formName) {
      this.loading = true;
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
          let data = {
            taskUnitPrice: Number(this.daliyForm.taskUnitPrice),
            storeIds: this.selectStoreIds,
            inspectionCycleType: this.daliyForm.inspectionCycleType,
            inspectionCycle: parseInt(inspectionCycle),
            cycle: this.daliyForm.cycle,
          };
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
        } else {
          this.loading = false;
        }
      });
    },
     // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      return e;
    },
    // 打开发布巡检
    openTemporaryInspection() {
      this.temporaryForm = {
        cycle: null,
        unitPrice: null,
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
          let data = {
            unitPrice: this.temporaryForm.unitPrice,
            storeIds: this.selectStoreIds,
            cycle: this.temporaryForm.cycle,
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
  },
};
</script>
<style scoped>
.el-radio {
  margin-bottom: 10px;
}
</style>
