import request from '@/router/axios'

// <商家用户>新增商家用户信息，需要权限'seller_add'
export function addSeller(obj) {
    return request({
        url: '/us/seller',
        method: 'post',
        data: obj
    })
}

// <商家用户>分页查询商家用户信息列表
export function getSellerPages(query) {
    return request({
        url: '/us/seller/page',
        method: 'get',
        params: query
    })
}

// <商家用户状态类型>查询商家用户状态类型
export function getSellerStatus(query) {
    return request({
        url: '/us/seller/status',
        method: 'get',
        params: query
    })
}

// <商家用户>修改商家用户的状态，需要权限'seller_status_edit'
export function aditSellerStatus(obj) {
    return request({
        url: '/us/seller/status',
        method: 'post',
        data: obj
    })
}

// <商家用户>修改商家用户信息，需要权限'seller_edit'
export function aditSeller(obj) {
    return request({
        url: '/us/seller/update',
        method: 'post',
        data: obj
    })
}
// <商家用户>根据商家用户ID查询用户基本信息
export function getSellerById(sellerId) {
    return request({
        url: `/us/seller/${sellerId}`,
        method: 'get'
    })
}