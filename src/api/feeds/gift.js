import request from "@/router/axios";

export function fetchList(query) {
  return request({
    url: "/cts/reward/gift",
    method: "get",
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: "/cts/reward/gift",
    method: "post",
    data: obj
  });
}
export function statusObj(obj) {
  return request({
    url: "/cts/reward/gift/status",
    method: "post",
    data: obj
  });
}

export function getGiftStates() {
  return request({
    url: "/cts/reward/list/status",
    method: "get"
  });
}

export function postObj(obj) {
  return request({
    url: "/cts/reward/gift/update",
    method: "post",
    data: obj
  });
}

export function validByGiftname(name) {
  return request({
    url: "/cts/reward/check/gift/name",
    method: "get",
    params: { giftName: name }
  });
}

export function deleteById(id) {
  return request({
    url: "/cts/reward/gift/" + id,
    method: "delete"
  });
}

export function trans(obj) {
  return request({
    url: "/cts/reward/gift/trans",
    method: "post",
    data: obj
  });
}
export function transGet(obj) {
  return request({
    url: "/cts/reward/gift/trans/get",
    method: "get",
    params: obj
  });
}
