import request from '@/router/axios';

export function fetchList(query) {
    return request({
        url: '',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '',
        method: 'post',
        data: obj
    })
}

export function postObj(obj) {
    return request({
        url: '',
        method: 'post',
        data: obj
    })
}

export function delById(id) {
    return request({
        url: '',
        method: 'delete',
    })
}