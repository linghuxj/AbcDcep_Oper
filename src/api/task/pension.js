import request from "@/router/axios";

// <pension_30:任务结果列表>分页查询任务结果列表
export function reqPensionPage(query) {
  return request({
    url: "/ope/pension/account/page",
    method: "get",
    params: query,
  });
}

// <pension_31:推广养老金账户详情>推广养老金账户详情信息
export function reqPensionById(pensionId) {
  return request({
    url: `/ope/pension/account/${pensionId}`,
    method: "get",
  });
}

// <pension_33:开通渠道状态列表>查询推广养老金账户开通渠道类型列表
export function reqPensionChannels() {
  return request({
    url: `/ope/pension/account/channels`,
    method: "get",
  });
}

// <pension_34:账户状态列表>查询推广养老金账户状态类型列表
export function reqPensionStatus() {
  return request({
    url: `/ope/pension/account/status`,
    method: "get",
  });
}

// <pension_32:推广养老金账户列表数据统计>推广养老金账户列表数据统计
export function reqPensionCount(params) {
  return request({
    url: `/ope/pension/account/count`,
    method: "get",
    params,
  });
}
