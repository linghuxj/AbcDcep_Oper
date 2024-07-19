<template>
  <div class="main-content article">
    <!-- 表单 筛选条件表单 -->
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
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
      <el-form-item :label="$t('user.registration_date') + '：'">
        <el-date-picker
          v-model="registerDate"
          type="daterange"
          range-separator="~"
          :start-placeholder="$t('message.start_date')"
          :end-placeholder="$t('message.end_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          @change="to_createTime()"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 分页 -->
    <div class="userContent">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 综合排序-->
        <el-tab-pane label="正常" name="first"> </el-tab-pane>
        <!--点赞最多 -->
        <el-tab-pane label="下架" name="second"> </el-tab-pane>
        <!-- 表格 -->
        <el-table
          v-loading="listLoading"
          :empty-text="$t('message.table_empty_text')"
          :data="list"
          border
          :height="tableHeight"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <el-table-column label="动态ID" prop="noteId" width="150" />
          <el-table-column label="动态主图" align="center" width="130">
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
                <div class="impose">
                  {{ scope.row.noteContent ? scope.row.noteContent : "--" }}
                </div>
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
                  <div>
                    {{
                      scope.row.user.username ? scope.row.user.username : "--"
                    }}
                  </div>
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
            />
            <el-table-column
              prop="noteStatisticsResp.sharedCount"
              label="分享动态数"
            />
            <el-table-column
              prop="noteStatisticsResp.likedCount"
              label="点赞数"
            />
            <el-table-column
              prop="noteStatisticsResp.commentedCount"
              label="评论数"
            />
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
              <!-- <el-button type="text" size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              > -->
              <el-button
                type="text"
                size="mini"
                @click="handleOffDialog(scope.row)"
                v-if="permissions.note_off && activeName === 'first'"
                >下架</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="handleDialog(scope.row)"
                >评论</el-button
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
    <el-dialog :visible.sync="videoDialog">
      <div v-if="videoDialog"></div>
    </el-dialog>
    <!-- 打开下架弹框 -->
    <el-dialog
      :title="$t('feed.video.shelves_operation')"
      class="dialog banneddialog"
      :visible.sync="dialogBanned"
      width="600px"
    >
      <el-form ref="forbbidForm" :model="offForm" :rules="offRules">
        <el-form-item
          prop="reason"
          :label="$t('feed.outvideo.shelves_because') + '：'"
          class="usernumber"
        >
          <el-select
            v-model="offForm.reason"
            :placeholder="$t('message.please_select')"
            class="international"
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
        <el-form-item :label="$t('message.remark') + '：'" prop="name">
          <el-input
            v-model="offForm.remark"
            type="textarea"
            :rows="4"
            :placeholder="$t('feed.video.describe_shelf')"
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

    <!-- 评论弹出层 -->
    <el-dialog
      title="评论操作"
      class="dialog banneddialog"
      :visible.sync="dialogComment"
      width="50%"
    >
      <el-form
        ref="forcomForm"
        :model="comForm"
        :rules="comRules"
        label-width="100px"
      >
        <el-form-item label="评论人员" prop="commentUserId">
          <el-autocomplete
            v-model="comForm.mobile"
            popper-class="select-option"
            style="width: 20rem"
            :fetch-suggestions="querySearchMobile"
            :placeholder="$t('feed.issue.cell_phone')"
            @select="handleSelectUser"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="评论内容" prop="content">
          <el-input
            v-model="comForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入评论内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogComment = false">{{
          $t("message.cancel")
        }}</el-button>
        <el-button v-loading="disable" type="primary" @click="handleComment">{{
          $t("message.confirm")
        }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="$t('feed.outvideo.shelves_because')"
      class="dialog dialogReason"
      :visible.sync="dialogOutReason"
      width="38%"
    >
      <el-form ref="createForm" :model="offReason" label-width="100px">
        <el-form-item
          :label="$t('feed.outvideo.shelves_because')"
          class="usernumber"
        >
          <span>{{ offReason.reason }}</span>
        </el-form-item>
        <el-form-item :label="$t('message.cause')" prop="name">
          <el-input
            v-model="offReason.remark"
            type="textarea"
            :rows="4"
            disabled
            placeholder=""
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getImages,
  changeStatus,
  getOffImages,
  postCtsCommend,
} from "@/api/feeds/feed";
import TablePagination from "@/components/table-pagination";
import { getUsersbyMobile } from "@/api/user/user";
import { remote } from "@/api/system/dict";
import { mapGetters } from "vuex";
export default {
  components: { TablePagination },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      // 发布者信息
      searchType: "",
      registerDate: "",
      list: [],
      offList: [],
      checkList: [],
      forbbidForm: [],
      rules: {},
      search: {
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
      },
      videoDialog: false, // 视频播放
      images: [],
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
        total: 10,
      },
      roles: [], // 角色列表
      offForm: {
        noteId: undefined,
        reason: undefined,
        remark: undefined,
      },

      listLoading: false,
      offListLoading: false,
      b_loading: false, // 按钮loading
      activeName: "first", //导航选项卡默认选择
      dialogVisible: false, //新增弹出框
      dialogBanned: false, //封禁弹出框
      dialogReason: false, //封禁原因

      // 评论弹出框
      dialogComment: false,
      // 评论数据
      comForm: {
        mobile: "",
        commentUserId: undefined,
        content: "",
        // 动态id
        noteId: undefined,
        // 回复的评论id
        replyId: undefined,
        // 回复的用户id
        replyUserId: undefined,
      },
      // 评论校验
      comRules: {
        content: [
          { required: true, message: "请填写评论内容", trigger: "change" },
        ],
        commentUserId: [
          {
            required: true,
            message: "请输入用户手机号查询用户",
            trigger: "change",
          },
        ],
      },
      dialogOutReason: false, //封禁原因
      offReason: {
        reason: "",
        remark: "",
      },

      status: "normal",
      remarks: [],
      orgKeyword: undefined,
      offRules: {
        reason: [
          {
            required: true,
            message: this.$t("feed.valid_reason"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  mounted() {
    this.getImageList();
    this.reqNoteReportReason();
    this.getList();
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
        190
      }px)`;
    },
    getList() {
      if (this.activeName === "first") {
        this.getImageList();
      } else {
        this.getImageOffList();
      }
    },
    // 去编辑
    handleEdit() {
      // this.$router.push({ path: "/feeds/issue/image" });
    },
    //创建日期时间触发
    to_createTime(val) {
      const [startDate, endDate] = val;
      this.search.startCreateTime = startDate;
      this.search.endCreateTime = endDate;
    },
    getImageList() {
      this.listLoading = true;
      const userKeyWord = this.searchType;
      const query = Object.assign({}, this.search);
      query[userKeyWord] = this.search.userKeyWord;
      query.current = this.pagination.current;
      query.size = this.pagination.size;
      getImages(query)
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
      this.getImageList(query);
    },
    // 搜索
    handleSearch() {
      this.getImageList(this.search);
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
    // 打开下架弹框
    handleOffDialog(note) {
      this.offForm.noteId = note.noteId;
      this.dialogBanned = true;
    },
    // 打开评论弹出窗
    handleDialog(nate) {
      this.comForm.noteId = nate.noteId;
      this.comForm.mobile = undefined;
      this.comForm.content = undefined;
      this.dialogComment = true;
    },
    // 查询封禁类型
    reqNoteReportReason() {
      remote("note_report_reason").then((res) => {
        this.remarks = res.data.data;
      });
    },
    querySearchMobile(mobile, cb) {
      if (!mobile) {
        cb(this.searchRecords);
        return;
      }
      // 搜索手机号码
      getUsersbyMobile(mobile).then((res) => {
        const users = res.data.data.records;
        cb(
          users.map((user) => {
            return {
              value: user.mobile + `(${user.username})`,
              userId: user.userId,
            };
          })
        );
      });
    },

    handleSelectUser(user) {
      this.comForm.commentUserId = user.userId;
    },

    // 提交评论
    handleComment() {
      this.$refs.forcomForm.validate((valid) => {
        if (valid) {
          postCtsCommend(this.comForm).then(() => {
            this.$message.success("评论成功");
            this.dialogComment = false;
            this.getImageList(this.search);
            this.$refs.forcomForm.resetFields();
          });
        }
      });
    },
    handleOffCancel() {
      this.dialogBanned = false;
      this.offForm = {
        noteId: undefined,
        reason: undefined,
        remark: undefined,
      };
    },
    // 下架
    handleOffShelf() {
      // 下架
      this.$refs.forbbidForm.validate((valid) => {
        if (valid) {
          this.disable = true;
          changeStatus(this.offForm)
            .then(() => {
              this.disable = false;
              this.dialogBanned = false;
              this.offForm = {
                noteId: undefined,
                reason: undefined,
                remark: undefined,
              };
              this.$message.success(this.$t("feed.off_shelf_success"));
              this.getImageList(this.search);
            })
            .catch(() => {
              this.disable = false;
            });
        }
      });
    },
    // 切换
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
        this.getImageList();
      } else {
        this.getImageOffList();
      }
    },
    // 查询下架图文
    getImageOffList() {
      this.offListLoading = true;
      const userKeyWord = this.searchType;
      const query = Object.assign({}, this.search);
      query[userKeyWord] = this.search.userKeyWord;
      query.current = this.pagination.current;
      query.size = this.pagination.size;
      getOffImages(query)
        .then((res) => {
          this.offListLoading = false;
          const result = res.data.data;
          this.list = result.records;
          this.paginations.total = result.total;
        })
        .catch(() => {
          this.offListLoading = false;
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
  .remark-span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
  }
  .giftSelect {
    display: flex;
    .el-input__inner {
      width: 100px;
      padding: 0;
      border-radius: 0;
    }
    .el-form-item__content {
      display: flex;
    }
    .userInputWidth {
      input {
        width: 180px;
        border-radius: 0 5px 5px 0;
        padding-left: 10px;
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
    }
  }
  .relevant-data {
    display: flex;
    justify-content: center;
    .data-item {
      text-align: center;
      padding: 0 0.7rem;
    }
    i {
      font-size: 26px !important;
    }
  }
  .el-table__row {
    .cell {
      text-align: center;
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

  //表单内容
  .userContent {
    .el-tabs.el-tabs--card.el-tabs--top {
      // .el-tabs__item.is-top {
      //   padding: 0 50px;
      //   font-size: 16px;
      //   color: #606266;
      // }
    }
  }

  .has-gutter {
    tr {
      th {
        text-align: center;
      }
    }
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    margin-right: 20px;
  }
  // .createUser {
  //   margin: -30px 0 10px 0;
  // }

  #pane-second,
  // #pane-first {
  //   margin-top: 20px;
  //   .el-form .demo-form-inline .el-form--inline {
  //     margin-top: 40px;
  //   }
  // }
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
  // 时间框
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 260px;
    margin-right: 20px;
  }
}
</style>
