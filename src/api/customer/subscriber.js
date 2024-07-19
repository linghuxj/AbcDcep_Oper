import request from '@/router/axios'

// <user_40:普通用户列表>分页查询普通用户信息列表
export function getSubscriberPage(params) {
  return request({
    url: 'ope/user/page',
    method: 'get',
    params
  })
}

// <用户状态类型> 查询用户状态类型
export function getSubscriberStatus() {
  return request({
    url: '/ope/user/status/types',
    method: 'get'
  })
}

// <用户管理>修改用户状态，需要权限'user_status_edit'
export function editSubscriberStatus(data) {
  return request({
    url: '/ope/user/update/status',
    method: 'post',
    data
  })
}

// <用户管理>根据用户ID查询用户基本信息
export function getSubscriberById(userId) {
  return request({
    url: `ope/user/${userId}`,
    method: 'get'
  })
}

// <用户管理>给用户打上标签，支持多个，需要权限'user_add_tag'
export function addSubscriberTag(data) {
  return request({
    url: `ope/user/add/tag`,
    method: 'post',
    data
  })
}
