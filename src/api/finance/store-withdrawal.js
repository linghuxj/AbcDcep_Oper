import request from '@/router/axios'
// uop_store_withdraw_41:查询提现列表>查询店铺提现列表
export function getStoreWithdrawPage(query) {
  return request({
    url: '/us/store/withdraw/page',
    method: 'get',
    params: query
  })
}

// sop_store_withdraw_51:提现审核状态列表>查询提现审核状态类型
export function getStoreWithdrawPayStatus() {
  return request({
    url: '/us/store/withdraw/audit/status',
    method: 'get'
  })
}

//uop_store_withdraw_40:查询店铺米粒提现设置>查询店铺米粒提现设置
export function getStoreWithdrawConf() {
  return request({
    url: '/us/store/withdraw/get/integral/conf',
    method: 'get'
  })
}

// uop_store_withdraw_10:修改店铺米粒提现设置>修改店铺米粒提现设置，需要权限'store_integral_withdraw_conf'
export function upStoreWithdrawConf(data) {
  return request({
    url: '/us/store/withdraw/update/conf',
    method: 'post',
    data: data
  })
}

// uop_store_withdraw_11:提现审核>对提现申请进行审核，修改申请的状态，需要权限'store_withdraw_status_edit'
export function upStoreWithdrawUpdateStatus(data) {
  return request({
    url: '/us/store/withdraw/update/status',
    method: 'post',
    data: data
  })
}

// sop_store_withdraw_50:提现钱包类型列表>查询提现钱包类型
export function upStoreWithdrawTypes(data) {
  return request({
    url: '/us/store/withdraw/wallet/type',
    method: 'get',
    data: data
  })
}

// sop_store_withdraw_52:提现到账状态列表>查询提现到账状态类型
export function upStoreWithdrawPayStatus(data) {
  return request({
    url: '/us/store/withdraw/pay/status',
    method: 'get',
    data: data
  })
}
