import request from '@/router/axios'
// <standing_40:待生成台账>分页查询待生成台账列表
export function getAccountPage(params) {
  return request({
    url: '/ope/standing/book/wait/page',
    method: 'get',
    params
  })
}

// <standing_41:待台账生成>查询台账生成列表
export function getAccountList(params) {
  return request({
    url: '/ope/standing/book/wait/list',
    method: 'get',
    params
  })
}

// <standing_42:台账列表>分页查询台账列表
export function getBookPage(params) {
  return request({
    url: '/ope/standing/book/page',
    method: 'get',
    params
  })
}

// <standing_44:关联列表>根据台账ID查询台账项关联列表
export function getRelationList(bookId) {
  return request({
    url: `/ope/standing/book/relation/list/${bookId}`,
    method: 'get'
  })
}

// <standing_46:导出>根据台账ID导出台账项列表
export function getDownloadRelation(bookId) {
  return request({
    url: `/ope/standing/book/download/relation/item/${bookId}`,
    method: 'get',
    responseType: 'blob'
  })
}

// <standing_10:生成台账>生成台账
export function generate(data) {
  return request({
    url: '/ope/standing/book/generate',
    method: 'post',
    data
  })
}

/* 账单付款 */
// <standing_70:查询>查询台账付款状态类型列表
export function getStatusTypes(data) {
  return request({
    url: '/ope/standing/book/status/types',
    method: 'get'
  })
}

// <standing_44:关联列表>根据台账ID查询台账项关联列表
export function getBookItemList(bookId) {
  return request({
    url: `/ope/standing/book/item/list/${bookId}`,
    method: 'get'
  })
}

// <standing_46:导出>根据台账ID导出台账项列表
export function getDownloadItem(bookId) {
  return request({
    url: `/ope/standing/book/download/item/${bookId}`,
    method: 'get',
    responseType: 'blob'
  })
}

// <standing_10:生成台账>生成台账
export function havePay(data) {
  return request({
    url: '/ope/standing/book/have/pay',
    method: 'post',
    data
  })
}
