import request from "@/router/axios";
// user_72:平台类型列表>查询平台类型列表
export function reqPlatformTypes(params) {
  return request({
    url: "/ope/user/platform/types",
    method: "get",
    params,
  });
}

// <partner_40:分页>分页查询合伙人
export function leaderList(params) {
  return request({
    url: "/ope/relation/partner/page",
    method: "get",
    params,
  });
}

// <partner_10:新增>新增合伙人信息，需要权限'relation_partner_add'
export function relationPartner(data) {
  return request({
    url: "/ope/relation/partner",
    method: "post",
    data,
  });
}

// <partner_11:修改状态>修改合伙人状态，需要权限'relation_partner_status'
export function editDistributionStatus(data) {
  return request({
    url: "/ope/relation/partner/update/status",
    method: "post",
    data,
  });
}

// <dist_40:营销用户列表>分页查询营销员信息列表
export function makerList(params) {
  return request({
    url: "/ope/distribution/maker/page",
    method: "get",
    params,
  });
}

/* 旧版接口 */
// 登录之后运营人员获取用户信息
export function getMine(id) {
  return request({
    url: "/ope/admin/user/" + id,
    method: "get",
  });
}
// 分页获取用户列表信息
export function fetchList(query) {
  return request({
    url: "/ope/admin/user/page",
    method: "get",
    params: query,
  });
}

export function getUserDetail(userId) {
  return request({
    url: "/ope/user/page/normal/detail/" + userId,
    method: "get",
  });
}

// <查询>分页查询用户的图文/视频内容信息列表
export function getUserNotes(query) {
  return request({
    url: "/ope/note/page/user/list",
    method: "get",
    params: query,
  });
}

export function addObj(obj) {
  return request({
    url: "/ope/user",
    method: "post",
    data: obj,
  });
}

export function getObj(id) {
  return request({
    url: "/ope/user/" + id,
    method: "get",
  });
}

export function delObj(id) {
  return request({
    url: "/ope/user/" + id,
    method: "delete",
  });
}

export function postObj(obj) {
  return request({
    url: "/ope/user/update",
    method: "post",
    data: obj,
  });
}

export function updateUser(obj) {
  return request({
    url: "/ope/user/mine",
    method: "post",
    data: obj,
  });
}

export function changePassword(obj) {
  return request({
    url: "/ope/user/password",
    method: "post",
    data: obj,
  });
}

export function getDetails(obj) {
  return request({
    url: "/ope/user/detail/" + obj,
    method: "get",
  });
}

export function checkByUsername(username) {
  return request({
    url: "/ope/user/check/username",
    method: "get",
    params: {
      username: username,
    },
  });
}

// user_42:用户基本信息列表>分页查询普通用户基本信息列表
export function getUsersbyMobile(mobile) {
  return request({
    url: "/ope/user/simple/page",
    method: "get",
    params: { mobile },
  });
}

export function editInfo(obj) {
  return request({
    url: "/ope/user/edit",
    method: "put",
    data: obj,
  });
}

export function statusUpdate(obj) {
  return request({
    url: "/ope/user/status",
    method: "post",
    data: obj,
  });
}

export function checkByMobile(mobile) {
  return request({
    url: "/ope/user/check/mobile",
    method: "get",
    params: {
      mobile: mobile,
    },
  });
}

export function checkByEmail(email) {
  return request({
    url: "/ope/user/check/email",
    method: "get",
    params: {
      email: email,
    },
  });
}
