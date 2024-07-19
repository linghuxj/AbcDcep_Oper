<template>
  <div>
    <div class="title">用户详情</div>
    <div class="profit-content">
      <div class="profit-content-top">
        <div class="profit-item">
          <div class="profit-item-title">今日余额(人民币)</div>
          <div class="profit-item-num">
            <span class="green-text"
              >{{ profitDate.todayProfit ? profitDate.todayProfit : 0 }}元</span
            >
          </div>
        </div>
        <div class="profit-item">
          <div class="profit-item-title">昨日收益(人民币)</div>
          <div class="profit-item-num">
            <span class="green-text"
              >{{
                profitDate.yesterdayProfit ? profitDate.yesterdayProfit : 0
              }}元</span
            >
          </div>
        </div>
        <div class="profit-item">
          <div class="profit-item-title">本月收益/总收益(人民币)</div>
          <div class="profit-item-num">
            <span class="green-text"
              >{{ profitDate.monthProfit ? profitDate.monthProfit : 0 }}元</span
            >
            <span class="blue-text"
              >{{ profitDate.totalProfit ? profitDate.totalProfit : 0 }}元</span
            >
          </div>
        </div>
      </div>
      <div class="profit-content-top">
        <div class="profit-item">
          <div class="profit-item-title">今日余额(米粒)</div>
          <div class="profit-item-num">
            <span class="blue-text"
              >{{
                profitDate.todayIntegral ? profitDate.todayIntegral : 0
              }}元</span
            >
          </div>
        </div>
        <div class="profit-item">
          <div class="profit-item-title">昨日收益(米粒)</div>
          <div class="profit-item-num">
            <span class="blue-text"
              >{{
                profitDate.yesterdayIntegral ? profitDate.yesterdayIntegral : 0
              }}元</span
            >
          </div>
        </div>
        <div class="profit-item">
          <div class="profit-item-title">本月收益/总收益(米粒)</div>
          <div class="profit-item-num">
            <span class="green-text">{{
              profitDate.monthIntegral ? profitDate.monthIntegral : 0
            }}</span>
            <span class="blue-text">{{
              profitDate.totalIntegral ? profitDate.totalIntegral : 0
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 信息 -->
    <div class="main-info">
      <el-form :model="form">
        <el-form-item label="用户昵称：">
          <el-input
            v-model="form.username"
            placeholder="请输入用户昵称"
            style="width: 30%"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户手机号：">
          <el-input
            v-model="form.mobile"
            placeholder="请输入用户手机号"
            style="width: 30%"
            maxlength="11"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="注册来源：">
          <el-select v-model="form.platform">
            <el-option
              v-for="(item, platformIndex) in platformList"
              :key="platformIndex"
              :label="item.dictName"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="加入公会：">
          <el-autocomplete
            v-model="form.unionName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="当前头像：">
          <uploadImg
            ref="upload_logo"
            v-model="form.avatar"
            class="avatar-uploader"
            :show-file-list="false"
            :limit="1"
            type-name="conten"
          >
          </uploadImg>
        </el-form-item>
        <div class="form-btn">
          <el-button type="primary" @click="to_save()">保存</el-button>
          <el-button @click="to_cancel()">恢复修改前</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reqUserById, updateUser, reqWalletProfit } from "@/api/user/detail";
import { reqUnionPage } from "@/api/guild/list";
// import { reqPlatformTypes } from "@/api/user/user";
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
      form: {
        username: null,
        mobile: null,
        userId: null,
        // platform: null,
        avatar: null,
        unionId: null,
        unionName: null,
      },
      userDetail: {},
      profitDate: {},
      // platformList: [],
    };
  },
  created() {
    this.form.userId = this.$route.params.userId;
    this._getUserById();
    this._getWalletProfit();
    // this._getPlatformTypes();
  },
  methods: {
    // 获取用户信息
    _getUserById() {
      reqUserById(this.form.userId).then((res) => {
        let userDetail = res.data.data;
        console.debug("11", userDetail);
        this.form.username = userDetail.username;
        this.form.mobile = userDetail.mobile;
        this.form.platform = userDetail.platform;
        this.form.avatar = userDetail.avatar;
        if (userDetail.union) {
          this.form.unionId = userDetail.union.unionId;
          this.form.unionName = userDetail.union.unionName;
        }
        this.$refs.upload_logo.loadImg(userDetail.avatar);
      });
    },
    // 获取数据
    _getWalletProfit() {
      let data = {
        userId: this.form.userId,
      };
      reqWalletProfit(data).then((res) => {
        console.debug("res", res);
        this.profitDate = res.data.data;
      });
    },
    // 平台类型
    // _getPlatformTypes() {
    //   console.debug("111");
    //   reqPlatformTypes().then((res) => {
    //     this.platformList = res.data.data;
    //   });
    // },
    // 保存
    to_save() {
      this.getupdateUser();
    },
    // 修改
    getupdateUser() {
      let avatar = this.$refs.upload_logo.imgURL[0];
      console.debug("avatar", avatar);
      let data = {
        userId: this.form.userId,
        avatar: avatar,
        mobile: this.form.mobile,
        unionId: this.form.unionId,
        username: this.form.username,
      };
      updateUser(data)
        .then((res) => {
          this.$message.success("保存成功");
        })
        .catch(() => {});
    },
    // 取消
    to_cancel() {
      // this.$router.go(-1);
      this.$refs.upload_logo.fileList = [];
      this._getUserById();
    },
    querySearchAsync(unionName, cb) {
      console.debug("mobile", unionName);
      if (!unionName) {
        cb(this.searchRecords);
        return;
      }
      let data = {
        unionName: unionName,
      };
      // 搜索公会
      reqUnionPage(data).then((res) => {
        const users = res.data.data.records;
        console.debug("users", res.data.data.records);
        cb(
          users.map((user) => {
            return {
              value: user.unionName,
              unionId: user.unionId,
            };
          })
        );
      });
    },
    handleSelect(user) {
      console.debug("user", user);
      this.form.unionId = user.unionId;
      this.form.unionName = user.value;
    },
  },
};
</script>
<style scoped>
.title {
  font-weight: bold;
  font-size: 20px;
}
.profit-content {
  display: flex;
  flex-direction: column;
  max-width: 1000px;
}
.profit-content-top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.profit-item {
  width: 240px;
  height: 80px;
  margin: 10px;
  background-color: #fff;
  box-shadow: 12px 12px 20px 12px rgba(232, 232, 232, 0.5);
  border-radius: 8px;
}
.profit-item-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.profit-item-num {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.blue-text {
  font-size: 16px;
  font-weight: bold;
  color: #3399ff;
  margin: 0px 5px;
}
.green-text {
  font-size: 16px;
  font-weight: bold;
  color: #1abc9c;
  margin: 0px 5px;
}
.form-btn {
  width: 100%;
  text-align: center;
}
</style>
