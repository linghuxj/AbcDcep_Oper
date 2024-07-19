import request from '@/router/axios'

// <reason_42:原因的类型列表>分页查询原因的类型列表
export function getReasonTypeAll(data) {
  return request({
    url: `/ope/reason/type/page`,
    method: 'get',
    params: data
  })
}

// <reason_40:原因列表>分页查询原因列表
export function getReasonPage(query) {
  return request({
    url: `/ope/reason/page`,
    method: 'get',
    params: query
  })
}

// <reason_41:不同类型原因列表>根据不同类型，获取该类型的原因列表
export function getReasonAll(type) {
  return request({
    url: `/ope/reason/all/${type}`,
    method: 'get'
  })
}

// <reason_10:新增>新增原因信息，需要权限'reason_add'
export function addReason(obj) {
  return request({
    url: `/ope/reason`,
    method: 'post',
    data: obj
  })
}

// <reason_13:停用原因>停用原因，需要权限'reason_edit'
export function disabledStatus(id) {
  return request({
    url: `/ope/reason/disabled/status/${id}`,
    method: 'post'
  })
}

// <reason_12:启用原因>启用原因，需要权限'reason_edit'
export function normalStatus(id) {
  return request({
    url: `/ope/reason/normal/status/${id}`,
    method: 'post'
  })
}

// <reason_11:修改>修改原因信息，需要权限'reason_edit'
export function updateReason(obj) {
  return request({
    url: `/ope/reason/update`,
    method: 'post',
    data: obj
  })
}

// <reason_14:排序>修改原因排序，需要权限'reason_edit'
export function updateSortReason(obj) {
  return request({
    url: `/ope/reason/update/sort`,
    method: 'post',
    data: obj
  })
}
