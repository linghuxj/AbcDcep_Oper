import request from '@/router/axios'

// <用户管理>分页查询普通用户信息列表 即 用户端用户的列表
export function getTagPage(query) {
  return request({
    url: 'ope/user/tag/page',
    method: 'get',
    params: query
  })
}

// <user_tag_type_40:列表>分页查询用户标签类型信息列表
export function getTagTypeList(params) {
  return request({
    url: '/ope/user/tag/type/page',
    method: 'get',
    params
  })
}

// <sop_tag_type_10:新增>新增用户标签类型信息，需要权限'user_tag_type_add'
export function addTagType(data) {
  return request({
    url: '/ope/user/tag/type',
    method: 'post',
    data
  })
}

// <sop_tag_type_20:修改>修改用户标签类型信息，需要权限'user_tag_type_edit'
export function editTagType(data) {
  return request({
    url: '/ope/user/tag/type/update',
    method: 'post',
    data
  })
}

// <sop_tag_type_21:修改状态>修改用户标签类型的状态，需要权限'user_tag_type_status'
export function changeTypeStatus(data) {
  return request({
    url: '/ope/user/tag/type/status',
    method: 'post',
    data
  })
}

// <sop_tag_type_51:根据ID查询>根据ID查询标签类型信息
export function getTagTypeContent(typeId) {
  return request({
    url: `/ope/user/tag/type/${typeId}`,
    method: 'get'
  })
}

// <sop_tag_type_30:列表>获取所有标签类型列表
export function getTagTypeAll() {
  return request({
    url: `/ope/user/tag/type/all`,
    method: 'get'
  })
}

// <sop_tag_50:分页查询>分页查询用户标签信息列表
export function getTagList(params) {
  return request({
    url: '/ope/user/tag/page',
    method: 'get',
    params
  })
}

// <sop_tag_10:新增>新增用户标签类型信息，需要权限'user_tag_add'
export function addTag(data) {
  return request({
    url: '/ope/user/tag',
    method: 'post',
    data
  })
}

// <sop_tag_20:修改>修改用户标签类型信息，需要权限'user_tag_edit'
export function editTag(data) {
  return request({
    url: '/ope/user/tag/update',
    method: 'post',
    data
  })
}

// <sop_tag_21:修改状态>修改用户标签的状态，需要权限'user_tag_status'
export function changeTagStatus(data) {
  return request({
    url: '/ope/user/tag/status',
    method: 'post',
    data
  })
}

// <sop_tag_type_51:根据ID查询>根据ID查询标签类型信息
export function getTagContent(tagId) {
  return request({
    url: `/ope/user/tag/${tagId}`,
    method: 'get'
  })
}
