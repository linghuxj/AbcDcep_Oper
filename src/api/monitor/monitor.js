import request from '@/router/axios'

export function fetchInfo() {
  return request({
    url: '/mon/redis/info',
    method: 'get'
  })
}

export function fetchExec(query) {
  return request({
    url: '/mon/redis/exec',
    method: 'get',
    params: query
  })
}
