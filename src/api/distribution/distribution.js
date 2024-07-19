import request from '@/router/axios'

// <分销员管理>分页查询分销员的客户用户列表
export function pageDistriCustomer(query) {
  return request({
    url: '/ope/distribution/customer/page',
    method: 'get',
    params: query
  })
}

// <分销员管理>升级普通分销员为团长，需要权限'distributor_level'
export function upLevelDistributor(userId) {
  return request({
    url: `/ope/distribution/level/${userId}`,
    method: 'post'
  })
}

// sop_dist_30:冻结>冻结创客，需要权限'distributor_status'
export function disabledDistributorStatus(query) {
  return request({
    url: '/ope/distribution/status/disabled',
    method: 'post',
    data: query
  })
}

//<sop_dist_32:解冻>解冻创客，需要权限'distributor_status'
export function normalDistributionStatus(query) {
  return request({
    url: '/ope/distribution/status/normal',
    method: 'post',
    data: query
  })
}

// <分销员状态>查询分销员状态类型
export function getDistributorStates() {
  return request({
    url: '/ope/distribution/status',
    method: 'get'
  })
}

// <分销员管理>分页查询团长的下级普通分销员用户列表
export function subMembers(query) {
  return request({
    url: '/ope/distribution/team/page',
    method: 'get',
    params: query
  })
}

// <分销员管理>根据分销员ID查询基本信息
export function findDistributorInfo(userId) {
  return request({
    url: `/ope/distribution/user/info/${userId}`,
    method: 'get'
  })
}

// <分销员管理>分页查询分销员用户列表
export function pageDistriUsers(query) {
  return request({
    url: '/ope/distribution/user/page',
    method: 'get',
    params: query
  })
}

// <分销员等级>查询分销员等级
export function getDistributionLevel() {
  return request({
    url: '/ope/distribution/user/level',
    method: 'get'
  })
}

// <我的团队>移除团队成员功能，需要权限'remove_member'
export function delTeamMember(memberId) {
  return request({
    url: `/ope/distribution/team/member/del/${memberId}`,
    method: 'POST'
  })
}

// <我的团队>重新加入团队成员功能，需要权限'rejoin_member'
export function rejoinTeamMember(obj) {
  return request({
    url: `/ope/distribution/team/member/rejoin`,
    method: 'POST',
    data: obj
  })
}

// sop_dist_23:关联角色>修改用户角色，需要权限'distributor_user_role'
export function updateRole(obj) {
  return request({
    url: `/ope/distribution/update/role`,
    method: 'POST',
    data: obj
  })
}
// 顶级利益者列表>分页查询顶级利益者列表
export function stakeholder(query) {
  return request({
    url: `/ope/distribution/stakeholder/page`,
    method: 'get',
    params: query
  })
}
// 任务发布者列表>分页查询任务发布者列表
export function publisher(query) {
  return request({
    url: `/ope/distribution/publisher/page`,
    method: 'get',
    params: query
  })
}
// >根据顶级收益者ID分页查询任务发布者列表
export function publisherList(query) {
  return request({
    url: `/ope/distribution/relation/publisher/page`,
    method: 'get',
    params: query
  })
}
//>根据任务发布者ID分页查询任务列表
export function TaskList(query) {
  return request({
    url: `/ope/task/publisher/page`,
    method: 'get',
    params: query
  })
}
// 查询关联数量>根据顶级收益者ID查询任务发布者关联数量和未关联数量
export function relationCount(userId) {
  return request({
    url: `/ope/distribution/publisher/count/${userId}`,
    method: 'get'
  })
}
// 关联任务发布者，需要权限'distributor_publisher'
export function relation(obj) {
  return request({
    url: '/ope/distribution/relation/publisher',
    method: 'POST',
    data: obj
  })
}
//解除关联任务发布者，需要权限'distributor_publisher'
export function relieve(obj) {
  return request({
    url: '/ope/distribution/relieve/publisher',
    method: 'POST',
    data: obj
  })
}
// sop_dist_28:设为官方创客>设为官方创客，需要权限'official_add'
export function addAfficial(obj) {
  return request({
    url: '/ope/distribution/add/official',
    method: 'post',
    data: obj
  })
}
// sop_dist_27:取消官方标识>取消官方标识，需要权限'official_del'
export function cancelOfficial(userId) {
  return request({
    url: `/ope/distribution/del/official/${userId}`,
    method: 'DELETE'
  })
}
// sop_task_46:任务结果列表>分页查询任务结果列表
export function getTaskResultList(query) {
  return request({
    url: `/ope/task/result/page`,
    method: 'get',
    params: query
  })
}
// sop_dist_26:关联机构>关联机构，需要权限'distributor_org'
export function toRelationOrg(obj) {
  return request({
    url: `/ope/distribution/relation/org`,
    method: 'post',
    data: obj
  })
}
// sop_dist_29:修改关联机构>修改关联机构，需要权限'distributor_org'
export function toUpdateRelationOrg(obj) {
  return request({
    url: `/ope/distribution/relation/org/update`,
    method: 'post',
    data: obj
  })
}
// sop_dist_62:累计数据>创客详情-累计数据
export function getTotalData(userId) {
  return request({
    url: `/ope/distribution/user/${userId}`,
    method: 'get'
  })
}

// <conf_41:查询分销设置>查询分销设置
export function reqDistributionCond() {
  return request({
    url: `/ope/conf/distribution`,
    method: 'get'
  })
}

// <conf_11:修改分销设置>需要权限'distributor_conf'
export function upDistributionCond(data) {
  return request({
    url: `/ope/conf/update/distributor`,
    method: 'post',
    data
  })
}

// sop_store_50:分页查询门店列表>分页查询门店信息列表
export function getStoreList(query) {
  return request({
    url: `/ope/store/page`,
    method: 'get',
    params: query
  })
}
