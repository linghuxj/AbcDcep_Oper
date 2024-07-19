<template>
  <div class="issueBox">
    <el-form
      :model="videoForm"
      :rules="rules"
      ref="videoForm"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('feed.content')" prop="noteContent">
        <el-input
          type="textarea"
          v-model="videoForm.noteContent"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </el-form-item>
      <el-form-item :label="$t('feed.issue.upload_pictures')" required prop="resList">
        <span class="tips">{{ $t("feed.video_limit") }}</span>
        <upload
          ref="upload"
          type="content"
          checkType="video"
          :limit="1"
          v-model="videoForm.resList"
          :multiple="false"
          :auto-upload="false"
          type-name="conten"
        />
      </el-form-item>
      <div v-if="startUpload">
        <el-progress
          :percentage="percentates[count]"
          :key="count"
          v-for="count in videoForm.resList.length"
        ></el-progress>
      </div>
      <el-form-item :label="$t('feed.issue.display_mode')" prop="shownType">
        <el-input v-model="videoForm.shownType" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('feed.issue.select_publisher')" prop="userId">
        <el-autocomplete
          popper-class="select-option"
          v-model="mobile"
          style="width: 20rem;"
          :fetch-suggestions="querySearchMobile"
          :placeholder="$t('feed.issue.cell_phone')"
          @select="handleSelectUser"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item v-if="videoForm.userId" label="关联圈子" prop="circleId">
        <el-autocomplete
          v-model="circleName"
          style="width: 20rem;"
          :fetch-suggestions="querySearchCircleName"
          :placeholder="$t('feed.issue.enter_keywords')"
          @select="handleSelectCircle"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item v-if="videoForm.userId" label="关联门店" prop="storeId">
        <el-autocomplete
          v-model="storeName"
          style="width: 20rem"
          :fetch-suggestions="querySearchStoresName"
          placeholder="请输入关键词选择门店"
          @select="handleSelectStores"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancelVideo">
          {{
          $t("message.cancel")
          }}
        </el-button>
        <el-button
          type="primary"
          @click="handlePublishFeed"
          :disabled="b_loading"
        >{{ $t("message.publish") }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import upload from '@/components/Upload-File/upload.vue'
import { getCirlesByName, getStoresByName } from '@/api/circle/circle'
import { getUsersbyMobile } from '@/api/user/user'
import { addVideoObj } from '@/api/feeds/feed'
export default {
  name: 'publishImage',
  components: {
    upload,
  },
  data() {
    return {
      startUpload: false,
      dialogVisible: false,
      b_loading: false,
      mobile: undefined,
      circleName: undefined,
      storeName: undefined,
      percentates: [],
      searchRecords:
        JSON.parse(window.sessionStorage.getItem('mewooo-mobile-records')) ||
        [],
      videoForm: {
        storeName: undefined,
        noteContent: undefined,
        resList: [],
        shownType: 'publish',
        circleId: undefined,
        userId: undefined,
      },
      //创建表单验证
      rules: {
        resList: [
          {
            required: true,
            message: this.$t('feed.valid_video'),
            trigger: 'blur',
          },
        ],
        shownType: [
          {
            required: true,
            message: this.$t('feed.valid_show_type'),
            trigger: 'blur',
          },
        ],
        userId: [
          {
            required: true,
            message: this.$t('feed.valid_publish_user'),
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 发布动态
    async handlePublishFeed() {
      const uploadParams = this.$refs.upload.imgURL
      uploadParams.forEach(item => {
        this.videoForm.resList = item
      })
      this.$refs.videoForm.validate((valid) => {
        if (valid) {
          this.b_loading = true
          this.percentates = new Array(this.videoForm.resList.length).fill(0)
          console.log(this.percentates, 0)
          let percentInterval = setInterval(() => {
            let percentates = this.percentates.map((percent) => {
              console.log(percent, 1)
              if (percent < 100) {
                percent = percent + 10
              }
              if (percent >= 100) {
                percent = 99
              }
              return percent
            })
            this.percentates = percentates
            console.log(this.percentates, 2)
          }, 50)
          addVideoObj(this.videoForm)
            .then((res) => {
              this.$refs.upload.backUpload([res.data.data])
              this.startUpload = true
              let interval = setInterval(() => {
                if (
                  this.$refs.upload.uploadCount ===
                  this.videoForm.resList.length
                ) {
                  this.b_loading = false
                  this.$message({
                    type: 'success',
                    message: this.$t('message.publish_success'),
                  })
                  clearInterval(interval)
                  clearInterval(percentInterval)
                  this.$refs.upload.clearFiles()
                  this.mobile = undefined
                  this.circleName = undefined
                  this.videoForm = {
                    noteContent: undefined,
                    resList: [],
                    shownType: 'publish',
                    circleId: undefined,
                    userId: undefined,
                  }
                }
              }, 100)
            })
            .catch(() => {
              this.b_loading = false
            })
        }
      })
    },
    handleCancelVideo() {
      this.$router.go(-1)
    },
    querySearchMobile(mobile, cb) {
      if (!mobile) {
        cb(this.searchRecords)
        return
      }
      // 搜索手机号码(关联发布人)
      getUsersbyMobile(mobile).then((res) => {
        let users = res.data.data.records
        console.debug('users',users)
        cb(
          users.map((user) => {
            return {
              value: user.mobile + `(${user.username})`,
              userId: user.userId,
            }
          })
        )
      })
    },
    handleSelectUser(user) {
      this.videoForm.userId = user.userId
      const idx = this.searchRecords.indexOf(user)
      if (idx !== -1) {
        this.searchRecords.splice(idx, 1)
      }
      this.searchRecords.unshift(user)
      if (this.searchRecords.length >= 8) {
        this.searchRecords.pop()
      }
      window.sessionStorage.setItem(
        'mewooo-mobile-records',
        JSON.stringify(this.searchRecords)
      )
    },
    handleSelectCircle(circle) {
      this.videoForm.circleId = circle.circleId
    },
    handleSelectStores(circle) {
      this.videoForm.circleId = circle.circleId
    },
    // 查询关联圈子
    querySearchCircleName(queryString, cb) {
      // 搜索圈子名称
      getCirlesByName({
        circleName: queryString,
      }).then((res) => {
        let circles = res.data.data
        cb(
          circles.map((circle) => {
            return { value: circle.circleName, circleId: circle.circleId }
          })
        )
      })
    },
    // 查询门店
    querySearchStoresName(queryString, cb) {
      // 搜索门店名称
      getStoresByName({
        keyword: queryString,
      }).then((res) => {
        let stores = res.data.data
        cb(
          stores.map((circle) => {
            return { value: circle.storeName, circleId: circle.circleId }
          })
        )
      })
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.issueBox {
  padding: 2rem;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.tips {
  color: #80002a;
}
.select-option {
  width: 30rem !important;
}
</style>
