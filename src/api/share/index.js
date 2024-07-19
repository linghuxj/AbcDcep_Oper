import request from '@/router/axios'

// <sop_share_40>查询分享设置
export function reqShareConf() {
  return request({
    url: '/sys/app/share/get/conf',
    method: 'get'
  })
}

// <sop_share_10>修改分享设置，需要权限'app_share_conf'
export function upShareConf(data) {
  return request({
    url: '/sys/app/share/update/conf',
    method: 'post',
    data: data
  })
}
