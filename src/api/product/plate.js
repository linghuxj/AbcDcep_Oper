import request from '@/router/axios'

// <plate_40:关联的产品列表[不同板块]>分页查询查询关联产品列表，分不同板块类型(为您推荐-sys_recommend, 必买清单-must_buy_list, 网红推荐-net_recommend，新人专享-new_person)
export function reqPlateProductPage(query) {
  return request({
    url: '/ope/plate/product/page',
    method: 'get',
    params: query
  })
}

// <plate_10: 关联商品>不同板块-关联店铺商品信息，需要权限'plate_product_add'
export function relationPlateProduct(data) {
  return request({
    url: `/ope/plate/product`,
    method: 'POST',
    data: data
  })
}

// <plate_11:取消关联商品>取消关联商品信息，需要权限'plate_product_cancel'
export function cancelPlateProductRelation(id) {
  return request({
    url: `/ope/plate/product/${id}`,
    method: 'DELETE'
  })
}

// <plate_41:选择未关联的店铺商品列表>点击关联商品操作，查找所有未关联的（上架且未关联）店铺商品列表
export function selectPlateProductRelation(query) {
  return request({
    url: `/ope/plate/product/relation/select`,
    method: 'get',
    params: query
  })
}
