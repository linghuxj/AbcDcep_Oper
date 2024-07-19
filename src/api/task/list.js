import request from "@/router/axios";

// <sop_task_10:新增>新增任务信息，需要权限'task_add'
export function addTask(obj) {
  return request({
    url: "/ope/task",
    method: "post",
    data: obj,
  });
}

// <sop_task_40:列表>分页查询任务信息列表
export function getTaskPage(query) {
  return request({
    url: "/ope/task/page",
    method: "get",
    params: query,
  });
}

// <sop_task_51:列表>根据任务ID分页查询任务参与用户列表
export function getTaskReceive(query) {
  return request({
    url: "/ope/task/receive/user",
    method: "get",
    params: query,
  });
}

// <sop_dist_52:发布的任务>根据任务发布者ID分页查询任务列表
export function getTaskPageByPublisherId(query, publisherId) {
  return request({
    url: `/ope/task/task/page/${publisherId}`,
    method: "get",
    params: query,
  });
}

// <sop_task_20:修改>修改任务信息，需要权限'task_edit'
export function upTask(obj) {
  return request({
    url: "/ope/task/update",
    method: "post",
    data: obj,
  });
}

// <sop_task_40:查询>根据任务ID查询任务基本信息
export function getTaskById(taskId) {
  return request({
    url: `/ope/task/${taskId}`,
    method: "get",
  });
}

// <sop_task_30:删除>删除任务，需要权限'task_del'
export function delTaskById(taskId) {
  return request({
    url: `/ope/task/${taskId}`,
    method: "delete",
  });
}

// <user_42:用户基本信息列表>分页查询普通用户基本信息列表
export function getTaskByMobile(query) {
  return request({
    url: `/ope/user/simple/page`,
    method: "get",
    params: query,
  });
}

// <wallet_dc_40:查询用户钱包列表>根据用户ID查询用户钱包列表
export function reqDCwalletById(userId) {
  return request({
    url: `/ope/wallet/dc/user/${userId}`,
    method: "get",
  });
}

// <sop_task_12:审核任务>审核任务，需要权限'task_audit'
export function submitTaskExamine(data) {
  return request({
    url: `/ope/task/audit`,
    method: "post",
    data: data,
  });
}

// <sop_task_17:提前结束任务>提前结束任务
export function endTask(taskId) {
  return request({
    url: `/ope/task/end/${taskId}`,
    method: "post",
  });
}

// <task_42:列表>分页查询任务领取列表-创客列表
export function reqTaskReceiveUser(query) {
  return request({
    url: `/ope/task/user/page`,
    method: "get",
    params: query,
  });
}

// <task_17:一键确认收益>一键确认创客做任务产生的收益，需要权限'task_confirm_profit'
export function confirmTaskProfit(data) {
  return request({
    url: `/ope/task/confirm/user/profit`,
    method: "post",
    data: data,
  });
}

// <task_18:结算收益>结算创客做任务产生的收益，需要权限'task_settlement_add'
export function correctTaskSettlement(data) {
  return request({
    url: `/ope/task/settlement`,
    method: "post",
    data: data,
  });
}

// <task_18:纠正收益>纠正创客做任务产生的收益，需要权限'task_profit_upd'
export function correctTaskProfit(data) {
  return request({
    url: `/ope/task/update/user/profit`,
    method: "post",
    data: data,
  });
}

// <task_44:任务结果列表>分页查询任务结果列表
export function reqTaskResultPage(query) {
  return request({
    url: `/ope/task/result/page`,
    method: "get",
    params: query,
  });
}

// <task_15:任务结果审核>任务结果审核，需要权限'task_result_audit'
export function auditTaskResult(data) {
  return request({
    url: `/ope/task/result/audit`,
    method: "POST",
    data: data,
  });
}

