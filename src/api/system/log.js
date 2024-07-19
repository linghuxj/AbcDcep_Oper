

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/sys/log/page',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/sys/log/' + id,
    method: 'delete'
  })
}

export function addObj(obj) {
  return request({
    url: '/sys/log/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/sys/log/' + id,
    method: 'get'
  })
}

export function putObj(obj) {
  return request({
    url: '/sys/log/',
    method: 'put',
    data: obj
  })
}

export function sendLogs(logsList) {
  return request({
    url: '/sys/log/logs',
    method: 'post',
    data: logsList
  })
}
