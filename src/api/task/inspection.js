import request from "@/router/axios";

// inspection_40:巡检任务规则列表>分页巡检任务规则列表
export function reqInspectionPage(data) {
  return request({
    url: "/ope/task/inspection/page",
    method: "get",
    params: data,
  });
}
// <inspection_11:修改巡检任务规则>修改巡检任务规则列表(影响到下一次任务的生成,不会影响到之前生成的任务)
export function updateInspectionPage(data) {
  return request({
    url: "/ope/task/inspection/update",
    method: "post",
    data: data,
  });
}
// <inspection_12:删除巡检任务规则>删除巡检任务规则
export function deleteInspection(inspectionId) {
  return request({
    url: `/ope/task/inspection/${inspectionId}`,
    method: "delete",
  });
}
