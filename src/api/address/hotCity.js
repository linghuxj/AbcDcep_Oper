import request from '@/router/axios'
// <city_10:新增>新增城市管理信息，需要权限'area_city_add'
export function getAddCity(obj) {
  return request({
    url: `/ope/area/city`,
    method: 'post',
    data: obj
  })
}
// <city_13:停用>停用城市管理，需要权限'area_city_edit'
export function disabledCity(id) {
  return request({
    url: `/ope/area/city/disabled/${id}`,
    method: 'post'
  })
}
// <city_12:启用>启用城市管理，需要权限'area_city_edit'
export function normalCity(id) {
  return request({
    url: `/ope/area/city/normal/${id}`,
    method: 'post'
  })
}
// <city_40>分页查询城市列表
export function getPositionPage(obj) {
  return request({
    url: `/ope/area/city/position/page`,
    method: 'get',
    params: obj
  })
}
// <city_11:修改>修改城市管理信息，需要权限'area_city_edit'
export function updateCity(data) {
  return request({
    url: `/ope/area/city/update`,
    method: 'post',
    data: data
  })
}
// <city_14:排序>修改原因排序，需要权限'area_city_edit'
export function updateSort(data) {
  return request({
    url: `/ope/area/city/update/sort`,
    method: 'post',
    data: data
  })
}
