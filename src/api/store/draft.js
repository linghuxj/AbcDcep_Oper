import request from "@/router/axios";
// store_47:根据ID查询店铺修改信息>根据ID查询店铺修改信息
export function getDraftMesById(draftId) {
  return request({
    url: `/ope/store/draft/${draftId}`,
    method: "get",
  });
}
// store_13:审核店铺修改信息>审核店铺修改信息，需要权限'store_draft_audit'
export function auditDraft(data) {
  return request({
    url: `/ope/store/draft/audit`,
    method: "post",
    data: data,
  });
}
