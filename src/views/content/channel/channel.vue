<template>
  <div class="main-content">
    <el-form ref="specialForm" :model="FormData" class="preView_mian">
      <el-form-item label="是否支持分享：" prop="areaCodeList">
        <el-radio-group v-model="radio">
          <el-radio :label="3">分享</el-radio>
          <el-radio :label="6">不分享</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分享标题：" prop="areaCodeList">
        <el-input v-model="FormData.title" style="width: 300px" />
      </el-form-item>
      <el-form-item label="分享图片：" prop="areaCodeList">
        <upload-file ref="upload" v-model="FormData.topicImage" type="content" :limit="1" :multiple="true"
          :auto-upload="false" type-name="conten" />
      </el-form-item>
      <el-form-item label="分享描述：" prop="areaCodeList">
        <el-input v-model="FormData.title" style="width: 300px" />
      </el-form-item>
      <el-form-item label="背景设置：" prop="areaCodeList">
        <el-radio-group v-model="bgRadio">
          <el-radio label="color">纯色背景</el-radio>
          <el-radio label="img">图片背景</el-radio>
        </el-radio-group>
        <div style="margin: 10px;" v-if="bgRadio == 'color'">
          <sketch-picker v-model="colors" />
        </div>
        <div style="margin: 10px;" v-if="bgRadio == 'img'">
            <upload-file ref="upload" v-model="FormData.topicImage" type="content" :limit="1" :multiple="true"
              :auto-upload="false" type-name="conten" />
        </div>
      </el-form-item>
    </el-form>
    <div class="preView_body">
        <div class="">

        </div>
    </div>
  </div>
</template>

<script>
  import UploadFile from "@/components/Upload-File/upload";
  import {
    Sketch
  } from 'vue-color'

  export default {
    name: 'preView',
    data() {
      return {
        radio: '3',
        bgRadio:'color',
        colors:'#194D33A8',
        FormData: {
          title: '',
          topicImage: ''
        }
      }
    },
    components: {
      UploadFile,
      'sketch-picker': Sketch,
    },
    mounted() {
      console.log(this.$router)
    },
    methods:{

    }
  }
</script>
<style scoped lang="scss">
  .preView_body{
    float: left;
    margin-left: 120px;
    width: 375px;
    height: 1120px;
  }
</style>e
<style scoped lang="scss">
  .preView_mian{
    width:300px;
    float: left;
  }
</style>
