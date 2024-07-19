<template>
  <div>
    <div class="note-box">
      <div class="user-info">
        <!-- 右边信息内容盒子 -->
        <div>
          <div class="user-base">
            <div class="user-avatar-username">
              <img :src="user.avatar" class="user-avatar" />
              <div class="user-base-info">
                <div class="user-username">{{ user.username }}</div>
                <div class="user-number">
                  <span class="size">MEWO：</span>
                  <span class="mewoNum">{{ user.userId }}</span>
                </div>
                <div class="authentication">
                  <span class="backgroundColor">{{
                    user.kolUserTypeName
                  }}</span>
                </div>
              </div>
            </div>
            <div class="user-profile">{{ user.profile }}</div>
            <div class="user-info-more">
              <div class="user-mobile-sex">
                <div>
                  <span>{{ $t("user.mobile") }}</span
                  >:
                  <span> +{{ user.ncode }} {{ user.mobile }} </span>
                </div>
                <div>
                  <span>{{ $t("user.sex") }}</span
                  >：
                  {{ user.sexName }}
                </div>
              </div>
              <div class="user-location">
                <i class="icon-dingwei"></i>
                <span>{{ user.locationName }}</span>
              </div>
            </div>
            <!-- 所属机构 -->
            <div v-if="user.orgName" class="user-subsidiary">
              <span>{{ $t("organization.Affiliation") }}:</span>
              <span>{{ user.orgName }}</span>
            </div>
          </div>
          <div class="user-label">
            <div class="userLabel-title">{{ $t("user.label") }}</div>
          </div>
          <!-- 数据概览 -->
          <div class="data-view-title">{{ $t("message.data_overview") }}</div>
          <div class="user-data-view">
            <div class="dataOne">
              <ul>
                <li class="first">
                  <p>{{ $t("user.fans_count") }}</p>
                  <p>{{ user.fansCount }}</p>
                </li>
                <li class="second">
                  <p>{{ $t("user.image_count") }}</p>
                  <p>{{ user.imageCount }}</p>
                </li>
                <li class="third">
                  <p>{{ $t("user.video_count") }}</p>
                  <p>{{ user.videoCount }}</p>
                </li>
                <li class="fourth">
                  <p>{{ $t("user.like_count") }}</p>
                  <p>{{ user.likedCount }}</p>
                </li>
                <li class="fifth">
                  <p>{{ $t("user.follow_count") }}</p>
                  <p>{{ user.followCount }}</p>
                </li>
                <li class="sixth">
                  <p>{{ $t("user.gift_count") }}</p>
                  <p>{{ user.giftCount }}</p>
                </li>
              </ul>
            </div>
            <div class="videoData">
              <ul>
                <li class="first">
                  <p>{{ $t("user.Total_up") }}</p>
                  <p>{{ user.totalLikedCount }}</p>
                </li>
                <li class="second">
                  <p>{{ $t("user.on_average") }}</p>
                  <p>{{ user.avgLikedCount }}</p>
                </li>
                <li class="third">
                  <p>{{ $t("user.general_council") }}</p>
                  <p>{{ user.totalCommentedCount }}</p>
                </li>
                <li class="fourth">
                  <p>{{ $t("user.average_comments") }}</p>
                  <p>{{ user.avgCommentedCount }}</p>
                </li>
              </ul>
            </div>
            <div class="dataOne">
              <ul>
                <li>
                  <p>{{ $t("user.circle_count") }}</p>
                  <p>{{ user.createCircleCount }}</p>
                </li>
                <li>
                  <p>{{ $t("user.circle_members") }}</p>
                  <p>{{ user.circleUserCount }}</p>
                </li>
                <li>
                  <p>{{ $t("user.circle_heat_idx") }}</p>
                  <p>{{ user.circleHeatIndex }}</p>
                </li>
                <li>
                  <p>{{ $t("user.circle_image_count") }}</p>
                  <p>{{ user.circleImageCount }}</p>
                </li>
                <li>
                  <p>{{ $t("user.circle_videos") }}</p>
                  <p>{{ user.circleVideoCount }}</p>
                </li>
                <li>
                  <p>{{ $t("user.join_circles") }}</p>
                  <p>{{ user.addCircleCount }}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="user-feeds">
        <el-tabs
          v-model="activeName"
          class="detailsTap"
          type="card"
          @tab-click="handleNoteSwitch"
        >
          <el-tab-pane
            :label="$t('message.graphic') + '(' + user.imageCount + ')'"
            name="image"
          >
            <!-- 图文内容--搜索 -->
            <div class="searchContent">
              <el-input
                v-model="noteQuery.noteContent"
                class="title-input"
                clearable
                :placeholder="$t('message.search_keyword')"
              ></el-input>
              <el-button type="primary" @click="handleSearch">{{
                $t("message.search")
              }}</el-button>
            </div>
            <!-- 日期选择--多选框 筛选-->
            <div class="screen">
              <!-- 日期选择器 -->
              <span>{{ $t("message.publish_time") }}：</span>
              <div class="block">
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
              </div>
              <div>
                <!-- 多选框 -->
                <template>
                  <el-checkbox-group
                    v-model="checkList"
                    @change="handleChangeCheckbox"
                  >
                    <el-checkbox label="isCircleNote">{{
                      $t("user.circle_graphic")
                    }}</el-checkbox>
                    <el-checkbox label="isGoodsNote">{{
                      $t("user.product_image")
                    }}</el-checkbox>
                    <el-checkbox label="isDelNote">{{
                      $t("user.block_deleted_text")
                    }}</el-checkbox>
                    <el-checkbox label="isDownNote">
                      {{ $t("user.block_picture") }}
                    </el-checkbox>
                  </el-checkbox-group>
                </template>
              </div>
            </div>
            <!-- 图文动态 视频内容详情 -->
            <div class="videoContent">
              <div class="character">
                <div class="characterLeft">
                  <span>{{ $t("user.graphic_news") }}</span>
                </div>
              </div>
              <div v-show="newColor" class="videoNewest">
                <div v-if="notes.length === 0" class="empty-data">
                  {{ $t("message.table_empty_text") }}
                </div>
                <div
                  v-for="note in notes"
                  :key="note.noteId"
                  class="videoNewest-content"
                >
                  <div class="videoNewest-L">
                    <img
                      class="videoNewestL-img"
                      :src="note.noteResList[0].resUrl"
                      alt
                    />
                    <div class="videoNewestLCenter">
                      <div class="videoNewest-title impose">
                        {{ note.noteContent }}
                      </div>
                      <div v-if="note.isDelete" class="delete">
                        <el-tag>{{ $t("message.delete") }}</el-tag>
                      </div>
                      <div v-else-if="note.status === 'disabled'" class="delete">
                        <el-tag>{{ $t("user.block") }}</el-tag>
                      </div>
                      <div class="create-time">{{ note.createTime | ndateFormat }}</div>
                    </div>
                    <div class="videoNewestL-many">
                      <div>
                        <i class="icon-yanjing"></i>
                        <p>{{ note.lookedCount }}</p>
                      </div>
                      <div>
                        <i class="icon-like"></i>
                        <p>{{ note.likedCount }}</p>
                      </div>
                      <div>
                        <i class="icon-pinglun"></i>
                        <p>{{ note.commentedCount }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="!newColor" class="videoHottest">fasdfdsafsadf</div>
            </div>
            <!-- 分页 -->
            <el-pagination
              background
              :current-page="notePagination.current"
              :page-size="notePagination.size"
              layout="sizes, prev, pager, next"
              :total="notePagination.total"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              @prev-click="handleCurrentChange"
              @next-click="handleCurrentChange"
            ></el-pagination>
          </el-tab-pane>
          <!-- 视频内容 -->
          <el-tab-pane
            :label="$t('message.video') + '(' + user.videoCount + ')'"
            name="video"
          >
            <!-- 视频内容--搜索 -->
            <div class="searchContent">
              <el-input
                v-model="noteQuery.noteContent"
                class="title-input"
                :placeholder="$t('message.search_keyword')"
              ></el-input>
              <el-button type="primary" @click="handleSearch">{{
                $t("message.search")
              }}</el-button>
            </div>
            <!-- 日期选择--多选框 筛选-->
            <div class="screen">
              <!-- 日期选择器 -->
              <span>{{ $t("message.publish_time") }}：</span>
              <div class="block">
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
              </div>
              <div>
                <!-- 多选框 -->
                <template>
                  <el-checkbox-group
                    v-model="checkList"
                    @change="handleChangeCheckbox"
                  >
                    <el-checkbox label="isCircleNote">{{
                      $t("feed.video.network_video")
                    }}</el-checkbox>
                    <el-checkbox label="isGoodsNote">{{
                      $t("feed.video.related_video")
                    }}</el-checkbox>
                    <el-checkbox label="isDelNote">{{
                      $t("feed.video.blockDeleted_videos")
                    }}</el-checkbox>
                    <el-checkbox label="isDownNote">
                      {{ $t("user.block_video") }}
                    </el-checkbox>
                  </el-checkbox-group>
                </template>
              </div>
            </div>
            <!-- 视频动态 视频内容详情 -->
            <div class="videoContent">
              <div class="character">
                <div class="characterLeft">
                  <span>{{ $t("user.video_news") }}</span>
                </div>
                <div class="characterRight">
                  <span
                    :class="{ newActive: newColor }"
                    @click="newColor = true"
                  >{{ $t("user.new") }}</span
                  >
                  <span>|</span>
                  <span
                    :class="{ newActive: !newColor }"
                    @click="newColor = false"
                  >{{ $t("user.hot") }}</span
                  >
                </div>
              </div>
              <div v-show="newColor" class="videoNewest">
                <div v-if="notes.length === 0" class="empty-data">
                  {{ $t("message.table_empty_text") }}
                </div>
                <div
                  v-for="note in notes"
                  :key="note.noteId"
                  class="videoNewest-content"
                >
                  <div class="videoNewest-L">
                    <!-- <div class="videoNewestL-img"> -->
                    <img
                      class="videoNewestL-img"
                      :src="note.noteResList[0].coverUrl"
                      alt
                    />
                    <!-- </div> -->
                    <div class="videoNewestLCenter">
                      <div class="videoNewest-title impose">
                        {{ note.noteContent }}
                      </div>
                      <div v-if="note.isDelete" class="delete">
                        <el-tag>
                          {{ $t("message.delete") }}
                        </el-tag>
                      </div>
                      <div
                        v-else-if="note.status === 'disabled'"
                        class="delete"
                      >
                        <el-tag>
                          {{ $t("user.block") }}
                        </el-tag>
                      </div>
                      <div class="create-time">{{ note.createTime | ndateFormat }}</div>
                    </div>
                    <div class="videoNewestL-many">
                      <div>
                        <i class="icon-yanjing"></i>
                        <p>{{ note.lookedCount }}</p>
                      </div>
                      <div>
                        <i class="icon-like"></i>
                        <p>{{ note.likedCount }}</p>
                      </div>
                      <div>
                        <i class="icon-pinglun"></i>
                        <p>{{ note.commentedCount }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="videoNewest-R">
                    <div>
                      <el-button type="text" @click="handleVideoPlay(note)">
                        <i class="icon-bofang"></i>
                      </el-button>
                      <!-- <i class="icon-shujugailan"></i>
                    <i class="icon-yonghu"></i> -->
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="!newColor" class="videoHottest videoNewest">
                <div
                  v-for="note in notes"
                  :key="note.noteId"
                  class="videoNewest-content"
                >
                  <div class="videoNewest-L">
                    <img
                      class="videoNewestL-img"
                      :src="note.noteResList[0].resUrl"
                      alt
                    />
                    <div class="videoNewestLCenter">
                      <div class="videoNewest-title impose"></div>
                    </div>
                    <div class="videoNewestL-many">
                      <div>
                        <p>{{ note.lookedCount }}</p>
                        <i class="icon-yanjing"></i>
                      </div>
                      <div>
                        <p>{{ note.likedCount }}</p>
                        <i class="icon-like"></i>
                      </div>
                      <div>
                        <p>{{ note.commentedCount }}</p>
                        <i class="icon-pinglun"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 分页 -->
            <el-pagination
              background
              :current-page="notePagination.current"
              :page-size="notePagination.size"
              layout="sizes, prev, pager, next"
              :total="notePagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              @prev-click="handleCurrentChange"
              @next-click="handleCurrentChange"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <el-dialog :visible.sync="videoDialog" width="40%" top="2vh">
      <div v-if="videoDialog" id="J_prismPlayer"></div>
    </el-dialog>
    <!-- </el-main> -->
  </div>
</template>

<script>
import { getUserNotes } from '@/api/user/user'
import { loadFile } from '@/util/loadFile'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'video', //
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)], //日期
      checkList: [], //复选框
      newColor: true,
      user: {},
      notes: [],
      registerDate: [],
      notePagination: {
        current: 1,
        size: 20,
        total: 0
      },
      videoDialog: false,
      noteQuery: {
        resType: 'video',
        userId: this.$route.params.userId,
        noteContent: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined
      }
    }
  },
  created() {
    loadFile([
      'aliyun-player-sdk/aliplayer-h5-min.js',
      'aliyun-player-sdk/aliplayer-min.css'
    ])
  },
  mounted() {
    this.getUserDetail()
    this.getUserNotes(this.noteQuery)
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getUserDetail() {
    },
    getUserNotes(noteQuery) {
      const query = Object.assign({}, noteQuery)
      query.current = this.notePagination.current
      query.size = this.notePagination.size
      delete query.publishDate
      // 清除空字段
      for (const key in query) {
        if (!query[key]) {
          delete query[key]
        }
      }
      getUserNotes(query).then(response => {
        const result = response.data.data
        console.log(result, 'result')
        this.notes = result.records
        this.notePagination.total = result.total
      })
    },
    createTime(val) {
      const [startDate, endDate] = val
      this.noteQuery.startCreateTime = startDate
      this.noteQuery.endCreateTime = endDate
      this.getUserNotes(this.noteQuery)
    },
    handleUpdate() {
      console.log('open update dialog')
      // 修改用户信息
    },
    // 动态切换
    handleNoteSwitch(tab) {
      this.registerDate = []
      this.notePagination = {
        current: 1,
        size: 20,
        total: 0
      }
      this.noteQuery = {
        resType: this.activeName,
        userId: this.$route.params.userId,
        noteContent: undefined,
        startCreateTime: undefined,
        endCreateTime: undefined
      }
      this.getUserNotes(this.noteQuery)
    },
    handleCurrentChange(current) {
      this.notePagination.current = current
      this.getUserNotes(this.noteQuery)
    },
    handleSizeChange(size) {
      this.notePagination.size = size
      this.getUserNotes(this.noteQuery)
    },
    handleSearch() {
      this.notePagination.current = 1
      this.getUserNotes(this.noteQuery)
    },
    handleChangeCheckbox(checked) {
      const query = Object.assign({}, this.noteQuery)
      checked.forEach(check => {
        console.log(check, 'check')
        if (check === 'isCircleNote') {
          query.isCircleNote = 1
        } else if (check === 'isGoodsNote') {
          query.isGoodsNote = true
        } else if (check === 'isDelNote') {
          query.isDelNote = true
        } else if (check === 'isDownNote') {
          query.isDownNote = true
        }
      })
      this.getUserNotes(query)
    },
    handleVideoPlay(note) {
      const video = note.noteResList[0]
      this.videoUrl = video.resUrl.split('?')[0]
      this.videoDialog = true
      this.$nextTick(() => {
        const player = new Aliplayer(
          {
            language: 'en-us',
            id: 'J_prismPlayer',
            width: '100%',
            height: '43rem',
            autoplay: true,
            source: this.videoUrl,
            cover: video.coverUrl
          },
          function(player) {
            console.log('player load success')
          }
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.note-box {
  display: -webkit-box;
  .user-info {
    background: #fff;
    margin: 0 1rem;
    width: 30%;
    min-width: 20rem;
    .user-base {
      padding: 2rem 2rem 1rem 2rem;
      border-bottom: 2px dashed #f3f3f3;
      .user-avatar-username {
        display: flex;
        justify-content: flex-start;
        .user-avatar {
          border-radius: 50%;
          width: 7rem;
          height: 7rem;
        }
        .user-base-info {
          text-align: left;
          margin-left: 1rem;
          .user-username {
            padding: 1rem 0 0 0;
          }
          .user-number {
            padding: 0.5rem 0;
          }
          .authentication {
            height: 2rem;
            line-height: 2rem;
            border-radius: 1rem;
            background: #2897f1;
            text-align: center;
            color: #fff;
          }
        }
      }
      .user-profile {
        color: gray;
        font-size: 1rem;
        padding: 1rem 0;
        text-align: left;
      }
      .user-subsidiary {
        color: red;
      }
      .user-info-more {
        .user-mobile-sex {
          display: flex;
          justify-content: space-between;
        }
        .user-location {
          padding: 1rem 0;
        }
      }
    }
    .user-label {
      padding: 0 0 2rem 1rem;
      border-bottom: 2px dashed #f3f3f3;
    }
    .data-view-title {
      padding-top: 1.2rem;
      margin-left: 1rem;
    }
    .user-data-view {
      .videoData {
        ul {
          width: 100%;
          display: flex;
          flex-direction: row;
          padding: 0;
          flex-wrap: wrap;

          li {
            list-style: none;
            text-align: center;
            width: 48.5%;
            font-size: 14px;
            border: 1px solid #f1f1f1;
          }
        }
      }
      ul {
        width: 100%;
        display: flex;
        flex-direction: row;
        padding: 0;
        flex-wrap: wrap;
        border-top: 1px solid #f3f3f3;
        li:nth-child(odd) {
          border-right: 1px solid #f1f1f1;
          border-bottom: 1px solid #f1f1f1;
        }
        li:nth-child(2) {
          border-right: 1px solid #f1f1f1;
          border-bottom: 1px solid #f1f1f1;
        }
        li:nth-child(4) {
          border-right: 1px solid #f1f1f1;
          border-bottom: 1px solid #f1f1f1;
        }
        li:nth-child(6) {
          border-bottom: 1px solid #f1f1f1;
        }
        li:nth-child(3) {
          border-right: none;
        }
        li {
          padding: 8px 0px;
          list-style: none;
          text-align: center;
          width: 33%;
          font-size: 14px;
          p {
            margin: 9px 0;
          }
        }
      }
    }
  }
  .user-feeds {
    .empty-data {
      text-align: center;
      color: gray;
      padding: 3rem;
    }
  }
}

// 最新/最热点击颜色
.newActive {
  color: blue;
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: white;
  color: #333;
  margin: 0 30px;
  border: 1px solid rgb(196, 194, 194);
}

.el-main {
  background-color: white;
  color: #333;
  border: 1px solid rgb(196, 194, 194);
  flex: 0.95;
}
.btn {
  float: right;
  margin: 5px 5px 0 0;
}
.delete {
  padding: 0.2rem 0;
}
//右边盒子信息内容
.content {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  padding: 0 10px;
  div {
    width: 100%;
  }
  .message {
    display: flex;
    margin-bottom: 10px;
    height: 150px;
    .head-picture {
      width: 180px;
      .head-icon {
        width: 140px;
        height: 140px;
        border: 1px solid black;
        border-radius: 50%;
        margin-left: 15px;
      }
    }
    .authentication {
      span {
        display: inline-block;
        width: 80px;
        text-align: center;
        padding: 0 2px;
        border: 1px solid black;
        border-radius: 10px;
        margin: 3px 3px 3px 0;
        background-color: white;
      }
      .backgroundColor {
        width: 82px;
        height: 23px;
        background-color: rgb(101, 101, 235);
        color: white;
        border: none;
      }
    }

    .message-content {
      width: 200px;
      p {
        margin: 15px 0 0 10px;
      }
    }
    .mewoName {
      font-size: 22px;
      font-weight: bold;
    }
    .classify {
      font-size: 15px;
      color: #7c7b7b;
      .size {
        font-size: 17px;
        color: black;
      }
    }
  }
  .subsidiary {
    padding: 3px;
    color: red;
  }
  .signature {
    color: #b3b2b2;
    font-size: 14px;
  }
  .phoneNumOrGender {
    display: flex;
    justify-content: space-between;
    color: #6d6b6b;
    .Gender {
      padding-right: 100px;
    }
  }
  .userLabel {
    padding: 10px 0;
    .userLabel-content {
      width: 100%;
      height: 50px;
      border: 1px solid black;
    }
  }
  .dotted-line {
    width: 100%;
    height: 0;
    margin-top: 10px;
    border-bottom: 1px dashed rgb(182, 179, 179);
  }
  .dataOne {
    width: 100%;
    ul {
      width: 100%;
      display: flex;
      flex-direction: row;
      padding: 0;
      flex-wrap: wrap;
      border-top: 1px solid black;
      li:nth-child(odd) {
        border-right: 1px solid black;
        border-bottom: 1px solid black;
      }
      li:nth-child(2) {
        border-right: 1px solid black;
        border-bottom: 1px solid black;
      }
      li:nth-child(4) {
        border-right: 1px solid black;
        border-bottom: 1px solid black;
      }
      li:nth-child(6) {
        border-bottom: 1px solid black;
      }
      li:nth-child(3) {
        border-right: none;
      }
      li {
        padding: 8px 0px;
        list-style: none;
        text-align: center;
        width: 33%;
        font-size: 14px;
        p {
          margin: 9px 0;
        }
      }
    }
  }
  .videoData {
    width: 100%;
    ul {
      width: 100%;
      display: flex;
      flex-direction: row;
      padding: 0;
      flex-wrap: wrap;

      li {
        list-style: none;
        text-align: center;
        width: 49.5%;
        font-size: 14px;
        border: 1px solid black;
      }
    }
  }
}
//左边盒子
// .el-tabs__nav.is-top {
//   div {
//     font-size: 15px;
//     letter-spacing: 1px;
//     height: 50px;
//     line-height: 50px;
//   }
// }
.detailsTap {
  width: 100%;
  background-color: white;
  border: 1px solid rgb(196, 194, 194);
  .el-tabs__item {
    padding: 0 40px !important;
  }
}
// 标题内部 文本框的尺寸  视频内容盒子
.searchContent {
  display: flex;
  width: 550px;
  margin-left: 40px;
  //搜索框
  .title-input {
    .el-input__inner {
      width: 500px;
      height: 40px;
      border-radius: 4px 0 0 4px;
    }
  }
  //搜索按钮
  .el-button.el-button--primary.el-button--medium {
    border-radius: 0 4px 4px 0;
  }
}
//日期 多选框
.screen {
  display: flex;
  align-items: center;
  margin: 20px 0 20px 40px;
  .block {
    margin-right: 40px;
  }
  .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }
}
.videoContent {
  //视频头部文字
  .character {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .characterLeft {
      padding: 10px 20px;
    }
    .characterRight {
      padding-right: 100px;
      span {
        padding-right: 10px;
        cursor: pointer;
      }
    }
  }
  .videoNewest {
    width: 100%;
    height: 100%;
    overflow: scroll;
    margin-top: 10px;
    border-top: 1px solid rgb(196, 194, 194);
    border-bottom: 1px solid rgb(196, 194, 194);

    .videoNewest-content {
      height: 180px;
      // border:1px solid rgb(196, 194, 194);
      border-bottom: 1px solid rgb(196, 194, 194);
      display: flex;
      .videoNewest-L {
        flex: 4;
        padding: 15px;
        display: flex;
        justify-content: space-around;
        .videoNewestL-img {
          width: 130px;
          height: 100%;
          border: 1px solid rgb(196, 194, 194);
        }
        .videoNewestLCenter {
          // width: 450px;
          height: 100%;
          margin-left: 20px;
          .imageNewest-label {
            margin-top: 30px;
          }
          .videoNewest-label {
            display: flex;
            p {
              width: 150px;
              margin-top: 10px;
            }
            div {
              height: 70px;
              overflow: hidden;
            }
            .videoNewest-labelContent {
              display: inline-block;
              padding: 2px 6px;
              background-color: orangered;
              border-radius: 10px;
              color: white;
              margin: 10px 10px 0 0;
            }
          }
          .videoNewest-duration {
            span {
              padding-right: 10px;
            }
          }
          .create-time {
            margin-top: 4rem;
          }
        }
        .videoNewest-duration {
          margin: 16px 0 0 0;
        }
        .videoNewestL-many {
          display: flex;
          margin: 45px 0 0 50px;
          div {
            padding: 0 10px;
            text-align: center;
          }
          i {
            font-size: 30px !important;
          }
          p {
            margin: 3px 0;
          }
        }
      }
      .videoNewest-R {
        flex: 1;
        border-left: 1px solid rgb(196, 194, 194);
        text-align: center;
        div {
          margin-top: 65px;
        }
        i {
          padding: 10px;
          font-size: 40px !important;
        }
      }
    }
  }
  .videoNewest::-webkit-scrollbar {
    display: none;
  }
}
</style>
