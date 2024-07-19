import request from '@/router/axios'
// <uop_unit_41:根据ID查询>根据ID查询单位信息
export function getUnitDetail(unitId) {
  return request({
    url: `/us/unit/${unitId}`,
    method: 'get'
  })
}

// <uop_unit_11:修改单位>修改单位，需要权限'unit_edit'
export function unitEdit(data) {
  return request({
    url: `/us/unit/update`,
    method: 'post',
    data
  })
}

// <sop_dist_65:查询单位未关联账户>分页查询单位未关联账户
export function getDistributionUnit(params) {
  return request({
    url: `/us/distribution/unit/unconnected/page`,
    method: 'get',
    params
  })
}

// <uop_unit_43:下级单位列表>查询全部下级节点信息列表(网点)
export function getlowerList(unitId) {
  return request({
    url: `/us/unit/lower/level/list/${unitId}`,
    method: 'get'
  })
}

// <sop_district_52:查询单位可关联商圈>根据不同的城市areaCode,查询城市下面的所有正常可关联的商圈
export function getRelationUnit(areaCode) {
  return request({
    url: `/us/business/district/relation/unit/${areaCode}`,
    method: 'get'
  })
}

// <uop_unit_44:查询单位已关联商圈>查询单位已关联商圈
export function getRelationList(params) {
  return request({
    url: `/us/unit/relation/district/page`,
    method: 'get',
    params
  })
}

// <uop_unit_15:关联商圈>关联商圈，需要权限'relation_unit_district'
export function unitDistrict(data) {
  return request({
    url: `/us/unit/relation/district`,
    method: 'post',
    data
  })
}

// <uop_unit_16:删除关联商圈>删除关联商圈，需要权限'delete_unit_district'
export function deleteDistrict(ids) {
  return request({
    url: `/us/unit/delete/district/${ids}`,
    method: 'post'
  })
}

// <uop_unit_14:关联主账号>关联主账号，需要权限'relation_unit_primary_user'
export function unitPrimaryUser(data) {
  return request({
    url: `/us/unit/relation/primary/user`,
    method: 'post',
    data
  })
}

// <uop_unit_45:查询关联人员>分页查询已关联人员列表
export function getRelationUser(params) {
  return request({
    url: `/us/unit/relation/user/page`,
    method: 'get',
    params
  })
}

// <uop_unit_user_13:冻结>冻结单位人员，需要权限'unit_user_status'
export function userDisabled(userId) {
  return request({
    url: `/us/user/unit/disabled/${userId}`,
    method: 'post'
  })
}

//<uop_unit_user_12:解冻>解冻单位人员，需要权限'unit_user_status'
export function userNormal(userId) {
  return request({
    url: `/us/user/unit/normal/${userId}`,
    method: 'post'
  })
}

// <sop_user_21:修改>修改用户状态，需要权限'user_status_edit'
export function userStatusUpdate(data) {
  return request({
    url: `/us/user/update/status`,
    method: 'post',
    data
  })
}

// <uop_unit_user_14:重置密码>重置密码，需要权限'unit_user_reset_password'
export function resetPassword(userId) {
  return request({
    url: `/us/user/unit/reset/password/${userId}`,
    method: 'post'
  })
}

// <uop_unit_17:关联创客>关联创客账号，需要权限'relation_unit_distributor'
export function unitDistributor(data) {
  return request({
    url: `/us/unit/relation/distributor`,
    method: 'post',
    data
  })
}
