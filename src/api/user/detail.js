import request from "@/router/axios";
// user_41:用户基本信息>根据用户ID查询用户基本信息
export function reqUserById(userId) {
  return request({
    url: `/ope/user/${userId}`,
    method: "get",
  });
}
// user_11:修改>修改用户，需要权限'user_edit'
export function updateUser(data) {
  return request({
    url: `/ope/user/update`,
    method: "post",
    data: data,
  });
}
// <user_43:用户收益>统计用户收益
export function reqWalletProfit(params) {
  return request({
    url: `/ope/wallet/profit`,
    method: "get",
    params,
  });
}
// union_13:移除公会成员>移除公会成员, 需要权限'union_member_del'
export function delUnionMember(data) {
  return request({
    url: `/ope/union/member/del`,
    method: "post",
    data,
  });
}
// order_47:用户订单>分页查询用户订单
export function reqUserPage(params) {
  return request({
    url: `/ope/order/user/page`,
    method: "get",
    params,
  });
}
// pay_50:支付类型列表>获取全部支付类型列表
export function reqWayAll(params) {
  return request({
    url: `/ope/pay/way/all`,
    method: "get",
    params,
  });
}
// order_70:订单类型列表>查询订单类型类型列表
export function reqTypesOrder(params) {
  return request({
    url: `/ope/order/types`,
    method: "get",
    params,
  });
}
// 创米数据
/* <task_43:创客任务>分页查询创客任务列表 */
export function reqTaskReceived(params) {
  return request({
    url: `/ope/task/received/page`,
    method: "get",
    params,
  });
}
// task_74:任务状态列表>查询任务状态类型列表
export function reqTaskStatusTypes(params) {
  return request({
    url: `/ope/task/status/types`,
    method: "get",
    params,
  });
}
