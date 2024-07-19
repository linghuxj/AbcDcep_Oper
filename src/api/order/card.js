import request from '@/router/axios'

// <oop_order_50:列表>分页查询嗨PRO卡订单
export function getOrderCardPage(query) {
  return request({
    url: '/ope/order/card/page',
    method: 'get',
    params: query
  })
}

// <oop_order_51:查询>根据订单ID查询详细信息
export function getOrderById(orderId) {
  return request({
    url: `/ope/order/${orderId}`,
    method: 'get'
  })
}

// <oop_order_41:消费订单>分页查询消费订单
export function getOrderExpenditurePage(query) {
  return request({
    url: '/ope/order/expenditure/page',
    method: 'get',
    params: query
  })
}

// <oop_order_42:商品订单>分页查询实物订单
export function getOrderGoodsPage(query) {
  return request({
    url: '/ope/order/goods/page',
    method: 'get',
    params: query
  })
}

// <oop_order_11:收货>确认收货，需要权限'order_affirm_finished'
export function confirmOrderFinished(data) {
  return request({
    url: '/ope/order/affirm/finished',
    method: 'post',
    data: data
  })
}

// <oop_order_12:取消>取消订单，需要权限'order_cancel'
export function cancelOrder(data) {
  return request({
    url: '/ope/order/cancel',
    method: 'post',
    data: data
  })
}

// <oop_order_10:发货>商品发货，需要权限'order_deliver'
export function deliverOrder(data) {
  return request({
    url: '/ope/order/deliver',
    method: 'post',
    data: data
  })
}

// <oop_order_43:自提订单列表>分页查询自提订单
export function getOrderTakePage(params) {
  return request({
    url: '/ope/order/take/page',
    method: 'get',
    params
  })
}

// <oop_order_44:买单订单列表>分页查询买单(创客向商家付款)订单
export function getExpenditurePage(params) {
  return request({
    url: '/ope/order/store/expenditure/page',
    method: 'get',
    params
  })
}

// order_48:数字人民币订单列表>分页查询数字人民币订单(数字人民币消费券)
export function getDigitalOrder(params) {
  return request({
    url: '/ope/order/digital/coupon/page',
    method: 'get',
    params
  })
}