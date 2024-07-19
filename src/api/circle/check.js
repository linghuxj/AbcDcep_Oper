import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/ups/apply/userType',
    method: 'get',
    params: query
  })
}

export function checkPass(obj) {
  return request({
    url: '/ups/apply/userType/audit',
    method: 'post',
    data: obj
  })
}

export function checkReject(obj) {
  return request({
    url: '/ups/apply/userType/audit',
    method: 'post',
    data: obj
  })
}
