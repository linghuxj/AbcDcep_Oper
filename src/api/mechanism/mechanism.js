import request from '@/router/axios'
// sop_organization_10:新增>新增机构信息信息，需要权限'organization_add'
export function addOrganization(obj) {
  return request({
    url: '/us/organization',
    method: 'post',
    data: obj
  })
}
// sop_organization_13:冻结机构信息>冻结机构信息，需要权限'organization_edit'
export function disabledOrganization(id) {
  return request({
    url: `/us/organization/disabled/status/${id}`,
    method: 'post'
  })
}
// sop_organization_12:解结机构信息>解结机构信息，需要权限'organization_edit'
export function normalOrganization(id) {
  return request({
    url: `/us/organization/normal/status/${id}`,
    method: 'post'
  })
}
// sop_organization_42:分页查询未关联的子账号>分页查询未关联的子账号
export function notRelationuser(query) {
  return request({
    url: `/us/organization/not/relation/user/page`,
    method: 'get',
    params: query
  })
}
// <sop_organization_40:分页查询>分页查询机构信息列表
export function getOrganization(query) {
  return request({
    url: `/us/organization/page`,
    method: 'get',
    params: query
  })
}
// sop_organization_15:关联子账号>关联子账号，需要权限'organization_edit'
export function relationOrganization(query) {
  return request({
    url: `/us/organization/relation`,
    method: 'post',
    data: query
  })
}
// sop_organization_15:取消关联子账号>取消关联子账号，需要权限'organization_edit'
export function delRelationOrganization(id) {
  return request({
    url: `/us/organization/relation/del/${id}`,
    method: 'DELETE'
  })
}
// sop_organization_43:分页查询已关联的子账号>分页查询已关联的子账号
export function getRelationOrganization(query) {
  return request({
    url: `/us/organization/relation/user/page`,
    method: 'get',
    params: query
  })
}
// sop_organization_14:重置密码>重置密码，需要权限'organization_edit'
export function resetOrganizationPassword(adminUserId) {
  return request({
    url: `/us/organization/reset/password/${adminUserId}`,
    method: 'post'
  })
}
// sop_organization_11:修改>修改机构信息信息，需要权限'organization_edit'
export function updateOrganization(obj) {
  return request({
    url: `/us/organization/update`,
    method: 'post',
    data: obj
  })
}
// sop_dist_63:查询用户>根据用户手机号模糊查询发布者/顶级利益者
export function getDistributorList(mobile) {
  return request({
    url: `/us/distribution/distributor/${mobile}`,
    method: 'get'
  })
}
