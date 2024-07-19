<template>
  <div class="outVideoBox">
    <!-- 表单 -->
    <!-- 筛选条件表单 -->
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <!-- 封禁原因 -->
      <el-form-item
        :label="$t('message.banned_type')"
        class="giftSelect videoSelect"
      >
        <span>:</span>
        <el-select
          v-model="search.amountWwork"
          :placeholder="$t('message.please_select')"
          class="userWaysSelect videoSelect"
        >
          <el-option
            v-for="remark in remarks"
            :key="remark.itemId"
            :label="remark.itemLabel"
            :value="remark.itemValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 封禁时间 -->
      <el-form-item :label="$t('circle.ban_time')">
        <span>:</span>
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
      <!-- 区域 -->
      <el-form-item :label="$t('feed.video.area')" class="videoSelect">
        <span>:</span>
        <treeselect
          v-model="search.location"
          style="width: 200px;"
          :options="areas"
          :multiple="false"
          :normalizer="normalizer"
          :show-count="true"
        />
      </el-form-item>
      <!-- 搜索 -->
      <el-form-item class="videoSelect">
        <el-input
          v-model="search.keyword"
          clearable
          class="userInputWidth"
          :placeholder="$t('message.search_keyword')"
        >
          <el-button slot="append" type="primary" @click="handleSearch">
            {{ $t("message.search") }}
          </el-button>
        </el-input>
      </el-form-item>

      <el-form-item v-if="permissions.org_name_search">
        <el-autocomplete
          v-model="orgKeyword"
          :fetch-suggestions="handleSearchOrg"
          :placeholder="$t('message.search_org_name')"
          @select="handleOrgSelect"
        >
          <el-button slot="append" @click="handleClearKeyword">{{
            $t("message.clear")
          }}</el-button>
        </el-autocomplete>
      </el-form-item>
      <!-- 多选 -->
      <el-form-item class="videoSelect">
        <template>
          <el-checkbox-group v-model="checkList" @change="handleChangeCheckbox">
            <el-checkbox label="isCircleNote">
              {{ $t("feed.video.network_video") }}
            </el-checkbox>
            <el-checkbox label="isGoodsNote">
              {{ $t("feed.video.related_video") }}
            </el-checkbox>
            <el-checkbox label="isDelNote">
              {{ $t("feed.video.blockDeleted_videos") }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </el-form-item>
    </el-form>
    <!-- 表格 分页 -->
    <div class="userContent">
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :empty-text="$t('message.table_empty_text')"
        :data="list"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          width="110"
          :label="$t('feed.video.videoId')"
          prop="noteId"
        ></el-table-column>
        <el-table-column
          :label="$t('feed.video.video_content')"
          prop="content"
          width="280"
          align="center"
        >
          <template slot-scope="scope">
            <div class="content-wrap">
              <div>
                <img
                  class="image"
                  :src="scope.row.noteResList[0].coverUrl"
                  alt="image load failed"
                />
              </div>
              <div>
                <div class="note-content">{{ scope.row.noteContent }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('feed.video.main_information')"
          prop="user"
          width="230"
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
                  alt
                />
              </div>
              <div>
                <div>{{ scope.row.user.username }}</div>
                <div>{{ scope.row.createTime | ndateFormat }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('feed.outvideo.shelves_because')"
          prop="noteOffResp.reason"
          align="center"
          width="110"
        ></el-table-column>
        <el-table-column
          :label="$t('feed.outvideo.launch_time')"
          prop="noteOffResp.createTime"
          width="110"
        >
          <template
            slot-scope="scope"
          ><span>{{ scope.row.createTime | ndateFormat }}</span></template
          >
        </el-table-column>
        <el-table-column
          :label="$t('message.operate')"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="disable"
              @click="handleOffShelf(scope.row)"
            >{{ $t("message.cause") }}</el-button
            >
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('feed.video.video_play')"
              placement="top"
            >
              <el-button type="text" @click="handleVideoPlay(scope.row)">
                <i class="icon-bofang"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        :current-page="pagination.current"
        :page-sizes="pagination.pageSize"
        :page-size="pagination.size"
        layout="sizes, prev, pager, next"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @next-click="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog :visible.sync="videoDialog" width="40%">
      <div v-if="videoDialog" id="J_prismPlayer"></div>
    </el-dialog>
    <!-- 封禁原因弹出框 -->
    <el-dialog
      :title="$t('feed.outvideo.shelves_because')"
      class="dialog dialogReason"
      :visible.sync="dialogReason"
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
            disabled
            type="textarea"
            :rows="4"
            placeholder=""
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getOffVideos } from '@/api/feeds/feed'
import { remote } from '@/api/system/dict'
import { areaTree } from '@/api/area'
import { loadFile } from '@/util/loadFile'
import { getOrgList } from '@/api/user/orgUser'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapGetters } from 'vuex'
export default {
  name: 'Outvideos',
  components: {
    Treeselect
  },
  data() {
    return {
      list: [],
      checkList: [],
      textarea: '',
      search: {
        //表单
        keyword: undefined,
        isGoodsNote: undefined,
        isDelNote: undefined,
        isCircleNote: undefined
      },
      registerDate: '', // 封禁日期
      videoDialog: false, // 视频播放
      videoUrl: '',
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
        total: 40
      },
      offReason: {},
      createForm: {},
      userForm: {
        way: undefined,
        name: undefined,
        textarea: undefined,
        password: undefined,
        profile: undefined,
        roles: [],
        mobile: undefined,
        sex: undefined,
        location: undefined,
        birthday: undefined,
        email: undefined
      },
      roles: [], // 角色列表
      forbbidForm: {},
      listLoading: false,
      b_loading: false, // 按钮loading
      dialogVisible: false, //新增弹出框
      dialogBanned: false, //封禁弹出框
      dialogReason: false, //封禁原因
      status: 'normal',
      remarks: [], // 封禁类型
      areas: [], // 区域
      orgKeyword: undefined
    }
  },
  created() {
    loadFile([
      'aliyun-player-sdk/aliplayer-h5-min.js',
      'aliyun-player-sdk/aliplayer-min.css'
    ])
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted() {
    this.getVideoList(this.search)
    this.getRemarks()
    this.getAreas()
  },

  methods: {
    //创建日期时间触发
    createTime(val) {
      const [startDate, endDate] = val
      this.search.startCreateTime = startDate
      this.search.endCreateTime = endDate
    },
    getRemarks() {
      if (this.remarks.length === 0) {
        remote('note_report_reason').then(res => {
          this.remarks = res.data.data
        })
      }
    },
    getAreas(query = { lazy: true, parentId: -1 }) {
      areaTree(query).then(res => {
        this.areas = res.data.data
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children === null) {
        delete node.children
      }
      return {
        id: node.code,
        label: node.name,
        children: node.children
      }
    },
    getVideoList(params) {
      this.listLoading = true
      const query = Object.assign({}, params)
      query.current = this.pagination.current
      query.size = this.pagination.size
      getOffVideos(query)
        .then(res => {
          this.listLoading = false
          const result = res.data.data
          this.list = result.records
          this.pagination.total = result.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleChangeCheckbox(checked) {
      const query = Object.assign({}, this.search)
      checked.forEach(check => {
        if (check === 'isCircleNote') {
          query.isCircleNote = 1
        } else if (check === 'isGoodsNote') {
          query.isGoodsNote = true
        } else if (check === 'isDelNote') {
          query.isDelNote = true
        }
      })
      this.getVideoList(query)
    },
    handleSearch() {
      this.getVideoList(this.search)
    },
    // 原因
    handleOffShelf(note) {
      this.dialogReason = true
      this.offReason = note.noteOffResp
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
            height: '30rem',
            autoplay: true,
            source: this.videoUrl,
            cover: video.coverUrl
          },
          function(player) {
            console.log('player load success')
          }
        )
      })
    },
    handleClick(tab, event) {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //页容量改变
    handleSizeChange(size) {
      this.pagination.size = size
      this.getVideoList(this.search)
    },
    //页码改变
    handleCurrentChange(current) {
      this.pagination.current = current
      this.getVideoList(this.search)
    },
    handleSearchOrg(keyword, cb) {
      if (!keyword || keyword === '') {
        return cb([])
      }
      getOrgList({ orgName: keyword.trim() }).then(res => {
        const { records } = res.data.data
        const orgList = records.map(org => {
          org.value = org.orgName
          return org
        })
        cb(orgList)
      })
    },
    handleOrgSelect(org) {
      this.pagination.current = 1
      this.getVideoList({ orgId: org.orgId })
    },
    handleClearKeyword() {
      this.getVideoList()
      this.orgKeyword = undefined
    }
  }
}
</script>

<style lang="scss">
.outVideoBox {
  width: 100%;
  .content-wrap {
    display: flex;
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
    span {
      margin-right: 10px;
    }
    .el-form-item__label {
      padding: 0;
    }
    .el-select__caret.el-input__icon.el-icon-arrow-up {
      margin-right: -18px;
    }
  }
  .el-form-item.videoSelect {
    display: flex;
    margin-right: 45px;
    .el-input__inner {
      padding: 0;
      border-radius: 0;
    }
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
        }
      }
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
    width: 260px;
    margin-right: 20px;
  }
  .createUser {
    margin: -30px 0 10px 0;
  }
  .userSelection {
    width: 105px;
    .el-input__inner {
      width: 105px !important;
    }
  }
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
