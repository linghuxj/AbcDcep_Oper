<template>
  <div class="main-content">
    <!-- 表单 -->
    <!-- 筛选条件表单 -->
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <!-- 搜索 -->
      <!-- 用户搜索 -->
      <el-form-item label="发布者信息：" class="giftSelect">
        <el-select
          v-model="searchType"
          placeholder="请选择发布者信息"
          class="userSelection userWaysSelect"
        >
          <el-option label="昵称" value="username" />
          <el-option label="手机号" value="mobile" />
        </el-select>
        <el-input
          v-model="search.userKeyWord"
          class="userInputWidth"
          placeholder="请输入信息"
        />
      </el-form-item>
      <el-form-item label="所属圈子：">
        <el-input
          v-model="search.circleName"
          placeholder="请输入所属圈子"
        ></el-input>
      </el-form-item>
      <el-form-item label="关联门店：">
        <el-input
          v-model="search.storeName"
          placeholder="请输入关联门店"
        ></el-input>
      </el-form-item>
      <!-- 注册时间 -->
      <el-form-item :label="$t('user.registration_date')">
        <span class="el-form-item-span">：</span>
        <el-date-picker
          v-model="registerDate"
          type="daterange"
          range-separator="~"
          :start-placeholder="$t('message.start_date')"
          :end-placeholder="$t('message.end_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="createTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <div>
          <el-button type="primary" @click="handleSearch()"> 搜索 </el-button>
          <el-button @click="handleReset()">重置</el-button>
        </div>
      </el-form-item>
      <!-- 多选 -->
      <!-- <el-form-item class="videoSelect">
        <template>
          <el-checkbox-group v-model="checkList" @change="handleChangeCheckbox">
            <el-checkbox label="isCircleNote">{{
              $t("feed.video.network_video")
            }}</el-checkbox>
            <el-checkbox label="isGoodsNote">{{
              $t("feed.video.related_video")
            }}</el-checkbox>
            <el-checkbox label="isDelNote">{{
              $t("feed.video.blockDeleted_videos")
            }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item> -->
    </el-form>
    <!-- 表格 分页 -->
    <div class="userContent">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 综合排序-->
        <el-tab-pane label="正常" name="first"> </el-tab-pane>
        <el-tab-pane label="已下架" name="second"> </el-tab-pane>
        <!-- 表格 -->
        <el-table
          v-loading="listLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="list"
          border
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <el-table-column label="动态ID" prop="noteId" width="150" />
          <el-table-column label="视频封面" align="center" width="130">
            <template slot-scope="scope">
              <div class="content-wrap">
                <el-image
                  class="image"
                  :src="scope.row.noteResList[0].resUrl"
                  fit="scale-down"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="动态内容" align="center" width="180">
            <template slot-scope="scope">
              <div class="content-wrap">
                <div class="impose">{{ scope.row.noteContent }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属圈子" align="center" width="120">
            <template slot-scope="scope">
              <div>
                {{ scope.row.circleName ? scope.row.circleName : "--" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="关联门店" align="center" width="180">
            <template slot-scope="scope">
              <div>
                {{ scope.row.storeName ? scope.row.storeName : "--" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="发布者信息"
            prop="user"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <div class="user-wrap">
                <div>
                  <img
                    class="avatar"
                    :src="
                      scope.row.user.avatar
                        ? scope.row.user.avatar
                        : './img/avatar.png'
                    "
                  />
                </div>
                <div>
                  <div>{{ scope.row.user.username }}</div>
                  <div>{{ scope.row.mobile ? scope.row.mobile : "--" }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="发布时间"
            prop="createTime"
            width="150"
            align="center"
          />
          <el-table-column label="互动情况" align="center">
            <el-table-column
              prop="noteStatisticsResp.lookedCount"
              label="浏览数"
            >
            </el-table-column>
            <el-table-column
              prop="noteStatisticsResp.sharedCount"
              label="分享动态数"
            >
            </el-table-column>
            <el-table-column
              prop="noteStatisticsResp.likedCount"
              label="点赞数"
            >
            </el-table-column>
            <el-table-column
              prop="noteStatisticsResp.commentedCount"
              label="评论数"
            >
            </el-table-column>
          </el-table-column>
          <el-table-column label="下架时间" v-if="activeName === 'second'">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.noteOffResp
                    ? scope.row.noteOffResp.createTime
                    : "--"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="下架原因"
            key="reason"
            v-if="activeName === 'second'"
          >
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.noteOffResp ? scope.row.noteOffResp.reason : "--"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="说明"
            key="remark"
            v-if="activeName === 'second'"
            width="160px"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.noteOffResp">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    scope.row.noteOffResp.remark
                      ? scope.row.noteOffResp.remark
                      : '--'
                  "
                  placement="top-start"
                >
                  <div class="remark-span">
                    {{
                      scope.row.noteOffResp.remark
                        ? scope.row.noteOffResp.remark
                        : "--"
                    }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
            fixed="right"
            align="center"
            v-if="activeName === 'first'"
          >
            <template slot-scope="scope">
              <!-- <el-button
                type="text"
                size="mini"
                @click="handleDialog(scope.row)"
                >编辑</el-button
              > -->
              <el-button
                type="text"
                size="mini"
                @click="handleDialog(scope.row)"
                >详情</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="handleOffDialog(scope.row)"
                v-if="permissions.note_off"
                >下架</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <table-pagination
          :total="pagination.total"
          :page.sync="pagination.current"
          :limit.sync="pagination.size"
          @pagination="getList"
        />
      </el-tabs>
    </div>
    <!-- 下架 -->
    <el-dialog
      :title="$t('feed.outvideo.shelves_because')"
      class="dialog dialogReason"
      :visible.sync="dialogOutReason"
      width="600px"
    >
      <el-form ref="offForm" :model="offForm" :rules="rules">
        <el-form-item label="下架原因：" prop="reason">
          <el-select
            v-model="offForm.reason"
            placeholder="请选择"
            style="width: 400px"
          >
            <el-option
              v-for="remark in remarks"
              :key="remark.itemId"
              :label="remark.itemLabel"
              :value="remark.itemValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因：">
          <el-input
            v-model="offReason.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入"
            style="width: 400px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleOffCancel">{{
          $t("message.cancel")
        }}</el-button>
        <el-button v-loading="disable" type="primary" @click="handleOffShelf">{{
          $t("message.confirm")
        }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="videoDialog" width="40%" top="2vh">
      <div id="J_prismPlayer"></div>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import { getVideos, changeStatus, getOffVideos } from "@/api/feeds/feed";
import { loadFile } from "@/util/loadFile";
import { remote } from "@/api/system/dict";
import { mapGetters } from "vuex";
export default {
  components: { TablePagination },
  data() {
    return {
      labelPosition: "right",
      dialogOutReason: false, //下架弹出框
      offReason: {
        reason: "",
        remark: "",
      },
      offForm: {
        noteId: undefined,
        reason: undefined,
        remark: undefined,
      },
      rules: {
        reason: [
          { required: true, message: "请选择下架原因", trigger: "change" },
        ],
      },
      list: [],
      checkList: [],
      searchType: undefined,
      // 注册时间
      registerDate: undefined,
      search: {
        //表单
        keyword: undefined,
        isGoodsNote: undefined,
        isDelNote: undefined,
        isCircleNote: undefined,
      },

      videoDialog: false, // 视频播放
      videoUrl: "",
      disable: false,
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //页面数组
        pageSize: [5, 10, 15, 20],
        //总条数
        total: 0,
      },
      listLoading: false,
      activeName: "first", //导航选项卡默认选择
      remarks: [],
    };
  },
  created() {
    loadFile([
      "aliyun-player-sdk/aliplayer-h5-min.js",
      "aliyun-player-sdk/aliplayer-min.css",
    ]);
  },
  mounted() {
    this.getVideoList();
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  methods: {
    getList() {
      if (this.activeName === "first") {
        this.getVideoList();
      } else {
        this.getOffVideos();
      }
    },
    //创建日期时间触发
    createTime(val) {
      const [startDate, endDate] = val;
      this.search.startCreateTime = startDate;
      this.search.endCreateTime = endDate;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 获取视频列表
    getVideoList() {
      this.listLoading = true;
      const query = Object.assign({}, this.search);
      query.current = this.pagination.current;
      query.size = this.pagination.size;
      getVideos(query)
        .then((res) => {
          this.listLoading = false;
          const result = res.data.data;
          this.list = result.records;
          this.pagination.total = result.total;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 获取下架视频列表
    getOffVideos() {
      this.listLoading = true;
      const query = Object.assign({}, this.search);
      query.current = this.pagination.current;
      query.size = this.pagination.size;
      getOffVideos(query)
        .then((res) => {
          this.listLoading = false;
          const result = res.data.data;
          this.list = result.records;
          this.pagination.total = result.total;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    // 正常和下架切换
    handleClick() {
      this.pagination = {
        //页码
        current: 1,
        //页容量
        size: 10,
        //页面数组
        pageSize: [5, 10, 15, 20],
        //总条数
        total: 10,
      };
      if (this.activeName === "first") {
        this.getVideoList();
      } else {
        this.getOffVideos();
      }
    },
    handleChangeCheckbox(checked) {
      const query = Object.assign({}, this.search);
      checked.forEach((check) => {
        if (check === "isCircleNote") {
          query.isCircleNote = 1;
        } else if (check === "isGoodsNote") {
          query.isGoodsNote = true;
        } else if (check === "isDelNote") {
          query.isDelNote = true;
        }
      });
      this.getVideoList(query);
    },
    // 搜索
    handleSearch() {
      this.getVideoList(this.search);
    },
    // 重置
    handleReset() {
      this.registerDate = undefined;
      this.searchType = undefined;
      this.search = {
        //表单
        circleName: undefined,
        endCreateTime: undefined,
        mobile: undefined,
        startCreateTime: undefined,
        storeName: undefined,
        username: undefined,
        keyword: undefined,
        userKeyWord: undefined,
        amountWwork: undefined,
      };
      this.getList();
    },
    // 打开弹框
    handleOffDialog(note) {
      this.offForm.noteId = note.noteId;
      this.dialogOutReason = true;
      if (this.remarks.length === 0) {
        remote("note_report_reason").then((res) => {
          this.remarks = res.data.data;
        });
      }
    },
    // 取消弹框
    handleOffCancel() {
      this.dialogOutReason = false;
      this.offForm = {
        noteId: undefined,
        reason: undefined,
        remark: undefined,
      };
    },
    // 下架
    handleOffShelf() {
      this.$refs.offForm.validate((valid) => {
        if (valid) {
          // 下架
          this.disable = true;
          changeStatus(this.offForm)
            .then(() => {
              this.disable = false;
              this.dialogOutReason = false;
              this.offForm = {
                noteId: undefined,
                reason: undefined,
                remark: undefined,
              };
              this.$message.success(this.$t("feed.off_shelf_success"));
              this.getVideoList(this.search);
            })
            .catch(() => {
              this.disable = false;
            });
        }
      });
    },
  },

  //tap切换

  //禁用启用按钮
};
</script>
<style lang="scss" scoped>
.main-content {
  width: 100%;
  .content-wrap {
    display: flex;
    height: 153px;
    flex-direction: column;
    justify-content: center;
    .image {
      padding: 0 1rem;
      height: 5rem;
    }
    .note-content {
      text-align: left;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      padding: 0.5rem 0 1rem 0;
    }
  }
  .relevant-data {
    display: flex;
    justify-content: center;
    .data-item {
      text-align: center;
      padding: 0 0.7rem;
      i {
        font-size: 26px !important;
      }
    }
  }
  .el-table__row {
    .cell {
      text-align: center;
      i {
        font-size: 26px !important;
      }
    }
  }
  .user-wrap {
    display: flex;
    justify-content: center;
    .avatar {
      padding: 0 0.5rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }
  }
  // width: 1450px;
  background-color: white;
  margin: 10px 20px;
  padding: 30px;
  .demo-form-inline {
    display: flex;
    flex-wrap: wrap;
    .giftSelect {
      span {
        margin-right: 10px;
      }
    }
    .el-form-item__label {
      padding: 0;
    }
    .el-select__caret.el-input__icon.el-icon-arrow-up {
      margin-right: -18px;
    }
  }
  .el-form-item {
    display: flex;
    // margin-right: 45px;
    .el-form-item__content {
      display: flex;
      .el-checkbox {
        .el-checkbox__input,
        span {
          margin-right: 0;
        }
      }
    }
    .userWaysSelect {
      .el-input {
        .el-input__inner {
          padding: 10px;
          width: 140px;
          border-radius: 5px 0 0 5px;
        }
      }
    }
  }
  .userInputWidth {
    input {
      width: 180px;
      border-radius: 0 5px 5px 0;
      padding-left: 10px;
    }
  }
  //表单内容
  .userContent {
    .el-tabs.el-tabs--card.el-tabs--top {
      .el-tabs__item.is-top {
        padding: 0 50px;
        font-size: 16px;
        color: #606266;
      }
    }
  }

  .has-gutter {
    tr {
      th {
        text-align: center;
      }
    }
  }

  .cell {
    button {
      margin-left: 20px;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    // width: 260px;
    margin-right: 20px;
  }
  .createUser {
    margin: -30px 0 10px 0;
  }
  // .userSelection {
  //   width: 105px;
  // }
  #pane-second,
  #pane-first {
    margin-top: 20px;
    .el-form .demo-form-inline .el-form--inline {
      margin-top: 40px;
    }
  }
  .reset {
    background-color: white;
    color: rgb(141, 140, 140);
    border: 1px solid rgb(116, 115, 115);
  }
  .el-tabs__nav.is-top {
    .el-tabs__active-bar {
      height: 2px;
    }
  }
}
</style>
