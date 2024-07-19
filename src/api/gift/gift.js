import request from '@/router/axios'

// <sop_gift_30:领取礼物订单列表>分页查询用户领取礼物的订单记录信息列表
export function reqReceiveGiftPage(query) {
  return request({
    url: '/us/receive/gift/page',
    method: 'get',
    params: query
  })
}

// <sop_gift_70:导出报表>用户领取礼物的订单记录信息报表导出
export function reqReceiveGiftExport(query) {
  return request({
    url: '/us/receive/gift/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
