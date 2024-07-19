<template>
  <div class="main-content issueBox">
    <el-form
      ref="imageForm"
      :model="imageForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item label="动态内容：" prop="noteContent">
        <el-input
          v-model="imageForm.noteContent"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
          style="width: 50%"
        />
        <!-- 话题 -->
        <el-scrollbar>
          <div class="topic-list">
            <div
              class="topic-item"
              v-for="(item, index) in topicArr"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </el-scrollbar>
      </el-form-item>
      <el-form-item label="上传图片：" required prop="resList">
        <span class="tips">{{ $t("product.set_main_image") }}</span>
        <upload
          ref="upload"
          v-model="imageForm.resList"
          type="content"
          :limit="9"
          :multiple="true"
          :auto-upload="false"
          type-name="conten"
        />
      </el-form-item>
      <div v-if="startUpload">
        <el-progress
          v-for="(image, index) in imageForm.resList"
          :key="index"
          :percentage="percentates[index]"
        >
          <span>{{ image.resList }}</span>
        </el-progress>
      </div>
      <el-form-item label="展示方式：" prop="shownType">
        <el-input
          v-model="imageForm.shownType"
          disabled
          style="width: 20rem"
        ></el-input>
      </el-form-item>
      <el-form-item label="选择发布者：" prop="userId">
        <el-autocomplete
          v-model="mobile"
          popper-class="select-option"
          style="width: 20rem"
          :fetch-suggestions="querySearchMobile"
          :placeholder="$t('feed.issue.cell_phone')"
          @select="handleSelectUser"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="关联圈子">
        <el-select
          v-model="imageForm.circleId"
          style="width: 20rem"
          filterable
          placeholder="请优先选择发布者"
        >
          <el-option
            v-for="item in circleNameList"
            :key="item.circleId"
            :label="item.circleName"
            :value="item.circleId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联商圈">
        <el-autocomplete
          v-model="districtName"
          style="width: 20rem"
          :fetch-suggestions="querySearchDistrictName"
          placeholder="请输入关键词选择商圈"
          @select="handleSelectDistrict"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="绑定内容">
        <el-radio-group v-model="bindRadio" class="contentBind">
          <el-radio :label="1">
            门店：
            <el-autocomplete
              v-model="storeName"
              style="width: 20rem"
              :fetch-suggestions="querySearchStoresName"
              placeholder="请输入关键词选择门店"
              @select="handleSelectStores"
            ></el-autocomplete>
          </el-radio>

          <el-radio :label="2"
            >商品：<span v-if="bindRadio === 2" @click="openGoods"
              >选择商品</span
            ></el-radio
          >
          <el-radio :label="3"
            >活动：<span v-if="bindRadio === 3" @click="openActivity"
              >选择活动</span
            ></el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancelImage">
          {{ $t("message.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :disabled="b_loading"
          @click="handlePublishFeed"
          >{{ $t("message.publish") }}</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 活动弹框 -->
    <el-dialog
      title="绑定活动"
      :visible.sync="activityShow"
      width="70%"
      :before-close="handleActivityClose"
    >
      <el-table
        ref="multipleTable"
        :data="activityData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="活动名称" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="开始时间" width="120">
        </el-table-column>
        <el-table-column prop="address" label="结束时间"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="activityShow = false">取 消</el-button>
        <el-button type="primary" @click="activityShow = false">
          确 定
        </el-button>
      </span>
    </el-dialog>
    <!-- 商品弹框 -->
    <el-dialog
      title="绑定商品"
      :visible.sync="goodsShow"
      width="70%"
      :before-close="handleGoodsClose"
    >
      <el-table
        ref="multipleTable"
        :data="GoodsData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleGoodsChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="产品名称" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="Sku信息" width="120">
        </el-table-column>
        <el-table-column prop="address" label="商品售价(元)"> </el-table-column>
        <el-table-column prop="address" label="米粒"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodsShow = false">取 消</el-button>
        <el-button type="primary" @click="goodsShow = false"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import upload from "@/components/Upload-File/upload.vue";
import { getCirlesByName, getStoresByName } from "@/api/circle/circle";
import { getUsersbyMobile } from "@/api/user/user";
import { addImageObj } from "@/api/feeds/feed";
export default {
  name: "PublishImage",
  components: {
    upload,
  },
  data() {
    return {
      startUpload: false,
      dialogVisible: false,
      b_loading: false,
      mobile: undefined,
      storeName: undefined,
      districtName: null,
      percentates: [],
      searchRecords:
        JSON.parse(window.sessionStorage.getItem("mewooo-mobile-records")) ||
        [],
      imageForm: {
        noteContent: undefined,
        resList: [],
        shownType: "publish",
        circleId: undefined,
        userId: undefined,
        storeId: undefined,
        tagNameList: [],
      },
      // 圈子列表
      circleNameList: [],
      bindRadio: 1,
      activityShow: false,
      activityData: [],
      GoodsData: [],
      goodsShow: false,
      topicArr: [
        "#话题",
        "#话题2",
        "#话题3",
        "#话题3",
        "#话题3",
        "#话题",
        "#话题2",
        "#话题3",
        "#话题3",
        "#话题3",
        "#话题",
        "#话题2",
        "#话题3",
        "#话题3",
        "#话题3",
        "#话题",
        "#话题2",
        "#话题3",
        "#话题3",
        "#话题3",
        "#话题",
        "#话题2",
        "#话题3",
        "#话题3",
        "#话题3",
        "#话题",
        "#话题2",
        "#话题3",
        "#话题3",
        "#话题3",
      ],
      //创建表单验证
      rules: {
        noteContent: [
          {
            required: true,
            message: "请填写发布内容！",
            trigger: "blur",
          },
        ],
        resList: [
          {
            required: true,
            message: this.$t("feed.valid_image"),
            trigger: "blur",
          },
        ],
        shownType: [
          {
            required: true,
            message: this.$t("feed.valid_show_type"),
            trigger: "blur",
          },
        ],
        userId: [
          {
            required: true,
            message: this.$t("feed.valid_publish_user"),
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {},
  created() {},
  methods: {
    async handlePublishFeed() {
      // 获取文件名发布动态
      this.imageForm.resList = this.$refs.upload.imgURL;
      this.b_loading = true;
      this.$refs.imageForm.validate((valid) => {
        if (valid) {
          // 添加setinterval
          this.percentates = new Array(this.imageForm.resList.length).fill(0);
          const percentInterval = setInterval(() => {
            const percentates = this.percentates.map((percent) => {
              if (percent < 100) {
                percent = percent + 20;
              }
              if (percent >= 100) {
                percent = 99;
              }
              return percent;
            });
            this.percentates = percentates;
          }, 50);
          addImageObj(this.imageForm)
            .then(() => {
              this.$message({
                type: "success",
                message: "添加成功",
              });
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            })
            .catch(() => {
              this.b_loading = false;
            });
        } else {
          this.b_loading = false;
        }
      });
    },
    handleCancelImage() {
      this.$router.go(-1);
    },
    querySearchMobile(mobile, cb) {
      if (!mobile) {
        cb(this.searchRecords);
        return;
      }
      // 搜索手机号码
      getUsersbyMobile(mobile).then((res) => {
        const users = res.data.data.records;
        console.debug("users", res.data.data.records);
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
      this.imageForm.userId = user.userId;
      const idx = this.searchRecords.indexOf(user);
      if (idx !== -1) {
        this.searchRecords.splice(idx, 1);
      }
      this.searchRecords.unshift(user);
      if (this.searchRecords.length >= 8) {
        this.searchRecords.pop();
      }
      window.sessionStorage.setItem(
        "mewooo-mobile-records",
        JSON.stringify(this.searchRecords)
      );
      // 搜索圈子名称
      getCirlesByName({
        userId: this.imageForm.userId,
      }).then((res) => {
        this.circleNameList = res.data.data;
      });
    },

    handleSelectStores(circle) {
      this.imageForm.storeId = circle.storeId;
    },

    querySearchStoresName(queryString, cb) {
      // 搜索门店名称
      getStoresByName({
        keyword: queryString,
      }).then((res) => {
        const stores = res.data.data;
        cb(
          stores.map((circle) => {
            return { value: circle.storeName, storeId: circle.storeId };
          })
        );
      });
    },
    // 商圈搜索
    handleSelectDistrict(store) {},
    querySearchDistrictName() {},

    // 打开活动弹框
    openActivity() {
      this.activityShow = true;
    },
    // 关闭活动表格弹框
    handleActivityClose() {},
    // 活动表格多选
    handleSelectionChange() {},
    // 商品弹框
    openGoods() {
      this.goodsShow = true;
    },
    // 关闭商品表格弹框
    handleGoodsClose() {},
    // 商品表格多选
    handleGoodsChange() {},
  },
};
</script>

<style lang="scss" scoped>
.issueBox {
  box-sizing: border-box;
}
.tips {
  color: #80002a;
}
.select-option {
  width: 30rem !important;
}
.contentBind {
  display: flex;
  flex-direction: column;
}
.contentBind ::v-deep .el-radio {
  margin-top: 10px;
}
.contentBind span {
  color: #44a0ff;
}
.topic-list {
  display: flex;
  flex-direction: row;
  overflow-x: true;
}
.topic-item {
  display: flex;
  flex-direction: row;
  min-width: 50px;
}
::v-deep .el-scrollbar {
  width: 500px;
}
</style>
