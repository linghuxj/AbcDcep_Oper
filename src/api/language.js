import request from '@/router/axios';

export function getLanguageKeys() {
    return request({
        url: '/sys/dict/type/language',
        method: 'get'
    })
}