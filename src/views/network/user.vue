<template>
  <div class="main-content">
    <!-- 筛选 -->
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <!-- 用户搜索 -->
      <el-form-item label="人员搜索：">
        <el-input
          v-model="search.keyword"
          style="width: 100%"
          placeholder="请输入内容"
        >
          <el-select slot="prepend" v-model="searchType" placeholder="请选择">
            <el-option label="姓名" value="fullName"></el-option>
            <el-option label="手机号" value="mobile"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="to_search()">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" class="reset" @click="to_reset()">
          重置
        </el-button>
      </div>
    </el-form>
    <!-- 新增 -->
    <div id="tableBtn">
      <el-button type="primary" @click="addNetwork()"> 新增用户权限 </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="interview.loading"
      :empty-text="$t('message.table_empty_text')"
      :data="unitList"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="姓名">
        <template slot-scope="scope">
          {{ scope.row.user.fullName ? scope.row.user.fullName : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="手机号码">
        <template slot-scope="scope">
          {{ scope.row.user.mobile ? scope.row.user.mobile : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="查看权限" prop="unitNames" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="to_edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getUserList"
    />
    <!-- 弹框 -->
    <el-dialog
      title="用户权限"
      class="dialog banneddialog"
      :visible.sync="interview.dialogShow"
      width="70%"
    >
      <el-form ref="forbbidForm" :model="form" :rules="rules">
        <el-form-item label="用户信息：" label-width="150px">
          <el-autocomplete
            v-model="form.tel"
            popper-class="select-option"
            style="width: 20rem"
            :fetch-suggestions="querySearchMobile"
            placeholder="请输入用户手机号码"
            @select="handleSelectUser"
            :disabled="interview.isEdit"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="绑定网点权限">
          <el-table
            ref="multipleTable"
            :data="authorityList"
            style="width: 100%"
            row-key="id"
            border
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            :height="tableHeight"
            lazy
            :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="locationName" label="地区" sortable>
            </el-table-column>
            <el-table-column prop="name" label="网点" sortable width="180">
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="interview.dialogLoading"
          @click="formSave()"
        >
          确认
        </el-button>
        <el-button @click="formCancle()"> 取消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserRelationUnit,
  getRelevanceById,
  getUserUnitPage,
  getUnitList,
} from "@/api/network/network";
import TablePagination from "@/components/table-pagination";
import { getUsersbyMobile } from "@/api/user/user";
import { Loading } from "element-ui";
// 引入地区查询接口
import { areas } from "@/api/area";
export default {
  components: {
    TablePagination,
  },
  data() {
    return {
      // 省市区联动
      locationNameList: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data;
              const nodes = Array.from(areaList).map((item) => ({
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
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      search: {
        keyword: null,
      },
      searchType: null,
      interview: {
        loading: false,
        dialogShow: false,
        dialogLoading: false,
        isEdit: false,
      },
      unitList: [],
      editUnits: null,
      // 权限列表
      authorityList: [],
      form: {
        tel: null,
        locationName: null,
        unitIds: [],
        userId: null,
      },
      // 选中单位
      selectUnit: null,
      locationCode: null,
      parentLocation: -1,
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //总条数
        total: 0,
      },
      // 表单校验
      rules: {
        address: [
          {
            required: true,
            message: "请输入详情信息",
            trigger: "blur",
          },
        ],
        location: [
          {
            required: true,
            message: "请选择省市区",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserUnitPage();
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight();
      this.watchWidth();
    });
  },
  methods: {
    // 用户关联单位网点信息
    formSave() {
      if (!this.selectUnit) {
        this.$message("请选择单位");
        return;
      }
      if (!this.form.tel) {
        this.$message("请填写用户信息");
        return;
      }
      this.interview.dialogLoading = true;
      let unitIds = [];
      for (let i in this.selectUnit) {
        unitIds.push(this.selectUnit[i].id);
      }
      console.debug("tel", this.form.userId);
      let data = {
        userId: this.form.userId,
        unitIds: unitIds,
      };
      let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
      if (!this.form.userId) {
        if (!reg.test(this.form.tel)) {
          this.$message("请填写正确的手机号码格式");
          return;
        }
        data.mobile = this.form.tel;
      }
      console.debug("data", data);
      getUserRelationUnit(data)
        .then((res) => {
          console.debug("res", res);
          this.getUserUnitPage();
          this.interview.dialogShow = false;
          this.interview.dialogLoading = false;
        })
        .catch(() => {
          this.interview.dialogShow = false;
          this.interview.dialogLoading = false;
        });
    },
    // 获取网点列表
    _getUnitList() {
      let data = {
        location: this.locationCode,
        parentLocation: this.parentLocation,
      };
      getUnitList(data).then((res) => {
        this.authorityList = res.data.data;
        console.debug("this.authorityList", this.authorityList);
        let arr = [];
        // 反选选中
        if (!this.editUnits) return;
        let resList = res.data.data;
        resList.map((item, index) => {
          item.hasChildren = item.areaFlag;
          this.editUnits.map((editUnitItem) => {
            if (editUnitItem === item.id) {
              arr.push(item);
            }
          });
        });
        // 默认选中已关联的网点
        this.$nextTick(() => {
          if (arr) {
            arr.forEach((row) => {
              this.$refs.multipleTable.toggleRowSelection(row, true);
            });
          }
        });
      });
    },
    querySearchMobile(mobile, cb) {
      if (!mobile) {
        cb(this.searchRecords);
        return;
      }
      if (mobile.length > 11) {
        this.form.tel = mobile.toString().slice(0, 11);
        return;
      }
      // 搜索手机号码
      getUsersbyMobile(mobile).then((res) => {
        const users = res.data.data.records;
        cb(
          users.map((user) => {
            return {
              value: user.mobile,
              userId: user.userId,
            };
          })
        );
      });
    },
    // 选中的userId
    handleSelectUser(user) {
      this.form.userId = user.userId;
      this.form.tel = user.value;
      this.getRelevanceById(user.userId);
    },
    // 查询用户已关联的单位ID列表
    getRelevanceById(userId) {
      getRelevanceById(userId).then((res) => {
        console.debug("查询用户已关联的单位ID列表", res);
        // this.interview.dialogShow = true
      });
    },
    getUserList() {
      this.getUserUnitPage();
    },
    // 分页查询用户单位关联列表
    getUserUnitPage() {
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
      };
      const keyword = this.searchType;
      data[keyword] = this.search.keyword;
      getUserUnitPage(data).then((res) => {
        console.debug("res", res);
        let records = res.data.data.records;
        for (let i in records) {
          let arr = [];
          for (let j in records[i].units) {
            arr.push(records[i].units[j].name);
          }
          records[i].unitsNames = arr.toString();
        }
        this.unitList = records;
        this.pagination.size = res.data.data.size;
        this.pagination.total = res.data.data.total;
        this.pagination.current = res.data.data.current;
      });
    },
    // 省市区选择事件
    handleChange() {
      this.form.locationName = this.$refs.cascader
        .getCheckedNodes()[0]
        .pathLabels.join("");
      this.locationCode = this.$refs.cascader
        .getCheckedNodes()[0]
        .path.join(",");
      this._getUnitList();
      this.$nextTick(() => {});
      console.debug("handleChange", this.location);
    },
    // 打开弹框
    addNetwork() {
      this.form.tel = null;
      this.form.userId = null;
      this.form.locationArr = null;
      this.authorityList = [];
      this.selectUnit = null;
      this.interview.dialogShow = true;
      this.interview.isEdit = false;
      this._getUnitList();
    },
    // 关闭弹框
    formCancle() {
      this.interview.dialogShow = false;
      this.form.tel = null;
      this.form.userId = null;
      this.form.locationArr = null;
    },
    // 去编辑
    to_edit(item) {
      this.form.tel = item.user.mobile;
      this.form.userId = item.user.userId;
      this.editUnits = item.unitIds;
      this.authorityList = [];
      let loadingInstance = Loading.service({ text: "正在打开" });
      this.interview.isEdit = true;
      setTimeout(() => {
        loadingInstance.close();
        this.interview.dialogShow = true;
        this._getUnitList();
      }, 1000);
    },
    // 加载
    load(tree, treeNode, resolve) {
      console.debug("tree,treeNode", tree, treeNode);
      let data = {
        location: this.location,
        name: this.search.name,
        parentLocation: tree.location,
      };
      getUnitList(data).then((res) => {
        console.debug("res", res);
        let arr = [];
        for (let i in res.data.data) {
          res.data.data[i].hasChildren = res.data.data[i].areaFlag;
          if (this.editUnits) {
            for (let k in this.editUnits) {
              if (this.editUnits[k] === res.data.data[i].id) {
                arr.push(res.data.data[i]);
              }
            }
          }
        }
        // 默认选中已关联的网点
        this.$nextTick(() => {
          setTimeout(() => {
            resolve(res.data.data);
          }, 1000);
          if (arr) {
            arr.forEach((row) => {
              this.$refs.multipleTable.toggleRowSelection(row, true);
            });
          }
        });
      });
    },
    // 多选选中
    handleSelectionChange(val) {
      this.selectUnit = val;
    },
    // 搜索
    to_search() {
      this.getUserUnitPage();
    },
    //重置
    to_reset() {
      this.searchType = null;
      this.search.keyword = null;
      this.getUserUnitPage();
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
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`;
    },
  },
};
</script>
<style scoped>
.form-tips {
  margin-left: 10px;
  color: #999;
  font-size: 12px;
}
</style>
