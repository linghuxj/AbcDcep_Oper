import request from "@/router/axios";

export function getUserList(query) {
    return request({
        url: "/ups/user/page/admin/list",
        method: "get",
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: "/ups/user",
        method: "post",
        data: obj
    })
}

export function postObj(obj) {
    return request({
        url: "/ups/user/update",
        method: "post",
        data: obj
    })
}

// 重置平台用户密码
export function resetPassword(userId) {
    return request({
        url: '/ups/user/reset/password/' + userId,
        method: 'post'
    })
  }