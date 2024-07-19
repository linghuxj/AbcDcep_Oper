import request from '@/router/axios'

//<area_40:列表>
export function tenants() {
  return request({
    url: '/ope/tenant/list',
    method: 'get',
  })
}
