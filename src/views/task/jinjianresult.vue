<template>
  <div class="main-content task-list">
    <el-form ref="searchForm" :inline="true" :model="parameter" id="demo-form-inline">
      <el-form-item label="创客搜索：">
        <el-input v-model="search.searchValue" style="width: 100%" placeholder="请输入内容" class="input-with-select">
          <el-select v-model="search.searchType" placeholder="请选择" slot="prepend">
            <el-option label="创客昵称" value="username"></el-option>
            <el-option label="创客姓名" value="fullName"></el-option>
            <el-option label="创客手机号" value="mobile"></el-option> </el-select></el-input>
      </el-form-item>
      <el-form-item label="地区：" prop="location">
        <el-cascader ref="cascader" v-model="parameter.location" :props="locationNameList" :show-all-levels="false"
          placeholder="请选择省市" clearable></el-cascader>
      </el-form-item>
      <!-- 注册时间 -->
      <el-form-item label="时间段：">
        <el-date-picker v-model="parameter.registerDate" type="daterange" range-separator="-" start-placeholder="开始日期"
          end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable="false"
          @change="createTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="to_search">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="to_reset()">重置</el-button>
        <el-button icon="el-icon-paperclip" type="primary" @click="to_excel">导出报表</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :empty-text="$t('message.table_empty_text')" :data="list" border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :height="tableHeight">
      <el-table-column label="商户名称" prop="storeName"></el-table-column>
      <el-table-column label="渠道" width="100" prop="bankTypeName"></el-table-column>
      <el-table-column label="所在地区" prop="locationName"></el-table-column>
      <el-table-column label="业务员信息" prop="busId" width="180">
        <template slot-scope="scope">
          <div>
            昵称：
            {{ scope.row.user ? scope.row.user.username ? scope.row.user.username : "--" : "--" }}
          </div>
          <div>
            姓名：
            {{ scope.row.user ? scope.row.user.fullName ? scope.row.user.fullName : "--" : "--" }}
          </div>
          <div>
            联系方式：{{ scope.row.user ? scope.row.user.mobile ? scope.row.user.mobile : "--" : "--" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结果状态" prop="statusName" width="150"></el-table-column>
      <el-table-column label="提交时间" prop="createTime" width="150"></el-table-column>
      <el-table-column label="操作" prop="userId" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="to_audit(scope.row)"
            v-if="permissions.task_result_audit && scope.row.status === 'audit'">审核</el-button>
          <el-button type="text" @click="to_detail(scope.row.storeId, scope.row.resultId)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination :total="pagination.total" :page.sync="pagination.current" :limit.sync="pagination.size"
      @pagination="getList" />
    <!-- 审核结果弹框 -->
    <ResultAudit ref="auditDialog" :auditItem="auditItem" />

    <!-- 商户进件详情弹窗 -->
    <el-dialog title="商户进件详情" :visible.sync="detailVisible" width="75%" class="detail">
      <div v-if="detailForm" class="content">
        <h3>商户基本信息：</h3>
        <el-form ref="detailForm" :model="detailForm" label-width="150px" label-position="right">
          <el-form-item label="商家名称：">
            {{ detailForm.storeName }}
          </el-form-item>
          <el-form-item label="商家地址：">
            {{ detailForm.locationName + detailForm.address }}
          </el-form-item>
          <el-form-item label="商户联系人信息：">
            {{ `${detailForm.fullName}(${detailForm.mobile})` }}
          </el-form-item>
          <el-form-item label="商户类型：">
            {{ detailForm.businessTypeName }}
          </el-form-item>
          <el-form-item label="申请进件渠道：">
            {{ detailForm.storeBankResp.bankTypeName }}
          </el-form-item>
          <el-form-item label="申请机具：">
            <el-row :gutter="20">
              <el-col :span="6">
                <span v-if="detailForm.storeBankResp.postStatus != 'unused'">POS机：{{ detailForm.storeBankResp.posNo
                }}</span>
              </el-col>
              <el-col :span="6">
                <span v-if="detailForm.storeBankResp.paymentCodeStatus != 'unused'">码牌：{{
                  detailForm.storeBankResp.paymentCodeNo }}</span></el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="费率：">
            {{ detailForm.storeBankResp.bankRate }}
          </el-form-item>
        </el-form>
        <el-form v-if="detailForm.businessLicenseResp" ref="detailForm.businessLicenseResp"
          :model="detailForm.businessLicenseResp" label-width="150px" label-position="right">
          <h3>商户资质材料</h3>
          <el-form-item label="图片：">
            <el-row :gutter="10">
              <el-col :span="3">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.businessLicenseResp.imageUrl"
                    :preview-src-list="srcLisenceList"></el-image></div>
                <div>营业执照</div>
              </el-col>
              <el-col :span="3">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.businessLicenseResp.doorHeadUrl"
                    :preview-src-list="srcLisenceList"></el-image></div>
                <div>商户门头照</div>
              </el-col>
              <el-col :span="3">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.businessLicenseResp.storeBusinessUrl"
                    :preview-src-list="srcLisenceList"></el-image></div>
                <div>商户店内经营照</div>
              </el-col>
              <el-col :span="3">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.businessLicenseResp.cashierUrl"
                    :preview-src-list="srcLisenceList"></el-image></div>
                <div>商户收银台照</div>
              </el-col>
              <el-col :span="3">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.businessLicenseResp.staffDoorHeadUrl"
                    :preview-src-list="srcLisenceList"></el-image></div>
                <div>工作人员与门头合照</div>
              </el-col>
              <el-col :span="3">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.businessLicenseResp.otherUrl"
                    :preview-src-list="srcLisenceList"></el-image></div>
                <div>其他辅助材料</div>
              </el-col>
              <el-col :span="3">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.businessLicenseResp.openProveUrl"
                    :preview-src-list="srcLisenceList"></el-image></div>
                <div>开户证明材料</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="营业执照名称：">
            {{ detailForm.businessLicenseResp.companyName }}
          </el-form-item>
          <el-form-item label="统一社会信用代码：">
            {{ detailForm.businessLicenseResp.regNum }}
          </el-form-item>
          <el-form-item label="类型：">
            {{ detailForm.businessLicenseResp.type }}
          </el-form-item>
          <el-form-item label="法人：">
            {{ detailForm.businessLicenseResp.legalMan }}
          </el-form-item>
          <el-form-item label="注册时间：">
            {{ detailForm.businessLicenseResp.regDate }}
          </el-form-item>
          <el-form-item label="注册地址：">
            {{ detailForm.businessLicenseResp.address }}
          </el-form-item>
          <el-form-item label="经营范围：">
            {{ detailForm.businessLicenseResp.businessScope }}
          </el-form-item>
        </el-form>
        <el-form v-if="detailForm.identityRealNameResp" ref="detailForm.identityRealNameResp"
          :model="detailForm.identityRealNameResp" label-width="150px" label-position="right">
          <h3>法人资料</h3>
          <el-form-item label="图片：">
            <el-row :gutter="10">
              <el-col :span="4">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.identityRealNameResp.cardFront"
                    :preview-src-list="srcLegalList"></el-image></div>
                <div>法人身份证正面</div>
              </el-col>
              <el-col :span="4">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.identityRealNameResp.cardBack"
                    :preview-src-list="srcLegalList"></el-image></div>
                <div>法人身份证反面</div>
              </el-col>
              <el-col :span="4">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.identityRealNameResp.userCardPhoto"
                    :preview-src-list="srcLegalList"></el-image></div>
                <div>法人手持身份证合照</div>
              </el-col>
              <el-col :span="4">
                <div><el-image style="width: 100px; height: 100px" :src="detailForm.identityRealNameResp.userLicensePhoto"
                    :preview-src-list="srcLegalList"></el-image></div>
                <div>法人与原件营业执照合照</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="姓名：">
            {{ detailForm.identityRealNameResp.fullName }}
          </el-form-item>
          <el-form-item label="手机号：">
            {{ detailForm.identityRealNameResp.mobile }}
          </el-form-item>
          <el-form-item label="身份证号码：">
            {{ detailForm.identityRealNameResp.idCard }}
          </el-form-item>
          <el-form-item label="身份证有效期：">
            {{ `${detailForm.identityRealNameResp.startDate} 至 ${detailForm.identityRealNameResp.endDate}` }}
          </el-form-item>
        </el-form>
        <el-form v-if="detailForm.collectionAccountResp" ref="detailForm.collectionAccountResp"
          :model="detailForm.collectionAccountResp" label-width="150px" label-position="right">
          <h3>收款信息</h3>
          <el-form-item label="图片：">
            <div><el-image style="width: 100px; height: 100px" :src="detailForm.collectionAccountResp.bankCardUrl"
                :preview-src-list="srcAccountList"></el-image></div>
            <div>法人银行卡照片</div>
          </el-form-item>
          <el-form-item label="银行卡号：">
            {{ detailForm.collectionAccountResp.bankCardNo }}
          </el-form-item>
          <el-form-item label="开户姓名：">
            {{ detailForm.collectionAccountResp.fullName }}
          </el-form-item>
          <el-form-item label="开户行：">
            {{ detailForm.collectionAccountResp.bankName }}
          </el-form-item>
          <el-form-item label="预留手机号：">
            {{ detailForm.collectionAccountResp.mobile }}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import TablePagination from "@/components/table-pagination";
import ResultAudit from "./components/result-audit";
import { reqResultByStoreJinjian, reqStoreDetailByJinjian, reqExportResultByJinjian } from "@/api/task/list";
import { getAreaNationwideTree } from "@/api/area";
export default {
  components: {
    TablePagination,
    ResultAudit,
  },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      // 省市区联动
      locationNameList: {
        checkStrictly: true,
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
                leaf: level >= 2,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      listLoading: false,
      // 详情弹窗
      detailVisible: false,
      // 详情内容
      detailForm: null,
      // 审核弹窗
      dialogFormVisible: false,
      // 搜索参数
      parameter: {
        location: null,
        startTime: null,
        endTime: null,
        fullName: null,
        mobile: null
      },
      // 营业资质图片列表
      srcLisenceList: [],
      srcLegalList: [],
      srcAccountList: [],
      search: {
        searchType: undefined,
        searchValue: undefined,
      },
      list: [],
      auditItem: null,
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //总条数
        total: 0,
      },
      formData: null,
    };
  },
  created() {
    this._getReqTaskResultPage();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight();
      this.watchWidth();
    });
  },
  methods: {
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
      let dataHeight = document.getElementById("statistical");
      this.tableHeight = `calc(100vh - ${(demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        (dataHeight ? dataHeight.offsetHeight + 50 : 0) + 190}px)`;
    },
    //创建日期时间触发
    createTime(val) {
      const [startDate, endDate] = val;
      this.parameter.startTime = startDate;
      this.parameter.endTime = endDate;
    },
    getList() {
      this._getReqTaskResultPage();
    },
    // 任务列表
    _getReqTaskResultPage() {
      let location = null;
      if (this.parameter.location) {
        location = this.parameter.location.join(",");
      }
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        location: location,
        typeCode: 'abc_store',
        startTime: this.parameter.startTime,
        endTime: this.parameter.endTime,
      };
      if (this.search.searchType) {
        data[this.search.searchType] = this.search.searchValue;
      }
      console.debug("aa", data, this.search.searchType);
      this.listLoading = true;
      this.formData = data;
      reqResultByStoreJinjian(data)
        .then((res) => {
          console.debug("res", res);
          this.list = res.data.data.records;
          this.pagination.total = res.data.data.total;
          this.pagination.current = res.data.data.current;
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 打开审核
    to_audit(val) {
      this.auditItem = val;
      setTimeout(() => {
        this.$refs.auditDialog.show();
      }, 200);
    },
    handleClose() {
      this.dialogFormVisible = false;
    },
    to_detail(storeId, resultId) {
      this.detailVisible = true;
      this.detailForm = null;
      reqStoreDetailByJinjian(storeId, resultId).then(res => {
        this.detailForm = res.data.data
      });
    },
    // 搜索
    to_search() {
      this._getReqTaskResultPage();
      this.pagination.current = 1;
    },
    // 重置
    to_reset() {
      this.parameter = {
        location: null,
        startTime: null,
        endTime: null,
      };
      this.search = {
        searchType: null,
        searchValue: null,
      };
      this._getReqTaskResultPage();
    },
    // 导出报表
    // 导出功能
    to_excel() {
      this.downBlobFile(`/ope/task/store/result/download`, this.formData, `商户进件.xlsx`)
    },
  },
};
</script>
<style scoped>
.statistical-data {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
  margin-top: 10px;
}

.statistical-item {
  width: 240px;
  height: 80px;
  margin: 10px;
  /* background-color: rgb(232, 232, 232); */
  box-shadow: 12px 12px 20px 12px rgba(232, 232, 232, 0.5);
  border-radius: 8px;
}

.statistical-item-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.statistical-item-num {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.green-text {
  font-size: 16px;
  font-weight: bold;
  color: #1abc9c;
  margin: 0px 5px;
}
</style>
