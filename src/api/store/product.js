import request from '@/router/axios'

// <sop_store_product_12: 修改库存-获取产品库存列表>根据产品ID获取产品的所有规格商品的库存列表
export function getProductStockById(productId) {
  return request({
    url: `/ope/store/product/stock/${productId}`,
    method: 'get'
  })
}

// <sop_store_product_13: 修改库存>修改产品库存，需要权限'store_product_stock_edit'
export function editProductStock(data) {
  return request({
    url: `/ope/store/product/stock/update`,
    method: 'post',
    data: data
  })
}

// <sop_store_product_13: 修改库存>修改产品库存，需要权限'store_product_stock_edit'
export function editProductStockStatus(data) {
  return request({
    url: `/ope/store/product/update/status`,
    method: 'post',
    data: data
  })
}

// <oop_order_42: 店铺收款流水>分页查询店铺订单收款流水
export function reqFlowPage(query) {
  return request({
    url: `/ope/store/store/flow/page`,
    method: 'get',
    params: query
  })
}

// <sop_store_product_41: 根据storeId获取产品列表>根据storeId获取产品列表
export function reqProductById(storeId) {
  return request({
    url: `/ope/store/product/online/${storeId}`,
    method: 'get'
  })
}

// store_450:店铺的巡检记录>分页查询店铺店铺的巡检记录
export function reqInspectionPage(query) {
  return request({
    url: `/ope/store/inspection/page`,
    method: 'get',
    params: query
  })
}
