import request from '@/router/axios'

// <user_auth_40:查询列表>分页查询用户实名认证信息列表
export function getAuthPage(params) {
  return request({
    url: '/ope/user/auth/real/page',
    method: 'get',
    params
  })
}

// <user_auth_10: 审核实名认证>修改实名认证审核是否通过，需要权限'distributor_auth_audit'
export function updateAuditAuth(data) {
  return request({
    url: '/ope/user/auth/real/audit',
    method: 'post',
    data
  })
}
