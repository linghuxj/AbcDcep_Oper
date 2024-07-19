<template>
  <div>
    <el-upload
      action="#"
      :http-request="uploadImg"
      :limit="limit"
      list-type="picture-card"
      :file-list="fileList"
      :on-remove="handleFileRemove"
      :class="{ showUpload: !showUpload }"
      :disabled="disabled"
      :multiple="multiple"
    >
      <span id="text">点击上传图片</span>
    </el-upload>
  </div>
</template>

<script>
import { getUploadImageParams } from '@/api/upload'
import { v4 as uuidv4 } from 'uuid'
import { formatStartTime } from '@/util/date'
export default {
  name: 'Upload',
  props: {
    limit: {
      type: Number,
      default: 3
    },
    // 命名，iamge头像等、conten圈子/内容、task任务、
    typeName: {
      type: String,
      default: 'image'
    },
    // v-model值
    value: {
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple:{
      type:Boolean,
      default:false,
    },
  },
  data() {
    return {
      // 修改作品信息弹窗显示与否
      dialogVisible: false,
      // 图片文件
      imgFile: '',
      // 图片文件名称
      fileName: '',
      // 上传成功后的地址
      imgURL: [],
      fileList: [],
      // 是否显示上传区域
      showUpload: true,
      files: [] // 文件列表
    }
  },
  async created() {},
  mounted() {},
  methods: {
    toUpperCaseUUID(type) {
      let suffix = type.split('/').pop()
      return (
        this.typeName +
        '/' +
        formatStartTime(new Date()) +
        '/' +
        new Date().getTime() +
        '_' +
        uuidv4().replace(/-/g, '').toUpperCase() +
        '.' +
        suffix
      )
    },
    // 回显方法
    loadImg(value) {
      // 如果传值为数组 多图
      if (Array.isArray(value)) {
        this.imgURL = value
        this.fileList = this.files = value.map(item => {
          return { url: item }
        })
      } else {
        // 如果传值为单图url
        this.files.push({ url: value })
        this.fileList.push({ url: value })
        this.imgURL.push(value)
      }
      this.showUpload = !(this.fileList.length >= this.limit)
    },
    // 上传方法
    async uploadImg(fileOption) {
      let _this = this
      // 创建COS实例  获取签名
      //这里写你们后端提供的请求接口即可
      var COS = require('cos-js-sdk-v5')
      getUploadImageParams().then(res => {
        const data = res.data.data
        const cos = new COS({
          // 必选参数
          getAuthorization: (options, callback) => {
            const obj = {
              TmpSecretId: data.tmpSecretId,
              TmpSecretKey: data.tmpSecretKey,
              XCosSecurityToken: data.sessionToken,
              StartTime: data.startTime,
              ExpiredTime: data.expiredTime,
              expiration: data.expiration,
              requestId: data.requestId
            }
            callback(obj)
          }
        })
        // 上传图片  其中Bucket 和 Region找你们负责人拿
        //key 在前面加上路径写法可以生成文件夹
        cos.putObject(
          {
            Bucket: data.bucket /* 必须 */,
            Region: data.region /* 存储桶所在地域，必须字段 */,
            Key: _this.toUpperCaseUUID(fileOption.file.type) /* 必须 */,
            StorageClass: 'STANDARD',
            Body: fileOption.file, // 上传文件对象
            // 文件权限设置
            ACL: 'public-read'
            // onHashProgress: progressData => {
            //   // console.error('校验中', JSON.stringify(progressData))
            // },
            // onProgress: progressData => {
            //   console.error('上传中', JSON.stringify(progressData))
            // }
          },
          (err, data) => {
            if (data.statusCode == 200) {
              fileOption.status = 'success'
              let url = 'https://' + data.Location

              _this.imgURL.push(url)

              // 将数据插入到文件中
              _this.files.push({ url: url, uid: fileOption.file.uid })

              _this.showUpload = !(_this.imgURL.length >= _this.limit)
              // 父组件获取imgURL值便可

              // 调用input方法返回给父组件
              _this.$emit('input', _this.imgURL)
            }
          }
        )
      })
    },
    // 删除图片
    handleFileRemove(file, fileList) {
      this.fileList = fileList

      // 根据是否含有uid过滤符合条件的图片
      let arr = this.files.filter(item => {
        if (item.uid) {
          return item.uid === file.uid
        } else {
          return item.url === file.url
        }
      })

      this.imgURL = this.imgURL.filter(item => {
        return item !== arr[0].url
      })

      this.files = this.files.filter(item => {
        return item.url !== file.url
      })

      // 调用input方法返回给父组件
      this.$emit('input', this.imgURL)

      this.showUpload = !(this.imgURL.length >= this.limit)
    }
  }
}
</script>

<style lang="scss">
.showUpload {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
