import request from "@/router/axios";

export function getAvatarList(params) {
  return request({
    url: "/ups/avatar/gift",
    method: "get",
    params
  });
}

export function addAvatar(data) {
  return request({
    url: "/ups/avatar",
    method: "post",
    data
  });
}

export function validAvatar(params) {
  return request({
    url: "/ups/avatar/check/avatar/name",
    method: "get",
    params
  });
}

export function editAvatar(data) {
  return request({
    url: "/ups/avatar/update",
    method: "post",
    data
  });
}

export function updateAvatarStatus(data) {
  return request({
    url: "/ups/avatar/update/status",
    method: "post",
    data
  });
}

export function deleteAvatar(avatarId) {
  return request({
    url: "/ups/avatar/del/" + avatarId,
    method: "delete"
  });
}
