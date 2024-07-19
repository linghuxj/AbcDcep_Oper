/**
 * 平台用户接口
 */

import request from '@/router/axios'

// <sop_admin_10:新增>新增用户，需要权限'admin_user_add'
export function addAdmin(data) {
  return request({
    url: '/ope/admin/user',
    method: 'post',
    data: data
  })
}

// <sop_admin_50:列表>分页查询平台管理用户列表
export function getAdminPage(query) {
  return request({
    url: '/ope/admin/user/page',
    method: 'get',
    params: query
  })
}

// <sop_admin_21:修改>修改个人的登录密码（当前登录用户）
export function upAdminPassword(data) {
  return request({
    url: '/ope/admin/user/password',
    method: 'POST',
    data: data
  })
}

// <sop_admin_22:重置>重置密码，需要权限'admin_user_reset_password'
export function resetAdminPassword(userId) {
  return request({
    url: `/ope/admin/user/reset/password/${userId}`,
    method: 'POST'
  })
}

// <sop_admin_51:列表>查询平台用户状态类型
export function getAdminStatus() {
  return request({
    url: `/ope/admin/user/status/types`,
    method: 'get'
  })
}

// <sop_admin_23:修改>修改用户状态，需要权限'admin_user_status_edit'
export function upAdminStatus(data) {
  return request({
    url: `/ope/admin/user/status`,
    method: 'POST',
    data: data
  })
}

// <sop_admin_20:修改>修改用户，需要权限'admin_user_edit'
export function upAdmin(data) {
  return request({
    url: `/ope/admin/user/update`,
    method: 'POST',
    data: data
  })
}

// <sop_admin_40:查询>根据用户ID查询管理员基本信息
export function getAdminById(userId) {
  return request({
    url: `/ope/admin/user/${userId}`,
    method: 'get'
  })
}

// <sop_dist_52:用户性别列表>查询用户性别类型
export function reqUserSex() {
  return request({
    url: `/ope/admin/user/sex/types`,
    method: 'get'
  })
}
