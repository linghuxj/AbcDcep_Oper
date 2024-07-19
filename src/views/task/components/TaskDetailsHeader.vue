<template>
  <div class="task-details">
    <div class="task-details-nav">
      <div class="nav-item">{{ detailsForm.taskName }}</div>
      <div class="nav-items status">
        <div class="status_text">{{ detailsForm.statusName }}</div>
        <div class="status_square"></div>
      </div>
    </div>
    <div class="task-details-eva">
      <div class="task-details-item">
        <div class="details-item">
          任务类型：{{ detailsForm.typeName ? detailsForm.typeName : "--" }}
        </div>
        <!-- <div class="details-item">
          初始渠道价：{{
            detailsForm.initialPrice ? detailsForm.initialPrice : 0
          }}
        </div> -->
        <div class="details-item">
          任务单价(元)：{{ detailsForm.unitPrice ? detailsForm.unitPrice : 0 }}
        </div>
        <div class="details-item">保证金类型：{{ suretyFun(detailsForm) }}</div>
      </div>
      <div class="task-details-item">
        <div class="details-item">
          创客实名认证：{{
            detailsForm.realAuth ? "需实名认证" : "不需实名认证"
          }}
        </div>

        <div class="details-item">
          领取后超时时间：{{
            detailsForm.cancelReceiveType === "unlimited"
              ? "不限制"
              : detailsForm.cancelReceivePeriod
          }}
        </div>
      </div>
    </div>
    <div>
      <el-button icon="el-icon-edit" @click="handleUpdate">编辑任务</el-button>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="dialogVisible = true"
        >更多基础详情</el-button
      >
    </div>
    <el-dialog title="更多基础详情" :visible.sync="dialogVisible" width="50%">
      <el-alert
        title="任务信息"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <div class="task-details-eva">
        <div class="task-details-item">
          <div class="details-item">
            任务名称：{{ detailsForm.taskName ? detailsForm.taskName : "--" }}
          </div>
          <div class="details-item">
            任务单号：{{ detailsForm.taskNo ? detailsForm.taskNo : "--" }}
          </div>
        </div>
        <div class="task-details-item">
          <div class="details-item">
            创客实名认证：{{
              detailsForm.realAuth ? "需实名认证" : "不需实名认证"
            }}
          </div>
          <div class="details-item">
            任务类型：{{ detailsForm.typeName ? detailsForm.typeName : "--" }}
          </div>
        </div>
        <div class="task-details-item">
          <div class="details-item">
            保证金类型：{{ suretyFun(detailsForm) }}
          </div>
          <!-- <div class="details-item">
            初始渠道价：{{
              detailsForm.initialPrice ? detailsForm.initialPrice : 0
            }}
          </div> -->
        </div>
        <div class="task-details-item">
          <div class="details-item">
            任务单价(元)：{{
              detailsForm.unitPrice ? detailsForm.unitPrice : 0
            }}
          </div>
          <div class="details-item"></div>
        </div>
      </div>
      <div class="task-details-1">
        任务说明：{{ detailsForm.taskDesc ? detailsForm.taskDesc : "--" }}
      </div>
      <el-alert
        title="任务奖励"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <div class="task-details-eva">
        <div class="task-details-item">
          <div class="details-item">
            领取人数（人）：{{
              detailsForm.receiveNum ? detailsForm.receiveNum : 0
            }}
          </div>
          <div class="details-item">
            任务目标：{{
              detailsForm.taskTarget ? detailsForm.taskTarget : "不限制"
            }}
          </div>
        </div>
      </div>
      <el-alert
        title="任务周期及地域"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <div class="task-details-eva">
        <div class="task-details-item">
          <div class="details-item">
            合作周期（天）：{{ detailsForm.cycle ? detailsForm.cycle : "--" }}
          </div>
          <div class="details-item">
            地域要求：{{
              detailsForm.locationName ? detailsForm.locationName : "--"
            }}
          </div>
        </div>
        <div class="task-details-item">
          <div class="details-item">
            发布时间：{{
              detailsForm.createTime ? detailsForm.createTime : "--"
            }}
          </div>
          <div class="details-item">
            截止时间：{{
              detailsForm.deadlineTime ? detailsForm.deadlineTime : "--"
            }}
          </div>
        </div>

        <div class="task-details-item">
          <div class="details-item">
            完成时间：{{
              detailsForm.completeTime ? detailsForm.completeTime : "--"
            }}
          </div>
          <div class="details-item">
            结束时间：{{ detailsForm.closeTime ? detailsForm.closeTime : "--" }}
          </div>
          <div class="details-item"></div>
        </div>
      </div>
      <el-alert
        title="发布人信息"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <div class="task-details-eva">
        <div class="task-details-item">
          <div class="details-item">
            任务发布者：{{
              detailsForm.publisher ? detailsForm.publisher.mobile : "--"
            }}({{
              detailsForm.publisher ? detailsForm.publisher.username : "--"
            }})
          </div>
          <div class="details-item">
            <!-- 所属单位：{{ detailsForm.locationName?detailsForm.locationName :'--' }} -->
          </div>
        </div>
      </div>
      <el-alert
        title="其他要求"
        type="info"
        class="el-alert"
        :closable="false"
      ></el-alert>
      <div class="task-details-1">
        <el-steps class="nodeStep" direction="vertical">
          <el-step
            v-for="(nodeItem, nodeIdx) in detailsForm.resultNodes"
            :key="nodeIdx"
            :title="'节点' + (nodeIdx + 1)"
            status="process"
          >
            <template slot="description">
              <span>说明描述：{{ nodeItem.nodeDesc }}</span>
              <div>
                <span>示例图片：</span>
                <template
                  v-if="
                    Array.isArray(nodeItem.egImage) &&
                    nodeItem.egImage.length > 0
                  "
                >
                  <el-image
                    v-for="(imgItem, imgIdx) in nodeItem.egImage"
                    :key="imgIdx"
                    :src="imgItem"
                    class="stepImg"
                  ></el-image>
                </template>
                <span v-else>暂 无</span>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="任务步骤" name="1">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in detailsForm.taskSteps"
              :key="index"
              :timestamp="'步骤' + (index + 1)"
              placement="top"
            >
              <el-card :body-style="{ padding: '5px' }">
                <p>{{ activity.stepDesc }}</p>
                <p>{{ activity.stepLink }}</p>
                <el-image
                  v-for="(item, i) in activity.resUrls"
                  :key="i"
                  style="width: 100px; height: 100px; margin-right: 10px"
                  :src="item"
                ></el-image>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
