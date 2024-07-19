import request from '@/router/axios'

// <store_type_40:列表>获取所有门店类型列表
export function allStoreType() {
  return request({
    url: '/ope/store/type/all',
    method: 'get'
  })
}

// <store_type_41:列表>分页查询门店类型信息列表
export function getStoreTypePage(query) {
  return request({
    url: '/ope/store/type/page',
    method: 'get',
    params: query
  })
}

// <store_type_10:新增>新增门店类型信息，需要权限'store_type_add'
export function addStoreType(obj) {
  return request({
    url: '/ope/store/type',
    method: 'post',
    data: obj
  })
}

// <store_type_11:修改>修改门店类型信息，需要权限'store_type_edit'
export function editStoreType(obj) {
  return request({
    url: '/ope/store/type/update',
    method: 'post',
    data: obj
  })
}

// <store_type_13:删除>删除门店类型，需要权限'store_type_del'
export function deleteStoreType(id) {
  return request({
    url: `/ope/store/type/${id}`,
    method: 'delete'
  })
}
// <store_type_12:修改状态>修改门店类型的状态，需要权限'store_type_status'
export function updateStoreTypeStatus(obj) {
  return request({
    url: '/ope/store/type/status',
    method: 'post',
    data: obj
  })
}
// store_73:门店入驻类型列表>查询门店入驻类型列表
export function getSettlementType(query) {
  return request({
    url: '/ope/store/settlement/types',
    method: 'get',
    params: query
  })
}