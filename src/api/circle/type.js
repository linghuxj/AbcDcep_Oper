import request from "@/router/axios";

// circle_type_41:分页>分页查询圈子类型列表信息
export function fetchList(query) {
  return request({
    url: "/ope/circle/type/page",
    method: "get",
    params: query
  });
}
//circle_type_40:列表>获取所有可用圈子分类的列表
export function typeList(query) {
  return request({
    url: "/ope/circle/type/list",
    method: 'get',
    params: query
  })
}
// circle_type_10:新增>新增圈子类型信息，需要权限'circle_type_add'
export function addObj(obj) {
  return request({
    url: "/ope/circle/type/create",
    method: "post",
    data: obj
  });
}

// circle_type_70:列表>查询圈子类型状态
export function getStates() {
  return request({
    url: "/ope/circle/type/status/types",
    method: "get"
  });
}

//circle_type_11:修改>修改圈子类型信息，需要权限'circle_type_edit'
export function postObj(obj) {
  return request({
    url: "/ope/circle/type/update",
    method: "post",
    data: obj
  });
}
