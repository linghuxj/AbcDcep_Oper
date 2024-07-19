<template>
  <el-scrollbar>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      label-width="120px"
      class="tem-container"
    >
      <el-alert
        title="任务指标"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <el-form-item v-if="!formLoading" label-width="20px" prop="targetType">
        <el-checkbox
          disabled
          :checked="ruleForm.targetType == 'store' ? true : false"
          >开通商户</el-checkbox
        >
      </el-form-item>
      <el-alert
        title="任务信息"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <el-form-item label="任务名称：">
        <span>{{ ruleForm.taskName ? ruleForm.taskName : "--" }}</span>
      </el-form-item>
      <el-form-item label="详细说明：">
        <span>{{ ruleForm.taskDesc ? ruleForm.taskDesc : "--" }}</span>
      </el-form-item>
      <el-alert
        title="任务奖励"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <el-form-item label="领取人数：">
        <span>{{
          ruleForm.personNum ? ruleForm.personNum + " 人" : "不限"
        }}</span>
      </el-form-item>
      <el-form-item label="任务目标：">
        <span>{{
          ruleForm.taskTarget ? ruleForm.taskTarget + " 个" : "不限"
        }}</span>
      </el-form-item>
      <el-form-item label="任务单价：">
        <span>{{
          ruleForm.unitPrice ? ruleForm.unitPrice + " 元" : "--"
        }}</span>
      </el-form-item>
      <el-form-item label="任务预算：">
        <span>{{ ruleForm.budget ? ruleForm.budget + " 元" : "--" }}</span>
      </el-form-item>
      <el-alert
        title="任务周期及地域"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <el-form-item label="合作周期：">
        <span>{{ ruleForm.cycle ? ruleForm.cycle : "--" }} 天</span>
      </el-form-item>
      <el-form-item label="区域要求：">
        <span>{{ ruleForm.locationName ? ruleForm.locationName : "--" }}</span>
      </el-form-item>
      <el-alert
        title="任务步骤"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <el-table
        :data="ruleForm.taskSteps"
        border
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column label="步骤描述" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.stepDesc ? scope.row.stepDesc : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="网站链接" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.stepLink ? scope.row.stepLink : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传图片（最多3张）">
          <template slot-scope="scope">
            <el-image
              v-for="url in scope.row.resUrls"
              :key="url"
              :src="url"
              style="width: 100px; height: 100px; margin-right: 20px"
              lazy
            ></el-image>
          </template>
        </el-table-column>
      </el-table>

      <el-alert
        title="发布人信息"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <el-form-item label="任务发布者：">
        <span
          >{{ ruleForm.user ? ruleForm.user.mobile : "--" }}（{{
            ruleForm.user ? ruleForm.user.username : "--"
          }}）</span
        >
      </el-form-item>
      <el-form-item label="钱包归属方：">
        <span>{{
          ruleForm.walletDc && ruleForm.walletDc.openBankName
            ? ruleForm.walletDc.openBankName
            : "--"
        }}</span>
      </el-form-item>
      <el-form-item label="钱包编号：">
        <span>{{
          ruleForm.walletDc && ruleForm.walletDc.walletNo
            ? ruleForm.walletDc.walletNo
            : "--"
        }}</span>
      </el-form-item>
      <el-alert
        title="其他要求"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <el-form-item label="创客实名认证：">
        <span>{{ ruleForm.realAuth ? "需要实名认证" : "不需要实名认证" }}</span>
      </el-form-item>
      <el-form-item label="任务结果要求：">
        <div>
          {{ ruleForm.taskResultDesc ? ruleForm.taskResultDesc : "--" }}
        </div>
        <el-image
          v-for="(item, index) in ruleForm.taskResultDescResUrls"
          :key="index"
          style="width: 100px; height: 100px; margin-right: 20px"
          :src="item"
        ></el-image>
      </el-form-item>
    </el-form>
    <div v-if="permissions.task_audit" class="examine-footer">
      <el-button type="primary" size="medium" @click="adoptExamine('ruleForm')"
        >通过</el-button
      >
      <el-button
        type="warning"
        size="medium"
        :disabled="loading"
        :loading="loading"
        @click="failedExamine('ruleForm')"
        >不通过</el-button
      >
    </div>

    <el-dialog title="审核" :visible.sync="dialogVisible" width="70%">
      <el-form :model="temp" :rules="rules" label-width="150px">
        <el-form-item label="保证金类型：">
          <el-radio-group v-model="temp.suretyType" prop="suretyType">
            <div class="bond-raido">
              <el-radio
                v-for="(item, bondIndex) in bondTypeArr"
                :key="bondIndex"
                :label="item.dictValue"
              >
                {{ item.dictName }}
                <el-input
                  v-if="item.dictValue === 'single'"
                  v-model="temp.suretyAmount"
                  placeholder=""
                  style="width: 200px; margin-left: 20px"
                  maxlength="8"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务类型：" prop="typeId">
          <el-select
            v-model="temp.typeId"
            placeholder="请选择任务类型"
            style="width: 70%"
          >
            <el-option
              v-for="level in taskTypeAll"
              :key="level.dictValue"
              :label="level.dictName"
              :value="level.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          v-if="permissions.task_audit"
          label="初始渠道价："
          prop="initialPrice"
        >
          <el-input
            v-model="temp.initialPrice"
            placeholder="请输入任务的单个初始渠道价"
            style="width: 40%"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item> -->
        <el-form-item label="直推奖励：" prop="levelCommissionType">
          <el-radio-group
            v-model="temp.levelCommissionType"
            @change="feeProportion"
          >
            <el-radio label="ratio">
              比例返佣 每一笔任务的
              <el-input
                v-model="temp.levelCommissionRatio"
                :disabled="temp.levelCommissionType === 'fixed'"
                min="0.00"
                style="width: 200px"
                @input="
                  temp.levelCommissionRatio = asynchronousValidation(
                    temp.levelCommissionRatio
                  )
                "
              >
                <template slot="append">%</template>
              </el-input>
            </el-radio>
            <el-radio label="fixed">
              固定返佣
              <el-input
                v-model="temp.levelCommissionFixed"
                :disabled="temp.levelCommissionType === 'ratio'"
                min="0.00"
                style="width: 200px"
                @input="
                  temp.levelCommissionFixed = asynchronousValidation(
                    temp.levelCommissionFixed
                  )
                "
              >
                <template slot="append">元</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="间推奖励：" prop="indirectCommissionType">
          <el-radio-group
            v-model="temp.indirectCommissionType"
            @change="indirectProportion"
          >
            <el-radio label="ratio">
              比例返佣 每一笔任务的
              <el-input
                v-model="temp.indirectCommissionRatio"
                :disabled="temp.indirectCommissionType === 'fixed'"
                min="0.00"
                style="width: 200px"
                @input="
                  temp.indirectCommissionRatio = asynchronousValidation(
                    temp.indirectCommissionRatio
                  )
                "
              >
                <template slot="append">%</template>
              </el-input>
            </el-radio>
            <el-radio label="fixed">
              固定返佣
              <el-input
                v-model="temp.indirectCommissionFixed"
                :disabled="temp.indirectCommissionType === 'ratio'"
                min="0.00"
                style="width: 200px"
                @input="
                  temp.indirectCommissionFixed = asynchronousValidation(
                    temp.indirectCommissionFixed
                  )
                "
              >
                <template slot="append">元</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="做任务返米粒：" prop="rebateIntegralType">
          <el-radio-group
            v-model="temp.rebateIntegralType"
            @change="rebateIntegralProportion"
          >
            <el-radio label="ratio">
              比例 返实际收益的
              <el-input
                v-model="temp.rebateIntegralRatio"
                type="number"
                min="0.00"
                style="width: 200px"
                :disabled="temp.rebateIntegralType === 'fixed'"
              >
                <template slot="append">%</template>
              </el-input>
            </el-radio>
            <el-radio label="fixed">
              定额 做任务返
              <el-input
                v-model="temp.rebateIntegralFixed"
                type="number"
                min="0.00"
                style="width: 200px"
                :disabled="temp.rebateIntegralType === 'ratio'"
              >
                <!-- <span slot="suffix" class="el-input__icon">米粒</span> -->
                <template slot="append">米粒</template>
              </el-input>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTaskExamine">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核不通过原因" :visible.sync="dialogFormVisible">
      <el-form
        :model="temp"
        :rules="rules"
        label-position="right"
        label-width="110px"
      >
        <el-form-item label="任务类型：" prop="typeId">
          <el-select
            v-model="temp.typeId"
            placeholder="请选择任务类型"
            style="width: 80%"
          >
            <el-option
              v-for="level in taskTypeAll"
              :key="level.typeId"
              :label="level.typeName"
              :value="level.typeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="常用语：">
          <el-select
            v-model="temp.reason"
            placeholder="请选择"
            style="width: 80%"
            :disabled="Boolean(temp.remark)"
          >
            <el-option
              v-for="level in taskRemarkAll"
              :key="level.id"
              :label="level.reason"
              :value="level.reason"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因：" style="width: 80%">
          <el-input
            v-model="temp.remark"
            :disabled="Boolean(temp.reason)"
            type="textarea"
            :rows="2"
            placeholder="请填写审核不通过的原因"
            autocomplete="off"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTaskExamine">确 定</el-button>
      </div>
    </el-dialog>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import { getTaskById, submitTaskExamine, getSuretyType } from "@/api/task/list";
