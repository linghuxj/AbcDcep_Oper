import request from '@/router/axios'

// <refund_41:分页>分页查询退款记录
export function getRefundList(data) {
  return request({
    url: '/ope/refund/page',
    method: 'get',
    params: data
  })
}

// <oop_refund_10:审核>退款审核，需要权限'refund_audit'
export function auditRefund(obj) {
  return request({
    url: '/ope/refund/audit',
    method: 'post',
    data: obj
  })
}

// oop_refund_40:查询>根据ID查询退款信息
export function getByIdrefund(refundId) {
  return request({
    url: `/ope/refund/${refundId}`,
    method: 'get'
  })
}

// sop_user_43:列表>查询退款审核状态类型
export function getAuditStatusList() {
  return request({
    url: `/ope/refund/audit/status/list`,
    method: 'get'
  })
}
