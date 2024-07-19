import request from '@/router/axios'

// <spec_41：分页查询规格列表>分页查询规格信息列表
export function reqSpecsPage(query) {
  return request({
    url: '/ope/spec/page',
    method: 'get',
    params: query
  })
}

// <spec_10: 新增规格>新增规格信息，需要权限'spec_add'
export function addSpecs(data) {
  return request({
    url: '/ope/spec',
    method: 'POST',
    data: data
  })
}

// <spec_11：修改>修改规格信息，需要权限'spec_edit'
export function upSpecs(data) {
  return request({
    url: '/ope/spec/update',
    method: 'POST',
    data: data
  })
}

// <spec_12：修改状态>修改规格状态信息，需要权限'spec_status_edit'
export function upSpecStatus(data) {
  return request({
    url: '/ope/spec/update/status',
    method: 'POST',
    data: data
  })
}

// <spec_42：不同类目规格查询>根据类目ID(为空-查询所有规格列表)查询其类目下的规格列表信息
export function reqSpecCateById(query) {
  return request({
    url: `/ope/spec/cate/`,
    method: 'get',
    params: query
  })
}
