import request from '@/router/axios'
// sop_dist_10:新增>新增任务发布者和顶层收益者，需要权限'distributor_add'
export function addDistribution(query) {
  return request({
    url: '/us/distribution',
    method: 'POST',
    data: query
  })
}
export function role(query) {
  return request({
    url: '/us/distribution/user/role',
    method: 'get',
    params: query
  })
}
export function sex(query) {
  return request({
    url: '/us/distribution/sex',
    method: 'get',
    params: query
  })
}
// 根据ID查询创客信息和认证信息
export function getMarkMes(userId) {
  return request({
    url: `/us/distribution/${userId}`,
    method: 'get'
  })
}
//sop_dist_20:修改>修改任务发布者和顶层收益者，需要权限'distributor_edit'
export function updateMark(query) {
  return request({
    url: `/us/distribution/update`,
    method: 'POST',
    data: query
  })
}
