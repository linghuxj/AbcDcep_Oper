import request from '@/router/axios'

// <wallet_42:收支记录>分页查询用户钱包账单记录
export function getAccountPage(params) {
  return request({
    url: '/ope/wallet/cash/bill/page',
    method: 'get',
    params
  })
}
