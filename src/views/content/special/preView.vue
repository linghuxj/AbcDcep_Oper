<template>
  <div class="main-content">
    <el-form ref="specialForm" :model="FormData" class="preView_mian">
      <el-form-item label="是否支持分享：">
        <el-radio-group v-model="radio">
          <el-radio :label="3">分享</el-radio>
          <el-radio :label="6">不分享</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分享标题：">
        <el-input v-model="FormData.title" style="width: 200px" />
      </el-form-item>
      <el-form-item label="分享图片：">
        <upload-file ref="upload" v-model="FormData.topicImage" type="content" :limit="1" :multiple="true"
          :auto-upload="false" type-name="conten" />
      </el-form-item>
      <el-form-item label="分享描述：">
        <el-input v-model="FormData.title" style="width:200px" />
      </el-form-item>
      <el-form-item label="背景设置：">
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
      <div class="pre_header">
        <div class="pre_header_state">
          <img src="./assets/img/headerState.png" alt="">
        </div>
        <div class="pre_header_title">
          <div class="pre_header_title_return">
            <img src="./assets/img/return.png" alt="">
          </div>
          <div class="pre_header_title_text">
            <p>活动主题</p>
          </div>
          <div class="pre_header_title_more">
            <p>规则</p>
          </div>
        </div>
      </div>
      <div class="pre_banner">
          <div class="per_banner_default">
            <img class="pre_banner_default_img" src="./assets/img/bannerDefault.png" alt="">
            <span class="pre_banner_default_text">请配置相关内容</span>
          </div>
      </div>
      <div class="pre_share">
          <div class="pre_share_box">
            <div class="bg">
              <img class="pre_share_box_img" src="./assets/img/bannerDefault.png" alt="">
              <span class="pre_share_box_text">请配置相关内容</span>
            </div>
            <div class="btn">
              <div class="pre_share_btn_list leftBtn" >
                <div class="default">
                  <img class="pre_share_btn_default_img" src="./assets/img/addFun.png" alt="">
                  <span class="pre_share_btn_default_text">添加图片</span>
                </div>
              </div>
              <div class="pre_share_btn_list rightBtn" >
                <div class="default">
                  <img class="pre_share_btn_default_img" src="./assets/img/addFun.png" alt="">
                  <span class="pre_share_btn_default_text">添加图片</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pre_shareBtn">
              <div class="default">
                <img class="pre_share_btn_default_img" src="./assets/img/addFun.png" alt="">
                <span class="pre_share_btn_default_text">添加图片</span>
              </div>
          </div>
      </div>
      <div class="pre_tabs">
        <div class="pre_tabs_title">
          <div class="default">
            <div class="text">添加导航栏</div>
          </div>
        </div>
      </div>
    </div>
    <div class="attribute_boyd">
      <div>属性配置</div>
      <el-form ref="specialForm" :model="FormData" class="preView_mian">
        <el-form-item label="得奖背景照片：">
          <upload-file ref="upload" v-model="FormData.topicImage" type="content" :limit="1" :multiple="true"
            :auto-upload="false" type-name="conten" />
        </el-form-item>
        <el-form-item label="邀请人数照片：">
          <upload-file ref="upload" v-model="FormData.topicImage" type="content" :limit="1" :multiple="true"
            :auto-upload="false" type-name="conten" />
        </el-form-item>
        <el-form-item label="我的奖品照片：">
          <upload-file ref="upload" v-model="FormData.topicImage" type="content" :limit="1" :multiple="true"
            :auto-upload="false" type-name="conten" />
        </el-form-item>


      </el-form>
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
        bgRadio: 'color',
        colors: '#194D33A8',
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
      console.log(this.$route)
    },
    methods: {

    }
  }
</script>
<style scoped lang="scss">
  .preView_body {
    float: left;

    width: 375px;
    height: 667px;
    background-color: #ccc;
    .pre_header_state{
      height: 20px;
      width: 100%;
    }
    .pre_header_title{
      background-color: #fff;
      // height: 44px;
      padding: 11px 15px;
      text-align: center;
      display:flex;
      justify-content:space-between;
      .pre_header_title_return{
        margin-top: 3px;
        width: 10px;
        height: 13px;
        // float: left;
        // img{
        //   display: block;
        //   height: 100%;
        //   width: 100%;
        // }
      }
      .pre_header_title_text{
        // width: 64px;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1F1F1F;
        line-height: 22px;
        p{
          margin: 0;
          padding: 0;
        }
      }
      .pre_header_title_more{
        // width: 30px;
        // float: right;
        height: 21px;
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #BBBBBB;
        line-height: 21px;
        p{
          margin: 0;
          padding: 0;
        }
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
      }
    }
    .pre_banner{
      width: 100%;
      height: 240px;
      background: #F6F6F6;
      .per_banner_default{
        padding-top:44px ;
        .pre_banner_default_img{
          width: 130px;
          height: 107px;
          display: block;
          margin: 0 auto 0;
        }
        .pre_banner_default_text{
          padding: 0;
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #C9CEDB;
          line-height: 20px;
          margin-top: 10px;
          width: 100%;
          text-align: center;
          display: block;
        }
      }
    }
    .pre_share{
      height: 190px;
      background-color: #fff;
      padding-top: 16px;
      position: relative;
      .pre_share_box{
        width: 300px;
        height: 140px;
        margin: 0 auto;
        background: #F6F6F6;
        padding-top: 20px;
        position: relative;
        .bg{
          .pre_share_box_img{
            width: 95px;
            height: 79px;
            display: block;
            margin: 0 auto 0;
          }
          .pre_share_box_text{
            padding: 0;
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #C9CEDB;
            line-height: 20px;
            margin-top: 10px;
            width: 100%;
            text-align: center;
            display: block;
          }
        }
        .btn{

          .pre_share_btn_list{
            position: absolute;
            width: 84px;
            height: 78px;
            background: #FFFFFF;
            text-align: center;
            .default{

              .pre_share_btn_default_img{
                height: 18px;
                width: 18px;
                margin: 0 auto;
                margin-top: 17px;
              }
              .pre_share_btn_default_text{
                display: block;
                margin-top: 8px;
                height: 17px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #C9CEDB;
                line-height: 17px;
              }
            }
          }
          .leftBtn{
            left: 50px;
            top: 46px;
          }
          .rightBtn{
            right: 50px;
            top: 46px;
          }
        }

      }
      .pre_shareBtn{
        position: absolute;
        right: 0;
        bottom: 12px;
        width: 80px;
        height: 64px;
        background: #F6F6F6;
        border-radius: 1px;
        text-align: center;
        .pre_share_btn_default_img{
          height: 18px;
          width: 18px;
          margin: 0 auto;
          margin-top: 17px;
        }
        .pre_share_btn_default_text{
          display: block;
          margin-top: 8px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #C9CEDB;
          line-height: 17px;
        }
      }
    }
    .pre_tabs{
      .pre_tabs_title{
        text-align: center;
        height: 50px;
        background: #F6F6F6;
          .text{
            height: 50px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #C9CEDB;
            line-height: 50px;
          }
      }
    }
  }
</style>e
<style scoped lang="scss">
  .preView_mian {
    width: 300px;
    float: left;
    margin-right: 20px;
  }
  .attribute_boyd{
    float: left;
    margin-left: 20px;
  }
</style>
