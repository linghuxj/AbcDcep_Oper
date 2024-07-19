import request from '@/router/axios'

// <conf_43:查询店铺米粒提现设置>查询店铺米粒提现设置
export function getConfStore(params) {
  return request({
    url: '/ope/conf/store/integral/withdraw',
    method: 'get',
    params
  })
}
// <conf_13:修改店铺米粒提现设置>修改店铺米粒提现设置，需要权限'store_integral_withdraw_conf'
export function updateConf(data) {
  return request({
    url: '/ope/conf/update/store/integral/withdraw',
    method: 'post',
    data
  })
}
