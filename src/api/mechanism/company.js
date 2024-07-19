import request from '@/router/axios'

// <uop_unit_10:新增单位>新增单位，需要权限'unit_add'
export function addUnit(obj) {
  return request({
    url: '/us/unit',
    method: 'post',
    data: obj
  })
}

// <uop_unit_40:查询全部单位>查询全部单位列表
export function getUnit() {
  return request({
    url: '/us/unit/all',
    method: 'get'
  })
}

// <uop_unit_11:修改单位>修改单位，需要权限'unit_edit'
export function editUnit(obj) {
  return request({
    url: '/us/unit/update',
    method: 'post',
    data: obj
  })
}

// <uop_unit_41:根据ID查询>根据ID查询单位信息
export function getUnitById(unitId) {
  return request({
    url: `/us/unit/${unitId}`,
    method: 'get'
  })
}

// <uop_unit_42:单位树形列表>根据树形结构展示单位
export function getUnitTree() {
  return request({
    url: `/us/unit/tree`,
    method: 'get'
  })
}

// <uop_unit_13:启用单位>启用单位，需要权限'unit_status'
export function updateUnitDisabled(unitId) {
  return request({
    url: `/us/unit/disabled/${unitId}`,
    method: 'post'
  })
}

// <uop_unit_13:启用单位>启用单位，需要权限'unit_status'
export function updateUnitNormal(unitId) {
  return request({
    url: `/us/unit/normal/${unitId}`,
    method: 'post'
  })
}

