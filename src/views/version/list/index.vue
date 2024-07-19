<template>
  <div class="main-content">
    <!-- 筛选 -->
    <el-form
      :inline="true"
      :model="search"
      id="demo-form-inline"
      class="demo-form-inline"
    >
      <!-- 是否强制升级： -->
      <el-form-item label="是否强制升级：">
        <el-radio-group v-model="search.forceUpgrade">
          <el-radio label="true">是</el-radio>
          <el-radio label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="to_search()">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" class="reset" @click="to_reset()">
          重置
        </el-button>
      </div>
    </el-form>
    <!-- 新增 -->
    <div id="tableBtn">
      <el-button type="primary" @click="addUpdateVersion()">
        新增更新版本
      </el-button>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="interview.loading"
      :empty-text="$t('message.table_empty_text')"
      :data="versionList"
      border
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      :height="tableHeight"
    >
      <el-table-column label="应用名称">
        <template slot-scope="scope">
          {{ scope.row.platformName ? scope.row.platformName : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="应用类型">
        <template slot-scope="scope">
          {{ scope.row.clientName ? scope.row.clientName : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="渠道" prop="channelName">
        <template slot-scope="scope">
          {{ scope.row.channelName ? scope.row.channelName : "--" }}
        </template>
      </el-table-column>
      <el-table-column label="版本号" prop="version" />
      <el-table-column label="版本内容" prop="updateTip" />
      <el-table-column label="升级地址" prop="downloadUrl" width="200" />
      <el-table-column label="是否强制升级版本" width="200">
        <template slot-scope="scope">
          {{ scope.row.forceUpgrade ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="to_delet(scope.row.versionId)"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <table-pagination
      v-if="pagination.total > 0"
      :total="pagination.total"
      :page.sync="pagination.current"
      :limit.sync="pagination.size"
      @pagination="getUserList"
    />
    <!-- 弹框 -->
    <el-dialog
      title="新增版本"
      :visible.sync="interview.dialogShow"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="formDialog"
        label-width="100px"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="应用名称：" prop="platform">
          <el-select v-model="formDialog.platform">
            <el-option
              v-for="(plat, platIndex) in platformList"
              :key="platIndex"
              :label="plat.dictName"
              :value="plat.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用类型：" prop="client">
          <el-select v-model="formDialog.client" @change="selectClient">
            <el-option
              v-for="(client, clientIndex) in clientList"
              :key="clientIndex"
              :label="client.dictName"
              :value="client.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道：" prop="channel">
          <el-select v-model="formDialog.channel">
            <el-option
              v-for="(channel, channelIndex) in channelList"
              :key="channelIndex"
              :label="channel.dictName"
              :value="channel.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号：" prop="version">
          <el-input
            placeholder="请输入版本号"
            v-model="formDialog.version"
          ></el-input>
        </el-form-item>
        <el-form-item label="版本内容：" prop="updateTip">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入版本内容"
            v-model="formDialog.updateTip"
            :maxlength="500"
          ></el-input>
        </el-form-item>
        <el-form-item label="升级地址：">
          <el-input
            placeholder="请输入升级地址"
            v-model="formDialog.downloadUrl"
            v-if="formDialog.client === 'ios'"
          ></el-input>
          <uploadFile
            ref="fileRef"
            @input="uploadSuccess"
            v-if="formDialog.client === 'android'"
          ></uploadFile>
        </el-form-item>
        <el-form-item label="强制升级：" prop="forceUpgrade">
          <el-radio-group v-model="formDialog.forceUpgrade">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="to_sure('ruleForm')"
          :btnLoading="interview.btnLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TablePagination from "@/components/table-pagination";
import { Loading } from "element-ui";
import {
  reqVersionPage,
  createVersion,
  reqChannelTypes,
  reqClientTypes,
  reqPlatformTypes,
  deleteVersion,
} from "@/api/version/list";
import uploadFile from "@/components/Upload-File/uploadFile";
export default {
  components: {
    TablePagination,
    uploadFile,
  },
  data() {
    return {
      // 表格高度
      tableHeight: "calc(100vh - 335px)",
      interview: {
        loading: false,
        dialogShow: false,
        btnLoading: false,
        isEdit: false,
      },
      //分页
      pagination: {
        //页码
        current: 1,
        //页容量
        size: 10,
        //总条数
        total: 0,
      },
      versionList: [],
      // 平台类型
      platformList: [],
      //客户端类型
      clientList: [],
      //渠道类型
      channelList: [],
      formDialog: {
        client: null,
        channel: null,
        platform: null,
        version: null,
        forceUpgrade: null,
        downloadUrl: null,
        updateTip: null,
      },
      search: {
        forceUpgrade: null,
      },
      // 是否上传成功
      isUploadSuccess: false,
      rules: {
        platform: [
          { required: true, message: "请选择应用名称", trigger: "change" },
        ],
        client: [
          { required: true, message: "请选择应用类型", trigger: "change" },
        ],
        channel: [
          { required: true, message: "请选择应用渠道", trigger: "blur" },
        ],
        version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        updateTip: [
          { required: true, message: "请输入版本内容", trigger: "blur" },
        ],
        forceUpgrade: [
          {
            required: true,
            message: "请选择是否强制升级",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this._reqVersionPageList();
  },
  mounted() {
    this.$nextTick(() => {
      this.countHeight();
      this.watchWidth();
    });
  },
  methods: {
    getUserList() {
      this._reqVersionPageList();
    },
    // 获取列表
    _reqVersionPageList() {
      let data = {
        current: this.pagination.current,
        size: this.pagination.size,
        forceUpgrade: this.search.forceUpgrade,
      };
      this.interview.loading = true;
      reqVersionPage(data)
        .then((res) => {
          console.debug("列表", res);
          this.interview.loading = false;
          this.versionList = res.data.data.records;
          this.pagination.total = res.data.data.total;
          this.pagination.current = res.data.data.current;
          this.pagination.size = res.data.data.size;
        })
        .catch(() => {
          this.interview.loading = false;
        });
    },
    // 去确定
    to_sure(ruleForm) {
      this.interview.btnLoading = true;
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this._reqCreateVersion();
        } else {
          this.interview.btnLoading = false;
        }
      });
    },
    // 上传成功
    uploadSuccess(url, uploadLoading) {
      if (uploadLoading) return;
      this.uploadLoading = !uploadLoading;
    },
    // 去创建
    _reqCreateVersion() {
      if (this.formDialog.client === "android" && !this.uploadLoading) {
        this.$message.warning("升级地址未上传完");
        return;
      }
      if (this.formDialog.client === "android") {
        if (this.$refs.fileRef.imgURL.length === 0) {
          this.$message.warning("请上传安卓升级地址");
          return;
        } else {
          const params = this.$refs.fileRef.imgURL;
          this.formDialog.downloadUrl = params[0];
        }
      } else {
        if (!this.formDialog.downloadUrl) {
          this.$message.warning("请输入ios升级地址");
          return;
        }
      }
      createVersion(this.formDialog)
        .then((res) => {
          console.debug("创建", res);
          this.$message.success("创建成功");
          this.interview.btnLoading = false;
          this.interview.dialogShow = false;
          // 清除form组件
          this.$refs.ruleForm.resetFields();
          this._reqVersionPageList();
        })
        .catch(() => {
          this.interview.btnLoading = false;
        });
    },
    //渠道类型接口
    _reqChannelTypesList(channel) {
      let data = {
        channel: channel,
      };
      reqChannelTypes(data).then((res) => {
        this.channelList = res.data.data;
      });
    },
    //查询平台类型
    _reqPlatformList() {
      reqPlatformTypes().then((res) => {
        this.platformList = res.data.data;
      });
    },
    //查询客户端类型
    _reqClientTypesList() {
      reqClientTypes().then((res) => {
        this.clientList = res.data.data;
      });
    },
    selectClient(e) {
      this.channelList = [];
      this.$set(this.formDialog, "channel", "");
      this._reqChannelTypesList(e);
    },
    // 新增更新版本
    addUpdateVersion() {
      this.formDialog = {
        client: null,
        channel: null,
        platform: null,
        version: null,
        forceUpgrade: null,
        downloadUrl: null,
        updateTip: null,
      };
      this._reqClientTypesList();
      this._reqPlatformList();
      // Loading.service("加载中");
      this.interview.dialogShow = true;
      // this.$refs.ruleForm.resetFields();
    },
    // 去搜索
    to_search() {
      this._reqVersionPageList();
    },
    // 去重置
    to_reset() {
      this.search.forceUpgrade = null;
      this._reqVersionPageList();
    },
    // 关闭
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.interview.dialogShow = false;
    },
    // 去删除
    to_delet(versionId) {
      this.$confirm("确认删除？")
        .then(() => {
          this._reqDeleteVersion(versionId);
        })
        .catch(() => {
          this.$message.warning("已取消");
        });
    },
    // 删除
    _reqDeleteVersion(data) {
      deleteVersion(data)
        .then((res) => {
          this.$message.success("删除成功");
          this._reqVersionPageList();
        })
        .catch(() => {});
    },
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
      this.tableHeight = `calc(100vh - ${
        (demoForm ? demoForm.offsetHeight + 15 : 0) +
        (tableBtn ? tableBtn.offsetHeight + 20 : 0) +
        190
      }px)`;
    },
  },
};
</script>
<style scoped>
::v-deep .el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
