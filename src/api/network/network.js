import request from "@/router/axios";
// unit_40: 单位列表 > 搜索单位列表;
export function getUnitList(obj) {
  return request({
    url: `/ope/unit/list`,
    method: "get",
    params: obj,
  });
}
// unit_10:新增>新增网点信息
export function addUnit(obj) {
  return request({
    url: `/ope/unit`,
    method: "post",
    data: obj,
  });
}
// unit_11:修改>修改网点信息
export function updateUnit(params) {
  return request({
    url: `/ope/unit/update`,
    method: "post",
    data: params,
  });
}
// unit_12:用户关联单位>用户关联单位网点信息
export function getUserRelationUnit(params) {
  return request({
    url: `/ope/unit/relation/user`,
    method: "post",
    data: params,
  });
}
// <unit_42:用户单位列表>查询用户已关联的单位ID列表
export function getRelevanceById(userId) {
  return request({
    url: `/ope/unit/unit/ids/${userId}`,
    method: "get",
  });
}
// unit_41:用户单位列表>分页查询用户单位关联列表
export function getUserUnitPage(data) {
  return request({
    url: `/ope/unit/user/page`,
    method: "get",
    params: data,
  });
}
