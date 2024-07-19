import request from '@/router/axios'

// 常规图片授权凭证
export function getUploadImageParams() {
  return request({
    url: '/ope/upload/cos/credential',
    method: 'get'
  })
}

export function refreshAuthParam(videoId) {
  return request({
    url: '/ope/upload/refresh/video/' + videoId,
    method: 'get'
  })
}

// sop_ocr_30:查询>获取腾讯营业执照识别信息
export const getLicense = query => {
  return request({
    url: '/ope/ocr/biz/license',
    method: 'get',
    params:query
  })
}
