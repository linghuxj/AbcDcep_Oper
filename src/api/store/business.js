import request from '@/router/axios'

// <商户列表>分页查询商户信息列表
export function getBusinessSellerPages(query) {
  return request({
    url: '/us/business/seller/page',
    method: 'get',
    params: query
  })
}

// <商户管理>新增用户信息，需要权限'business_seller_add'
export function addBusinessSeller(obj) {
  return request({
    url: '/us/business/seller',
    method: 'post',
    data: obj
  })
}

// <商户状态>查询商户状态类型列表
export function getBusinessSellerStatus() {
  return request({
    url: '/us/business/seller/status',
    method: 'get'
  })
}

// <商户管理>修改商户的状态，需要权限'business_seller_status_edit'
export function editBusinessSellerStatus(obj) {
  return request({
    url: '/us/business/seller/status',
    method: 'post',
    data: obj
  })
}

// <商户-我的门店>分页查询商户的门店信息列表
export function getBusinessSellerStorePage(query) {
  return request({
    url: '/us/business/seller/store/page',
    method: 'get',
    params: query
  })
}

// <商户管理>修改用户信息，需要权限'business_seller_edit'
export function editBusinessSeller(obj) {
  return request({
    url: '/us/business/seller/update',
    method: 'post',
    data: obj
  })
}

// <商户详情>根据用户ID查询用户基本信息
export function getBusinessSellerById(sellerId) {
  return request({
    url: `/us/business/seller/${sellerId}`,
    method: 'get'
  })
}

// <upload_41:导入商户数据>根据Excel模板导入商户数据，生成巡检任务，需要权限'store_import'
export function uploadStore(obj) {
  return request({
    url: '/ope/upload/store',
    method: 'post',
    data: obj
  })
}

