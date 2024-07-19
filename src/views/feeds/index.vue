<template>
  <div>
    <basic-container>
      <el-button
        v-if="permissions.note_add"
        style="margin: 0.5rem;"
        type="primary"
        @click="handleCreate"
      >{{ $t("message.publish") }}</el-button
      >
      <waterfall :line-gap="250" :watch="data" align="center">
        <waterfall-slot
          v-for="(feed, index) in data"
          :key="feed.nodeId"
          style="padding:0.5rem 1rem;"
          :width="800"
          :height="1350"
          :order="index"
        >
          <el-card :body-style="{ padding: '8px' }" shadow="always">
            <template v-if="feed.resType === 'image'">
              <el-carousel :autoplay="false" indicator-position="none">
                <el-carousel-item v-for="image in feed.images" :key="image">
                  <el-image
                    ref="image"
                    :lazy="index < 10 ? false : true"
                    style="height:14rem;border-radius: 0.2rem 0.2rem 0 0;"
                    :src="image"
                    alt=""
                  />
                </el-carousel-item>
              </el-carousel>
            </template>
            <video
              v-else
              width="200"
              height="240"
              controls
              style="margin: 0 auto;"
            >
              <source :src="feed.images[0].split('?')[0]" type="video/mp4" />
            </video>
            <div style="padding: 0.5rem 0.5rem 1rem 0.5rem;">
              <div
                class="content"
                :class="feed.resType === 'image' ? 'iamge-content' : ''"
              >
                <span
                  class="title"
                >{{ feed.noteTitle }}:
                  <span>{{ feed.noteAbstract }}</span></span
                >
              </div>
              <div class="footer">
                <div class="user">
                  <div>
                    <el-image
                      :src="feed.user.avatar"
                      :lazy="index < 10 ? false : true"
                      class="avatar"
                      fill="scale-down"
                    />
                  </div>
                  <div class="username">{{ feed.user.username }}</div>
                </div>
                <div class="circle-tag">
                  <div>
                    <el-tag v-if="feed.circleName">{{
                      feed.circleName
                    }}</el-tag>
                  </div>
                  <div
                    class="bottom clearfix"
                    :class="feed.circleName ? '' : 'date'"
                  >
                    <time
                    ><span class="time">{{
                      feed.createTime | ndateFormat
                    }}</span></time
                    >
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </waterfall-slot>
      </waterfall>
      <div class="block">
        <el-pagination
          background
          :page-size="20"
          layout="prev, pager, next"
          :total="page.total"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </basic-container>
    <el-dialog
      :visible="visible"
      :title="$t('message.add')"
      @close="handleCancel"
    >
      <el-form
        ref="feedForm"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="80px"
      >
        <el-form-item prop="noteTitle" :label="$t('feed.title')">
          <el-input v-model="form.noteTitle" />
        </el-form-item>
        <el-form-item prop="noteContent" :label="$t('feed.content')">
          <el-input
            v-model="form.noteContent"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 10 }"
          />
        </el-form-item>
        <el-form-item prop="resList" :label="$t('feed.res_list')">
          <!-- 添加if重新渲染图片上传组件避免再次打开表单看不到 -->
          <upload
            v-if="visible"
            ref="upload"
            v-model="form.resList"
            type="content"
            :limit="9"
            :multiple="true"
            :auto-upload="false"
            type-name="conten"
          />
        </el-form-item>
        <el-form-item prop="shownType" :label="$t('feed.show_type')">
          <el-select v-model="form.shownType">
            <el-option
              v-for="value in types"
              :key="value.itemId"
              :label="value.itemLabel"
              :value="value.itemValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="circleId" :label="$t('feed.join_circle')">
          <el-select v-model="form.circleId">
            <el-option
              v-for="circle in circles"
              :key="circle.circleId"
              :label="circle.circleName"
              :value="circle.circleId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <span v-if="b_loading" class="loading-tips">图片/视频资源正在上传中...</span>
        <el-form-item>
          <el-button
            :loading="b_loading"
            @click="handleSubmit"
          >{{ $t("message.publish") }}</el-button
          >
          <el-button @click="handleCancel">{{
            $t("message.cancel")
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { addImageObj, addVideoObj, getFeeds } from '@/api/feeds/feed'
import { remote } from '@/api/system/dict'
import { getCircleByUserId } from '@/api/circle/circle'
import { mapGetters } from 'vuex'
import upload from '@/components/Upload-File/upload.vue'
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'

export default {
  components: { upload, Waterfall, WaterfallSlot },
  data() {
    return {
      data: [],
      form: {
        circleId: '',
        noteTitle: '',
        noteContent: '',
        resList: [],
        shownType: ''
      },
      circles: [],
      videoVisible: false,
      b_loading: false,
      types:
        JSON.parse(window.sessionStorage.getItem('mewooo-note_types')) || [],
      visible: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      loading: false,
      swiperOptions: {
        autoplay: true
      },
      rules: {
        noteTitle: [
          {
            required: true,
            message: this.$t('feed.valid_title'),
            trigger: 'blur'
          }
        ],
        noteContent: [
          {
            required: true,
            message: this.$t('feed.valid_content'),
            trigger: 'blur'
          }
        ],
        resList: [
          {
            required: true,
            message: this.$t('feed.valid_res_list'),
            trigger: 'blur'
          }
        ],
        shownType: [
          {
            required: true,
            message: this.$t('feed.valid_show_type'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created() {
    this.fetchList(this.page)
  },
  methods: {
    fetchList(page) {
      this.loading = true
      getFeeds(
        Object.assign({
          current: page.currentPage,
          size: page.pageSize
        })
      )
        .then(res => {
          const result = res.data.data
          this.data = result.records
          this.data.forEach(feed => {
            feed.images = []
            feed.noteResList.map(image => {
              feed.images.push(image.resUrl)
            })
          })
          this.page.total = result.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    async handleCreate() {
      this.visible = true
      if (this.types.length <= 0) {
        await remote('note_shown_type').then(response => {
          window.sessionStorage.setItem(
            'mewooo-note_types',
            JSON.stringify(response.data.data)
          )
          this.types = response.data.data
        })
      }
      if (this.circles.length <= 0) {
        await getCircleByUserId().then(response => {
          this.circles = response.data.data
        })
      }
    },
    handleCancel() {
      this.visible = false
      this.$refs.feedForm.resetFields()
      this.form = {
        noteTitle: '',
        noteContent: '',
        resList: [],
        shownType: ''
      }
    },
    handlePageChange(page) {
      this.page.currentPage = page
      this.fetchList(this.page)
    },
    async handleSubmit() {
      // 获取文件名发布动态
      this.$refs.upload.getContentUploadParam()
      this.$refs.feedForm.validate(valid => {
        if (valid) {
          this.b_loading = true
          if (this.$refs.upload.fileType === 'image') {
            addImageObj(this.form)
              .then(res => {
                this.$refs.upload.backUpload(res.data.data)
                const interval = setInterval(() => {
                  console.log(this.$refs.upload.uploadCount, 'count22')
                  console.log(this.form.resList.length, 'length')
                  if (
                    this.$refs.upload.uploadCount === this.form.resList.length
                  ) {
                    this.b_loading = false
                    this.$message({
                      type: 'success',
                      message: this.$t('message.publish_success')
                    })
                    clearInterval(interval)
                    this.handleCancel()
                  }
                }, 100)
                this.fetchList(this.page)
              })
              .catch(() => {
                this.b_loading = false
              })
          } else {
            addVideoObj(this.form)
              .then(res => {
                this.$refs.upload.backUpload([res.data.data])
                const interval = setInterval(() => {
                  if (
                    this.$refs.upload.uploadCount === this.form.resList.length
                  ) {
                    this.b_loading = false
                    this.$message({
                      type: 'success',
                      message: this.$t('message.publish_success')
                    })
                    clearInterval(interval)
                    this.handleCancel()
                  }
                }, 100)
                this.fetchList(this.page)
              })
              .catch(() => {
                this.b_loading = false
              })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.iamge-content {
  margin-top: -5rem;
}
.content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.user {
  text-align: center;
}
.bottom {
  margin-top: 0.5rem;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
  border-radius: 0.5rem;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.footer {
  position: relative;
  top: 0.6rem;
  /* margin-top: 0.5rem; */
  display: flex;
  justify-content: space-around;
}
.ciccle-name {
  margin-top: 1rem;
}
.avatar {
  border-radius: 50%;
  width: 40px;
  height: 40px;
}
.date {
  vertical-align: middle;
  margin-top: 20%;
}
.circle-tag {
  text-align: right;
}
.loading-tips {
  text-align: center;
  color: #80002a;
}
</style>
