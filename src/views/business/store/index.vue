<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="search"
      class="demo-form-inline"
      id="demo-form-inline"
      :rules="rules"
    >
      <el-form-item label="店铺搜索：" class="demo-from-item">
        <el-input
          v-model="search.searchStoreValue"
          placeholder="请输入内容"
          class="input-with-select"
          style="width: 100%"
        >
          <el-select
            slot="prepend"
            v-model="search.searchStoreType"
            placeholder="请选择"
          >
            <el-option label="店铺名称" value="storeName"></el-option>
            <el-option label="店铺编号" value="storeNo"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item
        label="店铺类型："
        class="demo-from-item"
        v-if="activeName != 'draft'"
      >
        <el-select
          v-model="search.storeType"
          :placeholder="$t('business.type')"
        >
          <el-option
            v-for="item in typeArr"
            :key="item.typeId"
            :label="item.typeName"
            :value="item.typeId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="POS机状态：" class="demo-from-item">
        <el-select v-model="search.posStatus" placeholder="请选择POS机状态">
          <el-option
            v-for="(item, index) in machinesStatus"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="聚合码状态：" class="demo-from-item">
        <el-select
          v-model="search.paymentCodeStatus"
          placeholder="请选择聚合码状态："
        >
          <el-option
            v-for="(item, index) in machinesStatus"
            :key="index"
            :label="item.dictName"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区：" prop="location">
        <el-cascader
          ref="cascader"
          v-model="search.location"
          :props="locationNameList"
          :show-all-levels="false"
          placeholder="请选择省市"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item
        v-if="activeName != 'draft'"
        label="负责人搜索："
        class="demo-from-item"
      >
        <el-input
          v-model="search.searchUserValue"
          placeholder="请输入内容"
          class="input-with-select"
          style="width: 100%"
        >
          <el-select
            slot="prepend"
            v-model="search.searchUserType"
            placeholder="请选择"
          >
            <el-option label="负责人姓名" value="fullName"></el-option>
            <el-option label="负责人手机号" value="mobile"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item
        label="登录账号："
        class="demo-from-item"
        v-if="activeName != 'draft'"
      >
        <el-input
          v-model="search.loginMobile"
          placeholder="请输入登录账号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="入驻来源："
        class="demo-from-item"
        v-if="activeName != 'draft'"
      >
        <el-select v-model="search.settlementType" placeholder="请选择">
          <el-option
            :label="item.dictName"
            :value="item.dictValue"
            v-for="item in settlementTypeArr"
            :key="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-button icon="el-icon-search" type="primary" @click="to_search"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.store_add"
        icon="el-icon-plus"
        type="primary"
        @click="toAddStore"
        >新增店铺</el-button
      >
      <el-button
        @click="open_dailypPatrolInspection"
        v-if="permissions.task_inspection_normal"
      >
        设置日常巡检
      </el-button>
      <el-button
        @click="open_publishPatrolInspection"
        v-if="permissions.task_inspection_temporary"
      >
        发布巡检
      </el-button>

      <el-button
        type="primary"
        v-if="permissions.task_inspection_temporary"
        style="width: 100px; position: relative; height: 28px; top: -5px"
      >
        <input
          type="file"
          ref="fileInput"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="batchUploadShop"
          style="
            width: 100px;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 99;
            opacity: 0;
            display: block;
          "
        />
        <span
          style="
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 0;
            line-height: 2;
            display: block;
          "
          >批量上传</span
        >
      </el-button>
      <el-button
        @click="dowmShopTemplate"
        v-if="permissions.task_inspection_temporary"
      >
        下载模板
      </el-button>
    </div>
    <el-tabs id="tabs" v-model="activeName" @tab-click="tabview">
      <template v-for="(item, index) in storeStatusList">
        <el-tab-pane
          :key="index"
          :label="item.dictName"
          :name="item.dictValue"
          :disabled="interactive.tableLoading"
        >
        </el-tab-pane>
      </template>
    </el-tabs>
    <div v-if="activeName != 'draft'">
      <el-table
        v-loading="interactive.tableLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="tableData"
        border
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :height="tableHeight"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <template v-if="!interactive.tableLoading">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="店铺编号" prop="storeNo"></el-table-column>
          <el-table-column label="店铺名称" width="200">
            <template slot-scope="scope">
              <span>{{
                scope.row.storeName ? scope.row.storeName : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="店铺类型" width="120">
            <template slot-scope="scope">
              <span>{{
                scope.row.storeTypeName ? scope.row.storeTypeName : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入驻来源" width="120">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.settlementTypeName
                    ? scope.row.settlementTypeName
                    : "--"
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="负责人姓名" width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.fullName ? scope.row.fullName : "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName != 'normal'"
            label="负责人手机号"
            width="120"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.mobile ? scope.row.mobile : "--" }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="登录账号" width="120">
            <template slot-scope="scope">
              <span>{{
                scope.row.loginMobile ? scope.row.loginMobile : "--"
              }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="巡检状态">
            <template slot-scope="scope">
              <span>{{
                scope.row.inspectionStatusName
                  ? scope.row.inspectionStatusName
                  : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="巡检时间">
            <template slot-scope="scope">
              <span>{{
                scope.row.lastInspectionTime
                  ? scope.row.lastInspectionTime
                  : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="POS机状态" width="120">
            <template slot-scope="scope">
              <span>{{
                scope.row.posStatusName ? scope.row.posStatusName : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="聚合码状态" width="120">
            <template slot-scope="scope">
              <span>{{
                scope.row.paymentCodeStatusName
                  ? scope.row.paymentCodeStatusName
                  : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName === 'normal'"
            label="已关联商品数(个)"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.productNum ? scope.row.productNum : "--"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName != 'normal'"
            label="注册时间"
            prop="createTime"
            width="150"
          >
          </el-table-column>
          <el-table-column label="邀请信息" width="200">
            <template slot-scope="scope">
              <div>
                邀请人：{{
                  scope.row.inviteUser ? scope.row.inviteUser.username : "--"
                }}
              </div>
              <div>
                邀请手机号：{{
                  scope.row.inviteUser
                    ? scope.row.inviteUser.mobile
                      ? scope.row.inviteUser.mobile
                      : "--"
                    : "--"
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName != 'incomplete'"
            label="协议签署状态"
            prop="agreementStatusName"
          ></el-table-column>
          <div v-if="activeName === 'normal'">
            <el-table-column label="开通时间" width="150">
              <template slot-scope="scope">
                <span>{{
                  scope.row.openTime ? scope.row.openTime : "--"
                }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="店铺状态" prop="statusName"></el-table-column> -->
          </div>
          <div v-if="activeName === 'failed'">
            <el-table-column label="审核原因" prop="remark"></el-table-column>
            <el-table-column label="审核时间" width="150">
              <template slot-scope="scope">
                <span>{{
                  scope.row.openTime ? scope.row.openTime : "--"
                }}</span>
              </template>
            </el-table-column>
          </div>
          <el-table-column
            v-if="activeName === 'audit' || activeName === 'draft'"
            label="操作"
            width="180"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="
                  permissions.store_status_edit ||
                  (activeName === 'draft' && permissions.store_draft_audit)
                "
                type="text"
                @click="to_Compile(scope.row)"
                >审核</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName === 'normal'"
            label="操作"
            width="280"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  v-if="
                    permissions.store_product_add &&
                    scope.row.saleChannel.search('offline') != -1
                  "
                  type="text"
                  @click="to_relationGoods(scope.row, 'offline')"
                  >关联自提商品</el-button
                >
                <el-button
                  v-if="
                    permissions.store_product_add &&
                    scope.row.saleChannel.search('online') != -1
                  "
                  type="text"
                  @click="to_relationGoods(scope.row, 'online')"
                  >关联线上商品</el-button
                >
                <el-button
                  v-if="
                    scope.row.status === 'normal' &&
                    permissions.store_status_edit
                  "
                  type="text"
                  @click="to_updateStoreStatus(scope.row)"
                  >冻结</el-button
                >
                <el-button
                  v-if="
                    scope.row.status === 'disabled' &&
                    permissions.store_status_edit
                  "
                  type="text"
                  @click="to_updateStoreStatus(scope.row)"
                  >解冻</el-button
                >
                <el-button type="text" @click="toStoreDetail(scope.row)"
                  >详情</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName === 'failed' || activeName === 'incomplete'"
            label="操作"
            width="180"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="permissions.store_edit"
                type="text"
                @click="to_edit(scope.row)"
                >{{ activeName === "failed" ? "编辑" : "完善" }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            v-if="activeName === 'disabled'"
            label="操作"
            width="180"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-if="
                  scope.row.status === 'disabled' &&
                  permissions.store_status_edit
                "
                type="text"
                @click="to_updateStoreStatus(scope.row)"
              >
                解冻
              </el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 分页 -->
      <table-pagination
        :total="pagination.total"
        :page.sync="pagination.current"
        :limit.sync="pagination.size"
        @pagination="getList"
      />
    </div>
    <!-- 修改店铺列表 -->
    <TableDraft :search="search" ref="draft" v-else />
    <!-- 关联商品 -->
    <el-dialog
      title="关联商品"
      :visible.sync="interactive.dialogFormVisible"
      width="50%"
    >
      <el-transfer
        v-model="other.value"
        filterable
        filter-placeholder="请输入内容"
        :data="relationData"
        :titles="['未关联', '已关联']"
        :button-texts="['到左边', '到右边']"
      >
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interactive.dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          v-if="permissions.store_product_add"
          type="primary"
          :loading="interactive.sureLoading"
          @click="createData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 巡检 -->
    <inspection
      ref="inspection"
      @getList="getList"
      @closeDialog="closeDialog"
      :selectStoreIds="selectStoreIds"
    />
  </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import { mapGetters } from "vuex";
import {
  pageStores,
  pageDraftStores,
  storeStatus,
  updateStoreStatus,
  getRelationProductList,
  toRelationProduct,
  getMachinesStatus,
} from "@/api/store/store";
import { getAreaNationwideTree } from "@/api/area";

import { allStoreType, getSettlementType } from "@/api/store/storeType";
import { uploadStore } from "@/api/store/business";
import inspection from "../../task/components/Inspection";
import TableDraft from "../components/TableDraft";
export default {
  components: { TablePagination, inspection, TableDraft },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      // 省市区联动
      locationNameList: {
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
                leaf: level >= 1,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      activeName: "normal",
      search: {
        searchUserType: undefined,
        searchUserValue: undefined,
        searchStoreType: undefined,
        searchStoreValue: undefined,
        storeType: undefined,
        loginMobile: undefined,
        location: undefined,
        settlementType: undefined,
        paymentCodeStatus: undefined,
        posStatus: undefined,
      },
      rules: {
        type: [
          { required: true, message: "请选择商户类型", trigger: "change" },
        ],
      },
      interactive: {
        dialogFormVisible: false,
        tableLoading: false,
        sureLoading: false,
      },
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      },
      bannedForm: {
        status: undefined,
        remark: undefined,
        storeId: undefined,
      },
      settlementTypeArr: [], //门店审核状态列表
      relationData: [],
      tableData: [],
      typeArr: [],
      statusTypeArr: [],
      storeStatusList: [],
      other: {
        value: [],
        saleChannel: undefined,
        storeId: undefined,
      },
      selectStoreIds: [],
      machinesStatus: [],
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.initPageStore();
    this.getTypes();
    this.getSettlementType();
    this.storeStatus();
    this._getMachinesStatus();
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight();
      this.watchWidth();
    });
  },
  methods: {
    batchUploadShop(event) {
      // console.log('data',data)
      // uploadStore
      const file = event.target.files[0];
      var formData = new FormData();
      formData.append("uploadFile", file);
      // console.log(formData)
      uploadStore(formData).then((res) => {
        // console.log('ccc',res)
        this.initPageStore();
      });
      // this.onUploadFile(file)
    },
    dowmShopTemplate() {
      window.open(
        "https://prod-1305433533.cos.ap-guangzhou.myqcloud.com/download/%E5%95%86%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx",
        "_bank"
      );
    },
    // 监听视口宽度变化
    watchWidth() {
      window.onresize = () => {
        this.countHeight();
      };
    },
    // 计算表格高度
    countHeight() {
      // 监听视口宽度变化
      let demoForm = document.getElementById("demo-form-inline");
      let tableBtn = document.getElementById("tableBtn");
      let tabs = 55;
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        187
      }px)`;
    },
    getList() {
      this.initPageStore();
      this.selectStoreIds = [];
    },
    // 获取机具状态
    _getMachinesStatus() {
      getMachinesStatus().then((res) => {
        console.debug("res", res);
        this.machinesStatus = res.data.data;
      });
    },
    // 关闭组件弹框
    closeDialog() {
      console.debug("111");
      this.$refs.multipleTable.clearSelection();
    },
    // 打开日常巡检弹框
    open_dailypPatrolInspection() {
      if (this.selectStoreIds.length === 0) {
        this.$message("请先选择店铺");
        return;
      }
      this.$refs.inspection.openDailyInspection();
    },
    // 打开发布巡检
    open_publishPatrolInspection() {
      if (this.selectStoreIds.length === 0) {
        this.$message("请先选择店铺");
        return;
      }
      this.$refs.inspection.openTemporaryInspection();
    },
    // 多选
    handleSelectionChange(val) {
      console.debug("val", val);
      let arr = [];
      for (let i in val) {
        arr.push(val[i].storeId);
      }
      this.selectStoreIds = arr;
    },
    // 获取入驻来源
    getSettlementType() {
      getSettlementType().then((res) => {
        this.settlementTypeArr = res.data.data;
        console.debug("res", this.settlementTypeArr);
      });
    },
    // 获取店铺类型
    getTypes() {
      allStoreType().then((res) => {
        this.typeArr = res.data.data;
      });
    },
    // tab切换
    tabview() {
      this.tableHeight = "calc(100vh - 335px)";
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      };
      this.tableData = [];
      this.initPageStore();
      setTimeout(() => {
        this.countHeight();
      }, 500);
    },
    // 去关联商品
    to_relationGoods(row, val) {
      this.other.storeId = row.storeId;
      this.other.saleChannel = val;
      this.other.value = [];
      this.relationData = [];
      this.interactive.dialogFormVisible = true;
      this.getNoRelationList();
    },
    // 查询未关联的商品
    getNoRelationList() {
      const params = {
        storeId: this.other.storeId,
        saleChannel: this.other.saleChannel,
      };
      this.interactive.tableLoading = true;
      getRelationProductList(params)
        .then((res) => {
          this.interactive.tableLoading = false;
          const page = res.data.data;
          // 将后台取到的数据循环赋值到relationData
          page.forEach((item, index) => {
            console.log(index);
            this.relationData.push({
              label: item.label,
              key: item.id,
            });
          });
        })
        .catch(() => {
          this.interactive.tableLoading = false;
        });
    },
    // 去关联商品
    createData() {
      if (this.other.value.length <= 0) {
        if (this.relationData.length === 0) {
          this.$message.warning("暂无关联商品可选择");
          return;
        } else {
          this.$message.warning("请选择关联商品");
          return;
        }
      }
      const data = {
        saleChannel: this.other.saleChannel,
        storeId: this.other.storeId,
        productIds: this.other.value,
      };
      this.interactive.sureLoading = true;
      toRelationProduct(data)
        .then(() => {
          this.$message.success("关联成功");
          this.interactive.dialogFormVisible = false;
          this.initPageStore();
          this.interactive.sureLoading = false;
        })
        .catch(() => {
          this.interactive.sureLoading = false;
        });
    },
    // 查询门店状态
    storeStatus() {
      storeStatus().then((res) => {
        this.storeStatusList = res.data.data;
        this.storeStatusList.push({
          dictName: "审核修改信息",
          dictValue: "draft",
        });
      });
    },
    // 分页获取商户列表
    initPageStore() {
      // 处理省市字段
      if (
        this.search.location &&
        this.search.location.length > 0 &&
        typeof this.search.location === "object"
      ) {
        this.search.location = this.search.location.join();
      }
      const params = {
        storeType: this.search.storeType,
        address: this.search.address,
        size: this.pagination.size,
        current: this.pagination.current,
        status: this.activeName,
        loginMobile: this.search.loginMobile,
        location: this.search.location,
        settlementType: this.search.settlementType,
        posStatus: this.search.posStatus,
        paymentCodeStatus: this.search.paymentCodeStatus,
      };
      if (this.search.searchUserValue) {
        params[this.search.searchUserType] = this.search.searchUserValue;
      }
      if (this.search.searchStoreType) {
        params[this.search.searchStoreType] = this.search.searchStoreValue;
      }
      this.interactive.tableLoading = true;
      if (this.activeName == "draft") {
        delete params.status;
        pageDraftStores(params)
          .then((resp) => {
            this.interactive.tableLoading = false;
            const page = resp.data.data;
            this.tableData = page.records.map((item) => {
              return {
                ...item,
                inviteUser: item.store.inviteUser,
                agreementStatusName: item.store.agreementStatusName,
                fullName: item.store.fullName,
                mobile: item.store.mobile,
                accountNum: item.store.accountNum,
                loginMobile: item.store.loginMobile,
              };
            });
            this.pagination.total = page.total;
            this.pagination.pages = page.pages;
          })
          .catch(() => {
            this.interactive.tableLoading = false;
          });
      } else {
        pageStores(params)
          .then((resp) => {
            this.interactive.tableLoading = false;
            const page = resp.data.data;
            this.tableData = page.records;
            this.pagination.total = page.total;
            this.pagination.pages = page.pages;
          })
          .catch(() => {
            this.interactive.tableLoading = false;
          });
      }
    },
    // 修改门店状态
    to_updateStoreStatus(val) {
      const data = {
        storeId: val.storeId,
      };
      if (val.status === "normal") {
        data.status = "disabled";
        this.toDisabled(val, data);
      } else if (val.status === "disabled") {
        data.status = "normal";
        this.toNormal(val, data);
      }
    },
    // 去解冻
    toNormal(val, data) {
      this.$confirm("确定将“" + val.storeName + "”店铺解冻吗?", "解冻提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          updateStoreStatus(data).then(() => {
            this.$message({
              type: "success",
              message: "解冻成功!",
            });
            this.initPageStore();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解冻",
          });
        });
    },
    // 去冻结
    toDisabled(val, data) {
      this.$confirm(
        "确定要冻结“" +
          val.storeName +
          "”店铺吗? 冻结后无法登录商户平台，用户将查看不到该店铺，并且该店铺商品也会同时下架",
        "冻结提示",
        {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning",
        }
      )
        .then(() => {
          updateStoreStatus(data).then(() => {
            this.$message({
              type: "success",
              message: "冻结成功!",
            });
            this.initPageStore();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消冻结",
          });
        });
    },
    // 去搜索
    to_search() {
      console.debug("111", this.activeName);
      if (this.activeName === "draft") {
        this.$refs.draft.toSearch();
      } else {
        this.initPageStore();
      }
    },
    // 重置
    reset() {
      this.search = {
        searchUserType: undefined,
        searchUserValue: undefined,
        searchStoreType: undefined,
        searchStoreValue: undefined,
        storeType: undefined,
        loginMobile: undefined,
        location: undefined,
        settlementType: undefined,
        posStatus: undefined,
        paymentCodeStatus: undefined,
      };
      this.pagination = {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      };
      if (this.activeName === "draft") {
        console.debug("this.search", this.search);
        this.$refs.draft.toReset();
      } else {
        this.initPageStore();
      }
    },
    // 去审核
    to_Compile(rowData) {
      if (this.activeName === "audit") {
        this.$router.push(
          "/business/store/auditDetails?storeId=" + rowData.storeId
        );
      } else {
        this.$router.push(
          "/business/store/auditDetails?draftId=" + rowData.draftId
        );
      }
    },
    // 去新增门店
    toAddStore() {
      this.$router.push("/business/store/inctease");
    },
    // 去编辑
    to_edit(row) {
      this.$router.push(`/business/store/compile/${row.storeId}`);
    },
    // 去详情
    toStoreDetail(row) {
      this.$router.push("/business/store/detail?storeId=" + row.storeId);
    },
  },
};
</script>
<style lang="scss" scoped>
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: rgb(32, 160, 255);
  }
}
.el-transfer__buttons {
  display: flex !important;
  justify-content: center;
  align-items: center;
}
.el-input-group__prepend {
  background: #fff !important;
}
</style>
