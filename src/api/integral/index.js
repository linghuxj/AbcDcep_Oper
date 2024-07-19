/**
 * 积分管理相关接口
 */
import request from "@/router/axios";

// <conf_11>修改米粒基础设置，需要权限'integral_conf'
export function upIntegral(data) {
  return request({
    url: "/ope/conf/update/integral/basics",
    method: "POST",
    data: data,
  });
}

// <<conf_10>修改米粒设置，需要权限'integral_conf'
export function upIntegralGenerateConf(data) {
  return request({
    url: "/ope/conf/update/integral",
    method: "POST",
    data,
  });
}

// <conf_40:查询米粒设置>查询米粒设置
export function getIntegralConf() {
  return request({
    url: "/ope/conf/integral",
    method: "get",
  });
}

// <integral_40>分页查询米粒明细
export function getIntegralPage(params) {
  return request({
    url: "/ope/integral/page",
    method: "get",
    params,
  });
}

// sign_40:查看>查看当前签到规则信息
export function getRule(params) {
  return request({
    url: "/ope/sign/rule",
    method: "get",
    params,
  });
}

// sign_11:新增>新增签到规则信息
export function createRule(data) {
  return request({
    url: "/ope/sign/rule/create",
    method: "post",
    data,
  });
}

// sign_12:修改>修改签到规则信息
export function updateRule(data) {
  return request({
    url: "/ope/sign/rule/update",
    method: "post",
    data,
  });
}

// integral_42>查询米粒交易类型字典
export function getUsedType(params) {
  return request({
    url: "/ope/integral/usedType/types",
    method: "get",
    params,
  });
}
