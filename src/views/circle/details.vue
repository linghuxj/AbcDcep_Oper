<template>
  <div class="storeDetail-content">
    <div class="heder">
      <!-- <div class="header-status">可用</div> -->
      <div class="heder-main">
        <div class="user-item-left">
          <div class="user-item-bg">
            <el-image
              style="width: 190px; height: 130px"
              :src="
                form.circleBackground
                  ? form.circleBackground
                  : './img/hiPro.png'
              "
            >
            </el-image>
          </div>
          <div class="user-item-logo">
            <el-image
              style="width: 50px; height: 50px"
              :src="form.circleLogo ? form.circleLogo : './img/hiPro.png'"
            >
            </el-image>
          </div>
        </div>
        <div class="user-item-right">
          <div class="user-item">
            <div>{{ form.circleName }}</div>
            <div>
              <span>圈子分类：{{ form.circleTypeName }}</span>
              <span>创建人：{{ form.user ? form.user.username : "--" }}</span>
            </div>
            <div>圈子介绍：{{ form.circleDesc }}</div>
          </div>
          <div class="user-item">
            <div>圈子ID：{{ form.circleId }}</div>
            <div>创建时间：{{ form.createTime }}</div>
          </div>
        </div>
      </div>
      <div class="status">
        <wel-tag :type="type">{{ handleStatus(form.status) }}</wel-tag>
      </div>
    </div>
    <div class="tabs">
      <div class="business-tit"></div>
      <el-tabs v-model="activeTag" @tab-click="handleChangeTab">
        <el-tab-pane label="基础数据" name="countData">
          <div class="statistical">
            <div class="statistical-item">
              <div class="statistical-item-div">圈子数据</div>
              <div class="statistical-item-div">
                <div>成员数</div>
                <div>
                  {{ statisData.joinUserCount }}
                </div>
              </div>
              <div class="statistical-item-div">
                <div>动态关联门店数</div>
                <div>
                  {{ statisData.relationStoreCount }}
                </div>
              </div>
              <div class="statistical-item-div">
                <div>动态内容总数</div>
                <div>
                  {{ statisData.noteCount }}
                </div>
              </div>
              <div class="statistical-item-div">
                <div>动态内容下架总数</div>
                <div>
                  {{ statisData.offNoteCount }}
                </div>
              </div>
            </div>
            <div class="statistical-item">
              <div class="statistical-item-div"></div>
              <div class="statistical-item-div">
                <div>图文总数</div>
                <div>
                  {{ statisData.imageNoteCount }}
                </div>
              </div>
              <div class="statistical-item-div">
                <div>下架图文总数</div>
                <div>
                  {{ statisData.offImageNoteCount }}
                </div>
              </div>
              <div class="statistical-item-div">
                <div>视频总数</div>
                <div>
                  {{ statisData.videoCount }}
                </div>
              </div>
              <div class="statistical-item-div">
                <div>下架视频总数</div>
                <div>
                  {{ statisData.offVideoCount }}
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="圈子成员" name="circleMember">
          <div class="business-tab">
            <div class="business-tab-search">
              <el-form
                :inline="true"
                :model="userSearch"
                class="demo-form-inline"
              >
                <el-form-item label="昵称：">
                  <el-input
                    v-model="userSearch.keyword"
                    placeholder="请输入关键字"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="UserSearch()"
                    >搜索</el-button
                  >
                  <el-button @click="userReset()">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table
              v-loading="tableLoading"
              :empty-text="$t('message.table_empty_text')"
              :data="userList"
              border
              style="width: 100%"
            >
              <el-table-column prop="user.userId" label="用户ID">
              </el-table-column>
              <el-table-column label="头像">
                <template slot-scope="scope">
                  <el-avatar :src="scope.row.avatar"></el-avatar>
                </template>
              </el-table-column>
              <el-table-column prop="user.username" label="昵称">
              </el-table-column>
              <el-table-column
                prop="user.mobile"
                label="手机号码"
              ></el-table-column>
              <el-table-column
                prop="joinTime"
                label="加入时间"
              ></el-table-column>
              <el-table-column label="互动情况" align="center">
                <el-table-column
                  prop="publishNoteNum"
                  label="发布动态数"
                ></el-table-column>
                <el-table-column
                  prop="shareNoteNum"
                  label="分享动态数"
                ></el-table-column>
                <el-table-column
                  prop="likedNum"
                  label="点赞数"
                ></el-table-column>
                <el-table-column
                  prop="commentNum"
                  label="评论数"
                ></el-table-column>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <table-pagination
              :total="pagination.total"
              :page.sync="pagination.current"
              :limit.sync="pagination.size"
              @pagination="userSearch"
              style="text-align: right; margin-top: 20px"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="动态内容" name="circleContent">
          <div class="business-tab">
            <div class="business-tab-search">
              <el-form :inline="true" :model="search" class="demo-form-inline">
                <el-form-item>
                  <el-input
                    placeholder="请输入搜索内容关键字"
                    v-model="circleSearch.keyword"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="CircleSearch()"
                    >搜索</el-button
                  >
                  <el-button @click="resetCircle()">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <el-table
              v-loading="tableLoading"
              :empty-text="$t('message.table_empty_text')"
              :data="circleList"
              border
              style="width: 100%"
            >
              <el-table-column prop="noteId" label="动态ID" width="150">
              </el-table-column>
              <el-table-column
                prop="noteContent"
                label="动态内容"
                width="300"
              ></el-table-column>
              <el-table-column
                prop="storeName"
                label="关联门店"
              ></el-table-column>
              <el-table-column prop="price" label="发布者信息" width="150">
                <template slot-scope="scope">
                  <div style="display: flex">
                    <el-avatar
                      :src="scope.row.user.avatar"
                      style="width: 24px; height: 24px"
                    ></el-avatar>
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        margin-left: 20px;
                      "
                    >
                      <span>{{ scope.row.user.username }}</span>
                      <span>{{ scope.row.user.mobile }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="发布时间"
              ></el-table-column>
              <el-table-column prop="statusName" label="状态"></el-table-column>
              <el-table-column
                prop="noteStatisticsResp"
                label="互动情况"
                align="center"
              >
                <el-table-column
                  prop="noteStatisticsResp.lookedCount"
                  label="浏览数"
                ></el-table-column>
                <el-table-column
                  prop="noteStatisticsResp.sharedCount"
                  label="分享动态数"
                ></el-table-column>
                <el-table-column
                  prop="noteStatisticsResp.likedCount"
                  label="点赞数"
                ></el-table-column>
                <el-table-column
                  prop="noteStatisticsResp.commentedCount"
                  label="评论数"
                ></el-table-column>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100"
                fixed="right"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button type="text" @click="toOff(scope.row.noteId)"
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
              @pagination="CircleSearch"
              style="text-align: right; margin-top: 20px"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 打开下架内容弹框 -->
    <el-dialog
      title="下架操作"
      class="dialog banneddialog"
      :visible.sync="dialogBanned"
      width="600px"
    >
      <el-form ref="forbbidForm" :model="offForm" :rules="offRules">
        <el-form-item prop="reason" label="下架原因：" class="usernumber">
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
        <el-form-item label="备注：" prop="name">
          <el-input
            v-model="offForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请详细描述下架原因"
            style="width: 400px"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleOffCancel">取消</el-button>
        <el-button v-loading="disable" type="primary" @click="handleOffShelf"
          >确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getCircleByUserId,
  getStatisticsDate,
  getUserPage,
  getCirclePage,
} from "@/api/circle/circle";
import TablePagination from "@/components/table-pagination";
import { remote } from "@/api/system/dict";
import { changeStatus } from "@/api/feeds/feed";
import WelTag from "@/template/Wel-Tag/index.vue";
export default {
  name: "DetailsCircle",
  components: {
    TablePagination,
    WelTag,
  },
  data() {
    return {
      activeTag: "countData",
      form: {
        circleName: undefined,
        circleId: undefined,
        circleTypeName: undefined,
        createTime: undefined,
        circleDesc: undefined,
        circleBackground: undefined,
        circleLogo: undefined,
      },
      circleId: undefined,
      userKeyword: undefined,
      statisData: {},
      pagination: {
        current: 1, //页码
        size: 20, //页容量
        pageSize: [10, 20, 50, 100], //页面数组
        total: 0, //总条数
        pages: 0,
      },
      tableLoading: false,
      search: {
        nickName: "",
        name: "",
        tel: "",
        date: "",
      },
      userSearch: {
        keyword: undefined,
      },
      circleSearch: {
        keyword: undefined,
      },
      userList: [],
      circleList: [],
      // 下架弹框
      dialogBanned: false,
      disable: false,
      offForm: {
        reason: undefined,
        remark: undefined,
        noteId: undefined,
      },
      // 封禁数组
      remarks: [],
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
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.circleId = id;
    this.$nextTick(() => {
      this.getCircleByUserId(id);
      this.getStatisticsDate(id);
    });
  },
  mounted() {},
  methods: {
    // 根据id查询圈子详情
    getCircleByUserId(id) {
      getCircleByUserId(id)
        .then((res) => {
          this.form = res.data.data;
        })
        .catch(() => {});
    },
    // 查询基础数据
    getStatisticsDate(id) {
      getStatisticsDate(id).then((res) => {
        this.statisData = res.data.data;
      });
    },
    // 查询圈子成员
    getUserPage() {
      let data = {
        circleId: this.circleId,
        keyword: this.userSearch.keyword,
        current: this.pagination.current,
        size: this.pagination.size,
      };
      this.tableLoading = true;
      getUserPage(data)
        .then((res) => {
          console.debug("res", res);
          this.tableLoading = false;
          this.userList = res.data.data.records;
          this.pagination.total = res.data.data.total;
          this.pagination.size = res.data.data.size;
          this.pagination.current = res.data.data.current;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    UserSearch() {
      this.getCirclePage();
    },
    resetUser() {
      this.CircleSearch.keyword = undefined;
      this.getCirclePage();
    },
    // 查询动态内容
    getCirclePage() {
      let data = {
        circleId: this.circleId,
        keyword: this.circleSearch.keyword,
        current: this.pagination.current,
        size: this.pagination.size,
      };
      this.tableLoading = true;
      getCirclePage(data)
        .then((res) => {
          this.tableLoading = false;
          this.circleList = res.data.data.records;
          this.pagination.total = res.data.data.total;
          this.pagination.size = res.data.data.size;
          this.pagination.current = res.data.data.current;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    CircleSearch() {
      this.getCirclePage();
    },
    resetCircle() {
      this.circleSearch.keyword = undefined;
      this.getCirclePage();
    },
    // 下架动态内容
    toOff(noteId) {
      (this.offForm = {
        noteId: noteId,
        reason: undefined,
        remark: undefined,
      }),
        this.reqNoteReportReason();
      this.dialogBanned = true;
    },
    // 查询封禁类型
    reqNoteReportReason() {
      remote("note_report_reason").then((res) => {
        this.remarks = res.data.data;
      });
    },
    // 取消
    handleOffCancel() {
      (this.offForm = {
        noteId: undefined,
        reason: undefined,
        remark: undefined,
      }),
        (this.dialogBanned = false);
    },
    // 确认下架
    handleOffShelf() {
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
              this.$message.success("下架成功");
              this.getCirclePage();
            })
            .catch(() => {
              this.disable = false;
            });
        }
      });
    },
    handleChangeTab() {
      if (this.activeTag === "countData") {
        this.getStatisticsDate(this.circleId);
      } else if (this.activeTag === "circleMember") {
        this.getUserPage();
      } else if (this.activeTag === "circleContent") {
        this.getCirclePage();
      }
    },
    // 圈子状态
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
<style lang="scss" scoped>
.storeDetail-content {
  margin: 10px 12px;
  padding: 10px;
  .heder {
    position: relative;
    display: flex;
    background-color: #fff;
    height: 210px;
    margin-bottom: 20px;
    .header-status {
      position: absolute;
      top: 0px;
      width: 80px;
      height: 40px;
      background-color: #0094ff;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50px 0px 0px 50px;
    }
    .heder-main {
      height: 150px;
      display: flex;
      margin-top: 50px;
      width: 100%;
      margin-left: 20px;
    }
    .user-item-logo {
      position: absolute;
      bottom: 10px;
      left: 176px;
    }
    .statusName {
      color: #fff;
      background-color: #3399ff;
      text-align: center;
      margin-bottom: 10px;
    }
    .user-item-left {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-item-right {
      display: flex;
      width: 80%;
      margin-left: 50px;
    }
    .user-item {
      display: flex;
      flex-direction: column;
      font-size: 13px;
      flex: 1;
      div {
        margin: 10px 0px 10px 0px;
      }
      span {
        margin-right: 50px;
      }
    }
    .image-slot {
      width: 1;
    }
  }
  .tabs {
    background-color: #fff;
    padding: 10px 30px 20px 30px;
  }
  .business-tit {
    margin-top: 20px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    // border-bottom: 2px solid #ebedef;
    .tabitem {
      display: inline-block;
      width: 100px;
      text-align: center;
      cursor: pointer;
      height: 40px;
    }
    .actionts {
      color: #0094ff;
      border-bottom: 2px solid #0094ff;
    }
  }

  .business-tab-search {
    margin-top: 20px;
    margin-bottom: 15px;
    text-align: right;
  }

  .tabs-select {
    text-align: right;
  }
  .statistical {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    flex-direction: column;
  }
  .statis-type {
    padding: 10px 0px;
  }
  .statistical-item {
    display: flex;
    align-items: center;
    width: 70%;
    height: 50px;
    margin-top: 20px;
    margin-bottom: 30px;
    .statistical-item-div {
      width: 200px;
    }
    .statistical-item:nth-of-type(1) {
      display: flex;
      flex-direction: column;
      height: 50px;
      justify-content: center;
      color: #000000;
      font-weight: bold;
    }
    .statistical-item-div:not(:nth-of-type(1)) {
      display: flex;
      flex-direction: column;
      height: 50px;
      justify-content: space-between;
      color: #838383;
    }
  }
  .statistical {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  .statis-type {
    padding: 10px 0px;
  }
  .statistical-item-item {
    margin: 5px 0px;
    div {
      color: #797979;
    }
  }
  .user {
    display: flex;
    justify-content: space-around;
    text-align: center;
    .user-avatar {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
    }
    .user-base {
      width: 180px;
    }
  }
}
.status {
  position: absolute;
  right: 35px;
  top: 22px;
}
</style>
