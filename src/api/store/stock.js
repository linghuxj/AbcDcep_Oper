import request from '@/router/axios'
// sop_store_product_32: 库存明细列表>>分页查询店铺商品的库存明细信息列表
export function getStockPage(query) {
  return request({
    url: '/ope/store/product/stock/page',
    method: 'get',
    params: query
  })
}
// sop_store_product_33: 库存详情>>分页查询店铺商品的库存详情信息列表
export function getStockDetailList(query) {
  return request({
    url: '/ope/store/product/stock/detail',
    method: 'get',
    params: query
  })
}
