import request from '@/router/axios'

// <sop_withdraw_30:提现列表>分页查询用户提现信息列表
export function getWithdrawPage(query) {
  return request({
    url: '/ope/user/withdraw/page',
    method: 'get',
    params: query
  })
}

// <sop_withdraw_52:提现到账状态列表>查询提现到账状态类型
export function getWithdrawPayStatus() {
  return request({
    url: '/ope/user/withdraw/pay/status',
    method: 'get'
  })
}

// <sop_dist_53:查询提现设置>查询提现设置
export function getWithdrawConf() {
  return request({
    url: '/ope/user/withdraw/get/conf',
    method: 'get'
  })
}

// <sop_dist_21:修改提现设置>修改提现设置，需要权限'withdraw_conf'
export function upWithdrawConf(data) {
  return request({
    url: '/ope/user/withdraw/update/conf',
    method: 'post',
    data: data
  })
}

// <sop_withdraw_20:提现审核>对提现申请进行审核，修改申请的状态，需要权限'withdraw_status_edit'
export function upWithdrawStatus(data) {
  return request({
    url: '/ope/user/withdraw/update/status',
    method: 'post',
    data: data
  })
}

// <wallet_41:返佣记录>分页查询返佣记录
export function getWalletCommissionPage(query) {
  return request({
    url: '/ope/wallet/task/recommend/page',
    method: 'get',
    params: query
  })
}

// <sop_task_41:用户财务信息>分页查询用户财务信息
export function getUserWalletPage(query) {
  return request({
    url: '/ope/wallet/page',
    method: 'get',
    params: query
  })
}

// sop_withdraw_54:查询保证金提现设置>查询保证金提现设置
export function getSuretyonf(query) {
  return request({
    url: '/ope/user/withdraw/get/task/surety/conf',
    method: 'get',
    params: query
  })
}

// sop_withdraw_22:保证金提现设置>修改保证金提现设置，需要权限'task_surety_withdraw_conf'
export function updateSuretyonf(query) {
  return request({
    url: '/ope/user/withdraw/update/task/surety/conf',
    method: 'post',
    data: query
  })
}

// sop_withdraw_50:提现钱包类型列表>查询提现钱包类型
export function getWalletType(query) {
  return request({
    url: '/ope/user/withdraw/wallet/type',
    method: 'get',
    params: query
  })
}
