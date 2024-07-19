import request from '@/router/axios'

export function getOssKey() {
    return request({
        url: '/sys/oss/token',
        method: 'get'
    })
}

export function upload(query) {
    return request({
        url: '/oss/upload',
        params: query
    })
}