import { getReasonAll } from "@/api/reason";
import { getTaskTypeAll } from "@/api/task/type";

export default {
  name: "TaskExamine",
  data() {
    return {
      formLoading: false,
      fits: ["fill", "contain", "cover"],
      loading: false,
      ruleForm: {
        targetType: "common",
        auditTime: "",
        auditUser: {
          avatar: "",
          company: "",
          companyNo: "",
          fullName: "",
          mobile: "",
          sex: "",
          userId: undefined,
          username: "",
        },
        budget: undefined,
        closeTime: "",
        completeTime: "",
        createTime: "",
        cycle: undefined,
        deadlineTime: "",
        location: "",
        locationName: "",
        personNum: undefined,
        realAuth: true,
        realAuthName: "",
        receiveNum: undefined,
        status: "",
        statusName: "",
        taskDesc: "",
        taskId: undefined,
        taskName: "",
        taskNo: "",
        taskResultDesc: "",
        taskResultDescResUrls: [],
        taskSteps: [
          {
            resUrls: [],
            stepDesc: "",
            stepLink: "",
          },
        ],
        taskTarget: undefined,
        typeId: undefined,
        typeName: "",
        unitPrice: undefined,
        user: {
          avatar: "",
          company: "",
          companyNo: "",
          fullName: "",
          mobile: "",
          sex: "",
          userId: undefined,
          username: "",
        },
        userDcWallet: {
          image: "",
          mobile: "",
          openBank: "",
          openBankName: "",
          personName: "",
          userId: undefined,
          walletId: undefined,
          walletNo: "",
        },
      },
      temp: {
        remark: undefined,
        status: "",
        taskId: undefined,
        reason: undefined,
        typeId: undefined,
        // initialPrice: undefined,
        levelCommissionType: undefined,
        levelCommissionAmount: undefined,
        levelCommissionRatio: undefined,
        levelCommissionFixed: undefined,
        indirectCommissionFixed: undefined,
        indirectCommissionRatio: undefined,
        indirectCommissionType: undefined,
        indirectCommissionAmount: undefined,
        rebateIntegralFixed: undefined,
        rebateIntegralRatio: undefined,
        rebateIntegralType: undefined,
        rebateIntegralAmount: undefined,
        suretyAmount: undefined,
        suretyType: undefined,
      },
      bondTypeArr: [],
      rules: {
        typeId: [
          { required: true, message: "请选择活动类型", trigger: "change" },
        ],
        suretyType: [
          { required: true, message: "请选择保证金类型", trigger: "blur" },
        ],
      },
      taskTypeAll: [],
      taskRemarkAll: [],
      dialogVisible: false,
      dialogFormVisible: false,
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.initTaskTypeAll();
    this.initTaskRemarkAll();
    this._getSuretyType();
    const id = this.$route.params && this.$route.params.id;
    this.$nextTick(() => {
      this.getTaskDetail(id);
    });
  },
  methods: {
    // 获取保证金缴纳类型
    _getSuretyType() {
      const _this = this;
      getSuretyType().then((res) => {
        console.log(res.data.data);
        _this.bondTypeArr = res.data.data;
      });
    },
    // 非金额数据进行过滤
    asynchronousValidation(e) {
      e = e.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      return e;
    },
    // 查询任务类型
    initTaskTypeAll() {
      getTaskTypeAll()
        .then((resp) => {
          const page = resp.data.data;
          this.taskTypeAll = page;
        })
        .catch(() => {});
    },
    // 查询所有审核不通过原因
    initTaskRemarkAll() {
      // 类型(任务审核:task、店铺审核：store、订单取消：order_cancel、订单拒绝退款：order_refuse_refund)
      getReasonAll("task")
        .then((resp) => {
          const page = resp.data.data;
          this.taskRemarkAll = page;
        })
        .catch(() => {});
    },
    // 查询详情
    getTaskDetail(id) {
      this.formLoading = true;
      getTaskById(id).then((res) => {
        this.ruleForm = res.data.data;
        this.ruleForm.taskTarget =
          this.ruleForm.taskTarget === 0 ? undefined : this.ruleForm.taskTarget;
        this.ruleForm.personNum =
          this.ruleForm.personNum === 0 ? undefined : this.ruleForm.personNum;
        this.formLoading = false;
      });
    },
    // 通过
    adoptExamine() {
      this.temp = {
        remark: undefined,
        status: "progress",
        taskId: this.ruleForm.taskId,
        reason: undefined,
        typeId: undefined,
        // initialPrice: undefined,
        levelCommissionType: undefined,
        levelCommissionAmount: undefined,
        levelCommissionRatio: undefined,
        levelCommissionFixed: undefined,
        indirectCommissionFixed: undefined,
        indirectCommissionRatio: undefined,
        indirectCommissionType: undefined,
        indirectCommissionAmount: undefined,
        rebateIntegralFixed: undefined,
        rebateIntegralRatio: undefined,
        rebateIntegralType: undefined,
        rebateIntegralAmount: undefined,
      };
      this.dialogVisible = true;
    },
    // 不通过
    failedExamine() {
      this.temp = {
        remark: undefined,
        status: "failed",
        taskId: this.ruleForm.taskId,
        reason: undefined,
        typeId: undefined,
      };
      this.dialogFormVisible = true;
    },
    // 常用语选择
    // changeCommonWords(val) {
    //   this.temp.reason = val
    // },
    // 提交审核
    submitTaskExamine() {
      console.debug(
        "this.temp.remark",
        !this.temp.remark,
        !this.temp.reason,
        this.dialogFormVisible
      );
      if (!this.temp.remark && !this.temp.reason && this.dialogFormVisible) {
        this.$message.warning("请选择或输入审核不通过原因");
        return;
      }
      const parameter = {
        remark: this.temp.remark ? this.temp.remark : this.temp.reason,
        status: this.temp.status,
        taskId: this.temp.taskId,
        reason: this.temp.reason,
        typeId: this.temp.typeId,
        // initialPrice: this.temp.initialPrice,
        rebateIntegralType: this.temp.rebateIntegralType,
        rebateIntegralAmount:
          this.temp.rebateIntegralType === "fixed"
            ? this.temp.rebateIntegralFixed
            : this.temp.rebateIntegralRatio,
        levelCommissionType: this.temp.levelCommissionType,
        levelCommissionAmount:
          this.temp.levelCommissionType === "fixed"
            ? this.temp.levelCommissionFixed
            : this.temp.levelCommissionRatio,

        indirectCommissionType: this.temp.indirectCommissionType,
        indirectCommissionAmount:
          this.temp.indirectCommissionType === "fixed"
            ? this.temp.indirectCommissionFixed
            : this.temp.indirectCommissionRatio,
        suretyType: this.temp.suretyType ? this.temp.suretyType : "",
        suretyAmount: Number(this.temp.suretyAmount)
          ? Number(this.temp.suretyAmount)
          : "",
      };
      submitTaskExamine(parameter)
        .then(() => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          setTimeout(() => {
            this.$router.go(-1);
          }, 100);
        })
        .catch(() => {});
    },
    // 直推
    feeProportion(val) {
      if (val === "ratio") {
        this.temp.levelCommissionFixed = undefined;
      } else if (val === "fixed") {
        this.temp.levelCommissionRatio = undefined;
      }
    },
    // 间推
    indirectProportion(val) {
      if (val === "ratio") {
        this.temp.indirectCommissionFixed = undefined;
      } else if (val === "fixed") {
        this.temp.indirectCommissionRatio = undefined;
      }
    },
    // 米粒
    rebateIntegralProportion(val) {
      if (val === "ratio") {
        this.temp.rebateIntegralFixed = undefined;
      } else if (val === "fixed") {
        this.temp.rebateIntegralRatio = undefined;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tem-container {
  background-color: white;
  margin: 10px 20px;
  padding: 30px 30px 60px;
}
.el-alert {
  margin-bottom: 20px;
}
.examine-footer {
  position: fixed;
  bottom: 0;
  font-size: 18px;
  width: 100%;
  height: 60px; /*脚部的高度*/
  line-height: 60px;
  background-color: #eef1f6;
  // text-align: center;
  padding-left: 200px;
  z-index: 3;
}
.bond-raido {
  display: flex;
  flex-direction: column;
}
.bond-raido label {
  margin-bottom: 5px;
  height: 30px;
}
</style>
