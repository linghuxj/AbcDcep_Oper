<template>
  <!-- 审核弹框 -->
  <el-dialog v-if="dialogFormVisible" title="结果审核" :visible.sync="dialogFormVisible" width="60%">
    <el-form ref="dataForm" :model="form" label-position="left" :rules="dialogRule">
      <el-form-item label="审核结果：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="normal">通过</el-radio>
          <el-radio label="failed">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="原因：" prop="reason" v-if="form.status === 'failed'">
        <el-input v-model="form.reason" type="textarea" :rows="2" maxlength="50" show-word-limit placeholder="请填写审核原因"
          autocomplete="off" style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="附件：" v-if="form.status === 'failed'">
        <span>（银行反馈，最多3张图片）</span>
        <upload-file ref="uploadExplain" v-model="form.resUrls" type="content" :limit="3" :multiple="true"
          :auto-upload="false" type-name="task" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false"> 取消 </el-button>
      <el-button type="primary" @click="toExamineTask"> 确定 </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { auditTaskResult } from "@/api/task/list";
import UploadFile from "@/components/Upload-File/upload";
export default {
  components: {
    UploadFile,
  },
  props: {
    auditItem: {
      typeof: String,
      required: true,
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        taskId: null,
        reason: null,
        resUrls: [],
        resultId: null,
        status: null,
      },
      dialogRule: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" },
        ],
        reason: [
          { required: true, message: "请输入审核原因", trigger: "blur" },
        ],
      },
    };
  },
  created() { },
  methods: {
    show() {
      console.debug("this.auditItem", this.auditItem);
      this.form.taskId = this.auditItem.taskId;
      this.form.resultId = this.auditItem.resultId;
      this.dialogFormVisible = true;
    },
    // 审核
    toExamineTask() {
      if (this.form.status === "failed") {
        // 获取参考图片
        const uploadParams = this.$refs.uploadExplain.imgURL;

        uploadParams.forEach((item, indexs) => {
          this.form.resUrls[indexs] = item;
        });
        if (this.form.resUrls.length === 0) {
          this.$message.warning("请上传附件图片");
          return;
        }
      }

      auditTaskResult(this.form)
        .then(() => {
          this.$notify({
            title: "成功",
            message: "审核成功！",
            type: "success",
            duration: 2000,
          });
          this.dialogFormVisible = false;
          this.$parent.getList();
        })
        .catch(() => {
          this.dialogFormVisible = false;
        });
    },
  },
};
</script>
<style lang="less" scoped></style>
