import request from "@/router/axios";
// union_41: 分页查询公会信息>分页查询公会信息'
export function reqUnionPage(query) {
  return request({
    url: "/ope/union/page",
    method: "get",
    params: query,
  });
}
// union_10: 保存公会信息>新增或修改的公会信息，需要权限'union_add'
export function updateUnion(data) {
  return request({
    url: "/ope/union",
    method: "post",
    data: data,
  });
}
// union_40: 查询公会信息>根据工会Id查询公会信息'
export function reqUnionDetail(unionId) {
  return request({
    url: `/ope/union/${unionId}`,
    method: "get",
  });
}
//user_tag_40:分页查询>分页查询用户标签信息列表
export function reqUserUnionPage(tagSource) {
  return request({
    url: `/ope/user/tag/page?tagSource=${tagSource}`,
    method: "get",
  });
}
// union_42: 工会状态字典>工会状态字典'
export function reqStatusPage() {
  return request({
    url: `/ope/union/status`,
    method: "get",
  });
}
// union_11: 公会信息审核>审核公会信息，需要权限'union_audit'
export function reqAuditUnion(data) {
  return request({
    url: `/ope/union/audit`,
    method: "post",
    data,
  });
}
// area_43:地区名称>通过编码获取当前地区完整名称信息
export function reqAreaCodeName(areaCode) {
  return request({
    url: `/ope/area/all/name/${areaCode}`,
    method: "get",
  });
}
// union_12:修改审核服务范围审核开关>修改审核服务范围审核开关, 需要权限'union_update_audit'
export function updateAuditUnion(data) {
  return request({
    url: `/ope/union/update/audit`,
    method: "post",
    data,
  });
}
