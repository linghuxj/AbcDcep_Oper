import request from '@/router/axios'

//<area_40:列表>根据父ID查询其子地区列表或直接全部加载，以树形结构展示, 默认不查询全国
export function areas(query) {
  return request({
    url: '/ope/area/tree',
    method: 'get',
    params: query
  })
}

// <地区列表>查询其所有有效地区列表，以树形结构展示
export function areaTree() {
  return request({
    url: '/sys/area/valid/tree',
    method: 'get'
  })
}

// <地区管理>新增地区信息
export function addObj(obj) {
  return request({
    url: '/sys/area',
    method: 'post',
    data: obj
  })
}

// <地区管理>修改地区信息
export function postObj(obj) {
  return request({
    url: '/sys/area/update',
    method: 'post',
    data: obj
  })
}

export function trans(obj) {
  return request({
    url: '/sys/area/item/trans',
    method: 'post',
    data: obj
  })
}

export function transGet(obj) {
  return request({
    url: '/sys/area/item/trans/get',
    method: 'get',
    params: obj
  })
}
// <sop_area_52:列表>根据父ID查询其子地区列表或直接全部加载，以树形结构展示, 包含全国
export function getAreaNationwideTree(query) {
  return request({
    url: `/ope/area/tree`,
    method: 'get',
    params: query
  })
}
