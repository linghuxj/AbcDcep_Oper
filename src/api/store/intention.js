import request from '@/router/axios'
// <potential_40:分页查询>分页查询意向客户列表
export function potentialClientList(params) {
  return request({
    url: `/ope/potential/store/page`,
    method: 'get',
    params
  })
}

// <potential_41:根据ID查询>根据ID查询意向客户信息
export function getClientById(potentialId) {
  return request({
    url: `/ope/potential/store/${potentialId}`,
    method: 'get'
  })
}

// <potential_70:商户类型>查询商户类型列表
export function storeTypeList() {
  return request({
    url: `/ope/potential/store/business/types`,
    method: 'get'
  })
}

// <potential_71:跟进状态>查询跟进状态列表
export function potentialStatusList() {
  return request({
    url: `/ope/potential/store/status/types`,
    method: 'get'
  })
}

// <uop_potential_44:导出>导出询意向客户列表
export function potentialExport(params) {
  return request({
    url: `/ope/potential/client/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
