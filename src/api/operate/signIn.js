import request from '@/router/axios'

// <sop_card_10:新增>新增签到规则信息
export function addSignRule(obj) {
  return request({
    url: '/us/sign',
    method: 'post',
    data: obj
  })
}

// <sap_store_53:列表>获取自动签到类型
export function getSignAutoType() {
  return request({
    url: '/us/sign/auto/type',
    method: 'get'
  })
}

// <sap_store_53:列表>获取签到奖励类型
export function getSignBonusType() {
  return request({
    url: '/us/sign/bonus/type',
    method: 'get'
  })
}

// <sap_store_52:列表>获取签到循环模式
export function getSignCyclicalType() {
  return request({
    url: '/us/sign/cyclical/type',
    method: 'get'
  })
}

// <sap_store_51:列表>获取日签奖励类型
export function getSignType() {
  return request({
    url: `/us/sign/type`,
    method: 'get'
  })
}

// <sop_sign_40:查询>根据日签奖励类型查询签到基本信息
export function getSignByBonusType(bonusType) {
  return request({
    url: `/us/sign/${bonusType}`,
    method: 'get'
  })
}