// <sop_task_14:任务结果审核指派>任务结果审核指派，需要权限'task_result_assign'
export function assignTaskResult(data) {
  return request({
    url: `/ope/task/result/assign`,
    method: "post",
    data: data,
  });
}

// <task_46:财务账号信息>任务详情-财务账号信息
export function reqTaskWalletById(query) {
  return request({
    url: `/ope/task/maker/wallet/page`,
    method: "get",
    params: query,
  });
}

// <task_43:任务领取记录>创客的任务领取记录
export function reqTaskAll(query) {
  return request({
    url: `/ope/task/user/list`,
    method: "get",
    params: query,
  });
}

// <task_45:任务数据>任务详情-任务数据
export function reqTaskStatisticsById(taskId) {
  return request({
    url: `/ope/task/user/statistics/${taskId}`,
    method: "get",
  });
}

// <task_70:查询保证金状态列表>查询保证金状态列表
export function reqTaskSuretyList() {
  return request({
    url: `/ope/task/surety/status/types`,
    method: "get",
  });
}

// <task_47:分页查询任务保证金>分页查询任务保证金
export function reqTaskSuretyPage(query) {
  return request({
    url: `/ope/task/surety/page`,
    method: "get",
    params: query,
  });
}

// <sop_task_52:查询任务设置>查询任务设置
export function reqTaskConf() {
  return request({
    url: `/ope/task/get/conf`,
    method: "get",
  });
}

// <sop_task_18:修改任务设置>修改任务设置，需要权限'task_conf'
export function upTaskConf(data) {
  return request({
    url: `/ope/task/update/conf`,
    method: "post",
    data: data,
  });
}

// <task_14:业务设置>分佣设置，需要权限'task_commission_edit'
export function upTaskCommissionById(data) {
  return request({
    url: `/ope/task/update/commission`,
    method: "post",
    data: data,
  });
}

// <task_71:查询保证金缴纳类型列表>查询保证金缴纳类型列表
export function getSuretyType() {
  return request({
    url: `/ope/task/surety/types`,
    method: "get",
  });
}

// <task_71:查询用户群体类型列表>查询用户群体类型列表
export function getGroupType() {
  return request({
    url: `/ope/task/apply/user/types`,
    method: "get",
  });
}

// <task_47:任务分发列表>任务分发列表
export function getDistributeList(params) {
  return request({
    url: `/ope/task/distribute/page`,
    method: "get",
    params,
  });
}

// <task_49:分发链接>分发链接
export function getTaskLink(taskId) {
  return request({
    url: `/ope/task/distribute/link/${taskId}`,
    method: "get",
  });
}

// <task_50:标准要求节点列表>根据任务类型查询标准任务类型结果要求节点内容
export function getNodeResult(typeCode) {
  return request({
    url: `/ope/task/type/result/requirement/node/${typeCode}`,
    method: "get",
  });
}
//task_51:任务结果列表导出>导出任务结果列表
export function downloadResult(params) {
  return request({
    url: `/ope/task/result/download`,
    method: "get",
    params,
  });
}
// task_52:任务结果列表数据统计>分页任务结果列表数据统计
export function reqResultCount(params) {
  return request({
    url: `/ope/task/result/count`,
    method: "get",
    params,
  });
}

// <task_440:商户进件-任务结果列表>分页查询商户进件任务结果列表
export function reqResultByStoreJinjian(params) {
  return request({
    url: `/ope/task/store/result/page`,
    method: "get",
    params,
  });
}

// <task_441:商户进件-门店详情>根据门店ID查询门店详细信息
export function reqStoreDetailByJinjian(storeId, resultId) {
  return request({
    url: `/ope/task/store/detail/${storeId}?resultId=${resultId}`,
    method: "get",
  });
}

// <task_442:商户进件-任务结果列表导出>导出商户进件任务结果列表信息
export function reqExportResultByJinjian(params) {
  return request({
    url: `/ope/task/store/result/download`,
    method: "get",
    params,
  });
}
