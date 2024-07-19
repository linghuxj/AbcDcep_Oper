import request from '@/router/axios'

// <dc_40:列表>分页查询用户开通DC钱包记录信息
export function getDcWalletPage(query) {
  return request({
    url: `ope/apply/dc/wallet/page`,
    method: 'get',
    params: query
  })
}

// <dc_10:审核>审核用户DC钱包申请记录状态，需要权限'dc_wallet_audit'
export function editDcWalletAudit(obj) {
  return request({
    url: `/ope/apply/dc/wallet/audit`,
    method: 'post',
    data: obj
  })
}

// <dc_70:查询>查询用户DC钱包申请审核状态类型
export function getDcWalletStatus(query) {
  return request({
    url: `/ope/apply/dc/wallet/status`,
    method: 'get',
    params: query
  })
}

// <dc_41:导出>DC钱包报表导出
export function potentialExport(params) {
  return request({
    url: `/ope/apply/dc/wallet/status`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
