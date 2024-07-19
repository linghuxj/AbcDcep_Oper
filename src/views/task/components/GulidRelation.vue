<template>
  <div class="content">
    <el-dialog
      title="添加公会"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <!-- 搜索 -->
      <div class="search">
        <div class="search-item">
          <label>关键字：</label>
          <el-input
            placeholder="请输入关键字"
            style="width: 60%"
            v-model="keyword"
            maxlength="20"
          ></el-input>
        </div>
        <div class="search-item">
          <label>服务范围：</label>
          <span>{{ locationName }}</span>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-search" @click="to_search">
            搜索
          </el-button>
          <el-button icon="el-icon-refresh" class="reset" @click="to_reset">
            重置
          </el-button>
        </div>
      </div>
      <!-- <div class="relation-btn">
        <el-button type="primary" @click="to_relation()">确定关联</el-button>
      </div> -->
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          property="unionName"
          label="公会名称"
          width="150"
        ></el-table-column>
        <el-table-column label="会长信息" width="200">
          <template slot-scope="scope">
            <div class="user-base">
              <div class="oneline">
                用户名：{{
                  scope.row.leaderUser ? scope.row.leaderUser.username : "--"
                }}
              </div>
              <div class="oneline">
                姓名：{{
                  scope.row.leaderUser ? scope.row.leaderUser.fullName : "--"
                }}
              </div>
              <div class="oneline">
                手机号：{{
                  scope.row.leaderUser ? scope.row.leaderUser.mobile : "--"
                }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="服务范围">
          <template slot-scope="scope">
            <span>{{
              scope.row.locationName ? scope.row.locationName : "--"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公会技能">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.tagNames" :key="index">
              {{ item ? item : "--" }}</span
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div style="margin-top: 10px; text-align: right">
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="to_relation()">确定关联</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import { reqUnionPage, reqAreaCodeName } from "@/api/guild/list";
export default {
  components: {
    TablePagination,
  },
  props: {
    locationCode: {
      typeof: String,
      required: true,
    },
    unionIds: {
      typeof: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //总条数
        total: 0,
      },
      tableData: [],
      keyword: null,
      selectUnionIds: [],
      locationName: null,
    };
  },
  created() {},
  methods: {
    // 去搜索
    to_search() {
      this._getUnionList();
    },
    // 去重置
    to_reset() {
      this.keyword = null;
      this._getUnionList();
    },
    open() {
      this.dialogVisible = true;
      this._getUnionList();
      this._getAreaCodeName();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    // 去关联
    to_relation() {
      this.$emit("relationFunc", this.selectUnionIds);
      this.dialogVisible = false;
    },
    // 得到服务范围
    _getAreaCodeName() {
      reqAreaCodeName(this.locationCode).then((res) => {
        console.debug("locationCode", res);
        this.locationName = res.data.data;
      });
    },
    getList() {
      this._getUnionList();
    },
    // 查询公会列表
    _getUnionList() {
      let data = {
        size: this.pagination.size,
        current: this.pagination.current,
        keyword: this.keyword,
        location: this.locationCode,
      };
      reqUnionPage(data).then((res) => {
        console.debug("res", res);
        this.tableData = res.data.data.records;
        if (this.unionIds) {
          for (let i in this.unionIds) {
            for (let k in this.tableData) {
              this.tableData[k].unionId;
              if (this.unionIds[i] === this.tableData[k].unionId) {
                setTimeout(() => {
                  this.$refs.multipleTable.toggleRowSelection(
                    this.tableData[k],
                    true
                  );
                }, 1000);
              }
            }
          }
        }
      });
    },
    handleSelectionChange(selectArr) {
      let arr = [];
      for (let i in selectArr) {
        arr.push(selectArr[i].unionId);
      }
      this.selectUnionIds = arr;
    },
  },
};
</script>
<style scoped>
.search {
  display: flex;
  flex-direction: row;
}
.search-item {
  margin-right: 20px;
}
.relation-btn {
  margin: 10px 0px;
}
</style>
