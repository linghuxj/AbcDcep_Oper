<template>
  <div class="main-content">
    <el-form
      ref="form"
      :model="form"
      label-width="10rem"
      class="demo-ruleForm"
      :rules="rules"
    >
      <aside-tip content="店铺基本信息" />
      <el-form-item label="店铺名称">
        <div class="original-text">
          {{ storeData.storeName ? storeData.storeName : "--" }}
        </div>
        <div class="draft-text">
          {{ draftData.storeName ? draftData.storeName : "--" }}
        </div>
      </el-form-item>
      <el-form-item label="营业时间：">
        <div class="original-text">
          {{ storeData.startTime }}-{{ storeData.endTime }}
        </div>
        <div class="draft-text">
          {{ draftData.startTime }}-{{ draftData.endTime }}
        </div>
      </el-form-item>
      <el-form-item label="店铺联系电话：">
        <div class="original-text">
          {{ storeData.phone ? storeData.phone : "--" }}
        </div>
        <div class="draft-text">
          {{ draftData.phone ? draftData.phone : "--" }}
        </div>
      </el-form-item>
      <el-form-item label="营业执照名称：">
        <div class="original-text">
          {{ storeData.businessLicense ? storeData.businessLicense : "--" }}
        </div>
        <div class="draft-text">
          {{ draftData.businessLicense ? draftData.businessLicense : "--" }}
        </div>
      </el-form-item>
      <el-form-item label="执照编号：">
        <div class="original-text">
          {{ storeData.businessLicenseNo ? storeData.businessLicenseNo : "--" }}
        </div>
        <div class="draft-text">
          {{ draftData.businessLicenseNo ? draftData.businessLicenseNo : "--" }}
        </div>
      </el-form-item>
      <el-form-item label="营业执照：">
        <div class="image-main">
          <el-image
            :src="storeData.businessLicenseImage"
            style="width: 100px; height: 100px"
          ></el-image>
          <span class="arrow-icon">修改后 >>></span>
          <el-image
            :src="draftData.businessLicenseImage"
            style="width: 100px; height: 100px"
          ></el-image>
        </div>
      </el-form-item>
      <el-form-item label="店铺地址：">
        <div class="original-text" v-if="!storeData.locationName&&!storeData.address">--</div>
        <div class="original-text" v-else>{{storeData.locationName}}{{ storeData.address }}</div>
        <div class="draft-text" v-if="!draftData.locationName&&!draftData.address">--</div>
        <div class="draft-text" v-else>{{draftData.locationName}}{{ draftData.address }}</div>
      </el-form-item>
      <el-form-item label="所属商圈：">
        <div class="original-text">{{ storeData.districtName?storeData.districtName:'--' }}</div>
        <div class="draft-text">{{ draftData.districtName?draftData.districtName :'--' }}</div>
      </el-form-item>
      <el-form-item label="店铺图片：" required>
        <div class="image-main">
          <el-image
            :src="storeData.mainImage"
            style="width: 100px; height: 100px"
          ></el-image>
          <span class="arrow-icon">修改后 >>></span>
          <el-image
            :src="draftData.mainImage"
            style="width: 100px; height: 100px"
          ></el-image>
        </div>
      </el-form-item>
      <!-- 店铺负责人信息 -->
      <aside-tip content="店铺负责人信息" />
      <el-form-item label="负责人姓名：">
        <div class="original-text">
          {{
            storeData.fullName
              ? storeData.fullName
              : "--"
          }}
        </div>
        <div class="draft-text">
          {{
            draftData.fullName
              ? draftData.fullName
              : "--"
          }}
        </div>
      </el-form-item>
      <el-form-item label="负责人手机号：">
        <div class="original-text">
          {{
            storeData.mobile
              ? storeData.mobile
              : "--"
          }}
        </div>
        <div class="draft-text">
          {{
            draftData.mobile
              ? draftData.mobile
              : "--"
          }}
        </div>
      </el-form-item>
      <!-- 机具使用状态 -->
      <aside-tip content="机具使用状态" />
      <el-form-item label="POS机：">
        <div class="original-text">
          {{ storeData.posStatusName ? storeData.posStatusName : "--" }}
        </div>
        <div class="draft-text">
          {{ draftData.posStatusName ? draftData.posStatusName : "--" }}
        </div>
      </el-form-item>
      <el-form-item label="聚合码：">
        <div class="original-text">
          {{
            storeData.paymentCodeStatusName
              ? storeData.paymentCodeStatusName
              : "--"
          }}
        </div>
        <div class="draft-text">
          {{
            draftData.paymentCodeStatusName
              ? draftData.paymentCodeStatusName
              : "--"
          }}
        </div>
      </el-form-item>
      <!-- 审核结果 -->
      <aside-tip content="审核结果" />
      <el-form-item label="审核结果：" prop="status">
        <el-radio
          v-model="form.status"
          label="normal"
          :disabled="draftData.status !== 'audit'"
          >审核通过</el-radio
        >
        <el-radio
          v-model="form.status"
          label="failed"
          :disabled="draftData.status !== 'audit'"
          >审核不通过</el-radio
        >
      </el-form-item>
      <el-form-item
        label="审核原因："
        v-if="form.status === 'failed'"
        prop="remark"
      >
        <textarea
          v-model="form.remark"
          placeholder="请自定义审核不通过的原因"
          class="audit-textarea"
          rows="5"
          :disabled="draftData.status !== 'audit'"
        >
        </textarea>
      </el-form-item>
      <div class="bottom_div" v-if="draftData.status === 'audit'">
        <el-button
          type="primary"
          :loading="interactive.loading"
          :disabled="interactive.loading"
          @click="to_save()"
          >保存</el-button
        >
        <el-button @click="to_reset()">取消</el-button>
      </div>
      <div class="bottom-tip">注：红色字体内容为用户新提交的完善信息</div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import AsideTip from "@/template/aside/index";
import { getDraftMesById, auditDraft } from "@/api/store/draft";
export default {
  components: {
    AsideTip,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      interactive: {
        loading: false,
      },
      form: {
        draftId: null,
        remark: null,
        status: null,
      },
      draftData: {},
      storeData: {},
      rules: {
        status: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        remark: [{ required: true, message: "请填写原因", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  async created() {
    console.debug("this.$route.params");
    if (this.$route.params.id) {
      this.form.draftId = this.$route.params.id;
      this._reqDraftMesById();
    }
  },
  methods: {
    // 获取详情
    _reqDraftMesById() {
      getDraftMesById(this.form.draftId).then((res) => {
        this.draftData = res.data.data;
        this.storeData = res.data.data.store;
        this.form.status = res.data.data.status;
        this.form.remark = res.data.data.remark;
      });
    },
    // 审核
    _reqAuditDraft() {
      let data = {
        draftId: this.form.draftId,
        remark: this.form.remark,
        status: this.form.status,
      };
      this.interactive.loading = true;
      auditDraft(data)
        .then((res) => {
          this.$message.success("成功");
          this.$router.go(-1);
          this.interactive.loading = false;
        })
        .catch(() => {
          this.interactive.loading = false;
        });
    },
    // 去保存
    to_save() {
      this._reqAuditDraft();
    },
    // 去取消
    to_reset() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped lang="scss">
.main-content {
  .draft-text {
    color: #d9001b;
  }
  .bottom-tip {
    color: #d9001b;
    text-align: center;
    font-size: 12px;
    margin: 10px 0px;
  }
  .bottom_div {
    text-align: center;
  }
  .audit-textarea {
    width: 50%;
  }
  .arrow-icon {
    color: #f7af50;
    margin: 0px 10px;
  }
  .image-main {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
