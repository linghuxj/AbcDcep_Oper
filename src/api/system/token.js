

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/ups/token/page',
    method: 'get',
    params: query
  })
}

export function delObj(token) {
  return request({
    url: '/ups/token/' + token,
    method: 'delete'
  })
}