import { getTaskById } from "@/api/task/list";
export default {
  name: "TaskDetailsHeader",
  data() {
    return {
      activeNames: [],
      detailsForm: {
        bankNo: null,
        budget: null,
        company: null,
        createTime: "",
        cycle: null,
        dcWalletName: null,
        location: "",
        locationName: "",
        personNum: null,
        publisherMobile: "",
        publisherName: "",
        receiveNum: null,
        status: "",
        statusName: "",
        taskDesc: null,
        taskId: undefined,
        taskName: "",
        taskNo: "",
        taskTarget: undefined,
        typeId: undefined,
        typeName: "",
      },
      dialogVisible: false,
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.$nextTick(() => {
      this.taskcode = id;
      this.getTaskDetail(id);
    });
  },
  methods: {
    // 查询详情
    getTaskDetail(id) {
      getTaskById(id).then((res) => {
        this.detailsForm = res.data.data;
        this.detailsForm.taskTarget =
          this.detailsForm.taskTarget === 0
            ? undefined
            : this.detailsForm.taskTarget;
        this.detailsForm.personNum =
          this.detailsForm.personNum === 0
            ? undefined
            : this.detailsForm.personNum;
      });
    },
    // 去编辑页面
    handleUpdate() {
      this.$router.push(
        `/task/establish/${this.$route.params && this.$route.params.id}`
      );
    },
    // 数据处理
    numFilter(val) {
      if (!val) {
        return "--";
      }

      if (val.fullName) {
        return val.fullName;
      }

      if (val.username) {
        return val.username;
      }
      return "--";
    },
    numMobile(val) {
      if (!val) {
        return "--";
      }

      if (val.mobile) {
        return val.mobile;
      }
      return "--";
    },
    numCompany(val) {
      if (!val) {
        return "--";
      }
      let company = "--";
      let companyNo = "--";

      if (val.fullName) {
        company = val.fullName;
        return company;
      }

      if (val.username) {
        companyNo = val.companyNo;
        return companyNo;
      }
    },
    numDcWallet(val) {
      if (!val) {
        return "--（--）";
      }
      let openBankName = "--";
      let walletNo = "--";

      if (val.openBankName) {
        openBankName = val.openBankName;
      }

      if (val.walletNo) {
        walletNo = val.walletNo;
      }

      const tem = openBankName + "（" + walletNo + "）";
      return tem;
    },
    suretyFun(val) {
      if (val.suretyType === "off") {
        return "不用缴纳";
      }
      if (val.suretyType === "platform") {
        return "平台保证金";
      }
      if (val.suretyType === "single") {
        if (!val.suretyType) {
          return "单任务缴纳";
        }
        return "单任务缴纳（" + val.suretyAmount + "元）";
      }

      return "--";
    },
  },
  // components: { TaskDetails }
};
</script>

<style lang="scss" scoped>
.task-details {
  .task-details-nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    align-items: center;
    .nav-item {
      font-size: 24px;
      font-weight: 600;
      flex: 3;
    }
    .nav-items {
      flex: 1;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: flex-end;
      .status_text {
        height: 30px;
        background-color: #1890ff;
        color: #fff;
        padding: 0px 15px 0px 20px;
      }
      .status_square {
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-left: 20px solid #1890ff;
        border-bottom: 15px solid transparent;
      }
    }
  }
  .task-details-eva {
    display: flex;
    flex-direction: column;
    width: 100%;
    .task-details-item {
      margin: 8px 0;
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      align-items: flex-start;
      .details-item {
        width: 250px;
        font-size: 13px;
        color: #303133;
      }
    }
  }
  ::v-deep.task-details-1 {
    margin: 8px 0;
    font-size: 13px;
    color: #303133;
    .nodeStep {
      .el-step.is-vertical .el-step__line {
        left: 9px;
      }
      .el-step__icon {
        width: 20px;
        height: 20px;
        font-size: 13px;
      }
      .el-step__title {
        font-size: 13px;
      }
    }
    .stepImg {
      display: inline-block;
      vertical-align: top;
      width: 100px;
      height: 100px;
      margin-left: 3px;
    }
  }
  .el-alert {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
    padding-left: 5px;
  }
}
</style>
