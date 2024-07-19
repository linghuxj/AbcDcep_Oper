import request from '@/router/axios'

// <sop_task_31>查询系统设置
export function reqSysCont() {
  return request({
    url: '/sys/conf/get',
    method: 'get'
  })
}

// <sop_task_10>修改系统设置，需要权限'system_conf'
export function upSysCont(data) {
  return request({
    url: '/sys/conf/update/conf',
    method: 'post',
    data: data
  })
}
