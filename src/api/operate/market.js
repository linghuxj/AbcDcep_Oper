import request from '@/router/axios'

// <new_user_40:新人礼活动列表>分页查询新人礼活动信息列表
export function reqDistMarketPage(params) {
  return request({
    url: '/ope/new/user/page',
    method: 'get',
    params
  })
}

// <new_user_71:类型列表>查询新人礼活动类型列表
export function reqDistMarketType() {
  return request({
    url: '/ope/new/user/type/types',
    method: 'get'
  })
}

// <new_user_11:修改新人礼活动>修改新人礼活动信息，需要权限'new_user_active_edit'
export function upDistMarket(data) {
  return request({
    url: '/ope/new/user/update',
    method: 'post',
    data: data
  })
}

// <new_user_12:结束新人礼活动>结束新人礼活动-修改活动的状态，需要权限'new_user_active_status'
export function overDistMarket(id) {
  return request({
    url: `/ope/new/user/over/${id}`,
    method: 'post'
  })
}

// <new_user_10:新增新人礼活动>新增新人礼活动信息，需要权限'new_user_active_add'
export function addDistMarket(data) {
  return request({
    url: '/ope/new/user',
    method: 'post',
    data
  })
}

// <new_user_41:新人礼活动详情列表>分页查询新人礼活动详情信息列表
export function reqDistMarketDetailPage(params) {
  return request({
    url: '/ope/new/user/log/page',
    method: 'get',
    params
  })
}

// <new_user_42:新人礼活动详情>根据活动ID查询新人礼活动详细信息
export function reqDistMarketDetailById(id) {
  return request({
    url: `/ope/new/user/${id}`,
    method: 'get'
  })
}
