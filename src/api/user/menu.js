import request from "@/router/axios";

export function getMenu() {
  return request({
    url: "/ope/menu/load/menu",
    method: "get"
  });
}

export function getTopMenu() {
  return request({
    url: "/ope/menu/load/top",
    method: "get"
  });
}

export function fetchMenuTree(lazy, parentId) {
  return request({
    url: "/ope/menu/tree",
    method: "get",
    params: { lazy: lazy, parentId: parentId }
  });
}

export function addObj(obj) {
  return request({
    url: "/ope/menu",
    method: "post",
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: "/ope/menu/" + id,
    method: "get"
  });
}

export function delObj(id) {
  return request({
    url: "/ope/menu/" + id,
    method: "delete"
  });
}

export function postObj(obj) {
  return request({
    url: "/ope/menu/update",
    method: "post",
    data: obj
  });
}

export function trans(obj) {
  return request({
    url: "/ope/menu/trans",
    method: "post",
    data: obj
  });
}
export function transGet(obj) {
  return request({
    url: "/ope/menu/trans/get",
    method: "get",
    params: obj
  });
}
