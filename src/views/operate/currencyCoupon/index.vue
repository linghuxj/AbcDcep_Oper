<template>
  <div class="main-content">
    <el-form ref="searchForm" :inline="true" :model="parameter">
      <el-form-item label="消费劵名称：">
        <el-input
          v-model="parameter.couponName"
          placeholder="请输入消费劵名称"
          maxlength="20"
        />
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="parameter.status" placeholder="请选择">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-form-item">
        <el-button type="primary" @click="getSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" @click="handleAdd()">新增消费劵</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="couponList"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        style="width: 100%"
      >
        <el-table-column label="活动名称" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.couponName ? scope.row.couponName : "--" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="售价" width="70">
          <template slot-scope="scope">
            <div>
              {{ scope.row.amount ? scope.row.amount : "--" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="购劵周期" width="200">
          <template slot-scope="scope">
            {{ scope.row.startTime }}至{{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="使用有效期" width="200">
          <template slot-scope="scope">
            {{ scope.row.validStartTime }}至{{ scope.row.validEndTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span>{{
              scope.row.statusName ? scope.row.statusName : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <span style="margin-right: 10px">
              <el-button
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleDetails(scope.row)"
                >查看</el-button
              >
            </span>
            <span
              v-if="
                scope.row.status === 'not_started' ||
                scope.row.status === 'in_progress'
              "
            >
              <el-button
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleUser(scope.row)"
                >已购用户</el-button
              >
              <el-button
                v-if="permissions.topic_status"
                type="text"
                size="mini"
                style="color: #409eff"
                @click="handleFinish(scope.row)"
                >结束</el-button
              >
            </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        v-show="pagination.total > 0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getSearch"
      />
    </div>
    <!-- 新增 -->
    <CurrencyForm
      ref="currencyForm"
      @getCouponList="getCouponList()"
    ></CurrencyForm>
    <!-- 已购用户 -->
    <el-dialog
      title="已购用户"
      :visible.sync="interactive.dialogUserShow"
      width="70%"
      :before-close="dialogUserClose"
    >
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="date" label="领取用户" width="150">
          <template slot-scope="scope">
            <div>
              {{ scope.row.user.username ? scope.row.user.username : "--" }}
            </div>
            <div>
              {{ scope.row.user.mobile ? scope.row.user.mobile : "--" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="领取时间"
          width="150"
        ></el-table-column>
        <el-table-column label="使用时间" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.usedTime ? scope.row.usedTime : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="状态"></el-table-column>
        <el-table-column
          prop="receiveTypeName"
          label="使用方式"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button size="mini" @click="openCode(scope.row.couponNo)">
              二维码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        v-show="pagination.total > 0"
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getSearch"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="interactive.dialogUserShow = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
    <!--弹框  -->
    <el-dialog
      v-loading="interactive.dialogLoading"
      title="二维码"
      :visible.sync="interactive.centerDialogVisible"
      width="30%"
      center
    >
      <div class="dialogQrcode">
        <div id="qrcode" ref="qrCodeUrl" class="qrcode"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="interactive.centerDialogVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import CurrencyForm from "../components/CurrencyCouponForm.vue";
import { getCouponList } from "@/api/operate/currencyCoupon";
import {
  updateCouponStatus,
  pageGotCoupon,
  getStates,
} from "@/api/coupon/coupon";
import QRCode from "qrcodejs2";
export default {
  components: { TablePagination, CurrencyForm },
  data() {
    return {
      //表示参数类
      parameter: {
        orderNo: undefined,
        status: undefined,
      },
      statusList: [],
      interactive: {
        tableLoading: false,
        dialogUserShow: false,
        dialogLoading: false,
        centerDialogVisible: false,
      },
      couponList: [],
      tableData: [],
      // 分页
      pagination: {
        total: 0,
        current: 1,
        size: 20,
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.getCouponList();
    this.getStates();
  },
  methods: {
    handleAdd() {
      this.$refs.currencyForm.open();
    },
    // 获取列表
    getCouponList() {
      let data = {
        couponName: this.parameter.couponName,
        status: this.parameter.status,
        size: this.pagination.size,
        current: this.pagination.current,
        couponType: "consumption_coupon",
      };
      getCouponList(data).then((res) => {
        console.debug("res", res);
        let data = res.data.data;
        this.couponList = data.records;
        this.pagination.size = data.size;
        this.pagination.current = data.current;
      });
    },
    // 获取状态
    getStates() {
      getStates().then((res) => {
        this.statusList = res.data.data;
      });
    },
    // 结束
    handleFinish(row) {
      console.debug("row", row);
      this.$confirm(
        "确认结束后，将停止发行该消费券，已领取的消费券可继续使用。?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let data = {
            couponId: row.couponId,
            // 进行中:in_progress未开始:not_started已过期:expired已作废:finish
            status: "finish",
          };
          updateCouponStatus(data).then((res) => {
            console.debug("结束", res);
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 领取用户列表
    getUserList(id) {
      const { current, size } = this.pagination;
      const params = {
        current,
        size,
        couponId: id,
      };
      pageGotCoupon(params).then((res) => {
        const { records } = res.data.data;
        this.users = records;
        const page = res.data.data;
        this.tableData = page.records;
        this.pagination.total = page.total;
        this.pagination.pages = page.pages;
      });
    },
    //打开二维码弹框
    openCode(couponNo) {
      console.debug("couponNo", couponNo);
      if (document.getElementById("qrcode")) {
        document.getElementById("qrcode").innerHTML = "";
      }
      this.interactive.centerDialogVisible = true;
      this.dialogLoading = true;
      setTimeout(() => {
        this.creatQrCode(couponNo);
        this.dialogLoading = false;
      }, 800);
    },
    // 生成二维码
    creatQrCode(couponNo) {
      var a = document.getElementById("qrcode");
      var qrcode = new QRCode(a, {
        text: couponNo, // 需要转换为二维码的内容
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        render: "canvas",
        correctLevel: QRCode.CorrectLevel.H,
      });
      console.debug(qrcode);
    },
    // 重置
    resetForm() {
      this.parameter.couponName = null;
      this.parameter.status = null;
      this.getCouponList();
    },
    // 搜索
    getSearch() {
      this.getCouponList();
    },
    handleUser(row) {
      this.interactive.dialogUserShow = true;
      this.getUserList(row.couponId);
    },
    dialogUserClose() {
      this.interactive.dialogUserShow = false;
    },
    handleDetails(row) {
      this.$refs.currencyForm.checklist(row.couponId);
    },
  },
};
</script>
<style scoped>
.dialogQrcode .qrcode {
  width: 100px;
  margin: auto;
}
</style>
