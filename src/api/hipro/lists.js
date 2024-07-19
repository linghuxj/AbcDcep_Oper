import request from '@/router/axios'

// <sop_card_10:新增>新增嗨PRO卡信息
export function addCard(obj) {
  return request({
    url: '/us/card',
    method: 'post',
    data: obj
  })
}

// <sop_card_50:列表>分页查询嗨PRO卡
export function getCardPages(query) {
  return request({
    url: '/us/card/page',
    method: 'get',
    params: query
  })
}

// <sop_card_20:修改>修改嗨PRO卡信息
export function editCard(obj) {
  return request({
    url: '/us/card/update',
    method: 'post',
    data: obj
  })
}

// <sop_card_40:查询>根据嗨PRO卡ID查询嗨PRO卡基本信息
export function getCardById(id) {
  return request({
    url: `/us/card/${id}`,
    method: 'get'
  })
}
// sop_card_31:列表>分页查询嗨卡类型信息列表
export function getTypeCard(query) {
  return request({
    url: `/us/card/type/page`,
    method: 'get',
    params: query
  })
}
// sop_card_11:修改>修改嗨卡类型信息，需要权限'card_type_edit'
export function updateTypeCard(obj) {
  return request({
    url: `/us/card/type/update`,
    method: 'post',
    data: obj
  })
}
// sop_card_12:删除>删除嗨卡类型，需要权限'card_type_del'
export function deleteTypeCard(id) {
  return request({
    url: `/us/card/type/${id}`,
    method: 'DELETE'
  })
}
// sop_card_10:新增>新增嗨卡类型信息，需要权限'card_type_add'
export function addCardType(obj) {
  return request({
    url: `/us/card/type`,
    method: 'post',
    data: obj
  })
}
