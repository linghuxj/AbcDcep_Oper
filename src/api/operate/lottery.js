import request from '@/router/axios'
// sop_lottery_10>新增抽奖活动信息，需要权限'lottery_add'
export function addLottery(query) {
  return request({
    url: '/us/lottery',
    method: 'post',
    data: query
  })
}
// sop_lottery_43>查询参与人类型列表
export function getTypeList() {
  return request({
    url: '/us/lottery/part/user/type/list',
    method: 'get'
  })
}

// sop_lottery_45>查询抽奖活动中奖状态列表
export function getStatusList() {
  return request({
    url: '/us/lottery/log/status/list',
    method: 'get'
  })
}

//sop_lottery_46>分页查询抽奖活动列表
export function getlotteryPage(query) {
  return request({
    url: '/us/lottery/page',
    method: 'get',
    params: query
  })
}

// sop_lottery_42>查询抽奖活动参加次数类型列表
export function getTypeListNum() {
  return request({
    url: '/us/lottery/part/num/type/list',
    method: 'get'
  })
}

// sop_lottery_47>根据抽奖活动ID查询奖品列表
export function getListById(lotteryId) {
  return request({
    url: `/us/lottery/prize/list/${lotteryId}`,
    method: 'get'
  })
}

// sop_lottery_44>查询抽奖活动奖品类型列表
export function getTypePrizeList(lotteryId) {
  return request({
    url: `/us/lottery/prize/type/list`,
    method: 'get'
  })
}

// sop_lottery_48>根据抽奖活动ID查询奖品分类列表
export function getPrizeTypeById(lotteryId) {
  return request({
    url: `/us/lottery/prize/type/list/${lotteryId}`,
    method: 'get'
  })
}

// sop_lottery_40>查询抽奖活动状态列表
export function getStatus(data) {
  return request({
    url: `/us/lottery/status/list`,
    method: 'get',
    param: data
  })
}

// sop_lottery_41>查询抽奖活动类型列表
export function getLotteryType() {
  return request({
    url: `/us/lottery/type/list`,
    method: 'get'
  })
}

// sop_lottery_11>修改抽奖活动信息，需要权限'lottery_edit'
export function updateLottery(query) {
  return request({
    url: `/us/lottery/update`,
    method: 'post',
    data: query
  })
}

//sop_lottery_49>根据抽奖活动ID查询信息
export function getLotteryMesById(lotteryId) {
  return request({
    url: `/us/lottery/${lotteryId}`,
    method: 'get'
  })
}

// sop_lottery_14>结束抽奖活动，需要权限'lottery_over'
export function overLottery(lotteryId) {
  return request({
    url: `/us/lottery/over/${lotteryId}`,
    method: 'post'
  })
}

// <sop_lottery_50>分页查询抽奖记录列表
export function getLotteryLogPage(query) {
  return request({
    url: `/us/lottery/log/page`,
    method: 'get',
    params: query
  })
}

// <sop_lottery_47>根据抽奖活动ID查询奖品列表
export function getLotteryPrizePage(lotteryId) {
  return request({
    url: `/us/lottery/prize/list/${lotteryId}`,
    method: 'get'
  })
}

// <sop_lottery_12>物品发货，需要权限'lottery_deliver'
export function deliverLottery(data) {
  return request({
    url: `/us/lottery/deliver`,
    method: 'post',
    data: data
  })
}

// <sop_lottery_13>确认收货，需要权限'lottery_affirm_finished'
export function finishedLottery(data, logId) {
  return request({
    url: `/us/lottery/affirm/finished/${logId}`,
    method: 'post',
    data: data
  })
}
