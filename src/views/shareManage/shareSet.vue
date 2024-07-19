<template>
  <div class="shareSet main-content">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
    >
      <div class="blueTitle">基础设置</div>
      <el-form-item label="分享至微信标题：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="分享至微信缩略图：" prop="images">
        <upload-wrap
          ref="uploadImage"
          v-model="ruleForm.images"
          type="content"
          :limit="1"
          :multiple="true"
          :auto-upload="false"
        />
      </el-form-item>
      <div class="blueTitle">APP分享配置</div>
      <el-form-item label="特殊资源：" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="海报"></el-radio>
          <el-radio label="H5链接"></el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="ruleForm.resource === '海报'">
        <el-form-item label="海报列表：" prop="images">
          <upload-wrap
            ref="uploadImage"
            v-model="ruleForm.images"
            type="content"
            :limit="3"
            :multiple="true"
            :auto-upload="false"
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="标题：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文案：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入文案"></el-input>
        </el-form-item>
        <el-form-item label="链接：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入链接"></el-input>
        </el-form-item>
        <el-form-item label="图标：" prop="images">
          <upload-wrap
            ref="uploadImage"
            v-model="ruleForm.images"
            type="content"
            :limit="1"
            :multiple="true"
            :auto-upload="false"
          />
        </el-form-item>
      </template>
      <el-form-item label=" APP内邀请分享说明：" prop="profile">
        <editor-bar v-model="ruleForm.profile" :is-clear="isClear"></editor-bar>
      </el-form-item>
    </el-form>
    <div class="footBtn">
      <el-button>取消</el-button>
      <el-button type="primary">保存</el-button>
    </div>
  </div>
</template>
<script>
import EditorBar from '@/components/Rich-Text-Editor/Editor-Bar'
import UploadWrap from '@/components/Upload-File/upload.vue'
export default {
  components: {
    UploadWrap,
    EditorBar
  },
  data() {
    return {
      // 校验规则
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 表单数据
      ruleForm: {
        resource: '海报'
      },
      isClear: false
    }
  }
}
</script>
<style lang="scss" scoped>
.shareSet {
  position: relative;
  padding-bottom: 70px;
  ::v-deep .el-input__inner {
    width: 50%;
    min-width: 200px;
  }
  .footBtn {
    position: fixed;
    left: 260px;
    bottom: 0;
    text-align: center;
    width: calc(100% - 280px);
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    border-top: 1px solid #ccc;
  }
}
</style>
