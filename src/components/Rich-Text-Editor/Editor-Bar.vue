<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import E from 'wangeditor'
import { getUploadImageParams } from '@/api/upload'

export default {
  name: 'RichTextEditor',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    //业务中我们经常会有添加操作和编辑操作，添加操作时，我们需清除上一操作留下的缓存
    isClear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null,
      uploadParams: [],
      uploadCount: 0
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  async created() {
    await this.loadSdkScript()
  },
  mounted() {
    this.seteditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    async seteditor() {
      const _this = this
      // http://192.168.2.125:8080/admin/storage/create
      _this.editor = new E(_this.$refs.toolbar, _this.$refs.editor)
      _this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      _this.editor.config.uploadImgMaxLength = 1 // 限制一次最多上传 3 张图片
      _this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

      // 配置菜单
      _this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        // 'video', // 插入视频
        // 'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
        'fullscreen' // 全屏
      ]

      // resultFiles 是 input 中选中的文件列表 insertImgFn 是获取图片 url 后，插入到编辑器的方法
      _this.editor.config.customUploadImg = async function(resultFiles, insertImgFn) {
        // 获取凭证
        await getUploadImageParams(resultFiles.length).then((response) => {
          _this.uploadParams = response.data.data
          // this.setFilesAndUpload(files, insertImgFn)
          resultFiles.forEach((file, index) => {
            const param = _this.uploadParams[index]
            _this.initSdkAndUpload(file, param, insertImgFn)
          })
        }) 
      }

      _this.editor.config.onchange = (html) => {
        _this.info_ = html // 绑定当前逐渐地值
        _this.$emit('change', _this.info_) // 将内容同步到父组件中
      }
      // 创建富文本编辑器
      _this.editor.create()
    },
    // 加载sdk
    loadSdkScript() {
      const es6script = document.createElement('script')
      es6script.src = './cdn/aliyun-upload-sdk/lib/es6-promise.min.js'
      const lib = document.createElement('script')
      lib.src = './cdn/aliyun-upload-sdk/lib/aliyun-oss-sdk-5.3.1.min.js'
      const sdk = document.createElement('script')
      sdk.src = './cdn/aliyun-upload-sdk/aliyun-upload-sdk-1.5.0.min.js'
      document.head.appendChild(es6script)
      document.head.appendChild(lib)
      document.head.appendChild(sdk)
    },
    initSdkAndUpload(file, param, insertImgFn) {
      const that = this
      const uploader = new AliyunUpload.Vod({
        userId: '1333679160013925',
        region: '',
        //分片大小默认1M，不能小于100K
        partSize: 1048576,
        //并行上传分片个数，默认5
        parallel: 5,
        //网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        //网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: function(uploadInfo) {
          uploader.setUploadAuthAndAddress(
            uploadInfo,
            param.uploadAuth,
            param.uploadAddress,
            param.imageId || param.videoId
          )
        },
        // 文件上传成功
        onUploadSucceed: function(uploadInfo) {
          insertImgFn(param.imageURL)
          // that.uploadCount = that.uploadCount + 1;
        },
        // 文件上传失败
        onUploadFailed: function(uploadInfo, code, message) {
          // 上传失败
          console.log(uploadInfo, 'faile file info')
          console.log(code, 'code')
          console.log(message, 'message')
        },
        // 上传凭证超时
        onUploadTokenExpired: function(uploadInfo) {
          // 刷新凭证
          // refreshAuthParam(uploadInfo.videoId).then((response) => {
          //   console.log(response)
          //   const param = response.data.data
          //   uploader.resumeUploadWithAuth(param.uploadAuth)
          // })
        },
        // 全部文件上传结束
        onUploadEnd: function(uploadInfo) {
          that.uploadCount = that.uploadCount + 1
        }
      })
      uploader.addFile(file, null, null, null, null)
      uploader.startUpload()
    }
  }
}
</script>

<style lang="css">
  .editor {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
  }
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    min-height: 500px;
  }
</style>
