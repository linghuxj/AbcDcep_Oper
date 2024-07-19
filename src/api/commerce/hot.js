import request from '@/router/axios'

// <sop_district_hot_33:网红打卡地>分页查询商圈指南列表
export function getHotStorePage(obj) {
  return request({
    url: '/ope/business/district/hot/store/page',
    method: 'get',
    params: obj
  })
}

// <sop_district_hot_10: 关联热门商圈/门店>不同类型的热门设置，进行关联商圈/门店操作，需要权限'store_product_add'
export function postHotRelation(data) {
  return request({
    url: '/ope/business/district/hot/relation',
    method: 'post',
    data: data
  })
}

// [ms-user] <sop_store_59:网红打卡地未关联店铺列表>分页查询网红打卡地未关联店铺
export function getHotNoRelationPage(params) {
  console.log('query===>', params)
  return request({
    url: `/ope/business/district/hot/no/relation/store/page`,
    method: 'get',
    params
  })
}