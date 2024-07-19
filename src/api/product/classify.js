import request from '@/router/axios'

// <cate_40：分级查询类目-页面列表>根据条件查询类目列表，以树形结构返回
export function reqCateTree(query) {
  return request({
    url: '/ope/cate/tree',
    method: 'get',
    params: query
  })
}

// <cate_41：分级查询类目-下拉选择>根据条件查询类目列表，以树形结构返回
export function selectCateTree(query) {
  return request({
    url: '/ope/cate/tree/select',
    method: 'get',
    params: query
  })
}

// <cate_10：新增>新增类目，需要权限'cate_add'
export function addCate(data) {
  return request({
    url: '/ope/cate',
    method: 'post',
    data: data
  })
}

// <cate_11：编辑>修改类目，需要权限'cate_edit'
export function upCate(data) {
  return request({
    url: '/ope/cate/update',
    method: 'post',
    data: data
  })
}

// <cate_12：修改状态>修改类目状态，需要权限'cate_status_edit'
export function upCateStatus(data) {
  return request({
    url: '/ope/cate/update/status',
    method: 'post',
    data: data
  })
}

