import request from '@/router/axios'
//sop_unit_user_40:分页查询>分页查询单位人员列表
export function getUnitPage(obj) {
  return request({
    url: `/us/user/unit/page`,
    method: 'get',
    params: obj
  })
}
// sop_unit_user_10:新增>新增单位人员，需要权限'unit_user_add'
export function addUnit(params) {
  return request({
    url: `/us/user/unit`,
    method: 'post',
    data: params
  })
}
// sop_unit_user_13:冻结>冻结单位人员，需要权限'unit_user_disabled'
export function disabledUnit(userId) {
  return request({
    url: `/us/user/unit/disabled/${userId}`,
    method: 'post',
  })
}
// <sop_unit_user_12:解冻>解冻单位人员，需要权限'unit_user_normal'
export function normalUnit(userId) {
  return request({
    url: `/us/user/unit/normal/${userId}`,
    method: 'post',
  })
}
// sop_unit_user_14:重置密码>重置密码，需要权限'unit_user_reset_password'
export function resetPasswordUnit(userId) {
  return request({
    url: `/us/user/unit/reset/password/${userId}`,
    method: 'post',
  })
}
// sop_unit_user_11:修改>修改单位人员，需要权限'unit_user_edit'
export function updateUnit(data) {
  return request({
    url: `/us/user/unit/update`,
    method: 'post',
    data:data,
  })
}
// sop_unit_user_41:根据ID查询>根据ID查询单位人员信息
export function getDetailById(userId) {
  return request({
    url: `/us/user/unit/${userId}`,
    method: 'get',
  })
}
// uop_unit_user_42:查询用户状态类型>查询用户状态类型列表
export function getUnitStatus() {
  return request({
    url: `/us/user/unit/status`,
    method: 'get',
  })
}
// uop_unit_40:查询全部单位>查询全部单位列表
export function getUnitAll() {
  return request({
    url: `/us/unit/all`,
    method: 'get',
  })
}
// uop_unit_41:根据ID查询>根据ID查询单位信息
export function getUnitByID(unitId) {
  return request({
    url: `/us/unit/${unitId}`,
    method: 'get',
  })
}
