<template>
  <div>
    <el-table
      v-loading="interactive.tableLoading"
      :empty-text="$t('message.table_empty_text')"
      :data="draftList"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
      ref="multipleTable"
    >
      <template v-if="!interactive.tableLoading">
        <el-table-column label="店铺编号" prop="store.storeNo">
          <template slot-scope="scope">
            {{
              scope.row.store && scope.row.store.storeNo
                ? scope.row.store.storeNo
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column label="提交人" width="150">
          <template slot-scope="scope">
            <div>
              昵称：{{ scope.row.user ? scope.row.user.username : "--" }}
            </div>
            <div>
              手机号：{{ scope.row.user ? scope.row.user.mobile : "--" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" prop="createTime"></el-table-column>
        <el-table-column label="店铺名称">
          <template slot-scope="scope">
            <span>{{ scope.row.storeName ? scope.row.storeName : "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属商圈">
          <template slot-scope="scope">
            {{ scope.row.districtName ? scope.row.districtName : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="店铺地址" prop="address"></el-table-column>
        <el-table-column label="负责人姓名" width="100">
          <template slot-scope="scope">
            {{
               scope.row.fullName
                ? scope.row.fullName
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column label="负责人手机号" width="120">
          <template slot-scope="scope">
            <span>{{
              scope.row.mobile ? scope.row.mobile : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="pos机状态">
          <template slot-scope="scope">
            {{ scope.row.posStatusName ? scope.row.posStatusName : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="聚合码状态" width="100">
          <template slot-scope="scope">
            {{
              scope.row.paymentCodeStatusName
                ? scope.row.paymentCodeStatusName
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="statusName"></el-table-column>
        <el-table-column label="备注原因">
          <template slot-scope="scope">
            {{ scope.row.remark ? scope.row.remark : "--" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="to_examine(scope.row.draftId)"
                v-if="scope.row.status === 'audit'"
              >
                审核
              </el-button>
              <el-button
                type="text"
                @click="to_check(scope.row.draftId)"
                v-else
              >
                查看
              </el-button>
            </div>
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
</template>
<script>
import TablePagination from "@/components/table-pagination";
import { getDraftPage } from "@/api/store/store";
export default {
  components: { TablePagination },
  props:{
    search:{
      typeof:Object,
      default: {},
    }
  },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      draftList: [],
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      },
      interactive: {
        tableLoading: false,
      },
      searchObj:{},
    };
  },
  watch:{
    search:{
      handler(newVal,oldVal){
        console.debug('newVal',newVal)
        this.searchObj = newVal
      },
      deep:true
    }
  },
  created() {
    this.searchObj = this.search
    this._getDraftPageList();
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
      let tabs = 55;
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        tabs +
        187
      }px)`;
    },
    getList() {
      this._getDraftPageList();
    },
    // 搜索
    toSearch(){
      this._getDraftPageList()
    },
    // 重置
    toReset(){
      this.interactive.tableLoading = true;
      setTimeout(()=>{
        this._getDraftPageList()
      },500)
    },
    // 获取列表
    _getDraftPageList() {
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        paymentCodeStatus:this.search.paymentCodeStatus,
        posStatus:this.search.posStatus,
        status:this.search.status,
        location:this.search.location,
        storeId:this.search.storeId,
        storeName:this.search.storeName
      };
      if (this.search.searchUserValue) {
        data[this.search.searchUserType] = this.search.searchUserValue;
      }
      if (this.search.searchStoreType) {
        data[this.search.searchStoreType] = this.search.searchStoreValue;
      }
      this.interactive.tableLoading = true;
      getDraftPage(data)
        .then((res) => {
          console.debug("draft", res);
          this.draftList = res.data.data.records;
          this.pagination.size = res.data.data.size;
          this.pagination.current = res.data.data.current;
          this.pagination.total = res.data.data.total;
          this.interactive.tableLoading = false;
        })
        .catch(() => {
          this.interactive.tableLoading = false;
        });
    },
    // 去审核
    to_examine(draftId) {
      this.$router.push(`/business/store/draft/${draftId}`);
    },
    //去查看
    to_check(draftId) {
      this.$router.push(`/business/store/draft/${draftId}`);
    },
  },
};
</script>
