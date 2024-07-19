import request from '@/router/axios'

// <sop_goods_31:查询商品信息根据productId>根据产品ID获取所有规格商品信息
export function getGoodsListById(productId) {
  return request({
    url: `/pds/goods/list/${productId}`,
    method: 'get'
  })
}

// <sop_goods_33:根据productId获取sku列表详细信息>根据productId获取sku列表详细信息
export function getGoodsSKUListById(productId) {
  return request({
    url: `/ope/goods/detail/list/${productId}`,
    method: 'get'
  })
}
