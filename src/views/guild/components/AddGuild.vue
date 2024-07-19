<template>
  <div class="main-content">
    <el-form :model="form" label-width="100px" :rules="rules" ref="fomr">
      <el-form-item label="公会名称：" prop="unionName">
        <el-input
          placeholder="请输入公会名称"
          style="width: 50%"
          v-model="form.unionName"
        ></el-input>
      </el-form-item>
      <el-form-item label="公会会长：" prop="tel">
        <el-autocomplete
          v-model="form.tel"
          popper-class="select-option"
          style="width: 50%"
          :fetch-suggestions="querySearchMobile"
          placeholder="请输入手机号码"
          @select="handleSelectUser"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="关联技能：" prop="tagIds">
        <el-checkbox-group v-model="form.tagIds">
          <el-checkbox
            v-for="(item, index) in userUnionList"
            :label="item.tagId"
            :value="item.tagName"
            :key="index"
          >
            {{ item.tagName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="公会头像：" prop="unionLogo">
        <uploadImg
          ref="upload_logo"
          v-model="form.unionLogo"
          class="avatar-uploader"
          :show-file-list="false"
          :limit="1"
          type-name="conten"
        >
        </uploadImg>
      </el-form-item>
      <el-form-item label="服务范围：" prop="location">
        <div>
          <el-cascader
            ref="cascader"
            v-model="form.location"
            placeholder="请选择省/市/县区"
            clearable
            style="width: 50%"
            :props="locationNameList"
          ></el-cascader>
        </div>
      </el-form-item>
      <el-form-item label="范围审核：">
        <el-radio-group v-model="form.needAudit">
          <el-radio label="enable">开启</el-radio>
          <el-radio label="disabled">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="sureLoading"
          :loading="sureLoading"
          @click="submit('form')"
          >保存</el-button
        >
        <el-button
          @click="resetForm('form')"
          :loading="cancelLoading"
          :disabled="cancelLoading"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  updateUnion,
  reqUserUnionPage,
  reqUnionDetail,
  reqStatusPage,
} from "@/api/guild/list";
import { getUsersbyMobile } from "@/api/user/user";
import uploadImg from "@/components/Upload-File/upload.vue";
// 引入地区查询接口
import { areas } from "@/api/area";
export default {
  components: {
    uploadImg,
  },
  data() {
    return {
      // 省市区联动
      locationNameList: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          const parentId = !node.value ? "-1" : node.value;
          setTimeout(() => {
            areas({ parentId: parentId, lazy: true }).then((res) => {
              const areaList = res.data.data;
              const nodes = Array.from(areaList).map((item) => ({
                value: item.areaId,
                label: item.name,
                leaf: level >= 2,
              }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            });
          }, 100);
        },
      },
      skillArr: ["技能"],
      form: {
        leader: null,
        location: null,
        unionId: null,
        unionLogo: null,
        unionName: null,
        tel: null,
        tagIds: [],
        needAudit: null,
      },
      rules: {
        unionName: [
          { required: true, message: "请输入公会名称", trigger: "blur" },
        ],
        tel: [{ required: true, message: "请选择会长", trigger: "change" }],
        // type: [
        //     { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        //   ],
        unionLogo: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请上传公会头像"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        location: [
          { required: true, message: "请选择服务范围", trigger: "change" },
        ],
        tagIds: [
          {
            type: "array",
            required: true,
            message: "请选择技能",
            trigger: "change",
          },
        ],
      },
      sureLoading: false,
      cancelLoading: false,
      userUnionList: [],
    };
  },
  created() {
    this.form.unionId = this.$route.params.id ? this.$route.params.id : "";
    console.debug("this.form.unionId", this.form.unionId);
    if (this.form.unionId) {
      this._getUnionDetail();
    }
    this.reqUserUnionPage();
  },
  methods: {
    //获取详情
    _getUnionDetail() {
      reqUnionDetail(this.form.unionId).then((union) => {
        let res = union.data.data;
        let temp = {};
        // 处理区域回显
        if (res.location.indexOf(",") === -1 || !res.location) {
          let arr = [];
          arr.push(res.location);
          temp.location = arr.map(Number);
        } else {
          temp.location = res.location.split(",").map(Number);
        }

        // 处理技能
        let tagNameList = res.tagNameList;
        let tagIds = [];
        tagNameList.map((item) => {
          tagIds.push(item.tagId);
        });

        temp.tagIds = tagIds;
        temp.unionName = res.unionName;
        temp.tel = res.leaderUser.mobile;
        temp.leader = res.leaderUser.userId;
        temp.unionId = res.unionId;
        temp.needAudit = res.needAudit;
        this.$refs.upload_logo.loadImg(res.unionLogo);
        this.form = Object.assign({}, temp);
      });
    },
    // 获取状态
    _getStatusPage() {
      reqStatusPage().then((res) => {
        console.debug("res", res);
        this.statusList = res.data.data;
      });
    },
    // 取消
    resetForm() {
      this.cancelLoading = true;
      this.$router.go(-1);
      setTimeout(() => {
        this.cancelLoading = false;
      }, 500);
    },
    // 保存
    submit() {
      const params = this.$refs.upload_logo.imgURL;
      this.form.unionLogo = params[0];
      console.debug(typeof this.form.location, this.form);
      if (typeof this.form.location === "object") {
        this.form.location = this.form.location.join(",");
      }
      this.sureLoading = true;
      console.debug("this.form", this.form);
      updateUnion(this.form)
        .then((res) => {
          this.$message.success("成功");
          this.sureLoading = false;
          this.$router.go(-1);
        })
        .catch((res) => {
          console.debug("失败");
          this.sureLoading = false;
        });
    },
    // 获取技能
    reqUserUnionPage() {
      reqUserUnionPage("union").then((res) => {
        this.userUnionList = res.data.data.records;
      });
    },
    querySearchMobile(mobile, cb) {
      console.debug("mobile".mobile);
      if (!mobile) {
        cb(this.searchRecords);
        return;
      }
      // // 搜索手机号码
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
      console.debug("user", user);
      this.form.leader = user.userId;
    },
  },
};
</script>
