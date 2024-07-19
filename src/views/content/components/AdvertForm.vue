<template>
  <div class="main-content">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="选择城市：" prop="areaCodeList">
        <el-select
          v-model="form.areaCodeList"
          multiple
          filterable
          remote
          :multiple-limit="multiple_limit"
          reserve-keyword
          :remote-method="remoteArea"
          placeholder="请输入或选择城市名称"
        >
          <el-option
            v-for="(item, index) in areaList"
            :key="index"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告位：" prop="adPosition">
        <el-select v-model="form.adPosition">
          <el-option
            v-for="item in advertList"
            :key="item.id"
            :label="item.name"
            :value="item.position"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告图片：" prop="adImage">
        <upload
          ref="addUpload"
          v-model="form.adImage"
          type="content"
          :limit="1"
          :multiple="true"
          :auto-upload="false"
          type-name="conten"
        />
      </el-form-item>
      <el-form-item label="链接：" prop="adLinkType">
        <el-radio-group v-model="form.adLinkType" class="el-radio-adLink">
          <div v-for="(item, index2) in advertTypeArr" :key="index2">
            <!-- 
              v-if="item.dictValue !== 'product_special'" -->
            <el-radio :label="item.dictValue">{{ item.dictName }}</el-radio>
            <el-form-item
              v-if="item.dictValue === 'product_special'"
              label="专题选择"
              prop="newLink"
            >
              <el-select
                v-model="form.newLink"
                :disabled="form.adLinkType != 'product_special'"
              >
                <el-option
                  v-for="(item2, index) in topicList"
                  :key="index"
                  :label="item2.topicName"
                  :value="item2.topicId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="item.dictValue === 'link'"
              label="H5链接"
              prop="h5Link"
            >
              <el-input
                v-model="form.h5Link"
                placeholder="请输入H5链接"
                style="width: 200px"
                :disabled="form.adLinkType != 'link'"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="起止时间：" required>
        <el-col style="width: 230px" :span="3">
          <el-form-item prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerOptionsStart"
              :default-time="pickerTimeStart()"
            />
          </el-form-item>
        </el-col>
        <el-col style="width: 40px; text-align: center" :span="1">至</el-col>
        <el-col style="width: 230px" :span="3">
          <el-form-item prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerOptionsEnd"
              default-time="23:59:59"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input
          v-model="form.adSort"
          placeholder="请输入排序"
          style="width: 30%"
        ></el-input>
        <p class="sort-tip">不填，则该广告默认排广告位的最后一位。</p>
      </el-form-item>
      <!--底部按钮  -->
      <div style="width: 100%; text-align: center">
        <div>
          <el-button style="margin-top: 12px" @click="to_cancel()"
            >取消</el-button
          >
          <el-button
            :loading="interactive.loading"
            style="margin-top: 12px"
            type="primary"
            @click="to_save()"
            >保存</el-button
          >
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getHour, getMinute, getSecond } from "@/util/date";
import upload from "@/components/Upload-File/upload";
import {
  getAdvertPositionAll,
  addAdvert,
  getAdvertType,
  updateAdvert,
  getAdvertById,
  getAreaList,
} from "@/api/content/advert";
import { topicList } from "@/api/content/special";

