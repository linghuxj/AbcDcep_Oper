<template>
  <div class="storeDetail-content">
    <div class="main-top-d">
      <div class="main-top-image">
        <el-image
          v-if="storeMes.mainImage"
          style="width: 70px; height: 70px; margin-right: 10px"
          :src="storeMes.mainImage"
          fit="fit"
        />
        <div>
          <el-button
            v-if="permissions.store_edit"
            icon="el-icon-edit"
            plain
            @click="to_edit(storeMes.storeId)"
            >修改店铺信息</el-button
          >
        </div>
      </div>

      <div class="main-top-item">
        <div class="item-nav">
          <el-tooltip placement="bottom" effect="light">
            <div slot="content">{{ storeMes.storeName }}</div>
            <div class="store-tips">{{ storeMes.storeName }}</div>
          </el-tooltip>
          <span v-if="storeMes.storeTypeName" class="store_type">{{
            storeMes.storeTypeName
          }}</span>
        </div>
        <div class="item-nav">
          <el-tooltip placement="bottom" effect="light">
            <div slot="content">
              {{ storeMes.locationName }}{{ storeMes.address }}
            </div>
            <div class="store-tips">
              {{ storeMes.locationName }}{{ storeMes.address }}
            </div>
          </el-tooltip>
        </div>
        <div class="item-nav">门店编号：{{ storeMes.storeId }}</div>
        <div class="item-nav">
          协议状态签署：{{ storeMes.agreementStatusName }}
        </div>
        <div class="item-nav">
          所属商圈：{{ storeMes.districtName || "--" }}
        </div>
        <div class="item-nav">
          销售渠道：{{ storeMes.saleChannelName || "--" }}
        </div>
        <div v-if="storeMes.agreement" class="item-nav">
          签署时间：{{ storeMes.createTime }}
        </div>
      </div>
      <div class="main-top-item">
        <div class="item-nav">
          商户编号：{{
            storeMes.bankMerchantNo ? storeMes.bankMerchantNo : "--"
          }}
        </div>
        <div class="item-nav">
          营业时间：{{ storeMes.startTime }}-{{ storeMes.endTime }}
        </div>
        <div class="item-nav">
          联系电话：{{ storeMes.phone ? storeMes.phone : "--" }}
        </div>
        <div class="item-nav">
          负责人：{{ storeMes.fullName ? storeMes.fullName : "--" }}({{
            storeMes.mobile ? storeMes.mobile : "--"
          }})
        </div>
        <div class="item-nav">
          登录账号：{{ storeMes.loginMobile ? storeMes.loginMobile : "--" }}
        </div>
        <div v-if="storeMes.agreement" class="item-nav">
          有效期：{{ storeMes.agreement.validNum }}年
        </div>
      </div>
      <div class="main-top-item">
        <div class="item-nav">
          店铺编号：{{ storeMes.bankStoreNo ? storeMes.bankStoreNo : "--" }}
        </div>
        <div class="item-nav">
          注册时间：{{ storeMes.createTime ? storeMes.createTime : "--" }}
        </div>
        <div class="item-nav">
          开通时间：{{ storeMes.openTime ? storeMes.openTime : "--" }}
        </div>
        <div class="item-nav">
          数字人民币收款账户数：{{ storeMes.accountNum }}个
        </div>
        <div class="item-nav">
          巡检状态：{{
            storeMes.inspectionStatusName ? storeMes.inspectionStatusName : "--"
          }}
        </div>
      </div>
      <div class="status">
        <wel-tag :type="type">{{ handleStatus(storeMes.status) }}</wel-tag>
      </div>
    </div>
    <div class="main-bottom">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础数据" name="baseData">
          <table-date />
        </el-tab-pane>
        <el-tab-pane label="店铺员工" name="storeStaff">
          <table-store-staff />
        </el-tab-pane>
        <el-tab-pane label="已关联商品" name="relationGoods">
          <table-relation-goods />
        </el-tab-pane>
        <el-tab-pane label="收款流水" name="collectionFlow">
          <table-collection-flow />
        </el-tab-pane>
        <el-tab-pane label="巡检记录" name="atrolInspection">
          <tableAtrolInspection />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { findStore } from "@/api/store/store";
import tableDate from "../components/TableDate";
import tableStoreStaff from "../components/TableStoreStaff";
import tableRelationGoods from "../components/TableRelationGoods";
import tableCollectionFlow from "../components/TableCollectionFlow";
import tableAtrolInspection from "../components/TableAtrolInspection";
import { mapGetters } from "vuex";
import WelTag from "@/template/Wel-Tag/index.vue";

export default {
  components: {
    tableStoreStaff,
    tableRelationGoods,
    tableCollectionFlow,
    tableDate,
    WelTag,
    tableAtrolInspection,
  },
  data() {
    return {
      url: undefined,
      activeName: "baseData",
      status: "normal",
      storeMes: {},
      type: "",
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    if (this.$route.query.storeId) {
      this.storeId = this.$route.query.storeId;
      this.$nextTick(() => {
        this.findStore(this.storeId);
      });
    }
  },
  methods: {
    // 获取店铺详情
    findStore(storeId) {
      findStore(storeId).then((res) => {
        this.storeMes = res.data.data;
      });
    },
    //
    handleClick() {},
    // 编辑
    to_edit(row) {
      this.$router.push(`/business/store/compile/${row}`);
    },
    handleStatus(val) {
      if (!val) {
        this.type = "";
        return "";
      }
      if (val === "audit") {
        this.type = "";
        return "待审核";
      }

      if (val === "failed") {
        this.type = "danger";
        return "审核不通过";
      }

      if (val === "normal") {
        this.type = "primary";
        return "正常";
      }

      if (val === "disabled") {
        this.type = "info";
        return "冻结";
      }

      this.type = "";
      return "待审核";
    },
  },
};
</script>
<style scoped>
.storeDetail-content {
  margin: 10px 20px;
  font-size: 14px;
}
.main-top-d {
  display: flex;
  align-items: center;
  background-color: #fff;
  margin-bottom: 20px;
  padding: 20px 30px;
  position: relative;
}
.main-top-image {
  flex: 1;
}
.main-top-item {
  flex: 2;
}
.item-nav {
  margin-bottom: 15px;
}
.store_type {
  background-color: #f59a23;
  font-size: 12px;
  color: #fff;
  padding: 5px 5px;
  margin-left: 10px;
  border-radius: 10px;
}
.main-bottom {
  background-color: #fff;
  padding: 20px 30px;
}
.status {
  position: absolute;
  right: 35px;
  top: 22px;
}
.status_text {
  background-color: #1890ff;
  color: #fff;
  padding: 2px 20px 2px 10px;
}
.status_square {
  display: inline-block;
  width: 17px;
  height: 17px;
  transform: rotate(45deg);
  background-color: #1890ff;
  position: absolute;
  right: -9px;
  top: 1px;
}
.store-tips {
  max-width: 75%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.update_storeMes {
  /* border: 1px solid #999; */
  padding: 5px;
  color: #999;
  position: absolute;
  right: 20px;
  top: 60px;
}
</style>
