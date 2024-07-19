import request from "@/router/axios";
// 机构用户api

export function addOrgUser(obj) {
    return request({
        url: '/ups/kol/admin',
        method: 'post',
        data: obj
    })
}

export function searchOrgByName(orgName) {
    return request({
        url: '/ups/kol/admin/query/list',
        method: 'get',
        params: {orgName}
    })
}

export function getAssociateOrgUserList(query) {
    return request({
        url: '/ups/kol/admin/page/related/user/query',
        method: 'get',
        params: query

    })
}

// 关联用户到机构
export function associateUserByOrg(obj) {
    return request({
        url: '/ups/kol/admin/relation/user',
        method: 'post',
        data: obj
    })
}

export function addOrgKolUser(obj) {
    return request({
        url: '',
        method: 'post',
        data: obj
    })
}

export function getOrgKolUsers(query) {
    return request({
        url: '/ups/kol/admin/page/user/query',
        method: 'get',
        params: query
    })
}

export function getOrgList(query) {
    return request({
        url: '/ups/kol/admin/page/query',
        method: 'get',
        params: query
    })
}