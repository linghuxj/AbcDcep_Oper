/* eslint-disable vue/valid-v-model */
<template>
  <div class="main-content">
    <el-form
      :inline="true"
      :model="paramter"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <el-form-item label="商圈名称：">
        <el-input
          v-model="paramter.districtName"
          placeholder="请输入商圈名称"
        ></el-input>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </el-form>
    <div id="tableBtn">
      <el-button
        v-if="permissions.business_district_add"
        icon="el-icon-plus"
        type="primary"
        @click="addCommerce"
        >新增商圈</el-button
      >
      <el-button
        v-if="permissions.business_district_sort_edit"
        type="success"
        @click="getBusinessSortList"
        >商圈排序</el-button
      >
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="正常" name="normal">
        <el-table
          v-loading="listLoading"
          :data="businessList"
          fit
          highlight-current-row
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          :height="tableHeight"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column
            label="商圈名称"
            prop="id"
            align="center"
            width="160"
          >
            <template slot-scope="{ row }">
              <span>{{ row.districtName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联门店数（家）" align="center" width="120">
            <template slot-scope="{ row }">
              <span
                class="jump-num"
                @click="getdetailBusiness(row.districtId)"
                >{{ row.relationStoreNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="关联圈子数（个）" align="center" width="120">
            <template slot-scope="{ row }">
              <span
                class="jump-num"
                @click="getdetailBusiness(row.districtId)"
                >{{ row.relationCircleNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            v-if="permissions.business_district_show_edit"
            label="商圈展示"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.showStatus"
                :active-value="active_value"
                :inactive-value="inactive_value"
                @change="to_changeStatus(row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="商圈排序" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="135">
            <template slot-scope="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            width="300"
            class-name="small-padding fixed-width"
            fixed="right"
          >
            <template slot-scope="{ row }">
              <el-button type="text" @click="getdetailBusiness(row.districtId)">
                详情
              </el-button>
              <el-button
                v-if="
                  row.status != 'published' &&
                  permissions.business_district_store_edit
                "
                type="text"
                @click="openRelationStore(row.districtId)"
              >
                关联门店
              </el-button>
              <el-button
                v-if="
                  row.status != 'draft' &&
                  permissions.business_district_circle_edit
                "
                type="text"
                @click="openRelationCircle(row.districtId)"
              >
                关联圈子
              </el-button>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-button type="text">更多</el-button>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="permissions.business_district_edit"
                    @click.native="toEdit(row)"
                    >编辑</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="permissions.business_district_status_edit"
                    @click.native="downCircle(row)"
                    >下架</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="已下架" name="disabled">
        <el-table
          v-loading="listLoading"
          :data="disabledBusinessList"
          fit
          highlight-current-row
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" />
          <el-table-column label="商圈名称" prop="id" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.districtName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关联门店数（家）" align="center" width="150">
            <template slot-scope="{ row }">
              <span
                class="jump-num"
                @click="getdetailBusiness(row.districtId)"
                >{{ row.relationStoreNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="关联圈子数（个）" align="center" width="150">
            <template slot-scope="{ row }">
              <span class="jump-num">{{ row.relationCircleNum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="permissions.business_district_show_edit"
            label="商圈展示"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-switch
                v-model="row.showStatus"
                :active-value="active_value"
                :inactive-value="inactive_value"
                @change="to_changeStatus(row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="
                下架时间"
            align="center"
            width="200"
          >
            <template slot-scope="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="getdetailBusiness(scope.row.districtId)"
              >
                详情
              </el-button>
              <el-button
                v-if="permissions.business_district_status_edit"
                type="text"
                @click="toNormalBussiness(scope.row)"
              >
                上架
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 分页 -->
      <table-pagination
        :total="paginationAll.total"
        :page.sync="paginationAll.current"
        :limit.sync="paginationAll.size"
        @pagination="getListAll"
      />
    </el-tabs>
    <!-- 商圈排序 -->
    <el-dialog title="商圈排序" :visible.sync="sortBusinessDialog" width="30%">
      <div class="sortBusiness_list">
        <div
          v-for="(item, index) in businessSortArr"
          :key="index"
          class="sortBusiness_list_item"
          @mouseenter="businessEnter(index)"
          @mouseleave="businessLeave()"
        >
          <div>NO.{{ item.sort }} {{ item.districtName }}</div>
          <div v-if="item.selectStatus">
            <i
              v-show="index != 0"
              class="el-icon-top"
              @click="sortUp(index, item)"
            ></i>
            <i
              v-show="index != businessSortArr.length - 1"
              class="el-icon-bottom"
              @click="sortDown(index, item)"
            ></i>
            <!-- <i class="el-icon-delete" @click="toDelete(index,item)"></i> -->
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="toUpdateBusinessSortList()"
          >保存</el-button
        >
        <el-button @click="sortBusinessDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 关联门店 -->
    <el-dialog title="关联店铺" :visible.sync="relationStoreDialog" width="70%">
      <el-tabs v-model="activeName_relation" @tab-click="handleRelationStore">
        <el-tab-pane
          :label="'未关联' + relationStoreNumData.notRelationNum"
          name="norelation"
        >
          <el-table
            :data="notRelationList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            style="width: 100%"
            @selection-change="relationStore"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              label="门店名称"
              prop="storeName"
            ></el-table-column>
            <el-table-column label="营业时间">
              <template slot-scope="{ row }">
                <span>{{ row.startTime }}-{{ row.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          :label="'已关联' + relationStoreNumData.relationNum"
          name="relation"
        >
          <el-table
            :data="relationList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            style="width: 100%"
            @selection-change="relationStore"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              label="门店名称"
              prop="storeName"
            ></el-table-column>
            <el-table-column label="营业时间">
              <template slot-scope="{ row }">
                <span>{{ row.startTime }}-{{ row.endTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </el-tabs>
      <div style="text-align: center">
        <el-button type="primary" @click="to_sureRelation()">
          {{ activeName_relation === "norelation" ? "确定关联" : "取消关联" }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 新增关联圈子 -->
    <el-dialog
      title="关联圈子"
      :visible.sync="relationCircleDialog"
      width="70%"
    >
      <el-tabs v-model="activeName_circle" @tab-click="handleClick_circle">
        <el-tab-pane
          :label="'未关联' + relationCircleNumData.notRelationNum"
          name="noRelationCircle"
        >
          <el-table
            :data="notRelationCircleList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            style="width: 100%"
            @selection-change="relationCircle"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              label="圈子名称"
              prop="circleName"
            ></el-table-column>
            <el-table-column label="圈子类型" prop="circleType">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.circleTypeName
                      ? scope.row.circleTypeName
                      : scope.row.circleType
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="圈子成员数">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.circleUserCount ? scope.row.circleUserCount : 0
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="圈子动态数">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.circleNoteCount ? scope.row.circleNoteCount : 0
                  }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          :label="'已关联' + relationCircleNumData.relationNum"
          name="relationCircle"
        >
          <el-table
            :data="relationCircleList"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            style="width: 100%"
            @selection-change="relationCircle"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              label="圈子名称"
              prop="circleName"
            ></el-table-column>
            <el-table-column label="圈子类型" prop="circleType">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.circleTypeName
                      ? scope.row.circleTypeName
                      : scope.row.circleType
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="圈子成员数">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.circleUserCount ? scope.row.circleUserCount : 0
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="圈子动态数">
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.circleNoteCount ? scope.row.circleNoteCount : 0
                  }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </el-tabs>
      <div style="text-align: center">
        <el-button type="primary" @click="to_sureRelationCircle()">
          {{
            activeName_circle === "noRelationCircle" ? "确定关联" : "取消关联"
          }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Vue from "vue";
import TablePagination from "@/components/table-pagination";
import {
  getNormalBusiness,
  getDisabledBusiness,
  downBusinessCircle,
  upBusinessCircle,
  getCountRelationCircle,
  getCountRelationStore,
  getRelationBusiness,
  getNotRelationBusiness,
  getNotRelationCircle,
  getRelationCircle,
  toRelationStore,
  cancleRelationStore,
  toRelationCircle,
  deleteRelationCircle,
  showBusiness,
  notShowBusiness,
  businessSortList,
  updateBusinessSortList,
} from "@/api/commerce/commerce.js";
// import UploadImg from 'wangeditor/dist/menus/img/upload-img'
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      listLoading: false,
      relationStoreDialog: false,
      relationCircleDialog: false,
      sortBusinessDialog: false,
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      },
      // 外部表格的分页
      paginationAll: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      },
      activeName: "normal",
      activeName_relation: "norelation",
      activeName_circle: "noRelationCircle",
      businessList: [],
      disabledBusinessList: [],
      relationCircleNumData: {
        notRelationNum: 0,
        relationNum: 0,
      },
      notRelationCircleList: [],
      relationCircleList: [],
      notRelationList: [],
      relationList: [],
      // 多选关联门店集合
      relationStoreArr: [],
      // 多选关联圈子集合
      relationCircleArr: [],
      storeIds: null,
      relationStoreNumData: {
        notRelationNum: 0,
        relationNum: 0,
      },
      paramter: {
        districtName: undefined,
      },
      active_value: true,
      inactive_value: false,
      //商圈排序数组
      businessSortArr: [],
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  created() {
    this.getNormalList();
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
    // 获取列表
    getListAll() {
      if (this.activeName === "normal") {
        this.getNormalList();
      } else if (this.activeName === "disabled") {
        this.getDisabledList();
      }
    },
    // 内部分页列表
    getList() {
      if (this.relationStoreDialog) {
        if (this.activeName_relation === "norelation") {
          this.getNotRelationBusinessList(this.districtId);
        } else {
          this.getRelationBusinessList(this.districtId);
        }
      } else if (this.relationCircleDialog) {
        if (this.activeName_circle === "noRelationCircle") {
          this.getNotRelationCircleList(this.districtId);
        } else {
          this.getRelationCircleList(this.districtId);
        }
      }
    },
    // 查询正常商圈列表
    getNormalList() {
      const data = {
        current: this.paginationAll.current,
        size: this.paginationAll.size,
        districtName: this.paramter.districtName,
      };
      getNormalBusiness(data).then((res) => {
        console.debug("res", res);
        this.businessList = res.data.data.records;
        this.paginationAll.total = res.data.data.total;
        this.paginationAll.pages = res.data.data.pages;
        this.paginationAll.size = res.data.data.size;
        this.pagination.current = res.data.data.current;
        console.debug("this.paginationAll", this.paginationAll);
      });
    },
    // 查询已下架商圈列表
    getDisabledList() {
      const data = {
        current: this.paginationAll.current,
        size: this.paginationAll.size,
        districtName: this.paramter.districtName,
      };
      getDisabledBusiness(data).then((res) => {
        this.disabledBusinessList = res.data.data.records;
        this.paginationAll.total = res.data.data.total;
        this.paginationAll.pages = res.data.data.pages;
        this.paginationAll.size = res.data.data.size;
        this.pagination.current = res.data.data.current;
      });
    },
    // 鼠标移入事件
    businessEnter(index) {
      const businessSortArr = this.businessSortArr;
      for (const i in businessSortArr) {
        if (Number(i) === index) {
          businessSortArr[i].selectStatus = true;
        } else {
          businessSortArr[i].selectStatus = false;
        }
      }
      this.businessSortArr = businessSortArr;
    },
    // 鼠标移出事件
    businessLeave() {
      const businessSortArr = this.businessSortArr;
      for (const i in businessSortArr) {
        businessSortArr[i].selectStatus = false;
      }
      this.businessSortArr = businessSortArr;
    },
    //上移
    sortUp(index) {
      const temp = this.businessSortArr[index - 1];
      Vue.set(this.businessSortArr, index - 1, this.businessSortArr[index]);
      Vue.set(this.businessSortArr, index, temp);
    },
    // 下移
    sortDown(index) {
      const i = this.businessSortArr[index + 1];
      Vue.set(this.businessSortArr, index + 1, this.businessSortArr[index]);
      Vue.set(this.businessSortArr, index, i);
    },
    //删除
    // toDelete(index, row) {},
    // 查询商圈排序
    getBusinessSortList() {
      businessSortList().then((res) => {
        const businessSortArr = res.data.data;
        for (const i in businessSortArr) {
          businessSortArr[i].selectStatus = false;
        }
        this.businessSortArr = businessSortArr;
        this.sortBusinessDialog = true;
      });
    },
    // 修改排序
    toUpdateBusinessSortList() {
      const arr = this.businessSortArr.map((item) => {
        return item.districtId;
      });
      updateBusinessSortList({ districtIds: arr })
        .then(() => {
          this.$message.success("修改成功");
          this.sortBusinessDialog = false;
          // this.getListAll()
        })
        .catch((res) => {
          this.$message(res);
        });
    },
    // 监听正常商圈展示隐藏
    to_changeStatus(row) {
      if (row.showStatus) {
        this.toShowBusiness(row.districtId);
      } else {
        this.toNotShowBusiness(row.districtId);
      }
    },
    // 展示商圈
    toShowBusiness(districtId) {
      showBusiness(districtId)
        .then(() => {
          this.$message.success("展示成功");
          this.getListAll();
        })
        .catch((res) => {
          this.$message(res);
        });
    },
    // 不展示商圈
    toNotShowBusiness(districtId) {
      notShowBusiness(districtId)
        .then(() => {
          this.$message.success("取消展示成功");
          this.getListAll();
        })
        .catch((res) => {
          this.$message(res);
        });
    },
    // 获取关联门店id
    relationStore(val) {
      this.relationStoreArr = val;
    },
    // 下架商圈
    downCircle(row) {
      this.$confirm(
        "是否要下架“" +
          row.districtName +
          "”商圈？" +
          (row.showStatus === 1 ? "该商圈目前正在用户端商圈列表展示" : ""),
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          downBusinessCircle(row.districtId).then(() => {
            this.$message({
              type: "success",
              message: "下架成功!",
            });
            this.getListAll();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下架",
          });
        });
    },
    // 上架商圈
    toNormalBussiness(row) {
      this.$confirm("是否要上架“" + row.districtName + "”商圈？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          upBusinessCircle(row.districtId).then(() => {
            this.$message({
              type: "success",
              message: "上架成功!",
            });
            this.getListAll();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消上架",
          });
        });
    },
    // 跳转商圈详情
    getdetailBusiness(val) {
      this.$router.push(`/commerce/detailCommerce?districtId=${val}`);
    },
    // 去关联或取消
    to_sureRelation() {
      // return
      const arr = [];
      const cancelArr = [];
      if (this.relationStoreArr.length <= 0) {
        this.$message.warning("请选择操作对象");
        return;
      } else {
        for (const i of this.relationStoreArr) {
          arr.push(i.storeId);
          cancelArr.push(i.id);
        }
      }
      if (this.activeName_relation === "norelation") {
        const data = {
          storeIds: arr,
          districtId: this.districtId,
        };
        toRelationStore(data).then(() => {
          this.$message.success("关联成功");
          this.getCountRelationStore_num(this.districtId);
          this.getNotRelationBusinessList(this.districtId);
        });
      } else {
        console.debug("cancelArr", cancelArr.join(","));
        let ids = cancelArr.join(",");
        cancleRelationStore(ids).then(() => {
          this.$message.success("取消关联成功");
          this.getCountRelationStore_num(this.districtId);
          this.getRelationBusinessList(this.districtId);
        });
      }
    },
    // 查询关联门店列表
    getRelationBusinessList(districtId) {
      const data = {
        size: this.pagination.size,
        current: this.pagination.current,
        districtId: districtId,
      };
      getRelationBusiness(data).then((res) => {
        this.districtId = districtId;
        this.relationList = res.data.data.records;
        this.pagination.total = res.data.data.total;
        this.pagination.pages = res.data.data.pages;
      });
    },
    // 查询未关联门店列表
    getNotRelationBusinessList(districtId) {
      const data = {
        size: this.pagination.size,
        current: this.pagination.current,
        districtId: districtId,
      };
      getNotRelationBusiness(data).then((res) => {
        this.districtId = districtId;
        this.notRelationList = res.data.data.records;
        this.pagination.total = res.data.data.total;
        this.pagination.pages = res.data.data.pages;
      });
    },
    // 去关联圈子
    to_sureRelationCircle() {
      const arr = [];
      const cancelArr = [];
      if (this.relationCircleArr.length <= 0) {
        this.$message.warning("请选择操作对象");
        return;
      } else {
        for (const i of this.relationCircleArr) {
          arr.push(i.circleId);
          cancelArr.push(i.id);
        }
      }
      if (this.activeName_circle === "noRelationCircle") {
        const data = {
          districtId: this.districtId,
          circleIds: arr,
        };
        toRelationCircle(data)
          .then(() => {
            this.$message.success("关联成功");
            this.getCountRelationCircle_num(this.districtId);
            this.getNotRelationCircleList(this.districtId);
          })
          .catch((res) => {
            this.$message(res);
          });
      } else {
        const data = {
          relationBusinessDistrictCircleIds: cancelArr,
        };
        console.debug("data", data);
        deleteRelationCircle(data).then(() => {
          this.$message.success("取消关联成功");
          this.getCountRelationCircle_num(this.districtId);
          this.getRelationCircleList(this.districtId);
        });
      }
    },
    // 查询关联圈子列表
    getRelationCircleList(districtId) {
      const data = {
        size: this.pagination.size,
        current: this.pagination.current,
        districtId: districtId,
      };
      getRelationCircle(data).then((res) => {
        this.districtId = districtId;
        this.relationCircleList = res.data.data.records;
        this.pagination.total = res.data.data.total;
        this.pagination.pages = res.data.data.pages;
      });
    },
    // 获取关联圈子ID
    relationCircle(val) {
      this.relationCircleArr = val;
    },
    // 查询未关联圈子列表
    getNotRelationCircleList(districtId) {
      const data = {
        size: this.pagination.size,
        current: this.pagination.current,
        districtId: districtId,
      };
      getNotRelationCircle(data).then((res) => {
        this.districtId = districtId;
        this.notRelationCircleList = res.data.data.records;
        this.pagination.total = res.data.data.total;
        this.pagination.pages = res.data.data.pages;
      });
    },
    // 查询圈子关联数量
    getCountRelationCircle_num(districtId) {
      getCountRelationCircle(districtId).then((res) => {
        this.relationCircleNumData = res.data.data;
      });
    },
    // 查询相关门店关联数量
    getCountRelationStore_num(districtId) {
      getCountRelationStore(districtId).then((res) => {
        this.relationStoreNumData = res.data.data;
      });
    },
    // 打开关联/未关联门店弹框
    openRelationStore(districtId) {
      this.relationStoreDialog = true;
      this.activeName_relation = "norelation";
      this.districtId = districtId;
      this.getCountRelationStore_num(districtId);
      this.getNotRelationBusinessList(districtId);
    },
    // 关联/未关联门店表格切换
    handleRelationStore(tab) {
      if (tab.name === "norelation") {
        this.activeName_relation = "norelation";
        this.getNotRelationBusinessList(this.districtId);
      } else if (tab.name === "relation") {
        this.activeName_relation = "relation";
        this.getRelationBusinessList(this.districtId);
      }
    },
    // 打开关联/未关联圈子弹框
    openRelationCircle(districtId) {
      this.relationCircleDialog = true;
      this.getCountRelationCircle_num(districtId);
      this.getNotRelationCircleList(districtId);
    },
    // 关联/未关联圈子表格切换
    handleClick_circle(tab) {
      if (tab.name === "noRelationCircle") {
        this.activeName_relation = "noRelationCircle";
        this.getNotRelationCircleList(this.districtId);
      } else if (tab.name === "relationCircle") {
        this.activeName_relation = "relationCircle";
        this.getRelationCircleList(this.districtId);
      }
    },
    //搜索
    search() {
      this.pagination.current = 1;
      if (this.activeName === "normal") {
        this.getNormalList();
      } else if (this.activeName === "disabled") {
        this.getDisabledList();
      }
    },
    // 重置
    reset() {
      this.pagination.current = 1;
      this.paramter = {
        districtName: undefined,
      };
      if (this.activeName === "normal") {
        this.getNormalList();
      } else if (this.activeName === "disabled") {
        this.getDisabledList();
      }
    },
    // 跳转到新增商圈
    addCommerce() {
      this.$router.push({ path: "/commerce/addCommerce", query: {} });
    },
    // 跳转到编辑
    toEdit(row) {
      this.$router.push({
        path: "/commerce/editCommerce",
        query: { districtId: row.districtId },
      });
    },
    // tab监听
    handleClick(tab) {
      console.debug("tab", tab);
      if (tab.name === "disabled") {
        // this.activeName = 'normal'
        this.getDisabledList();
      } else if (tab.name === "normal") {
        // this.activeName = 'normal'
        this.getNormalList();
      }
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 查看
    handleLookCoupon(val) {
      this.hiproOrderDetails = val;
      this.visibleDialog = true;
    },
    //  关闭弹框
    closeAdvert() {
      this.visibleDialog = false;
    },
    //页容量改变
    handleSizeChange(val) {
      this.pagination.size = val;
      this.getList();
    },
    //页码改变
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.jump-num {
  color: #1953e5;
  text-decoration: underline;
}
.sortBusiness_list {
  display: flex;
  flex-direction: column;
  .sortBusiness_list_item {
    display: flex;
    justify-content: space-between;
    background-color: #1990ff;
    color: #fff;
    font-size: 14px;
    padding: 8px 20px;
    border-radius: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    .sortBusiness_list_item div {
      margin: 0px 10px;
    }
  }
}
</style>
