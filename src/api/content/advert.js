import request from '@/router/axios'

// advert_10:新增广告信息>新增广告信息，需要权限'advert_add'
export function addAdvert(obj) {
  return request({
    url: '/ope/advert',
    method: 'post',
    data: obj
  })
}

// advert_13:下架>下架广告信息，需要权限'advert_disabled'
export function disabledAdvert(adId) {
  return request({
    url: `/ope/advert/disabled/${adId}`,
    method: 'post'
  })
}

// advert_12:上架>上架广告信息，需要权限'advert_normal'
export function normalAdvert(adId) {
  return request({
    url: `/ope/advert/normal/${adId}`,
    method: 'post'
  })
}
// advert_44:列表>分页查询广告列表
export function getAdvertPage(data) {
  return request({
    url: `/ope/advert/page`,
    method: 'get',
    params: data
  })
}

// advert_45:列表>查询全部广告位置
export function getAdvertPositionAll() {
  return request({
    url: '/ope/advert/position/all',
    method: 'get'
  })
}

// advert_15:下架>下架广告位，需要权限'advert_position_disabled'
export function disabledAdvertPosition(positionId) {
  return request({
    url: `/ope/advert/position/disabled/${positionId}`,
    method: 'post'
  })
}

// advert_14:上架>上架广告位，需要权限'advert_position_normal'
export function normalAdvertPosition(positionId) {
  return request({
    url: `/ope/advert/position/normal/${positionId}`,
    method: 'post'
  })
}

// advert_43:列表>分页查询广告位置列表
export function getAdvertPosition(query) {
  return request({
    url: '/ope/advert/position/page',
    method: 'get',
    params: query
  })
}

// <advert_11:修改>修改广告信息，需要权限'advert_edit'
export function updateAdvert(obj) {
  return request({
    url: '/ope/advert/update',
    method: 'post',
    data: obj
  })
}

// advert_40:查询>根据ID查询广告详细信息
export function getAdvertById(adId) {
  return request({
    url: `/ope/advert/${adId}`,
    method: 'get'
  })
}

// <advert_70>查询广告链接类型列表
export function getAdvertType() {
  return request({
    url: `/ope/advert/link/type/list`,
    method: 'get'
  })
}

// sop_advert_42:数量统计>根据状态统计广告数量
export function getAdvertCount(data) {
  return request({
    url: `/ope/advert/count/status`,
    method: 'get',
    params: data
  })
}

// advert_41:位置数量统计>根据状态统计广告位置数量
export function getAdvertPositionCount(status) {
  return request({
    url: `/ope/advert/position/count/${status}`,
    method: 'get'
  })
}

// area_42:列表>根据关键字搜索地区列表
export function getAreaList(query) {
  return request({
    url: `/ope/area/list`,
    method: 'get',
    params: query
  })
}