import { findTag } from "@/util/deltag";
export default {
  components: { upload },
  data() {
    // 地址校验
    var areaCodeList = (rule, value, callback) => {
      if (!value) {
        callback("请选择城市");
      } else {
        callback();
      }
    };
    // 专题选择校验
    var newLink = (rule, value, callback) => {
      if (this.form.adLinkType === "product_special") {
        if (!value) {
          callback("请选择专题");
        }
        callback();
      } else {
        callback();
      }
    };
    var h5Link = (rule, value, callback) => {
      if (this.form.adLinkType === "link") {
        if (!value) {
          callback("请输入h5链接");
        }
        callback();
      } else {
        callback();
      }
    };
    var adImage = (rule, value, callback) => {
      // 获取奖品图片路径
      const uploadParams = this.$refs.addUpload.imgURL;

      this.form.adImage = uploadParams[0];
      if (uploadParams.length <= 0) {
        callback("请上传广告图片");
      }
      callback();
    };
    return {
      // 开始时间
      pickerOptionsStart: {
        disabledDate: (time) => {
          const endDateVal = this.form.endTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          } else {
            return time.getTime() < new Date(new Date().toLocaleDateString());
          }
        },
      },
      // 结束时间
      pickerOptionsEnd: {
        disabledDate: (time) => {
          const beginDateVal = this.form.startTime;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime();
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        },
      },
      interactive: {
        loading: false,
      },
      form: {
        adImage: undefined,
        adLinkType: undefined,
        adLink: undefined,
        newLink: undefined,
        h5Link: undefined,
        adPosition: undefined,
        startTime: undefined,
        endTime: undefined,
        adSort: undefined,
        areaCodeList: [],
      },
      rules: {
        areaCodeList: [
          { required: true, validator: areaCodeList, trigger: "change" },
        ],
        adPosition: [
          { required: true, message: "请选择广告位", trigger: "change" },
        ],
        adLinkType: [
          { required: true, message: "请选择广告链接", trigger: "change" },
        ],
        newLink: [{ required: true, validator: newLink, trigger: "change" }],
        h5Link: [{ required: true, validator: h5Link, trigger: "blur" }],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        adImage: [{ required: true, validator: adImage, trigger: "change" }],
      },
      advertList: [],
      advertTypeArr: [],
      topicList: [],
      areaList: [],
      multiple_limit: 5,
      adId: undefined,
      keyword: undefined,
    };
  },
  created() {
    if (this.$route.query.adId) {
      this.adId = this.$route.query.adId;
      this.$nextTick(() => {
        this.getAdvertById();
      });
    }
    this.getAdvertPositionAll();
    this.getAdvertType();
    this.getTopicList();
    this.getAreaList();
  },
  methods: {
    // 查询广告位置列表
    getAdvertPositionAll() {
      getAdvertPositionAll().then((res) => {
        this.advertList = res.data.data;
      });
    },
    //查询专题列表
    getTopicList() {
      topicList().then((res) => {
        this.topicList = res.data.data;
      });
    },
    //查询地区列表
    getAreaList() {
      const data = {
        areaTypes: ['country','city'],
        size: "200",
        keyword: this.keyword,
      };
      getAreaList(data).then((res) => {
        this.areaList = res.data.data;
      });
    },
    //远程搜索城市
    remoteArea(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.keyword = query;
          this.areaList = [];
          this.getAreaList();
        }, 200);
      } else {
        this.areaList = [];
        this.keyword = undefined;
        this.getAreaList();
      }
    },
    // 查询广告位详情
    getAdvertById() {
      getAdvertById(this.adId).then((res) => {
        let data = res.data.data;
        if (data.adLinkType === "product_special") {
          data.newLink = Number(data.adLink);
        } else if (data.adLinkType === "link") {
          data.h5Link = data.adLink;
        }
        this.form = data;
        let adImage = [res.data.data.adImage];
        this.$refs.addUpload.loadImg(adImage);
      });
    },
    // 去保存
    to_save() {
      if (this.form.adLinkType === "product_special") {
        this.form.adLink = this.form.newLink;
      } else if (this.form.adLinkType === "link") {
        this.form.adLink = this.form.h5Link;
      } else {
        this.adLink = undefined;
      }

      this.interactive.loading = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          setTimeout(() => {
            if (this.adId) {
              this.updateAdvert();
            } else {
              this.addAdvert();
            }
          }, 2000);
        } else {
          this.interactive.loading = false;
        }
      });
    },
    // 去添加
    addAdvert() {
      this.form.adSort = parseInt(this.form.adSort);
      addAdvert(this.form)
        .then(() => {
          this.$message.success("保存成功");
          this.interactive.loading = false;
          let value = this.$route.fullPath;

          let { tag } = findTag(value);

          this.$store.commit("DEL_TAG", tag);
          this.$router.go(-1);
        })
        .catch((res) => {
          this.$message.warning(res);
          this.interactive.loading = false;
        });
    },
    // 去修改
    updateAdvert() {
      this.form.adSort = parseInt(this.form.adSort);
      updateAdvert(this.form)
        .then(() => {
          this.$message.success("修改成功");
          this.interactive.loading = false;
          let value = this.$route.fullPath;

          let { tag } = findTag(value);

          this.$store.commit("DEL_TAG", tag);
          this.$router.go(-1);
        })
        .catch((res) => {
          this.$message.warning(res);
          this.interactive.loading = false;
        });
    },
    // 获取广告类型
    getAdvertType() {
      getAdvertType().then((res) => {
        this.advertTypeArr = res.data.data;
      });
    },
    // 去取消
    to_cancel() {
      this.$router.go(-1);
    },
    // 时间
    pickerTimeStart() {
      const time = getHour() + ":" + getMinute() + ":" + getSecond();
      return time;
    },
  },
};
</script>
<style scss="lang" scoped>
.main-content {
  display: flex;
  justify-content: center;
}
.el-radio-adLink {
  display: flex;
  flex-direction: column;
}
.el-radio-adLink div {
  margin-bottom: 5px;
}
.sort-tip {
  color: #838383;
  font-size: 12px;
}
</style>
