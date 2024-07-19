import request from '@/router/axios'

// <conf_47:查询财务设置>查询财务设置
export function getConfWallet(params) {
  return request({
    url: '/ope/conf/finance',
    method: 'get',
    params
  })
}

// <conf_17:修改财务设置>修改财务设置，需要权限'finance_conf'
export function updateWallet(data) {
  return request({
    url: '/ope/conf/update/conf',
    method: 'post',
    data
  })
}

// <conf_70:结算渠道类型列表>结算渠道类型列表
export function getpayTypes() {
  return request({
    url: '/ope/conf/pay/channel/types',
    method: 'get'
  })
}
