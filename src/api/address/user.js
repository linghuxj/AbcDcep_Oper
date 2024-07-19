import request from '@/router/axios'
// <addr_10:新增>创建收货地址信息，需要权限'address_add'
export function addAddress(obj) {
  return request({
    url: `/ope/user/address`,
    method: 'post',
    data: obj
  })
}

// <addr_12:设置-取消默认收货地址>设置-取消收货地址为默认地址，需要权限'address_default_edit'
export function setDefaultAddress(addressId) {
  return request({
    url: `/ope/user/address/default/${addressId}`,
    method: 'post'
  })
}

// <addr_41:地址详情>获取用户全部地址信息
export function getAddressPages(query) {
  return request({
    url: '/ope/user/address/page',
    method: 'get',
    params: query
  })
}

// <addr_11:修改>修改收货地址信息，需要权限'address_edit'
export function updateAddress(obj) {
  return request({
    url: '/ope/user/address/update',
    method: 'post',
    data: obj
  })
}

// <addr_40:地址列表>分页查询用户地址列表
export function getAddressUserPages(query) {
  return request({
    url: '/ope/user/address/user/page',
    method: 'get',
    params: query
  })
}
