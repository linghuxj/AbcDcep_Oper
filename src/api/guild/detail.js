import request from "@/router/axios";
// union_43: 分页公会成员列表>公会成员列表
export function reqMemberPage(query) {
  return request({
    url: "/ope/union/member/page",
    method: "get",
    params: query,
  });
}
// union_45: 工会成员状态字典>工会成员状态字典'
export function reqMemberStatus() {
  return request({
    url: `/ope/union/member/status`,
    method: "get",
  });
}
// union_44: 成员详情>公会成员详情
export function reqMemberByUserId(userId) {
  return request({
    url: `/ope/union/member/${userId}`,
    method: "get",
  });
}
// union_13:移除公会成员>移除公会成员, 需要权限'union_member_del'
export function delMemberUnion(data) {
  return request({
    url: `/ope/union/member/del`,
    method: "post",
    data,
  });
}
// union_15:成员加入公会>成员加入公会, 需要权限'union_member_join'
export function addMemberUnion(data) {
  return request({
    url: `/ope/union/member/join`,
    method: "post",
    data,
  });
}

// <union_16:审核成员服务范围>审核成员服务范围
export function auditMemberLocation(data) {
  return request({
    url: `/ope/union/audit/member/location`,
    method: "post",
    data,
  });
}

// <union_47: 入会成员申请状态字典>入会成员申请状态字典'
export function reqApplyStatusList() {
  return request({
    url: `/ope/union/member/apply/status`,
    method: "get",
  });
}
// union_17:审核入会成员申请>审核入会成员申请, 需要权限'union_member_join_audit'
export function auditMemberJoin(data) {
  return request({
    url: `/ope/union/audit/member/join`,
    method: "post",
    data,
  });
}
// union_46: 分页查询入会申请成员列表>公会成员列表
export function reqApplyMemberList(data) {
  return request({
    url: `/ope/union/member/apply/page`,
    method: "get",
    params: data,
  });
}
